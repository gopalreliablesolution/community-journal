import { Router } from "express";
import prisma from "../lib/prisma.js";
import { validate, categorySchema } from "../lib/validation.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { slugify, paginateQuery, formatPagination } from "../lib/utils.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        _count: { select: { posts: true } },
      },
    });

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      select: { id: true, name: true, slug: true, icon: true, _count: { select: { posts: true } } },
    });

    if (!category) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Category not found" } });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/:slug/posts", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const category = await prisma.category.findUnique({ where: { slug: req.params.slug }, select: { id: true } });
    if (!category) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Category not found" } });
    }

    const where = { categories: { some: { categoryId: category.id } }, status: "PUBLISHED" };

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
    console.error("Get category posts error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const validation = validate(categorySchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", details: validation.errors },
      });
    }

    const { name, slug, icon } = validation.data;
    const categorySlug = slug || slugify(name);

    const existing = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug: categorySlug }] },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: "CATEGORY_EXISTS", message: "Category already exists" },
      });
    }

    const category = await prisma.category.create({
      data: { name, slug: categorySlug, icon },
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.patch("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const category = await prisma.category.findUnique({ where: { id: req.params.id } });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Category not found" },
      });
    }

    const validation = validate(categorySchema.partial(), req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", details: validation.errors },
      });
    }

    const { name, slug, icon } = validation.data;

    const updatedCategory = await prisma.category.update({
      where: { id: category.id },
      data: {
        ...(name && { name }),
        ...(slug && { slug: slugify(slug) }),
        ...(icon !== undefined && { icon }),
      },
    });

    res.json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const category = await prisma.category.findUnique({ where: { id: req.params.id } });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Category not found" },
      });
    }

    await prisma.category.delete({ where: { id: category.id } });

    res.json({ success: true, data: { message: "Category deleted successfully" } });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

export default router;
