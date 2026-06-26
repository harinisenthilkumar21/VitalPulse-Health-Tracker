import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import healthRoutes from "./routes/healthRoutes";
import pool from "./config/db";

async function ensureUserAvatarColumn() {
  try {
    await pool.execute(
      "ALTER TABLE users ADD COLUMN avatar_url MEDIUMTEXT NULL"
    );
    console.log("Schema: added avatar_url on users");
  } catch (e: any) {
    if (e?.errno === 1060 || e?.code === "ER_DUP_FIELDNAME") return;
    console.warn("Schema (avatar_url):", e?.message || e);
  }
}

// Load .env from backend folder or root folder
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json({ limit: "15mb" }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// API routes
app.use("/api", healthRoutes);

async function startServer() {
  await ensureUserAvatarColumn();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

void startServer();

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});