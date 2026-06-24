import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMasterOpen, setIsMasterOpen] = useState(false);

  // LocalStorage se details nikalna
  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("user_role") || "USER";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Master Menu Click Handler with Security
  const handleMasterClick = () => {
    if (role !== "ADMIN") {
      alert(
        "🔒 Access Denied: Only Administrators have permission to manage Master Data.",
      );
      return;
    }
    setIsMasterOpen(!isMasterOpen);
  };

  return (
    <div className="flex h-screen bg-[#f3f4f7] font-sans">
      {/* --- SHRI MAA GROUP SIDEBAR --- */}
      <aside className="w-64 bg-[#1e2129] text-gray-300 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 bg-[#17191f] border-b border-gray-800">
          <span className="text-xl font-bold tracking-wider text-white">
            <span className="text-blue-500">SHRI</span> MAA GROUP
          </span>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <p className="px-6 text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">
            Main
          </p>

          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-6 py-3 transition-colors ${
              location.pathname === "/dashboard"
                ? "bg-blue-600 text-white"
                : "hover:text-white hover:bg-gray-800"
            }`}
          >
            <i className="fas fa-home w-5 text-center"></i> Dashboards
          </Link>

          <p className="px-6 text-xs text-gray-500 font-semibold mt-6 mb-2 uppercase tracking-wider">
            Modules
          </p>

          {/* SECURE MASTER MENU BUTTON */}
          <button
            onClick={handleMasterClick}
            className={`w-full flex items-center justify-between px-6 py-3 transition-colors uppercase text-sm font-medium outline-none ${
              isMasterOpen || location.pathname.includes("/master")
                ? "text-white bg-gray-800"
                : "hover:text-white hover:bg-gray-800 text-gray-300"
            } ${role !== "ADMIN" ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span>Master</span>
            </div>

            {/* Conditional Icon: Admin ko Arrow, User ko Lock dikhega */}
            {role === "ADMIN" ? (
              <i
                className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isMasterOpen ? "rotate-180" : ""}`}
              ></i>
            ) : (
              <i
                className="fas fa-lock text-[10px] text-gray-500"
                title="Locked - Admin Only"
              ></i>
            )}
          </button>

          {/* MASTER SUB-MENUS */}
          {isMasterOpen && role === "ADMIN" && (
            <div className="bg-[#17191f] py-2 flex flex-col animate-in slide-in-from-top-2 duration-200">
              <Link
                to="/master/firms"
                className={`px-10 py-2.5 text-sm transition-colors ${location.pathname === "/master/firms" ? "text-blue-400 font-bold" : "text-gray-400 hover:text-white"}`}
              >
                Firm
              </Link>
              <Link
                to="/master/locations"
                className={`px-10 py-2.5 text-sm transition-colors ${location.pathname === "/master/locations" ? "text-blue-400 font-bold" : "text-gray-400 hover:text-white"}`}
              >
                Location
              </Link>
              <Link
                to="/master/merchants"
                className={`px-10 py-2.5 text-sm transition-colors ${location.pathname === "/master/merchants" ? "text-blue-400 font-bold" : "text-gray-400 hover:text-white"}`}
              >
                Merchant
              </Link>
              <Link
                to="/master/models"
                className={`px-10 py-2.5 text-sm transition-colors ${location.pathname === "/master/models" ? "text-blue-400 font-bold" : "text-gray-400 hover:text-white"}`}
              >
                Model
              </Link>
            </div>
          )}

          {/* ORDERS REPORT LINK */}
          <Link
            to="/orders-report"
            className={`flex items-center px-6 py-3 transition-colors uppercase text-sm font-medium mt-1 ${
              location.pathname === "/orders-report"
                ? "bg-[#2a2e39] text-white border-l-4 border-blue-500"
                : "hover:text-white hover:bg-gray-800"
            }`}
          >
            Orders Report
          </Link>

          <Link
            to="/invoice-shipment"
            className="flex items-center px-6 py-3 hover:text-white hover:bg-gray-800 transition-colors uppercase text-sm font-medium"
          >
            Invoice Shipment
          </Link>
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:text-white hover:bg-gray-800 transition-colors uppercase text-sm font-medium"
          >
            Refund
          </a>
          <a
            href="#"
            className="flex items-center px-6 py-3 hover:text-white hover:bg-gray-800 transition-colors uppercase text-sm font-medium"
          >
            Reports
          </a>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg w-64 border border-gray-100">
            <i className="fas fa-search text-gray-400"></i>
            <input
              type="text"
              placeholder="Quick Search..."
              className="bg-transparent border-none outline-none ml-2 text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600">
              <i className="fas fa-moon text-lg"></i>
            </button>
            <button className="text-gray-400 hover:text-gray-600 relative">
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                7
              </span>
            </button>

            <div className="flex items-center gap-3 border-l pl-4 ml-2 border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#f6a88b] text-white flex items-center justify-center font-bold text-sm">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-700 leading-tight">
                  {username}
                </p>
                <p className="text-xs text-gray-500 font-bold tracking-wider">
                  {role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <i className="fas fa-sign-out-alt text-lg"></i>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
