import { Router } from "express";
import prisma from "../lib/prisma.js";
import { validate, profileSchema } from "../lib/validation.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { paginateQuery, formatPagination } from "../lib/utils.js";
import { comparePassword } from "../lib/auth.js";

const router = Router();

router.get("/users/:username", optionalAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.params.username },
      select: {
        id: true, name: true, username: true, bio: true, createdAt: true,
        avatar: { select: { path: true } },
        _count: { select: { posts: true, followers: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "User not found" } });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/users/:username/posts", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "publishedAt", order = "desc" } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const user = await prisma.user.findUnique({ where: { username: req.params.username }, select: { id: true } });
    if (!user) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "User not found" } });
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: user.id, status: "PUBLISHED" },
        skip, take, orderBy: { [sort]: order },
        select: {
          id: true, title: true, slug: true, excerpt: true,
          coverImage: { select: { path: true } },
          readingTime: true, publishedAt: true,
          categories: { select: { category: { select: { id: true, name: true, slug: true } } } },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      prisma.post.count({ where: { authorId: user.id, status: "PUBLISHED" } }),
    ]);

    res.json({ success: true, data: posts, pagination: formatPagination(total, Number(page), Number(limit)) });
  } catch (error) {
    console.error("Get user posts error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/users/:username/followers", async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = "createdAt", order = "desc" } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const user = await prisma.user.findUnique({ where: { username: req.params.username }, select: { id: true } });
    if (!user) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "User not found" } });
    }

    const followers = await prisma.follow.findMany({
      where: { followingId: user.id },
      skip, take, orderBy: { [sort]: order },
      select: {
        follower: {
          select: { id: true, name: true, username: true, bio: true, createdAt: true, avatar: { select: { path: true } }, _count: { select: { posts: true } } },
        },
      },
    });

    const total = await prisma.follow.count({ where: { followingId: user.id } });

    res.json({ success: true, data: followers.map((f) => f.follower), pagination: formatPagination(total, Number(page), Number(limit)) });
  } catch (error) {
    console.error("Get followers error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/users/:username/following", async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = "createdAt", order = "desc" } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const user = await prisma.user.findUnique({ where: { username: req.params.username }, select: { id: true } });
    if (!user) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "User not found" } });
    }

    const following = await prisma.follow.findMany({
      where: { followerId: user.id },
      skip, take, orderBy: { [sort]: order },
      select: {
        following: {
          select: { id: true, name: true, username: true, bio: true, createdAt: true, avatar: { select: { path: true } }, _count: { select: { posts: true } } },
        },
      },
    });

    const total = await prisma.follow.count({ where: { followerId: user.id } });

    res.json({ success: true, data: following.map((f) => f.following), pagination: formatPagination(total, Number(page), Number(limit)) });
  } catch (error) {
    console.error("Get following error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.post("/users/:id/follow", authenticate, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, error: { code: "SELF_FOLLOW", message: "Cannot follow yourself" } });
    }

    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "User not found" } });
    }

    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: req.user.id, followingId: req.params.id } },
    });

    if (existing) {
      return res.status(409).json({ success: false, error: { code: "ALREADY_FOLLOWING", message: "Already following" } });
    }

    await prisma.follow.create({ data: { followerId: req.user.id, followingId: req.params.id } });
    const followersCount = await prisma.follow.count({ where: { followingId: req.params.id } });

    await prisma.notification.create({
      data: {
        userId: req.params.id,
        actorId: req.user.id,
        type: "FOLLOW",
      },
    }).catch(err => console.error("Follow notification error:", err));

    res.status(201).json({ success: true, data: { message: "Following", followersCount } });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.delete("/users/:id/follow", authenticate, async (req, res) => {
  try {
    const existing = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: req.user.id, followingId: req.params.id } },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Follow not found" } });
    }

    await prisma.follow.delete({ where: { followerId_followingId: { followerId: req.user.id, followingId: req.params.id } } });
    const followersCount = await prisma.follow.count({ where: { followingId: req.params.id } });

    res.json({ success: true, data: { message: "Unfollowed", followersCount } });
  } catch (error) {
    console.error("Unfollow error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, name: true, username: true, email: true, bio: true, role: true, createdAt: true,
        avatar: { select: { id: true, path: true } },
        _count: { select: { posts: true, bookmarks: true, followers: true } },
      },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.patch("/me/profile", authenticate, async (req, res) => {
  try {
    const validation = validate(profileSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", details: validation.errors } });
    }

    const { name, bio, avatarId } = validation.data;
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { ...(name !== undefined && { name }), ...(bio !== undefined && { bio }), ...(avatarId !== undefined && { avatarId }) },
      select: { id: true, name: true, username: true, email: true, bio: true, role: true, avatar: { select: { id: true, path: true } } },
    });

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.patch("/me/password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Current and new password required" } });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: { code: "INVALID_PASSWORD", message: "Current password is incorrect" } });
    }

    const { hashPassword } = await import("../lib/auth.js");
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashedPassword } });

    res.json({ success: true, data: { message: "Password updated successfully" } });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.patch("/me/preferences", authenticate, async (req, res) => {
  try {
    const { emailNotifications, theme, language } = req.body;

    const preference = await prisma.userPreference.upsert({
      where: { userId: req.user.id },
      update: {
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(theme && { theme }),
        ...(language && { language }),
      },
      create: {
        userId: req.user.id,
        emailNotifications: emailNotifications ?? true,
        theme: theme || "light",
        language: language || "en",
      },
    });

    res.json({ success: true, data: preference });
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/me/preferences", authenticate, async (req, res) => {
  try {
    let preference = await prisma.userPreference.findUnique({ where: { userId: req.user.id } });

    if (!preference) {
      preference = await prisma.userPreference.create({
        data: { userId: req.user.id, emailNotifications: true, theme: "light", language: "en" },
      });
    }

    res.json({ success: true, data: preference });
  } catch (error) {
    console.error("Get preferences error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/me/dashboard", authenticate, async (req, res) => {
  try {
    const [recentPosts, drafts, published, totalViews, totalLikes, unreadNotifications, recentBookmarks] = await Promise.all([
      prisma.post.findMany({ where: { authorId: req.user.id, status: "PUBLISHED" }, take: 5, orderBy: { publishedAt: "desc" }, select: { id: true, title: true, slug: true, status: true, publishedAt: true, _count: { select: { likes: true, comments: true } } } }),
      prisma.post.count({ where: { authorId: req.user.id, status: "DRAFT" } }),
      prisma.post.count({ where: { authorId: req.user.id, status: "PUBLISHED" } }),
      prisma.view.count({ where: { post: { authorId: req.user.id } } }),
      prisma.like.count({ where: { post: { authorId: req.user.id } } }),
      prisma.notification.count({ where: { userId: req.user.id, read: false } }),
      prisma.bookmark.findMany({ where: { userId: req.user.id }, take: 5, select: { id: true, post: { select: { id: true, title: true, slug: true } } } }),
    ]);

    res.json({ success: true, data: { recentPosts, drafts, published, totalViews, totalLikes, unreadNotifications, recentBookmarks } });
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/me/history", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "readAt", order = "desc" } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const [history, total] = await Promise.all([
      prisma.readingHistory.findMany({
        where: { userId: req.user.id },
        skip, take, orderBy: { [sort]: order },
        select: {
          id: true, readAt: true,
          post: { select: { id: true, title: true, slug: true, excerpt: true, coverImage: { select: { path: true } }, readingTime: true, publishedAt: true, author: { select: { id: true, name: true, username: true } }, _count: { select: { likes: true, comments: true } } } },
        },
      }),
      prisma.readingHistory.count({ where: { userId: req.user.id } }),
    ]);

    res.json({ success: true, data: history, pagination: formatPagination(total, Number(page), Number(limit)) });
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.delete("/me/history", authenticate, async (req, res) => {
  try {
    await prisma.readingHistory.deleteMany({ where: { userId: req.user.id } });
    res.json({ success: true, data: { message: "Reading history cleared" } });
  } catch (error) {
    console.error("Clear history error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.delete("/me/history/:id", authenticate, async (req, res) => {
  try {
    const history = await prisma.readingHistory.findUnique({ where: { id: req.params.id } });
    if (!history || history.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "History entry not found" } });
    }

    await prisma.readingHistory.delete({ where: { id: history.id } });
    res.json({ success: true, data: { message: "History entry deleted" } });
  } catch (error) {
    console.error("Delete history error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.delete("/me", authenticate, async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Password required to delete account" } });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: { code: "INVALID_PASSWORD", message: "Password is incorrect" } });
    }

    await prisma.user.delete({ where: { id: req.user.id } });
    res.json({ success: true, data: { message: "Account deleted successfully" } });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/me/stats", authenticate, async (req, res) => {
  try {
    const [drafts, published, totalLikes, totalViews] = await Promise.all([
      prisma.post.count({ where: { authorId: req.user.id, status: "DRAFT" } }),
      prisma.post.count({ where: { authorId: req.user.id, status: "PUBLISHED" } }),
      prisma.like.count({ where: { post: { authorId: req.user.id } } }),
      prisma.view.count({ where: { post: { authorId: req.user.id } } }),
    ]);

    res.json({ success: true, data: { drafts, published, totalLikes, totalViews } });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/me/posts", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, sort = "updatedAt", order = "desc" } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const where = { authorId: req.user.id };
    if (status && status !== "all") where.status = status;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({ where, skip, take, orderBy: { [sort]: order }, select: { id: true, title: true, slug: true, excerpt: true, status: true, publishedAt: true, updatedAt: true, categories: { select: { category: true } }, _count: { select: { likes: true, comments: true } } } }),
      prisma.post.count({ where }),
    ]);

    res.json({ success: true, data: posts, pagination: formatPagination(total, Number(page), Number(limit)) });
  } catch (error) {
    console.error("Get my posts error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/me/drafts", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "updatedAt", order = "desc" } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const [drafts, total] = await Promise.all([
      prisma.post.findMany({ where: { authorId: req.user.id, status: "DRAFT" }, skip, take, orderBy: { [sort]: order }, select: { id: true, title: true, slug: true, excerpt: true, updatedAt: true, categories: { select: { category: true } } } }),
      prisma.post.count({ where: { authorId: req.user.id, status: "DRAFT" } }),
    ]);

    res.json({ success: true, data: drafts, pagination: formatPagination(total, Number(page), Number(limit)) });
  } catch (error) {
    console.error("Get drafts error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/me/bookmarks", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "createdAt", order = "desc" } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({ where: { userId: req.user.id }, skip, take, include: { post: { select: { id: true, title: true, slug: true, excerpt: true, coverImage: { select: { path: true } }, readingTime: true, publishedAt: true, author: { select: { id: true, name: true, username: true } }, _count: { select: { likes: true, comments: true } } } } } }),
      prisma.bookmark.count({ where: { userId: req.user.id } }),
    ]);

    res.json({ success: true, data: bookmarks, pagination: formatPagination(total, Number(page), Number(limit)) });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/me/notifications", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const where = { userId: req.user.id };
    if (unread === "true") where.read = false;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where, skip, take, orderBy: { createdAt: "desc" },
        include: {
          actor: { select: { id: true, name: true, username: true, avatar: { select: { path: true } } } },
          post: { select: { id: true, slug: true, title: true } },
        },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId: req.user.id, read: false } }),
    ]);

    const formattedNotifications = notifications.map((n) => {
      let message = "";
      if (n.type === "LIKE") {
        message = `${n.actor.name} liked your article "${n.post?.title || 'Untitled'}"`;
      } else if (n.type === "COMMENT") {
        message = `${n.actor.name} commented on your article "${n.post?.title || 'Untitled'}"`;
      } else if (n.type === "BOOKMARK") {
        message = `${n.actor.name} bookmarked your article "${n.post?.title || 'Untitled'}"`;
      } else if (n.type === "FOLLOW") {
        message = `${n.actor.name} started following your author profile`;
      } else {
        message = `${n.actor.name} sent an update`;
      }
      return { ...n, message };
    });

    res.json({ success: true, data: formattedNotifications, pagination: formatPagination(total, Number(page), Number(limit)), unreadCount });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.patch("/me/notifications/:id/read", authenticate, async (req, res) => {
  try {
    const notification = await prisma.notification.findUnique({ where: { id: req.params.id } });
    if (!notification || notification.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Notification not found" } });
    }

    await prisma.notification.update({ where: { id: notification.id }, data: { read: true } });
    res.json({ success: true, data: { message: "Marked as read" } });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.patch("/me/notifications/read-all", authenticate, async (req, res) => {
  try {
    const result = await prisma.notification.updateMany({ where: { userId: req.user.id, read: false }, data: { read: true } });
    res.json({ success: true, data: { message: "All notifications marked as read", count: result.count } });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.delete("/me/notifications/:id", authenticate, async (req, res) => {
  try {
    const notification = await prisma.notification.findUnique({ where: { id: req.params.id } });
    if (!notification || notification.userId !== req.user.id) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Notification not found" } });
    }

    await prisma.notification.delete({ where: { id: notification.id } });
    res.json({ success: true, data: { message: "Notification deleted" } });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.delete("/me/notifications", authenticate, async (req, res) => {
  try {
    await prisma.notification.deleteMany({ where: { userId: req.user.id } });
    res.json({ success: true, data: { message: "All notifications deleted" } });
  } catch (error) {
    console.error("Delete all notifications error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

export default router;
