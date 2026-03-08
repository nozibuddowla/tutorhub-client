import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import { toast } from "react-toastify";
import { useDarkModeContext } from "../RootLayout/RootLayout";
import {
  IoMoonOutline,
  IoSunnyOutline,
  IoClose,
  IoMenu,
} from "react-icons/io5";

// ── Dark Mode Toggle ──────────────────────────────────────────────────────────
const DarkModeToggle = ({ isDark, toggle }) => (
  <button
    onClick={toggle}
    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all
      bg-gray-100 text-gray-600 hover:bg-gray-200
      dark:bg-[var(--bg-muted)] dark:text-[var(--text-secondary)] dark:hover:bg-[var(--bg-border-strong)]"
  >
    {isDark ? <IoSunnyOutline size={18} /> : <IoMoonOutline size={18} />}
  </button>
);

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logOut, role } = useContext(AuthContext);
  const { isDark, toggle } = useDarkModeContext();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Failed to logout");
    }
  };

  const getDashboardLink = () => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "tutor") return "/dashboard/tutor";
    return "/dashboard/student";
  };
  const getMessagesLink = () =>
    role === "tutor"
      ? "/dashboard/tutor/messages"
      : "/dashboard/student/messages";
  const getCalendarLink = () =>
    role === "tutor"
      ? "/dashboard/tutor/calendar"
      : "/dashboard/student/calendar";
  const getSettingsLink = () => {
    if (role === "admin") return "/dashboard/admin/settings";
    if (role === "tutor") return "/dashboard/tutor/settings";
    return "/dashboard/student/settings";
  };

  const linkCls = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? "text-purple-600 dark:text-purple-400 font-bold"
        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
    }`;

  // ── Public links — 5 routes (logged out) ─────────────────────────────────
  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/tuitions", label: "Tuitions" },
    { to: "/tutors", label: "Tutors" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  // ── Logged-in extra desktop links (makes 6+ total routes when logged in) ──
  const loggedInLinks = [
    { to: getDashboardLink(), icon: "⚡", label: "Dashboard" },
    { to: getMessagesLink(), icon: "💬", label: "Messages" },
    { to: getCalendarLink(), icon: "📅", label: "Calendar" },
    { to: getSettingsLink(), icon: "⚙️", label: "Settings" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[var(--bg-elevated)] border-b border-[var(--bg-border)] shadow-sm dark:shadow-[0_1px_12px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* ── Logo ─────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #6b46c1, #11998e)",
              }}
            >
              <span className="text-white font-black text-lg">T</span>
            </div>
            <span className="font-black text-xl hidden sm:block text-[var(--text-primary)]">
              TutorHub
            </span>
          </Link>

          {/* ── Desktop Center Nav ────────────────────────────── */}
          <ul className="hidden lg:flex items-center gap-5">
            {/* Public links always visible */}
            {publicLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className={linkCls} end={to === "/"}>
                  {label}
                </NavLink>
              </li>
            ))}
            {/* Extra links when logged in → total 8 routes in nav */}
            {user &&
              loggedInLinks.slice(0, 2).map(({ to, label }) => (
                <li key={to}>
                  <NavLink to={to} className={linkCls}>
                    {label}
                  </NavLink>
                </li>
              ))}
          </ul>

          {/* ── Desktop End ───────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-2">
            <DarkModeToggle isDark={isDark} toggle={toggle} />

            {user ? (
              /* ── Profile Dropdown ── */
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-label="Open profile menu"
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-[var(--bg-muted)] transition"
                >
                  <img
                    src={
                      user.photoURL ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`
                    }
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-purple-500/40"
                  />
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold text-[var(--text-primary)] leading-none">
                      {user.displayName?.split(" ")[0] || "User"}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] capitalize mt-0.5">
                      {role || "student"}
                    </p>
                  </div>
                  <svg
                    className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform ${profileOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-2xl shadow-2xl overflow-hidden z-50">
                    {/* Header */}
                    <div className="px-4 py-3 bg-[var(--bg-surface)] border-b border-[var(--bg-border)]">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.photoURL ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`
                          }
                          alt={user.displayName || "User"}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/30"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                            {user.displayName || "User"}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 capitalize">
                        {role || "student"}
                      </span>
                    </div>

                    {/* Menu items — all 4 logged-in routes */}
                    <div className="py-1.5">
                      {loggedInLinks.map(({ to, icon, label }) => (
                        <Link
                          key={to}
                          to={to}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          <span className="w-5 text-center text-base">
                            {icon}
                          </span>
                          {label}
                        </Link>
                      ))}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-[var(--bg-border)] py-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <span className="w-5 text-center text-base">🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] rounded-xl transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-bold text-white rounded-xl hover:opacity-90 transition shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #6b46c1, #11998e)",
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile: dark toggle + hamburger ──────────────── */}
          <div className="flex lg:hidden items-center gap-2">
            <DarkModeToggle isDark={isDark} toggle={toggle} />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--bg-border-strong)] transition"
            >
              {mobileOpen ? <IoClose size={20} /> : <IoMenu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ─────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <div className="absolute top-16 left-0 right-0 bg-[var(--bg-elevated)] border-b border-[var(--bg-border)] shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-3 space-y-0.5">
              {/* Public nav links */}
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-3 pt-2 pb-1.5">
                Navigation
              </p>
              {publicLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}

              {/* Logged-in links */}
              {user && (
                <>
                  <div className="pt-2">
                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-3 pt-2 pb-1.5">
                      My Account
                    </p>
                    {loggedInLinks.map(({ to, icon, label }) => (
                      <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold"
                              : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]"
                          }`
                        }
                      >
                        <span className="text-base w-5 text-center">
                          {icon}
                        </span>
                        {label}
                      </NavLink>
                    ))}
                  </div>

                  {/* User card + logout */}
                  <div className="mt-2 pt-3 border-t border-[var(--bg-border)]">
                    <div className="flex items-center gap-3 px-3 py-2 mb-1">
                      <img
                        src={
                          user.photoURL ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`
                        }
                        alt={user.displayName || "User"}
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/30"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] truncate capitalize">
                          {role || "student"} · {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <span className="text-base w-5 text-center">🚪</span>
                      Logout
                    </button>
                  </div>
                </>
              )}

              {/* Logged-out auth buttons */}
              {!user && (
                <div className="pt-3 pb-2 border-t border-[var(--bg-border)] mt-2 flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="w-full py-3 text-center text-sm font-semibold text-[var(--text-secondary)] border border-[var(--bg-border-strong)] rounded-xl hover:bg-[var(--bg-muted)] transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full py-3 text-center text-sm font-bold text-white rounded-xl hover:opacity-90 transition"
                    style={{
                      background: "linear-gradient(135deg, #6b46c1, #11998e)",
                    }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
