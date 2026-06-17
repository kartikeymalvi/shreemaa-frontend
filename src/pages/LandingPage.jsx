import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1a1c23] flex flex-col items-center justify-center text-white font-sans">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6 text-5xl font-bold tracking-wider">
          <span className="text-blue-500 mr-3">SHRI</span> MAA GROUP
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Enterprise Management <span className="text-blue-500">System</span>
        </h1>
        <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
          Secure, scalable, and intelligent dashboard for all your business
          analytics, user management, and PDF records.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/30"
          >
            Go to Login <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-sm text-gray-600">
        © 2026 Developed by kartikey malviya
      </div>
    </div>
  );
}
