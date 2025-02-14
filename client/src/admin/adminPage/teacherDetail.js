import {
	Container,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function TeacherDetailPage() {
	const [teacher, setTeacher] = React.useState(null);
	const { id } = useParams();
	useEffect(() => {
		const fetchTeacherDetails = async () => {
			const token = localStorage.getItem("jwt");

			const response = await fetch(
				`http://localhost:1337/api/users/${id}?populate[courses][populate][users][populate]=role`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = await response.json();
			setTeacher(data);
		};

		fetchTeacherDetails();
	}, [id]);

	if (!teacher) return <p>Loading...</p>;

	return (
		<Container className="mt-10">
			<Typography
				variant="h4"
				gutterBottom
			>
				{teacher.firstname} {teacher.lastname}
			</Typography>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Course Name</TableCell>
							<TableCell>Students</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{teacher.courses.map((course) => {
							// ✅ Filter Users ที่ role.name ไม่ใช่ "Teacher"
							const students = course.users.filter(
								(user) => user.role && user.role.name !== "Teacher"
							);

							return students.length > 0 ? (
								students.map((student, index) => (
									<TableRow key={student.id}>
										{/* Merge Row สำหรับ Course Name */}
										{index === 0 && (
											<TableCell rowSpan={students.length}>
												{course.Course_name}
											</TableCell>
										)}
										<TableCell>
											{student.firstname} {student.lastname}
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow key={course.id}>
									<TableCell>{course.Course_name}</TableCell>
									<TableCell>
										<em>No students enrolled</em>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
}

export default TeacherDetailPage;
