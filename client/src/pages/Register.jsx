import { useState } from "react";
import { register } from "../services/authService";
import { Link } from "react-router-dom";

export default function Register() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Validation
		if (!formData.email || !formData.password || !formData.confirmPassword) {
			setError("All fields are required");
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (formData.password.length < 6) {
			setError("Password must be at least 6 characters");
			return;
		}

		try {
			setLoading(true);
			await register(formData.email, formData.password);
			// Redirect to home page and reload to update navbar
			window.location.href = "/";
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
				{/* Left Side - Form */}
				<div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 max-w-md mx-auto w-full">
					<h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
						<span className="text-blue-900">Create </span>
						<span className="text-orange-500">Account</span>
					</h1>

					{error && (
						<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
							{error}
						</div>
					)}

					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Email Address"
								className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors text-gray-700 placeholder-gray-400"
								required
							/>
						</div>

						<div>
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Password"
								className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors text-gray-700 placeholder-gray-400"
								required
							/>
						</div>

						<div>
							<input
								type="password"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								placeholder="Confirm Password"
								className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors text-gray-700 placeholder-gray-400"
								required
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className={`w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-200 ${
								loading ? "opacity-50 cursor-not-allowed" : ""
							}`}>
							{loading ? "Creating Account..." : "Create Account"}
						</button>
						<Link to="/register/teacher">
							<button
								type="button"
								className=" w-full px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors font-semibold">
								Create Teacher Account
							</button>
						</Link>

						<p className="p-2 text-center text-sm text-gray-600">
							Already Created?{" "}
							<a href="/login" className="text-blue-600 hover:underline">
								Login Here
							</a>
						</p>
					</form>
				</div>

				{/* Right Side - Illustration */}
				<div className="hidden lg:block">
					<img
						alt="Create account illustration"
						className="w-full h-auto max-w-2xl mx-auto"
						style={{ minHeight: "500px" }}
					/>
				</div>
			</div>
		</div>
	);
}
