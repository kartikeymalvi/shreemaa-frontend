// import React, { useState, useEffect, useRef } from "react";
// import api from "../api/axios";
// import Swal from "sweetalert2";

// // --- 🛠️ HELPER FUNCTIONS ---
// const formatDate = (dateStr) => {
//   if (!dateStr) return "-";
//   const parts = dateStr.split("-");
//   if (parts.length === 3 && parts[0].length === 4) {
//     return `${parts[2]}-${parts[1]}-${parts[0]}`;
//   }
//   return dateStr;
// };

// const formatIndianNumber = (num) => {
//   if (!num || isNaN(num)) return "0.00";
//   return new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(num);
// };

// // --- 🔥 PREMIUM SVG ICONS ---
// export const IconDownload = () => (
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
//     <polyline points="7 10 12 15 17 10"></polyline>
//     <line x1="12" y1="15" x2="12" y2="3"></line>
//   </svg>
// );
// export const IconUpload = () => (
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
// export const IconColumns = () => (
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
//     <rect x="3" y="3" width="7" height="18" rx="1"></rect>
//     <rect x="14" y="3" width="7" height="18" rx="1"></rect>
//   </svg>
// );
// export const IconPlus = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="3"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <line x1="12" y1="5" x2="12" y2="19"></line>
//     <line x1="5" y1="12" x2="19" y2="12"></line>
//   </svg>
// );
// export const IconSearch = () => (
//   <svg
//     width="14"
//     height="14"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="#94a3b8"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <circle cx="11" cy="11" r="8"></circle>
//     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//   </svg>
// );
// export const IconFilter = () => (
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
//     <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
//   </svg>
// );
// export const IconTemplate = () => (
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

// export default function OrdersReport() {
//   const fileInputRef = useRef(null);
//   const role = localStorage.getItem("user_role") || "USER";
//   const username = localStorage.getItem("username") || "User";

//   // --- DATA STATES ---
//   const [orders, setOrders] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [jumpPage, setJumpPage] = useState("");
//   const [globalSearch, setGlobalSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [file, setFile] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);

//   // Modals States
//   const [isUploadModalOpen, setUploadModalOpen] = useState(false);
//   const [isFormModalOpen, setFormModalOpen] = useState(false);
//   const [isViewSetupModalOpen, setViewSetupModalOpen] = useState(false);
//   const [isViewSummaryModalOpen, setViewSummaryModalOpen] = useState(false);
//   const [viewSummaryData, setViewSummaryData] = useState(null);

//   const [editMode, setEditMode] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const [masterFirms, setMasterFirms] = useState([]);
//   const [masterLocations, setMasterLocations] = useState([]);
//   const [masterMerchants, setMasterMerchants] = useState([]);
//   const [masterModels, setMasterModels] = useState([]);

//   // --- FORM STATES ---
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
//     card_no: "",
//     placed_by: "",
//     seller_gstn: "",
//     seller_name: "",
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

//   // --- DYNAMIC COLUMN VISIBILITY STATE ---
//   const [viewSettings, setViewSettings] = useState({
//     show_order_id: true,
//     show_txn_date: true,
//     show_month: false,
//     show_day: false,
//     show_txn_detail: false,
//     show_merchant: true,
//     show_merchant_id: false,
//     show_firm: true,
//     show_location: false,
//     show_asin_fsn: true,
//     show_model_name: true,
//     show_model_no: false,
//     show_order_status: true,
//     show_order_qty: true,
//     show_order_amount: true,
//     show_unit_price: false,
//     show_payment_amount: false,
//     show_card_offer: false,
//     show_card_no: true,
//     show_placed_by: true,
//     show_seller_info: true,
//     show_delivered: true,
//     show_cancel_qty: true,
//     show_pending_qty: true,
//     show_discrepancy: true,
//     show_refund: true,
//     show_grpo: true,
//   });

//   // --- API CALLS ---
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
//         api
//           .get("reports/column-policy/?policy_name=user_view_policy")
//           .catch(() => ({ data: null })),
//       ]);

//       const records = dataRes.data.results || dataRes.data;
//       setOrders(Array.isArray(records) ? records : []);
//       setTotalRecords(dataRes.data.count || records.length || 0);
//       if (settingsRes.data && Object.keys(settingsRes.data).length > 0) {
//         setViewSettings((prev) => ({ ...prev, ...settingsRes.data }));
//       }
//     } catch (error) {
//       console.error("Fetch data error:", error);
//       setOrders([]);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filters, currentPage]);

//   // --- EVENT HANDLERS ---
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

//   const handleRowSelect = (id) =>
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
//     );
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
//       card_no,
//       placed_by,
//       seller_gstn,
//       seller_name,
//       ...itemDetails
//     } = order;

//     // 🔥 FIX: Ensure ki values null na jayen aur properly auto-fill hon 🔥
//     setHeaderData({
//       order_id: order_id || "",
//       txn_date: txn_date || "",
//       month: month || "",
//       day: day || "",
//       merchant: merchant || "",
//       merchant_id: merchant_id || "",
//       firm: firm || "",
//       location: location || "",
//       txn_detail: txn_detail || "",
//       card_no: card_no || "",
//       placed_by: placed_by || "",
//       seller_gstn: seller_gstn || "",
//       seller_name: seller_name || "",
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
//         Swal.fire({
//           icon: "success",
//           title: "Updated!",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       } else {
//         const payloads = itemsData.map((item) => ({ ...headerData, ...item }));
//         await Promise.all(
//           payloads.map((payload) => api.post("reports/orders/", payload)),
//         );
//         Swal.fire({
//           icon: "success",
//           title: "Added!",
//           text: `${payloads.length} item(s) saved.`,
//           timer: 1500,
//           showConfirmButton: false,
//         });
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
//       Swal.fire({
//         icon: "success",
//         title: "View Saved!",
//         timer: 1500,
//         showConfirmButton: false,
//       });
//       setViewSetupModalOpen(false);
//       fetchData();
//     } catch (error) {
//       Swal.fire("Failed to save view settings.");
//     }
//   };

//   // --- EXCEL BULK UPLOAD HANDLERS ---
//   const handleFileChange = (e) => {
//     if (e.target.files.length > 0) setFile(e.target.files[0]);
//   };

//   const handleUploadSubmit = async (e) => {
//     e.preventDefault();
//     if (!file)
//       return Swal.fire("Error", "Please select a file to upload.", "error");
//     const data = new FormData();
//     data.append("file", file);
//     setLoading(true);
//     try {
//       const res = await api.post("reports/orders/upload/", data);
//       Swal.fire(
//         "Success",
//         res.data.message || "Excel Uploaded Successfully!",
//         "success",
//       );
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
//       "Card No",
//       "Placed By",
//       "Seller Name",
//       "Seller GSTN",
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

//   const handleExportExcel = async () => {
//     try {
//       Swal.fire({
//         title: "Preparing Smart Excel...",
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
//     <div className="bg-[#fafafa] min-h-screen font-sans pb-10 text-slate-700">
//       {/* HEADER */}
//       <div className="bg-white px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
//         <div>
//           <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
//             Modules / <span className="text-slate-600">Orders</span>
//           </p>
//           <h1 className="text-xl font-bold text-slate-800 tracking-tight">
//             Order Management
//           </h1>
//         </div>
//       </div>

//       {/* --- MAIN CARD WRAPPER --- */}
//       <div className="mx-6 mt-6 bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden flex flex-col">
//         {/* TOOLBAR */}
//         <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-gray-100 bg-white gap-4">
//           <div className="flex items-center gap-3 w-full md:w-auto">
//             <div className="flex items-center bg-gray-50/80 px-4 py-2.5 rounded-full w-full md:w-[320px] border border-gray-100 focus-within:bg-white focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
//               <IconSearch />
//               <input
//                 type="text"
//                 placeholder="Search ASIN, Model, ID, Card No..."
//                 value={globalSearch}
//                 onChange={(e) => setGlobalSearch(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && fetchData()}
//                 className="bg-transparent border-none outline-none ml-3 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
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
//               onClick={() => setShowFilters(!showFilters)}
//               className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-[13px] font-bold transition-colors shadow-sm whitespace-nowrap ${showFilters ? "bg-blue-50 border-blue-200 text-[#e67e22]" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
//             >
//               <IconFilter /> Filter
//             </button>
//           </div>

//           <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto [&::-webkit-scrollbar]:hidden pb-1 md:pb-0">
//             {role === "ADMIN" && (
//               <button
//                 onClick={() => setViewSetupModalOpen(true)}
//                 className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-500 rounded-[10px] text-[12px] font-bold hover:bg-gray-50 hover:text-[#e67e22] transition shadow-sm whitespace-nowrap"
//               >
//                 <IconColumns /> View Headers
//               </button>
//             )}

//             <div className="flex items-center gap-2 bg-white p-1.5 rounded-[12px] border border-gray-200 shadow-sm">
//               <button
//                 onClick={handleDownloadTemplate}
//                 title="Download CSV Template"
//                 className="flex items-center justify-center w-8 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-[#e67e22] transition"
//               >
//                 <IconTemplate />
//               </button>
//               <button
//                 onClick={() => setUploadModalOpen(true)}
//                 title="Upload Bulk Excel"
//                 className="flex items-center justify-center w-8 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-[#52c41a] transition"
//               >
//                 <IconUpload />
//               </button>
//               <button
//                 onClick={handleExportExcel}
//                 title="Export Data"
//                 className="flex items-center justify-center w-8 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-[#722ed1] transition"
//               >
//                 <IconDownload />
//               </button>
//             </div>

//             {role === "ADMIN" && selectedIds.length > 0 && (
//               <button
//                 onClick={handleBulkDelete}
//                 className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-[#ff4d4f] border border-red-100 rounded-[10px] text-[12px] font-bold shadow-sm transition animate-in zoom-in whitespace-nowrap hover:bg-red-100"
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
//               className="flex items-center gap-2 px-5 py-2.5 bg-[#e67e22] hover:bg-blue-600 text-white rounded-[10px] transition font-bold text-[13px] shadow-md shadow-blue-500/20 whitespace-nowrap"
//             >
//               <IconPlus /> New Entry
//             </button>
//           </div>
//         </div>

//         {/* EXPANDABLE FILTERS */}
//         {showFilters && (
//           <div className="px-6 py-4 bg-[#fafafa] border-b border-gray-100 animate-in slide-in-from-top-2">
//             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                   Start Date
//                 </label>
//                 <input
//                   type="date"
//                   value={filters.start_date}
//                   onChange={(e) =>
//                     setFilters({ ...filters, start_date: e.target.value })
//                   }
//                   className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#e67e22] transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                   End Date
//                 </label>
//                 <input
//                   type="date"
//                   value={filters.end_date}
//                   onChange={(e) =>
//                     setFilters({ ...filters, end_date: e.target.value })
//                   }
//                   className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#e67e22] transition"
//                 />
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
//                   className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#e67e22] transition"
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
//                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                   Location
//                 </label>
//                 <select
//                   value={filters.location}
//                   onChange={(e) =>
//                     setFilters({ ...filters, location: e.target.value })
//                   }
//                   className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#e67e22] transition"
//                 >
//                   <option value="">All Locations</option>
//                   {masterLocations.map((l) => (
//                     <option key={l.id} value={l.name}>
//                       {l.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="lg:col-span-2">
//                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                   Model / Txn Detail
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   value={filters.model_no}
//                   onChange={(e) =>
//                     setFilters({ ...filters, model_no: e.target.value })
//                   }
//                   className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#e67e22] transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                   Order Status
//                 </label>
//                 <select
//                   value={filters.order_status}
//                   onChange={(e) =>
//                     setFilters({ ...filters, order_status: e.target.value })
//                   }
//                   className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#e67e22] transition"
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="Open">Open</option>
//                   <option value="Complete">Complete</option>
//                   <option value="Cancelled">Cancelled</option>
//                 </select>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   onClick={() => {
//                     setFilters({
//                       start_date: "",
//                       end_date: "",
//                       firm: "",
//                       location: "",
//                       model_no: "",
//                       txn_detail: "",
//                       order_status: "",
//                     });
//                     setCurrentPage(1);
//                     setShowFilters(false);
//                   }}
//                   className="w-full p-2.5 bg-white border border-gray-200 text-gray-500 text-[12px] font-bold uppercase tracking-widest rounded-lg hover:bg-gray-50 transition shadow-sm"
//                 >
//                   Clear
//                 </button>
//                 <button
//                   onClick={() => {
//                     setCurrentPage(1);
//                     setShowFilters(false);
//                   }}
//                   className="w-full p-2.5 bg-[#e67e22] text-white font-bold uppercase tracking-widest text-[12px] rounded-lg shadow-md shadow-blue-500/20 hover:bg-blue-600 transition"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* FULL DATA TABLE (BORDERS & NORMALIZED COLORS APPLIED) */}
//         <div className="overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[50vh] max-h-[65vh]">
//           <table className="w-full text-left min-w-max border-collapse whitespace-nowrap">
//             <thead className="bg-gray-50/50 text-slate-500 text-[11px] font-bold uppercase tracking-widest sticky top-0 z-20 backdrop-blur-md shadow-sm">
//               <tr>
//                 {role === "ADMIN" && (
//                   <th className="px-4 py-3 text-center border border-gray-200 w-12 bg-gray-50">
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
//                 <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
//                   #
//                 </th>

//                 {showCol("show_order_id") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Order ID
//                   </th>
//                 )}
//                 {showCol("show_txn_date") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Txn Date
//                   </th>
//                 )}
//                 {showCol("show_month") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Month
//                   </th>
//                 )}
//                 {showCol("show_day") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Day
//                   </th>
//                 )}

//                 {showCol("show_card_no") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Card No.
//                   </th>
//                 )}
//                 {showCol("show_placed_by") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Placed By
//                   </th>
//                 )}
//                 {showCol("show_txn_detail") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Txn Detail
//                   </th>
//                 )}

//                 {showCol("show_merchant") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Merchant
//                   </th>
//                 )}
//                 {showCol("show_merchant_id") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Merchant ID
//                   </th>
//                 )}
//                 {showCol("show_firm") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Firm
//                   </th>
//                 )}
//                 {showCol("show_location") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Location
//                   </th>
//                 )}

//                 {showCol("show_seller_info") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Seller name
//                   </th>
//                 )}
//                 {showCol("show_seller_info") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Seller GSTN
//                   </th>
//                 )}
//                 {showCol("show_asin_fsn") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     ASIN/FSN
//                   </th>
//                 )}
//                 {showCol("show_model_name") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Model Name
//                   </th>
//                 )}
//                 {showCol("show_model_no") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Model No
//                   </th>
//                 )}

//                 {showCol("show_order_qty") && (
//                   <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
//                     Qty
//                   </th>
//                 )}
//                 {showCol("show_order_amount") && (
//                   <th className="px-4 py-3 text-right border border-gray-200 bg-gray-50">
//                     Order Amt
//                   </th>
//                 )}
//                 {showCol("show_unit_price") && (
//                   <th className="px-4 py-3 text-right border border-gray-200 bg-gray-50">
//                     Unit Price
//                   </th>
//                 )}
//                 {showCol("show_payment_amount") && (
//                   <th className="px-4 py-3 text-right border border-gray-200 bg-gray-50">
//                     Payment
//                   </th>
//                 )}
//                 {showCol("show_card_offer") && (
//                   <th className="px-4 py-3 text-right border border-gray-200 bg-gray-50">
//                     Card Offer
//                   </th>
//                 )}

//                 {showCol("show_delivered") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Delivered Qty
//                   </th>
//                 )}
//                 {showCol("show_delivered") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Delivered Amt
//                   </th>
//                 )}
//                 {showCol("show_cancel_qty") && (
//                   <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
//                     Cancel Qty
//                   </th>
//                 )}
//                 {showCol("show_pending_qty") && (
//                   <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
//                     Pending Qty
//                   </th>
//                 )}
//                 {showCol("show_discrepancy") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Discrepancy Qty
//                   </th>
//                 )}
//                 {showCol("show_discrepancy") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Discrepancy Amt
//                   </th>
//                 )}
//                 {showCol("show_refund") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Refund Qty
//                   </th>
//                 )}
//                 {showCol("show_refund") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     Refund Amt
//                   </th>
//                 )}
//                 {showCol("show_grpo") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     GRPO Qty
//                   </th>
//                 )}
//                 {showCol("show_grpo") && (
//                   <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                     GRPO Amt
//                   </th>
//                 )}

//                 {showCol("show_order_status") && (
//                   <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
//                     Status
//                   </th>
//                 )}
//                 {/* Fixed Action Header */}
//                 <th className="px-4 py-3 text-center  bg-gray-50 border border-gray-200 z-30">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="text-[13.5px] font-medium text-slate-700 bg-white">
//               {orders.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="30"
//                     className="p-16 text-center border border-gray-200"
//                   >
//                     <div className="flex flex-col items-center justify-center">
//                       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
//                         <i className="fas fa-inbox text-2xl text-gray-300"></i>
//                       </div>
//                       <p className="font-bold text-slate-600">
//                         No Orders Found
//                       </p>
//                       <p className="text-[12px] text-gray-400 mt-1">
//                         Try adjusting your search or filters.
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
//                         <td className="px-4 py-3 text-center border border-gray-200">
//                           <input
//                             type="checkbox"
//                             checked={selectedIds.includes(order.id)}
//                             onChange={() => handleRowSelect(order.id)}
//                             className="w-4 h-4 rounded border-gray-300 text-[#e67e22] focus:ring-[#e67e22] cursor-pointer"
//                           />
//                         </td>
//                       )}
//                       <td className="px-4 py-3 text-center border border-gray-200 text-gray-500 font-medium text-xs">
//                         {((currentPage - 1) * 50 + index + 1)
//                           .toString()
//                           .padStart(2, "0")}
//                       </td>

//                       {showCol("show_order_id") && (
//                         <td className="px-4 py-3 border border-gray-200 font-semibold text-slate-700 tracking-wide">
//                           {order?.order_id || "-"}
//                         </td>
//                       )}
//                       {showCol("show_txn_date") && (
//                         <td className="px-4 py-3 border border-gray-200 text-slate-600">
//                           {formatDate(order?.txn_date)}
//                         </td>
//                       )}
//                       {showCol("show_month") && (
//                         <td className="px-4 py-3 border border-gray-200 text-slate-600 capitalize">
//                           {order?.month || "-"}
//                         </td>
//                       )}
//                       {showCol("show_day") && (
//                         <td className="px-4 py-3 border border-gray-200 text-slate-600">
//                           {order?.day || "-"}
//                         </td>
//                       )}

//                       {showCol("show_card_no") && (
//                         <td className="px-4 py-3 border border-gray-200 font-medium text-slate-700">
//                           {order?.card_no || "-"}
//                         </td>
//                       )}
//                       {showCol("show_placed_by") && (
//                         <td className="px-4 py-3 border border-gray-200 text-slate-600">
//                           {order?.placed_by || "-"}
//                         </td>
//                       )}

//                       {showCol("show_txn_detail") && (
//                         <td
//                           className="px-4 py-3 border border-gray-200 text-slate-600"
//                           title={order?.txn_detail}
//                         >
//                           {order?.txn_detail || "-"}
//                         </td>
//                       )}
//                       {showCol("show_merchant") && (
//                         <td className="px-4 py-3 border border-gray-200 font-semibold text-slate-700">
//                           {order?.merchant || "-"}
//                         </td>
//                       )}
//                       {showCol("show_merchant_id") && (
//                         <td className="px-4 py-3 border border-gray-200 font-mono text-[12px] text-slate-600">
//                           {order?.merchant_id || "-"}
//                         </td>
//                       )}
//                       {showCol("show_firm") && (
//                         <td className="px-4 py-3 border border-gray-200 font-semibold text-slate-700">
//                           {order?.firm || "-"}
//                         </td>
//                       )}
//                       {showCol("show_location") && (
//                         <td className="px-4 py-3 border border-gray-200 text-slate-600">
//                           {order?.location || "-"}
//                         </td>
//                       )}

//                       {showCol("show_seller_info") && (
//                         <td className="px-4 py-3 border border-gray-200">
//                           <div className="font-semibold text-slate-700">
//                             {order?.seller_name || "-"}
//                           </div>
//                         </td>
//                       )}
//                       {showCol("show_seller_info") && (
//                         <td className="px-4 py-3 border border-gray-200">
//                           <div className="text-[11px] text-slate-500 font-mono tracking-wider">
//                             {order?.seller_gstn || "-"}
//                           </div>
//                         </td>
//                       )}

//                       {showCol("show_asin_fsn") && (
//                         <td className="px-4 py-3 border border-gray-200 font-mono font-bold text-slate-700">
//                           {order?.asin_fsn || "-"}
//                         </td>
//                       )}
//                       {showCol("show_model_name") && (
//                         <td
//                           className="px-4 py-3 border border-gray-200 font-semibold text-slate-700"
//                           title={order?.model_name}
//                         >
//                           {order?.model_name || "-"}
//                         </td>
//                       )}
//                       {showCol("show_model_no") && (
//                         <td className="px-4 py-3 border border-gray-200 text-slate-600">
//                           {order?.model_no || "-"}
//                         </td>
//                       )}

//                       {showCol("show_order_qty") && (
//                         <td className="px-4 py-3 border border-gray-200 text-center font-bold text-slate-700">
//                           {order?.order_qty || "0"}
//                         </td>
//                       )}
//                       {showCol("show_order_amount") && (
//                         <td className="px-4 py-3 border border-gray-200 text-right font-bold text-slate-700">
//                           ₹
//                           {parseFloat(order?.order_amount || 0).toLocaleString(
//                             "en-IN",
//                           )}
//                         </td>
//                       )}
//                       {showCol("show_unit_price") && (
//                         <td className="px-4 py-3 border border-gray-200 text-right text-slate-600 text-xs">
//                           ₹
//                           {parseFloat(order?.unit_price || 0).toLocaleString(
//                             "en-IN",
//                           )}
//                         </td>
//                       )}
//                       {showCol("show_payment_amount") && (
//                         <td className="px-4 py-3 border border-gray-200 text-right font-bold text-slate-700">
//                           ₹
//                           {parseFloat(
//                             order?.payment_amount || 0,
//                           ).toLocaleString("en-IN")}
//                         </td>
//                       )}
//                       {showCol("show_card_offer") && (
//                         <td className="px-4 py-3 border border-gray-200 text-right font-bold text-slate-700">
//                           ₹
//                           {parseFloat(order?.card_offer || 0).toLocaleString(
//                             "en-IN",
//                           )}
//                         </td>
//                       )}

//                       {/* NORMALIZED COLOR COLUMNS */}
//                       {showCol("show_delivered") && (
//                         <td className="px-4 py-3 border border-gray-200 text-slate-700">
//                           <span className="font-bold">
//                             {order?.delivered_qty || 0}
//                           </span>
//                         </td>
//                       )}
//                       {showCol("show_delivered") && (
//                         <td className="px-4 py-3 border border-gray-200 text-slate-700">
//                           <span className="text-slate-500 font-medium ml-1.5 text-xs">
//                             (₹{formatIndianNumber(order?.delivered_amount)})
//                           </span>
//                         </td>
//                       )}
//                       {showCol("show_cancel_qty") && (
//                         <td className="px-4 py-3 border border-gray-200 text-center text-slate-700 font-bold">
//                           {order?.cancel_qty || 0}
//                         </td>
//                       )}
//                       {showCol("show_pending_qty") && (
//                         <td className="px-4 py-3 border border-gray-200 text-center text-slate-700 font-bold">
//                           {order?.pending_qty || 0}
//                         </td>
//                       )}

//                       {showCol("show_discrepancy") && (
//                         <td className="px-4 py-3 border border-gray-200 text-[12px] text-slate-700">
//                           <div className="font-semibold">
//                             Qty: {order?.discrepancy_qty || 0}
//                           </div>
//                         </td>
//                       )}
//                       {showCol("show_discrepancy") && (
//                         <td className="px-4 py-3 border border-gray-200 text-[12px] text-slate-700">
//                           <div className="font-semibold text-slate-500">
//                             ₹{formatIndianNumber(order?.discrepancy_amount)}
//                           </div>
//                         </td>
//                       )}
//                       {showCol("show_refund") && (
//                         <td className="px-4 py-3 border border-gray-200 text-[12px] text-slate-700">
//                           <div className="font-semibold">
//                             Ref: {order?.refund_qty || 0}
//                           </div>
//                         </td>
//                       )}
//                       {showCol("show_refund") && (
//                         <td className="px-4 py-3 border border-gray-200 text-[12px] text-slate-700">
//                           <div className="font-semibold text-slate-500">
//                             ₹{formatIndianNumber(order?.pending_refund)}
//                           </div>
//                         </td>
//                       )}
//                       {showCol("show_grpo") && (
//                         <td className="px-4 py-3 border border-gray-200 text-[12px] text-slate-700">
//                           <div className="font-semibold">
//                             Inw: {order?.grpo_qty || 0}
//                           </div>
//                         </td>
//                       )}
//                       {showCol("show_grpo") && (
//                         <td className="px-4 py-3 border border-gray-200 text-[12px] text-slate-700">
//                           <div className="font-semibold text-slate-500">
//                             ₹{formatIndianNumber(order?.grpo_amount)}
//                           </div>
//                         </td>
//                       )}

//                       {showCol("show_order_status") && (
//                         <td className="px-4 py-3 border border-gray-200 text-center">
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

//                       {/* FIXED ALWAYS VISIBLE ACTION BUTTONS */}
//                       <td className="px-4 py-3 border border-gray-200 text-center bg-white z-10">
//                         <div className="flex items-center justify-center gap-2">
//                           <button
//                             onClick={() => handleViewClick(order?.id)}
//                             title="View Summary"
//                             className="w-8 h-8 rounded-md bg-gray-50 border border-gray-200 text-gray-500 hover:text-[#722ed1] hover:bg-purple-50 hover:border-purple-200 shadow-sm flex items-center justify-center transition"
//                           >
//                             <i className="fas fa-eye text-[12px]"></i>
//                           </button>
//                           {role === "ADMIN" && (
//                             <>
//                               <button
//                                 onClick={() => handleEditClick(order)}
//                                 title="Edit Record"
//                                 className="w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-[#e67e22] hover:border-blue-200 shadow-sm flex items-center justify-center transition"
//                               >
//                                 <i className="fas fa-pen text-[12px]"></i>
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(order?.id)}
//                                 title="Delete Record"
//                                 className="w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-[#ff4d4f] hover:border-red-200 shadow-sm flex items-center justify-center transition"
//                               >
//                                 <i className="fas fa-trash-alt text-[12px]"></i>
//                               </button>
//                               <button
//                                 onClick={async () => {
//                                   const confirm = await Swal.fire({
//                                     title: "Cancel this Order?",
//                                     text: "This will mark it Complete and move details to the Refund tab.",
//                                     icon: "warning",
//                                     showCancelButton: true,
//                                     confirmButtonColor: "#dc2626",
//                                     confirmButtonText: "Yes, Cancel Order",
//                                   });
//                                   if (confirm.isConfirmed) {
//                                     try {
//                                       await api.post(
//                                         `reports/orders/${order.id}/cancel/`,
//                                       );
//                                       Swal.fire(
//                                         "Cancelled",
//                                         "Order details moved to Refunds",
//                                         "success",
//                                       );
//                                       fetchData();
//                                     } catch (e) {
//                                       Swal.fire(
//                                         "Error",
//                                         "Could not cancel order",
//                                         "error",
//                                       );
//                                     }
//                                   }
//                                 }}
//                                 title="Cancel Order & Send to Refund"
//                                 className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#ff4d4f] hover:bg-red-50 shadow-sm flex items-center justify-center transition"
//                               >
//                                 <i className="fas fa-ban text-[12px]"></i>
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
//         <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 bg-gray-50/50 border-t border-gray-100 gap-4">
//           <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
//             Total Records:{" "}
//             <span className="text-[#e67e22] text-[13px]">{totalRecords}</span>
//           </div>

//           <div className="flex items-center gap-2">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((prev) => prev - 1)}
//               className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-slate-600 rounded-md hover:bg-gray-50 disabled:opacity-40 transition shadow-sm"
//             >
//               <i className="fas fa-chevron-left text-[10px]"></i>
//             </button>
//             <span className="px-4 py-1.5 bg-[#e67e22] text-white rounded-md font-bold text-[12px] shadow-sm">
//               Page {currentPage} of {Math.ceil(totalRecords / 50) || 1}
//             </span>
//             <button
//               disabled={currentPage >= Math.ceil(totalRecords / 50)}
//               onClick={() => setCurrentPage((prev) => prev + 1)}
//               className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 text-slate-600 rounded-md hover:bg-gray-50 disabled:opacity-40 transition shadow-sm"
//             >
//               <i className="fas fa-chevron-right text-[10px]"></i>
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

//       {/* 1. COLUMN CONFIGURATION MODAL */}
//       {isViewSetupModalOpen && role === "ADMIN" && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col">
//             <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
//               <h2 className="text-[18px] font-bold text-slate-800 tracking-tight">
//                 Customize Columns
//               </h2>
//               <button
//                 onClick={() => setViewSetupModalOpen(false)}
//                 className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times text-sm"></i>
//               </button>
//             </div>

//             <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2 bg-[#f0f2f5]/40 max-h-[60vh] overflow-y-auto custom-scrollbar">
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
//                 onClick={() => setViewSetupModalOpen(false)}
//                 className="px-6 py-2.5 bg-gray-50 text-gray-600 font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-gray-100 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveViewSettings}
//                 className="px-8 py-2.5 bg-[#e67e22] hover:bg-blue-600 text-white font-bold uppercase tracking-widest text-[11px] rounded-xl shadow-md shadow-blue-500/20 transition"
//               >
//                 Apply Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 2. UPLOAD EXCEL MODAL */}
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
//                 <i className="fas fa-times text-sm"></i>
//               </button>
//             </div>

//             <form onSubmit={handleUploadSubmit}>
//               <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-2xl bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-colors mb-6 group cursor-pointer relative">
//                 <input
//                   type="file"
//                   accept=".xlsx, .csv"
//                   onChange={handleFileChange}
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                 />
//                 <i className="fas fa-file-excel text-4xl text-[#52c41a] mb-4 block group-hover:scale-110 transition-transform"></i>
//                 <p className="text-[13px] font-bold text-slate-700">
//                   Click or drag file here
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

//       {/* 3. CREATE / EDIT FORM MODAL */}
//       {isFormModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95 overflow-hidden">
//             <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white rounded-t-2xl">
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

//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
//                     <div>
//                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                         Card No.
//                       </label>
//                       <input
//                         type="text"
//                         name="card_no"
//                         value={headerData.card_no}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                         placeholder="Optional"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                         Placed By
//                       </label>
//                       <input
//                         type="text"
//                         name="placed_by"
//                         value={headerData.placed_by}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                         placeholder="Optional"
//                       />
//                     </div>
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
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                     <div>
//                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                         Seller Name
//                       </label>
//                       <input
//                         type="text"
//                         name="seller_name"
//                         value={headerData.seller_name}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                         placeholder="Auto-fetch or manual entry"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                         Seller GSTN
//                       </label>
//                       <input
//                         type="text"
//                         name="seller_gstn"
//                         value={headerData.seller_gstn}
//                         onChange={handleHeaderChange}
//                         className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                         placeholder="Auto-fetch or manual entry"
//                       />
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
//                             required
//                             name="asin_fsn"
//                             value={item.asin_fsn}
//                             onChange={(e) =>
//                               handleItemChange(
//                                 item.id || index,
//                                 e.target.name,
//                                 e.target.value,
//                               )
//                             }
//                             className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                           >
//                             <option value="">-- Search & Select --</option>

//                             {/* 🔥 DYNAMIC DROPDOWN LOGIC 🔥 */}
//                             {!editMode
//                               ? // Agar NAYA order ban raha hai, toh poori Master list dikhao
//                                 masterModels.map((m) => (
//                                   <option key={m.id} value={m.asin_fsn}>
//                                     {m.asin_fsn}
//                                   </option>
//                                 ))
//                               : // Agar EDIT mode hai, toh sirf is Order ID ke existing ASINs dikhao
//                                 orders
//                                   .filter(
//                                     (o) => o.order_id === headerData.order_id,
//                                   )
//                                   .map((o) => o.asin_fsn)
//                                   .filter(
//                                     (value, i, self) =>
//                                       self.indexOf(value) === i,
//                                   ) // Remove duplicates
//                                   .map((asin, i) => (
//                                     <option key={i} value={asin}>
//                                       {asin}
//                                     </option>
//                                   ))}
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
//                             className="w-full bg-white border border-gray-200 text-slate-800 font-semibold p-2.5 rounded-xl outline-none focus:border-[#e67e22] transition"
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
//                 className="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold uppercase tracking-widest text-[12px] rounded-xl transition shadow-sm"
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

//       {/* 4. VIEW SUMMARY MODAL */}
//       {isViewSummaryModalOpen && viewSummaryData && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 overflow-hidden">
//             <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white rounded-t-2xl">
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
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                 {[
//                   { label: "Order ID", value: viewSummaryData.order_id },
//                   {
//                     label: "Txn Date",
//                     value: formatDate(viewSummaryData.txn_date),
//                   },
//                   { label: "ASIN/FSN", value: viewSummaryData.asin_fsn },
//                   { label: "Model No", value: viewSummaryData.model_no || "-" },
//                   { label: "Card No.", value: viewSummaryData.card_no || "-" },
//                   {
//                     label: "Placed By",
//                     value: viewSummaryData.placed_by || "-",
//                   },
//                   { label: "Order Qty", value: viewSummaryData.order_qty || 0 },
//                   {
//                     label: "Order Amount",
//                     value: `₹ ${(viewSummaryData.order_amount || 0).toLocaleString("en-IN")}`,
//                   },
//                   // 🔥 Naya CN Amount Field Yahan Add Kiya Hai 🔥
//                   {
//                     label: "CN Amount",
//                     value: `₹ ${(viewSummaryData.cn_amount || 0).toLocaleString("en-IN")}`,
//                   },
//                   {
//                     label: "SAP PO No",
//                     value: viewSummaryData.sap_po_no || "-",
//                   },
//                   {
//                     label: "Seller Name",
//                     value: viewSummaryData.seller_name || "-",
//                   },
//                   {
//                     label: "Seller GSTN",
//                     value: viewSummaryData.seller_gstn || "-",
//                   },
//                 ].map((item, i) => (
//                   <div
//                     key={i}
//                     className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
//                   >
//                     <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       {item.label}
//                     </label>
//                     <div className="text-[14px] font-bold text-slate-800 ">
//                       {item.value}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                 <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-[#52c41a] uppercase tracking-widest mb-1.5">
//                     Delivered Qty
//                   </label>
//                   <div className="text-[18px] font-black text-green-700">
//                     {viewSummaryData.delivered_qty || 0}
//                   </div>
//                 </div>
//                 <div className="bg-green-50/50 p-5 rounded-2xl border border-green-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-[#52c41a] uppercase tracking-widest mb-1.5">
//                     Delivered Amt
//                   </label>
//                   <div className="text-[18px] font-black text-green-700">
//                     ₹ {formatIndianNumber(viewSummaryData.delivered_amount)}
//                   </div>
//                 </div>
//                 <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-[#ff4d4f] uppercase tracking-widest mb-1.5">
//                     Cancel Qty
//                   </label>
//                   <div className="text-[18px] font-black text-red-700">
//                     {viewSummaryData.cancel_qty || 0}
//                   </div>
//                 </div>
//                 <div className="bg-red-50/50 p-5 rounded-2xl border border-red-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-[#ff4d4f] uppercase tracking-widest mb-1.5">
//                     Pending Qty
//                   </label>
//                   <div className="text-[18px] font-black text-red-700">
//                     {viewSummaryData.pending_qty || 0}
//                   </div>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                 <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-[#e67e22] uppercase tracking-widest mb-1.5">
//                     Discrepancy Qty
//                   </label>
//                   <div className="text-[18px] font-black text-blue-700">
//                     {viewSummaryData.discrepancy_qty || 0}
//                   </div>
//                 </div>
//                 <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-[#e67e22] uppercase tracking-widest mb-1.5">
//                     Discrepancy Amt
//                   </label>
//                   <div className="text-[18px] font-black text-blue-700">
//                     ₹ {formatIndianNumber(viewSummaryData.discrepancy_amount)}
//                   </div>
//                 </div>
//                 <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">
//                     Refund Qty
//                   </label>
//                   <div className="text-[18px] font-black text-amber-700">
//                     {viewSummaryData.refund_qty || 0}
//                   </div>
//                 </div>
//                 <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 shadow-sm">
//                   <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">
//                     Pending Refund
//                   </label>
//                   <div className="text-[18px] font-black text-amber-700">
//                     ₹ {formatIndianNumber(viewSummaryData.pending_refund)}
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-[#1b2559] rounded-2xl p-6 shadow-md text-white grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
//                 <div>
//                   <label className="block text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-1.5">
//                     GRPO / Inward Qty
//                   </label>
//                   <div className="text-[24px] font-black text-emerald-300">
//                     {viewSummaryData.grpo_qty || 0}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-1.5">
//                     GRPO / Inward Amt
//                   </label>
//                   <div className="text-[24px] font-black text-emerald-300">
//                     ₹ {formatIndianNumber(viewSummaryData.grpo_amount)}
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

  // 🔥 PRD: BULK CANCEL CONFIRMATION 🔥
  const handleBulkCancel = async () => {
    if (selectedIds.length === 0) return Swal.fire("Select records first!");
    const confirm = await Swal.fire({
      title: "Bulk Cancel Confirmation?",
      text: `You are about to cancel ${selectedIds.length} orders and move their details to Refunds.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, Cancel All!",
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        const cancelPromises = selectedIds.map((id) =>
          api.post(`reports/orders/${id}/cancel/`),
        );
        await Promise.all(cancelPromises);
        Swal.fire(
          "Cancelled!",
          `${selectedIds.length} Orders have been moved to Refunds.`,
          "success",
        );
        setSelectedIds([]);
        fetchData();
      } catch (error) {
        Swal.fire("Error", "Bulk cancellation failed.", "error");
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
      order_id: order_id || "",
      txn_date: txn_date || "",
      month: month || "",
      day: day || "",
      merchant: merchant || "",
      merchant_id: merchant_id || "",
      firm: firm || "",
      location: location || "",
      txn_detail: txn_detail || "",
      card_no: card_no || "",
      placed_by: placed_by || "",
      seller_gstn: seller_gstn || "",
      seller_name: seller_name || "",
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
    <div className="bg-[#fafafa] font-sans text-slate-700 h-full flex flex-col pb-4">
      {/* --- CUSTOM SCROLLBAR STYLE FOR TABLE --- */}
      <style>{`
        .custom-table-scrollbar::-webkit-scrollbar {
          height: 10px;
          width: 10px;
        }
        .custom-table-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9; 
          border-radius: 4px;
        }
        .custom-table-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 5px;
        }
        .custom-table-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `}</style>

      {/* HEADER */}
      <div className="bg-white px-6 py-4 border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-xl mb-4">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
            Modules / <span className="text-slate-600">Orders</span>
          </p>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Order Management
          </h1>
        </div>
      </div>

      {/* --- MAIN CARD WRAPPER (Now matches header width exactly) --- */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden flex flex-col flex-1">
        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-gray-100 bg-white gap-4 flex-shrink-0">
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
                disabled={loading}
                title="Export Data"
                className="flex items-center justify-center w-8 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-[#722ed1] transition disabled:opacity-50"
              >
                <IconDownload />
              </button>
            </div>

            {/* 🔥 PRD: BULK DELETE & BULK CANCEL BUTTONS 🔥 */}
            {role === "ADMIN" && selectedIds.length > 0 && (
              <>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-[#ff4d4f] border border-red-100 rounded-[10px] text-[12px] font-bold shadow-sm transition animate-in zoom-in whitespace-nowrap hover:bg-red-100"
                >
                  <i className="fas fa-trash-alt"></i> Delete (
                  {selectedIds.length})
                </button>
                <button
                  onClick={handleBulkCancel}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-[10px] text-[12px] font-bold shadow-sm transition animate-in zoom-in whitespace-nowrap hover:bg-amber-100"
                >
                  <i className="fas fa-ban"></i> Bulk Cancel (
                  {selectedIds.length})
                </button>
              </>
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
          <div className="px-6 py-4 bg-[#fafafa] border-b border-gray-100 animate-in slide-in-from-top-2 flex-shrink-0">
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

        {/* 🔥 UNIFORM DATA TABLE (Standardized Fonts, Visible Scrollbars, Flex-1 restricts height to viewport) 🔥 */}
        <div className="overflow-auto custom-table-scrollbar w-full flex-1 border-t border-gray-200 max-h-[calc(120vh-260px)]">
          <table className="w-full text-left min-w-max border-collapse whitespace-nowrap">
            <thead className="bg-gray-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-20 shadow-sm">
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
                    Seller name
                  </th>
                )}
                {showCol("show_seller_info") && (
                  <th className="px-4 py-3 border border-gray-200 bg-gray-50">
                    Seller GSTN
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
                  <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
                    Delivered Qty
                  </th>
                )}
                {showCol("show_delivered") && (
                  <th className="px-4 py-3 text-right border border-gray-200 bg-gray-50">
                    Delivered Amt
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
                  <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
                    Discrepancy Qty
                  </th>
                )}
                {showCol("show_discrepancy") && (
                  <th className="px-4 py-3 text-right border border-gray-200 bg-gray-50">
                    Discrepancy Amt
                  </th>
                )}
                {showCol("show_refund") && (
                  <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
                    Refund Qty
                  </th>
                )}
                {showCol("show_refund") && (
                  <th className="px-4 py-3 text-right border border-gray-200 bg-gray-50">
                    Refund Amt
                  </th>
                )}
                {showCol("show_grpo") && (
                  <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
                    GRPO Qty
                  </th>
                )}
                {showCol("show_grpo") && (
                  <th className="px-4 py-3 text-right border border-gray-200 bg-gray-50">
                    GRPO Amt
                  </th>
                )}

                {showCol("show_order_status") && (
                  <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
                    Status
                  </th>
                )}
                <th className="px-4 py-3 text-center bg-gray-50 border border-gray-200 z-30">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
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
                      <p className="font-bold text-[13px] text-slate-600">
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
                      className="hover:bg-blue-50/30 transition-colors group"
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
                      {/* S.NO */}
                      <td className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                        {((currentPage - 1) * 50 + index + 1)
                          .toString()
                          .padStart(2, "0")}
                      </td>

                      {/* DATA CELLS WITH UNIFORM FONT: text-[13px] font-medium text-slate-700 */}
                      {showCol("show_order_id") && (
                        <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-800 font-bold">
                          {order?.order_id || "-"}
                        </td>
                      )}
                      {showCol("show_txn_date") && (
                        <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {formatDate(order?.txn_date)}
                        </td>
                      )}
                      {showCol("show_month") && (
                        <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium capitalize">
                          {order?.month || "-"}
                        </td>
                      )}
                      {showCol("show_day") && (
                        <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.day || "-"}
                        </td>
                      )}

                      {showCol("show_card_no") && (
                        <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.card_no || "-"}
                        </td>
                      )}
                      {showCol("show_placed_by") && (
                        <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.placed_by || "-"}
                        </td>
                      )}
                      {showCol("show_txn_detail") && (
                        <td
                          className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium"
                          title={order?.txn_detail}
                        >
                          {order?.txn_detail || "-"}
                        </td>
                      )}

                      {showCol("show_merchant") && (
                        <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.merchant || "-"}
                        </td>
                      )}
                      {showCol("show_merchant_id") && (
                        <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.merchant_id || "-"}
                        </td>
                      )}
                      {showCol("show_firm") && (
                        <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.firm || "-"}
                        </td>
                      )}
                      {showCol("show_location") && (
                        <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.location || "-"}
                        </td>
                      )}

                      {showCol("show_seller_info") && (
                        <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.seller_name || "-"}
                        </td>
                      )}
                      {showCol("show_seller_info") && (
                        <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.seller_gstn || "-"}
                        </td>
                      )}

                      {showCol("show_asin_fsn") && (
                        <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.asin_fsn || "-"}
                        </td>
                      )}
                      {showCol("show_model_name") && (
                        <td
                          className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium"
                          title={order?.model_name}
                        >
                          {order?.model_name || "-"}
                        </td>
                      )}
                      {showCol("show_model_no") && (
                        <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.model_no || "-"}
                        </td>
                      )}

                      {/* QUANTITIES (Centered) */}
                      {showCol("show_order_qty") && (
                        <td className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.order_qty || "0"}
                        </td>
                      )}

                      {/* AMOUNTS (Right Aligned) */}
                      {showCol("show_order_amount") && (
                        <td className="px-4 py-3 text-right border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          ₹
                          {parseFloat(order?.order_amount || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      )}
                      {showCol("show_unit_price") && (
                        <td className="px-4 py-3 text-right border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          ₹
                          {parseFloat(order?.unit_price || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      )}
                      {showCol("show_payment_amount") && (
                        <td className="px-4 py-3 text-right border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          ₹
                          {parseFloat(
                            order?.payment_amount || 0,
                          ).toLocaleString("en-IN")}
                        </td>
                      )}
                      {showCol("show_card_offer") && (
                        <td className="px-4 py-3 text-right border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          ₹
                          {parseFloat(order?.card_offer || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      )}

                      {/* CALCULATED FIELDS */}
                      {showCol("show_delivered") && (
                        <td className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.delivered_qty || 0}
                        </td>
                      )}
                      {showCol("show_delivered") && (
                        <td className="px-4 py-3 text-right border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          ₹{formatIndianNumber(order?.delivered_amount)}
                        </td>
                      )}

                      {showCol("show_cancel_qty") && (
                        <td className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.cancel_qty || 0}
                        </td>
                      )}
                      {showCol("show_pending_qty") && (
                        <td className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.pending_qty || 0}
                        </td>
                      )}

                      {showCol("show_discrepancy") && (
                        <td className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.discrepancy_qty || 0}
                        </td>
                      )}
                      {showCol("show_discrepancy") && (
                        <td className="px-4 py-3 text-right border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          ₹{formatIndianNumber(order?.discrepancy_amount)}
                        </td>
                      )}

                      {showCol("show_refund") && (
                        <td className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.refund_qty || 0}
                        </td>
                      )}
                      {showCol("show_refund") && (
                        <td className="px-4 py-3 text-right border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          ₹{formatIndianNumber(order?.pending_refund)}
                        </td>
                      )}

                      {showCol("show_grpo") && (
                        <td className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {order?.grpo_qty || 0}
                        </td>
                      )}
                      {showCol("show_grpo") && (
                        <td className="px-4 py-3 text-right border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          ₹{formatIndianNumber(order?.grpo_amount)}
                        </td>
                      )}

                      {/* STATUS BADGE */}
                      {showCol("show_order_status") && (
                        <td className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
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
                      <td className="px-4 py-3 text-center border border-gray-200 bg-white z-10 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2 transition-opacity">
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

                              {/* 🔥 PRD: MARK CANCEL CONFIRMATION BUTTON 🔥 */}
                              <button
                                onClick={async () => {
                                  const confirm = await Swal.fire({
                                    title: "Mark Cancel Confirmation?",
                                    text: "This will mark it Complete and move details to the Refund tab.",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#dc2626",
                                    confirmButtonText: "Yes, Confirm Cancel",
                                  });
                                  if (confirm.isConfirmed) {
                                    try {
                                      await api.post(
                                        `reports/orders/${order.id}/cancel/`,
                                      );
                                      Swal.fire(
                                        "Cancelled",
                                        "Order details moved to Refunds",
                                        "success",
                                      );
                                      fetchData();
                                    } catch (e) {
                                      Swal.fire(
                                        "Error",
                                        "Could not cancel order",
                                        "error",
                                      );
                                    }
                                  }
                                }}
                                title="Mark Cancel Confirmation (Move to Refund)"
                                className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-amber-500 hover:bg-amber-50 shadow-sm flex items-center justify-center transition"
                              >
                                <i className="fas fa-ban text-[12px]"></i>
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
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 bg-gray-50/50 border-t border-gray-100 gap-4 flex-shrink-0">
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
                        placeholder="Auto-fetch or manual"
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
                        placeholder="Auto-fetch or manual"
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
                            required
                            name="asin_fsn"
                            value={item.asin_fsn}
                            onChange={(e) =>
                              handleItemChange(item.id || index, e)
                            }
                            className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                          >
                            <option value="">-- Search & Select --</option>
                            {!editMode
                              ? masterModels.map((m) => (
                                  <option key={m.id} value={m.asin_fsn}>
                                    {m.asin_fsn}
                                  </option>
                                ))
                              : orders
                                  .filter(
                                    (o) => o.order_id === headerData.order_id,
                                  )
                                  .map((o) => o.asin_fsn)
                                  .filter(
                                    (value, i, self) =>
                                      self.indexOf(value) === i,
                                  )
                                  .map((asin, i) => (
                                    <option key={i} value={asin}>
                                      {asin}
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
                            className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] outline-none text-[13px] font-semibold text-slate-800 transition"
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
                  Status:{" "}
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
                  {
                    label: "CN Amount",
                    value: `₹ ${(viewSummaryData.cn_amount || 0).toLocaleString("en-IN")}`,
                  },
                  {
                    label: "SAP PO No",
                    value: viewSummaryData.sap_po_no || "-",
                  },
                  {
                    label: "Seller Name",
                    value: viewSummaryData.seller_name || "-",
                  },
                  {
                    label: "Seller GSTN",
                    value: viewSummaryData.seller_gstn || "-",
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