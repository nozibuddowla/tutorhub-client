import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import TutorReviews from "../components/TutorReviews";
import { Button, Input, Modal, Badge } from "../components/ui";

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
      <div className="min-h-screen  bg-[var(--bg-base)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-(--text-secondary) text-lg">Tuition not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] py-12">
      <div className="max-w-4xl mx-auto px-2">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/tuitions")}
          variant="ghost"
          size="sm"
          icon="←"
        >
          Back to All Tuitions
        </Button>

        {/* Main Card */}
        <div className="bg-[var(--bg-elevated)] rounded-2xl shadow-sm border border-[var(--bg-border)] overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-purple-600 to-blue-600 p-8 text-white">
            <div className="flex items-start justify-between">
              <div>
                <span className="bg-[var(--bg-elevated)]/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
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
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <p className="text-sm text-(--text-secondary) font-semibold">
                    Location
                  </p>
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    {tuition.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <p className="text-sm text-(--text-secondary) font-semibold">
                    Subject
                  </p>
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    {tuition.subject}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <p className="text-sm text-(--text-secondary) font-semibold">
                    Student
                  </p>
                  <p className="text-lg font-bold text-[var(--text-primary)]">
                    {tuition.studentName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl">📅</span>
                </div>
                <div>
                  <p className="text-sm text-(--text-secondary) font-semibold">
                    Posted On
                  </p>
                  <p className="text-lg font-bold text-[var(--text-primary)]">
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
              <Button
                onClick={() => setShowApplyModal(true)}
                variant="primary"
                size="lg"
                full
              >
                Apply for this Tuition
              </Button>
            )}

            {role === "student" && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl p-4 text-center">
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

          <TutorReviews />
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <Modal
            open={showApplyModal}
            onClose={() => !applying && setShowApplyModal(false)}
            title="Apply for Tuition"
            footer={
              <>
                <Button
                  variant="ghost"
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  loading={applying}
                  onClick={handleApplySubmit}
                >
                  Submit
                </Button>
              </>
            }
          >
            <form
              id="apply-form"
              onSubmit={handleApplySubmit}
              className="space-y-4"
            >
              {/* Name (Read-only) */}
              <Input
                label="Name"
                value={user?.displayName || ""}
                readOnly
                className="cursor-not-allowed opacity-70"
              />
              <Input
                label="Email"
                type="email"
                value={user?.email || ""}
                readOnly
                className="cursor-not-allowed opacity-70"
              />

              <Input
                label="Qualifications *"
                name="qualifications"
                placeholder="e.g., BSc in Mathematics"
                required
              />
              <Input
                label="Experience *"
                name="experience"
                placeholder="e.g., 5 years teaching experience"
                required
              />
              <Input
                label="Expected Salary (BDT/month) *"
                name="expectedSalary"
                type="number"
                icon="৳"
                hint="Monthly salary in BDT"
                placeholder="e.g., 5000"
                required
              />
            </form>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default TuitionDetails;
