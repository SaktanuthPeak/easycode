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
  TextField,
} from "@mui/material";

function Teacher() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 State คำค้นหา
  const [filteredTeachers, setFilteredTeachers] = useState([]);

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
      .then((data) => {
        setTeachers(data);
        setFilteredTeachers(data); // ตั้งค่าเริ่มต้นให้ filteredTeachers เท่ากับ teachers
      })
      .catch((error) => console.error("Error fetching teachers:", error));
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
        teacher.email.toLowerCase().includes(query) ||
        teacher.firstname.toLowerCase().includes(query) ||
        teacher.lastname.toLowerCase().includes(query)
    );

    setFilteredTeachers(filtered);
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
              <TableCell>Email</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Subject</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTeachers.map((teacher) => (
              <TableRow
                key={teacher.id}
                hover
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(teacher.id)}
              >
                <TableCell>{teacher.email}</TableCell>
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
