import { useState, useEffect } from "react";
import TeacherCourseForm from "./TeacherCoursesForm.jsx";
import TeacherCoursesList from "./TeacherCoursesList";
import { Link } from "react-router-dom";

export default function TeacherDashboard() {
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);

	// Fetch teacher's courses
	const fetchCourses = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");
			const response = await fetch(
				"http://localhost:5000/api/teacher-courses",
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);

			if (!response.ok) {
				throw new Error("Failed to fetch courses");
			}

			const data = await response.json();
			setCourses(data.courses || []);
		} catch (err) {
			console.error("Error fetching courses:", err);
		} finally {
			setLoading(false);
		}
	};

	// Load courses on component mount
	useEffect(() => {
		fetchCourses();
	}, []);

	return (
		<div className="p-6">
			<h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Form to create new course */}
				<TeacherCourseForm
					onCourseCreated={fetchCourses} // make sure form calls this after success
				/>
				<Link to="/create-bundle">Create Course Bundle</Link>
				{/* List of existing courses */}
				{loading ? (
					<p>Loading courses...</p>
				) : (
					<TeacherCoursesList courses={courses} />
				)}
			</div>
		</div>
	);
}
