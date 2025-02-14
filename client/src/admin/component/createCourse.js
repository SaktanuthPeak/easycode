import React, { useState } from "react";

function CreateCourse() {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Course Created:", course);
    // Add your logic to submit the course data (e.g., API call)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Create a New Course
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 w-full"
        >
          {/* Course Title */}
          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Course Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={course.title}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course title"
              required
            />
          </div>

          {/* Course Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Course Description
            </label>
            <textarea
              id="description"
              name="description"
              value={course.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course description"
              required
            />
          </div>

          {/* Instructor Name */}
          <div className="mb-6">
            <label
              htmlFor="instructor"
              className="block text-sm font-medium text-gray-700"
            >
              Instructor
            </label>
            <input
              type="text"
              id="instructor"
              name="instructor"
              value={course.instructor}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter instructor name"
              required
            />
          </div>

          {/* Course Duration */}
          <div className="mb-6">
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700"
            >
              Duration (in hours)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={course.duration}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course duration"
              required
            />
          </div>

          {/* Course Price */}
          <div className="mb-6">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price (in USD)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={course.price}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course price"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;
