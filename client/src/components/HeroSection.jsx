import Women from "../assets/women.png";

function HeroSection() {
	return (
		<div className="bg-white py-12 lg:py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
					<div className="space-y-6">
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-900 leading-tight">
							Skill Your Way<sup className="text-purple-500 text-2xl">®</sup>
							<br />
							Up To Success
							<br />
							With Us
						</h1>

						<p className="text-gray-500 text-lg sm:text-xl">
							Get the skills you need for
							<br />
							the future of work.
						</p>

						<div className="flex items-center gap-2 max-w-md">
							<div className="flex-1 relative">
								<input
									type="text"
									placeholder="Search the course you want"
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
								/>
							</div>
							<button className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors">
								Search
							</button>
						</div>

						<div className="flex flex-wrap gap-3 pt-4">
							<button className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors">
								Cloud Computing
							</button>
							<button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors">
								Cyber Security
							</button>
							<button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors">
								DevOps
							</button>
						</div>

						<div className="flex flex-wrap gap-3">
							<button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors">
								Data Science
							</button>
							<button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors">
								Software Testing
							</button>
						</div>
					</div>

					<div className="relative">
						{/* Decorative Shapes */}
						<div className="absolute top-0 right-0 w-72 h-72 bg-orange-400 rounded-full opacity-80 -z-10"></div>
						<div className="absolute top-20 left-10 w-64 h-64 bg-blue-900 rounded-full opacity-80 -z-10"></div>

						<div className="relative z-10  p-4 ">
							<img alt="" className="w-full h-auto rounded-lg" src={Women} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default HeroSection;
