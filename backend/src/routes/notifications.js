import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { paginateQuery, formatPagination } from "../lib/utils.js";

const router = Router();

// GET /notifications - list user's notifications
router.get("/notifications", authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: req.user.id },
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          actor: {
            select: { id: true, name: true, username: true, avatar: { select: { path: true } } },
          },
          post: {
            select: { id: true, title: true, slug: true },
          },
        },
      }),
      prisma.notification.count({ where: { userId: req.user.id } }),
    ]);

    res.json({
      success: true,
      data: notifications,
      pagination: formatPagination(total, Number(page), Number(limit)),
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

// GET /notifications/unread-count
router.get("/notifications/unread-count", authenticate, async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: { userId: req.user.id, read: false },
    });
    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error("Unread count error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

// PATCH /notifications/:id/read - mark single as read
router.patch("/notifications/:id/read", authenticate, async (req, res) => {
  try {
    const notification = await prisma.notification.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!notification) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Notification not found" } });
    }

    const updated = await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

// PATCH /notifications/read-all - mark all as read
router.patch("/notifications/read-all", authenticate, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, read: false },
      data: { read: true },
    });
    res.json({ success: true, data: null });
  } catch (error) {
    console.error("Mark all read error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

// DELETE /notifications/:id - delete a notification
router.delete("/notifications/:id", authenticate, async (req, res) => {
  try {
    const notification = await prisma.notification.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!notification) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Notification not found" } });
    }

    await prisma.notification.delete({ where: { id: req.params.id } });
    res.json({ success: true, data: null });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

export default router;
