import { Card, CardContent, Typography, Box } from "@mui/material";
import { People as PeopleIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import ax from "../../conf/ax";

export default function TotalUserCard() {
  const [usersData, setUsersData] = useState([]);
  const [totalUser, setTotalUser] = useState(0);
  const [currentMonthUsers, setCurrentMonthUsers] = useState(0);

  const fetchUsers = async () => {
    try {
      const usersData = await ax.get(`/users`);
      setTotalUser(usersData.data.length);
      setUsersData(usersData.data);
    } catch (error) {
      console.log("This is error", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (totalUser.length === 0) return;

    const now = new Date();
    const currentMonth = now.getMonth() + 1; // Months are 0-indexed
    const currentYear = now.getFullYear();

    let currentCount = 0;

    usersData.forEach((user) => {
      const createdDate = new Date(user.createdAt);
      const userMonth = createdDate.getMonth() + 1;
      const userYear = createdDate.getFullYear();

      if (userMonth === currentMonth && userYear === currentYear) {
        currentCount++;
      }
    });

    setCurrentMonthUsers(currentCount);
  }, [totalUser]);

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <PeopleIcon color="primary" fontSize="large" />
          <Typography variant="h6" component="div" ml={1}>
            Total Users
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {totalUser}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          <span style={{ color: "green" }}>+{currentMonthUsers}</span> from last
          month
        </Typography>
      </CardContent>
    </Card>
  );
}
