import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FaSearch, FaFilter } from "react-icons/fa";

const AllScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchScholarships();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [scholarships, searchTerm, sortBy, filterCategory, filterCountry]);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/scholarships`
      );
      setScholarships(response.data.data || []);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSort = () => {
    let filtered = [...scholarships];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.degree.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((s) => s.scholarshipCategory === filterCategory);
    }

    // Country filter
    if (filterCountry !== "all") {
      filtered = filtered.filter((s) => s.universityCountry === filterCountry);
    }

    // Sort
    if (sortBy === "fees-low") {
      filtered.sort((a, b) => (a.applicationFees || 0) - (b.applicationFees || 0));
    } else if (sortBy === "fees-high") {
      filtered.sort((a, b) => (b.applicationFees || 0) - (a.applicationFees || 0));
    } else if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.scholarshipPostDate) - new Date(a.scholarshipPostDate));
    }

    setFilteredScholarships(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedScholarships = filteredScholarships.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const countries = [...new Set(scholarships.map((s) => s.universityCountry))];
  const categories = [...new Set(scholarships.map((s) => s.scholarshipCategory))];

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">All Scholarships</h1>
          <p className="text-lg text-base-content/70">
            Find and apply for scholarships that match your profile
          </p>
        </div>

        {/* Filters */}
        <div className="card bg-base-200 shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Search</span>
              </label>
              <input
                type="text"
                placeholder="Scholarship, University, Degree..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered"
              />
            </div>

            {/* Category Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Category</span>
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="select select-bordered"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Country</span>
              </label>
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="select select-bordered"
              >
                <option value="all">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Sort By</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select select-bordered"
              >
                <option value="recent">Most Recent</option>
                <option value="fees-low">Lowest Fees First</option>
                <option value="fees-high">Highest Fees First</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : displayedScholarships.length === 0 ? (
          <div className="alert alert-info">
            <span>No scholarships found matching your criteria.</span>
          </div>
        ) : (
          <>
            {/* Scholarships Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            >
              {displayedScholarships.map((scholarship) => (
                <motion.div
                  key={scholarship._id}
                  whileHover={{ scale: 1.03 }}
                  className="card bg-base-100 shadow-xl border border-base-300 hover:border-primary transition-all"
                >
                  <figure className="px-4 pt-4">
                    <img
                      src={scholarship.universityImage || "https://via.placeholder.com/400x250"}
                      alt={scholarship.universityName}
                      className="rounded-lg h-48 w-full object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title text-lg line-clamp-2">
                      {scholarship.scholarshipName}
                    </h3>
                    <p className="text-sm font-semibold text-primary">
                      {scholarship.universityName}
                    </p>
                    <p className="text-sm text-base-content/70">
                      {scholarship.universityCity}, {scholarship.universityCountry}
                    </p>

                    <div className="divider my-2"></div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Category:</span>
                        <span className="badge badge-primary">
                          {scholarship.scholarshipCategory}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Degree:</span>
                        <span>{scholarship.degree}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Application Fee:</span>
                        <span className="font-semibold">
                          ${scholarship.applicationFees || "Free"}
                        </span>
                      </div>
                    </div>

                    <div className="card-actions justify-end mt-4">
                      <Link
                        to={`/scholarship/${scholarship._id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-outline"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`btn ${currentPage === page ? "btn-primary" : "btn-outline"}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllScholarships;
