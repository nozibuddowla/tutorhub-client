import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const PAGE_SIZE = 10;

const inputCls =
  "w-full px-3 py-2.5 rounded-xl outline-none bg-[var(--bg-muted)] border border-[var(--bg-border-strong)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 text-sm";

const SortIcon = ({ field, sort }) => {
  if (sort.field !== field) return <span className="opacity-40 ml-1">↕</span>;
  return (
    <span className="text-purple-500 ml-1">
      {sort.dir === "asc" ? "↑" : "↓"}
    </span>
  );
};

// ── Solid role badge colors (work in both light & dark) ───────────────────────
const roleBadge = {
  admin: "bg-purple-600 text-white",
  tutor: "bg-teal-600 text-white",
  student: "bg-blue-600 text-white",
};

// ── Stat badge background (solid, readable in light mode) ─────────────────────
const statBadge = [
  { key: "total", cls: "bg-blue-600 text-white" },
  { key: "tutors", cls: "bg-teal-600 text-white" },
  { key: "students", cls: "bg-green-600 text-white" },
  { key: "admins", cls: "bg-purple-600 text-white" },
];

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sort, setSort] = useState({ field: "createdAt", dir: "desc" });
  const [page, setPage] = useState(1);

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
    } catch {
      toast.error("Failed to fetch users");
    } finally {
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
      toast.success("User deleted");
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
      toast.success("User updated");
      setShowModal(false);
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    }
  };

  const toggleSort = (field) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" },
    );
    setPage(1);
  };

  const filtered = useMemo(() => {
    let data = [...users];
    if (roleFilter !== "all") data = data.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (u) =>
          (u.name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q) ||
          (u.phone || "").toLowerCase().includes(q),
      );
    }
    data.sort((a, b) => {
      let va = a[sort.field] || "";
      let vb = b[sort.field] || "";
      if (sort.field === "createdAt") {
        va = new Date(va);
        vb = new Date(vb);
      } else {
        va = va.toString().toLowerCase();
        vb = vb.toString().toLowerCase();
      }
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [users, roleFilter, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <Loading />;

  const statsRow = [
    { label: `Total: ${users.length}`, cls: statBadge[0].cls },
    {
      label: `Tutors: ${users.filter((u) => u.role === "tutor").length}`,
      cls: statBadge[1].cls,
    },
    {
      label: `Students: ${users.filter((u) => u.role === "student").length}`,
      cls: statBadge[2].cls,
    },
    {
      label: `Admins: ${users.filter((u) => u.role === "admin").length}`,
      cls: statBadge[3].cls,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 border border-[var(--bg-border)] shadow-sm">
        <h2 className="text-2xl font-black text-[var(--text-primary)]">
          User Management
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Manage all users, roles, and account information
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {statsRow.map((b) => (
            <div key={b.label} className={`px-3 py-1.5 rounded-xl ${b.cls}`}>
              <p className="text-sm font-bold">{b.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Table card */}
      <div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-5 border-b border-[var(--bg-border)] flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, email, or phone…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-[var(--bg-muted)] border border-[var(--bg-border-strong)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          />
          <div className="flex gap-2 flex-wrap">
            {["all", "student", "tutor", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRoleFilter(r);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors border ${
                  roleFilter === r
                    ? "bg-[var(--color-primary)] text-white border-transparent"
                    : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--bg-border-strong)] hover:bg-[var(--bg-muted)]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div className="px-5 py-2 bg-[var(--bg-surface)] border-b border-[var(--bg-border)]">
          <p className="text-xs text-[var(--text-muted)]">
            Showing{" "}
            <span className="font-bold text-[var(--text-primary)]">
              {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
              {Math.min(page * PAGE_SIZE, filtered.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-[var(--text-primary)]">
              {filtered.length}
            </span>{" "}
            users
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--bg-surface)] border-b border-[var(--bg-border)]">
              <tr>
                {[
                  { label: "User", field: "name" },
                  { label: "Contact", field: "phone" },
                  { label: "Role", field: "role" },
                  { label: "Joined", field: "createdAt" },
                  { label: "Actions", field: null },
                ].map(({ label, field }) => (
                  <th
                    key={label}
                    onClick={() => field && toggleSort(field)}
                    className={`py-3 px-5 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider ${field ? "cursor-pointer hover:text-[var(--text-primary)] text-left select-none" : "text-right"}`}
                  >
                    {label}
                    {field && <SortIcon field={field} sort={sort} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--bg-border)]">
              {paginated.length > 0 ? (
                paginated.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-[var(--bg-surface)] transition-colors"
                  >
                    {/* User */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.photoURL ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                          }
                          className="w-9 h-9 rounded-xl object-cover ring-2 ring-[var(--bg-border)] shrink-0"
                          alt={user.name}
                        />
                        <div>
                          <p className="font-semibold text-[var(--text-primary)] text-sm">
                            {user.name}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Contact */}
                    <td className="py-4 px-5">
                      <p className="text-sm text-[var(--text-secondary)]">
                        {user.phone || "—"}
                      </p>
                    </td>
                    {/* Role */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${roleBadge[user.role] || roleBadge.student}`}
                        >
                          {user.role}
                        </span>
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="border border-[var(--bg-border-strong)] rounded-lg px-2 py-1 text-xs font-semibold outline-none bg-[var(--bg-muted)] text-[var(--text-primary)] focus:ring-1 focus:ring-purple-500"
                        >
                          <option value="student">Student</option>
                          <option value="tutor">Tutor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                    {/* Joined */}
                    <td className="py-4 px-5">
                      <p className="text-sm text-[var(--text-secondary)]">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </td>
                    {/* Actions */}
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingUser({ ...user });
                            setShowModal(true);
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-bold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-bold transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-[var(--text-secondary)] text-sm"
                  >
                    {search || roleFilter !== "all" ? (
                      <div>
                        <p className="mb-2">No users match your search</p>
                        <button
                          onClick={() => {
                            setSearch("");
                            setRoleFilter("all");
                          }}
                          className="text-purple-600 font-bold hover:underline text-xs"
                        >
                          Clear filters
                        </button>
                      </div>
                    ) : (
                      "No users found"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-[var(--bg-border)] flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--bg-border-strong)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span
                      key={`e${i}`}
                      className="px-2 text-[var(--text-muted)]"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-xl text-sm font-bold transition-colors ${page === p ? "bg-[var(--color-primary)] text-white" : "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--bg-border-strong)]"}`}
                    >
                      {p}
                    </button>
                  ),
                )}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--bg-border-strong)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && editingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Edit User
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              {[
                { label: "Name", type: "text", key: "name" },
                { label: "Email", type: "email", key: "email" },
                { label: "Phone", type: "tel", key: "phone" },
              ].map(({ label, type, key }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-[var(--text-muted)] uppercase mb-1.5">
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
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[var(--color-primary)] text-white py-2.5 rounded-xl font-bold hover:opacity-90 transition text-sm"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-[var(--bg-muted)] text-[var(--text-secondary)] py-2.5 rounded-xl font-bold hover:bg-[var(--bg-border-strong)] transition text-sm"
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
