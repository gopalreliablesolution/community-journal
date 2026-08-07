import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORAGE_DIR = path.join(__dirname, "../../storage");

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_SIZE = 5 * 1024 * 1024;

export const validateFile = (file) => {
  if (!ALLOWED_TYPES[file.mimetype]) {
    return {
      valid: false,
      error: "Only JPG, PNG, and WebP images are allowed",
    };
  }
  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: "File size must be less than 5MB",
    };
  }
  return { valid: true };
};

export const saveFile = async (file, category = "uploads") => {
  const ext = ALLOWED_TYPES[file.mimetype];
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
  const dir = path.join(STORAGE_DIR, category);

  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  const filepath = path.join(dir, filename);
  await writeFile(filepath, file.buffer);

  return {
    filename,
    path: `/storage/${category}/${filename}`,
    type: category,
    size: file.size,
    mime: file.mimetype,
  };
};

export const deleteFile = async (filepath) => {
  try {
    const fullPath = path.join(__dirname, "../..", filepath);
    if (existsSync(fullPath)) {
      await unlink(fullPath);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
