import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getApiData } from "./services/api";
import Home from "./pages/Home";
import Navbar from "./layouts/NavBar";

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
			</Routes>
		</BrowserRouter>
	);
}

export default App;
