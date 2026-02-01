import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TeacherCourseForm from "./TeacherCoursesForm.jsx";
import TeacherCoursesList from "./TeacherCoursesList";
import { getCurrentUser, logout } from "../../services/authService.js";

export default function TeacherDashboard() {
	const navigate = useNavigate();
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);

	const user = getCurrentUser();

	// Fetch teacher's courses
	const fetchCourses = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");

			if (!token) {
				navigate("/login");
				return;
			}

			const response = await fetch(
				"http://localhost:5000/api/teacher-courses",
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (response.status === 401 || response.status === 403) {
				logout();
				navigate("/login");
				return;
			}

			if (!response.ok) throw new Error("Failed to fetch courses");

			const data = await response.json();
			setCourses(data.courses || []);
		} catch (err) {
			console.error("Error fetching courses:", err);
		} finally {
			setLoading(false);
		}
	};

	// Run only once on mount
	useEffect(() => {
		if (!user || user.role !== "teacher") {
			navigate("/login");
			return;
		}

		fetchCourses();
	}, []); //

	const handleCourseCreated = () => {
		setShowForm(false);
		fetchCourses();
	};
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Stats Cards */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-sm font-medium text-gray-500 mb-2">
							Total Courses
						</h3>
						<p className="text-3xl font-bold text-gray-900">{courses.length}</p>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-sm font-medium text-gray-500 mb-2">
							Approved Courses
						</h3>
						<p className="text-3xl font-bold text-green-600">
							{courses.filter((c) => c.approval_status === "approved").length}
						</p>
					</div>
					<div className="bg-white rounded-lg shadow p-6">
						<h3 className="text-sm font-medium text-gray-500 mb-2">
							Pending Approval
						</h3>
						<p className="text-3xl font-bold text-orange-600">
							{courses.filter((c) => c.approval_status === "pending").length}
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-4 mb-8">
					<button
						onClick={() => setShowForm(!showForm)}
						className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold">
						{showForm ? "Hide Form" : "+ Create New Course"}
					</button>
					<Link to="/create-bundle">
						<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
							📦 Create Course Bundle
						</button>
					</Link>
				</div>

				{/* Course Form */}
				{showForm && (
					<div className="mb-8">
						<TeacherCourseForm onCourseCreated={handleCourseCreated} />
					</div>
				)}

				{/* Courses List */}
				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="text-2xl font-bold mb-6">My Courses</h2>
					{loading ? (
						<div className="text-center py-12">
							<p className="text-gray-500">Loading courses...</p>
						</div>
					) : courses.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-gray-500 mb-4">
								You haven't created any courses yet.
							</p>
							<button
								onClick={() => setShowForm(true)}
								className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
								Create Your First Course
							</button>
						</div>
					) : (
						<TeacherCoursesList courses={courses} onUpdate={fetchCourses} />
					)}
				</div>
			</div>
		</div>
	);
}
