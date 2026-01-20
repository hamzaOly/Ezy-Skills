import Frame from "../assets/Frame.png";
import GroupiconsOne from "../assets/whoCanJoin/GroupiconsOne.png";
import GroupiconsTwo from "../assets/whoCanJoin/GroupiconsTwo.png";
import GroupiconsThree from "../assets/whoCanJoin/GroupiconsThree.png";
import GroupiconsFour from "../assets/whoCanJoin/GroupiconsFour.png";

export default function WhoCanJoin() {
	const categories = [
		{
			number: "01",
			title: "Colleges/Universities",
			image: GroupiconsOne,
		},
		{
			number: "02",
			title: "Individuals/Working Professionals",
			image: GroupiconsTwo,
		},
		{
			number: "03",
			title: "Startups",
			image: GroupiconsThree,
		},
		{
			number: "04",
			title: "Corporates",
			image: GroupiconsFour,
		},
	];

	return (
		<div className="bg-white py-12 lg:py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
					{/* Left Content */}
					<div>
						{/* Section Label */}
						<p className="text-orange-500 text-sm font-semibold tracking-widest uppercase mb-4">
							WHO CAN JOIN
						</p>

						{/* Main Heading */}
						<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-900 mb-12">
							Skill Development
							<br />
							Schemes For All
						</h2>

						{/* Categories Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
							{categories.map((category, index) => (
								<div key={index} className="flex items-start gap-4">
									{/* Number */}
									<span className="text-3xl font-bold text-blue-900">
										{category.number}
									</span>

									<div className="flex-1">
										{/* Icon */}
										<div className="mb-3">
											<img
												src={category.image}
												alt={`${category.title} icon`}
												className="w-16 h-16"
											/>
										</div>

										{/* Title */}
										<h3 className="text-lg font-semibold text-gray-800">
											{category.title}
										</h3>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Right Content - Illustration */}
					<div className="relative">
						<img
							src={Frame}
							alt="Person working on laptop with online learning interface"
							className="w-full h-auto max-w-lg mx-auto"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
