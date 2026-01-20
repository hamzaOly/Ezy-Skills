// backend/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// This will be passed from index.js
let pool;

export const setPool = (dbPool) => {
	pool = dbPool;
};

// Register endpoint
router.post("/register", async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validation
		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

		// Password validation (min 6 characters)
		if (password.length < 6) {
			return res
				.status(400)
				.json({ error: "Password must be at least 6 characters" });
		}

		// Check if user already exists
		const userExists = await pool.query(
			"SELECT id FROM users WHERE email = $1",
			[email],
		);

		if (userExists.rows.length > 0) {
			return res.status(400).json({ error: "Email already registered" });
		}

		// Hash password
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// Insert user
		const result = await pool.query(
			"INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at",
			[email, hashedPassword],
		);

		const newUser = result.rows[0];

		// Generate JWT token
		const token = jwt.sign(
			{ userId: newUser.id, email: newUser.email },
			process.env.JWT_SECRET || "your-secret-key",
			{ expiresIn: "7d" },
		);

		res.status(201).json({
			message: "User created successfully",
			user: {
				id: newUser.id,
				email: newUser.email,
				createdAt: newUser.created_at,
			},
			token,
		});
	} catch (error) {
		console.error("Register error:", error);
		res.status(500).json({ error: "Server error during registration" });
	}
});

// Login endpoint
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validation
		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

		// Find user
		const result = await pool.query(
			"SELECT id, email, password FROM users WHERE email = $1",
			[email],
		);

		if (result.rows.length === 0) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		const user = result.rows[0];

		// Compare password
		const validPassword = await bcrypt.compare(password, user.password);

		if (!validPassword) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user.id, email: user.email },
			process.env.JWT_SECRET || "your-secret-key",
			{ expiresIn: "7d" },
		);

		res.json({
			message: "Login successful",
			user: {
				id: user.id,
				email: user.email,
			},
			token,
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: "Server error during login" });
	}
});

export default router;
