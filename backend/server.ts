import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import healthRoutes from "./routes/healthRoutes";
import pool from "./config/db";

// 1. Load Environment Variables First
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// 2. Initialize the Express Application
const app = express();
const PORT = Number(process.env.PORT) || 5000;

// 3. Configure CORS Policies (Now 'app' exists!)
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:3000", 
  "https://vital-pulse-health-tracker.vercel.app" 
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS restrictions"));
    }
  },
  credentials: true
}));

// 4. Other Standard Middlewares
app.use(express.json({ limit: "15mb" }));

// 5. Dynamic Schema Sync Helper
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

// 6. API Route Handlers
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api", healthRoutes);

// 7. Startup Lifecycle Execution
async function startServer() {
  await ensureUserAvatarColumn();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

void startServer();