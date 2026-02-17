import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const AllTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTuitions, setTotalTuitions] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Search, Sort, Filter, Pagination states
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  // Fetch on filter/sort/page change
  useEffect(() => {
    fetchTuitions();
  }, [subject, location, sort, page]);

  const fetchTuitions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tuitions/all`,
        {
          params: {
            search,
            subject: subject === "all" ? "" : subject,
            location,
            status: "approved",
            sort,
            page,
            limit,
          },
        },
      );
      setTuitions(res.data.tuitions || []);
      setTotalTuitions(res.data.total || 0);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      toast.error("Failed to fetch tuitions");
    } finally {
      setLoading(false);
    }
  };

  // Search triggers fresh fetch from page 1
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTuitions();
  };

  // Reset all filters
  const handleReset = () => {
    setSearch("");
    setSubject("all");
    setLocation("");
    setSort("");
    setPage(1);
  };

  
  const subjects = [
    "all",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Bangla",
    "ICT",
    "History",
    "Geography",
  ];

  if (loading) return <Loading />;

return (
  <div className="min-h-screen bg-gray-50">
    {/* Hero Header */}
    <div className="bg-linear-to-r from-purple-700 to-blue-600 py-12 px-4">
      <div className="max-w-7xl mx-auto text-center text-white">
        <h1 className="text-4xl font-black mb-2">Find Your Perfect Tutor</h1>
        <p className="text-white/80 mb-6">
          {totalTuitions} tuitions available — search, filter, and apply today
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search by subject or location..."
            className="flex-1 px-5 py-3 rounded-xl text-gray-800 outline-none focus:ring-2 focus:ring-purple-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition"
          >
            🔍 Search
          </button>
        </form>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filter & Sort Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-wrap gap-3 items-center">
        {/* Subject Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-600">
            Subject:
          </label>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-purple-400"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setPage(1);
            }}
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Subjects" : s}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-600">
            Location:
          </label>
          <input
            type="text"
            placeholder="e.g. Dhaka"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-400 w-32"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-600">Sort:</label>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-purple-400"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Latest First</option>
            <option value="salaryLow">Budget: Low → High</option>
            <option value="salaryHigh">Budget: High → Low</option>
          </select>
        </div>

        {/* Results Count + Reset */}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-gray-500">
            <span className="font-bold text-purple-600">{tuitions.length}</span>{" "}
            of <span className="font-bold">{totalTuitions}</span> results
          </span>
          <button
            onClick={handleReset}
            className="text-sm text-red-500 hover:text-red-700 font-semibold underline"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Subject Quick Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => {
              setSubject(s);
              setPage(1);
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              subject === s
                ? "bg-purple-600 text-white shadow"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-purple-50 hover:text-purple-600"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      {/* Tuitions Grid */}
      {loading ? (
        <Loading />
      ) : tuitions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tuitions.map((tuition) => (
            <div
              key={tuition._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {tuition.subject}
                </span>
                <div className="text-right">
                  <p className="text-xl font-black text-purple-600">
                    ৳{tuition.salary}
                  </p>
                  <p className="text-xs text-gray-400">/month</p>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-1">
                Need {tuition.subject} Tutor
              </h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {tuition.description}
              </p>

              <div className="space-y-1.5 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{tuition.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👤</span>
                  <span>{tuition.studentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>
                    {new Date(tuition.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <Link
                to={`/tuitions/${tuition._id}`}
                className="block w-full text-center py-2.5 bg-linear-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition"
              >
                View Details & Apply
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-xl font-semibold mb-2">
            No tuitions found
          </p>
          <p className="text-gray-400 text-sm mb-4">
            Try adjusting your search or filters
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-2 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            ← Prev
          </button>

          {[...Array(totalPages).keys()].map((num) => {
            const pageNum = num + 1;
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              Math.abs(pageNum - page) <= 1
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-xl font-bold transition ${
                    page === pageNum
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-purple-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
            if (Math.abs(pageNum - page) === 2) {
              return (
                <span key={pageNum} className="text-gray-400">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next →
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <p className="text-center text-sm text-gray-400 mt-3">
          Page {page} of {totalPages} · {totalTuitions} total tuitions
        </p>
      )}
    </div>
  </div>
);
};

export default AllTuitions;
