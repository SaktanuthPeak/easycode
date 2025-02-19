import React, { useState } from "react";
import ax from "../../conf/ax";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function CreateCourse() {
  const [course, setCourse] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmCreate = window.confirm(
      "Are you sure you want to Create this course?"
    );

    if (!confirmCreate) return;
    try {
      const addCourse = await ax.post(`/courses`, {
        data: course,
      });
      toast.success("Course created successfully!");
      navigate("/courses");
    } catch (error) {
      console.log("This is error", error);
    }
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
              id="Course_name"
              name="Course_name"
              value={course.Course_name}
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
              id="course_description"
              name="course_description"
              value={course.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course description"
              required
            />
          </div>

          {/* Instructor Name */}
          {/* <div className="mb-6">
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
          </div> */}

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
              id="course_hour"
              name="course_hour"
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
