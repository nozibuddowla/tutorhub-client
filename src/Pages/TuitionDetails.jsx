import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const TuitionDetails = () => {
  const { id } = useParams();
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchTuitionDetails();
  }, [id]);

  const fetchTuitionDetails = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tuitions/${id}`,
      );
      setTuition(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch tuition details");
      setLoading(false);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplying(true);

    const form = e.target;
    const applicationData = {
      tutorName: user?.displayName,
      tutorEmail: user?.email,
      tutorPhoto: user?.photoURL,
      tuitionId: tuition._id,
      tuitionTitle: tuition.description,
      subject: tuition.subject,
      location: tuition.location,
      studentName: tuition.studentName,
      studentEmail: tuition.studentEmail,
      qualifications: form.qualifications.value,
      experience: form.experience.value,
      expectedSalary: parseInt(form.expectedSalary.value),
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/applications`,
        applicationData,
        { withCredentials: true },
      );

      toast.success("Application submitted successfully!");
      setShowApplyModal(false);

      // Redirect to My Applications
      setTimeout(() => {
        navigate("/dashboard/tutor/applications");
      }, 1500);
    } catch (err) {
      toast.error("Failed to submit application");
      console.error(err);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!tuition) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Tuition not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/tuitions")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold"
        >
          ← Back to All Tuitions
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-purple-600 to-blue-600 p-8 text-white">
            <div className="flex items-start justify-between">
              <div>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {tuition.subject}
                </span>
                <h1 className="text-3xl font-black mt-4 mb-2">
                  {tuition.description}
                </h1>
                <p className="text-white/80">Posted by {tuition.studentName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/70">Salary</p>
                <p className="text-4xl font-black">৳{tuition.salary}</p>
                <p className="text-sm text-white/70">/month</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">
                    Location
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {tuition.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Subject</p>
                  <p className="text-lg font-bold text-gray-900">
                    {tuition.subject}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Student</p>
                  <p className="text-lg font-bold text-gray-900">
                    {tuition.studentName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">
                    Posted On
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(tuition.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Apply Button (Only for tutors) */}
            {role === "tutor" && (
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full py-4 bg-linear-to-r from-purple-600 to-blue-600 text-white text-lg font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
              >
                Apply for this Tuition
              </button>
            )}

            {role === "student" && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-blue-700 font-semibold">
                  You posted this tuition
                </p>
              </div>
            )}

            {!role && (
              <button
                onClick={() => navigate("/login")}
                className="w-full py-4 bg-gray-800 text-white text-lg font-bold rounded-xl hover:bg-gray-900 transition-colors"
              >
                Login to Apply
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              Apply for Tuition
            </h2>

            <form onSubmit={handleApplySubmit} className="space-y-4">
              {/* Name (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed"
                />
              </div>

              {/* Qualifications */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Qualifications *
                </label>
                <input
                  type="text"
                  name="qualifications"
                  placeholder="e.g., BSc in Mathematics"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience *
                </label>
                <input
                  type="text"
                  name="experience"
                  placeholder="e.g., 5 years teaching experience"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              {/* Expected Salary */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected Salary (BDT/month) *
                </label>
                <input
                  type="number"
                  name="expectedSalary"
                  placeholder="e.g., 5000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={applying}
                  className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${
                    applying
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-linear-to-r from-purple-600 to-blue-600 hover:opacity-90"
                  }`}
                >
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  disabled={applying}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TuitionDetails;
