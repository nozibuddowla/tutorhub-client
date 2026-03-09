import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const PAGE_SIZE = 8;

const statusBadge = {
  approved: "bg-green-600 text-white",
  rejected: "bg-red-600 text-white",
  pending: "bg-yellow-500 text-white",
};

const ManageTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

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
    } catch {
      toast.error("Failed to fetch tuitions");
    } finally {
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
      toast.success("Tuition approved!");
      fetchTuitions();
    } catch {
      toast.error("Failed to approve");
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
    } catch {
      toast.error("Failed to reject");
    }
  };

  const stats = useMemo(
    () => ({
      total: tuitions.length,
      pending: tuitions.filter((t) => !t.status || t.status === "pending")
        .length,
      approved: tuitions.filter((t) => t.status === "approved").length,
      rejected: tuitions.filter((t) => t.status === "rejected").length,
    }),
    [tuitions],
  );

  const filtered = useMemo(() => {
    let data = [...tuitions];
    if (filter !== "all") {
      data =
        filter === "pending"
          ? data.filter((t) => !t.status || t.status === "pending")
          : data.filter((t) => t.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (t) =>
          (t.subject || "").toLowerCase().includes(q) ||
          (t.location || "").toLowerCase().includes(q) ||
          (t.postedBy?.name || t.studentName || "").toLowerCase().includes(q),
      );
    }
    data.sort((a, b) => {
      if (sort === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "salary_hi") return (b.salary || 0) - (a.salary || 0);
      if (sort === "salary_lo") return (a.salary || 0) - (b.salary || 0);
      return 0;
    });
    return data;
  }, [tuitions, filter, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setFilterReset = (v) => {
    setFilter(v);
    setPage(1);
  };
  const setSearchReset = (v) => {
    setSearch(v);
    setPage(1);
  };
  const setSortReset = (v) => {
    setSort(v);
    setPage(1);
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 border border-[var(--bg-border)] shadow-sm">
        <h2 className="text-2xl font-black text-[var(--text-primary)]">
          Tuition Management
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Review, approve, or reject tuition posts
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { label: `Total: ${stats.total}`, cls: "bg-gray-700 text-white" },
            {
              label: `Pending: ${stats.pending}`,
              cls: "bg-yellow-500 text-white",
            },
            {
              label: `Approved: ${stats.approved}`,
              cls: "bg-green-600 text-white",
            },
            {
              label: `Rejected: ${stats.rejected}`,
              cls: "bg-red-600 text-white",
            },
          ].map((b) => (
            <div key={b.label} className={`px-3 py-2 rounded-xl ${b.cls}`}>
              <p className="text-sm font-semibold">{b.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[var(--bg-elevated)] rounded-2xl p-4 border border-[var(--bg-border)] shadow-sm flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by subject, location, or student…"
          value={search}
          onChange={(e) => setSearchReset(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-[var(--bg-muted)] border border-[var(--bg-border-strong)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/40"
        />
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterReset(f)}
              className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                filter === f
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--bg-border-strong)]"
              }`}
            >
              {f}
            </button>
          ))}
          <select
            value={sort}
            onChange={(e) => setSortReset(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-muted)] border border-[var(--bg-border-strong)] text-[var(--text-secondary)] focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="salary_hi">Salary: High → Low</option>
            <option value="salary_lo">Salary: Low → High</option>
          </select>
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-[var(--text-muted)] px-1">
        Showing{" "}
        <span className="font-bold text-[var(--text-primary)]">
          {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
          {Math.min(page * PAGE_SIZE, filtered.length)}
        </span>{" "}
        of{" "}
        <span className="font-bold text-[var(--text-primary)]">
          {filtered.length}
        </span>{" "}
        tuitions
      </p>

      {/* Cards */}
      {paginated.length > 0 ? (
        <div className="grid gap-4">
          {paginated.map((tuition) => {
            const status = tuition.status || "pending";
            return (
              <div
                key={tuition._id}
                className="bg-[var(--bg-elevated)] rounded-2xl p-6 border border-[var(--bg-border)] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                        {tuition.subject}
                      </span>
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusBadge[status] || statusBadge.pending}`}
                      >
                        {status}
                      </span>
                    </div>
                    <h3 className="font-bold text-[var(--text-primary)] mb-3">
                      Looking for {tuition.subject} Tutor
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      {[
                        { label: "Location", value: tuition.location },
                        {
                          label: "Salary",
                          value: `৳${tuition.salary || 0}/mo`,
                        },
                        {
                          label: "Posted By",
                          value:
                            tuition.postedBy?.name ||
                            tuition.studentName ||
                            "N/A",
                        },
                        {
                          label: "Date",
                          value: tuition.createdAt
                            ? new Date(tuition.createdAt).toLocaleDateString()
                            : "N/A",
                        },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <p className="text-xs text-[var(--text-muted)] mb-0.5">
                            {label}
                          </p>
                          <p className="font-semibold text-[var(--text-primary)]">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {status === "pending" || !tuition.status ? (
                      <>
                        <button
                          onClick={() => handleApprove(tuition._id)}
                          className="px-5 py-2.5 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors text-sm"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleReject(tuition._id)}
                          className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors text-sm"
                        >
                          ✕ Reject
                        </button>
                      </>
                    ) : status === "approved" ? (
                      <div className="flex gap-2">
                        <span className="px-4 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm">
                          ✓ Approved
                        </span>
                        <button
                          onClick={() => handleReject(tuition._id)}
                          className="px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors text-sm"
                        >
                          Revoke
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <span className="px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm">
                          ✕ Rejected
                        </span>
                        <button
                          onClick={() => handleApprove(tuition._id)}
                          className="px-4 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors text-sm"
                        >
                          Re-approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-12 text-center border-2 border-dashed border-[var(--bg-border)]">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-[var(--text-secondary)] font-medium">
            {search || filter !== "all"
              ? "No tuitions match your filter"
              : "No tuitions found"}
          </p>
          {(search || filter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-3 text-sm text-purple-600 font-semibold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                  <span key={`e${i}`} className="px-2 text-[var(--text-muted)]">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${page === p ? "bg-[var(--color-primary)] text-white" : "bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"}`}
                  >
                    {p}
                  </button>
                ),
              )}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageTuitions;
