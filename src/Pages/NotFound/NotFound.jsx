import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-base-200 to-base-300 p-4">
      <div className="text-center space-y-6">
        <div className="text-9xl font-bold text-primary">404</div>
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="text-xl text-base-content/70 max-w-md">
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link to="/" className="btn btn-primary btn-lg gap-2">
            <FaHome /> Go to Home
          </Link>
          <Link to="/all-scholarships" className="btn btn-outline btn-lg">
            Browse Scholarships
          </Link>
        </div>

        <div className="mt-12 text-base-content/50">
          <p>Error Code: 404 - Not Found</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
