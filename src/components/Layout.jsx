// import React, { useState } from "react";
// import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

// export default function Layout() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [isMasterOpen, setIsMasterOpen] = useState(false);

//   // LocalStorage se details nikalna
//   const username = localStorage.getItem("username") || "User";
//   const role = localStorage.getItem("user_role") || "USER";

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   // Master Menu Click Handler with Security
//   const handleMasterClick = () => {
//     if (role !== "ADMIN") {
//       alert(
//         "🔒 Access Denied: Only Administrators have permission to manage Master Data.",
//       );
//       return;
//     }
//     setIsMasterOpen(!isMasterOpen);
//   };

//   return (
//     <div className="flex h-screen bg-[#f3f4f7] font-sans">
//       {/* --- SHRI MAA GROUP SIDEBAR --- */}
//       <aside className="w-64 bg-[#1e2129] text-gray-300 flex flex-col z-20">
//         <div className="h-16 flex items-center px-6 bg-[#17191f] border-b border-gray-800">
//           <span className="text-xl font-bold tracking-wider text-white">
//             <span className="text-blue-500">SHRI</span> MAA GROUP
//           </span>
//         </div>

//         <nav className="flex-1 py-4 overflow-y-auto">
//           <p className="px-6 text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wider">
//             Main
//           </p>

//           <Link
//             to="/dashboard"
//             className={`flex items-center gap-3 px-6 py-3 transition-colors ${
//               location.pathname === "/dashboard"
//                 ? "bg-blue-600 text-white"
//                 : "hover:text-white hover:bg-gray-800"
//             }`}
//           >
//             <i className="fas fa-home w-5 text-center"></i> Dashboards
//           </Link>

//           <p className="px-6 text-xs text-gray-500 font-semibold mt-6 mb-2 uppercase tracking-wider">
//             Modules
//           </p>

//           {/* SECURE MASTER MENU BUTTON */}
//           <button
//             onClick={handleMasterClick}
//             className={`w-full flex items-center justify-between px-6 py-3 transition-colors uppercase text-sm font-medium outline-none ${
//               isMasterOpen || location.pathname.includes("/master")
//                 ? "text-white bg-gray-800"
//                 : "hover:text-white hover:bg-gray-800 text-gray-300"
//             } ${role !== "ADMIN" ? "opacity-60 cursor-not-allowed" : ""}`}
//           >
//             <div className="flex items-center gap-3">
//               <span>Master</span>
//             </div>

//             {/* Conditional Icon: Admin ko Arrow, User ko Lock dikhega */}
//             {role === "ADMIN" ? (
//               <i
//                 className={`fas fa-chevron-down text-xs transition-transform duration-300 ${isMasterOpen ? "rotate-180" : ""}`}
//               ></i>
//             ) : (
//               <i
//                 className="fas fa-lock text-[10px] text-gray-500"
//                 title="Locked - Admin Only"
//               ></i>
//             )}
//           </button>

//           {/* MASTER SUB-MENUS */}
//           {isMasterOpen && role === "ADMIN" && (
//             <div className="bg-[#17191f] py-2 flex flex-col animate-in slide-in-from-top-2 duration-200">
//               <Link
//                 to="/master/firms"
//                 className={`px-10 py-2.5 text-sm transition-colors ${location.pathname === "/master/firms" ? "text-blue-400 font-bold" : "text-gray-400 hover:text-white"}`}
//               >
//                 Firm
//               </Link>
//               <Link
//                 to="/master/locations"
//                 className={`px-10 py-2.5 text-sm transition-colors ${location.pathname === "/master/locations" ? "text-blue-400 font-bold" : "text-gray-400 hover:text-white"}`}
//               >
//                 Location
//               </Link>
//               <Link
//                 to="/master/merchants"
//                 className={`px-10 py-2.5 text-sm transition-colors ${location.pathname === "/master/merchants" ? "text-blue-400 font-bold" : "text-gray-400 hover:text-white"}`}
//               >
//                 Merchant
//               </Link>
//               <Link
//                 to="/master/models"
//                 className={`px-10 py-2.5 text-sm transition-colors ${location.pathname === "/master/models" ? "text-blue-400 font-bold" : "text-gray-400 hover:text-white"}`}
//               >
//                 Model
//               </Link>
//             </div>
//           )}

//           {/* ORDERS REPORT LINK */}
//           <Link
//             to="/orders-report"
//             className={`flex items-center px-6 py-3 transition-colors uppercase text-sm font-medium mt-1 ${
//               location.pathname === "/orders-report"
//                 ? "bg-[#2a2e39] text-white border-l-4 border-blue-500"
//                 : "hover:text-white hover:bg-gray-800"
//             }`}
//           >
//             Orders Report
//           </Link>

//           <Link
//             to="/invoice-shipment"
//             className="flex items-center px-6 py-3 hover:text-white hover:bg-gray-800 transition-colors uppercase text-sm font-medium"
//           >
//             Invoice Shipment
//           </Link>
// <a
//   href="#"
//   className="flex items-center px-6 py-3 hover:text-white hover:bg-gray-800 transition-colors uppercase text-sm font-medium"
// >
//   Refund
// </a>
// <a
//   href="#"
//   className="flex items-center px-6 py-3 hover:text-white hover:bg-gray-800 transition-colors uppercase text-sm font-medium"
// >
//   Reports
// </a>
//         </nav>
//       </aside>

//       {/* --- MAIN CONTENT AREA --- */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
//           <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg w-64 border border-gray-100">
//             <i className="fas fa-search text-gray-400"></i>
//             <input
//               type="text"
//               placeholder="Quick Search..."
//               className="bg-transparent border-none outline-none ml-2 text-sm w-full"
//             />
//           </div>

//           <div className="flex items-center gap-4">
//             <button className="text-gray-400 hover:text-gray-600">
//               <i className="fas fa-moon text-lg"></i>
//             </button>
//             <button className="text-gray-400 hover:text-gray-600 relative">
//               <i className="fas fa-bell text-lg"></i>
//               <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
//                 7
//               </span>
//             </button>

//             <div className="flex items-center gap-3 border-l pl-4 ml-2 border-gray-200">
//               <div className="w-8 h-8 rounded-full bg-[#f6a88b] text-white flex items-center justify-center font-bold text-sm">
//                 {username.charAt(0).toUpperCase()}
//               </div>
//               <div className="text-sm">
//                 <p className="font-semibold text-gray-700 leading-tight">
//                   {username}
//                 </p>
//                 <p className="text-xs text-gray-500 font-bold tracking-wider">
//                   {role}
//                 </p>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="ml-3 text-gray-400 hover:text-red-500 transition-colors"
//                 title="Logout"
//               >
//                 <i className="fas fa-sign-out-alt text-lg"></i>
//               </button>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto p-6 bg-white">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }
import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("user_role") || "USER";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* --- SHRI MAA GROUP SIDEBAR (Slate Theme) --- */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col z-20 border-r border-slate-800">
        <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800/50">
          <span className="text-xl font-bold tracking-widest text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            SHRI MAA
          </span>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
          <p className="px-6 text-[10px] text-slate-500 font-bold mb-3 uppercase tracking-widest">
            Main
          </p>

          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-6 py-3 transition-colors text-sm font-medium ${
              location.pathname === "/dashboard"
                ? "bg-amber-500 text-slate-900 border-r-4 border-amber-600"
                : "hover:text-white hover:bg-slate-800"
            }`}
          >
            <i className="fas fa-chart-pie w-5 text-center"></i> Dashboards
          </Link>

          <p className="px-6 text-[10px] text-slate-500 font-bold mt-8 mb-3 uppercase tracking-widest">
            Modules
          </p>

          {/* --- UPDATED DIRECT MASTER LINK --- */}
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

          {/* ORDERS REPORT LINK */}
          <Link
            to="/orders-report"
            className={`flex items-center gap-3 px-6 py-3 transition-colors text-sm font-medium mt-1 ${
              location.pathname === "/orders-report"
                ? "bg-amber-500 text-slate-900 border-r-4 border-amber-600"
                : "hover:text-white hover:bg-slate-800"
            }`}
          >
            <i className="fas fa-box-open w-5 text-center"></i> Orders Report
          </Link>

          {/* INVOICE SHIPMENT LINK */}
          <Link
            to="/invoice-shipment"
            className={`flex items-center gap-3 px-6 py-3 transition-colors text-sm font-medium ${
              location.pathname === "/invoice-shipment"
                ? "bg-amber-500 text-slate-900 border-r-4 border-amber-600"
                : "hover:text-white hover:bg-slate-800"
            }`}
          >
            <i className="fas fa-file-invoice w-5 text-center"></i> Invoice
            Shipment
          </Link>

          {/* REFUND LINK */}
          <Link
            to="/refund"
            className={`flex items-center gap-3 px-6 py-3 transition-colors text-sm font-medium ${
              location.pathname === "/refund"
                ? "bg-amber-500 text-slate-900 border-r-4 border-amber-600"
                : "hover:text-white hover:bg-slate-800"
            }`}
          >
            <i className="fas fa-undo-alt w-5 text-center"></i> Refund
          </Link>

          {/* REPORTS LINK */}
          <Link
            to="/reports"
            className={`flex items-center gap-3 px-6 py-3 transition-colors text-sm font-medium ${
              location.pathname === "/reports"
                ? "bg-amber-500 text-slate-900 border-r-4 border-amber-600"
                : "hover:text-white hover:bg-slate-800"
            }`}
          >
            <i className="fas fa-chart-bar w-5 text-center"></i> Reports
          </Link>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg w-72 border border-gray-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
            <i className="fas fa-search text-gray-400"></i>
            <input
              type="text"
              placeholder="Search orders, tickets..."
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