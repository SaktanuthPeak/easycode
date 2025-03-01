import { Card, CardContent, Typography, Box } from "@mui/material";
import { AttachMoney as MoneyIcon } from "@mui/icons-material";
import ax from "../../conf/ax";
import { useEffect } from "react";
import { useState } from "react";

export default function TotalIncomeCard() {
  const [totalConfirmOrder, setTotalConfirmOrder] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [onMonthRevenue, setOnMonthRevenue] = useState(0);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await ax.get(`/admin-confirmations`);
        const confirmedOrders = response.data.data.filter(
          (item) => item.order_status === "confirm"
        );
        setTotalConfirmOrder(confirmedOrders);
      } catch (error) {
        console.log("This is error", error);
      }
    };
    fetchOrder();
  }, []);

  useEffect(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const total = totalConfirmOrder.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    setTotalRevenue(total);

    const orderThisMonth = totalConfirmOrder
      .filter(
        (item) => new Date(item.createdAt).getMonth() + 1 === currentMonth
      )
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    setOnMonthRevenue(orderThisMonth);
  }, [totalConfirmOrder]);

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <MoneyIcon color="primary" fontSize="large" />
          <Typography variant="h6" component="div" ml={1}>
            Revenue
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          ฿{totalRevenue}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          <span style={{ color: "green" }}>+{onMonthRevenue}</span> from last
          month
        </Typography>
      </CardContent>
    </Card>
  );
}
