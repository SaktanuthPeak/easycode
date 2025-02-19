import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Container,
} from "@mui/material";

// const teachers = [
// 	{ id: 1, firstName: "John", lastName: "Doe", subject: "Mathematics" },
// 	{ id: 2, firstName: "Jane", lastName: "Smith", subject: "Science" },
// 	{ id: 3, firstName: "Robert", lastName: "Brown", subject: "History" },
// ];

function Teacher() {
	const navigate = useNavigate();
	const [teachers, setTeachers] = useState([]);
	useEffect(() => {
		loadTeachers();
	}, []);

	function loadTeachers() {
		const token = localStorage.getItem("jwt");

		fetch(
			"http://localhost:1337/api/users?populate=*&filters[role][name][$eq]=Teacher",
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then((response) => response.json())
			.then((data) => setTeachers(data))
			.catch((error) => console.error("Error fetching teachers:", error));
	}

	const handleRowClick = (id) => {
		navigate(`/teacher/${id}`);
	};

	return (
		<Container className="mt-10">
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>First Name</TableCell>
							<TableCell>Last Name</TableCell>
							<TableCell>Subject</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{teachers.map((teacher) => (
							<TableRow
								key={teacher.id}
								hover
								style={{ cursor: "pointer" }}
								onClick={() => handleRowClick(teacher.id)}
							>
								<TableCell>{teacher.firstname}</TableCell>
								<TableCell>{teacher.lastname}</TableCell>
								<TableCell>
									{(teacher.courses || []).map((x) => x.Course_name).join(", ")}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Container>
	);
}

export default Teacher;
