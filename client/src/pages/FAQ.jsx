import { useState } from "react";
// import logo from './assets/faq/logo.png';
import orangeDots from "../assets/FAQ/Group2147.png";

import orangeCircleBottom from "../assets/FAQ/Ellipse.png";

export default function FAQ() {
	const [openIndex, setOpenIndex] = useState(0); // First question open by default

	const faqs = [
		{
			question: "Who is eligible for this program?",
			answer:
				"Any Degree/Batch BE/BTech (non sust), Passed outs, Individuals, Employees are eligible for this program.",
		},
		{
			question: "What is the duration of the program?",
			answer:
				"The program duration varies depending on the course selected. Typically, courses range from 4 weeks to 6 months.",
		},
		{
			question: "Do I get the assured placement?",
			answer:
				"We provide placement assistance and interview preparation. While we cannot guarantee placement, we work closely with hiring partners to maximize opportunities.",
		},
		{
			question:
				"What is the basic academic percentage required to enroll for the course?",
			answer:
				"There is no minimum percentage requirement. We welcome learners from all academic backgrounds who are passionate about learning.",
		},
		{
			question: "What is the execution plan of the program?",
			answer:
				"The program includes live interactive sessions, hands-on projects, assignments, quizzes, and capstone projects to ensure comprehensive learning.",
		},
		{
			question: "Can we take this course online?",
			answer:
				"Yes, all our courses are available online with live instructor-led sessions and recorded lectures for flexible learning.",
		},
		{
			question: "I am already employed, will I be eligible for the program?",
			answer:
				"Absolutely! Our programs are designed for both students and working professionals. We offer flexible timings to accommodate your schedule.",
		},
		{
			question: "What if I miss the session due to an emergency?",
			answer:
				"Don't worry! All sessions are recorded and available for playback. You can catch up at your convenience.",
		},
		{
			question: "Can we take this course online?",
			answer:
				"Yes, our courses are 100% online with interactive sessions, allowing you to learn from anywhere in the world.",
		},
		{
			question: "Do you provide any certificate after the program?",
			answer:
				"Yes, upon successful completion of the program, you will receive a certificate of completion that you can showcase on your resume and LinkedIn.",
		},
		{
			question: "Have suggestions for us?",
			answer:
				"We'd love to hear from you! Please reach out to us through our contact page or email us at support@ezyskills.com",
		},
	];

	const toggleQuestion = (index) => {
		setOpenIndex(openIndex === index ? -1 : index);
	};

	return (
		<div className="min-h-screen bg-white relative overflow-hidden">
			{/* Orange Header Section with Half Circle */}
			<div className="relative" style={{ backgroundColor: "#FF9A76" }}>
				{/* Header Content */}
				<div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
						Frequently Asked Questions
					</h1>
				</div>

				{/* Large Orange Half Circle extending below */}
				<div
					className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
					style={{
						width: "800px",
						height: "400px",
						backgroundColor: "#FF9A76",
						borderRadius: "400px 400px 0 0",
						zIndex: 1,
					}}
				/>
			</div>

			{/* Content Section */}
			<div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20">
				{/* FAQ White Card */}
				<div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 lg:p-12 relative z-20">
					<div className="space-y-4">
						{faqs.map((faq, index) => (
							<div
								key={index}
								className="border-b border-gray-200 last:border-b-0">
								<button
									onClick={() => toggleQuestion(index)}
									className="w-full flex items-start justify-between py-4 text-left hover:bg-gray-50 transition-colors rounded-lg px-2">
									<span
										className={`flex-1 font-medium pr-4 ${
											openIndex === index ? "text-orange-500" : "text-gray-700"
										}`}>
										{faq.question}
									</span>
									<span className="text-orange-500 text-xl shrink-0 font-light">
										{openIndex === index ? "−" : "+"}
									</span>
								</button>

								{openIndex === index && (
									<div className="pb-4 px-2 text-gray-600 text-sm leading-relaxed">
										{faq.answer}
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Decorative Elements */}
			<img
				src={orangeDots}
				alt=""
				className="absolute left-4 top-1/3 w-8 md:w-10 lg:w-12 opacity-80"
				style={{ zIndex: 5 }}
			/>

			<img
				src={orangeCircleBottom}
				alt=""
				className="absolute right-0 bottom-20 w-32 md:w-40 lg:w-48 opacity-60"
				style={{ zIndex: 5 }}
			/>
		</div>
	);
}
