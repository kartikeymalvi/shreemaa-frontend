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
//         { name: "Issue & Ticket", path: "/issue-ticket", icon: "fa-ticket-alt" },
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
//           <div className="space-y-6">
//             {menuItems.map((group, idx) => (
//               <div key={idx}>
//                 <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
//                   {group.group}
//                 </p>
//                 <div className="space-y-0">
//                   {group.items.map((item, itemIdx) => {
//                     const active = isActive(item.path, item.exact);

//                     // 🔥 UPGRADED PINPOINT ACCURACY STYLING (Muse Theme 3D Effect) 🔥
//                     const wrapperClass = active
//                       ? "flex items-center gap-3.5 px-3 py-2.5 bg-white rounded-2xl shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] transform -translate-y-[2px] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]"
//                       : "flex items-center gap-3.5 px-3 py-2.5 rounded-2xl hover:bg-white hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]";

//                     const iconBoxClass = active
//                       ? "w-[32px] h-[32px] rounded-[10px] bg-[#e67e22] text-white flex items-center justify-center shadow-[0_6px_14px_-4px_rgba(22,119,255,0.6)]"
//                       : "w-[32px] h-[32px] rounded-[10px] bg-white text-gray-400 flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-gray-100 group-hover:text-gray-600";

//                     const textClass = active
//                       ? "text-[14px] font-bold text-slate-800"
//                       : "text-[14px] font-medium text-gray-500 group-hover:text-gray-700 transition-colors";

//                     // Admin Lock UI
//                     if (item.requiresAdmin && role !== "ADMIN") {
//                       return (
//                         <button
//                           key={itemIdx}
//                           onClick={() => alert("🔒 Access Denied")}
//                           className="w-full flex items-center justify-between px-3 py-2.5 rounded-[12px] opacity-60 cursor-not-allowed group"
//                         >
//                           <div className="flex items-center gap-3.5">
//                             <div className="w-[32px] h-[32px] rounded-[10px] bg-white text-gray-300 flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-gray-100">
//                               <i className={`fas ${item.icon} text-[14px]`}></i>
//                             </div>
//                             <span className="text-[14px] font-medium text-gray-400">
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
//                         className={`${wrapperClass} group`}
//                       >
//                         <div className={iconBoxClass}>
//                           <i className={`fas ${item.icon} text-[14px]`}></i>
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
//               className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[12px] bg-white text-gray-500 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] hover:text-[#e67e22] transition-colors"
//             >
//               <i className="fas fa-bars"></i>
//             </button>

//             {/* SEARCH BAR (Exact Screenshot Match) */}
//             <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-full w-[250px] border border-gray-100 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] focus-within:border-blue-300 transition-all">
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

// import React, { useState, useEffect } from "react";
// import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

// export default function Layout() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);

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

//   // 🔥 Page load hote hi LocalStorage se theme utha kar HTML par apply karega
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("erp_theme") || "System";
//     const savedDensity = localStorage.getItem("erp_density") || "Comfortable";
//     document.documentElement.setAttribute("data-theme", savedTheme);
//     document.documentElement.setAttribute("data-density", savedDensity);
//   }, []);

//   const closeSidebar = () => setIsSidebarOpen(false);

//   // 🔥 100% PRD ALIGNED ENTERPRISE MENU ITEMS 🔥
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
//       group: "Core Modules",
//       items: [
//         {
//           name: "Master",
//           path: "/master",
//           icon: "fa-database",
//           requiresAdmin: true,
//         },
//         { name: "Approvals", path: "/approvals", icon: "fa-check-square" },

//         { name: "Orders", path: "/orders-report", icon: "fa-box-open" },
//         {
//           name: "Invoices",
//           path: "/invoice-shipment",
//           icon: "fa-file-invoice",
//         },
//       ],
//     },
//     {
//       group: "Warehouse & Logistics",
//       items: [
//         { name: "SAP-GRPO", path: "/grpo", icon: "fa-boxes" },
//         {
//           name: "Warehouse Audit",
//           path: "/warehouse-audit",
//           icon: "fa-clipboard-check",
//         },
//         {
//           name: "Purchase Inward",
//           path: "/purchase-inward",
//           icon: "fa-truck-loading",
//         },
//         {
//           name: "Track Shipment",
//           path: "/track-id",
//           icon: "fa-location-crosshairs",
//         },
//         { name: "IMEI's & PDF's", path: "/ImeiPdfManager", icon: "fa-barcode" },
//       ],
//     },
//     {
//       group: "Finance & Accounts",
//       items: [
//         { name: "Finance", path: "/finance", icon: "fa-wallet", exact: true },
//         { name: "Accounts Ledgers", path: "/financeledger", icon: "fa-book" },
//         { name: "Settlement", path: "/settlement", icon: "fa-handshake" },
//         { name: "Refunds", path: "/refund", icon: "fa-undo-alt" },
//       ],
//     },
//     {
//       group: "Support & Settings",
//       items: [
//         {
//           name: "Issue & Ticket",
//           path: "/issue-ticket",
//           icon: "fa-ticket-alt",
//         },
//         { name: "Reports", path: "/reports", icon: "fa-chart-bar" },
//         { name: "Setting", path: "/settings", icon: "fa-cog" },
//       ],
//     },
//   ];

//   return (
//     // 🔥 UPDATE 1: bg-[#fafafa] ki jagah "main-bg" lagaya 🔥
//     <div className="flex h-screen main-bg font-sans text-slate-800 tracking-tight">
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
//           onClick={closeSidebar}
//         ></div>
//       )}

//       {/* --- SIDEBAR --- */}
//       <aside
//         // 🔥 UPDATE 2: bg-[#fafafa] ki jagah "main-bg" lagaya 🔥
//         className={`fixed lg:static inset-y-0 left-0 z-50 main-bg min-h-screen flex flex-col transform transition-all duration-300 ease-in-out
//         ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
//         ${isCollapsed ? "w-[88px]" : "w-[240px]"}`}
//       >
//         {/* PREMIUM CLEAN LOGO */}
//         <div className="h-[70px] flex items-center px-5">
//           <Link
//             to="/dashboard"
//             onClick={closeSidebar}
//             className={`flex items-center ${isCollapsed ? "justify-center w-full" : "gap-3"} group transition-all duration-300`}
//           >
//             <svg
//               width="22"
//               height="22"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//               className="group-hover:scale-105 transition-transform shrink-0"
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
//             {!isCollapsed && (
//               <span className="text-[14px] font-bold text-slate-700 tracking-wide mt-0.5 whitespace-nowrap animate-in fade-in zoom-in duration-300">
//                 SHRI MAA GROUP
//               </span>
//             )}
//           </Link>
//         </div>

//         <div className="w-[85%] mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-2"></div>

//         {/* NAVIGATION LINKS */}
//         <nav className="flex-1 overflow-y-auto px-3 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//           <div className="space-y-3.5">
//             {menuItems.map((group, idx) => (
//               <div key={idx}>
//                 {!isCollapsed ? (
//                   <p className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 whitespace-nowrap fade-in duration-200">
//                     {group.group}
//                   </p>
//                 ) : (
//                   <div className="flex justify-center mb-1.5">
//                     <div className="w-3 h-[2px] bg-gray-200 rounded-full"></div>
//                   </div>
//                 )}

//                 <div className="space-y-0.5">
//                   {group.items.map((item, itemIdx) => {
//                     const active = isActive(item.path, item.exact);

//                     const wrapperClass = active
//                       ? `flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-2.5"} py-1.5 bg-white rounded-xl shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)] transform -translate-y-[1px] transition-all duration-300`
//                       : `flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3 px-2.5"} py-1.5 rounded-xl hover:bg-white hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all duration-300`;

//                     const iconBoxClass = active
//                       ? "w-[30px] h-[30px] rounded-[8px] bg-[#e67e22] text-white flex items-center justify-center shadow-[0_4px_10px_-2px_rgba(230,126,34,0.5)] shrink-0"
//                       : "w-[30px] h-[30px] rounded-[8px] bg-white text-gray-400 flex items-center justify-center shadow-[0_1px_4px_-1px_rgba(0,0,0,0.08)] border border-gray-100 group-hover:text-[#e67e22] shrink-0";

//                     const textClass = active
//                       ? "text-[12.5px] font-bold text-slate-800 whitespace-nowrap"
//                       : "text-[12.5px] font-medium text-gray-500 group-hover:text-slate-700 transition-colors whitespace-nowrap";

//                     if (item.requiresAdmin && role !== "ADMIN") {
//                       return (
//                         <button
//                           key={itemIdx}
//                           onClick={() => alert("🔒 Access Denied")}
//                           title={isCollapsed ? "🔒 Access Denied" : ""}
//                           className={`w-full flex items-center ${isCollapsed ? "justify-center px-0" : "justify-between px-2.5"} py-1.5 rounded-xl opacity-60 cursor-not-allowed group transition-all`}
//                         >
//                           <div
//                             className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}
//                           >
//                             <div className="w-[30px] h-[30px] shrink-0 rounded-[8px] bg-white text-gray-300 flex items-center justify-center shadow-[0_1px_4px_-1px_rgba(0,0,0,0.08)] border border-gray-100">
//                               <i className={`fas ${item.icon} text-[15px]`}></i>
//                             </div>
//                             {!isCollapsed && (
//                               <span className="text-[12.5px] font-medium text-gray-400 whitespace-nowrap">
//                                 {item.name}
//                               </span>
//                             )}
//                           </div>
//                           {!isCollapsed && (
//                             <i className="fas fa-lock text-[10px] text-gray-300"></i>
//                           )}
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
//                         title={isCollapsed ? item.name : ""}
//                         className={`${wrapperClass} group`}
//                       >
//                         <div className={iconBoxClass}>
//                           <i className={`fas ${item.icon} text-[15px]`}></i>
//                         </div>
//                         {!isCollapsed && (
//                           <span className={textClass}>{item.name}</span>
//                         )}
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
//       <div className="flex-1 flex flex-col overflow-hidden relative w-full transition-all duration-300">
//         {/* HEADER */}
//         <header className="h-[70px] bg-transparent flex items-center justify-between px-4 lg:px-8 z-10 transition-all">
//           <div className="flex items-center gap-4 w-full md:w-auto">
//             <button
//               onClick={() => setIsSidebarOpen(true)}
//               className="lg:hidden w-9 h-9 flex items-center justify-center rounded-[10px] bg-white text-gray-500 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] hover:text-[#e67e22] transition-colors"
//             >
//               <i className="fas fa-bars text-[14px]"></i>
//             </button>
//             <button
//               onClick={() => setIsCollapsed(!isCollapsed)}
//               className="hidden lg:flex w-9 h-9 items-center justify-center rounded-[10px] bg-white text-gray-500 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] hover:text-[#1677ff] transition-colors"
//               title="Toggle Sidebar"
//             >
//               <i
//                 className={`fas ${isCollapsed ? "fa-indent" : "fa-outdent"} text-[14px]`}
//               ></i>
//             </button>
//             <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-full w-[250px] border border-gray-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] focus-within:border-blue-300 transition-all">
//               <i className="fas fa-search text-gray-400 text-sm"></i>
//               <input
//                 type="text"
//                 placeholder="Type here..."
//                 className="bg-transparent border-none outline-none ml-3 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <button className="text-gray-500 hover:text-slate-800 transition-colors flex items-center gap-2">
//               <i className="fas fa-user text-[14px]"></i>
//               <span className="text-[13.5px] font-bold hidden sm:inline">
//                 {username}
//               </span>
//             </button>
//             <Link
//               to="/settings"
//               className="text-gray-500 hover:text-slate-800 transition-colors"
//             >
//               <i className="fas fa-cog text-[16px]"></i>
//             </Link>
//             <button className="text-gray-500 hover:text-slate-800 transition-colors relative">
//               <i className="fas fa-bell text-[16px]"></i>
//               <span className="absolute -top-1 -right-1 bg-[#ff4d4f] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-[#fafafa]">
//                 3
//               </span>
//             </button>
//             <button
//               onClick={handleLogout}
//               className="text-gray-400 hover:text-[#ff4d4f] transition-colors ml-1"
//               title="Logout"
//             >
//               <i className="fas fa-sign-out-alt text-[16px]"></i>
//             </button>
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto px-4 lg:px-8 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  // 🔥 Page load hote hi LocalStorage se theme utha kar HTML par apply karega
  useEffect(() => {
    const savedTheme = localStorage.getItem("erp_theme") || "System";
    const savedDensity = localStorage.getItem("erp_density") || "Comfortable";
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.setAttribute("data-density", savedDensity);
  }, []);

  const closeSidebar = () => setIsSidebarOpen(false);

  // 🔥 100% PRD ALIGNED ENTERPRISE MENU ITEMS 🔥
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
      group: "Core Modules",
      items: [
        {
          name: "Master",
          path: "/master",
          icon: "fa-database",
          requiresAdmin: true,
        },
        { name: "Approvals", path: "/approvals", icon: "fa-check-square" },
        { name: "Orders", path: "/orders-report", icon: "fa-box-open" },
        {
          name: "Invoices",
          path: "/invoice-shipment",
          icon: "fa-file-invoice",
        },
      ],
    },
    {
      group: "Warehouse & Logistics",
      items: [
        { name: "SAP-GRPO", path: "/grpo", icon: "fa-boxes" },
        {
          name: "Warehouse Audit",
          path: "/warehouse-audit",
          icon: "fa-clipboard-check",
        },
        {
          name: "Purchase Inward",
          path: "/purchase-inward",
          icon: "fa-truck-loading",
        },
        {
          name: "Track Shipment",
          path: "/track-id",
          icon: "fa-location-crosshairs",
        },
        { name: "IMEI's & PDF's", path: "/ImeiPdfManager", icon: "fa-barcode" },
      ],
    },
    {
      group: "Finance & Accounts",
      items: [
        { name: "Finance", path: "/finance", icon: "fa-wallet", exact: true },
        { name: "Accounts Ledgers", path: "/financeledger", icon: "fa-book" },
        { name: "Settlement", path: "/settlement", icon: "fa-handshake" },
        { name: "Refunds", path: "/refund", icon: "fa-undo-alt" },
      ],
    },
    {
      group: "Support & Settings",
      items: [
        {
          name: "Issue & Ticket",
          path: "/issue-ticket",
          icon: "fa-ticket-alt",
        },
        { name: "Reports", path: "/reports", icon: "fa-chart-bar" },
        { name: "Setting", path: "/settings", icon: "fa-cog" },
      ],
    },
  ];

  return (
    // 🔥 Original theme background "main-bg" intact 🔥
    <div className="flex h-screen main-bg font-sans text-slate-800 tracking-tight">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 main-bg min-h-screen flex flex-col transform transition-all duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"} 
        ${isCollapsed ? "w-[76px]" : "w-[220px]"}`}
        // WIDTh THODI COMPACT KI HAI (240->220)
      >
        {/* PREMIUM CLEAN LOGO - Reduced Height */}
        <div className="h-[55px] flex items-center px-4">
          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className={`flex items-center ${isCollapsed ? "justify-center w-full" : "gap-2.5"} group transition-all duration-300`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="group-hover:scale-105 transition-transform shrink-0"
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
            {!isCollapsed && (
              <span className="text-[13px] font-bold text-slate-700 tracking-wide mt-0.5 whitespace-nowrap animate-in fade-in zoom-in duration-300">
                SHRI MAA GROUP
              </span>
            )}
          </Link>
        </div>

        <div className="w-[85%] mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-1"></div>

        {/* NAVIGATION LINKS - COMPACT SPACING */}
        <nav className="flex-1 overflow-y-auto px-2.5 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-1.5">
            {" "}
            {/* space-y-3.5 -> space-y-1.5 */}
            {menuItems.map((group, idx) => (
              <div key={idx}>
                {!isCollapsed ? (
                  <p className="px-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 mt-2 whitespace-nowrap fade-in duration-200">
                    {group.group}
                  </p>
                ) : (
                  <div className="flex justify-center mb-1 mt-2">
                    <div className="w-3 h-[2px] bg-gray-200 rounded-full"></div>
                  </div>
                )}

                <div className="space-y-0.5">
                  {group.items.map((item, itemIdx) => {
                    const active = isActive(item.path, item.exact);

                    const wrapperClass = active
                      ? `flex items-center ${isCollapsed ? "justify-center px-0" : "gap-2.5 px-2"} py-1.5 bg-white rounded-xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] transform -translate-y-[1px] transition-all duration-300`
                      : `flex items-center ${isCollapsed ? "justify-center px-0" : "gap-2.5 px-2"} py-1.5 rounded-xl hover:bg-white hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all duration-300`;

                    // Reduced icon box sizes (w-26 h-26 instead of 30x30)
                    const iconBoxClass = active
                      ? "w-[26px] h-[26px] rounded-[8px] bg-[#e67e22] text-white flex items-center justify-center shadow-[0_4px_10px_-2px_rgba(230,126,34,0.5)] shrink-0"
                      : "w-[26px] h-[26px] rounded-[8px] bg-white text-gray-400 flex items-center justify-center shadow-[0_1px_4px_-1px_rgba(0,0,0,0.08)] border border-gray-100 group-hover:text-[#e67e22] shrink-0";

                    const textClass = active
                      ? "text-[11.5px] font-bold text-slate-800 whitespace-nowrap"
                      : "text-[11.5px] font-medium text-gray-500 group-hover:text-slate-700 transition-colors whitespace-nowrap";

                    if (item.requiresAdmin && role !== "ADMIN") {
                      return (
                        <button
                          key={itemIdx}
                          onClick={() => alert("🔒 Access Denied")}
                          title={isCollapsed ? "🔒 Access Denied" : ""}
                          className={`w-full flex items-center ${isCollapsed ? "justify-center px-0" : "justify-between px-2"} py-1.5 rounded-xl opacity-60 cursor-not-allowed group transition-all`}
                        >
                          <div
                            className={`flex items-center ${isCollapsed ? "" : "gap-2.5"}`}
                          >
                            <div className="w-[26px] h-[26px] shrink-0 rounded-[8px] bg-white text-gray-300 flex items-center justify-center shadow-[0_1px_4px_-1px_rgba(0,0,0,0.08)] border border-gray-100">
                              <i className={`fas ${item.icon} text-[13px]`}></i>
                            </div>
                            {!isCollapsed && (
                              <span className="text-[11.5px] font-medium text-gray-400 whitespace-nowrap">
                                {item.name}
                              </span>
                            )}
                          </div>
                          {!isCollapsed && (
                            <i className="fas fa-lock text-[9px] text-gray-300"></i>
                          )}
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
                        title={isCollapsed ? item.name : ""}
                        className={`${wrapperClass} group`}
                      >
                        <div className={iconBoxClass}>
                          <i className={`fas ${item.icon} text-[13px]`}></i>
                        </div>
                        {!isCollapsed && (
                          <span className={textClass}>{item.name}</span>
                        )}
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
      <div className="flex-1 flex flex-col overflow-hidden relative w-full transition-all duration-300">
        {/* COMPACT HEADER (h-[55px] instead of h-[70px]) */}
        <header className="h-[55px] bg-transparent flex items-center justify-between px-4 lg:px-6 z-10 transition-all">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-[8px] bg-white text-gray-500 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] hover:text-[#e67e22] transition-colors"
            >
              <i className="fas fa-bars text-[13px]"></i>
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex w-8 h-8 items-center justify-center rounded-[8px] bg-white text-gray-500 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] hover:text-[#1677ff] transition-colors"
              title="Toggle Sidebar"
            >
              <i
                className={`fas ${isCollapsed ? "fa-indent" : "fa-outdent"} text-[13px]`}
              ></i>
            </button>
            <div className="hidden md:flex items-center bg-white px-3 py-1.5 rounded-full w-[220px] border border-gray-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] focus-within:border-blue-300 transition-all">
              <i className="fas fa-search text-gray-400 text-xs"></i>
              <input
                type="text"
                placeholder="Type here..."
                className="bg-transparent border-none outline-none ml-2 text-[12px] w-full font-medium text-slate-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-slate-800 transition-colors flex items-center gap-2">
              <i className="fas fa-user text-[13px]"></i>
              <span className="text-[12px] font-bold hidden sm:inline">
                {username}
              </span>
            </button>
            <Link
              to="/settings"
              className="text-gray-500 hover:text-slate-800 transition-colors"
            >
              <i className="fas fa-cog text-[14px]"></i>
            </Link>
            <button className="text-gray-500 hover:text-slate-800 transition-colors relative">
              <i className="fas fa-bell text-[14px]"></i>
              <span className="absolute -top-1 -right-1 bg-[#ff4d4f] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[#fafafa]">
                3
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-[#ff4d4f] transition-colors ml-1"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt text-[14px]"></i>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 lg:px-6 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}