import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../Provider/AuthProvider";
import Loading from "../components/Loading";

const TutorRevenue = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenue();
  }, [user]);

  const fetchRevenue = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tutor/revenue/${user.email}`,
        { withCredentials: true },
      );
      setPayments(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch revenue data");
      setLoading(false);
    }
  };

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

  if (loading) {
    return <Loading />;
  }

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
        <div className="bg-(--bg-elevated) rounded-2xl p-6 shadow-sm border border-(--bg-border)">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
              💵
            </div>
            <div>
              <p className="text-sm text-(--text-secondary)">Total Earnings</p>
              <p className="text-3xl font-black text-(--text-primary)">
                ৳{totalEarnings.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-(--bg-elevated) rounded-2xl p-6 shadow-sm border border-(--bg-border)">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
              📅
            </div>
            <div>
              <p className="text-sm text-(--text-secondary)">This Month</p>
              <p className="text-3xl font-black text-(--text-primary)">
                ৳{thisMonth.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-(--bg-elevated) rounded-2xl shadow-sm border border-(--bg-border) overflow-hidden">
        <div className="p-6 border-b border-(--bg-border)">
          <h3 className="text-xl font-bold text-(--text-primary)">
            Transaction History
          </h3>
        </div>

        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-(--bg-surface) border-b border-(--bg-border)">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-bold text-(--text-secondary)">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-(--text-secondary)">
                    Tuition
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-(--text-secondary)">
                    Amount
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-(--text-secondary)">
                    Status
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
                      <p className="text-sm text-gray-700">
                        {new Date(payment.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-(--text-primary)">
                        {payment.tuitionTitle || "Tuition Payment"}
                      </p>
                      <p className="text-xs text-(--text-secondary)">
                        {payment.studentName || "N/A"}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-(--text-primary)">
                        ৳{payment.amount?.toLocaleString() || 0}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        {payment.status || "success"}
                      </span>
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
              No transactions yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorRevenue;
