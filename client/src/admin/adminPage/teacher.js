import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ax from "../../conf/ax";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";

function Teacher() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 State คำค้นหา
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    loadTeachers();
    loadCourses();
  }, []);

  function loadTeachers() {
    const fetchTeachers = async () => {
      try {
        const response = await ax.get(
          "/instructors?filters[statusT][$eq]=confirm&populate=*"
        );
        console.log(response.data.data)
        const data = response.data.data;
        setTeachers(data);
        setFilteredTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }

  function loadCourses() {
    const fetchCourses = async () => {
      try {
        const response = await ax.get("/courses");
        const data = response.data.data;
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }

  const handleRowClick = (id) => {
    navigate(`/teacher/${id}`);
  };

  // 🔍 ฟังก์ชันค้นหา (Filter ข้อมูล)
  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = teachers.filter(
      (teacher) =>
        teacher.users_permissions_user.email.toLowerCase().includes(query) ||
        teacher.users_permissions_user.firstname.toLowerCase().includes(query) ||
        teacher.users_permissions_user.lastname.toLowerCase().includes(query)
    );

    setFilteredTeachers(filtered);
  };

  const [editData, setEditData] = useState({ username: "", email: "" });
  const [openEdit, setOpenEdit] = useState(false);
  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    setEditData({
      firstname: teacher.users_permissions_user.firstname,
      lastname: teacher.users_permissions_user.lastname,
      username: teacher.users_permissions_user.username,
      email: teacher.users_permissions_user.email,
      courses: teacher.courses.map((x) => x.Course_name) || [],
    });
    setOpenEdit(true);
  };
  const handleChange = (event) => {
    setEditData({ ...editData, [event.target.name]: event.target.value });
  };
  const handleSaveEdit = async () => {
    if (selectedTeacher) {
      try {
        const response = await ax.put(`/users/${selectedTeacher.id}`, {
          data: {
            ...editData,
            courses: editData.courses.map(
              (x) => courses.find((c) => c.Course_name === x).id
            ),
          },
        });
        if (!response.ok) {
          throw new Error("Failed to update student");
        }
        const updatedStudent = await response.json();
        setTeachers(
          teachers.map((s) =>
            s.id === selectedTeacher.id
              ? {
                  ...updatedStudent,
                  courses: editData.courses.map((x) =>
                    courses.find((c) => c.Course_name === x)
                  ),
                }
              : s
          )
        );
        setFilteredTeachers(
          filteredTeachers.map((s) =>
            s.id === selectedTeacher.id
              ? {
                  ...updatedStudent,
                  courses: editData.courses.map((x) =>
                    courses.find((c) => c.Course_name === x)
                  ),
                }
              : s
          )
        );
      } catch (error) {
        console.error("Error updating student:", error);
      }
    }
    setOpenEdit(false);
  };
  const handleSubjectChange = (subject) => {
    setEditData((prevData) => {
      const isSelected = prevData.courses.includes(subject);
      return {
        ...prevData,
        courses: isSelected
          ? prevData.courses.filter((s) => s !== subject)
          : [...prevData.courses, subject],
      };
    });
  };

  const [openDelete, setOpenDelete] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const handleDeleteClick = (student) => {
    setSelectedTeacher(student);
    setOpenDelete(true);
  };
  const handleConfirmDelete = async () => {
    if (selectedTeacher) {
      try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(
          `http://localhost:1337/api/users/${selectedTeacher.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete Tea");
        }
        setTeachers(teachers.filter((s) => s.id !== selectedTeacher.id));
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
    setOpenDelete(false);
  };

  return (
    <Container className="mt-10">
      {/* 🔍 Search Bar */}
      <TextField
        label="ค้นหาครู (ชื่อ, นามสกุล, อีเมล)"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* ตารางแสดงครู */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>email</TableCell>
              <TableCell>firstname</TableCell>
              <TableCell>lastname</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeachers.map((teacher,index) => (
              <TableRow key={teacher.id} hover style={{ cursor: "pointer" }}>
                <TableCell>{index+1}</TableCell>
                <TableCell>{teacher.users_permissions_user.email}</TableCell>
                <TableCell>{teacher.users_permissions_user.firstname}</TableCell>
                <TableCell>{teacher.users_permissions_user.lastname}</TableCell>
                <TableCell>
                  {(teacher.courses || []).map((x) => x.Course_name).join(", ")}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleRowClick(teacher.documentId)}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(teacher)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteClick(teacher)}
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
            คุณต้องการลบคุณครู "{selectedTeacher?.firstname}{" "}
            {selectedTeacher?.lastname}" ใช่หรือไม่?
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

      {/* Dialog แก้ไขนักเรียน */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>แก้ไขข้อมูลนักเรียน</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="อีเมล"
            type="email"
            fullWidth
            name="email"
            value={editData.email}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            label="ชื่อ"
            type="text"
            fullWidth
            name="username"
            value={editData.username}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            label="นามสกุล"
            type="text"
            fullWidth
            name="lastname"
            value={editData.lastname}
            onChange={handleChange}
          />

          <FormGroup>
            {courses.map((subject) => (
              <FormControlLabel
                key={subject.id}
                control={
                  <Checkbox
                    checked={(editData.courses || []).includes(
                      subject.Course_name
                    )}
                    onChange={() => handleSubjectChange(subject.Course_name)}
                  />
                }
                label={subject.Course_name}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} color="primary">
            ยกเลิก
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Teacher;
