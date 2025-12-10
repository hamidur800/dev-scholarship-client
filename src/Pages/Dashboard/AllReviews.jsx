import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTrash, FaStar } from "react-icons/fa";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews(response.data.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Review deleted successfully");
      fetchAllReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-warning" : "text-base-300"}
      />
    ));
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
      <h1 className="text-4xl font-bold mb-8">Moderate Reviews</h1>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="stats shadow mb-8 w-full"
      >
        <div className="stat">
          <div className="stat-figure text-3xl">📝</div>
          <div className="stat-title">Total Reviews</div>
          <div className="stat-value">{reviews.length}</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-3xl">⭐</div>
          <div className="stat-title">Average Rating</div>
          <div className="stat-value">
            {reviews.length > 0
              ? (
                  reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
                ).toFixed(1)
              : "0"}
          </div>
        </div>
        <div className="stat">
          <div className="stat-figure text-3xl">📊</div>
          <div className="stat-title">5-Star Reviews</div>
          <div className="stat-value">
            {reviews.filter((r) => r.rating === 5).length}
          </div>
        </div>
      </motion.div>

      {reviews.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-16">
            <p className="text-lg text-base-content/70">No reviews found</p>
          </div>
        </div>
      ) : (
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
          className="space-y-6"
        >
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="card bg-base-100 shadow-lg border border-base-300 hover:border-primary transition-all"
            >
              <div className="card-body">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="card-title text-lg">
                      {review.scholarshipName || "Unnamed Scholarship"}
                    </h3>
                    <p className="text-sm text-base-content/70 mb-2">
                      by {review.reviewerName || "Anonymous"}
                    </p>
                    <div className="flex gap-1 text-lg">
                      {renderStars(review.rating || 0)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="btn btn-sm btn-error gap-1"
                    title="Delete Review"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>

                <div className="divider my-2"></div>

                <div>
                  <p className="text-sm font-semibold text-base-content/70 mb-2">
                    Review Comment:
                  </p>
                  <p className="text-base-content/80 leading-relaxed">
                    {review.comment || "No comment provided"}
                  </p>
                </div>

                <div className="divider my-2"></div>

                <div className="flex justify-between items-center text-xs text-base-content/60">
                  <span>
                    📧 {review.reviewerEmail || "No email"}
                  </span>
                  <span>
                    📅 {new Date(review.dateOfReview).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AllReviews;
