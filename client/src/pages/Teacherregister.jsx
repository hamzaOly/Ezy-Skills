import { useState } from "react";

export default function TeacherRegister() {
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState({
		// Account Info (Step 1)
		email: "",
		password: "",
		confirmPassword: "",

		// Personal Info (Step 2)
		full_name: "",
		phone: "",
		bio: "",

		// Professional Info (Step 3)
		specialization: "",
		years_of_experience: "",
		education: "",
		linkedin_url: "",
		website_url: "",
		hourly_rate: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const validateStep1 = () => {
		if (!formData.email || !formData.password || !formData.confirmPassword) {
			setError("All fields are required");
			return false;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			setError("Invalid email format");
			return false;
		}

		if (formData.password.length < 6) {
			setError("Password must be at least 6 characters");
			return false;
		}

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return false;
		}

		return true;
	};

	const validateStep2 = () => {
		if (!formData.full_name || !formData.phone || !formData.bio) {
			setError("Please fill in all required fields");
			return false;
		}

		if (formData.bio.length < 50) {
			setError("Bio must be at least 50 characters");
			return false;
		}

		return true;
	};

	const validateStep3 = () => {
		if (
			!formData.specialization ||
			!formData.years_of_experience ||
			!formData.education
		) {
			setError("Please fill in all required fields");
			return false;
		}

		if (
			isNaN(formData.years_of_experience) ||
			formData.years_of_experience < 0
		) {
			setError("Please enter valid years of experience");
			return false;
		}

		return true;
	};

	const handleNext = () => {
		setError("");

		if (step === 1 && validateStep1()) {
			setStep(2);
		} else if (step === 2 && validateStep2()) {
			setStep(3);
		}
	};

	const handleBack = () => {
		setError("");
		setStep(step - 1);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!validateStep3()) {
			return;
		}

		try {
			setLoading(true);

			// Call your backend API here
			const response = await fetch(
				"http://localhost:5000/api/auth/teacher/register",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formData),
				},
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Registration failed");
			}

			// Save token and redirect
			localStorage.setItem("token", data.token);
			localStorage.setItem("user", JSON.stringify(data.user));
			window.location.href = "/teacher-dashboard";
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold mb-2">
						<span className="text-blue-900">Become a </span>
						<span className="text-orange-500">Teacher</span>
					</h1>
					<p className="text-gray-600">
						Share your knowledge and earn money teaching online
					</p>
				</div>

				{/* Progress Steps */}
				<div className="mb-8">
					<div className="flex items-center justify-center">
						{[1, 2, 3].map((s) => (
							<div key={s} className="flex items-center">
								<div
									className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
										step >= s
											? "bg-orange-500 border-orange-500 text-white"
											: "bg-white border-gray-300 text-gray-500"
									}`}>
									{s}
								</div>
								{s < 3 && (
									<div
										className={`w-24 h-1 mx-2 ${
											step > s ? "bg-orange-500" : "bg-gray-300"
										}`}></div>
								)}
							</div>
						))}
					</div>
					<div className="flex justify-center mt-2 space-x-24">
						<span className="text-xs text-gray-600">Account</span>
						<span className="text-xs text-gray-600">Personal</span>
						<span className="text-xs text-gray-600">Professional</span>
					</div>
				</div>

				{/* Form Card */}
				<div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12">
					{/* Error Message */}
					{error && (
						<div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit}>
						{/* Step 1: Account Information */}
						{step === 1 && (
							<div className="space-y-6">
								<h2 className="text-2xl font-bold text-gray-800 mb-6">
									Account Information
								</h2>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Email Address *
									</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										placeholder="teacher@example.com"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Password *
									</label>
									<input
										type="password"
										name="password"
										value={formData.password}
										onChange={handleChange}
										placeholder="Minimum 6 characters"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Confirm Password *
									</label>
									<input
										type="password"
										name="confirmPassword"
										value={formData.confirmPassword}
										onChange={handleChange}
										placeholder="Re-enter your password"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										required
									/>
								</div>

								<button
									type="button"
									onClick={handleNext}
									className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
									Next Step
								</button>
							</div>
						)}

						{/* Step 2: Personal Information */}
						{step === 2 && (
							<div className="space-y-6">
								<h2 className="text-2xl font-bold text-gray-800 mb-6">
									Personal Information
								</h2>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Full Name *
									</label>
									<input
										type="text"
										name="full_name"
										value={formData.full_name}
										onChange={handleChange}
										placeholder="John Doe"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Phone Number *
									</label>
									<input
										type="tel"
										name="phone"
										value={formData.phone}
										onChange={handleChange}
										placeholder="+962"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Bio / About Yourself * (minimum 50 characters)
									</label>
									<textarea
										name="bio"
										value={formData.bio}
										onChange={handleChange}
										placeholder="Tell students about yourself, your experience, and why you're passionate about teaching..."
										rows="5"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										required
									/>
									<p className="text-xs text-gray-500 mt-1">
										{formData.bio.length} / 50 characters minimum
									</p>
								</div>

								<div className="flex gap-4">
									<button
										type="button"
										onClick={handleBack}
										className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
										Back
									</button>
									<button
										type="button"
										onClick={handleNext}
										className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
										Next Step
									</button>
								</div>
							</div>
						)}

						{/* Step 3: Professional Information */}
						{step === 3 && (
							<div className="space-y-6">
								<h2 className="text-2xl font-bold text-gray-800 mb-6">
									Professional Information
								</h2>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Specialization / Expertise *
									</label>
									<select
										name="specialization"
										value={formData.specialization}
										onChange={handleChange}
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										required>
										<option value="">Select your specialization</option>
										<option value="Web Development">Web Development</option>
										<option value="Data Science">Data Science</option>
										<option value="Mobile Development">
											Mobile Development
										</option>
										<option value="Cloud Computing">Cloud Computing</option>
										<option value="Cybersecurity">Cybersecurity</option>
										<option value="Business">Business</option>
										<option value="Design">Design</option>
										<option value="Marketing">Marketing</option>
										<option value="Other">Other</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Years of Experience *
									</label>
									<input
										type="number"
										name="years_of_experience"
										value={formData.years_of_experience}
										onChange={handleChange}
										placeholder="5"
										min="0"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Education / Qualifications *
									</label>
									<textarea
										name="education"
										value={formData.education}
										onChange={handleChange}
										placeholder="e.g., MSc Computer Science, Stanford University"
										rows="3"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										required
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										LinkedIn Profile (Optional)
									</label>
									<input
										type="url"
										name="linkedin_url"
										value={formData.linkedin_url}
										onChange={handleChange}
										placeholder="https://linkedin.com/in/yourprofile"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Personal Website (Optional)
									</label>
									<input
										type="url"
										name="website_url"
										value={formData.website_url}
										onChange={handleChange}
										placeholder="https://yourwebsite.com"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Hourly Rate (USD) - Optional
									</label>
									<input
										type="number"
										name="hourly_rate"
										value={formData.hourly_rate}
										onChange={handleChange}
										placeholder="50"
										min="0"
										step="0.01"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
									/>
								</div>

								<div className="flex gap-4">
									<button
										type="button"
										onClick={handleBack}
										className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
										Back
									</button>
									<button
										type="submit"
										disabled={loading}
										className={`flex-1 bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors ${
											loading ? "opacity-50 cursor-not-allowed" : ""
										}`}>
										{loading ? "Creating Account..." : "Complete Registration"}
									</button>
								</div>
							</div>
						)}
					</form>

					{/* Login Link */}
					<p className="text-center text-sm text-gray-600 mt-6">
						Already have an account?{" "}
						<a href="/login" className="text-blue-600 hover:underline">
							Login Here
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
