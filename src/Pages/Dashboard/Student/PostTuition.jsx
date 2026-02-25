// ─── PostTuition.jsx ──────────────────────────────────────────────────────────
import React, { useContext } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";

const inputCls =
  "w-full p-3 rounded-xl outline-none bg-[var(--bg-muted)] border border-[var(--bg-border-strong)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500";
const labelCls = "block text-sm font-medium text-[var(--text-secondary)] mb-1";

const PostTuition = () => {
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const tuitionData = {
      studentName: user?.displayName,
      studentEmail: user?.email,
      subject: form.subject.value,
      location: form.location.value,
      salary: form.salary.value,
      description: form.description.value,
      status: "pending",
      createdAt: new Date(),
    };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/tuitions`,
        tuitionData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );
      if (res.data.insertedId) {
        toast.success("Tuition post published successfully!");
        form.reset();
      }
    } catch {
      toast.error("Failed to post tuition");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[var(--bg-elevated)] p-8 rounded-2xl shadow-sm border border-[var(--bg-border)]">
      <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
        Post New Tuition
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Subject</label>
            <input
              name="subject"
              type="text"
              required
              className={inputCls}
              placeholder="Ex: Mathematics"
            />
          </div>
          <div>
            <label className={labelCls}>Salary (BDT)</label>
            <input
              name="salary"
              type="number"
              required
              className={inputCls}
              placeholder="Ex: 5000"
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Location</label>
          <input
            name="location"
            type="text"
            required
            className={inputCls}
            placeholder="Ex: Mirpur, Dhaka"
          />
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea
            name="description"
            rows="4"
            required
            className={`${inputCls} resize-none`}
            placeholder="Detail your requirements..."
          />
        </div>
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30"
        >
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default PostTuition;
