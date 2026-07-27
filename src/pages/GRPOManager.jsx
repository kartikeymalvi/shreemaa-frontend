// import React, { useState, useEffect, useRef } from "react";
// import api from "../api/axios";
// import Swal from "sweetalert2";

// // Helper: Indian Number Currency Formatting
// const formatIndianNumber = (num) => {
//   if (!num || isNaN(num)) return "0.00";
//   return new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(num);
// };

// // PREMIUM OUTLINE SVG ICONS
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

// export default function GRPOManager() {
//   const role = localStorage.getItem("user_role") || "USER";
//   const fileInputRef = useRef(null);

//   // --- CORE DATA STATES ---
//   const [grpoData, setGrpoData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({
//     firm_name: "",
//     grpo_status: "",
//     purchase_vendor_name: "",
//     grpo_create_date: "",
//   });

//   // --- MODAL CONTROL STATES ---
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [editModeId, setEditModeId] = useState(null);

//   // --- 15 DYNAMIC REQUIREMENT FIELDS ---
//   const initialState = {
//     firm_name: "",
//     internal_number: "",
//     grpo_status: "Open",
//     grpo_user_name: "",
//     grpo_no: "",
//     grpo_invoice_number: "",
//     grpo_create_date: new Date().toISOString().split("T")[0],
//     grpo_posting_date: new Date().toISOString().split("T")[0],
//     purchase_vendor_code: "",
//     purchase_vendor_name: "",
//     inward_whs_code: "",
//     item_code: "",
//     description: "",
//     grpo_quantity: "",
//     grpo_amt: "",
//   };
//   const [formData, setFormData] = useState(initialState);

//   useEffect(() => {
//     fetchGRPO();
//   }, []);

//   const fetchGRPO = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("reports/grpo/");
//       setGrpoData(res.data);
//     } catch (e) {
//       console.error("Error fetching GRPO list:", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   const handleFilterChange = (e) =>
//     setFilters({ ...filters, [e.target.name]: e.target.value });

//   // 🔥 SMART AUTO-FETCH LOGIC 🔥
//   const handleAutoFetchInvoice = async () => {
//     if (!formData.grpo_invoice_number.trim()) {
//       return Swal.fire(
//         "Required",
//         "Please enter Invoice Number first!",
//         "info",
//       );
//     }

//     setLoading(true);
//     try {
//       const res = await api.get(
//         `reports/fetch-invoice-grpo/${formData.grpo_invoice_number}/`,
//       );
//       const invData = res.data[0]; // If multiple items, currently picking the first one

//       setFormData((prev) => ({
//         ...prev,
//         firm_name: invData.firm_name || prev.firm_name,
//         purchase_vendor_name:
//           invData.purchase_vendor_name || prev.purchase_vendor_name,
//         item_code: invData.item_code || prev.item_code,
//         description: invData.description || prev.description,
//         grpo_quantity: invData.grpo_quantity || prev.grpo_quantity,
//         grpo_amt: invData.grpo_amt || prev.grpo_amt,
//       }));

//       Swal.fire({
//         icon: "success",
//         title: "Auto-Filled!",
//         text: "Invoice details synced successfully.",
//         timer: 1500,
//         showConfirmButton: false,
//       });
//     } catch (e) {
//       Swal.fire(
//         "Not Found",
//         "Could not find this Invoice Number in system.",
//         "error",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- CRUD FUNCTIONS ---
//   const handleAddNew = () => {
//     setEditModeId(null);
//     setFormData(initialState);
//     setIsFormModalOpen(true);
//   };

//   const handleEdit = (id) => {
//     const record = grpoData.find((g) => g.id === id);
//     if (record) {
//       setEditModeId(id);
//       setFormData(record);
//       setIsFormModalOpen(true);
//     }
//   };

//   const handleView = (id) => {
//     const record = grpoData.find((g) => g.id === id);
//     if (record) {
//       setViewData(record);
//       setIsViewModalOpen(true);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const payload = {
//         ...formData,
//         grpo_quantity: parseFloat(formData.grpo_quantity) || 0,
//         grpo_amt: parseFloat(formData.grpo_amt) || 0,
//       };

//       if (editModeId) {
//         await api.put(`reports/grpo/${editModeId}/`, payload);
//         Swal.fire({
//           icon: "success",
//           title: "Updated!",
//           text: "GRPO Record Updated Successfully!",
//           confirmButtonColor: "#0f172a",
//         });
//       } else {
//         await api.post("reports/grpo/", payload);
//         Swal.fire({
//           icon: "success",
//           title: "Saved!",
//           text: "New GRPO Record Saved Successfully!",
//           confirmButtonColor: "#0f172a",
//         });
//       }
//       setIsFormModalOpen(false);
//       fetchGRPO();
//     } catch (err) {
//       Swal.fire("Error", "Save Failed: " + err.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (role !== "ADMIN") return;
//     const confirm = await Swal.fire({
//       title: "Delete Record?",
//       text: "Are you sure you want to delete this GRPO completely?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       confirmButtonText: "Yes, delete!",
//     });
//     if (confirm.isConfirmed) {
//       try {
//         await api.delete(`reports/grpo/${id}/`);
//         Swal.fire("Deleted!", "GRPO Record Deleted!", "success");
//         fetchGRPO();
//       } catch (err) {
//         Swal.fire("Error", "Delete failed: " + err.message, "error");
//       }
//     }
//   };

//   // --- EXCEL BULK UPLOAD ---
//   const handleUploadClick = () => fileInputRef.current.click();
//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formDataFile = new FormData();
//     formDataFile.append("file", file);

//     try {
//       setLoading(true);
//       const res = await api.post("reports/grpo/upload_excel/", formDataFile, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       Swal.fire({
//         icon: "success",
//         title: "Uploaded!",
//         text: res.data.message || "Excel Bulk Data Imported Successfully!",
//         confirmButtonColor: "#0f172a",
//       });
//       fetchGRPO();
//     } catch (err) {
//       Swal.fire(
//         "Upload Failed",
//         err.response?.data?.error || err.message,
//         "error",
//       );
//     } finally {
//       setLoading(false);
//       e.target.value = null;
//     }
//   };

//   // --- EXCEL EXPORT & TEMPLATE ---
//   const handleExportData = () => {
//     if (filteredGRPO.length === 0)
//       return Swal.fire("Notice", "No matching rows to download!", "info");
//     let csv =
//       "Firm Name,Internal Number,GRPO Status,GRPO User Name,GRPO No.,GRPO Invoice Number,GRPO Create Date,GRPO Posting Date,Purchase Vendor Code,Purchase Vendor Name,Inward WHS Code,Item Code,Description,GRPO Quantity,GRPO Amt\n";

//     filteredGRPO.forEach((g) => {
//       csv += `"${g.firm_name}","${g.internal_number}","${g.grpo_status}","${g.grpo_user_name}","${g.grpo_no}","${g.grpo_invoice_number}","${g.grpo_create_date}","${g.grpo_posting_date}","${g.purchase_vendor_code}","${g.purchase_vendor_name}","${g.inward_whs_code}","${g.item_code}","${g.description?.replace(/"/g, '""')}","${g.grpo_quantity}","${g.grpo_amt}"\n`;
//     });

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = `GRPO_Report_${new Date().toISOString().split("T")[0]}.csv`;
//     link.click();
//   };

//   const handleDownloadTemplate = () => {
//     const csv =
//       "firm_name,internal_number,grpo_status,grpo_user_name,grpo_no,grpo_invoice_number,grpo_create_date,grpo_posting_date,purchase_vendor_code,purchase_vendor_name,inward_whs_code,item_code,description,grpo_quantity,grpo_amt\nShree Maa,INT901,Open,Kartik,GRPO-551,INV-881,11-07-2026,11-07-2026,VEND-04,Cloud Retail,WHS-Bhopal,IC-8821,OnePlus Nord CE4,50.00,1650000.00\n";
//     const blob = new Blob([csv], { type: "text/csv" });
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = "GRPO_Bulk_Template.csv";
//     link.click();
//   };

//   const flexibleMatch = (fieldValue, searchInput) => {
//     if (!searchInput) return true;
//     if (!fieldValue) return false;
//     const words = searchInput.toLowerCase().split(" ").filter(Boolean);
//     const text = fieldValue.toLowerCase();
//     return words.some((word) => text.includes(word));
//   };

//   const filteredGRPO = grpoData.filter((g) => {
//     let match = true;

//     if (searchTerm) {
//       const s = searchTerm.toLowerCase().trim();
//       const searchFields = [
//         g.grpo_no,
//         g.internal_number,
//         g.grpo_invoice_number,
//         g.purchase_vendor_code,
//         g.purchase_vendor_name,
//         g.item_code,
//         g.firm_name,
//         g.grpo_user_name,
//         g.inward_whs_code,
//         g.description,
//         g.grpo_quantity,
//         g.grpo_amt,
//       ];
//       const isMatched = searchFields.some((field) =>
//         String(field).toLowerCase().includes(s),
//       );
//       if (!isMatched) match = false;
//     }

//     if (
//       filters.firm_name &&
//       !g.firm_name?.toLowerCase().includes(filters.firm_name.toLowerCase())
//     )
//       match = false;
//     if (filters.grpo_status && g.grpo_status !== filters.grpo_status)
//       match = false;
//     if (
//       filters.grpo_create_date &&
//       g.grpo_create_date !== filters.grpo_create_date
//     )
//       match = false;
//     if (
//       filters.purchase_vendor_name &&
//       !flexibleMatch(g.purchase_vendor_name, filters.purchase_vendor_name)
//     )
//       match = false;

//     return match;
//   });

//   const getBadgeStyle = (status) => {
//     const s = String(status || "")
//       .trim()
//       .toLowerCase();
//     if (s === "cleared" || s === "completed")
//       return {
//         bg: "bg-emerald-50 text-emerald-700 border-emerald-300",
//         dot: "bg-emerald-600",
//       };
//     if (s === "cancelled")
//       return {
//         bg: "bg-rose-50 text-rose-700 border-rose-300",
//         dot: "bg-rose-600",
//       };
//     return {
//       bg: "bg-amber-50 text-amber-700 border-amber-300",
//       dot: "bg-amber-600",
//     };
//   };

//   return (
//     <div className="bg-transparent font-sans h-full flex flex-col pb-4 text-slate-700">
//       <style>{`
//         .custom-table-scrollbar::-webkit-scrollbar { height: 10px; width: 10px; }
//         .custom-table-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
//         .custom-table-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 5px; }
//         .custom-table-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
//       `}</style>

//       {/* --- HEADER --- */}
//       <div className="bg-white px-6 py-4 border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-xl mb-4">
//         <div>
//           <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
//             Warehouse & Logistics /{" "}
//             <span className="text-slate-600">SAP-GRPO</span>
//           </p>
//           <h1 className="text-xl font-bold text-slate-800 tracking-tight">
//             GRPO Management
//           </h1>
//         </div>
//       </div>

//       {/* --- MAIN CARD WRAPPER --- */}
//       <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden flex flex-col flex-1">
//         {/* TOOLBAR */}
//         <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-gray-100 bg-white gap-4 flex-shrink-0">
//           <div className="flex items-center gap-3 w-full md:w-auto">
//             <div className="flex items-center bg-gray-50/80 px-4 py-2.5 rounded-full w-full md:w-[320px] border border-gray-100 focus-within:bg-white focus-within:border-[#e67e22] focus-within:ring-2 focus-within:ring-blue-50 transition-all">
//               <IconSearch />
//               <input
//                 type="text"
//                 placeholder="Search No., Vendor or Item..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="bg-transparent border-none outline-none ml-3 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   className="text-gray-400 hover:text-gray-600 outline-none ml-2"
//                 >
//                   <i className="fas fa-times-circle"></i>
//                 </button>
//               )}
//             </div>

//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-[13px] font-bold transition-colors shadow-sm whitespace-nowrap ${
//                 showFilters
//                   ? "bg-blue-50 border-blue-200 text-[#e67e22]"
//                   : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
//               }`}
//             >
//               <IconFilter /> Filter
//             </button>
//           </div>

//           <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto [&::-webkit-scrollbar]:hidden pb-1 md:pb-0">
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileUpload}
//               className="hidden"
//               accept=".xlsx, .csv"
//             />

//             <div className="flex items-center gap-2 bg-white p-1.5 rounded-[12px] border border-gray-200 shadow-sm">
//               <button
//                 onClick={handleDownloadTemplate}
//                 title="Download Template"
//                 className="flex items-center justify-center px-3 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-[#e67e22] transition font-bold text-[11px]"
//               >
//                 <IconTemplate />
//               </button>
//               <button
//                 onClick={handleUploadClick}
//                 title="Upload Excel"
//                 className="flex items-center justify-center w-8 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-[#52c41a] transition"
//               >
//                 <IconUpload />
//               </button>
//               <button
//                 onClick={handleExportData}
//                 title="Export Database"
//                 className="flex items-center justify-center w-8 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-[#722ed1] transition"
//               >
//                 <IconDownload />
//               </button>
//             </div>

//             <button
//               onClick={handleAddNew}
//               className="flex items-center gap-2 px-5 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white rounded-[10px] transition font-bold text-[13px] shadow-md shadow-[#e67e22]/20 whitespace-nowrap"
//             >
//               <IconPlus /> Manual Entry
//             </button>
//           </div>
//         </div>

//         {/* EXPANDABLE FILTERS */}
//         {showFilters && (
//           <div className="px-6 py-4 bg-[#fafafa] border-b border-gray-100 flex-shrink-0 animate-in slide-in-from-top-2">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
//                   Create Date
//                 </label>
//                 <input
//                   type="date"
//                   name="grpo_create_date"
//                   value={filters.grpo_create_date}
//                   onChange={handleFilterChange}
//                   className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#e67e22] text-sm transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
//                   Firm Name
//                 </label>
//                 <input
//                   type="text"
//                   name="firm_name"
//                   value={filters.firm_name}
//                   placeholder="Search firm..."
//                   onChange={handleFilterChange}
//                   className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#e67e22] text-sm transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
//                   Vendor Name
//                 </label>
//                 <input
//                   type="text"
//                   name="purchase_vendor_name"
//                   value={filters.purchase_vendor_name}
//                   placeholder="e.g. Cloud Retail"
//                   onChange={handleFilterChange}
//                   className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#e67e22] text-sm transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
//                   GRPO Status
//                 </label>
//                 <select
//                   name="grpo_status"
//                   value={filters.grpo_status}
//                   onChange={handleFilterChange}
//                   className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#e67e22] text-sm transition"
//                 >
//                   <option value="">All Status</option>
//                   <option value="Open">Open</option>
//                   <option value="Cleared">Cleared</option>
//                   <option value="Cancelled">Cancelled</option>
//                 </select>
//               </div>
//               <button
//                 onClick={() =>
//                   setFilters({
//                     firm_name: "",
//                     grpo_status: "",
//                     purchase_vendor_name: "",
//                     grpo_create_date: "",
//                   })
//                 }
//                 className="w-full p-2.5 bg-white border border-gray-200 text-gray-600 text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-100 transition shadow-sm"
//               >
//                 Clear All
//               </button>
//             </div>
//           </div>
//         )}

//         {/* 🔥 UNIFORM DATA TABLE 🔥 */}
//         <div className="overflow-auto custom-table-scrollbar w-full flex-1 border-t border-gray-200 min-h-[60vh] max-h-[calc(100vh-180px)]">
//           <table className="w-full text-left min-w-max border-collapse whitespace-nowrap">
//             <thead className="bg-gray-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-20 shadow-sm">
//               <tr>
//                 <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
//                   #
//                 </th>
//                 <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                   GRPO No
//                 </th>
//                 <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                   Date
//                 </th>
//                 <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                   Firm Name
//                 </th>
//                 <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                   Vendor Name
//                 </th>
//                 <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                   Item Code
//                 </th>
//                 <th className="px-4 py-3 border border-gray-200 bg-gray-50 min-w-[250px]">
//                   Description
//                 </th>
//                 <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
//                   Quantity
//                 </th>
//                 <th className="px-4 py-3 text-right border border-gray-200 bg-gray-50">
//                   Amount
//                 </th>
//                 <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
//                   Status
//                 </th>
//                 <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50 z-30">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white">
//               {filteredGRPO.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="11"
//                     className="p-16 text-center border border-gray-200"
//                   >
//                     <div className="flex flex-col items-center justify-center">
//                       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
//                         <i className="fas fa-inbox text-2xl text-gray-300"></i>
//                       </div>
//                       <p className="font-bold text-[13px] text-slate-600">
//                         No Records Found
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredGRPO.map((row, index) => {
//                   const badgeStyle = getBadgeStyle(row.grpo_status);
//                   return (
//                     <tr
//                       key={row.id}
//                       className="hover:bg-blue-50/30 transition-colors group"
//                     >
//                       <td className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
//                         {(index + 1).toString().padStart(2, "0")}
//                       </td>
//                       <td className="px-4 py-3 border border-gray-200 font-mono font-bold text-[#e67e22] whitespace-nowrap text-[13px]">
//                         {row.grpo_no || "-"}
//                       </td>
//                       <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
//                         {row.grpo_create_date || "-"}
//                       </td>
//                       <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-bold">
//                         {row.firm_name || "-"}
//                       </td>
//                       <td className="px-4 py-3 border border-gray-200 whitespace-nowrap text-[13px] text-slate-700">
//                         <div className="font-bold">
//                           {row.purchase_vendor_name || "-"}
//                         </div>
//                         <div className="text-[11px] text-gray-400 font-mono">
//                           Code: {row.purchase_vendor_code || "-"}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 border border-gray-200 font-mono font-bold text-slate-600 whitespace-nowrap text-[13px]">
//                         {row.item_code || "-"}
//                       </td>
//                       <td className="px-4 py-3 border border-gray-200 text-[13px] text-slate-700 font-medium whitespace-normal min-w-[250px] leading-relaxed">
//                         {row.description || "-"}
//                       </td>
//                       <td className="px-4 py-3 text-center border border-gray-200 text-[13px] font-bold text-slate-800">
//                         {row.grpo_quantity || "0"}
//                       </td>
//                       <td className="px-4 py-3 text-right border border-gray-200 whitespace-nowrap text-[13px] font-black text-emerald-600">
//                         ₹{formatIndianNumber(row.grpo_amt)}
//                       </td>
//                       <td className="px-4 py-3 text-center border border-gray-200 whitespace-nowrap">
//                         <span
//                           className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border border-dashed ${badgeStyle.bg}`}
//                         >
//                           <span
//                             className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}
//                           ></span>
//                           {row.grpo_status || "Open"}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-center border border-gray-200 bg-white z-10 whitespace-nowrap">
//                         <div className="flex items-center justify-center gap-2 transition-opacity">
//                           <button
//                             onClick={() => handleView(row.id)}
//                             title="View Detail"
//                             className="w-8 h-8 rounded-md bg-gray-50 border border-gray-200 text-gray-500 hover:text-[#722ed1] hover:bg-purple-50 hover:border-purple-200 shadow-sm flex items-center justify-center transition"
//                           >
//                             <i className="fas fa-eye text-[12px]"></i>
//                           </button>
//                           {role === "ADMIN" && (
//                             <>
//                               <button
//                                 onClick={() => handleEdit(row.id)}
//                                 title="Edit Record"
//                                 className="w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-blue-500 hover:bg-blue-50 shadow-sm flex items-center justify-center transition"
//                               >
//                                 <i className="fas fa-pen text-[12px]"></i>
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(row.id)}
//                                 title="Delete Record"
//                                 className="w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:bg-red-50 shadow-sm flex items-center justify-center transition"
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

//         {/* FOOTER */}
//         <div className="flex justify-between items-center px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex-shrink-0">
//           <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
//             Total Records:{" "}
//             <span className="text-[#e67e22] text-[13px]">
//               {filteredGRPO.length}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* 🚀 VIEW MODAL */}
//       {isViewModalOpen && viewData && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
//             <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
//               <h3 className="text-[16px] font-bold text-slate-800 tracking-tight flex items-center gap-2">
//                 <i className="fas fa-file-invoice text-[#e67e22]"></i> GRPO
//                 Audit Data Sheet —{" "}
//                 <span className="text-[#e67e22] font-mono">
//                   {viewData.grpo_no}
//                 </span>
//               </h3>
//               <button
//                 onClick={() => setIsViewModalOpen(false)}
//                 className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times text-sm"></i>
//               </button>
//             </div>
//             <div className="p-8 overflow-y-auto bg-[#f0f2f5]/40 custom-scrollbar">
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
//                 {Object.keys(initialState).map((k) => (
//                   <div key={k} className="border-b pb-3 border-slate-50 mb-1">
//                     <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
//                       {k.replace(/_/g, " ")}
//                     </p>
//                     <p className="font-semibold text-[14px] text-slate-800 break-words">
//                       {k === "grpo_amt"
//                         ? `₹${formatIndianNumber(viewData[k])}`
//                         : String(viewData[k] || "-")}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-white rounded-b-2xl">
//               <button
//                 onClick={() => setIsViewModalOpen(false)}
//                 className="px-6 py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-sm"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🚀 SMART FORM MODAL (CREATE / EDIT) 🚀 */}
//       {isFormModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95">
//             <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
//               <div>
//                 <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">
//                   {editModeId ? "Edit GRPO Record" : "New GRPO Entry"}
//                 </h3>
//                 <p className="text-[12px] text-gray-400 font-medium mt-0.5">
//                   Fetch from Invoice or fill manually.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsFormModalOpen(false)}
//                 className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times text-sm"></i>
//               </button>
//             </div>

//             <div className="p-8 overflow-y-auto custom-scrollbar bg-[#f0f2f5]/40">
//               {/* 🔥 SMART AUTO-FETCH UI 🔥 */}
//               {!editModeId && (
//                 <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm items-end">
//                   <div className="flex-1">
//                     <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
//                         GRPO Invoice No.
//                     </label>
//                     <input
//                       type="text"
//                       name="grpo_invoice_number"
//                       value={formData.grpo_invoice_number}
//                       onChange={handleInputChange}
//                       placeholder="e.g. INV-2026-001..."
//                       className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 font-medium text-slate-700 text-sm transition"
//                     />
//                   </div>
//                   <button
//                     onClick={handleAutoFetchInvoice}
//                     disabled={loading}
//                     className="bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-bold uppercase tracking-widest px-8 py-3 rounded-xl shadow-md transition w-full md:w-auto flex items-center justify-center gap-2 border border-slate-900"
//                   >
//                     {loading ? (
//                       <i className="fas fa-spinner fa-spin"></i>
//                     ) : (
//                       <i className="fas fa-sync-alt"></i>
//                     )}{" "}
//                     Fetch Data
//                   </button>
//                 </div>
//               )}

//               <form
//                 id="grpoForm"
//                 onSubmit={handleSubmit}
//                 className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm"
//               >
//                 {Object.keys(initialState).map((fieldKey) => {
//                   // Skip invoice number if not edit mode (it's in the top bar)
//                   if (!editModeId && fieldKey === "grpo_invoice_number")
//                     return null;

//                   return (
//                     <div key={fieldKey}>
//                       <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
//                         {fieldKey.replace(/_/g, " ")}
//                       </label>
//                       {fieldKey.includes("date") ? (
//                         <input
//                           type="date"
//                           required
//                           name={fieldKey}
//                           value={formData[fieldKey]}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                         />
//                       ) : fieldKey === "grpo_status" ? (
//                         <select
//                           name={fieldKey}
//                           value={formData[fieldKey]}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                         >
//                           <option value="Open">Open</option>
//                           <option value="Cleared">Cleared</option>
//                           <option value="Cancelled">Cancelled</option>
//                         </select>
//                       ) : (
//                         <input
//                           type={
//                             fieldKey === "grpo_amt" ||
//                             fieldKey === "grpo_quantity"
//                               ? "number"
//                               : "text"
//                           }
//                           step="any"
//                           required={
//                             fieldKey !== "description" &&
//                             fieldKey !== "inward_whs_code" &&
//                             fieldKey !== "purchase_vendor_code"
//                           }
//                           name={fieldKey}
//                           value={formData[fieldKey]}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                           placeholder={`Enter ${fieldKey.replace(/_/g, " ")}...`}
//                         />
//                       )}
//                     </div>
//                   );
//                 })}
//               </form>
//             </div>

//             <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-white rounded-b-2xl">
//               <button
//                 type="button"
//                 onClick={() => setIsFormModalOpen(false)}
//                 className="px-6 py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="grpoForm"
//                 disabled={loading}
//                 className="px-8 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-md shadow-[#e67e22]/20 disabled:opacity-50"
//               >
//                 {loading ? "Saving..." : "Save Record"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from "react";
// import api from "../api/axios";
// import Swal from "sweetalert2";

// // Helper: Indian Number Currency Formatting
// const formatIndianNumber = (num) => {
//   if (!num || isNaN(num)) return "0.00";
//   return new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(num);
// };

// // PREMIUM OUTLINE SVG ICONS
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

// export default function GRPOManager() {
//   const role = localStorage.getItem("user_role") || "USER";
//   const fileInputRef = useRef(null);

//   // --- CORE DATA STATES ---
//   const [grpoData, setGrpoData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({
//     firm_name: "",
//     grpo_status: "",
//     purchase_vendor_name: "",
//     grpo_create_date: "",
//   });

//   // --- PAGINATION STATES 🔥 ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(50); // Show 50 items per page

//   // --- MODAL CONTROL STATES ---
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [editModeId, setEditModeId] = useState(null);

//   const initialState = {
//     firm_name: "",
//     internal_number: "",
//     grpo_status: "Open",
//     grpo_user_name: "",
//     grpo_no: "",
//     grpo_invoice_number: "",
//     grpo_create_date: new Date().toISOString().split("T")[0],
//     grpo_posting_date: new Date().toISOString().split("T")[0],
//     purchase_vendor_code: "",
//     purchase_vendor_name: "",
//     inward_whs_code: "",
//     item_code: "",
//     description: "",
//     grpo_quantity: "",
//     grpo_amt: "",
//   };
//   const [formData, setFormData] = useState(initialState);

//   useEffect(() => {
//     fetchGRPO();
//   }, []);

//   // Reset page to 1 when search or filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, filters]);

//   const fetchGRPO = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("reports/grpo/");
//       setGrpoData(res.data);
//     } catch (e) {
//       console.error("Error fetching GRPO list:", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   const handleFilterChange = (e) =>
//     setFilters({ ...filters, [e.target.name]: e.target.value });

//   const handleAutoFetchInvoice = async () => {
//     if (!formData.grpo_invoice_number.trim()) {
//       return Swal.fire(
//         "Required",
//         "Please enter Invoice Number first!",
//         "info",
//       );
//     }
//     setLoading(true);
//     try {
//       const res = await api.get(
//         `reports/fetch-invoice-grpo/${formData.grpo_invoice_number}/`,
//       );
//       const invData = res.data[0];
//       setFormData((prev) => ({
//         ...prev,
//         firm_name: invData.firm_name || prev.firm_name,
//         purchase_vendor_name:
//           invData.purchase_vendor_name || prev.purchase_vendor_name,
//         item_code: invData.item_code || prev.item_code,
//         description: invData.description || prev.description,
//         grpo_quantity: invData.grpo_quantity || prev.grpo_quantity,
//         grpo_amt: invData.grpo_amt || prev.grpo_amt,
//       }));
//       Swal.fire({
//         icon: "success",
//         title: "Auto-Filled!",
//         text: "Invoice details synced.",
//         timer: 1500,
//         showConfirmButton: false,
//       });
//     } catch (e) {
//       Swal.fire(
//         "Not Found",
//         "Could not find this Invoice Number in system.",
//         "error",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddNew = () => {
//     setEditModeId(null);
//     setFormData(initialState);
//     setIsFormModalOpen(true);
//   };

//   const handleEdit = (id) => {
//     const record = grpoData.find((g) => g.id === id);
//     if (record) {
//       setEditModeId(id);
//       setFormData(record);
//       setIsFormModalOpen(true);
//     }
//   };

//   const handleView = (id) => {
//     const record = grpoData.find((g) => g.id === id);
//     if (record) {
//       setViewData(record);
//       setIsViewModalOpen(true);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const payload = {
//         ...formData,
//         grpo_quantity: parseFloat(formData.grpo_quantity) || 0,
//         grpo_amt: parseFloat(formData.grpo_amt) || 0,
//       };

//       if (editModeId) {
//         await api.put(`reports/grpo/${editModeId}/`, payload);
//         Swal.fire({
//           icon: "success",
//           title: "Updated!",
//           text: "GRPO Updated!",
//           confirmButtonColor: "#0f172a",
//         });
//       } else {
//         await api.post("reports/grpo/", payload);
//         Swal.fire({
//           icon: "success",
//           title: "Saved!",
//           text: "New GRPO Saved!",
//           confirmButtonColor: "#0f172a",
//         });
//       }
//       setIsFormModalOpen(false);
//       fetchGRPO();
//     } catch (err) {
//       Swal.fire(
//         "Error",
//         "Save Failed: " + (err.response?.data?.error || err.message),
//         "error",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (role !== "ADMIN") return;
//     const confirm = await Swal.fire({
//       title: "Delete Record?",
//       text: "Are you sure?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#dc2626",
//       confirmButtonText: "Yes, delete!",
//     });
//     if (confirm.isConfirmed) {
//       try {
//         await api.delete(`reports/grpo/${id}/`);
//         Swal.fire("Deleted!", "GRPO Deleted!", "success");
//         fetchGRPO();
//       } catch (err) {
//         Swal.fire("Error", "Delete failed: " + err.message, "error");
//       }
//     }
//   };

//   const handleUploadClick = () => fileInputRef.current.click();
//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const formDataFile = new FormData();
//     formDataFile.append("file", file);
//     try {
//       setLoading(true);
//       const res = await api.post("reports/grpo/upload_excel/", formDataFile, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       Swal.fire({
//         icon: "success",
//         title: "Uploaded!",
//         text: res.data.message || "Imported Successfully!",
//         confirmButtonColor: "#0f172a",
//       });
//       fetchGRPO();
//     } catch (err) {
//       Swal.fire(
//         "Upload Failed",
//         err.response?.data?.error || err.message,
//         "error",
//       );
//     } finally {
//       setLoading(false);
//       e.target.value = null;
//     }
//   };

//   const handleExportData = () => {
//     if (filteredGRPO.length === 0)
//       return Swal.fire("Notice", "No data to download!", "info");
//     let csv =
//       "Firm Name,Internal Number,GRPO Status,GRPO User Name,GRPO No.,GRPO Invoice Number,GRPO Create Date,GRPO Posting Date,Purchase Vendor Code,Purchase Vendor Name,Inward WHS Code,Item Code,Description,GRPO Quantity,GRPO Amt\n";
//     filteredGRPO.forEach((g) => {
//       csv += `"${g.firm_name}","${g.internal_number}","${g.grpo_status}","${g.grpo_user_name}","${g.grpo_no}","${g.grpo_invoice_number}","${g.grpo_create_date}","${g.grpo_posting_date}","${g.purchase_vendor_code}","${g.purchase_vendor_name}","${g.inward_whs_code}","${g.item_code}","${g.description?.replace(/"/g, '""')}","${g.grpo_quantity}","${g.grpo_amt}"\n`;
//     });
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = `GRPO_Report_${new Date().toISOString().split("T")[0]}.csv`;
//     link.click();
//   };

//   const handleDownloadTemplate = () => {
//     const csv =
//       "firm_name,internal_number,grpo_status,grpo_user_name,grpo_no,grpo_invoice_number,grpo_create_date,grpo_posting_date,purchase_vendor_code,purchase_vendor_name,inward_whs_code,item_code,description,grpo_quantity,grpo_amt\nShree Maa,INT901,Open,Kartik,GRPO-551,INV-881,11-07-2026,11-07-2026,VEND-04,Cloud Retail,WHS-Bhopal,IC-8821,OnePlus Nord CE4,50.00,1650000.00\n";
//     const blob = new Blob([csv], { type: "text/csv" });
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = "GRPO_Bulk_Template.csv";
//     link.click();
//   };

//   const flexibleMatch = (fieldValue, searchInput) => {
//     if (!searchInput) return true;
//     if (!fieldValue) return false;
//     const words = searchInput.toLowerCase().split(" ").filter(Boolean);
//     const text = fieldValue.toLowerCase();
//     return words.some((word) => text.includes(word));
//   };

//   // 1. First, get all filtered items
//   const filteredGRPO = grpoData.filter((g) => {
//     let match = true;
//     if (searchTerm) {
//       const s = searchTerm.toLowerCase().trim();
//       const searchFields = [
//         g.grpo_no,
//         g.internal_number,
//         g.grpo_invoice_number,
//         g.purchase_vendor_code,
//         g.purchase_vendor_name,
//         g.item_code,
//         g.firm_name,
//         g.grpo_user_name,
//         g.inward_whs_code,
//         g.description,
//         g.grpo_quantity,
//         g.grpo_amt,
//       ];
//       if (
//         !searchFields.some((field) => String(field).toLowerCase().includes(s))
//       )
//         match = false;
//     }
//     if (
//       filters.firm_name &&
//       !g.firm_name?.toLowerCase().includes(filters.firm_name.toLowerCase())
//     )
//       match = false;
//     if (filters.grpo_status && g.grpo_status !== filters.grpo_status)
//       match = false;
//     if (
//       filters.grpo_create_date &&
//       g.grpo_create_date !== filters.grpo_create_date
//     )
//       match = false;
//     if (
//       filters.purchase_vendor_name &&
//       !flexibleMatch(g.purchase_vendor_name, filters.purchase_vendor_name)
//     )
//       match = false;
//     return match;
//   });

//   // 2. Pagination Logic 🔥
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredGRPO.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredGRPO.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const getBadgeStyle = (status) => {
//     const s = String(status || "")
//       .trim()
//       .toLowerCase();
//     if (s === "cleared" || s === "completed")
//       return {
//         bg: "bg-emerald-50 text-emerald-700 border-emerald-300",
//         dot: "bg-emerald-600",
//       };
//     if (s === "cancelled")
//       return {
//         bg: "bg-rose-50 text-rose-700 border-rose-300",
//         dot: "bg-rose-600",
//       };
//     return {
//       bg: "bg-amber-50 text-amber-700 border-amber-300",
//       dot: "bg-amber-600",
//     };
//   };

//   return (
//     <div className="bg-transparent font-sans h-full flex flex-col pb-4 text-slate-700">
//       <style>{`
//         .custom-table-scrollbar::-webkit-scrollbar { height: 10px; width: 10px; }
//         .custom-table-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
//         .custom-table-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 5px; }
//         .custom-table-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
//       `}</style>

//       {/* HEADER */}
//       <div className="bg-white px-6 py-4 border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-xl mb-4">
//         <div>
//           <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
//             Warehouse & Logistics /{" "}
//             <span className="text-slate-600">SAP-GRPO</span>
//           </p>
//           <h1 className="text-xl font-bold text-slate-800 tracking-tight">
//             GRPO Management
//           </h1>
//         </div>
//       </div>

//       <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden flex flex-col flex-1">
//         {/* TOOLBAR */}
//         <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-gray-100 bg-white gap-4 flex-shrink-0">
//           <div className="flex items-center gap-3 w-full md:w-auto">
//             <div className="flex items-center bg-gray-50/80 px-4 py-2.5 rounded-full w-full md:w-[320px] border border-gray-100 focus-within:bg-white focus-within:border-[#e67e22] focus-within:ring-2 focus-within:ring-blue-50 transition-all">
//               <IconSearch />
//               <input
//                 type="text"
//                 placeholder="Search No., Vendor or Item..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="bg-transparent border-none outline-none ml-3 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm("")}
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
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileUpload}
//               className="hidden"
//               accept=".xlsx, .csv"
//             />
//             <div className="flex items-center gap-2 bg-white p-1.5 rounded-[12px] border border-gray-200 shadow-sm">
//               <button
//                 onClick={handleDownloadTemplate}
//                 title="Download Template"
//                 className="flex items-center justify-center px-3 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-[#e67e22] transition font-bold text-[11px]"
//               >
//                 <IconTemplate />
//               </button>
//               <button
//                 onClick={handleUploadClick}
//                 title="Upload Excel"
//                 className="flex items-center justify-center w-8 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-[#52c41a] transition"
//               >
//                 <IconUpload />
//               </button>
//               <button
//                 onClick={handleExportData}
//                 title="Export Database"
//                 className="flex items-center justify-center w-8 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-[#722ed1] transition"
//               >
//                 <IconDownload />
//               </button>
//             </div>
//             <button
//               onClick={handleAddNew}
//               className="flex items-center gap-2 px-5 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white rounded-[10px] transition font-bold text-[13px] shadow-md shadow-[#e67e22]/20 whitespace-nowrap"
//             >
//               <IconPlus /> Manual Entry
//             </button>
//           </div>
//         </div>

//         {/* EXPANDABLE FILTERS */}
//         {showFilters && (
//           <div className="px-6 py-4 bg-[#fafafa] border-b border-gray-100 flex-shrink-0 animate-in slide-in-from-top-2">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
//                   Create Date
//                 </label>
//                 <input
//                   type="date"
//                   name="grpo_create_date"
//                   value={filters.grpo_create_date}
//                   onChange={handleFilterChange}
//                   className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#e67e22] text-sm transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
//                   Firm Name
//                 </label>
//                 <input
//                   type="text"
//                   name="firm_name"
//                   value={filters.firm_name}
//                   placeholder="Search firm..."
//                   onChange={handleFilterChange}
//                   className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#e67e22] text-sm transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
//                   Vendor Name
//                 </label>
//                 <input
//                   type="text"
//                   name="purchase_vendor_name"
//                   value={filters.purchase_vendor_name}
//                   placeholder="e.g. Cloud Retail"
//                   onChange={handleFilterChange}
//                   className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#e67e22] text-sm transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
//                   GRPO Status
//                 </label>
//                 <select
//                   name="grpo_status"
//                   value={filters.grpo_status}
//                   onChange={handleFilterChange}
//                   className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#e67e22] text-sm transition"
//                 >
//                   <option value="">All Status</option>
//                   <option value="Open">Open</option>
//                   <option value="Cleared">Cleared</option>
//                   <option value="Cancelled">Cancelled</option>
//                 </select>
//               </div>
//               <button
//                 onClick={() =>
//                   setFilters({
//                     firm_name: "",
//                     grpo_status: "",
//                     purchase_vendor_name: "",
//                     grpo_create_date: "",
//                   })
//                 }
//                 className="w-full p-2.5 bg-white border border-gray-200 text-gray-600 text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-100 transition shadow-sm"
//               >
//                 Clear All
//               </button>
//             </div>
//           </div>
//         )}

//         {/* DATA TABLE */}
//         <div className="overflow-auto custom-table-scrollbar w-full flex-1 border-t border-gray-200 min-h-[50vh]">
//           <table className="w-full text-left min-w-max border-collapse whitespace-nowrap">
//             <thead className="bg-gray-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-20 shadow-sm">
//               <tr>
//                 <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
//                   #
//                 </th>
//                 <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                   GRPO No
//                 </th>
//                 <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                   Invoice No
//                 </th>
//                 <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                   Date
//                 </th>
//                 <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                   Firm Name
//                 </th>
//                 <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                   Vendor Name
//                 </th>
//                 <th className="px-4 py-3 border border-gray-200 bg-gray-50">
//                   Item Code
//                 </th>
//                 <th className="px-4 py-3 border border-gray-200 bg-gray-50 min-w-[250px]">
//                   Description
//                 </th>
//                 <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
//                   Quantity
//                 </th>
//                 <th className="px-4 py-3 text-right border border-gray-200 bg-gray-50">
//                   Amount
//                 </th>
//                 <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50">
//                   Status
//                 </th>
//                 <th className="px-4 py-3 text-center border border-gray-200 bg-gray-50 z-30">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white">
//               {currentItems.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="12"
//                     className="p-16 text-center border border-gray-200"
//                   >
//                     <div className="flex flex-col items-center justify-center">
//                       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
//                         <i className="fas fa-inbox text-2xl text-gray-300"></i>
//                       </div>
//                       <p className="font-bold text-[13px] text-slate-600">
//                         No Records Found
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 currentItems.map((row, index) => {
//                   const badgeStyle = getBadgeStyle(row.grpo_status);
//                   // Global index calculation for display
//                   const displayIndex = indexOfFirstItem + index + 1;
//                   return (
//                     <tr
//                       key={row.id}
//                       className="hover:bg-blue-50/30 transition-colors group"
//                     >
//                       <td className="px-4 py-3 text-center border border-gray-200 text-[13px] text-slate-700 font-medium">
//                         {displayIndex.toString().padStart(2, "0")}
//                       </td>
//                       <td className="px-4 py-3 border border-gray-200 font-mono font-bold text-[#e67e22] text-[13px]">
//                         {row.grpo_no || "-"}
//                       </td>
//                       <td className="px-4 py-3 border border-gray-200 font-mono font-bold text-slate-700 text-[12px]">
//                         {row.grpo_invoice_number || "-"}
//                       </td>
//                       <td className="px-4 py-3 border border-gray-200 text-[13px] text-slate-700 font-medium">
//                         {row.grpo_create_date || "-"}
//                       </td>
//                       <td className="px-4 py-3 border border-gray-200 text-[13px] text-slate-700 font-bold">
//                         {row.firm_name || "-"}
//                       </td>
//                       <td className="px-4 py-3 border border-gray-200 text-[13px] text-slate-700">
//                         <div className="font-bold">
//                           {row.purchase_vendor_name || "-"}
//                         </div>
//                         <div className="text-[11px] text-gray-400 font-mono">
//                           Code: {row.purchase_vendor_code || "-"}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 border border-gray-200 font-mono font-bold text-slate-600 text-[13px]">
//                         {row.item_code || "-"}
//                       </td>
//                       <td className="px-4 py-3 border border-gray-200 text-[13px] text-slate-700 font-medium whitespace-normal min-w-[250px] leading-relaxed">
//                         {row.description || "-"}
//                       </td>
//                       <td className="px-4 py-3 text-center border border-gray-200 text-[13px] font-bold text-slate-800">
//                         {row.grpo_quantity || "0"}
//                       </td>
//                       <td className="px-4 py-3 text-right border border-gray-200 text-[13px] font-black text-emerald-600">
//                         ₹{formatIndianNumber(row.grpo_amt)}
//                       </td>
//                       <td className="px-4 py-3 text-center border border-gray-200">
//                         <span
//                           className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border border-dashed ${badgeStyle.bg}`}
//                         >
//                           <span
//                             className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}
//                           ></span>
//                           {row.grpo_status || "Open"}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-center border border-gray-200 bg-white z-10">
//                         <div className="flex items-center justify-center gap-2">
//                           <button
//                             onClick={() => handleView(row.id)}
//                             title="View Detail"
//                             className="w-8 h-8 rounded-md bg-gray-50 border border-gray-200 text-gray-500 hover:text-[#722ed1] hover:bg-purple-50 hover:border-purple-200 shadow-sm flex items-center justify-center transition"
//                           >
//                             <i className="fas fa-eye text-[12px]"></i>
//                           </button>
//                           {role === "ADMIN" && (
//                             <>
//                               <button
//                                 onClick={() => handleEdit(row.id)}
//                                 title="Edit Record"
//                                 className="w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-blue-500 hover:bg-blue-50 shadow-sm flex items-center justify-center transition"
//                               >
//                                 <i className="fas fa-pen text-[12px]"></i>
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(row.id)}
//                                 title="Delete Record"
//                                 className="w-8 h-8 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:bg-red-50 shadow-sm flex items-center justify-center transition"
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

//         {/* FOOTER PAGINATION 🔥 */}
//         <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex-shrink-0 gap-4">
//           <div className="text-[12px] font-semibold text-gray-500">
//             Showing{" "}
//             <span className="text-slate-800">
//               {filteredGRPO.length > 0 ? indexOfFirstItem + 1 : 0}
//             </span>{" "}
//             to{" "}
//             <span className="text-slate-800">
//               {Math.min(indexOfLastItem, filteredGRPO.length)}
//             </span>{" "}
//             of{" "}
//             <span className="text-[#e67e22] font-bold">
//               {filteredGRPO.length}
//             </span>{" "}
//             entries
//           </div>

//           {totalPages > 1 && (
//             <div className="flex items-center gap-1">
//               <button
//                 onClick={() => paginate(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <i className="fas fa-chevron-left text-[10px]"></i>
//               </button>

//               {/* Simple page numbers */}
//               {Array.from({ length: totalPages }).map((_, i) => {
//                 // Logic to show limited pages if too many (e.g. 1 2 3 ... 10)
//                 if (totalPages > 7) {
//                   if (
//                     i === 0 ||
//                     i === totalPages - 1 ||
//                     (i >= currentPage - 2 && i <= currentPage)
//                   ) {
//                     return (
//                       <button
//                         key={i}
//                         onClick={() => paginate(i + 1)}
//                         className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${currentPage === i + 1 ? "bg-[#e67e22] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
//                       >
//                         {i + 1}
//                       </button>
//                     );
//                   } else if (i === currentPage - 3 || i === currentPage + 1) {
//                     return (
//                       <span key={i} className="text-gray-400 px-1">
//                         ...
//                       </span>
//                     );
//                   }
//                   return null;
//                 }
//                 return (
//                   <button
//                     key={i}
//                     onClick={() => paginate(i + 1)}
//                     className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${currentPage === i + 1 ? "bg-[#e67e22] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
//                   >
//                     {i + 1}
//                   </button>
//                 );
//               })}

//               <button
//                 onClick={() => paginate(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 <i className="fas fa-chevron-right text-[10px]"></i>
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 🚀 VIEW MODAL */}
//       {isViewModalOpen && viewData && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
//             <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
//               <h3 className="text-[16px] font-bold text-slate-800 tracking-tight flex items-center gap-2">
//                 <i className="fas fa-file-invoice text-[#e67e22]"></i> GRPO
//                 Audit Data Sheet —{" "}
//                 <span className="text-[#e67e22] font-mono">
//                   {viewData.grpo_no}
//                 </span>
//               </h3>
//               <button
//                 onClick={() => setIsViewModalOpen(false)}
//                 className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times text-sm"></i>
//               </button>
//             </div>
//             <div className="p-8 overflow-y-auto bg-[#f0f2f5]/40 custom-scrollbar">
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
//                 {Object.keys(initialState).map((k) => (
//                   <div key={k} className="border-b pb-3 border-slate-50 mb-1">
//                     <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
//                       {k.replace(/_/g, " ")}
//                     </p>
//                     <p className="font-semibold text-[14px] text-slate-800 break-words">
//                       {k === "grpo_amt"
//                         ? `₹${formatIndianNumber(viewData[k])}`
//                         : String(viewData[k] || "-")}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-white rounded-b-2xl">
//               <button
//                 onClick={() => setIsViewModalOpen(false)}
//                 className="px-6 py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-sm"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🚀 SMART FORM MODAL (CREATE / EDIT) */}
//       {isFormModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95">
//             <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
//               <div>
//                 <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">
//                   {editModeId ? "Edit GRPO Record" : "New GRPO Entry"}
//                 </h3>
//                 <p className="text-[12px] text-gray-400 font-medium mt-0.5">
//                   Fetch from Invoice or fill manually.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsFormModalOpen(false)}
//                 className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times text-sm"></i>
//               </button>
//             </div>

//             <div className="p-8 overflow-y-auto custom-scrollbar bg-[#f0f2f5]/40">
//               {!editModeId && (
//                 <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm items-end">
//                   <div className="flex-1">
//                     <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
//                       GRPO Invoice No.
//                     </label>
//                     <input
//                       type="text"
//                       name="grpo_invoice_number"
//                       value={formData.grpo_invoice_number}
//                       onChange={handleInputChange}
//                       placeholder="e.g. INV-2026-001..."
//                       className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 font-medium text-slate-700 text-sm transition"
//                     />
//                   </div>
//                   <button
//                     onClick={handleAutoFetchInvoice}
//                     disabled={loading}
//                     className="bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-bold uppercase tracking-widest px-8 py-3 rounded-xl shadow-md transition w-full md:w-auto flex items-center justify-center gap-2 border border-slate-900"
//                   >
//                     {loading ? (
//                       <i className="fas fa-spinner fa-spin"></i>
//                     ) : (
//                       <i className="fas fa-sync-alt"></i>
//                     )}{" "}
//                     Fetch Data
//                   </button>
//                 </div>
//               )}

//               <form
//                 id="grpoForm"
//                 onSubmit={handleSubmit}
//                 className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm"
//               >
//                 {Object.keys(initialState).map((fieldKey) => {
//                   if (!editModeId && fieldKey === "grpo_invoice_number")
//                     return null;
//                   return (
//                     <div key={fieldKey}>
//                       <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
//                         {fieldKey.replace(/_/g, " ")}
//                       </label>
//                       {fieldKey.includes("date") ? (
//                         <input
//                           type="date"
//                           required
//                           name={fieldKey}
//                           value={formData[fieldKey]}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                         />
//                       ) : fieldKey === "grpo_status" ? (
//                         <select
//                           name={fieldKey}
//                           value={formData[fieldKey]}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                         >
//                           <option value="Open">Open</option>
//                           <option value="Cleared">Cleared</option>
//                           <option value="Cancelled">Cancelled</option>
//                         </select>
//                       ) : (
//                         <input
//                           type={
//                             fieldKey === "grpo_amt" ||
//                             fieldKey === "grpo_quantity"
//                               ? "number"
//                               : "text"
//                           }
//                           step="any"
//                           required={
//                             fieldKey !== "description" &&
//                             fieldKey !== "inward_whs_code" &&
//                             fieldKey !== "purchase_vendor_code"
//                           }
//                           name={fieldKey}
//                           value={formData[fieldKey]}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                           placeholder={`Enter ${fieldKey.replace(/_/g, " ")}...`}
//                         />
//                       )}
//                     </div>
//                   );
//                 })}
//               </form>
//             </div>

//             <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-white rounded-b-2xl">
//               <button
//                 type="button"
//                 onClick={() => setIsFormModalOpen(false)}
//                 className="px-6 py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="grpoForm"
//                 disabled={loading}
//                 className="px-8 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-md shadow-[#e67e22]/20 disabled:opacity-50"
//               >
//                 {loading ? "Saving..." : "Save Record"}
//               </button>
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
import SmartLoader from "../components/SmartLoader";

// Helper: Indian Number Currency Formatting
const formatIndianNumber = (num) => {
  if (!num || isNaN(num)) return "0.00";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

// PREMIUM OUTLINE SVG ICONS
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

export default function GRPOManager() {
  const role = localStorage.getItem("user_role") || "USER";
  const fileInputRef = useRef(null);

  // --- CORE DATA STATES ---
  const [grpoData, setGrpoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    firm_name: "",
    grpo_status: "",
    purchase_vendor_name: "",
    grpo_create_date: "",
  });

  // --- PAGINATION STATES 🔥 ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50); // Show 50 items per page

  // --- MODAL CONTROL STATES ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editModeId, setEditModeId] = useState(null);

  const initialState = {
    firm_name: "",
    internal_number: "",
    grpo_status: "Open",
    grpo_user_name: "",
    grpo_no: "",
    grpo_invoice_number: "",
    grpo_create_date: new Date().toISOString().split("T")[0],
    grpo_posting_date: new Date().toISOString().split("T")[0],
    purchase_vendor_code: "",
    purchase_vendor_name: "",
    inward_whs_code: "",
    item_code: "",
    description: "",
    grpo_quantity: "",
    grpo_amt: "",
  };
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    fetchGRPO();
  }, []);

  // Reset page to 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const fetchGRPO = async () => {
    try {
      setLoading(true);
      const res = await api.get("reports/grpo/");
      setGrpoData(res.data);
    } catch (e) {
      console.error("Error fetching GRPO list:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleAutoFetchInvoice = async () => {
    if (!formData.grpo_invoice_number.trim()) {
      return Swal.fire(
        "Required",
        "Please enter Invoice Number first!",
        "info",
      );
    }
    setLoading(true);
    try {
      const res = await api.get(
        `reports/fetch-invoice-grpo/${formData.grpo_invoice_number}/`,
      );
      const invData = res.data[0];
      setFormData((prev) => ({
        ...prev,
        firm_name: invData.firm_name || prev.firm_name,
        purchase_vendor_name:
          invData.purchase_vendor_name || prev.purchase_vendor_name,
        item_code: invData.item_code || prev.item_code,
        description: invData.description || prev.description,
        grpo_quantity: invData.grpo_quantity || prev.grpo_quantity,
        grpo_amt: invData.grpo_amt || prev.grpo_amt,
      }));
      Swal.fire({
        icon: "success",
        title: "Auto-Filled!",
        text: "Invoice details synced.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (e) {
      Swal.fire(
        "Not Found",
        "Could not find this Invoice Number in system.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditModeId(null);
    setFormData(initialState);
    setIsFormModalOpen(true);
  };

  const handleEdit = (id) => {
    const record = grpoData.find((g) => g.id === id);
    if (record) {
      setEditModeId(id);
      setFormData(record);
      setIsFormModalOpen(true);
    }
  };

  const handleView = (id) => {
    const record = grpoData.find((g) => g.id === id);
    if (record) {
      setViewData(record);
      setIsViewModalOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        grpo_quantity: parseFloat(formData.grpo_quantity) || 0,
        grpo_amt: parseFloat(formData.grpo_amt) || 0,
      };

      if (editModeId) {
        await api.put(`reports/grpo/${editModeId}/`, payload);
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "GRPO Updated!",
          confirmButtonColor: "#0f172a",
        });
      } else {
        await api.post("reports/grpo/", payload);
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "New GRPO Saved!",
          confirmButtonColor: "#0f172a",
        });
      }
      setIsFormModalOpen(false);
      fetchGRPO();
    } catch (err) {
      Swal.fire(
        "Error",
        "Save Failed: " + (err.response?.data?.error || err.message),
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (role !== "ADMIN") return;
    const confirm = await Swal.fire({
      title: "Delete Record?",
      text: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete!",
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`reports/grpo/${id}/`);
        Swal.fire("Deleted!", "GRPO Deleted!", "success");
        fetchGRPO();
      } catch (err) {
        Swal.fire("Error", "Delete failed: " + err.message, "error");
      }
    }
  };

  const handleUploadClick = () => fileInputRef.current.click();
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formDataFile = new FormData();
    formDataFile.append("file", file);
    try {
      setLoading(true);
      const res = await api.post("reports/grpo/upload_excel/", formDataFile, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire({
        icon: "success",
        title: "Uploaded!",
        text: res.data.message || "Imported Successfully!",
        confirmButtonColor: "#0f172a",
      });
      fetchGRPO();
    } catch (err) {
      Swal.fire(
        "Upload Failed",
        err.response?.data?.error || err.message,
        "error",
      );
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  };

  const handleExportData = () => {
    if (filteredGRPO.length === 0)
      return Swal.fire("Notice", "No data to download!", "info");
    let csv =
      "Firm Name,Internal Number,GRPO Status,GRPO User Name,GRPO No.,GRPO Invoice Number,GRPO Create Date,GRPO Posting Date,Purchase Vendor Code,Purchase Vendor Name,Inward WHS Code,Item Code,Description,GRPO Quantity,GRPO Amt\n";
    filteredGRPO.forEach((g) => {
      csv += `"${g.firm_name}","${g.internal_number}","${g.grpo_status}","${g.grpo_user_name}","${g.grpo_no}","${g.grpo_invoice_number}","${g.grpo_create_date}","${g.grpo_posting_date}","${g.purchase_vendor_code}","${g.purchase_vendor_name}","${g.inward_whs_code}","${g.item_code}","${g.description?.replace(/"/g, '""')}","${g.grpo_quantity}","${g.grpo_amt}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `GRPO_Report_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleDownloadTemplate = () => {
    const csv =
      "firm_name,internal_number,grpo_status,grpo_user_name,grpo_no,grpo_invoice_number,grpo_create_date,grpo_posting_date,purchase_vendor_code,purchase_vendor_name,inward_whs_code,item_code,description,grpo_quantity,grpo_amt\nShree Maa,INT901,Open,Kartik,GRPO-551,INV-881,11-07-2026,11-07-2026,VEND-04,Cloud Retail,WHS-Bhopal,IC-8821,OnePlus Nord CE4,50.00,1650000.00\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "GRPO_Bulk_Template.csv";
    link.click();
  };

  const flexibleMatch = (fieldValue, searchInput) => {
    if (!searchInput) return true;
    if (!fieldValue) return false;
    const words = searchInput.toLowerCase().split(" ").filter(Boolean);
    const text = fieldValue.toLowerCase();
    return words.some((word) => text.includes(word));
  };

  // 1. First, get all filtered items
  const filteredGRPO = grpoData.filter((g) => {
    let match = true;
    if (searchTerm) {
      const s = searchTerm.toLowerCase().trim();
      const searchFields = [
        g.grpo_no,
        g.internal_number,
        g.grpo_invoice_number,
        g.purchase_vendor_code,
        g.purchase_vendor_name,
        g.item_code,
        g.firm_name,
        g.grpo_user_name,
        g.inward_whs_code,
        g.description,
        g.grpo_quantity,
        g.grpo_amt,
      ];
      if (
        !searchFields.some((field) => String(field).toLowerCase().includes(s))
      )
        match = false;
    }
    if (
      filters.firm_name &&
      !g.firm_name?.toLowerCase().includes(filters.firm_name.toLowerCase())
    )
      match = false;
    if (filters.grpo_status && g.grpo_status !== filters.grpo_status)
      match = false;
    if (
      filters.grpo_create_date &&
      g.grpo_create_date !== filters.grpo_create_date
    )
      match = false;
    if (
      filters.purchase_vendor_name &&
      !flexibleMatch(g.purchase_vendor_name, filters.purchase_vendor_name)
    )
      match = false;
    return match;
  });

  // 2. Pagination Logic 🔥
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredGRPO.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGRPO.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getBadgeStyle = (status) => {
    const s = String(status || "")
      .trim()
      .toLowerCase();
    if (s === "cleared" || s === "completed")
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-300",
        dot: "bg-emerald-600",
      };
    if (s === "cancelled")
      return {
        bg: "bg-rose-50 text-rose-700 border-rose-300",
        dot: "bg-rose-600",
      };
    return {
      bg: "bg-amber-50 text-amber-700 border-amber-300",
      dot: "bg-amber-600",
    };
  };

  return (
    <div className="bg-transparent font-sans h-full flex flex-col pb-4 text-slate-700">
      <style>{`
        .custom-table-scrollbar::-webkit-scrollbar { height: 10px; width: 10px; }
        .custom-table-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-table-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 5px; }
        .custom-table-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/* HEADER */}
      <div className="bg-white px-6 py-4 border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 rounded-t-xl mb-4">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
            Warehouse & Logistics /{" "}
            <span className="text-slate-600">SAP-GRPO</span>
          </p>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            GRPO Management
          </h1>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden flex flex-col flex-1">
        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-gray-100 bg-white gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-gray-50/80 px-4 py-2.5 rounded-full w-full md:w-[320px] border border-gray-100 focus-within:bg-white focus-within:border-[#e67e22] focus-within:ring-2 focus-within:ring-blue-50 transition-all">
              <IconSearch />
              <input
                type="text"
                placeholder="Search No., Vendor or Item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none ml-3 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
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
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".xlsx, .csv"
            />
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-[12px] border border-gray-200 shadow-sm">
              <button
                onClick={handleDownloadTemplate}
                title="Download Template"
                className="flex items-center justify-center px-3 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-[#e67e22] transition font-bold text-[11px]"
              >
                <IconTemplate />
              </button>
              <button
                onClick={handleUploadClick}
                title="Upload Excel"
                className="flex items-center justify-center w-8 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-[#52c41a] transition"
              >
                <IconUpload />
              </button>
              <button
                onClick={handleExportData}
                title="Export Database"
                className="flex items-center justify-center w-8 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-[#722ed1] transition"
              >
                <IconDownload />
              </button>
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white rounded-[10px] transition font-bold text-[13px] shadow-md shadow-[#e67e22]/20 whitespace-nowrap"
            >
              <IconPlus /> Manual Entry
            </button>
          </div>
        </div>

        {/* EXPANDABLE FILTERS */}
        {showFilters && (
          <div className="px-6 py-4 bg-[#fafafa] border-b border-gray-100 flex-shrink-0 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  Create Date
                </label>
                <input
                  type="date"
                  name="grpo_create_date"
                  value={filters.grpo_create_date}
                  onChange={handleFilterChange}
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#e67e22] text-sm transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  Firm Name
                </label>
                <input
                  type="text"
                  name="firm_name"
                  value={filters.firm_name}
                  placeholder="Search firm..."
                  onChange={handleFilterChange}
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#e67e22] text-sm transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  Vendor Name
                </label>
                <input
                  type="text"
                  name="purchase_vendor_name"
                  value={filters.purchase_vendor_name}
                  placeholder="e.g. Cloud Retail"
                  onChange={handleFilterChange}
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#e67e22] text-sm transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  GRPO Status
                </label>
                <select
                  name="grpo_status"
                  value={filters.grpo_status}
                  onChange={handleFilterChange}
                  className="w-full bg-white border border-gray-200 rounded-xl p-2.5 outline-none focus:border-[#e67e22] text-sm transition"
                >
                  <option value="">All Status</option>
                  <option value="Open">Open</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <button
                onClick={() =>
                  setFilters({
                    firm_name: "",
                    grpo_status: "",
                    purchase_vendor_name: "",
                    grpo_create_date: "",
                  })
                }
                className="w-full p-2.5 bg-white border border-gray-200 text-gray-600 text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-100 transition shadow-sm"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* 🔥 HIGH-DENSITY COMPACT DATA TABLE 🔥 */}
        <div className="overflow-auto custom-table-scrollbar w-full flex-1 border-t border-gray-200 min-h-[75vh] max-h-[calc(100vh-100px)] relative bg-white">
          {loading ? (
            <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center">
              <SmartLoader />
            </div>
          ) : (
            <table className="w-full text-left min-w-max border-collapse">
              <thead className="bg-gray-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-20 shadow-sm whitespace-nowrap">
                <tr>
                  <th className="px-3 py-2 text-center border border-gray-200 bg-gray-50">
                    #
                  </th>
                  <th className="px-3 py-2 border border-gray-200 bg-gray-50">
                    GRPO No
                  </th>
                  <th className="px-3 py-2 border border-gray-200 bg-gray-50">
                    Invoice No
                  </th>
                  <th className="px-3 py-2 border border-gray-200 bg-gray-50">
                    Date
                  </th>
                  <th className="px-3 py-2 border border-gray-200 bg-gray-50">
                    Firm Name
                  </th>
                  <th className="px-3 py-2 border border-gray-200 bg-gray-50">
                    Vendor Name
                  </th>
                  <th className="px-3 py-2 border border-gray-200 bg-gray-50">
                    Item Code
                  </th>
                  <th className="px-3 py-2 border border-gray-200 bg-gray-50 min-w-[250px]">
                    Description
                  </th>
                  <th className="px-3 py-2 text-center border border-gray-200 bg-gray-50">
                    Quantity
                  </th>
                  <th className="px-3 py-2 text-right border border-gray-200 bg-gray-50">
                    Amount
                  </th>
                  <th className="px-3 py-2 text-center border border-gray-200 bg-gray-50">
                    Status
                  </th>
                  <th className="px-3 py-2 text-center border border-gray-200 bg-gray-50 z-30">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan="12"
                      className="p-16 text-center border border-gray-200"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
                          <i className="fas fa-inbox text-2xl text-gray-300"></i>
                        </div>
                        <p className="font-bold text-[13px] text-slate-600">
                          No Records Found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((row, index) => {
                    const badgeStyle = getBadgeStyle(row.grpo_status);
                    const displayIndex = indexOfFirstItem + index + 1;
                    return (
                      <tr
                        key={row.id}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="px-3 py-1.5 text-center border border-gray-200 whitespace-nowrap text-[13px] text-slate-700 font-medium">
                          {displayIndex.toString().padStart(2, "0")}
                        </td>
                        <td className="px-3 py-1.5 border border-gray-200 font-mono font-bold text-[#e67e22] text-[13px] whitespace-nowrap">
                          {row.grpo_no || "-"}
                        </td>
                        <td className="px-3 py-1.5 border border-gray-200 font-mono font-bold text-slate-700 text-[12px] whitespace-nowrap">
                          {row.grpo_invoice_number || "-"}
                        </td>
                        <td className="px-3 py-1.5 border border-gray-200 text-[13px] text-slate-700 font-medium whitespace-nowrap">
                          {row.grpo_create_date || "-"}
                        </td>

                        {/* 🔥 TEXT WRAP APPLIED HERE 🔥 */}
                        <td className="px-3 py-1.5 border border-gray-200 text-[13px] text-slate-700 font-bold whitespace-normal min-w-[120px] max-w-[200px] break-words leading-tight">
                          {row.firm_name || "-"}
                        </td>
                        <td className="px-3 py-1.5 border border-gray-200 text-[13px] text-slate-700 whitespace-normal min-w-[150px] max-w-[250px] break-words leading-tight">
                          <div className="font-bold">
                            {row.purchase_vendor_name || "-"}
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono">
                            Code: {row.purchase_vendor_code || "-"}
                          </div>
                        </td>

                        <td className="px-3 py-1.5 border border-gray-200 font-mono font-bold text-slate-600 text-[13px] whitespace-nowrap">
                          {row.item_code || "-"}
                        </td>

                        {/* 🔥 TEXT WRAP APPLIED HERE 🔥 */}
                        <td className="px-3 py-1.5 border border-gray-200 text-[13px] text-slate-700 font-medium whitespace-normal min-w-[250px] leading-snug break-words">
                          {row.description || "-"}
                        </td>

                        <td className="px-3 py-1.5 text-center border border-gray-200 text-[13px] font-bold text-slate-800 whitespace-nowrap">
                          {row.grpo_quantity || "0"}
                        </td>
                        <td className="px-3 py-1.5 text-right border border-gray-200 text-[13px] font-black text-emerald-600 whitespace-nowrap">
                          ₹{formatIndianNumber(row.grpo_amt)}
                        </td>
                        <td className="px-3 py-1.5 text-center border border-gray-200 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border border-dashed ${badgeStyle.bg}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}
                            ></span>
                            {row.grpo_status || "Open"}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 text-center border border-gray-200 bg-white z-10 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleView(row.id)}
                              title="View Detail"
                              className="w-7 h-7 rounded-md bg-gray-50 border border-gray-200 text-gray-500 hover:text-[#722ed1] hover:bg-purple-50 hover:border-purple-200 shadow-sm flex items-center justify-center transition"
                            >
                              <i className="fas fa-eye text-[11px]"></i>
                            </button>
                            {role === "ADMIN" && (
                              <>
                                <button
                                  onClick={() => handleEdit(row.id)}
                                  title="Edit Record"
                                  className="w-7 h-7 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-blue-500 hover:bg-blue-50 shadow-sm flex items-center justify-center transition"
                                >
                                  <i className="fas fa-pen text-[11px]"></i>
                                </button>
                                <button
                                  onClick={() => handleDelete(row.id)}
                                  title="Delete Record"
                                  className="w-7 h-7 rounded-md bg-white border border-gray-200 text-gray-500 hover:text-red-500 hover:bg-red-50 shadow-sm flex items-center justify-center transition"
                                >
                                  <i className="fas fa-trash-alt text-[11px]"></i>
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
          )}
        </div>

        {/* FOOTER PAGINATION 🔥 */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex-shrink-0 gap-4">
          <div className="text-[12px] font-semibold text-gray-500">
            Showing{" "}
            <span className="text-slate-800">
              {filteredGRPO.length > 0 ? indexOfFirstItem + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="text-slate-800">
              {Math.min(indexOfLastItem, filteredGRPO.length)}
            </span>{" "}
            of{" "}
            <span className="text-[#e67e22] font-bold">
              {filteredGRPO.length}
            </span>{" "}
            entries
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fas fa-chevron-left text-[10px]"></i>
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                if (totalPages > 7) {
                  if (
                    i === 0 ||
                    i === totalPages - 1 ||
                    (i >= currentPage - 2 && i <= currentPage)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${currentPage === i + 1 ? "bg-[#e67e22] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                      >
                        {i + 1}
                      </button>
                    );
                  } else if (i === currentPage - 3 || i === currentPage + 1) {
                    return (
                      <span key={i} className="text-gray-400 px-1">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
                return (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${currentPage === i + 1 ? "bg-[#e67e22] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                  >
                    {i + 1}
                  </button>
                );
              })}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fas fa-chevron-right text-[10px]"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🚀 VIEW MODAL */}
      {isViewModalOpen && viewData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-[16px] font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <i className="fas fa-file-invoice text-[#e67e22]"></i> GRPO
                Audit Data Sheet —{" "}
                <span className="text-[#e67e22] font-mono">
                  {viewData.grpo_no}
                </span>
              </h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
            <div className="p-8 overflow-y-auto bg-[#f0f2f5]/40 custom-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm">
                {Object.keys(initialState).map((k) => (
                  <div key={k} className="border-b pb-3 border-slate-50 mb-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      {k.replace(/_/g, " ")}
                    </p>
                    <p className="font-semibold text-[14px] text-slate-800 break-words">
                      {k === "grpo_amt"
                        ? `₹${formatIndianNumber(viewData[k])}`
                        : String(viewData[k] || "-")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-white rounded-b-2xl">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-6 py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 SMART FORM MODAL (CREATE / EDIT) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95">
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">
                  {editModeId ? "Edit GRPO Record" : "New GRPO Entry"}
                </h3>
                <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                  Fetch from Invoice or fill manually.
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar bg-[#f0f2f5]/40">
              {!editModeId && (
                <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm items-end">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      GRPO Invoice No.
                    </label>
                    <input
                      type="text"
                      name="grpo_invoice_number"
                      value={formData.grpo_invoice_number}
                      onChange={handleInputChange}
                      placeholder="e.g. INV-2026-001..."
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl outline-none focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 font-medium text-slate-700 text-sm transition"
                    />
                  </div>
                  <button
                    onClick={handleAutoFetchInvoice}
                    disabled={loading}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-[12px] font-bold uppercase tracking-widest px-8 py-3 rounded-xl shadow-md transition w-full md:w-auto flex items-center justify-center gap-2 border border-slate-900"
                  >
                    {loading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-sync-alt"></i>
                    )}{" "}
                    Fetch Data
                  </button>
                </div>
              )}

              <form
                id="grpoForm"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm"
              >
                {Object.keys(initialState).map((fieldKey) => {
                  if (!editModeId && fieldKey === "grpo_invoice_number")
                    return null;
                  return (
                    <div key={fieldKey}>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                        {fieldKey.replace(/_/g, " ")}
                      </label>
                      {fieldKey.includes("date") ? (
                        <input
                          type="date"
                          required
                          name={fieldKey}
                          value={formData[fieldKey]}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                        />
                      ) : fieldKey === "grpo_status" ? (
                        <select
                          name={fieldKey}
                          value={formData[fieldKey]}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                        >
                          <option value="Open">Open</option>
                          <option value="Cleared">Cleared</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <input
                          type={
                            fieldKey === "grpo_amt" ||
                            fieldKey === "grpo_quantity"
                              ? "number"
                              : "text"
                          }
                          step="any"
                          required={
                            fieldKey !== "description" &&
                            fieldKey !== "inward_whs_code" &&
                            fieldKey !== "purchase_vendor_code"
                          }
                          name={fieldKey}
                          value={formData[fieldKey]}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                          placeholder={`Enter ${fieldKey.replace(/_/g, " ")}...`}
                        />
                      )}
                    </div>
                  );
                })}
              </form>
            </div>

            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="px-6 py-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="grpoForm"
                disabled={loading}
                className="px-8 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-md shadow-[#e67e22]/20 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}