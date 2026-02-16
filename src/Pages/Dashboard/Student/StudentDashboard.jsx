import React, { useContext } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <span
        className={`text-xs font-bold px-2 py-1 rounded-full`}
        style={{ background: `${color}20`, color }}
      >
        Active
      </span>
    </div>
    <p className="text-3xl font-black text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
);

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);

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
        <StatCard label="Active Tuitions" value="3" icon="📚" color="#2b6cb0" />
        <StatCard
          label="Pending Requests"
          value="2"
          icon="⏳"
          color="#d69e2e"
        />
        <StatCard label="My Tutors" value="4" icon="👨‍🏫" color="#38a169" />
        <StatCard
          label="Upcoming Sessions"
          value="5"
          icon="📅"
          color="#e53e3e"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            {
              text: "Applied for Math tuition",
              time: "2 hours ago",
              dot: "#2b6cb0",
            },
            {
              text: "Session completed with Mr. Karim",
              time: "Yesterday",
              dot: "#38a169",
            },
            {
              text: "Payment of ৳500 processed",
              time: "2 days ago",
              dot: "#d69e2e",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: item.dot }}
              />
              <span className="text-sm text-gray-700 flex-1">{item.text}</span>
              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
