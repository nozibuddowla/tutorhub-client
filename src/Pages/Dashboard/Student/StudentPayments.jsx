import { useContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../../Provider/AuthProvider";
import Loading from "../../../components/Loading";
import ReviewModal from "../../../components/ReviewModal";

const StudentPayments = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // ✅ FIX: declare with useCallback BEFORE useEffect
  const fetchPayments = useCallback(async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/student/payments/${user.email}`,
        { withCredentials: true },
      );
      setPayments(res.data);
    } catch {
      toast.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  }, [user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (user?.email) fetchPayments();
  }, [fetchPayments]);

  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-linear-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-black">Payment History 💳</h2>
        <p className="text-white/80 mt-1">Track your tuition payments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-xl flex items-center justify-center text-2xl">
              💰
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Paid</p>
              <p className="text-3xl font-black text-[var(--text-primary)]">
                ৳{totalPaid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center text-2xl">
              ✓
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Successful</p>
              <p className="text-3xl font-black text-[var(--text-primary)]">
                {payments.filter((p) => p.status === "success").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[var(--bg-elevated)] rounded-2xl p-6 shadow-sm border border-[var(--bg-border)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                Total Transactions
              </p>
              <p className="text-3xl font-black text-[var(--text-primary)]">
                {payments.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-[var(--bg-elevated)] rounded-2xl shadow-sm border border-[var(--bg-border)] overflow-hidden">
        <div className="p-6 border-b border-[var(--bg-border)]">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            Transaction History
          </h3>
        </div>

        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--bg-surface)] border-b border-[var(--bg-border)]">
                <tr>
                  {[
                    "Date",
                    "Tutor",
                    "Tuition",
                    "Amount",
                    "Status",
                    "Transaction ID",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-4 px-6 text-sm font-bold text-[var(--text-secondary)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bg-border)]">
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-[var(--bg-surface)] transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="text-sm text-[var(--text-secondary)]">
                        {new Date(payment.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {new Date(payment.createdAt).toLocaleTimeString(
                          "en-US",
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-[var(--text-primary)]">
                        {payment.tutorName || "N/A"}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {payment.tutorEmail || "N/A"}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-[var(--text-secondary)]">
                        {payment.tuitionTitle || payment.subject || "N/A"}
                      </p>
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
                      <p className="text-xs text-[var(--text-secondary)] font-mono">
                        {payment.transactionId || "N/A"}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      {payment.status === "success" && (
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors"
                        >
                          Review Tutor
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">💳</div>
            <p className="text-[var(--text-secondary)] text-lg font-medium">
              No payments yet
            </p>
            <p className="text-[var(--text-muted)] text-sm mt-2">
              Your payment history will appear here
            </p>
          </div>
        )}
      </div>

      {selectedPayment && (
        <ReviewModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </div>
  );
};

export default StudentPayments;
