import React, { useEffect, useState } from "react";
import ax from "../../conf/ax";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Order() {
  const [ordersData, setOrdersData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const dayjs = require("dayjs");

  const fetchOrder = async () => {
    try {
      const orders = await ax.get(`/admin-confirmations?populate=*`);
      const orderData = orders.data.data;
      setOrdersData(orderData);
    } catch (error) {
      console("This is order error ", error);
    }
  };

  const handleUpdateStatus = async (id) => {
    if (!selectedStatus[id]) {
      toast.warn("Please select a status before submitting.");
      return;
    }

    const confirmUpdate = window.confirm(
      "Are you sure you want to update this order status?"
    );

    if (!confirmUpdate) return;

    try {
      const updateStatus = ax.put(`/admin-confirmations/${id}`, {
        data: {
          order_status: selectedStatus[id],
        },
      });
      toast.success("Order status updated successfully!");
      fetchOrder();
    } catch (error) {
      console.log("This is error", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div className="mx-auto">
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Order</h1>
          <p className="text-gray-600">Manage and update order statuses</p>
        </div>
      </div>
      {/* This is a comment */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full table-auto">
          {" "}
          {/* Added table-auto for better responsiveness */}
          <thead className="bg-gray-100">
            <tr>
              <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase tracking-wider">
                {" "}
                {/* Added tracking-wider for better spacing */}
                Date
              </th>
              <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase tracking-wider">
                Name
              </th>
              <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase tracking-wider">
                Email
              </th>
              <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase tracking-wider">
                Course
              </th>
              <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase tracking-wider">
                Status
              </th>
              <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {ordersData.map((item) => (
              <tr
                key={item.documentId}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                {" "}
                {/* Added hover effect */}
                <td className="py-4 px-6 text-gray-700">
                  {" "}
                  {/* Increased text color contrast */}
                  {dayjs(item.updatedAt).format("DD-MM-YYYY HH:mm")}
                </td>
                <td className="py-4 px-6 text-gray-700">{item.Username}</td>
                <td className="py-4 px-6 text-gray-700">{item.Email}</td>
                <td className="py-4 px-6 text-gray-700">
                  {item.Applied_course}
                </td>
                <td className="py-4 px-6 text-center">
                  {" "}
                  {/* Centered the status */}
                  <select
                    id="status_order"
                    value={selectedStatus[item.documentId] || ""}
                    onChange={(e) =>
                      setSelectedStatus({
                        ...selectedStatus,
                        [item.documentId]: e.target.value,
                      })
                    }
                    className={`border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                      item.order_status === "confirm"
                        ? "bg-green-100 text-green-700" // Updated colors for better contrast
                        : item.order_status === "not confirm"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    <option value="" hidden>
                      {item.order_status}
                    </option>
                    <option value="pending">pending</option>
                    <option value="confirm">confirm</option>
                    <option value="not confirm">not confirm</option>
                  </select>
                </td>
                <td className="py-4 px-6 text-center">
                  {" "}
                  {/* Centered the buttons */}
                  <div className="flex items-center justify-center space-x-2">
                    {" "}
                    {/* Added space between buttons */}
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" // Added rounded-lg
                      // onClick={}
                    >
                      Slip
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" // Added rounded-lg
                      onClick={() => handleUpdateStatus(item.documentId)}
                    >
                      Submit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Order;
