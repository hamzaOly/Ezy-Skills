import { useEffect, useState } from "react";
import axios from "axios";
import ellipse from "../assets/CourseSelector/Ellipse.png";
import dots from "../assets/CourseSelector/dots.png";
import pluses from "../assets/CourseSelector/pluses.png";
import arrow from "../assets/CourseSelector/arrow.png";

export default function CourseSelectorChat() {
	// ================= STATE =================
	const [step, setStep] = useState(1);
	const [courses, setCourses] = useState([]);

	const [status, setStatus] = useState("");
	const [field, setField] = useState("");
	const [preference, setPreference] = useState("");
	const [selectedCourse, setSelectedCourse] = useState(null);

	// ================= FETCH =================

	useEffect(() => {
		const fetch = async () => {
			const res = await axios.get("http://localhost:5000/api/courses/public");
			setCourses(res.data?.courses ?? []);
		};

		fetch();
	}, []);

	// ================= HANDLERS =================
	const selectStatus = (value) => {
		setStatus(value);
		setStep(2);
	};

	const selectHelp = () => {
		setStep(3);
	};

	const selectField = (value) => {
		setField(value);
		setStep(4);
	};

	const selectPreference = (value) => {
		setPreference(value);
		setStep(5);
	};

	const selectCourse = (course) => {
		setSelectedCourse(course);
	};

	const handleNext = () => {
		console.log({
			status,
			field,
			preference,
			selectedCourse,
		});
		// navigate(`/courses/${selectedCourse.id}`);
	};

	// ================= DERIVED =================
	const categories = [...new Set(courses.map((c) => c.category))];

	// ================= UI =================
	return (
		<div className="min-h-screen bg-gray-50 relative overflow-hidden py-12">
			{/* Decorations */}
			<img src={dots} className="absolute left-8 top-32 w-16" />
			<img src={arrow} className="absolute left-8 top-1/2 w-10" />
			<img src={pluses} className="absolute right-8 top-1/2 w-16" />
			<img src={ellipse} className="absolute right-0 bottom-0 w-40" />

			<div className="max-w-xl mx-auto relative z-10 px-4">
				<h1 className="text-4xl font-bold text-center mb-12">
					<span className="text-blue-900">Choose The </span>
					<span className="text-orange-500">Course</span>
				</h1>

				<div className="bg-blue-900 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
					{/* STEP 1 */}
					<div>
						<BotMessage>
							<strong>Welcome</strong>
							<br />
							Let us know your current status?
						</BotMessage>

						<div className="flex justify-center gap-3 flex-wrap">
							<Option
								active={status === "student"}
								onClick={() => selectStatus("student")}>
								Student
							</Option>
							<Option
								active={status === "fresher"}
								onClick={() => selectStatus("fresher")}>
								Fresher / Job Shift
							</Option>
							<Option
								active={status === "upskill"}
								onClick={() => selectStatus("upskill")}>
								Upskill IT Job
							</Option>
						</div>
					</div>

					{/* STEP 2 */}
					{step >= 2 && (
						<div>
							<BotMessage>Great! Let me help you</BotMessage>
							<div className="flex justify-center gap-3">
								<Action onClick={selectHelp}>Browse Course</Action>
								<Action outline onClick={selectHelp}>
									Suggest Course
								</Action>
							</div>
						</div>
					)}

					{/* STEP 3 */}
					{step >= 3 && (
						<div>
							<BotMessage>Select the field you're interested in</BotMessage>
							<div className="flex justify-center gap-3 flex-wrap">
								{categories.slice(0, 2).map((cat) => (
									<Action
										key={cat}
										active={field === cat}
										onClick={() => selectField(cat)}>
										{cat}
									</Action>
								))}
							</div>
						</div>
					)}

					{/* STEP 4 */}
					{step >= 4 && (
						<div>
							<BotMessage>What do you prefer now?</BotMessage>
							<div className="flex justify-center gap-3">
								<Option onClick={() => selectPreference("coding")}>
									Coding
								</Option>
								<Option onClick={() => selectPreference("no-coding")}>
									No Coding
								</Option>
							</div>
						</div>
					)}

					{/* STEP 5 */}
					{step >= 5 && (
						<div>
							<BotMessage>Choose a course</BotMessage>
							<div className="flex justify-center gap-3 flex-wrap">
								{courses.slice(0, 3).map((course) => (
									<Option
										key={course.id}
										active={selectedCourse?.id === course.id}
										onClick={() => selectCourse(course)}>
										{course.title}
									</Option>
								))}
							</div>
						</div>
					)}

					{/* FINAL */}
					{selectedCourse && (
						<div className="text-center">
							<button
								onClick={handleNext}
								className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
								Next
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

/* ================= INLINE UI HELPERS ================= */

function BotMessage({ children }) {
	return (
		<div className="flex items-start gap-3 mb-4">
			<div className="w-10 h-10 bg-white rounded-full shrink-0" />
			<div className="bg-white rounded-2xl rounded-tl-none p-4 flex-1 text-gray-800">
				{children}
			</div>
		</div>
	);
}

function Option({ children, onClick, active }) {
	return (
		<button
			onClick={onClick}
			className={`p-4 bg-white rounded-xl text-sm hover:shadow-lg transition ${
				active ? "ring-2 ring-orange-500" : ""
			}`}>
			{children}
		</button>
	);
}

function Action({ children, onClick, outline, active }) {
	return (
		<button
			onClick={onClick}
			className={`px-6 py-3 rounded-lg font-medium transition ${
				outline
					? "border-2 border-white text-white hover:bg-white hover:text-blue-900"
					: "bg-orange-500 text-white hover:bg-orange-600"
			} ${active ? "ring-2 ring-white" : ""}`}>
			{children}
		</button>
	);
}
