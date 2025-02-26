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

const data = [
  { age: "0-12", users: 400 },
  { age: "13-19", users: 400 },
  { age: "20-35", users: 300 },
  { age: "36-50", users: 200 },
  { age: "51-64", users: 100 },
  { age: "65", users: 50 },
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
