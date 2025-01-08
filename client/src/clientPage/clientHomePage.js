import React from 'react';

const CategoryCard = ({ icon: Icon, title, courses, path, onNavigate }) => {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="h-full flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="bg-blue-100 rounded-full p-4 mb-4">
        <Icon className="w-10 h-10 text-blue-600" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600">{courses} Courses</p>
    </div>
  );
};

const CourseCard = ({ image, title, author, rating, ratingCount, duration, lectures, level, price }) => (
  <div className="h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <img
      src={image}
      alt={title}
      className="w-full h-48 object-cover rounded-t-lg"
    />
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-2">By {author}</p>
      <div className="flex items-center space-x-2 mb-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-gray-600">({ratingCount})</span>
      </div>
      <p className="text-gray-600 mb-2">{duration} • {lectures} • {level}</p>
      <p className="text-xl font-bold text-blue-600">${price}</p>
    </div>
  </div>
);

const AdminHomePage = ({ onNavigate = (path) => console.log('Navigate to:', path) }) => {
  const categories = [
    {
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ), title: 'Web Development', courses: 15, path: '/category/web-dev'
    },
    {
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ), title: 'Data Science', courses: 12, path: '/category/data-science'
    },
    {
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ), title: 'Cyber Security', courses: 10, path: '/category/cyber-security'
    },
    {
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ), title: 'Artificial Intelligence', courses: 14, path: '/category/ai'
    },
    {
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ), title: 'Internet of Things', courses: 8, path: '/category/iot'
    },
    {
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ), title: 'Game Development', courses: 11, path: '/category/game-dev'
    },
  ];

  const courses = [
    {
      image: '/api/placeholder/400/200',
      title: "Complete Web Development Bootcamp",
      author: "John Smith",
      rating: 4.8,
      ratingCount: "1,200",
      duration: "22 Total Hours",
      lectures: "155 Lectures",
      level: "Beginner",
      price: "149.90"
    },
  ];

  return (
    <div className="p-8">
      {/* Categories Section */}
      <div className="mb-12">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">All Categories</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* Courses Section */}
      <div>
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Top Courses</h1>
          <button
            onClick={() => onNavigate('/courses')}
            className="px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            See All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;