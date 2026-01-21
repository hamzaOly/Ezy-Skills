export default function TeacherCoursesList({ courses }) {
	if (!courses.length) return <p>No courses yet.</p>;

	return (
		<div className="space-y-4">
			{courses.map((course) => (
				<div
					key={course.id}
					className="border p-4 rounded shadow flex flex-col lg:flex-row gap-4">
					{course.thumbnail_url && (
						<img
							src={`http://localhost:5000${course.thumbnail_url}`}
							alt={course.title}
							className="w-full lg:w-48 h-32 object-cover rounded"
						/>
					)}
					<div>
						<h3 className="font-bold text-lg">{course.title}</h3>
						<p className="text-gray-600">{course.description}</p>
						<p className="text-sm text-gray-500">
							Category: {course.category} | Level: {course.level} | Price: $
							{course.price}
						</p>
						{course.live_demo_url && (
							<video
								controls
								src={`http://localhost:5000${course.live_demo_url}`}
								className="mt-2 w-full"
							/>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
