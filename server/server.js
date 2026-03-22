const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");


const authRoutes = require("./src/routes/auth");
const adminRoutes = require("./src/routes/admin");
const entryRoutes = require("./src/routes/entries");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/entries", entryRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ message: "Something went wrong." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
