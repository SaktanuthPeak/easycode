import React, { useState, useEffect } from "react";
import ax from "../conf/ax";
import { motion } from "framer-motion";
import UpdateProfileModal from "../component/updateProfileModal";
import { FaPencilAlt } from "react-icons/fa"; // Import the pencil icon
import conf from "../conf/main";

const ProfilePage = () => {
  const [user, setUser] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    user_profile: "",
    phone_number: "",
    birthdate: "",
    courses: [],
  });
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);


  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await ax.get("users/me?populate=courses");
      setUserId(response.data.id);
      setProfileImage(response.data.user_avatar);

      const uniqueCourses = Array.from(new Set(response.data.courses.map((course) => course.Course_name))).map(
        (courseName) => {
          return response.data.courses.find((course) => course.Course_name === courseName);
        }
      );

      setUser({ ...response.data, courses: uniqueCourses });
      setFormData({ ...response.data, courses: uniqueCourses });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfileImage = async () => {
    try {
      const response = await ax.get(`/users/me?populate=user_avatar.avatar_img`);
      setProfileImage(response.data.user_avatar);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchProfileImage();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prevUser) => ({ ...prevUser, user_profile: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async () => {
    if (!profileImageFile) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("files", profileImageFile);

      const uploadResponse = await ax.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!uploadResponse.data || !uploadResponse.data.length) {
        throw new Error("Image upload failed");
      }

      const uploadedImageId = uploadResponse.data[0].id;

      const updateResponse = await ax.post("/user-avatars", {
        data: {
          avatar_img: [uploadedImageId],
          user: userId,
        },
      });

      if (updateResponse.status !== 200 && updateResponse.status !== 201) {
        throw new Error("Failed to update user avatar");
      }

      await fetchItems();
    } catch (err) {
      console.error("Error uploading profile image:", err);
      if (err.response) {
        console.log("Server response:", err.response.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getChangedFields = () => {
    const changedFields = {};
    for (const key in formData) {
      if (formData[key] !== user[key]) {
        changedFields[key] = formData[key];
      }
    }
    return changedFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const changedFields = getChangedFields();
      await ax.put("/user/me", changedFields);
      setIsModalOpen(false);
      await fetchItems();
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Card layout */}
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
          <motion.div className="relative">
            <motion.img
              alt="profile"
              src={`${conf.apiUrlPrefix.replace("/api", "")}${profileImage?.avatar_img?.[0]?.url}` || "https://images.unsplash.com/photo-147209964578"}
              className="w-36 h-36 rounded-full shadow-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.1 }}
            />
            <label
              htmlFor="profileImage"
              className="absolute bottom-2 right-2 p-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition duration-200"
            >
              <FaPencilAlt className="w-5 h-5" />
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </motion.div>
          <motion.h2
            className="text-2xl font-semibold text-center mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            {user.username}
          </motion.h2>
          <button
            onClick={uploadProfileImage}
            disabled={!profileImageFile}
            className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Save Profile Picture
          </button>
        </motion.div>

        {/* 70% right column */}
        <motion.div
          className="w-[70%] bg-gray-100 p-6 flex flex-col justify-center rounded-lg shadow-lg relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {/* Update Profile Button with Pencil Icon */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-4 right-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200"
          >
            <FaPencilAlt className="w-5 h-5" />
          </button>

          {/* User information text */}
          <motion.h2
            className="text-2xl font-bold text-gray-800 mt-[-60px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            User Information 🪪
          </motion.h2>
          {/* Border line */}
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
          <motion.p className="text-2xl font-bold text-green-600 mt-2">
            {user.courses?.length || 0} course{user.courses?.length > 1 ? "s" : ""}
          </motion.p>
        </motion.div>

        {/* Purchased Courses List */}
        <motion.div className="w-[65%] p-6 flex flex-col">
          <motion.h2 className="text-2xl font-bold text-gray-800 ">Purchased Courses 💳</motion.h2>
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

      {/* Modal */}
      <UpdateProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProfilePage;