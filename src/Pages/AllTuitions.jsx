import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import axios from "axios";

// ── Subject config ────────────────────────────────────────────────────────────
const subjectColors = {
  mathematics: {
    bg: "bg-blue-600 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-300",
    icon: "📐",
  },
  physics: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    text: "text-indigo-700 dark:text-indigo-300",
    icon: "⚛️",
  },
  chemistry: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-700 dark:text-orange-300",
    icon: "🧪",
  },
  biology: {
    bg: "bg-teal-50 dark:bg-teal-900/20",
    text: "text-white dark:text-teal-300",
    icon: "🧬",
  },
  english: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-300",
    icon: "📖",
  },
  bangla: {
    bg: "bg-red-600 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-300",
    icon: "🇧🇩",
  },
  ict: {
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    text: "text-cyan-700 dark:text-cyan-300",
    icon: "💻",
  },
  history: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-300",
    icon: "📜",
  },
  geography: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-300",
    icon: "🌍",
  },
  default: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-700 dark:text-purple-300",
    icon: "📚",
  },
};
const getSubject = (s = "") =>
  subjectColors[s.toLowerCase().split(" ")[0]] || subjectColors.default;

const SUBJECTS = [
  "All",
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

const SALARY_RANGES = [
  { label: "Any Budget", min: "", max: "" },
  { label: "Under ৳3,000", min: "", max: "3000" },
  { label: "৳3,000 – ৳5,000", min: "3000", max: "5000" },
  { label: "৳5,000 – ৳8,000", min: "5000", max: "8000" },
  { label: "৳8,000+", min: "8000", max: "" },
];

// ── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="flex flex-col rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-elevated)] overflow-hidden animate-pulse">
    <div className="h-40 bg-[var(--bg-muted)]" />
    <div className="flex flex-col flex-1 p-5 gap-3">
      <div className="h-4 bg-[var(--bg-muted)] rounded w-1/3" />
      <div className="h-5 bg-[var(--bg-muted)] rounded w-3/4" />
      <div className="h-4 bg-[var(--bg-muted)] rounded w-1/2" />
      <div className="space-y-1.5 mt-1">
        <div className="h-3 bg-[var(--bg-muted)] rounded w-2/3" />
        <div className="h-3 bg-[var(--bg-muted)] rounded w-1/2" />
      </div>
      <div className="mt-auto pt-3 border-t border-[var(--bg-border)] flex justify-between">
        <div className="h-6 bg-[var(--bg-muted)] rounded w-1/4" />
        <div className="h-9 bg-[var(--bg-muted)] rounded-xl w-28" />
      </div>
    </div>
  </div>
);

// ── Tuition Card ──────────────────────────────────────────────────────────────
const TuitionCard = ({ tuition }) => {
  const s = getSubject(tuition.subject);
  return (
    <Link
      to={`/tuitions/${tuition._id}`}
      className="group flex flex-col h-full rounded-2xl border border-[var(--bg-border)]
        bg-[var(--bg-elevated)] overflow-hidden shadow-sm
        hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700
        transition-all duration-200"
    >
      <div
        className={`relative h-40 flex items-center justify-center shrink-0 ${s.bg}`}
      >
        <span className="text-5xl select-none">{s.icon}</span>
        <div className="absolute top-3 right-3 bg-white dark:bg-[var(--bg-elevated)] rounded-xl px-3 py-1 shadow">
          <span className="text-sm font-black text-[var(--text-primary)]">
            ৳{Number(tuition.salary).toLocaleString()}
          </span>
          <span className="text-xs text-[var(--text-muted)]">/mo</span>
        </div>
        {tuition.status === "approved" && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
            Open
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <span
          className={`self-start text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${s.bg} ${s.text}`}
        >
          {tuition.subject}
        </span>
        <h3
          className="mt-2.5 text-base font-bold text-[var(--text-primary)] line-clamp-2
          group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug"
        >
          {tuition.description
            ? tuition.description.split(" ").slice(0, 7).join(" ") + "…"
            : `${tuition.subject} Tutor Needed`}
        </h3>
        <div className="mt-3 space-y-1.5 text-xs text-[var(--text-muted)]">
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
        <div className="mt-auto pt-4 border-t border-[var(--bg-border)] flex items-center justify-between gap-2">
          <div>
            <p className="text-lg font-black text-[var(--text-primary)] leading-none">
              ৳{Number(tuition.salary).toLocaleString()}
            </p>
            <p className="text-xs text-[var(--text-muted)]">per month</p>
          </div>
          <span
            className="shrink-0 px-4 py-2 rounded-xl text-sm font-bold
            bg-[var(--bg-muted)] text-[var(--text-secondary)] border border-[var(--bg-border)]
            group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)]
            transition-all duration-200"
          >
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

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
                className={`w-10 h-10 rounded-xl font-bold transition ${
                  page === n
                    ? "bg-[var(--color-primary)] text-white shadow"
                    : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--bg-border-strong)] hover:bg-[var(--bg-muted)]"
                }`}
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
        tuitions
      </p>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const AllTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // filters
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [location, setLocation] = useState("");
  const [salaryRange, setSalaryRange] = useState(0); // index into SALARY_RANGES
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;

  const fetch = useCallback(async () => {
    setLoading(true);
    const range = SALARY_RANGES[salaryRange];
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tuitions/all`,
        {
          params: {
            search,
            subject: subject === "All" ? "" : subject,
            location,
            salaryMin: range.min,
            salaryMax: range.max,
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
      setTuitions([]);
    } finally {
      setLoading(false);
    }
  }, [search, subject, location, salaryRange, sort, page]);

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
    setLocation("");
    setSalaryRange(0);
    setSort("");
    setPage(1);
  };

  const activeFilters = [
    search && `"${search}"`,
    subject !== "All" && subject,
    location && `📍 ${location}`,
    salaryRange > 0 && SALARY_RANGES[salaryRange].label,
    sort && (sort === "salaryLow" ? "Budget ↑" : "Budget ↓"),
  ].filter(Boolean);

  const selectCls =
    "rounded-xl px-3 py-2.5 text-sm outline-none bg-[var(--bg-elevated)] border border-[var(--bg-border-strong)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500/30 transition";

  return (
    <div className="min-h-screen bg-[var(--bg-surface)]">
      {/* ── Hero ── */}
      <div className="bg-[var(--color-primary)] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black text-white mb-2">
            Find a Tuition
          </h1>
          <p className="text-white/75 mb-8 text-base">
            {total > 0
              ? `${total} tuitions available`
              : "Browse all available tuitions"}
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by subject or location…"
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

            {/* Location */}
            <div className="flex flex-col gap-1 min-w-[130px]">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Dhaka"
                className={selectCls}
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Salary Range */}
            <div className="flex flex-col gap-1 min-w-[170px]">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Budget
              </label>
              <select
                className={selectCls}
                value={salaryRange}
                onChange={(e) => {
                  setSalaryRange(Number(e.target.value));
                  setPage(1);
                }}
              >
                {SALARY_RANGES.map((r, i) => (
                  <option key={i} value={i}>
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
                <option value="">Latest First</option>
                <option value="salaryLow">Budget: Low → High</option>
                <option value="salaryHigh">Budget: High → Low</option>
              </select>
            </div>

            {/* Results count + reset */}
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

          {/* Active filter chips */}
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

        {!loading && tuitions.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tuitions.map((t) => (
                <TuitionCard key={t._id} tuition={t} />
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

        {!loading && tuitions.length === 0 && (
          <div className="text-center py-24 bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)]">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-[var(--text-primary)] text-xl font-bold mb-1">
              No tuitions found
            </p>
            <p className="text-[var(--text-muted)] text-sm mb-6">
              Try adjusting your search or filters
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

export default AllTuitions;
