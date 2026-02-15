import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import DashboardLayout from "../DashboardLayout/DashboardLayout";
import StudentDashboard from "../Pages/Dashboard/StudentDashboard";
import TutorDashboard from "../Pages/Dashboard/TutorDashboard";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard";
import ManageUsers from "../Pages/ManageUsers";
import ManageTuitions from "../Pages/ManageTuitions";
import Reports from "../Pages/Reports";

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
      {
        path: "tutor",
        element: <TutorDashboard />,
      },
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
