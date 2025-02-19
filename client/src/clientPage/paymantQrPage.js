import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import generatePayload from "promptpay-qr";
import qrcode from "qrcode";
import ax from "../conf/ax";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const PromptPayQR = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [promptPayID] = useState("0887893891");
  const [amount] = useState(() => {
    return location.state?.total ? parseFloat(location.state.total) : 0;
  });
  const [courseName, setCourseName] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [notification, setNotification] = useState("");
  const [documentIds, setDocumentIds] = useState(null);


  const notifySuccess = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const notifyError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  useEffect(() => {
    generateQRCode();

    if (location.state?.course_name) {
      setCourseName(location.state.course_name);
      console.log("Course Name from location:", location.state.course_name);
    } else {
      console.log("No course name found in location.state");
    }

    if (location.state?.document_ids) {
      setDocumentIds(location.state.document_ids);
      console.log("Document IDs from location:", location.state.document_ids);
    } else {
      console.log("No document IDs found in location.state");
    }
  }, [promptPayID, amount, location]);

  const generateQRCode = () => {
    if (!promptPayID || isNaN(amount) || amount <= 0) {
      setQrCode(null);
      return;
    }

    const payload = generatePayload(promptPayID, {
      amount: parseFloat(amount),
    });
    const opts = { type: "image/png", margin: 1, width: 300 };

    qrcode.toDataURL(payload, opts, (err, url) => {
      if (err) {
        console.error("QR Code Generation Error:", err);
        setQrCode(null);
      } else {
        setQrCode(url);
      }
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileContent(null);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);

        console.log("File content:", content);
      };

      if (file.type.startsWith("text/")) {
        reader.readAsText(file);
      } else if (file.type.startsWith("image/")) {
        reader.readAsDataURL(file);
      } else {
        console.warn(
          "File type not supported for simple reading.  Implement logic for",
          file.type
        );
        reader.readAsText(file);
      }
    }
  };
  const uploadSlip = async () => {
    if (!selectedFile || !courseName) {
      console.warn(
        "Please select a file and ensure the course name is available."
      );
      alert("กรุณาเลือกไฟล์และระบุชื่อคอร์สก่อนอัปโหลด");
      return;
    }

    try {
      const userResponse = await ax.get(`/users/me`);
      const username = userResponse.data.username;
      const email = userResponse.data.email;
      const userDocId = userResponse.data.documentId


      if (!username) {
        throw new Error("Username not found in user profile");
      }

      const formData = new FormData();
      formData.append("files", selectedFile);

      const fileUploadResponse = await ax.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedFileId = fileUploadResponse.data[0]?.id;
      if (!uploadedFileId) {
        throw new Error("File upload failed");
      }

      const createResponse = await ax.post(`/admin-confirmations`, {
        data: {
          Username: username,
          slip_upload: uploadedFileId,
          Applied_course: courseName,
          Email: email,
          user_documentid: userDocId,
          course_documentid: documentIds
        },
      });

      notifySuccess("Slip อัปโหลดสำเร็จ! แอดมินจะส่งอีเมลแจ้งให้ภายใน 10 นาที");
      setTimeout(() => {
        navigate("/client-home");
      }, 1500);
    } catch (error) {
      console.error("Error uploading slip:", error);
      notifyError("อัปโหลดล้มเหลว! กรุณาลองใหม่");
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-md flex">
      <ToastContainer />
      <div className="w-1/2 pr-4">
        <h1 className="text-2xl font-bold mb-4">PromptPay QR Code</h1>
        {qrCode && (
          <div className="qr-code-container bg-white p-4 rounded-lg shadow-inner">
            <img
              src={qrCode}
              alt="PromptPay QR Code"
              className="mx-auto mb-4"
            />
            <div className="qr-code-details text-center">
              <p className="text-gray-700">PromptPay ID: {promptPayID}</p>
              <p className="text-gray-700">THB: {amount.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="w-1/2 pl-4">
        <h2 className="text-xl font-bold mb-4">Upload e-slip file</h2>
        <input
          type="file"
          onChange={handleFileUpload}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {selectedFile && (
          <div className="mt-4">
            <p className="text-gray-700">Selected File: {selectedFile.name}</p>
            {fileContent && (
              <div className="mt-2 p-2 border rounded">
                {typeof fileContent === "string" &&
                  fileContent.startsWith("data:image/") ? (
                  <img
                    src={fileContent}
                    alt="File Preview"
                    className="max-w-full"
                  />
                ) : null}
              </div>
            )}
            <button
              onClick={uploadSlip}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Upload Slip
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptPayQR;
