import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import {
	FaFacebookF,
	FaTwitter,
	FaInstagram,
	FaLinkedinIn,
	FaYoutube,
} from "react-icons/fa";

export default function Footer() {
	return (
		<footer className="bg-[#0E457C] text-white py-10">
			<div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
				{/* Left Section */}
				<div>
					<div className="flex items-center space-x-2 mb-3">
						<img src={logo} alt="EZY Skills Logo" className="h-10" />
						<div>
							<h2 className="text-2xl font-bold">
								EZY <span className="font-normal">SKILLS</span>
							</h2>
							<p className="text-sm">Empower Through Skills</p>
						</div>
					</div>
					<p className="text-sm leading-relaxed mb-6">
						Let us build your career together. Be the first person to transform
						yourself with our unique & world-class corporate-level trainings.
					</p>

					<h3 className="font-semibold mb-2 text-lg">
						Subscribe Our Newsletter
					</h3>
					<div className="flex">
						<input
							type="email"
							placeholder="Your Email address"
							className="px-3 py-2 text-gray-900 w-full rounded-l-lg outline-none"
						/>
						<button className="bg-[#F47B3B] px-4 rounded-r-lg text-white hover:bg-[#e36b2e]">
							→
						</button>
					</div>
				</div>

				{/* Quick Links Section */}
				<div>
					<h3 className="text-2xl font-bold mb-4">
						Quick <span className="text-[#F47B3B]">Links</span>
					</h3>
					<ul className="space-y-2">
						<li>
							<Link to="/" className="hover:text-[#F47B3B]">
								Home
							</Link>
						</li>
						<li>
							<Link to="/our-story" className="hover:text-[#F47B3B]">
								Our Story
							</Link>
						</li>
						<li>
							<Link to="/courses" className="hover:text-[#F47B3B]">
								Best Courses
							</Link>
						</li>
						<li>
							<Link to="/faq" className="hover:text-[#F47B3B]">
								Your FAQ’s
							</Link>
						</li>
						<li>
							<Link to="/refunds" className="hover:text-[#F47B3B]">
								Cancellation & Refunds
							</Link>
						</li>
						<li>
							<Link to="/contact" className="hover:text-[#F47B3B]">
								Contact Us
							</Link>
						</li>
					</ul>
				</div>

				{/* Contact Section */}
				<div>
					<h3 className="text-2xl font-bold mb-4">
						Contact <span className="text-[#F47B3B]">Us</span>
					</h3>
					<p className="text-sm leading-relaxed mb-4">
						Navakethan Complex, 6th Floor, 605, 606 A&P opp, Clock Tower, SD
						Road, Secunderabad, Telangana 500003
					</p>
					<p className="text-sm mb-1">
						✉️{" "}
						<a href="mailto:info@ezyskills.in" className="hover:text-[#F47B3B]">
							info@ezyskills.in
						</a>
					</p>
					<p className="text-sm mb-1">📞 +91 8424848903</p>
					<p className="text-sm mb-4">📞 +91 9475484959</p>

					<div className="flex space-x-4">
						<a href="#" className="hover:text-[#F47B3B]">
							<FaFacebookF />
						</a>
						<a href="#" className="hover:text-[#F47B3B]">
							<FaTwitter />
						</a>
						<a href="#" className="hover:text-[#F47B3B]">
							<FaInstagram />
						</a>
						<a href="#" className="hover:text-[#F47B3B]">
							<FaLinkedinIn />
						</a>
						<a href="#" className="hover:text-[#F47B3B]">
							<FaYoutube />
						</a>
					</div>
				</div>
			</div>

			<div className="border-t border-white/20 mt-10 pt-4 text-sm text-center flex flex-col md:flex-row justify-between px-6">
				<p>© {new Date().getFullYear()} EZY Skills. All rights reserved.</p>
				<div className="flex space-x-4 justify-center md:justify-end mt-2 md:mt-0">
					<Link to="/terms" className="hover:text-[#F47B3B]">
						Terms & Conditions
					</Link>
					<Link to="/privacy" className="hover:text-[#F47B3B]">
						Privacy Policy
					</Link>
				</div>
			</div>
		</footer>
	);
}
