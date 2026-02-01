import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function CourseDetails() {
	const { courseId } = useParams();
	const [course, setCourse] = useState(null);
	const [courseContent, setCourseContent] = useState([]);
	const [projects, setProjects] = useState([]);
	const [expandedSections, setExpandedSections] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetch = async () => {
			try {
				const [courseRes, contentRes, projectsRes] = await Promise.all([
					axios.get(`http://localhost:5000/api/courses/${courseId}`),
					axios.get(`http://localhost:5000/api/courses/${courseId}/content`),
					axios.get(`http://localhost:5000/api/courses/${courseId}/projects`),
				]);

				setCourse(courseRes.data.course);
				setCourseContent(contentRes.data.content || []);
				setProjects(projectsRes.data.projects || []);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching course details:", error);
				setLoading(false);
			}
		};
		fetch();
	}, [courseId]);

	const toggleSection = (sectionId) => {
		setExpandedSections((prev) => ({
			...prev,
			[sectionId]: !prev[sectionId],
		}));
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-2xl">Loading course details...</div>
			</div>
		);
	}

	if (!course) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-2xl">Course not found</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column - About & Objectives */}
					<div className="lg:col-span-2 space-y-8">
						{/* About The Course */}
						<div className="bg-white rounded-2xl shadow-lg p-8">
							<h2 className="text-2xl font-bold mb-4">
								<span className="text-orange-500">About The Course</span>
							</h2>
							<p className="text-gray-700 leading-relaxed">
								{course.description || "No description available"}
							</p>
						</div>

						{/* Objectives */}
						<div className="bg-white rounded-2xl shadow-lg p-8">
							<h2 className="text-2xl font-bold mb-6">
								<span className="text-orange-500">Objectives</span>
							</h2>
							<div className="space-y-3">
								{course.objectives && course.objectives.length > 0 ? (
									course.objectives.map((objective, index) => (
										<div key={index} className="flex items-start gap-3">
											<div className="shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
												<svg
													className="w-4 h-4 text-green-600"
													fill="currentColor"
													viewBox="0 0 20 20">
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
											<p className="text-gray-700 flex-1">{objective}</p>
										</div>
									))
								) : (
									<p className="text-gray-500">No objectives listed</p>
								)}
							</div>
						</div>

						{/* Angular JS Projects */}
						<div className="bg-white rounded-2xl shadow-lg p-8">
							<h2 className="text-2xl font-bold mb-6">
								<span className="text-orange-500">{course.title} Projects</span>
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{projects.length > 0 ? (
									projects.map((project) => (
										<div
											key={project.id}
											className="border-2 border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors cursor-pointer">
											<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
												<img
													src="/path-to-angular-icon.png"
													alt=""
													className="w-8 h-8"
												/>
											</div>
											<h3 className="font-bold text-gray-900 text-sm mb-2">
												{project.project_title}
											</h3>
											<p className="text-xs text-gray-600 line-clamp-3">
												{project.project_description}
											</p>
										</div>
									))
								) : (
									<p className="text-gray-500 col-span-full">
										No projects available
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Right Column - Course Content */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
							{/* Decorative Dots */}
							<div className="absolute top-8 right-8 grid grid-cols-3 gap-1.5">
								{[...Array(21)].map((_, i) => (
									<div
										key={i}
										className="w-1.5 h-1.5 rounded-full bg-orange-400"
									/>
								))}
							</div>

							<h2 className="text-2xl font-bold mb-6">
								<span className="text-orange-500">Course Content</span>
							</h2>

							<div className="space-y-2">
								{courseContent.length > 0 ? (
									courseContent.map((section) => (
										<div
											key={section.id}
											className="border border-gray-200 rounded-lg overflow-hidden">
											<button
												onClick={() => toggleSection(section.id)}
												className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
												<span className="font-semibold text-blue-900">
													{String(section.section_number).padStart(2, "0")}{" "}
													{section.section_title}
												</span>
												<svg
													className={`w-5 h-5 text-gray-600 transition-transform ${
														expandedSections[section.id] ? "rotate-180" : ""
													}`}
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</button>

											{expandedSections[section.id] && section.subsections && (
												<div className="px-4 pb-4 bg-gray-50">
													<ul className="space-y-2 text-sm text-gray-600">
														{section.subsections.map((sub, idx) => (
															<li key={idx} className="flex items-center gap-2">
																<span className="text-orange-500">→</span>
																{sub.title}
																{sub.duration && (
																	<span className="text-xs text-gray-400 ml-auto">
																		{sub.duration}
																	</span>
																)}
															</li>
														))}
													</ul>
												</div>
											)}
										</div>
									))
								) : (
									<p className="text-gray-500 text-sm">No content available</p>
								)}
							</div>

							{/* Enroll Button */}
							<button className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold">
								Enroll Now - ₹{course.price || 0}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
