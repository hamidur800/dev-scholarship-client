import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const SearchScholarships = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/scholarships?search=${searchQuery}`
      );
      setResults(response.data.data || []);
    } catch (error) {
      console.error("Error searching scholarships:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-8">Search Scholarships</h1>

      <div className="card bg-base-100 shadow-xl border border-base-300 mb-8">
        <div className="card-body">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="form-control flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by scholarship name, university, or country..."
                className="input input-bordered focus:input-primary w-full"
              />
            </div>
            <button
              type="submit"
              disabled={!searchQuery.trim() || loading}
              className="btn btn-primary gap-2"
            >
              <FaSearch /> {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center min-h-96">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <div className="alert alert-warning">
          <p>No scholarships found matching "{searchQuery}"</p>
        </div>
      )}

      {results.length > 0 && (
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {results.map((scholarship) => (
            <motion.div
              key={scholarship._id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="card bg-base-100 shadow-lg border border-base-300 hover:border-primary transition-all"
            >
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
                <h3 className="card-title text-lg line-clamp-2">
                  {scholarship.scholarshipName}
                </h3>
                <p className="text-sm font-semibold text-primary">
                  {scholarship.universityName}
                </p>
                <p className="text-xs text-base-content/70">
                  {scholarship.universityCity}, {scholarship.universityCountry}
                </p>

                <div className="divider my-2"></div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="badge badge-sm badge-primary">
                      {scholarship.scholarshipCategory}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>App. Fee:</span>
                    <span>${scholarship.applicationFees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Degree:</span>
                    <span className="text-xs">{scholarship.degree}</span>
                  </div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <a
                    href={`/scholarship/${scholarship._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-12 card bg-info/10 border border-info/30"
      >
        <div className="card-body">
          <h3 className="card-title text-info text-lg">Search Tips</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Search by scholarship name for specific programs</li>
            <li>Use university names to find all scholarships from that university</li>
            <li>Search by country code (e.g., "USA", "UK", "Canada")</li>
            <li>Try degree level searches (e.g., "Bachelor", "Masters", "PhD")</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchScholarships;
