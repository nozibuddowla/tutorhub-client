import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const contactInfo = [
  {
    icon: "📍",
    label: "Address",
    value: "123 Education Way, Dhaka, Bangladesh",
    cls: "bg-purple-600 text-white",
  },
  {
    icon: "📧",
    label: "Email",
    value: "support@tutorhub.com",
    cls: "bg-teal-600 text-white",
  },
  {
    icon: "📞",
    label: "Phone",
    value: "+880 1234 567 890",
    cls: "bg-amber-500 text-white",
  },
  {
    icon: "🕐",
    label: "Working Hours",
    value: "Sat – Thu, 9 AM – 8 PM",
    cls: "bg-blue-600 text-white",
  },
];

const faqs = [
  {
    q: "How do I find a tutor?",
    a: "Browse our Tutors page, filter by subject or location, and click 'View Profile' to learn more about any tutor.",
  },
  {
    q: "How does payment work?",
    a: "Payments are processed securely through Stripe after a student approves a tutor's application.",
  },
  {
    q: "Can I become a tutor?",
    a: "Yes! Register with a tutor account, and once verified by our admin team, you can start applying for tuition posts.",
  },
  {
    q: "What if I have a dispute?",
    a: "Contact our support team via this form or email. Our team resolves disputes within 24–48 hours.",
  },
];

const inputCls =
  "w-full px-4 py-2.5 outline-none rounded-xl text-sm transition bg-[var(--bg-muted)] border border-[var(--bg-border-strong)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500";
const labelCls =
  "block text-sm font-semibold text-[var(--text-secondary)] mb-1.5";

const EMPTY = { name: "", email: "", subject: "", message: "" };

const validate = (form) => {
  if (!form.name.trim()) return "Name is required.";
  if (!form.email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    return "Enter a valid email address.";
  if (!form.message.trim()) return "Message is required.";
  if (form.message.trim().length < 10)
    return "Message must be at least 10 characters.";
  return null;
};

const Contact = () => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // clear field error on type
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const getFieldErrors = (form) => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email.";
    if (!form.message.trim()) e.message = "Message is required.";
    else if (form.message.trim().length < 10)
      e.message = "At least 10 characters.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = getFieldErrors(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      toast.error("Please fix the errors before submitting.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/contact`, {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject || "General Inquiry",
        message: form.message.trim(),
      });
      toast.success("Message sent! We'll get back to you within 24 hours. ✉️");
      setForm(EMPTY);
      setErrors({});
      setSent(true);
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-surface)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 text-white py-24 px-4">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-purple-600 opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-teal-600 opacity-20 blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase">
            Get in Touch
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            We're Here to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent">
              Help
            </span>
          </h1>
          <p className="text-white/70 text-lg">
            Have a question, a problem, or just want to say hello? Drop us a
            message and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact info cards — solid colors */}
      <section className="max-w-5xl mx-auto px-4 mt-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="bg-[var(--bg-elevated)] rounded-2xl p-5 shadow-sm border border-[var(--bg-border)] hover:shadow-md transition text-center"
            >
              <div
                className={`w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center text-xl ${item.cls}`}
              >
                {item.icon}
              </div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1 text-[var(--text-muted)]">
                {item.label}
              </p>
              <p className="text-[var(--text-secondary)] text-sm font-semibold leading-snug">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="max-w-5xl mx-auto px-4 pb-20 grid md:grid-cols-2 gap-10">
        {/* ── Contact Form ── */}
        <div className="bg-[var(--bg-elevated)] rounded-2xl shadow-sm border border-[var(--bg-border)] p-8">
          <h2 className="text-2xl font-black text-[var(--text-primary)] mb-1">
            Send a Message
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            We typically reply within one business day.
          </p>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <span className="text-6xl">✅</span>
              <h3 className="text-xl font-black text-[var(--text-primary)]">
                Message Sent!
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-2 px-6 py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition text-sm"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`${inputCls} ${errors.name ? "border-red-500 focus:ring-red-400/40" : ""}`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className={labelCls}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    className={`${inputCls} ${errors.email ? "border-red-500 focus:ring-red-400/40" : ""}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={labelCls}>Subject</label>
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="">Select a topic...</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Tutor Registration">Tutor Registration</option>
                  <option value="Payment Issue">Payment Issue</option>
                  <option value="Dispute / Report">Dispute / Report</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe your question or issue... (min 10 characters)"
                  className={`${inputCls} resize-none ${errors.message ? "border-red-500 focus:ring-red-400/40" : ""}`}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
                <p className="text-xs text-[var(--text-muted)] mt-1 text-right">
                  {form.message.length} chars
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message ✉️"
                )}
              </button>
            </form>
          )}
        </div>

        {/* ── FAQ ── */}
        <div>
          <h2 className="text-2xl font-black text-[var(--text-primary)] mb-1">
            Frequently Asked
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            Quick answers to common questions.
          </p>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-[var(--bg-elevated)] rounded-2xl border border-[var(--bg-border)] shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-[var(--bg-muted)] transition"
                >
                  <span className="font-semibold text-[var(--text-primary)] text-sm">
                    {faq.q}
                  </span>
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black transition-all ${openFaq === i ? "bg-purple-600 text-white" : "bg-[var(--bg-muted)] text-[var(--text-secondary)]"}`}
                  >
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Social */}
          <div className="mt-8 bg-[var(--color-primary)] rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-1">Follow Us</h3>
            <p className="text-white/70 text-sm mb-4">
              Stay updated with news, tips, and new features.
            </p>
            <div className="flex gap-3">
              {["Facebook", "X (Twitter)", "LinkedIn"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold hover:bg-white/20 transition"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
