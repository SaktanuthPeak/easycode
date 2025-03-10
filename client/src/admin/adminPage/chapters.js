import React, { useEffect, useState } from "react";
import ax from "../../conf/ax";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit, Plus, Search, Eye, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

export default function Chapters() {
  const [chaptersData, setChapterData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredChapter = chaptersData.filter((chapter) =>
    chapter.name_of_chapter.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredChapter?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = filteredChapter?.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const { courseId } = useParams();
  const navigate = useNavigate();

  const fetchChapters = async () => {
    try {
      const chapters = await ax.get(
        `/courses/${courseId}?populate=course_chapters.video`
      );
      const sortedChapters = chapters.data.data.course_chapters.sort(
        (a, b) => a.chapter_number - b.chapter_number
      );

      setChapterData(sortedChapters);
    } catch (error) {
      console.log("This is error", error);
    }
  };

  const handleDelete = async (chapterId) => {
    try {
      await ax.delete(`/course-chapters/${chapterId}`);
      toast.success("Delete chapter successfully!");
      fetchChapters();
    } catch (error) {
      console.log("this is error");
      toast.error("Fail to delete chapter");
    }
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  return (
    <div className="mb-8 py-8 px-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="flex items-center gap-2 px-2 hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Courses Management</span>
        </button>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-5">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Chapters Management
        </h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chapters..."
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
            onClick={() =>
              navigate(`/courses/${courseId}/create-chapter`, {
                state: { courseId },
              })
            }
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Chapter
          </motion.button>
        </div>
      </div>
      <div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredChapter.length === 0 ? (
            <p className="text-center text-gray-500 my-8">
              No chapters found for this course.
            </p>
          ) : (
            <ul className="space-y-4 ">
              {displayedItems.map((chapter, index) => (
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
                    <button
                      asChild
                      variant="outline"
                      className="flex items-center flex items-center space-x-2 bg-green-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                      onClick={() =>
                        navigate(`/courses/${courseId}/${chapter.documentId}`, {
                          state: {
                            selectedChapter: chapter,
                            courseId: courseId,
                          },
                        })
                      }
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      <span>View</span>
                    </button>
                    <button
                      asChild
                      variant="outline"
                      className="flex items-center flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                      onClick={() =>
                        navigate(
                          `/courses/${courseId}/${chapter.documentId}/edit`,
                          {
                            state: {
                              selectedChapter: chapter,
                              courseId: courseId,
                            },
                          }
                        )
                      }
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      <span>Edit</span>
                    </button>
                    <button
                      asChild
                      variant="outline"
                      className="flex items-center flex items-center space-x-2 bg-red-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                      onClick={() => handleDelete(chapter.documentId)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      <span>Delete</span>
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
      <div className="flex justify-end mt-4 space-x-2 px-8">
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
  );
}
