// import React, { useState, useEffect } from "react";
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
// import api from "../api/axios";

// // --- REUSABLE KPI CARD ---
// const KpiCard = ({ title, value, subtext, subtextColor, icon }) => (
//   <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
//     <div className="flex justify-between items-start mb-2">
//       <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//         {title}
//       </h3>
//       <i className={`fas ${icon} text-slate-200 text-xl`}></i>
//     </div>
//     <div className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
//       {value}
//     </div>
//     <p className={`text-xs font-semibold ${subtextColor}`}>{subtext}</p>
//   </div>
// );

// export default function Dashboard() {
//   const role = localStorage.getItem("user_role") || "USER";
//   const username = localStorage.getItem("username") || "User";

//   // --- USER MANAGEMENT STATES ---
//   const [isManageUsersModalOpen, setManageUsersModalOpen] = useState(false);
//   const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
//   const [newUser, setNewUser] = useState({
//     username: "",
//     password: "",
//     role: "USER",
//   });
//   const [loading, setLoading] = useState(false);
//   const [usersList, setUsersList] = useState([]);

//   // --- LIVE DASHBOARD DATA STATES ---
//   const [dashboardStats, setDashboardStats] = useState({
//     totalOrders: 0,
//     revenue: 0,
//     pending: 0,
//   });

//   const [pieData, setPieData] = useState([
//     { name: "New", value: 400, color: "#f59e0b" },
//     { name: "Processing", value: 300, color: "#334155" },
//     { name: "Shipped", value: 300, color: "#0ea5e9" },
//     { name: "Delivered", value: 200, color: "#10b981" },
//   ]);

//   const [areaData, setAreaData] = useState([
//     { name: "Jun 28", revenue: 4000 },
//     { name: "Jun 29", revenue: 3000 },
//     { name: "Jun 30", revenue: 5500 },
//     { name: "Jul 1", revenue: 4500 },
//     { name: "Jul 2", revenue: 6000 },
//     { name: "Jul 3", revenue: 7500 },
//   ]);

//   useEffect(() => {
//     if (role === "ADMIN") {
//       fetchUsers();
//       fetchLiveDashboardData();
//     }
//   }, [role]);

//   const fetchUsers = async () => {
//     try {
//       const response = await api.get("auth/users/");
//       setUsersList(response.data);
//     } catch (error) {
//       console.error("Failed to fetch users", error);
//     }
//   };

//   const fetchLiveDashboardData = async () => {
//     try {
//       setDashboardStats({ totalOrders: 1240, revenue: "45.2 L", pending: 12 });
//     } catch (error) {
//       console.error("Failed to fetch live stats", error);
//     }
//   };

//   const handleCreateUser = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await api.post("auth/create-user/", newUser);
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
//     <div className="w-full max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-300">
//       {/* HEADER */}
//       <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
//         <div>
//           <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
//             Welcome back, {username}
//           </h1>
//           <p className="text-sm text-slate-500 font-medium mt-1">
//             Overview of today's operations
//           </p>
//         </div>
//         <span
//           className={`px-4 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase border ${
//             role === "ADMIN"
//               ? "bg-amber-50 text-amber-700 border-amber-200"
//               : "bg-slate-100 text-slate-700 border-slate-200"
//           }`}
//         >
//           <i
//             className={`fas ${role === "ADMIN" ? "fa-crown text-amber-500" : "fa-user"} mr-2`}
//           ></i>
//           {role} PRIVILEGES
//         </span>
//       </div>

//       {role === "ADMIN" && (
//         <>
//           {/* ROW 1: LIVE KPI CARDS & SYSTEM MANAGEMENT */}
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
//             <KpiCard
//               title="Total System Orders"
//               value={dashboardStats.totalOrders}
//               subtext="Live count"
//               subtextColor="text-slate-500"
//               icon="fa-box"
//             />
//             <KpiCard
//               title="Company Revenue"
//               value={`₹${dashboardStats.revenue}`}
//               subtext="Current Month"
//               subtextColor="text-emerald-600"
//               icon="fa-chart-line"
//             />
//             <KpiCard
//               title="Pending Tasks"
//               value={dashboardStats.pending}
//               subtext="Requires action"
//               subtextColor="text-red-500"
//               icon="fa-clock"
//             />

//             {/* CLEAN SYSTEM MANAGEMENT CARD (Replaced the 4th Active Users KPI) */}
//             <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
//               <div className="flex justify-between items-start mb-2">
//                 <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                   System Management
//                 </h3>
//                 <i className="fas fa-users-cog text-slate-200 text-xl group-hover:text-amber-400 transition-colors"></i>
//               </div>
//               <div className="flex items-baseline gap-2 mb-3">
//                 <span className="text-3xl font-bold text-slate-900 tracking-tight">
//                   {usersList.length}
//                 </span>
//                 <span className="text-xs font-semibold text-slate-500">
//                   Active Users
//                 </span>
//               </div>
//               <button
//                 onClick={() => setManageUsersModalOpen(true)}
//                 className="w-full py-2 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-gray-200 hover:border-amber-200"
//               >
//                 Open Console <i className="fas fa-arrow-right"></i>
//               </button>
//             </div>
//           </div>

//           {/* ROW 2: CHARTS */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//             {/* PIE CHART */}
//             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
//               <h3 className="text-sm font-bold text-slate-900 mb-1">
//                 Order Status
//               </h3>
//               <div className="flex-1 min-h-[250px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={pieData}
//                       innerRadius={55}
//                       outerRadius={85}
//                       paddingAngle={3}
//                       dataKey="value"
//                     >
//                       {pieData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       contentStyle={{
//                         borderRadius: "8px",
//                         border: "none",
//                         boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
//                       }}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* AREA CHART */}
//             <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2 flex flex-col">
//               <h3 className="text-sm font-bold text-slate-900 mb-1">
//                 Revenue Trend (₹)
//               </h3>
//               <div className="flex-1 min-h-[250px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart
//                     data={areaData}
//                     margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
//                   >
//                     <defs>
//                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
//                         <stop
//                           offset="5%"
//                           stopColor="#f59e0b"
//                           stopOpacity={0.3}
//                         />
//                         <stop
//                           offset="95%"
//                           stopColor="#f59e0b"
//                           stopOpacity={0}
//                         />
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid
//                       strokeDasharray="3 3"
//                       vertical={false}
//                       stroke="#f1f5f9"
//                     />
//                     <XAxis
//                       dataKey="name"
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fontSize: 10, fill: "#94a3b8" }}
//                       dy={10}
//                     />
//                     <YAxis
//                       axisLine={false}
//                       tickLine={false}
//                       tick={{ fontSize: 10, fill: "#94a3b8" }}
//                     />
//                     <Tooltip
//                       contentStyle={{
//                         borderRadius: "8px",
//                         border: "none",
//                         boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
//                       }}
//                     />
//                     <Area
//                       type="monotone"
//                       dataKey="revenue"
//                       stroke="#f59e0b"
//                       strokeWidth={3}
//                       fillOpacity={1}
//                       fill="url(#colorRev)"
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* --- MODALS LOGIC REMAINS SAME (Manage Users & Add User) --- */}
//       {isManageUsersModalOpen && role === "ADMIN" && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-4">
//             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-900 tracking-tight">
//                   Active Users List
//                 </h2>
//                 <p className="text-xs text-slate-500 font-medium mt-1">
//                   Manage system access and privileges
//                 </p>
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setAddUserModalOpen(true)}
//                   className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-md"
//                 >
//                   <i className="fas fa-plus mr-1"></i> Add User
//                 </button>
//                 <button
//                   onClick={() => setManageUsersModalOpen(false)}
//                   className="px-4 py-2 bg-gray-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             <div className="overflow-y-auto p-0 flex-1 bg-gray-50/50">
//               <table className="w-full text-left border-collapse">
//                 <thead className="bg-white sticky top-0 shadow-sm text-slate-400 text-[10px] tracking-widest uppercase font-bold z-10">
//                   <tr>
//                     <th className="px-6 py-4">User ID</th>
//                     <th className="px-6 py-4">Username</th>
//                     <th className="px-6 py-4">Role</th>
//                     <th className="px-6 py-4">Joined Date</th>
//                     <th className="px-6 py-4 text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100 text-sm">
//                   {usersList.map((u) => (
//                     <tr key={u.id} className="hover:bg-white transition-colors">
//                       <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">
//                         #{u.id}
//                       </td>
//                       <td className="px-6 py-4 font-medium text-slate-700 flex items-center gap-3">
//                         <div
//                           className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
//                             u.role === "ADMIN"
//                               ? "bg-amber-500 shadow-md shadow-amber-500/20"
//                               : "bg-slate-800"
//                           }`}
//                         >
//                           {u.username.charAt(0).toUpperCase()}
//                         </div>
//                         {u.username}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border ${
//                             u.role === "ADMIN"
//                               ? "bg-amber-50 text-amber-700 border-amber-200"
//                               : "bg-slate-100 text-slate-600 border-slate-200"
//                           }`}
//                         >
//                           {u.role}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-slate-500 font-medium">
//                         {new Date(u.date_joined).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 text-center">
//                         {u.username !== username ? (
//                           <button
//                             onClick={() => handleDeleteUser(u.id, u.username)}
//                             className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs flex items-center justify-center gap-1 mx-auto"
//                           >
//                             <i className="fas fa-trash-alt"></i> Delete
//                           </button>
//                         ) : (
//                           <span className="text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest">
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

//       {isAddUserModalOpen && role === "ADMIN" && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60]">
//           <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 animate-in zoom-in-95">
//             <div className="flex justify-between items-center mb-6">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-900 tracking-tight">
//                   Create Account
//                 </h2>
//                 <p className="text-xs text-slate-500 font-medium mt-1">
//                   Add a new user to the system
//                 </p>
//               </div>
//               <button
//                 onClick={() => setAddUserModalOpen(false)}
//                 className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>

//             <form onSubmit={handleCreateUser} className="space-y-5">
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={newUser.username}
//                   onChange={(e) =>
//                     setNewUser({ ...newUser, username: e.target.value })
//                   }
//                   className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-medium transition-all"
//                   placeholder="e.g. rohit_sales"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   required
//                   value={newUser.password}
//                   onChange={(e) =>
//                     setNewUser({ ...newUser, password: e.target.value })
//                   }
//                   className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-bold tracking-widest transition-all"
//                   placeholder="••••••••"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-widest">
//                   Assign Role
//                 </label>
//                 <select
//                   value={newUser.role}
//                   onChange={(e) =>
//                     setNewUser({ ...newUser, role: e.target.value })
//                   }
//                   className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-bold text-slate-700 transition-all cursor-pointer"
//                 >
//                   <option value="USER">Normal User</option>
//                   <option value="ADMIN">Administrator</option>
//                 </select>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white py-3.5 rounded-lg font-bold transition-colors mt-4 flex justify-center items-center gap-2 shadow-lg"
//               >
//                 {loading ? (
//                   <>
//                     <i className="fas fa-spinner fa-spin"></i> Creating...
//                   </>
//                 ) : (
//                   <>
//                     <i className="fas fa-check"></i> Create Account
//                   </>
//                 )}
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

// --- 🔥 SCREENSHOT-STYLE KPI CARD ---
const KpiCard = ({ title, value, subtext, subtextColor, borderLeftColor }) => (
  <div
    className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 border-l-[3px] ${borderLeftColor} flex flex-col justify-between hover:shadow-md transition-shadow`}
  >
    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
      {title}
    </h3>
    <div className="text-3xl font-medium text-slate-700 tracking-tight mb-2">
      {value}
    </div>
    <p className={`text-[11px] font-bold ${subtextColor}`}>{subtext}</p>
  </div>
);

export default function Dashboard() {
  const role = localStorage.getItem("user_role") || "USER";
  const username = localStorage.getItem("username") || "User";

  // --- USER MANAGEMENT STATES (Kept intact for your logic) ---
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
    totalOrders: 3,
    openOrders: 3,
    completed: 1,
    revenue: "15,974",
    openTickets: 3,
    pendingRefunds: 0,
  });

  // Matches exactly with your screenshot's Pie Chart colors (Amber & Teal/Slate)
  const [pieData, setPieData] = useState([
    { name: "Open", value: 75, color: "#f59e0b" }, // Amber
    { name: "Completed", value: 25, color: "#2d6a4f" }, // Dark Green/Teal
  ]);

  const [areaData, setAreaData] = useState([
    { name: "Jun 28", revenue: 4200 },
    { name: "Jun 29", revenue: 3800 },
    { name: "Jun 30", revenue: 5200 },
    { name: "Jul 1", revenue: 6200 },
    { name: "Jul 2", revenue: 4900 },
    { name: "Jul 3", revenue: 7100 },
    { name: "Jul 4", revenue: 5300 },
  ]);

  useEffect(() => {
    if (role === "ADMIN") {
      fetchUsers();
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
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in zoom-in-95 duration-300 pb-10">
      {/* --- HEADER --- */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Overview of today's operations
          </p>
        </div>

        {/* Hidden button to open user management (Kept for admin utility) */}
        {role === "ADMIN" && (
          <button
            onClick={() => setManageUsersModalOpen(true)}
            className="text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm"
          >
            <i className="fas fa-users-cog mr-2"></i> Manage Users
          </button>
        )}
      </div>

      {/* --- ROW 1: 6 KPI CARDS (Exactly like screenshot) --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard
          title="Total Orders"
          value={dashboardStats.totalOrders}
          subtext="4 line items"
          subtextColor="text-emerald-600"
          borderLeftColor="border-amber-400"
        />
        <KpiCard
          title="Open Orders"
          value={dashboardStats.openOrders}
          subtext="3 awaiting action"
          subtextColor="text-red-500"
          borderLeftColor="border-red-500"
        />
        <KpiCard
          title="Completed"
          value={dashboardStats.completed}
          subtext="Marked complete"
          subtextColor="text-emerald-600"
          borderLeftColor="border-amber-400"
        />
        <KpiCard
          title="Revenue (₹)"
          value={dashboardStats.revenue}
          subtext="+8% vs last week"
          subtextColor="text-emerald-600"
          borderLeftColor="border-amber-400"
        />
        <KpiCard
          title="Open Tickets"
          value={dashboardStats.openTickets}
          subtext="Needs attention"
          subtextColor="text-red-500"
          borderLeftColor="border-amber-400"
        />
        <KpiCard
          title="Pending Refunds"
          value={dashboardStats.pendingRefunds}
          subtext="Awaiting approval"
          subtextColor="text-emerald-600"
          borderLeftColor="border-emerald-500"
        />
      </div>

      {/* --- ROW 2: CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* PIE CHART */}
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-[13px] font-medium text-slate-700">
            Order status breakdown
          </h3>
          <p className="text-[11px] text-slate-400 font-medium mb-4 mt-0.5">
            Current distribution across all order line items
          </p>

          <div className="flex-1 min-h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
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

          {/* Custom Legend */}
          <div className="flex justify-center gap-4 text-[10px] font-bold text-slate-500 uppercase">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-amber-500 block"></span> Open
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#2d6a4f] block"></span> Completed
            </div>
          </div>
        </div>

        {/* AREA CHART */}
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm lg:col-span-2 flex flex-col">
          <h3 className="text-[13px] font-medium text-slate-700">
            Revenue trend
          </h3>
          <p className="text-[11px] text-slate-400 font-medium mb-4 mt-0.5">
            Last 7 days (₹)
          </p>

          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={areaData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
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
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- ROW 3: RECENT ORDERS & QUICK ACTIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* RECENT ORDERS LIST */}
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="text-[13px] font-medium text-slate-700">
            Recent orders
          </h3>
          <p className="text-[11px] text-slate-400 font-medium mb-5 mt-0.5">
            Latest activity across the console
          </p>

          <div className="space-y-4">
            {/* Dummy Order 1 */}
            <div className="border-b border-gray-50 pb-4">
              <p className="text-xs font-bold text-slate-700 mb-1.5">
                <span className="text-amber-500 mr-1.5">•</span>
                ORD - 1001 — Amazon (POCO C75 SILVER 4GBRAM+64GBROM) for ₹1598
              </p>
              <div className="flex items-center gap-2 pl-3 text-[10px] font-bold text-slate-400">
                <span>2026-07-01</span>
                <span>•</span>
                <span className="text-amber-500">● Open</span>
              </div>
            </div>

            {/* Dummy Order 2 */}
            <div className="border-b border-gray-50 pb-4">
              <p className="text-xs font-bold text-slate-700 mb-1.5">
                <span className="text-amber-500 mr-1.5">•</span>
                ORD - 1001 — Amazon (REALME 9O LITE 5G BLUE 8GBRAM+128GBROM) for
                ₹499
              </p>
              <div className="flex items-center gap-2 pl-3 text-[10px] font-bold text-slate-400">
                <span>2026-07-01</span>
                <span>•</span>
                <span className="text-amber-500">● Open</span>
              </div>
            </div>

            {/* Dummy Order 3 */}
            <div className="border-b border-gray-50 pb-4">
              <p className="text-xs font-bold text-slate-700 mb-1.5">
                <span className="text-emerald-500 mr-1.5">•</span>
                ORD - 1002 — Flipkart (MOTO G57 5G BLACK 8GBRAM+128GBROM) for
                ₹11480
              </p>
              <div className="flex items-center gap-2 pl-3 text-[10px] font-bold text-slate-400">
                <span>2026-07-02</span>
                <span>•</span>
                <span className="text-emerald-500">● Completed</span>
              </div>
            </div>

            {/* Dummy Order 4 */}
            <div>
              <p className="text-xs font-bold text-slate-700 mb-1.5">
                <span className="text-amber-500 mr-1.5">•</span>
                ORD - 1003 — JMD (POCO C75 SILVER 4GBRAM+64GBROM) for ₹2397
              </p>
              <div className="flex items-center gap-2 pl-3 text-[10px] font-bold text-slate-400">
                <span>2026-07-03</span>
                <span>•</span>
                <span className="text-amber-500">● Open</span>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS CARD */}
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-[13px] font-medium text-slate-700">
            Quick actions
          </h3>
          <p className="text-[11px] text-slate-400 font-medium mb-4 mt-0.5">
            Jump straight into a task
          </p>

          <div className="flex-1 bg-[#1a2332] rounded-xl flex items-center justify-center relative cursor-pointer hover:bg-slate-800 transition-colors min-h-[220px] group overflow-hidden shadow-inner">
            <span className="text-white text-[180px] font-extralight leading-none mt-[-40px] group-hover:scale-110 transition-transform duration-300 opacity-90">
              +
            </span>
            <div className="absolute bottom-5 right-5 text-right">
              <span className="text-white text-sm font-bold leading-tight block">
                Create
              </span>
              <span className="text-white text-sm font-bold leading-tight block">
                Order
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS LOGIC KEEPS RUNNING IN THE BACKGROUND FOR ADMIN --- */}
      {/* ... Aapka purana isManageUsersModalOpen aur isAddUserModalOpen ka code yahan ekdum safe hai ... */}

      {isManageUsersModalOpen && role === "ADMIN" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
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
                <thead className="bg-white sticky top-0 shadow-sm text-slate-400 text-[10px] tracking-widest uppercase font-bold z-10">
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
                      <td className="px-6 py-4 font-medium text-slate-700 flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${u.role === "ADMIN" ? "bg-amber-500 shadow-md shadow-amber-500/20" : "bg-slate-800"}`}
                        >
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        {u.username}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border ${u.role === "ADMIN" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}
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
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
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
                  className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-sm font-bold tracking-widest transition-all"
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