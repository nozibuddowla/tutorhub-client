import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

const AllTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTuitions();
  }, []);

  const fetchTuitions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tuitions/all`,
      );
      setTuitions(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch tuitions");
      setLoading(false);
    }
  };

  const filteredTuitions = tuitions.filter((t) => {
    if (filter === "all") return t.status === "approved";
    return t.subject.toLowerCase().includes(filter.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h1 className="text-3xl font-black text-gray-900">All Tuitions</h1>
          <p className="text-gray-500 mt-2">
            Browse available tuition opportunities
          </p>

          {/* Filter */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("mathematics")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === "mathematics"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Mathematics
            </button>
            <button
              onClick={() => setFilter("science")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === "science"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Science
            </button>
            <button
              onClick={() => setFilter("english")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === "english"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Tuitions Grid */}
        {filteredTuitions.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTuitions.map((tuition) => (
              <div
                key={tuition._id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {tuition.subject}
                  </span>
                  <span className="text-2xl font-black text-purple-600">
                    ৳{tuition.salary}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  {tuition.description}
                </h3>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📍</span>
                    <span className="text-gray-700">{tuition.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">👤</span>
                    <span className="text-gray-700">{tuition.studentName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📅</span>
                    <span className="text-gray-700">
                      {new Date(tuition.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/tuitions/${tuition._id}`}
                  className="block w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl text-center hover:opacity-90 transition-opacity"
                >
                  View Details & Apply
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg font-medium">
              No tuitions found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTuitions;
