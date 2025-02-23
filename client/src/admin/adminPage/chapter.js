import React, { use, useEffect, useState } from "react";
import ax from "../../conf/ax";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import conf from "../../conf/main";
import no_image_available from "../../clientPage/images/No_image_available.svg.jpg";
import { motion } from "framer-motion";
import { Edit, Plus, Search, Eye } from "lucide-react";

export default function Chapter() {
  const [chapterData, setChapterData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { chapterId } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const selectedChapter = location.state?.selectedChapter;

  const fullVideoUrl = `${conf.apiUrlPrefix.replace("/api", "")}${
    selectedChapter.video[0].url
  }`;

  return (
    <div className="container mx-auto px-6 py-8 flex gap-8">
      {/* Main Content */}
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
