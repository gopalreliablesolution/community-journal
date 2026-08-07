import { Router } from "express";
import prisma from "../lib/prisma.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { paginateQuery, formatPagination } from "../lib/utils.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/users", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          bio: true,
          role: true,
          status: true,
          createdAt: true,
          lastActiveAt: true,
          avatar: { select: { path: true } },
          _count: { select: { posts: true, followers: true, following: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: formatPagination(total, Number(page), Number(limit)),
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "User not found" },
      });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: { code: "SELF_ACTION", message: "Cannot modify your own account from admin" },
      });
    }

    const { role, status } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(role && { role }),
        ...(status && { status }),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        status: true,
      },
    });

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "User not found" },
      });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: { code: "SELF_ACTION", message: "Cannot delete your own account from admin" },
      });
    }

    if (user.role === "ADMIN") {
      return res.status(400).json({
        success: false,
        error: { code: "CANNOT_DELETE_ADMIN", message: "Cannot delete another admin" },
      });
    }

    await prisma.user.delete({ where: { id: user.id } });

    res.json({ success: true, data: { message: "User deleted successfully" } });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.get("/posts", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          readingTime: true,
          createdAt: true,
          publishedAt: true,
          author: { select: { id: true, name: true, username: true, avatar: { select: { path: true } } } },
          categories: { select: { category: { select: { id: true, name: true, slug: true } } } },
          _count: { select: { likes: true, comments: true, views: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: formatPagination(total, Number(page), Number(limit)),
    });
  } catch (error) {
    console.error("Get admin posts error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.delete("/posts/:id", async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Post not found" },
      });
    }

    await prisma.post.delete({ where: { id: post.id } });

    res.json({ success: true, data: { message: "Post deleted successfully" } });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const [totalUsers, totalPosts, totalPublished, totalDrafts, totalComments, totalViews, topCategories, topTags, recentPosts, activeUsers, newUsersToday] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.comment.count(),
      prisma.view.count(),
      prisma.postCategory.groupBy({ by: ["categoryId"], _count: true, orderBy: { _count: { categoryId: "desc" } }, take: 10 }),
      prisma.postTag.groupBy({ by: ["tagId"], _count: true, orderBy: { _count: { tagId: "desc" } }, take: 10 }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, title: true, slug: true, status: true, createdAt: true, publishedAt: true,
          author: { select: { id: true, name: true, username: true } },
          _count: { select: { likes: true, comments: true, views: true } },
        },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { lastActiveAt: "desc" },
        where: { lastActiveAt: { not: null } },
        select: {
          id: true, name: true, username: true, lastActiveAt: true,
          avatar: { select: { path: true } },
          _count: { select: { posts: true } },
        },
      }),
      prisma.user.count({
        where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
    ]);

    const categoryIds = topCategories.map((c) => c.categoryId);
    const tagIds = topTags.map((t) => t.tagId);

    const [categoryNames, tagNames] = await Promise.all([
      prisma.category.findMany({ where: { id: { in: categoryIds } }, select: { id: true, name: true, slug: true } }),
      prisma.tag.findMany({ where: { id: { in: tagIds } }, select: { id: true, name: true, slug: true } }),
    ]);

    const categoriesWithCount = topCategories.map((c) => ({
      ...categoryNames.find((n) => n.id === c.categoryId),
      postCount: c._count,
    }));

    const tagsWithCount = topTags.map((t) => ({
      ...tagNames.find((n) => n.id === t.tagId),
      postCount: t._count,
    }));

    res.json({
      success: true,
      data: {
        totalUsers, totalPosts, totalPublished, totalDrafts, totalComments, totalViews,
        newUsersToday,
        topCategories: categoriesWithCount,
        topTags: tagsWithCount,
        recentPosts,
        activeUsers,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

// User growth data for charts
router.get("/users/growth", async (req, res) => {
  try {
    const { period = "30" } = req.query; // days
    const days = Number(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get users registered per day
    const users = await prisma.user.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Group by date
    const growthMap = {};
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const key = date.toISOString().split("T")[0];
      growthMap[key] = 0;
    }

    users.forEach((u) => {
      const key = u.createdAt.toISOString().split("T")[0];
      if (growthMap[key] !== undefined) growthMap[key]++;
    });

    const growth = Object.entries(growthMap).map(([date, count]) => ({
      date,
      users: count,
    }));

    // User role distribution
    const roleDistribution = await prisma.user.groupBy({
      by: ["role"],
      _count: true,
    });

    // User status distribution
    const statusDistribution = await prisma.user.groupBy({
      by: ["status"],
      _count: true,
    });

    // Top users by posts
    const topUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { posts: { _count: "desc" } },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: { select: { path: true } },
        _count: { select: { posts: true, followers: true } },
      },
    });

    res.json({
      success: true,
      data: {
        growth,
        roleDistribution: roleDistribution.map((r) => ({ role: r.role, count: r._count })),
        statusDistribution: statusDistribution.map((s) => ({ status: s.status, count: s._count })),
        topUsers,
      },
    });
  } catch (error) {
    console.error("Get user growth error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

export default router;
