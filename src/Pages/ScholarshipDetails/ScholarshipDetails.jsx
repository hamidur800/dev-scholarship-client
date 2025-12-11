import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaStar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";

const ScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scholarship, setScholarship] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    fetchScholarshipDetails();
    fetchReviews();
  }, [id]);

  const fetchScholarshipDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/scholarships/${id}`
      );
      setScholarship(response.data.data);
    } catch (error) {
      console.error("Error fetching scholarship:", error);
      toast.error("Failed to load scholarship details");
      navigate("/all-scholarships");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewApi.getByScholarship(id);
      setReviews(response.data.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleApply = () => {
    if (!user) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }
    navigate(`/checkout/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <span>Scholarship not found</span>
        </div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.ratingPoint, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Image */}
        <motion.figure
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <img
            src={
              scholarship.universityImage ||
              "https://via.placeholder.com/800x400"
            }
            alt={scholarship.universityName}
            className="rounded-lg w-full h-96 object-cover shadow-xl"
          />
        </motion.figure>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Title and Main Info */}
          <div className="card bg-base-100 shadow-lg border border-base-300">
            <div className="card-body">
              <h1 className="card-title text-4xl mb-4">
                {scholarship.scholarshipName}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-primary">
                      {scholarship.universityName}
                    </span>
                  </div>
                  <p className="text-lg text-base-content/70 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    {scholarship.universityCity},{" "}
                    {scholarship.universityCountry}
                  </p>
                  <p className="text-base-content/70">
                    World Rank:{" "}
                    <span className="font-semibold">
                      #{scholarship.universityWorldRank}
                    </span>
                  </p>
                </div>

                <div className="space-y-3 text-right md:text-left">
                  <div className="flex items-center gap-2">
                    <FaDollarSign className="text-success" />
                    <span className="text-2xl font-bold text-success">
                      ${scholarship.applicationFees || "Free Application"}
                    </span>
                  </div>
                  <p className="text-base-content/70">
                    Service Charge:{" "}
                    <span className="font-semibold">
                      ${scholarship.serviceCharge || 0}
                    </span>
                  </p>
                  <p className="text-base-content/70 flex items-center gap-2">
                    <FaCalendarAlt className="text-warning" />
                    Deadline:{" "}
                    {new Date(
                      scholarship.applicationDeadline
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Key Info */}
              <div className="divider"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm text-base-content/70">
                    Scholarship Type
                  </p>
                  <p className="font-semibold">
                    {scholarship.scholarshipCategory}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Degree Level</p>
                  <p className="font-semibold">{scholarship.degree}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Subject</p>
                  <p className="font-semibold">{scholarship.subjectCategory}</p>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Posted</p>
                  <p className="font-semibold">
                    {new Date(
                      scholarship.scholarshipPostDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Apply Button */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleApply}
                  className="btn btn-primary btn-lg flex-1"
                >
                  Apply for Scholarship
                </button>
                <button className="btn btn-outline btn-lg">
                  Save for Later
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs tabs-bordered w-full">
            <button
              onClick={() => setActiveTab("details")}
              className={`tab ${activeTab === "details" ? "tab-active" : ""}`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`tab ${activeTab === "reviews" ? "tab-active" : ""}`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          {/* Details Tab */}
          {activeTab === "details" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card bg-base-100 shadow-lg border border-base-300"
            >
              <div className="card-body space-y-6">
                <div>
                  <h2 className="card-title mb-3">About This Scholarship</h2>
                  <p className="text-base-content/80 leading-relaxed">
                    {scholarship.description ||
                      "This is a prestigious scholarship opportunity offered by " +
                        scholarship.universityName +
                        ". It aims to support talented and deserving students in their pursuit of higher education."}
                  </p>
                </div>

                {scholarship.tuitionFees && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Tuition Fees Coverage
                    </h3>
                    <p className="text-base-content/80">
                      This scholarship covers tuition fees up to $
                      {scholarship.tuitionFees} per year.
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Eligibility Criteria
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-base-content/80">
                    <li>
                      Must be a high school graduate or currently enrolled in a
                      Bachelor's degree program
                    </li>
                    <li>Minimum GPA requirement: 3.0</li>
                    <li>English proficiency requirement (IELTS or TOEFL)</li>
                    <li>Valid academic transcripts</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Required Documents
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-base-content/80">
                    <li>Updated Resume/CV</li>
                    <li>Official Transcripts</li>
                    <li>Statement of Purpose</li>
                    <li>Letters of Recommendation (2-3)</li>
                    <li>Proof of English Proficiency</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Rating Summary */}
              {reviews.length > 0 && (
                <div className="card bg-base-100 shadow-lg border border-base-300">
                  <div className="card-body">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-primary">
                          {averageRating}
                        </div>
                        <div className="flex gap-1 justify-center my-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < Math.round(averageRating)
                                  ? "text-warning"
                                  : "text-base-300"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-sm text-base-content/70">
                          Based on {reviews.length} reviews
                        </p>
                      </div>
                      <div className="flex-1">
                        <p className="text-lg font-semibold mb-4">
                          Student Reviews
                        </p>
                        <p className="text-base-content/70">
                          Read authentic reviews from students who have applied
                          to this scholarship.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="alert alert-info">
                    <span>
                      No reviews yet. Be the first to review this scholarship!
                    </span>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review._id}
                      className="card bg-base-100 shadow border border-base-300"
                    >
                      <div className="card-body">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {review.userName}
                            </h3>
                            <p className="text-sm text-base-content/70">
                              {new Date(review.reviewDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FaStar
                                key={i}
                                className={
                                  i < review.ratingPoint
                                    ? "text-warning"
                                    : "text-base-300"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-3 text-base-content/80">
                          {review.reviewComment}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Back Button */}
        <div className="mt-12">
          <Link to="/all-scholarships" className="btn btn-outline">
            ← Back to Scholarships
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipDetails;
