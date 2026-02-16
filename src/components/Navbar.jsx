import React, { useContext } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, logOut, role } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  // Get dashboard link based on role
  const getDashboardLink = () => {
    if (role === "admin") return "/dashboard/admin";
    if (role === "tutor") return "/dashboard/tutor";
    return "/dashboard/student";
  };

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-[#632ee3] font-bold"
              : "hover:text-[#632ee3] transition-colors"
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/tuitions"
          className={({ isActive }) =>
            isActive
              ? "text-[#632ee3] font-bold"
              : "hover:text-[#632ee3] transition-colors"
          }
        >
          Tuitions
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/tutors"
          className={({ isActive }) =>
            isActive
              ? "text-[#632ee3] font-bold"
              : "hover:text-[#632ee3] transition-colors"
          }
        >
          Tutors
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive
              ? "text-[#632ee3] font-bold"
              : "hover:text-[#632ee3] transition-colors"
          }
        >
          About
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? "text-[#632ee3] font-bold"
              : "hover:text-[#632ee3] transition-colors"
          }
        >
          Contact
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 sticky top-0 z-50 shadow-md px-4 lg:px-8">
      <div className="navbar-start">
        {/* Mobile Menu Toggle */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {navLinks}
          </ul>
        </div>

        {/* Logo & Website Name */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-linear-to-br from-[#632ee3] to-[#9f62f2] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <span className="font-bold text-xl hidden sm:block">TutorHub</span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">{navLinks}</ul>
      </div>

      {/* Auth Section */}
      <div className="navbar-end gap-2">
        {user ? (
          <>
            {/* Dashboard Link */}
            <Link
              to={getDashboardLink()}
              className="btn btn-ghost hidden md:flex"
            >
              Dashboard
            </Link>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full ring ring-[#632ee3] ring-offset-base-100 ring-offset-2">
                  <img
                    src={
                      user.photoURL ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                    alt={user.displayName || "User"}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
              >
                <li className="menu-title">
                  <span className="text-sm font-bold">
                    {user.displayName || "User"}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {role || "Student"}
                  </span>
                </li>
                <li className="md:hidden">
                  <Link to={getDashboardLink()}>Dashboard</Link>
                </li>
                <li>
                  <Link to="/dashboard/student/settings">
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-red-500">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Login & Register Buttons */}
            <Link
              to="/login"
              className="btn btn-ghost text-sm font-semibold hidden sm:flex"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn bg-linear-to-br from-[#632ee3] to-[#9f62f2] text-white text-sm font-semibold border-none hover:opacity-90"
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
