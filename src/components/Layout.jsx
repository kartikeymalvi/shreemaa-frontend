// import React from "react";
// import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
// import logo from "../assets/logo.png";

// export default function Layout() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const username = localStorage.getItem("username") || "User";
//   const role = localStorage.getItem("user_role") || "USER";

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   return (
//     <div className="flex h-screen bg-gray-50 font-sans">
//       {/* --- SHRI MAA GROUP SIDEBAR (Slate Theme) --- */}
//       <aside className="w-48 bg-slate-900 text-white min-h-screen flex flex-col transition-all duration-300">
//         {/* --- BRANDING / LOGO SECTION (CLEAN TEXT THEME) --- */}
//         <div className="h-20 flex items-center px-6 bg-slate-950 border-b border-slate-800/50 shadow-md">
//           <Link
//             to="/dashboard"
//             className="flex items-center gap-3 cursor-pointer w-full group"
//           >
//             {/* Blinking Server Dots */}
//             <div className="flex gap-1.5 mt-0.5">
//               <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
//               <div
//                 className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]"
//                 style={{ animationDelay: "0.5s" }}
//               ></div>
//             </div>

//             {/* Clean Name without Image */}
//             <div className="flex flex-col">
//               <span className="text-[15px] leading-tight font-black tracking-[0.15em] text-white uppercase group-hover:text-amber-500 transition-colors">
//                 SHRI MAA GROUP
//               </span>
//             </div>
//           </Link>
//         </div>

//         <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
//           <p className="px-6 text-[10px] text-slate-500 font-bold mb-3 uppercase tracking-widest">
//             Main
//           </p>

//           <Link
//             to="/dashboard"
//             className={`flex items-center gap-3 px-6 py-3 transition-colors text-sm font-medium ${
//               location.pathname === "/dashboard"
//                 ? "bg-amber-500 text-slate-900 border-r-4 border-amber-600"
//                 : "hover:text-white hover:bg-slate-800"
//             }`}
//           >
//             <i className="fas fa-chart-pie w-5 text-center"></i> Dashboards
//           </Link>

//           <p className="px-6 text-[10px] text-slate-500 font-bold mt-8 mb-3 uppercase tracking-widest">
//             Modules
//           </p>

//           {/* --- UPDATED DIRECT MASTER LINK --- */}
//           {role === "ADMIN" ? (
//             <Link
//               to="/master/firms"
//               className={`flex items-center justify-between px-6 py-3 transition-colors text-sm font-medium ${
//                 location.pathname.includes("/master")
//                   ? "bg-amber-500 text-slate-900 border-r-4 border-amber-600"
//                   : "hover:text-white hover:bg-slate-800 text-slate-300"
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <i className="fas fa-database w-5 text-center"></i>
//                 <span>Master</span>
//               </div>
//             </Link>
//           ) : (
//             <button
//               onClick={() =>
//                 alert(
//                   "🔒 Access Denied: Only Administrators have permission to manage Master Data.",
//                 )
//               }
//               className="w-full flex items-center justify-between px-6 py-3 transition-colors text-sm font-medium outline-none text-slate-300 opacity-50 cursor-not-allowed hover:bg-slate-800"
//             >
//               <div className="flex items-center gap-3">
//                 <i className="fas fa-database w-5 text-center"></i>
//                 <span>Master</span>
//               </div>
//               <i
//                 className="fas fa-lock text-[10px] text-slate-500"
//                 title="Locked - Admin Only"
//               ></i>
//             </button>
//           )}

//           {/* ORDERS REPORT LINK */}
//           <Link
//             to="/orders-report"
//             className={`flex items-center gap-3 px-6 py-3 transition-colors text-sm font-medium mt-1 ${
//               location.pathname === "/orders-report"
//                 ? "bg-amber-500 text-slate-900 border-r-4 border-amber-600"
//                 : "hover:text-white hover:bg-slate-800"
//             }`}
//           >
//             <i className="fas fa-box-open w-5 text-center"></i> Orders Report
//           </Link>

//           {/* INVOICE SHIPMENT LINK */}
//           <Link
//             to="/invoice-shipment"
//             className={`flex items-center gap-3 px-6 py-3 transition-colors text-sm font-medium ${
//               location.pathname === "/invoice-shipment"
//                 ? "bg-amber-500 text-slate-900 border-r-4 border-amber-600"
//                 : "hover:text-white hover:bg-slate-800"
//             }`}
//           >
//             <i className="fas fa-file-invoice w-5 text-center"></i> Invoice
//             Shipment
//           </Link>

//           {/* Track id button */}

//           {/* Track ID Menu Item */}
//           <Link
//             to="/track-id"
//             className={`flex items-center gap-3 px-5 py-3 transition-all duration-200 cursor-pointer ${
//               location.pathname.includes("/track-id")
//                 ? "border-amber-500 bg-slate-900/50"
//                 : "border-transparent hover:bg-slate-800/30"
//             }`}
//           >
//             <div
//               className={`w-6 flex justify-center ${location.pathname.includes("/track-id") ? "text-amber-500" : "text-slate-400"}`}
//             >
//               <i className="fas fa-location-crosshairs text-sm"></i>
//             </div>
//             <span
//               className={`text-[12.5px] font-bold tracking-wide ${location.pathname.includes("/track-id") ? "text-sm" : "text-slate-300"}`}
//             >
//               Track ID
//             </span>
//           </Link>
//           <Link
//             to="/dashboard"
//             className={`flex items-center gap-3 px-6 py-3 transition-colors text-sm font-medium ${
//               location.pathname === "/reports"
//                 ? "bg-amber-500 text-slate-900 border-r-4 border-amber-600"
//                 : "hover:text-white hover:bg-slate-800"
//             }`}
//           >
//             <i className="fas fa-chart-bar w-5 text-center"></i>SAP-GRPO
//           </Link>

//           {/* REFUND LINK */}
//           <Link
//             to="/refund"
//             className={`flex items-center gap-3 px-6 py-3 transition-colors text-sm font-medium ${
//               location.pathname === "/refund"
//                 ? "bg-amber-500 text-slate-900 border-r-4 border-amber-600"
//                 : "hover:text-white hover:bg-slate-800"
//             }`}
//           >
//             <i className="fas fa-undo-alt w-5 text-center"></i> Refund
//           </Link>

//           {/* REPORTS LINK */}
//           <Link
//             to="/reports"
//             className={`flex items-center gap-3 px-6 py-3 transition-colors text-sm font-medium ${
//               location.pathname === "/reports"
//                 ? "bg-amber-500 text-slate-900 border-r-4 border-amber-600"
//                 : "hover:text-white hover:bg-slate-800"
//             }`}
//           >
//             <i className="fas fa-chart-bar w-5 text-center"></i> Reports
//           </Link>
//         </nav>
//       </aside>

//       {/* --- MAIN CONTENT AREA --- */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-sm">
//           <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg w-72 border border-gray-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
//             <i className="fas fa-search text-gray-400"></i>
//             <input
//               type="text"
//               placeholder="Search orders, tickets..."
//               className="bg-transparent border-none outline-none ml-3 text-sm w-full font-medium text-slate-700"
//             />
//           </div>

//           <div className="flex items-center gap-5">
//             <button className="text-gray-400 hover:text-amber-500 transition-colors relative">
//               <i className="fas fa-bell text-lg"></i>
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
//                 3
//               </span>
//             </button>

//             <div className="flex items-center gap-3 border-l pl-5 ml-1 border-gray-200">
//               <div className="text-right">
//                 <p className="font-bold text-slate-800 text-sm leading-tight">
//                   {username}
//                 </p>
//                 <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
//                   {role}
//                 </p>
//               </div>
//               <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm border border-amber-200">
//                 {username.charAt(0).toUpperCase()}
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="ml-2 w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
//                 title="Logout"
//               >
//                 <i className="fas fa-sign-out-alt"></i>
//               </button>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png"; // Agar use ho toh rakhein

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("user_role") || "USER";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 🔥 Helper function baaki standard links ke liye (taaki code clean rahe)
  const getNavClass = (path, exact = false) => {
    const isActive = exact
      ? location.pathname === path
      : location.pathname.includes(path);

    return `flex items-center gap-3 px-6 py-3 transition-colors text-sm font-medium ${
      isActive
        ? "bg-amber-500 text-slate-900 border-r-4 border-amber-600"
        : "hover:text-white hover:bg-slate-800 text-slate-300"
    }`;
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* --- SHRI MAA GROUP SIDEBAR (Original Slate Theme) --- */}
      <aside className="w-52 bg-slate-900 text-white min-h-screen flex flex-col transition-all duration-300">
        {/* --- BRANDING / LOGO SECTION (Original 2-Line Layout) --- */}
        <div className="h-20 flex items-center px-6 bg-slate-950 border-b border-slate-800/50 shadow-md">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 cursor-pointer w-full group"
          >
            {/* Blinking Server Dots */}
            <div className="flex gap-1.5 mt-0.5">
              <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
              <div
                className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-[14px] font-bold text-white uppercase group-hover:text-amber-500 transition-colors">
                SHRI MAA GROUP
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          <p className="px-6 text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-widest">
            Main
          </p>

          <Link to="/dashboard" className={getNavClass("/dashboard", true)}>
            <i className="fas fa-chart-pie w-5 text-center"></i> Dashboards
          </Link>

          <p className="px-6 text-[10px] text-slate-500 font-bold mt-4 mb-2 uppercase tracking-widest">
            Modules
          </p>

          {/* --- 🔥 EXACT YOUR MASTER LINK LOGIC 🔥 --- */}
          {role === "ADMIN" ? (
            <Link
              to="/master/firms"
              className={`flex items-center justify-between px-6 py-3 transition-colors text-sm font-medium ${
                location.pathname.includes("/master")
                  ? "bg-amber-500 text-slate-900 border-r-4 border-amber-600"
                  : "hover:text-white hover:bg-slate-800 text-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <i className="fas fa-database w-5 text-center"></i>
                <span>Master</span>
              </div>
            </Link>
          ) : (
            <button
              onClick={() =>
                alert(
                  "🔒 Access Denied: Only Administrators have permission to manage Master Data.",
                )
              }
              className="w-full flex items-center justify-between px-6 py-3 transition-colors text-sm font-medium outline-none text-slate-300 opacity-50 cursor-not-allowed hover:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <i className="fas fa-database w-5 text-center"></i>
                <span>Master</span>
              </div>
              <i
                className="fas fa-lock text-[10px] text-slate-500"
                title="Locked - Admin Only"
              ></i>
            </button>
          )}

          <Link to="/approvals" className={getNavClass("/approval")}>
            <i className="fas fa-check-square w-5 text-center"></i> Approvals
          </Link>

          <Link to="/orders-report" className={getNavClass("/orders-report")}>
            <i className="fas fa-box-open w-5 text-center"></i> Orders Report
          </Link>

          <Link
            to="/invoice-shipment"
            className={getNavClass("/invoice-shipment")}
          >
            <i className="fas fa-file-invoice w-5 text-center"></i> Invoice
            Shipment
          </Link>

          <Link to="/track-id" className={getNavClass("/track-id")}>
            <i className="fas fa-location-crosshairs w-5 text-center"></i> Track
            ID
          </Link>

          <Link
            to="/warehouse-support"
            className={getNavClass("/warehouse-support")}
          >
            <i className="fas fa-warehouse w-5 text-center"></i> Warehouse
            Support
          </Link>

          <Link to="/sap-grpo" className={getNavClass("/sap-grpo")}>
            <i className="fas fa-layer-group w-5 text-center"></i> SAP GRPO
          </Link>

          <p className="px-6 text-[10px] text-slate-500 font-bold mt-4 mb-2 uppercase tracking-widest">
            Support
          </p>

          <Link to="/refund" className={getNavClass("/refund")}>
            <i className="fas fa-undo-alt w-5 text-center"></i> Refund
          </Link>

          <Link to="/tickets" className={getNavClass("/tickets")}>
            <i className="fas fa-ticket-alt w-5 text-center"></i> Issue & Ticket
          </Link>

          <Link to="/reports" className={getNavClass("/reports")}>
            <i className="fas fa-chart-bar w-5 text-center"></i> Reports
          </Link>

          <Link to="/settings" className={getNavClass("/settings")}>
            <i className="fas fa-cog w-5 text-center"></i> Setting
          </Link>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-sm">
          {/* 🔥 UNIVERSAL SEARCH BAR */}
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg w-96 border border-gray-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
            <i className="fas fa-search text-gray-400"></i>
            <input
              type="text"
              placeholder="Universal Search (ASIN, Model, Orders...)"
              className="bg-transparent border-none outline-none ml-3 text-sm w-full font-medium text-slate-700"
            />
          </div>

          <div className="flex items-center gap-5">
            <button className="text-gray-400 hover:text-amber-500 transition-colors relative">
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-3 border-l pl-5 ml-1 border-gray-200">
              <div className="text-right">
                <p className="font-bold text-slate-800 text-sm leading-tight">
                  {username}
                </p>
                <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                  {role}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm border border-amber-200">
                {username.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}