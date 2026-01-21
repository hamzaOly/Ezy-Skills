// backend/routes/teacherCourses.js
import express from "express";
import multer from "multer";
import fs from "fs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Pool will be set from index.js
let pool;
export const setPool = (dbPool) => {
	pool = dbPool;
};

// Setup multer for file uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dir = "./uploads";
		if (!fs.existsSync(dir)) fs.mkdirSync(dir);
		cb(null, dir);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + "-" + file.originalname);
	},
});
const upload = multer({ storage });

// Middleware to verify token
const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ error: "No token provided" });

	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "your-secret-key",
		);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ error: "Invalid token" });
	}
};

// GET all teacher courses
router.get("/", authMiddleware, async (req, res) => {
	try {
		const { userId, role } = req.user;
		if (role !== "teacher") return res.status(403).json({ error: "Forbidden" });

		const result = await pool.query(
			"SELECT * FROM courses WHERE created_by = $1 ORDER BY created_at DESC",
			[userId],
		);
		res.json({ courses: result.rows });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

// POST new course
router.post(
	"/",
	authMiddleware,
	upload.fields([
		{ name: "thumbnail", maxCount: 1 },
		{ name: "demo_video", maxCount: 1 },
	]),
	async (req, res) => {
		try {
			// Debug: Log the user object from JWT
			console.log("JWT payload:", req.user);

			const { userId, teacherId, role } = req.user;
			console.log(
				"Extracted userId:",
				userId,
				"teacherId:",
				teacherId,
				"role:",
				role,
			);

			if (role !== "teacher")
				return res.status(403).json({ error: "Forbidden" });

			// Get teacher name from database
			const teacherResult = await pool.query(
				"SELECT full_name FROM teachers WHERE id = $1",
				[teacherId],
			);

			if (teacherResult.rows.length === 0) {
				return res.status(404).json({ error: "Teacher profile not found" });
			}

			const instructorName = teacherResult.rows[0].full_name;

			const {
				title,
				description,
				category,
				level = "beginner",
				duration_hours = 0,
				price = 0,
			} = req.body;

			const thumbnail = req.files?.thumbnail
				? req.files.thumbnail[0].path
				: null;
			const demo_video = req.files?.demo_video
				? req.files.demo_video[0].path
				: null;

			console.log(
				"About to insert course with userId:",
				userId,
				"teacherId:",
				teacherId,
				"instructorName:",
				instructorName,
			);

			const result = await pool.query(
				`INSERT INTO courses 
          (title, description, category, level, duration_hours, price, thumbnail_url, demo_video_url, created_by, teacher_id, instructor_name)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
				[
					title,
					description,
					category,
					level,
					duration_hours,
					price,
					thumbnail,
					demo_video,
					userId,
					teacherId,
					instructorName,
				],
			);

			console.log("Course created:", result.rows[0]);
			res.status(201).json({ course: result.rows[0] });
		} catch (err) {
			console.error("Error creating course:", err);
			res.status(500).json({ error: "Server error", details: err.message });
		}
	},
);

// PUT update course
router.put(
	"/:id",
	authMiddleware,
	upload.fields([
		{ name: "thumbnail", maxCount: 1 },
		{ name: "demo_video", maxCount: 1 },
	]),
	async (req, res) => {
		try {
			const { userId, role } = req.user;
			if (role !== "teacher")
				return res.status(403).json({ error: "Forbidden" });

			const { id } = req.params;
			const { title, description, category, level, duration_hours, price } =
				req.body;

			// Check if course belongs to teacher
			const checkResult = await pool.query(
				"SELECT * FROM courses WHERE id = $1 AND created_by = $2",
				[id, userId],
			);

			if (checkResult.rows.length === 0) {
				return res
					.status(404)
					.json({ error: "Course not found or unauthorized" });
			}

			const thumbnail = req.files?.thumbnail
				? req.files.thumbnail[0].path
				: checkResult.rows[0].thumbnail_url;
			const demo_video = req.files?.demo_video
				? req.files.demo_video[0].path
				: checkResult.rows[0].demo_video_url;

			const result = await pool.query(
				`UPDATE courses 
				SET title=$1, description=$2, category=$3, level=$4, duration_hours=$5, 
						price=$6, thumbnail_url=$7, demo_video_url=$8, updated_at=CURRENT_TIMESTAMP
				WHERE id=$9 AND created_by=$10 RETURNING *`,
				[
					title,
					description,
					category,
					level,
					duration_hours,
					price,
					thumbnail,
					demo_video,
					id,
					userId,
				],
			);

			res.json({ course: result.rows[0] });
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Server error" });
		}
	},
);

// DELETE course
router.delete("/:id", authMiddleware, async (req, res) => {
	try {
		const { userId, role } = req.user;
		if (role !== "teacher") return res.status(403).json({ error: "Forbidden" });

		const { id } = req.params;

		const result = await pool.query(
			"DELETE FROM courses WHERE id = $1 AND created_by = $2 RETURNING *",
			[id, userId],
		);

		if (result.rows.length === 0) {
			return res
				.status(404)
				.json({ error: "Course not found or unauthorized" });
		}

		res.json({ message: "Course deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

export default router;
