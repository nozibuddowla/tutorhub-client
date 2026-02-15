import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Link } from "react-router";

const LatestTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/tutors`,
        );
        setTutors(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tutors:", error);
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto py-20 px-4">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-cyan-600 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="text-gray-400 font-medium">Loading tutors...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative max-w-7xl mx-auto py-24 px-4 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-300 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-500 to-cyan-500 text-white text-sm font-bold rounded-full mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          VERIFIED PROFESSIONALS
        </span>

        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Meet Our{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-cyan-600">
            Expert Tutors
          </span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with qualified educators who are passionate about helping you
          succeed
        </p>
      </motion.div>

      {/* Tutors Grid */}
      {tutors.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {tutors.map((tutor, index) => (
            <motion.div
              key={tutor._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                {/* Avatar */}
                <div className="relative mb-4">
                  <img
                    src={
                      tutor.photoURL ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${tutor.name}`
                    }
                    className="w-24 h-24 rounded-2xl mx-auto object-cover ring-4 ring-gray-100 group-hover:ring-purple-400 transition-all duration-300"
                    alt={tutor.name}
                  />

                  {/* Verified Badge */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-linear-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    ✓
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-purple-600 transition-all mb-1">
                    {tutor.name}
                  </h3>
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center justify-center gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                    {tutor.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="text-6xl mb-4">👨‍🏫</div>
          <p className="text-gray-500 text-lg font-medium">
            No tutors available yet. Check back soon!
          </p>
        </div>
      )}

      {/* CTA Button */}
      <div className="text-center mt-16">
        <Link to="/tutors">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-linear-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            View All Tutors →
          </motion.button>
        </Link>
      </div>
    </section>
  );
};

export default LatestTutors;
