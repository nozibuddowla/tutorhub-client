import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import TutorReviews from "../components/TutorReviews";
import { Button, Input, Modal } from "../components/ui";

// ── Subject config ────────────────────────────────────────────────────────────
const subjectConfig = {
  math: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-300",
    slides: ["📐", "📊", "📈", "🔢"],
  },
  english: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    text: "text-green-700 dark:text-green-300",
    slides: ["📖", "✍️", "📝", "🗣️"],
  },
  science: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-700 dark:text-purple-300",
    slides: ["🔬", "🧪", "⚗️", "🧫"],
  },
  physics: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-200 dark:border-indigo-800",
    text: "text-indigo-700 dark:text-indigo-300",
    slides: ["⚛️", "🌊", "💡", "🔭"],
  },
  chemistry: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
    text: "text-orange-700 dark:text-orange-300",
    slides: ["🧪", "⚗️", "🧬", "🔥"],
  },
  biology: {
    bg: "bg-teal-50 dark:bg-teal-900/20",
    border: "border-teal-200 dark:border-teal-800",
    text: "text-teal-700 dark:text-teal-300",
    slides: ["🧬", "🌿", "🦠", "🫀"],
  },
  ict: {
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    border: "border-cyan-200 dark:border-cyan-800",
    text: "text-cyan-700 dark:text-cyan-300",
    slides: ["💻", "🖥️", "📱", "⌨️"],
  },
  bangla: {
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    text: "text-red-700 dark:text-red-300",
    slides: ["🇧🇩", "📜", "✒️", "📚"],
  },
  default: {
    bg: "bg-gray-50 dark:bg-gray-800/40",
    border: "border-gray-200 dark:border-gray-700",
    text: "text-gray-700 dark:text-gray-300",
    slides: ["📚", "📓", "🎓", "✏️"],
  },
};
const getConfig = (subject = "") =>
  subjectConfig[subject.toLowerCase().split(" ")[0]] || subjectConfig.default;

// ── Image Gallery ─────────────────────────────────────────────────────────────
const ImageGallery = ({ subject }) => {
  const [active, setActive] = useState(0);
  const cfg = getConfig(subject);
  const labels = ["Overview", "Study", "Practice", "Resources"];

  const prev = () =>
    setActive((a) => (a - 1 + cfg.slides.length) % cfg.slides.length);
  const next = () => setActive((a) => (a + 1) % cfg.slides.length);

  return (
    <div>
      {/* Main slide */}
      <div
        className={`relative rounded-2xl border ${cfg.border} ${cfg.bg} h-60 flex items-center justify-center mb-3 overflow-hidden`}
      >
        <span
          key={active}
          className="text-8xl select-none transition-all duration-300"
        >
          {cfg.slides[active]}
        </span>

        {/* Arrows */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/80 dark:bg-[var(--bg-elevated)]/80 shadow flex items-center justify-center text-[var(--text-secondary)] hover:bg-white dark:hover:bg-[var(--bg-elevated)] transition font-bold text-lg"
        >
          ‹
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/80 dark:bg-[var(--bg-elevated)]/80 shadow flex items-center justify-center text-[var(--text-secondary)] hover:bg-white dark:hover:bg-[var(--bg-elevated)] transition font-bold text-lg"
        >
          ›
        </button>

        {/* Label */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
          {labels[active]}
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-3 right-3 flex gap-1">
          {cfg.slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === active ? "bg-white w-4" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail row */}
      <div className="grid grid-cols-4 gap-2">
        {cfg.slides.map((emoji, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-xl h-16 flex flex-col items-center justify-center gap-0.5 border-2 transition-all ${
              active === i
                ? `${cfg.border} ${cfg.bg} shadow-md scale-105`
                : "border-[var(--bg-border)] bg-[var(--bg-surface)] hover:border-[var(--bg-border-strong)]"
            }`}
          >
            <span className="text-2xl">{emoji}</span>
            <span className="text-xs text-[var(--text-muted)]">
              {labels[i]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ── Related Tuitions ──────────────────────────────────────────────────────────
const RelatedTuitions = ({ currentId, subject }) => {
  const [items, setItems] = useState([]);
  const cfg = getConfig(subject);

  useEffect(() => {
    if (!subject) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/tuitions/all`, {
        params: { subject, limit: 4 },
      })
      .then((r) => {
        setItems(
          (r.data.tuitions || [])
            .filter((t) => t._id !== currentId)
            .slice(0, 3),
        );
      })
      .catch(() => {});
  }, [subject, currentId]);

  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="text-base font-bold text-[var(--text-primary)] mb-3">
        Similar {subject} Tuitions
      </h3>
      <div className="space-y-2">
        {items.map((t) => (
          <Link
            key={t._id}
            to={`/tuitions/${t._id}`}
            className="flex items-center gap-3 p-3 bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-xl hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-sm transition-all group"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${cfg.bg}`}
            >
              {cfg.slides[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[var(--text-primary)] truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {t.description || `${t.subject} Tuition`}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                📍 {t.location}
              </p>
            </div>
            <span className="text-sm font-black text-[var(--text-primary)] shrink-0">
              ৳{Number(t.salary).toLocaleString()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const TuitionDetails = () => {
  const { id } = useParams();
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApply] = useState(false);
  const [applying, setApplying] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchTuition();
  }, [id]);

  const fetchTuition = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tuitions/${id}`,
      );
      setTuition(res.data);
    } catch {
      toast.error("Failed to fetch tuition details");
    } finally {
      setLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplying(true);
    const form = e.target;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/applications`,
        {
          tutorName: user?.displayName,
          tutorEmail: user?.email,
          tutorPhoto: user?.photoURL,
          tuitionId: tuition._id,
          tuitionTitle: tuition.description,
          subject: tuition.subject,
          location: tuition.location,
          studentName: tuition.studentName,
          studentEmail: tuition.studentEmail,
          qualifications: form.qualifications.value,
          experience: form.experience.value,
          expectedSalary: parseInt(form.expectedSalary.value),
        },
        { withCredentials: true },
      );
      toast.success("Application submitted successfully!");
      setShowApply(false);
      setTimeout(() => navigate("/dashboard/tutor/applications"), 1500);
    } catch {
      toast.error("Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Loading />;

  if (!tuition)
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-[var(--text-secondary)] text-lg font-semibold">
            Tuition not found
          </p>
          <Link
            to="/tuitions"
            className="mt-3 inline-block text-purple-600 font-semibold hover:underline"
          >
            ← Back to Tuitions
          </Link>
        </div>
      </div>
    );

  const cfg = getConfig(tuition.subject);
  const tabs = ["overview", "specs", "reviews"];

  return (
    <div className="min-h-screen bg-[var(--bg-surface)]">
      {/* ── Hero Banner ── */}
      <div className={`${cfg.bg} border-b ${cfg.border} py-10 px-4`}>
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/tuitions")}
            className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
          >
            ← Back to All Tuitions
          </button>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span
                className={`inline-block text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider border ${cfg.bg} ${cfg.text} ${cfg.border} mb-3`}
              >
                {cfg.slides[0]} {tuition.subject}
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] leading-tight max-w-xl">
                {tuition.description ||
                  `${tuition.subject} Tuition in ${tuition.location}`}
              </h1>
              <p className="mt-2 text-[var(--text-secondary)] text-sm">
                Posted by{" "}
                <span className="font-semibold">{tuition.studentName}</span>
              </p>
            </div>

            {/* Salary badge */}
            <div
              className={`shrink-0 rounded-2xl border ${cfg.border} ${cfg.bg} px-6 py-4 text-center`}
            >
              <p className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider mb-1">
                Monthly Salary
              </p>
              <p className="text-4xl font-black text-[var(--text-primary)]">
                ৳{Number(tuition.salary).toLocaleString()}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                per month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT — gallery + tabs */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Media Gallery */}
            <div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] p-6">
              <h2 className="text-base font-bold text-[var(--text-primary)] mb-4">
                📸 Media Gallery
              </h2>
              <ImageGallery subject={tuition.subject} />
            </div>

            {/* 2–4. Tabbed content */}
            <div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] overflow-hidden">
              {/* Tab nav */}
              <div className="flex border-b border-[var(--bg-border)]">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3.5 text-sm font-bold capitalize transition-colors ${
                      activeTab === tab
                        ? "border-b-2 border-purple-600 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
                    }`}
                  >
                    {tab === "overview"
                      ? "📋 Overview"
                      : tab === "specs"
                        ? "📌 Key Info"
                        : "⭐ Reviews"}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* ── Overview tab ── */}
                {activeTab === "overview" && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                        About this Tuition
                      </h3>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        {tuition.description
                          ? `${tuition.description}. This tuition is located in ${tuition.location}. The student is seeking a qualified and dedicated tutor who can provide quality education.`
                          : `A tuition opportunity in ${tuition.location} for ${tuition.subject}. The student is looking for an experienced tutor. Monthly salary offered is ৳${tuition.salary}. Apply now to get started.`}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        {
                          icon: "📍",
                          label: "Location",
                          value: tuition.location,
                          bg: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
                        },
                        {
                          icon: "📚",
                          label: "Subject",
                          value: tuition.subject,
                          bg: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
                        },
                        {
                          icon: "👤",
                          label: "Student",
                          value: tuition.studentName,
                          bg: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
                        },
                        {
                          icon: "📅",
                          label: "Posted On",
                          value: new Date(tuition.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" },
                          ),
                          bg: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-start gap-3 p-3 bg-[var(--bg-surface)] rounded-xl border border-[var(--bg-border)]"
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
                  </div>
                )}

                {/* ── Key Info / Specs tab ── */}
                {activeTab === "specs" && (
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
                      Key Specifications
                    </h3>
                    <div className="divide-y divide-[var(--bg-border)]">
                      {[
                        { label: "Subject", value: tuition.subject },
                        { label: "Location", value: tuition.location },
                        {
                          label: "Monthly Salary",
                          value: `৳${Number(tuition.salary).toLocaleString()}`,
                        },
                        { label: "Student Name", value: tuition.studentName },
                        {
                          label: "Class / Level",
                          value: tuition.class || "Not specified",
                        },
                        {
                          label: "Days Per Week",
                          value: tuition.daysPerWeek
                            ? `${tuition.daysPerWeek} days`
                            : "Flexible",
                        },
                        {
                          label: "Duration",
                          value: tuition.duration || "To be discussed",
                        },
                        {
                          label: "Tuition Type",
                          value: tuition.type || "Home Tuition",
                        },
                        {
                          label: "Status",
                          value: tuition.status || "Active",
                          badge:
                            tuition.status === "approved"
                              ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                              : tuition.status === "pending"
                                ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
                        },
                        {
                          label: "Posted On",
                          value: new Date(tuition.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          ),
                        },
                      ].map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between py-3 gap-4"
                        >
                          <span className="text-sm text-[var(--text-secondary)] font-medium">
                            {row.label}
                          </span>
                          {row.badge ? (
                            <span
                              className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${row.badge}`}
                            >
                              {row.value}
                            </span>
                          ) : (
                            <span className="text-sm font-bold text-[var(--text-primary)] text-right">
                              {row.value}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Reviews tab ── */}
                {activeTab === "reviews" && (
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                      Reviews are based on the tutor assigned to this tuition.
                    </p>
                    {tuition.tutorEmail ? (
                      <TutorReviews tutorEmail={tuition.tutorEmail} />
                    ) : (
                      <div className="text-center py-10">
                        <div className="text-4xl mb-3">⏳</div>
                        <p className="text-[var(--text-secondary)] font-semibold">
                          No tutor hired yet
                        </p>
                        <p className="text-[var(--text-muted)] text-sm mt-1">
                          Reviews will appear once a tutor is selected.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — sticky action card + related */}
          <div className="space-y-4">
            {/* Action card */}
            <div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] p-5 sticky top-24">
              <div className="text-center mb-5">
                <p className="text-3xl font-black text-[var(--text-primary)]">
                  ৳{Number(tuition.salary).toLocaleString()}
                </p>
                <p className="text-xs text-[var(--text-muted)]">per month</p>
              </div>

              {role === "tutor" && (
                <button
                  onClick={() => setShowApply(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-sm"
                >
                  Apply for this Tuition
                </button>
              )}
              {role === "student" && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl p-3 text-center text-sm font-semibold">
                  📋 You posted this tuition
                </div>
              )}
              {!role && (
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-opacity text-sm"
                >
                  Login to Apply
                </button>
              )}

              <div className="mt-4 pt-4 border-t border-[var(--bg-border)] space-y-2">
                {[
                  { icon: "📍", value: tuition.location },
                  { icon: "📚", value: tuition.subject },
                  { icon: "👤", value: tuition.studentName },
                ].map((item) => (
                  <div
                    key={item.value}
                    className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Related tuitions */}
            <div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] p-5">
              <RelatedTuitions
                currentId={String(tuition._id)}
                subject={tuition.subject}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <Modal
          open={showApplyModal}
          onClose={() => !applying && setShowApply(false)}
          title="Apply for Tuition"
          footer={
            <>
              <Button variant="ghost" onClick={() => setShowApply(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                loading={applying}
                onClick={() =>
                  document.getElementById("apply-form").requestSubmit()
                }
              >
                Submit Application
              </Button>
            </>
          }
        >
          <form
            id="apply-form"
            onSubmit={handleApplySubmit}
            className="space-y-4"
          >
            <Input
              label="Name"
              value={user?.displayName || ""}
              readOnly
              className="cursor-not-allowed opacity-70"
            />
            <Input
              label="Email"
              type="email"
              value={user?.email || ""}
              readOnly
              className="cursor-not-allowed opacity-70"
            />
            <Input
              label="Qualifications *"
              name="qualifications"
              placeholder="e.g., BSc in Mathematics"
              required
            />
            <Input
              label="Experience *"
              name="experience"
              placeholder="e.g., 3 years teaching"
              required
            />
            <Input
              label="Expected Salary (BDT/month) *"
              name="expectedSalary"
              type="number"
              icon="৳"
              hint="Monthly salary in BDT"
              placeholder="e.g., 5000"
              required
            />
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TuitionDetails;
