// backend/server/index.js
import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import authRouters, { setPool } from "../routes/auth.js";

dotenv.config();
const { Pool } = pkg;

// 1️⃣ Create Express app
const app = express();

// 2️⃣ Middlewares
app.use(cors()); // allow requests from React
app.use(express.json()); // parse JSON

// 3️⃣ PostgreSQL pool
const pool = new Pool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
});
setPool(pool);
// Test DB connection
(async () => {
	try {
		const result = await pool.query("SELECT NOW()");
		console.log("Connected to PostgreSQL", result.rows[0]);
	} catch (err) {
		console.error("DB connection failed", err.message);
	}
})();

// 4️⃣ Routes - Add /api prefix
app.get("/api", (req, res) => {
	res.json({ message: "API is running", timestamp: new Date() });
});

app.get("/api/test", (req, res) => {
	res.json({
		message: "Backend is working!",
		timestamp: new Date(),
	});
});
app.get("/api/users", async (req, res) => {
	try {
		const result = await pool.query("SELECT id, email, created_at FROM users");
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 5️⃣ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
