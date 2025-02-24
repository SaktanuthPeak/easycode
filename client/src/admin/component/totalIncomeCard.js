import { Card, CardContent, Typography, Box } from "@mui/material";
import { AttachMoney as MoneyIcon } from "@mui/icons-material";

export default function TotalIncomeCard() {
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
          $45,231.89
        </Typography>
        <Typography color="text.secondary" variant="body2">
          <span style={{ color: "green" }}>+20.1%</span> from last month
        </Typography>
      </CardContent>
    </Card>
  );
}
