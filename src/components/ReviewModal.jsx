import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button, Modal, Input } from "../components/ui";

const ReviewModal = ({ payment, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Client-side validation ───────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (rating === 0) errs.rating = "Please select a star rating.";
    if (!comment.trim()) errs.comment = "Comment is required.";
    else if (comment.trim().length < 10)
      errs.comment = "Comment must be at least 10 characters.";
    else if (comment.trim().length > 500)
      errs.comment = "Comment must be under 500 characters.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const reviewData = {
      tutorEmail: payment.tutorEmail,
      tutorName: payment.tutorName,
      studentEmail: payment.studentEmail,
      studentName: payment.studentName || "Anonymous Student",
      rating,
      comment: comment.trim(),
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
      } else {
        toast.error(res.data.message || "Could not submit review.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "You already reviewed this tutor or a server error occurred.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const footer = (
    <div className="flex gap-3 w-full">
      <Button
        variant="secondary"
        className="flex-1"
        onClick={onClose}
        disabled={submitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="review-form"
        variant="primary"
        className="flex-1"
        loading={submitting}
        disabled={submitting}
      >
        Submit Review
      </Button>
    </div>
  );

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`Rate ${payment.tutorName}`}
      size="md"
      footer={footer}
    >
      <p className="text-[var(--text-secondary)] text-sm mb-5">
        Sharing your experience helps other students find great tutors.
      </p>

      <form
        id="review-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        {/* ── Star Rating ─────────────────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2" role="group" aria-label="Star rating">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                aria-label={`${num} star${num > 1 ? "s" : ""}`}
                aria-pressed={rating >= num}
                onClick={() => {
                  setRating(num);
                  setErrors((prev) => ({ ...prev, rating: undefined }));
                }}
                className={`w-11 h-11 rounded-xl font-bold text-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 ${
                  rating >= num
                    ? "bg-yellow-400 text-white shadow-md scale-105"
                    : "bg-[var(--bg-muted)] text-[var(--text-muted)] hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                }`}
              >
                ★
              </button>
            ))}
            {rating > 0 && (
              <span className="self-center text-sm text-[var(--text-secondary)] ml-1">
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="text-red-500 text-xs mt-1" role="alert">
              {errors.rating}
            </p>
          )}
        </div>

        {/* ── Comment ─────────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="review-comment"
            className="block text-sm font-medium text-[var(--text-secondary)] mb-1"
          >
            Your Comment <span className="text-red-500">*</span>
          </label>
          <textarea
            id="review-comment"
            required
            rows="4"
            placeholder="How was the teaching style, punctuality, and communication?"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
              if (errors.comment)
                setErrors((prev) => ({ ...prev, comment: undefined }));
            }}
            className={`w-full p-3 rounded-xl bg-[var(--bg-muted)] border text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all ${
              errors.comment
                ? "border-red-400 focus:ring-red-400/50 focus:border-red-400"
                : "border-[var(--bg-border-strong)]"
            }`}
            aria-describedby={errors.comment ? "comment-error" : "comment-hint"}
            aria-invalid={!!errors.comment}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.comment ? (
              <p
                id="comment-error"
                className="text-red-500 text-xs"
                role="alert"
              >
                {errors.comment}
              </p>
            ) : (
              <p id="comment-hint" className="text-[var(--text-muted)] text-xs">
                Minimum 10 characters
              </p>
            )}
            <p
              className={`text-xs ml-auto ${
                comment.length > 500
                  ? "text-red-500"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {comment.length}/500
            </p>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal;
