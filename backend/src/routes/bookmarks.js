import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { paginateQuery, formatPagination } from "../lib/utils.js";

const router = Router();

router.get("/posts/:postId/bookmark/status", optionalAuth, async (req, res) => {
  try {
    let bookmarked = false;

    if (req.user) {
      const existingBookmark = await prisma.bookmark.findUnique({
        where: { userId_postId: { userId: req.user.id, postId: req.params.postId } },
      });
      bookmarked = !!existingBookmark;
    }

    res.json({ success: true, data: { bookmarked } });
  } catch (error) {
    console.error("Get bookmark status error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.post("/posts/:postId/bookmark", authenticate, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.postId } });

    if (!post || post.status !== "PUBLISHED") {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Post not found" } });
    }

    const existingBookmark = await prisma.bookmark.findUnique({
      where: { userId_postId: { userId: req.user.id, postId: req.params.postId } },
    });

    if (existingBookmark) {
      return res.status(409).json({ success: false, error: { code: "ALREADY_BOOKMARKED", message: "Post already bookmarked" } });
    }

    const bookmark = await prisma.bookmark.create({ data: { userId: req.user.id, postId: req.params.postId } });

    if (post.authorId !== req.user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          actorId: req.user.id,
          type: "BOOKMARK",
          postId: post.id,
        },
      }).catch(err => console.error("Bookmark notification error:", err));
    }

    res.status(201).json({ success: true, data: bookmark });
  } catch (error) {
    console.error("Bookmark error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.delete("/posts/:postId/bookmark", authenticate, async (req, res) => {
  try {
    const existingBookmark = await prisma.bookmark.findUnique({
      where: { userId_postId: { userId: req.user.id, postId: req.params.postId } },
    });

    if (!existingBookmark) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Bookmark not found" } });
    }

    await prisma.bookmark.delete({ where: { userId_postId: { userId: req.user.id, postId: req.params.postId } } });
    res.json({ success: true, data: { message: "Bookmark removed" } });
  } catch (error) {
    console.error("Remove bookmark error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

// DEPRECATED: Use GET /me/bookmarks instead
router.get("/bookmarks", authenticate, async (req, res) => {
  res.set("X-Deprecated", "true");
  res.set("X-Deprecated-Alternative", "GET /me/bookmarks");
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId: req.user.id },
        skip,
        take,
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              coverImage: { select: { path: true } },
              readingTime: true,
              publishedAt: true,
              author: { select: { id: true, name: true, username: true } },
              _count: { select: { likes: true, comments: true } },
            },
          },
        },
      }),
      prisma.bookmark.count({ where: { userId: req.user.id } }),
    ]);

    res.json({ success: true, data: bookmarks, pagination: formatPagination(total, Number(page), Number(limit)) });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

export default router;
