// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import api from "./services/api";
import AdminDashboard from "./pages/Admindashboard.jsx";
import TeacherDashboard from "./components/TeacherDashboard/TeacherDashboard.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CourseList from "./pages/Courselist.jsx";
import Home from "./pages/Home";
import Navbar from "./layouts/NavBar";
import FAQ from "./pages/FAQ.jsx";
import Register from "./pages/register";
import Login from "./pages/LogIn";
import Footer from "./components/Footer.jsx";
import TeacherRegister from "./pages/Teacherregister.jsx";
import CourseSelector from "./components/CourseSelector.jsx";
import CreateBundle from "./components/TeacherDashboard/CreateBundle.jsx";
import Pricing from "./pages/Pricing.jsx";
import CourseSelectorChat from "./pages/CourseSelectorChat.jsx";
import Contact from "./pages/ContactUs.jsx";
import CourseDetails from "./pages/Coursedetails.jsx";
import AdminCreateBundle from "./components/AdminCreateBundle";

function App() {
	const [message, setMessage] = useState("Loading...");

	useEffect(() => {
		api()
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
			<header className="hidden">
				<h2>{message}</h2>
			</header>

			<Navbar />

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/createaccount" element={<Register />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register/teacher" element={<TeacherRegister />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/teacher-dashboard" element={<TeacherDashboard />} />
				<Route path="/admin-dashboard" element={<AdminDashboard />} />
				<Route path="/courses" element={<CourseList />} />
				<Route path="/FAQ" element={<FAQ />} />
				<Route path="/CourseSelector" element={<CourseSelector />} />
				<Route path="/course-selector-chat" element={<CourseSelectorChat />} />
				<Route path="/create-bundle" element={<CreateBundle />} />
				<Route path="/Pricing" element={<Pricing />} />
				<Route path="/contactUs" element={<Contact />} />
				<Route path="/courses/:courseId" element={<CourseDetails />} />
				<Route path="/admin/create-bundle" element={<AdminCreateBundle />} />
			</Routes>

			<Footer />
		</BrowserRouter>
	);
}

export default App;
