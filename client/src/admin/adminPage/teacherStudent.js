import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
	TextField,
} from "@mui/material";
import { Edit, Delete, ArrowBackIos } from "@mui/icons-material";

function ManageStudent() {
	const { id } = useParams();
	const [students, setStudents] = useState([]);
	const [openDelete, setOpenDelete] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [editData, setEditData] = useState({ username: "", email: "" });
	const [searchQuery, setSearchQuery] = useState(""); // 🔍 State คำค้นหา
	const [filteredStudents, setFilteredStudents] = useState([]);

	// ฟังก์ชันค้นหา (Client-side)
	const handleSearchChange = (event) => {
		const query = event.target.value.toLowerCase();
		setSearchQuery(query);

		if (!query) {
			setFilteredStudents(students); // ถ้าเป็นช่องว่าง ให้แสดงทั้งหมด
			return;
		}

		const filtered = students.filter(
			(student) =>
				student.email.toLowerCase().includes(query) ||
				student.firstname.toLowerCase().includes(query) ||
				student.lastname.toLowerCase().includes(query) ||
				student.username.toLowerCase().includes(query)
		);

		setFilteredStudents(filtered);
	};

	useEffect(() => {
		setFilteredStudents(students); // อัปเดต filteredStudents ทุกครั้งที่ students เปลี่ยน
	}, [students]);

	useEffect(() => {
		const fetchStudents = async () => {
			const token = localStorage.getItem("jwt");
			try {
				const response = await fetch(
					`http://localhost:1337/api/users?filters[role][name][$eq]=client&filters[courses][id][$eq]=${id}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (!response.ok) {
					throw new Error("Failed to fetch student details");
				}
				const data = await response.json();
				setStudents(data); // ตั้งค่า students
			} catch (error) {
				console.error("Error fetching student details:", error);
			}
		};
		fetchStudents();
	}, [id]);

	// ฟังก์ชันเปิด Dialog ลบ
	const handleDeleteClick = (student) => {
		setSelectedStudent(student);
		setOpenDelete(true);
	};

	// ฟังก์ชันยืนยันลบ
	const handleConfirmDelete = async () => {
		if (selectedStudent) {
			try {
				const token = localStorage.getItem("jwt");
				const response = await fetch(
					`http://localhost:1337/api/users/${selectedStudent.id}`,
					{
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (!response.ok) {
					throw new Error("Failed to delete student");
				}
				setStudents(students.filter((s) => s.id !== selectedStudent.id));
			} catch (error) {
				console.error("Error deleting student:", error);
			}
		}
		setOpenDelete(false);
	};

	// ฟังก์ชันเปิด Dialog แก้ไข
	const handleEditClick = (student) => {
		setSelectedStudent(student);
		setEditData({
			firstname: student.firstname,
			lastname: student.lastname,
			username: student.username,
			email: student.email,
		});
		setOpenEdit(true);
	};

	// ฟังก์ชันอัปเดตค่าในฟอร์ม
	const handleChange = (event) => {
		setEditData({ ...editData, [event.target.name]: event.target.value });
	};

	// ฟังก์ชันบันทึกข้อมูลหลังแก้ไข
	const handleSaveEdit = async () => {
		if (selectedStudent) {
			try {
				const token = localStorage.getItem("jwt");
				const response = await fetch(
					`http://localhost:1337/api/users/${selectedStudent.id}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(editData),
					}
				);
				if (!response.ok) {
					throw new Error("Failed to update student");
				}
				const updatedStudent = await response.json();
				setStudents(
					students.map((s) =>
						s.id === selectedStudent.id ? updatedStudent : s
					)
				);
			} catch (error) {
				console.error("Error updating student:", error);
			}
		}
		setOpenEdit(false);
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold ">
				<IconButton
					className="mb-2"
					variant="contained"
					color="primary"
					onClick={() => {
						window.history.back();
					}}
				>
					<ArrowBackIos />
				</IconButton>
				จัดการนักเรียน
			</h1>

			<div className="mb-4">
				<TextField
					label="ค้นหานักเรียน (ชื่อ, นามสกุล, ชื่อผู้ใช้, อีเมล)"
					variant="outlined"
					fullWidth
					margin="normal"
					value={searchQuery}
					onChange={handleSearchChange}
				/>
			</div>

			{/* ตารางนักเรียน */}
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>อีเมล</TableCell>
							<TableCell>ชื่อ</TableCell>
							<TableCell>นามสกุล</TableCell>
							<TableCell>ชื่อผู้ใช้</TableCell>
							<TableCell>จัดการ</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredStudents.map((student) => (
							<TableRow key={student.id}>
								<TableCell>{student.id}</TableCell>
								<TableCell>{student.email}</TableCell>

								<TableCell>{student.firstname}</TableCell>
								<TableCell>{student.lastname}</TableCell>
								<TableCell>{student.username}</TableCell>
								<TableCell>
									<IconButton
										color="primary"
										onClick={() => handleEditClick(student)}
									>
										<Edit />
									</IconButton>
									<IconButton
										color="secondary"
										onClick={() => handleDeleteClick(student)}
									>
										<Delete />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Dialog ยืนยันการลบ */}
			<Dialog
				open={openDelete}
				onClose={() => setOpenDelete(false)}
			>
				<DialogTitle>ยืนยันการลบ</DialogTitle>
				<DialogContent>
					<DialogContentText>
						คุณต้องการลบนักเรียน "{selectedStudent?.username}" ใช่หรือไม่?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setOpenDelete(false)}
						color="primary"
					>
						ยกเลิก
					</Button>
					<Button
						onClick={handleConfirmDelete}
						color="secondary"
					>
						ลบ
					</Button>
				</DialogActions>
			</Dialog>

			{/* Dialog แก้ไขนักเรียน */}
			<Dialog
				open={openEdit}
				onClose={() => setOpenEdit(false)}
			>
				<DialogTitle>แก้ไขข้อมูลนักเรียน</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="ชื่อผู้ใช้"
						type="text"
						fullWidth
						name="firstname"
						value={editData.firstname}
						onChange={handleChange}
					/>{" "}
					<TextField
						autoFocus
						margin="dense"
						label="ชื่อผู้ใช้"
						type="text"
						fullWidth
						name="lastname"
						value={editData.lastname}
						onChange={handleChange}
					/>
					<TextField
						autoFocus
						margin="dense"
						label="ชื่อผู้ใช้"
						type="text"
						fullWidth
						name="username"
						value={editData.username}
						onChange={handleChange}
					/>
					<TextField
						margin="dense"
						label="อีเมล"
						type="email"
						fullWidth
						name="email"
						value={editData.email}
						onChange={handleChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setOpenEdit(false)}
						color="primary"
					>
						ยกเลิก
					</Button>
					<Button
						onClick={handleSaveEdit}
						color="primary"
					>
						บันทึก
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default ManageStudent;
