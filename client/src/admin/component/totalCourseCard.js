import { Card, CardContent, Typography, Box } from "@mui/material";
import { Book as BookIcon } from "@mui/icons-material";

export default function TotalCourseCard() {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <BookIcon color="primary" fontSize="large" />
          <Typography variant="h6" component="div" ml={1}>
            Popular Courses
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          +573
        </Typography>
        <Typography color="text.secondary" variant="body2">
          <span style={{ color: "green" }}>+201</span> from last week
        </Typography>
      </CardContent>
    </Card>
  );
}
