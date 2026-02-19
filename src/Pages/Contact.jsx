import React, { useState } from "react";
import { toast } from "react-toastify";

const contactInfo = [
  {
    icon: "📍",
    label: "Address",
    value: "123 Education Way, Dhaka, Bangladesh",
    color: "#632ee3",
  },
  {
    icon: "📧",
    label: "Email",
    value: "support@tutorhub.com",
    color: "#11998e",
  },
  {
    icon: "📞",
    label: "Phone",
    value: "+880 1234 567 890",
    color: "#e85d04",
  },
  {
    icon: "🕐",
    label: "Working Hours",
    value: "Sat – Thu, 9 AM – 8 PM",
    color: "#d4ac0d",
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

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    // Simulate submission — wire to your backend or EmailJS as needed
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gray-950 text-white py-24 px-4">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[#632ee3] opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#11998e] opacity-20 blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase">
            Get in Touch
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-4">
            We're Here to{" "}
            <span className="bg-linear-to-r from-[#9f62f2] to-[#11998e] bg-clip-text text-transparent">
              Help
            </span>
          </h1>
          <p className="text-white/70 text-lg">
            Have a question, a problem, or just want to say hello? Drop us a
            message and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* ── Contact Cards ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 mt-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {contactInfo.map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition text-center"
            >
              <div
                className="w-11 h-11 rounded-xl mx-auto mb-3 flex items-center justify-center text-xl"
                style={{ background: `${item.color}18` }}
              >
                {item.icon}
              </div>
              <p
                className="text-xs font-bold uppercase tracking-wider mb-1"
                style={{ color: item.color }}
              >
                {item.label}
              </p>
              <p className="text-gray-700 text-sm font-semibold leading-snug">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Form + FAQ ────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 pb-20 grid md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-1">
            Send a Message
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            We typically reply within one business day.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#632ee3]/40 focus:border-[#632ee3] transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#632ee3]/40 focus:border-[#632ee3] transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Subject
              </label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#632ee3]/40 focus:border-[#632ee3] transition bg-white"
              >
                <option value="">Select a topic...</option>
                <option value="general">General Inquiry</option>
                <option value="tutor">Tutor Registration</option>
                <option value="payment">Payment Issue</option>
                <option value="dispute">Dispute / Report</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your question or issue in detail..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#632ee3]/40 focus:border-[#632ee3] transition resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-linear-to-r from-[#632ee3] to-[#9f62f2] text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">
            Frequently Asked
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Quick answers to common questions.
          </p>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-gray-800 text-sm">
                    {faq.q}
                  </span>
                  <span
                    className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black transition-all"
                    style={{
                      background: openFaq === i ? "#632ee3" : "#f3f4f6",
                      color: openFaq === i ? "white" : "#374151",
                    }}
                  >
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="mt-8 bg-linear-to-r from-[#632ee3] to-[#11998e] rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-1">Follow Us</h3>
            <p className="text-white/70 text-sm mb-4">
              Stay updated with news, tips, and new features.
            </p>
            <div className="flex gap-3">
              {["Facebook", "X (Twitter)", "LinkedIn"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold hover:bg-white/20 transition"
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
