import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {
  FaHome,
  FaUser,
  FaFileAlt,
  FaUsers,
  FaChartBar,
  FaPlus,
  FaList,
  FaCheckCircle,
  FaComments,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";

const DashboardLayout = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const isModerator = user?.role?.toLowerCase() === "moderator";
  const isStudent = user?.role?.toLowerCase() === "student" || !user?.role;

  const isActive = (path) => location.pathname === path;

  const adminLinks = [
    { path: "/dashboard/profile", label: "My Profile", icon: <FaUser /> },
    { path: "/dashboard/add-scholarship", label: "Add Scholarship", icon: <FaPlus /> },
    { path: "/dashboard/manage-scholarships", label: "Manage Scholarships", icon: <FaList /> },
    { path: "/dashboard/manage-users", label: "Manage Users", icon: <FaUsers /> },
    { path: "/dashboard/analytics", label: "Analytics", icon: <FaChartBar /> },
  ];

  const moderatorLinks = [
    { path: "/dashboard/profile", label: "My Profile", icon: <FaUser /> },
    { path: "/dashboard/manage-applications", label: "Manage Applications", icon: <FaFileAlt /> },
    { path: "/dashboard/all-reviews", label: "All Reviews", icon: <FaComments /> },
  ];

  const studentLinks = [
    { path: "/dashboard/profile", label: "My Profile", icon: <FaUser /> },
    { path: "/dashboard/my-applications", label: "My Applications", icon: <FaFileAlt /> },
    { path: "/dashboard/my-reviews", label: "My Reviews", icon: <FaComments /> },
  ];

  const links = isAdmin ? adminLinks : isModerator ? moderatorLinks : studentLinks;

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-base-100 shadow-xl transition-all duration-300 fixed h-screen z-40`}
      >
        <div className="p-6 border-b border-base-300">
          <Link to="/" className="btn btn-ghost text-xl font-bold">
            {sidebarOpen ? "ScholarStream" : "SS"}
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {/* Home Link */}
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
              isActive("/") ? "bg-primary text-primary-content" : "hover:bg-base-200"
            }`}
          >
            <FaHome className="text-lg" />
            {sidebarOpen && <span>Home</span>}
          </Link>

          <div className="divider my-2"></div>

          {/* Dashboard Links */}
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                isActive(link.path) ? "bg-primary text-primary-content" : "hover:bg-base-200"
              }`}
              title={sidebarOpen ? "" : link.label}
            >
              <span className="text-lg">{link.icon}</span>
              {sidebarOpen && <span>{link.label}</span>}
            </Link>
          ))}

          <div className="divider my-2"></div>

          {/* Logout Link */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-error hover:text-error-content transition-all"
          >
            <FaSignOutAlt className="text-lg" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`${sidebarOpen ? "ml-64" : "ml-20"} flex-1 transition-all duration-300`}>
        {/* Top Bar */}
        <div className="bg-base-100 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn btn-ghost btn-circle"
            >
              <FaBars />
            </button>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="font-semibold">{user?.displayName || user?.email}</p>
                <p className="text-sm text-base-content/70">{user?.role}</p>
              </div>
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-10">
                  <span>
                    {user?.displayName?.charAt(0).toUpperCase() ||
                      user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
