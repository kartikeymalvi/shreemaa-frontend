// import React, { useState, useEffect } from "react";
// import api from "../api/axios";

// export default function OrdersReport() {
//   const [orders, setOrders] = useState([]);
//   const [isUploadModalOpen, setUploadModalOpen] = useState(false);
//   const [isFormModalOpen, setFormModalOpen] = useState(false);
//   const [isViewModalOpen, setViewModalOpen] = useState(false);
//   const [isFilterModalOpen, setFilterModalOpen] = useState(false);

//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [editId, setEditId] = useState(null);

//   // --- DYNAMIC MASTER STATES (Ab ye sahi jagah par hain) ---
//   const [masterFirms, setMasterFirms] = useState([]);
//   const [masterLocations, setMasterLocations] = useState([]);
//   const [masterMerchants, setMasterMerchants] = useState([]);

//   const role = localStorage.getItem("user_role") || "USER";

//   const initialFormState = {
//     order_id: "",
//     txn_date: "",
//     month: "",
//     day: "",
//     txn_detail: "",
//     merchant: "",
//     merchant_id: "",
//     firm: "",
//     location: "",
//     asin_fsn: "",
//     model_name: "",
//     model_no: "",
//     order_status: "Delivered",
//     order_qty: 1,
//     order_amount: 0.0,
//     unit_price: 0.0,
//     payment_amount: 0.0,
//     card_offer: 0.0,
//   };

//   const [formData, setFormData] = useState(initialFormState);

//   const [filters, setFilters] = useState({
//     txn_date: "",
//     firm: "",
//     location: "",
//     model_no: "",
//     txn_detail: "",
//     order_status: "",
//   });

//   const [viewSettings, setViewSettings] = useState({
//     show_order_id: true,
//     show_txn_date: true,
//     show_month: true,
//     show_day: true,
//     show_txn_detail: true,
//     show_merchant: true,
//     show_merchant_id: true,
//     show_firm: true,
//     show_location: true,
//     show_asin_fsn: true,
//     show_model_name: true,
//     show_model_no: true,
//     show_order_status: true,
//     show_order_qty: true,
//     show_order_amount: true,
//     show_unit_price: true,
//     show_payment_amount: true,
//     show_card_offer: true,
//   });

//   // --- FETCH MASTER DATA ONLY ONCE ON LOAD ---
//   useEffect(() => {
//     const fetchMasters = async () => {
//       try {
//         const fRes = await api.get("reports/firms/");
//         setMasterFirms(fRes.data);
//         const lRes = await api.get("reports/locations/");
//         setMasterLocations(lRes.data);
//         const mRes = await api.get("reports/merchants/");
//         setMasterMerchants(mRes.data);
//       } catch (error) {
//         console.error("Master data fetch error:", error);
//       }
//     };
//     fetchMasters();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const queryParams = new URLSearchParams(
//         Object.entries(filters).filter(([_, value]) => value !== ""),
//       ).toString();

//       const [ordersRes, settingsRes] = await Promise.all([
//         api.get(`reports/orders/?${queryParams}`),
//         api.get("reports/column-policy/"),
//       ]);
//       setOrders(ordersRes.data);
//       if (settingsRes.data) setViewSettings(settingsRes.data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filters]);

//   // --- AUTO CALCULATION & INPUT HANDLER (Without bugs) ---
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     let newFormData = { ...formData, [name]: value };

//     if (name === "txn_date" && value) {
//       const dateObj = new Date(value);
//       const days = [
//         "Sunday",
//         "Monday",
//         "Tuesday",
//         "Wednesday",
//         "Thursday",
//         "Friday",
//         "Saturday",
//       ];
//       const months = [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//         "August",
//         "September",
//         "October",
//         "November",
//         "December",
//       ];

//       newFormData.day = days[dateObj.getDay()];
//       newFormData.month = months[dateObj.getMonth()];
//     }

//     const amt = name === "order_amount" ? value : newFormData.order_amount;
//     const qty = name === "order_qty" ? value : newFormData.order_qty;
//     const pay = name === "payment_amount" ? value : newFormData.payment_amount;

//     if (amt && qty && Number(qty) > 0) {
//       newFormData.unit_price = (Number(amt) / Number(qty)).toFixed(2);
//     } else {
//       newFormData.unit_price = 0;
//     }

//     if (pay && amt) {
//       newFormData.card_offer = Math.abs(Number(amt) - Number(pay)).toFixed(2);
//     } else {
//       newFormData.card_offer = 0;
//     }

//     setFormData(newFormData);
//   };

//   const handleEditClick = (order) => {
//     setFormData(order);
//     setEditId(order.id);
//     setEditMode(true);
//     setFormModalOpen(true);
//   };

//   const handleViewClick = (orderId) => {
//     alert(`View logic pending for Order ID: ${orderId}. Will be built later!`);
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       if (editMode) {
//         await api.put(`reports/orders/${editId}/`, formData);
//         alert("Record updated successfully!");
//       } else {
//         await api.post("reports/orders/", formData);
//         alert("Record saved! MySQL Database Updated.");
//       }
//       setFormModalOpen(false);
//       setFormData(initialFormState);
//       setEditMode(false);
//       fetchData();
//     } catch (error) {
//       alert("Error: Order ID duplicate ho sakti hai ya data galat hai.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Delete this permanent record?")) {
//       try {
//         await api.delete(`reports/orders/${id}/`);
//         fetchData();
//       } catch (error) {
//         alert("Access Denied.");
//       }
//     }
//   };

//   const handleSaveViewSettings = async () => {
//     try {
//       await api.put("reports/column-policy/", viewSettings);
//       alert("User View Configuration Updated!");
//       setViewModalOpen(false);
//     } catch (error) {
//       alert("Failed to save view settings.");
//     }
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       txn_date: "",
//       firm: "",
//       location: "",
//       model_no: "",
//       txn_detail: "",
//       order_status: "",
//     });
//     setFilterModalOpen(false);
//   };

//   const showCol = (colName) =>
//     role === "ADMIN" || viewSettings[colName] === true;

//   const handleFileChange = (e) => {
//     if (e.target.files.length > 0) setFile(e.target.files[0]);
//   };
//   const handleUploadSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return;
//     const data = new FormData();
//     data.append("file", file);
//     setLoading(true);
//     try {
//       await api.post("reports/orders/upload/", data);
//       alert("Excel Uploaded!");
//       setUploadModalOpen(false);
//       setFile(null);
//       fetchData();
//     } catch (error) {
//       alert("Upload Failed: " + (error.response?.data?.error || "Unknown Error"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-[#f8fafc] min-h-screen font-sans pb-10">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
//             Orders Report
//           </h1>
//           <p className="text-xs text-slate-500 mt-1">
//             Manage, filter, and track business shipments
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={() => setFilterModalOpen(true)}
//             className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition flex items-center"
//           >
//             <i className="fas fa-filter mr-2 text-indigo-500"></i> Filter Data
//             {Object.values(filters).some((x) => x !== "") && (
//               <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
//             )}
//           </button>

//           {role === "ADMIN" && (
//             <button
//               onClick={() => setViewModalOpen(true)}
//               className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition flex items-center"
//             >
//               <i className="fas fa-eye-slash mr-2 text-purple-600"></i> Manage
//               User View
//             </button>
//           )}

//           <button
//             onClick={() => {
//               setFormData(initialFormState);
//               setEditMode(false);
//               setFormModalOpen(true);
//             }}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-500/20 transition flex items-center"
//           >
//             <i className="fas fa-plus mr-2"></i> Manual Entry
//           </button>

//           <button
//             onClick={() => setUploadModalOpen(true)}
//             className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-emerald-500/20 transition flex items-center"
//           >
//             <i className="fas fa-file-excel mr-2"></i> Upload Excel
//           </button>
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//         <div className="overflow-x-auto max-h-[70vh]">
//           <table className="w-full text-left border-collapse whitespace-nowrap">
//             <thead>
//               <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider sticky top-0 z-10">
//                 {showCol("show_order_id") && <th className="p-4">Order_ID</th>}
//                 {showCol("show_txn_date") && <th className="p-4">Txn Date</th>}
//                 {showCol("show_month") && <th className="p-4">Month</th>}
//                 {showCol("show_day") && <th className="p-4">Day</th>}
//                 {showCol("show_txn_detail") && (
//                   <th className="p-4">Txn Detail</th>
//                 )}
//                 {showCol("show_merchant") && <th className="p-4">Merchant</th>}
//                 {showCol("show_merchant_id") && (
//                   <th className="p-4">Merchant_ID</th>
//                 )}
//                 {showCol("show_firm") && <th className="p-4">Firm</th>}
//                 {showCol("show_location") && <th className="p-4">Location</th>}
//                 {showCol("show_asin_fsn") && <th className="p-4">ASIN/FSN</th>}
//                 {showCol("show_model_name") && (
//                   <th className="p-4">Model Name</th>
//                 )}
//                 {showCol("show_model_no") && <th className="p-4">Model</th>}
//                 {showCol("show_order_status") && (
//                   <th className="p-4 text-center">Status</th>
//                 )}
//                 {showCol("show_order_qty") && (
//                   <th className="p-4 text-center">Qty</th>
//                 )}
//                 {showCol("show_order_amount") && (
//                   <th className="p-4 text-right">Order Amt</th>
//                 )}
//                 {showCol("show_unit_price") && (
//                   <th className="p-4 text-right">Unit Price</th>
//                 )}
//                 {showCol("show_payment_amount") && (
//                   <th className="p-4 text-right">Payment</th>
//                 )}
//                 {showCol("show_card_offer") && (
//                   <th className="p-4 text-right text-purple-600">Card Offer</th>
//                 )}
//                 {role === "ADMIN" && (
//                   <th className="p-4 text-center bg-slate-100">
//                     Admin Actions
//                   </th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50 text-sm">
//               {orders.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="20"
//                     className="p-10 text-center text-slate-400 font-medium"
//                   >
//                     No records match your filters.
//                   </td>
//                 </tr>
//               ) : (
//                 orders.map((order) => (
//                   <tr
//                     key={order.id}
//                     className="hover:bg-slate-50/50 transition-colors"
//                   >
//                     {showCol("show_order_id") && (
//                       <td className="p-4 font-bold text-indigo-600">
//                         {order.order_id}
//                       </td>
//                     )}
//                     {showCol("show_txn_date") && (
//                       <td className="p-4 text-slate-600">{order.txn_date}</td>
//                     )}
//                     {showCol("show_month") && (
//                       <td className="p-4 text-slate-600 capitalize">
//                         {order.month}
//                       </td>
//                     )}
//                     {showCol("show_day") && (
//                       <td className="p-4 text-slate-600">{order.day}</td>
//                     )}
//                     {showCol("show_txn_detail") && (
//                       <td
//                         className="p-4 max-w-[150px] truncate text-slate-600"
//                         title={order.txn_detail}
//                       >
//                         {order.txn_detail}
//                       </td>
//                     )}
//                     {showCol("show_merchant") && (
//                       <td className="p-4 text-slate-800 font-medium">
//                         {order.merchant}
//                       </td>
//                     )}
//                     {showCol("show_merchant_id") && (
//                       <td className="p-4 text-slate-500 font-mono text-xs">
//                         {order.merchant_id}
//                       </td>
//                     )}
//                     {showCol("show_firm") && (
//                       <td className="p-4 font-bold text-slate-800">
//                         {order.firm}
//                       </td>
//                     )}
//                     {showCol("show_location") && (
//                       <td className="p-4 text-slate-600">{order.location}</td>
//                     )}
//                     {showCol("show_asin_fsn") && (
//                       <td className="p-4 text-xs font-mono text-slate-500">
//                         {order.asin_fsn}
//                       </td>
//                     )}
//                     {showCol("show_model_name") && (
//                       <td
//                         className="p-4 max-w-[150px] truncate text-slate-800 font-medium"
//                         title={order.model_name}
//                       >
//                         {order.model_name}
//                       </td>
//                     )}
//                     {showCol("show_model_no") && (
//                       <td className="p-4 text-slate-600">{order.model_no}</td>
//                     )}
//                     {showCol("show_order_status") && (
//                       <td className="p-4 text-center">
//                         <span
//                           className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
//                             order.order_status === "Delivered"
//                               ? "bg-emerald-50 text-emerald-600 border-emerald-200"
//                               : order.order_status === "Cancelled"
//                                 ? "bg-red-50 text-red-600 border-red-200"
//                                 : "bg-amber-50 text-amber-600 border-amber-200"
//                           }`}
//                         >
//                           {order.order_status}
//                         </span>
//                       </td>
//                     )}
//                     {showCol("show_order_qty") && (
//                       <td className="p-4 text-center font-bold text-slate-700">
//                         {order.order_qty}
//                       </td>
//                     )}
//                     {showCol("show_order_amount") && (
//                       <td className="p-4 text-right text-slate-700">
//                         ₹
//                         {parseFloat(order.order_amount || 0).toLocaleString(
//                           "en-IN",
//                         )}
//                       </td>
//                     )}
//                     {showCol("show_unit_price") && (
//                       <td className="p-4 text-right text-slate-500">
//                         ₹
//                         {parseFloat(order.unit_price || 0).toLocaleString(
//                           "en-IN",
//                         )}
//                       </td>
//                     )}
//                     {showCol("show_payment_amount") && (
//                       <td className="p-4 text-right font-bold text-emerald-600">
//                         ₹
//                         {parseFloat(order.payment_amount || 0).toLocaleString(
//                           "en-IN",
//                         )}
//                       </td>
//                     )}
//                     {showCol("show_card_offer") && (
//                       <td className="p-4 text-right font-black text-purple-600 bg-purple-50/30">
//                         ₹
//                         {parseFloat(order.card_offer || 0).toLocaleString(
//                           "en-IN",
//                         )}
//                       </td>
//                     )}

//                     {role === "ADMIN" && (
//                       <td className="p-4 text-center border-l border-slate-100 bg-slate-50/50">
//                         <button
//                           onClick={() => handleViewClick(order.order_id)}
//                           className="text-slate-400 hover:text-indigo-600 mr-3 transition"
//                           title="View Details"
//                         >
//                           <i className="fas fa-eye"></i>
//                         </button>
//                         <button
//                           onClick={() => handleEditClick(order)}
//                           className="text-slate-400 hover:text-blue-600 mr-3 transition"
//                           title="Edit Record"
//                         >
//                           <i className="fas fa-pen"></i>
//                         </button>
//                         <button
//                           onClick={() => handleDelete(order.id)}
//                           className="text-slate-400 hover:text-red-600 transition"
//                           title="Delete Record"
//                         >
//                           <i className="fas fa-trash-alt"></i>
//                         </button>
//                       </td>
//                     )}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- MODAL 1: FILTER MODAL --- */}
//       {isFilterModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95">
//             <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
//               <h2 className="text-xl font-bold text-slate-800">
//                 <i className="fas fa-filter text-indigo-500 mr-2"></i> Advanced
//                 Filters
//               </h2>
//               <button
//                 onClick={() => setFilterModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-700"
//               >
//                 <i className="fas fa-times text-xl"></i>
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
//                   Txn Date
//                 </label>
//                 <input
//                   type="date"
//                   value={filters.txn_date}
//                   onChange={(e) =>
//                     setFilters({ ...filters, txn_date: e.target.value })
//                   }
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500"
//                 />
//               </div>

//               {/* DYNAMIC FIRM FILTER */}
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
//                   Firm
//                 </label>
//                 <select
//                   value={filters.firm}
//                   onChange={(e) =>
//                     setFilters({ ...filters, firm: e.target.value })
//                   }
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 appearance-none"
//                 >
//                   <option value="">All Firms</option>
//                   {masterFirms.map((f) => (
//                     <option key={f.id} value={f.name}>
//                       {f.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* DYNAMIC LOCATION FILTER */}
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
//                   Location
//                 </label>
//                 <select
//                   value={filters.location}
//                   onChange={(e) =>
//                     setFilters({ ...filters, location: e.target.value })
//                   }
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 appearance-none"
//                 >
//                   <option value="">All Locations</option>
//                   {masterLocations.map((l) => (
//                     <option key={l.id} value={l.name}>
//                       {l.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
//                   Model
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Search model..."
//                   value={filters.model_no}
//                   onChange={(e) =>
//                     setFilters({ ...filters, model_no: e.target.value })
//                   }
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
//                   Txn Detail
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Search details..."
//                   value={filters.txn_detail}
//                   onChange={(e) =>
//                     setFilters({ ...filters, txn_detail: e.target.value })
//                   }
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
//                   Order Status
//                 </label>
//                 <select
//                   value={filters.order_status}
//                   onChange={(e) =>
//                     setFilters({ ...filters, order_status: e.target.value })
//                   }
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 appearance-none"
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="Delivered">Delivered</option>
//                   <option value="Partially Delivered">
//                     Partially Delivered
//                   </option>
//                   <option value="Cancelled">Cancelled</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
//               <button
//                 onClick={handleClearFilters}
//                 className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
//               >
//                 Clear Filters
//               </button>
//               <button
//                 onClick={() => {
//                   setFilterModalOpen(false);
//                   fetchData();
//                 }}
//                 className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-md shadow-indigo-500/20"
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL 2: MANAGE USER VIEW --- */}
//       {isViewModalOpen && role === "ADMIN" && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-3xl w-full max-w-3xl shadow-2xl">
//             <div className="flex justify-between items-center mb-5 border-b pb-3">
//               <h2 className="text-lg font-bold text-slate-800">
//                 <i className="fas fa-sliders-h mr-2 text-indigo-500"></i>{" "}
//                 Configure User View
//               </h2>
//               <button
//                 onClick={() => setViewModalOpen(false)}
//                 className="text-slate-400 hover:text-red-500"
//               >
//                 <i className="fas fa-times text-xl"></i>
//               </button>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto p-1">
//               {Object.keys(viewSettings)
//                 .filter((k) => k.startsWith("show_"))
//                 .map((key) => (
//                   <label
//                     key={key}
//                     className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-indigo-50 transition border border-slate-100"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={viewSettings[key]}
//                       onChange={(e) =>
//                         setViewSettings({
//                           ...viewSettings,
//                           [key]: e.target.checked,
//                         })
//                       }
//                       className="w-4 h-4 text-indigo-600"
//                     />
//                     <span className="text-xs font-bold text-slate-600 uppercase">
//                       {key.replace("show_", "").replace(/_/g, " ")}
//                     </span>
//                   </label>
//                 ))}
//             </div>
//             <div className="flex justify-end gap-3 mt-6 border-t pt-4">
//               <button
//                 onClick={() => setViewModalOpen(false)}
//                 className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveViewSettings}
//                 className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20"
//               >
//                 Save View
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL 3: MANUAL ENTRY FORM --- */}
//       {isFormModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-3xl w-full max-w-5xl shadow-2xl max-h-[95vh] overflow-y-auto animate-in zoom-in-95">
//             <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4 sticky top-0 bg-white z-10">
//               <h2 className="text-xl font-bold text-slate-800">
//                 {editMode ? "Edit Order Record" : "Create New Order"}
//               </h2>
//               <button
//                 onClick={() => setFormModalOpen(false)}
//                 className="text-slate-400 hover:text-red-500"
//               >
//                 <i className="fas fa-times text-xl"></i>
//               </button>
//             </div>

//             <form
//               onSubmit={handleFormSubmit}
//               className="grid grid-cols-1 md:grid-cols-3 gap-6"
//             >
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
//                   Order ID <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="order_id"
//                   required
//                   value={formData.order_id || ""}
//                   onChange={handleInputChange}
//                   disabled={editMode}
//                   className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm font-semibold disabled:opacity-50"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
//                   Txn Date
//                 </label>
//                 <input
//                   type="date"
//                   name="txn_date"
//                   value={formData.txn_date || ""}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
//                   Day
//                 </label>
//                 <input
//                   type="text"
//                   disabled
//                   value={formData.day || ""}
//                   className="w-full bg-slate-100 border border-slate-200 p-3 rounded-xl outline-none text-sm text-slate-500"
//                   placeholder="Select date first"
//                 />
//               </div>

//               {/* DYNAMIC MERCHANT */}
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
//                   Merchant
//                 </label>
//                 <select
//                   name="merchant"
//                   value={formData.merchant || ""}
//                   onChange={handleInputChange}
//                   className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm appearance-none"
//                 >
//                   <option value="">Select Merchant</option>
//                   {masterMerchants.map((m) => (
//                     <option key={m.id} value={m.name}>
//                       {m.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* DYNAMIC FIRM */}
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
//                   Firm
//                 </label>
//                 <select
//                   name="firm"
//                   value={formData.firm || ""}
//                   onChange={handleInputChange}
//                   className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm appearance-none"
//                 >
//                   <option value="">Select Firm</option>
//                   {masterFirms.map((f) => (
//                     <option key={f.id} value={f.name}>
//                       {f.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* DYNAMIC LOCATION */}
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
//                   Location
//                 </label>
//                 <select
//                   name="location"
//                   value={formData.location || ""}
//                   onChange={handleInputChange}
//                   className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm appearance-none"
//                 >
//                   <option value="">Select Location</option>
//                   {masterLocations.map((l) => (
//                     <option key={l.id} value={l.name}>
//                       {l.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
//                   Txn Detail
//                 </label>
//                 <input
//                   type="text"
//                   name="txn_detail"
//                   value={formData.txn_detail || ""}
//                   onChange={handleInputChange}
//                   className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
//                   Merchant ID
//                 </label>
//                 <input
//                   type="text"
//                   name="merchant_id"
//                   value={formData.merchant_id || ""}
//                   onChange={handleInputChange}
//                   className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
//                   ASIN / FSN
//                 </label>
//                 <input
//                   type="text"
//                   name="asin_fsn"
//                   value={formData.asin_fsn || ""}
//                   onChange={handleInputChange}
//                   className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm font-mono"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
//                   Model Name
//                 </label>
//                 <input
//                   type="text"
//                   name="model_name"
//                   value={formData.model_name || ""}
//                   onChange={handleInputChange}
//                   className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
//                   Model Number
//                 </label>
//                 <input
//                   type="text"
//                   name="model_no"
//                   value={formData.model_no || ""}
//                   onChange={handleInputChange}
//                   className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
//                   Order Status
//                 </label>
//                 <select
//                   name="order_status"
//                   value={formData.order_status || "Delivered"}
//                   onChange={handleInputChange}
//                   className="w-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold p-3 rounded-xl focus:border-indigo-500 outline-none text-sm appearance-none"
//                 >
//                   <option value="Delivered">✅ Delivered</option>
//                   <option value="Partially Delivered">
//                     ⏳ Partially Delivered
//                   </option>
//                   <option value="Cancelled">❌ Cancelled</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
//                   Order Qty
//                 </label>
//                 <input
//                   type="number"
//                   name="order_qty"
//                   min="1"
//                   required
//                   value={formData.order_qty || ""}
//                   onChange={handleInputChange}
//                   className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm font-bold"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
//                   Order Amount (₹)
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   name="order_amount"
//                   value={formData.order_amount || ""}
//                   onChange={handleInputChange}
//                   className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm font-bold text-slate-700"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
//                   Payment Amount (₹)
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   name="payment_amount"
//                   value={formData.payment_amount || ""}
//                   onChange={handleInputChange}
//                   className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm font-bold text-emerald-600"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
//                   <i className="fas fa-calculator"></i> Unit Price
//                 </label>
//                 <input
//                   type="text"
//                   disabled
//                   value={`₹ ${formData.unit_price || "0.00"}`}
//                   className="w-full bg-slate-100 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold text-slate-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-purple-500 uppercase mb-1.5">
//                   <i className="fas fa-gift"></i> Card Offer
//                 </label>
//                 <input
//                   type="text"
//                   disabled
//                   value={`₹ ${formData.card_offer || "0.00"}`}
//                   className="w-full bg-purple-50 border border-purple-100 p-3 rounded-xl outline-none text-sm font-bold text-purple-600"
//                 />
//               </div>

//               <div className="md:col-span-3 flex justify-end gap-3 border-t border-slate-100 pt-5 mt-2">
//                 <button
//                   type="button"
//                   onClick={() => setFormModalOpen(false)}
//                   className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-70 transition flex items-center gap-2"
//                 >
//                   {loading ? (
//                     <>
//                       <i className="fas fa-spinner fa-spin"></i> Saving...
//                     </>
//                   ) : editMode ? (
//                     "Update Record"
//                   ) : (
//                     "Save Database Record"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL 4: UPLOAD EXCEL --- */}
//       {isUploadModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
//             <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
//               <h2 className="text-xl font-bold text-slate-800">
//                 <i className="fas fa-file-excel text-emerald-500 mr-2"></i> Bulk
//                 Upload
//               </h2>
//               <button
//                 onClick={() => setUploadModalOpen(false)}
//                 className="text-slate-400 hover:text-red-500"
//               >
//                 <i className="fas fa-times text-xl"></i>
//               </button>
//             </div>

//             <form onSubmit={handleUploadSubmit}>
//               <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 p-8 text-center rounded-2xl bg-slate-50 mb-6 transition-colors">
//                 <p className="text-sm font-bold text-slate-600 mb-3">
//                   Select Excel/CSV File
//                 </p>
//                 <input
//                   type="file"
//                   accept=".xlsx, .xls, .csv"
//                   onChange={handleFileChange}
//                   className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-70 flex justify-center items-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <i className="fas fa-circle-notch fa-spin"></i> Uploading...
//                   </>
//                 ) : (
//                   "Upload & Sync Data"
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
import api from "../api/axios";

export default function OrdersReport() {
  const [orders, setOrders] = useState([]);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [masterFirms, setMasterFirms] = useState([]);
  const [masterLocations, setMasterLocations] = useState([]);
  const [masterMerchants, setMasterMerchants] = useState([]);

  const role = localStorage.getItem("user_role") || "USER";

  const initialFormState = {
    order_id: "",
    txn_date: "",
    month: "",
    day: "",
    txn_detail: "",
    merchant: "",
    merchant_id: "",
    firm: "",
    location: "",
    asin_fsn: "",
    model_name: "",
    model_no: "",
    order_status: "Delivered",
    order_qty: 1,
    order_amount: 0.0,
    unit_price: 0.0,
    payment_amount: 0.0,
    card_offer: 0.0,
  };

  const [formData, setFormData] = useState(initialFormState);

  // UPDATE: txn_date ki jagah start_date aur end_date aa gaya hai
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    firm: "",
    location: "",
    model_no: "",
    txn_detail: "",
    order_status: "",
  });

  const [viewSettings, setViewSettings] = useState({
    show_order_id: true,
    show_txn_date: true,
    show_month: true,
    show_day: true,
    show_txn_detail: true,
    show_merchant: true,
    show_merchant_id: true,
    show_firm: true,
    show_location: true,
    show_asin_fsn: true,
    show_model_name: true,
    show_model_no: true,
    show_order_status: true,
    show_order_qty: true,
    show_order_amount: true,
    show_unit_price: true,
    show_payment_amount: true,
    show_card_offer: true,
  });

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const fRes = await api.get("reports/firms/");
        setMasterFirms(fRes.data);
        const lRes = await api.get("reports/locations/");
        setMasterLocations(lRes.data);
        const mRes = await api.get("reports/merchants/");
        setMasterMerchants(mRes.data);
      } catch (error) {
        console.error("Master data fetch error:", error);
      }
    };
    fetchMasters();
  }, []);

  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, value]) => value !== ""),
      ).toString();

      const [ordersRes, settingsRes] = await Promise.all([
        api.get(`reports/orders/?${queryParams}`),
        api.get("reports/column-policy/"),
      ]);
      setOrders(ordersRes.data);
      if (settingsRes.data) setViewSettings(settingsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === "txn_date" && value) {
      const dateObj = new Date(value);
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      newFormData.day = days[dateObj.getDay()];
      newFormData.month = months[dateObj.getMonth()];
    }

    const amt = name === "order_amount" ? value : newFormData.order_amount;
    const qty = name === "order_qty" ? value : newFormData.order_qty;
    const pay = name === "payment_amount" ? value : newFormData.payment_amount;

    if (amt && qty && Number(qty) > 0)
      newFormData.unit_price = (Number(amt) / Number(qty)).toFixed(2);
    else newFormData.unit_price = 0;

    if (pay && amt)
      newFormData.card_offer = Math.abs(Number(amt) - Number(pay)).toFixed(2);
    else newFormData.card_offer = 0;

    setFormData(newFormData);
  };

  const handleEditClick = (order) => {
    setFormData(order);
    setEditId(order.id);
    setEditMode(true);
    setFormModalOpen(true);
  };
  const handleViewClick = (orderId) => {
    alert(`View logic pending for Order ID: ${orderId}.`);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode) {
        await api.put(`reports/orders/${editId}/`, formData);
        alert("Record updated successfully!");
      } else {
        await api.post("reports/orders/", formData);
        alert("Record saved!");
      }
      setFormModalOpen(false);
      setFormData(initialFormState);
      setEditMode(false);
      fetchData();
    } catch (error) {
      alert("Error: Order ID duplicate ho sakti hai ya data galat hai.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this permanent record?")) {
      try {
        await api.delete(`reports/orders/${id}/`);
        fetchData();
      } catch (error) {
        alert("Access Denied.");
      }
    }
  };

  const handleSaveViewSettings = async () => {
    try {
      await api.put("reports/column-policy/", viewSettings);
      alert("User View Configuration Updated!");
      setViewModalOpen(false);
    } catch (error) {
      alert("Failed to save view settings.");
    }
  };

  // UPDATE: Clear filters clears both dates now
  const handleClearFilters = () => {
    setFilters({
      start_date: "",
      end_date: "",
      firm: "",
      location: "",
      model_no: "",
      txn_detail: "",
      order_status: "",
    });
    setFilterModalOpen(false);
  };

  const showCol = (colName) =>
    role === "ADMIN" || viewSettings[colName] === true;
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    setLoading(true);
    try {
      await api.post("reports/orders/upload/", data);
      alert("Excel Uploaded!");
      setUploadModalOpen(false);
      setFile(null);
      fetchData();
    } catch (error) {
      alert(
        "Upload Failed: " + (error.response?.data?.error || "Unknown Error"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Orders Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage, filter, and track business shipments
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setFilterModalOpen(true)}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition flex items-center"
          >
            <i className="fas fa-filter mr-2 text-indigo-500"></i> Filter Data
            {Object.values(filters).some((x) => x !== "") && (
              <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {role === "ADMIN" && (
            <button
              onClick={() => setViewModalOpen(true)}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition flex items-center"
            >
              <i className="fas fa-eye-slash mr-2 text-purple-600"></i> Manage
              User View
            </button>
          )}

          <button
            onClick={() => {
              setFormData(initialFormState);
              setEditMode(false);
              setFormModalOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-500/20 transition flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> Manual Entry
          </button>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-emerald-500/20 transition flex items-center"
          >
            <i className="fas fa-file-excel mr-2"></i> Upload Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider sticky top-0 z-10">
                {/* NEW COLUMN: Serial Number Header */}
                <th className="p-4 w-12 text-center">S.No</th>

                {showCol("show_order_id") && <th className="p-4">Order_ID</th>}
                {showCol("show_txn_date") && <th className="p-4">Txn Date</th>}
                {showCol("show_month") && <th className="p-4">Month</th>}
                {showCol("show_day") && <th className="p-4">Day</th>}
                {showCol("show_txn_detail") && (
                  <th className="p-4">Txn Detail</th>
                )}
                {showCol("show_merchant") && <th className="p-4">Merchant</th>}
                {showCol("show_merchant_id") && (
                  <th className="p-4">Merchant_ID</th>
                )}
                {showCol("show_firm") && <th className="p-4">Firm</th>}
                {showCol("show_location") && <th className="p-4">Location</th>}
                {showCol("show_asin_fsn") && <th className="p-4">ASIN/FSN</th>}
                {showCol("show_model_name") && (
                  <th className="p-4">Model Name</th>
                )}
                {showCol("show_model_no") && <th className="p-4">Model</th>}
                {showCol("show_order_status") && (
                  <th className="p-4 text-center">Status</th>
                )}
                {showCol("show_order_qty") && (
                  <th className="p-4 text-center">Qty</th>
                )}
                {showCol("show_order_amount") && (
                  <th className="p-4 text-right">Order Amt</th>
                )}
                {showCol("show_unit_price") && (
                  <th className="p-4 text-right">Unit Price</th>
                )}
                {showCol("show_payment_amount") && (
                  <th className="p-4 text-right">Payment</th>
                )}
                {showCol("show_card_offer") && (
                  <th className="p-4 text-right text-purple-600">Card Offer</th>
                )}
                {role === "ADMIN" && (
                  <th className="p-4 text-center bg-slate-100">
                    Admin Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="21"
                    className="p-10 text-center text-slate-400 font-medium"
                  >
                    No records match your filters.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* NEW COLUMN: Serial Number Body (Auto Generated) */}
                    <td className="p-4 text-center font-mono text-xs font-bold text-slate-400">
                      {index + 1}
                    </td>

                    {showCol("show_order_id") && (
                      <td className="p-4 font-bold text-indigo-600">
                        {order.order_id}
                      </td>
                    )}
                    {showCol("show_txn_date") && (
                      <td className="p-4 text-slate-600">{order.txn_date}</td>
                    )}
                    {showCol("show_month") && (
                      <td className="p-4 text-slate-600 capitalize">
                        {order.month}
                      </td>
                    )}
                    {showCol("show_day") && (
                      <td className="p-4 text-slate-600">{order.day}</td>
                    )}
                    {showCol("show_txn_detail") && (
                      <td
                        className="p-4 max-w-[150px] truncate text-slate-600"
                        title={order.txn_detail}
                      >
                        {order.txn_detail}
                      </td>
                    )}
                    {showCol("show_merchant") && (
                      <td className="p-4 text-slate-800 font-medium">
                        {order.merchant}
                      </td>
                    )}
                    {showCol("show_merchant_id") && (
                      <td className="p-4 text-slate-500 font-mono text-xs">
                        {order.merchant_id}
                      </td>
                    )}
                    {showCol("show_firm") && (
                      <td className="p-4 font-bold text-slate-800">
                        {order.firm}
                      </td>
                    )}
                    {showCol("show_location") && (
                      <td className="p-4 text-slate-600">{order.location}</td>
                    )}
                    {showCol("show_asin_fsn") && (
                      <td className="p-4 text-xs font-mono text-slate-500">
                        {order.asin_fsn}
                      </td>
                    )}
                    {showCol("show_model_name") && (
                      <td
                        className="p-4 max-w-[150px] truncate text-slate-800 font-medium"
                        title={order.model_name}
                      >
                        {order.model_name}
                      </td>
                    )}
                    {showCol("show_model_no") && (
                      <td className="p-4 text-slate-600">{order.model_no}</td>
                    )}
                    {showCol("show_order_status") && (
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                            order.order_status === "Delivered"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : order.order_status === "Cancelled"
                                ? "bg-red-50 text-red-600 border-red-200"
                                : "bg-amber-50 text-amber-600 border-amber-200"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                    )}
                    {showCol("show_order_qty") && (
                      <td className="p-4 text-center font-bold text-slate-700">
                        {order.order_qty}
                      </td>
                    )}
                    {showCol("show_order_amount") && (
                      <td className="p-4 text-right text-slate-700">
                        ₹
                        {parseFloat(order.order_amount || 0).toLocaleString(
                          "en-IN",
                        )}
                      </td>
                    )}
                    {showCol("show_unit_price") && (
                      <td className="p-4 text-right text-slate-500">
                        ₹
                        {parseFloat(order.unit_price || 0).toLocaleString(
                          "en-IN",
                        )}
                      </td>
                    )}
                    {showCol("show_payment_amount") && (
                      <td className="p-4 text-right font-bold text-emerald-600">
                        ₹
                        {parseFloat(order.payment_amount || 0).toLocaleString(
                          "en-IN",
                        )}
                      </td>
                    )}
                    {showCol("show_card_offer") && (
                      <td className="p-4 text-right font-black text-purple-600 bg-purple-50/30">
                        ₹
                        {parseFloat(order.card_offer || 0).toLocaleString(
                          "en-IN",
                        )}
                      </td>
                    )}

                    {role === "ADMIN" && (
                      <td className="p-4 text-center border-l border-slate-100 bg-slate-50/50">
                        <button
                          onClick={() => handleViewClick(order.order_id)}
                          className="text-slate-400 hover:text-indigo-600 mr-3 transition"
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button
                          onClick={() => handleEditClick(order)}
                          className="text-slate-400 hover:text-blue-600 mr-3 transition"
                          title="Edit Record"
                        >
                          <i className="fas fa-pen"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="text-slate-400 hover:text-red-600 transition"
                          title="Delete Record"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL 1: FILTER MODAL --- */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800">
                <i className="fas fa-filter text-indigo-500 mr-2"></i> Advanced
                Filters
              </h2>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {/* NEW: FROM DATE & TO DATE */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) =>
                    setFilters({ ...filters, start_date: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) =>
                    setFilters({ ...filters, end_date: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Order Status
                </label>
                <select
                  value={filters.order_status}
                  onChange={(e) =>
                    setFilters({ ...filters, order_status: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 appearance-none text-sm font-medium"
                >
                  <option value="">All Statuses</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Partially Delivered">
                    Partially Delivered
                  </option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Firm
                </label>
                <select
                  value={filters.firm}
                  onChange={(e) =>
                    setFilters({ ...filters, firm: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 appearance-none text-sm font-medium"
                >
                  <option value="">All Firms</option>
                  {masterFirms.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 appearance-none text-sm font-medium"
                >
                  <option value="">All Locations</option>
                  {masterLocations.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Model
                </label>
                <input
                  type="text"
                  placeholder="Search model..."
                  value={filters.model_no}
                  onChange={(e) =>
                    setFilters({ ...filters, model_no: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm font-medium"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Txn Detail
                </label>
                <input
                  type="text"
                  placeholder="Search details..."
                  value={filters.txn_detail}
                  onChange={(e) =>
                    setFilters({ ...filters, txn_detail: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
              >
                Clear Filters
              </button>
              <button
                onClick={() => {
                  setFilterModalOpen(false);
                  fetchData();
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition shadow-md shadow-indigo-500/20"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: MANAGE USER VIEW --- */}
      {isViewModalOpen && role === "ADMIN" && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-5 border-b pb-3">
              <h2 className="text-lg font-bold text-slate-800">
                <i className="fas fa-sliders-h mr-2 text-indigo-500"></i>{" "}
                Configure User View
              </h2>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-slate-400 hover:text-red-500"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto p-1">
              {Object.keys(viewSettings)
                .filter((k) => k.startsWith("show_"))
                .map((key) => (
                  <label
                    key={key}
                    className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-indigo-50 transition border border-slate-100"
                  >
                    <input
                      type="checkbox"
                      checked={viewSettings[key]}
                      onChange={(e) =>
                        setViewSettings({
                          ...viewSettings,
                          [key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-indigo-600"
                    />
                    <span className="text-xs font-bold text-slate-600 uppercase">
                      {key.replace("show_", "").replace(/_/g, " ")}
                    </span>
                  </label>
                ))}
            </div>
            <div className="flex justify-end gap-3 mt-6 border-t pt-4">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveViewSettings}
                className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/20"
              >
                Save View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: MANUAL ENTRY FORM --- */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-5xl shadow-2xl max-h-[95vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">
                {editMode ? "Edit Order Record" : "Create New Order"}
              </h2>
              <button
                onClick={() => setFormModalOpen(false)}
                className="text-slate-400 hover:text-red-500"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Order ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="order_id"
                  required
                  value={formData.order_id || ""}
                  onChange={handleInputChange}
                  disabled={editMode}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm font-semibold disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Txn Date
                </label>
                <input
                  type="date"
                  name="txn_date"
                  value={formData.txn_date || ""}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Day
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.day || ""}
                  className="w-full bg-slate-100 border border-slate-200 p-3 rounded-xl outline-none text-sm text-slate-500"
                  placeholder="Select date first"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Merchant
                </label>
                <select
                  name="merchant"
                  value={formData.merchant || ""}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm appearance-none"
                >
                  <option value="">Select Merchant</option>
                  {masterMerchants.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Firm
                </label>
                <select
                  name="firm"
                  value={formData.firm || ""}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm appearance-none"
                >
                  <option value="">Select Firm</option>
                  {masterFirms.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Location
                </label>
                <select
                  name="location"
                  value={formData.location || ""}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm appearance-none"
                >
                  <option value="">Select Location</option>
                  {masterLocations.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Txn Detail
                </label>
                <input
                  type="text"
                  name="txn_detail"
                  value={formData.txn_detail || ""}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Merchant ID
                </label>
                <input
                  type="text"
                  name="merchant_id"
                  value={formData.merchant_id || ""}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  ASIN / FSN
                </label>
                <input
                  type="text"
                  name="asin_fsn"
                  value={formData.asin_fsn || ""}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Model Name
                </label>
                <input
                  type="text"
                  name="model_name"
                  value={formData.model_name || ""}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Model Number
                </label>
                <input
                  type="text"
                  name="model_no"
                  value={formData.model_no || ""}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Order Status
                </label>
                <select
                  name="order_status"
                  value={formData.order_status || "Delivered"}
                  onChange={handleInputChange}
                  className="w-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold p-3 rounded-xl focus:border-indigo-500 outline-none text-sm appearance-none"
                >
                  <option value="Delivered">✅ Delivered</option>
                  <option value="Partially Delivered">
                    ⏳ Partially Delivered
                  </option>
                  <option value="Cancelled">❌ Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Order Qty
                </label>
                <input
                  type="number"
                  name="order_qty"
                  min="1"
                  required
                  value={formData.order_qty || ""}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Order Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="order_amount"
                  value={formData.order_amount || ""}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="payment_amount"
                  value={formData.payment_amount || ""}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm font-bold text-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">
                  <i className="fas fa-calculator"></i> Unit Price
                </label>
                <input
                  type="text"
                  disabled
                  value={`₹ ${formData.unit_price || "0.00"}`}
                  className="w-full bg-slate-100 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold text-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-purple-500 uppercase mb-1.5">
                  <i className="fas fa-gift"></i> Card Offer
                </label>
                <input
                  type="text"
                  disabled
                  value={`₹ ${formData.card_offer || "0.00"}`}
                  className="w-full bg-purple-50 border border-purple-100 p-3 rounded-xl outline-none text-sm font-bold text-purple-600"
                />
              </div>

              <div className="md:col-span-3 flex justify-end gap-3 border-t border-slate-100 pt-5 mt-2">
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-70 transition flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Saving...
                    </>
                  ) : editMode ? (
                    "Update Record"
                  ) : (
                    "Save Database Record"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: UPLOAD EXCEL --- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800">
                <i className="fas fa-file-excel text-emerald-500 mr-2"></i> Bulk
                Upload
              </h2>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-red-500"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 p-8 text-center rounded-2xl bg-slate-50 mb-6 transition-colors">
                <p className="text-sm font-bold text-slate-600 mb-3">
                  Select Excel/CSV File
                </p>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-emerald-500/20 disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i> Uploading...
                  </>
                ) : (
                  "Upload & Sync Data"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}