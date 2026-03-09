import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";

// ── Skeleton Card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="flex flex-col rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] overflow-hidden animate-pulse">
    <div className="h-44 bg-[var(--bg-muted)]" />
    <div className="flex flex-col flex-1 p-5 gap-3">
      <div className="h-4 bg-[var(--bg-muted)] rounded w-1/3" />
      <div className="h-5 bg-[var(--bg-muted)] rounded w-3/4" />
      <div className="h-4 bg-[var(--bg-muted)] rounded w-1/2" />
      <div className="mt-auto pt-4 border-t border-[var(--bg-border)] flex justify-between items-center">
        <div className="h-6 bg-[var(--bg-muted)] rounded w-1/4" />
        <div className="h-9 bg-[var(--bg-muted)] rounded-xl w-1/3" />
      </div>
    </div>
  </div>
);

// ── Subject colour map (static strings — Tailwind won't purge) ────────────────
const subjectColors = {
  math: {
    bg: "bg-blue-50 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    icon: "📐",
  },
  english: {
    bg: "bg-green-50 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    icon: "📖",
  },
  science: {
    bg: "bg-purple-50 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    icon: "🔬",
  },
  physics: {
    bg: "bg-indigo-50 dark:bg-indigo-900/30",
    text: "text-indigo-700 dark:text-indigo-300",
    icon: "⚛️",
  },
  chemistry: {
    bg: "bg-orange-50 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-300",
    icon: "🧪",
  },
  biology: {
    bg: "bg-teal-50 dark:bg-teal-900/30",
    text: "text-teal-700 dark:text-teal-300",
    icon: "🧬",
  },
  ict: {
    bg: "bg-cyan-50 dark:bg-cyan-900/30",
    text: "text-cyan-700 dark:text-cyan-300",
    icon: "💻",
  },
  bangla: {
    bg: "bg-red-50 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
    icon: "🇧🇩",
  },
  default: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-300",
    icon: "📚",
  },
};

const getSubjectStyle = (subject = "") => {
  const key = subject.toLowerCase().split(" ")[0];
  return subjectColors[key] || subjectColors.default;
};

// ── Tuition Card ──────────────────────────────────────────────────────────────
const TuitionCard = ({ post }) => {
  const s = getSubjectStyle(post.subject);
  return (
    <Link
      to={`/tuitions/${post._id}`}
      className="group flex flex-col h-full rounded-2xl border border-[var(--bg-border)]
        bg-[var(--bg-elevated)] overflow-hidden shadow-sm
        hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700
        transition-all duration-300"
    >
      {/* Banner / Image */}
      <div
        className={`relative h-44 flex items-center justify-center shrink-0 ${s.bg}`}
      >
        <span className="text-6xl select-none">{s.icon}</span>
        {/* Salary badge */}
        <div className="absolute top-3 right-3 bg-white dark:bg-[var(--bg-elevated)] rounded-xl px-3 py-1 shadow-md">
          <span className="text-sm font-black text-[var(--text-primary)]">
            ৳{Number(post.salary).toLocaleString()}
          </span>
          <span className="text-xs text-[var(--text-muted)]">/mo</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Subject badge */}
        <span
          className={`self-start text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider truncate max-w-full ${s.bg} ${s.text}`}
        >
          {post.subject}
        </span>

        {/* Title */}
        <h3
          className="mt-3 text-base font-bold text-[var(--text-primary)] line-clamp-2
          group-hover:text-purple-600 dark:group-hover:text-purple-400
          transition-colors leading-snug"
        >
          {post.title}
        </h3>

        {/* Short description */}
        <p className="mt-1.5 text-sm text-[var(--text-secondary)] line-clamp-2">
          {post.description ||
            `Looking for a tutor for ${post.subject} in ${post.location}.`}
        </p>

        {/* Meta */}
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
          <span>📍 {post.location}</span>
          {post.class && <span>🎓 Class {post.class}</span>}
          {post.daysPerWeek && <span>📅 {post.daysPerWeek}d/wk</span>}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-[var(--bg-border)] flex items-center justify-between gap-2">
          <div>
            <p className="text-lg font-black text-[var(--text-primary)] leading-none">
              ৳{Number(post.salary).toLocaleString()}
            </p>
            <p className="text-xs text-[var(--text-muted)]">per month</p>
          </div>
          <span
            className="shrink-0 px-4 py-2 rounded-xl text-sm font-bold
            bg-[var(--bg-muted)] text-[var(--text-secondary)]
            border border-[var(--bg-border)]
            group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600
            transition-all duration-200"
          >
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const LatestTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/tuitions?limit=8`)
      .then((r) => setTuitions(r.data))
      .catch((e) => console.error("Error fetching tuitions:", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 px-4 bg-[var(--bg-base)]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">
              Latest Tuition Posts
            </h2>
            <p className="text-[var(--text-secondary)] mt-2">
              New opportunities posted recently
            </p>
          </div>
          <Link
            to="/tuitions"
            className="text-purple-500 dark:text-purple-400 font-semibold hover:underline text-sm"
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
        {!loading && tuitions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tuitions.map((post) => (
              <TuitionCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && tuitions.length === 0 && (
          <div className="py-16 text-center bg-[var(--bg-surface)] rounded-2xl border-2 border-dashed border-[var(--bg-border-strong)]">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-[var(--text-muted)] text-lg font-medium">
              No tuitions posted yet.
            </p>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Check back later!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestTuitions;
