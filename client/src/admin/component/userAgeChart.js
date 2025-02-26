import { Card, CardContent, CardHeader } from "@mui/material";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ax from "../../conf/ax";

export default function UserAgeChart() {
  const [usersData, setUsersData] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await ax.get(`/users`);
      setUsersData(response.data);
    } catch (error) {
      console.log("This is error", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const splitAgeUser = (users) => {
    const splitAge = [0, 0, 0, 0, 0, 0];
    users.map((user) => {
      const thisYear = new Date().getFullYear();
      if (user.birthdate) {
        const age = thisYear - new Date(user.birthdate).getFullYear();
        if (age >= 0 && age <= 12) {
          splitAge[0] += 1;
        } else if (age >= 13 && age <= 19) {
          splitAge[1] += 1;
        } else if (age >= 20 && age <= 35) {
          splitAge[2] += 1;
        } else if (age >= 36 && age <= 50) {
          splitAge[3] += 1;
        } else if (age >= 51 && age <= 64) {
          splitAge[4] += 1;
        } else if (age >= 65) {
          splitAge[5] += 1;
        }
      }
    });
    return splitAge;
  };

  const data = [
    { age: "0-12", users: splitAgeUser(usersData)[0] },
    { age: "13-19", users: splitAgeUser(usersData)[1] },
    { age: "20-35", users: splitAgeUser(usersData)[2] },
    { age: "36-50", users: splitAgeUser(usersData)[3] },
    { age: "51-64", users: splitAgeUser(usersData)[4] },
    { age: "65", users: splitAgeUser(usersData)[5] },
  ];
  return (
    <Card>
      <CardHeader title="User Age Distribution" />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="#2196f3" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
