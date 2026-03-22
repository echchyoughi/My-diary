const express = require("express");

const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const entries = await prisma.entry.findMany({
      where: { userId: req.user.id },
      orderBy: { date: "desc" },
    });
    return res.json(entries);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch entries.", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const entry = await prisma.entry.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!entry) {
      return res.status(404).json({ message: "Entry not found." });
    }

    return res.json(entry);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch entry.", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, content, date, mood } = req.body;

    if (!title || !content || !date) {
      return res.status(400).json({ message: "Title, content, and date are required." });
    }

    const entry = await prisma.entry.create({
      data: {
        title: title.trim(),
        content,
        date: new Date(date),
        mood: mood || null,
        userId: req.user.id,
      },
    });

    return res.status(201).json(entry);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create entry.", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, content, date, mood } = req.body;

    const existing = await prisma.entry.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Entry not found." });
    }

    const entry = await prisma.entry.update({
      where: { id: req.params.id },
      data: {
        title: title?.trim() ?? existing.title,
        content: content ?? existing.content,
        date: date ? new Date(date) : existing.date,
        mood: mood === undefined ? existing.mood : mood,
      },
    });

    return res.json(entry);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update entry.", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const existing = await prisma.entry.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Entry not found." });
    }

    await prisma.entry.delete({
      where: { id: req.params.id },
    });

    return res.json({ message: "Entry deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete entry.", error: error.message });
  }
});

module.exports = router;
