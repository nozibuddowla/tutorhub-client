import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import axios from "axios";
import { Link } from "react-router";
import Loading from "../../components/Loading";

const StatCard = ({ label, value, icon, color, change, link }) => (
  <Link to={link || "#"}>
    <div className="bg-(--bg-elevated) rounded-2xl p-5 shadow-sm border border-(--bg-border) hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span
          className="text-xs font-bold px-2 py-1 rounded-full"
          style={{ background: `${color}20`, color }}
        >
          {change}
        </span>
      </div>
      <p className="text-3xl font-black text-(--text-primary)">{value}</p>
      <p className="text-sm text-(--text-secondary) mt-1">{label}</p>
    </div>
  </Link>
);

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
      // Fetch users
      const usersRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/users`,
        { withCredentials: true },
      );

      // Fetch tuitions
      const tuitionsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/tuitions`,
        { withCredentials: true },
      );

      // Fetch payments
      const paymentsRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/payments`,
        { withCredentials: true },
      );

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

      // Get 5 most recent users
      setRecentUsers(
        users
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5),
      );

      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: "linear-gradient(135deg, #1a1a2e, #e53e3e)" }}
      >
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
          color="#2b6cb0"
          change="View All"
          link="/dashboard/admin/users"
        />
        <StatCard
          label="Active Tuitions"
          value={stats.totalTuitions}
          icon="📚"
          color="#38a169"
          change="Manage"
          link="/dashboard/admin/tuitions"
        />
        <StatCard
          label="Pending Approval"
          value={stats.pendingTuitions}
          icon="⏳"
          color="#e53e3e"
          change="Review"
          link="/dashboard/admin/tuitions"
        />
        <StatCard
          label="Total Revenue"
          value={`৳${stats.totalEarnings.toLocaleString()}`}
          icon="💳"
          color="#d69e2e"
          change="View"
          link="/dashboard/admin/reports"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Users */}
        <div className="bg-(--bg-elevated) rounded-2xl p-6 shadow-sm border border-(--bg-border)">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Recent Registrations</h3>
            <Link
              to="/dashboard/admin/users"
              className="text-sm text-purple-600 font-semibold hover:underline"
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
                    <p className="text-sm font-semibold text-gray-800">
                      {u.name}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{u.role}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-(--text-secondary) text-center py-4">
                No users found
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-(--bg-elevated) rounded-2xl p-6 shadow-sm border border-(--bg-border)">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/dashboard/admin/users"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <span className="text-lg">👥</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  Manage Users
                </p>
                <p className="text-xs text-(--text-secondary)">
                  View, edit, or delete users
                </p>
              </div>
              <span className="text-gray-400 group-hover:text-purple-600">
                →
              </span>
            </Link>

            <Link
              to="/dashboard/admin/tuitions"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <span className="text-lg">📚</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  Manage Tuitions
                </p>
                <p className="text-xs text-(--text-secondary)">
                  Approve or reject posts
                </p>
              </div>
              <span className="text-gray-400 group-hover:text-blue-600">→</span>
            </Link>

            <Link
              to="/dashboard/admin/reports"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <span className="text-lg">📊</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  View Reports
                </p>
                <p className="text-xs text-(--text-secondary)">
                  Analytics and earnings
                </p>
              </div>
              <span className="text-gray-400 group-hover:text-green-600">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
