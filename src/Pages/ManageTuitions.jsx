import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const ManageTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTuitions();
  }, []);

  const fetchTuitions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/tuitions`,
        { withCredentials: true },
      );
      setTuitions(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch tuitions");
      console.error(err);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/tuitions/${id}`,
        { status: "approved" },
        { withCredentials: true },
      );
      toast.success("Tuition approved successfully!");
      fetchTuitions();
    } catch (err) {
      toast.error("Failed to approve tuition");
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/tuitions/${id}`,
        { status: "rejected" },
        { withCredentials: true },
      );
      toast.success("Tuition rejected");
      fetchTuitions();
    } catch (err) {
      toast.error("Failed to reject tuition");
      console.error(err);
    }
  };

  const filteredTuitions = tuitions.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  const stats = {
    total: tuitions.length,
    pending: tuitions.filter((t) => t.status === "pending").length,
    approved: tuitions.filter((t) => t.status === "approved").length,
    rejected: tuitions.filter((t) => t.status === "rejected").length,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900">
          Tuition Management
        </h2>
        <p className="text-gray-500 mt-1">
          Review, approve, or reject tuition posts
        </p>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="bg-gray-50 px-4 py-2 rounded-xl">
            <p className="text-sm text-gray-600 font-semibold">
              Total: {stats.total}
            </p>
          </div>
          <div className="bg-yellow-50 px-4 py-2 rounded-xl">
            <p className="text-sm text-yellow-600 font-semibold">
              Pending: {stats.pending}
            </p>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-xl">
            <p className="text-sm text-green-600 font-semibold">
              Approved: {stats.approved}
            </p>
          </div>
          <div className="bg-red-50 px-4 py-2 rounded-xl">
            <p className="text-sm text-red-600 font-semibold">
              Rejected: {stats.rejected}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mt-4 flex gap-2">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize transition-colors ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Tuitions Grid */}
      {filteredTuitions.length > 0 ? (
        <div className="grid gap-4">
          {filteredTuitions.map((tuition) => (
            <div
              key={tuition._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Tuition Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {tuition.subject}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                        tuition.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : tuition.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {tuition.status || "pending"}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    Looking for {tuition.subject} Tutor
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-semibold text-gray-800">
                        {tuition.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Salary</p>
                      <p className="font-semibold text-gray-800">
                        ৳{tuition.salary}/month
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Posted By</p>
                      <p className="font-semibold text-gray-800">
                        {tuition.postedBy?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Posted On</p>
                      <p className="font-semibold text-gray-800">
                        {tuition.createdAt
                          ? new Date(tuition.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {tuition.status !== "approved" &&
                  tuition.status !== "rejected" && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(tuition._id)}
                        className="px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(tuition._id)}
                        className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                      >
                        ✕ Reject
                      </button>
                    </div>
                  )}

                {tuition.status === "approved" && (
                  <div className="px-6 py-3 bg-green-50 text-green-700 rounded-xl font-semibold">
                    ✓ Approved
                  </div>
                )}

                {tuition.status === "rejected" && (
                  <div className="px-6 py-3 bg-red-50 text-red-700 rounded-xl font-semibold">
                    ✕ Rejected
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-500 text-lg font-medium">
            No {filter === "all" ? "" : filter} tuitions found
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageTuitions;
