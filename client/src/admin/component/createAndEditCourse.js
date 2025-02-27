import React, { useEffect, useState } from "react";
import ax from "../../conf/ax";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Upload } from "lucide-react";
import conf from "../../conf/main";
import no_image_available from "../../clientPage/images/No_image_available.svg.jpg";

function CreateCourse() {
  const [course, setCourse] = useState({
    Course_name: "",
    category: { id: null }, // Ensures category is always an object
    course_description: "",
    course_hour: 0,
    course_minute: 0,
    course_overview: "",
    price: 0,
    course_img: [],
    instructor: { id: null },
  });

  const [categoriesData, setCategoriesData] = useState([]);
  const [teachersData, setTeachersData] = useState([]);
  const [previewUpload, setPreviewUpload] = useState(null);
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    if (courseId) {
      const fetchCourseData = async () => {
        try {
          const courseData = await ax.get(`/courses/${courseId}?populate=*`);
          const formattedCourse = {
            ...courseData.data.data,
            category: { id: courseData.data.data.category?.id || null },
            instructor: { id: courseData.data.data.instructor?.id || null },
            // Ensure proper structure
          };

          setCourse(formattedCourse);
        } catch (error) {
          console.log("This is error", error);
        }
      };
      fetchCourseData();
    }
  }, [courseId]);

  const fetchTeacher = async () => {
    try {
      const teacherData = await ax.get(`/instructors`);
      setTeachersData(teacherData.data.data);
    } catch (error) {
      console.log("This is error", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categories = await ax.get(`/categories?populate=*`);
      setCategoriesData(categories.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTeacher();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setCourse((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
      ...(name === "category" && { category: { id: Number(value) } }), // Ensure category is stored as { id: value }
    }));
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate the file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.");
        return;
      }

      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append("files", file);

      try {
        // Upload the image to Strapi
        const fileUploadResponse = await ax.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const uploadedFileId = fileUploadResponse.data[0]?.id;
        setPreviewUpload(URL.createObjectURL(file));
        if (!uploadedFileId) {
          throw new Error("File upload failed");
        }

        // Update the state with the uploaded image
        setCourse((prev) => ({
          ...prev,
          course_img: [{ id: uploadedFileId }], // Store as array with id object
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmCreate = window.confirm(
      courseId
        ? "Are you sure you want to Edit this course"
        : "Are you sure you want to Create this course"
    );

    if (!confirmCreate) return;
    const payload = {
      data: {
        Course_name: course.Course_name,
        course_description: course.course_description,
        price: course.price,
        course_overview: course.course_overview,
        course_hour: course.course_hour,
        course_minute: course.course_minute,
        category: course.category,
        course_img: previewUpload
          ? course.course_img
          : course?.course_img[0]?.id,
        instructor: course.instructor,
      },
    };
    try {
      if (courseId) {
        await ax.put(`/courses/${courseId}`, payload);
        toast.success("Course edited successfully!");
      } else {
        await ax.post(`/courses`, {
          data: course,
        });
        toast.success("Course created successfully!");
      }
      navigate("/courses");
    } catch (error) {
      console.log("This is error", error);
    }
  };

  const handleDelete = async () => {
    const confirmCreate = window.confirm(
      "Are you sure you want to Delete this course"
    );

    try {
      await ax.delete(`/courses/${courseId}`);
      toast.success("Delete course successfully!");
      navigate("/courses");
    } catch (error) {
      console.log("this is error", error);
    }
  };

  const getImageUrl = (img) => {
    if (!img || !img.url) return;
    return img.url.startsWith("/")
      ? `${conf.apiUrlPrefix.replace("/api", "")}${img.url}`
      : img.url;
  };

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          {courseId
            ? `Edit a ${course.Course_name} Course`
            : "Create a New Course"}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-6 space-y-6"
        >
          {/* Category */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={course?.category?.id || ""}
              onChange={(e) =>
                setCourse((prev) => ({
                  ...prev,
                  category: { id: Number(e.target.value) }, // Ensure correct structure
                }))
              }
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              required
            >
              <option value="">Select category</option>
              {categoriesData.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.Category_name}
                </option>
              ))}
            </select>
          </div>

          {/* teacher */}
          <div className="space-y-2">
            <label
              htmlFor="instructor"
              className="block text-sm font-medium text-gray-700"
            >
              Teacher
            </label>
            <select
              id="instructor"
              name="instructor"
              value={course?.instructor?.id || ""}
              onChange={(e) =>
                setCourse((prev) => ({
                  ...prev,
                  instructor: { id: Number(e.target.value) }, // Ensure correct structure
                }))
              }
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              required
            >
              <option value="">Select category</option>
              {teachersData.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name_teacher}
                </option>
              ))}
            </select>
          </div>

          {/* Course Title */}
          <div className="space-y-2">
            <label
              htmlFor="Course_name"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course title"
              required
            />
          </div>

          {/* Course Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Course Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="course_img"
                    className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    {course.course_img ? (
                      <div className="mt-4">
                        <img
                          src={
                            previewUpload
                              ? previewUpload
                              : getImageUrl(course.course_img[0])
                          }
                          alt="Preview"
                          className="max-w-xs max-h-xs rounded shadow-lg"
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <span>Upload a file</span>
                      <input
                        id="course_img"
                        name="course_img"
                        type="file"
                        className="sr-only"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                      <p className="pl-1">or drag and drop</p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Course Description */}
          <div className="space-y-2">
            <label
              htmlFor="course_description"
              className="block text-sm font-medium text-gray-700"
            >
              Course Description
            </label>
            <textarea
              id="course_description"
              name="course_description"
              value={course.course_description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course description"
              required
            />
          </div>

          {/* Course Overview */}
          <div className="space-y-2">
            <label
              htmlFor="course_overview"
              className="block text-sm font-medium text-gray-700"
            >
              Course Overview
            </label>
            <textarea
              id="course_overview"
              name="course_overview"
              value={course.course_overview}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course overview"
              required
            />
          </div>

          {/* Duration */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="course_hour"
                className="block text-sm font-medium text-gray-700"
              >
                Hours
              </label>
              <input
                type="number"
                id="course_hour"
                name="course_hour"
                value={course.course_hour}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="course_minute"
                className="block text-sm font-medium text-gray-700"
              >
                Minutes
              </label>
              <input
                type="number"
                id="course_minute"
                name="course_minute"
                value={course.course_minute}
                onChange={handleChange}
                min="0"
                max="59"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price (USD)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={course.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter course price"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            {courseId && (
              <button
                type="button"
                onClick={handleDelete}
                className="mr-1 w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Delete Course
              </button>
            )}
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {courseId ? "Edit Course" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;
