import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const LatestTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/tuitions`,
        );
        setTuitions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tuitions:", error);
        setLoading(false);
      }
    };

    fetchTuitions();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto py-20 px-4">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-cyan-600 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="text-gray-400 font-medium">Loading tuition posts...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-20 px-4">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Latest Tuition Posts
          </h2>
          <p className="text-gray-500 mt-2">
            New opportunities posted recently
          </p>
        </div>
        <Link
          to="/tuitions"
          className="text-indigo-600 font-semibold hover:underline"
        >
          View All →
        </Link>
      </div>

      {tuitions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tuitions.map((post) => (
            <div
              key={post._id}
              className="group border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all"
            >
              <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {post.subject}
              </span>
              <h3 className="font-bold text-xl mt-4 text-gray-800 group-hover:text-indigo-600 transition-colors">
                Looking for {post.subject} Tutor
              </h3>
              <p className="text-gray-500 mt-2 flex items-center gap-2">
                📍 {post.location}
              </p>
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-50">
                <p className="text-2xl font-black text-gray-900">
                  {post.salary}{" "}
                  <span className="text-sm font-normal text-gray-400">
                    BDT/mo
                  </span>
                </p>
                <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm hover:bg-indigo-600 transition">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="col-span-full py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-lg">
            No tuitions posted yet. Check back later!
          </p>
        </div>
      )}
    </section>
  );
};

export default LatestTuitions;
