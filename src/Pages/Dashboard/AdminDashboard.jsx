// ─── AdminDashboard.jsx ───────────────────────────────────────────────────────
import React, { useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";

const StatCard = ({ label, value, icon, color, change }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <span
        className="text-xs font-bold px-2 py-1 rounded-full"
        style={{ background: `${color}20`, color }}
      >
        {change}
      </span>
    </div>
    <p className="text-3xl font-black text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

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
          value="248"
          icon="👥"
          color="#2b6cb0"
          change="+12%"
        />
        <StatCard
          label="Active Tuitions"
          value="64"
          icon="📚"
          color="#38a169"
          change="+5%"
        />
        <StatCard
          label="Pending Approval"
          value="8"
          icon="⏳"
          color="#e53e3e"
          change="New"
        />
        <StatCard
          label="Monthly Revenue"
          value="৳28k"
          icon="💳"
          color="#d69e2e"
          change="+18%"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Recent Registrations</h3>
          <div className="space-y-3">
            {[
              {
                name: "Rahim Uddin",
                role: "Student",
                time: "10 min ago",
                color: "#2b6cb0",
              },
              {
                name: "Fatima Begum",
                role: "Tutor",
                time: "1 hour ago",
                color: "#6b46c1",
              },
              {
                name: "Karim Ahmed",
                role: "Student",
                time: "3 hours ago",
                color: "#2b6cb0",
              },
            ].map((u, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: u.color }}
                >
                  {u.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {u.name}
                  </p>
                  <p className="text-xs text-gray-400">{u.role}</p>
                </div>
                <span className="text-xs text-gray-400">{u.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Pending Actions</h3>
          <div className="space-y-3">
            {[
              { text: "Verify tutor: Nasreen Akter", urgent: true },
              { text: "Approve tuition: HSC Math in Dhaka", urgent: true },
              { text: "Resolve dispute: Payment issue", urgent: false },
              { text: "Review: New tutor application x3", urgent: false },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50"
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${item.urgent ? "bg-red-500" : "bg-yellow-400"}`}
                />
                <span className="text-sm text-gray-700 flex-1">
                  {item.text}
                </span>
                <button className="text-xs font-semibold text-blue-600 hover:underline">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;