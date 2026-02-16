import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../../Provider/AuthProvider";

const StudentPayments = () => {
  const { user } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/student/payments/${user.email}`,
        { withCredentials: true },
      );
      setPayments(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch payments");
      console.error(err);
      setLoading(false);
    }
  };

  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-black">Payment History 💳</h2>
        <p className="text-white/80 mt-1">Track your tuition payments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
              💰
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Paid</p>
              <p className="text-3xl font-black text-gray-900">
                ৳{totalPaid.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
              ✓
            </div>
            <div>
              <p className="text-sm text-gray-500">Successful</p>
              <p className="text-3xl font-black text-gray-900">
                {payments.filter((p) => p.status === "success").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Transactions</p>
              <p className="text-3xl font-black text-gray-900">
                {payments.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">
            Transaction History
          </h3>
        </div>

        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-600">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-600">
                    Tutor
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-600">
                    Tuition
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-600">
                    Amount
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-600">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="hover:bg-gray-50 transition-colors"
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
                      <p className="text-xs text-gray-400">
                        {new Date(payment.createdAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-900">
                        {payment.tutorName || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {payment.tutorEmail || "N/A"}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-700">
                        {payment.tuitionTitle || payment.subject || "N/A"}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-gray-900">
                        ৳{payment.amount?.toLocaleString() || 0}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          payment.status === "success"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status || "pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs text-gray-500 font-mono">
                        {payment.transactionId || "N/A"}
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
            <p className="text-gray-500 text-lg font-medium">No payments yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Your payment history will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPayments;
