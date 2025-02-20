import React, { useEffect, useState, useRef } from "react";
import ax from "../../conf/ax";
import { toast } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Upload } from "lucide-react";
import conf from "../../conf/main";

export default function CreateChapterPage() {
  const [title, setTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [content, setContent] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const location = useLocation();
  const courseId = location.state?.courseId;
  const {} = useParams();

  const handleVideoChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file.");
        return;
      }

      const formData = new FormData();
      formData.append("files", file);

      try {
        // Upload the image to Strapi
        const fileUploadResponse = await ax.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const uploadedFileId = fileUploadResponse.data[0]?.id;
        setVideoPreviewUrl(URL.createObjectURL(file));
        if (!uploadedFileId) {
          setError("File upload failed");
        }

        // Update the state with the uploaded image
        console.log("+++++++++++++++", uploadedFileId);
        setVideo(uploadedFileId);

        console.log("Image uploaded successfully:", uploadedFileId);
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Failed to upload video. Please try again.");
      }
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await ax.post("/course-chapters", {
        data: {
          name_of_chapter: title,
          chapter_number: chapterNumber,
          course: courseId,
          chapter_description: content,
          video: video,
        },
      });

      navigate(`/courses/${courseId}`);
      console.log("Chapter created successfully");
    } catch (error) {
      console.log("Failed to create chapter. Please try again.", error);
      setError("Failed to create chapter. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Chapter</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="block font-medium">
            Chapter Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter chapter title"
            required
            className="w-full border rounded-md p-2"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="chapterNumber" className="block font-medium">
            Chapter Number
          </label>
          <input
            id="chapterNumber"
            type="number"
            value={chapterNumber}
            onChange={(e) => setChapterNumber(e.target.value)}
            placeholder="Enter chapter number"
            required
            className="w-full border rounded-md p-2"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="video" className="block font-medium">
            Chapter Video
          </label>
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border rounded-md p-2 text-center"
          >
            Select Video File
          </button>
          {video && (
            <p className="text-sm text-gray-500 mt-2">
              Selected file: {video.name}
            </p>
          )}
        </div>
        {videoPreviewUrl && (
          <div className="mt-4">
            <video
              src={videoPreviewUrl}
              controls
              className="w-full max-h-64 object-contain"
            />
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="content" className="block font-medium">
            Chapter Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your chapter content here..."
            rows={10}
            required
            className="w-full border rounded-md p-2"
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-md flex items-center">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md"
        >
          Create Chapter
        </button>
      </form>
    </div>
  );
}
