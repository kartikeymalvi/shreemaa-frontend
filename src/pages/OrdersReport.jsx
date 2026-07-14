// import React, { useState, useEffect } from "react";
// import api from "../api/axios";
// import Swal from "sweetalert2";
// import { IconDownload, IconColumns, IconPlus, IconSearch, IconFilter } from "./ApprovalManager";

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
//   const [isViewSetupModalOpen, setViewSetupModalOpen] = useState(false);
//   const [isViewSummaryModalOpen, setViewSummaryModalOpen] = useState(false);
//   const [viewSummaryData, setViewSummaryData] = useState(null);

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

//   // template download function
//   const handleDownloadTemplate = () => {
//     const headers = [
//       "S.No",
//       "Order ID",
//       "Txn Date",
//       "Month",
//       "Day",
//       "Txn Detail",
//       "Merchant",
//       "Merchant ID",
//       "Firm",
//       "Location",
//       "ASIN/FSN",
//       "Model Name",
//       "Model",
//       "Qty",
//       "Order Amt",
//       "Unit Price",
//       "Payment",
//       "Card Offer",

//     ];
//     const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "Order_Reports_Template.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
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

//   // bulk delete state
//   const [selectedIds, setSelectedIds] = useState([]);

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

//   const handleRowSelect = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
//     );
//   };

//   const handleSelectAll = () => {
//     if (orders.length > 0 && selectedIds.length === orders.length) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(orders.map((order) => order.id));
//     }
//   };

//   const handleBulkDelete = async () => {
//     if (selectedIds.length === 0) return Swal.fire("Select records first!");
//     const confirm = await Swal.fire({
//       title: "Delete Multiple Records?",
//       text: `You are permanently deleting ${selectedIds.length} orders.`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#0f172a", // Slate-900
//       cancelButtonColor: "#cbd5e1",
//       confirmButtonText: "Yes, delete!",
//     });

//     if (confirm.isConfirmed) {
//       try {
//         setLoading(true);
//         await api.post("reports/orders/bulk-delete/", { ids: selectedIds });
//         Swal.fire("Deleted!", "Orders have been deleted.", "success");
//         setSelectedIds([]);
//         fetchData();
//       } catch (error) {
//         console.error("Delete Error:", error);
//         Swal.fire("Error", "Deletion failed.", "error");
//       } finally {
//         setLoading(false);
//       }
//     }
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

//   const handleViewClick = async (orderId) => {
//     try {
//       const res = await api.get(`reports/order-summary/${orderId}/`);
//       setViewSummaryData(res.data);
//       setViewSummaryModalOpen(true);
//       fetchData();
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
//       if (error.response && error.response.data) {
//         if (error.response.data.error) Swal.fire(error.response.data.error);
//         else Swal.fire("Data validation failed. Please check your inputs.");
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

//   const handleExportExcel = async () => {
//     try {
//       Swal.fire({
//         title: "Preparing Smart Excel...",
//         text: "Please wait while we generate your file.",
//         allowOutsideClick: false,
//         didOpen: () => {
//           Swal.showLoading();
//         },
//       });

//       const filterParams = {
//         start_date: filters.start_date,
//         end_date: filters.end_date,
//         firm: filters.firm,
//         location: filters.location,
//         model_no: filters.model_no,
//         order_status: filters.order_status,
//         search: globalSearch,
//       };

//       const response = await api.get("reports/export/orders/", {
//         params: filterParams,
//         responseType: "blob",
//       });

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       const fileName = filters.firm
//         ? `${filters.firm}_Orders.xlsx`
//         : `All_Orders.xlsx`;
//       link.setAttribute("download", fileName);
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
//       window.URL.revokeObjectURL(url);
//       Swal.fire("Success!", "Excel downloaded successfully!", "success");
//     } catch (error) {
//       console.error("Export Error:", error);
//       Swal.fire("Error!", "Failed to export Excel file.", "error");
//     }
//   };

//   const showCol = (colName) =>
//     role === "ADMIN" ? true : viewSettings[colName] !== false;

//   // 🔥 NAYA BADGE STYLE FUNCTION (Dashed Border + Dot Style)
//   const getBadgeStyle = (status) => {
//     const s = String(status || "")
//       .trim()
//       .toLowerCase();
//     if (s === "open" || s === "new")
//       return {
//         bg: "bg-blue-50 text-blue-700 border-blue-300",
//         dot: "bg-blue-600",
//       };
//     if (s === "complete" || s === "delivered")
//       return {
//         bg: "bg-emerald-50 text-emerald-700 border-emerald-300",
//         dot: "bg-emerald-600",
//       };
//     if (s === "cancelled")
//       return { bg: "bg-red-50 text-red-700 border-red-300", dot: "bg-red-600" };
//     if (s === "processing")
//       return {
//         bg: "bg-amber-50 text-amber-700 border-amber-300",
//         dot: "bg-amber-600",
//       };
//     return {
//       bg: "bg-slate-50 text-slate-700 border-slate-300",
//       dot: "bg-slate-600",
//     };
//   };

//   return (
//     <div className="bg-transparent min-h-screen font-sans pb-10">
//       {/* HEADER & TOP BUTTONS */}
//       <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-4 border-b border-gray-200 pb-5">
//         <div>
//           <h1 className="text-3xl font-medium text-slate-700 text-slate-900 tracking-tight">
//             Orders Report
//           </h1>
//           <p className="text-sm text-slate-500 font-medium text-slate-700 mt-1">
//             Manage, filter, and track business shipments
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-3 items-center">
//           {/* Search Box - Premium Outline */}
//           <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-slate-200 focus-within:border-slate-400 transition-all">
//             <input
//               type="text"
//               placeholder="Search anything..."
//               value={globalSearch}
//               onChange={(e) => setGlobalSearch(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && fetchData()}
//               className="px-4 py-2.5 outline-none text-sm w-48 md:w-60 text-slate-700 font-medium text-slate-700"
//             />
//             <button
//               onClick={() => {
//                 setCurrentPage(1);
//                 fetchData();
//               }}
//               className="bg-slate-50 border-l border-gray-200 px-4 text-slate-400 hover:text-slate-700 transition"
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
//               className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider hover:bg-red-100 transition shadow-sm"
//             >
//               Clear All
//             </button>
//           )}

//           {/* Filter Button - Ghost Style */}
//           <button
//             onClick={() => setFilterModalOpen(true)}
//             className="bg-white border border-gray-200 text-slate-700 px-4 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider shadow-sm hover:bg-slate-50 hover:border-slate-300 transition flex items-center gap-2"
//           >
//             <i className="fas fa-filter text-slate-400"></i> Filter
//             {Object.values(filters).some((x) => x !== "") && (
//               <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
//             )}
//           </button>

//           {role === "ADMIN" && (
//             <button
//               onClick={() => setViewSetupModalOpen(true)}
//               className="bg-white border border-gray-200 text-slate-700 px-4 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider shadow-sm hover:bg-slate-50 hover:border-slate-300 transition flex items-center gap-2"
//             >
//               <i className="fas fa-sliders-h text-slate-400"></i> View
//             </button>
//           )}

//           <div className="w-px h-8 bg-gray-200 mx-1 hidden md:block"></div>

//           {/* Core Actions - Solid Premium Colors */}
//           <button
//             onClick={handleDownloadTemplate}
//             className="bg-white border border-gray-200 text-slate-700 hover:text-indigo-700 hover:border-indigo-200 hover:bg-indigo-50 px-4 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2"
//           >
//             <i className="fas fa-file-csv"></i> Template
//           </button>

//           <button
//             onClick={() => setUploadModalOpen(true)}
//             className="bg-white border border-gray-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 px-4 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2"
//           >
//             <i className="fas fa-file-upload"></i> Upload
//           </button>

//           <button
//             onClick={handleExportExcel}
//             className="bg-white border border-gray-200 text-slate-700 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 px-4 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2"
//           >
//             <i className="fas fa-download"></i> Export
//           </button>

//           {role === "ADMIN" && selectedIds.length > 0 && (
//             <button
//               onClick={() => handleBulkDelete()}
//               className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2 animate-in zoom-in"
//             >
//               <i className="fas fa-trash-alt"></i> Delete ({selectedIds.length})
//             </button>
//           )}

//           <button
//             onClick={() => {
//               setHeaderData(initialHeaderState);
//               setItemsData([{ ...initialItemState }]);
//               setEditMode(false);
//               setFormModalOpen(true);
//             }}
//             className=" hover:bg-orange-500 text-slate-500 text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2"
//           >
//              <IconPlus/>New Entry
//           </button>
//         </div>
//       </div>

//       {/* MAIN TABLE - Shadcn Inspired */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto max-h-[65vh] min-h-[50vh] custom-scrollbar">
//           <table className="w-full text-left border-collapse whitespace-nowrap">
//             <thead>
//               {/* Premium Thin Headers */}
//               <tr className="bg-slate-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-black uppercase tracking-widest sticky top-0 z-10 backdrop-blur-sm">
//                 {role === "ADMIN" && (
//                   <th className="px-2 py-1 text-[11px] text-slate-800 whitespace-nowrap border-b">
//                     <input
//                       type="checkbox"
//                       onChange={handleSelectAll}
//                       checked={
//                         orders.length > 0 &&
//                         selectedIds.length === orders.length
//                       }
//                       className="w-4 h-4 rounded cursor-pointer accent-slate-900"
//                     />
//                   </th>
//                 )}
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
//                   <th className="p-4 text-right text-amber-600">Card Offer</th>
//                 )}
//                 {showCol("show_order_status") && (
//                   <th className="p-4 text-center">Status</th>
//                 )}
//                 <th className="p-4 text-center sticky right-0 bg-slate-50/90 border-l border-gray-200">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-100 text-sm">
//               {orders.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="21"
//                     className="p-12 text-center text-slate-400 font-medium text-slate-700 text-sm"
//                   >
//                     <i className="fas fa-inbox text-3xl mb-3 opacity-50 block"></i>
//                     No records match your filters/search.
//                   </td>
//                 </tr>
//               ) : (
//                 orders.map((order, index) => {
//                   if (!order) return null;
//                   const badgeStyle = getBadgeStyle(order?.order_status); // Naya Badge Function Call

//                   return (
//                     <tr
//                       key={order?.id || index}
//                       className="hover:bg-slate-50/50 transition-colors group"
//                     >
//                       {role === "ADMIN" && (
//                         <td className="px-2 py-1 text-[11px] text-slate-800 whitespace-nowrap ">
//                           <input
//                             type="checkbox"
//                             checked={selectedIds.includes(order.id)}
//                             onChange={() => handleRowSelect(order.id)}
//                             className="w-4 h-4 rounded cursor-pointer accent-slate-900"
//                           />
//                         </td>
//                       )}

//                       <td className="p-4 text-center font-mono text-[11px] font-medium text-slate-700 text-slate-400">
//                         {((currentPage - 1) * 50 + index + 1)
//                           .toString()
//                           .padStart(2, "0")}
//                       </td>

//                       {showCol("show_order_id") && (
//                         <td className="p-4 font-medium text-slate-700 text-slate-900 text-[13px]">
//                           {order?.order_id || "-"}
//                         </td>
//                       )}
//                       {showCol("show_txn_date") && (
//                         <td className="p-4 text-slate-600 font-medium text-slate-700 text-[13px]">
//                           {formatDate(order?.txn_date)}
//                         </td>
//                       )}
//                       {showCol("show_month") && (
//                         <td className="p-4 text-slate-500 capitalize text-xs">
//                           {order?.month || "-"}
//                         </td>
//                       )}
//                       {showCol("show_day") && (
//                         <td className="p-4 text-slate-500 text-xs">
//                           {order?.day || "-"}
//                         </td>
//                       )}

//                       {showCol("show_txn_detail") && (
//                         <td
//                           className="p-4 max-w-[150px] truncate text-slate-600 text-[13px]"
//                           title={order?.txn_detail}
//                         >
//                           {order?.txn_detail || "-"}
//                         </td>
//                       )}

//                       {showCol("show_merchant") && (
//                         <td className="p-4 text-slate-800 font-medium text-slate-700 text-[13px]">
//                           {order?.merchant || "-"}
//                         </td>
//                       )}
//                       {showCol("show_merchant_id") && (
//                         <td className="p-4 text-slate-400 font-mono text-xs">
//                           {order?.merchant_id || "-"}
//                         </td>
//                       )}
//                       {showCol("show_firm") && (
//                         <td className="p-4 font-medium text-slate-700 text-slate-800 text-[13px]">
//                           {order?.firm || "-"}
//                         </td>
//                       )}
//                       {showCol("show_location") && (
//                         <td className="p-4 text-slate-600 text-[13px]">
//                           {order?.location || "-"}
//                         </td>
//                       )}
//                       {showCol("show_asin_fsn") && (
//                         <td className="p-4 text-xs font-mono text-slate-400">
//                           {order?.asin_fsn || "-"}
//                         </td>
//                       )}
//                       {showCol("show_model_name") && (
//                         <td
//                           className="p-4 text-slate-700 font-medium text-slate-700 text-[13px]"
//                           title={order?.model_name}
//                         >
//                           {order?.model_name || "-"}
//                         </td>
//                       )}
//                       {showCol("show_model_no") && (
//                         <td className="p-4 text-slate-600 text-[13px]">
//                           {order?.model_no || "-"}
//                         </td>
//                       )}

//                       {showCol("show_order_qty") && (
//                         <td className="p-4 text-center font-medium text-slate-700 text-slate-800">
//                           {order?.order_qty || "0"}
//                         </td>
//                       )}

//                       {showCol("show_order_amount") && (
//                         <td className="p-4 text-right font-medium text-slate-700 text-slate-700">
//                           ₹
//                           {parseFloat(order?.order_amount || 0).toLocaleString(
//                             "en-IN",
//                           )}
//                         </td>
//                       )}
//                       {showCol("show_unit_price") && (
//                         <td className="p-4 text-right text-slate-500 text-xs">
//                           ₹
//                           {parseFloat(order?.unit_price || 0).toLocaleString(
//                             "en-IN",
//                           )}
//                         </td>
//                       )}
//                       {showCol("show_payment_amount") && (
//                         <td className="p-4 text-right font-medium text-slate-700 text-slate-900">
//                           ₹
//                           {parseFloat(
//                             order?.payment_amount || 0,
//                           ).toLocaleString("en-IN")}
//                         </td>
//                       )}
//                       {showCol("show_card_offer") && (
//                         <td className="p-4 text-right font-medium text-slate-700 text-amber-600">
//                           ₹
//                           {parseFloat(order?.card_offer || 0).toLocaleString(
//                             "en-IN",
//                           )}
//                         </td>
//                       )}

//                       {showCol("show_order_status") && (
//                         <td className="p-4 text-center">
//                           {/* 🔥 PREMIUM DASHED BADGE IMPLEMENTATION */}
//                           <span
//                             className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium text-slate-700 tracking-widest uppercase border border-dashed ${badgeStyle.bg}`}
//                           >
//                             <span
//                               className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}
//                             ></span>
//                             {order?.order_status || "Open"}
//                           </span>
//                         </td>
//                       )}

//                       <td className="p-4 text-center sticky right-0 bg-white group-hover:bg-slate-50 border-l border-gray-100 transition-colors">
//                         <div className="flex items-center justify-center gap-3">
//                           <button
//                             onClick={() => handleViewClick(order?.id)}
//                             className="text-slate-400 hover:text-slate-900 transition"
//                             title="View Summary"
//                           >
//                             <i className="fas fa-eye"></i>
//                           </button>
//                           {role === "ADMIN" && (
//                             <>
//                               <button
//                                 onClick={() => handleEditClick(order)}
//                                 className="text-slate-400 hover:text-amber-500 transition"
//                                 title="Edit Record"
//                               >
//                                 <i className="fas fa-pen"></i>
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(order?.id)}
//                                 className="text-slate-400 hover:text-red-500 transition"
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

//       {/* PAGINATION - Premium Footer */}
//       <div className="mt-4 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 gap-4">
//         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
//           Total Records:{" "}
//           <span className="text-slate-800 text-sm">{totalRecords}</span>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((prev) => prev - 1)}
//             className="px-3 py-2 bg-white border border-gray-200 text-slate-600 rounded-md font-medium text-slate-700 text-xs hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 transition"
//           >
//             <i className="fas fa-chevron-left"></i>
//           </button>

//           <span className="px-4 py-2 bg-slate-900 text-white rounded-md font-medium text-slate-700 text-xs shadow-sm">
//             Page {currentPage} of {Math.ceil(totalRecords / 50) || 1}
//           </span>

//           <button
//             disabled={currentPage >= Math.ceil(totalRecords / 50)}
//             onClick={() => setCurrentPage((prev) => prev + 1)}
//             className="px-3 py-2 bg-white border border-gray-200 text-slate-600 rounded-md font-medium text-slate-700 text-xs hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 transition"
//           >
//             <i className="fas fa-chevron-right"></i>
//           </button>

//           <div className="flex items-center ml-2 border-l border-gray-200 pl-4">
//             <input
//               type="number"
//               value={jumpPage}
//               onChange={(e) => setJumpPage(e.target.value)}
//               placeholder="Go to..."
//               className="w-20 px-3 py-2 bg-white border border-gray-200 rounded-l-md text-xs font-medium text-slate-700 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200"
//             />
//             <button
//               onClick={() => {
//                 const p = parseInt(jumpPage);
//                 const maxPages = Math.ceil(totalRecords / 50) || 1;
//                 if (p > 0 && p <= maxPages) {
//                   setCurrentPage(p);
//                   setJumpPage("");
//                 } else {
//                   Swal.fire(
//                     `Please enter a valid page between 1 and ${maxPages}`,
//                   );
//                 }
//               }}
//               className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium text-slate-700 rounded-r-md transition"
//             >
//               GO
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* --- MODALS (Updated to Premium Enterprise Theme) --- */}

//       {/* 1. UPLOAD EXCEL MODAL */}
//       {isUploadModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
//             <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
//               <h2 className="text-xl font-black text-slate-900 tracking-tight">
//                 Bulk Upload Data
//               </h2>
//               <button
//                 onClick={() => setUploadModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>

//             <form onSubmit={handleUploadSubmit}>
//               <div className="border-2 border-dashed border-gray-200 p-8 text-center rounded-xl bg-gray-50 mb-6 hover:bg-gray-100 transition-colors">
//                 <i className="fas fa-file-excel text-3xl text-emerald-500 mb-3 block"></i>
//                 <input
//                   type="file"
//                   accept=".xlsx, .xls, .csv"
//                   onChange={handleFileChange}
//                   className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-medium text-slate-700 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-slate-900 hover:bg-slate-50 text-slate-500 text-xs uppercase tracking-widest py-3 rounded-lg font-medium text-slate-700 text-sm tracking-wider uppercase transition shadow-md"
//               >
//                 {loading ? "Uploading..." : "Sync Database"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* 2. FILTER MODAL */}
//       {isFilterModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white p-8 rounded-2xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95">
//             <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
//               <h2 className="text-xl font-black text-slate-900 tracking-tight">
//                 Advanced Filters
//               </h2>
//               <button
//                 onClick={() => setFilterModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
//               {/* Filter Inputs (Mapped directly from your existing logic) */}
//               {["start_date", "end_date"].map((field) => (
//                 <div key={field}>
//                   <label className="block text-[10px] font-medium text-slate-700 text-slate-500 uppercase tracking-widest mb-1.5">
//                     {field.replace("_", " ")}
//                   </label>
//                   <input
//                     type="date"
//                     value={filters[field]}
//                     onChange={(e) =>
//                       setFilters({ ...filters, [field]: e.target.value })
//                     }
//                     className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium text-slate-700"
//                   />
//                 </div>
//               ))}
//               <div>
//                 <label className="block text-[10px] font-medium text-slate-700 text-slate-500 uppercase tracking-widest mb-1.5">
//                   Order Status
//                 </label>
//                 <select
//                   value={filters.order_status}
//                   onChange={(e) =>
//                     setFilters({ ...filters, order_status: e.target.value })
//                   }
//                   className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium text-slate-700"
//                 >
//                   <option value="">All Statuses</option>{" "}
//                   <option value="Open">Open</option>{" "}
//                   <option value="Complete">Complete</option>{" "}
//                   <option value="Cancelled">Cancelled</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-[10px] font-medium text-slate-700 text-slate-500 uppercase tracking-widest mb-1.5">
//                   Firm
//                 </label>
//                 <select
//                   value={filters.firm}
//                   onChange={(e) =>
//                     setFilters({ ...filters, firm: e.target.value })
//                   }
//                   className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium text-slate-700"
//                 >
//                   <option value="">All Firms</option>{" "}
//                   {masterFirms.map((f) => (
//                     <option key={f.id} value={f.name}>
//                       {f.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-[10px] font-medium text-slate-700 text-slate-500 uppercase tracking-widest mb-1.5">
//                   Location
//                 </label>
//                 <select
//                   value={filters.location}
//                   onChange={(e) =>
//                     setFilters({ ...filters, location: e.target.value })
//                   }
//                   className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium text-slate-700"
//                 >
//                   <option value="">All Locations</option>{" "}
//                   {masterLocations.map((l) => (
//                     <option key={l.id} value={l.name}>
//                       {l.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-[10px] font-medium text-slate-700 text-slate-500 uppercase tracking-widest mb-1.5">
//                   Model
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Search model..."
//                   value={filters.model_no}
//                   onChange={(e) =>
//                     setFilters({ ...filters, model_no: e.target.value })
//                   }
//                   className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium text-slate-700"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
//                 className="px-5 py-2.5 bg-slate-100 text-slate-600 text-xs tracking-wider uppercase font-medium text-slate-700 rounded-lg hover:bg-slate-200 transition"
//               >
//                 Clear
//               </button>
//               <button
//                 onClick={() => {
//                   setCurrentPage(1);
//                   setFilterModalOpen(false);
//                 }}
//                 className="px-6 py-2.5 bg-slate-900 hover:bg-slate-50 text-slate-500 text-xs uppercase tracking-widest text-xs tracking-wider uppercase rounded-lg font-medium text-slate-700 transition shadow-md"
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 3. ADMIN COLUMN VIEW SETUP MODAL */}
//       {isViewSetupModalOpen && role === "ADMIN" && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white p-8 rounded-2xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95">
//             <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
//               <h2 className="text-xl font-black text-slate-900 tracking-tight">
//                 Configure User View
//               </h2>
//               <button
//                 onClick={() => setViewSetupModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto p-1 custom-scrollbar">
//               {Object.keys(viewSettings)
//                 .filter((k) => k.startsWith("show_"))
//                 .map((key) => (
//                   <label
//                     key={key}
//                     className="flex items-center space-x-3 bg-gray-50 p-3.5 rounded-xl cursor-pointer hover:bg-gray-100 border border-transparent hover:border-gray-200 transition"
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
//                       className="w-4 h-4 accent-slate-900 rounded"
//                     />
//                     <span className="text-[11px] font-medium text-slate-700 text-slate-700 uppercase tracking-widest">
//                       {key.replace("show_", "").replace(/_/g, " ")}
//                     </span>
//                   </label>
//                 ))}
//             </div>
//             <div className="flex justify-end gap-3 mt-6 border-t border-gray-100 pt-5">
//               <button
//                 onClick={() => setViewSetupModalOpen(false)}
//                 className="px-6 py-2.5 bg-slate-100 text-slate-600 text-xs tracking-wider uppercase font-medium text-slate-700 rounded-lg hover:bg-slate-200 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveViewSettings}
//                 className="px-8 py-2.5 bg-slate-900 hover:bg-slate-50 text-slate-500 text-xs uppercase tracking-widest text-xs tracking-wider uppercase rounded-lg font-medium text-slate-700 transition shadow-md"
//               >
//                 Save View
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 4. DATA ENTRY FORM MODAL (New Premium UI) */}
//       {isFormModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95">
//             <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white rounded-t-2xl">
//               <h2 className="text-xl font-black text-slate-900 tracking-tight">
//                 {editMode ? "Edit Order Record" : "Create New Order"}
//               </h2>
//               <button
//                 onClick={() => setFormModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
//               >
//                 <i className="fas fa-times text-lg"></i>
//               </button>
//             </div>

//             <div className="px-8 py-6 overflow-y-auto custom-scrollbar bg-gray-50/50">
//               <form
//                 id="orderForm"
//                 onSubmit={handleFormSubmit}
//                 className="flex flex-col gap-6 w-full"
//               >
//                 {/* Header Details Box */}
//                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
//                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 border-b border-gray-100 pb-3">
//                     Master Details
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
//                     <div>
//                       <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
//                         Order ID *
//                       </label>
//                       <input
//                         type="text"
//                         name="order_id"
//                         required
//                         value={headerData.order_id}
//                         onChange={handleHeaderChange}
//                         disabled={editMode}
//                         className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-900 focus:ring-1 focus:ring-slate-300 outline-none transition"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
//                         Txn Date
//                       </label>
//                       <input
//                         type="date"
//                         name="txn_date"
//                         required
//                         value={headerData.txn_date}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-700 focus:ring-1 focus:ring-slate-300 outline-none"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
//                         Merchant
//                       </label>
//                       <select
//                         name="merchant"
//                         value={headerData.merchant}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-700 focus:ring-1 focus:ring-slate-300 outline-none"
//                       >
//                         <option value="">Select Merchant</option>{" "}
//                         {masterMerchants.map((m) => (
//                           <option key={m.id} value={m.name}>
//                             {m.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
//                         Merchant ID
//                       </label>
//                       <input
//                         type="text"
//                         name="merchant_id"
//                         value={headerData.merchant_id}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-700 focus:ring-1 focus:ring-slate-300 outline-none"
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                     <div>
//                       <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
//                         Firm
//                       </label>
//                       <select
//                         name="firm"
//                         value={headerData.firm}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-700 focus:ring-1 focus:ring-slate-300 outline-none"
//                       >
//                         <option value="">Select Firm</option>{" "}
//                         {masterFirms.map((f) => (
//                           <option key={f.id} value={f.name}>
//                             {f.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
//                         Location
//                       </label>
//                       <select
//                         name="location"
//                         value={headerData.location}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-700 focus:ring-1 focus:ring-slate-300 outline-none"
//                       >
//                         <option value="">Select Location</option>{" "}
//                         {masterLocations.map((l) => (
//                           <option key={l.id} value={l.name}>
//                             {l.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
//                         Txn Detail
//                       </label>
//                       <input
//                         type="text"
//                         name="txn_detail"
//                         value={headerData.txn_detail}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-700 focus:ring-1 focus:ring-slate-300 outline-none"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Line Items */}
//                 <div>
//                   <div className="flex justify-between items-end mb-3 px-1">
//                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                       Product Line Items
//                     </h3>
//                     {!editMode && (
//                       <button
//                         type="button"
//                         onClick={handleAddItem}
//                         className="text-amber-600 hover:text-white bg-amber-50 hover:bg-amber-500 px-3 py-1.5 rounded-md text-[10px] font-medium text-slate-700 uppercase tracking-widest transition-all"
//                       >
//                         <i className="fas fa-plus mr-1"></i> Add Row
//                       </button>
//                     )}
//                   </div>

//                   {itemsData.map((item, index) => (
//                     <div
//                       key={index}
//                       className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-4 relative group"
//                     >
//                       {!editMode && itemsData.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveItem(index)}
//                           className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-full transition"
//                         >
//                           <i className="fas fa-trash-alt text-xs"></i>
//                         </button>
//                       )}

//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
//                         <div>
//                           <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
//                             ASIN / FSN
//                           </label>
//                           <select
//                             name="asin_fsn"
//                             value={item.asin_fsn}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-800 focus:ring-1 focus:ring-slate-300 outline-none"
//                           >
//                             <option value="">Select Code</option>{" "}
//                             {masterModels.map((m) => (
//                               <option key={m.id} value={m.asin_fsn}>
//                                 {m.asin_fsn}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-medium text-slate-700 text-slate-400 uppercase tracking-widest mb-1.5">
//                             Model Name
//                           </label>
//                           <input
//                             type="text"
//                             value={item.model_name}
//                             readOnly
//                             className="w-full bg-gray-100 border border-transparent p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-500 cursor-not-allowed"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-medium text-slate-700 text-slate-400 uppercase tracking-widest mb-1.5">
//                             Model Number
//                           </label>
//                           <input
//                             type="text"
//                             value={item.model_no}
//                             readOnly
//                             className="w-full bg-gray-100 border border-transparent p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-500 cursor-not-allowed"
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 md:grid-cols-6 gap-5">
//                         <div>
//                           <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
//                             Status
//                           </label>
//                           <select
//                             name="order_status"
//                             value={item.order_status}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-gray-50 border border-gray-200 text-slate-800 font-medium text-slate-700 p-2.5 rounded-lg text-sm outline-none focus:ring-1 focus:ring-slate-300"
//                           >
//                             <option value="Open">Open</option>{" "}
//                             <option value="Complete">Complete</option>{" "}
//                             <option value="Cancelled">Cancelled</option>
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
//                             Qty
//                           </label>
//                           <input
//                             type="number"
//                             min="1"
//                             name="order_qty"
//                             value={item.order_qty}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-800 outline-none focus:ring-1 focus:ring-slate-300 text-center"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
//                             Order Amt (₹)
//                           </label>
//                           <input
//                             type="number"
//                             step="0.01"
//                             name="order_amount"
//                             value={item.order_amount}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-800 outline-none focus:ring-1 focus:ring-slate-300"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
//                             Payment (₹)
//                           </label>
//                           <input
//                             type="number"
//                             step="0.01"
//                             name="payment_amount"
//                             value={item.payment_amount}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-emerald-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-medium text-slate-700 text-slate-400 uppercase tracking-widest mb-1.5">
//                             Unit Price
//                           </label>
//                           <input
//                             type="text"
//                             disabled
//                             value={`₹ ${item.unit_price}`}
//                             className="w-full bg-gray-100 border border-transparent p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-500 text-right"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[10px] font-medium text-slate-700 text-amber-600 uppercase tracking-widest mb-1.5">
//                             Card Offer
//                           </label>
//                           <input
//                             type="text"
//                             disabled
//                             value={`₹ ${item.card_offer}`}
//                             className="w-full bg-amber-50 border border-amber-100 p-2.5 rounded-lg text-sm font-black text-amber-600 text-right"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </form>
//             </div>

//             <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-2xl">
//               <button
//                 type="button"
//                 onClick={() => setFormModalOpen(false)}
//                 className="px-6 py-2.5 bg-slate-100 text-slate-600 text-xs font-medium text-slate-700 uppercase tracking-wider rounded-lg hover:bg-slate-200 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="orderForm"
//                 disabled={loading}
//                 className="px-8 py-2.5 bg-slate-900 hover:bg-slate-50 text-slate-500 text-xs uppercase tracking-widest text-xs font-medium text-slate-700 uppercase tracking-wider rounded-lg shadow-md transition disabled:opacity-50"
//               >
//                 {loading ? "Saving..." : "Save Record"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 5. VIEW SUMMARY MODAL (Clean enterprise grids) */}
//       {isViewSummaryModalOpen && viewSummaryData && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95">
//             <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white rounded-t-2xl">
//               <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
//                 <i className="fas fa-chart-pie text-slate-400"></i> Order
//                 Summary Log
//               </h2>
//               <div className="flex items-center gap-5">
//                 <span className="text-[10px] font-medium text-slate-700 text-slate-500 uppercase tracking-widest flex items-center gap-2">
//                   Status:
//                   {/* Dashed badge in header */}
//                   <span
//                     className={`px-2.5 py-1 rounded-md border border-dashed ${getBadgeStyle(viewSummaryData.order_status).bg}`}
//                   >
//                     {viewSummaryData.order_status}
//                   </span>
//                 </span>
//                 <button
//                   onClick={() => {
//                     setViewSummaryModalOpen(false);
//                     setViewSummaryData(null);
//                   }}
//                   className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
//                 >
//                   <i className="fas fa-times text-lg"></i>
//                 </button>
//               </div>
//             </div>

//             <div className="px-8 py-8 overflow-y-auto custom-scrollbar bg-gray-50/50 rounded-b-2xl">
//               {/* Block 1: Base Info (Muted Slate) */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                 {[
//                   { label: "Order ID", value: viewSummaryData.order_id },
//                   {
//                     label: "Txn Date",
//                     value: formatDate(viewSummaryData.txn_date),
//                   },
//                   { label: "ASIN/FSN", value: viewSummaryData.asin_fsn },
//                   { label: "Model No", value: viewSummaryData.model_no || "-" },
//                   { label: "Order Qty", value: viewSummaryData.order_qty },
//                   {
//                     label: "Order Amount",
//                     value: `₹ ${viewSummaryData.order_amount.toLocaleString("en-IN")}`,
//                   },
//                 ].map((item, i) => (
//                   <div
//                     key={i}
//                     className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
//                   >
//                     <label className="block text-[10px] font-medium text-slate-700 text-slate-400 uppercase tracking-widest mb-1">
//                       {item.label}
//                     </label>
//                     <div className="text-sm font-medium text-slate-700 text-slate-800 truncate">
//                       {item.value}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Block 2: Fulfillment (Emerald & Red) */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                 <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 shadow-sm">
//                   <label className="block text-[10px] font-medium text-slate-700 text-emerald-600 uppercase tracking-widest mb-1">
//                     Delivered Qty
//                   </label>
//                   <div className="text-lg font-black text-emerald-700">
//                     {viewSummaryData.delivered_qty}
//                   </div>
//                 </div>
//                 <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 shadow-sm">
//                   <label className="block text-[10px] font-medium text-slate-700 text-emerald-600 uppercase tracking-widest mb-1">
//                     Delivered Amt
//                   </label>
//                   <div className="text-lg font-black text-emerald-700">
//                     ₹ {viewSummaryData.delivered_amount.toLocaleString("en-IN")}
//                   </div>
//                 </div>
//                 <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 shadow-sm">
//                   <label className="block text-[10px] font-medium text-slate-700 text-red-600 uppercase tracking-widest mb-1">
//                     Cancel Qty
//                   </label>
//                   <div className="text-lg font-black text-red-700">
//                     {viewSummaryData.cancel_qty}
//                   </div>
//                 </div>
//                 <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 shadow-sm">
//                   <label className="block text-[10px] font-medium text-slate-700 text-red-600 uppercase tracking-widest mb-1">
//                     Cancel Amt
//                   </label>
//                   <div className="text-lg font-black text-red-700">
//                     ₹ {viewSummaryData.cancel_amount.toLocaleString("en-IN")}
//                   </div>
//                 </div>
//               </div>

//               {/* Block 3: Adjustments (Blue/Amber) */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                 <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 shadow-sm">
//                   <label className="block text-[10px] font-medium text-slate-700 text-blue-600 uppercase tracking-widest mb-1">
//                     Short Qty
//                   </label>
//                   <div className="text-lg font-black text-blue-700">
//                     {viewSummaryData.short_qty}
//                   </div>
//                 </div>
//                 <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 shadow-sm">
//                   <label className="block text-[10px] font-medium text-slate-700 text-blue-600 uppercase tracking-widest mb-1">
//                     Short Amt
//                   </label>
//                   <div className="text-lg font-black text-blue-700">
//                     ₹ {viewSummaryData.short_amount.toLocaleString("en-IN")}
//                   </div>
//                 </div>
//                 <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-sm">
//                   <label className="block text-[10px] font-medium text-slate-700 text-amber-600 uppercase tracking-widest mb-1">
//                     Refund Qty
//                   </label>
//                   <div className="text-lg font-black text-amber-700">
//                     {viewSummaryData.refund_qty}
//                   </div>
//                 </div>
//                 <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-sm">
//                   <label className="block text-[10px] font-medium text-slate-700 text-amber-600 uppercase tracking-widest mb-1">
//                     Refund Amt
//                   </label>
//                   <div className="text-lg font-black text-amber-700">
//                     ₹ {viewSummaryData.refund_amount.toLocaleString("en-IN")}
//                   </div>
//                 </div>
//               </div>

//               {/* Block 4: Final Pending & Inward (Slate Highlight) */}
//               <div className="bg-slate-900 rounded-2xl p-6 shadow-md text-white grid grid-cols-2 md:grid-cols-5 gap-6">
//                 <div>
//                   <label className="block text-[10px] font-medium text-slate-700 text-slate-400 uppercase tracking-widest mb-1">
//                     Pending Qty
//                   </label>
//                   <div className="text-xl font-black text-white">
//                     {viewSummaryData.pending_qty}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-medium text-slate-700 text-slate-400 uppercase tracking-widest mb-1">
//                     Pending Amt
//                   </label>
//                   <div className="text-xl font-black text-white">
//                     ₹ {viewSummaryData.pending_amount.toLocaleString("en-IN")}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-medium text-slate-700 text-amber-400 uppercase tracking-widest mb-1">
//                     Pending Refund
//                   </label>
//                   <div className="text-xl font-black text-amber-400">
//                     ₹{" "}
//                     {viewSummaryData.pending_refund_amount.toLocaleString(
//                       "en-IN",
//                     )}
//                   </div>
//                 </div>
//                 <div className="border-l border-slate-700 pl-6">
//                   <label className="block text-[10px] font-medium text-slate-700 text-emerald-400 uppercase tracking-widest mb-1">
//                     Inward Qty
//                   </label>
//                   <div className="text-xl font-black text-emerald-400">
//                     {viewSummaryData.inward_qty}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-medium text-slate-700 text-emerald-400 uppercase tracking-widest mb-1">
//                     Inward Amt
//                   </label>
//                   <div className="text-xl font-black text-emerald-400">
//                     ₹ {viewSummaryData.inward_amount.toLocaleString("en-IN")}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import api from "../api/axios";
// import Swal from "sweetalert2";
// import {
//   IconDownload,
//   IconColumns,
//   IconPlus,
//   IconSearch,
//   IconFilter,
// } from "./ApprovalManager";

// // --- EXTRA REUSABLE SVG ICONS (For uniformity) ---
// const IconUpload = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//     <polyline points="17 8 12 3 7 8"></polyline>
//     <line x1="12" y1="3" x2="12" y2="15"></line>
//   </svg>
// );
// const IconTemplate = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
//     <polyline points="14 2 14 8 20 8"></polyline>
//     <line x1="16" y1="13" x2="8" y2="13"></line>
//     <line x1="16" y1="17" x2="8" y2="17"></line>
//     <polyline points="10 9 9 9 8 9"></polyline>
//   </svg>
// );

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
//   const [isViewSetupModalOpen, setViewSetupModalOpen] = useState(false);
//   const [isViewSummaryModalOpen, setViewSummaryModalOpen] = useState(false);
//   const [viewSummaryData, setViewSummaryData] = useState(null);

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

//   const handleDownloadTemplate = () => {
//     const headers = [
//       "S.No",
//       "Order ID",
//       "Txn Date",
//       "Month",
//       "Day",
//       "Txn Detail",
//       "Merchant",
//       "Merchant ID",
//       "Firm",
//       "Location",
//       "ASIN/FSN",
//       "Model Name",
//       "Model",
//       "Qty",
//       "Order Amt",
//       "Unit Price",
//       "Payment",
//       "Card Offer",
//     ];
//     const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "Order_Reports_Template.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
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

//   const [selectedIds, setSelectedIds] = useState([]);

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

//   const handleRowSelect = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
//     );
//   };

//   const handleSelectAll = () => {
//     if (orders.length > 0 && selectedIds.length === orders.length)
//       setSelectedIds([]);
//     else setSelectedIds(orders.map((order) => order.id));
//   };

//   const handleBulkDelete = async () => {
//     if (selectedIds.length === 0) return Swal.fire("Select records first!");
//     const confirm = await Swal.fire({
//       title: "Delete Multiple Records?",
//       text: `You are permanently deleting ${selectedIds.length} orders.`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#e67e22",
//       cancelButtonColor: "#94a3b8",
//       confirmButtonText: "Yes, delete!",
//     });

//     if (confirm.isConfirmed) {
//       try {
//         setLoading(true);
//         await api.post("reports/orders/bulk-delete/", { ids: selectedIds });
//         Swal.fire("Deleted!", "Orders have been deleted.", "success");
//         setSelectedIds([]);
//         fetchData();
//       } catch (error) {
//         Swal.fire("Error", "Deletion failed.", "error");
//       } finally {
//         setLoading(false);
//       }
//     }
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

//   const handleViewClick = async (orderId) => {
//     try {
//       const res = await api.get(`reports/order-summary/${orderId}/`);
//       setViewSummaryData(res.data);
//       setViewSummaryModalOpen(true);
//       fetchData();
//     } catch (error) {
//       Swal.fire("Error fetching order summary.");
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
//       if (error.response && error.response.data) {
//         if (error.response.data.error) Swal.fire(error.response.data.error);
//         else Swal.fire("Data validation failed. Please check inputs.");
//       } else Swal.fire("Error saving record.");
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

//   const handleExportExcel = async () => {
//     try {
//       Swal.fire({
//         title: "Preparing Smart Excel...",
//         text: "Please wait while we generate your file.",
//         allowOutsideClick: false,
//         didOpen: () => {
//           Swal.showLoading();
//         },
//       });
//       const filterParams = { ...filters, search: globalSearch };
//       const response = await api.get("reports/export/orders/", {
//         params: filterParams,
//         responseType: "blob",
//       });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute(
//         "download",
//         filters.firm ? `${filters.firm}_Orders.xlsx` : `All_Orders.xlsx`,
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
//       window.URL.revokeObjectURL(url);
//       Swal.fire("Success!", "Excel downloaded successfully!", "success");
//     } catch (error) {
//       Swal.fire("Error!", "Failed to export Excel file.", "error");
//     }
//   };

//   const showCol = (colName) =>
//     role === "ADMIN" ? true : viewSettings[colName] !== false;

//   // 🔥 PREMIUM DASHED BADGE FUNCTION 🔥
//   const getBadgeStyle = (status) => {
//     const s = String(status || "")
//       .trim()
//       .toLowerCase();
//     if (s === "open" || s === "new")
//       return {
//         bg: "bg-blue-50 text-[#e67e22] border-[#e67e22]/30",
//         dot: "bg-[#e67e22]",
//       };
//     if (s === "complete" || s === "delivered")
//       return {
//         bg: "bg-green-50 text-[#52c41a] border-[#52c41a]/30",
//         dot: "bg-[#52c41a]",
//       };
//     if (s === "cancelled" || s === "rejected")
//       return {
//         bg: "bg-red-50 text-[#ff4d4f] border-[#ff4d4f]/30",
//         dot: "bg-[#ff4d4f]",
//       };
//     if (s === "processing" || s === "pending")
//       return {
//         bg: "bg-amber-50 text-amber-600 border-amber-300",
//         dot: "bg-amber-500",
//       };
//     return {
//       bg: "bg-gray-50 text-gray-600 border-gray-300",
//       dot: "bg-gray-500",
//     };
//   };

//   return (
//     <div className="bg-[#f8f9fa] min-h-screen font-sans pb-10 text-slate-700">
//       {/* HEADER */}
//       <div className="bg-white px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
//         <div>
//           <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
//             Modules / <span className="text-slate-600">Orders</span>
//           </p>
//           <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
//             Order Management
//           </h1>
//         </div>
//       </div>

//       {/* --- MAIN CARD WRAPPER --- */}
//       <div className="mx-6 mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
//         {/* TOOLBAR */}
//         <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-gray-100 bg-white gap-4">
//           <div className="flex items-center gap-3 w-full md:w-auto">
//             {/* SEARCH BAR */}
//             <div className="flex items-center bg-white px-4 py-2 rounded-full border border-gray-300 w-full md:w-72 shadow-sm focus-within:border-[#e67e22] focus-within:ring-2 focus-within:ring-blue-50 transition-all">
//               <IconSearch />
//               <input
//                 type="text"
//                 placeholder="Search ASIN, Model, ID..."
//                 value={globalSearch}
//                 onChange={(e) => setGlobalSearch(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && fetchData()}
//                 className="bg-transparent border-none outline-none ml-2 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
//               />
//               {globalSearch && (
//                 <button
//                   onClick={() => {
//                     setGlobalSearch("");
//                     setCurrentPage(1);
//                     fetchData();
//                   }}
//                   className="text-gray-400 hover:text-gray-600 outline-none ml-2"
//                 >
//                   <i className="fas fa-times-circle"></i>
//                 </button>
//               )}
//             </div>

//             <button
//               onClick={() => setFilterModalOpen(true)}
//               className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[13px] font-bold transition-colors shadow-sm ${Object.values(filters).some((x) => x !== "") ? "bg-blue-50 border-blue-200 text-[#e67e22]" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
//             >
//               <IconFilter /> Filter
//               {Object.values(filters).some((x) => x !== "") && (
//                 <span className="w-2 h-2 bg-[#e67e22] rounded-full ml-1"></span>
//               )}
//             </button>
//           </div>

//           <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto [&::-webkit-scrollbar]:hidden">
//             {role === "ADMIN" && (
//               <button
//                 onClick={() => setViewSetupModalOpen(true)}
//                 className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-500 rounded-[10px] text-[12px] font-bold hover:bg-gray-50 hover:text-[#e67e22] transition shadow-sm"
//               >
//                 <IconColumns /> View
//               </button>
//             )}

//             <div className="flex items-center gap-2 bg-white p-1.5 rounded-[12px] border border-gray-200 shadow-sm">
//               <button
//                 onClick={handleDownloadTemplate}
//                 title="Download CSV Template"
//                 className="flex items-center justify-center px-3 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-[#e67e22] transition font-bold text-[11px]"
//               >
//                 <IconTemplate />
//               </button>
//               <button
//                 onClick={() => setUploadModalOpen(true)}
//                 title="Upload Excel"
//                 className="flex items-center justify-center px-3 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-[#52c41a] transition"
//               >
//                 <IconUpload />
//               </button>
//               <button
//                 onClick={handleExportExcel}
//                 title="Export Data"
//                 className="flex items-center justify-center px-3 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition"
//               >
//                 <IconDownload />
//               </button>
//             </div>

//             {role === "ADMIN" && selectedIds.length > 0 && (
//               <button
//                 onClick={handleBulkDelete}
//                 className="flex items-center gap-2 px-4 py-2 bg-red-50 text-[#ff4d4f] border border-red-200 rounded-[10px] text-[13px] font-bold shadow-sm transition animate-in zoom-in"
//               >
//                 <i className="fas fa-trash-alt"></i> Delete (
//                 {selectedIds.length})
//               </button>
//             )}

//             <button
//               onClick={() => {
//                 setHeaderData(initialHeaderState);
//                 setItemsData([{ ...initialItemState }]);
//                 setEditMode(false);
//                 setFormModalOpen(true);
//               }}
//               className="flex items-center gap-2 px-5 py-2.5 bg-[#e67e22] hover:bg-blue-600 text-white rounded-[10px] transition font-bold text-[13px] shadow-md shadow-[#e67e22]/20 whitespace-nowrap"
//             >
//               <IconPlus /> New Order
//             </button>
//           </div>
//         </div>

//         {/* MAIN TABLE AREA */}
//         <div className="overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[55vh] max-h-[65vh]">
//           <table className="w-full text-left min-w-max border-collapse">
//             <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 text-[11px] font-bold uppercase tracking-widest sticky top-0 z-10 backdrop-blur-md">
//               <tr>
//                 {role === "ADMIN" && (
//                   <th className="p-4 w-12 text-center border-r border-gray-100">
//                     <input
//                       type="checkbox"
//                       onChange={handleSelectAll}
//                       checked={
//                         orders.length > 0 &&
//                         selectedIds.length === orders.length
//                       }
//                       className="w-4 h-4 rounded border-gray-300 text-[#e67e22] focus:ring-[#e67e22] cursor-pointer"
//                     />
//                   </th>
//                 )}
//                 <th className="p-4 text-center">S.No</th>
//                 {showCol("show_order_id") && <th className="p-4">Order ID</th>}
//                 {showCol("show_txn_date") && <th className="p-4">Txn Date</th>}
//                 {showCol("show_month") && <th className="p-4">Month</th>}
//                 {showCol("show_day") && <th className="p-4">Day</th>}
//                 {showCol("show_txn_detail") && (
//                   <th className="p-4">Txn Detail</th>
//                 )}
//                 {showCol("show_merchant") && <th className="p-4">Merchant</th>}
//                 {showCol("show_merchant_id") && (
//                   <th className="p-4">Merchant ID</th>
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
//                   <th className="p-4 text-right">Card Offer</th>
//                 )}
//                 {showCol("show_order_status") && (
//                   <th className="p-4 text-center">Status</th>
//                 )}
//                 <th className="p-4 text-center sticky right-0 bg-slate-50 border-l border-gray-200">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 text-[13.5px] font-medium text-slate-700">
//               {orders.length === 0 ? (
//                 <tr>
//                   <td colSpan="21" className="p-16 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
//                         <i className="fas fa-inbox text-2xl text-gray-300"></i>
//                       </div>
//                       <p className="font-bold text-slate-600">
//                         No Orders Found
//                       </p>
//                       <p className="text-[12px] text-gray-400 mt-1">
//                         Try adjusting your search or filter criteria.
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 orders.map((order, index) => {
//                   if (!order) return null;
//                   const badgeStyle = getBadgeStyle(order?.order_status);

//                   return (
//                     <tr
//                       key={order?.id || index}
//                       className="hover:bg-blue-50/20 transition-colors group"
//                     >
//                       {role === "ADMIN" && (
//                         <td className="p-4 text-center border-r border-gray-50">
//                           <input
//                             type="checkbox"
//                             checked={selectedIds.includes(order.id)}
//                             onChange={() => handleRowSelect(order.id)}
//                             className="w-4 h-4 rounded border-gray-300 text-[#e67e22] focus:ring-[#e67e22] cursor-pointer"
//                           />
//                         </td>
//                       )}
//                       <td className="p-4 text-center text-gray-400 font-medium text-xs">
//                         {((currentPage - 1) * 50 + index + 1)
//                           .toString()
//                           .padStart(2, "0")}
//                       </td>

//                       {showCol("show_order_id") && (
//                         <td className="p-4 font-mono font-bold text-[#e67e22] tracking-wide whitespace-nowrap">
//                           {order?.order_id || "-"}
//                         </td>
//                       )}
//                       {showCol("show_txn_date") && (
//                         <td className="p-4 text-gray-500 whitespace-nowrap">
//                           {formatDate(order?.txn_date)}
//                         </td>
//                       )}
//                       {showCol("show_month") && (
//                         <td className="p-4 text-gray-500 capitalize">
//                           {order?.month || "-"}
//                         </td>
//                       )}
//                       {showCol("show_day") && (
//                         <td className="p-4 text-gray-500">
//                           {order?.day || "-"}
//                         </td>
//                       )}

//                       {showCol("show_txn_detail") && (
//                         <td
//                           className="p-4 max-w-[180px] truncate text-slate-600"
//                           title={order?.txn_detail}
//                         >
//                           {order?.txn_detail || "-"}
//                         </td>
//                       )}
//                       {showCol("show_merchant") && (
//                         <td className="p-4 font-semibold text-slate-800 whitespace-nowrap">
//                           {order?.merchant || "-"}
//                         </td>
//                       )}
//                       {showCol("show_merchant_id") && (
//                         <td className="p-4 font-mono text-xs text-gray-500">
//                           {order?.merchant_id || "-"}
//                         </td>
//                       )}
//                       {showCol("show_firm") && (
//                         <td className="p-4 font-semibold text-slate-800 whitespace-nowrap">
//                           {order?.firm || "-"}
//                         </td>
//                       )}
//                       {showCol("show_location") && (
//                         <td className="p-4 text-gray-500">
//                           {order?.location || "-"}
//                         </td>
//                       )}

//                       {showCol("show_asin_fsn") && (
//                         <td className="p-4 font-mono font-bold text-slate-700">
//                           {order?.asin_fsn || "-"}
//                         </td>
//                       )}
//                       {showCol("show_model_name") && (
//                         <td
//                           className="p-4 font-semibold text-slate-800 max-w-[200px] truncate"
//                           title={order?.model_name}
//                         >
//                           {order?.model_name || "-"}
//                         </td>
//                       )}
//                       {showCol("show_model_no") && (
//                         <td className="p-4 text-gray-500">
//                           {order?.model_no || "-"}
//                         </td>
//                       )}

//                       {showCol("show_order_qty") && (
//                         <td className="p-4 text-center font-bold text-slate-700">
//                           {order?.order_qty || "0"}
//                         </td>
//                       )}
//                       {showCol("show_order_amount") && (
//                         <td className="p-4 text-right font-bold text-slate-700">
//                           ₹
//                           {parseFloat(order?.order_amount || 0).toLocaleString(
//                             "en-IN",
//                           )}
//                         </td>
//                       )}
//                       {showCol("show_unit_price") && (
//                         <td className="p-4 text-right text-gray-500 text-xs">
//                           ₹
//                           {parseFloat(order?.unit_price || 0).toLocaleString(
//                             "en-IN",
//                           )}
//                         </td>
//                       )}
//                       {showCol("show_payment_amount") && (
//                         <td className="p-4 text-right font-bold text-[#52c41a]">
//                           ₹
//                           {parseFloat(
//                             order?.payment_amount || 0,
//                           ).toLocaleString("en-IN")}
//                         </td>
//                       )}
//                       {showCol("show_card_offer") && (
//                         <td className="p-4 text-right font-bold text-amber-500">
//                           ₹
//                           {parseFloat(order?.card_offer || 0).toLocaleString(
//                             "en-IN",
//                           )}
//                         </td>
//                       )}

//                       {showCol("show_order_status") && (
//                         <td className="p-4 text-center whitespace-nowrap">
//                           <span
//                             className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border border-dashed ${badgeStyle.bg}`}
//                           >
//                             <span
//                               className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}
//                             ></span>
//                             {order?.order_status || "Open"}
//                           </span>
//                         </td>
//                       )}

//                       <td className="p-4 text-center sticky right-0 bg-white group-hover:bg-blue-50/10 border-l border-gray-50 transition-colors z-10">
//                         <div className="flex items-center justify-center gap-2">
//                           <button
//                             onClick={() => handleViewClick(order?.id)}
//                             title="View Summary"
//                             className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 hover:text-[#722ed1] hover:bg-purple-50 shadow-sm flex items-center justify-center transition"
//                           >
//                             <i className="fas fa-eye text-[12px]"></i>
//                           </button>
//                           {role === "ADMIN" && (
//                             <>
//                               <button
//                                 onClick={() => handleEditClick(order)}
//                                 title="Edit Record"
//                                 className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#e67e22] hover:border-blue-200 shadow-sm flex items-center justify-center transition"
//                               >
//                                 <i className="fas fa-pen text-[12px]"></i>
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(order?.id)}
//                                 title="Delete Record"
//                                 className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#ff4d4f] hover:border-red-200 shadow-sm flex items-center justify-center transition"
//                               >
//                                 <i className="fas fa-trash-alt text-[12px]"></i>
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

//         {/* PAGINATION FOOTER */}
//         <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 bg-white border-t border-gray-200 gap-4">
//           <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
//             Total Records:{" "}
//             <span className="text-[#e67e22] text-[13px]">{totalRecords}</span>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((prev) => prev - 1)}
//               className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-slate-600 rounded-md hover:bg-gray-50 disabled:opacity-40 transition"
//             >
//               <i className="fas fa-chevron-left text-xs"></i>
//             </button>

//             <span className="px-4 py-1.5 bg-[#e67e22] text-white rounded-md font-bold text-[12px] shadow-sm">
//               Page {currentPage} of {Math.ceil(totalRecords / 50) || 1}
//             </span>

//             <button
//               disabled={currentPage >= Math.ceil(totalRecords / 50)}
//               onClick={() => setCurrentPage((prev) => prev + 1)}
//               className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-slate-600 rounded-md hover:bg-gray-50 disabled:opacity-40 transition"
//             >
//               <i className="fas fa-chevron-right text-xs"></i>
//             </button>

//             <div className="flex items-center ml-2 border-l border-gray-200 pl-4">
//               <input
//                 type="number"
//                 value={jumpPage}
//                 onChange={(e) => setJumpPage(e.target.value)}
//                 placeholder="Go to..."
//                 className="w-16 px-2 py-1.5 bg-white border border-gray-200 rounded-l-md text-[12px] font-medium text-slate-700 outline-none focus:border-[#e67e22]"
//               />
//               <button
//                 onClick={() => {
//                   const p = parseInt(jumpPage);
//                   const maxPages = Math.ceil(totalRecords / 50) || 1;
//                   if (p > 0 && p <= maxPages) {
//                     setCurrentPage(p);
//                     setJumpPage("");
//                   } else
//                     Swal.fire(`Enter a valid page between 1 and ${maxPages}`);
//                 }}
//                 className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[12px] font-bold rounded-r-md transition"
//               >
//                 GO
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ================= MODALS SECTION ================= */}

//       {/* 1. FILTER MODAL */}
//       {isFilterModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
//           <div className="bg-white p-8 rounded-2xl w-full max-w-4xl shadow-2xl animate-in zoom-in-95">
//             <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
//               <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">
//                 Advanced Filters
//               </h2>
//               <button
//                 onClick={() => setFilterModalOpen(false)}
//                 className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
//               {["start_date", "end_date"].map((field) => (
//                 <div key={field}>
//                   <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                     {field.replace("_", " ")}
//                   </label>
//                   <input
//                     type="date"
//                     value={filters[field]}
//                     onChange={(e) =>
//                       setFilters({ ...filters, [field]: e.target.value })
//                     }
//                     className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-medium transition"
//                   />
//                 </div>
//               ))}
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                   Order Status
//                 </label>
//                 <select
//                   value={filters.order_status}
//                   onChange={(e) =>
//                     setFilters({ ...filters, order_status: e.target.value })
//                   }
//                   className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-medium transition cursor-pointer"
//                 >
//                   <option value="">All Statuses</option>{" "}
//                   <option value="Open">Open</option>{" "}
//                   <option value="Complete">Complete</option>{" "}
//                   <option value="Cancelled">Cancelled</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                   Firm
//                 </label>
//                 <select
//                   value={filters.firm}
//                   onChange={(e) =>
//                     setFilters({ ...filters, firm: e.target.value })
//                   }
//                   className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-medium transition cursor-pointer"
//                 >
//                   <option value="">All Firms</option>{" "}
//                   {masterFirms.map((f) => (
//                     <option key={f.id} value={f.name}>
//                       {f.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                   Location
//                 </label>
//                 <select
//                   value={filters.location}
//                   onChange={(e) =>
//                     setFilters({ ...filters, location: e.target.value })
//                   }
//                   className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-medium transition cursor-pointer"
//                 >
//                   <option value="">All Locations</option>{" "}
//                   {masterLocations.map((l) => (
//                     <option key={l.id} value={l.name}>
//                       {l.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="lg:col-span-2">
//                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                   Model Number
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Search model..."
//                   value={filters.model_no}
//                   onChange={(e) =>
//                     setFilters({ ...filters, model_no: e.target.value })
//                   }
//                   className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-medium transition"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
//                 className="px-6 py-2.5 bg-gray-50 text-gray-600 font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-gray-100 transition"
//               >
//                 Clear Filters
//               </button>
//               <button
//                 onClick={() => {
//                   setCurrentPage(1);
//                   setFilterModalOpen(false);
//                 }}
//                 className="px-6 py-2.5 bg-[#e67e22] text-white font-bold uppercase tracking-widest text-[11px] rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-600 transition"
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 2. ADMIN COLUMN VIEW SETUP MODAL */}
//       {isViewSetupModalOpen && role === "ADMIN" && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col">
//             <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
//               <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">
//                 Configure Columns
//               </h2>
//               <button
//                 onClick={() => setViewSetupModalOpen(false)}
//                 className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times text-sm"></i>
//               </button>
//             </div>
//             <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 bg-[#f0f2f5]/40 max-h-[60vh] overflow-y-auto">
//               {Object.keys(viewSettings)
//                 .filter((k) => k.startsWith("show_"))
//                 .map((key) => (
//                   <label
//                     key={key}
//                     className="flex items-center gap-3 cursor-pointer p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-[#e67e22] transition-colors select-none"
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
//                       className="rounded border-gray-300 text-[#e67e22] focus:ring-[#e67e22] w-4 h-4 cursor-pointer"
//                     />
//                     <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
//                       {key.replace("show_", "").replace(/_/g, " ")}
//                     </span>
//                   </label>
//                 ))}
//             </div>
//             <div className="flex justify-end gap-3 px-8 py-4 border-t border-gray-100 bg-white">
//               <button
//                 onClick={handleSaveViewSettings}
//                 className="px-8 py-2.5 bg-[#e67e22] hover:bg-blue-600 text-white font-bold uppercase tracking-widest text-[11px] rounded-xl shadow-md shadow-blue-500/20 transition"
//               >
//                 Save Layout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 3. UPLOAD EXCEL MODAL */}
//       {isUploadModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
//           <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
//             <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
//               <div>
//                 <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">
//                   Bulk Upload Orders
//                 </h2>
//                 <p className="text-[12px] text-gray-400 font-medium mt-0.5">
//                   Upload new line items via Excel.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setUploadModalOpen(false)}
//                 className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>
//             <form onSubmit={handleUploadSubmit}>
//               <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-2xl bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-colors mb-6 group cursor-pointer relative">
//                 <i className="fas fa-file-excel text-4xl text-[#52c41a] mb-4 block group-hover:scale-110 transition-transform"></i>
//                 <input
//                   type="file"
//                   accept=".xlsx, .xls, .csv"
//                   onChange={handleFileChange}
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                 />
//                 <p className="text-[13px] font-bold text-slate-700">
//                   Click or drag file to this area
//                 </p>
//                 <p className="text-[11px] text-gray-400 mt-1">
//                   Supports Excel and CSV formats
//                 </p>
//                 {file && (
//                   <p className="text-[12px] font-bold text-[#e67e22] mt-4 bg-blue-50 py-1.5 rounded-md inline-block px-3 border border-blue-100">
//                     {file.name}
//                   </p>
//                 )}
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-[#e67e22] hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-[12px] transition shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <i className="fas fa-spinner fa-spin"></i> SYNCING...
//                   </>
//                 ) : (
//                   "UPLOAD TO DATABASE"
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* 4. DATA ENTRY FORM MODAL (New Premium UI) */}
//       {isFormModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95 overflow-hidden">
//             <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white">
//               <div>
//                 <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">
//                   {editMode ? "Edit Order Record" : "Create New Order"}
//                 </h2>
//                 <p className="text-[12px] text-gray-400 font-medium mt-0.5">
//                   Fill in the required fields to map an order.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setFormModalOpen(false)}
//                 className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times text-sm"></i>
//               </button>
//             </div>

//             <div className="px-8 py-6 overflow-y-auto custom-scrollbar bg-[#f0f2f5]/40">
//               <form
//                 id="orderForm"
//                 onSubmit={handleFormSubmit}
//                 className="flex flex-col gap-6 w-full"
//               >
//                 {/* Header Details Box */}
//                 <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//                   <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
//                     <i className="fas fa-info-circle text-[#e67e22]"></i> Master
//                     Details
//                   </h4>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
//                     <div>
//                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                         Order ID *
//                       </label>
//                       <input
//                         type="text"
//                         name="order_id"
//                         required
//                         value={headerData.order_id}
//                         onChange={handleHeaderChange}
//                         disabled={editMode}
//                         className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                         Txn Date *
//                       </label>
//                       <input
//                         type="date"
//                         name="txn_date"
//                         required
//                         value={headerData.txn_date}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                         Merchant *
//                       </label>
//                       <select
//                         name="merchant"
//                         value={headerData.merchant}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                       >
//                         <option value="">-- Select --</option>
//                         {masterMerchants.map((m) => (
//                           <option key={m.id} value={m.name}>
//                             {m.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                         Merchant ID
//                       </label>
//                       <input
//                         type="text"
//                         name="merchant_id"
//                         value={headerData.merchant_id}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                       />
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                     <div>
//                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                         Firm *
//                       </label>
//                       <select
//                         name="firm"
//                         value={headerData.firm}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                       >
//                         <option value="">-- Select --</option>
//                         {masterFirms.map((f) => (
//                           <option key={f.id} value={f.name}>
//                             {f.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                         Location *
//                       </label>
//                       <select
//                         name="location"
//                         value={headerData.location}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                       >
//                         <option value="">-- Select --</option>
//                         {masterLocations.map((l) => (
//                           <option key={l.id} value={l.name}>
//                             {l.name}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                         Txn Detail
//                       </label>
//                       <input
//                         type="text"
//                         name="txn_detail"
//                         value={headerData.txn_detail}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Line Items */}
//                 <div className="space-y-4 mt-2">
//                   <div className="flex justify-between items-center px-1">
//                     <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
//                       <i className="fas fa-box-open text-[#e67e22]"></i> Product
//                       Line Items
//                     </h4>
//                     {!editMode && (
//                       <button
//                         type="button"
//                         onClick={handleAddItem}
//                         className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-[#e67e22] font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-blue-50 transition shadow-sm"
//                       >
//                         <IconPlus /> Add Row
//                       </button>
//                     )}
//                   </div>

//                   {itemsData.map((item, index) => (
//                     <div
//                       key={index}
//                       className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group"
//                     >
//                       {!editMode && itemsData.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveItem(index)}
//                           className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-50 text-[#ff4d4f] opacity-0 group-hover:opacity-100 hover:bg-red-100 flex items-center justify-center transition-all"
//                         >
//                           <i className="fas fa-trash-alt text-[12px]"></i>
//                         </button>
//                       )}

//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 pr-6">
//                         <div>
//                           <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                             ASIN / FSN *
//                           </label>
//                           <select
//                             name="asin_fsn"
//                             value={item.asin_fsn}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                           >
//                             <option value="">-- Search & Select --</option>
//                             {masterModels.map((m) => (
//                               <option key={m.id} value={m.asin_fsn}>
//                                 {m.asin_fsn}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                             Model Name
//                           </label>
//                           <input
//                             type="text"
//                             value={item.model_name}
//                             readOnly
//                             className="w-full bg-gray-50 border border-transparent p-2.5 rounded-xl text-[13px] font-semibold text-gray-500 cursor-not-allowed"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                             Model Number
//                           </label>
//                           <input
//                             type="text"
//                             value={item.model_no}
//                             readOnly
//                             className="w-full bg-gray-50 border border-transparent p-2.5 rounded-xl text-[13px] font-semibold text-gray-500 cursor-not-allowed"
//                           />
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 md:grid-cols-6 gap-5">
//                         <div>
//                           <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                             Status
//                           </label>
//                           <select
//                             name="order_status"
//                             value={item.order_status}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] outline-none text-[13px] font-semibold text-slate-800 transition"
//                           >
//                             <option value="Open">Open</option>
//                             <option value="Complete">Complete</option>
//                             <option value="Cancelled">Cancelled</option>
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                             Qty *
//                           </label>
//                           <input
//                             type="number"
//                             min="1"
//                             name="order_qty"
//                             value={item.order_qty}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] outline-none text-[13px] font-bold text-slate-800 text-center transition"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                             Order Amt (₹) *
//                           </label>
//                           <input
//                             type="number"
//                             step="0.01"
//                             name="order_amount"
//                             value={item.order_amount}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] outline-none text-[13px] font-bold text-slate-800 transition"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                             Payment (₹) *
//                           </label>
//                           <input
//                             type="number"
//                             step="0.01"
//                             name="payment_amount"
//                             value={item.payment_amount}
//                             onChange={(e) => handleItemChange(index, e)}
//                             className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#52c41a] focus:ring-4 focus:ring-green-50 outline-none text-[13px] font-bold text-[#52c41a] transition"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                             Unit Price
//                           </label>
//                           <input
//                             type="text"
//                             disabled
//                             value={`₹ ${item.unit_price}`}
//                             className="w-full bg-gray-50 border border-transparent p-2.5 rounded-xl text-[13px] font-semibold text-gray-500 text-right"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                             Card Offer
//                           </label>
//                           <input
//                             type="text"
//                             disabled
//                             value={`₹ ${item.card_offer}`}
//                             className="w-full bg-amber-50 border border-amber-100 p-2.5 rounded-xl text-[14px] font-black text-amber-600 text-right"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </form>
//             </div>

//             <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-white rounded-b-2xl">
//               <button
//                 type="button"
//                 onClick={() => setFormModalOpen(false)}
//                 className="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold uppercase tracking-widest text-[12px] rounded-xl transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="orderForm"
//                 disabled={loading}
//                 className="px-8 py-2.5 bg-[#e67e22] hover:bg-blue-600 text-white font-bold uppercase tracking-widest text-[12px] rounded-xl shadow-md shadow-blue-500/20 transition disabled:opacity-50"
//               >
//                 {loading ? "Saving..." : "Save Record"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 5. VIEW SUMMARY MODAL (Clean enterprise grids) */}
//       {isViewSummaryModalOpen && viewSummaryData && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 overflow-hidden">
//             <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white">
//               <h2 className="text-[18px] font-bold text-slate-800 tracking-tight flex items-center gap-3">
//                 <i className="fas fa-chart-pie text-[#e67e22]"></i> Order
//                 Summary:{" "}
//                 <span className="font-mono text-[#e67e22]">
//                   {viewSummaryData.order_id}
//                 </span>
//               </h2>
//               <div className="flex items-center gap-5">
//                 <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
//                   Status:
//                   <span
//                     className={`px-2.5 py-1 rounded-md border border-dashed ${getBadgeStyle(viewSummaryData.order_status).bg}`}
//                   >
//                     {viewSummaryData.order_status}
//                   </span>
//                 </span>
//                 <button
//                   onClick={() => {
//                     setViewSummaryModalOpen(false);
//                     setViewSummaryData(null);
//                   }}
//                   className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition"
//                 >
//                   <i className="fas fa-times text-sm"></i>
//                 </button>
//               </div>
//             </div>

//             <div className="px-8 py-8 overflow-y-auto custom-scrollbar bg-[#f0f2f5]/40">
//               {/* Block 1: Base Info */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                 {[
//                   { label: "Order ID", value: viewSummaryData.order_id },
//                   {
//                     label: "Txn Date",
//                     value: formatDate(viewSummaryData.txn_date),
//                   },
//                   { label: "ASIN/FSN", value: viewSummaryData.asin_fsn },
//                   { label: "Model No", value: viewSummaryData.model_no || "-" },
//                   { label: "Order Qty", value: viewSummaryData.order_qty },
//                   {
//                     label: "Order Amount",
//                     value: `₹ ${viewSummaryData.order_amount.toLocaleString("en-IN")}`,
//                   },
//                 ].map((item, i) => (
//                   <div
//                     key={i}
//                     className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
//                   >
//                     <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       {item.label}
//                     </label>
//                     <div className="text-[14px] font-bold text-slate-800 truncate">
//                       {item.value}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Block 2: Fulfillment */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                 <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-[#52c41a] uppercase tracking-widest mb-1.5">
//                     Delivered Qty
//                   </label>
//                   <div className="text-[18px] font-black text-green-700">
//                     {viewSummaryData.delivered_qty}
//                   </div>
//                 </div>
//                 <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-[#52c41a] uppercase tracking-widest mb-1.5">
//                     Delivered Amt
//                   </label>
//                   <div className="text-[18px] font-black text-green-700">
//                     ₹ {viewSummaryData.delivered_amount.toLocaleString("en-IN")}
//                   </div>
//                 </div>
//                 <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-[#ff4d4f] uppercase tracking-widest mb-1.5">
//                     Cancel Qty
//                   </label>
//                   <div className="text-[18px] font-black text-red-700">
//                     {viewSummaryData.cancel_qty}
//                   </div>
//                 </div>
//                 <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-[#ff4d4f] uppercase tracking-widest mb-1.5">
//                     Cancel Amt
//                   </label>
//                   <div className="text-[18px] font-black text-red-700">
//                     ₹ {viewSummaryData.cancel_amount.toLocaleString("en-IN")}
//                   </div>
//                 </div>
//               </div>

//               {/* Block 3: Adjustments */}
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                 <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-[#e67e22] uppercase tracking-widest mb-1.5">
//                     Short Qty
//                   </label>
//                   <div className="text-[18px] font-black text-blue-700">
//                     {viewSummaryData.short_qty}
//                   </div>
//                 </div>
//                 <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-[#e67e22] uppercase tracking-widest mb-1.5">
//                     Short Amt
//                   </label>
//                   <div className="text-[18px] font-black text-blue-700">
//                     ₹ {viewSummaryData.short_amount.toLocaleString("en-IN")}
//                   </div>
//                 </div>
//                 <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">
//                     Refund Qty
//                   </label>
//                   <div className="text-[18px] font-black text-amber-700">
//                     {viewSummaryData.refund_qty}
//                   </div>
//                 </div>
//                 <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">
//                     Refund Amt
//                   </label>
//                   <div className="text-[18px] font-black text-amber-700">
//                     ₹ {viewSummaryData.refund_amount.toLocaleString("en-IN")}
//                   </div>
//                 </div>
//               </div>

//               {/* Block 4: Final Pending & Inward */}
//               <div className="bg-[#1b2559] rounded-2xl p-6 shadow-md text-white grid grid-cols-2 md:grid-cols-5 gap-6">
//                 <div>
//                   <label className="block text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1.5">
//                     Pending Qty
//                   </label>
//                   <div className="text-[20px] font-black text-white">
//                     {viewSummaryData.pending_qty}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1.5">
//                     Pending Amt
//                   </label>
//                   <div className="text-[20px] font-black text-white">
//                     ₹ {viewSummaryData.pending_amount.toLocaleString("en-IN")}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold text-amber-300 uppercase tracking-widest mb-1.5">
//                     Pending Refund
//                   </label>
//                   <div className="text-[20px] font-black text-amber-300">
//                     ₹{" "}
//                     {viewSummaryData.pending_refund_amount.toLocaleString(
//                       "en-IN",
//                     )}
//                   </div>
//                 </div>
//                 <div className="border-l border-indigo-400/30 pl-6">
//                   <label className="block text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-1.5">
//                     Inward Qty
//                   </label>
//                   <div className="text-[20px] font-black text-emerald-300">
//                     {viewSummaryData.inward_qty}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-1.5">
//                     Inward Amt
//                   </label>
//                   <div className="text-[20px] font-black text-emerald-300">
//                     ₹ {viewSummaryData.inward_amount.toLocaleString("en-IN")}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

// --- 🛠️ HELPER FUNCTIONS ---
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
};

const formatIndianNumber = (num) => {
  if (!num || isNaN(num)) return "0.00";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

// --- 🔥 PREMIUM SVG ICONS ---
export const IconDownload = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);
export const IconUpload = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);
export const IconColumns = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="18" rx="1"></rect>
    <rect x="14" y="3" width="7" height="18" rx="1"></rect>
  </svg>
);
export const IconPlus = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
export const IconSearch = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#94a3b8"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
export const IconFilter = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);
export const IconTemplate = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export default function OrdersReport() {
  const fileInputRef = useRef(null);
  const role = localStorage.getItem("user_role") || "USER";
  const username = localStorage.getItem("username") || "User";

  // --- DATA STATES ---
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [jumpPage, setJumpPage] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [file, setFile] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Modals States
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isViewSetupModalOpen, setViewSetupModalOpen] = useState(false);
  const [isViewSummaryModalOpen, setViewSummaryModalOpen] = useState(false);
  const [viewSummaryData, setViewSummaryData] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [masterFirms, setMasterFirms] = useState([]);
  const [masterLocations, setMasterLocations] = useState([]);
  const [masterMerchants, setMasterMerchants] = useState([]);
  const [masterModels, setMasterModels] = useState([]);

  // --- FORM STATES ---
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
    card_no: "",
    placed_by: "",
    seller_gstn: "",
    seller_name: "",
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

  // --- DYNAMIC COLUMN VISIBILITY STATE ---
  const [viewSettings, setViewSettings] = useState({
    show_order_id: true,
    show_txn_date: true,
    show_month: false,
    show_day: false,
    show_txn_detail: false,
    show_merchant: true,
    show_merchant_id: false,
    show_firm: true,
    show_location: false,
    show_asin_fsn: true,
    show_model_name: true,
    show_model_no: false,
    show_order_status: true,
    show_order_qty: true,
    show_order_amount: true,
    show_unit_price: false,
    show_payment_amount: false,
    show_card_offer: false,
    show_card_no: true,
    show_placed_by: true,
    show_seller_info: true,
    show_delivered: true,
    show_cancel_qty: true,
    show_pending_qty: true,
    show_discrepancy: true,
    show_refund: true,
    show_grpo: true,
  });

  // --- API CALLS ---
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
        api
          .get("reports/column-policy/?policy_name=user_view_policy")
          .catch(() => ({ data: null })),
      ]);

      const records = dataRes.data.results || dataRes.data;
      setOrders(Array.isArray(records) ? records : []);
      setTotalRecords(dataRes.data.count || records.length || 0);
      if (settingsRes.data && Object.keys(settingsRes.data).length > 0) {
        setViewSettings((prev) => ({ ...prev, ...settingsRes.data }));
      }
    } catch (error) {
      console.error("Fetch data error:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, currentPage]);

  // --- EVENT HANDLERS ---
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

  const handleRowSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  const handleSelectAll = () => {
    if (orders.length > 0 && selectedIds.length === orders.length)
      setSelectedIds([]);
    else setSelectedIds(orders.map((order) => order.id));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return Swal.fire("Select records first!");
    const confirm = await Swal.fire({
      title: "Delete Multiple Records?",
      text: `You are permanently deleting ${selectedIds.length} orders.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e67e22",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, delete!",
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        await api.post("reports/orders/bulk-delete/", { ids: selectedIds });
        Swal.fire("Deleted!", "Orders have been deleted.", "success");
        setSelectedIds([]);
        fetchData();
      } catch (error) {
        Swal.fire("Error", "Deletion failed.", "error");
      } finally {
        setLoading(false);
      }
    }
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
      card_no,
      placed_by,
      seller_gstn,
      seller_name,
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
      card_no,
      placed_by,
      seller_gstn,
      seller_name,
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
    } catch (error) {
      Swal.fire("Error fetching order summary.");
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
        Swal.fire({
          icon: "success",
          title: "Updated!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        const payloads = itemsData.map((item) => ({ ...headerData, ...item }));
        await Promise.all(
          payloads.map((payload) => api.post("reports/orders/", payload)),
        );
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: `${payloads.length} item(s) saved.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setFormModalOpen(false);
      setHeaderData(initialHeaderState);
      setItemsData([{ ...initialItemState }]);
      setEditMode(false);
      fetchData();
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.error) Swal.fire(error.response.data.error);
        else Swal.fire("Data validation failed. Please check inputs.");
      } else Swal.fire("Error saving record.");
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
      Swal.fire({
        icon: "success",
        title: "View Saved!",
        timer: 1500,
        showConfirmButton: false,
      });
      setViewSetupModalOpen(false);
      fetchData();
    } catch (error) {
      Swal.fire("Failed to save view settings.");
    }
  };

  // --- EXCEL BULK UPLOAD HANDLERS ---
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file)
      return Swal.fire("Error", "Please select a file to upload.", "error");
    const data = new FormData();
    data.append("file", file);
    setLoading(true);
    try {
      const res = await api.post("reports/orders/upload/", data);
      Swal.fire(
        "Success",
        res.data.message || "Excel Uploaded Successfully!",
        "success",
      );
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

  const handleDownloadTemplate = () => {
    const headers = [
      "S.No",
      "Order ID",
      "Txn Date",
      "Month",
      "Day",
      "Txn Detail",
      "Merchant",
      "Merchant ID",
      "Firm",
      "Location",
      "ASIN/FSN",
      "Model Name",
      "Model",
      "Qty",
      "Order Amt",
      "Unit Price",
      "Payment",
      "Card Offer",
      "Card No",
      "Placed By",
      "Seller Name",
      "Seller GSTN",
    ];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Order_Reports_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = async () => {
    try {
      Swal.fire({
        title: "Preparing Smart Excel...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const filterParams = { ...filters, search: globalSearch };
      const response = await api.get("reports/export/orders/", {
        params: filterParams,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        filters.firm ? `${filters.firm}_Orders.xlsx` : `All_Orders.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      Swal.fire("Success!", "Excel downloaded successfully!", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to export Excel file.", "error");
    }
  };

  const showCol = (colName) =>
    role === "ADMIN" ? true : viewSettings[colName] !== false;

  const getBadgeStyle = (status) => {
    const s = String(status || "")
      .trim()
      .toLowerCase();
    if (s === "open" || s === "new")
      return {
        bg: "bg-blue-50 text-[#e67e22] border-[#e67e22]/30",
        dot: "bg-[#e67e22]",
      };
    if (s === "complete" || s === "delivered")
      return {
        bg: "bg-green-50 text-[#52c41a] border-[#52c41a]/30",
        dot: "bg-[#52c41a]",
      };
    if (s === "cancelled" || s === "rejected")
      return {
        bg: "bg-red-50 text-[#ff4d4f] border-[#ff4d4f]/30",
        dot: "bg-[#ff4d4f]",
      };
    if (s === "processing" || s === "pending")
      return {
        bg: "bg-amber-50 text-amber-600 border-amber-300",
        dot: "bg-amber-500",
      };
    return {
      bg: "bg-gray-50 text-gray-600 border-gray-300",
      dot: "bg-gray-500",
    };
  };

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans pb-10 text-slate-700">
      {/* HEADER */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
            Modules / <span className="text-slate-600">Orders</span>
          </p>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Order Management
          </h1>
        </div>
      </div>

      {/* --- MAIN CARD WRAPPER --- */}
      <div className="mx-6 mt-6 bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden flex flex-col">
        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-gray-100 bg-white gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-gray-50/80 px-4 py-2.5 rounded-full w-full md:w-[320px] border border-gray-100 focus-within:bg-white focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
              <IconSearch />
              <input
                type="text"
                placeholder="Search ASIN, Model, ID, Card No..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchData()}
                className="bg-transparent border-none outline-none ml-3 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
              />
              {globalSearch && (
                <button
                  onClick={() => {
                    setGlobalSearch("");
                    setCurrentPage(1);
                    fetchData();
                  }}
                  className="text-gray-400 hover:text-gray-600 outline-none ml-2"
                >
                  <i className="fas fa-times-circle"></i>
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-[13px] font-bold transition-colors shadow-sm whitespace-nowrap ${showFilters ? "bg-blue-50 border-blue-200 text-[#e67e22]" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              <IconFilter /> Filter
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto [&::-webkit-scrollbar]:hidden pb-1 md:pb-0">
            {role === "ADMIN" && (
              <button
                onClick={() => setViewSetupModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-500 rounded-[10px] text-[12px] font-bold hover:bg-gray-50 hover:text-[#e67e22] transition shadow-sm whitespace-nowrap"
              >
                <IconColumns /> View Headers
              </button>
            )}

            <div className="flex items-center gap-2 bg-white p-1.5 rounded-[12px] border border-gray-200 shadow-sm">
              <button
                onClick={handleDownloadTemplate}
                title="Download CSV Template"
                className="flex items-center justify-center w-8 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-[#e67e22] transition"
              >
                <IconTemplate />
              </button>
              <button
                onClick={() => setUploadModalOpen(true)}
                title="Upload Bulk Excel"
                className="flex items-center justify-center w-8 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-[#52c41a] transition"
              >
                <IconUpload />
              </button>
              <button
                onClick={handleExportExcel}
                title="Export Data"
                className="flex items-center justify-center w-8 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-[#722ed1] transition"
              >
                <IconDownload />
              </button>
            </div>

            {role === "ADMIN" && selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-[#ff4d4f] border border-red-100 rounded-[10px] text-[12px] font-bold shadow-sm transition animate-in zoom-in whitespace-nowrap hover:bg-red-100"
              >
                <i className="fas fa-trash-alt"></i> Delete (
                {selectedIds.length})
              </button>
            )}

            <button
              onClick={() => {
                setHeaderData(initialHeaderState);
                setItemsData([{ ...initialItemState }]);
                setEditMode(false);
                setFormModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#e67e22] hover:bg-blue-600 text-white rounded-[10px] transition font-bold text-[13px] shadow-md shadow-blue-500/20 whitespace-nowrap"
            >
              <IconPlus /> New Entry
            </button>
          </div>
        </div>

        {/* EXPANDABLE FILTERS */}
        {showFilters && (
          <div className="px-6 py-4 bg-[#fafafa] border-b border-gray-100 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) =>
                    setFilters({ ...filters, start_date: e.target.value })
                  }
                  className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#e67e22] transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) =>
                    setFilters({ ...filters, end_date: e.target.value })
                  }
                  className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#e67e22] transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Firm
                </label>
                <select
                  value={filters.firm}
                  onChange={(e) =>
                    setFilters({ ...filters, firm: e.target.value })
                  }
                  className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#e67e22] transition"
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
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#e67e22] transition"
                >
                  <option value="">All Locations</option>
                  {masterLocations.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Model / Txn Detail
                </label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.model_no}
                  onChange={(e) =>
                    setFilters({ ...filters, model_no: e.target.value })
                  }
                  className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#e67e22] transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Order Status
                </label>
                <select
                  value={filters.order_status}
                  onChange={(e) =>
                    setFilters({ ...filters, order_status: e.target.value })
                  }
                  className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#e67e22] transition"
                >
                  <option value="">All Statuses</option>
                  <option value="Open">Open</option>
                  <option value="Complete">Complete</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
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
                    setShowFilters(false);
                  }}
                  className="w-full p-2.5 bg-white border border-gray-200 text-gray-500 text-[12px] font-bold uppercase tracking-widest rounded-lg hover:bg-gray-50 transition shadow-sm"
                >
                  Clear
                </button>
                <button
                  onClick={() => {
                    setCurrentPage(1);
                    setShowFilters(false);
                  }}
                  className="w-full p-2.5 bg-[#e67e22] text-white font-bold uppercase tracking-widest text-[12px] rounded-lg shadow-md shadow-blue-500/20 hover:bg-blue-600 transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FULL DATA TABLE (BORDERS & NORMALIZED COLORS APPLIED) */}
        <div className="overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[50vh] max-h-[65vh]">
          <table className="w-full text-left min-w-max border-collapse whitespace-nowrap">
            <thead className="bg-gray-50/50 text-slate-500 text-[11px] font-bold uppercase tracking-widest sticky top-0 z-20 backdrop-blur-md shadow-sm">
              <tr>
                {role === "ADMIN" && (
                  <th className="px-4 py-3 text-center border border-gray-200 w-12 bg-gray-50">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        orders.length > 0 &&
                        selectedIds.length === orders.length
                      }
                      className="w-4 h-4 rounded border-gray-300 text-[#e67e22] focus:ring-[#e67e22] cursor-pointer"
                    />
                  </th>
                )}
                <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
                  #
                </th>

                {showCol("show_order_id") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Order ID
                  </th>
                )}
                {showCol("show_txn_date") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Txn Date
                  </th>
                )}
                {showCol("show_month") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Month
                  </th>
                )}
                {showCol("show_day") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Day
                  </th>
                )}

                {showCol("show_card_no") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Card No.
                  </th>
                )}
                {showCol("show_placed_by") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Placed By
                  </th>
                )}
                {showCol("show_txn_detail") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Txn Detail
                  </th>
                )}

                {showCol("show_merchant") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Merchant
                  </th>
                )}
                {showCol("show_merchant_id") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Merchant ID
                  </th>
                )}
                {showCol("show_firm") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Firm
                  </th>
                )}
                {showCol("show_location") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Location
                  </th>
                )}

                {showCol("show_seller_info") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Seller Info
                  </th>
                )}
                {showCol("show_asin_fsn") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    ASIN/FSN
                  </th>
                )}
                {showCol("show_model_name") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Model Name
                  </th>
                )}
                {showCol("show_model_no") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Model No
                  </th>
                )}

                {showCol("show_order_qty") && (
                  <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
                    Qty
                  </th>
                )}
                {showCol("show_order_amount") && (
                  <th className="px-4 py-3 text-right border border-gray-200 bg-gray-50">
                    Order Amt
                  </th>
                )}
                {showCol("show_unit_price") && (
                  <th className="px-4 py-3 text-right border border-gray-200 bg-gray-50">
                    Unit Price
                  </th>
                )}
                {showCol("show_payment_amount") && (
                  <th className="px-4 py-3 text-right border border-gray-200 bg-gray-50">
                    Payment
                  </th>
                )}
                {showCol("show_card_offer") && (
                  <th className="px-4 py-3 text-right border border-gray-200 bg-gray-50">
                    Card Offer
                  </th>
                )}

                {showCol("show_delivered") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Delivered (Qty/Amt)
                  </th>
                )}
                {showCol("show_cancel_qty") && (
                  <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
                    Cancel Qty
                  </th>
                )}
                {showCol("show_pending_qty") && (
                  <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
                    Pending Qty
                  </th>
                )}
                {showCol("show_discrepancy") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Discrepancy (Qty/Amt)
                  </th>
                )}
                {showCol("show_refund") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Refund (Qty/Amt)
                  </th>
                )}
                {showCol("show_grpo") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    GRPO (Qty/Amt)
                  </th>
                )}

                {showCol("show_order_status") && (
                  <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
                    Status
                  </th>
                )}
                {/* Fixed Action Header */}
                <th className="px-4 py-3 text-center  bg-gray-50 border border-gray-200 z-30">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-[13.5px] font-medium text-slate-700 bg-white">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="30"
                    className="p-16 text-center border border-gray-200"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
                        <i className="fas fa-inbox text-2xl text-gray-300"></i>
                      </div>
                      <p className="font-bold text-slate-600">
                        No Orders Found
                      </p>
                      <p className="text-[12px] text-gray-400 mt-1">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => {
                  if (!order) return null;
                  const badgeStyle = getBadgeStyle(order?.order_status);

                  return (
                    <tr
                      key={order?.id || index}
                      className="hover:bg-blue-50/20 transition-colors group"
                    >
                      {role === "ADMIN" && (
                        <td className="px-4 py-3 text-center border border-gray-200">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(order.id)}
                            onChange={() => handleRowSelect(order.id)}
                            className="w-4 h-4 rounded border-gray-300 text-[#e67e22] focus:ring-[#e67e22] cursor-pointer"
                          />
                        </td>
                      )}
                      <td className="px-4 py-3 text-center border border-gray-200 text-gray-500 font-medium text-xs">
                        {((currentPage - 1) * 50 + index + 1)
                          .toString()
                          .padStart(2, "0")}
                      </td>

                      {showCol("show_order_id") && (
                        <td className="px-4 py-3 border border-gray-200 font-semibold text-slate-700 tracking-wide">
                          {order?.order_id || "-"}
                        </td>
                      )}
                      {showCol("show_txn_date") && (
                        <td className="px-4 py-3 border border-gray-200 text-slate-600">
                          {formatDate(order?.txn_date)}
                        </td>
                      )}
                      {showCol("show_month") && (
                        <td className="px-4 py-3 border border-gray-200 text-slate-600 capitalize">
                          {order?.month || "-"}
                        </td>
                      )}
                      {showCol("show_day") && (
                        <td className="px-4 py-3 border border-gray-200 text-slate-600">
                          {order?.day || "-"}
                        </td>
                      )}

                      {showCol("show_card_no") && (
                        <td className="px-4 py-3 border border-gray-200 font-medium text-slate-700">
                          {order?.card_no || "-"}
                        </td>
                      )}
                      {showCol("show_placed_by") && (
                        <td className="px-4 py-3 border border-gray-200 text-slate-600">
                          {order?.placed_by || "-"}
                        </td>
                      )}

                      {showCol("show_txn_detail") && (
                        <td
                          className="px-4 py-3 border border-gray-200 text-slate-600"
                          title={order?.txn_detail}
                        >
                          {order?.txn_detail || "-"}
                        </td>
                      )}
                      {showCol("show_merchant") && (
                        <td className="px-4 py-3 border border-gray-200 font-semibold text-slate-700">
                          {order?.merchant || "-"}
                        </td>
                      )}
                      {showCol("show_merchant_id") && (
                        <td className="px-4 py-3 border border-gray-200 font-mono text-[12px] text-slate-600">
                          {order?.merchant_id || "-"}
                        </td>
                      )}
                      {showCol("show_firm") && (
                        <td className="px-4 py-3 border border-gray-200 font-semibold text-slate-700">
                          {order?.firm || "-"}
                        </td>
                      )}
                      {showCol("show_location") && (
                        <td className="px-4 py-3 border border-gray-200 text-slate-600">
                          {order?.location || "-"}
                        </td>
                      )}

                      {showCol("show_seller_info") && (
                        <td className="px-4 py-3 border border-gray-200">
                          <div className="font-semibold text-slate-700">
                            {order?.seller_name || "-"}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono tracking-wider">
                            {order?.seller_gstn || "-"}
                          </div>
                        </td>
                      )}

                      {showCol("show_asin_fsn") && (
                        <td className="px-4 py-3 border border-gray-200 font-mono font-bold text-slate-700">
                          {order?.asin_fsn || "-"}
                        </td>
                      )}
                      {showCol("show_model_name") && (
                        <td
                          className="px-4 py-3 border border-gray-200 font-semibold text-slate-700"
                          title={order?.model_name}
                        >
                          {order?.model_name || "-"}
                        </td>
                      )}
                      {showCol("show_model_no") && (
                        <td className="px-4 py-3 border border-gray-200 text-slate-600">
                          {order?.model_no || "-"}
                        </td>
                      )}

                      {showCol("show_order_qty") && (
                        <td className="px-4 py-3 border border-gray-200 text-center font-bold text-slate-700">
                          {order?.order_qty || "0"}
                        </td>
                      )}
                      {showCol("show_order_amount") && (
                        <td className="px-4 py-3 border border-gray-200 text-right font-bold text-slate-700">
                          ₹
                          {parseFloat(order?.order_amount || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      )}
                      {showCol("show_unit_price") && (
                        <td className="px-4 py-3 border border-gray-200 text-right text-slate-600 text-xs">
                          ₹
                          {parseFloat(order?.unit_price || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      )}
                      {showCol("show_payment_amount") && (
                        <td className="px-4 py-3 border border-gray-200 text-right font-bold text-slate-700">
                          ₹
                          {parseFloat(
                            order?.payment_amount || 0,
                          ).toLocaleString("en-IN")}
                        </td>
                      )}
                      {showCol("show_card_offer") && (
                        <td className="px-4 py-3 border border-gray-200 text-right font-bold text-slate-700">
                          ₹
                          {parseFloat(order?.card_offer || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      )}

                      {/* NORMALIZED COLOR COLUMNS */}
                      {showCol("show_delivered") && (
                        <td className="px-4 py-3 border border-gray-200 text-slate-700">
                          <span className="font-bold">
                            {order?.delivered_qty || 0}
                          </span>
                          <span className="text-slate-500 font-medium ml-1.5 text-xs">
                            (₹{formatIndianNumber(order?.delivered_amount)})
                          </span>
                        </td>
                      )}
                      {showCol("show_cancel_qty") && (
                        <td className="px-4 py-3 border border-gray-200 text-center text-slate-700 font-bold">
                          {order?.cancel_qty || 0}
                        </td>
                      )}
                      {showCol("show_pending_qty") && (
                        <td className="px-4 py-3 border border-gray-200 text-center text-slate-700 font-bold">
                          {order?.pending_qty || 0}
                        </td>
                      )}

                      {showCol("show_discrepancy") && (
                        <td className="px-4 py-3 border border-gray-200 text-[12px] text-slate-700">
                          <div className="font-semibold">
                            Qty: {order?.discrepancy_qty || 0}
                          </div>
                          <div className="font-semibold text-slate-500">
                            ₹{formatIndianNumber(order?.discrepancy_amount)}
                          </div>
                        </td>
                      )}
                      {showCol("show_refund") && (
                        <td className="px-4 py-3 border border-gray-200 text-[12px] text-slate-700">
                          <div className="font-semibold">
                            Ref: {order?.refund_qty || 0}
                          </div>
                          <div className="font-semibold text-slate-500">
                            ₹{formatIndianNumber(order?.pending_refund)}
                          </div>
                        </td>
                      )}
                      {showCol("show_grpo") && (
                        <td className="px-4 py-3 border border-gray-200 text-[12px] text-slate-700">
                          <div className="font-semibold">
                            Inw: {order?.grpo_qty || 0}
                          </div>
                          <div className="font-semibold text-slate-500">
                            ₹{formatIndianNumber(order?.grpo_amount)}
                          </div>
                        </td>
                      )}

                      {showCol("show_order_status") && (
                        <td className="px-4 py-3 border border-gray-200 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border border-dashed ${badgeStyle.bg}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}
                            ></span>
                            {order?.order_status || "Open"}
                          </span>
                        </td>
                      )}

                      {/* FIXED ALWAYS VISIBLE ACTION BUTTONS */}
                      <td className="px-4 py-3 border border-gray-200 text-center bg-white z-10">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewClick(order?.id)}
                            title="View Summary"
                            className="w-8 h-8 rounded-md bg-gray-50 border border-gray-200 text-gray-500 hover:text-[#722ed1] hover:bg-purple-50 hover:border-purple-200 shadow-sm flex items-center justify-center transition"
                          >
                            <i className="fas fa-eye text-[12px]"></i>
                          </button>
                          {role === "ADMIN" && (
                            <>
                              <button
                                onClick={() => handleEditClick(order)}
                                title="Edit Record"
                                className="w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-[#e67e22] hover:border-blue-200 shadow-sm flex items-center justify-center transition"
                              >
                                <i className="fas fa-pen text-[12px]"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(order?.id)}
                                title="Delete Record"
                                className="w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-[#ff4d4f] hover:border-red-200 shadow-sm flex items-center justify-center transition"
                              >
                                <i className="fas fa-trash-alt text-[12px]"></i>
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

        {/* PAGINATION FOOTER */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 bg-gray-50/50 border-t border-gray-100 gap-4">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Total Records:{" "}
            <span className="text-[#e67e22] text-[13px]">{totalRecords}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-slate-600 rounded-md hover:bg-gray-50 disabled:opacity-40 transition shadow-sm"
            >
              <i className="fas fa-chevron-left text-[10px]"></i>
            </button>
            <span className="px-4 py-1.5 bg-[#e67e22] text-white rounded-md font-bold text-[12px] shadow-sm">
              Page {currentPage} of {Math.ceil(totalRecords / 50) || 1}
            </span>
            <button
              disabled={currentPage >= Math.ceil(totalRecords / 50)}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-slate-600 rounded-md hover:bg-gray-50 disabled:opacity-40 transition shadow-sm"
            >
              <i className="fas fa-chevron-right text-[10px]"></i>
            </button>

            <div className="flex items-center ml-2 border-l border-gray-200 pl-4">
              <input
                type="number"
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                placeholder="Go to..."
                className="w-16 px-2 py-1.5 bg-white border border-gray-200 rounded-l-md text-[12px] font-medium text-slate-700 outline-none focus:border-[#e67e22]"
              />
              <button
                onClick={() => {
                  const p = parseInt(jumpPage);
                  const maxPages = Math.ceil(totalRecords / 50) || 1;
                  if (p > 0 && p <= maxPages) {
                    setCurrentPage(p);
                    setJumpPage("");
                  } else
                    Swal.fire(`Enter a valid page between 1 and ${maxPages}`);
                }}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-[12px] font-bold rounded-r-md transition"
              >
                GO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODALS SECTION ================= */}

      {/* 1. COLUMN CONFIGURATION MODAL */}
      {isViewSetupModalOpen && role === "ADMIN" && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col">
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">
                Customize Columns
              </h2>
              <button
                onClick={() => setViewSetupModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 bg-[#f0f2f5]/40 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {Object.keys(viewSettings)
                .filter((k) => k.startsWith("show_"))
                .map((key) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 cursor-pointer p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-[#e67e22] transition-colors select-none"
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
                      className="rounded border-gray-300 text-[#e67e22] focus:ring-[#e67e22] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                      {key.replace("show_", "").replace(/_/g, " ")}
                    </span>
                  </label>
                ))}
            </div>

            <div className="flex justify-end gap-3 px-8 py-4 border-t border-gray-100 bg-white">
              <button
                onClick={() => setViewSetupModalOpen(false)}
                className="px-6 py-2.5 bg-gray-50 text-gray-600 font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveViewSettings}
                className="px-8 py-2.5 bg-[#e67e22] hover:bg-blue-600 text-white font-bold uppercase tracking-widest text-[11px] rounded-xl shadow-md shadow-blue-500/20 transition"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. UPLOAD EXCEL MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">
                  Bulk Upload Orders
                </h2>
                <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                  Upload new line items via Excel.
                </p>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-2xl bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-colors mb-6 group cursor-pointer relative">
                <input
                  type="file"
                  accept=".xlsx, .csv"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <i className="fas fa-file-excel text-4xl text-[#52c41a] mb-4 block group-hover:scale-110 transition-transform"></i>
                <p className="text-[13px] font-bold text-slate-700">
                  Click or drag file here
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Supports Excel and CSV formats
                </p>
                {file && (
                  <p className="text-[12px] font-bold text-[#e67e22] mt-4 bg-blue-50 py-1.5 rounded-md inline-block px-3 border border-blue-100">
                    {file.name}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e67e22] hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-[12px] transition shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> SYNCING...
                  </>
                ) : (
                  "UPLOAD TO DATABASE"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. CREATE / EDIT FORM MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95 overflow-hidden">
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white rounded-t-2xl">
              <div>
                <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">
                  {editMode ? "Edit Order Record" : "Create New Order"}
                </h2>
                <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                  Fill in the required fields to map an order.
                </p>
              </div>
              <button
                onClick={() => setFormModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            <div className="px-8 py-6 overflow-y-auto custom-scrollbar bg-[#f0f2f5]/40">
              <form
                id="orderForm"
                onSubmit={handleFormSubmit}
                className="flex flex-col gap-6 w-full"
              >
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
                    <i className="fas fa-info-circle text-[#e67e22]"></i> Master
                    Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Order ID *
                      </label>
                      <input
                        type="text"
                        name="order_id"
                        required
                        value={headerData.order_id}
                        onChange={handleHeaderChange}
                        disabled={editMode}
                        className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Txn Date *
                      </label>
                      <input
                        type="date"
                        name="txn_date"
                        required
                        value={headerData.txn_date}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Merchant *
                      </label>
                      <select
                        name="merchant"
                        value={headerData.merchant}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                      >
                        <option value="">-- Select --</option>
                        {masterMerchants.map((m) => (
                          <option key={m.id} value={m.name}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Merchant ID
                      </label>
                      <input
                        type="text"
                        name="merchant_id"
                        value={headerData.merchant_id}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Card No.
                      </label>
                      <input
                        type="text"
                        name="card_no"
                        value={headerData.card_no}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Placed By
                      </label>
                      <input
                        type="text"
                        name="placed_by"
                        value={headerData.placed_by}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Firm *
                      </label>
                      <select
                        name="firm"
                        value={headerData.firm}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                      >
                        <option value="">-- Select --</option>
                        {masterFirms.map((f) => (
                          <option key={f.id} value={f.name}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Location *
                      </label>
                      <select
                        name="location"
                        value={headerData.location}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                      >
                        <option value="">-- Select --</option>
                        {masterLocations.map((l) => (
                          <option key={l.id} value={l.name}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Seller Name
                      </label>
                      <input
                        type="text"
                        name="seller_name"
                        value={headerData.seller_name}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                        placeholder="Auto-fetch or manual entry"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Seller GSTN
                      </label>
                      <input
                        type="text"
                        name="seller_gstn"
                        value={headerData.seller_gstn}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                        placeholder="Auto-fetch or manual entry"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        Txn Detail
                      </label>
                      <input
                        type="text"
                        name="txn_detail"
                        value={headerData.txn_detail}
                        onChange={handleHeaderChange}
                        className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-2">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-box-open text-[#e67e22]"></i> Product
                      Line Items
                    </h4>
                    {!editMode && (
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-[#e67e22] font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-blue-50 transition shadow-sm"
                      >
                        <IconPlus /> Add Row
                      </button>
                    )}
                  </div>

                  {itemsData.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative group"
                    >
                      {!editMode && itemsData.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-50 text-[#ff4d4f] opacity-0 group-hover:opacity-100 hover:bg-red-100 flex items-center justify-center transition-all"
                        >
                          <i className="fas fa-trash-alt text-[12px]"></i>
                        </button>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 pr-6">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            ASIN / FSN *
                          </label>
                          <select
                            name="asin_fsn"
                            value={item.asin_fsn}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                          >
                            <option value="">-- Search & Select --</option>
                            {masterModels.map((m) => (
                              <option key={m.id} value={m.asin_fsn}>
                                {m.asin_fsn}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            Model Name
                          </label>
                          <input
                            type="text"
                            value={item.model_name}
                            readOnly
                            className="w-full bg-gray-50 border border-transparent p-2.5 rounded-xl text-[13px] font-semibold text-gray-500 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            Model Number
                          </label>
                          <input
                            type="text"
                            value={item.model_no}
                            readOnly
                            className="w-full bg-gray-50 border border-transparent p-2.5 rounded-xl text-[13px] font-semibold text-gray-500 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-6 gap-5">
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            Status
                          </label>
                          <select
                            name="order_status"
                            value={item.order_status}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-white border border-gray-200 text-slate-800 font-semibold p-2.5 rounded-xl outline-none focus:border-[#e67e22] transition"
                          >
                            <option value="Open">Open</option>
                            <option value="Complete">Complete</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            Qty *
                          </label>
                          <input
                            type="number"
                            min="1"
                            name="order_qty"
                            value={item.order_qty}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] outline-none text-[13px] font-bold text-slate-800 text-center transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            Order Amt (₹) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="order_amount"
                            value={item.order_amount}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] outline-none text-[13px] font-bold text-slate-800 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            Payment (₹) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="payment_amount"
                            value={item.payment_amount}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#52c41a] focus:ring-4 focus:ring-green-50 outline-none text-[13px] font-bold text-[#52c41a] transition"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            Unit Price
                          </label>
                          <input
                            type="text"
                            disabled
                            value={`₹ ${item.unit_price}`}
                            className="w-full bg-gray-50 border border-transparent p-2.5 rounded-xl text-[13px] font-semibold text-gray-500 text-right"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                            Card Offer
                          </label>
                          <input
                            type="text"
                            disabled
                            value={`₹ ${item.card_offer}`}
                            className="w-full bg-amber-50 border border-amber-100 p-2.5 rounded-xl text-[14px] font-black text-amber-600 text-right"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={() => setFormModalOpen(false)}
                className="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold uppercase tracking-widest text-[12px] rounded-xl transition shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="orderForm"
                disabled={loading}
                className="px-8 py-2.5 bg-[#e67e22] hover:bg-blue-600 text-white font-bold uppercase tracking-widest text-[12px] rounded-xl shadow-md shadow-blue-500/20 transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Record"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. VIEW SUMMARY MODAL */}
      {isViewSummaryModalOpen && viewSummaryData && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 overflow-hidden">
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white rounded-t-2xl">
              <h2 className="text-[18px] font-bold text-slate-800 tracking-tight flex items-center gap-3">
                <i className="fas fa-chart-pie text-[#e67e22]"></i> Order
                Summary:{" "}
                <span className="font-mono text-[#e67e22]">
                  {viewSummaryData.order_id}
                </span>
              </h2>
              <div className="flex items-center gap-5">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  Status:
                  <span
                    className={`px-2.5 py-1 rounded-md border border-dashed ${getBadgeStyle(viewSummaryData.order_status).bg}`}
                  >
                    {viewSummaryData.order_status}
                  </span>
                </span>
                <button
                  onClick={() => {
                    setViewSummaryModalOpen(false);
                    setViewSummaryData(null);
                  }}
                  className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition"
                >
                  <i className="fas fa-times text-sm"></i>
                </button>
              </div>
            </div>

            <div className="px-8 py-8 overflow-y-auto custom-scrollbar bg-[#f0f2f5]/40">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Order ID", value: viewSummaryData.order_id },
                  {
                    label: "Txn Date",
                    value: formatDate(viewSummaryData.txn_date),
                  },
                  { label: "ASIN/FSN", value: viewSummaryData.asin_fsn },
                  { label: "Model No", value: viewSummaryData.model_no || "-" },
                  { label: "Card No.", value: viewSummaryData.card_no || "-" },
                  {
                    label: "Placed By",
                    value: viewSummaryData.placed_by || "-",
                  },
                  { label: "Order Qty", value: viewSummaryData.order_qty || 0 },
                  {
                    label: "Order Amount",
                    value: `₹ ${(viewSummaryData.order_amount || 0).toLocaleString("en-IN")}`,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      {item.label}
                    </label>
                    <div className="text-[14px] font-bold text-slate-800 ">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100 shadow-sm">
                  <label className="block text-[10px] font-bold text-[#52c41a] uppercase tracking-widest mb-1.5">
                    Delivered Qty
                  </label>
                  <div className="text-[18px] font-black text-green-700">
                    {viewSummaryData.delivered_qty || 0}
                  </div>
                </div>
                <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100 shadow-sm">
                  <label className="block text-[10px] font-bold text-[#52c41a] uppercase tracking-widest mb-1.5">
                    Delivered Amt
                  </label>
                  <div className="text-[18px] font-black text-green-700">
                    ₹ {formatIndianNumber(viewSummaryData.delivered_amount)}
                  </div>
                </div>
                <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100 shadow-sm">
                  <label className="block text-[10px] font-bold text-[#ff4d4f] uppercase tracking-widest mb-1.5">
                    Cancel Qty
                  </label>
                  <div className="text-[18px] font-black text-red-700">
                    {viewSummaryData.cancel_qty || 0}
                  </div>
                </div>
                <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100 shadow-sm">
                  <label className="block text-[10px] font-bold text-[#ff4d4f] uppercase tracking-widest mb-1.5">
                    Pending Qty
                  </label>
                  <div className="text-[18px] font-black text-red-700">
                    {viewSummaryData.pending_qty || 0}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 shadow-sm">
                  <label className="block text-[10px] font-bold text-[#e67e22] uppercase tracking-widest mb-1.5">
                    Discrepancy Qty
                  </label>
                  <div className="text-[18px] font-black text-blue-700">
                    {viewSummaryData.discrepancy_qty || 0}
                  </div>
                </div>
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 shadow-sm">
                  <label className="block text-[10px] font-bold text-[#e67e22] uppercase tracking-widest mb-1.5">
                    Discrepancy Amt
                  </label>
                  <div className="text-[18px] font-black text-blue-700">
                    ₹ {formatIndianNumber(viewSummaryData.discrepancy_amount)}
                  </div>
                </div>
                <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 shadow-sm">
                  <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">
                    Refund Qty
                  </label>
                  <div className="text-[18px] font-black text-amber-700">
                    {viewSummaryData.refund_qty || 0}
                  </div>
                </div>
                <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 shadow-sm">
                  <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">
                    Pending Refund
                  </label>
                  <div className="text-[18px] font-black text-amber-700">
                    ₹ {formatIndianNumber(viewSummaryData.pending_refund)}
                  </div>
                </div>
              </div>

              <div className="bg-[#1b2559] rounded-2xl p-6 shadow-md text-white grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <label className="block text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-1.5">
                    GRPO / Inward Qty
                  </label>
                  <div className="text-[24px] font-black text-emerald-300">
                    {viewSummaryData.grpo_qty || 0}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-1.5">
                    GRPO / Inward Amt
                  </label>
                  <div className="text-[24px] font-black text-emerald-300">
                    ₹ {formatIndianNumber(viewSummaryData.grpo_amount)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}