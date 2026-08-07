import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_EMAIL", message: "Please provide a valid email address" },
      });
    }

    const existing = await prisma.newsletter.findUnique({ where: { email } });
    if (existing) {
      return res.json({ success: true, data: { message: "You are already subscribed!" } });
    }

    await prisma.newsletter.create({ data: { email } });

    res.status(201).json({ success: true, data: { message: "Successfully subscribed to newsletter!" } });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    res.status(500).json({ success: false, error: { code: "SERVER_ERROR", message: "Internal server error" } });
  }
});

export default router;
