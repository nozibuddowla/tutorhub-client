import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const COLORS = [
  "#6b46c1",
  "#11998e",
  "#d97706",
  "#e53e3e",
  "#2b6cb0",
  "#38a169",
];

const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <svg
        key={n}
        className={`w-3.5 h-3.5 ${n <= rating ? "text-yellow-400" : "text-gray-200 dark:text-gray-700"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const FALLBACK = [
  {
    _id: "f1",
    rating: 5,
    comment:
      "Found an amazing Math tutor within 2 days. My son's grades improved drastically. TutorHub made everything so simple.",
    studentName: "Rahima Begum",
    tutorName: "Tutor Karim",
  },
  {
    _id: "f2",
    rating: 5,
    comment:
      "As a tutor, applying for tuitions is seamless. The dashboard shows everything I need. Highly recommended for educators!",
    studentName: "Arif Hossain",
    tutorName: "Student Nadia",
  },
  {
    _id: "f3",
    rating: 4,
    comment:
      "The payment system is secure and transparent. I always know exactly what I'm paying for. Great experience overall.",
    studentName: "Sumaiya Akter",
    tutorName: "Tutor Rahim",
  },
  {
    _id: "f4",
    rating: 5,
    comment:
      "My daughter struggled with English for years. After 3 months with her TutorHub tutor, she scored A+ in exams!",
    studentName: "Farid Ahmed",
    tutorName: "Tutor Sarah",
  },
  {
    _id: "f5",
    rating: 5,
    comment:
      "Best tutoring platform in Bangladesh. Verified profiles give me confidence. No more guessing who is qualified!",
    studentName: "Nasrin Sultana",
    tutorName: "Tutor Jamal",
  },
  {
    _id: "f6",
    rating: 4,
    comment:
      "Scheduling sessions through the calendar is genius. I never miss a class now. The whole family loves TutorHub.",
    studentName: "Md. Shakib",
    tutorName: "Tutor Priya",
  },
];

const TestimonialCard = ({ review, colorIndex }) => {
  const color = COLORS[colorIndex % COLORS.length];
  const initials = (review.studentName || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-72 shrink-0 bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-2xl p-5 flex flex-col gap-3 select-none">
      {/* Quote icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-lg font-black shrink-0"
        style={{ background: color }}
      >
        "
      </div>
      {/* Comment */}
      <p className="text-[var(--text-secondary)] text-xs leading-relaxed flex-1 italic">
        "{review.comment}"
      </p>
      {/* Stars */}
      <Stars rating={review.rating} />
      {/* Author */}
      <div className="flex items-center gap-2.5 pt-2 border-t border-[var(--bg-border)]">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0"
          style={{ background: color }}
        >
          {initials}
        </div>
        <div>
          <p className="text-xs font-bold text-[var(--text-primary)]">
            {review.studentName || "Anonymous"}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Reviewed {review.tutorName}
          </p>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const [reviews, setReviews] = useState(FALLBACK);
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const pausedRef = useRef(false);

  // Fetch reviews
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/reviews/latest?limit=6`,
        );
        const data = res.data || [];
        if (data.length >= 3) setReviews(data);
      } catch {
        /* keep fallback */
      }
    })();
  }, []);

  // Smooth auto-scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const tick = () => {
      if (!pausedRef.current) {
        el.scrollLeft += 0.6;
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [reviews]);

  const doubled = [...reviews, ...reviews];

  return (
    <section className="py-20 bg-[var(--bg-base)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-3">
              Student Reviews
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)]">
              What Our Community Says
            </h2>
            <p className="text-[var(--text-secondary)] mt-2 text-sm">
              Real reviews from real students — honest and unfiltered.
            </p>
          </div>
          {/* Rating badge */}
          <div className="flex items-center gap-4 bg-[var(--bg-elevated)] border border-[var(--bg-border)] px-5 py-3.5 rounded-2xl shadow-sm">
            <div>
              <p className="text-3xl font-black text-[var(--text-primary)] leading-none">
                4.8
              </p>
              <Stars rating={5} />
            </div>
            <div className="border-l border-[var(--bg-border)] pl-4">
              <p className="text-xs font-bold text-[var(--text-primary)]">
                Overall Rating
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Based on 500+ reviews
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling row */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto px-4"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          cursor: "grab",
        }}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
      >
        {doubled.map((r, i) => (
          <TestimonialCard key={`${r._id}-${i}`} review={r} colorIndex={i} />
        ))}
      </div>

      {/* Fade edges */}
      <div className="relative pointer-events-none -mt-[9.5rem] h-36">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[var(--bg-base)] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[var(--bg-base)] to-transparent" />
      </div>
    </section>
  );
};

export default TestimonialsSection;
