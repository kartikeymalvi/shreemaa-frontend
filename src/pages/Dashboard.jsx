// import React, { useState, useEffect } from "react";
// import api from "../api/axios";

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

//   useEffect(() => {
//     if (role === "ADMIN") fetchUsers();
//   }, [role]);

//   const fetchUsers = async () => {
//     try {
//       const response = await api.get("auth/users/");
//       setUsersList(response.data);
//     } catch (error) {
//       console.error("Failed to fetch users", error);
//     }
//   };

//   const handleCreateUser = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.post("auth/create-user/", newUser);
//       alert(`Account created successfully!`);
//       setAddUserModalOpen(false);
//       setNewUser({ username: "", password: "", role: "USER" });
//       fetchUsers();
//     } catch (error) {
//       alert(
//         "Error: " + (error.response?.data?.error || "Could not create user."),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteUser = async (id, name) => {
//     if (
//       window.confirm(
//         `Are you sure you want to permanently delete user '${name}'?`,
//       )
//     ) {
//       try {
//         await api.delete(`auth/users/${id}/`);
//         alert("User deleted successfully.");
//         fetchUsers();
//       } catch (error) {
//         alert(
//           "Error: " +
//             (error.response?.data?.detail || "Could not delete user."),
//         );
//       }
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-800">
//             Welcome, {username}!
//           </h1>
//           <div className="text-sm text-gray-500 mt-1">
//             Home &gt; {role} Dashboard
//           </div>
//         </div>
//         <span
//           className={`px-4 py-1.5 rounded-full text-xs font-bold ${role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
//         >
//           {role} PRIVILEGES
//         </span>
//       </div>

//       {role === "ADMIN" && (
//         <div className="space-y-6 animate-in fade-in duration-300">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500 flex flex-col justify-center">
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
//                 Total System Orders
//               </p>
//               <p className="text-3xl font-black text-gray-800 mt-2">1,240</p>
//             </div>
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-emerald-500 flex flex-col justify-center">
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
//                 Company Revenue
//               </p>
//               <p className="text-3xl font-black text-emerald-600 mt-2">
//                 ₹45.2 L
//               </p>
//             </div>
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-orange-500 flex flex-col justify-center">
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
//                 Active Users
//               </p>
//               <p className="text-3xl font-black text-orange-500 mt-2">
//                 {usersList.length}
//               </p>
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-bold text-gray-800">
//                 System Management
//               </h3>
//               <p className="text-sm text-gray-500">
//                 Manage user roles, accounts, and system access.
//               </p>
//             </div>
//             <button
//               onClick={() => setManageUsersModalOpen(true)}
//               className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
//             >
//               <i className="fas fa-users-cog mr-2"></i> Manage Users
//             </button>
//           </div>
//         </div>
//       )}

//       {role !== "ADMIN" && (
//         <div className="space-y-6 animate-in fade-in duration-300">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500 flex flex-col justify-center">
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
//                 Your Assigned Orders
//               </p>
//               <p className="text-3xl font-black text-gray-800 mt-2">45</p>
//             </div>
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-purple-500 flex flex-col justify-center">
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
//                 System Status
//               </p>
//               <p className="text-lg font-bold text-emerald-600 mt-2">
//                 All systems operational
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL 1: MANAGE USERS TABLE --- */}
//       {isManageUsersModalOpen && role === "ADMIN" && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
//             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
//               <h2 className="text-xl font-bold text-gray-800">
//                 <i className="fas fa-users mr-2 text-blue-600"></i> Active Users
//                 List
//               </h2>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setAddUserModalOpen(true)}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700"
//                 >
//                   + Add User
//                 </button>
//                 <button
//                   onClick={() => setManageUsersModalOpen(false)}
//                   className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             <div className="overflow-y-auto p-0 flex-1">
//               <table className="w-full text-left">
//                 <thead className="bg-white sticky top-0 shadow-sm text-gray-500 text-xs uppercase font-bold">
//                   <tr>
//                     <th className="px-6 py-4">S.NO</th>
//                     <th className="px-6 py-4">Username</th>
//                     <th className="px-6 py-4">Role</th>
//                     <th className="px-6 py-4">Joined Date</th>
//                     <th className="px-6 py-4 text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100 text-sm">
//                   {usersList.map((u) => (
//                     <tr key={u.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 font-mono text-gray-500">
//                         #{u.id}
//                       </td>
//                       <td className="px-6 py-4 font-bold text-gray-800 flex items-center gap-3">
//                         <div
//                           className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${u.role === "ADMIN" ? "bg-purple-500" : "bg-blue-500"}`}
//                         >
//                           {u.username.charAt(0).toUpperCase()}
//                         </div>
//                         {u.username}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-2.5 py-1 rounded-md text-xs font-bold ${u.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
//                         >
//                           {u.role}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-gray-500">
//                         {new Date(u.date_joined).toLocaleDateString()}
//                       </td>

//                       {/* --- FIX: SELF DELETE PROTECTION --- */}
//                       <td className="px-6 py-4 text-center">
//                         {u.username !== username ? (
//                           <button
//                             onClick={() => handleDeleteUser(u.id, u.username)}
//                             className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition-colors font-bold"
//                           >
//                             <i className="fas fa-trash-alt mr-1"></i> Delete
//                           </button>
//                         ) : (
//                           <span className="text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide">
//                             Current User
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL 2: ADD NEW USER FORM --- */}
//       {isAddUserModalOpen && role === "ADMIN" && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 animate-in zoom-in-95">
//             <div className="flex justify-between items-center mb-5 border-b pb-3">
//               <h2 className="text-lg font-bold text-gray-800">
//                 Create New Account
//               </h2>
//               <button
//                 onClick={() => setAddUserModalOpen(false)}
//                 className="text-gray-400 hover:text-red-500"
//               >
//                 <i className="fas fa-times text-lg"></i>
//               </button>
//             </div>

//             <form onSubmit={handleCreateUser} className="space-y-4">
//               <div>
//                 <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={newUser.username}
//                   onChange={(e) =>
//                     setNewUser({ ...newUser, username: e.target.value })
//                   }
//                   className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   required
//                   value={newUser.password}
//                   onChange={(e) =>
//                     setNewUser({ ...newUser, password: e.target.value })
//                   }
//                   className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
//                   Assign Role
//                 </label>
//                 <select
//                   value={newUser.role}
//                   onChange={(e) =>
//                     setNewUser({ ...newUser, role: e.target.value })
//                   }
//                   className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold"
//                 >
//                   <option value="USER">Normal User</option>
//                   <option value="ADMIN">Administrator</option>
//                 </select>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-all mt-2 disabled:bg-gray-400"
//               >
//                 {loading ? "Creating..." : "Create Account"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// // --- DUMMY DATA FOR CHARTS ---
// const pieData = [
//   { name: "New", value: 400, color: "#f59e0b" }, // Amber
//   { name: "Processing", value: 300, color: "#3b82f6" }, // Blue
//   { name: "Shipped", value: 300, color: "#14b8a6" }, // Teal
//   { name: "Delivered", value: 200, color: "#10b981" }, // Emerald
// ];

// const areaData = [
//   { name: "Jun 28", revenue: 4000 },
//   { name: "Jun 29", revenue: 3000 },
//   { name: "Jun 30", revenue: 5500 },
//   { name: "Jul 1", revenue: 4500 },
//   { name: "Jul 2", revenue: 6000 },
//   { name: "Jul 3", revenue: 7500 },
//   { name: "Jul 4", revenue: 5000 },
// ];

// // --- REUSABLE KPI CARD COMPONENT ---
// // Professional development me hum aisi choti cheezon ka component bana lete hain taaki code clean rahe
// const KpiCard = ({ title, value, subtext, subtextColor }) => (
//   <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
//     <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
//       {title}
//     </h3>
//     <div className="text-3xl font-black text-slate-900 tracking-tight mb-2">
//       {value}
//     </div>
//     <p className={`text-xs font-semibold ${subtextColor}`}>{subtext}</p>
//   </div>
// );

// export default function Dashboard() {
//   return (
//     <div className="w-full max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-300">
//       {/* HEADER SECTION */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
//           Dashboard
//         </h1>
//         <p className="text-sm text-slate-500 font-medium mt-1">
//           Overview of today's operations
//         </p>
//       </div>

//       {/* ROW 1: KPI CARDS (Responsive Grid) */}
//       {/* Mobile: 1 col, Tablet: 3 cols, Desktop: 5 cols */}
//       <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
//         <KpiCard
//           title="Total Orders"
//           value="5"
//           subtext="+12% vs last week"
//           subtextColor="text-emerald-600"
//         />
//         <KpiCard
//           title="Pending Orders"
//           value="2"
//           subtext="2 awaiting action"
//           subtextColor="text-amber-600"
//         />
//         <KpiCard
//           title="Delivered"
//           value="1"
//           subtext="On-time rate 94%"
//           subtextColor="text-emerald-600"
//         />
//         <KpiCard
//           title="Revenue (₹)"
//           value="3,594"
//           subtext="+8% vs last week"
//           subtextColor="text-emerald-600"
//         />
//         <KpiCard
//           title="Open Tickets"
//           value="3"
//           subtext="Needs attention"
//           subtextColor="text-red-500"
//         />
//       </div>

//       {/* ROW 2: CHARTS SECTION */}
//       {/* Mobile: 1 col, Desktop: 2 cols */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         {/* PIE CHART CARD */}
//         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//           <h3 className="text-sm font-bold text-slate-900 mb-1">
//             Order status breakdown
//           </h3>
//           <p className="text-xs text-slate-500 mb-6">
//             Current distribution across all orders
//           </p>
//           <div className="h-64 w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={pieData}
//                   innerRadius={60}
//                   outerRadius={90}
//                   paddingAngle={2}
//                   dataKey="value"
//                 >
//                   {pieData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//           {/* Custom Legend */}
//           <div className="flex flex-wrap justify-center gap-4 mt-2">
//             {pieData.map((item) => (
//               <div
//                 key={item.name}
//                 className="flex items-center gap-1.5 text-xs font-semibold text-slate-600"
//               >
//                 <div
//                   className="w-2.5 h-2.5 rounded-full"
//                   style={{ backgroundColor: item.color }}
//                 ></div>
//                 {item.name}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* AREA CHART CARD */}
//         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//           <h3 className="text-sm font-bold text-slate-900 mb-1">
//             Revenue trend
//           </h3>
//           <p className="text-xs text-slate-500 mb-6">Last 7 days (₹)</p>
//           <div className="h-72 w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart
//                 data={areaData}
//                 margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
//               >
//                 <defs>
//                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   vertical={false}
//                   stroke="#f1f5f9"
//                 />
//                 <XAxis
//                   dataKey="name"
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fontSize: 10, fill: "#94a3b8" }}
//                   dy={10}
//                 />
//                 <YAxis
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fontSize: 10, fill: "#94a3b8" }}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     borderRadius: "8px",
//                     border: "none",
//                     boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
//                   }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#f59e0b"
//                   strokeWidth={3}
//                   fillOpacity={1}
//                   fill="url(#colorRev)"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* ROW 3: BOTTOM SECTION (Lists & Actions) */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* RECENT ORDERS LIST */}
//         <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//           <h3 className="text-sm font-bold text-slate-900 mb-1">
//             Recent orders
//           </h3>
//           <p className="text-xs text-slate-500 mb-6">
//             Latest activity across the console
//           </p>

//           <div className="space-y-5">
//             {/* Single Order Item */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
//               <div className="flex items-start gap-3">
//                 <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500"></div>
//                 <div>
//                   <p className="text-sm text-slate-800 font-medium">
//                     <span className="font-bold text-slate-900">ORD-1001</span> —
//                     Aarav Mehta placed an order for ₹1598
//                   </p>
//                   <p className="text-xs text-slate-400 font-semibold mt-0.5">
//                     2026-07-01
//                   </p>
//                 </div>
//               </div>
//               <span className="w-max inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-emerald-50 text-emerald-700 border border-dashed border-emerald-300">
//                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>{" "}
//                 Delivered
//               </span>
//             </div>

//             {/* Single Order Item */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
//               <div className="flex items-start gap-3">
//                 <div className="mt-1 w-2 h-2 rounded-full bg-amber-500"></div>
//                 <div>
//                   <p className="text-sm text-slate-800 font-medium">
//                     <span className="font-bold text-slate-900">ORD-1004</span> —
//                     Priya Nair placed an order for ₹499
//                   </p>
//                   <p className="text-xs text-slate-400 font-semibold mt-0.5">
//                     2026-07-02
//                   </p>
//                 </div>
//               </div>
//               <span className="w-max inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase bg-amber-50 text-amber-700 border border-dashed border-amber-300">
//                 <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>{" "}
//                 Processing
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* QUICK ACTIONS */}
//         <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
//           <h3 className="text-sm font-bold text-slate-900 mb-1">
//             Quick actions
//           </h3>
//           <p className="text-xs text-slate-500 mb-6">
//             Jump straight into a task
//           </p>

//           <button className="flex-1 bg-slate-900 hover:bg-slate-800 transition-colors rounded-xl flex items-center justify-center p-8 group relative overflow-hidden">
//             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
//             <div className="flex flex-col items-center gap-4 z-10">
//               <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
//                 <i className="fas fa-plus text-2xl text-white"></i>
//               </div>
//               <span className="text-white font-bold tracking-wider">
//                 Create Order
//               </span>
//             </div>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../api/axios";

// --- REUSABLE KPI CARD ---
const KpiCard = ({ title, value, subtext, subtextColor, icon }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        {title}
      </h3>
      <i className={`fas ${icon} text-slate-200 text-xl`}></i>
    </div>
    <div className="text-3xl font-black text-slate-900 tracking-tight mb-2">
      {value}
    </div>
    <p className={`text-xs font-semibold ${subtextColor}`}>{subtext}</p>
  </div>
);

export default function Dashboard() {
  const role = localStorage.getItem("user_role") || "USER";
  const username = localStorage.getItem("username") || "User";

  // --- USER MANAGEMENT STATES ---
  const [isManageUsersModalOpen, setManageUsersModalOpen] = useState(false);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);

  // --- LIVE DASHBOARD DATA STATES ---
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    revenue: 0,
    pending: 0,
  });

  const [pieData, setPieData] = useState([
    { name: "New", value: 400, color: "#f59e0b" },
    { name: "Processing", value: 300, color: "#334155" },
    { name: "Shipped", value: 300, color: "#0ea5e9" },
    { name: "Delivered", value: 200, color: "#10b981" },
  ]);

  const [areaData, setAreaData] = useState([
    { name: "Jun 28", revenue: 4000 },
    { name: "Jun 29", revenue: 3000 },
    { name: "Jun 30", revenue: 5500 },
    { name: "Jul 1", revenue: 4500 },
    { name: "Jul 2", revenue: 6000 },
    { name: "Jul 3", revenue: 7500 },
  ]);

  useEffect(() => {
    if (role === "ADMIN") {
      fetchUsers();
      fetchLiveDashboardData();
    }
  }, [role]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("auth/users/");
      setUsersList(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const fetchLiveDashboardData = async () => {
    try {
      setDashboardStats({ totalOrders: 1240, revenue: "45.2 L", pending: 12 });
    } catch (error) {
      console.error("Failed to fetch live stats", error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("auth/create-user/", newUser);
      setAddUserModalOpen(false);
      setNewUser({ username: "", password: "", role: "USER" });
      fetchUsers();
    } catch (error) {
      alert(
        "Error: " + (error.response?.data?.error || "Could not create user."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete user '${name}'?`,
      )
    ) {
      try {
        await api.delete(`auth/users/${id}/`);
        fetchUsers();
      } catch (error) {
        alert(
          "Error: " +
            (error.response?.data?.detail || "Could not delete user."),
        );
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-300">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {username}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Overview of today's operations
          </p>
        </div>
        <span
          className={`px-4 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase border ${
            role === "ADMIN"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-slate-100 text-slate-700 border-slate-200"
          }`}
        >
          <i
            className={`fas ${role === "ADMIN" ? "fa-crown text-amber-500" : "fa-user"} mr-2`}
          ></i>
          {role} PRIVILEGES
        </span>
      </div>

      {role === "ADMIN" && (
        <>
          {/* ROW 1: LIVE KPI CARDS & SYSTEM MANAGEMENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <KpiCard
              title="Total System Orders"
              value={dashboardStats.totalOrders}
              subtext="Live count"
              subtextColor="text-slate-500"
              icon="fa-box"
            />
            <KpiCard
              title="Company Revenue"
              value={`₹${dashboardStats.revenue}`}
              subtext="Current Month"
              subtextColor="text-emerald-600"
              icon="fa-chart-line"
            />
            <KpiCard
              title="Pending Tasks"
              value={dashboardStats.pending}
              subtext="Requires action"
              subtextColor="text-red-500"
              icon="fa-clock"
            />

            {/* CLEAN SYSTEM MANAGEMENT CARD (Replaced the 4th Active Users KPI) */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  System Management
                </h3>
                <i className="fas fa-users-cog text-slate-200 text-xl group-hover:text-amber-400 transition-colors"></i>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  {usersList.length}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Active Users
                </span>
              </div>
              <button
                onClick={() => setManageUsersModalOpen(true)}
                className="w-full py-2 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-gray-200 hover:border-amber-200"
              >
                Open Console <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>

          {/* ROW 2: CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* PIE CHART */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Order Status
              </h3>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AREA CHART */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2 flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Revenue Trend (₹)
              </h3>
              <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={areaData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#f59e0b"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#f59e0b"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- MODALS LOGIC REMAINS SAME (Manage Users & Add User) --- */}
      {isManageUsersModalOpen && role === "ADMIN" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Active Users List
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Manage system access and privileges
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setAddUserModalOpen(true)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-md"
                >
                  <i className="fas fa-plus mr-1"></i> Add User
                </button>
                <button
                  onClick={() => setManageUsersModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-0 flex-1 bg-gray-50/50">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white sticky top-0 shadow-sm text-slate-400 text-[10px] tracking-widest uppercase font-black z-10">
                  <tr>
                    <th className="px-6 py-4">User ID</th>
                    <th className="px-6 py-4">Username</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-white transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">
                        #{u.id}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            u.role === "ADMIN"
                              ? "bg-amber-500 shadow-md shadow-amber-500/20"
                              : "bg-slate-800"
                          }`}
                        >
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        {u.username}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border ${
                            u.role === "ADMIN"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {new Date(u.date_joined).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {u.username !== username ? (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.username)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs flex items-center justify-center gap-1 mx-auto"
                          >
                            <i className="fas fa-trash-alt"></i> Delete
                          </button>
                        ) : (
                          <span className="text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                            Current User
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {isAddUserModalOpen && role === "ADMIN" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Create Account
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Add a new user to the system
                </p>
              </div>
              <button
                onClick={() => setAddUserModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium transition-all"
                  placeholder="e.g. rohit_sales"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-black tracking-widest transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">
                  Assign Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-bold text-slate-700 transition-all cursor-pointer"
                >
                  <option value="USER">Normal User</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white py-3.5 rounded-lg font-bold transition-colors mt-4 flex justify-center items-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Creating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i> Create Account
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}