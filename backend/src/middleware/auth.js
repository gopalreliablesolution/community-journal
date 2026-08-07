import prisma from "../lib/prisma.js";
import { verifyToken, getTokenFromRequest } from "../lib/auth.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: { code: "INVALID_TOKEN", message: "Invalid or expired token" },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true, role: true, status: true, name: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: "USER_NOT_FOUND", message: "User not found" },
      });
    }

    if (user.status === "BANNED") {
      return res.status(403).json({
        success: false,
        error: { code: "BANNED", message: "Account has been banned" },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: "AUTH_ERROR", message: "Authentication error" },
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, email: true, username: true, role: true, status: true, name: true },
        });
        if (user && user.status !== "BANNED") {
          req.user = user;
        }
      }
    }

    next();
  } catch {
    next();
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      error: { code: "FORBIDDEN", message: "Admin access required" },
    });
  }
  next();
};

export const checkOwnership = (model, paramField = "id", ownerField = "authorId") => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramField];
      const resource = await prisma[model].findUnique({ where: { id: resourceId } });

      if (!resource) {
        return res.status(404).json({
          success: false,
          error: { code: "NOT_FOUND", message: `${model} not found` },
        });
      }

      const isOwner = resource[ownerField] === req.user.id;
      const isAdmin = req.user.role === "ADMIN";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "You don't have permission" },
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: { code: "SERVER_ERROR", message: "Internal server error" },
      });
    }
  };
};
