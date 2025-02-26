import React, { useState, useEffect } from "react";
import ax from "../../conf/ax";
import { SlActionRedo } from "react-icons/sl";


function Support() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyToMessage, setReplyToMessage] = useState(null);



  // get user
  const fetchUsers = async () => {
    const yourToken = localStorage.getItem("jwt");

    try {
      const response = await ax.get("/users", {
        headers: {
          Authorization: `Bearer ${yourToken}`,
        },
      });

      const filteredUsers = response.data.filter(user => user.username !== "admintest");
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };


  // get message by user
  const fetchMessages = async (username) => {
    setLoading(true);
    const yourToken = localStorage.getItem("jwt");
  
    try {
      const response = await ax.get(
        `/messages?filters[username][$eq]=${username}&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${yourToken}`,
          },
        }
      );
  
      console.log("Messages Response:", response.data);
  
      if (response.data && response.data.data) {
        const validMessages = response.data.data.filter(message => message.id);
        setMessages(validMessages); // เซตเฉพาะข้อความที่มี id ถูกต้อง
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

const openReplyModal = (message) => {
  if (!message || !message.id || !message.context) {
    console.error("Error: Message data is incomplete", message);
    return;
  }
  setReplyToMessage(message);
  setIsModalOpen(true);
};

  

  const sendReply = async () => {
    if (!replyMessage.trim()) return;
    console.log("Replying to message:", replyToMessage);

    const yourToken = localStorage.getItem("jwt");

    try {
      const response = await ax.put(
        `/messages/${replyToMessage.documentId}`,
        {
          data: { 
            admin_context: replyMessage,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${yourToken}`,
          },
        }
      );

      console.log("Reply sent successfully:", response.data);
      setIsModalOpen(false);
      setReplyMessage("");
      fetchMessages(selectedUser.username);
    } catch (error) {
      console.error("Error sending reply:", error.response ? error.response.data : error);
    }
  };

  return (
    <div className="flex h-screen p-6">
      {/* Left column */}
      <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className={`p-2 cursor-pointer rounded-lg ${selectedUser?.id === user.id ? "bg-blue-200" : "bg-white"
                }`}
              onClick={() => handleUserClick(user)}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      {/* Right column */}
      <div className="w-2/3 bg-white p-4 overflow-y-auto">
        {selectedUser ? (
          <>
            <h2 className="text-xl font-bold mb-4">Messages from {selectedUser.username}</h2>
            {loading ? (
              <p className="text-gray-500">Loading messages...</p>
            ) : messages.length > 0 ? (
              <ul>
                {messages.map((message) => (
                  <li key={message.id} className="p-2 border-b flex justify-between items-center">
                    <div>
                      <p className="text-gray-700 font-bold">{message.context || "No content available"}</p>
                      <p className="text-gray-500 text-sm">{formatDate(message.timestamp)}</p>
                    </div>
                    {/* ✅ ปุ่ม Reply ใช้ไอคอน SlActionRedo */}
                    <button
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                      onClick={() => openReplyModal(message)}
                    >
                      <SlActionRedo size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No messages found</p>
            )}
          </>
        ) : (
          <p className="text-gray-500">Select a user to view messages</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Reply to Message</h2>
            <p className="text-gray-700">{replyToMessage.context}</p>
            <textarea
              className="w-full border p-2 mt-2"
              rows="4"
              placeholder="Type your reply..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button className="bg-gray-400 text-white px-4 py-2 rounded-lg mr-2" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={sendReply}>
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Support;