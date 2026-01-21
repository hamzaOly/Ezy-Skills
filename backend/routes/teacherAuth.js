// backend/routes/teacherAuth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
let pool;

export const setPool = (dbPool) => {
	pool = dbPool;
};

// Teacher Register - Route is /register (not /register/teacher)
router.post("/register", async (req, res) => {
	try {
		const {
			email,
			password,
			full_name,
			phone,
			bio,
			specialization,
			years_of_experience,
			education,
			linkedin_url,
			website_url,
			hourly_rate,
		} = req.body;

		// Validation
		if (
			!email ||
			!password ||
			!full_name ||
			!bio ||
			!specialization ||
			!years_of_experience ||
			!education
		) {
			return res
				.status(400)
				.json({ error: "All required fields must be filled" });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ error: "Password must be at least 6 characters" });
		}

		if (bio.length < 50) {
			return res
				.status(400)
				.json({ error: "Bio must be at least 50 characters" });
		}

		// Check if user exists
		const userExists = await pool.query(
			"SELECT id FROM users WHERE email = $1",
			[email],
		);
		if (userExists.rows.length > 0) {
			return res.status(400).json({ error: "Email already registered" });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);
		const client = await pool.connect();

		try {
			await client.query("BEGIN");

			// Create user with role 'teacher'
			const userResult = await client.query(
				"INSERT INTO users (email, password, full_name, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name",
				[email, hashedPassword, full_name, phone, "teacher"],
			);
			const newUser = userResult.rows[0];

			// Create teacher profile
			const teacherResult = await client.query(
				`INSERT INTO teachers (
					user_id, full_name, email, phone, bio, specialization,
					years_of_experience, education, linkedin_url, website_url, hourly_rate
				) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
				[
					newUser.id,
					full_name,
					email,
					phone,
					bio,
					specialization,
					years_of_experience,
					education,
					linkedin_url || null,
					website_url || null,
					hourly_rate || null,
				],
			);

			await client.query("COMMIT");

			// Generate JWT
			const token = jwt.sign(
				{
					userId: newUser.id,
					email: newUser.email,
					role: "teacher",
					teacherId: teacherResult.rows[0].id,
				},
				process.env.JWT_SECRET || "your-secret-key",
				{ expiresIn: "7d" },
			);

			res.status(201).json({
				message: "Teacher account created successfully",
				user: {
					id: newUser.id,
					email: newUser.email,
					full_name: newUser.full_name,
					role: "teacher",
					teacherId: teacherResult.rows[0].id,
				},
				token,
			});
		} catch (err) {
			await client.query("ROLLBACK");
			throw err;
		} finally {
			client.release();
		}
	} catch (error) {
		console.error("Teacher registration error:", error);
		res.status(500).json({ error: "Server error during teacher registration" });
	}
});

export default router;
