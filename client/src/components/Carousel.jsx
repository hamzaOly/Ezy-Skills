import { useState, useEffect } from "react";
import sliderOne from "../assets/selectorOne.png";
import sliderTwo from "../assets/selectorTwo.png";
import sliderThree from "../assets/selectorThree.png";
import sliderFour from "../assets/selectorFour.png";
function Carousel() {
	const [currentSlide, setCurrentSlide] = useState(0);

	const slides = [
		{
			image: sliderOne,
			alt: "image 1",
		},
		{
			image: sliderTwo,

			alt: "image 2",
		},
		{
			image: sliderThree,
			alt: "image 3",
		},
		{
			image: sliderFour,
			alt: "image 4",
		},
	];

	// Auto slide every 5 seconds
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5000);
		return () => clearInterval(timer);
	}, [slides.length]);

	const goToSlide = (index) => {
		setCurrentSlide(index);
	};

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	};

	return (
		<div className="bg-white py-12 lg:py-20">
			<div className="max-w-20xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
					{/* Left Content - Text */}
					<div className="relative">
						<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
							<span className="text-blue-900">World's</span>
							<br />
							<span className="text-blue-900">First AI Based</span>
							<br />
							<span className="text-orange-500">Online Learning</span>
							<br />
							<span className="text-orange-500">Platform</span>
						</h2>

						{/* Decorative Dots Grid */}
						<div className="-bottom-12 left-0 grid grid-cols-8 mt-20 gap-2 w-32">
							{[...Array(40)].map((_, i) => (
								<div
									key={i}
									className="w-2 h-2 bg-orange-500 rounded-full"></div>
							))}
						</div>
					</div>

					{/* Right Content - Carousel Slider */}
					<div className="relative h-96 lg:h-110 rounded-2xl overflow-hidden group">
						{/* Images */}
						{slides.map((slide, index) => (
							<img
								key={index}
								src={slide.image}
								alt={slide.alt}
								className={`absolute top-0 left-0 h-full w-full object-cover transition-opacity duration-700 ${
									index === currentSlide ? "opacity-100" : "opacity-0"
								}`}
							/>
						))}

						{/* Previous Button */}
						<button
							onClick={prevSlide}
							className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

						{/* Next Button */}
						<button
							onClick={nextSlide}
							className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

						{/* Navigation Dots */}
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
							{slides.map((_, index) => (
								<button
									key={index}
									onClick={() => goToSlide(index)}
									className={`h-2 rounded-full transition-all duration-300 ${
										index === currentSlide
											? "w-8 bg-orange-500"
											: "w-2 bg-white/70 hover:bg-white"
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

export default Carousel;
