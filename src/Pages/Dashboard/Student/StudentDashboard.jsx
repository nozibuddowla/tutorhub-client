import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import { AuthContext } from "../../../Provider/AuthProvider";
import Loading from "../../../components/Loading";
import { Card } from "../../../components/ui";

const statColors = {
  blue: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  yellow:
    "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
  green: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  purple:
    "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
};
const dotColors = { blue: "bg-blue-6000", green: "bg-green-500" };

const StatCard = ({ label, value, icon, colorKey, link }) => (
  <Link to={link || "#"}>
    <Card hover>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${statColors[colorKey] || statColors.blue}`}
        >
          Active
        </span>
      </div>
      <p className="text-3xl font-black text-[var(--text-primary)]">{value}</p>
      <p className="text-sm text-[var(--text-secondary)] mt-1">{label}</p>
    </Card>
  </Link>
);

const formatSessionTime = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }) +
  " · " +
  new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const quickActions = [
  {
    to: "/dashboard/student/post-tuition",
    icon: "✏️",
    label: "Post New Tuition",
    sub: "Find a tutor",
    rowHover: "hover:bg-blue-600 dark:hover:bg-blue-900/20",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconHover: "group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60",
  },
  {
    to: "/dashboard/student/applied-tutors",
    icon: "👨‍🏫",
    label: "Applied Tutors",
    sub: "Review applications",
    rowHover: "hover:bg-green-50 dark:hover:bg-green-900/20",
    iconBg: "bg-green-100 dark:bg-green-900/40",
    iconHover: "group-hover:bg-green-200 dark:group-hover:bg-green-900/60",
  },
  {
    to: "/dashboard/student/calendar",
    icon: "📅",
    label: "Class Calendar",
    sub: "Schedule & track sessions",
    rowHover: "hover:bg-purple-50 dark:hover:bg-purple-900/20",
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconHover: "group-hover:bg-purple-200 dark:group-hover:bg-purple-900/60",
  },
  {
    to: "/dashboard/student/payments",
    icon: "💳",
    label: "Payments",
    sub: "View payment history",
    rowHover: "hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/40",
    iconHover: "group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/60",
  },
];

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    tuitions: 0,
    pending: 0,
    approved: 0,
    tutors: 0,
  });
  const [upcomingSessions, setUpcoming] = useState([]);
  const [recentActivity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [tuitionsRes, appsRes, sessionsRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_API_URL}/student/tuitions/${user.email}`,
          { withCredentials: true },
        ),
        axios.get(
          `${import.meta.env.VITE_API_URL}/student/applications/${user.email}`,
          { withCredentials: true },
        ),
        axios.get(
          `${import.meta.env.VITE_API_URL}/sessions/upcoming/${user.email}`,
          { withCredentials: true },
        ),
      ]);
      const tuitions = tuitionsRes.data;
      const apps = appsRes.data;
      setStats({
        tuitions: tuitions.length,
        pending: tuitions.filter((t) => t.status === "pending").length,
        approved: apps.filter((a) => a.status === "approved").length,
        tutors: [
          ...new Set(
            apps
              .filter((a) => a.status === "approved")
              .map((a) => a.tutorEmail),
          ),
        ].length,
      });
      setUpcoming(sessionsRes.data || []);
      const activity = [
        ...tuitions.slice(0, 3).map((t) => ({
          text: `Posted tuition: ${t.subject}`,
          time: t.createdAt,
          dotKey: "blue",
        })),
        ...apps
          .filter((a) => a.status === "approved")
          .slice(0, 2)
          .map((a) => ({
            text: `Tutor hired: ${a.tutorName}`,
            time: a.approvedAt || a.createdAt,
            dotKey: "green",
          })),
      ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5);
      setActivity(activity);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (date) => {
    const days = Math.floor((Date.now() - new Date(date)) / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Banner — gradient via Tailwind */}
      <div className="rounded-2xl p-6 text-white bg-gradient-to-br from-blue-700 to-teal-600">
        <h2 className="text-2xl font-black">
          Hello, {user?.displayName?.split(" ")[0] || "Student"} 👋
        </h2>
        <p className="text-white/70 mt-1 text-sm">
          Track your tuitions, tutors, and learning progress here.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="My Tuitions"
          value={stats.tuitions}
          icon="📚"
          colorKey="blue"
          link="/dashboard/student/my-tuitions"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon="⏳"
          colorKey="yellow"
          link="/dashboard/student/my-tuitions"
        />
        <StatCard
          label="Active Tutors"
          value={stats.tutors}
          icon="👨‍🏫"
          colorKey="green"
          link="/dashboard/student/applied-tutors"
        />
        <StatCard
          label="Upcoming Sessions"
          value={upcomingSessions.length}
          icon="📅"
          colorKey="purple"
          link="/dashboard/student/calendar"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <Card>
          <Card.Header divided>
            <Card.Title>Recent Activity</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${dotColors[item.dotKey] || "bg-blue-6000"}`}
                    />
                    <span className="text-sm text-[var(--text-secondary)] flex-1">
                      {item.text}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] shrink-0">
                      {timeAgo(item.time)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-[var(--text-muted)] text-sm">
                    No activity yet
                  </p>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Upcoming Sessions */}
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--text-primary)]">
              Upcoming Classes
            </h3>
            <Link
              to="/dashboard/student/calendar"
              className="text-sm text-blue-500 dark:text-blue-400 font-semibold hover:underline"
            >
              Calendar →
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((s) => (
                <div
                  key={s._id}
                  className="flex items-start gap-3 p-3 bg-blue-600 dark:bg-blue-900/20 rounded-xl"
                >
                  <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0">
                    {new Date(s.startTime).getDate()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                      {s.subject}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {formatSessionTime(s.startTime)}
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-400 font-semibold">
                      {s.tutorName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-3xl mb-2">🗓️</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  No upcoming classes
                </p>
                <Link
                  to="/dashboard/student/calendar"
                  className="text-xs text-blue-500 dark:text-blue-400 font-bold hover:underline mt-1 inline-block"
                >
                  View calendar →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">
            Quick Actions
          </h3>
          <div className="space-y-1">
            {quickActions.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${item.rowHover}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${item.iconBg} ${item.iconHover}`}
                >
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {item.label}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {item.sub}
                  </p>
                </div>
                <span className="text-[var(--text-muted)]">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
