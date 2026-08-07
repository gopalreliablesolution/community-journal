import { Router } from "express";
import prisma from "../lib/prisma.js";
import { generateTokenPair } from "../lib/auth.js";

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ─── Google OAuth ───
router.get("/google", (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return res.status(503).json({ success: false, error: { code: "OAUTH_DISABLED", message: "Google login not configured" } });
  }

  const redirectUri = `${req.protocol}://${req.get("host")}/api/v1/auth/google/callback`;
  const scope = "openid email profile";
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline`;

  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.redirect(`${FRONTEND_URL}/auth/login?error=google_failed`);

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${req.protocol}://${req.get("host")}/api/v1/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return res.redirect(`${FRONTEND_URL}/auth/login?error=google_failed`);

    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userRes.json();
    if (!googleUser.email) return res.redirect(`${FRONTEND_URL}/auth/login?error=google_failed`);

    const result = await findOrCreateOAuthUser({
      provider: "google",
      providerId: googleUser.id,
      email: googleUser.email,
      name: googleUser.name || googleUser.email.split("@")[0],
      avatarUrl: googleUser.picture,
    });

    const { accessToken, refreshToken } = await generateTokenPair(result.user.id);
    res.redirect(`${FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${FRONTEND_URL}/auth/login?error=google_failed`);
  }
});

// ─── Apple OAuth ───
router.get("/apple", (req, res) => {
  const clientId = process.env.APPLE_CLIENT_ID;
  if (!clientId) {
    return res.status(503).json({ success: false, error: { code: "OAUTH_DISABLED", message: "Apple login not configured" } });
  }

  const redirectUri = `${req.protocol}://${req.get("host")}/api/v1/auth/apple/callback`;
  const url = `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code id_token&scope=name email&response_mode=form_post`;

  res.redirect(url);
});

router.post("/apple/callback", async (req, res) => {
  try {
    const { code, id_token, user: userStr } = req.body;
    if (!code && !id_token) return res.redirect(`${FRONTEND_URL}/auth/login?error=apple_failed`);

    let email, name, providerId;

    if (id_token) {
      const payload = JSON.parse(Buffer.from(id_token.split(".")[1], "base64").toString());
      email = payload.email;
      providerId = payload.sub;
    }

    if (!email) return res.redirect(`${FRONTEND_URL}/auth/login?error=apple_failed`);

    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        name = `${userData.name?.firstName || ""} ${userData.name?.lastName || ""}`.trim() || email.split("@")[0];
      } catch { name = email.split("@")[0]; }
    } else {
      name = email.split("@")[0];
    }

    const result = await findOrCreateOAuthUser({
      provider: "apple",
      providerId,
      email,
      name,
      avatarUrl: null,
    });

    const { accessToken, refreshToken } = await generateTokenPair(result.user.id);
    res.redirect(`${FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  } catch (error) {
    console.error("Apple callback error:", error);
    res.redirect(`${FRONTEND_URL}/auth/login?error=apple_failed`);
  }
});

// ─── Facebook OAuth ───
router.get("/facebook", (req, res) => {
  const clientId = process.env.FACEBOOK_APP_ID;
  if (!clientId) {
    return res.status(503).json({ success: false, error: { code: "OAUTH_DISABLED", message: "Facebook login not configured" } });
  }

  const redirectUri = `${req.protocol}://${req.get("host")}/api/v1/auth/facebook/callback`;
  const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email,public_profile`;

  res.redirect(url);
});

router.get("/facebook/callback", async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.redirect(`${FRONTEND_URL}/auth/login?error=facebook_failed`);

    const redirectUri = `${req.protocol}://${req.get("host")}/api/v1/auth/facebook/callback`;

    const tokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`
    );

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) return res.redirect(`${FRONTEND_URL}/auth/login?error=facebook_failed`);

    const userRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${tokenData.access_token}`
    );

    const fbUser = await userRes.json();
    if (!fbUser.email) return res.redirect(`${FRONTEND_URL}/auth/login?error=facebook_failed`);

    const result = await findOrCreateOAuthUser({
      provider: "facebook",
      providerId: fbUser.id,
      email: fbUser.email,
      name: fbUser.name || fbUser.email.split("@")[0],
      avatarUrl: `https://graph.facebook.com/${fbUser.id}/picture?type=large`,
    });

    const { accessToken, refreshToken } = await generateTokenPair(result.user.id);
    res.redirect(`${FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  } catch (error) {
    console.error("Facebook callback error:", error);
    res.redirect(`${FRONTEND_URL}/auth/login?error=facebook_failed`);
  }
});

// ─── Helper: Find or create user from OAuth ───
async function findOrCreateOAuthUser({ provider, providerId, email, name, avatarUrl }) {
  // Check if user exists with this email
  let user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    // Update avatar if provided and user has no avatar
    if (avatarUrl && !user.avatarId) {
      // Could download and save avatar, for now skip
    }
    return { user, isNew: false };
  }

  // Create new user
  const username = email.split("@")[0] + "_" + provider;
  const randomPassword = await import("../lib/auth.js").then(m => m.hashPassword(require("crypto").randomBytes(32).toString("hex")));

  user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      password: randomPassword,
      emailVerifiedAt: new Date(),
    },
  });

  return { user, isNew: true };
}

export default router;
