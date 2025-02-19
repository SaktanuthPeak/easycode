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

  const location = useLocation();
  const chapterId = location.state?.courseId;
  console.log("Chapter ID:", chapterId);
  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError(
          "Video file is too large. Please select a file smaller than 100MB."
        );
        return;
      }
      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file.");
        return;
      }
      setVideo(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // if (!video) {
    //   setError("Please select a video file.");
    //   return;
    // }

    try {
      const response = await ax.post("/course-chapters", {
        data: {
          name_of_chapter: title,
          chapter_number: chapterNumber,
          chapter_description: content,
          video: video,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create chapter");
      }

      navigator("c");
      console.log("Chapter created successfully");
    } catch (error) {
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
