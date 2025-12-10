import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const ManageScholarships = () => {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/scholarships`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setScholarships(response.data.data || []);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      toast.error("Failed to load scholarships");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScholarship = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scholarship?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/scholarships/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Scholarship deleted successfully");
      fetchScholarships();
    } catch (error) {
      console.error("Error deleting scholarship:", error);
      toast.error("Failed to delete scholarship");
    }
  };

  const handleEditClick = (scholarship) => {
    setEditingId(scholarship._id);
    setEditFormData(scholarship);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/scholarships/${editingId}`,
        editFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Scholarship updated successfully");
      setShowEditModal(false);
      fetchScholarships();
    } catch (error) {
      console.error("Error updating scholarship:", error);
      toast.error("Failed to update scholarship");
    }
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Manage Scholarships</h1>
        <Link
          to="/dashboard/add-scholarship"
          className="btn btn-primary gap-2"
        >
          <FaPlus /> Add Scholarship
        </Link>
      </div>

      {scholarships.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-16">
            <p className="text-lg text-base-content/70 mb-4">
              No scholarships found
            </p>
            <Link to="/dashboard/add-scholarship" className="btn btn-primary">
              Create First Scholarship
            </Link>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow-xl overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-primary text-primary-content">
                <th>Scholarship Name</th>
                <th>University</th>
                <th>Country</th>
                <th>Category</th>
                <th>Application Fee</th>
                <th>Deadline</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scholarships.map((scholarship) => (
                <motion.tr
                  key={scholarship._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover"
                >
                  <td className="font-semibold">{scholarship.scholarshipName}</td>
                  <td>{scholarship.universityName}</td>
                  <td>{scholarship.universityCountry}</td>
                  <td>
                    <span className="badge badge-primary">
                      {scholarship.scholarshipCategory}
                    </span>
                  </td>
                  <td>${scholarship.applicationFees}</td>
                  <td>{new Date(scholarship.applicationDeadline).toLocaleDateString()}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(scholarship)}
                      className="btn btn-sm btn-info gap-1"
                      title="Edit"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteScholarship(scholarship._id)}
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

      {/* Edit Modal */}
      {showEditModal && (
        <dialog open className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl max-h-96 overflow-y-auto">
            <h3 className="font-bold text-lg mb-4">Edit Scholarship</h3>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Scholarship Name</span>
                </label>
                <input
                  type="text"
                  name="scholarshipName"
                  value={editFormData.scholarshipName || ""}
                  onChange={handleEditChange}
                  className="input input-bordered"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">University Name</span>
                  </label>
                  <input
                    type="text"
                    name="universityName"
                    value={editFormData.universityName || ""}
                    onChange={handleEditChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">World Rank</span>
                  </label>
                  <input
                    type="number"
                    name="worldRank"
                    value={editFormData.worldRank || ""}
                    onChange={handleEditChange}
                    className="input input-bordered"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Country</span>
                  </label>
                  <input
                    type="text"
                    name="universityCountry"
                    value={editFormData.universityCountry || ""}
                    onChange={handleEditChange}
                    className="input input-bordered"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">City</span>
                  </label>
                  <input
                    type="text"
                    name="universityCity"
                    value={editFormData.universityCity || ""}
                    onChange={handleEditChange}
                    className="input input-bordered"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Application Fee</span>
                </label>
                <input
                  type="number"
                  name="applicationFees"
                  value={editFormData.applicationFees || ""}
                  onChange={handleEditChange}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Application Deadline</span>
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={
                    editFormData.applicationDeadline
                      ? editFormData.applicationDeadline.split("T")[0]
                      : ""
                  }
                  onChange={handleEditChange}
                  className="input input-bordered"
                />
              </div>
            </div>

            <div className="modal-action mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="btn btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowEditModal(false)}>Close</button>
          </form>
        </dialog>
      )}
    </motion.div>
  );
};

export default ManageScholarships;
