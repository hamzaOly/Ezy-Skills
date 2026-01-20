import api from "./axios";

export const getApiData = async () => {
	const response = await api.get("/");
	return response.data;
};
