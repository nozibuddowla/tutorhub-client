import React from "react";
import { Link } from "react-router";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* 1. About Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
              T
            </div>
            <span className="text-xl font-bold text-white">TutorHub</span>
          </div>
          <p className="text-sm leading-relaxed opacity-80">
            TutorHub is the leading platform connecting students with expert
            tutors. Our mission is to make quality education accessible and
            manageable for everyone, everywhere.
          </p>
          {/* Social Media Icons */}
          <div className="flex items-center gap-4 pt-2">
            <a href="#" className="hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
            </a>
            {/* New X Logo */}
            <a href="#" className="hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 2a2 2 0 11-2 2 2 2 0 012-2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* 2. Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-6">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link to="/" className="hover:text-indigo-400 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/tutors"
                className="hover:text-indigo-400 transition-colors"
              >
                Find a Tutor
              </Link>
            </li>
            <li>
              <Link
                to="/tuitions"
                className="hover:text-indigo-400 transition-colors"
              >
                Browse Tuitions
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="hover:text-indigo-400 transition-colors"
              >
                Join as Tutor
              </Link>
            </li>
          </ul>
        </div>

        {/* 3. Support Links */}
        <div>
          <h3 className="text-white font-bold mb-6">Support</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/faq"
                className="hover:text-indigo-400 transition-colors"
              >
                Help Center / FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="hover:text-indigo-400 transition-colors"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="hover:text-indigo-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/trust"
                className="hover:text-indigo-400 transition-colors"
              >
                Trust & Safety
              </Link>
            </li>
          </ul>
        </div>

        {/* 4. Contact Information */}
        <div>
          <h3 className="text-white font-bold mb-6">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-indigo-500">📍</span>
              <span>
                123 Education Way, Tech City,
                <br />
                Dhaka, Bangladesh
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-indigo-500">📧</span>
              <span>support@tutorhub.com</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-indigo-500">📞</span>
              <span>+880 1234 567 890</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 5. Copyright Section */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 text-center text-xs opacity-60">
        <p>
          &copy; {currentYear} TutorHub. All rights reserved. Designed with ❤️
          for better learning.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
