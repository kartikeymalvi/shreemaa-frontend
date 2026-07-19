// import React, { useState, useEffect } from "react";
// import {
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
// } from "recharts";
// import api from "../api/axios";

// // --- 🔥 EXACT ANT DESIGN VUE KPI CARD ---
// const KpiCard = ({ title, value, percentage, isPositive = true, icon }) => (
//   <div className="bg-white p-5 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-transparent flex justify-between items-center w-full">
//     <div>
//       <span className="text-[13px] font-semibold text-gray-400 block mb-1.5">
//         {title}
//       </span>
//       <div className="flex items-baseline gap-2.5">
//         <span className="text-[24px] font-bold text-slate-800">{value}</span>
//         {percentage && (
//           <span
//             className={`text-[12px] font-bold ${
//               isPositive ? "text-[#52c41a]" : "text-[#ff4d4f]"
//             }`}
//           >
//             {isPositive ? "+" : "-"}
//             {percentage}%
//           </span>
//         )}
//       </div>
//     </div>
//     <div className="w-[46px] h-[46px] rounded-[12px] bg-[#e67e22] text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
//       <i className={`fas ${icon} text-[20px]`}></i>
//     </div>
//   </div>
// );

// export default function Dashboard() {
//   const role = localStorage.getItem("user_role") || "USER";
//   const username = localStorage.getItem("username") || "User";

//   // --- USER MANAGEMENT STATES ---
//   const [isManageUsersModalOpen, setManageUsersModalOpen] = useState(false);
//   const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
//   const [newUser, setNewUser] = useState({ username: "", password: "", role: "USER" });
//   const [loading, setLoading] = useState(false);
//   const [usersList, setUsersList] = useState([]);

//   // --- ERP LIVE DASHBOARD DATA ---
//   const [dashboardStats, setDashboardStats] = useState({
//     totalOrders: 1245, openOrders: 142, completed: 1103, revenue: "15.4L", openTickets: 8, pendingRefunds: 12,
//   });

//   // 🔥 UPDATED DATA: Sales by Merchant Pie Chart
//   const [erpPieData] = useState([
//     { name: "Amazon", value: 65, color: "#ffffff" },         // Pure White
//     { name: "Flipkart", value: 25, color: "#93c5fd" },       // Light Blue
//     { name: "Offline/B2B", value: 10, color: "rgba(255,255,255,0.4)" } // Semi-transparent white
//   ]);

//   // Ant Design Double Area Chart Data
//   const [areaData] = useState([
//     { name: "Apr", sales: 40, traffic: 50 }, { name: "May", sales: 100, traffic: 80 },
//     { name: "Jun", sales: 300, traffic: 50 }, { name: "Jul", sales: 220, traffic: 150 },
//     { name: "Aug", sales: 500, traffic: 280 }, { name: "Sep", sales: 250, traffic: 300 },
//     { name: "Oct", sales: 400, traffic: 320 }, { name: "Nov", sales: 230, traffic: 230 },
//     { name: "Dec", sales: 480, traffic: 380 }
//   ]);

//   useEffect(() => {
//     if (role === "ADMIN") fetchUsers();
//   }, [role]);

//   const fetchUsers = async () => {
//     try {
//       const response = await api.get("auth/users/");
//       setUsersList(response.data);
//     } catch (error) { console.error(error); }
//   };

//   const handleCreateUser = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.post("auth/create-user/", newUser);
//       setAddUserModalOpen(false);
//       setNewUser({ username: "", password: "", role: "USER" });
//       fetchUsers();
//     } catch (error) { alert("Error"); } finally { setLoading(false); }
//   };

//   const handleDeleteUser = async (id, name) => {
//     if (window.confirm("Delete user?")) {
//       try { await api.delete(`auth/users/${id}/`); fetchUsers(); }
//       catch (error) { alert("Error"); }
//     }
//   };

//   return (
//     <div className="w-full max-w-[1500px] mx-auto animate-in fade-in duration-300">
//       {/* --- BREADCRUMB HEADER --- */}
//       <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
//         <div>
//           <p className="text-[12px] text-gray-400 font-medium mb-1">
//             Pages / <span className="text-slate-600">Dashboard</span>
//           </p>
//           <h1 className="text-[18px] font-bold text-slate-800">Dashboard</h1>
//         </div>
//         {role === "ADMIN" && (
//           <button
//             onClick={() => setManageUsersModalOpen(true)}
//             className="text-[13px] font-semibold text-white bg-[#e67e22] hover:bg-[#d35400] px-4 py-2 rounded-xl shadow-md shadow-[#e67e22]/30 transition-all flex items-center gap-2"
//           >
//             <i className="fas fa-users-cog"></i> Manage Users
//           </button>
//         )}
//       </div>

//       {/* --- ROW 1: 4 MAIN KPI CARDS --- */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
//         <KpiCard
//           title="Total Orders"
//           value={dashboardStats.totalOrders}
//           percentage="12"
//           icon="fa-shopping-cart"
//         />
//         <KpiCard
//           title="Open Orders"
//           value={dashboardStats.openOrders}
//           percentage="4"
//           isPositive={false}
//           icon="fa-box-open"
//         />
//         <KpiCard
//           title="Completed"
//           value={dashboardStats.completed}
//           percentage="20"
//           icon="fa-check-circle"
//         />
//         <KpiCard
//           title="Total Revenue"
//           value={`₹${dashboardStats.revenue}`}
//           percentage="8"
//           icon="fa-wallet"
//         />
//       </div>

//       {/* --- ROW 2: GRAPH MODULES --- */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
//         {/* 🔥 ERP PIE CHART - Col-span 5 */}
//         <div className="bg-white p-6 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] lg:col-span-5 flex flex-col justify-between">
//           {/* Gradient Box with Pie Chart */}
//           <div className="bg-gradient-to-r from-[#6366f1] to-[#1677ff] rounded-2xl p-4 h-[220px] mb-5 shadow-lg shadow-blue-500/20 flex flex-col justify-center relative">
//             {/* Custom Legend */}
//             <div className="absolute top-4 left-4 flex flex-col gap-2">
//               <div className="flex items-center gap-2 text-white text-[10px] font-bold tracking-wider">
//                 <span className="w-2 h-2 rounded-full bg-white"></span> Amazon
//               </div>
//               <div className="flex items-center gap-2 text-white text-[10px] font-bold tracking-wider">
//                 <span className="w-2 h-2 rounded-full bg-[#93c5fd]"></span>{" "}
//                 Flipkart
//               </div>
//             </div>

//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={erpPieData}
//                   innerRadius={55}
//                   outerRadius={85}
//                   paddingAngle={5}
//                   dataKey="value"
//                   stroke="none"
//                 >
//                   {erpPieData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   cursor={{ fill: "transparent" }}
//                   contentStyle={{
//                     borderRadius: "8px",
//                     border: "none",
//                     color: "#000",
//                     fontSize: "12px",
//                     fontWeight: "bold",
//                   }}
//                   itemStyle={{ color: "#1677ff" }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           <div>
//             <h3 className="text-[15px] font-bold text-slate-800">
//               Sales by Merchant
//             </h3>
//             <p className="text-[13px] text-[#52c41a] font-semibold mt-0.5">
//               than last week <span className="text-[#52c41a]">+18%</span>
//             </p>
//             <p className="text-[13px] text-gray-500 mt-2 leading-relaxed">
//               Overview of order distribution across different e-commerce
//               platforms and offline B2B sales.
//             </p>
//           </div>

//           {/* ERP Summary Metrics */}
//           <div className="grid grid-cols-4 gap-2 pt-5 border-t border-gray-50 mt-5">
//             <div>
//               <h5 className="text-[18px] font-bold text-slate-800">1.2K</h5>
//               <p className="text-[12px] text-gray-400 font-medium">Orders</p>
//             </div>
//             <div>
//               <h5 className="text-[18px] font-bold text-slate-800">4.5K</h5>
//               <p className="text-[12px] text-gray-400 font-medium">Units</p>
//             </div>
//             <div>
//               <h5 className="text-[18px] font-bold text-slate-800">₹15L</h5>
//               <p className="text-[12px] text-gray-400 font-medium">Revenue</p>
//             </div>
//             <div>
//               <h5 className="text-[18px] font-bold text-slate-800">12</h5>
//               <p className="text-[12px] text-gray-400 font-medium">Returns</p>
//             </div>
//           </div>
//         </div>

//         {/* SALES OVERVIEW (DOUBLE AREA CHART) - Col-span 7 */}
//         <div className="bg-white p-6 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] lg:col-span-7 flex flex-col">
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h3 className="text-[15px] font-bold text-slate-800">
//                 Sales Overview
//               </h3>
//               <p className="text-[13px] text-gray-400 font-medium mt-0.5">
//                 than last year{" "}
//                 <span className="text-[#52c41a] font-bold">+20%</span>
//               </p>
//             </div>
//             {/* Chart Legend */}
//             <div className="flex flex-col gap-1">
//               <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
//                 <span className="w-3 h-1 bg-[#1677ff] rounded"></span> Target
//               </div>
//               <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
//                 <span className="w-3 h-1 bg-[#c084fc] rounded"></span> Actual
//                 Sales
//               </div>
//             </div>
//           </div>

//           <div className="flex-1 min-h-[300px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart
//                 data={areaData}
//                 margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
//               >
//                 <defs>
//                   <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#e67e22" stopOpacity={0.15} />
//                     <stop offset="95%" stopColor="#1677ff" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   vertical={false}
//                   stroke="#f0f2f5"
//                 />
//                 <XAxis
//                   dataKey="name"
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 500 }}
//                   dy={10}
//                 />
//                 <YAxis
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 500 }}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     borderRadius: "10px",
//                     border: "none",
//                     boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//                   }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="traffic"
//                   stroke="#c084fc"
//                   strokeWidth={3}
//                   fill="transparent"
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="sales"
//                   stroke="#1677ff"
//                   strokeWidth={3}
//                   fillOpacity={1}
//                   fill="url(#colorSales)"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* --- ROW 3: ERP TABLES & TIMELINE --- */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//         {/* 🔥 ERP SHIPMENTS TABLE (Col-span 8) */}
//         <div className="bg-white rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] lg:col-span-8 flex flex-col overflow-hidden w-full">
//           <div className="p-6 border-b border-gray-50 flex justify-between items-center">
//             <div>
//               <h3 className="text-[15px] font-bold text-slate-800">
//                 Top Performing Firms
//               </h3>
//               <p className="text-[13px] text-gray-400 font-medium mt-0.5">
//                 fulfillment this month{" "}
//                 <span className="text-[#1677ff] font-bold">+14%</span>
//               </p>
//             </div>
//             <div className="flex gap-2 text-[12px] font-bold">
//               <span className="px-3 py-1.5 border border-blue-500 text-blue-500 rounded-md cursor-pointer">
//                 ALL
//               </span>
//               <span className="px-3 py-1.5 text-gray-400 hover:text-gray-600 cursor-pointer">
//                 SHIPPED
//               </span>
//             </div>
//           </div>

//           <div className="overflow-x-auto w-full p-2">
//             <table className="w-full text-left min-w-[600px]">
//               <thead className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
//                 <tr>
//                   <th className="p-4 pl-6">FIRM / MERCHANT</th>
//                   <th className="p-4">OPERATORS</th>
//                   <th className="p-4 text-center">REVENUE</th>
//                   <th className="p-4 text-center">FULFILLMENT</th>
//                 </tr>
//               </thead>
//               <tbody className="text-[13.5px] font-semibold text-slate-700">
//                 <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
//                   <td className="p-4 pl-6 flex items-center gap-4">
//                     <i className="fab fa-amazon text-[#ff9900] text-[20px]"></i>
//                     <span className="text-slate-800">Shree Maa Amazon</span>
//                   </td>
//                   <td className="p-4">
//                     <div className="flex -space-x-2">
//                       <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white z-20 flex items-center justify-center text-[8px] text-blue-600">
//                         KM
//                       </div>
//                       <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-white z-10 flex items-center justify-center text-[8px] text-green-600">
//                         RS
//                       </div>
//                       <div className="w-6 h-6 rounded-full bg-purple-100 border-2 border-white z-0 flex items-center justify-center text-[8px] text-purple-600">
//                         AJ
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-4 text-center text-gray-500">₹14,50,000</td>
//                   <td className="p-4 px-6">
//                     <div className="w-full bg-gray-100 rounded-full h-1.5">
//                       <div
//                         className="bg-[#1677ff] h-1.5 rounded-full"
//                         style={{ width: "85%" }}
//                       ></div>
//                     </div>
//                   </td>
//                 </tr>
//                 <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
//                   <td className="p-4 pl-6 flex items-center gap-4">
//                     <i className="fas fa-store text-[#1677ff] text-[20px]"></i>
//                     <span className="text-slate-800">
//                       JMD Enterprises Flipkart
//                     </span>
//                   </td>
//                   <td className="p-4">
//                     <div className="flex -space-x-2">
//                       <div className="w-6 h-6 rounded-full bg-amber-100 border-2 border-white z-10 flex items-center justify-center text-[8px] text-amber-600">
//                         PK
//                       </div>
//                       <div className="w-6 h-6 rounded-full bg-red-100 border-2 border-white z-0 flex items-center justify-center text-[8px] text-red-600">
//                         VK
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-4 text-center text-gray-500">₹3,20,000</td>
//                   <td className="p-4 px-6">
//                     <div className="w-full bg-gray-100 rounded-full h-1.5">
//                       <div
//                         className="bg-[#1677ff] h-1.5 rounded-full"
//                         style={{ width: "45%" }}
//                       ></div>
//                     </div>
//                   </td>
//                 </tr>
//                 <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
//                   <td className="p-4 pl-6 flex items-center gap-4">
//                     <i className="fas fa-industry text-[#c084fc] text-[20px]"></i>
//                     <span className="text-slate-800">Polyshri B2B Bulk</span>
//                   </td>
//                   <td className="p-4">
//                     <div className="flex -space-x-2">
//                       <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white z-0 flex items-center justify-center text-[8px] text-gray-600">
//                         AD
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-4 text-center text-gray-500">₹8,90,000</td>
//                   <td className="p-4 px-6">
//                     <div className="w-full bg-gray-100 rounded-full h-1.5">
//                       <div
//                         className="bg-[#52c41a] h-1.5 rounded-full"
//                         style={{ width: "100%" }}
//                       ></div>
//                     </div>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* 🔥 ERP SYSTEM ACTIVITY TIMELINE (Col-span 4) */}
//         <div className="bg-white p-6 rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] lg:col-span-4 flex flex-col">
//           <h3 className="text-[15px] font-bold text-slate-800">
//             System Activity Log
//           </h3>
//           <p className="text-[13px] text-gray-400 font-medium mt-0.5 mb-6">
//             live server status
//           </p>

//           <div className="relative pl-3 space-y-6 flex-1 before:absolute before:inset-0 before:ml-4 before:h-full before:w-[2px] before:bg-gray-100">
//             <div className="relative flex items-start gap-5">
//               <div className="w-3 h-3 rounded-full border-2 border-[#52c41a] bg-white z-10 flex-shrink-0 mt-1 ml-[5px]"></div>
//               <div>
//                 <p className="text-[14px] font-bold text-slate-700">
//                   Excel Bulk Upload Completed
//                 </p>
//                 <p className="text-[12px] text-gray-400 font-medium mt-0.5">
//                   Today 10:45 AM
//                 </p>
//               </div>
//             </div>

//             <div className="relative flex items-start gap-5">
//               <div className="w-3 h-3 rounded-full border-2 border-[#ff4d4f] bg-white z-10 flex-shrink-0 mt-1 ml-[5px]"></div>
//               <div>
//                 <p className="text-[14px] font-bold text-slate-700">
//                   Order #ORD-9934 Cancelled
//                 </p>
//                 <p className="text-[12px] text-gray-400 font-medium mt-0.5">
//                   Today 09:30 AM
//                 </p>
//               </div>
//             </div>

//             <div className="relative flex items-start gap-5">
//               <div className="w-3 h-3 rounded-full border-2 border-[#1677ff] bg-white z-10 flex-shrink-0 mt-1 ml-[5px]"></div>
//               <div>
//                 <p className="text-[14px] font-bold text-slate-700">
//                   GRPO #GR-102 Synced
//                 </p>
//                 <p className="text-[12px] text-gray-400 font-medium mt-0.5">
//                   Yesterday 04:15 PM
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ================= MANAGE USERS MODAL (FULL TABLE VIEW) ================= */}
// {isManageUsersModalOpen && (
//   <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//     <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
//       {/* Modal Header */}
//       <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
//         <div>
//           <h2 className="text-xl font-bold text-slate-800 tracking-tight">
//             Active Users List
//           </h2>
//           <p className="text-xs text-gray-500 font-medium mt-1">
//             Manage system access and privileges
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           {/* Top Add User Button */}
//           <button
//             onClick={() => {
//               setManageUsersModalOpen(false);
//               setAddUserModalOpen(true);
//             }}
//             className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 shadow-md transition flex items-center gap-2"
//           >
//             <i className="fas fa-plus"></i> Add User
//           </button>
//           {/* Close Button */}
//           <button
//             onClick={() => setManageUsersModalOpen(false)}
//             className="px-5 py-2.5 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-100 transition border border-gray-200"
//           >
//             Close
//           </button>
//         </div>
//       </div>

//       {/* Modal Table Body */}
//       <div className="overflow-y-auto custom-scrollbar p-6 bg-slate-50/50 flex-1">
//         <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
//                 <th className="py-4 px-6">User ID</th>
//                 <th className="py-4 px-6">Username</th>
//                 <th className="py-4 px-6">Role</th>
//                 <th className="py-4 px-6">Joined Date</th>
//                 <th className="py-4 px-6 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {usersList.map((u, index) => (
//                 <tr
//                   key={u.id || index}
//                   className="hover:bg-slate-50/50 transition-colors group"
//                 >
//                   <td className="py-4 px-6 text-xs font-mono font-bold text-gray-400">
//                     #{u.id}
//                   </td>

//                   <td className="py-4 px-6">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shadow-sm">
//                         {u.username
//                           ? u.username.charAt(0).toUpperCase()
//                           : "U"}
//                       </div>
//                       <span className="text-sm font-bold text-slate-700">
//                         {u.username}
//                       </span>
//                     </div>
//                   </td>

//                   <td className="py-4 px-6">
//                     <span
//                       className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${
//                         u.role === "ADMIN"
//                           ? "bg-amber-50 text-amber-600 border-amber-200"
//                           : "bg-gray-100 text-gray-500 border-gray-200"
//                       }`}
//                     >
//                       {u.role || "USER"}
//                     </span>
//                   </td>

//                   <td className="py-4 px-6 text-xs text-gray-500 font-medium">
//                     {/* Yahan aap apna normal date formatter use kar sakte hain */}
//                     {u.date_joined
//                       ? new Date(u.date_joined).toLocaleDateString()
//                       : "N/A"}
//                   </td>

//                   <td className="py-4 px-6 text-right">
//                     {u.username === username ? (
//                       <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded border border-gray-100 inline-block">
//                         Current User
//                       </span>
//                     ) : (
//                       <button
//                         onClick={() => handleDeleteUser(u.id)}
//                         className="text-[11px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition flex items-center justify-end w-full gap-1.5"
//                       >
//                         <i className="fas fa-trash-alt"></i> Delete
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))}

//               {usersList.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan="5"
//                     className="p-8 text-center text-gray-400 text-sm font-medium"
//                   >
//                     No users found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   </div>
// )}

// {isAddUserModalOpen && role === "ADMIN" && (
//   <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//     <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-bold">Add User</h2>
//         <button
//           onClick={() => setAddUserModalOpen(false)}
//           className="text-gray-400 hover:text-gray-800"
//         >
//           <i className="fas fa-times"></i>
//         </button>
//       </div>
//       <form onSubmit={handleCreateUser} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Username"
//           value={newUser.username}
//           onChange={(e) =>
//             setNewUser({ ...newUser, username: e.target.value })
//           }
//           className="w-full p-2.5 bg-gray-50 rounded-xl outline-none"
//           required
//         />
//         <input
//           type="Password"
//           placeholder="Password"
//           value={newUser.password}
//           onChange={(e) =>
//             setNewUser({ ...newUser, password: e.target.value })
//           }
//           className="w-full p-2.5 bg-gray-50 rounded-xl outline-none"
//           required
//         />
//         <select
//           value={newUser.role}
//           onChange={(e) =>
//             setNewUser({ ...newUser, role: e.target.value })
//           }
//           className="w-full p-2.5 bg-gray-50 rounded-xl outline-none"
//         >
//           <option value="USER">User</option>
//           <option value="ADMIN">Admin</option>
//         </select>
//         <button
//           type="submit"
//           className="w-full bg-[#1677ff] text-white py-2.5 rounded-xl font-bold"
//         >
//           {loading ? "Saving..." : "Save"}
//         </button>
//       </form>
//     </div>
//   </div>
// )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   Legend,
// } from "recharts";
// import api from "../api/axios";

// // --- MAIN KPI CARD ---
// const KpiCard = ({
//   title,
//   value,
//   percentage,
//   isPositive = true,
//   icon,
//   colorClass = "bg-[#1677ff]",
// }) => (
//   <div className="bg-white p-5 rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex justify-between items-center w-full group hover:shadow-md transition-all">
//     <div>
//       <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
//         {title}
//       </span>
//       <div className="flex items-baseline gap-2.5">
//         <span className="text-[24px] font-extrabold text-slate-800">
//           {value}
//         </span>
//         {percentage && (
//           <span
//             className={`text-[12px] font-bold ${isPositive ? "text-[#52c41a]" : "text-[#ff4d4f]"}`}
//           >
//             {isPositive ? "+" : "-"}
//             {percentage}%
//           </span>
//         )}
//       </div>
//     </div>
//     <div
//       className={`w-[48px] h-[48px] rounded-2xl text-white flex items-center justify-center shadow-lg ${colorClass} group-hover:scale-110 transition-transform duration-300`}
//     >
//       <i className={`fas ${icon} text-[20px]`}></i>
//     </div>
//   </div>
// );

// // --- MINI ALERT CARD ---
// const MiniAlertCard = ({ title, value, type }) => (
//   <div className="bg-white px-5 py-3.5 rounded-[12px] border border-gray-100 flex items-center justify-between shadow-sm">
//     <div className="flex items-center gap-3">
//       <div
//         className={`w-2 h-2 rounded-full animate-pulse ${type === "danger" ? "bg-red-500" : type === "warning" ? "bg-amber-500" : "bg-blue-500"}`}
//       ></div>
//       <span className="text-[13px] font-bold text-slate-600">{title}</span>
//     </div>
//     <span
//       className={`text-[15px] font-extrabold ${type === "danger" ? "text-red-600" : type === "warning" ? "text-amber-600" : "text-slate-800"}`}
//     >
//       {value}
//     </span>
//   </div>
// );

// export default function Dashboard() {
//   const role = localStorage.getItem("user_role") || "USER";
//   const username = localStorage.getItem("username") || "User";

//   const [isManageUsersModalOpen, setManageUsersModalOpen] = useState(false);
//   const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
//   const [newUser, setNewUser] = useState({
//     username: "",
//     password: "",
//     role: "USER",
//   });
//   const [loading, setLoading] = useState(false);
//   const [usersList, setUsersList] = useState([]);

//   // Timeframe filter state for charts
//   const [timeframe, setTimeframe] = useState("month");

//   const [dashboardStats, setDashboardStats] = useState({
//     totalOrders: 0,
//     openOrders: 0,
//     completed: 0,
//     revenue: 0,
//   });

//   const [erpPieData, setErpPieData] = useState([]);

//   // Dummy Chart Data
//   const [areaData] = useState([
//     { name: "Apr", target: 40, sales: 50 },
//     { name: "May", target: 100, sales: 80 },
//     { name: "Jun", target: 300, sales: 50 },
//     { name: "Jul", target: 220, sales: 150 },
//     { name: "Aug", target: 500, sales: 280 },
//     { name: "Sep", target: 250, sales: 300 },
//     { name: "Oct", target: 400, sales: 320 },
//     { name: "Nov", target: 230, sales: 230 },
//     { name: "Dec", target: 480, sales: 380 },
//   ]);

//   const formatCurrency = (num) => {
//     if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
//     if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
//     return `₹${num.toFixed(2)}`;
//   };

//   useEffect(() => {
//     if (role === "ADMIN") fetchUsers();
//     fetchLiveDashboardData();
//   }, [role]);

//   const fetchLiveDashboardData = async () => {
//     try {
//       const response = await api.get("reports/dashboard-stats/");
//       const { kpis, pieData } = response.data;
//       setDashboardStats(kpis);

//       const colors = [
//         "#ffffff",
//         "#93c5fd",
//         "rgba(255,255,255,0.4)",
//         "#ff9900",
//         "#1677ff",
//       ];
//       const formattedPieData = pieData.map((item, index) => ({
//         ...item,
//         color: colors[index % colors.length],
//       }));
//       setErpPieData(formattedPieData);
//     } catch (error) {
//       console.error("Failed to fetch live dashboard stats:", error);
//     }
//   };

//   const fetchUsers = async () => {
//     try {
//       const response = await api.get("auth/users/");
//       setUsersList(response.data);
//     } catch (error) {
//       console.error("Failed to fetch users:", error);
//     }
//   };
//   const handleCreateUser = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.post("auth/create-user/", newUser);
//       setAddUserModalOpen(false);
//       setNewUser({ username: "", password: "", role: "USER" });
//       fetchUsers(); // Add hone ke baad list auto-refresh hogi
//     } catch (error) {
//       alert("Error creating user");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleDeleteUser = async (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       try {
//         await api.delete(`auth/users/${id}/`);
//         fetchUsers(); // Delete hone ke baad list auto-refresh hogi
//       } catch (error) {
//         alert("Error deleting user");
//         console.error(error);
//       }
//     }
//   };

//   return (
//     <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-300 pb-10">
//       {/* --- BREADCRUMB & HEADER CONTROLS --- */}
//       <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
//         <div>
//           <p className="text-[12px] text-gray-400 font-bold tracking-widest uppercase mb-1">
//             Overview / <span className="text-[#1677ff]">Live Engine</span>
//           </p>
//           <h1 className="text-[22px] font-extrabold text-slate-800">
//             ERP Dashboard
//           </h1>
//         </div>

//         <div className="flex items-center gap-3">
//           {/* Quick Filter Dropdown */}
//           <div className="hidden sm:flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
//             {["week", "month", "year"].map((t) => (
//               <button
//                 key={t}
//                 onClick={() => setTimeframe(t)}
//                 className={`px-4 py-1.5 text-[12px] font-bold capitalize rounded-md transition-all ${timeframe === t ? "bg-slate-100 text-slate-800 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
//               >
//                 This {t}
//               </button>
//             ))}
//           </div>

//           {role === "ADMIN" && (
//             <button
//               onClick={() => setManageUsersModalOpen(true)}
//               className="text-[13px] font-bold text-white bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-2"
//             >
//               <i className="fas fa-user-shield text-[14px]"></i> Access Control
//             </button>
//           )}
//         </div>
//       </div>

//       {/* --- ROW 1: MAIN KPI CARDS --- */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-5">
//         <KpiCard
//           title="Total Orders"
//           value={dashboardStats.totalOrders}
//           percentage="12"
//           icon="fa-shopping-cart"
//           colorClass="bg-gradient-to-br from-[#1677ff] to-[#6366f1] shadow-blue-500/30"
//         />
//         <KpiCard
//           title="Open Pending"
//           value={dashboardStats.openOrders}
//           percentage="4"
//           isPositive={false}
//           icon="fa-box-open"
//           colorClass="bg-gradient-to-br from-[#f59e0b] to-[#ed8936] shadow-amber-500/30"
//         />
//         <KpiCard
//           title="Completed"
//           value={dashboardStats.completed}
//           percentage="20"
//           icon="fa-check-double"
//           colorClass="bg-gradient-to-br from-[#10b981] to-[#059669] shadow-emerald-500/30"
//         />
//         <KpiCard
//           title="Gross Revenue"
//           value={formatCurrency(dashboardStats.revenue)}
//           percentage="8"
//           icon="fa-wallet"
//           colorClass="bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] shadow-purple-500/30"
//         />
//       </div>

//       {/* --- ROW 2: ACTIONABLE MINI ALERTS (Fills space & adds ERP value) --- */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
//         <MiniAlertCard
//           title="Pending Refunds (Value)"
//           value="₹45,200"
//           type="danger"
//         />
//         <MiniAlertCard
//           title="Active Discrepancies"
//           value="12 Items"
//           type="warning"
//         />
//         <MiniAlertCard title="Un-synced GRPO" value="4 Entries" type="info" />
//       </div>

//       {/* --- ROW 3: CHARTS SECTION --- */}
//       <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
//         {/* PIE CHART (Col-span 4 for better ratio) */}
//         <div className="bg-white p-6 rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 xl:col-span-4 flex flex-col justify-between min-h-[420px]">
//           <div>
//             <h3 className="text-[16px] font-extrabold text-slate-800">
//               Merchant Distribution
//             </h3>
//             <p className="text-[13px] text-gray-500 mt-1">
//               Live order volume split
//             </p>
//           </div>

//           <div className="bg-gradient-to-br from-[#6366f1] to-[#1677ff] rounded-2xl p-4 h-[240px] my-5 shadow-lg shadow-blue-500/20 flex flex-col justify-center relative">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={
//                     erpPieData.length > 0
//                       ? erpPieData
//                       : [{ name: "No Data", value: 1, color: "#ffffff" }]
//                   }
//                   innerRadius={60}
//                   outerRadius={90}
//                   paddingAngle={4}
//                   dataKey="value"
//                   stroke="none"
//                 >
//                   {erpPieData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   formatter={(value) => formatCurrency(value)}
//                   contentStyle={{
//                     borderRadius: "8px",
//                     border: "none",
//                     fontWeight: "bold",
//                     fontSize: "12px",
//                     color: "#000",
//                   }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             {erpPieData.slice(0, 4).map((item, idx) => (
//               <div key={idx} className="flex items-center gap-2">
//                 <span
//                   className="w-2.5 h-2.5 rounded-full shadow-sm"
//                   style={{
//                     backgroundColor:
//                       item.name === "No Data" ? "#d1d5db" : item.color,
//                   }}
//                 ></span>
//                 <div>
//                   <p className="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1 truncate max-w-[80px]">
//                     {item.name.replace(" B2B", "")}
//                   </p>
//                   <p className="text-[14px] font-extrabold text-slate-700 leading-none">
//                     {formatCurrency(item.value)}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* DOUBLE AREA CHART (Col-span 8) */}
//         <div className="bg-white p-6 rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 xl:col-span-8 flex flex-col min-h-[420px]">
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h3 className="text-[16px] font-extrabold text-slate-800">
//                 Revenue vs Target
//               </h3>
//               <p className="text-[13px] text-gray-500 mt-1">
//                 Comparing actual sales against projected goals
//               </p>
//             </div>
//             <div className="flex gap-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
//               <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
//                 <span className="w-3 h-1 bg-[#c084fc] rounded-full"></span>{" "}
//                 Target
//               </div>
//               <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
//                 <span className="w-3 h-1 bg-[#1677ff] rounded-full shadow-[0_0_8px_#1677ff]"></span>{" "}
//                 Actual
//               </div>
//             </div>
//           </div>

//           <div className="flex-1 w-full min-h-[280px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart
//                 data={areaData}
//                 margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
//               >
//                 <defs>
//                   <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#1677ff" stopOpacity={0.2} />
//                     <stop offset="95%" stopColor="#1677ff" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   vertical={false}
//                   stroke="#f0f2f5"
//                 />
//                 <XAxis
//                   dataKey="name"
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
//                   dy={10}
//                 />
//                 <YAxis
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     borderRadius: "12px",
//                     border: "none",
//                     boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
//                   }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="target"
//                   stroke="#c084fc"
//                   strokeWidth={3}
//                   strokeDasharray="5 5"
//                   fill="transparent"
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="sales"
//                   stroke="#1677ff"
//                   strokeWidth={4}
//                   fillOpacity={1}
//                   fill="url(#colorSales)"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* --- ROW 4: DATA TABLES & TIMELINE --- */}
//       <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
//         {/* TOP PERFORMING FIRMS (Col-span 7) */}
//         <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 xl:col-span-7 flex flex-col overflow-hidden">
//           <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
//             <div>
//               <h3 className="text-[16px] font-extrabold text-slate-800">
//                 Firm Performance
//               </h3>
//               <p className="text-[13px] text-gray-500 mt-1">
//                 Live order fulfillment status
//               </p>
//             </div>
//             <button className="text-[12px] font-bold text-[#1677ff] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
//               View All Report
//             </button>
//           </div>

//           <div className="overflow-x-auto w-full p-2">
//             <table className="w-full text-left min-w-[500px]">
//               <thead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 rounded-t-lg">
//                 <tr>
//                   <th className="p-4 pl-6">FIRM / MERCHANT</th>
//                   <th className="p-4 text-center">REVENUE</th>
//                   <th className="p-4 text-center">FULFILLMENT</th>
//                 </tr>
//               </thead>
//               <tbody className="text-[13px] font-bold text-slate-700">
//                 <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
//                   <td className="p-4 pl-6 flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
//                       <i className="fab fa-amazon text-[16px]"></i>
//                     </div>
//                     Shree Maa Amazon
//                   </td>
//                   <td className="p-4 text-center">₹14,50,000</td>
//                   <td className="p-4 px-8">
//                     <div className="w-full bg-gray-100 rounded-full h-2">
//                       <div
//                         className="bg-[#1677ff] h-2 rounded-full"
//                         style={{ width: "85%" }}
//                       ></div>
//                     </div>
//                   </td>
//                 </tr>
//                 <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
//                   <td className="p-4 pl-6 flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
//                       <i className="fas fa-store text-[14px]"></i>
//                     </div>
//                     JMD Flipkart
//                   </td>
//                   <td className="p-4 text-center">₹3,20,000</td>
//                   <td className="p-4 px-8">
//                     <div className="w-full bg-gray-100 rounded-full h-2">
//                       <div
//                         className="bg-[#f59e0b] h-2 rounded-full"
//                         style={{ width: "45%" }}
//                       ></div>
//                     </div>
//                   </td>
//                 </tr>
//                 <tr className="hover:bg-gray-50/50 transition-colors">
//                   <td className="p-4 pl-6 flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center">
//                       <i className="fas fa-industry text-[14px]"></i>
//                     </div>
//                     Polyshri Bulk
//                   </td>
//                   <td className="p-4 text-center">₹8,90,000</td>
//                   <td className="p-4 px-8">
//                     <div className="w-full bg-gray-100 rounded-full h-2">
//                       <div
//                         className="bg-[#10b981] h-2 rounded-full"
//                         style={{ width: "100%" }}
//                       ></div>
//                     </div>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* SYSTEM ACTIVITY TIMELINE (Col-span 5) */}
//         <div className="bg-white p-6 rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 xl:col-span-5 flex flex-col">
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h3 className="text-[16px] font-extrabold text-slate-800">
//                 Action & Activity Log
//               </h3>
//               <p className="text-[13px] text-gray-500 mt-1">
//                 Live server updates
//               </p>
//             </div>
//             <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
//           </div>

//           <div className="relative pl-3 space-y-7 flex-1 before:absolute before:inset-0 before:ml-[17px] before:h-full before:w-[2px] before:bg-gray-100/80 mt-2">
//             <div className="relative flex items-start gap-4 group">
//               <div className="w-[14px] h-[14px] rounded-full border-[3px] border-[#10b981] bg-white z-10 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform"></div>
//               <div>
//                 <p className="text-[13.5px] font-bold text-slate-700">
//                   Bulk Orders Uploaded
//                 </p>
//                 <p className="text-[12px] text-gray-400 font-medium mt-0.5">
//                   Admin • 10:45 AM
//                 </p>
//               </div>
//             </div>

//             <div className="relative flex items-start gap-4 group">
//               <div className="w-[14px] h-[14px] rounded-full border-[3px] border-[#ef4444] bg-white z-10 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform"></div>
//               <div className="bg-red-50/50 p-3 rounded-lg border border-red-100 w-full">
//                 <p className="text-[13.5px] font-bold text-red-600">
//                   Discrepancy Raised
//                 </p>
//                 <p className="text-[12px] text-red-400/80 font-medium mt-1">
//                   Order #ORD-9934 reported short by 5 units.
//                 </p>
//               </div>
//             </div>

//             <div className="relative flex items-start gap-4 group">
//               <div className="w-[14px] h-[14px] rounded-full border-[3px] border-[#1677ff] bg-white z-10 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform"></div>
//               <div>
//                 <p className="text-[13.5px] font-bold text-slate-700">
//                   SAP GRPO Synced
//                 </p>
//                 <p className="text-[12px] text-gray-400 font-medium mt-0.5">
//                   System • Yesterday
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* (MODALS CODE REMAINS EXACTLY SAME AS YOUR PREVIOUS CODE) */}
//       {/* ... Insert Manage Users Modal Code Here ... */}
//       {isManageUsersModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
//             {/* Modal Header */}
//             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-800 tracking-tight">
//                   Active Users List
//                 </h2>
//                 <p className="text-xs text-gray-500 font-medium mt-1">
//                   Manage system access and privileges
//                 </p>
//               </div>
//               <div className="flex items-center gap-3">
//                 {/* Top Add User Button */}
//                 <button
//                   onClick={() => {
//                     setManageUsersModalOpen(false);
//                     setAddUserModalOpen(true);
//                   }}
//                   className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 shadow-md transition flex items-center gap-2"
//                 >
//                   <i className="fas fa-plus"></i> Add User
//                 </button>
//                 {/* Close Button */}
//                 <button
//                   onClick={() => setManageUsersModalOpen(false)}
//                   className="px-5 py-2.5 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-100 transition border border-gray-200"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             {/* Modal Table Body */}
//             <div className="overflow-y-auto custom-scrollbar p-6 bg-slate-50/50 flex-1">
//               <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//                 <table className="w-full text-left border-collapse">
//                   <thead>
//                     <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
//                       <th className="py-4 px-6">User ID</th>
//                       <th className="py-4 px-6">Username</th>
//                       <th className="py-4 px-6">Role</th>
//                       <th className="py-4 px-6">Joined Date</th>
//                       <th className="py-4 px-6 text-right">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-50">
//                     {usersList.map((u, index) => (
//                       <tr
//                         key={u.id || index}
//                         className="hover:bg-slate-50/50 transition-colors group"
//                       >
//                         <td className="py-4 px-6 text-xs font-mono font-bold text-gray-400">
//                           #{u.id}
//                         </td>

//                         <td className="py-4 px-6">
//                           <div className="flex items-center gap-3">
//                             <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shadow-sm">
//                               {u.username
//                                 ? u.username.charAt(0).toUpperCase()
//                                 : "U"}
//                             </div>
//                             <span className="text-sm font-bold text-slate-700">
//                               {u.username}
//                             </span>
//                           </div>
//                         </td>

//                         <td className="py-4 px-6">
//                           <span
//                             className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${
//                               u.role === "ADMIN"
//                                 ? "bg-amber-50 text-amber-600 border-amber-200"
//                                 : "bg-gray-100 text-gray-500 border-gray-200"
//                             }`}
//                           >
//                             {u.role || "USER"}
//                           </span>
//                         </td>

//                         <td className="py-4 px-6 text-xs text-gray-500 font-medium">
//                           {/* Yahan aap apna normal date formatter use kar sakte hain */}
//                           {u.date_joined
//                             ? new Date(u.date_joined).toLocaleDateString()
//                             : "N/A"}
//                         </td>

//                         <td className="py-4 px-6 text-right">
//                           {u.username === username ? (
//                             <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded border border-gray-100 inline-block">
//                               Current User
//                             </span>
//                           ) : (
//                             <button
//                               onClick={() => handleDeleteUser(u.id)}
//                               className="text-[11px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition flex items-center justify-end w-full gap-1.5"
//                             >
//                               <i className="fas fa-trash-alt"></i> Delete
//                             </button>
//                           )}
//                         </td>
//                       </tr>
//                     ))}

//                     {usersList.length === 0 && (
//                       <tr>
//                         <td
//                           colSpan="5"
//                           className="p-8 text-center text-gray-400 text-sm font-medium"
//                         >
//                           No users found.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {isAddUserModalOpen && role === "ADMIN" && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-bold">Add User</h2>
//               <button
//                 onClick={() => setAddUserModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-800"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>
//             <form onSubmit={handleCreateUser} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={newUser.username}
//                 onChange={(e) =>
//                   setNewUser({ ...newUser, username: e.target.value })
//                 }
//                 className="w-full p-2.5 bg-gray-50 rounded-xl outline-none"
//                 required
//               />
//               <input
//                 type="Password"
//                 placeholder="Password"
//                 value={newUser.password}
//                 onChange={(e) =>
//                   setNewUser({ ...newUser, password: e.target.value })
//                 }
//                 className="w-full p-2.5 bg-gray-50 rounded-xl outline-none"
//                 required
//               />
//               <select
//                 value={newUser.role}
//                 onChange={(e) =>
//                   setNewUser({ ...newUser, role: e.target.value })
//                 }
//                 className="w-full p-2.5 bg-gray-50 rounded-xl outline-none"
//               >
//                 <option value="USER">User</option>
//                 <option value="ADMIN">Admin</option>
//               </select>
//               <button
//                 type="submit"
//                 className="w-full bg-[#1677ff] text-white py-2.5 rounded-xl font-bold"
//               >
//                 {loading ? "Saving..." : "Save"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../api/axios";

// --- 🔢 1. ANIMATED NUMBER COUNTER (Custom Hook) ---
const CountUp = ({ end, duration = 1500, isCurrency = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // easeOutExpo for smooth deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(easeProgress * end);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  if (isCurrency) {
    if (count >= 100000) return `₹${(count / 100000).toFixed(2)}L`;
    if (count >= 1000) return `₹${(count / 1000).toFixed(1)}K`;
    return `₹${count.toFixed(2)}`;
  }
  return Math.floor(count);
};

// --- KPI CARD COMPONENT ---
const KpiCard = ({
  title,
  value,
  percentage,
  isPositive = true,
  icon,
  colorClass,
  isCurrency = false,
}) => (
  <div className="bg-white p-5 rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex justify-between items-center w-full group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
    <div>
      <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
        {title}
      </span>
      <div className="flex items-baseline gap-2.5">
        <span className="text-[24px] font-extrabold text-slate-800">
          {/* Animated Value */}
          <CountUp end={value} isCurrency={isCurrency} />
        </span>
        {percentage && (
          <span
            className={`text-[12px] font-bold ${isPositive ? "text-[#52c41a]" : "text-[#ff4d4f]"}`}
          >
            {isPositive ? "+" : "-"}
            {percentage}%
          </span>
        )}
      </div>
    </div>
    <div
      className={`w-[48px] h-[48px] rounded-2xl text-white flex items-center justify-center shadow-lg ${colorClass} group-hover:scale-110 transition-transform duration-300`}
    >
      <i className={`fas ${icon} text-[20px]`}></i>
    </div>
  </div>
);

// --- MINI ALERT CARD ---
const MiniAlertCard = ({ title, value, type }) => (
  <div className="bg-white px-5 py-3.5 rounded-[12px] border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3">
      {/* 🔴 LIVE RADAR PULSE FOR ALERTS */}
      <div className="relative flex h-2.5 w-2.5">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${type === "danger" ? "bg-red-400" : type === "warning" ? "bg-amber-400" : "bg-blue-400"}`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${type === "danger" ? "bg-red-500" : type === "warning" ? "bg-amber-500" : "bg-blue-500"}`}
        ></span>
      </div>
      <span className="text-[13px] font-bold text-slate-600">{title}</span>
    </div>
    <span
      className={`text-[15px] font-extrabold ${type === "danger" ? "text-red-600" : type === "warning" ? "text-amber-600" : "text-slate-800"}`}
    >
      {value}
    </span>
  </div>
);

// --- ⏳ 2. SKELETON LOADERS ---
const SkeletonKpi = () => (
  <div className="bg-gray-200 animate-pulse h-[104px] rounded-[16px] w-full"></div>
);
const SkeletonAlert = () => (
  <div className="bg-gray-200 animate-pulse h-[54px] rounded-[12px] w-full"></div>
);
const SkeletonChart = () => (
  <div className="bg-gray-200 animate-pulse h-[420px] rounded-[16px] w-full"></div>
);

export default function Dashboard() {
  const role = localStorage.getItem("user_role") || "USER";
  const username = localStorage.getItem("username") || "User";

  // States
  const [isManageUsersModalOpen, setManageUsersModalOpen] = useState(false);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "USER",
  });

  // 🔥 Page Global Loading State
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("month");
  const [usersList, setUsersList] = useState([]);

  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    openOrders: 0,
    completed: 0,
    revenue: 0,
  });

  const [erpPieData, setErpPieData] = useState([]);

  // Dummy Area Chart Data
  const [areaData] = useState([
    { name: "Apr", target: 40, sales: 50 },
    { name: "May", target: 100, sales: 80 },
    { name: "Jun", target: 300, sales: 50 },
    { name: "Jul", target: 220, sales: 150 },
    { name: "Aug", target: 500, sales: 280 },
    { name: "Sep", target: 250, sales: 300 },
    { name: "Oct", target: 400, sales: 320 },
    { name: "Nov", target: 230, sales: 230 },
    { name: "Dec", target: 480, sales: 380 },
  ]);

  const formatCurrencySimple = (num) => {
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num.toFixed(2)}`;
  };

  useEffect(() => {
    if (role === "ADMIN") fetchUsers();
    fetchLiveDashboardData();
  }, [role]);

  const fetchLiveDashboardData = async () => {
    try {
      const response = await api.get("reports/dashboard-stats/");
      const { kpis, pieData } = response.data;
      setDashboardStats(kpis);

      const colors = [
        "#ffffff",
        "#93c5fd",
        "rgba(255,255,255,0.4)",
        "#ff9900",
        "#1677ff",
      ];
      const formattedPieData = pieData.map((item, index) => ({
        ...item,
        color: colors[index % colors.length],
      }));
      setErpPieData(formattedPieData);
    } catch (error) {
      console.error("Failed to fetch live dashboard stats:", error);
    } finally {
      // Intentional slight delay to show off the premium skeleton loader feeling
      setTimeout(() => setIsPageLoading(false), 600);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("auth/users/");
      setUsersList(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("auth/create-user/", newUser);
      setAddUserModalOpen(false);
      setNewUser({ username: "", password: "", role: "USER" });
      fetchUsers();
    } catch (error) {
      alert("Error creating user");
      console.error(error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`auth/users/${id}/`);
        fetchUsers();
      } catch (error) {
        alert("Error deleting user");
        console.error(error);
      }
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto pb-10 overflow-hidden">
      {/* --- HEADER --- */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <p className="text-[12px] text-gray-400 font-bold tracking-widest uppercase mb-1">
            Overview / <span className="text-[#1677ff]">Live Engine</span>
          </p>
          <h1 className="text-[22px] font-bold text-slate-800">
             Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
            {["week", "month", "year"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-1.5 text-[12px] font-bold capitalize rounded-md transition-all ${timeframe === t ? "bg-slate-100 text-slate-800 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
              >
                This {t}
              </button>
            ))}
          </div>

          {role === "ADMIN" && (
            <button
              onClick={() => setManageUsersModalOpen(true)}
              className="text-[13px] font-bold text-white bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5"
            >
              <i className="fas fa-user-shield text-[14px]"></i> Access Control
            </button>
          )}
        </div>
      </div>

      {isPageLoading ? (
        // --- ⏳ SKELETON STATE ---
        <div className="space-y-6 opacity-80">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <SkeletonKpi />
            <SkeletonKpi />
            <SkeletonKpi />
            <SkeletonKpi />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <SkeletonAlert />
            <SkeletonAlert />
            <SkeletonAlert />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-4">
              <SkeletonChart />
            </div>
            <div className="xl:col-span-8">
              <SkeletonChart />
            </div>
          </div>
        </div>
      ) : (
        // --- 🚀 3. STAGGERED CASCADE ANIMATIONS ---
        <div className="space-y-6">
          {/* ROW 1: KPI CARDS (Delay 100ms) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
            <KpiCard
              title="Total Orders"
              value={dashboardStats.totalOrders}
              percentage="12"
              icon="fa-shopping-cart"
              colorClass="bg-gradient-to-br from-[#1677ff] to-[#6366f1] shadow-blue-500/30"
            />
            <KpiCard
              title="Open Pending"
              value={dashboardStats.openOrders}
              percentage="4"
              isPositive={false}
              icon="fa-box-open"
              colorClass="bg-gradient-to-br from-[#f59e0b] to-[#ed8936] shadow-amber-500/30"
            />
            <KpiCard
              title="Completed"
              value={dashboardStats.completed}
              percentage="20"
              icon="fa-check-double"
              colorClass="bg-gradient-to-br from-[#10b981] to-[#059669] shadow-emerald-500/30"
            />
            <KpiCard
              title="Gross Revenue"
              value={dashboardStats.revenue}
              isCurrency={true}
              percentage="8"
              icon="fa-wallet"
              colorClass="bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] shadow-purple-500/30"
            />
          </div>

          {/* ROW 2: MINI ALERTS (Delay 200ms) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
            <MiniAlertCard
              title="Pending Refunds (Value)"
              value="₹45,200"
              type="danger"
            />
            <MiniAlertCard
              title="Active Discrepancies"
              value="12 Items"
              type="warning"
            />
            <MiniAlertCard
              title="Un-synced GRPO"
              value="4 Entries"
              type="info"
            />
          </div>

          {/* ROW 3: CHARTS (Delay 300ms) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            {/* 🔥 4. MESH GRADIENT & GLASSMORPHISM PIE CHART */}
            <div className="bg-white p-6 rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 xl:col-span-4 flex flex-col justify-between min-h-[420px]">
              <div>
                <h3 className="text-[16px] font-extrabold text-slate-800">
                  Merchant Distribution
                </h3>
                <p className="text-[13px] text-gray-500 mt-1">
                  Live order volume split
                </p>
              </div>

              {/* Premium Mesh Background */}
              <div className="relative rounded-2xl h-[240px] my-5 overflow-hidden flex flex-col justify-center bg-slate-900 shadow-xl shadow-indigo-500/20">
                {/* Animated Glowing Orbs */}
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/40 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/40 rounded-full blur-3xl animate-pulse delay-700"></div>
                {/* Frosted Glass Overlay */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] z-0"></div>

                <div className="relative z-10 w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={
                          erpPieData.length > 0
                            ? erpPieData
                            : [{ name: "No Data", value: 1, color: "#ffffff" }]
                        }
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {erpPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrencySimple(value)}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          fontWeight: "bold",
                          fontSize: "12px",
                          color: "#000",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {erpPieData.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-sm"
                      style={{
                        backgroundColor:
                          item.name === "No Data" ? "#d1d5db" : item.color,
                      }}
                    ></span>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase leading-none mb-1 truncate max-w-[80px]">
                        {item.name.replace(" B2B", "")}
                      </p>
                      <p className="text-[14px] font-extrabold text-slate-700 leading-none">
                        {formatCurrencySimple(item.value)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DOUBLE AREA CHART */}
            <div className="bg-white p-6 rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 xl:col-span-8 flex flex-col min-h-[420px]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[16px] font-extrabold text-slate-800">
                    Revenue vs Target
                  </h3>
                  <p className="text-[13px] text-gray-500 mt-1">
                    Comparing actual sales against projected goals
                  </p>
                </div>
                <div className="flex gap-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                    <span className="w-3 h-1 bg-[#c084fc] rounded-full"></span>{" "}
                    Target
                  </div>
                  <div className="flex items-center gap-2 text-[12px] font-bold text-slate-600">
                    <span className="w-3 h-1 bg-[#1677ff] rounded-full shadow-[0_0_8px_#1677ff]"></span>{" "}
                    Actual
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full min-h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={areaData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorSales"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#1677ff"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#1677ff"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f2f5"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="target"
                      stroke="#c084fc"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      fill="transparent"
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#1677ff"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorSales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ROW 4: DATA TABLES & TIMELINE (Delay 400ms) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
            {/* TOP PERFORMING FIRMS (Col-span 7) */}
            <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 xl:col-span-7 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                <div>
                  <h3 className="text-[16px] font-extrabold text-slate-800">
                    Firm Performance
                  </h3>
                  <p className="text-[13px] text-gray-500 mt-1">
                    Live order fulfillment status
                  </p>
                </div>
                <button className="text-[12px] font-bold text-[#1677ff] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
                  View All Report
                </button>
              </div>

              <div className="overflow-x-auto w-full p-2">
                <table className="w-full text-left min-w-[500px]">
                  <thead className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 rounded-t-lg">
                    <tr>
                      <th className="p-4 pl-6">FIRM / MERCHANT</th>
                      <th className="p-4 text-center">REVENUE</th>
                      <th className="p-4 text-center">FULFILLMENT</th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] font-bold text-slate-700">
                    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                          <i className="fab fa-amazon text-[16px]"></i>
                        </div>
                        Shree Maa Amazon
                      </td>
                      <td className="p-4 text-center">₹14,50,000</td>
                      <td className="p-4 px-8">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-[#1677ff] h-2 rounded-full"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                          <i className="fas fa-store text-[14px]"></i>
                        </div>
                        JMD Flipkart
                      </td>
                      <td className="p-4 text-center">₹3,20,000</td>
                      <td className="p-4 px-8">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-[#f59e0b] h-2 rounded-full"
                            style={{ width: "45%" }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center">
                          <i className="fas fa-industry text-[14px]"></i>
                        </div>
                        Polyshri Bulk
                      </td>
                      <td className="p-4 text-center">₹8,90,000</td>
                      <td className="p-4 px-8">
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-[#10b981] h-2 rounded-full"
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SYSTEM ACTIVITY TIMELINE (Col-span 5) */}
            <div className="bg-white p-6 rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 xl:col-span-5 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-[16px] font-extrabold text-slate-800">
                    Action & Activity Log
                  </h3>
                  <p className="text-[13px] text-gray-500 mt-1">
                    Live server updates
                  </p>
                </div>
                {/* 🔴 5. LIVE RADAR PULSE PING */}
                <div className="relative flex h-2.5 w-2.5 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </div>
              </div>

              <div className="relative pl-3 space-y-7 flex-1 before:absolute before:inset-0 before:ml-[17px] before:h-full before:w-[2px] before:bg-gray-100/80 mt-2">
                <div className="relative flex items-start gap-4 group">
                  <div className="w-[14px] h-[14px] rounded-full border-[3px] border-[#10b981] bg-white z-10 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform"></div>
                  <div>
                    <p className="text-[13.5px] font-bold text-slate-700">
                      Bulk Orders Uploaded
                    </p>
                    <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                      Admin • 10:45 AM
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4 group">
                  <div className="w-[14px] h-[14px] rounded-full border-[3px] border-[#ef4444] bg-white z-10 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform"></div>
                  <div className="bg-red-50/50 p-3 rounded-lg border border-red-100 w-full hover:bg-red-50 transition-colors">
                    <p className="text-[13.5px] font-bold text-red-600">
                      Discrepancy Raised
                    </p>
                    <p className="text-[12px] text-red-400/80 font-medium mt-1">
                      Order #ORD-9934 reported short by 5 units.
                    </p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4 group">
                  <div className="w-[14px] h-[14px] rounded-full border-[3px] border-[#1677ff] bg-white z-10 flex-shrink-0 mt-0.5 group-hover:scale-125 transition-transform"></div>
                  <div>
                    <p className="text-[13.5px] font-bold text-slate-700">
                      SAP GRPO Synced
                    </p>
                    <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                      System • Yesterday
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MANAGE USERS MODAL ================= */}
      {isManageUsersModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                  Active Users List
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Manage system access and privileges
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setManageUsersModalOpen(false);
                    setAddUserModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 shadow-md transition flex items-center gap-2"
                >
                  <i className="fas fa-plus"></i> Add User
                </button>
                <button
                  onClick={() => setManageUsersModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-100 transition border border-gray-200"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="overflow-y-auto custom-scrollbar p-6 bg-slate-50/50 flex-1">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                      <th className="py-4 px-6">User ID</th>
                      <th className="py-4 px-6">Username</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Joined Date</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {usersList.map((u, index) => (
                      <tr
                        key={u.id || index}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="py-4 px-6 text-xs font-mono font-bold text-gray-400">
                          #{u.id}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                              {u.username
                                ? u.username.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            <span className="text-sm font-bold text-slate-700">
                              {u.username}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${u.role === "ADMIN" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}
                          >
                            {u.role || "USER"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-500 font-medium">
                          {u.date_joined
                            ? new Date(u.date_joined).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {u.username === username ? (
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded border border-gray-100 inline-block">
                              Current User
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-[11px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition flex items-center justify-end w-full gap-1.5"
                            >
                              <i className="fas fa-trash-alt"></i> Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {usersList.length === 0 && (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-8 text-center text-gray-400 text-sm font-medium"
                        >
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD USER MODAL ================= */}
      {isAddUserModalOpen && role === "ADMIN" && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add User</h2>
              <button
                onClick={() => setAddUserModalOpen(false)}
                className="text-gray-400 hover:text-gray-800"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                className="w-full p-2.5 bg-gray-50 rounded-xl outline-none"
                required
              />
              <input
                type="Password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full p-2.5 bg-gray-50 rounded-xl outline-none"
                required
              />
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="w-full p-2.5 bg-gray-50 rounded-xl outline-none"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button
                type="submit"
                className="w-full bg-[#1677ff] text-white py-2.5 rounded-xl font-bold"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}