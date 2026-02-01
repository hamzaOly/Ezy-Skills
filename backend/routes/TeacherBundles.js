// backend/routes/teacherBundles.js
import express from "express";

const router = express.Router();
let pool;

export const setPool = (dbPool) => {
	pool = dbPool;
};

// ✅ NO AUTH MIDDLEWARE HERE - It's applied in index.js

// GET all teacher's bundles
router.get("/", async (req, res) => {
	try {
		const { teacherId } = req.user;

		const bundles = await pool.query(
			`SELECT b.*, 
			  (SELECT json_agg(json_build_object('id', c.id, 'title', c.title, 'price', c.price))
			   FROM bundle_courses bc
			   JOIN courses c ON bc.course_id = c.id
			   WHERE bc.bundle_id = b.id) as courses
			FROM course_bundles b
			WHERE b.teacher_id = $1
			ORDER BY b.created_at DESC`,
			[teacherId],
		);

		res.json({ bundles: bundles.rows });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// POST create new bundle
router.post("/", async (req, res) => {
	try {
		const { teacherId } = req.user;
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

		// Verify all courses belong to this teacher and are approved
		const coursesCheck = await pool.query(
			`SELECT id, price FROM courses 
			 WHERE id = ANY($1) AND teacher_id = $2 AND approval_status = 'approved'`,
			[course_ids, teacherId],
		);

		if (coursesCheck.rows.length !== 3) {
			return res.status(400).json({
				error: "All 3 courses must belong to you and be approved",
			});
		}

		// Calculate total price
		const total_price = coursesCheck.rows.reduce(
			(sum, course) => sum + parseFloat(course.price),
			0,
		);

		const discounted_price = total_price * (1 - discount_percentage / 100);

		const client = await pool.connect();
		try {
			await client.query("BEGIN");

			// Create bundle
			const bundleResult = await client.query(
				`INSERT INTO course_bundles 
				(teacher_id, title, description, discount_percentage, total_price, discounted_price)
				VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
				[
					teacherId,
					title,
					description,
					discount_percentage,
					total_price,
					discounted_price,
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

			// Fetch complete bundle with courses
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

// PUT update bundle
router.put("/:id", async (req, res) => {
	try {
		const { teacherId } = req.user;
		const { id } = req.params;
		const { title, description, discount_percentage, is_active } = req.body;

		// Check bundle belongs to teacher
		const checkResult = await pool.query(
			"SELECT * FROM course_bundles WHERE id = $1 AND teacher_id = $2",
			[id, teacherId],
		);

		if (checkResult.rows.length === 0) {
			return res.status(404).json({ error: "Bundle not found" });
		}

		const bundle = checkResult.rows[0];

		// Recalculate discounted price if discount changed
		const newDiscount =
			discount_percentage !== undefined
				? discount_percentage
				: bundle.discount_percentage;
		const discounted_price = bundle.total_price * (1 - newDiscount / 100);

		const result = await pool.query(
			`UPDATE course_bundles 
			SET title = COALESCE($1, title),
					description = COALESCE($2, description),
					discount_percentage = COALESCE($3, discount_percentage),
					discounted_price = $4,
					is_active = COALESCE($5, is_active),
					updated_at = CURRENT_TIMESTAMP
			WHERE id = $6 AND teacher_id = $7
			RETURNING *`,
			[
				title,
				description,
				newDiscount,
				discounted_price,
				is_active,
				id,
				teacherId,
			],
		);

		res.json({
			bundle: result.rows[0],
			message: "Bundle updated successfully",
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// DELETE bundle
router.delete("/:id", async (req, res) => {
	try {
		const { teacherId } = req.user;
		const { id } = req.params;

		const result = await pool.query(
			"DELETE FROM course_bundles WHERE id = $1 AND teacher_id = $2 RETURNING *",
			[id, teacherId],
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ error: "Bundle not found" });
		}

		res.json({ message: "Bundle deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// GET public bundles (for students - NO AUTH REQUIRED)
router.get("/public", async (req, res) => {
	try {
		const bundles = await pool.query(
			`SELECT b.*, t.full_name as teacher_name,
			  (SELECT json_agg(json_build_object('id', c.id, 'title', c.title, 'price', c.price, 'category', c.category))
			   FROM bundle_courses bc
			   JOIN courses c ON bc.course_id = c.id
			   WHERE bc.bundle_id = b.id) as courses
			FROM course_bundles b
			JOIN teachers t ON b.teacher_id = t.id
			WHERE b.is_active = true
			ORDER BY b.created_at DESC`,
		);

		res.json({ bundles: bundles.rows });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

export default router;
