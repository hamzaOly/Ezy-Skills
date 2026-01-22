import { useState, useEffect } from "react";
import axios from "axios";

export default function Pricing() {
	const [bundles, setBundles] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetch = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/teacher-bundles/public",
				);
				setBundles(response.data.bundles || []);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching bundles:", error);
				setLoading(false);
			}
		};
		fetch();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-2xl">Loading...</div>
			</div>
		);
	}

	return (
		<div
			className="min-h-screen relative overflow-hidden"
			style={{ backgroundColor: "#003d7a" }}>
			{/* Decorative Dots - Left */}
			<div className="absolute left-8 top-1/2 transform -translate-y-1/2 space-y-3">
				<div className="grid grid-cols-4 gap-3">
					{[...Array(16)].map((_, i) => (
						<div
							key={i}
							className="w-3 h-3 rounded-full"
							style={{ backgroundColor: i < 12 ? "#003d7a" : "#FF9A76" }}
						/>
					))}
				</div>
			</div>

			{/* Decorative Dots - Right */}
			<div className="absolute right-8 top-1/2 transform -translate-y-1/2 space-y-3">
				<div className="grid grid-cols-4 gap-3">
					{[...Array(16)].map((_, i) => (
						<div
							key={i}
							className="w-3 h-3 rounded-full"
							style={{ backgroundColor: i < 12 ? "#003d7a" : "#FF9A76" }}
						/>
					))}
				</div>
			</div>

			{/* Wave Decoration - Left */}
			<svg
				className="absolute left-0 bottom-0 w-64 h-64 opacity-20"
				viewBox="0 0 200 200"
				xmlns="http://www.w3.org/2000/svg">
				<path
					fill="#FF9A76"
					d="M0,100 Q50,150 100,100 T200,100 L200,200 L0,200 Z"
				/>
			</svg>

			{/* Wave Decoration - Right */}
			<svg
				className="absolute right-0 bottom-0 w-64 h-64 opacity-20"
				viewBox="0 0 200 200"
				xmlns="http://www.w3.org/2000/svg">
				<path
					fill="#FF9A76"
					d="M0,100 Q50,50 100,100 T200,100 L200,200 L0,200 Z"
				/>
			</svg>

			{/* Content */}
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				{/* Header */}
				<h1 className="text-4xl md:text-5xl font-bold text-center mb-16">
					<span className="text-white">Our </span>
					<span className="text-orange-500">Pricing</span>
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
							const programTypes = [
								"College Program",
								"Employee Program",
								"Complete Transformation Program",
							];

							return (
								<div
									key={bundle.id}
									className={`relative ${isMiddle ? "md:-mt-8 md:mb-8" : ""}`}>
									{/* Card */}
									<div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-105">
										{/* Header */}
										<div
											className="relative pt-12 pb-8 px-6 text-center"
											style={{ backgroundColor: "#FF9A76" }}>
											{/* Program Type Label */}
											<div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
												<div className="bg-white rounded-xl px-6 py-3 shadow-lg">
													<p className="text-orange-500 font-semibold text-sm">
														{programTypes[index] || bundle.title}
													</p>
												</div>
											</div>

											{/* Price */}
											<div className="mt-4">
												<div className="flex items-start justify-center">
													<span className="text-4xl font-bold text-white">
														₹
													</span>
													<span className="text-5xl md:text-6xl font-bold text-white">
														{Math.round(bundle.discounted_price / 1000)},000
													</span>
												</div>
												<p className="text-white text-sm mt-2">+ Tax</p>
												<p className="text-white text-xs mt-1">
													(Exclusive of GST & Taxes)
												</p>
											</div>
										</div>

										{/* Body */}
										<div className="p-8 space-y-4">
											{/* Features */}
											<div className="space-y-4">
												{/* Feature 1 */}
												<div className="flex items-start gap-3">
													<img
														src="/path-to-group-icon.png"
														alt=""
														className="w-10 h-10 shrink-0"
													/>
													<div>
														<p className="text-sm text-gray-700">
															{index === 0
																? "For Colleges, Universities & Group of Students"
																: index === 1
																	? "1-1 Individuals"
																	: "1-1 Individuals"}
														</p>
													</div>
												</div>

												{/* Feature 2 */}
												<div className="flex items-start gap-3">
													<img
														src="/path-to-calendar-icon.png"
														alt=""
														className="w-10 h-10 shrink-0"
													/>
													<div>
														<p className="text-sm text-gray-700">
															{index === 0
																? "Common Timings"
																: index === 1
																	? "Choose Timings"
																	: "Flexible Timings"}
														</p>
													</div>
												</div>
											</div>

											{/* Courses Included */}
											{bundle.courses && (
												<div className="pt-4 border-t border-gray-200">
													<p className="text-xs text-gray-500 mb-2">
														Includes {bundle.courses.length} courses:
													</p>
													{bundle.courses.map((course, idx) => (
														<p key={idx} className="text-xs text-gray-600">
															• {course.title}
														</p>
													))}
												</div>
											)}

											{/* Choose Plan Button */}
											<button className="w-full py-3 rounded-lg font-semibold border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors mt-6">
												Choose Plan
											</button>

											{/* Razorpay */}
											<div className="text-center pt-2">
												<img
													src="/path-to-razorpay-logo.png"
													alt="Razorpay"
													className="h-6 mx-auto opacity-60"
												/>
											</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* Additional Info */}
				<div className="text-center mt-12 text-white text-sm">
					<p>All prices are exclusive of GST and applicable taxes</p>
				</div>
			</div>
		</div>
	);
}
