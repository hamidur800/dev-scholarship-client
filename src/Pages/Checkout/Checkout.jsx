import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaCreditCard, FaLock, FaInfoCircle } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvc: "",
  });

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/scholarships/${id}`
        );
        setScholarship(response.data.data);
      } catch (error) {
        toast.error("Failed to load scholarship");
        navigate("/all-scholarships");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarship();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardInfo({ ...cardInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!cardInfo.cardNumber || cardInfo.cardNumber.length < 13) {
      toast.error("Please enter a valid card number");
      return;
    }
    if (!cardInfo.cardHolder) {
      toast.error("Please enter cardholder name");
      return;
    }
    if (!cardInfo.expiryDate || cardInfo.expiryDate.length !== 5) {
      toast.error("Please enter expiry date (MM/YY)");
      return;
    }
    if (!cardInfo.cvc || cardInfo.cvc.length !== 3) {
      toast.error("Please enter a valid CVC");
      return;
    }

    try {
      setProcessing(true);

      // Create application with unpaid status
      const applicationData = {
        scholarshipId: scholarship._id,
        userId: user?.uid,
        userName: user?.displayName,
        userEmail: user?.email,
        universityName: scholarship.universityName,
        scholarshipName: scholarship.scholarshipName,
        scholarshipCategory: scholarship.scholarshipCategory,
        degree: scholarship.degree,
        applicationFees: scholarship.applicationFees,
        serviceCharge: scholarship.serviceCharge,
        applicationStatus: "pending",
        paymentStatus: "paid", // Marked as paid in test environment
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/applications`,
        applicationData,
        {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        }
      );

      toast.success("Payment processed successfully!");
      navigate("/payment-success", {
        state: { application: response.data.data },
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment processing failed");
      navigate("/payment-failed", {
        state: { error: error.response?.data?.message || "Payment failed" },
      });
    } finally {
      setProcessing(false);
    }
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

  const totalAmount = scholarship.applicationFees + scholarship.serviceCharge;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-base-100 py-12 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scholarship Summary */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="card bg-base-100 shadow-xl sticky top-4">
              <figure className="px-4 pt-4">
                <img
                  src={
                    scholarship.universityImage ||
                    "https://via.placeholder.com/300x200"
                  }
                  alt={scholarship.universityName}
                  className="rounded-lg h-40 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-lg line-clamp-2">
                  {scholarship.scholarshipName}
                </h2>
                <p className="text-sm font-semibold text-primary">
                  {scholarship.universityName}
                </p>

                <div className="divider"></div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Application Fee:</span>
                    <span className="font-semibold">
                      ${scholarship.applicationFees}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Charge:</span>
                    <span className="font-semibold">
                      ${scholarship.serviceCharge}
                    </span>
                  </div>
                  <div className="divider my-2"></div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 alert alert-info text-sm">
                  <FaInfoCircle className="text-lg" />
                  <span>Test Payment Mode - Use any card details</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Payment Details</h2>

                <div className="divider"></div>

                {/* User Info */}
                <div className="space-y-4 mb-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Name</span>
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
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="input input-bordered input-disabled"
                    />
                  </div>
                </div>

                <div className="divider"></div>

                {/* Card Payment Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <FaCreditCard /> Card Holder Name
                      </span>
                    </label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={cardInfo.cardHolder}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="input input-bordered"
                      required
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <FaCreditCard /> Card Number
                      </span>
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardInfo.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="input input-bordered font-mono"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Expiry Date
                        </span>
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={cardInfo.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className="input input-bordered font-mono"
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">CVC</span>
                      </label>
                      <input
                        type="text"
                        name="cvc"
                        value={cardInfo.cvc}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="3"
                        className="input input-bordered font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3 bg-base-200 p-4 rounded-lg">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <FaInfoCircle /> Test Card Numbers
                    </p>
                    <ul className="text-sm space-y-1 text-base-content/70 list-disc list-inside">
                      <li>Success: 4242 4242 4242 4242</li>
                      <li>Decline: 4000 0000 0000 0002</li>
                      <li>Any future expiry date (MM/YY)</li>
                      <li>Any 3-digit CVC</li>
                    </ul>
                  </div>

                  <div className="alert alert-warning">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4v2m0 0H9m3 0h3m-9-5h18M6.5 5h11C18.105 5 19 5.895 19 7v10c0 1.105-.895 2-2 2h-11c-1.105 0-2-.895-2-2V7c0-1.105.895-2 2-2z"
                      ></path>
                    </svg>
                    <span>
                      By proceeding, you accept the terms and conditions of this
                      scholarship application.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={processing}
                    className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <FaLock /> Pay ${totalAmount.toFixed(2)}
                      </>
                    )}
                  </button>
                </form>

                <p className="text-xs text-base-content/50 text-center flex items-center justify-center gap-2">
                  <FaLock className="text-xs" /> Your payment is secure and
                  encrypted
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
