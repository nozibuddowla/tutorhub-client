import React from "react";
import { Link } from "react-router";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/tutors", label: "Find a Tutor" },
    { to: "/tuitions", label: "Browse Tuitions" },
    { to: "/about", label: "About Us" },
    { to: "/signup", label: "Join as Tutor" },
  ];

  const supportLinks = [
    { to: "/faq", label: "Help Center / FAQ" },
    { to: "/about", label: "About TutorHub" },
    { to: "/terms", label: "Terms of Service" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/contact", label: "Trust & Safety" },
  ];

  return (
    <footer className="bg-gray-950 dark:bg-[var(--bg-base)] text-gray-400 pt-16 pb-8 border-t border-gray-800 dark:border-[var(--bg-border)]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* 1. Brand */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-lg shrink-0 bg-gradient-to-br from-purple-700 to-teal-500">
              T
            </div>
            <span className="text-xl font-black text-white">TutorHub</span>
          </Link>

          <p className="text-sm leading-relaxed text-gray-400">
            TutorHub connects students with expert tutors across Bangladesh.
            Quality education, made accessible for everyone.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-3 pt-1">
            {[
              {
                label: "Facebook",
                href: "https://facebook.com",
                path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
              },
              {
                label: "X / Twitter",
                href: "https://x.com",
                path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
              },
              {
                label: "LinkedIn",
                href: "https://linkedin.com",
                path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 2a2 2 0 11-2 2 2 2 0 012-2z",
              },
            ].map(({ label, href, path }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-gray-800 dark:bg-[var(--bg-muted)] flex items-center justify-center text-gray-400 hover:text-white hover:bg-purple-600 transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d={path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* 2. Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">
            Quick Links
          </h3>
          <ul className="space-y-3">
            {quickLinks.map(({ to, label }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-purple-400 transition-colors shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Support */}
        <div>
          <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">
            Support
          </h3>
          <ul className="space-y-3">
            {supportLinks.map(({ to, label }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-purple-400 transition-colors shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. Contact */}
        <div>
          <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">
            Contact Us
          </h3>
          <ul className="space-y-4">
            {[
              {
                icon: "📍",
                content: (
                  <>
                    123 Education Way, Tech City,
                    <br />
                    Dhaka, Bangladesh
                  </>
                ),
              },
              {
                icon: "📧",
                content: (
                  <a
                    href="mailto:support@tutorhub.com"
                    className="hover:text-purple-400 transition-colors"
                  >
                    support@tutorhub.com
                  </a>
                ),
              },
              {
                icon: "📞",
                content: (
                  <a
                    href="tel:+8801234567890"
                    className="hover:text-purple-400 transition-colors"
                  >
                    +880 1234 567 890
                  </a>
                ),
              },
            ].map(({ icon, content }, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-gray-400"
              >
                <span className="mt-0.5 shrink-0">{icon}</span>
                <span>{content}</span>
              </li>
            ))}
          </ul>

          {/* Newsletter hint */}
          <div className="mt-6 p-4 rounded-2xl bg-gray-800/60 dark:bg-[var(--bg-muted)] border border-gray-700 dark:border-[var(--bg-border)]">
            <p className="text-xs text-gray-400 mb-3 font-semibold">
              📬 Get updates from TutorHub
            </p>
            <Link
              to="/contact"
              className="block w-full text-center text-xs font-bold text-white py-2 rounded-xl hover:opacity-90 transition bg-gradient-to-br from-purple-700 to-teal-500"
            >
              Subscribe →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 mt-14 pt-8 border-t border-gray-800 dark:border-[var(--bg-border)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>
            &copy; {currentYear} TutorHub. All rights reserved. Designed with ❤️
            for better learning.
          </p>
          <div className="flex items-center gap-5">
            <Link
              to="/privacy"
              className="hover:text-purple-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="hover:text-purple-400 transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/contact"
              className="hover:text-purple-400 transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
