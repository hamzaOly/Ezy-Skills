import iso27001 from "../assets/iso1.png";
import iso9001 from "../assets/iso2.png";
import iso20000 from "../assets/iso3.png";
import iso29993 from "../assets/iso4.png";
import nasscom from "../assets/nas.png";
import orangeDots from "../assets/bdot.png";

export default function CertificationsCollaborations() {
	return (
		<div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				{/* Certifications Section */}
				<div className="mb-20">
					<h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
						<span className="text-blue-900">Our </span>
						<span className="text-orange-500">Certifications</span>
					</h2>

					<div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
						{/* ISO 27001 */}
						<div className="shrink-0">
							<img
								src={iso27001}
								alt="ISO 27001 Certified"
								className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain hover:scale-110 transition-transform duration-300"
							/>
						</div>

						{/* ISO 9001 */}
						<div className="shrink-0">
							<img
								src={iso9001}
								alt="ISO 9001 Certified"
								className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain hover:scale-110 transition-transform duration-300"
							/>
						</div>

						{/* ISO 20000-1 */}
						<div className="shrink-0">
							<img
								src={iso20000}
								alt="ISO 20000-1 Certified"
								className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain hover:scale-110 transition-transform duration-300"
							/>
						</div>

						{/* ISO 29993 */}
						<div className="shrink-0">
							<img
								src={iso29993}
								alt="ISO 29993 Certified"
								className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain hover:scale-110 transition-transform duration-300"
							/>
						</div>
					</div>
				</div>

				{/* Collaborations Section */}
				<div className="relative">
					{/* Decorative Dots - Left */}
					<img
						src={orangeDots}
						alt=""
						className="absolute left-0 top-1/2 transform -translate-y-1/2 w-16 md:w-20 lg:w-24 opacity-80"
					/>

					<h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
						<span className="text-blue-900">Our </span>
						<span className="text-orange-500">Collaborations</span>
					</h2>

					<div className="flex flex-wrap justify-center items-center gap-2 md:gap-12 lg:gap-20 ">
						{/* NASSCOM Foundation */}
						<div className="shrink-0">
							<img
								src={nasscom}
								alt="NASSCOM Foundation"
								className="w-600 h-auto object-contain hover:scale-110 transition-transform duration-300"
								style={{ maxWidth: "600px" }}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
