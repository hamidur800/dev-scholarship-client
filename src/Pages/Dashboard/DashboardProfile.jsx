import { useAuth } from "../../Context/AuthContext";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope } from "react-icons/fa";

const DashboardProfile = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-6"
    >
      <div className="breadcrumbs text-sm">
        <ul>
          <li>Dashboard</li>
          <li>Profile</li>
        </ul>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl mb-6">My Profile</h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <img
                src={
                  user?.photoURL ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.email
                }
                alt={user?.displayName}
                className="w-32 h-32 rounded-full border-4 border-primary shadow-lg"
              />
              <p className="mt-4 text-sm text-base-content/70">
                Member since {new Date(user?.metadata?.creationTime).toLocaleDateString()}
              </p>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Full Name</span>
                </label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  disabled
                  className="input input-bordered input-disabled"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="input input-bordered input-disabled"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Account Role</span>
                </label>
                <input
                  type="text"
                  value={user?.role || "Student"}
                  disabled
                  className="input input-bordered input-disabled"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Account Status</span>
                </label>
                <input
                  type="text"
                  value={user?.emailVerified ? "Verified" : "Pending Verification"}
                  disabled
                  className="input input-bordered input-disabled"
                />
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <p className="text-sm text-base-content/70 text-center">
            To update your profile information, please contact our support team.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardProfile;
