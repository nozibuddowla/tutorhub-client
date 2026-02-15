import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

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
    } catch (err) {
      toast.error("Failed to fetch users: ", err.message);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/role/${email}`,
        { role: newRole },
        { withCredentials: true },
      );
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error("Error updating role: ", err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/admin/users/${id}`,
          { withCredentials: true },
        );
        toast.success("User deleted");
        fetchUsers();
      } catch (err) {
        toast.error("Delete failed: ", err.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm overflow-x-auto">
      <h2 className="text-xl font-bold mb-6">User Management</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 border-b text-sm">
            <th className="pb-4">User</th>
            <th className="pb-4">Role</th>
            <th className="pb-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 flex items-center gap-3">
                <img
                  src={u.photoURL}
                  className="w-10 h-10 rounded-full object-cover"
                  alt=""
                />
                <div>
                  <p className="font-semibold text-gray-800">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
              </td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.email, e.target.value)}
                  className="border rounded-lg px-2 py-1 text-sm outline-none"
                >
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
