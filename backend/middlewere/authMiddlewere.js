// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

	if (!token) {
		return res.status(401).json({ error: "Access token required" });
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "your-secret-key",
		);

		// Store user info in req.user
		req.user = {
			userId: decoded.userId,
			email: decoded.email,
			role: decoded.role,
			teacherId: decoded.teacherId, // Will be undefined for students
		};

		console.log("✅ Authenticated user:", req.user);
		next();
	} catch (err) {
		console.error("❌ Token verification error:", err.message);
		return res.status(403).json({ error: "Invalid or expired token" });
	}
};

export const requireTeacher = (req, res, next) => {
	if (req.user.role !== "teacher") {
		return res.status(403).json({ error: "Teacher access required" });
	}

	if (!req.user.teacherId) {
		return res.status(400).json({ error: "Teacher ID missing from token" });
	}

	next();
};

export const requireAdmin = (req, res, next) => {
	if (req.user.role !== "admin") {
		return res.status(403).json({ error: "Admin access required" });
	}
	next();
};
