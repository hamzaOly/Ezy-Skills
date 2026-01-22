import { useState, useEffect } from "react";

export default function AboutUs() {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 0);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navigation = [
		{ name: "Home", href: "/" },
		{ name: "Course Selector", href: "/CourseSelector" },
		{ name: "Courses", href: "/Courses" },
		{ name: "Pricing", href: "/Pricing" },
		{ name: "FAQ", href: "/FAQ" },
		{ name: "Contact Us", href: "/contactUs" },
	];

	return (
		<div className="min-h-screen bg-white">
			{/* Navbar */}
			<nav
				className={`bg-blue-900 text-white w-full sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? "shadow-lg" : ""}`}>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16 lg:h-20">
						{/* Logo */}
						<a href="/" className="shrink-0">
							<img
								src="/logo.png"
								alt="EzySkills Logo"
								className="h-12 w-auto sm:h-14 md:h-16 lg:h-16"
							/>
						</a>

						<div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
							{navigation.map((item) => (
								<a
									key={item.name}
									href={item.href}
									className="text-sm font-medium transition-colors duration-200 whitespace-nowrap text-white/90 hover:text-white">
									{item.name}
								</a>
							))}

							<a href="/login">
								<button className="text-sm font-medium px-6 py-2 rounded border-2 border-white text-white hover:bg-white hover:text-blue-900 transition-all duration-200 whitespace-nowrap">
									Log In
								</button>
							</a>
							<a href="/createaccount">
								<button className="text-sm font-medium px-6 py-2 rounded bg-white text-blue-900 hover:bg-gray-100 transition-all duration-200 whitespace-nowrap">
									Create Account
								</button>
							</a>
						</div>

						<button
							onClick={() => setIsOpen(!isOpen)}
							className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 transition-colors">
							<span className="sr-only">Open main menu</span>
							{!isOpen ? (
								<svg
									className="h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							) : (
								<svg
									className="h-6 w-6"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isOpen && (
					<div className="lg:hidden border-t border-blue-800 bg-blue-900">
						<div className="px-4 pt-2 pb-4 space-y-1">
							{navigation.map((item) => (
								<a
									key={item.name}
									href={item.href}
									onClick={() => setIsOpen(false)}
									className="block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 text-white/90 hover:bg-blue-800 hover:text-white">
									{item.name}
								</a>
							))}

							<div className="pt-4 space-y-2">
								<a href="/login">
									<button className="w-full px-4 py-3 rounded-md text-sm font-medium border-2 border-white text-white hover:bg-white hover:text-blue-900 transition-colors duration-200">
										Log In
									</button>
								</a>
								<a href="/createaccount">
									<button className="w-full px-4 py-3 rounded-md text-sm font-medium bg-white text-blue-900 hover:bg-gray-100 transition-colors duration-200">
										Create Account
									</button>
								</a>
							</div>
						</div>
					</div>
				)}
			</nav>

			{/* Hero Section */}
			<section className="bg-blue-900 text-white relative overflow-hidden">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						{/* Left Content */}
						<div className="space-y-6">
							<p className="text-orange-400 text-sm font-semibold tracking-widest uppercase">
								ABOUT US
							</p>
							<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
								The Platform For The Next Billion Learners
							</h1>
							<p className="text-lg text-white/90">
								Transforming tech education for the next generation of students
								& employees
							</p>

							{/* Decorative Dots */}
							<div className="flex gap-2 pt-8">
								<div className="grid grid-cols-3 gap-1.5">
									{[...Array(9)].map((_, i) => (
										<div
											key={i}
											className="w-2 h-2 rounded-full bg-orange-400"></div>
									))}
								</div>
							</div>
						</div>

						{/* Right Images */}
						<div className="relative">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-4">
									<img
										src="/student-library.jpg"
										alt="Student in library"
										className="w-full h-48 object-cover rounded-lg"
									/>
									<img
										src="/students-laptop.jpg"
										alt="Students with laptop"
										className="w-full h-56 object-cover rounded-lg"
									/>
								</div>
								<div className="flex items-center">
									<img
										src="/team-meeting.jpg"
										alt="Team meeting"
										className="w-full h-64 object-cover rounded-lg"
									/>
								</div>
							</div>

							{/* Orange Circle Decoration */}
							<div className="absolute -right-16 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-8 border-orange-400 opacity-50 hidden xl:block"></div>
						</div>
					</div>
				</div>

				{/* Curved Bottom */}
				<div className="absolute bottom-0 left-0 right-0">
					<svg
						viewBox="0 0 1440 120"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="w-full">
						<path
							d="M0 120L1440 120L1440 0C1440 0 1080 80 720 80C360 80 0 0 0 0L0 120Z"
							fill="white"
						/>
					</svg>
				</div>
			</section>

			{/* Our Story Section */}
			<section className="py-16 lg:py-24 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						{/* Left Side - Image and Decorations */}
						<div className="relative flex justify-center lg:justify-start">
							<div className="relative">
								<img
									src="/students-studying.jpg"
									alt="Students studying together"
									className="w-80 h-80 object-cover rounded-full"
								/>

								{/* Orange Arc */}
								<div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64">
									<svg viewBox="0 0 200 200" className="w-full h-full">
										<path
											d="M 100 20 A 80 80 0 0 1 100 180"
											stroke="#FF8C42"
											strokeWidth="20"
											fill="none"
											strokeLinecap="round"
										/>
									</svg>
								</div>

								{/* Decorative Arrows */}
								<div className="absolute top-1/4 -left-12 space-y-2">
									{[...Array(3)].map((_, i) => (
										<div key={i} className="flex items-center gap-1">
											<div className="w-4 h-0.5 bg-blue-900"></div>
											<div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-blue-900 border-b-4 border-b-transparent"></div>
										</div>
									))}
								</div>

								{/* Decorative Plus Signs */}
								<div className="absolute -bottom-8 -left-8 space-y-2">
									{[...Array(4)].map((_, i) => (
										<div key={i} className="text-orange-400 text-2xl font-bold">
											+
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Right Side - Content */}
						<div className="space-y-6">
							<p className="text-blue-900 text-sm font-semibold tracking-widest uppercase">
								OUR STORY
							</p>
							<h2 className="text-4xl lg:text-5xl font-bold text-orange-400 leading-tight">
								Innovating new ways to train students
							</h2>
							<div className="space-y-4 text-gray-700">
								<p>
									We see no limits to what we can achieve by harnessing our
									individual and collective strengths. We are changing the world
									with our ideas, insights, and unique perspectives.
								</p>
								<p>
									Our individual curiosity is led by data, curiosity and the
									occasional happy accident. We create an uplifting environment
									where we learn from our failures and celebrate our success.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
