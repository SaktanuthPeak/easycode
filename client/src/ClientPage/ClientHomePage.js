import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid2,
  Rating,
  Stack,
  Button,
  CardHeader
} from '@mui/material';
import {
  Code as WebDevIcon,
  DataObject as DataSciIcon,
  Security as CyberSecIcon,
  Psychology as AiIcon,
  Router as IoTIcon,
  SportsEsports as GameIcon
} from '@mui/icons-material';

const CategoryCard = ({ icon: Icon, title, courses, path }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <Card
      className="h-full flex flex-col items-center p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={handleClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-5px)',
        }
      }}
    >
      <Box sx={{
        bgcolor: 'primary.light',
        borderRadius: '50%',
        p: 2,
        mb: 2
      }}>
        <Icon sx={{ fontSize: 40, color: 'primary.main' }} />
      </Box>
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary">
        {courses} Courses
      </Typography>
    </Card>
  );
};

const CourseCard = ({ image, title, author, rating, ratingCount, duration, lectures, level, price }) => (
  <Card sx={{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      boxShadow: 6,
    }
  }}>
    <Box
      component="img"
      src={image}
      alt={title}
      sx={{
        width: '100%',
        height: 200,
        objectFit: 'cover'
      }}
    />
    <CardContent>
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        By {author}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Rating value={rating} readOnly precision={0.5} />
        <Typography>({ratingCount})</Typography>
      </Stack>
      <Typography color="text.secondary" gutterBottom>
        {duration} • {lectures} Lectures • {level}
      </Typography>
      <Typography variant="h6" color="primary.main">
        ${price}
      </Typography>
    </CardContent>
  </Card>
);

const AdminHomePage = () => {
  const categories = [
    { icon: WebDevIcon, title: 'Web Development', courses: 15, path: '/category/web-dev' },
    { icon: DataSciIcon, title: 'Data Science', courses: 12, path: '/category/data-science' },
    { icon: CyberSecIcon, title: 'Cyber Security', courses: 10, path: '/category/cyber-security' },
    { icon: AiIcon, title: 'Artificial Intelligence', courses: 14, path: '/category/ai' },
    { icon: IoTIcon, title: 'Internet of Things', courses: 8, path: '/category/iot' },
    { icon: GameIcon, title: 'Game Development', courses: 11, path: '/category/game-dev' },
  ];

  const courses = [
    {
      image: '/api/placeholder/400/200',
      title: "Complete Web Development Bootcamp",
      author: "John Smith",
      rating: 4.8,
      ratingCount: "1200",
      duration: "22 Total Hours",
      lectures: "155 Lectures",
      level: "Beginner",
      price: "149.9"
    },

  ];

  return (
    <Box sx={{ p: 4 }}>
      {/* Categories Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            All Categories
          </Typography>
        </Box>
        <Grid2 container spacing={3}>
          {categories.map((category, index) => (
            <Grid2 item xs={12} sm={6} md={4} key={index}>
              <CategoryCard {...category} />
            </Grid2>
          ))}
        </Grid2>
      </Box>

      {/* Courses Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Top Courses
          </Typography>
          <Button color="primary">See All</Button>
        </Box>
        <Grid2 container spacing={3}>
          {courses.map((course, index) => (
            <Grid2 item xs={12} sm={6} md={3} key={index}>
              <CourseCard {...course} />
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Box>
  );
};

export default AdminHomePage;