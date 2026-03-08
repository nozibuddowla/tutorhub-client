// ─── PostTuition.jsx ─────────────────────────────────────────────────────────
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../Provider/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Input, Card } from "../../../components/ui";

const PostTuition = () => {
  const { user } = useContext(AuthContext);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [fields, setFields] = useState({
    subject: "",
    salary: "",
    location: "",
    description: "",
  });

  // ── Helpers ──────────────────────────────────────────────────────────────
  const set = (key) => (e) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // ── Client-side validation ───────────────────────────────────────────────
  const validate = () => {
    const errs = {};

    if (!fields.subject.trim()) errs.subject = "Subject is required.";
    else if (fields.subject.trim().length < 2)
      errs.subject = "Subject must be at least 2 characters.";

    const sal = Number(fields.salary);
    if (!fields.salary) errs.salary = "Salary is required.";
    else if (isNaN(sal) || sal <= 0)
      errs.salary = "Enter a valid positive amount.";
    else if (sal < 500) errs.salary = "Minimum salary is ৳500.";
    else if (sal > 100000) errs.salary = "Maximum salary is ৳1,00,000.";

    if (!fields.location.trim()) errs.location = "Location is required.";
    else if (fields.location.trim().length < 3)
      errs.location = "Enter a valid location.";

    if (!fields.description.trim())
      errs.description = "Description is required.";
    else if (fields.description.trim().length < 20)
      errs.description = "Description must be at least 20 characters.";
    else if (fields.description.trim().length > 1000)
      errs.description = "Description must be under 1000 characters.";

    return errs;
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      const firstErr = document.querySelector("[aria-invalid='true']");
      firstErr?.focus();
      return;
    }

    setSubmitting(true);
    const tuitionData = {
      studentName: user?.displayName,
      studentEmail: user?.email,
      subject: fields.subject.trim(),
      location: fields.location.trim(),
      salary: Number(fields.salary),
      description: fields.description.trim(),
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
        setFields({ subject: "", salary: "", location: "", description: "" });
        setErrors({});
      } else {
        toast.error(res.data.message || "Failed to publish tuition.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Failed to post tuition. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <Card.Header divided>
          <div>
            <Card.Title>Post New Tuition</Card.Title>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              Fill in the details below. All fields are required.
            </p>
          </div>
        </Card.Header>

        <Card.Body>
          <form
            id="post-tuition-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >
            {/* ── Row 1: Subject + Salary ──────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="subject"
                label="Subject"
                required
                placeholder="Ex: Mathematics, Physics"
                value={fields.subject}
                onChange={set("subject")}
                error={errors.subject}
                icon="📚"
                aria-invalid={!!errors.subject}
              />
              <Input
                id="salary"
                label="Monthly Salary (BDT)"
                required
                type="number"
                placeholder="Ex: 5000"
                value={fields.salary}
                onChange={set("salary")}
                error={errors.salary}
                icon="৳"
                min={500}
                max={100000}
                aria-invalid={!!errors.salary}
              />
            </div>

            {/* ── Location ─────────────────────────────────────────────── */}
            <Input
              id="location"
              label="Location"
              required
              placeholder="Ex: Mirpur, Dhaka"
              value={fields.location}
              onChange={set("location")}
              error={errors.location}
              icon="📍"
              aria-invalid={!!errors.location}
            />

            {/* ── Description ──────────────────────────────────────────── */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-1"
              >
                Description{" "}
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
              </label>
              <textarea
                id="description"
                required
                rows="4"
                placeholder="Describe what you need: student level, days per week, preferred time, special requirements..."
                value={fields.description}
                onChange={set("description")}
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? "description-error" : "description-hint"
                }
                className={`w-full p-3 rounded-xl bg-[var(--bg-muted)] border text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all ${
                  errors.description
                    ? "border-red-400 focus:ring-red-400/50 focus:border-red-400"
                    : "border-[var(--bg-border-strong)]"
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description ? (
                  <p
                    id="description-error"
                    className="text-red-500 text-xs"
                    role="alert"
                  >
                    {errors.description}
                  </p>
                ) : (
                  <p
                    id="description-hint"
                    className="text-[var(--text-muted)] text-xs"
                  >
                    Minimum 20 characters
                  </p>
                )}
                <p
                  className={`text-xs ml-auto ${
                    fields.description.length > 1000
                      ? "text-red-500"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {fields.description.length}/1000
                </p>
              </div>
            </div>
          </form>
        </Card.Body>

        <Card.Footer divided>
          <Button
            type="submit"
            form="post-tuition-form"
            variant="primary"
            size="lg"
            full
            loading={submitting}
            disabled={submitting}
          >
            {submitting ? "Publishing..." : "Publish Post"}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default PostTuition;
