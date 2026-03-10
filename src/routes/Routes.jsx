import { createBrowserRouter, Outlet } from "react-router";
import { lazy, Suspense } from "react";
import Loading from "../components/Loading";
import ProtectedRoute from "./ProtectedRoute";

// ── Eagerly loaded (critical path — always needed) ────────────────────────────
import RootLayout from "../RootLayout/RootLayout";
import Home from "../Pages/Home/Home";
import NotFound from "../components/NotFound";

// ── Lazy loaded helper ────────────────────────────────────────────────────────
const lazy_page = (importFn) => {
  const Component = lazy(importFn);
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

// ── Public pages (lazy) ───────────────────────────────────────────────────────
const Login = () => lazy_page(() => import("../Pages/Login"));
const Register = () => lazy_page(() => import("../Pages/Register"));
const AllTuitions = () => lazy_page(() => import("../Pages/AllTuitions"));
const TuitionDetails = () => lazy_page(() => import("../Pages/TuitionDetails"));
const AllTutors = () => lazy_page(() => import("../Pages/AllTutors"));
const TutorProfile = () => lazy_page(() => import("../Pages/TutorProfile"));
const About = () => lazy_page(() => import("../Pages/About"));
const Contact = () => lazy_page(() => import("../Pages/Contact"));
const FAQ = () => lazy_page(() => import("../Pages/FAQ"));
const TermsOfService = () => lazy_page(() => import("../Pages/TermsOfService"));
const PrivacyPolicy = () => lazy_page(() => import("../Pages/PrivacyPolicy"));

// ── Auth pages (lazy) ─────────────────────────────────────────────────────────
const PaymentCheckout = () =>
  lazy_page(() => import("../Pages/PaymentCheckout"));

// ── Dashboard layout + shared (lazy) ─────────────────────────────────────────
const DashboardLayout = () =>
  lazy_page(() => import("../DashboardLayout/DashboardLayout"));
const ProfileSettings = () =>
  lazy_page(() => import("../Pages/Dashboard/Student/ProfileSettings"));
const MessagesPage = () =>
  lazy_page(() => import("../Pages/Dashboard/MessagesPage"));
const ClassCalendar = () =>
  lazy_page(() => import("../Pages/Dashboard/ClassCalendar"));

// ── Student pages (lazy) ──────────────────────────────────────────────────────
const StudentDashboard = () =>
  lazy_page(() => import("../Pages/Dashboard/Student/StudentDashboard"));
const StudentTuitions = () =>
  lazy_page(() => import("../Pages/Dashboard/Student/StudentTuitions"));
const PostTuition = () =>
  lazy_page(() => import("../Pages/Dashboard/Student/PostTuition"));
const AppliedTutors = () =>
  lazy_page(() => import("../Pages/Dashboard/Student/AppliedTutors"));
const StudentPayments = () =>
  lazy_page(() => import("../Pages/Dashboard/Student/StudentPayments"));

// ── Tutor pages (lazy) ────────────────────────────────────────────────────────
const TutorDashboard = () =>
  lazy_page(() => import("../Pages/Dashboard/TutorDashboard"));
const TutorApplications = () =>
  lazy_page(() => import("../Pages/TutorApplications"));
const TutorOngoingTuitions = () =>
  lazy_page(() => import("../Pages/TutorOngoingTuitions"));
const TutorRevenue = () => lazy_page(() => import("../Pages/TutorRevenue"));

// ── Admin pages (lazy) ────────────────────────────────────────────────────────
const AdminDashboard = () =>
  lazy_page(() => import("../Pages/Dashboard/AdminDashboard"));
const ManageUsers = () => lazy_page(() => import("../Pages/ManageUsers"));
const ManageTuitions = () => lazy_page(() => import("../Pages/ManageTuitions"));
const Reports = () => lazy_page(() => import("../Pages/Reports"));

// ── Protected wrapper helper ──────────────────────────────────────────────────
const Guard = ({ roles, children }) => (
  <ProtectedRoute allowedRoles={roles}>{children}</ProtectedRoute>
);

// ── Router ────────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    hydrateFallback: <Loading />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Register /> },
      { path: "tuitions", element: <AllTuitions /> },
      { path: "tuitions/:id", element: <TuitionDetails /> },
      { path: "tutors", element: <AllTutors /> },
      { path: "tutors/:id", element: <TutorProfile /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "faq", element: <FAQ /> },
      { path: "terms", element: <TermsOfService /> },
      { path: "privacy", element: <PrivacyPolicy /> },
    ],
  },

  {
    path: "/payment/checkout",
    element: (
      <Guard roles={["student"]}>
        <PaymentCheckout />
      </Guard>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <Guard roles={["student", "tutor", "admin"]}>
        <DashboardLayout />
      </Guard>
    ),
    children: [
      // ── Student ──────────────────────────────────────────────────────────
      {
        path: "student",
        element: (
          <Guard roles={["student"]}>
            <StudentDashboard />
          </Guard>
        ),
      },
      {
        path: "student/my-tuitions",
        element: (
          <Guard roles={["student"]}>
            <StudentTuitions />
          </Guard>
        ),
      },
      {
        path: "student/post-tuition",
        element: (
          <Guard roles={["student"]}>
            <PostTuition />
          </Guard>
        ),
      },
      {
        path: "student/applied-tutors",
        element: (
          <Guard roles={["student"]}>
            <AppliedTutors />
          </Guard>
        ),
      },
      {
        path: "student/messages",
        element: (
          <Guard roles={["student"]}>
            <MessagesPage />
          </Guard>
        ),
      },
      {
        path: "student/calendar",
        element: (
          <Guard roles={["student"]}>
            <ClassCalendar />
          </Guard>
        ),
      },
      {
        path: "student/payments",
        element: (
          <Guard roles={["student"]}>
            <StudentPayments />
          </Guard>
        ),
      },
      {
        path: "student/settings",
        element: (
          <Guard roles={["student"]}>
            <ProfileSettings />
          </Guard>
        ),
      },

      // ── Tutor ─────────────────────────────────────────────────────────────
      {
        path: "tutor",
        element: (
          <Guard roles={["tutor"]}>
            <TutorDashboard />
          </Guard>
        ),
      },
      {
        path: "tutor/applications",
        element: (
          <Guard roles={["tutor"]}>
            <TutorApplications />
          </Guard>
        ),
      },
      {
        path: "tutor/ongoing",
        element: (
          <Guard roles={["tutor"]}>
            <TutorOngoingTuitions />
          </Guard>
        ),
      },
      {
        path: "tutor/revenue",
        element: (
          <Guard roles={["tutor"]}>
            <TutorRevenue />
          </Guard>
        ),
      },
      {
        path: "tutor/messages",
        element: (
          <Guard roles={["tutor"]}>
            <MessagesPage />
          </Guard>
        ),
      },
      {
        path: "tutor/calendar",
        element: (
          <Guard roles={["tutor"]}>
            <ClassCalendar />
          </Guard>
        ),
      },
      {
        path: "tutor/settings",
        element: (
          <Guard roles={["tutor"]}>
            <ProfileSettings />
          </Guard>
        ),
      },

      // ── Admin ─────────────────────────────────────────────────────────────
      {
        path: "admin",
        element: (
          <Guard roles={["admin"]}>
            <AdminDashboard />
          </Guard>
        ),
      },
      {
        path: "admin/users",
        element: (
          <Guard roles={["admin"]}>
            <ManageUsers />
          </Guard>
        ),
      },
      {
        path: "admin/tuitions",
        element: (
          <Guard roles={["admin"]}>
            <ManageTuitions />
          </Guard>
        ),
      },
      {
        path: "admin/reports",
        element: (
          <Guard roles={["admin"]}>
            <Reports />
          </Guard>
        ),
      },
      {
        path: "admin/settings",
        element: (
          <Guard roles={["admin"]}>
            <ProfileSettings />
          </Guard>
        ),
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);

export default router;
