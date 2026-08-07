import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/posts/:postId/like/status", optionalAuth, async (req, res) => {
  try {
    let liked = false;

    if (req.user) {
      const existingLike = await prisma.like.findUnique({
        where: { postId_userId: { postId: req.params.postId, userId: req.user.id } },
      });
      liked = !!existingLike;
    }

    res.json({ success: true, data: { liked } });
  } catch (error) {
    console.error("Get like status error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.post("/posts/:postId/like", authenticate, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.postId } });

    if (!post || post.status !== "PUBLISHED") {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Post not found" } });
    }

    const existingLike = await prisma.like.findUnique({
      where: { postId_userId: { postId: req.params.postId, userId: req.user.id } },
    });

    if (existingLike) {
      return res.status(409).json({ success: false, error: { code: "ALREADY_LIKED", message: "You already liked this post" } });
    }

    const like = await prisma.like.create({ data: { postId: req.params.postId, userId: req.user.id } });
    const likeCount = await prisma.like.count({ where: { postId: req.params.postId } });

    if (post.authorId !== req.user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          actorId: req.user.id,
          type: "LIKE",
          postId: post.id,
        },
      }).catch(err => console.error("Notification creation error:", err));
    }

    res.status(201).json({ success: true, data: { like, likeCount } });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.delete("/posts/:postId/like", authenticate, async (req, res) => {
  try {
    const existingLike = await prisma.like.findUnique({
      where: { postId_userId: { postId: req.params.postId, userId: req.user.id } },
    });

    if (!existingLike) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Like not found" } });
    }

    await prisma.like.delete({ where: { postId_userId: { postId: req.params.postId, userId: req.user.id } } });
    const likeCount = await prisma.like.count({ where: { postId: req.params.postId } });

    res.json({ success: true, data: { likeCount } });
  } catch (error) {
    console.error("Unlike error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

export default router;
