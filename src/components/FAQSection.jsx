import React, { useState } from "react";
import { Link } from "react-router";

const FAQS = [
  {
    q: "How do I find a tutor on TutorHub?",
    a: "Browse our Tutors page or post a tuition request. Qualified tutors will apply directly to your post. Review their profiles, qualifications, and salary before approving one.",
  },
  {
    q: "Is TutorHub free to use for students?",
    a: "Posting a tuition request is completely free. You only pay when you approve a tutor and initiate the hiring process through our secure Stripe payment system.",
  },
  {
    q: "How does a tutor get verified?",
    a: "All tutors are reviewed by our admin team before going live. We check qualifications, experience, and profile completeness to maintain quality standards.",
  },
  {
    q: "Can I cancel or change a tutor after hiring?",
    a: "Yes. Contact our support within 48 hours of payment for refund assistance. You can also post a new tuition request to find a replacement tutor at any time.",
  },
  {
    q: "How does payment work?",
    a: "Payments are processed securely through Stripe. When you approve a tutor application, you'll be redirected to our checkout page. All transactions are tracked in your dashboard.",
  },
  {
    q: "What subjects are available?",
    a: "We cover Math, Physics, Chemistry, Biology, English, Bangla, ICT, History, Geography, and more. Tutors can also list custom subjects in their profiles.",
  },
  {
    q: "Can tutors apply from outside Dhaka?",
    a: "Absolutely. TutorHub supports both in-person and online tutoring. Tutors from anywhere in Bangladesh can apply and schedule sessions through our calendar feature.",
  },
  {
    q: "How long does it take to get a tutor?",
    a: "Most students receive their first tutor applications within 24–48 hours of posting. Popular subjects like Math and English often get responses within a few hours.",
  },
];

const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div
    className={`rounded-2xl border overflow-hidden transition-all ${
      isOpen
        ? "border-purple-300 dark:border-purple-700 shadow-sm shadow-purple-100/40 dark:shadow-purple-900/20"
        : "border-[var(--bg-border)] hover:border-[var(--bg-border-strong)]"
    }`}
  >
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-[var(--bg-elevated)] hover:bg-[var(--bg-muted)] transition-colors"
    >
      <span
        className={`text-sm font-semibold leading-snug ${
          isOpen
            ? "text-purple-600 dark:text-purple-400"
            : "text-[var(--text-primary)]"
        }`}
      >
        {faq.q}
      </span>
      <span
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-lg font-black leading-none transition-all ${
          isOpen
            ? "bg-purple-600 text-white rotate-45"
            : "bg-[var(--bg-muted)] text-[var(--text-secondary)]"
        }`}
      >
        +
      </span>
    </button>
    {isOpen && (
      <div className="px-5 pb-4 pt-1 bg-[var(--bg-surface)]">
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {faq.a}
        </p>
      </div>
    )}
  </div>
);

const FAQSection = () => {
  const [open, setOpen] = useState(0);
  const toggle = (i) => setOpen(open === i ? null : i);
  const half = Math.ceil(FAQS.length / 2);

  return (
    <section className="py-20 px-4 bg-[var(--bg-surface)] border-t border-[var(--bg-border)]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-3">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)]">
            Frequently Asked Questions
          </h2>
          <p className="text-[var(--text-secondary)] mt-3 text-sm max-w-lg mx-auto">
            Can't find your answer?{" "}
            <Link
              to="/contact"
              className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Contact our support team →
            </Link>
          </p>
        </div>

        {/* 2-col grid */}
        <div className="grid md:grid-cols-2 gap-3">
          <div className="space-y-3">
            {FAQS.slice(0, half).map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                isOpen={open === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
          <div className="space-y-3">
            {FAQS.slice(half).map((faq, i) => {
              const idx = i + half;
              return (
                <FAQItem
                  key={idx}
                  faq={faq}
                  isOpen={open === idx}
                  onToggle={() => toggle(idx)}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-4 bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-2xl px-6 py-4 shadow-sm">
            <span className="text-2xl">💬</span>
            <div className="text-left">
              <p className="text-sm font-bold text-[var(--text-primary)]">
                Still have questions?
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Our team replies within 24 hours.
              </p>
            </div>
            <Link
              to="/contact"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition shrink-0"
            >
              Ask Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
