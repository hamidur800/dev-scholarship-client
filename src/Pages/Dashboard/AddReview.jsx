import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";
import { FaStar, FaPlus } from "react-icons/fa";

const AddReview = () => {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCompletedApplications();
  }, []);

  const fetchCompletedApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/applications?status=completed`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const scholarshipIds = response.data.data?.map((app) => app.scholarshipId) || [];
      if (scholarshipIds.length > 0) {
        const scholarshipsRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/scholarships`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const filteredScholarships = scholarshipsRes.data.data?.filter((s) =>
          scholarshipIds.includes(s._id)
        );
        setScholarships(filteredScholarships || []);
      }
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      toast.error("Failed to load scholarships");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!selectedScholarship) {
      toast.error("Please select a scholarship");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("access_token");
      const reviewData = {
        scholarshipId: selectedScholarship._id,
        scholarshipName: selectedScholarship.scholarshipName,
        reviewerName: user?.displayName || user?.email,
        reviewerEmail: user?.email,
        rating: formData.rating,
        comment: formData.comment,
        dateOfReview: new Date(),
      };

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Review submitted successfully!");
      setFormData({ rating: 5, comment: "" });
      setSelectedScholarship(null);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
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
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-4xl font-bold mb-8">Add a Review</h1>

      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <form onSubmit={handleSubmitReview} className="space-y-6">
            {/* Scholarship Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Select Scholarship *</span>
              </label>
              {scholarships.length === 0 ? (
                <div className="alert alert-info">
                  <p>No completed scholarships to review. Complete an application first!</p>
                </div>
              ) : (
                <select
                  value={selectedScholarship?._id || ""}
                  onChange={(e) => {
                    const scholarship = scholarships.find((s) => s._id === e.target.value);
                    setSelectedScholarship(scholarship);
                  }}
                  required
                  className="select select-bordered focus:select-primary"
                >
                  <option value="">Choose a scholarship...</option>
                  {scholarships.map((scholarship) => (
                    <option key={scholarship._id} value={scholarship._id}>
                      {scholarship.scholarshipName} - {scholarship.universityName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Rating */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Rating *</span>
              </label>
              <div className="flex gap-2 items-center">
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="select select-bordered focus:select-primary"
                >
                  <option value={1}>1 - Poor</option>
                  <option value={2}>2 - Fair</option>
                  <option value={3}>3 - Good</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={5}>5 - Excellent</option>
                </select>
                <div className="flex gap-1 text-2xl">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < formData.rating ? "text-warning" : "text-base-300"}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Comment */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Your Comment *</span>
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                required
                className="textarea textarea-bordered focus:textarea-primary min-h-32"
                placeholder="Share your experience with this scholarship program..."
              ></textarea>
              <label className="label">
                <span className="label-text-alt">{formData.comment.length} / 500 characters</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="form-control pt-4">
              <button
                type="submit"
                disabled={submitting || scholarships.length === 0}
                className="btn btn-primary btn-lg"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-8 card bg-info/10 border border-info/30"
      >
        <div className="card-body">
          <h3 className="card-title text-info text-lg">Why Review?</h3>
          <p>
            Your honest reviews help other students make informed decisions about scholarships.
            Share your experience to help the community!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddReview;
