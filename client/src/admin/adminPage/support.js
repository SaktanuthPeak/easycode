import React, { useState, useEffect } from "react";
import ax from "../../conf/ax";


function Support() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // get user
  const fetchUsers = async () => {
    try {
      const response = await ax.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // get message by user
  const fetchMessages = async (username) => {
    setLoading(true);
    try {
      const response = await ax.get(`/messages?filters[username][$eq]=${username}&populate=*`);
      console.log("Messages Response:", response.data); 

      if (response.data && response.data.data) {
        setMessages(response.data.data); 
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchMessages(user.username);
  };

  const formatDate = (isoString) => {
    if (!isoString) 
      return "No timestamp";
    const date = new Date(isoString);
    return date.toLocaleString("en-EN", {
      weekday: "long",
      month: "long",
      year: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="flex h-screen p-6">
      {/*left column */}
      <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className={`p-2 cursor-pointer rounded-lg ${
                selectedUser?.id === user.id ? "bg-blue-200" : "bg-white"
              }`}
              onClick={() => handleUserClick(user)}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      {/*right column */}
      <div className="w-2/3 bg-white p-4 overflow-y-auto">
        {selectedUser ? (
          <>
            <h2 className="text-xl font-bold mb-4">Messages from {selectedUser.username}</h2>
            {loading ? (
              <p className="text-gray-500">Loading messages...</p>
            ) : messages.length > 0 ? (
              <ul>
                {messages.map((message) => {
                  console.log("Message Object:", message);
                  return (
                    <li key={message.id} className="p-2 border-b">
                      <p className="text-gray-700 font-bold">
                        {message.context || "No content available"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {message.timestamp ? formatDate(message.timestamp) : "No timestamp"}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500">No messages found</p>
            )}
          </>
        ) : (
          <p className="text-gray-500">Select a user to view messages</p>
        )}
      </div>
    </div>
  );
}

export default Support;
