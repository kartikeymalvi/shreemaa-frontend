import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // Hamara secure axios instance
import { jwtDecode } from "jwt-decode"; // Token se role nikalne ke liye

export default function LoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Backend JWT endpoint ko hit karna
      const response = await api.post("auth/login/", credentials);
      const { access, refresh } = response.data;

      // Tokens ko localStorage me save karna
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // Access token ko decode karke User Role nikalna
      const decoded = jwtDecode(access);
      localStorage.setItem("user_role", decoded.role);
      localStorage.setItem("username", decoded.username);

      alert(`Logged in successfully as ${decoded.role}!`);

      // Role ke mutabik navigate karna
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid Username or Password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1c23] flex items-center justify-center font-sans px-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3 text-3xl font-bold tracking-wider text-gray-800">
            <span className="text-blue-500 mr-2">SHRI</span> MAA GROUP
          </div>
          <h2 className="text-2xl font-bold text-gray-800">System Gateway</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your assigned credentials to access modules
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-5 text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
              placeholder="Enter username"
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
              placeholder="••••••••"
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50 mt-2 text-sm"
          >
            {loading ? "Authenticating..." : "Secure Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
