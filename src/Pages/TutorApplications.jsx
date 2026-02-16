import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../Provider/AuthProvider";
import Loading from "../components/Loading";

const TutorApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingApp, setEditingApp] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tutor/applications/${user.email}`,
        { withCredentials: true },
      );
      setApplications(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch applications");
      setLoading(false);
    }
  };

  const handleEdit = (app) => {
    setEditingApp({ ...app });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/applications/${editingApp._id}`,
        {
          qualifications: editingApp.qualifications,
          experience: editingApp.experience,
          expectedSalary: editingApp.expectedSalary,
        },
        { withCredentials: true },
      );
      toast.success("Application updated successfully");
      setShowEditModal(false);
      fetchApplications();
    } catch (err) {
      toast.error("Failed to update application");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/applications/${id}`,
          { withCredentials: true },
        );
        toast.success("Application deleted");
        fetchApplications();
      } catch (err) {
        toast.error("Failed to delete application");
      }
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900">My Applications</h2>
        <p className="text-gray-500 mt-1">
          Track and manage your tuition applications
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
      </div>

      {/* Applications List */}
      {applications.length > 0 ? (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Application Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                      {app.subject || "N/A"}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                        app.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : app.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    Application for {app.tuitionTitle || "Tuition"}
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Qualifications</p>
                      <p className="font-semibold text-gray-800">
                        {app.qualifications}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Experience</p>
                      <p className="font-semibold text-gray-800">
                        {app.experience}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expected Salary</p>
                      <p className="font-semibold text-gray-800">
                        ৳{app.expectedSalary}/month
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Applied On</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {app.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(app)}
                      className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(app._id)}
                      className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-500 text-lg font-medium">
            No applications yet. Start applying for tuitions!
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Application</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Qualifications
                </label>
                <input
                  type="text"
                  value={editingApp.qualifications}
                  onChange={(e) =>
                    setEditingApp({
                      ...editingApp,
                      qualifications: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Experience
                </label>
                <input
                  type="text"
                  value={editingApp.experience}
                  onChange={(e) =>
                    setEditingApp({
                      ...editingApp,
                      experience: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Expected Salary
                </label>
                <input
                  type="number"
                  value={editingApp.expectedSalary}
                  onChange={(e) =>
                    setEditingApp({
                      ...editingApp,
                      expectedSalary: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-linear-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold"
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

export default TutorApplications;
