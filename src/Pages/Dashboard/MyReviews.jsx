import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { reviewApi } from "../../Api/api";
import toast from "react-hot-toast";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({
    ratingPoint: 0,
    reviewComment: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewApi.getMyReviews();
      setReviews(response.data.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review._id);
    setEditForm({
      ratingPoint: review.ratingPoint,
      reviewComment: review.reviewComment,
    });
  };

  const handleSaveEdit = async (reviewId) => {
    try {
      await reviewApi.update(reviewId, editForm);
      setReviews(
        reviews.map((r) =>
          r._id === reviewId ? { ...r, ...editForm } : r
        )
      );
      setEditingReview(null);
      toast.success("Review updated");
    } catch (error) {
      toast.error("Failed to update review");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await reviewApi.delete(reviewId);
      setReviews(reviews.filter((r) => r._id !== reviewId));
      toast.success("Review deleted");
    } catch (error) {
      toast.error("Failed to delete review");
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
          <li>My Reviews</li>
        </ul>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : reviews.length === 0 ? (
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
          <span>You haven't written any reviews yet.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card bg-base-100 shadow border border-base-300"
            >
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="card-title">{review.scholarshipName}</h3>
                    <p className="text-sm text-base-content/70">
                      {review.universityName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="btn btn-ghost btn-sm"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="btn btn-ghost btn-sm text-error"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {editingReview === review._id ? (
                  // Edit Form
                  <div className="space-y-4 mt-4 border-t pt-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Rating</span>
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() =>
                              setEditForm({ ...editForm, ratingPoint: star })
                            }
                            className={`btn btn-lg btn-circle ${
                              editForm.ratingPoint >= star
                                ? "btn-warning"
                                : "btn-ghost"
                            }`}
                          >
                            <FaStar />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Review Comment</span>
                      </label>
                      <textarea
                        value={editForm.reviewComment}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            reviewComment: e.target.value,
                          })
                        }
                        className="textarea textarea-bordered h-24"
                        placeholder="Update your review..."
                      ></textarea>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingReview(null)}
                        className="btn btn-ghost"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(review._id)}
                        className="btn btn-primary"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <>
                    <div className="flex gap-1 my-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < review.ratingPoint
                              ? "text-warning text-lg"
                              : "text-base-300 text-lg"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-base-content/80 leading-relaxed">
                      {review.reviewComment}
                    </p>

                    <p className="text-xs text-base-content/50 mt-2">
                      Posted on{" "}
                      {new Date(review.reviewDate).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyReviews;
