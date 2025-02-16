import React, { use, useEffect, useState } from "react";
import ax from "../../conf/ax";
import { useNavigate, useParams, Link } from "react-router-dom";
import conf from "../../conf/main";
import no_image_available from "../../clientPage/images/No_image_available.svg.jpg";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";

const Chapter = () => {
  const [chaptersData, setChapterData] = useState([]);
  const { courseId } = useParams();
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
                    {chapter.order}. {chapter.title}
                  </h2>
                </div>
                <div className="flex space-x-2">
                  <button asChild variant="outline">
                    <Link
                      href={`/courses/${courseId}/chapters/${chapter.documetId}`}
                    >
                      View
                    </Link>
                  </button>
                  <button asChild>
                    <Link
                      href={`/courses/${courseId}/chapters/${chapter.documetId}/edit`}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
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
