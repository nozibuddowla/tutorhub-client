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

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
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
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "student",
        element: <StudentDashboard />,
      },
      { path: "student/my-tuitions", element: <StudentTuitions /> },
      { path: "student/post-tuition", element: <PostTuition /> },
      { path: "student/applied-tutors", element: <AppliedTutors /> },
      { path: "student/payments", element: <StudentPayments /> },
      { path: "student/settings", element: <ProfileSettings /> },
      {
        path: "tutor",
        element: <TutorDashboard />,
      },
      { path: "tutor/applications", element: <TutorApplications /> },
      { path: "tutor/ongoing", element: <TutorOngoingTuitions /> },
      { path: "tutor/revenue", element: <TutorRevenue /> },
      {
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "admin/users",
        element: <ManageUsers />,
      },
      {
        path: "admin/tuitions",
        element: <ManageTuitions />,
      },
      {
        path: "admin/reports",
        element: <Reports />,
      },
    ],
  },
]);

export default router;
