import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../../Provider/AuthProvider";

const StudentTuitions = () => {
  const { user } = useContext(AuthContext);
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTuition, setEditingTuition] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchTuitions();
  }, [user]);

  const fetchTuitions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/student/tuitions/${user.email}`,
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

  const handleEdit = (tuition) => {
    setEditingTuition({ ...tuition });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/tuitions/${editingTuition._id}`,
        {
          subject: editingTuition.subject,
          location: editingTuition.location,
          salary: editingTuition.salary,
          description: editingTuition.description,
        },
        { withCredentials: true },
      );
      toast.success("Tuition updated successfully!");
      setShowEditModal(false);
      fetchTuitions();
    } catch (err) {
      toast.error("Failed to update tuition");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tuition post?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/tuitions/${id}`, {
          withCredentials: true,
        });
        toast.success("Tuition deleted successfully!");
        fetchTuitions();
      } catch (err) {
        toast.error("Failed to delete tuition");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900">My Tuitions</h2>
        <p className="text-gray-500 mt-1">
          Manage your posted tuition requests
        </p>

        {/* Stats */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="bg-blue-50 px-4 py-2 rounded-xl">
            <p className="text-sm text-blue-600 font-semibold">
              Total: {tuitions.length}
            </p>
          </div>
          <div className="bg-yellow-50 px-4 py-2 rounded-xl">
            <p className="text-sm text-yellow-600 font-semibold">
              Pending: {tuitions.filter((t) => t.status === "pending").length}
            </p>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-xl">
            <p className="text-sm text-green-600 font-semibold">
              Approved: {tuitions.filter((t) => t.status === "approved").length}
            </p>
          </div>
        </div>
      </div>

      {/* Tuitions Grid */}
      {tuitions.length > 0 ? (
        <div className="grid gap-4">
          {tuitions.map((tuition) => (
            <div
              key={tuition._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
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

                  <h3 className="font-bold text-lg text-gray-900 mb-3">
                    {tuition.description || "Tuition Request"}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
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
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(tuition)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tuition._id)}
                    className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-gray-500 text-lg font-medium">
            No tuitions posted yet
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Create your first tuition post to find tutors
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingTuition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Edit Tuition</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={editingTuition.subject}
                    onChange={(e) =>
                      setEditingTuition({
                        ...editingTuition,
                        subject: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Salary (BDT)
                  </label>
                  <input
                    type="number"
                    value={editingTuition.salary}
                    onChange={(e) =>
                      setEditingTuition({
                        ...editingTuition,
                        salary: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={editingTuition.location}
                  onChange={(e) =>
                    setEditingTuition({
                      ...editingTuition,
                      location: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  rows="4"
                  value={editingTuition.description}
                  onChange={(e) =>
                    setEditingTuition({
                      ...editingTuition,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
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

export default StudentTuitions;
