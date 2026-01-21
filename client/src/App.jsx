import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getApiData } from "./services/api.js";
import Home from "./pages/Home";
import Navbar from "./layouts/NavBar";
import Register from "./pages/register";
import Login from "./pages/LogIn";
import TeacherRegister from "./pages/Teacherregister.jsx";

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
			</Routes>
		</BrowserRouter>
	);
}

export default App;
