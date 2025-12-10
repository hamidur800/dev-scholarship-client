import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import DashboardLayout from "../Layouts/DashbordLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import NotFound from "../Pages/NotFound/NotFound";
import AllScholarships from "../Pages/AllScholarships/AllScholarships";
import ScholarshipDetails from "../Pages/ScholarshipDetails/ScholarshipDetails";
import Checkout from "../Pages/Checkout/Checkout";
import PaymentSuccess from "../Pages/PaymentSuccess/PaymentSuccess";
import PaymentFailed from "../Pages/PaymentFailed/PaymentFailed";
import ProtectedRoute from "../Components/ProtectedRoute";
import DashboardProfile from "../Pages/Dashboard/DashboardProfile";
import StudentDashboard from "../Pages/Dashboard/StudentDashboard";
import MyApplications from "../Pages/Dashboard/MyApplications";
import MyReviews from "../Pages/Dashboard/MyReviews";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/all-scholarships",
        element: <AllScholarships />,
      },
      {
        path: "/scholarship/:id",
        element: <ScholarshipDetails />,
      },
      {
        path: "/checkout/:id",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: "/payment-success",
        element: (
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        ),
      },
      {
        path: "/payment-failed",
        element: (
          <ProtectedRoute>
            <PaymentFailed />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <StudentDashboard />,
      },
      {
        path: "/dashboard/profile",
        element: <DashboardProfile />,
      },
      {
        path: "/dashboard/my-applications",
        element: <MyApplications />,
      },
      {
        path: "/dashboard/my-reviews",
        element: <MyReviews />,
      },
    ],
  },
]);

export default router;
