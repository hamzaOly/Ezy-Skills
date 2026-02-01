// src/pages/Dashboard.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

export default function Dashboard() {
	const navigate = useNavigate();
	const user = getCurrentUser();

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}

		switch (user.role) {
			case "admin":
				navigate("/admin-dashboard");
				break;
			case "teacher":
				navigate("/teacher-dashboard");
				break;
			default:
				navigate("/"); // أو "/dashboard-user" لو عندك صفحة للمستخدم العادي
				break;
		}
	}, [user, navigate]);

	return null; // لا حاجة لأي render
}
