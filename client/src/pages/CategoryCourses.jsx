// CategoryCourses.jsx
import { useEffect, useState } from "react";

export default function CategoryCourses({ category }) {
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		fetch(`http://localhost:5000/api/teacher-courses/category/${category}`)
			.then((res) => res.json())
			.then((data) => setCourses(data))
			.catch((err) => console.error(err));
	}, [category]);

	if (!courses.length) return <p>No courses in this category yet.</p>;

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{courses.map((course) => (
				<div key={course.id} className="border p-4 rounded shadow">
					<h3 className="font-bold">{course.title}</h3>
					<p>{course.description}</p>
					{course.live_demo_url && (
						<video
							controls
							src={`http://localhost:5000${course.live_demo_url}`}
							className="mt-2 w-full"
						/>
					)}
				</div>
			))}
		</div>
	);
}
