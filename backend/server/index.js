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
import paymentRoutes, {
	setPool as setPaymentPool,
} from "../routes/payments.js";

// ✅ FIXED: Correct middleware path
import {
	authenticateToken,
	requireTeacher,
	requireAdmin,
} from "../middlewere/authMiddlewere.js";

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
setPaymentPool(pool);

// Test DB connection
(async () => {
	try {
		const result = await pool.query("SELECT NOW()");
		console.log("✅ Connected to PostgreSQL", result.rows[0]);
	} catch (err) {
		console.error("❌ DB connection failed", err.message);
	}
})();

// ============================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================

app.get("/", (req, res) => {
	res.json({ message: "Backend server is running!" });
});

app.get("/api", (req, res) => {
	res.json({ message: "API is running", timestamp: new Date() });
});

app.get("/api/test", (req, res) => {
	res.json({ message: "Backend is working!", timestamp: new Date() });
});

// Student & General Auth Routes (login, register)
app.use("/api/auth", authRoutes);

// Teacher Auth Routes (teacher registration, login)
app.use("/api/auth/teacher", teacherAuthRoutes);

// Public Courses Routes (browse courses without login)
app.use("/api/courses", coursesRoutes);

// Public Bundles Route (browse pricing without login)
app.get("/api/bundles/public", async (req, res) => {
	try {
		const result = await pool.query(`
			SELECT 
				b.*,
				t.full_name as teacher_name,
				(SELECT json_agg(json_build_object('id', c.id, 'title', c.title, 'price', c.price, 'category', c.category))
				 FROM bundle_courses bc
				 JOIN courses c ON bc.course_id = c.id
				 WHERE bc.bundle_id = b.id) as courses
			FROM course_bundles b
			LEFT JOIN teachers t ON b.teacher_id = t.id
			WHERE b.is_active = true
			ORDER BY b.created_at DESC
		`);
		res.json({ bundles: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// ============================================
// PROTECTED ROUTES (Authentication Required)
// ============================================

// ✅ Teacher Routes - Require Authentication + Teacher Role
app.use(
	"/api/teacher-courses",
	authenticateToken,
	requireTeacher,
	teacherCoursesRoutes,
);
app.use(
	"/api/teacher-bundles",
	authenticateToken,
	requireTeacher,
	teacherBundlesRoutes,
);

// Admin Routes - Require Authentication + Admin Role
app.use("/api/admin", authenticateToken, requireAdmin, adminRoutes);

app.use("/api/payments", paymentRoutes);
// ============================================
// TESTING ROUTES
// ============================================

// Get all users (for testing only - should be protected in production)
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

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
	console.error("Server error:", err);
	res.status(500).json({
		error: "Internal server error",
		message: err.message,
	});
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`✅ Server running on port ${PORT}`);
	console.log(`📍 API available at http://localhost:${PORT}/api`);
	console.log(
		`📍 Protected routes require Bearer token in Authorization header`,
	);
});
