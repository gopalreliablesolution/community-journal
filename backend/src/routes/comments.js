import { Router } from "express";
import prisma from "../lib/prisma.js";
import { validate, commentSchema } from "../lib/validation.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/posts/:postId/comments", optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { postId: req.params.postId, parentId: null },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, username: true, avatar: { select: { path: true } } } },
          replies: {
            take: 3,
            orderBy: { createdAt: "asc" },
            include: {
              user: { select: { id: true, name: true, username: true, avatar: { select: { path: true } } } },
            },
          },
          _count: { select: { replies: true } },
        },
      }),
      prisma.comment.count({ where: { postId: req.params.postId, parentId: null } }),
    ]);

    res.json({
      success: true,
      data: comments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.get("/posts/:postId/comments/:commentId/replies", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [replies, total] = await Promise.all([
      prisma.comment.findMany({
        where: { parentId: req.params.commentId },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: { id: true, name: true, username: true, avatar: { select: { path: true } } } },
        },
      }),
      prisma.comment.count({ where: { parentId: req.params.commentId } }),
    ]);

    res.json({
      success: true,
      data: replies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get replies error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.post("/posts/:postId/comments", authenticate, async (req, res) => {
  try {
    const validation = validate(commentSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", details: validation.errors },
      });
    }

    const post = await prisma.post.findUnique({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Post not found" },
      });
    }

    if (post.status !== "PUBLISHED") {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Post not found" },
      });
    }

    if (validation.data.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: validation.data.parentId },
      });
      if (!parentComment || parentComment.postId !== req.params.postId) {
        return res.status(400).json({
          success: false,
          error: { code: "INVALID_PARENT", message: "Parent comment not found" },
        });
      }
    }

    const comment = await prisma.comment.create({
      data: {
        postId: req.params.postId,
        userId: req.user.id,
        content: validation.data.content,
        parentId: validation.data.parentId,
      },
      include: {
        user: { select: { id: true, name: true, username: true, avatar: { select: { path: true } } } },
      },
    });

    if (post.authorId !== req.user.id) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          actorId: req.user.id,
          type: "COMMENT",
          postId: post.id,
        },
      }).catch(err => console.error("Notification creation error:", err));
    }

    if (validation.data.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: validation.data.parentId },
        select: { userId: true },
      });
      if (parentComment && parentComment.userId !== req.user.id) {
        await prisma.notification.create({
          data: {
            userId: parentComment.userId,
            actorId: req.user.id,
            type: "COMMENT",
            postId: post.id,
          },
        }).catch(err => console.error("Reply notification error:", err));
      }
    }

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.patch("/comments/:id", authenticate, async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id } });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Comment not found" },
      });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "You can only edit your own comments" },
      });
    }

    const validation = validate(commentSchema.partial(), req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", details: validation.errors },
      });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: comment.id },
      data: { content: validation.data.content },
      include: {
        user: { select: { id: true, name: true, username: true, avatar: { select: { path: true } } } },
      },
    });

    res.json({ success: true, data: updatedComment });
  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.delete("/comments/:id", authenticate, async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id } });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Comment not found" },
      });
    }

    if (comment.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "You can only delete your own comments" },
      });
    }

    await prisma.comment.delete({ where: { id: comment.id } });

    res.json({ success: true, data: { message: "Comment deleted successfully" } });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

export default router;
