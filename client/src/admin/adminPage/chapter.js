import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import conf from "../../conf/main";
import { ArrowLeft } from "lucide-react";
export default function Chapter() {
  const location = useLocation();
  const selectedChapter = location.state?.selectedChapter;
  const navigate = useNavigate();

  const fullVideoUrl = `${conf.apiUrlPrefix.replace("/api", "")}${
    selectedChapter.video[0].url
  }`;

  return (
    <div className="container mx-auto px-6 py-8 gap-8">
      <button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="flex items-center gap-2 mb-5 px-2 hover:bg-slate-100"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Chapters Management</span>
      </button>
      <div className="flex-1">
        {selectedChapter && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-800">
              <video
                src={fullVideoUrl}
                alt={selectedChapter.name_of_chapter}
                className="w-full h-full object-cover"
                controls
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                {selectedChapter.name_of_chapter}
              </h2>
              <p className="text-gray-600">
                {selectedChapter.chapter_description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
