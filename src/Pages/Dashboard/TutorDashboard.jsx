import React, { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import axios from "axios";
import { Link } from "react-router";
import Loading from "../../components/Loading";
import { Card } from "../../components/ui";

// Static color map
const statColors = {
  purple:
    "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
  yellow:
    "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
  green: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  red: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
};
const dotColors = {
  approved: "bg-green-500",
  rejected: "bg-red-6000",
  pending: "bg-yellow-500",
};

const StatCard = ({ label, value, icon, colorKey, link }) => (
  <Link to={link || "#"}>
    <Card hover>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${statColors[colorKey] || statColors.purple}`}
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
    to: "/dashboard/tutor/applications",
    icon: "📝",
    label: "My Applications",
    sub: "Track your applications",
    rowHover: "hover:bg-purple-50 dark:hover:bg-purple-900/20",
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconHover: "group-hover:bg-purple-200 dark:group-hover:bg-purple-900/60",
  },
  {
    to: "/dashboard/tutor/ongoing",
    icon: "📚",
    label: "Ongoing Tuitions",
    sub: "View active tuitions",
    rowHover: "hover:bg-green-50 dark:hover:bg-green-900/20",
    iconBg: "bg-green-100 dark:bg-green-900/40",
    iconHover: "group-hover:bg-green-200 dark:group-hover:bg-green-900/60",
  },
  {
    to: "/dashboard/tutor/calendar",
    icon: "📅",
    label: "Class Calendar",
    sub: "Schedule & track sessions",
    rowHover: "hover:bg-blue-600 dark:hover:bg-blue-900/20",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconHover: "group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60",
  },
  {
    to: "/dashboard/tutor/revenue",
    icon: "💰",
    label: "Revenue History",
    sub: "Track earnings",
    rowHover: "hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/40",
    iconHover: "group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/60",
  },
];

const TutorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    ongoing: 0,
    totalEarnings: 0,
  });
  const [recentApplications, setRecent] = useState([]);
  const [upcomingSessions, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [appRes, ongoingRes, revenueRes, sessionsRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_API_URL}/tutor/applications/${user.email}`,
          { withCredentials: true },
        ),
        axios.get(
          `${import.meta.env.VITE_API_URL}/tutor/ongoing/${user.email}`,
          { withCredentials: true },
        ),
        axios.get(
          `${import.meta.env.VITE_API_URL}/tutor/revenue/${user.email}`,
          { withCredentials: true },
        ),
        axios.get(
          `${import.meta.env.VITE_API_URL}/sessions/upcoming/${user.email}`,
          { withCredentials: true },
        ),
      ]);
      const apps = appRes.data;
      setStats({
        totalApplications: apps.length,
        pending: apps.filter((a) => a.status === "pending").length,
        ongoing: ongoingRes.data.length,
        totalEarnings: revenueRes.data.reduce((s, p) => s + (p.amount || 0), 0),
      });
      setRecent(apps.slice(0, 5));
      setUpcoming(sessionsRes.data || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Welcome Banner — gradient via Tailwind */}
      <div className="rounded-2xl p-6 text-white bg-gradient-to-br from-purple-700 to-teal-600">
        <h2 className="text-2xl font-black">
          Hello, {user?.displayName?.split(" ")[0] || "Tutor"} 👋
        </h2>
        <p className="text-white/70 mt-1 text-sm">
          Manage your tuitions, students, and earnings all in one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Applications"
          value={stats.totalApplications}
          icon="📝"
          colorKey="purple"
          link="/dashboard/tutor/applications"
        />
        <StatCard
          label="Pending Reviews"
          value={stats.pending}
          icon="⏳"
          colorKey="yellow"
          link="/dashboard/tutor/applications"
        />
        <StatCard
          label="Ongoing Tuitions"
          value={stats.ongoing}
          icon="📖"
          colorKey="green"
          link="/dashboard/tutor/ongoing"
        />
        <StatCard
          label="Total Earnings"
          value={`৳${stats.totalEarnings.toLocaleString()}`}
          icon="💰"
          colorKey="red"
          link="/dashboard/tutor/revenue"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent Applications */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title>Recent Applications</Card.Title>
              <Link
                to="/dashboard/tutor/applications"
                className="text-sm text-purple-500 dark:text-purple-400 font-semibold hover:underline"
              >
                View All →
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {recentApplications.length > 0 ? (
                recentApplications.map((app) => (
                  <div key={app._id} className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${dotColors[app.status] || dotColors.pending}`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[var(--text-secondary)]">
                        {app.tuitionTitle || app.subject}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] capitalize">
                        {app.status}
                      </p>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--text-secondary)] text-center py-4">
                  No applications yet
                </p>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <Card.Header divided>
            <div className="flex items-center justify-between">
              <Card.Title>Upcoming Classes</Card.Title>
              <Link
                to="/dashboard/tutor/calendar"
                className="text-sm text-purple-500 dark:text-purple-400 font-semibold hover:underline"
              >
                Calendar →
              </Link>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((s) => (
                  <div
                    key={s._id}
                    className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl"
                  >
                    <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0">
                      {new Date(s.startTime).getDate()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                        {s.subject}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {formatSessionTime(s.startTime)}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                        {s.studentName}
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
                    to="/dashboard/tutor/calendar"
                    className="text-xs text-purple-600 font-bold hover:underline mt-1 inline-block"
                  >
                    Schedule one →
                  </Link>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Card.Header divided>
            <Card.Title>Quick Actions</Card.Title>
          </Card.Header>
          <Card.Body>
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
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default TutorDashboard;
