import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import Loading from "../components/Loading";

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(parseFloat(rating || 0))
              ? "text-yellow-400"
              : "text-gray-200"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const TutorCard = ({ tutor }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
    <div className="flex items-start gap-4 mb-4">
      <div className="relative shrink-0">
        <img
          src={
            tutor.photoURL ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${tutor.name}`
          }
          alt={tutor.name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-100"
          onError={(e) => {
            e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${tutor.name}`;
          }}
        />
        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">
          {tutor.name}
        </h3>
        <p className="text-sm text-gray-500 truncate">{tutor.email}</p>
        <div className="flex items-center gap-2 mt-1">
          <StarRating rating={tutor.averageRating} />
          <span className="text-xs text-gray-500">
            {tutor.averageRating
              ? `${parseFloat(tutor.averageRating).toFixed(1)} (${tutor.reviewCount || 0})`
              : "No reviews"}
          </span>
        </div>
      </div>
    </div>

    {tutor.subjects && (
      <div className="flex flex-wrap gap-2 mb-4">
        {(Array.isArray(tutor.subjects) ? tutor.subjects : [tutor.subjects])
          .slice(0, 3)
          .map((s, i) => (
            <span
              key={i}
              className="bg-purple-50 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-full"
            >
              {s}
            </span>
          ))}
      </div>
    )}

    <div className="flex gap-2 pt-4 border-t border-gray-100">
      <Link
        to={`/tutors/${tutor._id}`}
        className="flex-1 text-center py-2.5 bg-gradient-to-r from-purple-600 to-teal-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
      >
        View Profile
      </Link>
      <Link
        to="/tuitions"
        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
      >
        Browse
      </Link>
    </div>
  </div>
);

const AllTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/tutors`)
      .then((res) => {
        setTutors(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = tutors.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      (typeof t.subjects === "string" &&
        t.subjects.toLowerCase().includes(search.toLowerCase())),
  );

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-black text-white mb-3">
            Find Your Perfect Tutor
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Expert tutors ready to help you succeed
          </p>
          <div className="max-w-md mx-auto relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 rounded-xl text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {filtered.length} Tutors Available
          </h2>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tutor) => (
              <TutorCard key={tutor._id} tutor={tutor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <p className="text-gray-500 text-lg font-medium">No tutors found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTutors;
