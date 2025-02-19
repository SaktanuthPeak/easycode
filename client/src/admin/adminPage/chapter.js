import React, { use, useEffect, useState } from "react";
import ax from "../../conf/ax";
import { useNavigate, useParams, Link } from "react-router-dom";
import conf from "../../conf/main";
import no_image_available from "../../clientPage/images/No_image_available.svg.jpg";
import { motion } from "framer-motion";
import { Edit, Plus, Search, Eye } from "lucide-react";

const Chapter = () => {
  const [chaptersData, setChapterData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { courseId } = useParams();
  const navigate = useNavigate();
  const fetchChapters = async () => {
    try {
      const chapters = await ax.get(`/courses/${courseId}?populate=*`);
      setChapterData(chapters.data.data.course_chapters);
    } catch (error) {
      console.log("This is error", error);
    }
  };

  console.log(chaptersData);
  useEffect(() => {
    fetchChapters();
  }, []);
  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          All Chapter
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
            Add Chapter
          </motion.button>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {chaptersData.length === 0 ? (
          <p className="text-center text-gray-500 my-8">
            No chapters found for this course.
          </p>
        ) : (
          <ul className="space-y-4">
            {chaptersData.map((chapter, index) => (
              <motion.li
                key={chapter.documetId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {chapter.chapter_number}. {chapter.name_of_chapter}
                  </h2>
                </div>
                <div className="flex space-x-2 items-stretch">
                  <button asChild variant="outline">
                    <Link
                      href={`/courses/${courseId}/chapters/${chapter.documetId}`}
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </button>
                  <button asChild className="flex ">
                    <Link
                      href={`/courses/${courseId}/chapters/${chapter.documetId}/edit`}
                      className="flex items-center flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      <span>Edit</span>
                    </Link>
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default Chapter;
