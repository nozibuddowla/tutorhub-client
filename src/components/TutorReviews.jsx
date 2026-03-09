import React, { useEffect, useState } from "react";
import axios from "axios";

// ── Star display ──────────────────────────────────────────────────────────────
const Stars = ({ rating, size = "sm" }) => {
  const sz = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`${sz} ${
            n <= Math.round(parseFloat(rating || 0))
              ? "text-yellow-400"
              : "text-gray-200 dark:text-gray-700"
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

// ── Rating distribution bar ───────────────────────────────────────────────────
const RatingBar = ({ label, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-4 text-right text-[var(--text-muted)] shrink-0">
        {label}
      </span>
      <svg
        className="w-3 h-3 text-yellow-400 shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <div className="flex-1 h-2 bg-[var(--bg-muted)] rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-5 text-xs text-[var(--text-muted)] text-right shrink-0">
        {count}
      </span>
    </div>
  );
};

// ── Main TutorReviews component ───────────────────────────────────────────────
const TutorReviews = ({ tutorEmail }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PER_PAGE = 4;

  useEffect(() => {
    if (!tutorEmail) {
      setLoading(false);
      return;
    }
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/reviews/${tutorEmail}`)
      .then((r) => setReviews(r.data || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [tutorEmail]);

  if (!tutorEmail) return null;

  const total = reviews.length;
  const avg =
    total > 0
      ? (
          reviews.reduce((s, r) => s + parseFloat(r.rating || 0), 0) / total
        ).toFixed(1)
      : "0.0";
  const dist = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: reviews.filter((r) => Math.round(parseFloat(r.rating)) === n).length,
  }));
  const paged = reviews.slice(0, page * PER_PAGE);
  const hasMore = paged.length < total;

  const avatarColors = [
    "bg-purple-600",
    "bg-teal-600",
    "bg-amber-500",
    "bg-blue-600",
    "bg-rose-500",
    "bg-indigo-600",
  ];

  return (
    <section className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] p-6 mt-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[var(--text-primary)]">
          Reviews & Ratings
          {total > 0 && (
            <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">
              ({total})
            </span>
          )}
        </h2>
        {total > 0 && (
          <div className="flex items-center gap-1.5">
            <Stars rating={avg} />
            <span className="text-sm font-bold text-[var(--text-primary)]">
              {avg}
            </span>
          </div>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-muted)] shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-[var(--bg-muted)] rounded w-1/3" />
                <div className="h-3 bg-[var(--bg-muted)] rounded w-3/4" />
                <div className="h-3 bg-[var(--bg-muted)] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && total === 0 && (
        <div className="text-center py-10">
          <div className="text-5xl mb-3">💬</div>
          <p className="text-[var(--text-secondary)] font-semibold">
            No reviews yet
          </p>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            Be the first to share your experience!
          </p>
        </div>
      )}

      {/* Summary + cards */}
      {!loading && total > 0 && (
        <>
          {/* Rating summary */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8 p-5 bg-[var(--bg-surface)] rounded-2xl border border-[var(--bg-border)]">
            {/* Big score */}
            <div className="flex flex-col items-center justify-center shrink-0 gap-1 min-w-[80px]">
              <p className="text-6xl font-black text-[var(--text-primary)] leading-none">
                {avg}
              </p>
              <Stars rating={avg} size="lg" />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {total} review{total !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Distribution bars */}
            <div className="flex-1 flex flex-col justify-center gap-2">
              {dist.map(({ n, count }) => (
                <RatingBar key={n} label={n} count={count} total={total} />
              ))}
            </div>
          </div>

          {/* Individual review cards */}
          <div className="space-y-4">
            {paged.map((review, i) => {
              const initials = (review.studentName || "?")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const color = avatarColors[i % avatarColors.length];
              return (
                <article
                  key={review._id || i}
                  className="flex gap-3 p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--bg-border)]"
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-white text-xs font-black ${color}`}
                  >
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="text-sm font-bold text-[var(--text-primary)]">
                          {review.studentName || "Anonymous"}
                        </p>
                        <Stars rating={review.rating} />
                      </div>
                      <span className="text-xs text-[var(--text-muted)] shrink-0">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : ""}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Load more */}
          {hasMore && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="mt-6 w-full py-3 rounded-xl border border-[var(--bg-border-strong)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition"
            >
              Show more reviews ({total - paged.length} remaining)
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default TutorReviews;
