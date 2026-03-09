import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="flex flex-col rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] overflow-hidden animate-pulse">
    <div className="h-44 bg-[var(--bg-muted)]" />
    <div className="flex flex-col flex-1 p-5 gap-3">
      <div className="h-5 bg-[var(--bg-muted)] rounded w-3/4 mx-auto" />
      <div className="h-4 bg-[var(--bg-muted)] rounded w-1/2 mx-auto" />
      <div className="h-4 bg-[var(--bg-muted)] rounded w-2/3 mx-auto" />
      <div className="mt-auto flex gap-2">
        <div className="h-9 bg-[var(--bg-muted)] rounded-xl flex-1" />
        <div className="h-9 bg-[var(--bg-muted)] rounded-xl w-16" />
      </div>
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
  <div
    className="group flex flex-col h-full rounded-2xl border border-[var(--bg-border)]
    bg-[var(--bg-elevated)] overflow-hidden shadow-sm
    hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700
    transition-all duration-300"
  >
    {/* Banner / Photo */}
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
      <div className="absolute top-3 right-3 bg-white dark:bg-[var(--bg-elevated)] rounded-xl px-2.5 py-1 shadow-md flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
        <span className="text-xs font-bold text-green-600 dark:text-green-400">
          Verified
        </span>
      </div>
    </div>

    {/* Body */}
    <div className="flex flex-col flex-1 p-5 text-center">
      {/* Title — Name */}
      <h3
        className="text-base font-bold text-[var(--text-primary)] leading-snug
        group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate"
      >
        {tutor.name}
      </h3>

      {/* Short description — email / subjects */}
      <p className="mt-1 text-xs text-[var(--text-muted)] truncate">
        {tutor.email}
      </p>

      {/* Meta — rating */}
      <div className="mt-2 flex flex-col items-center gap-1">
        <StarRating rating={tutor.averageRating} />
        <span className="text-xs text-[var(--text-muted)]">
          {tutor.averageRating
            ? `${parseFloat(tutor.averageRating).toFixed(1)} · ${tutor.reviewCount || 0} reviews`
            : "No reviews yet"}
        </span>
      </div>

      {/* Subject pills */}
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

      {/* Buttons — pushed to bottom */}
      <div className="mt-auto pt-4 flex gap-2">
        <Link
          to={`/tutors/${tutor._id}`}
          className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold
            bg-[var(--color-primary)] text-white
            hover:opacity-90 transition-opacity"
        >
          View Details
        </Link>
        <Link
          to="/tuitions"
          className="px-3 py-2.5 rounded-xl text-sm font-semibold
            bg-[var(--bg-muted)] text-[var(--text-secondary)]
            border border-[var(--bg-border)]
            hover:bg-[var(--bg-border-strong)] transition-colors"
        >
          Browse
        </Link>
      </div>
    </div>
  </div>
);

// ── Pagination ────────────────────────────────────────────────────────────────
const pgBtn =
  "px-3 py-2 rounded-xl border border-[var(--bg-border-strong)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] font-semibold hover:bg-[var(--bg-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition text-sm";

// ── Main ──────────────────────────────────────────────────────────────────────
const AllTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 8; // 4-col × 2 rows

  useEffect(() => {
    fetchTutors();
  }, [search, page]);

  const fetchTutors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tutors/all`,
        {
          params: { search, page, limit },
        },
      );
      setTutors(res.data.tutors || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 0);
    } catch {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/tutors`);
        setTutors(res.data || []);
        setTotal(res.data.length || 0);
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };
  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-surface)]">
      {/* Hero */}
      <div className="bg-[var(--color-primary)] py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-black text-white mb-3">
            Find Your Perfect Tutor
          </h1>
          <p className="text-white/80 text-lg mb-8">
            {total} expert tutors ready to help you succeed
          </p>
          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by name or subject..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/15 backdrop-blur border border-white/25 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition shadow-lg"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Results bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {loading ? "Loading..." : `${total} Tutors Available`}
          </h2>
          {search && (
            <button
              onClick={handleReset}
              className="text-sm text-red-500 font-semibold hover:underline"
            >
              Clear Search ✕
            </button>
          )}
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tutors.map((tutor) => (
                <TutorCard key={tutor._id} tutor={tutor} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <>
                <div className="mt-10 flex justify-center items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={pgBtn}
                  >
                    ← Prev
                  </button>
                  {[...Array(totalPages).keys()].map((num) => {
                    const n = num + 1;
                    if (n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                      return (
                        <button
                          key={n}
                          onClick={() => setPage(n)}
                          className={`w-10 h-10 rounded-xl font-bold transition ${page === n ? "bg-purple-600 text-white shadow-lg" : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--bg-border-strong)] hover:bg-[var(--bg-muted)]"}`}
                        >
                          {n}
                        </button>
                      );
                    if (Math.abs(n - page) === 2)
                      return (
                        <span key={n} className="text-[var(--text-muted)]">
                          ...
                        </span>
                      );
                    return null;
                  })}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={pgBtn}
                  >
                    Next →
                  </button>
                </div>
                <p className="text-center text-sm text-[var(--text-muted)] mt-3">
                  Page {page} of {totalPages} · {total} total tutors
                </p>
              </>
            )}
          </>
        )}

        {/* Empty */}
        {!loading && tutors.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <p className="text-[var(--text-secondary)] text-lg font-medium">
              No tutors found
            </p>
            {search && (
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTutors;
