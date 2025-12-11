import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FaEye, FaEdit, FaTrash, FaCreditCard } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationApi.getMyApplications();
      setApplications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appId) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      await applicationApi.delete(appId);
      setApplications(applications.filter((a) => a._id !== appId));
      toast.success("Application deleted");
    } catch (error) {
      toast.error("Failed to delete application");
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "completed":
        return "badge-success";
      case "processing":
        return "badge-info";
      case "pending":
        return "badge-warning";
      case "rejected":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="breadcrumbs text-sm">
        <ul>
          <li>Dashboard</li>
          <li>My Applications</li>
        </ul>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : applications.length === 0 ? (
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
            You haven't applied for any scholarships yet.{" "}
            <a href="/all-scholarships" className="link">
              Start browsing
            </a>
          </span>
        </div>
      ) : (
        <>
          {/* Table View */}
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th>University</th>
                    <th>Scholarship</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} className="hover">
                      <td className="font-semibold">{app.universityName}</td>
                      <td className="line-clamp-1">{app.scholarshipName}</td>
                      <td>
                        <div
                          className={`badge ${getStatusBadgeColor(
                            app.applicationStatus
                          )}`}
                        >
                          {app.applicationStatus}
                        </div>
                      </td>
                      <td>
                        <div
                          className={`badge ${
                            app.paymentStatus === "paid"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {app.paymentStatus}
                        </div>
                      </td>
                      <td className="text-sm">
                        {new Date(app.applicationDate).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="btn btn-ghost btn-xs"
                            title="View Details"
                          >
                            <FaEye />
                          </button>

                          {app.applicationStatus === "pending" && (
                            <>
                              <button
                                className="btn btn-ghost btn-xs"
                                title="Edit"
                              >
                                <FaEdit />
                              </button>
                              {app.paymentStatus === "unpaid" && (
                                <button
                                  className="btn btn-ghost btn-xs"
                                  title="Pay Now"
                                >
                                  <FaCreditCard />
                                </button>
                              )}
                            </>
                          )}

                          {app.applicationStatus === "pending" && (
                            <button
                              onClick={() => handleDelete(app._id)}
                              className="btn btn-ghost btn-xs text-error"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details Modal */}
          {selectedApp && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card w-full max-w-2xl bg-base-100"
              >
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4">
                    Application Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-base-content/70">
                          University
                        </p>
                        <p className="font-semibold text-lg">
                          {selectedApp.universityName}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-base-content/70">
                          Scholarship
                        </p>
                        <p className="font-semibold">
                          {selectedApp.scholarshipName}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-base-content/70">Degree</p>
                        <p className="font-semibold">{selectedApp.degree}</p>
                      </div>

                      <div>
                        <p className="text-sm text-base-content/70">Category</p>
                        <p className="font-semibold">
                          {selectedApp.scholarshipCategory}
                        </p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-base-content/70">
                          Application Status
                        </p>
                        <div
                          className={`badge badge-lg ${getStatusBadgeColor(
                            selectedApp.applicationStatus
                          )}`}
                        >
                          {selectedApp.applicationStatus}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-base-content/70">
                          Payment Status
                        </p>
                        <div
                          className={`badge badge-lg ${
                            selectedApp.paymentStatus === "paid"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {selectedApp.paymentStatus}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-base-content/70">
                          Application Date
                        </p>
                        <p className="font-semibold">
                          {new Date(
                            selectedApp.applicationDate
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-base-content/70">
                          Total Amount
                        </p>
                        <p className="font-semibold text-lg text-primary">
                          $
                          {(
                            selectedApp.applicationFees +
                            selectedApp.serviceCharge
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedApp.feedback && (
                    <>
                      <div className="divider"></div>
                      <div>
                        <p className="text-sm text-base-content/70 mb-2">
                          Feedback
                        </p>
                        <div className="bg-base-200 p-4 rounded-lg">
                          <p>{selectedApp.feedback}</p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="card-actions justify-end mt-6">
                    <button
                      onClick={() => setSelectedApp(null)}
                      className="btn btn-primary"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default MyApplications;
