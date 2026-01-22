// backend/routes/admin.js
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();
let pool;

export const setPool = (dbPool) => {
	pool = dbPool;
};

// Middleware to verify admin token
const adminMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ error: "No token provided" });

	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "your-secret-key",
		);
		if (decoded.role !== "admin") {
			return res.status(403).json({ error: "Admin access required" });
		}
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ error: "Invalid token" });
	}
};

// Get all users
router.get("/users", async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT id, email, role, full_name, phone, created_at FROM users ORDER BY created_at DESC",
		);
		res.json({ users: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// Get all courses
router.get("/courses", async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM courses ORDER BY created_at DESC",
		);
		res.json({ courses: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// Get all teachers
router.get("/teachers", async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM teachers ORDER BY created_at DESC",
		);
		res.json({ teachers: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// Delete user
router.delete("/users/:id", adminMiddleware, async (req, res) => {
	try {
		const { id } = req.params;

		const result = await pool.query(
			"DELETE FROM users WHERE id = $1 RETURNING *",
			[id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "User not found" });
		}

		res.json({ message: "User deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// Delete course
router.delete("/courses/:id", adminMiddleware, async (req, res) => {
	try {
		const { id } = req.params;

		const result = await pool.query(
			"DELETE FROM courses WHERE id = $1 RETURNING *",
			[id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Course not found" });
		}

		res.json({ message: "Course deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// Verify/Unverify teacher
router.put("/teachers/:id/verify", adminMiddleware, async (req, res) => {
	try {
		const { id } = req.params;
		const { is_verified } = req.body;

		const result = await pool.query(
			"UPDATE teachers SET is_verified = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
			[is_verified, id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Teacher not found" });
		}

		res.json({
			teacher: result.rows[0],
			message: "Teacher verification updated",
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// Get dashboard statistics
router.get("/stats", async (req, res) => {
	try {
		const [users, teachers, students, courses, enrollments, pendingCourses] =
			await Promise.all([
				pool.query("SELECT COUNT(*) FROM users"),
				pool.query("SELECT COUNT(*) FROM users WHERE role = 'teacher'"),
				pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'"),
				pool.query("SELECT COUNT(*) FROM courses"),
				pool.query("SELECT COUNT(*) FROM enrollments"),
				pool.query(
					"SELECT COUNT(*) FROM courses WHERE approval_status = 'pending'",
				),
			]);

		res.json({
			totalUsers: parseInt(users.rows[0].count),
			totalTeachers: parseInt(teachers.rows[0].count),
			totalStudents: parseInt(students.rows[0].count),
			totalCourses: parseInt(courses.rows[0].count),
			totalEnrollments: parseInt(enrollments.rows[0].count),
			pendingCourses: parseInt(pendingCourses.rows[0].count),
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// Get pending courses for approval
router.get("/courses/pending", async (req, res) => {
	try {
		const result = await pool.query(`
			SELECT c.*, t.full_name as teacher_name, t.email as teacher_email
			FROM courses c
			LEFT JOIN teachers t ON c.teacher_id = t.id
			WHERE c.approval_status = 'pending'
			ORDER BY c.created_at DESC
		`);
		res.json({ courses: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// Approve course
router.put("/courses/:id/approve", adminMiddleware, async (req, res) => {
	try {
		const { id } = req.params;
		const { userId } = req.user;

		const result = await pool.query(
			`UPDATE courses 
			SET approval_status = 'approved', 
					approved_by = $1, 
					approved_at = CURRENT_TIMESTAMP,
					is_published = true,
					updated_at = CURRENT_TIMESTAMP
			WHERE id = $2 AND approval_status = 'pending'
			RETURNING *`,
			[userId, id],
		);

		if (result.rows.length === 0) {
			return res
				.status(404)
				.json({ error: "Course not found or already processed" });
		}

		res.json({
			course: result.rows[0],
			message: "Course approved successfully",
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// Reject course
router.put("/courses/:id/reject", adminMiddleware, async (req, res) => {
	try {
		const { id } = req.params;
		const { userId } = req.user;
		const { rejection_reason } = req.body;

		const result = await pool.query(
			`UPDATE courses 
			SET approval_status = 'rejected', 
					approved_by = $1, 
					approved_at = CURRENT_TIMESTAMP,
					rejection_reason = $2,
					updated_at = CURRENT_TIMESTAMP
			WHERE id = $3 AND approval_status = 'pending'
			RETURNING *`,
			[userId, rejection_reason || "No reason provided", id],
		);

		if (result.rows.length === 0) {
			return res
				.status(404)
				.json({ error: "Course not found or already processed" });
		}

		res.json({
			course: result.rows[0],
			message: "Course rejected",
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});
router.get("/bundles/pending", async (req, res) => {
	try {
		const result = await pool.query(`
			SELECT 
				b.*,
				t.full_name as teacher_name,
				t.email as teacher_email,
				(SELECT json_agg(json_build_object('id', c.id, 'title', c.title, 'price', c.price))
				 FROM bundle_courses bc
				 JOIN courses c ON bc.course_id = c.id
				 WHERE bc.bundle_id = b.id) as courses
			FROM course_bundles b
			JOIN teachers t ON b.teacher_id = t.id
			WHERE b.is_active = false
			ORDER BY b.created_at DESC
		`);
		res.json({ bundles: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// Get all bundles (approved and pending)
router.get("/bundles", async (req, res) => {
	try {
		const result = await pool.query(`
			SELECT 
				b.*,
				t.full_name as teacher_name,
				t.email as teacher_email,
				(SELECT json_agg(json_build_object('id', c.id, 'title', c.title, 'price', c.price))
				 FROM bundle_courses bc
				 JOIN courses c ON bc.course_id = c.id
				 WHERE bc.bundle_id = b.id) as courses
			FROM course_bundles b
			JOIN teachers t ON b.teacher_id = t.id
			ORDER BY b.created_at DESC
		`);
		res.json({ bundles: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// Approve bundle
router.put("/bundles/:id/approve", adminMiddleware, async (req, res) => {
	try {
		const { id } = req.params;

		const result = await pool.query(
			`UPDATE course_bundles 
			SET is_active = true, updated_at = CURRENT_TIMESTAMP
			WHERE id = $1 RETURNING *`,
			[id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Bundle not found" });
		}

		res.json({
			bundle: result.rows[0],
			message: "Bundle approved successfully",
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// Reject/Delete bundle
router.delete("/bundles/:id", adminMiddleware, async (req, res) => {
	try {
		const { id } = req.params;

		const result = await pool.query(
			"DELETE FROM course_bundles WHERE id = $1 RETURNING *",
			[id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Bundle not found" });
		}

		res.json({ message: "Bundle rejected successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

export default router;
