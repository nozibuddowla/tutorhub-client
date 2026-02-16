import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-purple-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
        </div>

        {/* Logo/Brand */}
        <div className="mb-4">
          <h1 className="text-4xl font-black bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            TutorHub
          </h1>
        </div>

        {/* Loading Text */}
        <p className="text-gray-600 font-semibold animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
