import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import AdminDashboard from "../Pages/AdminDashboard";
import TutorDashboard from "../Pages/TutorDashboard";
import StudentDashboard from "../Pages/StudentDashboard";

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
      {
        path: "/student-dashboard",
        element: <StudentDashboard />,
      },
      {
        path: "/tutor-dashboard",
        element: <TutorDashboard />,
      },
      {
        path: "/admin-dashboard",
        element: <AdminDashboard />,
      },
    ],
  },
]);

export default router;
