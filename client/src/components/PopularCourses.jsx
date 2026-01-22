import { useState, useEffect } from "react";

export default function PopularCourses() {
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await fetch(
					"http://localhost:5000/api/courses/public",
				);
				const data = await response.json();
				// Get first 8 courses
				setCourses(data.courses?.slice(0, 8) || []);
			} catch (error) {
				console.error("Error fetching courses:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCourses();
	}, []);

	const getCourseIcon = (index) => {
		const icons = [
			"🅰️", // Angular
			"☁️", // AWS
			"✓", // Vue
			"📊", // Power BI
			"🐍", // Python
			"⚛️", // React
			"✅", // Testing
			"C", // C/Core UI
		];
		return icons[index % icons.length];
	};

	if (loading) {
		return (
			<div className="py-16 text-center">
				<div className="text-xl text-gray-600">Loading courses...</div>
			</div>
		);
	}

	return (
		<div className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<h2 className="text-4xl font-bold text-center mb-12">
					<span className="text-blue-900">Popular </span>
					<span className="text-orange-500">Courses</span>
				</h2>

				{/* Courses Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{courses.map((course, index) => (
						<div
							key={course.id}
							className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
							{/* Course Icon/Thumbnail */}
							<div className="bg-blue-900 h-40 flex items-center justify-center">
								{course.thumbnail_url ? (
									<img
										src={`http://localhost:5000/${course.thumbnail_url}`}
										alt={course.title}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="text-6xl">{getCourseIcon(index)}</div>
								)}
							</div>

							{/* Course Content */}
							<div className="p-6">
								{/* Title */}
								<h3 className="text-xl font-bold text-gray-900 mb-3 min-h-14">
									{course.title}
								</h3>

								{/* Description */}
								<p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-16">
									{course.description ||
										"Enhance your skills with this comprehensive course."}
								</p>

								{/* Action Buttons */}
								<div className="flex gap-2 mb-4">
									<button className="flex-1 flex items-center justify-center gap-1 py-2 px-2 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50 transition-colors">
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										<span>Live Demo</span>
									</button>
									<button className="flex-1 flex items-center justify-center gap-1 py-2 px-2 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50 transition-colors">
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
										<span>Enroll Now</span>
									</button>
								</div>

								{/* Download Button */}
								<button className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm">
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
										/>
									</svg>
									Download Curriculum
								</button>
							</div>
						</div>
					))}
				</div>

				{/* View All Button */}
				<div className="text-center">
					<a href="/Courses">
						<button className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors text-sm">
							View All Courses
						</button>
					</a>
				</div>

				{/* No Courses Message */}
				{courses.length === 0 && !loading && (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">
							No courses available at the moment.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
