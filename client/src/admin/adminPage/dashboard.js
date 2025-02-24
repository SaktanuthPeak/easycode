import { Typography, Grid, Box } from "@mui/material";
import TotalCourseCard from "../component/totalCourseCard";
import TotalUserCard from "../component/totalUserCard";
import TotalIncomeCard from "../component/totalIncomeCard";
import UserAgeChart from "../component/userAgeChart";
import UserGroupChart from "../component/userGroupChart";
import IncomeChart from "../component/incomeChart";

export default function Dashboard() {
  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        E-Learning Dashboard
      </Typography>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={4}>
          <TotalUserCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <TotalCourseCard />
        </Grid>
        <Grid item xs={12} md={4}>
          <TotalIncomeCard />
        </Grid>
      </Grid>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12}>
          <IncomeChart />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <UserGroupChart />
        </Grid>
        <Grid item xs={12} lg={6}>
          <UserAgeChart />
        </Grid>
      </Grid>
    </Box>
  );
}
