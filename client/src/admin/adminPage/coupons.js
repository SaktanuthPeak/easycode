import { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react";
import ax from "../../conf/ax";
import CreateAndEditCoupon from "../component/createAndEditCoupon";
import { toast } from "react-toastify";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.coupon.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredCoupons?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = filteredCoupons?.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setEditingCoupon(null);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    fetchCoupon();
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setIsModalOpen(true);
  };

  const isBeforeToday = (coupon) => {
    const orderDate = new Date(coupon.expired_date).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    const isBefore = orderDate < today;
    if (isBefore) {
      handleDelete(coupon.documentId, isBefore);
    }
  };

  const fetchCoupon = async () => {
    try {
      const response = await ax.get(`/discount-coupons`);
      const coupons = response.data.data;
      const filteredCoupons = coupons.filter(
        (coupon) => !isBeforeToday(coupon)
      );

      setCoupons(coupons);
    } catch (error) {
      console.log("This is an error:", error);
    }
  };

  const handleDelete = async (coupon, isBefore) => {
    if (isBefore) {
    } else {
      const confirmCreate = window.confirm(
        "Are you sure you want to delete this coupon"
      );
      if (!confirmCreate) return;
    }
    try {
      await ax.delete(`/discount-coupons/${coupon}`);
      isBefore
        ? toast.error("Coupon is expired!")
        : toast.success("Delete coupon successfully!");
      fetchCoupon();
    } catch (error) {
      toast.error("Fail to delete coupon");
      console.log("this is error", error);
    }
  };

  useEffect(() => {
    fetchCoupon();
  }, []);

  return (
    <div className="min-h-screen container bg-gray-50 mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Coupon Management
      </h1>
      <div className="mb-6 flex items-center justify-between space-x-4">
        <button
          onClick={openModal}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Coupon
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search coupons..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      {isModalOpen && (
        <CreateAndEditCoupon
          isOpen={isModalOpen}
          onClose={closeModal}
          editCoupon={editingCoupon}
        >
          <h2 className="text-xl font-bold mb-4">Modal Title</h2>
          <p>This is the content of the modal.</p>
        </CreateAndEditCoupon>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedItems.map((coupon) => (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {coupon.coupon}
              </h3>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(coupon)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(coupon.documentId)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-gray-600">
              Discount: {coupon.discount_percent}%
            </p>
            <p className="text-gray-600">Start At: {coupon.start_date}</p>
            <p className="text-gray-600">Expires: {coupon.expired_date}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border bg-white rounded disabled:opacity-50"
        >
          prev
        </button>

        {[...Array(totalPages)]?.map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border bg-white rounded disabled:opacity-50"
        >
          next
        </button>
      </div>
    </div>
  );
}
