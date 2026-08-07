import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be at most 200 characters"),
  slug: z.string().optional(),
  excerpt: z.string().min(1, "Excerpt is required").max(500, "Excerpt must be at most 500 characters"),
  contentHtml: z.string().min(10, "Content is required"),
  contentJson: z.string().min(1, "Content JSON is required"),
  coverImageId: z.string().nullable().optional(),
  metaTitle: z.string().max(70, "Meta title must be at most 70 characters").nullable().optional(),
  metaDescription: z.string().max(160, "Meta description must be at most 160 characters").nullable().optional(),
  categoryIds: z.array(z.string()).min(1, "At least one category is required"),
  tagNames: z.array(z.string()).optional(),
});

export const postUpdateSchema = postSchema.partial().extend({
  categoryIds: z.array(z.string()).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be at most 50 characters"),
  slug: z.string().optional(),
  icon: z.string().nullable().optional(),
});

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(5000, "Comment must be at most 5000 characters"),
  parentId: z.string().nullable().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be at most 50 characters").optional(),
  bio: z.string().max(500, "Bio must be at most 500 characters").nullable().optional(),
  avatarId: z.string().nullable().optional(),
});

export const validate = (schema, data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return { success: false, errors };
  }
  return { success: true, data: result.data };
};
