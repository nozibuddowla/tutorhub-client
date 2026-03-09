import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router";

// ── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="flex flex-col rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] overflow-hidden animate-pulse">
    <div className="h-44 bg-[var(--bg-muted)]" />
    <div className="flex flex-col flex-1 p-5 gap-3">
      <div className="h-5 bg-[var(--bg-muted)] rounded w-3/4 mx-auto" />
      <div className="h-4 bg-[var(--bg-muted)] rounded w-1/2 mx-auto" />
      <div className="h-4 bg-[var(--bg-muted)] rounded w-1/3 mx-auto" />
      <div className="mt-auto h-9 bg-[var(--bg-muted)] rounded-xl w-full" />
    </div>
  </div>
);

// ── Star Rating ───────────────────────────────────────────────────────────────
const StarRating = ({ rating }) => (
  <div className="flex items-center justify-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-3.5 h-3.5 ${star <= Math.round(parseFloat(rating || 0)) ? "text-yellow-400" : "text-gray-200 dark:text-gray-700"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// ── Tutor Card ────────────────────────────────────────────────────────────────
const TutorCard = ({ tutor }) => (
  <Link
    to={`/tutors/${tutor._id}`}
    className="group flex flex-col h-full rounded-2xl border border-[var(--bg-border)]
      bg-[var(--bg-elevated)] overflow-hidden shadow-sm
      hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700
      transition-all duration-300"
  >
    {/* Banner / Image */}
    <div className="relative h-44 bg-[var(--color-primary-light)] dark:bg-purple-900/20 flex items-center justify-center shrink-0">
      <img
        src={
          tutor.photoURL ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${tutor.name}`
        }
        alt={tutor.name}
        onError={(e) => {
          e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${tutor.name}`;
        }}
        className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-[var(--bg-elevated)] shadow-md"
      />
      {/* Verified badge */}
      <div className="absolute top-3 right-3 bg-white dark:bg-[var(--bg-elevated)] rounded-xl px-2.5 py-1 shadow-md flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
        <span className="text-xs font-bold text-green-600 dark:text-green-400">
          Verified
        </span>
      </div>
    </div>

    {/* Body */}
    <div className="flex flex-col flex-1 p-5 text-center">
      {/* Name */}
      <h3
        className="text-base font-bold text-[var(--text-primary)] leading-snug
        group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate"
      >
        {tutor.name}
      </h3>

      {/* Description — subjects as short desc */}
      <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">
        {tutor.subjects
          ? (Array.isArray(tutor.subjects)
              ? tutor.subjects
              : [tutor.subjects]
            ).join(" · ")
          : "Experienced tutor"}
      </p>

      {/* Meta — rating + review count */}
      <div className="mt-2 flex flex-col items-center gap-1">
        <StarRating rating={tutor.averageRating} />
        <span className="text-xs text-[var(--text-muted)]">
          {tutor.averageRating
            ? `${parseFloat(tutor.averageRating).toFixed(1)} (${tutor.reviewCount || 0} reviews)`
            : "No reviews yet"}
        </span>
      </div>

      {/* Subject pills — max 3 */}
      {tutor.subjects && (
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {(Array.isArray(tutor.subjects) ? tutor.subjects : [tutor.subjects])
            .slice(0, 3)
            .map((s, i) => (
              <span
                key={i}
                className="text-xs font-semibold px-2 py-0.5 rounded-full
                bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
              >
                {s}
              </span>
            ))}
        </div>
      )}

      {/* View Details button — pushed to bottom */}
      <div className="mt-auto pt-4">
        <span
          className="block w-full py-2.5 rounded-xl text-sm font-bold
          bg-[var(--bg-muted)] text-[var(--text-secondary)]
          border border-[var(--bg-border)]
          group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-teal-600
          group-hover:text-white group-hover:border-transparent
          transition-all duration-200"
        >
          View Profile
        </span>
      </div>
    </div>
  </Link>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const LatestTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/tutors?limit=8`)
      .then((r) => setTutors(r.data))
      .catch((e) => console.error("Error fetching tutors:", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 px-4 bg-[var(--bg-surface)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-2">
              Verified Professionals
            </span>
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">
              Meet Our Expert Tutors
            </h2>
            <p className="text-[var(--text-secondary)] mt-2">
              Connect with qualified educators passionate about your success
            </p>
          </div>
          <Link
            to="/tutors"
            className="text-purple-500 dark:text-purple-400 font-semibold hover:underline text-sm shrink-0"
          >
            View All →
          </Link>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Cards */}
        {!loading && tutors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tutors.map((tutor, index) => (
              <motion.div
                key={tutor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="h-full"
              >
                <TutorCard tutor={tutor} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && tutors.length === 0 && (
          <div className="py-16 text-center bg-[var(--bg-elevated)] rounded-2xl border-2 border-dashed border-[var(--bg-border-strong)]">
            <p className="text-4xl mb-3">👨‍🏫</p>
            <p className="text-[var(--text-muted)] text-lg font-medium">
              No tutors available yet.
            </p>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestTutors;
