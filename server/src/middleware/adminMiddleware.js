const adminMiddleware = (req, res, next) => {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = req.user?.email?.trim().toLowerCase();

  if (!adminEmail) {
    return res.status(500).json({ message: "Admin email is not configured." });
  }

  if (!userEmail || userEmail !== adminEmail) {
    return res.status(403).json({ message: "Forbidden: admin access only." });
  }

  return next();
};

module.exports = adminMiddleware;