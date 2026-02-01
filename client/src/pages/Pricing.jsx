import { useState, useEffect } from "react";
import axios from "axios";
import PaymentModal from "../components/Paymentmodal.jsx";

export default function Pricing() {
	const [bundles, setBundles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedBundle, setSelectedBundle] = useState(null);
	const [selectedProgramType, setSelectedProgramType] = useState("");
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

	useEffect(() => {
		const fetchBundles = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/bundles/public",
				);
				setBundles(response.data.bundles || []);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching bundles:", error);
				setLoading(false);
			}
		};
		fetchBundles();
	}, []);

	const handleChoosePlan = (bundle, programType) => {
		setSelectedBundle(bundle);
		setSelectedProgramType(programType);
		setIsPaymentModalOpen(true);
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-blue-900">
				<div className="text-2xl text-white">Loading...</div>
			</div>
		);
	}

	const programTypes = [
		{
			name: "College Program",
			audience: "For Colleges, Universities & Group of Students",
			timing: "Common Timings",
		},
		{
			name: "Employee Program",
			audience: "1-1 Individuals",
			timing: "Choose Timings",
		},
		{
			name: "Complete Transformation Program",
			audience: "1-1 Individuals",
			timing: "Flexible Timings",
		},
	];

	return (
		<div className="min-h-screen relative overflow-hidden bg-linear-to-br from-blue-900 via-blue-800 to-blue-900">
			{/* Decorative Dots - Left */}
			<div className="absolute left-8 top-1/2 transform -translate-y-1/2">
				<div className="grid grid-cols-4 gap-2">
					{[...Array(16)].map((_, i) => (
						<div
							key={`left-${i}`}
							className="w-2.5 h-2.5 rounded-full"
							style={{
								backgroundColor: i >= 12 ? "#FF9A76" : "#1e40af",
								opacity: i >= 12 ? 1 : 0.3,
							}}
						/>
					))}
				</div>
			</div>

			{/* Decorative Dots - Right */}
			<div className="absolute right-8 top-1/2 transform -translate-y-1/2">
				<div className="grid grid-cols-4 gap-2">
					{[...Array(16)].map((_, i) => (
						<div
							key={`right-${i}`}
							className="w-2.5 h-2.5 rounded-full"
							style={{
								backgroundColor: i >= 12 ? "#FF9A76" : "#1e40af",
								opacity: i >= 12 ? 1 : 0.3,
							}}
						/>
					))}
				</div>
			</div>

			{/* Wave Decorations */}
			<svg
				className="absolute left-0 bottom-0 w-64 h-64 opacity-10"
				viewBox="0 0 200 200">
				<path
					fill="#FF9A76"
					d="M0,100 Q50,150 100,100 T200,100 L200,200 L0,200 Z"
				/>
			</svg>
			<svg
				className="absolute right-0 bottom-0 w-64 h-64 opacity-10"
				viewBox="0 0 200 200">
				<path
					fill="#FF9A76"
					d="M0,100 Q50,50 100,100 T200,100 L200,200 L0,200 Z"
				/>
			</svg>

			{/* Content */}
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				{/* Header */}
				<h1 className="text-4xl md:text-5xl font-bold text-center mb-20">
					<span className="text-white">Our </span>
					<span style={{ color: "#FF9A76" }}>Pricing</span>
				</h1>

				{/* Pricing Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
					{bundles.length === 0 ? (
						<div className="col-span-full text-center text-white text-xl py-12">
							No pricing plans available yet
						</div>
					) : (
						bundles.slice(0, 3).map((bundle, index) => {
							const isMiddle = index === 1;
							const program = programTypes[index] || programTypes[0];

							return (
								<div
									key={bundle.id}
									className={`relative ${isMiddle ? "lg:scale-110 lg:z-10" : ""}`}>
									{/* Card */}
									<div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-3xl">
										{/* Floating Label */}
										<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
											<div className="bg-linear-to-r from-orange-400 to-orange-500 rounded-xl px-6 py-2 shadow-lg">
												<p className="text-white font-semibold text-sm whitespace-nowrap">
													{program.name}
												</p>
											</div>
										</div>

										{/* Header */}
										<div
											className="relative pt-16 pb-8 px-6 text-center"
											style={{
												background:
													"linear-gradient(135deg, #FF9A76 0%, #FF7A50 100%)",
											}}>
											{/* Price */}
											<div className="flex items-start justify-center mb-2">
												<span className="text-3xl font-bold text-white mt-2">
													₹
												</span>
												<span className="text-6xl font-bold text-white">
													{Math.round(
														(bundle.discounted_price || bundle.total_price) /
															1000,
													)}
												</span>
												<span className="text-3xl font-bold text-white mt-2">
													,000
												</span>
											</div>
											<p className="text-white text-sm font-medium">+ Tax</p>
											<p className="text-white text-xs mt-1 opacity-90">
												(Exclusive of GST & Taxes)
											</p>
										</div>

										{/* Body */}
										<div className="p-6 space-y-6">
											{/* Features */}
											<div className="space-y-4">
												{/* Feature 1 - Audience */}
												<div className="flex items-start gap-3">
													<div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
														<svg
															className="w-6 h-6 text-orange-500"
															fill="currentColor"
															viewBox="0 0 20 20">
															<path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
														</svg>
													</div>
													<p className="text-sm text-gray-700 mt-2">
														{program.audience}
													</p>
												</div>

												{/* Feature 2 - Timing */}
												<div className="flex items-start gap-3">
													<div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
														<svg
															className="w-6 h-6 text-orange-500"
															fill="currentColor"
															viewBox="0 0 20 20">
															<path
																fillRule="evenodd"
																d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
																clipRule="evenodd"
															/>
														</svg>
													</div>
													<p className="text-sm text-gray-700 mt-2">
														{program.timing}
													</p>
												</div>
											</div>

											{/* Courses Included */}
											{bundle.courses && bundle.courses.length > 0 && (
												<div className="pt-4 border-t border-gray-200">
													<p className="text-xs text-gray-500 font-semibold mb-2">
														Includes {bundle.courses.length} courses:
													</p>
													<ul className="space-y-1">
														{bundle.courses.slice(0, 3).map((course, idx) => (
															<li
																key={idx}
																className="text-xs text-gray-600 flex items-start gap-1">
																<span className="text-orange-500 mt-0.5">
																	•
																</span>
																<span>{course.title}</span>
															</li>
														))}
													</ul>
												</div>
											)}

											{/* Choose Plan Button */}
											<button
												onClick={() => handleChoosePlan(bundle, program.name)}
												className="w-full py-3 rounded-lg font-semibold border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 mt-6">
												Choose Plan
											</button>

											{/* Razorpay */}
											<div className="flex items-center justify-center gap-2 pt-2">
												<svg
													className="w-4 h-4 text-gray-400"
													fill="currentColor"
													viewBox="0 0 20 20">
													<path
														fillRule="evenodd"
														d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
														clipRule="evenodd"
													/>
												</svg>
												<span className="text-xs text-gray-500 font-medium">
													Secured by Razorpay
												</span>
											</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* Additional Info */}
				<div className="text-center mt-12 text-white text-sm opacity-80">
					<p>All prices are exclusive of GST and applicable taxes</p>
				</div>
			</div>

			{/* Payment Modal */}
			<PaymentModal
				isOpen={isPaymentModalOpen}
				onClose={() => setIsPaymentModalOpen(false)}
				bundle={selectedBundle}
				programType={selectedProgramType}
			/>
		</div>
	);
}
