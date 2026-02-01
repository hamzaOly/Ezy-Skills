// backend/routes/admin.js
import express from "express";

const router = express.Router();
let pool;

export const setPool = (dbPool) => {
	pool = dbPool;
};

// ✅ NO DUPLICATE MIDDLEWARE - Uses the one from index.js (authenticateToken + requireAdmin)

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

// Get approved courses (for creating bundles)
router.get("/courses/approved", async (req, res) => {
	try {
		const result = await pool.query(`
			SELECT c.*, t.full_name as teacher_name
			FROM courses c
			LEFT JOIN teachers t ON c.teacher_id = t.id
			WHERE c.approval_status = 'approved'
			ORDER BY c.created_at DESC
		`);
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
router.delete("/users/:id", async (req, res) => {
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
router.delete("/courses/:id", async (req, res) => {
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
router.put("/teachers/:id/verify", async (req, res) => {
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
router.put("/courses/:id/approve", async (req, res) => {
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
router.put("/courses/:id/reject", async (req, res) => {
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

// Get pending bundles (only teacher-created)
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
			LEFT JOIN teachers t ON b.teacher_id = t.id
			WHERE b.is_active = false AND (b.created_by_admin IS NULL OR b.created_by_admin = false)
			ORDER BY b.created_at DESC
		`);
		res.json({ bundles: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// Get all bundles (both admin and teacher created)
router.get("/bundles", async (req, res) => {
	try {
		const result = await pool.query(`
			SELECT 
				b.*,
				t.full_name as teacher_name,
				t.email as teacher_email,
				CASE 
					WHEN b.created_by_admin = true THEN 'Admin'
					ELSE 'Teacher'
				END as created_by_type,
				(SELECT json_agg(json_build_object('id', c.id, 'title', c.title, 'price', c.price))
				 FROM bundle_courses bc
				 JOIN courses c ON bc.course_id = c.id
				 WHERE bc.bundle_id = b.id) as courses
			FROM course_bundles b
			LEFT JOIN teachers t ON b.teacher_id = t.id
			ORDER BY b.created_at DESC
		`);
		res.json({ bundles: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// Create bundle (Admin only - can pick from ANY approved courses)
router.post("/bundles", async (req, res) => {
	try {
		const { userId } = req.user;
		const { title, description, course_ids, discount_percentage } = req.body;

		// Validation
		if (!title || !course_ids || course_ids.length !== 3) {
			return res
				.status(400)
				.json({ error: "Bundle must have exactly 3 courses" });
		}

		if (discount_percentage < 0 || discount_percentage > 100) {
			return res
				.status(400)
				.json({ error: "Discount must be between 0 and 100" });
		}

		// Verify all courses are approved
		const coursesCheck = await pool.query(
			`SELECT id, price FROM courses 
			 WHERE id = ANY($1) AND approval_status = 'approved'`,
			[course_ids],
		);

		if (coursesCheck.rows.length !== 3) {
			return res.status(400).json({
				error: "All 3 courses must be approved",
			});
		}

		// Calculate prices
		const total_price = coursesCheck.rows.reduce(
			(sum, course) => sum + parseFloat(course.price),
			0,
		);
		const discounted_price = total_price * (1 - discount_percentage / 100);

		const client = await pool.connect();
		try {
			await client.query("BEGIN");

			// Create bundle (admin-created, auto-approved)
			const bundleResult = await client.query(
				`INSERT INTO course_bundles 
				(teacher_id, title, description, discount_percentage, total_price, discounted_price, is_active, created_by_admin, created_by)
				VALUES (NULL, $1, $2, $3, $4, $5, true, true, $6) RETURNING *`,
				[
					title,
					description,
					discount_percentage,
					total_price,
					discounted_price,
					userId,
				],
			);

			const bundleId = bundleResult.rows[0].id;

			// Add courses to bundle
			for (const courseId of course_ids) {
				await client.query(
					"INSERT INTO bundle_courses (bundle_id, course_id) VALUES ($1, $2)",
					[bundleId, courseId],
				);
			}

			await client.query("COMMIT");

			// Fetch complete bundle
			const completeBundle = await pool.query(
				`SELECT b.*, 
				  (SELECT json_agg(json_build_object('id', c.id, 'title', c.title, 'price', c.price))
				   FROM bundle_courses bc
				   JOIN courses c ON bc.course_id = c.id
				   WHERE bc.bundle_id = b.id) as courses
				FROM course_bundles b
				WHERE b.id = $1`,
				[bundleId],
			);

			res.status(201).json({
				bundle: completeBundle.rows[0],
				message: "Bundle created successfully",
			});
		} catch (err) {
			await client.query("ROLLBACK");
			throw err;
		} finally {
			client.release();
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// Approve bundle
router.put("/bundles/:id/approve", async (req, res) => {
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
router.delete("/bundles/:id", async (req, res) => {
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
