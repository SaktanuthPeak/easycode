import { Card, CardContent, Typography, Box } from "@mui/material";
import { Book as BookIcon } from "@mui/icons-material";
import ax from "../../conf/ax";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const MockData = [
  {
    id: 29,
    documentId: "cy4h38qwactejh3igte27im0",
    Course_name: "Front-End development with HTML and CSS",
    createdAt: "2025-01-05T08:40:28.336Z",
    updatedAt: "2025-02-19T07:57:00.297Z",
    publishedAt: "2025-02-19T07:57:00.321Z",
    rating: 4.5,
    course_description:
      "This course introduces the essentials of front-end development using HTML and CSS, focusing on building structured, responsive, and visually appealing web pages. Students will learn semantic HTML, CSS styling techniques, layout systems like flexbox and grid, and best practices for accessibility and performance. Through hands-on projects, they will develop modern websites and gain foundational skills for further exploration in web development.",
    price: 120,
    course_overview:
      "This course covers the fundamentals of front-end development with HTML and CSS, teaching students how to structure web pages, apply styling, and create responsive designs. Topics include semantic HTML, the box model, flexbox, grid, typography, and animations. Students will also learn best practices for accessibility and performance while working on hands-on projects to build modern, user-friendly websites.",
    course_syllabus: [
      {
        type: "paragraph",
        children: [
          {
            type: "text",
            text: "",
          },
        ],
      },
    ],
    course_hour: 5,
    course_minute: 30,
  },
  {
    id: 30,
    documentId: "ihau7sch8u2iuidan4hqkprj",
    Course_name: "Developing website with React and Next.js",
    createdAt: "2025-02-05T08:42:27.565Z",
    updatedAt: "2025-02-24T08:38:43.334Z",
    publishedAt: "2025-02-24T08:38:43.345Z",
    rating: 4.56,
    course_description: null,
    price: 550,
    course_overview: null,
    course_syllabus: null,
    course_hour: 10,
    course_minute: 45,
  },
  {
    id: 31,
    documentId: "fg5wer9i4xg6ixj49gfn8lep",
    Course_name: "Developing Back-End with MySql",
    createdAt: "2025-02-05T09:33:34.179Z",
    updatedAt: "2025-02-24T08:38:43.394Z",
    publishedAt: "2025-02-24T08:38:43.404Z",
    rating: 4.85,
    course_description: null,
    price: 220,
    course_overview: null,
    course_syllabus: null,
    course_hour: 4,
    course_minute: 10,
  },
];

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
