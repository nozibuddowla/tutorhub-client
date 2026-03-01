import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../Provider/AuthProvider";
import Loading from "../components/Loading";
import { Link, useNavigate } from "react-router";

const TutorOngoingTuitions = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messaging, setMessaging] = useState(null);

  useEffect(() => {
    fetchOngoingTuitions();
  }, [user]);

  const fetchOngoingTuitions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tutor/ongoing/${user.email}`,
        { withCredentials: true },
      );
      setTuitions(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch ongoing tuitions");
      setLoading(false);
    }
  };

  const handleContactStudent = async (tuition) => {
    setMessaging(tuition._id);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/conversations`,
        {
          studentEmail: tuition.studentEmail,
          tutorEmail: user.email,
          tuitionId: tuition.tuitionId,
          tuitionTitle: tuition.tuitionTitle || tuition.subject,
          studentName: tuition.studentName || "Student",
          tutorName: user.displayName || "Tutor",
          studentPhoto: tuition.studentPhoto || "",
          tutorPhoto: user.photoURL || "",
        },
        { withCredentials: true },
      );

      navigate("/dashboard/tutor/messages", {
        state: { openConversation: res.data.conversation },
      });
    } catch (err) {
      toast.error("Failed to open conversation");
    } finally {
      setMessaging(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-purple-600 to-teal-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-black">Ongoing Tuitions 📚</h2>
        <p className="text-white/80 mt-1">
          All tuitions approved by students ({tuitions.length})
        </p>
      </div>

      {tuitions.length > 0 ? (
        <div className="grid gap-4">
          {tuitions.map((tuition) => (
            <div
              key={tuition._id}
              className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)] hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300text-xs font-bold px-3 py-1 rounded-full">
                    APPROVED
                  </span>
                  <h3 className="font-bold text-xl text-[var(--text-primary)] mt-3">
                    {tuition.tuitionTitle || tuition.subject}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-purple-600">
                    ৳{tuition.expectedSalary}
                  </p>
                  <p className="text-xs text-(--text-secondary)">/month</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-(--text-secondary)">Student</p>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {tuition.studentName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-(--text-secondary)">Subject</p>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {tuition.subject}
                  </p>
                </div>
                <div>
                  <p className="text-(--text-secondary)">Location</p>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {tuition.location || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-(--text-secondary)">Started</p>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {new Date(
                      tuition.approvedAt || tuition.createdAt,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--bg-border)] flex gap-3">
                <Link
                  to={`/tuitions/${tuition.tuitionId}`}
                  className="flex-1 px-2 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg font-semibold hover:bg-purple-200 transition-colors text-center"
                >
                  View Details
                </Link>
                {/* ── WIRED: Contact Student ── */}
                <button
                  onClick={() => handleContactStudent(tuition)}
                  disabled={messaging === tuition._id}
                  className="flex-1 px-2 py-2 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 rounded-lg font-semibold hover:bg-teal-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {messaging === tuition._id ? (
                    <span className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "💬"
                  )}
                  Contact Student
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">📖</div>
          <p className="text-(--text-secondary) text-lg font-medium">
            No ongoing tuitions yet
          </p>
          <p className="text-[var(--text-muted)] text-sm mt-2">
            Start applying for tuitions to see them here
          </p>
        </div>
      )}
    </div>
  );
};

export default TutorOngoingTuitions;
