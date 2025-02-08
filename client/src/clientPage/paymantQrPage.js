import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import generatePayload from "promptpay-qr";
import qrcode from "qrcode";

const PromptPayQR = () => {
    const location = useLocation();

    const [promptPayID, setPromptPayID] = useState("0887893891");
    const [amount, setAmount] = useState(() => {
        return location.state?.total ? parseFloat(location.state.total) : 0;
    });
    const [qrCode, setQrCode] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState(null); // Store file content

    useEffect(() => {
        generateQRCode();
    }, [promptPayID, amount]);

    const generateQRCode = () => {
        if (!promptPayID || isNaN(amount) || amount <= 0) {
            setQrCode(null);
            return;
        }

        const payload = generatePayload(promptPayID, { amount: parseFloat(amount) });
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

                console.warn("File type not supported for simple reading.  Implement logic for", file.type);
                reader.readAsText(file);
            }
        }
    };

    return (
        <div className="container mx-auto p-8 bg-gray-100 rounded-lg shadow-md flex">
            <div className="w-1/2 pr-4">
                <h1 className="text-2xl font-bold mb-4">PromptPay QR Code</h1>
                {qrCode && (
                    <div className="qr-code-container bg-white p-4 rounded-lg shadow-inner">
                        <img src={qrCode} alt="PromptPay QR Code" className="mx-auto mb-4" />
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
                                {typeof fileContent === 'string' && fileContent.startsWith('data:image/') ? <img src={fileContent} alt="File Preview" className="max-w-full" /> : null}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromptPayQR;