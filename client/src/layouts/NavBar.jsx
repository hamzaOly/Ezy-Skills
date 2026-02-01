import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	getCurrentUser,
	logout,
	isAuthenticated,
} from "../services/authService";
import logo from "../assets/logo.png";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [user, setUser] = useState(() =>
		isAuthenticated() ? getCurrentUser() : null,
	);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 0);
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

	const isActive = (path) => location.pathname === path;

	const handleCreateAccountClick = () => navigate("/createaccount");
	const handleLoginClick = () => navigate("/login");
	const handleLogout = () => {
		logout();
		setUser(null);
		setDropdownOpen(false);
		navigate("/");
	};

	return (
		<nav
			className={`${location.pathname === "/FAQ" ? "bg-transparent text-white" : "bg-white text-gray-700 shadow-md"} w-full sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? "shadow-lg" : ""}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16 lg:h-25">
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

						{user ? (
							<div className="relative">
								<button
									onClick={() => setDropdownOpen(!dropdownOpen)}
									className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors">
									<div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
										{user.email?.charAt(0).toUpperCase()}
									</div>
									<span className="max-w-37.5 truncate">{user.email}</span>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>

								{dropdownOpen && (
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 transition-all duration-200">
										<Link
											to="/dashboard"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											onClick={() => setDropdownOpen(false)}>
											Dashboard
										</Link>
										<Link
											to="/my-courses"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											onClick={() => setDropdownOpen(false)}>
											My Courses
										</Link>
										<Link
											to="/profile"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											onClick={() => setDropdownOpen(false)}>
											Profile
										</Link>
										<hr className="my-2" />
										<button
											onClick={handleLogout}
											className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
											Logout
										</button>
									</div>
								)}
							</div>
						) : (
							<>
								<button
									onClick={handleLoginClick}
									className="text-sm font-medium px-6 py-2 rounded-md border-2 border-orange-600 text-orange-600 bg-white hover:bg-orange-50 transition-all duration-200 whitespace-nowrap">
									Log In
								</button>
								<button
									onClick={handleCreateAccountClick}
									className="text-sm font-medium px-6 py-2 rounded-md bg-orange-600 text-white hover:bg-orange-700 transition-all duration-200 whitespace-nowrap">
									Create Account
								</button>
							</>
						)}
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

			{/* Mobile Menu */}
			{isOpen && (
				<div className="lg:hidden border-t border-gray-200 bg-white">
					<div className="px-4 pt-2 pb-4 space-y-1">
						{navigation.map((item) => (
							<Link
								key={item.name}
								to={item.href}
								onClick={() => setIsOpen(false)}
								className={`block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 ${isActive(item.href) ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"}`}>
								{item.name}
							</Link>
						))}

						<div className="pt-4 space-y-2">
							{user ? (
								<>
									<div className="px-4 py-2 text-sm text-gray-700 font-semibold border-b border-gray-200">
										{user.email}
									</div>
									<Link to="/dashboard">
										<button
											onClick={() => setIsOpen(false)}
											className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
											Dashboard
										</button>
									</Link>
									<Link to="/my-courses">
										<button
											onClick={() => setIsOpen(false)}
											className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
											My Courses
										</button>
									</Link>
									<button
										onClick={() => {
											handleLogout();
											setIsOpen(false);
										}}
										className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 rounded-md transition-colors">
										Logout
									</button>
								</>
							) : (
								<>
									<button
										onClick={handleLoginClick}
										className="w-full px-4 py-3 rounded-md text-sm font-medium border-2 border-orange-600 text-orange-600 bg-white hover:bg-orange-50 transition-colors duration-200">
										Log In
									</button>
									<button
										onClick={handleCreateAccountClick}
										className="w-full px-4 py-3 rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200">
										Create Account
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</nav>
	);
}
