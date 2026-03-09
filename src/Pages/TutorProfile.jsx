import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import axios from "axios";
import Loading from "../components/Loading";
import TutorReviews from "../components/TutorReviews";

// ── Stars ─────────────────────────────────────────────────────────────────────
const Stars = ({ rating, size = "md" }) => {
  const sz = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
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

// ── Profile Photo Display ─────────────────────────────────────────────────────
const ProfilePhoto = ({ tutor }) => (
  <div className="relative rounded-2xl overflow-hidden border border-[var(--bg-border)] bg-gradient-to-br from-purple-100 to-teal-100 dark:from-purple-900/30 dark:to-teal-900/30 h-52 flex items-center justify-center mb-4">
    <img
      src={
        tutor.photoURL ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${tutor.name}`
      }
      alt={tutor.name}
      onError={(e) => {
        e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${tutor.name}`;
      }}
      className="w-32 h-32 rounded-2xl object-cover ring-4 ring-white dark:ring-[var(--bg-elevated)] shadow-xl"
    />
    <div className="absolute top-3 right-3 bg-white dark:bg-[var(--bg-elevated)] rounded-xl px-2.5 py-1 shadow flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
      <span className="text-xs font-bold text-green-600 dark:text-green-400">
        Verified
      </span>
    </div>
  </div>
);

// ── Related Tutors ────────────────────────────────────────────────────────────
const RelatedTutors = ({ currentId, subjects }) => {
  const [items, setItems] = useState([]);
  const keyword = Array.isArray(subjects) ? subjects[0] : subjects;

  useEffect(() => {
    if (!keyword) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/tutors/all`, {
        params: { search: keyword, limit: 4 },
      })
      .then((r) => {
        setItems(
          (r.data.tutors || []).filter((t) => t._id !== currentId).slice(0, 3),
        );
      })
      .catch(() => {});
  }, [keyword, currentId]);

  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="text-base font-bold text-[var(--text-primary)] mb-3">
        Similar Tutors
      </h3>
      <div className="space-y-2">
        {items.map((t) => (
          <Link
            key={t._id}
            to={`/tutors/${t._id}`}
            className="flex items-center gap-3 p-3 bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-xl hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-sm transition-all group"
          >
            <img
              src={
                t.photoURL ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${t.name}`
              }
              alt={t.name}
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${t.name}`;
              }}
              className="w-10 h-10 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[var(--text-primary)] truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {t.name}
              </p>
              <Stars rating={t.averageRating} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const TutorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setTab] = useState("about");

  useEffect(() => {
    // Try direct fetch first (efficient — uses GET /tutors/:id)
    axios
      .get(`${import.meta.env.VITE_API_URL}/tutors/${id}`)
      .then((res) => {
        setTutor(res.data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to list search
        axios
          .get(`${import.meta.env.VITE_API_URL}/tutors`)
          .then((res) => {
            setTutor(res.data.find((t) => t._id === id) || null);
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      });
  }, [id]);

  if (loading) return <Loading />;

  if (!tutor)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-[var(--text-secondary)] text-xl font-semibold">
            Tutor not found
          </p>
          <Link
            to="/tutors"
            className="mt-3 inline-block text-purple-600 font-semibold hover:underline"
          >
            ← Back to Tutors
          </Link>
        </div>
      </div>
    );

  const tabs = ["about", "specs", "reviews"];

  return (
    <div className="min-h-screen bg-[var(--bg-surface)]">
      {/* ── Cover Banner ── */}
      <div className="h-44 bg-gradient-to-r from-purple-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 select-none">
          <span className="absolute top-4 left-10 text-6xl">🎓</span>
          <span className="absolute top-8 right-20 text-5xl">📚</span>
          <span className="absolute bottom-4 left-1/3 text-4xl">✏️</span>
          <span className="absolute top-6 left-1/2 text-5xl">🏆</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16 pt-0">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* ── LEFT column ── */}
          <div className="space-y-4 -mt-16 relative z-10">
            {/* Profile card */}
            <div className="bg-[var(--bg-elevated)] rounded-2xl shadow-lg border border-[var(--bg-border)] p-6">
              <ProfilePhoto tutor={tutor} />

              {/* Name + rating */}
              <div className="text-center mt-4">
                <h1 className="text-2xl font-black text-[var(--text-primary)]">
                  {tutor.name}
                </h1>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">
                  {tutor.email}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Stars rating={tutor.averageRating} size="lg" />
                  <span className="font-bold text-[var(--text-primary)]">
                    {tutor.averageRating
                      ? parseFloat(tutor.averageRating).toFixed(1)
                      : "0.0"}
                  </span>
                  <span className="text-[var(--text-muted)] text-sm">
                    ({tutor.reviewCount || 0})
                  </span>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-[var(--bg-border)]">
                <div className="text-center">
                  <p className="text-xl font-black text-purple-600">
                    {tutor.reviewCount || 0}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Reviews
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-teal-600">
                    {tutor.averageRating
                      ? parseFloat(tutor.averageRating).toFixed(1)
                      : "—"}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Rating
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-green-600">Active</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Status
                  </p>
                </div>
              </div>

              {/* CTA */}
              <Link
                to="/tuitions"
                className="mt-5 block w-full text-center py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-sm"
              >
                Hire This Tutor
              </Link>
            </div>

            {/* Subjects */}
            {tutor.subjects && (
              <div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] p-5">
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">
                  Subjects
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(tutor.subjects)
                    ? tutor.subjects
                    : [tutor.subjects]
                  ).map((s, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Related tutors */}
            <div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] p-5">
              <RelatedTutors currentId={tutor._id} subjects={tutor.subjects} />
            </div>
          </div>

          {/* ── RIGHT column — tabs ── */}
          <div className="lg:col-span-2 lg:pt-4">
            <div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] overflow-hidden">
              {/* Tab nav */}
              <div className="flex border-b border-[var(--bg-border)]">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTab(tab)}
                    className={`flex-1 py-3.5 text-sm font-bold capitalize transition-colors ${
                      activeTab === tab
                        ? "border-b-2 border-purple-600 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
                    }`}
                  >
                    {tab === "about"
                      ? "👤 About"
                      : tab === "specs"
                        ? "📌 Details"
                        : "⭐ Reviews"}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* ── About tab ── */}
                {activeTab === "about" && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                        About {tutor.name}
                      </h2>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        {tutor.bio ||
                          `${tutor.name} is a qualified and experienced tutor on TutorHub. They specialize in ${
                            Array.isArray(tutor.subjects)
                              ? tutor.subjects.join(", ")
                              : tutor.subjects || "various subjects"
                          } and are passionate about helping students reach their academic goals through personalised sessions.`}
                      </p>
                    </div>

                    {/* Info grid */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        {
                          icon: "🎓",
                          label: "Role",
                          value: "Tutor",
                          bg: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
                        },
                        {
                          icon: "⭐",
                          label: "Rating",
                          value: `${tutor.averageRating || "0.0"} / 5.0`,
                          bg: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300",
                        },
                        {
                          icon: "💬",
                          label: "Reviews",
                          value: `${tutor.reviewCount || 0} reviews`,
                          bg: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
                        },
                        {
                          icon: "✅",
                          label: "Status",
                          value: "Active & Verified",
                          bg: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-3 p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--bg-border)]"
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${item.bg}`}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                              {item.label}
                            </p>
                            <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Subjects */}
                    {tutor.subjects && (
                      <div>
                        <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                          Teaches
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(tutor.subjects)
                            ? tutor.subjects
                            : [tutor.subjects]
                          ).map((s, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 text-sm font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Specs / Details tab ── */}
                {activeTab === "specs" && (
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">
                      Tutor Details
                    </h2>
                    <div className="divide-y divide-[var(--bg-border)]">
                      {[
                        { label: "Full Name", value: tutor.name },
                        { label: "Email", value: tutor.email },
                        { label: "Role", value: "Tutor" },
                        {
                          label: "Subjects",
                          value: Array.isArray(tutor.subjects)
                            ? tutor.subjects.join(", ")
                            : tutor.subjects || "Not specified",
                        },
                        {
                          label: "Avg. Rating",
                          value: tutor.averageRating
                            ? `${parseFloat(tutor.averageRating).toFixed(1)} / 5.0`
                            : "No ratings yet",
                        },
                        {
                          label: "Total Reviews",
                          value: String(tutor.reviewCount || 0),
                        },
                        {
                          label: "Experience",
                          value: tutor.experience || "Not specified",
                        },
                        {
                          label: "Education",
                          value: tutor.education || "Not specified",
                        },
                        {
                          label: "Status",
                          value: "Active",
                          badge:
                            "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
                        },
                        {
                          label: "Joined",
                          value: tutor.createdAt
                            ? new Date(tutor.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )
                            : "N/A",
                        },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between py-3 gap-4"
                        >
                          <span className="text-sm text-[var(--text-secondary)] font-medium shrink-0">
                            {row.label}
                          </span>
                          {row.badge ? (
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-full ${row.badge}`}
                            >
                              {row.value}
                            </span>
                          ) : (
                            <span className="text-sm font-bold text-[var(--text-primary)] text-right truncate max-w-[60%]">
                              {row.value}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Reviews tab — renders TutorReviews ── */}
                {activeTab === "reviews" && (
                  <TutorReviews tutorEmail={tutor.email} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
