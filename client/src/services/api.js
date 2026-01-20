import api from "./axios";

export const getApiData = async () => {
	// This will call http://localhost:5000/api (or just call the root without /api)
	const response = await api.get("/");
	return response.data;
};
