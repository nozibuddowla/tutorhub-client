import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";

const sections = [
  {
    id: "overview",
    title: "Overview",
    icon: "🔍",
    content: [
      'TutorHub ("we", "our", or "us") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights over it.',
      "By using TutorHub, you agree to the collection and use of information as described in this policy. We process data only for legitimate educational platform purposes.",
      "This policy applies to all users of TutorHub — students, tutors, and admins — on all platforms including our website and any future mobile applications.",
    ],
  },
  {
    id: "data-collected",
    title: "Information We Collect",
    icon: "📋",
    content: [
      "Account Information: When you register, we collect your name, email address, profile photo, and role (student or tutor). This is required to create and manage your account.",
      "Profile Data: Tutors may provide additional information such as qualifications, subjects taught, and experience. Students may provide tuition requirements, location preferences, and salary expectations.",
      "Usage Data: We automatically collect information about how you interact with the platform — pages visited, features used, session duration, and device/browser information.",
      "Payment Data: Payment transactions are handled by Stripe. TutorHub does not store credit/debit card numbers. We do store transaction records (amount, date, tuition ID, parties involved) for our payment history feature.",
      "Communications: Messages sent through our platform messaging system are stored to provide the messaging feature and to resolve disputes if needed.",
    ],
  },
  {
    id: "how-we-use",
    title: "How We Use Your Data",
    icon: "⚙️",
    content: [
      "To provide and improve the platform: We use your data to operate TutorHub, match students with tutors, process payments, and continuously improve our features.",
      "To communicate with you: We may send you service-related emails such as account confirmations, application updates, payment receipts, and session reminders.",
      "To ensure safety and security: We monitor for fraudulent activity, policy violations, and abuse. We use data to protect both students and tutors on the platform.",
      "Analytics & performance: We analyze aggregated usage data to understand how the platform is used and to make data-driven improvements. This data does not identify individual users.",
      "Legal compliance: We may use and retain data as required by applicable laws, court orders, or regulatory requirements in Bangladesh.",
    ],
  },
  {
    id: "sharing",
    title: "Data Sharing",
    icon: "🤝",
    content: [
      "With other users: Tutor profiles (name, photo, subjects, ratings) are public. Student-posted tuitions are visible to tutors. Private contact details are never shared publicly.",
      "With service providers: We share data with trusted third parties that help us operate — including Stripe (payments), Firebase (authentication), MongoDB Atlas (database), and Netlify (hosting). These providers are bound by their own privacy policies.",
      "We do not sell your personal data to advertisers or marketing companies, and never will.",
      "Legal disclosures: We may disclose your information if required by law, subpoena, or government request, or if we believe disclosure is necessary to prevent harm or protect rights.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    icon: "🍪",
    content: [
      "We use HTTP-only cookies to store your authentication token (JWT) for secure login sessions. This cookie is essential for the platform to function and cannot be disabled.",
      "We do not use advertising cookies or third-party tracking pixels. We do not track your activity across other websites.",
      "Session data is cleared when you log out or when the token expires (after 7 days of inactivity).",
    ],
  },
  {
    id: "security",
    title: "Data Security",
    icon: "🔒",
    content: [
      "We use industry-standard security measures including HTTPS encryption for all data in transit, HTTP-only cookies, JWT authentication, and role-based access controls.",
      "Our database is hosted on MongoDB Atlas with network access restrictions and encryption at rest. Only authorized personnel can access the database.",
      "Despite our best efforts, no security system is impenetrable. In the event of a data breach, we will notify affected users within 72 hours as required by applicable law.",
    ],
  },
  {
    id: "rights",
    title: "Your Rights",
    icon: "⚖️",
    content: [
      "Access: You can view your personal data at any time from your profile and dashboard. You may request a full export of your data by emailing support@tutorhub.com.",
      "Correction: You can update your profile information (name, photo) directly from Dashboard → Settings. For email changes, contact support.",
      "Deletion: You may request permanent deletion of your account and all associated data by emailing support@tutorhub.com. Deletion is processed within 7 business days.",
      "Opt-out: You may opt out of non-essential communications at any time. Authentication and transactional emails cannot be disabled as they are essential to the service.",
    ],
  },
  {
    id: "children",
    title: "Children's Privacy",
    icon: "👶",
    content: [
      "TutorHub is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13.",
      "Users between 13 and 17 should have parental consent before using the platform. Parents or guardians who believe their child has provided personal information may contact us to have it removed.",
    ],
  },
  {
    id: "updates",
    title: "Policy Updates",
    icon: "📝",
    content: [
      "We may update this Privacy Policy from time to time. When we do, we will revise the Last updated date at the top of this page.",
      "For significant changes, we will notify you via email or a prominent notice on the platform. Continued use of TutorHub after changes take effect constitutes your acceptance of the updated policy.",
      "This policy was last updated on March 1, 2026.",
    ],
  },
];

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const sectionRefs = useRef({});

  const scrollToSection = (id) => {
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveSection(id);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    Object.values(sectionRefs.current).forEach(
      (el) => el && observer.observe(el),
    );
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 text-white py-20 px-4">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-700/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-6 text-white/40 text-sm">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Privacy Policy</span>
          </div>
          <span className="inline-block bg-white/10 border border-white/20 text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Privacy{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #34d399, #a78bfa)",
              }}
            >
              Policy
            </span>
          </h1>
          <p className="text-white/60 max-w-2xl">
            We care deeply about your privacy. This policy explains exactly what
            data we collect, why we collect it, and how you can control it.
          </p>
          <p className="text-white/30 text-sm mt-4">
            Last updated: March 1, 2026
          </p>
        </div>
      </section>

      {/* Key highlights */}
      <div className="bg-[var(--bg-surface)] border-b border-[var(--bg-border)]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🚫", text: "We never sell your data" },
              { icon: "🔒", text: "End-to-end encryption" },
              { icon: "👤", text: "You control your data" },
              { icon: "📧", text: "No spam, ever" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text-secondary)]"
              >
                <span className="text-xl">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex gap-8 items-start">
        {/* Sticky sidebar — FIXED: solid active state */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
          <div className="bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-2xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4 px-2">
              Contents
            </p>
            <nav className="space-y-0.5">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                    activeSection === s.id
                      ? "bg-teal-600 text-white font-bold"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <span className="text-sm">{s.icon}</span>
                  {s.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 space-y-8">
          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              ref={(el) => (sectionRefs.current[s.id] = el)}
              className="bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-3xl p-7 scroll-mt-28"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-xl text-white">
                  {s.icon}
                </div>
                <h2 className="text-xl font-black text-[var(--text-primary)]">
                  {s.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {s.content.map((para, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm text-[var(--text-secondary)] leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2" />
                    {para}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <div className="bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-2xl p-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Questions about our Privacy Policy?{" "}
              <Link
                to="/contact"
                className="text-teal-600 font-semibold hover:underline"
              >
                Contact our support team
              </Link>{" "}
              or email{" "}
              <a
                href="mailto:support@tutorhub.com"
                className="text-teal-600 font-semibold hover:underline"
              >
                support@tutorhub.com
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
