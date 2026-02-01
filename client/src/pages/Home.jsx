import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import Carousel from "../components/Carousel";
import WhoCanJoin from "../components/whoCanJoin";
import HowItWorks from "../components/HowItworks";
import PopularCourses from "../components/PopularCourses.jsx";
import AchievementsMentors from "../components/Achivements.jsx";
import CertificationsCollaborations from "../components/Certificationscollaborations.jsx";

const Home = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		fetch("http://localhost:5000/api")
			.then((res) => res.json())
			.then((data) => {
				console.log("API Response:", data);
				setData(data);
			})
			.catch((err) => console.error("API Error:", err));
	}, []);

	return (
		<div className="bg-white">
			<p className="hidden">API Data: {data ? data.message : "Loading..."}</p>
			<HeroSection />
			<Carousel />
			<WhoCanJoin />
			<HowItWorks />
			<PopularCourses />
			<AchievementsMentors />
			<CertificationsCollaborations />
		</div>
	);
};

export default Home;
