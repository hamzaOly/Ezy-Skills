import { useState, useEffect } from "react";
import axios from "axios";
import CourseEnrollmentModal from "../components/Coursesenrollmentmodal.jsx";
import { Link } from "react-router-dom";

export default function CourseList() {
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState("Popular Class");
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

	useEffect(() => {
		const fetch = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/courses/public",
				);
				console.log("Fetched courses:", response.data);
				setCourses(response.data.courses || []);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching courses:", error);
				console.error("Error details:", error.response?.data || error.message);
				setLoading(false);
			}
		};
		fetch();
	}, []);

	const filteredCourses = courses.filter((course) => {
		const matchesSearch =
			course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.description?.toLowerCase().includes(searchQuery.toLowerCase());

		if (activeTab === "All") return matchesSearch;
		if (activeTab === "Opened") return matchesSearch && course.is_published;
		if (activeTab === "Coming Soon")
			return matchesSearch && !course.is_published;
		if (activeTab === "Archived") return false;
		return matchesSearch;
	});

	console.log("Total courses:", courses.length);
	console.log("Filtered courses:", filteredCourses.length);
	console.log("Active tab:", activeTab);

	const getDefaultThumbnail = (index) => {
		const colors = ["#003366", "#FF6600", "#00AA66", "#9900CC"];
		const icons = ["📚", "☁️", "⚡", "📊"];
		return {
			color: colors[index % colors.length],
			icon: icons[index % icons.length],
		};
	};

	const handleEnrollClick = (course) => {
		setSelectedCourse(course);
		setIsEnrollModalOpen(true);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-2xl">Loading courses...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<h1 className="text-4xl font-bold text-center mb-12">
					<span className="text-gray-800">Courses </span>
					<span className="text-orange-500">List</span>
				</h1>

				{/* Search and Tabs Section */}
				<div className="mb-8">
					{/* Search Bar */}
					<div className="mb-6">
						<div className="relative max-w-sm">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg
									className="h-5 w-5 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
							<input
								type="text"
								placeholder="Search The Course Here"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
							/>
						</div>
					</div>

					{/* Tabs and Sort */}
					<div className="flex items-center justify-between">
						{/* Tabs */}
						<div className="flex space-x-8">
							{["All", "Opened", "Coming Soon", "Archived"].map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`pb-2 font-medium transition-colors relative ${
										activeTab === tab
											? "text-orange-500"
											: "text-gray-600 hover:text-gray-900"
									}`}>
									{tab}
									{activeTab === tab && (
										<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
									)}
								</button>
							))}
						</div>

						{/* Sort Dropdown */}
						<div className="flex items-center space-x-2">
							<span className="text-sm text-gray-600">Sort by:</span>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
								<option>Popular Class</option>
								<option>Newest</option>
								<option>Price: Low to High</option>
								<option>Price: High to Low</option>
							</select>
						</div>
					</div>
				</div>

				{/* Courses Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{filteredCourses.length === 0 ? (
						<div className="col-span-full text-center py-12 text-gray-500">
							No courses found
						</div>
					) : (
						filteredCourses.map((course, index) => {
							const defaultTheme = getDefaultThumbnail(index);
							return (
								<div
									key={course.id}
									className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
									{/* Course Thumbnail */}
									<div
										className="h-48 flex items-center justify-center text-white"
										style={{ backgroundColor: defaultTheme.color }}>
										{course.thumbnail_url ? (
											<img
												src={`http://localhost:5000/${course.thumbnail_url}`}
												alt={course.title}
												className="w-full h-full object-cover"
											/>
										) : (
											<div className="text-6xl">{defaultTheme.icon}</div>
										)}
									</div>

									{/* Course Content */}
									<div className="p-6">
										<Link to={`/courses/${course.id}`}>
											<h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-orange-500 cursor-pointer">
												{course.title}
											</h3>
										</Link>
										<p className="text-sm text-gray-600 mb-4 line-clamp-3">
											{course.description || "No description available"}
										</p>

										{/* Action Buttons */}
										<div className="flex gap-2 mb-4">
											<button className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
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
												Live Demo
											</button>
											<button
												onClick={() => handleEnrollClick(course)}
												className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
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
												Enroll Now
											</button>
										</div>

										{/* Download Button */}
										<button
											onClick={() => handleEnrollClick(course)}
											className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
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

										{/* Price Tag */}
										{course.price > 0 && (
											<div className="mt-3 text-center">
												<span className="text-2xl font-bold text-orange-500">
													₹{course.price}
												</span>
											</div>
										)}
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>

			{/* Enrollment Modal */}
			<CourseEnrollmentModal
				isOpen={isEnrollModalOpen}
				onClose={() => setIsEnrollModalOpen(false)}
				course={selectedCourse}
			/>
		</div>
	);
}
