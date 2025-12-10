import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FaFileAlt, FaComments, FaCheckCircle } from "react-icons/fa";

const ModeratorDashboard = () => {
  const [stats, setStats] = useState({
    pendingApplications: 0,
    processingApplications: 0,
    completedApplications: 0,
    totalReviews: 0,
    recentApplications: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const [applicationsRes, reviewsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const applications = applicationsRes.data.data || [];
      const reviews = reviewsRes.data.data || [];

      setStats({
        pendingApplications: applications.filter((a) => a.status === "pending").length,
        processingApplications: applications.filter((a) => a.status === "processing").length,
        completedApplications: applications.filter((a) => a.status === "completed").length,
        totalReviews: reviews.length,
        recentApplications: applications.slice(0, 5),
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-8">Moderator Dashboard</h1>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        <motion.div
          variants={itemVariants}
          className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-lg"
        >
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-title text-4xl font-bold">{stats.pendingApplications}</p>
                <p className="text-yellow-100">Pending Applications</p>
              </div>
              <FaFileAlt className="text-5xl opacity-20" />
            </div>
            <div className="divider divider-warning my-2"></div>
            <Link to="/dashboard/manage-applications" className="btn btn-sm btn-ghost text-white hover:bg-white/20">
              Review →
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
        >
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-title text-4xl font-bold">{stats.processingApplications}</p>
                <p className="text-blue-100">Processing Applications</p>
              </div>
              <FaCheckCircle className="text-5xl opacity-20" />
            </div>
            <div className="divider divider-info my-2"></div>
            <Link to="/dashboard/manage-applications" className="btn btn-sm btn-ghost text-white hover:bg-white/20">
              Manage →
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="card bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg"
        >
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-title text-4xl font-bold">{stats.completedApplications}</p>
                <p className="text-green-100">Completed Applications</p>
              </div>
              <FaCheckCircle className="text-5xl opacity-20" />
            </div>
            <div className="divider divider-success my-2"></div>
            <Link to="/dashboard/manage-applications" className="btn btn-sm btn-ghost text-white hover:bg-white/20">
              View All →
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg"
        >
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-title text-4xl font-bold">{stats.totalReviews}</p>
                <p className="text-purple-100">Total Reviews</p>
              </div>
              <FaComments className="text-5xl opacity-20" />
            </div>
            <div className="divider divider-success my-2"></div>
            <Link to="/dashboard/all-reviews" className="btn btn-sm btn-ghost text-white hover:bg-white/20">
              Moderate →
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="card bg-base-100 shadow-xl mb-8"
      >
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/dashboard/manage-applications"
              className="btn btn-primary btn-lg gap-2 justify-start text-lg"
            >
              <FaFileAlt /> Manage Applications
            </Link>
            <Link
              to="/dashboard/all-reviews"
              className="btn btn-info btn-lg gap-2 justify-start text-lg"
            >
              <FaComments /> Moderate Reviews
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Recent Applications */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="card bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Recent Applications</h2>
          {stats.recentApplications.length === 0 ? (
            <p className="text-base-content/70">No applications yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr className="bg-base-200">
                    <th>Applicant</th>
                    <th>Scholarship</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentApplications.map((app) => (
                    <tr key={app._id} className="hover">
                      <td className="font-semibold">{app.applicantName}</td>
                      <td className="text-sm">{app.scholarshipName}</td>
                      <td>
                        <span
                          className={`badge ${
                            app.status === "pending"
                              ? "badge-warning"
                              : app.status === "processing"
                              ? "badge-info"
                              : "badge-success"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${app.paymentStatus === "paid" ? "badge-success" : "badge-warning"}`}>
                          {app.paymentStatus}
                        </span>
                      </td>
                      <td>{new Date(app.dateApplied).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModeratorDashboard;
