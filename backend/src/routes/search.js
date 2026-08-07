import { Router } from "express";
import prisma from "../lib/prisma.js";
import { paginateQuery, formatPagination } from "../lib/utils.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: "MISSING_QUERY", message: "Search query is required" },
      });
    }

    const { skip, take } = paginateQuery(Number(page), Number(limit));
    const searchTerm = q.trim();

    const where = {
      status: "PUBLISHED",
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { excerpt: { contains: searchTerm, mode: "insensitive" } },
        { contentHtml: { contains: searchTerm, mode: "insensitive" } },
        { tags: { some: { tag: { name: { contains: searchTerm, mode: "insensitive" } } } } },
        { categories: { some: { category: { name: { contains: searchTerm, mode: "insensitive" } } } } },
      ],
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: { select: { path: true } },
          readingTime: true,
          publishedAt: true,
          author: { select: { id: true, name: true, username: true, avatar: { select: { path: true } } } },
          categories: { select: { category: { select: { id: true, name: true, slug: true } } } },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: formatPagination(total, Number(page), Number(limit)),
      query: searchTerm,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

export default router;
