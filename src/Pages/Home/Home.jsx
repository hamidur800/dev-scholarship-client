import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { FaSearch, FaStar, FaQuoteLeft, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Home = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTopScholarships();
  }, []);

  const fetchTopScholarships = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/scholarships?limit=6&sort=applicationFees:asc`
      );
      setScholarships(response.data.data || []);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div>
      {/* Hero Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-linear-to-r from-primary to-primary-focus text-primary-content py-20 px-4"
      >
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold"
          >
            Find Your Perfect Scholarship
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl opacity-90"
          >
            Connect with life-changing scholarship opportunities and achieve your educational dreams
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex gap-4 justify-center flex-col sm:flex-row"
          >
            <Link to="/all-scholarships" className="btn btn-lg btn-secondary gap-2">
              <FaSearch /> Search Scholarships
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Top Scholarships Section */}
      <section className="py-20 px-4 bg-base-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Top Scholarship Opportunities</h2>
            <p className="text-xl text-base-content/70">
              Discover the most accessible and rewarding scholarships
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center min-h-96">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {scholarships.map((scholarship) => (
                <motion.div
                  key={scholarship._id}
                  variants={itemVariants}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
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
                    <p className="text-sm text-base-content/70">
                      {scholarship.universityName}, {scholarship.universityCountry}
                    </p>
                    <div className="flex justify-between text-sm my-2">
                      <span className="badge badge-primary">
                        {scholarship.scholarshipCategory}
                      </span>
                      <span className="badge badge-outline">
                        ${scholarship.applicationFees || "Free"}
                      </span>
                    </div>
                    <div className="card-actions justify-end">
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
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/all-scholarships" className="btn btn-outline btn-lg">
              View All Scholarships
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-4 bg-base-200">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-base-content/70">
              Inspiring stories from students who achieved their dreams
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                name: "Sarah Ahmed",
                university: "Oxford University",
                story: "With the help of this platform, I found a full scholarship to Oxford. It changed my life and opened doors I never thought possible.",
                rating: 5,
              },
              {
                name: "James Wilson",
                university: "MIT",
                story: "The comprehensive scholarship database helped me secure a partial scholarship at MIT. The process was smooth and transparent.",
                rating: 5,
              },
              {
                name: "Emma Thompson",
                university: "Cambridge University",
                story: "I found my perfect scholarship match within weeks. The platform's search feature is incredibly powerful and user-friendly.",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="card bg-base-100 shadow-lg"
              >
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <FaStar key={i} className="text-warning" />
                    ))}
                  </div>
                  <FaQuoteLeft className="text-3xl text-primary mb-2" />
                  <p className="mb-4 italic">{testimonial.story}</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-base-content/70">{testimonial.university}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-base-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-base-content/70">
              Get answers to common questions about scholarships
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              {
                q: "How do I apply for a scholarship?",
                a: "Browse our scholarship database, find one that matches your profile, and click 'Apply'. You'll need to pay a small application fee to proceed.",
              },
              {
                q: "Are there scholarships for all fields?",
                a: "Yes! We have scholarships across various fields including STEM, Business, Arts, Medicine, and many more.",
              },
              {
                q: "What happens after I apply?",
                a: "Our moderators will review your application and provide feedback. You'll be able to track your application status in your dashboard.",
              },
              {
                q: "Is there a fee to use ScholarStream?",
                a: "Browsing scholarships is completely free! You only pay a small application fee when you apply for specific scholarships.",
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="collapse collapse-plus bg-base-200"
              >
                <input type="radio" name="faq-accordion" defaultChecked={idx === 0} />
                <div className="collapse-title text-xl font-semibold">{faq.q}</div>
                <div className="collapse-content">
                  <p className="text-base-content/80">{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-linear-to-r from-primary to-primary-focus text-primary-content">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-lg opacity-90">
              Have questions? We'd love to hear from you
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div variants={itemVariants} className="text-center space-y-3">
              <FaPhone className="text-4xl mx-auto" />
              <h3 className="font-semibold text-lg">Phone</h3>
              <p className="opacity-90">+1 (555) 123-4567</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center space-y-3">
              <FaEnvelope className="text-4xl mx-auto" />
              <h3 className="font-semibold text-lg">Email</h3>
              <p className="opacity-90">support@scholarstream.com</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center space-y-3">
              <FaMapMarkerAlt className="text-4xl mx-auto" />
              <h3 className="font-semibold text-lg">Location</h3>
              <p className="opacity-90">123 Education St, Knowledge City</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
