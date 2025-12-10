import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FaPlus, FaUsers, FaBook, FaChartLine } from "react-icons/fa";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalScholarships: 0,
    totalUsers: 0,
    totalApplications: 0,
    recentScholarships: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const [scholarshipsRes, usersRes, applicationsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/scholarships`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const scholarships = scholarshipsRes.data.data || [];
      const users = usersRes.data.data || [];
      const applications = applicationsRes.data.data || [];

      setStats({
        totalScholarships: scholarships.length,
        totalUsers: users.length,
        totalApplications: applications.length,
        recentScholarships: scholarships.slice(0, 5),
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
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <motion.div
          variants={itemVariants}
          className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
        >
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div>
                <p className="card-title text-4xl font-bold">
                  {stats.totalScholarships}
                </p>
                <p className="text-blue-100">Total Scholarships</p>
              </div>
              <FaBook className="text-5xl opacity-20" />
            </div>
            <div className="divider divider-success my-2"></div>
            <Link
              to="/dashboard/manage-scholarships"
              className="btn btn-sm btn-ghost text-white hover:bg-white/20"
            >
              View All →
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
                <p className="card-title text-4xl font-bold">
                  {stats.totalUsers}
                </p>
                <p className="text-green-100">Total Users</p>
              </div>
              <FaUsers className="text-5xl opacity-20" />
            </div>
            <div className="divider divider-success my-2"></div>
            <Link
              to="/dashboard/manage-users"
              className="btn btn-sm btn-ghost text-white hover:bg-white/20"
            >
              Manage Users →
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
                <p className="card-title text-4xl font-bold">
                  {stats.totalApplications}
                </p>
                <p className="text-purple-100">Total Applications</p>
              </div>
              <FaChartLine className="text-5xl opacity-20" />
            </div>
            <div className="divider divider-success my-2"></div>
            <Link
              to="/dashboard/analytics"
              className="btn btn-sm btn-ghost text-white hover:bg-white/20"
            >
              View Analytics →
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/dashboard/add-scholarship"
              className="btn btn-primary btn-lg gap-2 justify-start text-lg"
            >
              <FaPlus /> Add Scholarship
            </Link>
            <Link
              to="/dashboard/manage-scholarships"
              className="btn btn-info btn-lg gap-2 justify-start text-lg"
            >
              <FaBook /> Manage Scholarships
            </Link>
            <Link
              to="/dashboard/manage-users"
              className="btn btn-success btn-lg gap-2 justify-start text-lg"
            >
              <FaUsers /> Manage Users
            </Link>
            <Link
              to="/dashboard/analytics"
              className="btn btn-warning btn-lg gap-2 justify-start text-lg"
            >
              <FaChartLine /> View Analytics
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Recent Scholarships */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="card bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Recent Scholarships</h2>
          {stats.recentScholarships.length === 0 ? (
            <p className="text-base-content/70">
              No scholarships yet. Create your first scholarship!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr className="bg-base-200">
                    <th>Scholarship Name</th>
                    <th>University</th>
                    <th>Category</th>
                    <th>Application Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentScholarships.map((scholarship) => (
                    <tr key={scholarship._id} className="hover">
                      <td className="font-semibold">
                        {scholarship.scholarshipName}
                      </td>
                      <td>{scholarship.universityName}</td>
                      <td>
                        <span className="badge badge-sm badge-primary">
                          {scholarship.scholarshipCategory}
                        </span>
                      </td>
                      <td>${scholarship.applicationFees}</td>
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

export default AdminDashboard;
