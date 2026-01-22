import api from "./axios.js";

export const register = async (email, password) => {
	try {
		const response = await api.post("/auth/register", {
			email,
			password,
		});

		if (response.data.token) {
			localStorage.setItem("token", response.data.token);
			localStorage.setItem("user", JSON.stringify(response.data.user));
		}
		return response.data;
	} catch (error) {
		throw error.response?.data?.error || "Registration failed";
	}
};

export const login = async (email, password) => {
	try {
		const response = await api.post("/auth/login", {
			email,
			password,
		});
		if (response.data.token) {
			localStorage.setItem("token", response.data.token);
			localStorage.setItem("user", JSON.stringify(response.data.user));
		}
		return response.data;
	} catch (error) {
		throw error.response?.data?.error;
	}
	
};

export const logout = () => {
	localStorage.removeItem("token");
	localStorage.removeItem("user");
};

export const getCurrentUser = () => {
	const user = localStorage.getItem("user");
	return user ? JSON.parse(user) : null;
};
export const isAuthenticated = () => {
	return !!localStorage.getItem("token");
};

export const getToken = () => {
	return localStorage.getItem("token");
};
export const registerTeacher = async (data) => {
	const res = await fetch("http://localhost:5000/api/auth/register/teacher", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	const result = await res.json();

	if (!res.ok) {
		throw new Error(result.error || "Registration failed");
	}

	return result;
};
