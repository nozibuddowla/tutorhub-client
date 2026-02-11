// ─── TutorDashboard.jsx ───────────────────────────────────────────────────────
import React, { useContext } from "react";
import { AuthContext } from "../../Provider/AuthProvider";

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
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
);

const TutorDashboard = () => {
  const { user } = useContext(AuthContext);

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
        <StatCard label="Active Tuitions" value="5" icon="📖" color="#6b46c1" />
        <StatCard label="Total Students" value="12" icon="🎓" color="#38a169" />
        <StatCard label="Pending Reviews" value="3" icon="⏳" color="#d69e2e" />
        <StatCard label="This Month" value="৳4,200" icon="💰" color="#e53e3e" />
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Recent Applications</h3>
        <div className="space-y-3">
          {[
            {
              text: "Applied for Physics tuition in Mirpur",
              time: "1 hour ago",
              status: "Pending",
              color: "#d69e2e",
            },
            {
              text: "Chemistry tuition approved by admin",
              time: "Yesterday",
              status: "Approved",
              color: "#38a169",
            },
            {
              text: "New student enrolled in Math class",
              time: "3 days ago",
              status: "Active",
              color: "#6b46c1",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: item.color }}
              />
              <span className="text-sm text-gray-700 flex-1">{item.text}</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${item.color}20`, color: item.color }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
