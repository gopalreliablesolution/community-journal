import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { slugify } from "../lib/utils.js";
import { paginateQuery, formatPagination } from "../lib/utils.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 50, sort = "name", order = "asc" } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        skip, take,
        orderBy: { [sort]: order },
        select: { id: true, name: true, slug: true, _count: { select: { posts: true } } },
      }),
      prisma.tag.count(),
    ]);

    res.json({ success: true, data: tags, pagination: formatPagination(total, Number(page), Number(limit)) });
  } catch (error) {
    console.error("Get tags error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const tag = await prisma.tag.findUnique({
      where: { slug: req.params.slug },
      select: { id: true, name: true, slug: true, _count: { select: { posts: true } } },
    });

    if (!tag) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Tag not found" } });
    }

    res.json({ success: true, data: tag });
  } catch (error) {
    console.error("Get tag error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/:slug/posts", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const tag = await prisma.tag.findUnique({ where: { slug: req.params.slug }, select: { id: true } });
    if (!tag) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Tag not found" } });
    }

    const where = { tags: { some: { tagId: tag.id } }, status: "PUBLISHED" };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip, take,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        select: {
          id: true, title: true, slug: true, excerpt: true,
          coverImage: { select: { path: true } },
          readingTime: true, publishedAt: true,
          author: { select: { id: true, name: true, username: true, avatar: { select: { path: true } } } },
          categories: { select: { category: { select: { id: true, name: true, slug: true } } } },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    res.json({ success: true, data: posts, pagination: formatPagination(total, Number(page), Number(limit)) });
  } catch (error) {
    console.error("Get tag posts error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Name is required" } });
    }

    const tagSlug = slug || slugify(name);
    const existing = await prisma.tag.findFirst({ where: { OR: [{ name }, { slug: tagSlug }] } });

    if (existing) {
      return res.status(409).json({ success: false, error: { code: "TAG_EXISTS", message: "Tag already exists" } });
    }

    const tag = await prisma.tag.create({ data: { name, slug: tagSlug } });
    res.status(201).json({ success: true, data: tag });
  } catch (error) {
    console.error("Create tag error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.patch("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const tag = await prisma.tag.findUnique({ where: { id: req.params.id } });
    if (!tag) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Tag not found" } });
    }

    const { name } = req.body;
    const updatedTag = await prisma.tag.update({
      where: { id: tag.id },
      data: { ...(name && { name }) },
    });

    res.json({ success: true, data: updatedTag });
  } catch (error) {
    console.error("Update tag error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const tag = await prisma.tag.findUnique({ where: { id: req.params.id } });
    if (!tag) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Tag not found" } });
    }

    await prisma.tag.delete({ where: { id: tag.id } });
    res.json({ success: true, data: { message: "Tag deleted successfully" } });
  } catch (error) {
    console.error("Delete tag error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

export default router;
