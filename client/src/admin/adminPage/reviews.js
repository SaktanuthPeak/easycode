import { useParams } from "react-router-dom";
import ax from "../../conf/ax";
import { useEffect, useState } from "react";
import { Star, Search } from "lucide-react";

export default function Reviews() {
  const { courseId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [starFilter, setStarFilter] = useState(null);
  const [courseName, setCourseName] = useState("");

  const fetchReviews = async () => {
    try {
      const response = await ax.get(`/courses/${courseId}?populate=*`);
      setReviews(response.data.data.reviews || []);
      setCourseName(response.data.data.Course_name);
    } catch (error) {
      console.error("This is error", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(
    (review) =>
      review.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (starFilter === null || review.stars === starFilter)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <main className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{courseName}</h1>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
            Reviews
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>

            <select
              value={starFilter || ""}
              onChange={(e) =>
                setStarFilter(e.target.value ? parseInt(e.target.value) : null)
              }
              className="w-full md:w-48 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Stars</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative" // Add 'relative' here
              >
                <div className="absolute top-4 right-4 flex items-center bg-blue-100 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-blue-600 fill-blue-600 mr-1" />
                  <span className="text-sm font-medium text-blue-600">
                    {review.stars}
                  </span>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                    <span className="text-xl font-semibold text-blue-600 uppercase">
                      {review.username?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {review.username}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No reviews match your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
