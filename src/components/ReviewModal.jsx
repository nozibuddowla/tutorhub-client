import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ReviewModal = ({ payment, onClose }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const reviewData = {
      tutorEmail: payment.tutorEmail,
      tutorName: payment.tutorName,
      studentEmail: payment.studentEmail,
      studentName: payment.studentName || "Anonymous Student",
      rating,
      comment,
      tuitionId: payment.tuitionId,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/reviews`,
        reviewData,
        { withCredentials: true },
      );
      if (res.data.success) {
        toast.success("Thank you for your review!");
        onClose();
      }
    } catch (err) {
      toast.error("You already reviewed this tutor or server error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-2">Rate {payment.tutorName}</h2>
        <p className="text-gray-500 text-sm mb-4">
          Sharing your experience helps other students.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating (1-5)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  className={`w-10 h-10 rounded-lg font-bold transition-all ${
                    rating >= num
                      ? "bg-yellow-400 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {num}★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Comment
            </label>
            <textarea
              required
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 outline-none"
              rows="4"
              placeholder="How was the teaching style?"
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
