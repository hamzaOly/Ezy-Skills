import { useState } from "react";
import axios from "axios";

export default function PaymentModal({ isOpen, onClose, bundle, programType }) {
	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phone: "",
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		billingAddress: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		// Format card number with spaces
		if (name === "cardNumber") {
			const formatted = value
				.replace(/\s/g, "")
				.replace(/(\d{4})/g, "$1 ")
				.trim();
			setFormData({ ...formData, [name]: formatted });
		}
		// Format expiry date
		else if (name === "expiryDate") {
			const formatted = value
				.replace(/\D/g, "")
				.replace(/(\d{2})(\d)/, "$1/$2")
				.substr(0, 5);
			setFormData({ ...formData, [name]: formatted });
		}
		// Format CVV (3-4 digits only)
		else if (name === "cvv") {
			const formatted = value.replace(/\D/g, "").substr(0, 4);
			setFormData({ ...formData, [name]: formatted });
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			// Here you would integrate with Razorpay or your payment gateway
			const paymentData = {
				bundle_id: bundle.id,
				bundle_title: bundle.title,
				program_type: programType,
				amount: bundle.discounted_price,
				customer: {
					name: formData.fullName,
					email: formData.email,
					phone: formData.phone,
				},
				// Don't send actual card details to your server in production!
				// Use Razorpay's SDK to tokenize the card first
			};

			// Mock payment processing
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Send email notification via your backend
			await axios.post(
				"http://localhost:5000/api/payments/notify",
				paymentData,
			);

			alert("Payment Successful! Check your email for confirmation.");
			onClose();
		} catch (err) {
			setError(err.message || "Payment failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
			<div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="bg-linear-to-r from-blue-900 to-blue-700 text-white p-6 rounded-t-2xl relative">
					<button
						onClick={onClose}
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
					<h2 className="text-2xl font-bold">Complete Your Purchase</h2>
					<p className="text-blue-200 mt-2">{programType}</p>
				</div>

				{/* Order Summary */}
				<div className="p-6 bg-gray-50 border-b">
					<h3 className="font-semibold text-lg mb-3">Order Summary</h3>
					<div className="space-y-2">
						<div className="flex justify-between">
							<span className="text-gray-600">Program:</span>
							<span className="font-semibold">{bundle.title}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Courses Included:</span>
							<span className="font-semibold">
								{bundle.courses?.length || 0}
							</span>
						</div>
						<div className="flex justify-between text-lg font-bold pt-2 border-t">
							<span>Total Amount:</span>
							<span className="text-orange-500">
								₹{bundle.discounted_price?.toLocaleString()}
							</span>
						</div>
						<p className="text-xs text-gray-500">+ GST & Taxes</p>
					</div>
				</div>

				{/* Payment Form */}
				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					{error && (
						<div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
							{error}
						</div>
					)}

					{/* Personal Information */}
					<div className="space-y-4">
						<h4 className="font-semibold text-gray-900">Contact Information</h4>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Full Name *
							</label>
							<input
								type="text"
								name="fullName"
								value={formData.fullName}
								onChange={handleInputChange}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								required
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email *
								</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Phone *
								</label>
								<input
									type="tel"
									name="phone"
									value={formData.phone}
									onChange={handleInputChange}
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									required
								/>
							</div>
						</div>
					</div>

					{/* Card Information */}
					<div className="space-y-4 pt-4 border-t">
						<h4 className="font-semibold text-gray-900 flex items-center gap-2">
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
								/>
							</svg>
							Card Details
						</h4>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Card Number *
							</label>
							<input
								type="text"
								name="cardNumber"
								value={formData.cardNumber}
								onChange={handleInputChange}
								placeholder="1234 5678 9012 3456"
								maxLength="19"
								className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
								required
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Expiry Date *
								</label>
								<input
									type="text"
									name="expiryDate"
									value={formData.expiryDate}
									onChange={handleInputChange}
									placeholder="MM/YY"
									maxLength="5"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
									required
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									CVV *
								</label>
								<input
									type="text"
									name="cvv"
									value={formData.cvv}
									onChange={handleInputChange}
									placeholder="123"
									maxLength="4"
									className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
									required
								/>
							</div>
						</div>
					</div>

					{/* Billing Address */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Billing Address *
						</label>
						<textarea
							name="billingAddress"
							value={formData.billingAddress}
							onChange={handleInputChange}
							rows="3"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							required
						/>
					</div>

					{/* Security Notice */}
					<div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
						<svg
							className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
							fill="currentColor"
							viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
								clipRule="evenodd"
							/>
						</svg>
						<p className="text-xs text-blue-800">
							Your payment information is encrypted and secure. We use
							industry-standard security measures to protect your data.
						</p>
					</div>

					{/* Razorpay Logo */}
					<div className="flex items-center justify-center gap-2 text-sm text-gray-600 pt-2">
						<span>Secured by</span>
						<img
							src="/path-to-razorpay-logo.png"
							alt="Razorpay"
							className="h-5"
						/>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-linear-to-r from-orange-500 to-orange-600 text-white py-4 rounded-lg font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg">
						{loading ? (
							<span className="flex items-center justify-center gap-2">
								<svg
									className="animate-spin h-5 w-5"
									fill="none"
									viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Processing...
							</span>
						) : (
							`Pay ₹${bundle.discounted_price?.toLocaleString()}`
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
