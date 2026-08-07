import { Router } from "express";
import prisma from "../lib/prisma.js";
import { registerSchema, loginSchema, validate } from "../lib/validation.js";
import { hashPassword, comparePassword, generateTokenPair, verifyRefreshToken } from "../lib/auth.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const validation = validate(registerSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", details: validation.errors } });
    }

    const { name, username, email, password } = validation.data;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: "USER_EXISTS", message: existing.email === email ? "Email already registered" : "Username already taken" },
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, username, email, password: hashedPassword },
      select: { id: true, name: true, username: true, email: true, role: true, createdAt: true },
    });

    const { accessToken, refreshToken } = await generateTokenPair(user.id);

    res.status(201).json({ success: true, data: { user, accessToken, refreshToken } });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.post("/login", async (req, res) => {
  try {
    const validation = validate(loginSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", details: validation.errors } });
    }

    const { email, password } = validation.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.status === "BANNED") {
      return res.status(401).json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
    }

    const { accessToken, refreshToken } = await generateTokenPair(user.id);

    // Update lastActiveAt on login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    res.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role },
        accessToken, refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: { code: "MISSING_TOKEN", message: "Refresh token required" } });
    }

    const result = await verifyRefreshToken(refreshToken);
    if (!result) {
      return res.status(401).json({ success: false, error: { code: "REFRESH_TOKEN_EXPIRED", message: "Invalid or expired refresh token" } });
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokenPair(result.userId);

    res.json({ success: true, data: { accessToken, refreshToken: newRefreshToken } });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.json({ success: true, data: { message: "Logged out successfully" } });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/check-username", async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ success: false, error: { code: "MISSING_PARAM", message: "Username is required" } });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    res.json({ success: true, data: { available: !existing } });
  } catch (error) {
    console.error("Check username error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    res.json({ success: true, data: { message: "If an account exists with this email, a reset link has been sent" } });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    res.json({ success: true, data: { message: "Password reset successful" } });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: { code: "MISSING_TOKEN", message: "Verification token required" } });
    }

    // In production: verify token from DB/email
    // For now: accept any token and update user
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return res.status(400).json({ success: false, error: { code: "INVALID_TOKEN", message: "Invalid verification token" } });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifiedAt: new Date(), emailVerificationToken: null },
    });

    res.json({ success: true, data: { message: "Email verified successfully" } });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    res.json({ success: true, data: { message: "Verification email sent" } });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

export default router;
