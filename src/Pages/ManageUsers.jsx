import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const inputCls =
  "w-full px-2 py-2 rounded-xl outline-none bg-[var(--bg-muted)] border border-[var(--bg-border-strong)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/users`,
        { withCredentials: true },
      );
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch users");
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/users/${id}`,
        { role: newRole },
        { withCredentials: true },
      );
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch {
      toast.error("Error updating role");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/users/${id}`, {
        withCredentials: true,
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/users/${editingUser._id}`,
        {
          name: editingUser.name,
          email: editingUser.email,
          phone: editingUser.phone,
        },
        { withCredentials: true },
      );
      toast.success("User updated successfully");
      setShowEditModal(false);
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
        <h2 className="text-2xl font-black text-[var(--text-primary)]">
          User Management
        </h2>
        <p className="text-[var(--text-secondary)] mt-1">
          Manage all users, roles, and account information
        </p>
        <div className="mt-4 flex gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 px-2 py-2 rounded-xl">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Total Users: {users.length}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 px-2 py-2 rounded-xl">
            <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
              Tutors: {users.filter((u) => u.role === "tutor").length}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 px-2 py-2 rounded-xl">
            <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
              Students: {users.filter((u) => u.role === "student").length}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-elevated)] rounded-2xl shadow-sm border border-[var(--bg-border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-surface)] border-b border-[var(--bg-border)]">
              <tr>
                {["User", "Contact", "Role", "Joined", "Actions"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`py-4 px-6 text-sm font-bold text-[var(--text-secondary)] ${i === 4 ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--bg-border)]">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-[var(--bg-surface)] transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.photoURL ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                        }
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-[var(--bg-border)]"
                        alt={user.name}
                      />
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">
                          {user.name}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-[var(--text-secondary)]">
                      {user.phone || "N/A"}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="border border-[var(--bg-border-strong)] rounded-lg px-3 py-1.5 text-sm font-semibold outline-none bg-[var(--bg-muted)] text-[var(--text-primary)] focus:ring-2 focus:ring-purple-500 capitalize"
                    >
                      <option value="student">Student</option>
                      <option value="tutor">Tutor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-[var(--text-secondary)]">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingUser({ ...user });
                          setShowEditModal(true);
                        }}
                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:bg-red-900/40 dark:hover:bg-red-900/50 transition-colors text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">
              Edit User Information
            </h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              {[
                { label: "Name", type: "text", key: "name" },
                { label: "Email", type: "email", key: "email" },
                { label: "Phone", type: "tel", key: "phone" },
              ].map(({ label, type, key }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={editingUser[key] || ""}
                    className={inputCls}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, [key]: e.target.value })
                    }
                    required={key !== "phone"}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-[var(--bg-muted)] text-[var(--text-secondary)] py-2 rounded-lg font-semibold hover:bg-[var(--bg-border-strong)] transition-colors"
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

export default ManageUsers;
