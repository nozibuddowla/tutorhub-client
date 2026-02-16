import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Provider/AuthProvider";
import axios from "axios";
import { Link } from "react-router";
import Loading from "../../components/Loading";

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

const TutorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    ongoing: 0,
    totalEarnings: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [applicationsRes, ongoingRes, revenueRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_API_URL}/tutor/applications/${user.email}`,
          {
            withCredentials: true,
          },
        ),
        axios.get(
          `${import.meta.env.VITE_API_URL}/tutor/ongoing/${user.email}`,
          {
            withCredentials: true,
          },
        ),
        axios.get(
          `${import.meta.env.VITE_API_URL}/tutor/revenue/${user.email}`,
          {
            withCredentials: true,
          },
        ),
      ]);

      const applications = applicationsRes.data;
      const ongoing = ongoingRes.data;
      const revenue = revenueRes.data;

      setStats({
        totalApplications: applications.length,
        pending: applications.filter((a) => a.status === "pending").length,
        ongoing: ongoing.length,
        totalEarnings: revenue.reduce((sum, p) => sum + (p.amount || 0), 0),
      });

      setRecentApplications(applications.slice(0, 5));
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
        style={{ background: "linear-gradient(135deg, #6b46c1, #11998e)" }}
      >
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
          color="#6b46c1"
          link="/dashboard/tutor/applications"
        />
        <StatCard
          label="Pending Reviews"
          value={stats.pending}
          icon="⏳"
          color="#d69e2e"
          link="/dashboard/tutor/applications"
        />
        <StatCard
          label="Ongoing Tuitions"
          value={stats.ongoing}
          icon="📖"
          color="#38a169"
          link="/dashboard/tutor/ongoing"
        />
        <StatCard
          label="Total Earnings"
          value={`৳${stats.totalEarnings.toLocaleString()}`}
          icon="💰"
          color="#e53e3e"
          link="/dashboard/tutor/revenue"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Recent Applications</h3>
            <Link
              to="/dashboard/tutor/applications"
              className="text-sm text-purple-600 font-semibold hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div key={app._id} className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background:
                        app.status === "approved"
                          ? "#38a169"
                          : app.status === "rejected"
                            ? "#e53e3e"
                            : "#d69e2e",
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">
                      {app.tuitionTitle || app.subject}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {app.status}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No applications yet
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/dashboard/tutor/applications"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200">
                <span className="text-lg">📝</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  My Applications
                </p>
                <p className="text-xs text-gray-500">Track your applications</p>
              </div>
              <span className="text-gray-400 group-hover:text-purple-600">
                →
              </span>
            </Link>

            <Link
              to="/dashboard/tutor/ongoing"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200">
                <span className="text-lg">📚</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  Ongoing Tuitions
                </p>
                <p className="text-xs text-gray-500">View active tuitions</p>
              </div>
              <span className="text-gray-400 group-hover:text-green-600">
                →
              </span>
            </Link>

            <Link
              to="/dashboard/tutor/revenue"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200">
                <span className="text-lg">💰</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  Revenue History
                </p>
                <p className="text-xs text-gray-500">Track earnings</p>
              </div>
              <span className="text-gray-400 group-hover:text-blue-600">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
