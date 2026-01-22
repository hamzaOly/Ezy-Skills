import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/authService";

export default function AdminDashboard() {
	const navigate = useNavigate();

	const [user] = useState(() => {
		const currentUser = getCurrentUser();
		if (!currentUser || currentUser.role !== "admin") {
			return null;
		}
		return currentUser;
	});

	const [activeTab, setActiveTab] = useState("overview");
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalTeachers: 0,
		totalStudents: 0,
		totalCourses: 0,
		totalEnrollments: 0,
		totalRevenue: 0,
		pendingCourses: 0,
		pendingBundles: 0,
	});
	const [users, setUsers] = useState([]);
	const [courses, setCourses] = useState([]);
	const [teachers, setTeachers] = useState([]);
	const [pendingCourses, setPendingCourses] = useState([]);
	const [bundles, setBundles] = useState([]);
	const [pendingBundles, setPendingBundles] = useState([]);
	const [loading, setLoading] = useState(true);

	const fetchDashboardData = useCallback(async () => {
		try {
			const [usersRes, coursesRes, teachersRes, pendingCoursesRes, bundlesRes] =
				await Promise.all([
					fetch("http://localhost:5000/api/admin/users"),
					fetch("http://localhost:5000/api/admin/courses"),
					fetch("http://localhost:5000/api/admin/teachers"),
					fetch("http://localhost:5000/api/admin/courses/pending"),
					fetch("http://localhost:5000/api/admin/bundles"),
				]);

			const usersData = await usersRes.json();
			const coursesData = await coursesRes.json();
			const teachersData = await teachersRes.json();
			const pendingCoursesData = await pendingCoursesRes.json();
			const bundlesData = await bundlesRes.json();

			setUsers(usersData.users || []);
			setCourses(coursesData.courses || []);
			setTeachers(teachersData.teachers || []);
			setPendingCourses(pendingCoursesData.courses || []);
			setBundles(bundlesData.bundles || []);
			setPendingBundles(bundlesData.bundles?.filter((b) => !b.is_active) || []);

			setStats({
				totalUsers: usersData.users?.length || 0,
				totalTeachers:
					usersData.users?.filter((u) => u.role === "teacher").length || 0,
				totalStudents:
					usersData.users?.filter((u) => u.role === "student").length || 0,
				totalCourses: coursesData.courses?.length || 0,
				totalEnrollments: 0,
				totalRevenue: 0,
				pendingCourses: pendingCoursesData.courses?.length || 0,
				pendingBundles:
					bundlesData.bundles?.filter((b) => !b.is_active).length || 0,
			});

			setLoading(false);
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!user) {
			navigate("/");
			return;
		}
		fetchDashboardData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const handleDeleteUser = async (userId) => {
		if (!window.confirm("Are you sure you want to delete this user?")) return;

		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`http://localhost:5000/api/admin/users/${userId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (response.ok) {
				alert("User deleted successfully");
				fetchDashboardData();
			}
		} catch (error) {
			console.error("Error deleting user:", error);
			alert("Failed to delete user");
		}
	};

	const handleDeleteCourse = async (courseId) => {
		if (!window.confirm("Are you sure you want to delete this course?")) return;

		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`http://localhost:5000/api/admin/courses/${courseId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (response.ok) {
				alert("Course deleted successfully");
				fetchDashboardData();
			}
		} catch (error) {
			console.error("Error deleting course:", error);
			alert("Failed to delete course");
		}
	};

	const handleApproveCourse = async (courseId) => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`http://localhost:5000/api/admin/courses/${courseId}/approve`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (response.ok) {
				alert("Course approved successfully");
				fetchDashboardData();
			}
		} catch (error) {
			console.error("Error approving course:", error);
			alert("Failed to approve course");
		}
	};

	const handleRejectCourse = async (courseId) => {
		const reason = window.prompt("Enter rejection reason (optional):");

		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`http://localhost:5000/api/admin/courses/${courseId}/reject`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						rejection_reason: reason || "No reason provided",
					}),
				},
			);

			if (response.ok) {
				alert("Course rejected");
				fetchDashboardData();
			}
		} catch (error) {
			console.error("Error rejecting course:", error);
			alert("Failed to reject course");
		}
	};

	const handleApproveBundle = async (bundleId) => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`http://localhost:5000/api/admin/bundles/${bundleId}/approve`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (response.ok) {
				alert(
					"Bundle approved successfully! It will now appear on the pricing page.",
				);
				fetchDashboardData();
			}
		} catch (error) {
			console.error("Error approving bundle:", error);
			alert("Failed to approve bundle");
		}
	};

	const handleRejectBundle = async (bundleId) => {
		if (!window.confirm("Are you sure you want to reject this bundle?")) return;

		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`http://localhost:5000/api/admin/bundles/${bundleId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (response.ok) {
				alert("Bundle rejected");
				fetchDashboardData();
			}
		} catch (error) {
			console.error("Error rejecting bundle:", error);
			alert("Failed to reject bundle");
		}
	};

	const handleVerifyTeacher = async (teacherId, isVerified) => {
		try {
			const token = localStorage.getItem("token");
			const response = await fetch(
				`http://localhost:5000/api/admin/teachers/${teacherId}/verify`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ is_verified: !isVerified }),
				},
			);

			if (response.ok) {
				alert("Teacher verification updated");
				fetchDashboardData();
			}
		} catch (error) {
			console.error("Error updating teacher:", error);
			alert("Failed to update teacher");
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-2xl">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Header */}
			<header className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex justify-between items-center">
						<h1 className="text-3xl font-bold text-gray-900">
							Admin Dashboard
						</h1>
						<div className="flex items-center space-x-4">
							<span className="text-sm text-gray-600">{user?.email}</span>
							<button
								onClick={handleLogout}
								className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
								Logout
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Stats Cards */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-lg shadow p-6">
						<div className="flex items-center">
							<div className="shrink-0 bg-blue-500 rounded-md p-3">
								<svg
									className="h-6 w-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
									/>
								</svg>
							</div>
							<div className="ml-5">
								<p className="text-sm font-medium text-gray-500">Total Users</p>
								<p className="text-2xl font-semibold text-gray-900">
									{stats.totalUsers}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow p-6">
						<div className="flex items-center">
							<div className="shrink-0 bg-green-500 rounded-md p-3">
								<svg
									className="h-6 w-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
							</div>
							<div className="ml-5">
								<p className="text-sm font-medium text-gray-500">
									Total Teachers
								</p>
								<p className="text-2xl font-semibold text-gray-900">
									{stats.totalTeachers}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow p-6">
						<div className="flex items-center">
							<div className="shrink-0 bg-yellow-500 rounded-md p-3">
								<svg
									className="h-6 w-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
									/>
								</svg>
							</div>
							<div className="ml-5">
								<p className="text-sm font-medium text-gray-500">
									Pending Courses
								</p>
								<p className="text-2xl font-semibold text-gray-900">
									{stats.pendingCourses}
								</p>
							</div>
						</div>
					</div>

					<div className="bg-white rounded-lg shadow p-6">
						<div className="flex items-center">
							<div className="shrink-0 bg-purple-500 rounded-md p-3">
								<svg
									className="h-6 w-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									/>
								</svg>
							</div>
							<div className="ml-5">
								<p className="text-sm font-medium text-gray-500">
									Pending Bundles
								</p>
								<p className="text-2xl font-semibold text-gray-900">
									{stats.pendingBundles}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="bg-white rounded-lg shadow mb-6">
					<div className="border-b border-gray-200">
						<nav className="flex -mb-px overflow-x-auto">
							{[
								"overview",
								"users",
								"courses",
								"pending-courses",
								"bundles",
								"teachers",
							].map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`py-4 px-6 font-medium text-sm whitespace-nowrap ${
										activeTab === tab
											? "border-b-2 border-blue-500 text-blue-600"
											: "text-gray-500 hover:text-gray-700"
									}`}>
									{tab === "pending-courses"
										? `Pending Courses (${stats.pendingCourses})`
										: tab === "bundles"
											? `Bundles (${stats.pendingBundles} pending)`
											: tab.charAt(0).toUpperCase() +
												tab.slice(1).replace("-", " ")}
								</button>
							))}
						</nav>
					</div>

					{/* Tab Content */}
					<div className="p-6">
						{/* Overview Tab */}
						{activeTab === "overview" && (
							<div>
								<h2 className="text-xl font-bold mb-4">Platform Overview</h2>
								<div className="grid grid-cols-2 gap-4">
									<div className="border rounded p-4">
										<h3 className="font-semibold mb-2">Quick Stats</h3>
										<p className="text-sm text-gray-600">
											Total Courses: {stats.totalCourses}
										</p>
										<p className="text-sm text-gray-600">
											Pending Approval: {stats.pendingCourses}
										</p>
										<p className="text-sm text-gray-600">
											Pending Bundles: {stats.pendingBundles}
										</p>
									</div>
									<div className="border rounded p-4">
										<h3 className="font-semibold mb-2">Quick Actions</h3>
										<button
											onClick={() => setActiveTab("pending-courses")}
											className="text-sm text-blue-600 hover:underline block">
											Review Pending Courses
										</button>
										<button
											onClick={() => setActiveTab("bundles")}
											className="text-sm text-blue-600 hover:underline block">
											Approve Bundles
										</button>
									</div>
								</div>
							</div>
						)}

						{/* Users Tab */}
						{activeTab === "users" && (
							<div>
								<h2 className="text-xl font-bold mb-4">All Users</h2>
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													ID
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Email
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Role
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Created
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{users.map((user) => (
												<tr key={user.id}>
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														{user.id}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														{user.email}
													</td>
													<td className="px-6 py-4 whitespace-nowrap">
														<span
															className={`px-2 py-1 text-xs rounded-full ${
																user.role === "admin"
																	? "bg-red-100 text-red-800"
																	: user.role === "teacher"
																		? "bg-green-100 text-green-800"
																		: "bg-blue-100 text-blue-800"
															}`}>
															{user.role}
														</span>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														{new Date(user.created_at).toLocaleDateString()}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														<button
															onClick={() => handleDeleteUser(user.id)}
															className="text-red-600 hover:text-red-900">
															Delete
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{/* Courses Tab */}
						{activeTab === "courses" && (
							<div>
								<h2 className="text-xl font-bold mb-4">All Courses</h2>
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													ID
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Title
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Category
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Price
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Status
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{courses.map((course) => (
												<tr key={course.id}>
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														{course.id}
													</td>
													<td className="px-6 py-4 text-sm">{course.title}</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														{course.category}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														₹{course.price}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														<span
															className={`px-2 py-1 text-xs rounded-full ${
																course.approval_status === "approved"
																	? "bg-green-100 text-green-800"
																	: course.approval_status === "rejected"
																		? "bg-red-100 text-red-800"
																		: "bg-yellow-100 text-yellow-800"
															}`}>
															{course.approval_status}
														</span>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														<button
															onClick={() => handleDeleteCourse(course.id)}
															className="text-red-600 hover:text-red-900">
															Delete
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}

						{/* Pending Courses Tab */}
						{activeTab === "pending-courses" && (
							<div>
								<h2 className="text-xl font-bold mb-4">
									Pending Courses - Awaiting Approval
								</h2>
								{pendingCourses.length === 0 ? (
									<p className="text-center text-gray-500 py-12">
										No pending courses
									</p>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{pendingCourses.map((course) => (
											<div
												key={course.id}
												className="border rounded-lg p-6 bg-white shadow">
												<h3 className="text-lg font-bold text-gray-900 mb-2">
													{course.title}
												</h3>
												<p className="text-sm text-gray-600 mb-4">
													{course.description}
												</p>

												<div className="grid grid-cols-2 gap-2 text-sm mb-4">
													<div>
														<span className="text-gray-500">Teacher:</span>
														<p className="font-medium">{course.teacher_name}</p>
													</div>
													<div>
														<span className="text-gray-500">Category:</span>
														<p className="font-medium">{course.category}</p>
													</div>
													<div>
														<span className="text-gray-500">Price:</span>
														<p className="font-medium">₹{course.price}</p>
													</div>
													<div>
														<span className="text-gray-500">Level:</span>
														<p className="font-medium">{course.level}</p>
													</div>
												</div>

												<div className="flex gap-2">
													<button
														onClick={() => handleApproveCourse(course.id)}
														className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
														✓ Approve
													</button>
													<button
														onClick={() => handleRejectCourse(course.id)}
														className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
														✗ Reject
													</button>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}

						{/* Bundles Tab */}
						{activeTab === "bundles" && (
							<div>
								<h2 className="text-xl font-bold mb-4">Course Bundles</h2>

								{/* Pending Bundles */}
								<div className="mb-8">
									<h3 className="text-lg font-semibold text-orange-600 mb-4">
										⏳ Pending Approval ({pendingBundles.length})
									</h3>
									{pendingBundles.length === 0 ? (
										<p className="text-gray-500 text-center py-6">
											No pending bundles
										</p>
									) : (
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
											{pendingBundles.map((bundle) => (
												<div
													key={bundle.id}
													className="border-2 border-orange-300 rounded-lg p-6 bg-orange-50">
													<h4 className="text-lg font-bold text-gray-900 mb-2">
														{bundle.title}
													</h4>
													<p className="text-sm text-gray-600 mb-4">
														{bundle.description}
													</p>

													<div className="mb-4">
														<p className="text-xs text-gray-500 mb-2">
															Teacher: {bundle.teacher_name}
														</p>
														<p className="text-xs text-gray-500 mb-2">
															Courses included:
														</p>
														<ul className="list-disc list-inside text-sm">
															{bundle.courses?.map((course, idx) => (
																<li key={idx} className="text-gray-700">
																	{course.title} - ₹{course.price}
																</li>
															))}
														</ul>
													</div>

													<div className="bg-white rounded p-3 mb-4">
														<div className="flex justify-between text-sm mb-1">
															<span>Total Price:</span>
															<span className="font-semibold">
																₹{bundle.total_price}
															</span>
														</div>
														<div className="flex justify-between text-sm text-green-600">
															<span>
																Discount ({bundle.discount_percentage}%):
															</span>
															<span>
																-₹
																{(
																	bundle.total_price - bundle.discounted_price
																).toFixed(2)}
															</span>
														</div>
														<div className="flex justify-between text-lg font-bold text-orange-500 mt-2 pt-2 border-t">
															<span>Bundle Price:</span>
															<span>₹{bundle.discounted_price}</span>
														</div>
													</div>

													<div className="flex gap-2">
														<button
															onClick={() => handleApproveBundle(bundle.id)}
															className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
															✓ Approve & Publish
														</button>
														<button
															onClick={() => handleRejectBundle(bundle.id)}
															className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
															✗ Reject
														</button>
													</div>
												</div>
											))}
										</div>
									)}
								</div>

								{/* Approved Bundles */}
								<div>
									<h3 className="text-lg font-semibold text-green-600 mb-4">
										✓ Approved Bundles (
										{bundles.filter((b) => b.is_active).length})
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{bundles
											.filter((b) => b.is_active)
											.map((bundle) => (
												<div
													key={bundle.id}
													className="border rounded-lg p-6 bg-white shadow">
													<h4 className="text-lg font-bold text-gray-900 mb-2">
														{bundle.title}
													</h4>
													<p className="text-sm text-gray-600 mb-4">
														{bundle.description}
													</p>

													<div className="mb-4">
														<p className="text-xs text-gray-500 mb-2">
															Teacher: {bundle.teacher_name}
														</p>
														<ul className="list-disc list-inside text-sm">
															{bundle.courses?.map((course, idx) => (
																<li key={idx} className="text-gray-700">
																	{course.title}
																</li>
															))}
														</ul>
													</div>

													<div className="flex justify-between items-center">
														<span className="text-xl font-bold text-orange-500">
															₹{bundle.discounted_price}
														</span>
														<span className="text-sm text-green-600">
															✓ Live on Pricing
														</span>
													</div>
												</div>
											))}
									</div>
								</div>
							</div>
						)}

						{/* Teachers Tab */}
						{activeTab === "teachers" && (
							<div>
								<h2 className="text-xl font-bold mb-4">All Teachers</h2>
								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-gray-200">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													ID
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Name
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Email
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Specialization
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Verified
												</th>
												<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
													Actions
												</th>
											</tr>
										</thead>
										<tbody className="bg-white divide-y divide-gray-200">
											{teachers.map((teacher) => (
												<tr key={teacher.id}>
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														{teacher.id}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														{teacher.full_name}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														{teacher.email}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														{teacher.specialization}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														{teacher.is_verified ? "✅ Yes" : "❌ No"}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
														<button
															onClick={() =>
																handleVerifyTeacher(
																	teacher.id,
																	teacher.is_verified,
																)
															}
															className="text-blue-600 hover:text-blue-900">
															{teacher.is_verified ? "Unverify" : "Verify"}
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
