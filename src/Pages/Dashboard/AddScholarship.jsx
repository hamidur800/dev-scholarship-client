import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const AddScholarship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    scholarshipName: "",
    universityName: "",
    universityImage: "",
    universityCountry: "",
    universityCity: "",
    worldRank: "",
    subjectCategory: "",
    scholarshipCategory: "",
    degree: "",
    tuitionFees: "",
    applicationFees: "",
    serviceCharge: "",
    applicationDeadline: "",
    scholarshipPostDate: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/scholarships`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Scholarship added successfully!");
        navigate("/dashboard/manage-scholarships");
      }
    } catch (error) {
      console.error("Error adding scholarship:", error);
      toast.error(error.response?.data?.message || "Failed to add scholarship");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["STEM", "Business", "Humanities", "Arts", "Medicine"];
  const degrees = ["Diploma", "Bachelor", "Masters", "PhD"];
  const countries = [
    "USA",
    "UK",
    "Canada",
    "Australia",
    "Germany",
    "Singapore",
    "Japan",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl"
    >
      <h1 className="text-4xl font-bold mb-8">Add New Scholarship</h1>

      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Scholarship Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Scholarship Name *</span>
              </label>
              <input
                type="text"
                name="scholarshipName"
                value={formData.scholarshipName}
                onChange={handleChange}
                required
                className="input input-bordered focus:input-primary"
                placeholder="e.g., Merit Excellence Scholarship"
              />
            </div>

            {/* University Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">University Name *</span>
                </label>
                <input
                  type="text"
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleChange}
                  required
                  className="input input-bordered focus:input-primary"
                  placeholder="e.g., Harvard University"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">World Rank *</span>
                </label>
                <input
                  type="number"
                  name="worldRank"
                  value={formData.worldRank}
                  onChange={handleChange}
                  required
                  className="input input-bordered focus:input-primary"
                  placeholder="e.g., 1"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Country *</span>
                </label>
                <select
                  name="universityCountry"
                  value={formData.universityCountry}
                  onChange={handleChange}
                  required
                  className="select select-bordered focus:select-primary"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">City *</span>
                </label>
                <input
                  type="text"
                  name="universityCity"
                  value={formData.universityCity}
                  onChange={handleChange}
                  required
                  className="input input-bordered focus:input-primary"
                  placeholder="e.g., Cambridge"
                />
              </div>
            </div>

            {/* University Image */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">University Image URL *</span>
              </label>
              <input
                type="url"
                name="universityImage"
                value={formData.universityImage}
                onChange={handleChange}
                required
                className="input input-bordered focus:input-primary"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Categories and Degree */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Subject Category *</span>
                </label>
                <select
                  name="subjectCategory"
                  value={formData.subjectCategory}
                  onChange={handleChange}
                  required
                  className="select select-bordered focus:select-primary"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Scholarship Category *</span>
                </label>
                <select
                  name="scholarshipCategory"
                  value={formData.scholarshipCategory}
                  onChange={handleChange}
                  required
                  className="select select-bordered focus:select-primary"
                >
                  <option value="">Select Category</option>
                  <option value="Full Ride">Full Ride</option>
                  <option value="Partial">Partial</option>
                  <option value="Merit Based">Merit Based</option>
                  <option value="Need Based">Need Based</option>
                </select>
              </div>
            </div>

            {/* Degree */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Degree Level *</span>
              </label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                required
                className="select select-bordered focus:select-primary"
              >
                <option value="">Select Degree</option>
                {degrees.map((deg) => (
                  <option key={deg} value={deg}>
                    {deg}
                  </option>
                ))}
              </select>
            </div>

            {/* Fees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Tuition Fees (Annual) *</span>
                </label>
                <input
                  type="number"
                  name="tuitionFees"
                  value={formData.tuitionFees}
                  onChange={handleChange}
                  required
                  className="input input-bordered focus:input-primary"
                  placeholder="e.g., 50000"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Application Fee *</span>
                </label>
                <input
                  type="number"
                  name="applicationFees"
                  value={formData.applicationFees}
                  onChange={handleChange}
                  required
                  className="input input-bordered focus:input-primary"
                  placeholder="e.g., 100"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Service Charge *</span>
                </label>
                <input
                  type="number"
                  name="serviceCharge"
                  value={formData.serviceCharge}
                  onChange={handleChange}
                  required
                  className="input input-bordered focus:input-primary"
                  placeholder="e.g., 20"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Application Deadline *</span>
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  required
                  className="input input-bordered focus:input-primary"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Post Date</span>
                </label>
                <input
                  type="date"
                  name="scholarshipPostDate"
                  value={formData.scholarshipPostDate}
                  onChange={handleChange}
                  className="input input-bordered focus:input-primary bg-base-200"
                  disabled
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="form-control pt-4">
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? "Adding..." : "Add Scholarship"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/manage-scholarships")}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AddScholarship;
