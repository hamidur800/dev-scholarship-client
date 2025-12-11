import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useEffect } from "react";
import useAuth from "../../Hooks/useAuth";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const application = location.state?.application;

  useEffect(() => {
    if (!application || !user) {
      navigate("/");
    }
  }, [application, user, navigate]);

  if (!application) {
    return null;
  }

  const totalAmount = application.applicationFees + application.serviceCharge;

  return (
    <div className="min-h-screen bg-linear-to-br from-success to-success-focus flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-6xl text-success" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-success mb-2">
              Payment Successful!
            </h1>
            <p className="text-base-content/70">
              Your application has been submitted successfully.
            </p>
          </div>

          {/* Application Details */}
          <div className="bg-base-200 rounded-lg p-6 text-left space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-base-content/70">Scholarship</p>
              <p className="font-semibold">{application.scholarshipName}</p>
            </div>

            <div className="divider my-2"></div>

            <div className="space-y-2">
              <p className="text-sm text-base-content/70">University</p>
              <p className="font-semibold">{application.universityName}</p>
            </div>

            <div className="divider my-2"></div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-base-content/70">Degree</p>
                <p className="font-semibold">{application.degree}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/70">Category</p>
                <p className="font-semibold">
                  {application.scholarshipCategory}
                </p>
              </div>
            </div>

            <div className="divider my-2"></div>

            <div className="bg-success/10 rounded p-3">
              <p className="text-sm text-base-content/70 mb-1">Amount Paid</p>
              <p className="text-2xl font-bold text-success">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Status */}
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
              Your application status is <strong>Pending</strong>. Our
              moderators will review it soon.
            </span>
          </div>

          {/* What's Next */}
          <div className="bg-base-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">What Happens Next?</h3>
            <ol className="text-sm text-left space-y-2 text-base-content/70">
              <li className="flex gap-2">
                <span className="badge badge-sm">1</span>
                <span>Your application is reviewed by our moderators</span>
              </li>
              <li className="flex gap-2">
                <span className="badge badge-sm">2</span>
                <span>You'll receive feedback on your application</span>
              </li>
              <li className="flex gap-2">
                <span className="badge badge-sm">3</span>
                <span>Check your dashboard for updates</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              to="/dashboard/my-applications"
              className="btn btn-primary btn-lg"
            >
              Go to My Applications
            </Link>
            <Link to="/all-scholarships" className="btn btn-outline btn-lg">
              Browse More Scholarships
            </Link>
          </div>

          {/* Reference */}
          <div className="text-xs text-base-content/50">
            <p>Application ID: {application._id}</p>
            <p>
              Date: {new Date(application.applicationDate).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
