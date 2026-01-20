import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import Carousel from "../components/Carousel";
import WhoCanJoin from "../components/whoCanJoin";
import HowItWorks from "../components/HowItworks";

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
			<p>API Data: {data ? data.message : "Loading..."}</p>
			<HeroSection />
			<Carousel />
			<WhoCanJoin />
			<HowItWorks />
		</div>
	);
};

export default Home;
