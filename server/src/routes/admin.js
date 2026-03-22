const express = require("express");

const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/overview", async (_req, res) => {
  try {
    const [totalUsers, totalEntries] = await Promise.all([prisma.user.count(), prisma.entry.count()]);

    const recentThreshold = new Date();
    recentThreshold.setDate(recentThreshold.getDate() - 7);

    const recentActive = await prisma.entry.findMany({
      where: { createdAt: { gte: recentThreshold } },
      distinct: ["userId"],
      select: { userId: true },
    });

    const usersWithCounts = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        _count: { select: { entries: true } },
      },
    });

    const topWriters = usersWithCounts
      .sort((a, b) => b._count.entries - a._count.entries)
      .slice(0, 5)
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        entriesCount: user._count.entries,
      }));

    return res.json({
      totalUsers,
      totalEntries,
      activeWritersLast7Days: recentActive.length,
      topWriters,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch admin overview.", error: error.message });
  }
});

router.get("/users", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        entries: {
          select: {
            id: true,
            title: true,
            date: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: { select: { entries: true } },
      },
    });

    const normalized = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      entriesCount: user._count.entries,
      lastEntry: user.entries[0] || null,
    }));

    return res.json(normalized);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch users.", error: error.message });
  }
});

module.exports = router;
