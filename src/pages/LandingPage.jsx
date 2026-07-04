

// 1st LANDING PAGE-----------------------------------------------

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-[#1a1c23] flex flex-col items-center justify-center text-white font-sans">
//       <div className="text-center">
//         <div className="flex items-center justify-center mb-6 text-5xl font-bold tracking-wider">
//           <span className="text-blue-500 mr-3">SHRI</span> MAA GROUP
//         </div>
//         <h1 className="text-4xl md:text-5xl font-bold mb-6">
//           Enterprise Management <span className="text-blue-500">System</span>
//         </h1>
//         <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
//           Secure, scalable, and intelligent dashboard for all your business
//           analytics, user management, and PDF records.
//         </p>

//         <div className="flex justify-center gap-4">
//           <Link
//             to="/login"
//             className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/30"
//           >
//             Go to Login <i className="fas fa-arrow-right ml-2"></i>
//           </Link>
//         </div>
//       </div>

//       {/* Footer */}
//       <div className="absolute bottom-6 text-sm text-gray-600">
//         © 2026 Developed by kartikey malviya
//       </div>
//     </div>
//   );
// }

// 2ND LANDING DESIGN

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import logo from "../assets/logo.png";

const LandingPage = () => {
  const [stars, setStars] = useState([]);

  
  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 3 + 1}px`,
      height: `${Math.random() * 3 + 1}px`,
      animationDuration: `${Math.random() * 5 + 4}s`, 
      animationDelay: `${Math.random() * 5}s`, 
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="landing-wrapper">
      {/* Animated Floating Stars Background */}
      <div className="stars-container">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              width: star.width,
              height: star.height,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay,
            }}
          ></div>
        ))}
      </div>

      {/* Top Navigation */}
      <nav className="landing-nav animate-fade-in">
        {/* Logo wrapped in a white pill to pop on dark background */}
        <div className="logo-wrapper">
          <img src={logo} alt="Shri Maa Group Logo" className="actual-logo" />
        </div>

        <div className="nav-links">
          <span>How it Works</span>
          <span>Modules</span>
          <span>Company</span>
        </div>

        <Link to="/login" className="nav-btn">
          LogIn
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content animate-slide-up">
          <p className="hero-kicker">Experience Shri Maa Group's</p>
          <h1 className="hero-main-title">
            Intelligent Insights,
            <br /> Powerful Operations
          </h1>
          <p className="hero-subtitle">
            A highly secure,dashboard for seamless business
            analytics, enterprise tracking, and maintain records.
          </p>
          <Link to="/login" className="hero-cta-btn">
            Access Dashboard
          </Link>
        </div>
      </main>

      {/* Pure Glassmorphism Dashboard Preview */}
      <div className="dashboard-preview animate-slide-up-delayed">
        <div className="preview-header">
          
          <h2>Welcome !!!</h2>
        </div>
        <div className="preview-body">
          {/* <p>
            DEMO ADMIN LOGIN ---------
            Username : admin,
            Password:1234,--------------------
           -------- DEMO User Login------
            Username : user,
            Password : 1234


          </p> */}

          {/* <div className="preview-skeleton-cards">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;


// 3RD design-----------------------------------------------------------

// import React from "react";
// import { Link } from "react-router-dom";
// import "./Landing.css";
// import logo from "../assets/logo.png";

// const LandingPage = () => {
//   return (
//     <div className="landing-wrapper">
//       {/* Soft Light Background Orbs */}
//       <div className="bg-orb orb-1"></div>
//       <div className="bg-orb orb-2"></div>

//       {/* Top Navigation */}
//       <nav className="landing-nav animate-fade-in">
//         {/* Logo bina wrapper ke. CSS iska white background khud transparent kar dega */}
//         <div className="nav-logo">
//           <img src={logo} alt="Shri Maa Group Logo" className="actual-logo" />
//         </div>

//         <div className="nav-links">
//           <span>Overview</span>
//           <span>Core Modules</span>
//           <span>Support</span>
//         </div>

//         <Link to="/login" className="nav-btn">
//           Client Portal
//         </Link>
//       </nav>

//       {/* Hero Section */}
//       <main className="hero-section">
//         <div className="hero-content animate-slide-up">
//           <p className="hero-kicker">Enterprise Grade Efficiency</p>
//           <h1 className="hero-main-title">
//             Smart Operations,
//             <br /> Seamless Growth
//           </h1>
//           <p className="hero-subtitle">
//             A comprehensive, highly secure dashboard tailored for Shri Maa
//             Group's analytics, logistics, and complete workflow automation.
//           </p>
//           <Link to="/login" className="hero-cta-btn">
//             Access Dashboard
//           </Link>
//         </div>
//       </main>

//       {/* Light Frosted Glass Dashboard Preview */}
//       <div className="dashboard-preview animate-slide-up-delayed">
//         <div className="preview-header">
//           <img src={logo} alt="Logo Mini" className="preview-mini-logo" />
//           <h2>Welcome Back, Administrator!</h2>
//         </div>
//         <p>
//           Your secure session is active. Here is a real-time overview of today's
//           metrics.
//         </p>

//         {/* The New Mock Widgets (Replacing Blank Cards) */}
//         <div className="preview-widgets-container">
//           {/* Widget 1: Revenue */}
//           <div className="mock-widget">
//             <div className="widget-top">
//               <span className="widget-title">Total Revenue</span>
//               <span className="widget-badge">+12%</span>
//             </div>
//             <div className="widget-value">₹42.5L</div>
//             <div className="mini-chart">
//               <div className="chart-bar" style={{ height: "40%" }}></div>
//               <div className="chart-bar" style={{ height: "60%" }}></div>
//               <div className="chart-bar" style={{ height: "50%" }}></div>
//               <div className="chart-bar active" style={{ height: "90%" }}></div>
//             </div>
//           </div>

//           {/* Widget 2: Shipments */}
//           <div className="mock-widget">
//             <div className="widget-top">
//               <span className="widget-title">Active Orders</span>
//               <span className="widget-badge">+5%</span>
//             </div>
//             <div className="widget-value">1,284</div>
//             <div className="mini-chart">
//               <div className="chart-bar" style={{ height: "70%" }}></div>
//               <div className="chart-bar" style={{ height: "40%" }}></div>
//               <div
//                 className="chart-bar active"
//                 style={{ height: "100%" }}
//               ></div>
//               <div className="chart-bar" style={{ height: "60%" }}></div>
//             </div>
//           </div>

//           {/* Widget 3: Users */}
//           <div className="mock-widget">
//             <div className="widget-top">
//               <span className="widget-title">System Health</span>
//               <span className="widget-badge">Optimal</span>
//             </div>
//             <div className="widget-value">99.9%</div>
//             <div className="mini-chart">
//               <div className="chart-bar active" style={{ height: "80%" }}></div>
//               <div className="chart-bar active" style={{ height: "85%" }}></div>
//               <div className="chart-bar active" style={{ height: "90%" }}></div>
//               <div className="chart-bar active" style={{ height: "95%" }}></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;