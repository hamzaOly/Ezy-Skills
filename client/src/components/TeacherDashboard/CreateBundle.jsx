import { useState, useEffect } from "react";
import axios from "axios";

export default function CreateBundle() {
	const [courses, setCourses] = useState([]);
	const [selectedCourses, setSelectedCourses] = useState([]);
	const [bundleData, setBundleData] = useState({
		title: "",
		description: "",
		discount_percentage: 0,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Fetch approved courses
	useEffect(() => {
		const fetchTeacherCourses = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(
					"http://localhost:5000/api/teacher-courses",
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);

				const approvedCourses = response.data.courses.filter(
					(c) => c.approval_status === "approved",
				);

				setCourses(approvedCourses);
			} catch (err) {
				console.error("Error fetching courses:", err);
				setError("Failed to load courses");
			} finally {
				setLoading(false);
			}
		};

		fetchTeacherCourses();
	}, []);

	const handleCourseSelect = (course) => {
		if (selectedCourses.find((c) => c.id === course.id)) {
			setSelectedCourses(selectedCourses.filter((c) => c.id !== course.id));
		} else if (selectedCourses.length < 3) {
			setSelectedCourses([...selectedCourses, course]);
		} else {
			alert("You can only select 3 courses for a bundle");
		}
	};

	const calculateTotalPrice = () => {
		return selectedCourses.reduce(
			(sum, course) => sum + parseFloat(course.price),
			0,
		);
	};

	const calculateDiscountedPrice = () => {
		const total = calculateTotalPrice();
		return total - total * (bundleData.discount_percentage / 100);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		if (selectedCourses.length !== 3) {
			setError("Please select exactly 3 courses");
			setLoading(false);
			return;
		}

		if (!bundleData.title || !bundleData.description) {
			setError("Please fill in all fields");
			setLoading(false);
			return;
		}

		try {
			const token = localStorage.getItem("token");

			await axios.post(
				"http://localhost:5000/api/teacher-bundles",
				{
					title: bundleData.title,
					description: bundleData.description,
					course_ids: selectedCourses.map((c) => c.id),
					discount_percentage: bundleData.discount_percentage,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);

			setSuccess("Bundle created successfully! Waiting for admin approval.");

			// Reset form
			setSelectedCourses([]);
			setBundleData({
				title: "",
				description: "",
				discount_percentage: 0,
			});
		} catch (err) {
			console.error("Error creating bundle:", err);
			setError(err.response?.data?.error || "Failed to create bundle");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-2xl">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Create Course Bundle
					</h1>
					<p className="text-lg text-gray-600">
						Select 3 courses to create a special bundle deal for students
					</p>
				</div>

				{/* Error/Success Messages */}
				{error && (
					<div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
						{error}
					</div>
				)}
				{success && (
					<div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
						{success}
					</div>
				)}

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left: Course Selection */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-2xl shadow-lg p-6">
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								Your Approved Courses
								<span className="text-sm font-normal text-gray-500 ml-2">
									(Select 3 courses)
								</span>
							</h2>

							{courses.length === 0 ? (
								<div className="text-center py-12 text-gray-500">
									<p>No approved courses available.</p>
									<p className="text-sm mt-2">
										Create and get courses approved first.
									</p>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{courses.map((course) => (
										<div
											key={course.id}
											onClick={() => handleCourseSelect(course)}
											className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
												selectedCourses.find((c) => c.id === course.id)
													? "border-orange-500 bg-orange-50"
													: "border-gray-200 hover:border-orange-300"
											}`}>
											<div className="flex items-start justify-between mb-2">
												<h3 className="font-semibold text-gray-900 flex-1 pr-2">
													{course.title}
												</h3>
												<div
													className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
														selectedCourses.find((c) => c.id === course.id)
															? "border-orange-500 bg-orange-500"
															: "border-gray-300"
													}`}>
													{selectedCourses.find((c) => c.id === course.id) && (
														<svg
															className="w-4 h-4 text-white"
															fill="currentColor"
															viewBox="0 0 20 20">
															<path
																fillRule="evenodd"
																d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
																clipRule="evenodd"
															/>
														</svg>
													)}
												</div>
											</div>
											<p className="text-sm text-gray-600 mb-3 line-clamp-2">
												{course.description}
											</p>
											<div className="flex items-center justify-between">
												<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
													{course.category}
												</span>
												<span className="text-lg font-bold text-orange-500">
													₹{course.price}
												</span>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Right: Bundle Details */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
							<h2 className="text-xl font-bold text-gray-900 mb-6">
								Bundle Details
							</h2>

							<form onSubmit={handleSubmit} className="space-y-4">
								{/* Bundle Title */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Bundle Title *
									</label>
									<input
										type="text"
										value={bundleData.title}
										onChange={(e) =>
											setBundleData({ ...bundleData, title: e.target.value })
										}
										placeholder="e.g., Full Stack Developer Bundle"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										required
									/>
								</div>

								{/* Bundle Description */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Description *
									</label>
									<textarea
										value={bundleData.description}
										onChange={(e) =>
											setBundleData({
												...bundleData,
												description: e.target.value,
											})
										}
										placeholder="Describe what students will learn..."
										rows="3"
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										required
									/>
								</div>

								{/* Discount Percentage */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Discount % (0-100)
									</label>
									<input
										type="number"
										min="0"
										max="100"
										value={bundleData.discount_percentage}
										onChange={(e) =>
											setBundleData({
												...bundleData,
												discount_percentage: parseFloat(e.target.value),
											})
										}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									/>
								</div>

								{/* Selected Courses Summary */}
								<div className="bg-gray-50 rounded-lg p-4 space-y-2">
									<h3 className="font-semibold text-gray-900 mb-3">
										Selected Courses ({selectedCourses.length}/3)
									</h3>
									{selectedCourses.length === 0 ? (
										<p className="text-sm text-gray-500">
											No courses selected yet
										</p>
									) : (
										<>
											{selectedCourses.map((course, index) => (
												<div
													key={course.id}
													className="flex justify-between items-center text-sm">
													<span className="text-gray-700">
														{index + 1}. {course.title}
													</span>
													<span className="font-semibold">₹{course.price}</span>
												</div>
											))}
											<div className="border-t border-gray-300 pt-2 mt-2">
												<div className="flex justify-between text-sm mb-1">
													<span className="text-gray-600">Total Price:</span>
													<span className="font-semibold">
														₹{calculateTotalPrice().toFixed(2)}
													</span>
												</div>
												{bundleData.discount_percentage > 0 && (
													<>
														<div className="flex justify-between text-sm text-green-600">
															<span>
																Discount ({bundleData.discount_percentage}%):
															</span>
															<span>
																-₹
																{(
																	calculateTotalPrice() -
																	calculateDiscountedPrice()
																).toFixed(2)}
															</span>
														</div>
														<div className="flex justify-between text-lg font-bold text-orange-500 mt-2">
															<span>Bundle Price:</span>
															<span>
																₹{calculateDiscountedPrice().toFixed(2)}
															</span>
														</div>
													</>
												)}
											</div>
										</>
									)}
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									disabled={selectedCourses.length !== 3}
									className={`w-full py-3 rounded-lg font-semibold transition-colors ${
										selectedCourses.length === 3
											? "bg-orange-500 text-white hover:bg-orange-600"
											: "bg-gray-300 text-gray-500 cursor-not-allowed"
									}`}>
									Create Bundle
								</button>

								<p className="text-xs text-gray-500 text-center">
									Bundle will be sent to admin for approval
								</p>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
