import { Router } from "express";
import prisma from "../lib/prisma.js";
import { validate, postSchema, postUpdateSchema } from "../lib/validation.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";
import { slugify, generateUniqueSlug, paginateQuery, formatPagination } from "../lib/utils.js";
import { calculateReadingTime } from "../lib/reading-time.js";

const router = Router();

router.get("/", optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, author } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const where = { status: "PUBLISHED" };
    if (category) where.categories = { some: { category: { slug: category } } };
    if (tag) where.tags = { some: { tag: { slug: tag } } };
    if (author) where.author = { username: author };

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
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

// DEPRECATED: Use GET /me/drafts instead
router.get("/drafts", authenticate, async (req, res) => {
  res.set("X-Deprecated", "true");
  res.set("X-Deprecated-Alternative", "GET /me/drafts");
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: req.user.id, status: "DRAFT" },
        skip,
        take,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          updatedAt: true,
          categories: { select: { category: { select: { id: true, name: true } } } },
        },
      }),
      prisma.post.count({ where: { authorId: req.user.id, status: "DRAFT" } }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: formatPagination(total, Number(page), Number(limit)),
    });
  } catch (error) {
    console.error("Get drafts error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

// DEPRECATED: Use GET /me/posts instead
router.get("/my", authenticate, async (req, res) => {
  res.set("X-Deprecated", "true");
  res.set("X-Deprecated-Alternative", "GET /me/posts");
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip, take } = paginateQuery(Number(page), Number(limit));

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: req.user.id },
        skip,
        take,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          status: true,
          publishedAt: true,
          updatedAt: true,
          categories: { select: { category: { select: { id: true, name: true } } } },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      prisma.post.count({ where: { authorId: req.user.id } }),
    ]);

    res.json({
      success: true,
      data: posts,
      pagination: formatPagination(total, Number(page), Number(limit)),
    });
  } catch (error) {
    console.error("Get my posts error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.get("/:slug", optionalAuth, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
      select: {
        id: true, title: true, slug: true, excerpt: true, contentHtml: true, contentJson: true,
        coverImage: { select: { id: true, path: true } },
        metaTitle: true, metaDescription: true, readingTime: true, status: true, publishedAt: true, createdAt: true,
        author: { select: { id: true, name: true, username: true, bio: true, avatar: { select: { path: true } } } },
        categories: { select: { category: { select: { id: true, name: true, slug: true } } } },
        tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
        _count: { select: { likes: true, comments: true, views: true } },
      },
    });

    if (!post) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Post not found" } });
    }

    if (post.status !== "PUBLISHED" && post.author.id !== req.user?.id && req.user?.role !== "ADMIN") {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Post not found" } });
    }

    if (post.status === "PUBLISHED") {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const existingView = await prisma.view.findFirst({
        where: {
          postId: post.id,
          OR: [
            { userId: req.user?.id || null },
            { ip: req.ip },
          ],
          createdAt: { gte: twentyFourHoursAgo },
        },
      });

      if (!existingView) {
        await prisma.view.create({ data: { postId: post.id, userId: req.user?.id || null, ip: req.ip } });
      }

      if (req.user) {
        await prisma.readingHistory.upsert({
          where: { userId_postId: { userId: req.user.id, postId: post.id } },
          update: { readAt: new Date() },
          create: { userId: req.user.id, postId: post.id },
        }).catch(err => console.error("Reading history error:", err));
      }
    }

    res.json({ success: true, data: post });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/:slug/preview", optionalAuth, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
      select: {
        id: true, title: true, slug: true, excerpt: true, contentHtml: true, contentJson: true,
        coverImage: { select: { id: true, path: true } },
        metaTitle: true, metaDescription: true, readingTime: true, status: true, publishedAt: true, createdAt: true, updatedAt: true,
        author: { select: { id: true, name: true, username: true, bio: true, avatar: { select: { path: true } } } },
        categories: { select: { category: { select: { id: true, name: true, slug: true } } } },
        tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
        _count: { select: { likes: true, comments: true, views: true } },
      },
    });

    if (!post) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Post not found" } });
    }

    if (post.author.id !== req.user?.id && req.user?.role !== "ADMIN") {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Post not found" } });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    console.error("Get preview error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.get("/:slug/stats", optionalAuth, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { slug: req.params.slug }, select: { id: true, authorId: true } });

    if (!post) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Post not found" } });
    }

    if (post.authorId !== req.user?.id && req.user?.role !== "ADMIN") {
      return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Not authorized" } });
    }

    const [views, likes, comments, bookmarks] = await Promise.all([
      prisma.view.count({ where: { postId: post.id } }),
      prisma.like.count({ where: { postId: post.id } }),
      prisma.comment.count({ where: { postId: post.id } }),
      prisma.bookmark.count({ where: { postId: post.id } }),
    ]);

    res.json({ success: true, data: { views, likes, comments, bookmarks } });
  } catch (error) {
    console.error("Get post stats error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const validation = validate(postSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", details: validation.errors },
      });
    }

    const { title, slug, excerpt, contentHtml, contentJson, coverImageId, metaTitle, metaDescription, categoryIds, tagNames } = validation.data;

    const baseSlug = slug || slugify(title);
    const uniqueSlug = await generateUniqueSlug(prisma, baseSlug);
    const readingTime = calculateReadingTime(contentHtml);

    const post = await prisma.post.create({
      data: {
        authorId: req.user.id,
        title,
        slug: uniqueSlug,
        excerpt,
        contentHtml,
        contentJson,
        coverImageId,
        metaTitle,
        metaDescription,
        readingTime,
        categories: {
          create: categoryIds.map((categoryId) => ({ categoryId })),
        },
        tags: tagNames
          ? {
              create: await Promise.all(
                tagNames.map(async (name) => {
                  const tagSlug = slugify(name);
                  const tag = await prisma.tag.upsert({
                    where: { slug: tagSlug },
                    update: {},
                    create: { name, slug: tagSlug },
                  });
                  return { tagId: tag.id };
                })
              ),
            }
          : undefined,
      },
      include: {
        categories: { select: { category: true } },
        tags: { select: { tag: true } },
      },
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.patch("/:id", authenticate, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Post not found" },
      });
    }

    if (post.authorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "You can only edit your own posts" },
      });
    }

    const validation = validate(postUpdateSchema, req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", details: validation.errors },
      });
    }

    const { title, slug, excerpt, contentHtml, contentJson, coverImageId, metaTitle, metaDescription, categoryIds, tagNames } = validation.data;

    let uniqueSlug = post.slug;
    if (title && title !== post.title) {
      const baseSlug = slug || slugify(title);
      uniqueSlug = await generateUniqueSlug(prisma, baseSlug, post.id);
    }

    const readingTime = contentHtml ? calculateReadingTime(contentHtml) : post.readingTime;

    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: {
        ...(title && { title }),
        ...(slug !== undefined && { slug: uniqueSlug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(contentHtml !== undefined && { contentHtml }),
        ...(contentJson !== undefined && { contentJson }),
        ...(coverImageId !== undefined && { coverImageId }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(contentHtml && { readingTime }),
      },
    });

    if (categoryIds) {
      await prisma.postCategory.deleteMany({ where: { postId: post.id } });
      await prisma.postCategory.createMany({
        data: categoryIds.map((categoryId) => ({ postId: post.id, categoryId })),
      });
    }

    if (tagNames) {
      await prisma.postTag.deleteMany({ where: { postId: post.id } });
      const tags = await Promise.all(
        tagNames.map(async (name) => {
          const tagSlug = slugify(name);
          return prisma.tag.upsert({
            where: { slug: tagSlug },
            update: {},
            create: { name, slug: tagSlug },
          });
        })
      );
      await prisma.postTag.createMany({
        data: tags.map((tag) => ({ postId: post.id, tagId: tag.id })),
      });
    }

    const result = await prisma.post.findUnique({
      where: { id: post.id },
      include: {
        categories: { select: { category: true } },
        tags: { select: { tag: true } },
      },
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Post not found" },
      });
    }

    if (post.authorId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "You can only delete your own posts" },
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

router.patch("/:id/publish", authenticate, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({ where: { id: req.params.id } });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Post not found" },
      });
    }

    if (post.authorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { code: "FORBIDDEN", message: "You can only publish your own posts" },
      });
    }

    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });

    res.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error("Publish post error:", error);
    res.status(500).json({
      success: false,
      error: { code: "SERVER_ERROR", message: "Internal server error" },
    });
  }
});

export default router;
