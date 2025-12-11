import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    photoURL: user?.photoURL || "",
    phone: user?.phone || "",
    address: user?.address || "",
    bio: user?.bio || "",
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
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${user?.uid}/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Update local user context
        setUser({
          ...user,
          displayName: formData.name,
          photoURL: formData.photoURL,
          phone: formData.phone,
          address: formData.address,
          bio: formData.bio,
        });

        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-4xl font-bold mb-8">Edit Profile</h1>

      <div className="card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered focus:input-primary"
                placeholder="Your name"
              />
            </div>

            {/* Email (Read-only) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                value={formData.email}
                className="input input-bordered bg-base-200"
                disabled
              />
              <label className="label">
                <span className="label-text-alt text-xs text-base-content/70">
                  Email cannot be changed
                </span>
              </label>
            </div>

            {/* Photo URL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Photo URL</span>
              </label>
              <input
                type="url"
                name="photoURL"
                value={formData.photoURL}
                onChange={handleChange}
                className="input input-bordered focus:input-primary"
                placeholder="https://example.com/photo.jpg"
              />
              {formData.photoURL && (
                <div className="mt-4">
                  <img
                    src={formData.photoURL}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/100?text=Invalid+Image";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Phone Number</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input input-bordered focus:input-primary"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Address */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Address</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="textarea textarea-bordered focus:textarea-primary"
                placeholder="Your address"
                rows={2}
              ></textarea>
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="textarea textarea-bordered focus:textarea-primary"
                placeholder="Tell us about yourself"
                rows={4}
                maxLength={500}
              ></textarea>
              <label className="label">
                <span className="label-text-alt">
                  {formData.bio.length} / 500
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="form-control pt-4">
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      name: user?.displayName || "",
                      email: user?.email || "",
                      photoURL: user?.photoURL || "",
                      phone: user?.phone || "",
                      address: user?.address || "",
                      bio: user?.bio || "",
                    });
                    toast.success("Form reset");
                  }}
                  className="btn btn-outline flex-1"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default EditProfile;
