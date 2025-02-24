import React, { useState, useEffect } from "react";
import ax from "../conf/ax";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const [user, setUser] = useState({ username: "", firstname: "", lastname: "", email: "", profileImage: "", phone_number: "", birthdate: "", courses: [] });
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await ax.get("users/me?populate=courses");
      console.log("+=+=+=+=+=", response.data);

      // กรองข้อมูลคอร์สที่ซ้ำกัน
      const uniqueCourses = Array.from(new Set(response.data.courses.map(course => course.Course_name)))
        .map(courseName => {
          return response.data.courses.find(course => course.Course_name === courseName);
        });

      setUser({ ...response.data, courses: uniqueCourses });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (isLoading) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Welcome text left */}
      <motion.h1
        className="text-3xl font-bold text-gray-700 mt-4 ml-8 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1 }}
      >
        Welcome, {user.username}
      </motion.h1>

      {/* card layout */}
      <motion.div
        className="flex w-[99%] md:w-[95%] lg:w-[90%] min-h-[330px] mx-auto gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* 30% left column - Profile Image */}
        <motion.div
          className="w-[30%] bg-gray-100 p-6 flex flex-col justify-center items-center rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <motion.img
            alt="User"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            className="w-36 h-36 rounded-full shadow-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.1 }}
          />
          <motion.h2
            className="text-2xl font-semibold text-center mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            {user.username}
          </motion.h2>
        </motion.div>

        {/* 70% right column */}
        <motion.div
          className="w-[70%] bg-gray-100 p-6 flex flex-col justify-center rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {/*User information text */}
          <motion.h2
            className="text-2xl font-bold text-gray-800 mt-[-60px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            User Information
          </motion.h2>
          {/*Border line*/}
          <motion.hr
            className="border-gray-300 my-2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            style={{ transformOrigin: "left" }}
          />

          {/* User Info */}
          <motion.div
            className="flex flex-col md:flex-row text-gray-700 font-bold mt-4 md:space-x-6 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <p className="text-2xl text-left">
              Firstname: <span className="font-medium">{user.firstname || "-"}</span>
            </p>
            <p className="text-2xl text-left">
              Lastname: <span className="font-medium">{user.lastname || "-"}</span>
            </p>
          </motion.div>

          <motion.p className="text-2xl text-gray-700 font-bold mt-2">
            Email: <span className="font-medium">{user.email || "-"}</span>
          </motion.p>

          <motion.p className="text-2xl text-gray-700 font-bold mt-2">
            Phone Number: <span className="font-medium">{user.phone_number || "-"}</span>
          </motion.p>

          <motion.p className="text-2xl text-gray-700 font-bold mt-2">
            Birthdate: <span className="font-medium">{user.birthdate || "-"}</span>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Additional cards */}
      <motion.div
        className="flex w-[99%] md:w-[95%] lg:w-[90%] mx-auto gap-6 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Total Applied Courses Card */}
        <motion.div className="w-[30%] bg-gray-100 p-6 flex flex-col justify-center items-center rounded-lg shadow-lg min-h-[200px]">
          <motion.h2 className="text-2xl font-semibold text-gray-800">Total Applied Courses</motion.h2>
          <motion.p className="text-2xl font-bold text-gray-800 mt-2">
            {user.courses?.length || 0} course{user.courses?.length > 1 ? "s" : ""}
          </motion.p>
        </motion.div>

        {/* Purchased Courses List */}
        <motion.div className="w-[65%] p-6 flex flex-col">
          <motion.h2 className="text-2xl font-bold text-gray-800 ">Purchased Courses</motion.h2>
          <motion.hr className="border-gray-300 my-2" />
          {user.courses?.length > 0 ? (
            <motion.ul className="list-disc pl-6 space-y-2">
              {user.courses.map((course, index) => (
                <motion.li key={index} className="text-xl font-semibold text-gray-700">
                  {course.Course_name || "Unnamed Course"}
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <p className="text-lg text-gray-600 text-center">No courses purchased.</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;