import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const AllTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTuitions, setTotalTuitions] = useState(0);
  const [status, setStatus] = useState("");

  // States for Search, Sort, and Filter
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    fetchTuitions();
  }, [subject, sort, page, status]);

  const fetchTuitions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tuitions/all`,
        {
          params: { search, subject, sort, page, limit, status },
        },
      );

    //   console.log("API Response:", res.data);

      setTuitions(res.data.tuitions || []);
      setTotalTuitions(res.data.total || 0);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tuitions");
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTuitions();
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search & Sort UI */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Search by subject or location..."
              className="flex-1 border p-2 rounded-lg outline-purple-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
            >
              Search
            </button>
          </form>

          <select
            className="border p-2 rounded-lg bg-white"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* --- GRID RENDERING --- */}
        {tuitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tuitions.map((tuition) => (
              <div
                key={tuition._id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {tuition.subject}
                  </span>
                  <span className="text-gray-500 font-semibold">
                    ${tuition.salary}/mo
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Need {tuition.subject} Tutor
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {tuition.description}
                </p>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <span className="mr-2">📍</span> {tuition.location}
                </div>
                <Link
                  to={`/tuitions/${tuition._id}`}
                  className="block text-center bg-gray-100 hover:bg-purple-600 hover:text-white text-gray-700 py-2 rounded-lg transition font-medium"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-xl font-medium">
              No tuitions found.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setStatus("");
                setSubject("all");
              }}
              className="mt-4 text-purple-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalTuitions > limit && (
          <div className="mt-12 flex justify-center gap-2">
            {[...Array(Math.ceil(totalTuitions / limit)).keys()].map((num) => (
              <button
                key={num}
                onClick={() => setPage(num + 1)}
                className={`px-4 py-2 rounded-lg transition font-medium ${
                  page === num + 1
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {num + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTuitions;
