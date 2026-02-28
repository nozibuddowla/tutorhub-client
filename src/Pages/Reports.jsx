import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const Reports = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch payment data");
      console.error(err);
      setLoading(false);
    }
  };

  // Calculate totals
  const totalEarnings = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const successfulTransactions = payments.filter(
    (p) => p.status === "success",
  ).length;
  const pendingTransactions = payments.filter(
    (p) => p.status === "pending",
  ).length;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-black">Reports & Analytics 📊</h2>
        <p className="text-white/80 mt-1">
          View platform earnings and transaction history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center text-2xl">
              💰
            </div>
            <div>
              <p className="text-sm text-(--text-secondary)">Total Earnings</p>
              <p className="text-3xl font-black text-[var(--text-primary)]">
                ৳{totalEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
              ✓
            </div>
            <div>
              <p className="text-sm text-(--text-secondary)">Successful</p>
              <p className="text-3xl font-black text-[var(--text-primary)]">
                {successfulTransactions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
              ⏳
            </div>
            <div>
              <p className="text-sm text-(--text-secondary)">Pending</p>
              <p className="text-3xl font-black text-[var(--text-primary)]">
                {pendingTransactions}
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
          <p className="text-sm text-(--text-secondary) mt-1">
            All successful payment transactions
          </p>
        </div>

        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-(--bg-surface) border-b border-[var(--bg-border)]">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-bold text-(--text-secondary)">
                    Transaction ID
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-(--text-secondary)">
                    User
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-(--text-secondary)">
                    Type
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-(--text-secondary)">
                    Amount
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-(--text-secondary)">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-(--text-secondary)">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--bg-border)">
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-(--bg-surface) transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="text-sm font-mono text-(--text-secondary)">
                        {payment.transactionId || payment._id.slice(0, 12)}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">
                          {payment.userName || "N/A"}
                        </p>
                        <p className="text-xs text-(--text-secondary)">
                          {payment.userEmail || ""}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-[var(--text-secondary)] capitalize">
                        {payment.type || "Tuition Fee"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-[var(--text-primary)]">
                        ৳{payment.amount?.toLocaleString() || 0}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          payment.status === "success"
                            ? "bg-green-100 dark:bg-green-900/40 text-green-700"
                            : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {payment.status || "pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-(--text-secondary)">
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
            <div className="text-6xl mb-4">💳</div>
            <p className="text-(--text-secondary) text-lg font-medium">
              No transactions found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
