import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash, FaUserShield } from "react-icons/fa";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("all");
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers =
    selectedRole === "all"
      ? users
      : users.filter((user) => user.role === selectedRole);

  const handleChangeRole = async (userId, user) => {
    setEditingUserId(userId);
    setNewRole(user.role);
  };

  const handleSaveRole = async (userId) => {
    if (!newRole) {
      toast.error("Please select a role");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("User role updated successfully");
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "badge-error";
      case "moderator":
        return "badge-warning";
      case "student":
        return "badge-info";
      default:
        return "badge-ghost";
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    moderators: users.filter((u) => u.role === "moderator").length,
    students: users.filter((u) => u.role === "student").length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-8">Manage Users</h1>

      {/* Stats */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: "Total Users", value: stats.total, color: "stats-primary" },
          { label: "Admins", value: stats.admins, color: "stats-error" },
          {
            label: "Moderators",
            value: stats.moderators,
            color: "stats-warning",
          },
          { label: "Students", value: stats.students, color: "stats-info" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            className={`stats ${stat.color} shadow`}
          >
            <div className="stat">
              <div className="stat-figure text-2xl">📊</div>
              <div className="stat-title">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="select select-bordered select-sm"
        >
          <option value="all">All Users ({users.length})</option>
          <option value="admin">Admins ({stats.admins})</option>
          <option value="moderator">Moderators ({stats.moderators})</option>
          <option value="student">Students ({stats.students})</option>
        </select>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-16">
            <p className="text-lg text-base-content/70">No users found</p>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-primary text-primary-content">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Account Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover"
                >
                  <td className="font-semibold">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {editingUserId === user._id ? (
                      <div className="flex gap-2">
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="select select-bordered select-xs"
                        >
                          <option value="student">Student</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          onClick={() => handleSaveRole(user._id)}
                          className="btn btn-xs btn-success"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="btn btn-xs btn-ghost"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className={`badge ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-success badge-outline">
                      {user.verified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleChangeRole(user._id, user)}
                      className="btn btn-sm btn-warning gap-1"
                      title="Change Role"
                      disabled={editingUserId === user._id}
                    >
                      <FaUserShield /> Change Role
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="btn btn-sm btn-error gap-1"
                      title="Delete"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default ManageUsers;
