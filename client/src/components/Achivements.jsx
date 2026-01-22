import { useState } from "react";
import Mountin from "../assets/mountin.png";
import Vectoricons from "../assets/Vectoricons.png";
import Book from "../assets/book.png";
import Dots from "../assets/dots.png";
import Stu from "../assets/Stu.png";
import Cor from "../assets/Cor.png";
import CorO from "../assets/CorO.png";

export default function AchievementsMentors() {
	const [currentSlide, setCurrentSlide] = useState(0);

	const mentors = [
		{
			id: 1,
			name: "Sandeep",
			title: "Net & Azure",
			rating: 4,
			reviews: 72,
			modules: 28,
			students: 272,
			description:
				"Sandeep is a Software Developer with experience in .NET & Azure for more than 24 years and training 100's of students to accomplish their goals & dreams.",
			badge: "BEST TRAINER",
		},
		{
			id: 2,
			name: "Sudhansu",
			title: "Cloud & Cyber Security, Forensic",
			rating: 4,
			reviews: 38,
			modules: 22,
			students: 189,
			description:
				"Sudhansu is a Software Developer with experience in Cloud security, Cyber security, Data Center & Forensic for more than 22 years and training 100's of students to accomplish their goals & dreams.",
			badge: null,
		},
		{
			id: 3,
			name: "Priya",
			title: "Full Stack Development",
			rating: 5,
			reviews: 95,
			modules: 32,
			students: 345,
			description:
				"Priya is a Full Stack Developer with expertise in React, Node.js & MongoDB for more than 15 years and has helped hundreds of students launch their careers.",
			badge: "TOP RATED",
		},
		{
			id: 4,
			name: "Rahul",
			title: "Data Science & AI",
			rating: 4,
			reviews: 64,
			modules: 25,
			students: 228,
			description:
				"Rahul specializes in Data Science and AI with 18 years of experience, teaching advanced analytics and machine learning to aspiring data scientists.",
			badge: null,
		},
	];

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % mentors.length);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + mentors.length) % mentors.length);
	};

	const renderStars = (rating) => {
		return [...Array(5)].map((_, i) => (
			<span
				key={i}
				className={i < rating ? "text-orange-400" : "text-gray-300"}>
				★
			</span>
		));
	};

	return (
		<div className="py-16 px-4 sm:px-6 lg:px-8 bg-white-50">
			<div className="max-w-7xl mx-auto">
				{/* Achievements Section */}
				<div className="mb-20">
					<h2 className="text-4xl font-bold text-center mb-12">
						<span className="text-blue-900">Our </span>
						<span className="text-orange-500">Achievements</span>
					</h2>

					<div className="grid lg:grid-cols-2 gap-8 items-center">
						{/* Left - Illustration */}
						<div className="flex justify-center lg:justify-start">
							<img
								src={Mountin}
								alt="Team Achievement"
								className="w-full max-w-md h-auto"
							/>
						</div>

						{/* Right - Stats */}
						<div className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
								{/* Students Trained */}
								<div className="bg-white rounded-2xl shadow-lg p-6 text-center">
									<div className="text-5xl font-bold text-orange-500 mb-2">
										100
									</div>
									<div className="flex items-center justify-center gap-2 text-sm text-gray-600">
										<img src={Vectoricons} alt="" className="w-5 h-5" />
										<span className="font-medium">
											Students
											<br />
											Trained
										</span>
									</div>
								</div>

								{/* Courses Available */}
								<div className="bg-white rounded-2xl shadow-lg p-6 text-center">
									<div className="text-5xl font-bold text-orange-500 mb-2">
										50
									</div>
									<div className="flex items-center justify-center gap-2 text-sm text-gray-600">
										<img src={Book} alt="" className="w-5 h-5" />
										<span className="font-medium">
											Courses
											<br />
											Available
										</span>
									</div>
								</div>
							</div>

							{/* Success Rate */}
							<div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
								<div className="flex items-center justify-between">
									<div>
										<div className="text-5xl font-bold text-blue-900 mb-2">
											70%
										</div>
										<p className="text-sm text-gray-600 font-medium">
											Students Secured
											<br />
											Jobs In Level 1<br />
											Companies
										</p>
									</div>
									{/* Decorative Dots */}
									<div className="absolute right-4 top-1/2 -translate-y-1/2">
										<img src={Dots} alt="" className="w-24 h-24 opacity-30" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Mentors Section */}
				<div>
					<h2 className="text-4xl font-bold text-center mb-12">
						<span className="text-blue-900">Meet Our Professional</span>
						<br />
						<span className="text-orange-500">Mentors & Trainers</span>
					</h2>

					{/* Carousel */}
					<div className="relative max-w-5xl mx-auto">
						<div className="overflow-hidden">
							<div
								className="flex transition-transform  duration-500 ease-in-out"
								style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
								{mentors.map((mentor) => (
									<div key={mentor.id} className="w-full shrink-0 px-4">
										<div className="grid md:grid-cols-2 gap-3 items-start max-w-4xl mx-auto">
											{/* Mentor Card */}
											<div className="bg-white rounded-2xl shadow-xl p-2 relative">
												{/* Best Trainer Badge */}
												{mentor.badge && (
													<div className="absolute top-1 left-1/2 -translate-x-1/2">
														<div className="bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
															<span>🏆</span>
															{mentor.badge}
														</div>
													</div>
												)}

												<div className="flex flex-col items-center">
													{/* Avatar */}
													<div className="mb-4">
														<img
															src={Stu}
															alt={mentor.name}
															className="w-24 h-24 rounded-full"
														/>
													</div>

													{/* Name & Title */}
													<h3 className="text-2xl font-bold text-gray-900 mb-1">
														{mentor.name}
													</h3>
													<p className="text-orange-500 text-sm font-medium mb-3">
														{mentor.title}
													</p>

													{/* Rating */}
													<div className="flex items-center gap-2 mb-2">
														<div className="flex text-lg">
															{renderStars(mentor.rating)}
														</div>
														<span className="text-sm text-gray-600">
															{mentor.reviews} Reviews
														</span>
													</div>

													{/* Stats */}
													<div className="flex gap-6 mb-4 text-sm text-gray-600">
														<div className="flex items-center gap-1">
															<img src={Cor} alt="" className="w-4 h-4" />
															<span>{mentor.modules} Modules</span>
														</div>
														<div className="flex items-center gap-1">
															<img src={CorO} alt="" className="w-4 h-4" />
															<span>{mentor.students} Students</span>
														</div>
													</div>
												</div>
											</div>

											{/* Description */}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Navigation Arrows */}
						<button
							onClick={prevSlide}
							className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-orange-500 text-white w-12 h-12 rounded-full shadow-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
							aria-label="Previous mentor">
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</button>

						<button
							onClick={nextSlide}
							className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-orange-500 text-white w-12 h-12 rounded-full shadow-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
							aria-label="Next mentor">
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>

						{/* Dots Indicator */}
						<div className="flex justify-center gap-2 mt-8">
							{mentors.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentSlide(index)}
									className={`w-3 h-3 rounded-full transition-colors ${
										index === currentSlide ? "bg-orange-500" : "bg-gray-300"
									}`}
									aria-label={`Go to slide ${index + 1}`}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
