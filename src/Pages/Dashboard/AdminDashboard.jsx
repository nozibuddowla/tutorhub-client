import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import axios from "axios";
import { Link } from "react-router";
import Loading from "../../components/Loading";

// Static color map — no inline style
const statColors = {
  blue: {
    badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  },
  green: {
    badge:
      "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  },
  red: {
    badge: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300",
  },
  yellow: {
    badge:
      "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
  },
};

const StatCard = ({ label, value, icon, colorKey, change, link }) => {
  const c = statColors[colorKey] || statColors.blue;
  return (
    <Link to={link || "#"}>
      <div className="bg-[var(--bg-elevated)] rounded-2xl p-5 shadow-sm border border-[var(--bg-border)] hover:shadow-md transition-all cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">{icon}</span>
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${c.badge}`}
          >
            {change}
          </span>
        </div>
        <p className="text-3xl font-black text-[var(--text-primary)]">
          {value}
        </p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{label}</p>
      </div>
    </Link>
  );
};

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTuitions: 0,
    pendingTuitions: 0,
    totalEarnings: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, tuitionsRes, paymentsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/admin/tuitions`, {
          withCredentials: true,
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/admin/payments`, {
          withCredentials: true,
        }),
      ]);
      const users = usersRes.data;
      const tuitions = tuitionsRes.data;
      const payments = paymentsRes.data;
      setStats({
        totalUsers: users.length,
        totalTuitions: tuitions.length,
        pendingTuitions: tuitions.filter(
          (t) => !t.status || t.status === "pending",
        ).length,
        totalEarnings: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
      });
      setRecentUsers(
        users
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5),
      );
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Welcome Banner — gradient via Tailwind */}
      <div className="rounded-2xl p-6 text-white bg-gradient-to-br from-gray-900 to-red-600">
        <h2 className="text-2xl font-black">Admin Control Panel 🛡️</h2>
        <p className="text-white/70 mt-1 text-sm">
          Monitor platform activity, manage users, and oversee all operations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon="👥"
          colorKey="blue"
          change="View All"
          link="/dashboard/admin/users"
        />
        <StatCard
          label="Active Tuitions"
          value={stats.totalTuitions}
          icon="📚"
          colorKey="green"
          change="Manage"
          link="/dashboard/admin/tuitions"
        />
        <StatCard
          label="Pending Approval"
          value={stats.pendingTuitions}
          icon="⏳"
          colorKey="red"
          change="Review"
          link="/dashboard/admin/tuitions"
        />
        <StatCard
          label="Total Revenue"
          value={`৳${stats.totalEarnings.toLocaleString()}`}
          icon="💳"
          colorKey="yellow"
          change="View"
          link="/dashboard/admin/reports"
        />
      </div>

      {/* Two column */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Users */}
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[var(--text-primary)]">
              Recent Registrations
            </h3>
            <Link
              to="/dashboard/admin/users"
              className="text-sm text-purple-500 dark:text-purple-400 font-semibold hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.length > 0 ? (
              recentUsers.map((u) => (
                <div key={u._id} className="flex items-center gap-3">
                  <img
                    src={
                      u.photoURL ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`
                    }
                    alt={u.name}
                    className="w-8 h-8 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {u.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] capitalize">
                      {u.role}
                    </p>
                  </div>
                  <span className="text-xs text-[var(--text-muted)]">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[var(--text-secondary)] text-center py-4">
                No users found
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {[
              {
                to: "/dashboard/admin/users",
                icon: "👥",
                label: "Manage Users",
                sub: "View, edit, or delete users",
                row: "hover:bg-purple-50 dark:hover:bg-purple-900/20",
                bg: "bg-purple-100 dark:bg-purple-900/40",
                arrow: "group-hover:text-purple-500",
              },
              {
                to: "/dashboard/admin/tuitions",
                icon: "📚",
                label: "Manage Tuitions",
                sub: "Approve or reject posts",
                row: "hover:bg-blue-600 dark:hover:bg-blue-900/20",
                bg: "bg-blue-100 dark:bg-blue-900/40",
                arrow: "group-hover:text-blue-500",
              },
              {
                to: "/dashboard/admin/reports",
                icon: "📊",
                label: "View Reports",
                sub: "Analytics and earnings",
                row: "hover:bg-green-50 dark:hover:bg-green-900/20",
                bg: "bg-green-100 dark:bg-green-900/40",
                arrow: "group-hover:text-green-500",
              },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${item.row}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${item.bg}`}
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
                <span
                  className={`text-[var(--text-muted)] transition-colors ${item.arrow}`}
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
