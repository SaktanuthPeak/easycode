import { useEffect, useState } from "react";
import ax from "../conf/ax";
import { motion } from "framer-motion";
import no_image_available from "./component/images/No_image_available.svg.jpg"
import conf from "../conf/main";
import { useNavigate } from "react-router-dom";
import StudentChart from "./component/studentChart";

function TeacherDashboard() {
  const [teacherName, setTeacherName] = useState(null);
  const [instructorData, setInstructorData] = useState(null);
  const navigate = useNavigate();
  const [total, setTotal] = useState(null);
  const [courseTotal, setCourseTotal] = useState(null);

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const userResponse = await ax.get("users/me");
        const username = userResponse.data.username;
        setTeacherName(username);

        const infoResponse = await ax.get(
          "instructors?populate[courses][populate]=*"
        );
        const allInstructors = infoResponse.data.data;

        const instructor = allInstructors.find(
          (instructor) => instructor.name_teacher === username
        );
        console.log("instructors====", instructor)

        setInstructorData(instructor || null);

        if (instructor) {
          const totalPrice = instructor.courses.reduce((sum, course) => {
            return sum + (course.price * (course.users?.length || 0));
          }, 0);
          setTotal(totalPrice);
          console.log("total price === ", totalPrice)
          const courseCount = instructor.courses.length
          setCourseTotal(courseCount)

        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchTeacherInfo();
  }, []);


  const getImageUrl = (img) => {
    if (!img || !img.url) return no_image_available;
    return img.url.startsWith("/")
      ? `${conf.apiUrlPrefix.replace("/api", "")}${img.url}`
      : img.url;
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Teacher Dashboard</h1>

      {!instructorData ? (
        <p className="text-gray-500">No courses found.</p>
      ) : (
        <>
          {/* Flex container for Chart & Income Cards */}
          <div className="flex w-full md:w-5/6 lg:w-5/6 gap-6">
            {/* First Column: Chart */}
            <div className="w-full md:w-2/3">
              <StudentChart courses={instructorData.courses} />
            </div>

            {/* Second Column: Total Income Cards */}
            <div className="w-full md:w-1/3 flex flex-col gap-6 mt-10">
              <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-gray-800">Total income 💸</h2>
                <p className="text-2xl font-semibold text-green-600">{total} ฿</p>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                <h2 className="text-xl font-bold text-gray-800">Total courses 🗂️</h2>
                <p className="text-2xl font-semibold text-blue-500">{courseTotal} courses</p>
              </div>
            </div>
          </div>

          {/* Course List Section */}
          <h1 className="text-3xl font-bold mb-6 text-gray-800 mt-20">
            All {teacherName}'s courses 🌐
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {instructorData.courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/client-home/dashboard/${course.documentId}`)}
              >
                <div className="overflow-hidden rounded-lg shadow-lg bg-white h-200 cursor-pointer mt-4">
                  <img
                    src={getImageUrl(course.course_img?.[0])}
                    alt={course.Course_name}
                    className="w-full h-60 object-cover mt-6"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 mt-4">
                      {course.Course_name}
                    </h2>
                    <p className="text-gray-600">Students: {course.users?.length || 0}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );


}

export default TeacherDashboard;
