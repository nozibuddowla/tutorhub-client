import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import Loading from "../../../components/Loading";
import { AuthContext } from "../../../Provider/AuthProvider";

const StatCard = ({ label, value, icon, color, link }) => (
  <Link to={link || "#"}>
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span
          className="text-xs font-bold px-2 py-1 rounded-full"
          style={{ background: `${color}20`, color }}
        >
          Active
        </span>
      </div>
      <p className="text-3xl font-black text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
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

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    tuitions: 0,
    pending: 0,
    approved: 0,
    tutors: 0,
  });
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [tuitionsRes, applicationsRes, sessionsRes] = await Promise.all([
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
      const applications = applicationsRes.data;

      setStats({
        tuitions: tuitions.length,
        pending: tuitions.filter((t) => t.status === "pending").length,
        approved: applications.filter((a) => a.status === "approved").length,
        tutors: [
          ...new Set(
            applications
              .filter((a) => a.status === "approved")
              .map((a) => a.tutorEmail),
          ),
        ].length,
      });

      setUpcomingSessions(sessionsRes.data || []);

      // Build recent activity from tuitions + applications
      const activity = [
        ...tuitions.slice(0, 3).map((t) => ({
          text: `Posted tuition: ${t.subject}`,
          time: t.createdAt,
          dot: "#2b6cb0",
        })),
        ...applications
          .filter((a) => a.status === "approved")
          .slice(0, 2)
          .map((a) => ({
            text: `Tutor hired: ${a.tutorName}`,
            time: a.approvedAt || a.createdAt,
            dot: "#38a169",
          })),
      ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5);

      setRecentActivity(activity);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: "linear-gradient(135deg, #2b6cb0, #0d7377)" }}
      >
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
          color="#2b6cb0"
          link="/dashboard/student/my-tuitions"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon="⏳"
          color="#d69e2e"
          link="/dashboard/student/my-tuitions"
        />
        <StatCard
          label="Active Tutors"
          value={stats.tutors}
          icon="👨‍🏫"
          color="#38a169"
          link="/dashboard/student/applied-tutors"
        />
        <StatCard
          label="Upcoming Sessions"
          value={upcomingSessions.length}
          icon="📅"
          color="#6b46c1"
          link="/dashboard/student/calendar"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: item.dot }}
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {item.text}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {timeAgo(item.time)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No activity yet
              </p>
            )}
          </div>
        </div>

        {/* Upcoming Sessions — NEW */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Upcoming Classes</h3>
            <Link
              to="/dashboard/student/calendar"
              className="text-sm text-blue-600 font-semibold hover:underline"
            >
              Calendar →
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((s) => (
                <div
                  key={s._id}
                  className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl"
                >
                  <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0">
                    {new Date(s.startTime).getDate()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {s.subject}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatSessionTime(s.startTime)}
                    </p>
                    <p className="text-xs text-blue-600 font-semibold">
                      {s.tutorName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-3xl mb-2">🗓️</p>
                <p className="text-sm text-gray-500">No upcoming classes</p>
                <Link
                  to="/dashboard/student/calendar"
                  className="text-xs text-blue-600 font-bold hover:underline mt-1 inline-block"
                >
                  View calendar →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              {
                to: "/dashboard/student/post-tuition",
                icon: "✏️",
                label: "Post New Tuition",
                sub: "Find a tutor",
                color: "blue",
              },
              {
                to: "/dashboard/student/applied-tutors",
                icon: "👨‍🏫",
                label: "Applied Tutors",
                sub: "Review applications",
                color: "green",
              },
              {
                to: "/dashboard/student/calendar",
                icon: "📅",
                label: "Class Calendar",
                sub: "Schedule & track sessions",
                color: "purple",
              },
              {
                to: "/dashboard/student/payments",
                icon: "💳",
                label: "Payments",
                sub: "View payment history",
                color: "yellow",
              },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200">
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500">{item.sub}</p>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
