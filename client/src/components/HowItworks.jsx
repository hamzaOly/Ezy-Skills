import dots from "../assets/howItworks/dots.png";
import Group from "../assets/howItworks/Group.png";
import Rectangle from "../assets/howItworks/Rectangle.png";
import Ellipse from "../assets/howItworks/Ellipse.png";

export default function HowItWorks() {
	return (
		<div className="bg-white py-12 lg:py-20 relative overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative mt-8 sm:mt-12 mb-16 sm:mb-20">
					<img
						alt="Decorative orange circle"
						src={Ellipse}
						className="absolute z-0 -right-12 sm:-right-16 lg:-right-20 sm:-top-18 w-48 sm:w-56 lg:w-40 h-48 sm:h-56 lg:h-40 hidden sm:block"
					/>

					<div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2 z-20 w-64 sm:w-80 lg:w-96">
						<img
							alt="How it works header"
							src={Rectangle}
							className="w-full h-auto"
						/>
						<h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl sm:text-2xl lg:text-3xl font-bold whitespace-nowrap">
							How It Works
						</h1>
					</div>

					<div className="bg-blue-900 z-10 relative rounded-2xl sm:rounded-3xl pt-12 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-8 lg:px-16 overflow-hidden">
						{/* White inner box */}
						<div className="bg-blue-900 rounded-xl sm:rounded-2xl p-4 sm:p-8 lg:p-12">
							{/* Process flow diagram */}
							<img
								alt="Process flow diagram"
								src={Group}
								className="w-full h-auto"
							/>
						</div>
					</div>

					<div className="absolute z-10 sm:-bottom-17.5 left-10 w-20 sm:w-24 lg:w-20 ">
						<img alt="Decorative dots" src={dots} className="w-full h-auto" />
					</div>
				</div>
			</div>
		</div>
	);
}
