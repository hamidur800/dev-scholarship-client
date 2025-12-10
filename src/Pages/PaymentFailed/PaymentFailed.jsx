import { useLocation, Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailed = () => {
  const location = useLocation();
  const error = location.state?.error || "Unknown error occurred";

  return (
    <div className="min-h-screen bg-linear-to-br from-error to-error-focus flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-error/20 rounded-full flex items-center justify-center">
              <FaTimesCircle className="text-6xl text-error" />
            </div>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-error mb-2">Payment Failed</h1>
            <p className="text-base-content/70">
              We couldn't process your payment. Please try again.
            </p>
          </div>

          {/* Error Message */}
          <div className="bg-error/10 rounded-lg p-4 border border-error/20">
            <p className="text-sm text-error font-semibold">Error Message:</p>
            <p className="text-sm text-base-content/70 mt-2">{error}</p>
          </div>

          {/* Why This Happened */}
          <div className="bg-base-200 rounded-lg p-4 text-left space-y-2">
            <h3 className="font-semibold mb-2">Why did this happen?</h3>
            <ul className="text-sm text-base-content/70 space-y-1 list-disc list-inside">
              <li>Insufficient funds in your account</li>
              <li>Invalid card information</li>
              <li>Expired card or incorrect expiry date</li>
              <li>Card declined by your bank</li>
              <li>Temporary payment gateway issue</li>
            </ul>
          </div>

          {/* Tips */}
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
              Don't worry! Your application wasn't created yet. You can retry the payment from your dashboard.
            </span>
          </div>

          {/* What You Can Do */}
          <div className="bg-base-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">What can you do?</h3>
            <ol className="text-sm text-left space-y-2 text-base-content/70">
              <li className="flex gap-2">
                <span className="badge badge-sm">1</span>
                <span>Check your card details and try again</span>
              </li>
              <li className="flex gap-2">
                <span className="badge badge-sm">2</span>
                <span>Try a different payment method</span>
              </li>
              <li className="flex gap-2">
                <span className="badge badge-sm">3</span>
                <span>Contact your bank for more information</span>
              </li>
              <li className="flex gap-2">
                <span className="badge badge-sm">4</span>
                <span>Contact our support team for assistance</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Return to Dashboard
            </Link>
            <Link to="/all-scholarships" className="btn btn-outline btn-lg">
              Browse Scholarships
            </Link>
          </div>

          {/* Support */}
          <div className="text-sm text-base-content/70">
            <p>Need help? Contact our support team</p>
            <p className="font-semibold">support@scholarstream.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
