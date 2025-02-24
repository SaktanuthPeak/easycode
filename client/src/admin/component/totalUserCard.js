import { Card, CardContent, Typography, Box } from "@mui/material";
import { People as PeopleIcon } from "@mui/icons-material";

export default function TotalUserCard() {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <PeopleIcon color="primary" fontSize="large" />
          <Typography variant="h6" component="div" ml={1}>
            Active Users
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          +2350
        </Typography>
        <Typography color="text.secondary" variant="body2">
          <span style={{ color: "green" }}>+180.1%</span> from last month
        </Typography>
      </CardContent>
    </Card>
  );
}
