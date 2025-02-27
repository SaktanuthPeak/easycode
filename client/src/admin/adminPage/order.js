import { useEffect, useState } from "react";
import ax from "../../conf/ax";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { ChevronDown, FileText, Check, Search } from "lucide-react";
import SlipModal from "../component/slipModal";

function Order() {
  const [ordersData, setOrdersData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const dayjs = require("dayjs");

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const fetchOrder = async () => {
    try {
      const orders = await ax.get(`/admin-confirmations?populate=*`);
      const orderData = orders.data.data;

      const sortedData = orderData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrdersData(sortedData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders. Please try again.");
    }
  };

  const handleUpdateStatus = async (item) => {
    if (!selectedStatus[item.documentId]) {
      toast.warn("Please select a status before submitting.");
      return;
    }

    const confirmUpdate = window.confirm(
      "Are you sure you want to update this order status?"
    );

    if (!confirmUpdate) return;
    try {
      await ax.put(`/admin-confirmations/${item.documentId}`, {
        data: {
          order_status: selectedStatus[item.documentId],
        },
      });

      if (selectedStatus[item.documentId] === "confirm") {
        const listBuyCourse = item.course_documentid
          .replace(/\[|\]/g, "")
          .split(",");
        listBuyCourse.map(async (courseId) => {
          try {
            const listOwnCourse = await ax.get(
              `/courses/${courseId}?populate=users`
            );

            const addUser = listOwnCourse.data.data.users.map(
              (user) => user.id
            );
            const listBuyUser = [item.userId];
            const totalUser = addUser.concat(listBuyUser.map(Number));

            await ax.put(`/courses/${courseId}`, {
              data: {
                users: totalUser,
              },
            });
          } catch (error) {
            console.log("this is error", error);
          }
        });
      }

      toast.success("Order status updated successfully!");
      fetchOrder();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status. Please try again.");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const filteredOrders = ordersData.filter((order) => {
    if (!searchDate) return true;
    const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
    return orderDate === searchDate;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 container mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Order Management
        </h1>
        <div>
          <p className="text-gray-600">
            Efficiently manage and update order statuses
          </p>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-auto w-full divide-y">
            <thead className="bg-gray-50">
              <tr>
                {["Date", "Name", "Email", "Course", "Status", "Action"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((item) => (
                <motion.tr
                  key={item.id} // Changed key to item.id
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dayjs(item.updatedAt).format("DD-MM-YYYY HH:mm")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.Username}
                  </td>{" "}
                  {/* Accessing nested attributes */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.Email}
                  </td>{" "}
                  {/* Accessing nested attributes */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.Applied_course}
                  </td>{" "}
                  {/* Accessing nested attributes */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative">
                      <select
                        id={`status_order_${item.documentId}`} // Changed id to item.id
                        value={
                          selectedStatus[item.documentId] || item.order_status
                        } // Use existing status if available
                        onChange={(e) =>
                          setSelectedStatus({
                            ...selectedStatus,
                            [item.documentId]: e.target.value, // Changed key to item.id
                          })
                        }
                        className={`appearance-none w-full border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${
                          item.order_status === "confirm"
                            ? "bg-green-200 text-green-800"
                            : item.order_status === "not confirm"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirm">Confirm</option>
                        <option value="not confirm">Not Confirm</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openModal(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out flex items-center"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Slip
                      </button>
                      {isModalOpen && (
                        <SlipModal
                          onClose={closeModal}
                          selectedOrder={selectedOrder}
                        />
                      )}
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out flex items-center"
                        onClick={() => handleUpdateStatus(item)} // Changed id to item.id
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Submit
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default Order;
