import { Card, CardContent, Typography, Box } from "@mui/material";
import { Book as BookIcon } from "@mui/icons-material";
import ax from "../../conf/ax";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function TotalCourseCard() {
  const [totalCourse, setTotalCourse] = useState(0);
  const [coursesData, setCoursesData] = useState([]);
  const [currentMonthCourse, setCurrentMonthCourse] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await ax.get(`/courses`);
        setTotalCourse(courses.data.data.length);
        setCoursesData(courses.data.data);
      } catch (error) {
        console.log("This is error", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (coursesData.length === 0) return;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    let currentCount = 0;

    coursesData.forEach((course) => {
      const createdDate = new Date(course.createdAt);
      const courseMonth = createdDate.getMonth() + 1;
      const courseYear = createdDate.getFullYear();

      if (courseMonth === currentMonth && courseYear === currentYear) {
        currentCount++;
      }
    });

    setCurrentMonthCourse(currentCount);
  }, [coursesData]);

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <BookIcon color="primary" fontSize="large" />
          <Typography variant="h6" component="div" ml={1}>
            Total Courses
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {totalCourse}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          <span style={{ color: "green" }}>+{currentMonthCourse}</span>
          from last month
        </Typography>
      </CardContent>
    </Card>
  );
}
