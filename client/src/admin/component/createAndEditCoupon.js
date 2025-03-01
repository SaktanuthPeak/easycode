import React, { useEffect, useState } from "react";
import ax from "../../conf/ax";
import { toast } from "react-toastify";

export default function CreateAndEditCoupon({
  isOpen,
  onClose,
  coupon,
  editCoupon,
}) {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    if (editCoupon) {
      setCode(editCoupon.coupon);
      setDiscount(editCoupon.discount_percent);
      setExpirationDate(editCoupon.expired_date);
      setStartDate(editCoupon.start_date);
    }
  }, [editCoupon]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      data: {
        coupon: code,
        discount_percent: discount,
        expired_date: expirationDate,
        start_date: startDate,
      },
    };
    try {
      const coupon = editCoupon
        ? await ax.put(`/discount-coupons/${editCoupon.documentId}`, payload)
        : await ax.post(`/discount-coupons`, payload);

      editCoupon
        ? toast.success("Update coupon succesfully!")
        : toast.success("Create coupon succesfully!");
      onClose();
    } catch (error) {
      editCoupon
        ? toast.error("Fail to Update coupon")
        : toast.error("Fail to create coupon");
      console.log("This is error", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg shadow-md mb-10"
    >
      <div>
        <label
          htmlFor="code"
          className="block text-sm font-medium text-gray-700"
        >
          Coupon Code
        </label>
        <input
          type="text"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label
          htmlFor="discount"
          className="block text-sm font-medium text-gray-700"
        >
          Discount (%)
        </label>
        <input
          type="number"
          id="discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
          min="0"
          max="100"
        />
      </div>
      <div>
        <label
          htmlFor="expirationDate"
          className="block text-sm font-medium text-gray-700"
        >
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label
          htmlFor="expirationDate"
          className="block text-sm font-medium text-gray-700"
        >
          Expiration Date
        </label>
        <input
          type="date"
          id="expirationDate"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {editCoupon ? "Update" : "Create"} Coupon
        </button>
      </div>
    </form>
  );
}
