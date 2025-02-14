import React, { useEffect, useState } from "react";
import ax from "../../conf/ax";

function Order() {
  const [ordersData, setOrdersData] = useState([]);
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

  console.log(ordersData);

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-4xl mb-5">Order</h1>
      </div>
      {/* This is a comment */}
      <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-100">
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                <center>Date</center>
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                <center>Name</center>
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                <center>Email</center>
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                <center>Course</center>
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                <center>Status</center>
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                <center>Action</center>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {ordersData.map((item) => (
              <tr>
                <td className="py-4 px-6 border-b border-gray-200">
                  {dayjs(item.updatedAt).format("DD-MM-YYYY HH:mm")}
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  {item.Username}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 ">
                  {item.Email}
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  {item.Applied_course}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 ">
                  <center>
                    <form className="max-w-sm mx-auto">
                      <select
                        id="order_status"
                        className=" border border-gray-300 text-gray-000 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option selected>{item.order_status}</option>
                        {/* {item.order_status.map((item) => (
                        <option value="US">{item}</option>
                      ))} */}
                        <option value="confirm">confirm</option>
                        <option value="not confirm">not confirm</option>
                      </select>
                    </form>
                  </center>
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <center>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Submit
                    </button>
                  </center>
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
