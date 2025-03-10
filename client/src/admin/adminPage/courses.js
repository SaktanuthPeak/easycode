import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ax from "../../conf/ax";
import conf from "../../conf/main";
import no_image_available from "../../clientPage/images/No_image_available.svg.jpg";
import { Plus, Edit, Search, Star, BookOpen } from "lucide-react";

const Courses = () => {
  const [coursesData, setCoursesData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCourses = coursesData.filter((course) =>
    course.Course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsPerPage = 16;
  const totalPages = Math.ceil(filteredCourses?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = filteredCourses?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const courses = await ax.get(`/courses?populate=*`);
      setCoursesData(courses.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
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
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Courses Management
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/courses/create-course")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Add Course
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
          {displayedItems.map((item, index) => (
            <motion.div
              key={item.documentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  className="w-full h-48 object-cover"
                  src={
                    item.course_img
                      ? getImageUrl(item.course_img[0])
                      : no_image_available
                  }
                  alt={item.Course_name}
                />
                <div className="absolute top-0 right-0 m-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/edit-course/${item.documentId}`);
                    }}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Edit size={16} className="text-blue-500" />
                  </motion.button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-xl mb-2 text-gray-800">
                  {item.Course_name}
                </h3>
                <div className="">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      navigate(`/courses/${item.documentId}/reviews`)
                    }
                    className="flex items-center justify-center text-xs bg-amber-500 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 w-full text-center mr-1"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    <p>View Reviews</p>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/courses/${item.documentId}`)}
                    className="flex items-center justify-center text-xs bg-blue-500 hover:bg-blue-600 text-white font-bold my-2 py-2 px-4 rounded-full transition-colors duration-300 w-full text-center"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    <p>View Chapter</p>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700">
              No courses found
            </h2>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or add a new course.
            </p>
          </div>
        )}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border bg-white rounded disabled:opacity-50"
          >
            prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200 bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border bg-white rounded disabled:opacity-50"
          >
            next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Courses;
