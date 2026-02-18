import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router";
import axios from "axios";
import Loading from "../components/Loading";
import TutorReviews from "../components/TutorReviews";

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-5 h-5 ${
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

const TutorProfile = () => {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tutor by ID from users collection
    axios
      .get(`${import.meta.env.VITE_API_URL}/tutors/${id}`)
      .catch(() => null);

    // We'll fetch all tutors and find the one by ID
    axios
      .get(`${import.meta.env.VITE_API_URL}/tutors`)
      .then((res) => {
        const found = res.data.find((t) => t._id === id);
        if (found) {
          setTutor(found);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-gray-500 text-xl font-semibold">Tutor not found</p>
          <Link
            to="/tutors"
            className="mt-4 inline-block text-purple-600 font-semibold hover:underline"
          >
            ← Back to Tutors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="bg-linear-to-r from-purple-600 to-teal-600 h-40" />

      <div className="max-w-4xl mx-auto px-4 -mt-20 pb-16">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <img
              src={
                tutor.photoURL ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${tutor.name}`
              }
              alt={tutor.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md shrink-0"
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${tutor.name}`;
              }}
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-gray-900">
                  {tutor.name}
                </h1>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                  TUTOR
                </span>
              </div>
              <p className="text-gray-500 mb-3">{tutor.email}</p>
              <div className="flex items-center gap-3">
                <StarRating rating={tutor.averageRating} />
                <span className="font-bold text-gray-800">
                  {tutor.averageRating
                    ? parseFloat(tutor.averageRating).toFixed(1)
                    : "0.0"}
                </span>
                <span className="text-gray-400 text-sm">
                  ({tutor.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            <Link
              to="/tuitions"
              className="shrink-0 px-6 py-3 bg-linear-to-r from-purple-600 to-teal-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Hire Tutor
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-black text-purple-600">
                {tutor.reviewCount || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-teal-600">
                {tutor.averageRating
                  ? parseFloat(tutor.averageRating).toFixed(1)
                  : "—"}
              </p>
              <p className="text-sm text-gray-500 mt-1">Avg Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-indigo-600">Active</p>
              <p className="text-sm text-gray-500 mt-1">Status</p>
            </div>
          </div>
        </div>

        {/* About */}
        {tutor.bio && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
            <p className="text-gray-600 leading-relaxed">{tutor.bio}</p>
          </div>
        )}

        {/* Subjects */}
        {tutor.subjects && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Subjects</h2>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(tutor.subjects)
                ? tutor.subjects
                : [tutor.subjects]
              ).map((s, i) => (
                <span
                  key={i}
                  className="bg-purple-50 text-purple-700 font-semibold px-4 py-2 rounded-xl text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <TutorReviews tutorEmail={tutor.email} />
      </div>
    </div>
  );
};

export default TutorProfile;
