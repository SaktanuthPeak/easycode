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
  const [chapterVideo, setChapterVideo] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const location = useLocation();
  const courseId = location.state?.courseId;
  const selectedChapter = location.state?.selectedChapter;
  const { chapterId } = useParams();

  useEffect(() => {
    if (selectedChapter) {
      setTitle(selectedChapter.name_of_chapter);
      setChapterNumber(selectedChapter.chapter_number);
      setContent(selectedChapter.chapter_description);
      setChapterVideo(selectedChapter.video[0]);
    }
  }, [selectedChapter]);

  const fullVideoUrl = chapterVideo
    ? `${conf.apiUrlPrefix.replace("/api", "")}${selectedChapter.video[0].url}`
    : null;

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
        setChapterVideo(uploadedFileId);

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
      const chapterData = {
        name_of_chapter: title,
        chapter_number: chapterNumber,
        chapter_description: content,
        video: videoPreviewUrl ? chapterVideo : chapterVideo.id,
        course: courseId,
      };
      if (selectedChapter) {
        const response = await ax.put(`/course-chapters/${chapterId}`, {
          data: chapterData,
        });
        toast.success("Update chapter successfully!");
      } else {
        const response = await ax.post("/course-chapters", {
          data: chapterData,
        });
        toast.success("Create chapter successfully!");
      }

      navigate(`/courses/${courseId}`);
      console.log("Chapter created successfully");
    } catch (error) {
      console.log("Failed to create chapter. Please try again.", error);
      toast.error("Update chapter successfully!");
      setError("Failed to create chapter. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {chapterId ? `Edit chapter : ${title}` : "Create New Chapter"}
      </h1>
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
          {chapterVideo && (
            <p className="text-sm text-gray-500 mt-2">
              Selected file: {chapterVideo.name}
            </p>
          )}
        </div>
        {videoPreviewUrl ? (
          <div className="mt-4">
            <video
              src={videoPreviewUrl}
              controls
              className="w-full max-h-64 object-contain"
            />
          </div>
        ) : (
          fullVideoUrl && (
            <div className="mt-4">
              <video
                src={fullVideoUrl}
                controls
                className="w-full max-h-64 object-contain"
              />
            </div>
          )
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
          {chapterId ? "Edit Chapter" : "Create Chapter"}
        </button>
      </form>
    </div>
  );
}
