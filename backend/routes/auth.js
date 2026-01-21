// backend/routes/auth.js - Student Authentication Only
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
let pool;

export const setPool = (dbPool) => {
	pool = dbPool;
};

// Student Register
router.post("/register", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
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

		const userExists = await pool.query(
			"SELECT id FROM users WHERE email = $1",
			[email],
		);

		if (userExists.rows.length > 0) {
			return res.status(400).json({ error: "Email already registered" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const result = await pool.query(
			"INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, created_at",
			[email, hashedPassword, "student"],
		);

		const newUser = result.rows[0];

		const token = jwt.sign(
			{ userId: newUser.id, email: newUser.email, role: "student" },
			process.env.JWT_SECRET || "your-secret-key",
			{ expiresIn: "7d" },
		);

		res.status(201).json({
			message: "User created successfully",
			user: {
				id: newUser.id,
				email: newUser.email,
				role: "student",
				createdAt: newUser.created_at,
			},
			token,
		});
	} catch (error) {
		console.error("Register error:", error);
		res.status(500).json({ error: "Server error during registration" });
	}
});

// Login (for both students and teachers)
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

		const result = await pool.query(
			"SELECT id, email, password, role FROM users WHERE email = $1",
			[email],
		);

		if (result.rows.length === 0) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		const user = result.rows[0];
		const validPassword = await bcrypt.compare(password, user.password);

		if (!validPassword) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		const token = jwt.sign(
			{ userId: user.id, email: user.email, role: user.role },
			process.env.JWT_SECRET || "your-secret-key",
			{ expiresIn: "7d" },
		);

		res.json({
			message: "Login successful",
			user: {
				id: user.id,
				email: user.email,
				role: user.role,
			},
			token,
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: "Server error during login" });
	}
});

export default router;
