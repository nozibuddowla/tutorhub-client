import React, { useState } from "react";
import { Link } from "react-router";

const categories = [
  {
    icon: "🎓",
    label: "For Students",
    color: "#6b46c1",
    faqs: [
      {
        q: "How do I post a tuition request?",
        a: "After signing up as a student, go to your Dashboard → Post Tuition. Fill in the subject, location, preferred salary, and a brief description. Your post goes live immediately and tutors can start applying.",
      },
      {
        q: "Is posting a tuition request free?",
        a: "Yes, completely free. You only pay when you approve a tutor and complete the checkout. There are no hidden fees or subscription charges for students.",
      },
      {
        q: "How do I choose the right tutor?",
        a: "Browse tutor applications on your Applied Tutors page. Each application shows the tutor's profile, qualifications, ratings, and expected salary. You can also visit their public profile page before deciding.",
      },
      {
        q: "Can I cancel after hiring a tutor?",
        a: "Contact our support team within 48 hours of payment. We review refund requests case by case. You can also post a new tuition request to find a replacement at any time.",
      },
      {
        q: "How do I track my sessions?",
        a: "Your Class Calendar in the dashboard shows all scheduled, upcoming, and past sessions. You'll also receive notifications when a tutor schedules a new session with you.",
      },
    ],
  },
  {
    icon: "👨‍🏫",
    label: "For Tutors",
    color: "#11998e",
    faqs: [
      {
        q: "How do I become a tutor on TutorHub?",
        a: "Register with the 'Tutor' role during sign-up. Complete your profile with qualifications, subjects, and a photo. Our admin team reviews new tutor profiles within 24–48 hours before activation.",
      },
      {
        q: "How do I apply for tuitions?",
        a: "Browse the Tuitions page, find a post that matches your expertise, and click Apply. You can set your expected salary and write a short pitch to the student.",
      },
      {
        q: "When do I get paid?",
        a: "Payment is processed by the student through Stripe when they approve your application. Funds are tracked in your Revenue dashboard. Payout timelines depend on your Stripe account settings.",
      },
      {
        q: "Can I apply to multiple tuitions at once?",
        a: "Yes. There's no limit on how many tuitions you can apply for simultaneously. You can track all your applications and their statuses in your Applications dashboard.",
      },
      {
        q: "What happens if a student cancels?",
        a: "If a student cancels after payment, TutorHub's support team will review the situation. Tutors are protected under our fair-use policy for sessions already delivered.",
      },
    ],
  },
  {
    icon: "💳",
    label: "Payments",
    color: "#d97706",
    faqs: [
      {
        q: "What payment methods are accepted?",
        a: "We use Stripe for all payments, which supports Visa, Mastercard, and other major credit/debit cards. We're working on adding local payment options for Bangladesh.",
      },
      {
        q: "Is my payment information secure?",
        a: "All payments are processed by Stripe, which is PCI DSS Level 1 certified — the highest level of payment security. TutorHub never stores your card details.",
      },
      {
        q: "Will I get a receipt?",
        a: "Yes. After every successful payment, a transaction record appears in your Payments dashboard. You can reference your payment ID for any disputes.",
      },
      {
        q: "Are there any platform fees?",
        a: "Currently TutorHub does not charge a platform fee on top of the tutor's quoted salary. The amount you pay is exactly what the tutor receives.",
      },
    ],
  },
  {
    icon: "⚙️",
    label: "Account & Platform",
    color: "#e53e3e",
    faqs: [
      {
        q: "How do I update my profile?",
        a: "Go to Dashboard → Settings. You can update your name, profile photo, and other details. Changes are saved immediately and reflected across the platform.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "On the Login page, click 'Forgot password?' and enter your email. You'll receive a reset link from Firebase Auth within a few minutes. Check your spam folder if you don't see it.",
      },
      {
        q: "Can I switch roles from student to tutor?",
        a: "Role changes require admin approval. Contact support@tutorhub.com with your request and qualifications. An admin will review and update your role within 48 hours.",
      },
      {
        q: "How do I delete my account?",
        a: "Contact support@tutorhub.com from your registered email. We'll process the request within 7 business days and permanently delete all your data per our Privacy Policy.",
      },
    ],
  },
];

const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div
    className={`rounded-2xl border overflow-hidden transition-all ${
      isOpen
        ? "border-purple-300 dark:border-purple-700 shadow-sm"
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
      <div className="px-5 pb-5 pt-2 bg-[var(--bg-surface)]">
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {faq.a}
        </p>
      </div>
    )}
  </div>
);

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState(0);

  const handleCategoryChange = (i) => {
    setActiveCategory(i);
    setOpenIndex(0);
  };

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);
  const cat = categories[activeCategory];

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 text-white py-24 px-4">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            Help Center
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-5">
            Frequently Asked{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #a78bfa, #34d399)",
              }}
            >
              Questions
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Everything you need to know about TutorHub. Can't find the answer?{" "}
            <Link
              to="/contact"
              className="text-purple-400 hover:underline font-semibold"
            >
              Contact us →
            </Link>
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => handleCategoryChange(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border ${
                  activeCategory === i
                    ? "text-white border-transparent shadow-lg"
                    : "bg-[var(--bg-elevated)] border-[var(--bg-border)] text-[var(--text-secondary)] hover:border-[var(--bg-border-strong)] hover:text-[var(--text-primary)]"
                }`}
                style={activeCategory === i ? { background: cat.color } : {}}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          <div className="space-y-3 max-w-3xl mx-auto">
            {cat.faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>

          {/* Still need help */}
          <div className="mt-14 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-5 bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-3xl px-8 py-6 shadow-sm">
              <span className="text-4xl">🤝</span>
              <div className="text-left">
                <p className="font-bold text-[var(--text-primary)]">
                  Still need help?
                </p>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  Our support team is available Mon–Sat, 9am–6pm (BST).
                </p>
              </div>
              <Link
                to="/contact"
                className="px-6 py-2.5 text-white text-sm font-bold rounded-xl hover:opacity-90 transition shrink-0"
                style={{
                  background: "linear-gradient(135deg, #6b46c1, #11998e)",
                }}
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
