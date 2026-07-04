// import React, { useState, useEffect } from "react";
// import api from "../api/axios";
// import Swal from "sweetalert2";

// // --- DATE FORMATTER ---
// const formatDate = (dateStr) => {
//   if (!dateStr) return "-";
//   const parts = dateStr.split("-");
//   if (parts.length === 3 && parts[0].length === 4) {
//     return `${parts[2]}-${parts[1]}-${parts[0]}`;
//   }
//   return dateStr;
// };

// export default function OrdersReport() {
//   const [orders, setOrders] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [jumpPage, setJumpPage] = useState("");
//   const [globalSearch, setGlobalSearch] = useState("");

//   // Modals States
//   const [isUploadModalOpen, setUploadModalOpen] = useState(false);
//   const [isFormModalOpen, setFormModalOpen] = useState(false);
//   const [isFilterModalOpen, setFilterModalOpen] = useState(false);
//   const [isViewSetupModalOpen, setViewSetupModalOpen] = useState(false); // Admin Column Policy
//   const [isViewSummaryModalOpen, setViewSummaryModalOpen] = useState(false); // 19 Boxes Summary Modal
//   const [viewSummaryData, setViewSummaryData] = useState(null); // Summary API Data

//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [masterFirms, setMasterFirms] = useState([]);
//   const [masterLocations, setMasterLocations] = useState([]);
//   const [masterMerchants, setMasterMerchants] = useState([]);
//   const [masterModels, setMasterModels] = useState([]);

//   const role = localStorage.getItem("user_role") || "USER";

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
//     order_status: "Open",
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

//   const fetchData = async () => {
//     try {
//       const queryParams = new URLSearchParams(
//         Object.entries(filters).filter(([_, v]) => v !== ""),
//       );
//       queryParams.append("page", currentPage);
//       if (globalSearch.trim())
//         queryParams.append("search", globalSearch.trim());

//       const [dataRes, settingsRes] = await Promise.all([
//         api.get(`reports/orders/?${queryParams.toString()}`),
//         api.get("reports/column-policy/?policy_name=user_view_policy"),
//       ]);

//       const records = dataRes.data.results || dataRes.data;
//       setOrders(records);
//       setTotalRecords(dataRes.data.count || records.length);
//       if (settingsRes.data) setViewSettings(settingsRes.data);
//     } catch (error) {
//       console.error("Fetch data error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filters, currentPage]);

//   const handleHeaderChange = (e) => {
//     const { name, value } = e.target;
//     let newHeader = { ...headerData, [name]: value };
//     if (name === "txn_date" && value) {
//       const dateObj = new Date(value);
//       newHeader.day = [
//         "Sunday",
//         "Monday",
//         "Tuesday",
//         "Wednesday",
//         "Thursday",
//         "Friday",
//         "Saturday",
//       ][dateObj.getDay()];
//       newHeader.month = [
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
//       ][dateObj.getMonth()];
//     }
//     setHeaderData(newHeader);
//   };

//   const handleItemChange = (index, e) => {
//     const { name, value } = e.target;
//     const updatedItems = [...itemsData];
//     let item = { ...updatedItems[index], [name]: value };

//     if (name === "asin_fsn") {
//       const selectedModel = masterModels.find((m) => m.asin_fsn === value);
//       item.model_name = selectedModel ? selectedModel.model_name : "";
//       item.model_no = selectedModel ? selectedModel.model : "";
//     }

//     const amt = name === "order_amount" ? value : item.order_amount;
//     const qty = name === "order_qty" ? value : item.order_qty;
//     const pay = name === "payment_amount" ? value : item.payment_amount;

//     item.unit_price =
//       amt && qty && Number(qty) > 0
//         ? (Number(amt) / Number(qty)).toFixed(2)
//         : "0.00";
//     item.card_offer =
//       pay && amt ? Math.abs(Number(amt) - Number(pay)).toFixed(2) : "0.00";

//     updatedItems[index] = item;
//     setItemsData(updatedItems);
//   };

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

//   // 🔥 VIEW BUTTON SUMMARY FETCH
//   const handleViewClick = async (orderId) => {
//     try {
//       const res = await api.get(`reports/order-summary/${orderId}/`);
//       setViewSummaryData(res.data);
//       setViewSummaryModalOpen(true);
//       fetchData(); // 🔥 NAYI LINE: Ye background me table ko refresh kar degi taaki dono status Complete dikhein!
//     } catch (error) {
//       Swal.fire("Error fetching order summary. Please check your connection.");
//     }
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       if (editMode) {
//         await api.put(`reports/orders/${editId}/`, {
//           ...headerData,
//           ...itemsData[0],
//         });
//         Swal.fire("Record updated successfully!");
//       } else {
//         const payloads = itemsData.map((item) => ({ ...headerData, ...item }));
//         await Promise.all(
//           payloads.map((payload) => api.post("reports/orders/", payload)),
//         );
//         Swal.fire(`${payloads.length} item(s) saved successfully!`);
//       }
//       setFormModalOpen(false);
//       setHeaderData(initialHeaderState);
//       setItemsData([{ ...initialItemState }]);
//       setEditMode(false);
//       fetchData();
//     } catch (error) {
//       // 🔥 NAYA ERROR HANDLING LOGIC
//       if (error.response && error.response.data) {
//         // Agar backend ne humara custom "error" bheja hai (Combo duplicate ka)
//         if (error.response.data.error) {
//           Swal.fire(error.response.data.error);
//         }
//         // Agar serializer ka default error hai
//         else {
//           Swal.fire("Data validation failed. Please check your inputs.");
//           console.error("Backend errors:", error.response.data);
//         }
//       } else {
//         Swal.fire("Error saving record. Please check your connection.");
//       }
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
//         Swal.fire("Access Denied.");
//       }
//     }
//   };

//   const handleSaveViewSettings = async () => {
//     try {
//       await api.put(
//         "reports/column-policy/?policy_name=user_view_policy",
//         viewSettings,
//       );
//       Swal.fire("User View Updated!");
//       setViewSetupModalOpen(false);
//       fetchData();
//     } catch (error) {
//       Swal.fire("Failed to save view settings.");
//     }
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
//       const res = await api.post("reports/orders/upload/", data);
//       Swal.fire(res.data.message || "Excel Uploaded Successfully!");
//       setUploadModalOpen(false);
//       setFile(null);
//       setCurrentPage(1);
//       fetchData();
//     } catch (error) {
//       Swal.fire(
//         "Upload Failed: " + (error.response?.data?.error || "Unknown Error"),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const showCol = (colName) =>
//     role === "ADMIN" ? true : viewSettings[colName] !== false;
//   const getBadgeColor = (status) => {
//     const s = String(status || "")
//       .trim()
//       .toLowerCase();
//     if (s === "open") return "bg-blue-50 text-blue-600 border-blue-200";
//     if (s === "complete")
//       return "bg-emerald-50 text-emerald-600 border-emerald-200";
//     if (s === "cancelled") return "bg-red-50 text-red-600 border-red-200";
//     return "bg-slate-50 text-slate-600 border-slate-200";
//   };

//   return (
//     <div className="bg-[#f8fafc] min-h-screen font-sans pb-10">
//       {/* HEADER & TOP BUTTONS */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
//             Orders Report
//           </h1>
//           <p className="text-xs text-slate-500 mt-1">
//             Manage, filter, and track business shipments
//           </p>
//         </div>
//         <div className="flex flex-wrap gap-3 items-center">
//           <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mr-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
//             <input
//               type="text"
//               placeholder="Search anything..."
//               value={globalSearch}
//               onChange={(e) => setGlobalSearch(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && fetchData()}
//               className="px-4 py-2.5 outline-none text-sm w-48 md:w-64 text-slate-700 font-medium"
//             />
//             <button
//               onClick={() => {
//                 setCurrentPage(1);
//                 fetchData();
//               }}
//               className="bg-slate-50 border-l border-slate-200 px-4 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
//             >
//               <i className="fas fa-search"></i>
//             </button>
//           </div>
//           {(globalSearch.trim() !== "" ||
//             Object.values(filters).some((x) => x !== "")) && (
//             <button
//               onClick={() => {
//                 setGlobalSearch("");
//                 setFilters({
//                   start_date: "",
//                   end_date: "",
//                   firm: "",
//                   location: "",
//                   model_no: "",
//                   txn_detail: "",
//                   order_status: "",
//                 });
//                 setCurrentPage(1);
//               }}
//               className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl font-bold text-sm transition flex items-center shadow-sm"
//             >
//               <i className="fas fa-undo-alt mr-2"></i> Clear All
//             </button>
//           )}
//           <button
//             onClick={() => setFilterModalOpen(true)}
//             className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition flex items-center"
//           >
//             <i className="fas fa-filter mr-2 text-indigo-500"></i> Filter{" "}
//             {Object.values(filters).some((x) => x !== "") && (
//               <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
//             )}
//           </button>
//           {role === "ADMIN" && (
//             <button
//               onClick={() => setViewSetupModalOpen(true)}
//               className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition flex items-center"
//             >
//               <i className="fas fa-eye-slash mr-2 text-purple-600"></i> View
//               Setup
//             </button>
//           )}
//           <button
//             onClick={() => {
//               setHeaderData(initialHeaderState);
//               setItemsData([{ ...initialItemState }]);
//               setEditMode(false);
//               setFormModalOpen(true);
//             }}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition flex items-center"
//           >
//             <i className="fas fa-plus mr-2"></i> New Entry
//           </button>
//           <button
//             onClick={() => setUploadModalOpen(true)}
//             className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition flex items-center"
//           >
//             <i className="fas fa-file-excel mr-2"></i> Upload Excel
//           </button>
//         </div>
//       </div>

//       {/* MAIN TABLE */}
//       <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//         <div className="overflow-x-auto max-h-[70vh] min-h-[55vh] custom-scrollbar">
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
//                 {showCol("show_order_status") && (
//                   <th className="p-4 text-center">Status</th>
//                 )}
//                 <th className="p-4 text-center bg-slate-100 border-l border-slate-200">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50 text-sm">
//               {orders.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="21"
//                     className="p-10 text-center text-slate-400 font-medium"
//                   >
//                     No records match your filters/search.
//                   </td>
//                 </tr>
//               ) : (
//                 orders.map((order, index) => {
//                   if (!order) return null;
//                   return (
//                     <tr
//                       key={order?.id || index}
//                       className="hover:bg-slate-50/50 transition-colors"
//                     >
//                       <td className="p-4 text-center font-mono text-xs font-bold text-slate-400">
//                         {((currentPage - 1) * 50 + index + 1)
//                           .toString()
//                           .padStart(2, "0")}
//                       </td>
//                       {showCol("show_order_id") && (
//                         <td className="p-4 font-bold text-indigo-600">
//                           {order?.order_id || "-"}
//                         </td>
//                       )}
//                       {showCol("show_txn_date") && (
//                         <td className="p-4 text-slate-600 font-medium">
//                           {formatDate(order?.txn_date)}
//                         </td>
//                       )}
//                       {showCol("show_month") && (
//                         <td className="p-4 text-slate-600 capitalize">
//                           {order?.month || "-"}
//                         </td>
//                       )}
//                       {showCol("show_day") && (
//                         <td className="p-4 text-slate-600">
//                           {order?.day || "-"}
//                         </td>
//                       )}
//                       {showCol("show_txn_detail") && (
//                         <td
//                           className="p-4 max-w-[150px] truncate text-slate-600"
//                           title={order?.txn_detail}
//                         >
//                           {order?.txn_detail || "-"}
//                         </td>
//                       )}
//                       {showCol("show_merchant") && (
//                         <td className="p-4 text-slate-800 font-medium">
//                           {order?.merchant || "-"}
//                         </td>
//                       )}
//                       {showCol("show_merchant_id") && (
//                         <td className="p-4 text-slate-500 font-mono text-xs">
//                           {order?.merchant_id || "-"}
//                         </td>
//                       )}
//                       {showCol("show_firm") && (
//                         <td className="p-4 font-bold text-slate-800">
//                           {order?.firm || "-"}
//                         </td>
//                       )}
//                       {showCol("show_location") && (
//                         <td className="p-4 text-slate-600">
//                           {order?.location || "-"}
//                         </td>
//                       )}
//                       {showCol("show_asin_fsn") && (
//                         <td className="p-4 text-xs font-mono text-slate-500">
//                           {order?.asin_fsn || "-"}
//                         </td>
//                       )}
//                       {showCol("show_model_name") && (
//                         <td
//                           className="p-4 text-slate-800 font-medium "
//                           title={order?.model_name}
//                         >
//                           {order?.model_name || "-"}
//                         </td>
//                       )}
//                       {showCol("show_model_no") && (
//                         <td className="p-4 text-slate-600">
//                           {order?.model_no || "-"}
//                         </td>
//                       )}
//                       {showCol("show_order_qty") && (
//                         <td className="p-4 text-center font-bold text-slate-700">
//                           {order?.order_qty || "0"}
//                         </td>
//                       )}
//                       {showCol("show_order_amount") && (
//                         <td className="p-4 text-right text-slate-700">
//                           ₹
//                           {parseFloat(order?.order_amount || 0).toLocaleString(
//                             "en-IN",
//                           )}
//                         </td>
//                       )}
//                       {showCol("show_unit_price") && (
//                         <td className="p-4 text-right text-slate-500">
//                           ₹
//                           {parseFloat(order?.unit_price || 0).toLocaleString(
//                             "en-IN",
//                           )}
//                         </td>
//                       )}
//                       {showCol("show_payment_amount") && (
//                         <td className="p-4 text-right font-bold text-emerald-600">
//                           ₹
//                           {parseFloat(
//                             order?.payment_amount || 0,
//                           ).toLocaleString("en-IN")}
//                         </td>
//                       )}
//                       {showCol("show_card_offer") && (
//                         <td className="p-4 text-right font-black text-purple-600 bg-purple-50/30">
//                           ₹
//                           {parseFloat(order?.card_offer || 0).toLocaleString(
//                             "en-IN",
//                           )}
//                         </td>
//                       )}
//                       {showCol("show_order_status") && (
//                         <td className="p-4 text-center">
//                           <span
//                             className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-sm ${getBadgeColor(order?.order_status)}`}
//                           >
//                             {order?.order_status || "Open"}
//                           </span>
//                         </td>
//                       )}
//                       <td className="p-4 text-center border-l border-slate-100 bg-slate-50/50">
//                         <div className="flex items-center justify-center gap-3">
//                           {/* 🔥 VIEW BUTTON (Available to both USER and ADMIN) */}
//                           <button
//                             onClick={() => handleViewClick(order?.id)}
//                             className="text-slate-400 hover:text-indigo-600 transition hover:scale-110"
//                             title="View Summary"
//                           >
//                             <i className="fas fa-eye"></i>
//                           </button>

//                           {/* 🔥 EDIT & DELETE BUTTONS (Available to ADMIN only) */}
//                           {role === "ADMIN" && (
//                             <>
//                               <button
//                                 onClick={() => handleEditClick(order)}
//                                 className="text-slate-400 hover:text-blue-600 transition hover:scale-110"
//                                 title="Edit Record"
//                               >
//                                 <i className="fas fa-pen"></i>
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(order?.id)}
//                                 className="text-slate-400 hover:text-red-600 transition hover:scale-110"
//                                 title="Delete Record"
//                               >
//                                 <i className="fas fa-trash-alt"></i>
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* PAGINATION */}
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
//               className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 transition flex items-center"
//             >
//               <i className="fas fa-chevron-left mr-2"></i> Prev
//             </button>
//             <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-xs border border-indigo-200 shadow-sm">
//               Page {currentPage} of {Math.ceil(totalRecords / 50) || 1}
//             </span>
//             <button
//               disabled={currentPage >= Math.ceil(totalRecords / 50)}
//               onClick={() => setCurrentPage((prev) => prev + 1)}
//               className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 transition flex items-center"
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
//                     Swal.fire(
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

//       {/* --- ALL MODALS --- */}

//       {/* 1. UPLOAD EXCEL MODAL */}
//       {isUploadModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
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
//               <div className="border-2 border-dashed border-slate-200 p-8 text-center rounded-2xl bg-slate-50 mb-6">
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
//                 className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md"
//               >
//                 {loading ? "Uploading..." : "Upload & Sync Data"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* 2. FILTER MODAL */}
//       {isFilterModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-3xl w-full max-w-3xl shadow-2xl">
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
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm font-medium"
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="Open">Open</option>
//                   <option value="Complete">Complete</option>
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
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm font-medium"
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
//                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm font-medium"
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
//             </div>
//             <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
//               <button
//                 onClick={() => {
//                   setFilters({
//                     start_date: "",
//                     end_date: "",
//                     firm: "",
//                     location: "",
//                     model_no: "",
//                     txn_detail: "",
//                     order_status: "",
//                   });
//                   setCurrentPage(1);
//                   setFilterModalOpen(false);
//                 }}
//                 className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200"
//               >
//                 Clear
//               </button>
//               <button
//                 onClick={() => {
//                   setCurrentPage(1);
//                   setFilterModalOpen(false);
//                 }}
//                 className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 3. ADMIN COLUMN VIEW SETUP MODAL */}
//       {isViewSetupModalOpen && role === "ADMIN" && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-3xl w-full max-w-3xl shadow-2xl">
//             <div className="flex justify-between items-center mb-5 border-b pb-3">
//               <h2 className="text-lg font-bold text-slate-800">
//                 <i className="fas fa-sliders-h mr-2 text-indigo-500"></i>{" "}
//                 Configure User View
//               </h2>
//               <button
//                 onClick={() => setViewSetupModalOpen(false)}
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
//                     className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-indigo-50 border border-slate-100"
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
//                 onClick={() => setViewSetupModalOpen(false)}
//                 className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveViewSettings}
//                 className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
//               >
//                 Save View
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 4. DATA ENTRY FORM MODAL */}
//       {isFormModalOpen && (
//         <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[95vh]">
//             <div className="flex justify-between items-center px-6 py-4 border-b border-stone-100 bg-stone-50 rounded-t-2xl">
//               <h2 className="text-lg font-bold text-stone-800">
//                 <i className="fas fa-edit text-[#a66a4f] mr-2"></i>{" "}
//                 {editMode ? "Edit Order" : "Create New Order"}
//               </h2>
//               <button
//                 onClick={() => setFormModalOpen(false)}
//                 className="text-stone-400 hover:text-red-500"
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
//                 <div className="bg-stone-50 p-5 rounded-xl border border-stone-200">
//                   <h3 className="text-xs font-extrabold text-stone-600 uppercase mb-4 border-b pb-2">
//                     Order Details
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//                     <div>
//                       <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
//                         Order ID *
//                       </label>
//                       <input
//                         type="text"
//                         name="order_id"
//                         required
//                         value={headerData.order_id}
//                         onChange={handleHeaderChange}
//                         disabled={editMode}
//                         className="w-full bg-white border border-stone-200 p-2 rounded-lg text-[13px] font-bold text-indigo-600"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
//                         Txn Date
//                       </label>
//                       <input
//                         type="date"
//                         name="txn_date"
//                         required
//                         value={headerData.txn_date}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-stone-200 p-2 rounded-lg text-[13px]"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
//                         Merchant
//                       </label>
//                       <select
//                         name="merchant"
//                         value={headerData.merchant}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-stone-200 p-2 rounded-lg text-[13px]"
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
//                       <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
//                         Merchant ID
//                       </label>
//                       <input
//                         type="text"
//                         name="merchant_id"
//                         value={headerData.merchant_id}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-stone-200 p-2 rounded-lg text-[13px]"
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
//                         Firm
//                       </label>
//                       <select
//                         name="firm"
//                         value={headerData.firm}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-stone-200 p-2 rounded-lg text-[13px]"
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
//                       <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
//                         Location
//                       </label>
//                       <select
//                         name="location"
//                         value={headerData.location}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-stone-200 p-2 rounded-lg text-[13px]"
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
//                       <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
//                         Txn Detail
//                       </label>
//                       <input
//                         type="text"
//                         name="txn_detail"
//                         value={headerData.txn_detail}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-stone-200 p-2 rounded-lg text-[13px]"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-xs font-extrabold text-[#a66a4f] uppercase mb-3">
//                     Product Line Items
//                   </h3>
//                   {itemsData.map((item, index) => (
//                     <div
//                       key={index}
//                       className="bg-white p-5 rounded-xl border border-stone-200 mb-4 relative"
//                     >
//                       {!editMode && itemsData.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveItem(index)}
//                           className="absolute top-3 right-3 text-stone-400 hover:text-red-500"
//                         >
//                           <i className="fas fa-trash-alt"></i>
//                         </button>
//                       )}
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
//                         <div>
//                           <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
//                             ASIN / FSN
//                           </label>
//                           <select
//                             name="asin_fsn"
//                             value={item.asin_fsn}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-stone-50 border border-stone-200 p-2 rounded-lg text-[13px] font-bold text-indigo-600"
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
//                           <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
//                             Model Name
//                           </label>
//                           <input
//                             type="text"
//                             value={item.model_name}
//                             readOnly
//                             className="w-full bg-stone-100 border border-stone-200 p-2 rounded-lg text-[13px] font-semibold text-stone-500 cursor-not-allowed"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
//                             Model Number
//                           </label>
//                           <input
//                             type="text"
//                             value={item.model_no}
//                             readOnly
//                             className="w-full bg-stone-100 border border-stone-200 p-2 rounded-lg text-[13px] font-semibold text-stone-500 cursor-not-allowed"
//                           />
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
//                         <div>
//                           <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
//                             Status
//                           </label>
//                           <select
//                             name="order_status"
//                             value={item.order_status}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-stone-50 border border-stone-200 text-stone-700 font-bold p-2 rounded-lg text-[13px]"
//                           >
//                             <option value="Open">Open</option>
//                             <option value="Complete">Complete</option>
//                             <option value="Cancelled">Cancelled</option>
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
//                             Qty
//                           </label>
//                           <input
//                             type="number"
//                             min="1"
//                             name="order_qty"
//                             value={item.order_qty}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-stone-50 border border-stone-200 p-2 rounded-lg text-[13px] font-bold"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
//                             Order Amt (₹)
//                           </label>
//                           <input
//                             type="number"
//                             step="0.01"
//                             name="order_amount"
//                             value={item.order_amount}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-stone-50 border border-stone-200 p-2 rounded-lg text-[13px] font-bold text-stone-700"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
//                             Payment Amt (₹)
//                           </label>
//                           <input
//                             type="number"
//                             step="0.01"
//                             name="payment_amount"
//                             value={item.payment_amount}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-[13px] font-bold text-emerald-700"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">
//                             Unit Price
//                           </label>
//                           <input
//                             type="text"
//                             disabled
//                             value={`₹ ${item.unit_price}`}
//                             className="w-full bg-stone-100 border border-stone-200 p-2 rounded-lg text-[13px] font-bold text-stone-500"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-bold text-purple-600 uppercase mb-1">
//                             Card Offer
//                           </label>
//                           <input
//                             type="text"
//                             disabled
//                             value={`₹ ${item.card_offer}`}
//                             className="w-full bg-purple-50 border border-purple-200 p-2 rounded-lg text-[13px] font-bold text-purple-600"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                   {!editMode && (
//                     <button
//                       type="button"
//                       onClick={handleAddItem}
//                       className="mt-2 text-[#a66a4f] hover:text-white border-2 border-[#a66a4f] hover:bg-[#a66a4f] px-4 py-2 rounded-lg text-xs font-bold transition-all"
//                     >
//                       <i className="fas fa-plus"></i> Add Item
//                     </button>
//                   )}
//                 </div>
//               </form>
//             </div>
//             <div className="px-6 py-4 border-t bg-stone-50 flex justify-end gap-3 rounded-b-2xl">
//               <button
//                 type="button"
//                 onClick={() => setFormModalOpen(false)}
//                 className="px-6 py-2 bg-stone-200 text-stone-700 font-bold rounded-lg hover:bg-stone-300 text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="orderForm"
//                 disabled={loading}
//                 className="px-8 py-2 bg-gradient-to-r from-[#b7795f] to-[#9e5a42] text-white rounded-lg font-bold shadow-md text-sm"
//               >
//                 {loading ? "Saving..." : "Save Data"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🔥 5. NEW 19-BOXES ORDER SUMMARY & TRACKER MODAL 🔥 */}
//       {isViewSummaryModalOpen && viewSummaryData && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
//             {/* Modal Header */}
//             <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-3xl">
//               <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
//                 <i className="fas fa-chart-pie text-indigo-600"></i> Order
//                 Summary & Tracker
//               </h2>
//               <div className="flex items-center gap-4">
//                 <span className="text-sm font-bold text-slate-600">
//                   Order Status:
//                   <span
//                     className={`px-3 py-1 ml-2 rounded-full text-[11px] font-bold tracking-widest uppercase shadow-sm border ${viewSummaryData.order_status === "Complete" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-blue-50 text-blue-600 border-blue-200"}`}
//                   >
//                     {viewSummaryData.order_status}
//                   </span>
//                 </span>
//                 <button
//                   onClick={() => {
//                     setViewSummaryModalOpen(false);
//                     setViewSummaryData(null);
//                   }}
//                   className="text-slate-400 hover:text-red-500 transition-colors bg-white hover:bg-red-50 p-2 rounded-full"
//                 >
//                   <i className="fas fa-times text-lg"></i>
//                 </button>
//               </div>
//             </div>

//             {/* 19 Boxes Grid Content */}
//             <div className="px-8 py-6 overflow-y-auto custom-scrollbar bg-white rounded-b-3xl">
//               {/* Row 1 & 2: Green Base Data */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
//                 <div>
//                   <label className="block text-[11px] font-bold text-emerald-600 uppercase mb-1 tracking-wider">
//                     Order ID
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={viewSummaryData.order_id}
//                     className="w-full   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-emerald-600 uppercase mb-1 tracking-wider">
//                     Txn Date
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={formatDate(viewSummaryData.txn_date)}
//                     className="w-full bg-emerald-50/30  p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-emerald-600 uppercase mb-1 tracking-wider">
//                     ASIN/FSN
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={viewSummaryData.asin_fsn}
//                     className="w-full bg-emerald-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-emerald-600 uppercase mb-1 tracking-wider">
//                     Model No
//                   </label>
//                   {/* 🔥 input ki jagah div lagaya hai aur break-words add kiya hai taaki text wrap ho sake */}
//                   <div className="w-full bg-emerald-50/30 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm min-h-[42px] break-words flex items-center">
//                     {viewSummaryData.model_no || "-"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-emerald-600 uppercase mb-1 tracking-wider">
//                     Order Qty
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={viewSummaryData.order_qty}
//                     className="w-full bg-emerald-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-emerald-600 uppercase mb-1 tracking-wider">
//                     Order Amount
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={`₹ ${viewSummaryData.order_amount.toLocaleString("en-IN")}`}
//                     className="w-full bg-emerald-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                 </div>
//               </div>

//               <div className="w-full h-px bg-slate-200 mb-8"></div>

//               {/* Row 3: Red Delivered & Cancelled */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
//                 <div>
//                   <label className="block text-[11px] font-bold text-red-600 uppercase mb-1 tracking-wider">
//                     Delivered Qty
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={viewSummaryData.delivered_qty}
//                     className="w-full bg-red-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-red-600 uppercase mb-1 tracking-wider">
//                     Delivered Amount
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={`₹ ${viewSummaryData.delivered_amount.toLocaleString("en-IN")}`}
//                     className="w-full bg-red-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-red-600 uppercase mb-1 tracking-wider">
//                     Cancel Qty
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={viewSummaryData.cancel_qty}
//                     className="w-full bg-red-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-red-600 uppercase mb-1 tracking-wider">
//                     Cancel Amount
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={`₹ ${viewSummaryData.cancel_amount.toLocaleString("en-IN")}`}
//                     className="w-full bg-red-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                 </div>
//               </div>

//               {/* Row 4: Blue Short & Refund */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
//                 <div>
//                   <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1 tracking-wider">
//                     Short Qty
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={viewSummaryData.short_qty}
//                     className="w-full bg-blue-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1 tracking-wider">
//                     Short Amount
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={`₹ ${viewSummaryData.short_amount.toLocaleString("en-IN")}`}
//                     className="w-full bg-blue-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1 tracking-wider">
//                     Refund Qty
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={viewSummaryData.refund_qty}
//                     className="w-full bg-blue-50/30  border-blue-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1 tracking-wider">
//                     Refund Amount
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={`₹ ${viewSummaryData.refund_amount.toLocaleString("en-IN")}`}
//                     className="w-full bg-blue-50/30  border-blue-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                 </div>
//               </div>

//               {/* Row 5 & 6: Red Pending & Blue Inward */}

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
//                 <div>
//                   <label className="block text-[11px] font-bold text-red-600 uppercase mb-1 tracking-wider">
//                     Pending Qty
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={viewSummaryData.pending_qty}
//                     className="w-full bg-red-50/30  border-red-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                   <p className="text-[10px] text-slate-400 mt-1 font-medium italic">
//                     Formula 5-7-9
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-red-600 uppercase mb-1 tracking-wider">
//                     Pending Amount
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={`₹ ${viewSummaryData.pending_amount.toLocaleString("en-IN")}`}
//                     className="w-full bg-red-50/30  border-red-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                   <p className="text-[10px] text-slate-400 mt-1 font-medium italic">
//                     Formula 6-8-10
//                   </p>
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-red-600 uppercase mb-1 tracking-wider">
//                     Pending Refund Amt
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={`₹ ${viewSummaryData.pending_refund_amount.toLocaleString("en-IN")}`}
//                     className="w-full bg-red-50/30  border-red-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                   <p className="text-[10px] text-slate-400 mt-1 font-medium italic">
//                     Formula 10+12-14
//                   </p>
//                 </div>
//               </div>

//               {/* Row 6: Blue Inward (Moved Below) */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-5 bg-blue-50/20 p-4 rounded-xl  border-blue-100">
//                 <div>
//                   <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1 tracking-wider">
//                     Inward Qty
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={viewSummaryData.inward_qty}
//                     className="w-full bg-white  border-blue-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1 tracking-wider">
//                     Inward Amount
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={`₹ ${viewSummaryData.inward_amount.toLocaleString("en-IN")}`}
//                     className="w-full bg-white  border-blue-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [jumpPage, setJumpPage] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");

  // Modals States
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isViewSetupModalOpen, setViewSetupModalOpen] = useState(false);
  const [isViewSummaryModalOpen, setViewSummaryModalOpen] = useState(false);
  const [viewSummaryData, setViewSummaryData] = useState(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

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
    order_status: "Open",
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
  // bulk delete state 
  const [selectedIds, setSelectedIds] = useState([]);

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
      if (globalSearch.trim())
        queryParams.append("search", globalSearch.trim());

      const [dataRes, settingsRes] = await Promise.all([
        api.get(`reports/orders/?${queryParams.toString()}`),
        api.get("reports/column-policy/?policy_name=user_view_policy"),
      ]);

      const records = dataRes.data.results || dataRes.data;
      setOrders(records);
      setTotalRecords(dataRes.data.count || records.length);
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
      newHeader.day = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][dateObj.getDay()];
      newHeader.month = [
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
      ][dateObj.getMonth()];
    }
    setHeaderData(newHeader);
  };

  //Bulk delete  function  
  const handleRowSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select All Rows (Current Page)
  const handleSelectAll = () => {
    if (orders.length > 0 && selectedIds.length === orders.length) {
      setSelectedIds([]); // Agar saare selected hain, toh sabko uncheck karo
    } else {
      setSelectedIds(orders.map((order) => order.id)); // Warna sabko select kar lo
    }
  };

  // Bulk Delete API Call
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return Swal.fire("Select records first!");

    const confirm = await Swal.fire({
      title: "Delete Multiple Records?",
      text: `You are permanently deleting ${selectedIds.length} orders.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        // API endpoint check kar lena yahi hai na
        await api.post("reports/orders/bulk-delete/", { ids: selectedIds });
        Swal.fire("Deleted!", "Orders have been deleted.", "success");
        setSelectedIds([]);
        fetchData(); // Table reload karne ke liye
      } catch (error) {
        console.error("Delete Error:", error);
        Swal.fire("Error", "Deletion failed.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...itemsData];
    let item = { ...updatedItems[index], [name]: value };

    if (name === "asin_fsn") {
      const selectedModel = masterModels.find((m) => m.asin_fsn === value);
      item.model_name = selectedModel ? selectedModel.model_name : "";
      item.model_no = selectedModel ? selectedModel.model : "";
    }

    const amt = name === "order_amount" ? value : item.order_amount;
    const qty = name === "order_qty" ? value : item.order_qty;
    const pay = name === "payment_amount" ? value : item.payment_amount;

    item.unit_price =
      amt && qty && Number(qty) > 0
        ? (Number(amt) / Number(qty)).toFixed(2)
        : "0.00";
    item.card_offer =
      pay && amt ? Math.abs(Number(amt) - Number(pay)).toFixed(2) : "0.00";

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

  const handleViewClick = async (orderId) => {
    try {
      const res = await api.get(`reports/order-summary/${orderId}/`);
      setViewSummaryData(res.data);
      setViewSummaryModalOpen(true);
      fetchData();
    } catch (error) {
      Swal.fire("Error fetching order summary. Please check your connection.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode) {
        await api.put(`reports/orders/${editId}/`, {
          ...headerData,
          ...itemsData[0],
        });
        Swal.fire("Record updated successfully!");
      } else {
        const payloads = itemsData.map((item) => ({ ...headerData, ...item }));
        await Promise.all(
          payloads.map((payload) => api.post("reports/orders/", payload)),
        );
        Swal.fire(`${payloads.length} item(s) saved successfully!`);
      }
      setFormModalOpen(false);
      setHeaderData(initialHeaderState);
      setItemsData([{ ...initialItemState }]);
      setEditMode(false);
      fetchData();
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.error) {
          Swal.fire(error.response.data.error);
        } else {
          Swal.fire("Data validation failed. Please check your inputs.");
          console.error("Backend errors:", error.response.data);
        }
      } else {
        Swal.fire("Error saving record. Please check your connection.");
      }
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
        Swal.fire("Access Denied.");
      }
    }
  };

  const handleSaveViewSettings = async () => {
    try {
      await api.put(
        "reports/column-policy/?policy_name=user_view_policy",
        viewSettings,
      );
      Swal.fire("User View Updated!");
      setViewSetupModalOpen(false);
      fetchData();
    } catch (error) {
      Swal.fire("Failed to save view settings.");
    }
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
      Swal.fire(res.data.message || "Excel Uploaded Successfully!");
      setUploadModalOpen(false);
      setFile(null);
      setCurrentPage(1);
      fetchData();
    } catch (error) {
      Swal.fire(
        "Upload Failed: " + (error.response?.data?.error || "Unknown Error"),
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔥 NAYA FUNCTION: SMART EXPORT TO EXCEL
  const handleExportExcel = async () => {
    try {
      // SweetAlert ka loading spinner
      Swal.fire({
        title: "Preparing Smart Excel...",
        text: "Please wait while we generate your file.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Aapke current form ke state (filters & search) ko API bhejne ke liye pack kiya
      const filterParams = {
        start_date: filters.start_date,
        end_date: filters.end_date,
        firm: filters.firm,
        location: filters.location,
        model_no: filters.model_no,
        order_status: filters.order_status,
        search: globalSearch,
      };

      const response = await api.get("reports/export/orders/", {
        params: filterParams,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const fileName = filters.firm
        ? `${filters.firm}_Orders.xlsx`
        : `All_Orders.xlsx`;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.fire("Success!", "Excel downloaded successfully!", "success");
    } catch (error) {
      console.error("Export Error:", error);
      Swal.fire("Error!", "Failed to export Excel file.", "error");
    }
  };

  const showCol = (colName) =>
    role === "ADMIN" ? true : viewSettings[colName] !== false;

  const getBadgeColor = (status) => {
    const s = String(status || "")
      .trim()
      .toLowerCase();
    if (s === "open") return "bg-blue-50 text-blue-600 border-blue-200";
    if (s === "complete")
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    if (s === "cancelled") return "bg-red-50 text-red-600 border-red-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-10">
      {/* HEADER & TOP BUTTONS */}
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
          {(globalSearch.trim() !== "" ||
            Object.values(filters).some((x) => x !== "")) && (
            <button
              onClick={() => {
                setGlobalSearch("");
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
              }}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl font-bold text-sm transition flex items-center shadow-sm"
            >
              <i className="fas fa-undo-alt mr-2"></i> Clear All
            </button>
          )}
          <button
            onClick={() => setFilterModalOpen(true)}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-slate-50 transition flex items-center"
          >
            <i className="fas fa-filter mr-2 text-indigo-500"></i> Filter{" "}
            {Object.values(filters).some((x) => x !== "") && (
              <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          {role === "ADMIN" && (
            <button
              onClick={() => setViewSetupModalOpen(true)}
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> New Entry
          </button>
          {role === "ADMIN" && selectedIds.length > 0 && (
            <button
              // OrderReport file me: onClick={() => handleBulkDelete("reports/orders/bulk-delete/")}
              // InvoiceShipment file me: onClick={() => handleBulkDelete("reports/invoices/bulk-delete/")}
              onClick={() => handleBulkDelete("reports/invoices/bulk-delete/")}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-extrabold shadow-lg transition flex items-center border border-red-500 animate-in zoom-in"
            >
              <i className="fas fa-trash-alt mr-2"></i> Delete (
              {selectedIds.length})
            </button>
          )}

          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition flex items-center"
          >
            <i className="fas fa-file-excel mr-2"></i> Upload Excel
          </button>

          {/* 🔥 NAYA EXPORT BUTTON */}
          <button
            onClick={handleExportExcel}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition flex items-center"
          >
            <i className="fas fa-download mr-2"></i> Export Excel
          </button>
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh] min-h-[55vh] custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider sticky top-0 z-10">
                {role === "ADMIN" && (
                  <th className="p-4 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        orders.length > 0 &&
                        selectedIds.length === orders.length
                      }
                      className="w-4 h-4 rounded cursor-pointer accent-teal-600"
                    />
                  </th>
                )}

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
                {showCol("show_order_status") && (
                  <th className="p-4 text-center">Status</th>
                )}
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
                orders.map((order, index) => {
                  if (!order) return null;
                  return (
                    <tr
                      key={order?.id || index}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {role === "ADMIN" && (
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(order.id)}
                            onChange={() => handleRowSelect(order.id)}
                            className="w-4 h-4 rounded cursor-pointer accent-teal-600"
                          />
                        </td>
                      )}

                      <td className="p-4 text-center font-mono text-xs font-bold text-slate-400">
                        {((currentPage - 1) * 50 + index + 1)
                          .toString()
                          .padStart(2, "0")}
                      </td>
                      {showCol("show_order_id") && (
                        <td className="p-4 font-bold text-indigo-600">
                          {order?.order_id || "-"}
                        </td>
                      )}
                      {showCol("show_txn_date") && (
                        <td className="p-4 text-slate-600 font-medium">
                          {formatDate(order?.txn_date)}
                        </td>
                      )}
                      {showCol("show_month") && (
                        <td className="p-4 text-slate-600 capitalize">
                          {order?.month || "-"}
                        </td>
                      )}
                      {showCol("show_day") && (
                        <td className="p-4 text-slate-600">
                          {order?.day || "-"}
                        </td>
                      )}
                      {showCol("show_txn_detail") && (
                        <td
                          className="p-4 max-w-[150px] truncate text-slate-600"
                          title={order?.txn_detail}
                        >
                          {order?.txn_detail || "-"}
                        </td>
                      )}
                      {showCol("show_merchant") && (
                        <td className="p-4 text-slate-800 font-medium">
                          {order?.merchant || "-"}
                        </td>
                      )}
                      {showCol("show_merchant_id") && (
                        <td className="p-4 text-slate-500 font-mono text-xs">
                          {order?.merchant_id || "-"}
                        </td>
                      )}
                      {showCol("show_firm") && (
                        <td className="p-4 font-bold text-slate-800">
                          {order?.firm || "-"}
                        </td>
                      )}
                      {showCol("show_location") && (
                        <td className="p-4 text-slate-600">
                          {order?.location || "-"}
                        </td>
                      )}
                      {showCol("show_asin_fsn") && (
                        <td className="p-4 text-xs font-mono text-slate-500">
                          {order?.asin_fsn || "-"}
                        </td>
                      )}
                      {showCol("show_model_name") && (
                        <td
                          className="p-4 text-slate-800 font-medium "
                          title={order?.model_name}
                        >
                          {order?.model_name || "-"}
                        </td>
                      )}
                      {showCol("show_model_no") && (
                        <td className="p-4 text-slate-600">
                          {order?.model_no || "-"}
                        </td>
                      )}
                      {showCol("show_order_qty") && (
                        <td className="p-4 text-center font-bold text-slate-700">
                          {order?.order_qty || "0"}
                        </td>
                      )}
                      {showCol("show_order_amount") && (
                        <td className="p-4 text-right text-slate-700">
                          ₹
                          {parseFloat(order?.order_amount || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      )}
                      {showCol("show_unit_price") && (
                        <td className="p-4 text-right text-slate-500">
                          ₹
                          {parseFloat(order?.unit_price || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      )}
                      {showCol("show_payment_amount") && (
                        <td className="p-4 text-right font-bold text-emerald-600">
                          ₹
                          {parseFloat(
                            order?.payment_amount || 0,
                          ).toLocaleString("en-IN")}
                        </td>
                      )}
                      {showCol("show_card_offer") && (
                        <td className="p-4 text-right font-black text-purple-600 bg-purple-50/30">
                          ₹
                          {parseFloat(order?.card_offer || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      )}
                      {showCol("show_order_status") && (
                        <td className="p-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border shadow-sm ${getBadgeColor(order?.order_status)}`}
                          >
                            {order?.order_status || "Open"}
                          </span>
                        </td>
                      )}
                      <td className="p-4 text-center border-l border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleViewClick(order?.id)}
                            className="text-slate-400 hover:text-indigo-600 transition hover:scale-110"
                            title="View Summary"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
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
                                onClick={() => handleDelete(order?.id)}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
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
                    Swal.fire(
                      `Please enter a valid page between 1 and ${maxPages}`,
                    );
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

      {/* --- ALL MODALS --- */}

      {/* 1. UPLOAD EXCEL MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
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
              <div className="border-2 border-dashed border-slate-200 p-8 text-center rounded-2xl bg-slate-50 mb-6">
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
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md"
              >
                {loading ? "Uploading..." : "Upload & Sync Data"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. FILTER MODAL */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-3xl shadow-2xl">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm font-medium"
                >
                  <option value="">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="Complete">Complete</option>
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm font-medium"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 text-sm font-medium"
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
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                onClick={() => {
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
                }}
                className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  setCurrentPage(1);
                  setFilterModalOpen(false);
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ADMIN COLUMN VIEW SETUP MODAL */}
      {isViewSetupModalOpen && role === "ADMIN" && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-5 border-b pb-3">
              <h2 className="text-lg font-bold text-slate-800">
                <i className="fas fa-sliders-h mr-2 text-indigo-500"></i>{" "}
                Configure User View
              </h2>
              <button
                onClick={() => setViewSetupModalOpen(false)}
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
                    className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-indigo-50 border border-slate-100"
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
                onClick={() => setViewSetupModalOpen(false)}
                className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveViewSettings}
                className="px-8 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
              >
                Save View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. DATA ENTRY FORM MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[95vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-stone-100 bg-stone-50 rounded-t-2xl">
              <h2 className="text-lg font-bold text-stone-800">
                <i className="fas fa-edit text-[#a66a4f] mr-2"></i>{" "}
                {editMode ? "Edit Order" : "Create New Order"}
              </h2>
              <button
                onClick={() => setFormModalOpen(false)}
                className="text-stone-400 hover:text-red-500"
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
                <div className="bg-stone-50 p-5 rounded-xl border border-stone-200">
                  <h3 className="text-xs font-extrabold text-stone-600 uppercase mb-4 border-b pb-2">
                    Order Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                        Order ID *
                      </label>
                      <input
                        type="text"
                        name="order_id"
                        required
                        value={headerData.order_id}
                        onChange={handleHeaderChange}
                        disabled={editMode}
                        className="w-full bg-white border border-stone-200 p-2 rounded-lg text-[13px] font-bold text-indigo-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                        Txn Date
                      </label>
                      <input
                        type="date"
                        name="txn_date"
                        required
                        value={headerData.txn_date}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-stone-200 p-2 rounded-lg text-[13px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                        Merchant
                      </label>
                      <select
                        name="merchant"
                        value={headerData.merchant}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-stone-200 p-2 rounded-lg text-[13px]"
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
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                        Merchant ID
                      </label>
                      <input
                        type="text"
                        name="merchant_id"
                        value={headerData.merchant_id}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-stone-200 p-2 rounded-lg text-[13px]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                        Firm
                      </label>
                      <select
                        name="firm"
                        value={headerData.firm}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-stone-200 p-2 rounded-lg text-[13px]"
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
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                        Location
                      </label>
                      <select
                        name="location"
                        value={headerData.location}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-stone-200 p-2 rounded-lg text-[13px]"
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
                      <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                        Txn Detail
                      </label>
                      <input
                        type="text"
                        name="txn_detail"
                        value={headerData.txn_detail}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-stone-200 p-2 rounded-lg text-[13px]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-extrabold text-[#a66a4f] uppercase mb-3">
                    Product Line Items
                  </h3>
                  {itemsData.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-5 rounded-xl border border-stone-200 mb-4 relative"
                    >
                      {!editMode && itemsData.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="absolute top-3 right-3 text-stone-400 hover:text-red-500"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                            ASIN / FSN
                          </label>
                          <select
                            name="asin_fsn"
                            value={item.asin_fsn}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-stone-50 border border-stone-200 p-2 rounded-lg text-[13px] font-bold text-indigo-600"
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
                          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                            Model Name
                          </label>
                          <input
                            type="text"
                            value={item.model_name}
                            readOnly
                            className="w-full bg-stone-100 border border-stone-200 p-2 rounded-lg text-[13px] font-semibold text-stone-500 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                            Model Number
                          </label>
                          <input
                            type="text"
                            value={item.model_no}
                            readOnly
                            className="w-full bg-stone-100 border border-stone-200 p-2 rounded-lg text-[13px] font-semibold text-stone-500 cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                            Status
                          </label>
                          <select
                            name="order_status"
                            value={item.order_status}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-stone-50 border border-stone-200 text-stone-700 font-bold p-2 rounded-lg text-[13px]"
                          >
                            <option value="Open">Open</option>
                            <option value="Complete">Complete</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                            Qty
                          </label>
                          <input
                            type="number"
                            min="1"
                            name="order_qty"
                            value={item.order_qty}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-stone-50 border border-stone-200 p-2 rounded-lg text-[13px] font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                            Order Amt (₹)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="order_amount"
                            value={item.order_amount}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-stone-50 border border-stone-200 p-2 rounded-lg text-[13px] font-bold text-stone-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-500 uppercase mb-1">
                            Payment Amt (₹)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="payment_amount"
                            value={item.payment_amount}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-[13px] font-bold text-emerald-700"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-400 uppercase mb-1">
                            Unit Price
                          </label>
                          <input
                            type="text"
                            disabled
                            value={`₹ ${item.unit_price}`}
                            className="w-full bg-stone-100 border border-stone-200 p-2 rounded-lg text-[13px] font-bold text-stone-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-purple-600 uppercase mb-1">
                            Card Offer
                          </label>
                          <input
                            type="text"
                            disabled
                            value={`₹ ${item.card_offer}`}
                            className="w-full bg-purple-50 border border-purple-200 p-2 rounded-lg text-[13px] font-bold text-purple-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {!editMode && (
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="mt-2 text-[#a66a4f] hover:text-white border-2 border-[#a66a4f] hover:bg-[#a66a4f] px-4 py-2 rounded-lg text-xs font-bold transition-all"
                    >
                      <i className="fas fa-plus"></i> Add Item
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t bg-stone-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setFormModalOpen(false)}
                className="px-6 py-2 bg-stone-200 text-stone-700 font-bold rounded-lg hover:bg-stone-300 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="orderForm"
                disabled={loading}
                className="px-8 py-2 bg-gradient-to-r from-[#b7795f] to-[#9e5a42] text-white rounded-lg font-bold shadow-md text-sm"
              >
                {loading ? "Saving..." : "Save Data"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. NEW 19-BOXES ORDER SUMMARY & TRACKER MODAL */}
      {isViewSummaryModalOpen && viewSummaryData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-3xl">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-chart-pie text-indigo-600"></i> Order
                Summary & Tracker
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-600">
                  Order Status:
                  <span
                    className={`px-3 py-1 ml-2 rounded-full text-[11px] font-bold tracking-widest uppercase shadow-sm border ${viewSummaryData.order_status === "Complete" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-blue-50 text-blue-600 border-blue-200"}`}
                  >
                    {viewSummaryData.order_status}
                  </span>
                </span>
                <button
                  onClick={() => {
                    setViewSummaryModalOpen(false);
                    setViewSummaryData(null);
                  }}
                  className="text-slate-400 hover:text-red-500 transition-colors bg-white hover:bg-red-50 p-2 rounded-full"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>
            </div>

            {/* 19 Boxes Grid Content */}
            <div className="px-8 py-6 overflow-y-auto custom-scrollbar bg-white rounded-b-3xl">
              {/* Row 1 & 2: Green Base Data */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-600 uppercase mb-1 tracking-wider">
                    Order ID
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={viewSummaryData.order_id}
                    className="w-full   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-600 uppercase mb-1 tracking-wider">
                    Txn Date
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formatDate(viewSummaryData.txn_date)}
                    className="w-full bg-emerald-50/30  p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-600 uppercase mb-1 tracking-wider">
                    ASIN/FSN
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={viewSummaryData.asin_fsn}
                    className="w-full bg-emerald-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-600 uppercase mb-1 tracking-wider">
                    Model No
                  </label>
                  <div className="w-full bg-emerald-50/30 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm min-h-[42px] break-words flex items-center">
                    {viewSummaryData.model_no || "-"}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-600 uppercase mb-1 tracking-wider">
                    Order Qty
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={viewSummaryData.order_qty}
                    className="w-full bg-emerald-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-600 uppercase mb-1 tracking-wider">
                    Order Amount
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`₹ ${viewSummaryData.order_amount.toLocaleString("en-IN")}`}
                    className="w-full bg-emerald-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                </div>
              </div>

              <div className="w-full h-px bg-slate-200 mb-8"></div>

              {/* Row 3: Red Delivered & Cancelled */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                <div>
                  <label className="block text-[11px] font-bold text-red-600 uppercase mb-1 tracking-wider">
                    Delivered Qty
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={viewSummaryData.delivered_qty}
                    className="w-full bg-red-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-red-600 uppercase mb-1 tracking-wider">
                    Delivered Amount
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`₹ ${viewSummaryData.delivered_amount.toLocaleString("en-IN")}`}
                    className="w-full bg-red-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-red-600 uppercase mb-1 tracking-wider">
                    Cancel Qty
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={viewSummaryData.cancel_qty}
                    className="w-full bg-red-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-red-600 uppercase mb-1 tracking-wider">
                    Cancel Amount
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`₹ ${viewSummaryData.cancel_amount.toLocaleString("en-IN")}`}
                    className="w-full bg-red-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                </div>
              </div>

              {/* Row 4: Blue Short & Refund */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
                <div>
                  <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1 tracking-wider">
                    Short Qty
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={viewSummaryData.short_qty}
                    className="w-full bg-blue-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1 tracking-wider">
                    Short Amount
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`₹ ${viewSummaryData.short_amount.toLocaleString("en-IN")}`}
                    className="w-full bg-blue-50/30   p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1 tracking-wider">
                    Refund Qty
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={viewSummaryData.refund_qty}
                    className="w-full bg-blue-50/30  border-blue-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1 tracking-wider">
                    Refund Amount
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`₹ ${viewSummaryData.refund_amount.toLocaleString("en-IN")}`}
                    className="w-full bg-blue-50/30  border-blue-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                </div>
              </div>

              {/* Row 5 & 6: Red Pending & Blue Inward */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <div>
                  <label className="block text-[11px] font-bold text-red-600 uppercase mb-1 tracking-wider">
                    Pending Qty
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={viewSummaryData.pending_qty}
                    className="w-full bg-red-50/30  border-red-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-medium italic">
                    Formula 5-7-9
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-red-600 uppercase mb-1 tracking-wider">
                    Pending Amount
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`₹ ${viewSummaryData.pending_amount.toLocaleString("en-IN")}`}
                    className="w-full bg-red-50/30  border-red-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-medium italic">
                    Formula 6-8-10
                  </p>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-red-600 uppercase mb-1 tracking-wider">
                    Pending Refund Amt
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`₹ ${viewSummaryData.pending_refund_amount.toLocaleString("en-IN")}`}
                    className="w-full bg-red-50/30  border-red-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-medium italic">
                    Formula 10+12-14
                  </p>
                </div>
              </div>

              {/* Row 6: Blue Inward (Moved Below) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 bg-blue-50/20 p-4 rounded-xl  border-blue-100">
                <div>
                  <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1 tracking-wider">
                    Inward Qty
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={viewSummaryData.inward_qty}
                    className="w-full bg-white  border-blue-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1 tracking-wider">
                    Inward Amount
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`₹ ${viewSummaryData.inward_amount.toLocaleString("en-IN")}`}
                    className="w-full bg-white  border-blue-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}