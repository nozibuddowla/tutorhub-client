import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../Provider/AuthProvider";
import Loading from "../components/Loading";
import { Badge, Table } from "../components/ui";

const TutorRevenue = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIX: useCallback BEFORE useEffect
  const fetchRevenue = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tutor/revenue/${user.email}`,
        { withCredentials: true },
      );
      setPayments(res.data);
    } catch {
      toast.error("Failed to fetch revenue data");
    } finally {
      setLoading(false);
    }
  }, [user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user?.email) fetchRevenue();
  }, [fetchRevenue]);

  const totalEarnings = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const thisMonth = payments
    .filter((p) => {
      const date = new Date(p.createdAt);
      const now = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const columns = [
    {
      key: "createdAt",
      label: "Date",
      render: (v) => (
        <span className="text-[var(--text-secondary)]">
          {new Date(v).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "tuitionTitle",
      label: "Tuition",
      render: (v, row) => (
        <div>
          <p className="font-semibold text-[var(--text-primary)]">
            {v || "Tuition Payment"}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {row.studentName || "N/A"}
          </p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      align: "right",
      render: (v) => (
        <span className="font-bold text-[var(--text-primary)]">
          ৳{v?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (v) => (
        <Badge variant="green" dot>
          {v || "success"}
        </Badge>
      ),
    },
  ];

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-black">Revenue History 💰</h2>
        <p className="text-white/80 mt-1">
          Track your earnings and transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center text-2xl">
              💵
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                Total Earnings
              </p>
              <p className="text-3xl font-black text-[var(--text-primary)]">
                ৳{totalEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center text-2xl">
              📅
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">This Month</p>
              <p className="text-3xl font-black text-[var(--text-primary)]">
                ৳{thisMonth.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-[var(--bg-elevated)] rounded-2xl shadow-sm border border-[var(--bg-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--bg-border)]">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            Transaction History
          </h3>
        </div>
        <div className="p-4">
          <Table
            columns={columns}
            data={payments}
            empty={
              <div className="py-8">
                <div className="text-5xl mb-3">💳</div>
                <p>No transactions yet</p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default TutorRevenue;
