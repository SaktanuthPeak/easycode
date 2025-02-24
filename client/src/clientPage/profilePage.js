import React, { useState, useEffect } from "react";
import ax from "../conf/ax";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const [user, setUser] = useState({ username: "", firstname: "", lastname: "", email: "", profileImage: "" });
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await ax.get(`users/me`);
      setUser(response.data);
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
        className="flex w-[99%] md:w-[95%] lg:w-[90%] min-h-[500px] mx-auto gap-6"
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
            className="w-48 h-48 rounded-full shadow-md"
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
          <motion.h2
            className="text-2xl font-bold text-gray-800 mt-[-290px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            User Information
          </motion.h2>
          <motion.hr
            className="border-gray-300 my-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            style={{ transformOrigin: "left" }}
          />

          {/* User Info */}
          <motion.div
            className="flex flex-col md:flex-row text-gray-700 font-bold mt-2 md:space-x-6 w-full"
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

          <motion.p
            className="text-2xl text-gray-700 font-bold mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.25 }}
          >
            Email: <span className="font-medium text-2xl">{user.email || "-"}</span>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ProfilePage;

