import useApi from "../hooks/useApi.jsx";

import HeroSection from "../components/HeroSection";
import Carousel from "../components/Carousel";
import WhoCanJoin from "../components/whoCanJoin";
import HowItWorks from "../components/HowItworks";
const Home = () => {
	const { data, loading, error } = useApi();
	console.log(" this from Home " + data);
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Failed to fetch</p>;

	return (
		<>
			<div className="bg-white">
				<HeroSection />

				<Carousel />
				<WhoCanJoin />
				<HowItWorks />

				<div className="max-w-7xl mx-auto px-4 py-12"></div>
			</div>
		</>
	);
};
export default Home;
