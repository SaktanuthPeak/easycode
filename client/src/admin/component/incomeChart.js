import { Card, CardContent, CardHeader } from "@mui/material";
import { useEffect, useState } from "react";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer,
} from "recharts";

import ax from "../../conf/ax";

export default function IncomeChart() {
  const [incomeData, setIncomeData] = useState([]);
  const fetchTotalIncome = async () => {
    try {
      const response = await ax.get(
        `/admin-confirmations?filters[order_status][$eq]=confirm`
      );
      setIncomeData(response.data.data);
    } catch (error) {
      console.log("This is error", error);
    }
  };

  useEffect(() => {
    fetchTotalIncome();
  }, []);

  const splitDataByMonth = (incomeData) => {
    const groupedData = new Array(12).fill(0);

    incomeData.forEach((item) => {
      const month = new Date(item.createdAt).getMonth();
      groupedData[month] += item.amount;
    });

    return groupedData;
  };

  const data = [
    { month: "Jan", income: splitDataByMonth(incomeData)[0] },
    { month: "Feb", income: splitDataByMonth(incomeData)[1] },
    { month: "Mar", income: splitDataByMonth(incomeData)[2] },
    { month: "Apr", income: splitDataByMonth(incomeData)[3] },
    { month: "May", income: splitDataByMonth(incomeData)[4] },
    { month: "Jun", income: splitDataByMonth(incomeData)[5] },
    { month: "Jul", income: splitDataByMonth(incomeData)[6] },
    { month: "Aug", income: splitDataByMonth(incomeData)[7] },
    { month: "Sep", income: splitDataByMonth(incomeData)[8] },
    { month: "Oct", income: splitDataByMonth(incomeData)[9] },
    { month: "Nov", income: splitDataByMonth(incomeData)[10] },
    { month: "Dec", income: splitDataByMonth(incomeData)[11] },
  ];
  return (
    <Card>
      <CardHeader title="Monthly Income (Last 12 Months)" />
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="income" stroke="#2196f3" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
