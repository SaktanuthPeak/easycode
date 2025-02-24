import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ax from "../../conf/ax";
export default function TeacherDetailPage() {
  const [teacher, setTeacher] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      
      try {
        const response = await ax.get(
          `/users/${id}?populate[courses][populate][users][populate]=role`
          
        );
       
        
      setTeacher(response.data);
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      }
    };
    fetchTeacherDetails();
  }, [id]);

  if (!teacher) return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{teacher.firstname} {teacher.lastname}</h1>
      <div className="space-y-4">
        {teacher.courses.map((course) => {
          const students = course.users.filter((user) => user.role && user.role.name !== "Teacher");
          return (
            <div key={course.id} className="p-4 border rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer" onClick={() => navigate(`/teacherStudent/${course.id}`)}>
                {course.Course_name}
              </h2>
              <p className="text-gray-600">Number of Students: {students.length}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
