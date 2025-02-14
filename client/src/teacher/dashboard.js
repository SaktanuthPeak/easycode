import { useEffect, useState } from "react";
import ax from "../conf/ax";

function TeacherDashboard() {
  const [teacherName, setTeacherName] = useState(null);
  const [instructorData, setInstructorData] = useState(null);

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        // ดึงข้อมูลอาจารย์
        const userResponse = await ax.get("users/me");
        const username = userResponse.data.username;
        setTeacherName(username);

        // ดึงข้อมูล instructor พร้อมคอร์ส
        const infoResponse = await ax.get("instructors?populate=courses.users");
        const allInstructors = infoResponse.data.data;

        // หา instructor ที่ตรงกับ username ของอาจารย์
        const instructor = allInstructors.find(
          (instructor) => instructor.name_teacher === username
        );

        setInstructorData(instructor || null);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchTeacherInfo();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>

      {!instructorData ? (
        <p className="text-gray-500">No courses found.</p>
      ) : (
        instructorData.courses.map((course) => (
          <div key={course.id} className="mb-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              {course.Course_name}
            </h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    #
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Student Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {course.users?.length > 0 ? (
                  course.users.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.username}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {user.email}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                    >
                      No students enrolled
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

export default TeacherDashboard;
