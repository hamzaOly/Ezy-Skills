import { useNavigate } from "react-router-dom";
import studentIllustration from "../assets/CourseSelector/selector.png";

export default function CourseSelector() {
	const navigate = useNavigate();

	const handleDiscoverCourse = () => {
		// Go directly to courses list page
		navigate("/courses");
	};

	const handleSuggestCourse = () => {
		// Go to chatbot suggestion flow
		navigate("/course-selector-chat");
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
			<div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				{/* Left Side - Selection Card */}
				<div className="order-2 lg:order-1">
					<div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 h-110">
						<h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
							Ok, Let me help you
						</h2>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{/* Discover Course Button */}
							<button
								onClick={handleDiscoverCourse}
								className="group relative h-60 min-h-60 overflow-hidden rounded-3xl p-1 transition-all duration-300 hover:scale-105 hover:shadow-xl"
								style={{ backgroundColor: "#FF9A76" }}>
								<div className="relative z-10 text-center">
									<h3 className="text-xl md:text-2xl font-bold text-white mb-2">
										Discover
										<br />
										Course
									</h3>
								</div>
								{/* Hover Effect */}
								<div className="absolute inset-0 bg-linear-to-br from-orange-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							</button>

							{/* Suggest Course Button */}
							<button
								onClick={handleSuggestCourse}
								className="group relative overflow-hidden rounded-3xl p-8 border-4 transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white"
								style={{ borderColor: "#003d7a" }}>
								<div className="relative z-10 text-center">
									<h3
										className="text-xl md:text-2xl font-bold mb-2"
										style={{ color: "#003d7a" }}>
										Suggest
										<br />
										Course
									</h3>
								</div>
								{/* Hover Effect */}
								<div
									className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
									style={{ backgroundColor: "#003d7a" }}></div>
							</button>
						</div>
					</div>
				</div>

				{/* Right Side - Illustration */}
				<div className="order-1 lg:order-2">
					<img
						src={studentIllustration}
						alt="Student with laptop"
						className="w-full h-auto max-w-md mx-auto lg:max-w-full"
					/>
				</div>
			</div>
		</div>
	);
}
