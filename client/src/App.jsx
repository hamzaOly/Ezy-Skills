import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getApiData } from "./services/api.js";
import AdminDashboard from "./pages/Admindashboard.jsx";
import CourseList from "./pages/Courselist.jsx";
import Home from "./pages/Home";
import Navbar from "./layouts/NavBar";
import FAQ from "./pages/FAQ.jsx";
import Register from "./pages/register";
import Login from "./pages/LogIn";
import Footer from "./components/Footer.jsx";
import TeacherDashboard from "./components/TeacherDashboard/TeacherDashboard.jsx";
import TeacherRegister from "./pages/Teacherregister.jsx";
import CourseSelector from "./components/CourseSelector.jsx";
import CreateBundle from "./components/TeacherDashboard/CreateBundle.jsx";
import Pricing from "./pages/Pricing.jsx";
import CourseSelectorChat from "./pages/CourseSelectorChat";
import Contact from "./pages/ContactUs.jsx";

function App() {
	const [message, setMessage] = useState("Loading...");

	useEffect(() => {
		getApiData()
			.then((data) => {
				if (data?.message) {
					setMessage(data.message);
				}
			})
			.catch((err) => {
				console.error("Failed to load message:", err);
				setMessage("Server connection failed");
			});
	}, []);

	return (
		<BrowserRouter>
			<header
				className="hidden"
				style={{
					textAlign: "center",
					padding: "1rem",
					background: "#f0f0f0",
				}}>
				<h2>{message}</h2>
			</header>

			<Navbar />

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/createaccount" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register/teacher" element={<TeacherRegister />} />
				<Route path="/teacher-dashboard" element={<TeacherDashboard />} />
				<Route path="/admin-dashboard" element={<AdminDashboard />} />
				<Route path="/courses" element={<CourseList />} />
				<Route path="/FAQ" element={<FAQ />} />
				<Route path="/CourseSelector" element={<CourseSelector />} />
				<Route path="/course-selector-chat" element={<CourseSelectorChat />} />
				<Route path="/courses" element={<CourseList />} />
				<Route path="/create-bundle" element={<CreateBundle />} />
				<Route path="/Pricing" element={<Pricing />} />
				<Route path="/contactUs" element={<Contact />} />
			</Routes>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
