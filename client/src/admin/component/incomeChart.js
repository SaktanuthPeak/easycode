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
  { month: "Jan", income: 4000 },
  { month: "Feb", income: 3000 },
  { month: "Mar", income: 5000 },
  { month: "Apr", income: 4500 },
  { month: "May", income: 5500 },
  { month: "Jun", income: 6000 },
  { month: "Jul", income: 6500 },
  { month: "Aug", income: 7000 },
  { month: "Sep", income: 6800 },
  { month: "Oct", income: 7200 },
  { month: "Nov", income: 7500 },
  { month: "Dec", income: 8000 },
];

export default function IncomeChart() {
  return (
    <Card>
      <CardHeader title="Monthly Income (Last 12 Months)" />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="income" fill="#2196f3" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
