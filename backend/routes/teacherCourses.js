import express from "express";
import multer from "multer";
import fs from "fs";
import jwt from "jsonwebtoken";

const router = express.Router();

// ================= POOL =================
let pool;
export const setPool = (dbPool) => {
	pool = dbPool;
};

// ================= MULTER =================
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

// ================= AUTH MIDDLEWARE =================
const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return res.status(401).json({ error: "No token provided" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || "your-secret-key",
		);

		req.user = decoded;
		console.log("🔍 Decoded token:", decoded); // Debug
		next();
	} catch (err) {
		console.error("Token verification error:", err);
		return res.status(401).json({ error: "Invalid token" });
	}
};

// ================= GET TEACHER COURSES =================
// Add this to your teacherCourses.js - Replace the GET route

// ================= GET TEACHER COURSES (DEBUG VERSION) =================
router.get("/", authMiddleware, async (req, res) => {
	try {
		console.log("📥 GET /api/teacher-courses called");
		console.log("👤 req.user:", req.user);

		const { teacherId, role } = req.user;

		console.log("🔑 teacherId:", teacherId);
		console.log("🎭 role:", role);

		if (role !== "teacher") {
			console.log("❌ Role is not teacher");
			return res.status(403).json({ error: "Forbidden" });
		}

		if (!teacherId) {
			console.log("❌ teacherId is missing!");
			return res.status(400).json({
				error: "Teacher ID missing from token",
				debug: {
					fullUser: req.user,
					teacherId: teacherId,
					type: typeof teacherId,
				},
			});
		}

		console.log("✅ About to query database with teacherId:", teacherId);

		// Check if teacher exists first
		const teacherCheck = await pool.query(
			"SELECT id, full_name FROM teachers WHERE id = $1",
			[teacherId],
		);

		console.log("👨‍🏫 Teacher check result:", teacherCheck.rows);

		if (teacherCheck.rows.length === 0) {
			console.log("❌ Teacher not found in database");
			return res.status(404).json({
				error: "Teacher not found",
				teacherId: teacherId,
			});
		}

		// Now get courses
		const result = await pool.query(
			`SELECT * 
       FROM courses 
       WHERE teacher_id = $1 
       ORDER BY created_at DESC`,
			[teacherId],
		);

		console.log("📚 Found courses:", result.rows.length);

		res.json({ courses: result.rows });
	} catch (err) {
		console.error("❌ GET teacher courses error:", err);
		console.error("❌ Error message:", err.message);
		console.error("❌ Error stack:", err.stack);
		res.status(500).json({
			error: "Server error",
			details: err.message,
			stack: err.stack,
		});
	}
});

// ================= CREATE COURSE =================
router.post(
	"/",
	authMiddleware,
	upload.fields([
		{ name: "thumbnail", maxCount: 1 },
		{ name: "demo_video", maxCount: 1 },
	]),
	async (req, res) => {
		try {
			const { userId, teacherId, role } = req.user;

			if (role !== "teacher") {
				return res.status(403).json({ error: "Forbidden" });
			}

			if (!teacherId) {
				return res.status(400).json({
					error: "Teacher ID missing from token",
				});
			}

			console.log("🎯 Creating course for teacherId:", teacherId);

			// ================= GET TEACHER NAME =================
			const teacherResult = await pool.query(
				"SELECT full_name FROM teachers WHERE id = $1",
				[teacherId],
			);

			if (teacherResult.rows.length === 0) {
				return res.status(404).json({ error: "Teacher profile not found" });
			}

			const instructorName = teacherResult.rows[0].full_name;

			// ================= BODY =================
			const {
				title,
				description,
				category,
				level = "beginner",
				duration_hours = 0,
				price = 0,
				objectives,
				target_audience,
				courseContent,
				projects,
			} = req.body;

			const thumbnail = req.files?.thumbnail
				? req.files.thumbnail[0].path
				: null;

			const demo_video = req.files?.demo_video
				? req.files.demo_video[0].path
				: null;

			// Parse JSON fields
			let objectivesArray = [];
			let courseContentArray = [];
			let projectsArray = [];

			try {
				if (objectives) objectivesArray = JSON.parse(objectives);
				if (courseContent) courseContentArray = JSON.parse(courseContent);
				if (projects) projectsArray = JSON.parse(projects);
			} catch (parseError) {
				console.error("JSON parse error:", parseError);
				return res
					.status(400)
					.json({ error: "Invalid JSON format in request" });
			}

			// ================= INSERT COURSE =================
			const result = await pool.query(
				`INSERT INTO courses
        (title, description, category, level, duration_hours, price,
         thumbnail_url, demo_video_url, teacher_id, instructor_name,
         objectives, target_audience, approval_status, is_published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pending',false)
       RETURNING *`,
				[
					title,
					description,
					category,
					level,
					duration_hours || 0,
					price || 0,
					thumbnail,
					demo_video,
					teacherId, // ✅ Use teacherId
					instructorName,
					objectivesArray,
					target_audience || "",
				],
			);

			const courseId = result.rows[0].id;

			// Insert course content (sections)
			if (courseContentArray && courseContentArray.length > 0) {
				for (let i = 0; i < courseContentArray.length; i++) {
					const section = courseContentArray[i];
					if (section.section_title && section.section_title.trim()) {
						await pool.query(
							`INSERT INTO course_content 
							(course_id, section_number, section_title, subsections) 
							VALUES ($1, $2, $3, $4)`,
							[
								courseId,
								i + 1,
								section.section_title,
								JSON.stringify(section.subsections || []),
							],
						);
					}
				}
			}

			// Insert course projects
			if (projectsArray && projectsArray.length > 0) {
				for (const project of projectsArray) {
					if (project.project_title && project.project_title.trim()) {
						await pool.query(
							`INSERT INTO course_projects 
							(course_id, project_title, project_description, difficulty_level) 
							VALUES ($1, $2, $3, $4)`,
							[
								courseId,
								project.project_title,
								project.project_description || "",
								project.difficulty_level || "beginner",
							],
						);
					}
				}
			}

			res.status(201).json({
				course: result.rows[0],
				message: "Course created successfully! Waiting for admin approval.",
			});
		} catch (err) {
			console.error("CREATE course error:", err);
			console.error("Error stack:", err.stack);
			res.status(500).json({
				error: "Server error",
				details: err.message,
			});
		}
	},
);

// ================= UPDATE COURSE =================
router.put(
	"/:id",
	authMiddleware,
	upload.fields([
		{ name: "thumbnail", maxCount: 1 },
		{ name: "demo_video", maxCount: 1 },
	]),
	async (req, res) => {
		try {
			const { teacherId, role } = req.user;
			if (role !== "teacher") {
				return res.status(403).json({ error: "Forbidden" });
			}

			if (!teacherId) {
				return res.status(400).json({ error: "Teacher ID missing" });
			}

			const { id } = req.params;
			const { title, description, category, level, duration_hours, price } =
				req.body;

			// ✅ FIX: Use teacher_id
			const checkResult = await pool.query(
				"SELECT * FROM courses WHERE id = $1 AND teacher_id = $2",
				[id, teacherId],
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
				`UPDATE courses SET
         title=$1, description=$2, category=$3, level=$4,
         duration_hours=$5, price=$6,
         thumbnail_url=$7, demo_video_url=$8,
         updated_at=CURRENT_TIMESTAMP
       WHERE id=$9 AND teacher_id=$10
       RETURNING *`,
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
					teacherId, // ✅ Use teacherId
				],
			);

			res.json({ course: result.rows[0] });
		} catch (err) {
			console.error("UPDATE course error:", err);
			res.status(500).json({ error: "Server error" });
		}
	},
);

// ================= DELETE COURSE =================
router.delete("/:id", authMiddleware, async (req, res) => {
	try {
		const { teacherId, role } = req.user;
		if (role !== "teacher") {
			return res.status(403).json({ error: "Forbidden" });
		}

		if (!teacherId) {
			return res.status(400).json({ error: "Teacher ID missing" });
		}

		const { id } = req.params;

		// ✅ FIX: Use teacher_id
		const result = await pool.query(
			"DELETE FROM courses WHERE id = $1 AND teacher_id = $2 RETURNING *",
			[id, teacherId],
		);

		if (result.rows.length === 0) {
			return res
				.status(404)
				.json({ error: "Course not found or unauthorized" });
		}

		res.json({ message: "Course deleted successfully" });
	} catch (err) {
		console.error("DELETE course error:", err);
		res.status(500).json({ error: "Server error" });
	}
});

export default router;
