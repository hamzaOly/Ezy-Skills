import api from "./axios";

export const getApiData = async () => {
	const response = await api.get("/"); // Change from "/" to "/test"
	return response.data;
};
