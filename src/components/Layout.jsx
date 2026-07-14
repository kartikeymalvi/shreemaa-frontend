// import React from "react";
// import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
// import logo from "../assets/logo.png"; // Agar use ho toh rakhein

// export default function Layout() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const username = localStorage.getItem("username") || "User";
//   const role = localStorage.getItem("user_role") || "USER";

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   // 🔥 Helper function baaki standard links ke liye (taaki code clean rahe)
//   const getNavClass = (path, exact = false) => {
//     const isActive = exact
//       ? location.pathname === path
//       : location.pathname.includes(path);

//     return `flex items-center gap-3 px-6 py-3 transition-colors text-sm font-medium ${
//       isActive
//         ? "bg-amber-500 text-slate-900 border-r-4 border-amber-600"
//         : "hover:text-white hover:bg-slate-800 text-slate-300"
//     }`;
//   };

//   return (
//     <div className="flex h-screen bg-gray-50 font-sans">
//       {/* --- SHRI MAA GROUP SIDEBAR (Original Slate Theme) --- */}
//       <aside className="w-52 bg-slate-900 text-white min-h-screen flex flex-col transition-all duration-300">
//         {/* --- BRANDING / LOGO SECTION (Original 2-Line Layout) --- */}
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

//             <div className="flex flex-col leading-tight">
//               <span className="text-[14px] font-bold text-white uppercase group-hover:text-amber-500 transition-colors">
//                 SHRI MAA GROUP
//               </span>
//             </div>
//           </Link>
//         </div>

//         <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
//           <p className="px-6 text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-widest">
//             Main
//           </p>

//           <Link to="/dashboard" className={getNavClass("/dashboard", true)}>
//             <i className="fas fa-chart-pie w-5 text-center"></i> Dashboards
//           </Link>

//           <p className="px-6 text-[10px] text-slate-500 font-bold mt-4 mb-2 uppercase tracking-widest">
//             Modules
//           </p>

//           {/* --- 🔥 EXACT YOUR MASTER LINK LOGIC 🔥 --- */}
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

//           <Link to="/approvals" className={getNavClass("/approval")}>
//             <i className="fas fa-check-square w-5 text-center"></i> Approvals
//           </Link>

//           <Link to="/orders-report" className={getNavClass("/orders-report")}>
//             <i className="fas fa-box-open w-5 text-center"></i> Orders Report
//           </Link>

//           <Link
//             to="/invoice-shipment"
//             className={getNavClass("/invoice-shipment")}
//           >
//             <i className="fas fa-file-invoice w-5 text-center"></i> Invoice
//             Shipment
//           </Link>

//           <Link to="/track-id" className={getNavClass("/track-id")}>
//             <i className="fas fa-location-crosshairs w-5 text-center"></i> Track
//             ID
//           </Link>

//           <Link
//             to="/warehouse-support"
//             className={getNavClass("/warehouse-support")}
//           >
//             <i className="fas fa-warehouse w-5 text-center"></i> Warehouse
//             Support
//           </Link>

//           <Link to="/grpo" className={getNavClass("/grpo")}>
//             <i className="fas fa-boxes w-5 text-center"></i> GRPO
//           </Link>

//           <p className="px-6 text-[10px] text-slate-500 font-bold mt-4 mb-2 uppercase tracking-widest">
//             Support
//           </p>

//           <Link to="/refund" className={getNavClass("/refund")}>
//             <i className="fas fa-undo-alt w-5 text-center"></i> Refund
//           </Link>

//           <Link to="/tickets" className={getNavClass("/tickets")}>
//             <i className="fas fa-ticket-alt w-5 text-center"></i> Issue & Ticket
//           </Link>

//           <Link to="/reports" className={getNavClass("/reports")}>
//             <i className="fas fa-chart-bar w-5 text-center"></i> Reports
//           </Link>

//           <Link to="/settings" className={getNavClass("/settings")}>
//             <i className="fas fa-cog w-5 text-center"></i> Setting
//           </Link>
//         </nav>
//       </aside>

//       {/* --- MAIN CONTENT AREA --- */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-sm">
//           {/* 🔥 UNIVERSAL SEARCH BAR */}
//           <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg w-96 border border-gray-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
//             <i className="fas fa-search text-gray-400"></i>
//             <input
//               type="text"
//               placeholder="Universal Search (ASIN, Model, Orders...)"
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

// import React, { useState } from "react";
// import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

// export default function Layout() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Hamburger State

//   const username = localStorage.getItem("username") || "User";
//   const role = localStorage.getItem("user_role") || "USER";

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const isActive = (path, exact = false) => {
//     return exact
//       ? location.pathname === path
//       : location.pathname.includes(path);
//   };

//   const closeSidebar = () => setIsSidebarOpen(false);

//   // Application Routes
//   const menuItems = [
//     {
//       group: "Main",
//       items: [
//         {
//           name: "Dashboard",
//           path: "/dashboard",
//           icon: "fa-chart-pie",
//           exact: true,
//         },
//       ],
//     },
//     {
//       group: "Modules",
//       items: [
//         {
//           name: "Master",
//           path: "/master",
//           icon: "fa-database",
//           requiresAdmin: true,
//         },
//         { name: "Approvals", path: "/approvals", icon: "fa-check-square" },
//         { name: "Orders Report", path: "/orders-report", icon: "fa-box-open" },
//         {
//           name: "Invoice Shipment",
//           path: "/invoice-shipment",
//           icon: "fa-file-invoice",
//         },
//         { name: "Track ID", path: "/track-id", icon: "fa-location-crosshairs" },
//         {
//           name: "Warehouse Support",
//           path: "/warehouse-support",
//           icon: "fa-warehouse",
//         },
//         { name: "SAP-GRPO", path: "/grpo", icon: "fa-boxes" },
//       ],
//     },
//     {
//       group: "Account Pages",
//       items: [
//         { name: "Refund", path: "/refund", icon: "fa-undo-alt" },
//         { name: "Issue & Ticket", path: "/tickets", icon: "fa-ticket-alt" },
//         { name: "Reports", path: "/reports", icon: "fa-chart-bar" },
//         { name: "Setting", path: "/settings", icon: "fa-cog" },
//       ],
//     },
//   ];

//   return (
//     <div className="flex h-screen bg-[#fafafa] font-sans text-slate-800 tracking-tight">
//       {/* --- MOBILE OVERLAY --- */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
//           onClick={closeSidebar}
//         ></div>
//       )}

//       {/* --- SIDEBAR --- */}
//       <aside
//         className={`fixed lg:static inset-y-0 left-0 z-50 w-[250px] bg-[#fafafa] min-h-screen flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}`}
//       >
//         {/* PREMIUM CLEAN LOGO */}
//         <div className="h-[80px] flex items-center px-6">
//           <Link
//             to="/dashboard"
//             onClick={closeSidebar}
//             className="flex items-center gap-3 group"
//           >
//             {/* Custom SVG Logo matching "Muse Dashboard" vibe */}
//             <svg
//               width="22"
//               height="22"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//               className="group-hover:scale-105 transition-transform"
//             >
//               <rect x="2" y="2" width="9" height="9" rx="2.5" fill="#334155" />
//               <rect x="2" y="13" width="9" height="9" rx="2.5" fill="#334155" />
//               <rect x="13" y="2" width="9" height="9" rx="2.5" fill="#334155" />
//               <rect
//                 x="13"
//                 y="13"
//                 width="9"
//                 height="9"
//                 rx="2.5"
//                 fill="#e67e22"
//               />
//             </svg>
//             <span className="text-[15px] font-bold text-slate-700 tracking-wide mt-0.5">
//               SHRI MAA GROUP
//             </span>
//           </Link>
//         </div>

//         {/* Subtle Divider */}
//         <div className="w-[85%] mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

//         {/* NAVIGATION LINKS (Scrollbar Hidden via Tailwind Arbitrary Variants) */}
//         <nav className="flex-1 overflow-y-auto px-4 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//           <div className="space-y-5">
//             {menuItems.map((group, idx) => (
//               <div key={idx}>
//                 <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
//                   {group.group}
//                 </p>
//                 {/* Options Paas-Paas (space-y-1 makes them very compact) */}
//                 <div className="space-y-1">
//                   {group.items.map((item, itemIdx) => {
//                     const active = isActive(item.path, item.exact);

//                     // PINPOINT ACCURACY STYLING
//                     const wrapperClass = active
//                       ? "flex items-center gap-3.5 px-3 py-2.5 bg-white rounded-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-all duration-200"
//                       : "flex items-center gap-3.5 px-3 py-2.5 rounded-[12px] hover:bg-gray-100/50 transition-all duration-200";

//                     const iconBoxClass = active
//                       ? "w-[30px] h-[30px] rounded-[8px] bg-[#e67e22] text-white flex items-center justify-center shadow-md shadow-blue-500/30"
//                       : "w-[30px] h-[30px] rounded-[8px] bg-white text-gray-400 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.04)] border border-gray-50";

//                     const textClass = active
//                       ? "text-[13.5px] font-bold text-slate-800"
//                       : "text-[13.5px] font-medium text-gray-500 hover:text-gray-700 transition-colors";

//                     // Admin Lock UI
//                     if (item.requiresAdmin && role !== "ADMIN") {
//                       return (
//                         <button
//                           key={itemIdx}
//                           onClick={() => alert("🔒 Access Denied")}
//                           className="w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] opacity-60 cursor-not-allowed"
//                         >
//                           <div className="flex items-center gap-3.5">
//                             <div className="w-[30px] h-[30px] rounded-[8px] bg-white text-gray-300 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.04)] border border-gray-50">
//                               <i className={`fas ${item.icon} text-[13px]`}></i>
//                             </div>
//                             <span className="text-[13.5px] font-medium text-gray-400">
//                               {item.name}
//                             </span>
//                           </div>
//                           <i className="fas fa-lock text-[10px] text-gray-300"></i>
//                         </button>
//                       );
//                     }

//                     return (
//                       <Link
//                         key={itemIdx}
//                         to={
//                           item.path === "/master" ? "/master/firms" : item.path
//                         }
//                         onClick={closeSidebar}
//                         className={wrapperClass}
//                       >
//                         <div className={iconBoxClass}>
//                           <i className={`fas ${item.icon} text-[13px]`}></i>
//                         </div>
//                         <span className={textClass}>{item.name}</span>
//                       </Link>
//                     );
//                   })}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </nav>
//       </aside>

//       {/* --- MAIN CONTENT AREA --- */}
//       <div className="flex-1 flex flex-col overflow-hidden relative w-full">
//         {/* HEADER (Floating Style, No Borders) */}
//         <header className="h-[80px] bg-transparent flex items-center justify-between px-4 lg:px-8 z-10">
//           <div className="flex items-center gap-4 w-full md:w-auto">
//             {/* 🔥 HAMBURGER MENU */}
//             <button
//               onClick={() => setIsSidebarOpen(true)}
//               className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[12px] bg-white text-gray-500 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:text-[#e67e22] transition-colors"
//             >
//               <i className="fas fa-bars"></i>
//             </button>

//             {/* SEARCH BAR (Exact Screenshot Match) */}
//             <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-full w-[250px] border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] focus-within:border-blue-300 transition-all">
//               <i className="fas fa-search text-gray-400 text-sm"></i>
//               <input
//                 type="text"
//                 placeholder="Type here..."
//                 className="bg-transparent border-none outline-none ml-3 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
//               />
//             </div>
//           </div>

//           {/* RIGHT SIDE ICONS (Profile, Settings, Bell) */}
//           <div className="flex items-center gap-5">
//             <button className="text-gray-500 hover:text-slate-800 transition-colors flex items-center gap-2">
//               <i className="fas fa-user text-sm"></i>
//               <span className="text-[13.5px] font-bold hidden sm:inline">
//                 {username}
//               </span>
//             </button>

//             <button className="text-gray-500 hover:text-slate-800 transition-colors">
//               <i className="fas fa-cog text-[16px]"></i>
//             </button>

//             <button className="text-gray-500 hover:text-slate-800 transition-colors relative">
//               <i className="fas fa-bell text-[16px]"></i>
//               {/* Notification Red Dot */}
//               <span className="absolute -top-1 -right-1.5 bg-[#ff4d4f] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#fafafa]">
//                 3
//               </span>
//             </button>

//             {/* Hidden logout button to keep functionality intact but minimal */}
//             <button
//               onClick={handleLogout}
//               className="text-gray-400 hover:text-[#ff4d4f] transition-colors ml-2"
//               title="Logout"
//             >
//               <i className="fas fa-sign-out-alt text-[16px]"></i>
//             </button>
//           </div>
//         </header>

//         {/* CONTAINER CONTENT VIEW */}
//         <main className="flex-1 overflow-y-auto px-4 lg:px-8 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Hamburger State

  const username = localStorage.getItem("username") || "User";
  const role = localStorage.getItem("user_role") || "USER";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path, exact = false) => {
    return exact
      ? location.pathname === path
      : location.pathname.includes(path);
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  // Application Routes
  const menuItems = [
    {
      group: "Main",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: "fa-chart-pie",
          exact: true,
        },
      ],
    },
    {
      group: "Modules",
      items: [
        {
          name: "Master",
          path: "/master",
          icon: "fa-database",
          requiresAdmin: true,
        },
        { name: "Approvals", path: "/approvals", icon: "fa-check-square" },
        { name: "Orders Report", path: "/orders-report", icon: "fa-box-open" },
        {
          name: "Invoice Shipment",
          path: "/invoice-shipment",
          icon: "fa-file-invoice",
        },
        { name: "Track ID", path: "/track-id", icon: "fa-location-crosshairs" },
        {
          name: "Warehouse Support",
          path: "/warehouse-support",
          icon: "fa-warehouse",
        },
        { name: "SAP-GRPO", path: "/grpo", icon: "fa-boxes" },
      ],
    },
    {
      group: "Account Pages",
      items: [
        { name: "Refund", path: "/refund", icon: "fa-undo-alt" },
        { name: "Issue & Ticket", path: "/tickets", icon: "fa-ticket-alt" },
        { name: "Reports", path: "/reports", icon: "fa-chart-bar" },
        { name: "Setting", path: "/settings", icon: "fa-cog" },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-[#fafafa] font-sans text-slate-800 tracking-tight">
      {/* --- MOBILE OVERLAY --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[250px] bg-[#fafafa] min-h-screen flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* PREMIUM CLEAN LOGO */}
        <div className="h-[80px] flex items-center px-6">
          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className="flex items-center gap-3 group"
          >
            {/* Custom SVG Logo matching "Muse Dashboard" vibe */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="group-hover:scale-105 transition-transform"
            >
              <rect x="2" y="2" width="9" height="9" rx="2.5" fill="#334155" />
              <rect x="2" y="13" width="9" height="9" rx="2.5" fill="#334155" />
              <rect x="13" y="2" width="9" height="9" rx="2.5" fill="#334155" />
              <rect
                x="13"
                y="13"
                width="9"
                height="9"
                rx="2.5"
                fill="#e67e22"
              />
            </svg>
            <span className="text-[15px] font-bold text-slate-700 tracking-wide mt-0.5">
              SHRI MAA GROUP
            </span>
          </Link>
        </div>

        {/* Subtle Divider */}
        <div className="w-[85%] mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

        {/* NAVIGATION LINKS (Scrollbar Hidden via Tailwind Arbitrary Variants) */}
        <nav className="flex-1 overflow-y-auto px-4 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-6">
            {menuItems.map((group, idx) => (
              <div key={idx}>
                <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {group.group}
                </p>
                <div className="space-y-0">
                  {group.items.map((item, itemIdx) => {
                    const active = isActive(item.path, item.exact);

                    // 🔥 UPGRADED PINPOINT ACCURACY STYLING (Muse Theme 3D Effect) 🔥
                    const wrapperClass = active
                      ? "flex items-center gap-3.5 px-3 py-2.5 bg-white rounded-2xl shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] transform -translate-y-[2px] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
                      : "flex items-center gap-3.5 px-3 py-2.5 rounded-2xl hover:bg-white hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]";

                    const iconBoxClass = active
                      ? "w-[32px] h-[32px] rounded-[10px] bg-[#e67e22] text-white flex items-center justify-center shadow-[0_6px_14px_-4px_rgba(22,119,255,0.6)]"
                      : "w-[32px] h-[32px] rounded-[10px] bg-white text-gray-400 flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-gray-100 group-hover:text-gray-600";

                    const textClass = active
                      ? "text-[14px] font-bold text-slate-800"
                      : "text-[14px] font-medium text-gray-500 group-hover:text-gray-700 transition-colors";

                    // Admin Lock UI
                    if (item.requiresAdmin && role !== "ADMIN") {
                      return (
                        <button
                          key={itemIdx}
                          onClick={() => alert("🔒 Access Denied")}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] opacity-60 cursor-not-allowed group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-[32px] h-[32px] rounded-[10px] bg-white text-gray-300 flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-gray-100">
                              <i className={`fas ${item.icon} text-[14px]`}></i>
                            </div>
                            <span className="text-[14px] font-medium text-gray-400">
                              {item.name}
                            </span>
                          </div>
                          <i className="fas fa-lock text-[10px] text-gray-300"></i>
                        </button>
                      );
                    }

                    return (
                      <Link
                        key={itemIdx}
                        to={
                          item.path === "/master" ? "/master/firms" : item.path
                        }
                        onClick={closeSidebar}
                        className={`${wrapperClass} group`}
                      >
                        <div className={iconBoxClass}>
                          <i className={`fas ${item.icon} text-[14px]`}></i>
                        </div>
                        <span className={textClass}>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col overflow-hidden relative w-full">
        {/* HEADER (Floating Style, No Borders) */}
        <header className="h-[80px] bg-transparent flex items-center justify-between px-4 lg:px-8 z-10">
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* 🔥 HAMBURGER MENU */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[12px] bg-white text-gray-500 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] hover:text-[#e67e22] transition-colors"
            >
              <i className="fas fa-bars"></i>
            </button>

            {/* SEARCH BAR (Exact Screenshot Match) */}
            <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-full w-[250px] border border-gray-100 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] focus-within:border-blue-300 transition-all">
              <i className="fas fa-search text-gray-400 text-sm"></i>
              <input
                type="text"
                placeholder="Type here..."
                className="bg-transparent border-none outline-none ml-3 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* RIGHT SIDE ICONS (Profile, Settings, Bell) */}
          <div className="flex items-center gap-5">
            <button className="text-gray-500 hover:text-slate-800 transition-colors flex items-center gap-2">
              <i className="fas fa-user text-sm"></i>
              <span className="text-[13.5px] font-bold hidden sm:inline">
                {username}
              </span>
            </button>

            <button className="text-gray-500 hover:text-slate-800 transition-colors">
              <i className="fas fa-cog text-[16px]"></i>
            </button>

            <button className="text-gray-500 hover:text-slate-800 transition-colors relative">
              <i className="fas fa-bell text-[16px]"></i>
              {/* Notification Red Dot */}
              <span className="absolute -top-1 -right-1.5 bg-[#ff4d4f] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#fafafa]">
                3
              </span>
            </button>

            {/* Hidden logout button to keep functionality intact but minimal */}
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-[#ff4d4f] transition-colors ml-2"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt text-[16px]"></i>
            </button>
          </div>
        </header>

        {/* CONTAINER CONTENT VIEW */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-8 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}