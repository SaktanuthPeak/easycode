import React, { useState, useEffect, useRef } from "react";
import generatePayload from "promptpay-qr";
import qrcode from "qrcode";

const PromptPayQR = () => {
    const [promptPayID, setPromptPayID] = useState("");
    const [amount, setAmount] = useState(0);
    const [qrCodeReady, setQrCodeReady] = useState(false);
    const [logo, setLogo] = useState(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!promptPayID || amount < 0) {
            setQrCodeReady(false);
            return;
        }

        const payload = generatePayload(promptPayID, { amount: parseFloat(amount) });
        const opts = {
            type: "image/png",
            margin: 1,
            width: 300,
            color: {
                light: "#ffffff",
                dark: "#000000",
            },
        };

        qrcode.toCanvas(canvasRef.current, payload, opts, (err) => {
            if (err) {
                console.error("QR Code Generation Error:", err);
                setQrCodeReady(false);
            } else {
                setQrCodeReady(true);
            }
        });
    }, [promptPayID, amount]);

    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setLogo(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const downloadQRCode = (format) => {
        if (!qrCodeReady) return;
        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.href = canvas.toDataURL(`image/${format}`);
        link.download = `PromptPayQR_${promptPayID}_${amount}.${format}`;
        link.click();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4 flex justify-center items-center">
                PromptPay QR Code Generator
                <img
                    width="40"
                    className="ml-2"
                    src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Animated-Flag-Thailand.gif"
                    alt="Thailand Flag"
                />
            </h1>

            <div className="mb-4">
                <label className="block text-left mb-1 font-medium">PromptPay ID (Phone or National ID)</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={promptPayID}
                    onChange={(e) => setPromptPayID(e.target.value)}
                    placeholder="Enter PromptPay ID"
                />
            </div>

            <div className="mb-4">
                <label className="block text-left mb-1 font-medium">Amount (THB)</label>
                <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                />
            </div>

            <div className="mb-4">
                <label className="block text-left mb-1 font-medium">Upload Logo (Optional)</label>
                <input type="file" accept="image/png, image/jpeg" onChange={handleLogoUpload} />
            </div>

            <button
                onClick={() => setQrCodeReady(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Generate QR Code
            </button>

            {qrCodeReady && (
                <div className="mt-6">
                    <canvas ref={canvasRef} className="mx-auto"></canvas>
                    <p className="text-sm text-gray-600 mt-2">PromptPay ID: {promptPayID} | THB: {amount}</p>
                    <div className="mt-4 space-x-2">
                        <button onClick={() => downloadQRCode("jpg")} className="bg-blue-500 text-white px-4 py-2 rounded">
                            Download JPG
                        </button>
                        <button onClick={() => downloadQRCode("png")} className="bg-green-500 text-white px-4 py-2 rounded">
                            Download PNG
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromptPayQR;