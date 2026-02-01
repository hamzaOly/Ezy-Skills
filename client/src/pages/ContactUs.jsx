import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Contact() {
	const [formData, setFormData] = useState({
		name: "Julia William",
		email: "",
		phone: "",
		issue: "Course Structure",
		message: "",
	});

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const issues = ["Course Structure", "Payment Failure", "Other"];

	return (
		<div className="min-h-screen bg-white relative overflow-hidden font-sans">
			{/* Orange Header Section */}
			<div className="relative" style={{ backgroundColor: "#f37a3d" }}>
				{/* Navigation */}

				{/* Header Content */}
				<div className="relative z-10 max-w-4xl mx-auto px-4 pt-16 pb-32">
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
						Contact Our Team
					</h1>
				</div>

				{/* Large Orange Half Circle / Curve effect */}
				<div
					className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
					style={{
						width: "120%",
						height: "400px",
						backgroundColor: "#f37a3d",
						borderRadius: "50% 50% 0 0",
						zIndex: 1,
					}}
				/>
			</div>

			{/* Content Section */}
			<div className="relative z-10 max-w-5xl mx-auto px-4 -mt-20 pb-20">
				{/* Form White Card */}
				<div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative z-20">
					<form className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Name */}
						<div className="space-y-1.5">
							<label className="block text-sm font-bold text-[#003366]">
								Your name*
							</label>
							<input
								type="text"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none"
							/>
						</div>

						{/* Email */}
						<div className="space-y-1.5">
							<label className="block text-sm font-bold text-[#003366]">
								Contact email *
							</label>
							<input
								type="email"
								placeholder="you@example.com"
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none"
							/>
						</div>

						{/* Phone */}
						<div className="space-y-1.5">
							<label className="block text-sm font-bold text-[#003366]">
								Phone Number*
							</label>
							<input
								type="text"
								placeholder="Company name"
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none"
							/>
						</div>

						{/* Issue Dropdown */}
						<div className="space-y-1.5 relative">
							<label className="block text-sm font-bold text-[#003366]">
								Issue Related to *
							</label>
							<div
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 flex items-center justify-between cursor-pointer bg-white">
								<span className="text-gray-600">{formData.issue}</span>
								<ChevronDown
									className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
								/>
							</div>

							{isDropdownOpen && (
								<div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
									{issues.map((item) => (
										<div
											key={item}
											onClick={() => {
												setFormData({ ...formData, issue: item });
												setIsDropdownOpen(false);
											}}
											className={`px-4 py-2.5 hover:bg-gray-100 cursor-pointer text-sm ${formData.issue === item ? "bg-gray-100 font-semibold" : ""}`}>
											{item}
										</div>
									))}
								</div>
							)}
						</div>

						{/* Message */}
						<div className="md:col-span-2 space-y-1.5">
							<label className="block text-sm font-bold text-[#003366]">
								Your message*
							</label>
							<textarea
								rows={4}
								placeholder="Type your message..."
								className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none resize-none"></textarea>
						</div>

						<div className="md:col-span-2">
							<p className="text-[11px] text-gray-500 leading-relaxed mb-6">
								By submitting this form you agree to our terms and conditions
								and our Privacy Policy which explains how we may collect, use
								and disclose your personal information including to third
								parties.
							</p>
							<button className="bg-[#00427a] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#003366] transition-colors">
								Send
							</button>
						</div>
					</form>
				</div>
			</div>

			{/* Footer Contact Info */}
			<div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
				<div className="flex flex-col items-center text-center space-y-3">
					<img
						src="https://csspicker.dev/api/image/?q=email+icon+illustration&image_type=vector"
						alt="Email"
						className="w-16 h-16 object-contain"
					/>
					<h3 className="text-lg font-bold text-orange-500">Email us</h3>
					<p className="text-xs text-gray-600 max-w-60">
						Email us for general queries, including marketing and partnership
						opportunities.
					</p>
					<a
						href="mailto:hello@ezyskills.com"
						className="text-[#00427a] font-bold text-sm hover:underline">
						hello@ezyskills.com
					</a>
				</div>

				<div className="flex flex-col items-center text-center space-y-3">
					<img
						src="https://csspicker.dev/api/image/?q=customer+support+illustration&image_type=vector"
						alt="Call"
						className="w-16 h-16 object-contain"
					/>
					<h3 className="text-lg font-bold text-orange-500">Call us</h3>
					<p className="text-xs text-gray-600 max-w-60">
						Call us to speak to a member of our team. We are always happy to
						help.
					</p>
					<a
						href="tel:+918888899999"
						className="text-[#00427a] font-bold text-sm hover:underline">
						+91 88888 99999
					</a>
				</div>
			</div>

			{/* Decorative Elements */}
			<div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:grid grid-cols-3 gap-2 opacity-40">
				{[...Array(15)].map((_, i) => (
					<div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
				))}
			</div>

			<div className="absolute right-0 bottom-20 w-32 h-32 border-10 border-orange-400 rounded-full opacity-30 translate-x-1/2"></div>
		</div>
	);
}
