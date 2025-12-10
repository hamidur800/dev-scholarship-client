import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { applicationApi } from "../../Api/api";
import { FaFileAlt, FaComments, FaClock } from "react-icons/fa";

const StudentDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const appResponse = await applicationApi.getMyApplications();
      setApplications(appResponse.data.data || []);

      // Calculate stats
      const apps = appResponse.data.data || [];
      setStats({
        total: apps.length,
        pending: apps.filter((a) => a.applicationStatus === "pending").length,
        processing: apps.filter((a) => a.applicationStatus === "processing")
          .length,
        completed: apps.filter((a) => a.applicationStatus === "completed")
          .length,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
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
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Welcome Section */}
      <div className="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>
          Welcome to your student dashboard! Track your applications and reviews
          here.
        </span>
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants} className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">
                  Total Applications
                </p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <FaFileAlt className="text-4xl text-primary opacity-20" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Pending</p>
                <p className="text-3xl font-bold">{stats.pending}</p>
              </div>
              <FaClock className="text-4xl text-warning opacity-20" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Processing</p>
                <p className="text-3xl font-bold">{stats.processing}</p>
              </div>
              <FaClock className="text-4xl text-info opacity-20" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70">Completed</p>
                <p className="text-3xl font-bold">{stats.completed}</p>
              </div>
              <FaComments className="text-4xl text-success opacity-20" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Link
            to="/dashboard/my-applications"
            className="card bg-base-100 shadow hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="card-body">
              <h2 className="card-title text-lg">View All Applications</h2>
              <p className="text-base-content/70">
                Manage and track your scholarship applications
              </p>
              <div className="card-actions justify-end">
                <div className="badge badge-primary">Go</div>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            to="/dashboard/my-reviews"
            className="card bg-base-100 shadow hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="card-body">
              <h2 className="card-title text-lg">View All Reviews</h2>
              <p className="text-base-content/70">
                See all your submitted reviews
              </p>
              <div className="card-actions justify-end">
                <div className="badge badge-primary">Go</div>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            to="/dashboard/add-review"
            className="card bg-base-100 shadow hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="card-body">
              <h2 className="card-title text-lg">Write a Review</h2>
              <p className="text-base-content/70">
                Share your scholarship experience
              </p>
              <div className="card-actions justify-end">
                <div className="badge badge-success">Go</div>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Recent Applications */}
      {applications.length > 0 && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card bg-base-100 shadow"
        >
          <div className="card-body">
            <h2 className="card-title">Recent Applications</h2>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>University</th>
                    <th>Scholarship</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app._id}>
                      <td>{app.universityName}</td>
                      <td>{app.scholarshipName}</td>
                      <td>
                        <div
                          className={`badge ${
                            app.applicationStatus === "completed"
                              ? "badge-success"
                              : app.applicationStatus === "processing"
                              ? "badge-info"
                              : "badge-warning"
                          }`}
                        >
                          {app.applicationStatus}
                        </div>
                      </td>
                      <td>
                        {new Date(app.applicationDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-actions">
              <Link
                to="/dashboard/my-applications"
                className="link link-primary"
              >
                View All →
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudentDashboard;
