import React from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-bounce">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500">
            Don't worry, let's get you back on track! 🚀
          </p>
        </div>

        {/* Illustration/Icon */}
        <div className="mb-8 flex justify-center gap-4 text-6xl">
          <span className="animate-bounce" style={{ animationDelay: "0s" }}>
            📚
          </span>
          <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>
            🤔
          </span>
          <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
            🔍
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg w-full sm:w-auto"
          >
            🏠 Go to Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors border-2 border-gray-200 shadow-lg w-full sm:w-auto"
          >
            ← Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4 font-semibold">
            Quick Links to Popular Pages:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/tuitions"
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition-colors"
            >
              Browse Tuitions
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
