// backend/routes/courses.js - Public courses routes
import express from "express";

const router = express.Router();
let pool;

export const setPool = (dbPool) => {
	pool = dbPool;
};

// GET all published courses (public)
router.get("/public", async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT c.*, t.full_name as instructor_name
			FROM courses c
			LEFT JOIN teachers t ON c.teacher_id = t.id
			WHERE c.is_published = true AND c.approval_status = 'approved'
			ORDER BY c.created_at DESC`,
		);
		res.json({ courses: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// GET single course by ID
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			`SELECT c.*, t.full_name as instructor_name, t.bio as instructor_bio
			FROM courses c
			LEFT JOIN teachers t ON c.teacher_id = t.id
			WHERE c.id = $1 AND c.is_published = true AND c.approval_status = 'approved'`,
			[id],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Course not found" });
		}

		res.json({ course: result.rows[0] });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// GET courses by category
router.get("/category/:category", async (req, res) => {
	try {
		const { category } = req.params;
		const result = await pool.query(
			`SELECT c.*, t.full_name as instructor_name
			FROM courses c
			LEFT JOIN teachers t ON c.teacher_id = t.id
			WHERE c.category = $1 AND c.is_published = true AND c.approval_status = 'approved'
			ORDER BY c.created_at DESC`,
			[category],
		);
		res.json({ courses: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});
// Get course content
router.get("/:id/content", async (req, res) => {
	const { id } = req.params;
	const result = await pool.query(
		"SELECT * FROM course_content WHERE course_id = $1 ORDER BY section_number",
		[id],
	);
	res.json({ content: result.rows });
});

// Get course projects
router.get("/:id/projects", async (req, res) => {
	const { id } = req.params;
	const result = await pool.query(
		"SELECT * FROM course_projects WHERE course_id = $1",
		[id],
	);
	res.json({ projects: result.rows });
});

export default router;
