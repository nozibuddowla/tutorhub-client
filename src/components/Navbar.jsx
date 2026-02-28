import React, { useContext } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import { toast } from "react-toastify";
import { useDarkModeContext } from "../RootLayout/RootLayout";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

// ── Sun / Moon icons ──────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// ── Dark Mode Toggle Button ───────────────────────────────────────────────────
const DarkModeToggle = ({ isDark, toggle }) => {
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
        bg-gray-100 text-gray-600 hover:bg-gray-200
        dark:bg-(--bg-muted) dark:text-(--text-secondary) dark:hover:bg-(--bg-border-strong)"
    >
      {isDark ? <IoSunnyOutline size={18} /> : <IoMoonOutline size={18} />}
    </button>
  );
};

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logOut, role } = useContext(AuthContext);
  const { isDark, toggle } = useDarkModeContext();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const getDashboardLink = () => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "tutor") return "/dashboard/tutor";
    return "/dashboard/student";
  };

  const getProfileLink = () => {
    if (role === "admin") return "/dashboard/admin/settings";
    if (role === "tutor") return "/dashboard/tutor/settings";
    return "/dashboard/student/settings";
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-[#6b46c1] font-bold"
      : "text-(--text-secondary) hover:text-[#6b46c1] transition-colors";

  const navLinks = (
    <>
      {[
        { to: "/", label: "Home" },
        { to: "/tuitions", label: "Tuitions" },
        { to: "/tutors", label: "Tutors" },
        { to: "/about", label: "About" },
        { to: "/contact", label: "Contact" },
      ].map(({ to, label }) => (
        <li key={to}>
          <NavLink to={to} className={linkClass}>
            {label}
          </NavLink>
        </li>
      ))}
    </>
  );

  return (
    <div
      className="navbar sticky top-0 z-50 px-4 lg:px-8
      bg-[var(--bg-elevated)] border-b border-[var(--bg-border)]
      shadow-sm dark:shadow-[0_1px_12px_rgba(0,0,0,0.4)"
    >
      {/* ── Start ── */}
      <div className="navbar-start">
        {/* Mobile hamburger */}
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost lg:hidden text-(--text-secondary)"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content rounded-box z-10 mt-3 w-52 p-2 shadow-lg
              bg-[var(--bg-elevated)] border border-[var(--bg-border)]"
          >
            {navLinks}
          </ul>
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #6b46c1, #11998e)" }}
          >
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <span className="font-bold text-xl hidden sm:block text-[var(--text-primary)]">
            TutorHub
          </span>
        </Link>
      </div>

      {/* ── Center ── */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">{navLinks}</ul>
      </div>

      {/* ── End ── */}
      <div className="navbar-end gap-2">
        {/* Dark mode toggle */}
        <DarkModeToggle isDark={isDark} toggle={toggle} />

        {user ? (
          <>
            <Link
              to={getDashboardLink()}
              className="btn btn-ghost hidden md:flex text-(--text-secondary)
                hover:text-[var(--text-primary)] hover:bg-(--bg-muted)"
            >
              Dashboard
            </Link>

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div
                  className="w-10 rounded-full ring ring-[#6b46c1] ring-offset-2
                  ring-offset-(--bg-elevated)"
                >
                  <img
                    src={
                      user.photoURL ||
                      "https://api.dicebear.com/7.x/initials/svg?seed=" +
                        user.displayName
                    }
                    alt={user.displayName || "User"}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content rounded-box z-10 mt-3 w-52 p-2 shadow-lg
                  bg-[var(--bg-elevated)] border border-[var(--bg-border)]"
              >
                <li className="menu-title px-4 py-2">
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {user.displayName || "User"}
                  </span>
                  <span className="text-xs text-(--text-muted) capitalize block">
                    {role || "Student"}
                  </span>
                </li>
                <li className="md:hidden">
                  <Link
                    to={getDashboardLink()}
                    className="text-(--text-secondary) hover:text-[var(--text-primary)]"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to={getProfileLink()}
                    className="text-(--text-secondary) hover:text-[var(--text-primary)]"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="btn btn-ghost text-sm font-semibold hidden sm:flex
                text-(--text-secondary) hover:text-[var(--text-primary)]
                hover:bg-(--bg-muted)"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn text-white text-sm font-semibold border-none hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #6b46c1, #11998e)",
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
