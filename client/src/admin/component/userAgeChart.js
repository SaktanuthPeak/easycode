import { Card, CardContent, CardHeader } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { age: "18-24", users: 400 },
  { age: "25-34", users: 300 },
  { age: "35-44", users: 200 },
  { age: "45-54", users: 100 },
  { age: "55+", users: 50 },
];

export default function UserAgeChart() {
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
