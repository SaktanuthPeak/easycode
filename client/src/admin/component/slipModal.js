import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, Hash, DollarSign, Barcode } from "lucide-react";
const SlipModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="fixed inset-0 bg-gray bg-opacity-50 flex items-center justify-center z-50">
          <div
            tabIndex={-1}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 outline-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 id="modal-title" className="text-xl font-semibold">
                  {/* {title} */}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition duration-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="font-medium">Date:</span>
                  {/* <span className="ml-2">{date}</span> */}
                </div>
                <div className="flex items-center text-sm">
                  <Hash className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="font-medium">Transaction ID:</span>
                  {/* <span className="ml-2">{transactionId}</span> */}
                </div>
                <div className="flex items-center text-sm">
                  <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="font-medium">Amount:</span>
                  {/* <span className="ml-2">${amount.toFixed(2)}</span> */}
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-center">
                  <Barcode className="h-16 w-64 text-gray-800" />
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Scan to verify
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};
export default SlipModal;
