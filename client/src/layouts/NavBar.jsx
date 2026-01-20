import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const location = useLocation();
	// const [clcik, setclick] = useState();

	// Detect scroll
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 0);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navigate = useNavigate();

	const navigation = [
		{ name: "Home", href: "/" },
		{ name: "Course Selector", href: "/CourseSelector" },
		{ name: "Courses", href: "/Courses" },
		{ name: "Pricing", href: "/Pricing" },
		{ name: "FAQ", href: "/FAQ" },
		{ name: "Contact Us", href: "/contactUs" },
	];

	const isActive = (path) => location.pathname === path;

	const handleCreateAccountClick = () => {
		navigate("/createaccount");
	};
	const handleLoginClick = () => {
		navigate("/login");
	};

	return (
		<nav
			className={`bg-white w-full sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? "shadow-lg" : ""}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16 lg:h-25">
					{/* Logo */}
					<Link to="/" className="shrink-0">
						<img
							src={logo}
							alt="Logo"
							className="h-20 w-43 sm:h-10 md:h-18 lg:h-18 xl:h-22 2xl:h-25"
						/>
					</Link>

					<div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
						{navigation.map((item) => (
							<Link
								key={item.name}
								to={item.href}
								className={`text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
									isActive(item.href)
										? "text-orange-600 font-semibold"
										: "text-gray-700 hover:text-orange-600"
								}`}>
								{item.name}
							</Link>
						))}

						<Link to="/login">
							<button
								className="text-sm font-medium px-6 py-2 rounded-md border-2 border-orange-600 text-orange-600 bg-white hover:bg-orange-50 transition-all duration-200 whitespace-nowrap"
								onMouseEnter={(e) => {
									e.target.style.backgroundColor = "#FF5329";
									e.target.style.color = "white";
								}}
								onMouseLeave={(e) => {
									e.target.style.backgroundColor = "white";
									e.target.style.color = "#FF5329";
								}}
								onClick={handleLoginClick}>
								Log In
							</button>
						</Link>
						<Link to={"/createaccount"}>
							<button
								onClick={handleCreateAccountClick}
								className="text-sm font-medium px-6 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700 transition-all duration-200 whitespace-nowrap"
								style={{ backgroundColor: "#FF5329" }}
								onMouseEnter={(e) =>
									(e.target.style.backgroundColor = "#E64A24")
								}
								onMouseLeave={(e) =>
									(e.target.style.backgroundColor = "#FF5329")
								}>
								Create Account
							</button>
						</Link>
					</div>

					<button
						onClick={() => setIsOpen(!isOpen)}
						className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-gray-100 transition-colors">
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

			{isOpen && (
				<div className="lg:hidden border-t border-gray-200 bg-white">
					<div className="px-4 pt-2 pb-4 space-y-1">
						{navigation.map((item) => (
							<Link
								key={item.name}
								to={item.href}
								onClick={() => setIsOpen(false)}
								className={`block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
									isActive(item.href)
										? "bg-orange-50 text-orange-600"
										: "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
								}`}>
								{item.name}
							</Link>
						))}

						<div className="pt-4 space-y-2">
							<Link to={"/login"}>
								<button
									onClick={handleLoginClick}
									className="w-full px-4 py-3 rounded-md text-sm font-medium border-2 border-orange-600 text-orange-600 bg-white hover:bg-orange-50 transition-colors duration-200">
									Log In
								</button>
							</Link>
							<Link to={"/createaccount"}>
								<button
									onClick={handleCreateAccountClick}
									className="w-full px-4 py-3 rounded-md text-sm font-medium text-white transition-colors duration-200"
									style={{ backgroundColor: "#FF5329" }}>
									Create Account
								</button>
							</Link>
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
