import { useState } from "react";
import logo from "../assets/logo.png";
import axios from "axios";

export default function CourseEnrollmentModal({ isOpen, onClose, course }) {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState({
		userName: "",
		phoneNumber: "",
		email: "",
		description: "",
		agreeToPrivacy: false,
	});
	const [loading, setLoading] = useState(false);

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const handleNext = () => {
		if (currentStep < 4) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleDownloadCurriculum = async () => {
		try {
			setLoading(true);
			// Submit enrollment request
			const response = await axios.post(
				"http://localhost:5000/api/enrollments",
				{
					courseId: course.id,
					userName: formData.userName,
					email: formData.email,
					phoneNumber: formData.phoneNumber,
					description: formData.description,
				},
			);

			if (response.status === 201) {
				// Move to email preview step
				setCurrentStep(3);
			}
		} catch (error) {
			console.error("Enrollment error:", error);
			alert("Failed to submit enrollment");
		} finally {
			setLoading(false);
		}
	};

	const handleFinalSubmit = () => {
		// Move to success step
		setCurrentStep(4);
	};

	const handleClose = () => {
		setCurrentStep(1);
		setFormData({
			userName: "",
			phoneNumber: "",
			email: "",
			description: "",
			agreeToPrivacy: false,
		});
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
				{/* Step 1: Curriculum Form */}
				{currentStep === 1 && (
					<div>
						{/* Header */}
						<div className="bg-blue-900 text-white p-6 rounded-t-2xl relative">
							<button
								onClick={handleClose}
								className="absolute top-4 right-4 text-white hover:text-gray-300">
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
							<div className="flex items-center justify-end mb-4">
								<img src={logo} alt="EZY Skills" className="h-12" />
							</div>
							<h2 className="text-3xl font-bold">
								<span className="text-white">Curriculum </span>
								<span className="text-orange-500">Form</span>
							</h2>
						</div>

						{/* Form Content */}
						<div className="p-8">
							<div className="space-y-6">
								{/* Course Enquiry */}
								<div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-200">
									<label className="text-orange-500 font-semibold">
										Course Enquiry
									</label>
									<div className="col-span-2 text-gray-700">
										{course?.title || "Course Title"}
									</div>
								</div>

								{/* User Name */}
								<div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-200">
									<label className="text-orange-500 font-semibold">
										User Name
									</label>
									<div className="col-span-2">
										<input
											type="text"
											name="userName"
											value={formData.userName}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
											placeholder="Enter your name"
											required
										/>
									</div>
								</div>

								{/* Phone Number */}
								<div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-200">
									<label className="text-orange-500 font-semibold">
										Phone Number
									</label>
									<div className="col-span-2">
										<input
											type="tel"
											name="phoneNumber"
											value={formData.phoneNumber}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
											placeholder="Enter phone number"
											required
										/>
									</div>
								</div>

								{/* Email ID */}
								<div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-200">
									<label className="text-orange-500 font-semibold">
										Email ID
									</label>
									<div className="col-span-2">
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
											placeholder="Enter your email"
											required
										/>
									</div>
								</div>

								{/* Description */}
								<div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-200">
									<label className="text-orange-500 font-semibold">
										Description
									</label>
									<div className="col-span-2">
										<textarea
											name="description"
											value={formData.description}
											onChange={handleInputChange}
											rows="4"
											className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
											placeholder="Tell us about yourself..."
										/>
									</div>
								</div>
							</div>

							<p className="text-blue-900 font-semibold mt-8 mb-4">
								Please find the attachment below
							</p>

							<button
								onClick={handleNext}
								className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold">
								Continue to Download
							</button>
						</div>
					</div>
				)}

				{/* Step 2: Download Modal */}
				{currentStep === 2 && (
					<div className="relative">
						<button
							onClick={handleClose}
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10">
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>

						{/* Course Header */}
						<div className="bg-blue-900 text-white p-6 rounded-t-2xl flex items-center gap-4">
							<img
								src={
									course?.thumbnail_url
										? `http://localhost:5000/${course.thumbnail_url}`
										: "/path-to-default-course-icon.png"
								}
								alt={course?.title}
								className="w-16 h-16 rounded-lg object-cover"
							/>
							<h3 className="text-2xl font-bold">
								{course?.title || "Course Title"}
							</h3>
						</div>

						{/* Form */}
						<div className="p-8">
							<div className="space-y-4 mb-6">
								<div>
									<label className="block text-sm font-medium text-blue-900 mb-2">
										Your name*
									</label>
									<input
										type="text"
										name="userName"
										value={formData.userName}
										onChange={handleInputChange}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-blue-900 mb-2">
										Email*
									</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleInputChange}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-blue-900 mb-2">
										Mobile Number*
									</label>
									<div className="flex gap-2">
										<select className="px-3 py-3 border border-gray-300 rounded-lg bg-white">
											<option>+91</option>
										</select>
										<input
											type="tel"
											name="phoneNumber"
											value={formData.phoneNumber}
											onChange={handleInputChange}
											className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
											required
										/>
									</div>
								</div>

								<div className="flex items-start gap-2">
									<input
										type="checkbox"
										name="agreeToPrivacy"
										checked={formData.agreeToPrivacy}
										onChange={handleInputChange}
										className="mt-1"
									/>
									<label className="text-sm text-gray-600">
										By providing your contact details, you agree to our{" "}
										<a
											href="/privacy-policy"
											className="text-orange-500 hover:underline">
											Privacy Policy
										</a>
									</label>
								</div>
							</div>

							<button
								onClick={handleDownloadCurriculum}
								disabled={!formData.agreeToPrivacy || loading}
								className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed">
								{loading ? "Processing..." : "Download Now"}
							</button>
						</div>
					</div>
				)}

				{/* Step 3: Email Preview */}
				{currentStep === 3 && (
					<div className="p-8">
						<button
							onClick={handleClose}
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>

						<img
							src="/path-to-logo.png"
							alt="EZY Skills"
							className="h-12 mb-8"
						/>

						<div className="space-y-4 text-gray-700">
							<p>Dear Sir/Madam,</p>

							<p>We thank you for your interest in Ezy Skills.</p>

							<p>
								In the meanwhile, we would like to take this oppurtunity in
								congratulating you for initiating the fiorst step towards
								choosing your career. We wish you the best for your future.
							</p>

							<p>
								Please feel free too reach ou to mus for any further concerns ir
								queries.
							</p>

							<p>
								Cheers,
								<br />
								EzySkill Team
							</p>

							<p className="font-semibold">Please fond the attachment below</p>
						</div>

						<div className="mt-8 pt-6 border-t border-gray-200">
							<p className="text-sm text-gray-500 mb-2">
								This email was sent to{" "}
								<span className="text-orange-500">{formData.email}</span>. If
								you'd rather not receive this kind of email, you can{" "}
								<a href="#" className="text-orange-500 hover:underline">
									unsubscribe
								</a>{" "}
								or{" "}
								<a href="#" className="text-orange-500 hover:underline">
									manage your email preferences
								</a>
								.
							</p>
							<p className="text-sm text-gray-500">
								Stripe, 510 Townsend Street, San Francisco CA 94103
							</p>
						</div>

						<div className="flex items-center justify-between mt-6">
							<img src="/path-to-logo.png" alt="EZY Skills" className="h-10" />
							<div className="flex gap-4">
								<a href="#" className="text-orange-500 hover:text-orange-600">
									<svg
										className="w-6 h-6"
										fill="currentColor"
										viewBox="0 0 24 24">
										<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
									</svg>
								</a>
								<a href="#" className="text-orange-500 hover:text-orange-600">
									<svg
										className="w-6 h-6"
										fill="currentColor"
										viewBox="0 0 24 24">
										<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
									</svg>
								</a>
								<a href="#" className="text-orange-500 hover:text-orange-600">
									<svg
										className="w-6 h-6"
										fill="currentColor"
										viewBox="0 0 24 24">
										<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
									</svg>
								</a>
							</div>
						</div>

						<button
							onClick={handleFinalSubmit}
							className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold mt-8">
							Continue
						</button>
					</div>
				)}

				{/* Step 4: Success Message */}
				{currentStep === 4 && (
					<div className="p-12 text-center">
						<div className="inline-flex items-center justify-center w-24 h-24 bg-green-400 rounded-full mb-6">
							<svg
								className="w-12 h-12 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={3}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>

						<h3 className="text-2xl font-bold text-gray-900 mb-2">
							Thanks for your interest
						</h3>
						<p className="text-gray-600 mb-8">we will get back to you soon</p>

						<button
							onClick={handleClose}
							className="px-12 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold">
							Ok
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
