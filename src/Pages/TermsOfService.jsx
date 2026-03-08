import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: "✅",
    content: [
      'By accessing or using TutorHub ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.',
      "TutorHub reserves the right to update or modify these Terms at any time. Continued use of the Platform after any changes constitutes your acceptance of the new Terms.",
      "These Terms apply to all visitors, users, and others who access or use the Platform, including students, tutors, and administrators.",
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility & Account Registration",
    icon: "👤",
    content: [
      "You must be at least 13 years old to use TutorHub. Users under 18 should have parental or guardian consent before registering.",
      "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.",
      "You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.",
      "TutorHub reserves the right to suspend or terminate accounts that violate these Terms or engage in fraudulent, abusive, or harmful behavior.",
    ],
  },
  {
    id: "roles",
    title: "User Roles & Responsibilities",
    icon: "🎭",
    content: [
      "Students may post tuition requests, browse tutors, hire approved tutors, and make payments through the Platform. Students are responsible for the accuracy of their tuition requirements.",
      "Tutors may apply for tuition posts, communicate with students, and receive payments through the Platform. Tutors must provide accurate qualification and experience information.",
      "Tutors are independent contractors, not employees of TutorHub. TutorHub does not guarantee employment or a minimum number of tuition assignments.",
      "Admins manage platform operations, verify tutors, and approve or reject tuition posts. Admin decisions are final in matters of platform governance.",
    ],
  },
  {
    id: "payments",
    title: "Payments & Refunds",
    icon: "💳",
    content: [
      "All payments are processed through Stripe, a third-party payment processor. By making a payment, you also agree to Stripe's Terms of Service.",
      "Payments are made by students to hire approved tutors. The amount paid is the tutor's quoted salary as shown at checkout — no additional platform fee is currently charged.",
      "Refund requests must be submitted within 48 hours of payment. TutorHub reviews each request and reserves the right to approve or deny refunds at its discretion.",
      "In cases of fraud or unauthorized payments, please contact support@tutorhub.com immediately. We will investigate and take appropriate action.",
    ],
  },
  {
    id: "conduct",
    title: "Code of Conduct",
    icon: "🤝",
    content: [
      "Users must not harass, abuse, threaten, or discriminate against other users on the basis of race, gender, religion, nationality, disability, or any other characteristic.",
      "Users must not post false, misleading, or fraudulent information on their profiles or tuition posts.",
      "Users must not attempt to circumvent TutorHub's payment system by conducting transactions outside the Platform.",
      "Any form of spam, unsolicited advertising, or phishing attempts is strictly prohibited and will result in immediate account termination.",
    ],
  },
  {
    id: "intellectual",
    title: "Intellectual Property",
    icon: "©️",
    content: [
      "All content on TutorHub — including but not limited to logos, designs, text, graphics, and software — is the property of TutorHub and is protected by applicable intellectual property laws.",
      "Users retain ownership of content they submit (profile information, tuition posts, messages). By submitting content, you grant TutorHub a non-exclusive license to display and use that content in connection with the Platform.",
      "You may not reproduce, distribute, or create derivative works from TutorHub's proprietary content without express written permission.",
    ],
  },
  {
    id: "limitation",
    title: "Limitation of Liability",
    icon: "⚖️",
    content: [
      "TutorHub is a marketplace that connects students and tutors. We do not guarantee the quality, safety, or legality of tutors or tuition sessions.",
      "To the maximum extent permitted by law, TutorHub shall not be liable for any indirect, incidental, special, or consequential damages arising from use of the Platform.",
      "TutorHub's total liability for any claim arising from these Terms shall not exceed the amount paid by you to TutorHub in the 30 days preceding the claim.",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    icon: "🚫",
    content: [
      "TutorHub may terminate or suspend your account at any time, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, TutorHub, or third parties.",
      "You may delete your account at any time by contacting support@tutorhub.com. Account deletion is permanent and cannot be undone.",
      "Upon termination, your right to use the Platform ceases immediately. Provisions that by their nature should survive termination will remain in effect.",
    ],
  },
  {
    id: "contact",
    title: "Contact Information",
    icon: "📬",
    content: [
      "If you have any questions about these Terms of Service, please contact us at support@tutorhub.com.",
      "Our mailing address: 123 Education Way, Tech City, Dhaka, Bangladesh.",
      "These Terms were last updated on March 1, 2026. We encourage you to review them periodically.",
    ],
  },
];

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState("acceptance");
  const sectionRefs = useRef({});

  const scrollToSection = (id) => {
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setActiveSection(id);
  };

  // Update active section on scroll
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
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-6 text-white/40 text-sm">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Terms of Service</span>
          </div>
          <span className="inline-block bg-white/10 border border-white/20 text-xs font-bold px-4 py-1.5 rounded-full mb-5 uppercase tracking-widest">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Terms of{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #a78bfa, #34d399)",
              }}
            >
              Service
            </span>
          </h1>
          <p className="text-white/60 max-w-2xl">
            Please read these terms carefully before using TutorHub. They govern
            your use of the platform and outline your rights and
            responsibilities.
          </p>
          <p className="text-white/30 text-sm mt-4">
            Last updated: March 1, 2026
          </p>
        </div>
      </section>

      {/* Main layout */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex gap-8 items-start">
        {/* Sticky sidebar */}
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
                      ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold"
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
        <main className="flex-1 min-w-0 space-y-10">
          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              ref={(el) => (sectionRefs.current[s.id] = el)}
              className="bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-3xl p-7 scroll-mt-28"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-xl">
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
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-2" />
                    {para}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* Footer note */}
          <div className="bg-[var(--bg-surface)] border border-[var(--bg-border)] rounded-2xl p-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              Questions about our Terms?{" "}
              <Link
                to="/contact"
                className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
              >
                Contact our support team
              </Link>{" "}
              or email us at{" "}
              <a
                href="mailto:support@tutorhub.com"
                className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
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

export default TermsOfService;
