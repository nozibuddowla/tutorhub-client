import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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
      console.error(err);
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
    } catch (err) {
      toast.error("Error updating role");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/admin/users/${id}`,
          { withCredentials: true },
        );
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (err) {
        toast.error("Failed to delete user");
        console.error(err);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setShowEditModal(true);
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
      toast.success("User information updated successfully");
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user");
      console.error(err);
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
        <h2 className="text-2xl font-black text-gray-900">User Management</h2>
        <p className="text-gray-500 mt-1">
          Manage all users, roles, and account information
        </p>
        <div className="mt-4 flex gap-4">
          <div className="bg-blue-50 px-4 py-2 rounded-xl">
            <p className="text-sm text-blue-600 font-semibold">
              Total Users: {users.length}
            </p>
          </div>
          <div className="bg-purple-50 px-4 py-2 rounded-xl">
            <p className="text-sm text-purple-600 font-semibold">
              Tutors: {users.filter((u) => u.role === "tutor").length}
            </p>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-xl">
            <p className="text-sm text-green-600 font-semibold">
              Students: {users.filter((u) => u.role === "student").length}
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-600">
                  User
                </th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-600">
                  Contact
                </th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-600">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-600">
                  Joined
                </th>
                <th className="text-right py-4 px-6 text-sm font-bold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.photoURL ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                        }
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-100"
                        alt={user.name}
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-700">
                      {user.phone || "N/A"}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-purple-500 capitalize"
                    >
                      <option value="student">Student</option>
                      <option value="tutor">Tutor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-600">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-semibold"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit User Information</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editingUser.phone || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
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

export default ManageUsers;
