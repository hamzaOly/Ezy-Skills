// src/components/TeacherCourseForm.jsx
import { useState } from "react";

export default function TeacherCourseForm({ onCourseCreated }) {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		level: "beginner",
		duration_hours: "",
		price: "",
		thumbnail: null, // image file
		demo_video: null, // optional video file
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		if (files) {
			setFormData({ ...formData, [name]: files[0] });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Basic validation
		if (!formData.title || !formData.description || !formData.category) {
			setError("Title, description, and category are required.");
			return;
		}

		try {
			setLoading(true);

			const token = localStorage.getItem("token");
			const body = new FormData();
			for (const key in formData) {
				if (formData[key] !== null) {
					body.append(key, formData[key]);
				}
			}

			const response = await fetch(
				"http://localhost:5000/api/teacher-courses",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body,
				},
			);

			const data = await response.json();
			if (!response.ok)
				throw new Error(data.error || "Failed to create course");

			// Reset form
			setFormData({
				title: "",
				description: "",
				category: "",
				level: "beginner",
				duration_hours: "",
				price: "",
				thumbnail: null,
				demo_video: null,
			});

			// Call parent to refresh courses
			if (onCourseCreated) onCourseCreated();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white p-6 rounded-xl shadow-md">
			<h2 className="text-2xl font-bold mb-4">Create New Course</h2>
			{error && (
				<div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium">Title *</label>
					<input
						type="text"
						name="title"
						value={formData.title}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium">Description *</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						rows="4"
						className="w-full px-3 py-2 border rounded"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium">Category *</label>
					<select
						name="category"
						value={formData.category}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded"
						required>
						<option value="">Select Category</option>
						<option value="Web Development">Web Development</option>
						<option value="Data Science">Data Science</option>
						<option value="Mobile Development">Mobile Development</option>
						<option value="Cloud Computing">Cloud Computing</option>
						<option value="Cybersecurity">Cybersecurity</option>
						<option value="Business">Business</option>
						<option value="Design">Design</option>
						<option value="Marketing">Marketing</option>
						<option value="Other">Other</option>
					</select>
				</div>

				<div>
					<label className="block text-sm font-medium">Level</label>
					<select
						name="level"
						value={formData.level}
						onChange={handleChange}
						className="w-full px-3 py-2 border rounded">
						<option value="beginner">Beginner</option>
						<option value="intermediate">Intermediate</option>
						<option value="advanced">Advanced</option>
					</select>
				</div>

				<div className="flex gap-2">
					<div className="flex-1">
						<label className="block text-sm font-medium">
							Duration (hours)
						</label>
						<input
							type="number"
							name="duration_hours"
							value={formData.duration_hours}
							onChange={handleChange}
							className="w-full px-3 py-2 border rounded"
							min="0"
						/>
					</div>
					<div className="flex-1">
						<label className="block text-sm font-medium">Price (USD)</label>
						<input
							type="number"
							name="price"
							value={formData.price}
							onChange={handleChange}
							className="w-full px-3 py-2 border rounded"
							min="0"
							step="0.01"
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium">Thumbnail Image</label>
					<input
						type="file"
						name="thumbnail"
						accept="image/*"
						onChange={handleChange}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium">
						Optional Demo Video
					</label>
					<input
						type="file"
						name="demo_video"
						accept="video/*"
						onChange={handleChange}
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition">
					{loading ? "Creating..." : "Create Course"}
				</button>
			</form>
		</div>
	);
}
