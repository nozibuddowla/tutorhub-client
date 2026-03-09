import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import axios from "axios";

const SUBJECTS = [
  "All",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Bangla",
  "ICT",
];
const RATINGS = [
  { label: "Any Rating", min: 0 },
  { label: "4.5+ ⭐⭐⭐⭐⭐", min: 4.5 },
  { label: "4.0+ ⭐⭐⭐⭐", min: 4.0 },
  { label: "3.0+ ⭐⭐⭐", min: 3.0 },
];

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

// ── Stars ─────────────────────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <div className="flex items-center justify-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <svg
        key={n}
        className={`w-3.5 h-3.5 ${n <= Math.round(parseFloat(rating || 0)) ? "text-yellow-400" : "text-gray-200 dark:text-gray-700"}`}
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
    hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700
    transition-all duration-200"
  >
    <div className="relative h-44 bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
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
      <div className="absolute top-3 right-3 bg-white dark:bg-[var(--bg-elevated)] rounded-xl px-2.5 py-1 shadow flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
        <span className="text-xs font-bold text-green-600 dark:text-green-400">
          Verified
        </span>
      </div>
    </div>
    <div className="flex flex-col flex-1 p-5 text-center">
      <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
        {tutor.name}
      </h3>
      <p className="mt-1 text-xs text-[var(--text-muted)] truncate">
        {tutor.email}
      </p>
      <div className="mt-2 flex flex-col items-center gap-0.5">
        <Stars rating={tutor.averageRating} />
        <span className="text-xs text-[var(--text-muted)]">
          {tutor.averageRating
            ? `${parseFloat(tutor.averageRating).toFixed(1)} · ${tutor.reviewCount || 0} reviews`
            : "No reviews yet"}
        </span>
      </div>
      {tutor.subjects && (
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {(Array.isArray(tutor.subjects) ? tutor.subjects : [tutor.subjects])
            .slice(0, 3)
            .map((s, i) => (
              <span
                key={i}
                className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
              >
                {s}
              </span>
            ))}
        </div>
      )}
      <div className="mt-auto pt-4 flex gap-2">
        <Link
          to={`/tutors/${tutor._id}`}
          className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
        >
          View Profile
        </Link>
        <Link
          to="/tuitions"
          className="px-3 py-2.5 rounded-xl text-sm font-semibold bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--bg-border)] hover:bg-[var(--bg-border-strong)] transition-colors"
        >
          Hire
        </Link>
      </div>
    </div>
  </div>
);

// ── Pagination ────────────────────────────────────────────────────────────────
const Pagination = ({ page, totalPages, total, limit, onPage }) => {
  if (totalPages <= 1) return null;
  const pgBtn =
    "px-3 py-2 rounded-xl border border-[var(--bg-border-strong)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] font-semibold hover:bg-[var(--bg-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition text-sm";
  return (
    <div className="mt-10 space-y-3">
      <div className="flex justify-center items-center gap-2 flex-wrap">
        <button
          onClick={() => onPage((p) => Math.max(1, p - 1))}
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
                onClick={() => onPage(n)}
                className={`w-10 h-10 rounded-xl font-bold transition ${page === n ? "bg-[var(--color-primary)] text-white shadow" : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--bg-border-strong)] hover:bg-[var(--bg-muted)]"}`}
              >
                {n}
              </button>
            );
          if (Math.abs(n - page) === 2)
            return (
              <span key={n} className="text-[var(--text-muted)]">
                …
              </span>
            );
          return null;
        })}
        <button
          onClick={() => onPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={pgBtn}
        >
          Next →
        </button>
      </div>
      <p className="text-center text-sm text-[var(--text-muted)]">
        Showing{" "}
        <span className="font-bold text-[var(--text-primary)]">
          {(page - 1) * limit + 1}–{Math.min(page * limit, total)}
        </span>{" "}
        of <span className="font-bold text-[var(--text-primary)]">{total}</span>{" "}
        tutors
      </p>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const AllTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tutors/all`,
        {
          params: {
            search: search || (subject !== "All" ? subject : ""),
            subject: subject !== "All" ? subject : "",
            minRating: minRating > 0 ? minRating : "",
            sort,
            page,
            limit,
          },
        },
      );
      setTutors(res.data.tutors || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 0);
    } catch {
      setTutors([]);
    } finally {
      setLoading(false);
    }
  }, [search, subject, minRating, sort, page]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };
  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setSubject("All");
    setMinRating(0);
    setSort("");
    setPage(1);
  };

  const activeFilters = [
    search && `"${search}"`,
    subject !== "All" && subject,
    minRating > 0 && `${minRating}+ stars`,
    sort &&
      (sort === "ratingHigh"
        ? "Top Rated"
        : sort === "ratingLow"
          ? "Rating ↑"
          : "Newest"),
  ].filter(Boolean);

  const selectCls =
    "rounded-xl px-3 py-2.5 text-sm outline-none bg-[var(--bg-elevated)] border border-[var(--bg-border-strong)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500/30 transition";

  return (
    <div className="min-h-screen bg-[var(--bg-surface)]">
      {/* ── Hero ── */}
      <div className="bg-[var(--color-primary)] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black text-white mb-2">Find a Tutor</h1>
          <p className="text-white/75 mb-8 text-base">
            {total > 0
              ? `${total} expert tutors available`
              : "Browse our tutors"}
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by name or subject…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/15 border border-white/25 text-white placeholder:text-white/55 focus:outline-none focus:ring-2 focus:ring-white/35 transition text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition text-sm shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ── Filter Bar ── */}
        <div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] p-4 mb-4 shadow-sm">
          <div className="flex flex-wrap gap-3 items-end">
            {/* Subject */}
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Subject
              </label>
              <select
                className={selectCls}
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setPage(1);
                }}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s === "All" ? "All Subjects" : s}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div className="flex flex-col gap-1 min-w-[170px]">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Min Rating
              </label>
              <select
                className={selectCls}
                value={minRating}
                onChange={(e) => {
                  setMinRating(Number(e.target.value));
                  setPage(1);
                }}
              >
                {RATINGS.map((r) => (
                  <option key={r.min} value={r.min}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex flex-col gap-1 min-w-[170px]">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Sort By
              </label>
              <select
                className={selectCls}
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Newest First</option>
                <option value="ratingHigh">Top Rated</option>
                <option value="reviewsHigh">Most Reviewed</option>
              </select>
            </div>

            <div className="ml-auto flex items-center gap-3 pb-0.5">
              <span className="text-sm text-[var(--text-secondary)] whitespace-nowrap">
                <span className="font-bold text-[var(--color-primary)]">
                  {total}
                </span>{" "}
                results
              </span>
              {activeFilters.length > 0 && (
                <button
                  onClick={handleReset}
                  className="text-sm text-red-500 hover:text-red-700 font-semibold whitespace-nowrap transition"
                >
                  Reset ✕
                </button>
              )}
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[var(--bg-border)]">
              <span className="text-xs text-[var(--text-muted)] font-medium self-center">
                Active:
              </span>
              {activeFilters.map((f, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                >
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Subject Quick Pills ── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSubject(s);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                subject === s
                  ? "bg-[var(--color-primary)] text-white shadow-sm"
                  : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--bg-border-strong)] hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* ── Grid ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && tutors.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tutors.map((t) => (
                <TutorCard key={t._id} tutor={t} />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              onPage={setPage}
            />
          </>
        )}

        {!loading && tutors.length === 0 && (
          <div className="text-center py-24 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)]">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <p className="text-[var(--text-primary)] text-xl font-bold mb-1">
              No tutors found
            </p>
            <p className="text-[var(--text-muted)] text-sm mb-6">
              Try adjusting your filters
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTutors;
