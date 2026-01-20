import axios from "axios";

const api = axios.create({
	baseURL: "/api", // proxy handles forwarding to backend
	timeout: 5000,
});

export default api;
