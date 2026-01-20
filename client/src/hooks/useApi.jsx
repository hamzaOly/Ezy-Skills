import { useState, useEffect } from "react";
import { getApiData } from "../services/api";

export default function useApi() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		getApiData()
			.then((res) => setData(res))
			.catch((err) => setError(err))
			.finally(() => setLoading(false));
	}, []);

	return { data, loading, error };
}
