import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import path from "path";

import authRoutes from "./routes/auth.js";
import authOAuthRoutes from "./routes/auth.oauth.js";
import postRoutes from "./routes/posts.js";
import categoryRoutes from "./routes/categories.js";
import tagRoutes from "./routes/tags.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import bookmarkRoutes from "./routes/bookmarks.js";
import mediaRoutes from "./routes/media.js";
import searchRoutes from "./routes/search.js";
import profileRoutes from "./routes/profile.js";
import adminRoutes from "./routes/admin.js";
import newsletterRoutes from "./routes/newsletter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://gopal.site.je",
  "http://gopal.site.je",
  "http://localhost:3000",
  "http://localhost:5173",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith("gopal.site.je") || process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, error: { code: "RATE_LIMIT", message: "Too many requests" } },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: { code: "RATE_LIMIT", message: "Too many authentication attempts" } },
});

app.use("/api/", limiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.use("/storage", express.static(path.join(__dirname, "../storage")));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/auth", authOAuthRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1", commentRoutes);
app.use("/api/v1", likeRoutes);
app.use("/api/v1", bookmarkRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1", profileRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/newsletter", newsletterRoutes);

app.get("/api/v1/health", (req, res) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString(), uptime: process.uptime() } });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: { code: "SERVER_ERROR", message: "Internal server error" },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
