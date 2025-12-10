import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaComments } from "react-icons/fa";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApplications(response.data.data || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleFeedback = (application) => {
    setSelectedApplication(application);
    setFeedbackText(application.feedback || "");
    setShowFeedbackModal(true);
  };

  const handleSaveFeedback = async () => {
    if (!feedbackText.trim()) {
      toast.error("Please enter feedback");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/applications/${
          selectedApplication._id
        }`,
        { feedback: feedbackText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Feedback saved successfully");
      setShowFeedbackModal(false);
      fetchApplications();
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast.error("Failed to save feedback");
    }
  };

  const handleStatusUpdate = async (applicationId, newAppStatus) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/applications/${applicationId}`,
        { status: newAppStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Application status updated");
      fetchApplications();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "badge-warning";
      case "processing":
        return "badge-info";
      case "completed":
        return "badge-success";
      case "rejected":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === "paid" ? "badge-success" : "badge-warning";
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
      <h1 className="text-4xl font-bold mb-8">Manage Applications</h1>

      {applications.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-16">
            <p className="text-lg text-base-content/70">
              No applications found
            </p>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-primary text-primary-content">
                <th>Applicant</th>
                <th>Email</th>
                <th>University</th>
                <th>Scholarship</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date Applied</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <motion.tr
                  key={app._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover"
                >
                  <td className="font-semibold">{app.applicantName}</td>
                  <td>{app.applicantEmail}</td>
                  <td className="text-sm">{app.universityName}</td>
                  <td className="text-sm truncate max-w-xs">
                    {app.scholarshipName}
                  </td>
                  <td>
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusUpdate(app._id, e.target.value)
                      }
                      className={`select select-bordered select-xs ${
                        app.status === "pending"
                          ? "select-warning"
                          : app.status === "processing"
                          ? "select-info"
                          : app.status === "completed"
                          ? "select-success"
                          : "select-error"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td>
                    <span
                      className={`badge ${getPaymentStatusColor(
                        app.paymentStatus
                      )}`}
                    >
                      {app.paymentStatus}
                    </span>
                  </td>
                  <td>{new Date(app.dateApplied).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleViewDetails(app)}
                      className="btn btn-sm btn-info gap-1"
                      title="View Details"
                    >
                      <FaEye /> Details
                    </button>
                    <button
                      onClick={() => handleFeedback(app)}
                      className="btn btn-sm btn-secondary gap-1"
                      title="Add Feedback"
                    >
                      <FaComments /> Feedback
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedApplication && (
        <dialog open className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-xl mb-4">Application Details</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-base-content/70">
                    Applicant Name
                  </p>
                  <p className="font-bold">
                    {selectedApplication.applicantName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-base-content/70">
                    Email
                  </p>
                  <p className="font-bold">
                    {selectedApplication.applicantEmail}
                  </p>
                </div>
              </div>

              <div className="divider my-2"></div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-base-content/70">
                    University
                  </p>
                  <p className="font-bold">
                    {selectedApplication.universityName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-base-content/70">
                    Scholarship
                  </p>
                  <p className="font-bold text-sm">
                    {selectedApplication.scholarshipName}
                  </p>
                </div>
              </div>

              <div className="divider my-2"></div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-base-content/70">
                    Status
                  </p>
                  <span
                    className={`badge ${getStatusColor(
                      selectedApplication.status
                    )}`}
                  >
                    {selectedApplication.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-base-content/70">
                    Payment Status
                  </p>
                  <span
                    className={`badge ${getPaymentStatusColor(
                      selectedApplication.paymentStatus
                    )}`}
                  >
                    {selectedApplication.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="divider my-2"></div>

              <div>
                <p className="text-sm font-semibold text-base-content/70 mb-2">
                  Feedback
                </p>
                <p className="bg-base-200 p-3 rounded">
                  {selectedApplication.feedback || "No feedback yet"}
                </p>
              </div>

              <div className="divider my-2"></div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-base-content/70">
                    Applied On
                  </p>
                  <p>
                    {new Date(
                      selectedApplication.dateApplied
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-base-content/70">
                    Application Amount
                  </p>
                  <p className="font-bold">
                    ${selectedApplication.applicationAmount || "0"}
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-action mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn btn-ghost"
              >
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowDetailsModal(false)}>Close</button>
          </form>
        </dialog>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedApplication && (
        <dialog open className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-xl mb-4">
              Add Feedback - {selectedApplication.applicantName}
            </h3>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Your Feedback</span>
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="textarea textarea-bordered focus:textarea-primary min-h-48"
                placeholder="Write your feedback or comments for this application..."
              ></textarea>
              <label className="label">
                <span className="label-text-alt text-xs opacity-70">
                  {feedbackText.length} characters
                </span>
              </label>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button onClick={handleSaveFeedback} className="btn btn-primary">
                Save Feedback
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowFeedbackModal(false)}>Close</button>
          </form>
        </dialog>
      )}
    </motion.div>
  );
};

export default ManageApplications;
