// import React, { useState, useEffect } from "react";
// import api from "../api/axios";

// export default function OrdersReport() {
//   const [orders, setOrders] = useState([]);

//   // --- NAYE PAGINATION STATES ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [jumpPage, setJumpPage] = useState("");

//   // Modal States
//   const [isUploadModalOpen, setUploadModalOpen] = useState(false);
//   const [isFormModalOpen, setFormModalOpen] = useState(false);
//   const [isViewModalOpen, setViewModalOpen] = useState(false);
//   const [isFilterModalOpen, setFilterModalOpen] = useState(false);

//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [editId, setEditId] = useState(null);

//   // Master Data States
//   const [masterFirms, setMasterFirms] = useState([]);
//   const [masterLocations, setMasterLocations] = useState([]);
//   const [masterMerchants, setMasterMerchants] = useState([]);
//   const [masterModels, setMasterModels] = useState([]);

//   const role = localStorage.getItem("user_role") || "USER";

//   // --- STATE SPLIT FOR HEADER AND MULTIPLE ITEMS ---
//   const initialHeaderState = {
//     order_id: "",
//     txn_date: "",
//     month: "",
//     day: "",
//     merchant: "",
//     merchant_id: "",
//     firm: "",
//     location: "",
//     txn_detail: "",
//   };

//   const initialItemState = {
//     asin_fsn: "",
//     model_name: "",
//     model_no: "",
//     order_status: "Delivered",
//     order_qty: 1,
//     order_amount: "",
//     unit_price: "0.00",
//     payment_amount: "",
//     card_offer: "0.00",
//   };

//   const [headerData, setHeaderData] = useState(initialHeaderState);
//   const [itemsData, setItemsData] = useState([{ ...initialItemState }]);

//   const [filters, setFilters] = useState({
//     start_date: "",
//     end_date: "",
//     firm: "",
//     location: "",
//     model_no: "",
//     txn_detail: "",
//     order_status: "",
//   });

//   // FULL 17 FIELDS VIEW SETTINGS
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
//   // --- DATE FORMATTER (YYYY-MM-DD to DD-MM-YYYY) ---
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "-";
//     const parts = dateStr.split("-");
//     if (parts.length === 3 && parts[0].length === 4) {
//       return `${parts[2]}-${parts[1]}-${parts[0]}`;
//     }
//     return dateStr;
//   };
//   useEffect(() => {
//     const fetchMasters = async () => {
//       try {
//         const [fRes, lRes, mRes, modRes] = await Promise.all([
//           api.get("reports/firms/"),
//           api.get("reports/locations/"),
//           api.get("reports/merchants/"),
//           api.get("reports/models/"),
//         ]);
//         setMasterFirms(fRes.data);
//         setMasterLocations(lRes.data);
//         setMasterMerchants(mRes.data);
//         setMasterModels(modRes.data);
//       } catch (error) {
//         console.error("Master fetch error:", error);
//       }
//     };
//     fetchMasters();
//   }, []);

//   // --- BULLETPROOF FETCH DATA (With Pagination & Settings) ---
//   const fetchData = async () => {
//     try {
//       const queryParams = new URLSearchParams(
//         Object.entries(filters).filter(([_, v]) => v !== ""),
//       );
//       queryParams.append("page", currentPage); // Page number bhejna

//       const [dataRes, settingsRes] = await Promise.all([
//         api.get(`reports/orders/?${queryParams.toString()}`),
//         api.get("reports/column-policy/?policy_name=user_view_policy"),
//       ]);

//       // Safe Extraction for Pagination or Direct Array
//       const records = dataRes.data.results || dataRes.data;
//       const count = dataRes.data.count || records.length;

//       setOrders(records);
//       setTotalRecords(count);

//       if (settingsRes.data) setViewSettings(settingsRes.data);
//     } catch (error) {
//       console.error("Fetch data error:", error);
//     }
//   };

//   // Jab bhi filters ya page number change ho, auto fetch ho jayega
//   useEffect(() => {
//     fetchData();
//   }, [filters, currentPage]);

//   // --- HEADER CHANGE HANDLER ---
//   const handleHeaderChange = (e) => {
//     const { name, value } = e.target;
//     let newHeader = { ...headerData, [name]: value };

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
//       newHeader.day = days[dateObj.getDay()];
//       newHeader.month = months[dateObj.getMonth()];
//     }
//     setHeaderData(newHeader);
//   };

//   // --- INDIVIDUAL ITEM CHANGE HANDLER ---
//   const handleItemChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedItems = [...itemsData];
//     let item = { ...updatedItems[index], [name]: value };

//     if (name === "asin_fsn") {
//       const selectedModel = masterModels.find((m) => m.asin_fsn === value);
//       if (selectedModel) {
//         item.model_name = selectedModel.model_name;
//         item.model_no = selectedModel.model;
//       } else {
//         item.model_name = "";
//         item.model_no = "";
//       }
//     }

//     const amt = name === "order_amount" ? value : item.order_amount;
//     const qty = name === "order_qty" ? value : item.order_qty;
//     const pay = name === "payment_amount" ? value : item.payment_amount;

//     if (amt && qty && Number(qty) > 0)
//       item.unit_price = (Number(amt) / Number(qty)).toFixed(2);
//     else item.unit_price = "0.00";

//     if (pay && amt)
//       item.card_offer = Math.abs(Number(amt) - Number(pay)).toFixed(2);
//     else item.card_offer = "0.00";

//     updatedItems[index] = item;
//     setItemsData(updatedItems);
//   };

//   // --- ADD / REMOVE ITEMS LOGIC ---
//   const handleAddItem = () =>
//     setItemsData([...itemsData, { ...initialItemState }]);
//   const handleRemoveItem = (index) =>
//     setItemsData(itemsData.filter((_, i) => i !== index));

//   const handleEditClick = (order) => {
//     const {
//       order_id,
//       txn_date,
//       month,
//       day,
//       merchant,
//       merchant_id,
//       firm,
//       location,
//       txn_detail,
//       ...itemDetails
//     } = order;
//     setHeaderData({
//       order_id,
//       txn_date,
//       month,
//       day,
//       merchant,
//       merchant_id,
//       firm,
//       location,
//       txn_detail,
//     });
//     setItemsData([itemDetails]);
//     setEditId(order.id);
//     setEditMode(true);
//     setFormModalOpen(true);
//   };

//   const handleViewClick = (orderId) => {
//     alert(`View logic pending for Order ID: ${orderId}.`);
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       if (editMode) {
//         const payload = { ...headerData, ...itemsData[0] };
//         await api.put(`reports/orders/${editId}/`, payload);
//         alert("Record updated successfully!");
//       } else {
//         const payloads = itemsData.map((item) => ({ ...headerData, ...item }));
//         await Promise.all(
//           payloads.map((payload) => api.post("reports/orders/", payload)),
//         );
//         alert(
//           `${payloads.length} item(s) saved successfully under Order ID ${headerData.order_id}!`,
//         );
//       }
//       setFormModalOpen(false);
//       setHeaderData(initialHeaderState);
//       setItemsData([{ ...initialItemState }]);
//       setEditMode(false);
//       fetchData();
//     } catch (error) {
//       alert("Error saving records. Please check the data.");
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
//       await api.put(
//         "reports/column-policy/?policy_name=user_view_policy",
//         viewSettings,
//       );
//       alert("User View Configuration Updated!");
//       setViewModalOpen(false);
//       fetchData();
//     } catch (error) {
//       alert("Failed to save view settings.");
//     }
//   };

//   const handleClearFilters = () => {
//     setFilters({
//       start_date: "",
//       end_date: "",
//       firm: "",
//       location: "",
//       model_no: "",
//       txn_detail: "",
//       order_status: "",
//     });
//     setCurrentPage(1); // Filter clear karne par page 1
//     setFilterModalOpen(false);
//   };

//   // --- SAFE SHOW COL LOGIC ---
//   const showCol = (colName) => {
//     if (role === "ADMIN") return true;
//     return viewSettings[colName] !== false;
//   };

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
//       setCurrentPage(1); // Naya data aane par Page 1 par bhejo
//       fetchData();
//     } catch (error) {
//       alert(
//         "Upload Failed: " + (error.response?.data?.error || "Unknown Error"),
//       );
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
//               View
//             </button>
//           )}

//           <button
//             onClick={() => {
//               setHeaderData(initialHeaderState);
//               setItemsData([{ ...initialItemState }]);
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

//       {/* --- MAIN TABLE (ALL 17 COLUMNS) --- */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//         <div className="overflow-x-auto max-h-[70vh]">
//           <table className="w-full text-left border-collapse whitespace-nowrap">
//             <thead>
//               <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider sticky top-0 z-10">
//                 <th className="p-4 w-12 text-center">S.No</th>
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
//                   <th className="p-4 text-center bg-slate-100 border-l border-slate-200">
//                     Actions
//                   </th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50 text-sm">
//               {orders.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="21"
//                     className="p-10 text-center text-slate-400 font-medium"
//                   >
//                     No records match your filters.
//                   </td>
//                 </tr>
//               ) : (
//                 orders.map((order, index) => (
//                   <tr
//                     key={order.id}
//                     className="hover:bg-slate-50/50 transition-colors"
//                   >
//                     <td className="p-4 text-center font-mono text-xs font-bold text-slate-400">
//                       {/* S.No dynamically changes based on Pagination */}
//                       {((currentPage - 1) * 50 + index + 1)
//                         .toString()
//                         .padStart(2, "0")}
//                     </td>
//                     {showCol("show_order_id") && (
//                       <td className="p-4 font-bold text-indigo-600">
//                         {order.order_id}
//                       </td>
//                     )}
//                     {showCol("show_txn_date") && (
//                       <td className="p-4 text-slate-600 font-medium">
//                         {formatDate(order.txn_date)}
//                       </td>
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
//                         className="p-4 text-slate-800 font-medium max-w-[150px] truncate"
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
//                           className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${order.order_status === "Delivered" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : order.order_status === "Cancelled" ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}
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

//       {/* --- SMART PAGINATION BAR --- */}
//       <div className="mt-4">
//         <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4">
//           <div className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
//             Total Records:{" "}
//             <span className="text-indigo-600 text-sm">{totalRecords}</span>
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((prev) => prev - 1)}
//               className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center"
//             >
//               <i className="fas fa-chevron-left mr-2"></i> Prev
//             </button>

//             <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-xs border border-indigo-200 shadow-sm">
//               Page {currentPage} of {Math.ceil(totalRecords / 50) || 1}
//             </span>

//             <button
//               disabled={currentPage >= Math.ceil(totalRecords / 50)}
//               onClick={() => setCurrentPage((prev) => prev + 1)}
//               className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center"
//             >
//               Next <i className="fas fa-chevron-right ml-2"></i>
//             </button>

//             <div className="flex items-center ml-2 border-l border-slate-200 pl-4">
//               <input
//                 type="number"
//                 value={jumpPage}
//                 onChange={(e) => setJumpPage(e.target.value)}
//                 placeholder="Go to..."
//                 className="w-20 px-3 py-2 bg-white border border-slate-300 rounded-l-lg text-xs font-bold outline-none focus:border-indigo-500"
//               />
//               <button
//                 onClick={() => {
//                   const p = parseInt(jumpPage);
//                   const maxPages = Math.ceil(totalRecords / 50) || 1;
//                   if (p > 0 && p <= maxPages) {
//                     setCurrentPage(p);
//                     setJumpPage("");
//                   } else {
//                     alert(
//                       `Please enter a valid page between 1 and ${maxPages}`,
//                     );
//                   }
//                 }}
//                 className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-r-lg transition"
//               >
//                 GO
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* --- MODAL 1: FILTER MODAL --- */}
//       {isFilterModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-3xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95">
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

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
//                   From Date
//                 </label>
//                 <input
//                   type="date"
//                   value={filters.start_date}
//                   onChange={(e) =>
//                     setFilters({ ...filters, start_date: e.target.value })
//                   }
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm font-medium"
//                 />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
//                   To Date
//                 </label>
//                 <input
//                   type="date"
//                   value={filters.end_date}
//                   onChange={(e) =>
//                     setFilters({ ...filters, end_date: e.target.value })
//                   }
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm font-medium"
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
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 appearance-none text-sm font-medium"
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="Delivered">Delivered</option>
//                   <option value="Partially Delivered">
//                     Partially Delivered
//                   </option>
//                   <option value="Cancelled">Cancelled</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
//                   Firm
//                 </label>
//                 <select
//                   value={filters.firm}
//                   onChange={(e) =>
//                     setFilters({ ...filters, firm: e.target.value })
//                   }
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 appearance-none text-sm font-medium"
//                 >
//                   <option value="">All Firms</option>
//                   {masterFirms.map((f) => (
//                     <option key={f.id} value={f.name}>
//                       {f.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
//                   Location
//                 </label>
//                 <select
//                   value={filters.location}
//                   onChange={(e) =>
//                     setFilters({ ...filters, location: e.target.value })
//                   }
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 appearance-none text-sm font-medium"
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
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm font-medium"
//                 />
//               </div>
//               <div className="md:col-span-3">
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
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm font-medium"
//                 />
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
//                   setCurrentPage(1); // Naya filter lagane par Page 1 par aana
//                   setFilterModalOpen(false);
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
//               {[
//                 "show_order_id",
//                 "show_txn_date",
//                 "show_month",
//                 "show_day",
//                 "show_txn_detail",
//                 "show_merchant",
//                 "show_merchant_id",
//                 "show_firm",
//                 "show_location",
//                 "show_asin_fsn",
//                 "show_model_name",
//                 "show_model_no",
//                 "show_order_status",
//                 "show_order_qty",
//                 "show_order_amount",
//                 "show_unit_price",
//                 "show_payment_amount",
//                 "show_card_offer",
//               ].map((key) => (
//                 <label
//                   key={key}
//                   className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-indigo-50 transition border border-slate-100"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={viewSettings[key]}
//                     onChange={(e) =>
//                       setViewSettings({
//                         ...viewSettings,
//                         [key]: e.target.checked,
//                       })
//                     }
//                     className="w-4 h-4 text-indigo-600"
//                   />
//                   <span className="text-xs font-bold text-slate-600 uppercase">
//                     {key.replace("show_", "").replace(/_/g, " ")}
//                   </span>
//                 </label>
//               ))}
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

//       {/* --- MODAL 3: MANUAL ENTRY FORM WITH MULTIPLE ITEMS --- */}
//       {isFormModalOpen && (
//         <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
//             <div className="flex justify-between items-center px-6 py-4 border-b border-stone-100 bg-stone-50 rounded-t-2xl">
//               <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
//                 <i className="fas fa-edit text-[#a66a4f]"></i>{" "}
//                 {editMode ? "Edit Order Line Item" : "Create New Order"}
//               </h2>
//               <button
//                 onClick={() => setFormModalOpen(false)}
//                 className="text-stone-400 hover:text-red-500 transition-colors"
//               >
//                 <i className="fas fa-times text-xl"></i>
//               </button>
//             </div>

//             <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
//               <form
//                 id="orderForm"
//                 onSubmit={handleFormSubmit}
//                 className="flex flex-col gap-6 w-full"
//               >
//                 {/* --- HEADER SECTION --- */}
//                 <div className="bg-stone-50 p-5 rounded-xl border border-stone-200">
//                   <h3 className="text-xs font-extrabold text-stone-600 uppercase tracking-widest mb-4 border-b border-stone-200 pb-2">
//                     <i className="fas fa-info-circle mr-1"></i> Order Details
//                     (Header)
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//                     <div>
//                       <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
//                         Order ID *
//                       </label>
//                       <input
//                         type="text"
//                         name="order_id"
//                         required
//                         value={headerData.order_id}
//                         onChange={handleHeaderChange}
//                         disabled={editMode}
//                         className="w-full bg-white border border-stone-200 p-2 rounded-lg outline-none text-[13px] font-bold text-indigo-600 disabled:opacity-50"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
//                         Txn Date
//                       </label>
//                       <input
//                         type="date"
//                         name="txn_date"
//                         required
//                         value={headerData.txn_date}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-stone-200 p-2 rounded-lg outline-none text-[13px]"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
//                         Merchant
//                       </label>
//                       <select
//                         name="merchant"
//                         value={headerData.merchant}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-stone-200 p-2 rounded-lg outline-none text-[13px]"
//                       >
//                         <option value="">Select Merchant</option>
//                         {masterMerchants.map((m) => (
//                           <option key={m.id} value={m.name}>
//                             {m.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
//                         Merchant ID
//                       </label>
//                       <input
//                         type="text"
//                         name="merchant_id"
//                         value={headerData.merchant_id}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-stone-200 p-2 rounded-lg outline-none text-[13px]"
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
//                         Firm
//                       </label>
//                       <select
//                         name="firm"
//                         value={headerData.firm}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-stone-200 p-2 rounded-lg outline-none text-[13px]"
//                       >
//                         <option value="">Select Firm</option>
//                         {masterFirms.map((f) => (
//                           <option key={f.id} value={f.name}>
//                             {f.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
//                         Location
//                       </label>
//                       <select
//                         name="location"
//                         value={headerData.location}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-stone-200 p-2 rounded-lg outline-none text-[13px]"
//                       >
//                         <option value="">Select Location</option>
//                         {masterLocations.map((l) => (
//                           <option key={l.id} value={l.name}>
//                             {l.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
//                         Txn Detail
//                       </label>
//                       <input
//                         type="text"
//                         name="txn_detail"
//                         value={headerData.txn_detail}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-stone-200 p-2 rounded-lg outline-none text-[13px]"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* --- LINE ITEMS SECTION --- */}
//                 <div>
//                   <h3 className="text-xs font-extrabold text-[#a66a4f] uppercase tracking-widest mb-3 flex items-center justify-between">
//                     <span>
//                       <i className="fas fa-box-open mr-1"></i> Product Line
//                       Items
//                     </span>
//                   </h3>
//                   {itemsData.map((item, index) => (
//                     <div
//                       key={index}
//                       className="bg-white p-5 rounded-xl border border-stone-200 mb-4 shadow-sm relative group"
//                     >
//                       {!editMode && itemsData.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveItem(index)}
//                           className="absolute top-3 right-3 text-stone-400 hover:text-red-500 bg-stone-50 hover:bg-red-50 w-7 h-7 rounded-full flex items-center justify-center transition-all"
//                         >
//                           <i className="fas fa-trash-alt text-[11px]"></i>
//                         </button>
//                       )}
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
//                         <div>
//                           <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
//                             ASIN / FSN
//                           </label>
//                           <select
//                             name="asin_fsn"
//                             value={item.asin_fsn}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-stone-50 border border-stone-200 p-2 rounded-lg outline-none text-[13px] font-mono font-bold text-indigo-600"
//                           >
//                             <option value="">Select ASN/FSN</option>
//                             {masterModels.map((m) => (
//                               <option key={m.id} value={m.asin_fsn}>
//                                 {m.asin_fsn}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
//                             Model Name
//                           </label>
//                           <input
//                             type="text"
//                             value={item.model_name}
//                             readOnly
//                             placeholder="Auto-filled"
//                             className="w-full bg-stone-100 border border-stone-200 p-2 rounded-lg outline-none text-[13px] font-semibold text-stone-500 cursor-not-allowed"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
//                             Model Number
//                           </label>
//                           <input
//                             type="text"
//                             value={item.model_no}
//                             readOnly
//                             placeholder="Auto-filled"
//                             className="w-full bg-stone-100 border border-stone-200 p-2 rounded-lg outline-none text-[13px] font-semibold text-stone-500 cursor-not-allowed"
//                           />
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
//                         <div>
//                           <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
//                             Status
//                           </label>
//                           <select
//                             name="order_status"
//                             value={item.order_status}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-stone-50 border border-stone-200 text-stone-700 font-bold p-2 rounded-lg outline-none text-[13px]"
//                           >
//                             <option value="Delivered">Delivered</option>
//                             <option value="Partially Delivered">
//                               Partially Delivered
//                             </option>
//                             <option value="Cancelled">Cancelled</option>
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
//                             Qty
//                           </label>
//                           <input
//                             type="number"
//                             min="1"
//                             name="order_qty"
//                             value={item.order_qty}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-stone-50 border border-stone-200 p-2 rounded-lg outline-none text-[13px] font-bold"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
//                             Order Amt (₹)
//                           </label>
//                           <input
//                             type="number"
//                             step="0.01"
//                             name="order_amount"
//                             value={item.order_amount}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-stone-50 border border-stone-200 p-2 rounded-lg outline-none text-[13px] font-bold text-stone-700"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
//                             Payment Amt (₹)
//                           </label>
//                           <input
//                             type="number"
//                             step="0.01"
//                             name="payment_amount"
//                             value={item.payment_amount}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-emerald-50 border border-emerald-200 p-2 rounded-lg outline-none text-[13px] font-bold text-emerald-700"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
//                             Unit Price
//                           </label>
//                           <input
//                             type="text"
//                             disabled
//                             value={`₹ ${item.unit_price}`}
//                             className="w-full bg-stone-100 border border-stone-200 p-2 rounded-lg outline-none text-[13px] font-bold text-stone-500 cursor-not-allowed"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">
//                             Card Offer
//                           </label>
//                           <input
//                             type="text"
//                             disabled
//                             value={`₹ ${item.card_offer}`}
//                             className="w-full bg-purple-50 border border-purple-200 p-2 rounded-lg outline-none text-[13px] font-bold text-purple-600 cursor-not-allowed"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                   {!editMode && (
//                     <button
//                       type="button"
//                       onClick={handleAddItem}
//                       className="mt-2 text-[#a66a4f] hover:text-white border-2 border-[#a66a4f] hover:bg-[#a66a4f] px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
//                     >
//                       <i className="fas fa-plus"></i> Add Another Item
//                     </button>
//                   )}
//                 </div>
//               </form>
//             </div>

//             <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex justify-end gap-3 rounded-b-2xl">
//               <button
//                 type="button"
//                 onClick={() => setFormModalOpen(false)}
//                 className="px-6 py-2 bg-stone-200 text-stone-700 font-bold rounded-lg hover:bg-stone-300 transition text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="orderForm"
//                 disabled={loading}
//                 className="px-8 py-2 bg-gradient-to-r from-[#b7795f] to-[#9e5a42] hover:opacity-90 text-white rounded-lg font-bold shadow-md transition flex items-center gap-2 text-sm"
//               >
//                 {loading ? (
//                   <>
//                     <i className="fas fa-spinner fa-spin"></i> Saving...
//                   </>
//                 ) : editMode ? (
//                   "Update Item"
//                 ) : (
//                   `Save ${itemsData.length} Item(s)`
//                 )}
//               </button>
//             </div>
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

// --- DATE FORMATTER ---
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
};

export default function OrdersReport() {
  const [orders, setOrders] = useState([]);

  // Pagination & Search States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [jumpPage, setJumpPage] = useState("");

  // 🔥 NAYA STATE: GLOBAL SEARCH
  const [globalSearch, setGlobalSearch] = useState("");

  // Modal States
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Master Data States
  const [masterFirms, setMasterFirms] = useState([]);
  const [masterLocations, setMasterLocations] = useState([]);
  const [masterMerchants, setMasterMerchants] = useState([]);
  const [masterModels, setMasterModels] = useState([]);

  const role = localStorage.getItem("user_role") || "USER";

  const initialHeaderState = {
    order_id: "",
    txn_date: "",
    month: "",
    day: "",
    merchant: "",
    merchant_id: "",
    firm: "",
    location: "",
    txn_detail: "",
  };

  const initialItemState = {
    asin_fsn: "",
    model_name: "",
    model_no: "",
    order_status: "Open", // 🔥 DEFAULT AB 'Open' RAHEGA
    order_qty: 1,
    order_amount: "",
    unit_price: "0.00",
    payment_amount: "",
    card_offer: "0.00",
  };

  const [headerData, setHeaderData] = useState(initialHeaderState);
  const [itemsData, setItemsData] = useState([{ ...initialItemState }]);

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
        const [fRes, lRes, mRes, modRes] = await Promise.all([
          api.get("reports/firms/"),
          api.get("reports/locations/"),
          api.get("reports/merchants/"),
          api.get("reports/models/"),
        ]);
        setMasterFirms(fRes.data);
        setMasterLocations(lRes.data);
        setMasterMerchants(mRes.data);
        setMasterModels(modRes.data);
      } catch (error) {
        console.error("Master fetch error:", error);
      }
    };
    fetchMasters();
  }, []);

  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, v]) => v !== ""),
      );
      queryParams.append("page", currentPage);

      // 🔥 SEARCH QUERY BHEJNA API KO
      if (globalSearch.trim()) {
        queryParams.append("search", globalSearch.trim());
      }

      const [dataRes, settingsRes] = await Promise.all([
        api.get(`reports/orders/?${queryParams.toString()}`),
        api.get("reports/column-policy/?policy_name=user_view_policy"),
      ]);

      const records = dataRes.data.results || dataRes.data;
      const count = dataRes.data.count || records.length;

      setOrders(records);
      setTotalRecords(count);

      if (settingsRes.data) setViewSettings(settingsRes.data);
    } catch (error) {
      console.error("Fetch data error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, currentPage]);

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    let newHeader = { ...headerData, [name]: value };

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
      newHeader.day = days[dateObj.getDay()];
      newHeader.month = months[dateObj.getMonth()];
    }
    setHeaderData(newHeader);
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...itemsData];
    let item = { ...updatedItems[index], [name]: value };

    if (name === "asin_fsn") {
      const selectedModel = masterModels.find((m) => m.asin_fsn === value);
      if (selectedModel) {
        item.model_name = selectedModel.model_name;
        item.model_no = selectedModel.model;
      } else {
        item.model_name = "";
        item.model_no = "";
      }
    }

    const amt = name === "order_amount" ? value : item.order_amount;
    const qty = name === "order_qty" ? value : item.order_qty;
    const pay = name === "payment_amount" ? value : item.payment_amount;

    if (amt && qty && Number(qty) > 0)
      item.unit_price = (Number(amt) / Number(qty)).toFixed(2);
    else item.unit_price = "0.00";

    if (pay && amt)
      item.card_offer = Math.abs(Number(amt) - Number(pay)).toFixed(2);
    else item.card_offer = "0.00";

    updatedItems[index] = item;
    setItemsData(updatedItems);
  };

  const handleAddItem = () =>
    setItemsData([...itemsData, { ...initialItemState }]);
  const handleRemoveItem = (index) =>
    setItemsData(itemsData.filter((_, i) => i !== index));

  const handleEditClick = (order) => {
    const {
      order_id,
      txn_date,
      month,
      day,
      merchant,
      merchant_id,
      firm,
      location,
      txn_detail,
      ...itemDetails
    } = order;
    setHeaderData({
      order_id,
      txn_date,
      month,
      day,
      merchant,
      merchant_id,
      firm,
      location,
      txn_detail,
    });
    setItemsData([itemDetails]);
    setEditId(order.id);
    setEditMode(true);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode) {
        const payload = { ...headerData, ...itemsData[0] };
        await api.put(`reports/orders/${editId}/`, payload);
        alert("Record updated successfully!");
      } else {
        const payloads = itemsData.map((item) => ({ ...headerData, ...item }));
        await Promise.all(
          payloads.map((payload) => api.post("reports/orders/", payload)),
        );
        alert(
          `${payloads.length} item(s) saved successfully under Order ID ${headerData.order_id}!`,
        );
      }
      setFormModalOpen(false);
      setHeaderData(initialHeaderState);
      setItemsData([{ ...initialItemState }]);
      setEditMode(false);
      fetchData();
    } catch (error) {
      console.error("Save Error:", error);

      // 🔥 BACKEND SE EXACT ERROR NIKALNE KA SMART LOGIC 🔥
      let backendError = "Error saving records. Please check the data.";
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          backendError = error.response.data;
        } else if (error.response.data.error) {
          backendError = error.response.data.error;
        } else {
          // Agar DRF field validation errors bhejta hai (e.g. { order_id: ["..."] })
          backendError = Object.entries(error.response.data)
            .map(
              ([field, msgs]) =>
                `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`,
            )
            .join("\n");
        }
      }
      alert(backendError); // Ab exact error alert me dikhega
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
      await api.put(
        "reports/column-policy/?policy_name=user_view_policy",
        viewSettings,
      );
      alert("User View Configuration Updated!");
      setViewModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Failed to save view settings.");
    }
  };

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
    setCurrentPage(1);
    setFilterModalOpen(false);
  };

  const showCol = (colName) => {
    if (role === "ADMIN") return true;
    return viewSettings[colName] !== false;
  };

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
      const res = await api.post("reports/orders/upload/", data);
      alert(res.data.message || "Excel Uploaded Successfully!");
      setUploadModalOpen(false);
      setFile(null);
      setCurrentPage(1);
      fetchData();
    } catch (error) {
      alert(
        "Upload Failed: " + (error.response?.data?.error || "Unknown Error"),
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NAYA BADGE COLOR LOGIC
  const getBadgeColor = (status) => {
    const s = String(status || "")
      .trim()
      .toLowerCase();
    if (s === "open") return "bg-blue-50 text-blue-600 border-blue-200";
    if (s === "complete")
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-10">
      {/* --- DASHBOARD HEADER & ACTIONS AREA --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Orders Report
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage, filter, and track business shipments
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* SEARCH BAR */}
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mr-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
            <input
              type="text"
              placeholder="Search anything..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchData()}
              className="px-4 py-2.5 outline-none text-sm w-48 md:w-64 text-slate-700 font-medium"
            />
            <button
              onClick={() => {
                setCurrentPage(1);
                fetchData();
              }}
              className="bg-slate-50 border-l border-slate-200 px-4 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>

          {/* 🔥 NAYA LIVE CLEAR ALL BUTTON 🔥 */}
          {/* Ye button tabhi dikhega jab search box me kuch ho YA koi filter lga ho */}
          {(globalSearch.trim() !== "" ||
            Object.values(filters).some((x) => x !== "")) && (
            <button
              onClick={() => {
                setGlobalSearch(""); // Search clear karo
                setFilters({
                  start_date: "",
                  end_date: "",
                  firm: "",
                  location: "",
                  model_no: "",
                  txn_detail: "",
                  order_status: "",
                }); // Saare filters reset karo
                setCurrentPage(1); // Page 1 par wapas bhejo

                // Kyunki setFilters badalne par useEffect automatically fetchData() call kar dega,
                // isliye yahan alag se fetch call karne ki zaroorat nahi hai.
              }}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl font-bold text-sm transition flex items-center shadow-sm"
              title="Clear all active search and filters"
            >
              <i className="fas fa-undo-alt mr-2"></i> Clear All
            </button>
          )}

          <button
            onClick={() => setFilterModalOpen(true)}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition flex items-center"
          >
            <i className="fas fa-filter mr-2 text-indigo-500"></i> Filter
            {Object.values(filters).some((x) => x !== "") && (
              <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {role === "ADMIN" && (
            <button
              onClick={() => setViewModalOpen(true)}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition flex items-center"
            >
              <i className="fas fa-eye-slash mr-2 text-purple-600"></i> View
              Setup
            </button>
          )}

          <button
            onClick={() => {
              setHeaderData(initialHeaderState);
              setItemsData([{ ...initialItemState }]);
              setEditMode(false);
              setFormModalOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-500/20 transition flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> New Entry
          </button>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-emerald-500/20 transition flex items-center"
          >
            <i className="fas fa-file-excel mr-2"></i> Upload Excel
          </button>
        </div>
      </div>

      {/* --- MAIN TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh] min-h-[55vh] custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider sticky top-0 z-10">
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

                {/* STATUS SHIFTED BEFORE ACTIONS */}
                {showCol("show_order_status") && (
                  <th className="p-4 text-center">Status</th>
                )}

                {/* ACTIONS COLUMN AB DONO (USER & ADMIN) KO DIKHEGA */}
                <th className="p-4 text-center bg-slate-100 border-l border-slate-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="21"
                    className="p-10 text-center text-slate-400 font-medium"
                  >
                    No records match your filters/search.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4 text-center font-mono text-xs font-bold text-slate-400">
                      {((currentPage - 1) * 50 + index + 1)
                        .toString()
                        .padStart(2, "0")}
                    </td>
                    {showCol("show_order_id") && (
                      <td className="p-4 font-bold text-indigo-600">
                        {order.order_id}
                      </td>
                    )}
                    {showCol("show_txn_date") && (
                      <td className="p-4 text-slate-600 font-medium">
                        {formatDate(order.txn_date)}
                      </td>
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
                        className="p-4 text-slate-800 font-medium max-w-[150px] truncate"
                        title={order.model_name}
                      >
                        {order.model_name}
                      </td>
                    )}
                    {showCol("show_model_no") && (
                      <td className="p-4 text-slate-600">{order.model_no}</td>
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

                    {/* 🔥 DYNAMIC STATUS BADGE SHIFTED BEFORE ACTIONS */}
                    {showCol("show_order_status") && (
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-sm ${getBadgeColor(order.order_status)}`}
                        >
                          {order.order_status || "Open"}
                        </span>
                      </td>
                    )}

                    {/* 🔥 ACTIONS COLUMN AB DONO KO DIKHEGA */}
                    <td className="p-4 text-center border-l border-slate-100 bg-slate-50/50">
                      <div className="flex items-center justify-center gap-3">
                        {/* 👁️ VIEW BUTTON (User + Admin Dono ke liye) */}
                        <button
                          onClick={() => handleViewClick(order.order_id)}
                          className="text-slate-400 hover:text-indigo-600 transition hover:scale-110"
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>

                        {/* ✏️ 🗑️ EDIT & DELETE BUTTONS (Sirf Admin ke liye) */}
                        {role === "ADMIN" && (
                          <>
                            <button
                              onClick={() => handleEditClick(order)}
                              className="text-slate-400 hover:text-blue-600 transition hover:scale-110"
                              title="Edit Record"
                            >
                              <i className="fas fa-pen"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(order.id)}
                              className="text-slate-400 hover:text-red-600 transition hover:scale-110"
                              title="Delete Record"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* --- SMART PAGINATION BAR --- */}
      <div className="mt-4">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            Total Records:{" "}
            <span className="text-indigo-600 text-sm">{totalRecords}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 transition flex items-center"
            >
              <i className="fas fa-chevron-left mr-2"></i> Prev
            </button>
            <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-xs border border-indigo-200 shadow-sm">
              Page {currentPage} of {Math.ceil(totalRecords / 50) || 1}
            </span>
            <button
              disabled={currentPage >= Math.ceil(totalRecords / 50)}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 transition flex items-center"
            >
              Next <i className="fas fa-chevron-right ml-2"></i>
            </button>
            <div className="flex items-center ml-2 border-l border-slate-200 pl-4">
              <input
                type="number"
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                placeholder="Go to..."
                className="w-20 px-3 py-2 bg-white border border-slate-300 rounded-l-lg text-xs font-bold outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => {
                  const p = parseInt(jumpPage);
                  const maxPages = Math.ceil(totalRecords / 50) || 1;
                  if (p > 0 && p <= maxPages) {
                    setCurrentPage(p);
                    setJumpPage("");
                  } else {
                    alert(`Valid page between 1 and ${maxPages}`);
                  }
                }}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-r-lg transition"
              >
                GO
              </button>
            </div>
          </div>
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
                  {/* 🔥 UPDATED STATUS OPTIONS */}
                  <option value="">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="Complete">Complete</option>
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
                  setCurrentPage(1);
                  setFilterModalOpen(false);
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

      {/* --- MODAL 3: MANUAL ENTRY FORM WITH MULTIPLE ITEMS --- */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-stone-100 bg-stone-50 rounded-t-2xl">
              <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                <i className="fas fa-edit text-[#a66a4f]"></i>{" "}
                {editMode ? "Edit Order Line Item" : "Create New Order"}
              </h2>
              <button
                onClick={() => setFormModalOpen(false)}
                className="text-stone-400 hover:text-red-500 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
              <form
                id="orderForm"
                onSubmit={handleFormSubmit}
                className="flex flex-col gap-6 w-full"
              >
                {/* HEADER SECTION */}
                <div className="bg-stone-50 p-5 rounded-xl border border-stone-200">
                  <h3 className="text-xs font-extrabold text-stone-600 uppercase tracking-widest mb-4 border-b border-stone-200 pb-2">
                    <i className="fas fa-info-circle mr-1"></i> Order Details
                    (Header)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                        Order ID *
                      </label>
                      <input
                        type="text"
                        name="order_id"
                        required
                        value={headerData.order_id}
                        onChange={handleHeaderChange}
                        disabled={editMode}
                        className="w-full bg-white border border-stone-200 p-2 rounded-lg outline-none text-[13px] font-bold text-indigo-600 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                        Txn Date
                      </label>
                      <input
                        type="date"
                        name="txn_date"
                        required
                        value={headerData.txn_date}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-stone-200 p-2 rounded-lg outline-none text-[13px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                        Merchant
                      </label>
                      <select
                        name="merchant"
                        value={headerData.merchant}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-stone-200 p-2 rounded-lg outline-none text-[13px]"
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
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                        Merchant ID
                      </label>
                      <input
                        type="text"
                        name="merchant_id"
                        value={headerData.merchant_id}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-stone-200 p-2 rounded-lg outline-none text-[13px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                        Firm
                      </label>
                      <select
                        name="firm"
                        value={headerData.firm}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-stone-200 p-2 rounded-lg outline-none text-[13px]"
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
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                        Location
                      </label>
                      <select
                        name="location"
                        value={headerData.location}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-stone-200 p-2 rounded-lg outline-none text-[13px]"
                      >
                        <option value="">Select Location</option>
                        {masterLocations.map((l) => (
                          <option key={l.id} value={l.name}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                        Txn Detail
                      </label>
                      <input
                        type="text"
                        name="txn_detail"
                        value={headerData.txn_detail}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-stone-200 p-2 rounded-lg outline-none text-[13px]"
                      />
                    </div>
                  </div>
                </div>

                {/* LINE ITEMS SECTION */}
                <div>
                  <h3 className="text-xs font-extrabold text-[#a66a4f] uppercase tracking-widest mb-3 flex items-center justify-between">
                    <span>
                      <i className="fas fa-box-open mr-1"></i> Product Line
                      Items
                    </span>
                  </h3>
                  {itemsData.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-5 rounded-xl border border-stone-200 mb-4 shadow-sm relative group"
                    >
                      {!editMode && itemsData.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="absolute top-3 right-3 text-stone-400 hover:text-red-500 bg-stone-50 hover:bg-red-50 w-7 h-7 rounded-full flex items-center justify-center transition-all"
                        >
                          <i className="fas fa-trash-alt text-[11px]"></i>
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                            ASIN / FSN
                          </label>
                          <select
                            name="asin_fsn"
                            value={item.asin_fsn}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-stone-50 border border-stone-200 p-2 rounded-lg outline-none text-[13px] font-mono font-bold text-indigo-600"
                          >
                            <option value="">Select ASN/FSN</option>
                            {masterModels.map((m) => (
                              <option key={m.id} value={m.asin_fsn}>
                                {m.asin_fsn}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                            Model Name
                          </label>
                          <input
                            type="text"
                            value={item.model_name}
                            readOnly
                            placeholder="Auto-filled"
                            className="w-full bg-stone-100 border border-stone-200 p-2 rounded-lg outline-none text-[13px] font-semibold text-stone-500 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                            Model Number
                          </label>
                          <input
                            type="text"
                            value={item.model_no}
                            readOnly
                            placeholder="Auto-filled"
                            className="w-full bg-stone-100 border border-stone-200 p-2 rounded-lg outline-none text-[13px] font-semibold text-stone-500 cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                            Status
                          </label>
                          <select
                            name="order_status"
                            value={item.order_status}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-stone-50 border border-stone-200 text-stone-700 font-bold p-2 rounded-lg outline-none text-[13px]"
                          >
                            {/* 🔥 UPDATED STATUS OPTIONS */}
                            <option value="Open">Open</option>
                            <option value="Complete">Complete</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                            Qty
                          </label>
                          <input
                            type="number"
                            min="1"
                            name="order_qty"
                            value={item.order_qty}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-stone-50 border border-stone-200 p-2 rounded-lg outline-none text-[13px] font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                            Order Amt (₹)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="order_amount"
                            value={item.order_amount}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-stone-50 border border-stone-200 p-2 rounded-lg outline-none text-[13px] font-bold text-stone-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">
                            Payment Amt (₹)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="payment_amount"
                            value={item.payment_amount}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-emerald-50 border border-emerald-200 p-2 rounded-lg outline-none text-[13px] font-bold text-emerald-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                            Unit Price
                          </label>
                          <input
                            type="text"
                            disabled
                            value={`₹ ${item.unit_price}`}
                            className="w-full bg-stone-100 border border-stone-200 p-2 rounded-lg outline-none text-[13px] font-bold text-stone-500 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-purple-600 uppercase tracking-widest mb-1">
                            Card Offer
                          </label>
                          <input
                            type="text"
                            disabled
                            value={`₹ ${item.card_offer}`}
                            className="w-full bg-purple-50 border border-purple-200 p-2 rounded-lg outline-none text-[13px] font-bold text-purple-600 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {!editMode && (
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="mt-2 text-[#a66a4f] hover:text-white border-2 border-[#a66a4f] hover:bg-[#a66a4f] px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                    >
                      <i className="fas fa-plus"></i> Add Another Item
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setFormModalOpen(false)}
                className="px-6 py-2 bg-stone-200 text-stone-700 font-bold rounded-lg hover:bg-stone-300 transition text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="orderForm"
                disabled={loading}
                className="px-8 py-2 bg-gradient-to-r from-[#b7795f] to-[#9e5a42] hover:opacity-90 text-white rounded-lg font-bold shadow-md transition flex items-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Saving...
                  </>
                ) : editMode ? (
                  "Update Item"
                ) : (
                  `Save ${itemsData.length} Item(s)`
                )}
              </button>
            </div>
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