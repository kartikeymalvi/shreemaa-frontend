// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios"; // Hamara secure axios instance
// import { jwtDecode } from "jwt-decode"; // Token se role nikalne ke liye
// import "./Login.css";

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [credentials, setCredentials] = useState({
//     username: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       // Backend JWT endpoint ko hit karna
//       const response = await api.post("auth/login/", credentials);
//       const { access, refresh } = response.data;

//       // Tokens ko localStorage me save karna
//       localStorage.setItem("access_token", access);
//       localStorage.setItem("refresh_token", refresh);

//       // Access token ko decode karke User Role nikalna
//       const decoded = jwtDecode(access);
//       localStorage.setItem("user_role", decoded.role);
//       localStorage.setItem("username", decoded.username);

//       alert(`Logged in successfully as ${decoded.role}!`);

//       // Role ke mutabik navigate karna
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Login failed:", err);
//       setError("Invalid Username or Password. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#1a1c23] flex items-center justify-center font-sans px-4">
//       <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center mb-3 text-3xl font-bold tracking-wider text-gray-800">
//             <span className="text-blue-500 mr-2">SHRI</span> MAA GROUP
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800">System Gateway</h2>
//           <p className="text-sm text-gray-500 mt-1">
//             Enter your assigned credentials to access modules
//           </p>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-5 text-center font-medium border border-red-100">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-5">
//           <div>
//             <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
//               Username
//             </label>
//             <input
//               type="text"
//               required
//               className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
//               placeholder="Enter username"
//               onChange={(e) =>
//                 setCredentials({ ...credentials, username: e.target.value })
//               }
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
//               Password
//             </label>
//             <input
//               type="password"
//               required
//               className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
//               placeholder="••••••••"
//               onChange={(e) =>
//                 setCredentials({ ...credentials, password: e.target.value })
//               }
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50 mt-2 text-sm"
//           >
//             {loading ? "Authenticating..." : "Secure Sign In"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../api/axios"; // Hamara secure axios instance
// import { jwtDecode } from "jwt-decode"; // Token se role nikalne ke liye
// import "./Login.css";
// import logo from "../assets/logo.png"; // Apna SMG logo
// import loginImage from "../assets/login-art.jpg";

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [credentials, setCredentials] = useState({
//     username: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       // Backend JWT endpoint ko hit karna
//       const response = await api.post("auth/login/", credentials);
//       const { access, refresh } = response.data;

//       // Tokens ko localStorage me save karna
//       localStorage.setItem("access_token", access);
//       localStorage.setItem("refresh_token", refresh);

//       // Access token ko decode karke User Role nikalna
//       const decoded = jwtDecode(access);
//       localStorage.setItem("user_role", decoded.role);
//       localStorage.setItem("username", decoded.username);

//       // Alert optional hai, hata bhi sakte ho smooth transition ke liye
//       alert(`Logged in successfully as ${decoded.role}!`);

//       // Role ke mutabik navigate karna
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Login failed:", err);
//       setError("Invalid Username or Password. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-page-container">
//       <div className="login-card">
//         {/* Left Side: Form Section */}
//         <div className="login-form-section">
//           <img src={logo} alt="Shri Maa Group" className="login-logo" />

//           <p className="welcome-text">Welcome back !!!</p>
//           <h1 className="login-title">Log In</h1>

//           {/* Error Message Box */}
//           {error && (
//             <div
//               style={{
//                 backgroundColor: "#fee2e2",
//                 color: "#991b1b",
//                 padding: "12px",
//                 borderRadius: "8px",
//                 fontSize: "0.85rem",
//                 fontWeight: "600",
//                 marginBottom: "15px",
//                 border: "1px solid #f87171",
//               }}
//             >
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleLogin}>
//             <div className="input-group">
//               <div className="label-row">
//                 <label className="input-label">Username</label>
//               </div>
//               <input
//                 type="text"
//                 className="login-input"
//                 placeholder="Enter username"
//                 value={credentials.username}
//                 onChange={(e) =>
//                   setCredentials({ ...credentials, username: e.target.value })
//                 }
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <div className="label-row">
//                 <label className="input-label">Password</label>
//                 <Link to="/forgot-password" className="forgot-link">
//                   Forgot Password?
//                 </Link>
//               </div>
//               <input
//                 type="password"
//                 className="login-input"
//                 placeholder="••••••••••••"
//                 value={credentials.password}
//                 onChange={(e) =>
//                   setCredentials({ ...credentials, password: e.target.value })
//                 }
//                 required
//               />
//             </div>

//             <button type="submit" className="submit-btn" disabled={loading}>
//               {loading ? "Authenticating..." : "LOGIN →"}
//             </button>
//           </form>

//           <div className="divider">or continue with</div>

//           <div className="social-login">
//             <button className="social-btn">
//               {/* Google SVG Icon */}
//               <svg className="social-icon" viewBox="0 0 24 24">
//                 <path
//                   fill="#4285F4"
//                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                 />
//                 <path
//                   fill="#34A853"
//                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                 />
//                 <path
//                   fill="#FBBC05"
//                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                 />
//                 <path
//                   fill="#EA4335"
//                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                 />
//               </svg>
//             </button>
//             <button className="social-btn">
//               {/* Github SVG Icon */}
//               <svg
//                 className="social-icon"
//                 fill="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//             <button className="social-btn">
//               {/* Facebook SVG Icon */}
//               <svg className="social-icon" fill="#1877F2" viewBox="0 0 24 24">
//                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//               </svg>
//             </button>
//           </div>

//           <p className="signup-text">
//             Don't have credetials yet?
//             <Link to="/register" className="signup-link">
//               Contact Adminstrator
//             </Link>
//           </p>
//         </div>

//         {/* Right Side: Illustration Section */}
//         <div className="login-image-section">
//           {/* Ek default premium 3D illustration jo reference image jaisi vibe degi */}
//           <img
//             src={loginImage}
//             alt="Secure Login System"
//             className="illustration-img"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
// Note: Login.css aur purane images hata diye hain kyunki ab hum pure Tailwind use kar rahe hain.

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
      const response = await api.post("auth/login/", credentials);
      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      const decoded = jwtDecode(access);
      localStorage.setItem("user_role", decoded.role);
      localStorage.setItem("username", decoded.username);

      // Successfully logged in
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid Username or Password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans bg-gray-50">
      {/* LEFT SIDE - BRANDING (Dark Navy Blue) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 border border-slate-700/50 rounded-full opacity-50"></div>
        <div className="absolute top-10 left-10 w-2 h-2 bg-amber-500 rounded-full"></div>

        <div className="z-10">
          <h2 className="flex items-center gap-2 text-amber-500 text-sm font-bold tracking-widest uppercase mb-12">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            SHRI MAA GROUP
          </h2>
          <h1 className="text-white text-3xl font-bold leading-[1.15] mb-6 tracking-tight">
            Every order, <br /> tracked from click <br /> to doorstep.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            Dashboard • Approvals • Masters • Orders • Invoice & Shipment •
            Reports — one secure console for Shri Maa Group.
          </p>
        </div>

        <div className="z-10">
          <span className="border border-slate-700 text-slate-400 text-xs font-bold px-3 py-1.5 rounded-md tracking-widest uppercase bg-slate-800/50 flex items-center w-max gap-2">
            <i className="fas fa-shield-alt text-teal-400"></i>
            System Secure
          </span>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM (Clean White) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Sign in
            </h2>
            <p className="text-slate-500 text-sm">
              Access the Shri Maa Group ERP console.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Tailwind Error Alert */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-semibold border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <i className="fas fa-exclamation-circle text-red-500"></i>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-slate-700 font-medium bg-gray-50/50"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                >
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-slate-900 font-black tracking-widest bg-gray-50/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3.5 px-4 rounded-lg transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Authenticating...
                </>
              ) : (
                <>
                  Sign in <i className="fas fa-arrow-right text-sm"></i>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}