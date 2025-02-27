import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
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
import ax from "../../conf/ax";
import { toast } from "react-toastify";

function ManageStudent() {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editData, setEditData] = useState({ username: "", email: "" });
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 State คำค้นหา
  const [filteredStudents, setFilteredStudents] = useState([]);

  const location = useLocation();
  const {value} = location.state || {} ;
  console.log("USERARRARA",value)

  // ฟังก์ชันค้นหา (Client-side)
  console.log("asdadsad",courseId)
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

  const fetchStudents = async () => {
    try {
      const response = await ax.get(
        `/users?filters[role][name][$eq]=client&filters[courses][documentId][$eq]=${courseId}`
      );

      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  // ฟังก์ชันเปิด Dialog ลบ
  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setOpenDelete(true);
  };

  // ฟังก์ชันยืนยันลบ
  const handleConfirmDelete = async () => {
    if (selectedStudent) {
      try {
        const deleteStudent = value.filter((user) => user.id !== selectedStudent.id)
        const studentId = deleteStudent.map((user) => user.id)
        await ax.put(
          `/courses/${courseId}`,{
            data : {
              users : studentId
            }
          }
        );
        
        toast.success("Delete user successfully")
        fetchStudents();
        console.log("Delete user complete")
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
    setOpenDelete(false);
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
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>ยืนยันการลบ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการลบนักเรียน "{selectedStudent?.username}" ใช่หรือไม่?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} color="primary">
            ยกเลิก
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            ลบ
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ManageStudent;
