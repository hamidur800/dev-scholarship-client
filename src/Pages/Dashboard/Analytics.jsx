import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("access_token");

      // Fetch different data for analytics
      const [usersRes, scholarshipsRes, applicationsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/scholarships`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const users = usersRes.data.data || [];
      const scholarships = scholarshipsRes.data.data || [];
      const applications = applicationsRes.data.data || [];

      const adminCount = users.filter((u) => u.role === "admin").length;
      const moderatorCount = users.filter((u) => u.role === "moderator").length;
      const studentCount = users.filter((u) => u.role === "student").length;

      const totalFees = scholarships.reduce(
        (sum, s) => sum + (s.tuitionFees || 0),
        0
      );
      const totalApplicationFees = applications.length * 50; // Assuming $50 per application

      const categoryData = scholarships.reduce((acc, s) => {
        const existing = acc.find(
          (item) => item.category === s.scholarshipCategory
        );
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ category: s.scholarshipCategory, count: 1 });
        }
        return acc;
      }, []);

      const applicationStatusData = [
        {
          status: "Pending",
          count: applications.filter((a) => a.status === "pending").length,
        },
        {
          status: "Processing",
          count: applications.filter((a) => a.status === "processing").length,
        },
        {
          status: "Completed",
          count: applications.filter((a) => a.status === "completed").length,
        },
      ];

      const monthlyData = [
        { month: "Jan", applications: 45, users: 120, fees: 12000 },
        { month: "Feb", applications: 52, users: 135, fees: 13500 },
        { month: "Mar", applications: 48, users: 128, fees: 12800 },
        { month: "Apr", applications: 61, users: 145, fees: 15200 },
        { month: "May", applications: 55, users: 142, fees: 14100 },
        { month: "Jun", applications: 67, users: 158, fees: 16700 },
      ];

      setStats({
        totalUsers: users.length,
        totalScholarships: scholarships.length,
        totalApplications: applications.length,
        adminCount,
        moderatorCount,
        studentCount,
        totalFees,
        totalApplicationFees,
        categoryData,
        applicationStatusData,
        monthlyData,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-8">Platform Analytics</h1>

      {/* Key Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {[
          {
            label: "Total Users",
            value: stats.totalUsers,
            icon: "👥",
            color: "stats-primary",
          },
          {
            label: "Total Scholarships",
            value: stats.totalScholarships,
            icon: "🎓",
            color: "stats-info",
          },
          {
            label: "Total Applications",
            value: stats.totalApplications,
            icon: "📋",
            color: "stats-warning",
          },
          {
            label: "Application Fees",
            value: `$${stats.totalApplicationFees}`,
            icon: "💰",
            color: "stats-success",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className={`stats ${stat.color} shadow`}
          >
            <div className="stat">
              <div className="stat-figure text-2xl">{stat.icon}</div>
              <div className="stat-title">{stat.label}</div>
              <div className="stat-value text-2xl">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* User Breakdown */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        {[
          {
            label: "Admins",
            value: stats.adminCount,
            color: "bg-error/10 text-error border-error",
          },
          {
            label: "Moderators",
            value: stats.moderatorCount,
            color: "bg-warning/10 text-warning border-warning",
          },
          {
            label: "Students",
            value: stats.studentCount,
            color: "bg-info/10 text-info border-info",
          },
        ].map((user, idx) => (
          <div key={idx} className={`card ${user.color} border shadow-lg`}>
            <div className="card-body text-center">
              <h3 className="card-title justify-center text-2xl">
                {user.value}
              </h3>
              <p>{user.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Monthly Analytics */}
        <motion.div
          variants={itemVariants}
          className="card bg-base-100 shadow-xl p-6"
        >
          <h3 className="text-xl font-bold mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Applications"
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#10B981"
                strokeWidth={2}
                name="New Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Scholarship Categories */}
        <motion.div
          variants={itemVariants}
          className="card bg-base-100 shadow-xl p-6"
        >
          <h3 className="text-xl font-bold mb-4">Scholarships by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.category} (${entry.count})`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {stats.categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Application Status */}
        <motion.div
          variants={itemVariants}
          className="card bg-base-100 shadow-xl p-6"
        >
          <h3 className="text-xl font-bold mb-4">
            Application Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.applicationStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" name="Applications" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Fee Summary */}
        <motion.div
          variants={itemVariants}
          className="card bg-base-100 shadow-xl p-6"
        >
          <h3 className="text-xl font-bold mb-4">Fee Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
              <span>Total Tuition Fees</span>
              <span className="text-2xl font-bold text-primary">
                ${(stats.totalFees / 1000).toFixed(1)}k
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-success/10 rounded-lg">
              <span>Application Fees Collected</span>
              <span className="text-2xl font-bold text-success">
                ${stats.totalApplicationFees}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-info/10 rounded-lg">
              <span>Average Application Fee Per Student</span>
              <span className="text-2xl font-bold text-info">
                $
                {stats.totalApplications > 0
                  ? Math.round(
                      stats.totalApplicationFees / stats.totalApplications
                    )
                  : 0}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
