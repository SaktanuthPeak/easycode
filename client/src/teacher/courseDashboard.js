import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ax from "../conf/ax";
import { motion } from "framer-motion";

const CourseDashboard = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await ax.get(`/courses/${courseId}?populate=users`);
        console.log("Course Data:", response.data.data);
        setCourseData(response.data.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading)
    return (
      <p className="text-center text-lg font-semibold mt-10">Loading...</p>
    );
  if (!courseData)
    return (
      <p className="text-center text-lg font-semibold mt-10 text-red-500">
        Course not found
      </p>
    );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        {courseData.Course_name} - Student List
      </h1>

      {/* ตารางแสดงรายชื่อนักเรียน */}
      <motion.div
        className="overflow-x-auto rounded-lg shadow-lg bg-white p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {courseData.users.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  #
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Name
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Email
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Joined At
                </th>
              </tr>
            </thead>
            <tbody>
              {courseData.users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.name || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.email || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-lg font-semibold text-gray-600">
            No students enrolled in this course yet.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default CourseDashboard;
