import React, { use, useEffect, useState } from "react";
import ax from "../../conf/ax";
import { useNavigate } from "react-router-dom";
import conf from "../../conf/main";
import no_image_available from "../../clientPage/images/No_image_available.svg.jpg";

const Courses = () => {
  const [coursesData, setCoursesData] = useState([]);
  const navigate = useNavigate();
  const fetchCourses = async () => {
    try {
      const courses = await ax.get(`/courses?populate=*`);
      setCoursesData(courses.data.data);
    } catch (error) {
      console.log("TThis is error", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const getImageUrl = (img) => {
    if (!img || !img.url) return no_image_available;
    return img.url.startsWith("/")
      ? `${conf.apiUrlPrefix.replace("/api", "")}${img.url}`
      : img.url;
  };

  return (
    <div className="container mx-auto px-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Courses</h2>
        <button
          onClick={() => navigate("/courses/create-course")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Add Course
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {coursesData.map((item) => (
          <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
            <img
              className="rounded-lg w-full h-48 object-cover"
              src={coursesData && getImageUrl(item.course_img[0])}
              alt="Card Image"
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Card Title</div>
              <p className="text-gray-700 text-base">
                This is a simple card component built with React and Tailwind
                CSS. You can customize it further as needed.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
