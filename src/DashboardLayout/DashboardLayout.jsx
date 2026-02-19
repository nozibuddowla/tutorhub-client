import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import axios from "axios";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const icons = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  users:
    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  book: "M4 19.5A2.5 2.5 0 016.5 17H20 M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z",
  clipboard:
    "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2",
  chart: "M18 20V10 M12 20V4 M6 20v-6",
  settings:
    "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  message: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  payment: "M2 10h20 M6 14h.01 M10 14h.01 M2 6h20v16H2z M2 6l10-4 10 4",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  close: "M18 6L6 18 M6 6l12 12",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  graduation: "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5",
  task: "M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
  wallet:
    "M20 12V22H4V12 M22 7H2v5h20V7z M12 22V7 M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z",
};

// ─── Role Configs ─────────────────────────────────────────────────────────────
const roleConfig = {
  admin: {
    label: "Admin Panel",
    accent: "#e53e3e",
    accentLight: "#fff5f5",
    accentDark: "#c53030",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    badge: "ADMIN",
    badgeColor: "#e53e3e",
    links: [
      { to: "/dashboard/admin", label: "Overview", icon: "home" },
      { type: "divider", label: "Management" },
      { to: "/dashboard/admin/users", label: "Manage Users", icon: "users" },
      {
        to: "/dashboard/admin/tuitions",
        label: "Manage Tuitions",
        icon: "clipboard",
      },
      {
        to: "/dashboard/admin/reports",
        label: "Reports & Analytics",
        icon: "chart",
      },
      { type: "divider", label: "Public View" },
      { to: "/", label: "Main Home", icon: "home" },
    ],
  },
  tutor: {
    label: "Tutor Portal",
    accent: "#6b46c1",
    accentLight: "#faf5ff",
    accentDark: "#553c9a",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #2d1b69 50%, #11998e 100%)",
    badge: "TUTOR",
    badgeColor: "#6b46c1",
    links: [
      { to: "/dashboard/tutor", label: "Overview", icon: "home" },
      { type: "divider", label: "Management" },
      {
        to: "/dashboard/tutor/applications",
        label: "My Applications",
        icon: "clipboard",
      },
      {
        to: "/dashboard/tutor/ongoing",
        label: "Ongoing Tuitions",
        icon: "book",
      },
      {
        to: "/dashboard/tutor/revenue",
        label: "Revenue History",
        icon: "wallet",
      },
      {
        to: "/dashboard/tutor/messages",
        label: "Messages",
        icon: "message",
        badge: true,
      },
      { type: "divider", label: "Public View" },
      { to: "/", label: "Main Home", icon: "home" },
    ],
  },
  student: {
    label: "Student Hub",
    accent: "#2b6cb0",
    accentLight: "#ebf8ff",
    accentDark: "#2c5282",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #1e3a5f 50%, #0d7377 100%)",
    badge: "STUDENT",
    badgeColor: "#2b6cb0",
    links: [
      { to: "/dashboard/student", label: "Overview", icon: "home" },
      { type: "divider", label: "Tuition Management" },
      {
        to: "/dashboard/student/my-tuitions",
        label: "My Tuitions",
        icon: "book",
      },
      {
        to: "/dashboard/student/post-tuition",
        label: "Post New Tuition",
        icon: "task",
      },
      {
        to: "/dashboard/student/applied-tutors",
        label: "Applied Tutors",
        icon: "users",
      },
      {
        to: "/dashboard/student/messages",
        label: "Messages",
        icon: "message",
        badge: true,
      },
      { type: "divider", label: "Account" },
      { to: "/dashboard/student/payments", label: "Payments", icon: "wallet" },
      {
        to: "/dashboard/student/settings",
        label: "Profile Settings",
        icon: "settings",
      },
      { type: "divider", label: "Public View" },
      { to: "/", label: "Home Page", icon: "home" },
    ],
  },
};

// ─── Sidebar Component ────────────────────────────────────────────────────────
const Sidebar = ({
  config,
  user,
  role,
  onLogout,
  isOpen,
  onClose,
  unreadMessages = 0,
}) => {
  return (
    <>
      {/* Backdrop (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        style={{ background: config.gradient }}
        className={`
          fixed top-0 left-0 h-screen w-64 z-40 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:h-screen
        `}
      >
        {/* Header */}
        <div className="px-6 pt-8 pb-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-lg bg-[#632ee3]">
                T
              </div>
              <p className="text-white font-bold text-sm leading-none">
                TutorHub
              </p>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden text-white/50 hover:text-white transition-colors"
            >
              <Icon d={icons.close} size={18} />
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 backdrop-blur-sm">
            <div className="relative">
              <img
                src={
                  user?.photoURL ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName || "User"}`
                }
                alt="avatar"
                className="w-10 h-10 rounded-xl object-cover"
              />
              <span
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white/10 flex items-center justify-center"
                style={{ background: config.accent }}
              >
                <span className="block w-1.5 h-1.5 rounded-full bg-white" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {user?.displayName || "User"}
              </p>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: `${config.accent}33`,
                  color: config.accent,
                }}
              >
                {config.badge}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-3 px-2">
            Navigation
          </p>
          <ul className="space-y-1">
            {config.links.map((link, index) => {
              if (link.type === "divider") {
                return (
                  <li key={`divider-${index}`} className="mt-6 mb-2">
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-2">
                      {link.label}
                    </p>
                  </li>
                );
              }

              // HANDLE REGULAR LINKS
              return (
                <li key={link.to || index}>
                  <NavLink
                    to={link.to}
                    end={link.to === `/dashboard/${role}`}
                    onClick={onClose}
                    style={({ isActive }) =>
                      isActive && link.to.includes("dashboard")
                        ? { background: config.accent }
                        : {}
                    }
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${
                isActive && link.to.includes("dashboard")
                  ? "text-white shadow-lg"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`
                    }
                  >
                    <Icon d={icons[link.icon]} size={18} />
                    <span className="flex-1">{link.label}</span>
                    {/* Unread badge on Messages link */}
                    {link.badge && unreadMessages > 0 && (
                      <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shrink-0">
                        {unreadMessages > 9 ? "9+" : unreadMessages}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 pb-6 pt-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-red-500/20 transition-all duration-200 group"
          >
            <Icon d={icons.logout} size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// ─── Dashboard Layout ─────────────────────────────────────────────────────────
const DashboardLayout = () => {
  const { user, logOut, role, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if (!user?.email) return;
    const fetchUnread = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/messages/unread/${user.email}`,
          { withCredentials: true },
        );
        setUnreadMessages(res.data.unread || 0);
      } catch {
        /* silent */
      }
    };
    fetchUnread();
    // Poll every 30 seconds for new messages
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  const currentRole = role || "";
  const config = roleConfig[currentRole] || roleConfig.student;

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        config={config}
        user={user}
        role={currentRole}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        unreadMessages={unreadMessages}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-900 transition-colors"
            >
              <Icon d={icons.menu} size={22} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {config.label}
              </h1>
              <p className="text-xs text-gray-400">
                Welcome back, {user?.displayName?.split(" ")[0] || "User"} 👋
              </p>
            </div>
          </div>

          {/* Top bar user info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <img
              src={
                user?.photoURL ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${user?.displayName || "User"}`
              }
              alt="avatar"
              className="w-9 h-9 rounded-xl object-cover ring-2"
              style={{ ringColor: config.accent }}
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
