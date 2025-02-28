import { useState, useEffect, useCallback } from "react"
import ax from "../../conf/ax"
import { SlActionRedo } from "react-icons/sl"
import { LuMessageCirclePlus } from "react-icons/lu"
import { FiTrash2 } from "react-icons/fi"

function Support() {
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false)
  const [broadcastMessage, setBroadcastMessage] = useState("")
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [replyMessage, setReplyMessage] = useState("")
  const [replyToMessage, setReplyToMessage] = useState(null)
  const [newMessages, setNewMessages] = useState({})
  const [newMessageContent, setNewMessageContent] = useState("")
  const [isNewMessageMode, setIsNewMessageMode] = useState(false)

  // for custom alert and confirm modals
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  const [alertModalMessage, setAlertModalMessage] = useState("")
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmModalMessage, setConfirmModalMessage] = useState("")
  const [onConfirmAction, setOnConfirmAction] = useState(null)

  
  const showAlert = (message) => {
    setAlertModalMessage(message)
    setAlertModalOpen(true)
  }

  const showConfirm = (message, action) => {
    setConfirmModalMessage(message)
    setOnConfirmAction(() => action) 
    setConfirmModalOpen(true)
  }

  // get user
  const fetchUsers = useCallback(async () => {
    const yourToken = localStorage.getItem("jwt")

    try {
      const response = await ax.get("/users", {
        headers: {
          Authorization: `Bearer ${yourToken}`,
        },
      })

      const filteredUsers = response.data.filter((user) => user.username !== "admintest")
      setUsers(filteredUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }, [])

  // get message by user
  const fetchMessages = async (username) => {
    setLoading(true)
    const yourToken = localStorage.getItem("jwt")

    try {
      const response = await ax.get(`/messages?filters[username][$eq]=${username}&populate=*`, {
        headers: {
          Authorization: `Bearer ${yourToken}`,
        },
      })

      console.log("Messages Response:", response.data)

      if (response.data && response.data.data) {
        const validMessages = response.data.data.filter((message) => message.id)
        // Sort messages by timestamp
        const sortedMessages = validMessages.sort((a, b) => {
          if (a.admin_context && !b.admin_context) return 1
          if (!a.admin_context && b.admin_context) return -1
          return new Date(b.timestamp) - new Date(a.timestamp)
        })
        setMessages(sortedMessages)

        // Check new messages
        setNewMessages((prev) => ({
          ...prev,
          [username]: validMessages.some((msg) => !msg.admin_context),
        }))
      } else {
        setMessages([])
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    const checkNewMessages = async () => {
      const yourToken = localStorage.getItem("jwt")

      try {
        const response = await ax.get("/messages?populate=*", {
          headers: {
            Authorization: `Bearer ${yourToken}`,
          },
        })
        const newMessagesData = {}
        if (response.data && response.data.data) {
          response.data.data.forEach((msg) => {
            if (!msg.admin_context) {
              newMessagesData[msg.username] = true
            }
          })
        }
        setNewMessages(newMessagesData)
      } catch (error) {
        console.error("Error checking new messages:", error)
      }
    }
    checkNewMessages()
    const interval = setInterval(checkNewMessages, 10000)

    return () => clearInterval(interval)
  }, [fetchUsers])

  const handleUserClick = (user) => {
    setSelectedUser(user)
    fetchMessages(user.username)

    setNewMessages((prev) => ({
      ...prev,
      [user.username]: false,
    }))
  }

  const formatDate = (isoString) => {
    if (!isoString) return "No timestamp"
    const date = new Date(isoString)
    return date.toLocaleString("en-EN", {
      weekday: "long",
      month: "long",
      year: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const openReplyModal = (message) => {
    if (!message || !message.id || !message.context) {
      console.error("Error: Message data is incomplete", message)
      return
    }
    setReplyToMessage(message)
    setIsNewMessageMode(false)
    setIsModalOpen(true)
  }

  const openNewMessageModal = () => {
    setReplyToMessage(null)
    setIsNewMessageMode(true)
    setIsModalOpen(true)
  }

  const sendReply = async () => {
    if (!replyMessage.trim()) return
    console.log("Replying to message:", replyToMessage)

    const yourToken = localStorage.getItem("jwt")

    try {
      const messageId = replyToMessage.documentId || replyToMessage.id

      const response = await ax.put(
        `/messages/${messageId}`,
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
        },
      )

      console.log("Reply sent successfully:", response.data)
      setIsModalOpen(false)
      setReplyMessage("")
      fetchMessages(selectedUser.username)
    } catch (error) {
      console.error("Error sending reply:", error.response ? error.response.data : error)
    }
  }

  const sendDirectMessage = async () => {
    if (!selectedUser || !newMessageContent.trim()) return

    const yourToken = localStorage.getItem("jwt")

    try {
      const response = await ax.post(
        "/messages",
        {
          data: {
            username: selectedUser.username,
            context: newMessageContent,
            admin_context: newMessageContent,
            timestamp: new Date().toISOString(),
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${yourToken}`,
          },
        },
      )
      console.log("Message sent successfully:", response.data)
      setNewMessageContent("")
      setIsModalOpen(false)
      fetchMessages(selectedUser.username)
    } catch (error) {
      console.error("Error sending direct message:", error)
    }
  }

  const sendBroadcastMessage = async () => {
    if (!broadcastMessage.trim()) return

    const yourToken = localStorage.getItem("jwt")

    try {
      setLoading(true)

      await fetchUsers()

      // Send message to each user
      for (const user of users) {
        await ax.post(
          "/messages",
          {
            data: {
              username: user.username,
              context: broadcastMessage,
              admin_context: broadcastMessage,
              timestamp: new Date().toISOString(),
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${yourToken}`,
            },
          },
        )
      }

      console.log("Broadcast message sent successfully to all users")
      setBroadcastMessage("")
      setIsBroadcastModalOpen(false)

      // Refresh messages for the currently selected user
      if (selectedUser) {
        await fetchMessages(selectedUser.username)
      }

      // Show success message modal
      showAlert("The message sent successfully to all users!")
    } catch (error) {
      console.error("Error sending message:", error)
      showAlert("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const deleteMessage = (messageId) => {
    if (!messageId) return

    // Use custom confirm modal 
    showConfirm("Are you sure for delete this message?", async () => {
      const yourToken = localStorage.getItem("jwt")

      try {
        await ax.delete(`/messages/${messageId}`, {
          headers: {
            Authorization: `Bearer ${yourToken}`,
          },
        })

        console.log("Message deleted successfully")

        // Remove the deleted message from the state
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId))

        showAlert("Message deleted successfully")
      } catch (error) {
        console.error("Error deleting message:", error)
        showAlert("Failed to delete message. Please try again.")
      }
    })
  }

  const renderMessageList = (messages, isUnanswered) => (
    <ul>
      {messages.map((message) => (
        <li key={message.id} className="p-2 border-b flex justify-between items-center">
          <div className="flex-1 mr-4">
            {message.context === message.admin_context ? (
              <>
                <p className="text-blue-600 font-bold">Admin: {message.context}</p>
                <p className="text-gray-500 text-sm mt-1">{formatDate(message.timestamp)}</p>
              </>
            ) : (
              <>
                <p className="text-gray-700 font-bold">{message.context || "No content available"}</p>
                {message.admin_context && <p className="text-blue-600 ml-4 mt-1">Reply: {message.admin_context}</p>}
                <p className="text-gray-500 text-sm mt-1">{formatDate(message.timestamp)}</p>
              </>
            )}
          </div>

          {isUnanswered ? (
            <button
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition flex-shrink-0"
              onClick={() => openReplyModal(message)}
            >
              <SlActionRedo size={20} />
            </button>
          ) : (
            <button
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition flex-shrink-0"
              onClick={() => deleteMessage(message.id)}
            >
              <FiTrash2 size={20} />
            </button>
          )}
        </li>
      ))}
    </ul>
  )

  // generate a color based on the username(userprofile)
  const generateColor = (username) => {
    let hash = 0
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash)
    }
    const color = `hsl(${hash % 360}, 70%, 70%)`
    return color
  }

  return (
    <div className="flex h-screen">
      {/* Left column */}
      <div className="w-1/3 bg-gray-100 overflow-y-auto border-r rounded-lg">
        <h2 className="text-2xl font-bold p-4 border-b">Chats</h2>
        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mb-4"
          onClick={() => setIsBroadcastModalOpen(true)}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message 📤"}
        </button>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className={`p-4 cursor-pointer hover:bg-gray-200 flex items-center ${
                selectedUser?.id === user.id ? "bg-blue-100" : ""
              }`}
              onClick={() => handleUserClick(user)}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-3"
                style={{ backgroundColor: generateColor(user.username) }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow">
                <p className="font-semibold">{user.username}</p>
                <p className="text-sm text-gray-500 truncate">
                  {newMessages[user.username] ? "New message" : "No new messages"}
                </p>
              </div>
              {newMessages[user.username] && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  !
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Right column */}
      <div className="w-2/3 bg-white p-4 overflow-y-auto">
        {selectedUser ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Messages from {selectedUser.username}</h2>
            {/* Button to send new message for each user */}
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 mb-4"
              onClick={openNewMessageModal}
            >
              <LuMessageCirclePlus size={20} />
              New Message
            </button>

            {/* Message list */}
            {loading ? (
              <p className="text-gray-500">Loading messages...</p>
            ) : messages.length > 0 ? (
              <>
                <h3 className="text-gray-700-xl font-bold mb-2">Unanswered Messages</h3>
                {renderMessageList(
                  messages.filter((m) => !m.admin_context),
                  true,
                )}

                <h3 className="text-gray-700-xl font-bold mt-6 mb-2">Answered Messages</h3>
                {renderMessageList(
                  messages.filter((m) => m.admin_context),
                  false,
                )}
              </>
            ) : (
              <p className="text-gray-500">No messages found</p>
            )}
          </>
        ) : (
          <p className="text-gray-500">Select a user to view messages</p>
        )}
      </div>

      {/* Modal - handles both reply and new message */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3 max-w-md">
            {isNewMessageMode ? (
              <>
                <h2 className="text-xl font-bold mb-4">Send Message to {selectedUser?.username}</h2>
                <textarea
                  className="w-full border p-2 mt-2 rounded"
                  rows="4"
                  placeholder="Type your message..."
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-500 transition"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    onClick={sendDirectMessage}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Reply to Message</h2>
                <p className="text-gray-700 p-2 bg-gray-50 rounded">{replyToMessage?.context}</p>
                <textarea
                  className="w-full border p-2 mt-4 rounded"
                  rows="4"
                  placeholder="Type your reply..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-500 transition"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={sendReply}
                  >
                    Send Reply
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Broadcast Message Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3 max-w-md">
            <h2 className="text-xl font-bold mb-4">Send Message</h2>
            <textarea
              className="w-full border p-2 mt-2 rounded"
              rows="4"
              placeholder="Type your message..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-400 text-white px-3 py-2 rounded-lg mr-2 hover:bg-gray-500 transition"
                onClick={() => setIsBroadcastModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={sendBroadcastMessage}
              >
                Send to All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3 max-w-md">
            <h2 className="text-xl font-bold mb-4">Notification</h2>
            <p>{alertModalMessage}</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={() => setAlertModalOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3 max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirmation</h2>
            <p>{confirmModalMessage}</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                onClick={() => setConfirmModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={() => {
                  setConfirmModalOpen(false)
                  if (onConfirmAction) onConfirmAction()
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Support
