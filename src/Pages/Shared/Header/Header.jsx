import { Link } from "react-router";
import { useState } from "react";
import useAuth from "../../../Hooks/useAuth";

const Header = () => {
  const { user, logOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogOut = () => {
    logOut()
      .then()
      .catch((error) => {
        console.log(error);
      });
  };

  const navLinks = (
    <>
      <li>
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
      </li>
      <li>
        <Link to="/all-scholarships" className="hover:text-primary">
          All Scholarships
        </Link>
      </li>
    </>
  );

  return (
    <nav className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl font-bold text-primary">
          ScholarStream
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="flex-none hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-2">{navLinks}</ul>

        {!user ? (
          <div className="gap-2">
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline btn-primary btn-sm">
              Register
            </Link>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  src={
                    user?.photoURL ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                      user?.email
                  }
                  alt={user?.displayName || "User"}
                />
              </div>
            </button>
            {dropdownOpen && (
              <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <a className="font-semibold">
                    {user?.displayName || user?.email}
                  </a>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <a onClick={handleLogOut}>Logout</a>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="flex-none md:hidden">
        <div className="dropdown dropdown-end">
          <button className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            {navLinks}
            {!user ? (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <a onClick={handleLogOut}>Logout</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
