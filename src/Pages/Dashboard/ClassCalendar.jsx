import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../Provider/AuthProvider";
import Loading from "../../components/Loading";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const isSameDay = (a, b) => {
  const da = new Date(a),
    db = new Date(b);
  return (
    da.getDate() === db.getDate() &&
    da.getMonth() === db.getMonth() &&
    da.getFullYear() === db.getFullYear()
  );
};

const statusColor = {
  scheduled: { bg: "bg-purple-100", text: "text-purple-700", dot: "#6b46c1" },
  completed: { bg: "bg-green-100", text: "text-green-700", dot: "#38a169" },
  cancelled: { bg: "bg-red-100", text: "text-red-700", dot: "#e53e3e" },
};

const formatTime = (d) =>
  new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

// ─── Schedule Modal ───────────────────────────────────────────────────────────
const ScheduleModal = ({
  onClose,
  onSave,
  tuitions,
  currentUserEmail,
  role,
}) => {
  const [form, setForm] = useState({
    tuitionId: "",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
    location: "",
  });
  const [saving, setSaving] = useState(false);
  const selectedTuition = tuitions.find(
    (t) => t._id === form.tuitionId || t.tuitionId === form.tuitionId,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tuitionId || !form.date || !form.startTime || !form.endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const startTime = new Date(`${form.date}T${form.startTime}`);
    const endTime = new Date(`${form.date}T${form.endTime}`);

    if (endTime <= startTime) {
      toast.error("End time must be after start time");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        tuitionId: selectedTuition?.tuitionId || selectedTuition?._id,
        tuitionTitle: selectedTuition?.tuitionTitle || selectedTuition?.subject,
        studentEmail:
          role === "student" ? currentUserEmail : selectedTuition?.studentEmail,
        studentName: role === "student" ? "Me" : selectedTuition?.studentName,
        tutorEmail:
          role === "tutor" ? currentUserEmail : selectedTuition?.tutorEmail,
        tutorName: role === "tutor" ? "Me" : selectedTuition?.tutorName,
        subject: selectedTuition?.subject,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        notes: form.notes,
        location: form.location,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-black text-gray-900">
            📅 Schedule Class
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition text-gray-600 font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tuition select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tuition <span className="text-red-500">*</span>
            </label>
            <select
              value={form.tuitionId}
              onChange={(e) => setForm({ ...form, tuitionId: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white"
              required
            >
              <option value="">Select a tuition...</option>
              {tuitions.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.tuitionTitle || t.subject}{" "}
                  {t.studentName ? `— ${t.studentName}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              required
            />
          </div>

          {/* Start + End time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Location / Platform
            </label>
            <input
              type="text"
              placeholder="e.g. Home, Zoom, Google Meet..."
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Notes
            </label>
            <textarea
              rows={2}
              placeholder="Any notes for this session..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "📅"
              )}
              Schedule Class
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Session Detail Modal ─────────────────────────────────────────────────────
const SessionDetailModal = ({
  session,
  onClose,
  onStatusChange,
  onDelete,
  currentUserEmail,
}) => {
  const isTutor = session.tutorEmail === currentUserEmail;
  const sc = statusColor[session.status] || statusColor.scheduled;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${sc.bg} ${sc.text} capitalize`}
            >
              {session.status}
            </span>
            <h3 className="text-lg font-black text-gray-900 mt-2">
              {session.tuitionTitle || session.subject}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition text-gray-600 font-bold shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-sm mb-5">
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <span className="text-lg">📅</span>
            <div>
              <p className="font-semibold text-gray-800">
                {formatDate(session.startTime)}
              </p>
              <p className="text-gray-500">
                {formatTime(session.startTime)} — {formatTime(session.endTime)}
              </p>
            </div>
          </div>

          {session.location && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <span className="text-lg">📍</span>
              <p className="font-semibold text-gray-800">{session.location}</p>
            </div>
          )}

          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <span className="text-lg">{isTutor ? "🎓" : "👨‍🏫"}</span>
            <div>
              <p className="text-gray-500 text-xs">
                {isTutor ? "Student" : "Tutor"}
              </p>
              <p className="font-semibold text-gray-800">
                {isTutor ? session.studentName : session.tutorName}
              </p>
            </div>
          </div>

          {session.notes && (
            <div className="bg-purple-50 rounded-xl p-3">
              <p className="text-xs font-bold text-purple-600 mb-1">NOTES</p>
              <p className="text-gray-700">{session.notes}</p>
            </div>
          )}
        </div>

        {session.status === "scheduled" && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                onStatusChange(session._id, "completed");
                onClose();
              }}
              className="flex-1 py-2.5 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition text-sm"
            >
              ✓ Mark Complete
            </button>
            <button
              onClick={() => {
                onStatusChange(session._id, "cancelled");
                onClose();
              }}
              className="flex-1 py-2.5 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete(session._id);
                onClose();
              }}
              className="px-4 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition text-sm"
            >
              🗑
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Calendar Page ───────────────────────────────────────────────────────
const ClassCalendar = () => {
  const { user, role } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // month | list
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    if (!user?.email) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [sessionsRes, tuitionsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/sessions/${user.email}`, {
          withCredentials: true,
        }),
        axios.get(
          role === "tutor"
            ? `${import.meta.env.VITE_API_URL}/tutor/ongoing/${user.email}`
            : `${import.meta.env.VITE_API_URL}/student/applications/${user.email}`,
          { withCredentials: true },
        ),
      ]);
      setSessions(sessionsRes.data);
      // For students, only show approved applications as schedulable tuitions
      const t = tuitionsRes.data;
      setTuitions(
        role === "student" ? t.filter((a) => a.status === "approved") : t,
      );
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSchedule = async (data) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/sessions`, data, {
        withCredentials: true,
      });
      toast.success("Class scheduled successfully!");
      fetchData();
    } catch {
      toast.error("Failed to schedule class");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/sessions/${id}`,
        { status },
        {
          withCredentials: true,
        },
      );
      toast.success(`Session marked as ${status}`);
      fetchData();
    } catch {
      toast.error("Failed to update session");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/sessions/${id}`, {
        withCredentials: true,
      });
      toast.success("Session deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete session");
    }
  };

  // ── Calendar grid helpers ──
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const getSessionsForDay = (day) => {
    const date = new Date(year, month, day);
    return sessions.filter((s) => isSameDay(s.startTime, date));
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const upcoming = sessions
    .filter((s) => new Date(s.startTime) >= today && s.status !== "cancelled")
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 5);

  const stats = {
    total: sessions.length,
    scheduled: sessions.filter((s) => s.status === "scheduled").length,
    completed: sessions.filter((s) => s.status === "completed").length,
    cancelled: sessions.filter((s) => s.status === "cancelled").length,
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: "linear-gradient(135deg, #6b46c1, #11998e)" }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-black">Class Calendar 📅</h2>
            <p className="text-white/70 mt-1 text-sm">
              Schedule and track your tutoring sessions
            </p>
          </div>
          <button
            onClick={() => setShowSchedule(true)}
            className="px-5 py-2.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-100 transition flex items-center gap-2"
          >
            + Schedule Class
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Sessions",
            value: stats.total,
            color: "#6b46c1",
            icon: "📋",
          },
          {
            label: "Upcoming",
            value: stats.scheduled,
            color: "#2b6cb0",
            icon: "⏰",
          },
          {
            label: "Completed",
            value: stats.completed,
            color: "#38a169",
            icon: "✅",
          },
          {
            label: "Cancelled",
            value: stats.cancelled,
            color: "#e53e3e",
            icon: "❌",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{s.icon}</span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${s.color}20`, color: s.color }}
              >
                {s.label}
              </span>
            </div>
            <p className="text-3xl font-black text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={prevMonth}
                className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition font-bold text-gray-600"
              >
                ‹
              </button>
              <h3 className="text-lg font-black text-gray-900">
                {MONTHS[month]} {year}
              </h3>
              <button
                onClick={nextMonth}
                className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition font-bold text-gray-600"
              >
                ›
              </button>
            </div>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="text-xs font-bold text-purple-600 hover:underline"
            >
              Today
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-bold text-gray-400 py-3"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="h-24 border-b border-r border-gray-50"
              />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const daySessions = getSessionsForDay(day);
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();
              const isPast = new Date(year, month, day) < today && !isToday;

              return (
                <div
                  key={day}
                  className={`h-24 border-b border-r border-gray-50 p-1.5 overflow-hidden ${
                    isPast ? "bg-gray-50/50" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${
                      isToday
                        ? "bg-purple-600 text-white"
                        : isPast
                          ? "text-gray-400"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </div>

                  <div className="space-y-0.5">
                    {daySessions.slice(0, 2).map((s) => {
                      const sc = statusColor[s.status] || statusColor.scheduled;
                      return (
                        <button
                          key={s._id}
                          onClick={() => setSelectedSession(s)}
                          className={`w-full text-left text-xs px-1.5 py-0.5 rounded-md font-semibold truncate ${sc.bg} ${sc.text} hover:opacity-80 transition`}
                        >
                          {formatTime(s.startTime)} {s.subject}
                        </button>
                      );
                    })}
                    {daySessions.length > 2 && (
                      <p className="text-xs text-gray-400 px-1">
                        +{daySessions.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Sessions sidebar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-black text-gray-900 mb-4">Upcoming Sessions</h3>

          {upcoming.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-2">🗓️</div>
              <p className="text-gray-500 text-sm font-medium">
                No upcoming sessions
              </p>
              <button
                onClick={() => setShowSchedule(true)}
                className="mt-3 text-xs text-purple-600 font-bold hover:underline"
              >
                Schedule one now →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((s) => {
                const sc = statusColor[s.status] || statusColor.scheduled;
                const daysUntil = Math.ceil(
                  (new Date(s.startTime) - today) / 86400000,
                );
                return (
                  <button
                    key={s._id}
                    onClick={() => setSelectedSession(s)}
                    className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {s.tuitionTitle || s.subject}
                      </p>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${sc.bg} ${sc.text}`}
                      >
                        {daysUntil === 0
                          ? "Today"
                          : daysUntil === 1
                            ? "Tomorrow"
                            : `${daysUntil}d`}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDate(s.startTime)} · {formatTime(s.startTime)}
                    </p>
                    {s.location && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        📍 {s.location}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* All sessions list */}
          {sessions.length > 0 && (
            <div className="mt-6">
              <h4 className="font-bold text-gray-700 text-sm mb-3">
                All Sessions
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {[...sessions]
                  .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
                  .map((s) => {
                    const sc = statusColor[s.status] || statusColor.scheduled;
                    return (
                      <button
                        key={s._id}
                        onClick={() => setSelectedSession(s)}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition"
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: sc.dot }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate">
                            {s.subject}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(s.startTime)}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}
                        >
                          {s.status}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showSchedule && (
        <ScheduleModal
          onClose={() => setShowSchedule(false)}
          onSave={handleSchedule}
          tuitions={tuitions}
          currentUserEmail={user.email}
          role={role}
        />
      )}

      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          currentUserEmail={user.email}
        />
      )}
    </div>
  );
};

export default ClassCalendar;
