import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

// ── Subject colour map ────────────────────────────────────────────────────────
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
const getSubjectStyle = (subject = "") =>
  subjectColors[subject.toLowerCase().split(" ")[0]] || subjectColors.default;

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="flex flex-col rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] overflow-hidden animate-pulse">
    <div className="h-44 bg-[var(--bg-muted)]" />
    <div className="flex flex-col flex-1 p-5 gap-3">
      <div className="h-4 bg-[var(--bg-muted)] rounded w-1/3" />
      <div className="h-5 bg-[var(--bg-muted)] rounded w-3/4" />
      <div className="h-4 bg-[var(--bg-muted)] rounded w-1/2" />
      <div className="space-y-1.5 mt-1">
        <div className="h-3 bg-[var(--bg-muted)] rounded w-2/3" />
        <div className="h-3 bg-[var(--bg-muted)] rounded w-1/2" />
      </div>
      <div className="mt-auto pt-4 border-t border-[var(--bg-border)] flex justify-between items-center">
        <div className="h-6 bg-[var(--bg-muted)] rounded w-1/4" />
        <div className="h-9 bg-[var(--bg-muted)] rounded-xl w-1/3" />
      </div>
    </div>
  </div>
);

// ── Tuition Card ──────────────────────────────────────────────────────────────
const TuitionCard = ({ tuition }) => {
  const s = getSubjectStyle(tuition.subject);
  return (
    <Link
      to={`/tuitions/${tuition._id}`}
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
        <div className="absolute top-3 right-3 bg-white dark:bg-[var(--bg-elevated)] rounded-xl px-3 py-1 shadow-md">
          <span className="text-sm font-black text-[var(--text-primary)]">
            ৳{Number(tuition.salary).toLocaleString()}
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
          {tuition.subject}
        </span>

        {/* Title */}
        <h3
          className="mt-3 text-base font-bold text-[var(--text-primary)] line-clamp-2
          group-hover:text-purple-600 dark:group-hover:text-purple-400
          transition-colors leading-snug"
        >
          Need {tuition.subject} Tutor
        </h3>

        {/* Short description */}
        <p className="mt-1.5 text-sm text-[var(--text-secondary)] line-clamp-2">
          {tuition.description ||
            `Tuition post in ${tuition.location} for ${tuition.subject}.`}
        </p>

        {/* Meta */}
        <div className="mt-3 space-y-1 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            📍 <span>{tuition.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            👤 <span>{tuition.studentName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            📅
            <span>
              {new Date(tuition.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-[var(--bg-border)] flex items-center justify-between gap-2">
          <div>
            <p className="text-lg font-black text-[var(--text-primary)] leading-none">
              ৳{Number(tuition.salary).toLocaleString()}
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

const pgBtn =
  "px-3 py-2 rounded-xl border border-[var(--bg-border-strong)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] font-semibold hover:bg-[var(--bg-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition text-sm";

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
const selectCls =
  "rounded-xl px-3 py-2 text-sm outline-none bg-[var(--bg-elevated)] border border-[var(--bg-border-strong)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500/50";

// ── Main ──────────────────────────────────────────────────────────────────────
const AllTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTuitions, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8; // 4-col × 2 rows

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
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 0);
    } catch {
      toast.error("Failed to fetch tuitions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTuitions();
  };
  const handleReset = () => {
    setSearch("");
    setSubject("all");
    setLocation("");
    setSort("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-surface)]">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-700 to-blue-600 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-white">
          <h1 className="text-4xl font-black mb-2">Find Your Perfect Tutor</h1>
          <p className="text-white/80 mb-6">
            {totalTuitions} tuitions available — search, filter, and apply today
          </p>
          <form
            onSubmit={handleSearch}
            className="flex gap-2 max-w-2xl mx-auto"
          >
            <input
              type="text"
              placeholder="Search by subject or location..."
              className="w-full px-4 py-3 rounded-xl outline-none bg-white/15 backdrop-blur border border-white/25 text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/40"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition shrink-0"
            >
              🔍 Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-4 shadow-sm border border-[var(--bg-border)] mb-4 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-[var(--text-secondary)]">
              Subject:
            </label>
            <select
              className={selectCls}
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
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-[var(--text-secondary)]">
              Location:
            </label>
            <input
              type="text"
              placeholder="e.g. Dhaka"
              className={`${selectCls} w-32`}
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-[var(--text-secondary)]">
              Sort:
            </label>
            <select
              className={selectCls}
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
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-[var(--text-secondary)]">
              <span className="font-bold text-purple-600">
                {tuitions.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[var(--text-primary)]">
                {totalTuitions}
              </span>{" "}
              results
            </span>
            <button
              onClick={handleReset}
              className="text-sm text-red-500 hover:text-red-700 font-semibold underline"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Subject pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSubject(s);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                subject === s
                  ? "bg-purple-600 text-white shadow"
                  : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--bg-border-strong)] hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tuitions.map((t) => (
                <TuitionCard key={t._id} tuition={t} />
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
                  Page {page} of {totalPages} · {totalTuitions} total tuitions
                </p>
              </>
            )}
          </>
        )}

        {/* Empty */}
        {!loading && tuitions.length === 0 && (
          <div className="text-center py-20 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)]">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-[var(--text-secondary)] text-xl font-semibold mb-2">
              No tuitions found
            </p>
            <p className="text-[var(--text-muted)] text-sm mb-4">
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
      </div>
    </div>
  );
};

export default AllTuitions;
