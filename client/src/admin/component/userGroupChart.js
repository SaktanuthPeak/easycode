import { Card, CardContent, CardHeader } from "@mui/material";
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import ax from "../../conf/ax";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#808080"];

export default function UserGroupChart() {
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

  const splitUserGroup = (usersData) => {
    const splitData = [0, 0, 0, 0];
    const groupIndices = {
      "high-school student": 0,
      "university/college student": 1,
      graduated: 2,
      other: 3,
    };

    usersData.forEach((user) => {
      const index = groupIndices[user.user_group];
      if (index !== undefined) {
        splitData[index] += 1;
      }
    });

    return splitData;
  };

  const data = [
    { name: "High-school student", value: splitUserGroup(usersData)[0] },
    { name: "College Student", value: splitUserGroup(usersData)[1] },
    { name: "Graduated", value: splitUserGroup(usersData)[2] },
    { name: "Other", value: splitUserGroup(usersData)[3] },
  ];

  return (
    <Card>
      <CardHeader title="User Groups" />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
