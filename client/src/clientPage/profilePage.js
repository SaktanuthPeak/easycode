import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

const URL_AUTH = "/api/auth/local";
const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("api/users/me");
      setUser(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(user);
  console.log(user.firstname);
  useEffect(() => {
    fetchItems();
  }, []);
  return (
    <div className="bg-gradient-to-b from-indigo-950 to-blue-900 min-h-screen flex items-center justify-center p-4">
      <div className="font-std mb-10 w-full rounded-2xl bg-white p-10 font-normal leading-relaxed text-gray-900 shadow-xl">
        <div className="flex flex-col md:flex-row">
          {/* Profile Picture and Edit Button */}
          <div className="md:w-1/3 text-center mb-8 md:mb-0">
            <img
              src="https://i.pravatar.cc/300"
              alt="Profile Picture"
              className="rounded-full w-48 h-48 mx-auto mb-4 border-4 border-indigo-800 transition-transform duration-300 hover:scale-105 ring ring-gray-300"
            />
            <button className="mt-4 bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors duration-300 ring ring-gray-300 hover:ring-indigo-300">
              Edit Profile
            </button>
          </div>

          {/* User Information */}
          <div className="md:w-2/3 md:pl-8">
            <p className="text-xl   mb-6">First name : {user.firstname}</p>
            <p className="text-xl   mb-6">Last name : {user.lastname}</p>
            <p className="text-xl   mb-6">Username: {user.username}</p>
            <p className="text-xl   mb-6">Username: {user.email}</p>
            <p className="text-xl   mb-6">Birth date : {dayjs(user.birth_date).format('DD/MM/YYYY')}</p>
            <p className="text-xl   mb-6">Phone number : 0{user.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
