import { useEffect, useState } from "react";
import { getMessage } from "../services/api";

export default function Api() {
	const [message, setMessage] = useState("Loading...");
	const [error, setError] = useState(null);

	useEffect(() => {
		getMessage()
			.then((data) => setMessage(data.message))
			.catch(() => setError("Server connection failed"));
	}, []);

	if (error) return <p style={{ color: "red" }}>{error}</p>;

	return <h2>{message}</h2>;
}
