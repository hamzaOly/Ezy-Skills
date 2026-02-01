import { useState } from "react";

export default function TeacherCourseFormUpdated({ onCourseCreated }) {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "",
		level: "beginner",
		duration_hours: 0,
		price: 0,
		thumbnail: null,
		demo_video: null,
		// New fields
		objectives: [""],
		requirements: [""],
		target_audience: "",
		// Course content
		courseContent: [
			{ section_title: "", subsections: [{ title: "", duration: "" }] },
		],
		// Projects
		projects: [
			{
				project_title: "",
				project_description: "",
				difficulty_level: "beginner",
			},
		],
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Add objective
	const addObjective = () => {
		setFormData({
			...formData,
			objectives: [...formData.objectives, ""],
		});
	};

	// Remove objective
	const removeObjective = (index) => {
		setFormData({
			...formData,
			objectives: formData.objectives.filter((_, i) => i !== index),
		});
	};

	// Update objective
	const updateObjective = (index, value) => {
		const newObjectives = [...formData.objectives];
		newObjectives[index] = value;
		setFormData({ ...formData, objectives: newObjectives });
	};

	// Add content section
	const addContentSection = () => {
		setFormData({
			...formData,
			courseContent: [
				...formData.courseContent,
				{ section_title: "", subsections: [{ title: "", duration: "" }] },
			],
		});
	};

	// Add subsection
	const addSubsection = (sectionIndex) => {
		const newContent = [...formData.courseContent];
		newContent[sectionIndex].subsections.push({ title: "", duration: "" });
		setFormData({ ...formData, courseContent: newContent });
	};

	// Update subsection
	const updateSubsection = (sectionIndex, subsectionIndex, field, value) => {
		const newContent = [...formData.courseContent];
		newContent[sectionIndex].subsections[subsectionIndex][field] = value;
		setFormData({ ...formData, courseContent: newContent });
	};

	// Add project
	const addProject = () => {
		setFormData({
			...formData,
			projects: [
				...formData.projects,
				{
					project_title: "",
					project_description: "",
					difficulty_level: "beginner",
				},
			],
		});
	};

	// Remove project
	const removeProject = (index) => {
		setFormData({
			...formData,
			projects: formData.projects.filter((_, i) => i !== index),
		});
	};

	// Update project
	const updateProject = (index, field, value) => {
		const newProjects = [...formData.projects];
		newProjects[index][field] = value;
		setFormData({ ...formData, projects: newProjects });
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleFileChange = (e) => {
		const { name, files } = e.target;
		setFormData({ ...formData, [name]: files[0] });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess("");

		try {
			const token = localStorage.getItem("token");
			const formDataToSend = new FormData();

			// Basic course info
			formDataToSend.append("title", formData.title);
			formDataToSend.append("description", formData.description);
			formDataToSend.append("category", formData.category);
			formDataToSend.append("level", formData.level);
			formDataToSend.append("duration_hours", formData.duration_hours || 0);
			formDataToSend.append("price", formData.price);

			// Files (optional)
			if (formData.thumbnail) {
				formDataToSend.append("thumbnail", formData.thumbnail);
			}
			if (formData.demo_video) {
				formDataToSend.append("demo_video", formData.demo_video);
			}

			// New fields (optional)
			formDataToSend.append(
				"objectives",
				JSON.stringify(formData.objectives.filter((o) => o.trim())),
			);
			formDataToSend.append("target_audience", formData.target_audience);
			formDataToSend.append(
				"courseContent",
				JSON.stringify(formData.courseContent),
			);
			formDataToSend.append(
				"projects",
				JSON.stringify(formData.projects.filter((p) => p.project_title.trim())),
			);

			const response = await fetch(
				"http://localhost:5000/api/teacher-courses",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formDataToSend,
				},
			);

			if (!response.ok) {
				throw new Error("Failed to create course");
			}

			setSuccess("Course created successfully! Waiting for admin approval.");
			// Reset form
			setFormData({
				title: "",
				description: "",
				category: "",
				level: "beginner",
				duration_hours: 0,
				price: 0,
				thumbnail: null,
				demo_video: null,
				objectives: [""],
				requirements: [""],
				target_audience: "",
				courseContent: [
					{ section_title: "", subsections: [{ title: "", duration: "" }] },
				],
				projects: [
					{
						project_title: "",
						project_description: "",
						difficulty_level: "beginner",
					},
				],
			});

			if (onCourseCreated) {
				onCourseCreated();
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
			<h2 className="text-2xl font-bold mb-6">Create New Course</h2>

			{error && (
				<div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
					{error}
				</div>
			)}
			{success && (
				<div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
					{success}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Basic Info */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium mb-2">
							Course Title *
						</label>
						<input
							type="text"
							name="title"
							value={formData.title}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">Category *</label>
						<input
							type="text"
							name="category"
							value={formData.category}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">Level</label>
						<select
							name="level"
							value={formData.level}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500">
							<option value="beginner">Beginner</option>
							<option value="intermediate">Intermediate</option>
							<option value="advanced">Advanced</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">Price (₹)</label>
						<input
							type="number"
							name="price"
							value={formData.price}
							onChange={handleInputChange}
							className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium mb-2">
						Description *
					</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleInputChange}
						rows="4"
						className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
						required
					/>
				</div>

				{/* Objectives */}
				<div>
					<label className="block text-sm font-medium mb-2">
						Learning Objectives
					</label>
					{formData.objectives.map((objective, index) => (
						<div key={index} className="flex gap-2 mb-2">
							<input
								type="text"
								value={objective}
								onChange={(e) => updateObjective(index, e.target.value)}
								placeholder="e.g., Learn Angular basics"
								className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
							/>
							<button
								type="button"
								onClick={() => removeObjective(index)}
								className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
								✕
							</button>
						</div>
					))}
					<button
						type="button"
						onClick={addObjective}
						className="text-sm text-orange-500 hover:text-orange-600">
						+ Add Objective
					</button>
				</div>

				{/* Course Content */}
				<div>
					<label className="block text-sm font-medium mb-2">
						Course Content (Curriculum)
					</label>
					{formData.courseContent.map((section, sectionIndex) => (
						<div key={sectionIndex} className="mb-4 p-4 border rounded-lg">
							<input
								type="text"
								value={section.section_title}
								onChange={(e) => {
									const newContent = [...formData.courseContent];
									newContent[sectionIndex].section_title = e.target.value;
									setFormData({ ...formData, courseContent: newContent });
								}}
								placeholder="Section title (e.g., HTML)"
								className="w-full px-4 py-2 border rounded-lg mb-2 focus:ring-2 focus:ring-orange-500"
							/>

							{section.subsections.map((sub, subIndex) => (
								<div key={subIndex} className="flex gap-2 ml-4 mb-2">
									<input
										type="text"
										value={sub.title}
										onChange={(e) =>
											updateSubsection(
												sectionIndex,
												subIndex,
												"title",
												e.target.value,
											)
										}
										placeholder="Subsection (e.g., Introduction)"
										className="flex-1 px-3 py-1 border rounded text-sm"
									/>
									<input
										type="text"
										value={sub.duration}
										onChange={(e) =>
											updateSubsection(
												sectionIndex,
												subIndex,
												"duration",
												e.target.value,
											)
										}
										placeholder="Duration"
										className="w-24 px-3 py-1 border rounded text-sm"
									/>
								</div>
							))}

							<button
								type="button"
								onClick={() => addSubsection(sectionIndex)}
								className="text-xs text-blue-500 hover:text-blue-600 ml-4">
								+ Add Subsection
							</button>
						</div>
					))}
					<button
						type="button"
						onClick={addContentSection}
						className="text-sm text-orange-500 hover:text-orange-600">
						+ Add Section
					</button>
				</div>

				{/* Projects */}
				<div>
					<label className="block text-sm font-medium mb-2">
						Course Projects
					</label>
					{formData.projects.map((project, index) => (
						<div key={index} className="mb-4 p-4 border rounded-lg">
							<div className="flex justify-between mb-2">
								<input
									type="text"
									value={project.project_title}
									onChange={(e) =>
										updateProject(index, "project_title", e.target.value)
									}
									placeholder="Project title"
									className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
								/>
								<button
									type="button"
									onClick={() => removeProject(index)}
									className="ml-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
									✕
								</button>
							</div>
							<textarea
								value={project.project_description}
								onChange={(e) =>
									updateProject(index, "project_description", e.target.value)
								}
								placeholder="Project description"
								rows="2"
								className="w-full px-4 py-2 border rounded-lg mb-2 focus:ring-2 focus:ring-orange-500"
							/>
							<select
								value={project.difficulty_level}
								onChange={(e) =>
									updateProject(index, "difficulty_level", e.target.value)
								}
								className="px-4 py-2 border rounded-lg">
								<option value="beginner">Beginner</option>
								<option value="intermediate">Intermediate</option>
								<option value="advanced">Advanced</option>
							</select>
						</div>
					))}
					<button
						type="button"
						onClick={addProject}
						className="text-sm text-orange-500 hover:text-orange-600">
						+ Add Project
					</button>
				</div>

				{/* Files (Optional) */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium mb-2">
							Thumbnail (Optional)
						</label>
						<input
							type="file"
							name="thumbnail"
							accept="image/*"
							onChange={handleFileChange}
							className="w-full px-4 py-2 border rounded-lg"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">
							Demo Video (Optional)
						</label>
						<input
							type="file"
							name="demo_video"
							accept="video/*"
							onChange={handleFileChange}
							className="w-full px-4 py-2 border rounded-lg"
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:bg-gray-400">
					{loading ? "Creating..." : "Create Course"}
				</button>
			</form>
		</div>
	);
}
