import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ── Constants ─────────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;
const COLORS = [
  "#6b46c1",
  "#11998e",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
];

const SORT_OPTIONS = [
  { value: "date_desc", label: "Newest First" },
  { value: "date_asc", label: "Oldest First" },
  { value: "amount_desc", label: "Amount: High → Low" },
  { value: "amount_asc", label: "Amount: Low → High" },
];

const STAT_BADGES = {
  revenue:
    "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300",
  success: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  pending:
    "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300",
  avg: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const statusBadge = (status) => {
  if (status === "success")
    return "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300";
  if (status === "pending")
    return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300";
  return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
};

// Monthly aggregation helper
const buildMonthlyData = (payments) => {
  const map = {};
  payments.forEach((p) => {
    if (!p.createdAt) return;
    const key = new Date(p.createdAt).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    if (!map[key]) map[key] = { month: key, revenue: 0, count: 0 };
    map[key].revenue += p.amount || 0;
    map[key].count += 1;
  });
  return Object.values(map).slice(-6); // last 6 months
};

// Subject distribution for pie
const buildSubjectData = (payments) => {
  const map = {};
  payments.forEach((p) => {
    const key = p.type || "Tuition Fee";
    map[key] = (map[key] || 0) + (p.amount || 0);
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
};

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-bold text-[var(--text-primary)] mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}:{" "}
          {entry.name === "revenue"
            ? `৳${entry.value.toLocaleString()}`
            : entry.value}
        </p>
      ))}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const Reports = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("date_desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/payments`,
        { withCredentials: true },
      );
      setPayments(res.data);
    } catch {
      toast.error("Failed to fetch payment data");
    } finally {
      setLoading(false);
    }
  };

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalEarnings = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const successCount = payments.filter((p) => p.status === "success").length;
  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const avgTransaction = payments.length
    ? Math.round(totalEarnings / payments.length)
    : 0;

  // ── Chart data ─────────────────────────────────────────────────────────────
  const monthlyData = useMemo(() => buildMonthlyData(payments), [payments]);
  const subjectData = useMemo(() => buildSubjectData(payments), [payments]);

  // ── Filtered + sorted + paginated ─────────────────────────────────────────
  const filtered = useMemo(() => {
    let data = [...payments];
    if (statusFilter !== "all")
      data = data.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (p) =>
          (p.userName || "").toLowerCase().includes(q) ||
          (p.userEmail || "").toLowerCase().includes(q) ||
          (p.transactionId || p._id || "").toLowerCase().includes(q),
      );
    }
    data.sort((a, b) => {
      if (sort === "date_desc")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "date_asc")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "amount_desc") return (b.amount || 0) - (a.amount || 0);
      if (sort === "amount_asc") return (a.amount || 0) - (b.amount || 0);
      return 0;
    });
    return data;
  }, [payments, statusFilter, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (val) => {
    setStatusFilter(val);
    setPage(1);
  };
  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };
  const handleSort = (val) => {
    setSort(val);
    setPage(1);
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6 text-white bg-[var(--color-primary)]">
        <h2 className="text-2xl font-black">Reports & Analytics 📊</h2>
        <p className="text-white/80 mt-1 text-sm">
          Platform earnings, transactions, and growth trends
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `৳${totalEarnings.toLocaleString()}`,
            icon: "💰",
            badge: STAT_BADGES.revenue,
          },
          {
            label: "Successful",
            value: successCount,
            icon: "✅",
            badge: STAT_BADGES.success,
          },
          {
            label: "Pending",
            value: pendingCount,
            icon: "⏳",
            badge: STAT_BADGES.pending,
          },
          {
            label: "Avg Transaction",
            value: `৳${avgTransaction.toLocaleString()}`,
            icon: "📈",
            badge: STAT_BADGES.avg,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[var(--bg-elevated)] rounded-2xl p-5 border border-[var(--bg-border)] shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${s.badge}`}
              >
                Live
              </span>
            </div>
            <p className="text-2xl font-black text-[var(--text-primary)]">
              {s.value}
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Bar Chart — Monthly Revenue */}
        <div className="lg:col-span-2 bg-[var(--bg-elevated)] rounded-2xl p-6 border border-[var(--bg-border)] shadow-sm">
          <h3 className="font-bold text-[var(--text-primary)] mb-1">
            Monthly Revenue
          </h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            Last 6 months earnings
          </p>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={monthlyData}
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--bg-border)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                  tickFormatter={(v) =>
                    `৳${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`
                  }
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="revenue"
                  name="revenue"
                  fill="#6b46c1"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-[var(--text-muted)] text-sm">
              No data yet
            </div>
          )}
        </div>

        {/* Pie Chart — Revenue by Type */}
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 border border-[var(--bg-border)] shadow-sm">
          <h3 className="font-bold text-[var(--text-primary)] mb-1">
            Revenue Breakdown
          </h3>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            By payment type
          </p>
          {subjectData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {subjectData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `৳${v.toLocaleString()}`} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-[var(--text-muted)] text-sm">
              No data yet
            </div>
          )}
        </div>
      </div>

      {/* Line Chart — Transaction Volume */}
      <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 border border-[var(--bg-border)] shadow-sm">
        <h3 className="font-bold text-[var(--text-primary)] mb-1">
          Transaction Volume
        </h3>
        <p className="text-xs text-[var(--text-muted)] mb-4">
          Number of transactions per month
        </p>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={monthlyData}
              margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-border)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                name="count"
                stroke="#11998e"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#11998e" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-[var(--text-muted)] text-sm">
            No data yet
          </div>
        )}
      </div>

      {/* ── Transaction Table ── */}
      <div className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] shadow-sm overflow-hidden">
        {/* Table toolbar */}
        <div className="p-5 border-b border-[var(--bg-border)] flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, or transaction ID…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--bg-muted)] border border-[var(--bg-border-strong)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "success", "pending", "failed"].map((f) => (
              <button
                key={f}
                onClick={() => handleFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-colors ${
                  statusFilter === f
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--bg-border-strong)]"
                }`}
              >
                {f}
              </button>
            ))}
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-muted)] border border-[var(--bg-border-strong)] text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-purple-500/40"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
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
            transactions
          </p>
        </div>

        {paginated.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--bg-surface)] border-b border-[var(--bg-border)]">
                <tr>
                  {[
                    { label: "Transaction ID", sortKey: null },
                    { label: "User", sortKey: null },
                    { label: "Type", sortKey: null },
                    { label: "Amount ↕", sortKey: "amount" },
                    { label: "Status", sortKey: null },
                    { label: "Date ↕", sortKey: "date" },
                  ].map(({ label, sortKey }) => (
                    <th
                      key={label}
                      onClick={() => {
                        if (!sortKey) return;
                        const asc =
                          sort === `${sortKey}_desc`
                            ? `${sortKey}_asc`
                            : `${sortKey}_desc`;
                        handleSort(asc);
                      }}
                      className={`text-left py-3 px-5 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider ${sortKey ? "cursor-pointer hover:text-[var(--text-primary)]" : ""}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bg-border)]">
                {paginated.map((payment) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-[var(--bg-surface)] transition-colors"
                  >
                    <td className="py-4 px-5">
                      <p className="text-xs font-mono text-[var(--text-secondary)]">
                        {(payment.transactionId || payment._id).slice(0, 14)}…
                      </p>
                    </td>
                    <td className="py-4 px-5">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {payment.userName || "N/A"}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {payment.userEmail || ""}
                      </p>
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-sm text-[var(--text-secondary)] capitalize">
                        {payment.type || "Tuition Fee"}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <p className="text-sm font-bold text-[var(--text-primary)]">
                        ৳{(payment.amount || 0).toLocaleString()}
                      </p>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusBadge(payment.status?.toLowerCase())}`}
                      >
                        {payment.status || "pending"}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <p className="text-sm text-[var(--text-secondary)]">
                        {payment.createdAt
                          ? new Date(payment.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "N/A"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">💳</p>
            <p className="text-[var(--text-secondary)] font-medium">
              {search || statusFilter !== "all"
                ? "No transactions match your filter"
                : "No transactions found"}
            </p>
            {(search || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
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
          <div className="px-5 py-4 border-t border-[var(--bg-border)] flex items-center justify-between gap-4">
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
                      key={`ellipsis-${i}`}
                      className="px-2 text-[var(--text-muted)]"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${
                        page === p
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--bg-border-strong)]"
                      }`}
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
    </div>
  );
};

export default Reports;
