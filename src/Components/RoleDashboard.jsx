import { useAuth } from "../Context/AuthContext";
import AdminDashboard from "../Pages/Dashboard/AdminDashboard";
import ModeratorDashboard from "../Pages/Dashboard/ModeratorDashboard";
import StudentDashboard from "../Pages/Dashboard/StudentDashboard";

const RoleDashboard = () => {
  const { user } = useAuth();

  const userRole = user?.role?.toLowerCase();

  if (userRole === "admin") {
    return <AdminDashboard />;
  } else if (userRole === "moderator") {
    return <ModeratorDashboard />;
  } else {
    return <StudentDashboard />;
  }
};

export default RoleDashboard;
