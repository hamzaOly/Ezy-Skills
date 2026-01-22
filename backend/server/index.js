// backend/server/index.js
import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes, { setPool as setAuthPool } from "../routes/auth.js";
import adminRoutes, { setPool as setAdminPool } from "../routes/admin.js";
import teacherBundlesRoutes, {
	setPool as setTeacherBundlesPool,
} from "../routes/TeacherBundles.js";
import teacherAuthRoutes, {
	setPool as setTeacherAuthPool,
} from "../routes/teacherAuth.js";
import teacherCoursesRoutes, {
	setPool as setTeacherCoursesPool,
} from "../routes/teacherCourses.js";

import coursesRoutes, { setPool as setCoursesPool } from "../routes/Courses.js";

dotenv.config();
const { Pool } = pkg;

// Create Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// PostgreSQL pool
const pool = new Pool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
});

// Set pool for all routes
setAuthPool(pool);
setAdminPool(pool);
setTeacherAuthPool(pool);
setTeacherCoursesPool(pool);
setTeacherBundlesPool(pool);
setCoursesPool(pool);
setTeacherBundlesPool(pool);

// Test DB connection
(async () => {
	try {
		const result = await pool.query("SELECT NOW()");
		console.log("Connected to PostgreSQL ✅", result.rows[0]);
	} catch (err) {
		console.error("DB connection failed ❌", err.message);
	}
})();

// Routes
app.get("/", (req, res) => {
	res.json({ message: "Backend server is running!" });
});

app.get("/api", (req, res) => {
	res.json({ message: "API is running", timestamp: new Date() });
});

app.get("/api/test", (req, res) => {
	res.json({ message: "Backend is working!", timestamp: new Date() });
});

app.use("/api/teacher-bundles", teacherBundlesRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/teacher-bundles", teacherBundlesRoutes);

// Student & General Auth Routes
app.use("/api/auth", authRoutes);

// Teacher Auth Routes
app.use("/api/auth/teacher", teacherAuthRoutes);

// Teacher Courses Routes
app.use("/api/teacher-courses", teacherCoursesRoutes);

// Get all users (for testing)
app.get("/api/users", async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT id, email, role, created_at FROM users ORDER BY created_at DESC",
		);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`✅ Server running on port ${PORT}`);
	console.log(`📍 API available at http://localhost:${PORT}/api`);
});
