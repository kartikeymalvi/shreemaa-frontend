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

import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Hamburger State
  const [isCollapsed, setIsCollapsed] = useState(false); // 🔥 Desktop Collapse State 🔥

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
    <div className="flex h-screen bg-[#fafafa] font-sans text-slate-800 tracking-tight">
      {/* --- MOBILE OVERLAY --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        ></div>
      )}

      {/* --- SIDEBAR --- */}
      {/* 🔥 Width ab dynamic hai: isCollapsed true hai to 88px, nahi to 250px 🔥 */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#fafafa] min-h-screen flex flex-col transform transition-all duration-300 ease-in-out 
        ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"} 
        ${isCollapsed ? "w-[88px]" : "w-[250px]"}`}
      >
        {/* PREMIUM CLEAN LOGO */}
        <div className="h-[80px] flex items-center px-6">
          <Link
            to="/dashboard"
            onClick={closeSidebar}
            className={`flex items-center ${isCollapsed ? "justify-center w-full" : "gap-3"} group transition-all duration-300`}
          >
            {/* Custom SVG Logo */}
            <svg
              width="22"
              height="22"
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

            {/* Text Hide Animation logic */}
            {!isCollapsed && (
              <span className="text-[15px] font-bold text-slate-700 tracking-wide mt-0.5 whitespace-nowrap animate-in fade-in zoom-in duration-300">
                SHRI MAA GROUP
              </span>
            )}
          </Link>
        </div>

        {/* Subtle Divider */}
        <div className="w-[85%] mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 overflow-y-auto px-4 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-6">
            {menuItems.map((group, idx) => (
              <div key={idx}>
                {/* Group Title or Small Dash for collapsed state */}
                {!isCollapsed ? (
                  <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 whitespace-nowrap fade-in duration-200">
                    {group.group}
                  </p>
                ) : (
                  <div className="flex justify-center mb-3">
                    <div className="w-4 h-[2px] bg-gray-200 rounded-full"></div>
                  </div>
                )}

                <div className="space-y-1">
                  {group.items.map((item, itemIdx) => {
                    const active = isActive(item.path, item.exact);

                    // Wrapper Style dynamically centering if collapsed
                    const wrapperClass = active
                      ? `flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3.5 px-3"} py-2.5 bg-white rounded-2xl shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] transform -translate-y-[2px] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]`
                      : `flex items-center ${isCollapsed ? "justify-center px-0" : "gap-3.5 px-3"} py-2.5 rounded-2xl hover:bg-white hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]`;

                    const iconBoxClass = active
                      ? "w-[32px] h-[32px] rounded-[10px] bg-[#e67e22] text-white flex items-center justify-center shadow-[0_6px_14px_-4px_rgba(22,119,255,0.6)] shrink-0"
                      : "w-[32px] h-[32px] rounded-[10px] bg-white text-gray-400 flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-gray-100 group-hover:text-gray-600 shrink-0";

                    const textClass = active
                      ? "text-[14px] font-bold text-slate-800 whitespace-nowrap"
                      : "text-[14px] font-medium text-gray-500 group-hover:text-gray-700 transition-colors whitespace-nowrap";

                    // Admin Lock UI
                    if (item.requiresAdmin && role !== "ADMIN") {
                      return (
                        <button
                          key={itemIdx}
                          onClick={() => alert("🔒 Access Denied")}
                          title={isCollapsed ? "🔒 Access Denied" : ""}
                          className={`w-full flex items-center ${isCollapsed ? "justify-center px-0" : "justify-between px-3"} py-2.5 rounded-[12px] opacity-60 cursor-not-allowed group transition-all`}
                        >
                          <div
                            className={`flex items-center ${isCollapsed ? "" : "gap-3.5"}`}
                          >
                            <div className="w-[32px] h-[32px] shrink-0 rounded-[10px] bg-white text-gray-300 flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-gray-100">
                              <i className={`fas ${item.icon} text-[14px]`}></i>
                            </div>
                            {!isCollapsed && (
                              <span className="text-[14px] font-medium text-gray-400 whitespace-nowrap">
                                {item.name}
                              </span>
                            )}
                          </div>
                          {!isCollapsed && (
                            <i className="fas fa-lock text-[10px] text-gray-300"></i>
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
                        title={isCollapsed ? item.name : ""} // 🔥 Tooltip on hover when collapsed
                        className={`${wrapperClass} group`}
                      >
                        <div className={iconBoxClass}>
                          <i className={`fas ${item.icon} text-[14px]`}></i>
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
        {/* HEADER */}
        <header className="h-[80px] bg-transparent flex items-center justify-between px-4 lg:px-8 z-10 transition-all">
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* 🔥 MOBILE HAMBURGER MENU */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-[12px] bg-white text-gray-500 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] hover:text-[#e67e22] transition-colors"
            >
              <i className="fas fa-bars"></i>
            </button>

            {/* 🔥 DESKTOP SIDEBAR TOGGLE 🔥 */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex w-10 h-10 items-center justify-center rounded-[12px] bg-white text-gray-500 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] hover:text-[#1677ff] transition-colors"
              title="Toggle Sidebar"
            >
              <i
                className={`fas ${isCollapsed ? "fa-indent" : "fa-outdent"} text-[14px]`}
              ></i>
            </button>

            {/* SEARCH BAR */}
            <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-full w-[250px] border border-gray-100 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] focus-within:border-blue-300 transition-all">
              <i className="fas fa-search text-gray-400 text-sm"></i>
              <input
                type="text"
                placeholder="Type here..."
                className="bg-transparent border-none outline-none ml-3 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center gap-5">
            <button className="text-gray-500 hover:text-slate-800 transition-colors flex items-center gap-2">
              <i className="fas fa-user text-sm"></i>
              <span className="text-[13.5px] font-bold hidden sm:inline">
                {username}
              </span>
            </button>

            <Link
              to="/settings"
              className="text-gray-500 hover:text-slate-800 transition-colors"
            >
              <i className="fas fa-cog text-[16px]"></i>
            </Link>

            <button className="text-gray-500 hover:text-slate-800 transition-colors relative">
              <i className="fas fa-bell text-[16px]"></i>
              <span className="absolute -top-1 -right-1.5 bg-[#ff4d4f] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#fafafa]">
                3
              </span>
            </button>

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