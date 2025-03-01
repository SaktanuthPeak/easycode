"use client";

import { useEffect, useState } from "react";
import ax from "../../conf/ax";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

export default function TeacherSupport() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        const response = await ax.get("/instructors?populate=*");
        const data = response.data.data;

        const transformedData = data.map((teacher) => ({
          id: teacher?.documentId,
          name: `${teacher?.name_teacher}`,
          email: teacher?.users_permissions_user?.email,
          status: teacher?.statusT || "pending",
        }));

        setTeachers(transformedData);
      } catch (error) {
        console.error("Error fetching instructors:", error);
        setError("Failed to fetch instructors");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherDetails();
  }, []);

  const handleStatusChange = async () => {
    if (!selectedTeacher) return;
    try {
      await ax.put(`/instructors/${selectedTeacher.id}`, {
        data: { statusT: newStatus },
      });
      setTeachers(
        teachers.map((teacher) =>
          teacher.id === selectedTeacher.id
            ? { ...teacher, status: newStatus }
            : teacher
        )
      );

      if (newStatus === "confirm") {
        const response = await ax.get(
          `/instructors/${selectedTeacher.id}?populate=*`
        );
        setUserData(response.data.data.users_permissions_user);

        await ax.put(`/users/${response.data.data.users_permissions_user.id}`, {
          role: 5,
        });
        console.log("put role complete");
      }
      if (newStatus === "deny") {
        const response = await ax.get(
          `/instructors/${selectedTeacher.id}?populate=*`
        );
        setUserData(response.data.data.users_permissions_user);

        await ax.put(`/users/${response.data.data.users_permissions_user.id}`, {
          role: 1,
        });
        console.log("put role complete");
      }
    } catch (error) {
      console.error("Failed to update instructor status", error);
      setError("Failed to update instructor status");
    }
    setOpen(false);
  };

  const handleOpenModal = (teacher, status) => {
    setSelectedTeacher(teacher);
    setNewStatus(status);
    setOpen(true);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Instructor List</h1>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel shrink>Status</InputLabel>
                    <Select
                      value={teacher.status}
                      onChange={(e) => handleOpenModal(teacher, e.target.value)}
                      label="Status"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="confirm">Confirm</MenuItem>
                      <MenuItem value="deny">Deny</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the status to "{newStatus}" for{" "}
            {selectedTeacher?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleStatusChange} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
