import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import Loading from "../../../components/Loading";

const AppliedTutors = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messaging, setMessaging] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/student/applications/${user.email}`,
        { withCredentials: true },
      );
      setApplications(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch applications");
      console.error(err);
      setLoading(false);
    }
  };

  const handleAccept = (application) => {
    // Store application data in sessionStorage for payment page
    sessionStorage.setItem("pendingApplication", JSON.stringify(application));

    // Redirect to payment/checkout page
    navigate("/payment/checkout", {
      state: {
        application,
        amount: application.expectedSalary,
        type: "tutor_application",
      },
    });
  };

  const handleReject = async (applicationId) => {
    Swal.fire({
      title: "Reject Application?",
      text: "Are you sure you want to reject this tutor's application?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(
            `${import.meta.env.VITE_API_URL}/applications/${applicationId}/reject`,
            {},
            { withCredentials: true },
          );

          Swal.fire({
            icon: "success",
            title: "Rejected",
            text: "Application has been rejected.",
            timer: 2000,
            showConfirmButton: false,
          });

          fetchApplications();
        } catch (err) {
          toast.error("Failed to reject application");
          console.error(err);
        }
      }
    });
  };

  // Open or create a conversation with the tutor then navigate to messages
  const handleMessage = async (application) => {
    setMessaging(application._id);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/conversations`,
        {
          studentEmail: user.email,
          tutorEmail: application.tutorEmail,
          tuitionId: application.tuitionId,
          tuitionTitle: application.tuitionTitle || application.subject,
          studentName: user.displayName || "Student",
          tutorName: application.tutorName,
          studentPhoto: user.photoURL || "",
          tutorPhoto: application.tutorPhoto || "",
        },
        { withCredentials: true },
      );

      navigate("/dashboard/student/messages", {
        state: { openConversation: res.data.conversation },
      });
    } catch (err) {
      toast.error("Failed to open conversation");
    } finally {
      setMessaging(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
        <h2 className="text-2xl font-black text-[var(--text-primary)]">
          Applied Tutors
        </h2>
        <p className="text-(--text-secondary) mt-1">
          Review and manage tutor applications for your tuitions
        </p>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="bg-blue-50 px-4 py-2 rounded-xl">
            <p className="text-sm text-blue-600 font-semibold">
              Total: {applications.length}
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/30 px-4 py-2 rounded-xl">
            <p className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold">
              Pending:{" "}
              {applications.filter((a) => a.status === "pending").length}
            </p>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-xl">
            <p className="text-sm text-green-600 font-semibold">
              Approved:{" "}
              {applications.filter((a) => a.status === "approved").length}
            </p>
          </div>
        </div>
      </div>

      {/* Applications Grid */}
      {applications.length > 0 ? (
        <div className="grid gap-4">
          {applications.map((application) => (
            <div
              key={application._id}
              className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)] hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Tutor Profile */}
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={
                      application.tutorPhoto ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${application.tutorName}`
                    }
                    alt={application.tutorName}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-purple-100"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-xl text-[var(--text-primary)]">
                        {application.tutorName}
                      </h3>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                          application.status === "approved"
                            ? "bg-green-100 dark:bg-green-900/40 text-green-700"
                            : application.status === "rejected"
                              ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {application.tutorEmail}
                    </p>

                    <div className="bg-purple-50 px-3 py-2 rounded-lg inline-block mb-3">
                      <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                        Applied for:{" "}
                        {application.tuitionTitle || application.subject}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-(--text-secondary) font-medium">
                          Qualifications
                        </p>
                        <p className="text-[var(--text-primary)]">
                          {application.qualifications || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-(--text-secondary) font-medium">
                          Experience
                        </p>
                        <p className="text-[var(--text-primary)]">
                          {application.experience || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary & Actions */}
                <div className="flex flex-col items-end justify-between gap-4 lg:w-48">
                  <div className="text-right">
                    <p className="text-sm text-(--text-secondary) mb-1">
                      Expected Salary
                    </p>
                    <p className="text-3xl font-black text-purple-600">
                      ৳{application.expectedSalary}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">/month</p>
                  </div>

                  {application.status === "pending" && (
                    <div className="flex flex-col gap-2 w-full">
                      <button
                        onClick={() => handleAccept(application)}
                        className="w-full px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <span>✓</span> Accept & Pay
                      </button>
                      {/* ── Message button ── */}
                      <button
                        onClick={() => handleMessage(application)}
                        disabled={messaging === application._id}
                        className="w-full px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {messaging === application._id ? (
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span>💬</span>
                        )}
                        Message
                      </button>
                      <button
                        onClick={() => handleReject(application._id)}
                        className="w-full px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <span>✗</span> Reject
                      </button>
                    </div>
                  )}

                  {application.status === "approved" && (
                    <div className="flex flex-col gap-2 w-full">
                      <div className="w-full px-4 py-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300rounded-xl text-center font-semibold text-sm">
                        ✓ Hired
                      </div>
                      {/* Message button still visible after approval */}
                      <button
                        onClick={() => handleMessage(application)}
                        disabled={messaging === application._id}
                        className="w-full px-4 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-xl font-semibold text-sm hover:bg-purple-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {messaging === application._id ? (
                          <span className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          "💬"
                        )}
                        Message Tutor
                      </button>
                    </div>
                  )}

                  {application.status === "rejected" && (
                    <div className="w-full px-4 py-2 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-xl text-center font-semibold text-sm">
                      ✗ Declined
                    </div>
                  )}
                </div>
              </div>

              {/* Applied Date */}
              <div className="mt-4 pt-4 border-t border-[var(--bg-border)]">
                <p className="text-xs text-[var(--text-muted)]">
                  Applied on:{" "}
                  {application.createdAt
                    ? new Date(application.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">👨‍🏫</div>
          <p className="text-(--text-secondary) text-lg font-medium">
            No tutor applications yet
          </p>
          <p className="text-[var(--text-muted)] text-sm mt-2">
            Tutors will appear here when they apply for your tuitions
          </p>
        </div>
      )}
    </div>
  );
};

export default AppliedTutors;
