import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import TutorDashboard from "../Pages/Dashboard/TutorDashboard";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard";
import ManageUsers from "../Pages/ManageUsers";
import ManageTuitions from "../Pages/ManageTuitions";
import Reports from "../Pages/Reports";
import TutorApplications from "../Pages/TutorApplications";
import TutorOngoingTuitions from "../Pages/TutorOngoingTuitions";
import TutorRevenue from "../Pages/TutorRevenue";
import StudentDashboard from "../Pages/Dashboard/Student/StudentDashboard";
import StudentTuitions from "../Pages/Dashboard/Student/StudentTuitions";
import PostTuition from "../Pages/Dashboard/Student/PostTuition";
import AppliedTutors from "../Pages/Dashboard/Student/AppliedTutors";
import StudentPayments from "../Pages/Dashboard/Student/StudentPayments";
import ProfileSettings from "../Pages/Dashboard/Student/ProfileSettings";
import PaymentCheckout from "../Pages/PaymentCheckout";
import AllTuitions from "../Pages/AllTuitions";
import TuitionDetails from "../Pages/TuitionDetails";
import NotFound from "../components/NotFound";
import Loading from "../components/Loading";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    errorElement: <NotFound />,
    hydrateFallback: <Loading />,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/signup",
        element: <Register></Register>,
      },
      {
        path: "/tuitions",
        element: <AllTuitions />,
      },
      {
        path: "/tuitions/:id",
        element: <TuitionDetails />,
      },
    ],
  },
  {
    path: "/payment/checkout",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <PaymentCheckout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["student", "tutor", "admin"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // Student Routes
      {
        path: "student",
        element: (
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "student/my-tuitions",
        element: (
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentTuitions />
          </ProtectedRoute>
        ),
      },
      {
        path: "student/post-tuition",
        element: (
          <ProtectedRoute allowedRoles={["student"]}>
            <PostTuition />
          </ProtectedRoute>
        ),
      },
      {
        path: "student/applied-tutors",
        element: (
          <ProtectedRoute allowedRoles={["student"]}>
            <AppliedTutors />
          </ProtectedRoute>
        ),
      },
      {
        path: "student/payments",
        element: (
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentPayments />
          </ProtectedRoute>
        ),
      },
      {
        path: "student/settings",
        element: (
          <ProtectedRoute allowedRoles={["student"]}>
            <ProfileSettings />
          </ProtectedRoute>
        ),
      },

      // Tutor Routes
      {
        path: "tutor",
        element: (
          <ProtectedRoute allowedRoles={["tutor"]}>
            <TutorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "tutor/applications",
        element: (
          <ProtectedRoute allowedRoles={["tutor"]}>
            <TutorApplications />
          </ProtectedRoute>
        ),
      },
      {
        path: "tutor/ongoing",
        element: (
          <ProtectedRoute allowedRoles={["tutor"]}>
            <TutorOngoingTuitions />
          </ProtectedRoute>
        ),
      },
      {
        path: "tutor/revenue",
        element: (
          <ProtectedRoute allowedRoles={["tutor"]}>
            <TutorRevenue />
          </ProtectedRoute>
        ),
      },

      // Admin Routes
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/tuitions",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <ManageTuitions />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/reports",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Reports />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
