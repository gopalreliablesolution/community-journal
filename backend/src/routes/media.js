import { Router } from "express";
import multer from "multer";
import prisma from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";
import { validateFile, saveFile, deleteFile } from "../lib/storage.js";
import { paginateQuery, formatPagination } from "../lib/utils.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/", authenticate, async (req, res) => {
  try {
    const { q, type, page = 1, limit = 20 } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const where = { userId: req.user.id };
    if (q) where.OR = [{ originalName: { contains: q, mode: "insensitive" } }, { filename: { contains: q, mode: "insensitive" } }];
    if (type) where.type = type;

    const [media, total] = await Promise.all([
      prisma.media.findMany({ where, skip, take, orderBy: { createdAt: "desc" } }),
      prisma.media.count({ where }),
    ]);

    res.json({ success: true, data: media, pagination: formatPagination(total, Number(page), Number(limit)) });
  } catch (error) {
    console.error("Search media error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.post("/", authenticate, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: "NO_FILE", message: "No file uploaded" },
      });
    }

    const validation = validateFile(req.file);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_FILE", message: validation.error },
      });
    }

    const category = req.body.category || "uploads";
    const allowedCategories = ["avatars", "covers", "uploads"];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_CATEGORY", message: "Invalid upload category" },
      });
    }

    const fileData = await saveFile(req.file, category);

    const media = await prisma.media.create({
      data: {
        userId: req.user.id,
        filename: fileData.filename,
        originalName: req.file.originalname,
        path: fileData.path,
        type: fileData.type,
        size: fileData.size,
        mime: fileData.mime,
      },
    });

    res.status(201).json({ success: true, data: media });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const media = await prisma.media.findUnique({ where: { id: req.params.id } });

    if (!media) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Media not found" },
      });
    }

    if (media.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "You can only delete your own media" },
      });
    }

    const postUsingCover = await prisma.post.findFirst({ where: { coverImageId: media.id } });
    const userUsingAvatar = await prisma.user.findFirst({ where: { avatarId: media.id } });

    if (postUsingCover || userUsingAvatar) {
      return res.status(400).json({
        success: false,
        error: { code: "IN_USE", message: "Media is currently in use" },
      });
    }

    await deleteFile(media.path);
    await prisma.media.delete({ where: { id: media.id } });

    res.json({ success: true, data: { message: "Media deleted successfully" } });
  } catch (error) {
    console.error("Delete media error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

export default router;
