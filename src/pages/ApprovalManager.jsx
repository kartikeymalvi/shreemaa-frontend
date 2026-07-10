// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";

// const formatIndianNumber = (num) => {
//   if (!num || isNaN(num)) return "0.00";
//   return new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(num);
// };

// const parseIndianNumber = (str) => {
//   if (!str) return 0;
//   return parseFloat(str.toString().replace(/,/g, "")) || 0;
// };

// // 🔥 REUSABLE ICONS (Aap inhe doosre modules me bhi copy kar sakte hain) 🔥
// export const IconDownload = () => (
//   <svg
//     width="18"
//     height="18"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//     <polyline points="7 10 12 15 17 10"></polyline>
//     <line x1="12" y1="15" x2="12" y2="3"></line>
//   </svg>
// );
// export const IconColumns = () => (
//   <svg
//     width="18"
//     height="18"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <rect x="3" y="3" width="7" height="18" rx="1"></rect>
//     <rect x="14" y="3" width="7" height="18" rx="1"></rect>
//   </svg>
// );
// export const IconPlus = () => (
//   <svg
//     width="20"
//     height="20"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <line x1="12" y1="5" x2="12" y2="19"></line>
//     <line x1="5" y1="12" x2="19" y2="12"></line>
//   </svg>
// );
// export const IconSearch = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="#94a3b8"
//     strokeWidth="2"
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
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
//   </svg>
// );

// export default function ApprovalManager() {
//   const navigate = useNavigate();
//   const role = localStorage.getItem("user_role") || "USER";

//   const [approvals, setApprovals] = useState([]);
//   const [dropdowns, setDropdowns] = useState({
//     firms: [],
//     locations: [],
//     merchants: [],
//     models: [],
//   });
//   const [loading, setLoading] = useState(false);

//   const [showFilters, setShowFilters] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({
//     requested_by: "",
//     authorized_by: "",
//     merchant: "",
//     firm: "",
//     location: "",
//     request_date: "",
//   });

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const initialMasterState = {
//     request_date: new Date().toISOString().split("T")[0],
//     requested_by: "",
//     placed_by: "",
//     merchant_id: "",
//     firm: "",
//     bill_location: "",
//     ship_location: "",
//     merchant: "",
//   };
//   const [masterFormData, setMasterFormData] = useState(initialMasterState);

//   const initialItemState = {
//     product_model: "",
//     model_name_log: "",
//     model_no_log: "",
//     req_qty: "",
//     purchase_price_raw: "",
//     cn_amt_raw: "0",
//     link_used: "No",
//     expected_delivery_date: new Date(
//       new Date().setDate(new Date().getDate() + 1),
//     )
//       .toISOString()
//       .split("T")[0],
//   };
//   const [itemsList, setItemsList] = useState([
//     { ...initialItemState, id: Date.now() },
//   ]);

//   useEffect(() => {
//     fetchApprovals();
//     fetchDropdowns();
//   }, []);

//   const fetchApprovals = async () => {
//     try {
//       const response = await api.get("reports/approvals/");
//       setApprovals(response.data);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const fetchDropdowns = async () => {
//     try {
//       const response = await api.get("reports/approvals/dropdown_data/");
//       setDropdowns(response.data);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const handleMasterChange = (e) =>
//     setMasterFormData({ ...masterFormData, [e.target.name]: e.target.value });
//   const handleFilterChange = (e) =>
//     setFilters({ ...filters, [e.target.name]: e.target.value });

//   const handleItemChange = (id, field, value) => {
//     const updatedItems = itemsList.map((item) => {
//       if (item.id === id) {
//         let updatedItem = { ...item, [field]: value };
//         if (field === "product_model") {
//           const selectedModel = dropdowns.models.find(
//             (m) => String(m.id) === String(value),
//           );
//           if (selectedModel) {
//             updatedItem.model_name_log = selectedModel.model_name;
//             updatedItem.model_no_log = selectedModel.model || "-";
//           } else {
//             updatedItem.model_name_log = "";
//             updatedItem.model_no_log = "";
//           }
//         }
//         return updatedItem;
//       }
//       return item;
//     });
//     setItemsList(updatedItems);
//   };

//   const addItemRow = () =>
//     setItemsList([...itemsList, { ...initialItemState, id: Date.now() }]);
//   const removeItemRow = (id) => {
//     if (itemsList.length > 1)
//       setItemsList(itemsList.filter((item) => item.id !== id));
//   };

//   const handleAddNew = () => {
//     setMasterFormData(initialMasterState);
//     setItemsList([{ ...initialItemState, id: Date.now() }]);
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (
//       !masterFormData.firm ||
//       !masterFormData.merchant ||
//       !masterFormData.bill_location ||
//       !masterFormData.requested_by
//     ) {
//       return alert(
//         "Please fill all required Master fields including Requested By!",
//       );
//     }

//     try {
//       const cleanItems = itemsList.map((item, index) => {
//         if (!item.product_model)
//           throw new Error(`Item #${index + 1}: Please select an ASIN.`);
//         const selectedModel = dropdowns.models.find(
//           (m) => String(m.id) === String(item.product_model),
//         );
//         const pPrice = parseIndianNumber(item.purchase_price_raw);
//         const cnAmt = parseIndianNumber(item.cn_amt_raw);

//         return {
//           asin_fsn: selectedModel ? selectedModel.asin_fsn : "",
//           model_name: item.model_name_log || "Unknown",
//           model_no: item.model_no_log || "-",
//           req_qty: parseInt(item.req_qty) || 0,
//           purchase_price: pPrice,
//           cn_amt: cnAmt,
//           agreed_nlc: pPrice - cnAmt,
//           link_used: item.link_used || "No",
//           expected_delivery_date: item.expected_delivery_date,
//         };
//       });

//       const payload = {
//         ...masterFormData,
//         firm: parseInt(masterFormData.firm),
//         merchant: parseInt(masterFormData.merchant),
//         bill_location: parseInt(masterFormData.bill_location),
//         ship_location: parseInt(masterFormData.ship_location),
//         merchant_account_id: masterFormData.merchant_id || "N/A",
//         items: cleanItems,
//       };

//       setLoading(true);
//       await api.post("reports/approvals/", payload);
//       alert("Request Generated Successfully!");
//       setIsModalOpen(false);
//       fetchApprovals();
//     } catch (error) {
//       alert("Error: " + (error.response?.data?.error || error.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAdminAction = async (id, actionType) => {
//     if (!window.confirm(`Confirm ${actionType}?`)) return;
//     try {
//       await api.post(`reports/approvals/${id}/${actionType}/`);
//       fetchApprovals();
//     } catch (error) {
//       alert("Failed: " + error.message);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm(`DELETE this request completely?`)) return;
//     try {
//       await api.delete(`reports/approvals/${id}/`);
//       fetchApprovals();
//     } catch (error) {
//       alert("Failed: " + error.message);
//     }
//   };

//   const handleEdit = (id) =>
//     alert("Edit functionality will be implemented soon!");
//   const handleView = (id) =>
//     alert("View details functionality will be implemented soon!");
//   const handleColumnConfig = () =>
//     alert("Column Visibility control will be implemented soon!");

//   const handleExportData = async () => {
//     try {
//       const response = await api.get("reports/approvals/export_data/");
//       const blob = new Blob([response.data], { type: "text/csv" });
//       const link = document.createElement("a");
//       link.href = window.URL.createObjectURL(blob);
//       link.download = "Approvals_Export.csv";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       alert("Failed to export.");
//     }
//   };

//   const handleDownloadTemplate = () => {
//     const csvContent =
//       "Request Date,Requested By,Placed By,Account ID,Firm ID,Merchant ID,Bill Location ID,Ship Location ID,ASIN/FSN,Req Qty,Purchase Price,CN Amt,Expected Delivery Date\n2026-07-10,Ramesh,Suresh,ID_123,1,1,1,1,B0GVYFM7QZ,100,15000,500,2026-07-15\n";
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = "Approval_Upload_Template.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const filteredApprovals = approvals.filter((app) => {
//     let match = true;
//     if (searchTerm) {
//       const s = searchTerm.toLowerCase();
//       if (
//         !app.approval_no?.toLowerCase().includes(s) &&
//         !app.requested_by?.toLowerCase().includes(s)
//       )
//         match = false;
//     }
//     if (
//       filters.requested_by &&
//       !app.requested_by
//         ?.toLowerCase()
//         .includes(filters.requested_by.toLowerCase())
//     )
//       match = false;
//     if (
//       filters.authorized_by &&
//       !app.authorized_by
//         ?.toLowerCase()
//         .includes(filters.authorized_by.toLowerCase())
//     )
//       match = false;
//     if (filters.request_date && app.request_date !== filters.request_date)
//       match = false;
//     if (filters.firm && app.firm !== parseInt(filters.firm)) match = false;
//     if (filters.merchant && app.merchant !== parseInt(filters.merchant))
//       match = false;
//     return match;
//   });

//   const renderStatusBadge = (status) => {
//     if (status === "Approved")
//       return (
//         <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-medium rounded text-xs border border-emerald-100">
//           Approved
//         </span>
//       );
//     if (status === "Rejected")
//       return (
//         <span className="px-2.5 py-1 bg-rose-50 text-rose-600 font-medium rounded text-xs border border-rose-100">
//           Rejected
//         </span>
//       );
//     return (
//       <span className="px-2.5 py-1 bg-amber-50 text-amber-600 font-medium rounded text-xs border border-amber-100">
//         Pending
//       </span>
//     );
//   };

//   return (
//     <div className="bg-[#f8f9fa] min-h-screen font-sans pb-10 text-slate-700">
//       {/* HEADER */}
//       <div className="bg-white px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
//         <div>
//           <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
//             <svg
//               width="20"
//               height="20"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="#4f46e5"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M9 11l3 3L22 4"></path>
//               <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
//             </svg>
//             Approvals
//           </h1>
//           <p className="text-[13px] text-slate-500 mt-1 ml-7">
//             Review and action pending requests
//           </p>
//         </div>
//       </div>

//       {/* TOP ACTION BAR */}
//       <div className="mx-6 mt-6 mb-4 flex flex-wrap items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <div className="flex items-center bg-white px-3 py-2 rounded-md border border-gray-300 w-64 shadow-sm focus-within:border-indigo-400 transition-colors">
//             <IconSearch />
//             <input
//               type="text"
//               placeholder="Search orders..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="bg-transparent border-none outline-none ml-2 text-sm w-full text-slate-700 placeholder-slate-400"
//             />
//           </div>
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-sm transition-colors shadow-sm ${showFilters ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-gray-300 text-slate-600 hover:bg-slate-50"}`}
//           >
//             <IconFilter /> Filter
//           </button>
//           <button
//             onClick={handleColumnConfig}
//             className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-slate-600 rounded-md text-sm hover:bg-slate-50 transition shadow-sm"
//           >
//             <IconColumns /> View Headers
//           </button>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={handleDownloadTemplate}
//             className="px-4 py-2 bg-white border border-gray-300 text-slate-600 rounded-md text-sm hover:bg-slate-50 transition shadow-sm"
//           >
//             Template
//           </button>
//           <button
//             onClick={handleExportData}
//             className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-slate-600 rounded-md hover:bg-slate-50 transition shadow-sm"
//           >
//             <IconDownload />
//             <div className="flex flex-col text-left leading-none">
//               <span className="text-[10px] text-slate-500">Download</span>
//               <span className="text-sm font-medium">Excel</span>
//             </div>
//           </button>
//           <button
//             onClick={handleAddNew}
//             className="flex items-center gap-2 px-4 py-2 bg-[#eab308] hover:bg-[#ca8a04] text-[#1e293b] rounded-md transition shadow-sm border border-[#ca8a04]"
//           >
//             <IconPlus />
//             <div className="flex flex-col text-left leading-none">
//               <span className="text-[10px] opacity-80">New</span>
//               <span className="text-sm font-medium">Approval Request</span>
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* EXPANDABLE FILTER BAR */}
//       {showFilters && (
//         <div className="mx-6 mb-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
//             <div>
//               <label className="block text-xs text-slate-500 mb-1">Date</label>
//               <input
//                 type="date"
//                 name="request_date"
//                 value={filters.request_date}
//                 onChange={handleFilterChange}
//                 className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm outline-none focus:border-indigo-400"
//               />
//             </div>
//             <div>
//               <label className="block text-xs text-slate-500 mb-1">
//                 Requested By
//               </label>
//               <input
//                 type="text"
//                 name="requested_by"
//                 placeholder="Type name..."
//                 value={filters.requested_by}
//                 onChange={handleFilterChange}
//                 className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm outline-none focus:border-indigo-400"
//               />
//             </div>
//             <div>
//               <label className="block text-xs text-slate-500 mb-1">Firm</label>
//               <select
//                 name="firm"
//                 value={filters.firm}
//                 onChange={handleFilterChange}
//                 className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm outline-none focus:border-indigo-400"
//               >
//                 <option value="">All Firms</option>
//                 {dropdowns.firms.map((f) => (
//                   <option key={f.id} value={f.id}>
//                     {f.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-xs text-slate-500 mb-1">
//                 Platform
//               </label>
//               <select
//                 name="merchant"
//                 value={filters.merchant}
//                 onChange={handleFilterChange}
//                 className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm outline-none focus:border-indigo-400"
//               >
//                 <option value="">All Platforms</option>
//                 {dropdowns.merchants.map((m) => (
//                   <option key={m.id} value={m.id}>
//                     {m.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-xs text-slate-500 mb-1">
//                 Authorized By
//               </label>
//               <input
//                 type="text"
//                 name="authorized_by"
//                 placeholder="Admin name..."
//                 value={filters.authorized_by}
//                 onChange={handleFilterChange}
//                 className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm outline-none focus:border-indigo-400"
//               />
//             </div>
//             <div className="flex items-end">
//               <button
//                 onClick={() =>
//                   setFilters({
//                     requested_by: "",
//                     authorized_by: "",
//                     merchant: "",
//                     firm: "",
//                     location: "",
//                     request_date: "",
//                   })
//                 }
//                 className="w-full p-2 bg-slate-100 text-slate-600 text-sm rounded hover:bg-slate-200 transition"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DATA TABLE (Clean Fonts) */}
//       <div className="mx-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto custom-scrollbar">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 text-xs font-medium uppercase tracking-wide">
//               <tr>
//                 <th className="p-3 pl-6 font-medium whitespace-nowrap">
//                   App. No
//                 </th>
//                 <th className="p-3 font-medium whitespace-nowrap">Date</th>
//                 <th className="p-3 font-medium whitespace-nowrap">
//                   Requested By
//                 </th>
//                 <th className="p-3 font-medium whitespace-nowrap">Placed By</th>
//                 <th className="p-3 font-medium whitespace-nowrap">
//                   Firm & Platform
//                 </th>
//                 <th className="p-3 font-medium min-w-[250px]">ASIN & Model</th>
//                 <th className="p-3 font-medium whitespace-nowrap">Req Qty</th>
//                 <th className="p-3 font-medium whitespace-nowrap">
//                   Agreed NLC
//                 </th>
//                 <th className="p-3 font-medium whitespace-nowrap">Status</th>
//                 <th className="p-3 font-medium whitespace-nowrap">Auth By</th>
//                 <th className="p-3 text-center pr-6 font-medium">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 text-sm text-slate-700">
//               {filteredApprovals.length === 0 ? (
//                 <tr>
//                   <td colSpan="11" className="p-12 text-center text-slate-400">
//                     No requests found.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredApprovals.flatMap((app) =>
//                   (app.items && app.items.length > 0
//                     ? app.items
//                     : [{ id: "empty" }]
//                   ).map((item) => (
//                     <tr
//                       key={`${app.id}-${item.id}`}
//                       className="hover:bg-slate-50 transition-colors"
//                     >
//                       <td className="p-3 pl-6 font-medium text-indigo-600 whitespace-nowrap">
//                         {app.approval_no}
//                       </td>
//                       <td className="p-3 whitespace-nowrap">
//                         {app.request_date}
//                       </td>
//                       <td className="p-3 whitespace-nowrap">
//                         {app.requested_by}
//                       </td>
//                       <td className="p-3 text-slate-500 whitespace-nowrap">
//                         {app.placed_by || "-"}
//                       </td>
//                       <td className="p-3 whitespace-nowrap">
//                         <div className="text-slate-800">
//                           {app.firm_detail?.name || "-"}
//                         </div>
//                         <div className="text-xs text-slate-500">
//                           {app.merchant_detail?.name || "-"}
//                         </div>
//                       </td>
//                       <td className="p-3">
//                         {item.id !== "empty" ? (
//                           <>
//                             <div className="font-medium text-slate-800">
//                               {item.asin_fsn}
//                             </div>
//                             <div className="text-xs text-slate-500 whitespace-normal">
//                               {item.model_name}
//                             </div>
//                           </>
//                         ) : (
//                           "-"
//                         )}
//                       </td>
//                       <td className="p-3 whitespace-nowrap">
//                         {item.id !== "empty" ? item.req_qty : "-"}
//                       </td>
//                       <td className="p-3 font-medium text-emerald-600 whitespace-nowrap">
//                         {item.id !== "empty"
//                           ? `₹${formatIndianNumber(item.agreed_nlc)}`
//                           : "-"}
//                       </td>
//                       <td className="p-3 whitespace-nowrap">
//                         {renderStatusBadge(app.status)}
//                       </td>
//                       <td className="p-3 text-slate-500 whitespace-nowrap">
//                         {app.authorized_by || "-"}
//                       </td>

//                       <td className="p-3 text-center pr-6 whitespace-nowrap">
//                         <div className="flex items-center justify-center gap-2">
//                           <button
//                             onClick={() => handleView(app.id)}
//                             className="text-slate-400 hover:text-indigo-600 transition"
//                             title="View"
//                           >
//                             <svg
//                               width="18"
//                               height="18"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                             >
//                               <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
//                               <circle cx="12" cy="12" r="3"></circle>
//                             </svg>
//                           </button>
//                           <button
//                             onClick={() => handleEdit(app.id)}
//                             className="text-slate-400 hover:text-amber-500 transition"
//                             title="Edit"
//                           >
//                             <svg
//                               width="16"
//                               height="16"
//                               viewBox="0 0 24 24"
//                               fill="none"
//                               stroke="currentColor"
//                               strokeWidth="2"
//                             >
//                               <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
//                               <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
//                             </svg>
//                           </button>

//                           {role === "ADMIN" && (
//                             <>
//                               {app.status === "Pending" && (
//                                 <>
//                                   <button
//                                     onClick={() =>
//                                       handleAdminAction(app.id, "approve")
//                                     }
//                                     className="text-slate-400 hover:text-emerald-500 transition"
//                                     title="Approve"
//                                   >
//                                     <svg
//                                       width="18"
//                                       height="18"
//                                       viewBox="0 0 24 24"
//                                       fill="none"
//                                       stroke="currentColor"
//                                       strokeWidth="2"
//                                     >
//                                       <polyline points="20 6 9 17 4 12"></polyline>
//                                     </svg>
//                                   </button>
//                                   <button
//                                     onClick={() =>
//                                       handleAdminAction(app.id, "reject")
//                                     }
//                                     className="text-slate-400 hover:text-rose-500 transition"
//                                     title="Reject"
//                                   >
//                                     <svg
//                                       width="18"
//                                       height="18"
//                                       viewBox="0 0 24 24"
//                                       fill="none"
//                                       stroke="currentColor"
//                                       strokeWidth="2"
//                                     >
//                                       <line
//                                         x1="18"
//                                         y1="6"
//                                         x2="6"
//                                         y2="18"
//                                       ></line>
//                                       <line
//                                         x1="6"
//                                         y1="6"
//                                         x2="18"
//                                         y2="18"
//                                       ></line>
//                                     </svg>
//                                   </button>
//                                 </>
//                               )}
//                               <button
//                                 onClick={() => handleDelete(app.id)}
//                                 className="text-slate-400 hover:text-red-500 transition"
//                                 title="Delete"
//                               >
//                                 <svg
//                                   width="16"
//                                   height="16"
//                                   viewBox="0 0 24 24"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   strokeWidth="2"
//                                 >
//                                   <polyline points="3 6 5 6 21 6"></polyline>
//                                   <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
//                                 </svg>
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   )),
//                 )
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* MODAL WINDOW (Clean Fonts) */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl w-full max-w-5xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
//             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
//               <h3 className="text-lg font-medium text-slate-800">
//                 New Approval Request
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-600 transition"
//               >
//                 <svg
//                   width="20"
//                   height="20"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <line x1="18" y1="6" x2="6" y2="18"></line>
//                   <line x1="6" y1="6" x2="18" y2="18"></line>
//                 </svg>
//               </button>
//             </div>

//             <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/50">
//               <form
//                 id="approvalForm"
//                 onSubmit={handleSubmit}
//                 className="space-y-6"
//               >
//                 <div className="bg-white p-5 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-5">
//                   <div>
//                     <label className="block text-xs text-slate-500 mb-1">
//                       Request Date
//                     </label>
//                     <input
//                       type="date"
//                       required
//                       name="request_date"
//                       value={masterFormData.request_date}
//                       onChange={handleMasterChange}
//                       className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-slate-500 mb-1">
//                       Requested By *
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       name="requested_by"
//                       value={masterFormData.requested_by}
//                       onChange={handleMasterChange}
//                       className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
//                       placeholder="e.g. Kartik"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-slate-500 mb-1">
//                       Placed By
//                     </label>
//                     <input
//                       type="text"
//                       name="placed_by"
//                       value={masterFormData.placed_by}
//                       onChange={handleMasterChange}
//                       className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
//                       placeholder="e.g. Aman"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-xs text-slate-500 mb-1">
//                       Account ID
//                     </label>
//                     <input
//                       type="text"
//                       name="merchant_id"
//                       value={masterFormData.merchant_id}
//                       onChange={handleMasterChange}
//                       className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
//                       placeholder="e.g. ID_9011"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs text-slate-500 mb-1">
//                       Firm *
//                     </label>
//                     <select
//                       required
//                       name="firm"
//                       value={masterFormData.firm}
//                       onChange={handleMasterChange}
//                       className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 bg-white"
//                     >
//                       <option value="">-- Select --</option>
//                       {dropdowns.firms.map((f) => (
//                         <option key={f.id} value={f.id}>
//                           {f.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs text-slate-500 mb-1">
//                       Platform *
//                     </label>
//                     <select
//                       required
//                       name="merchant"
//                       value={masterFormData.merchant}
//                       onChange={handleMasterChange}
//                       className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 bg-white"
//                     >
//                       <option value="">-- Select --</option>
//                       {dropdowns.merchants.map((m) => (
//                         <option key={m.id} value={m.id}>
//                           {m.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-xs text-slate-500 mb-1">
//                       Bill Location *
//                     </label>
//                     <select
//                       required
//                       name="bill_location"
//                       value={masterFormData.bill_location}
//                       onChange={handleMasterChange}
//                       className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 bg-white"
//                     >
//                       <option value="">-- Select --</option>
//                       {dropdowns.locations.map((l) => (
//                         <option key={l.id} value={l.id}>
//                           {l.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="col-span-1 md:col-span-2">
//                     <label className="block text-xs text-slate-500 mb-1">
//                       Ship Location *
//                     </label>
//                     <select
//                       required
//                       name="ship_location"
//                       value={masterFormData.ship_location}
//                       onChange={handleMasterChange}
//                       className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 bg-white"
//                     >
//                       <option value="">-- Select --</option>
//                       {dropdowns.locations.map((l) => (
//                         <option key={l.id} value={l.id}>
//                           {l.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <h4 className="text-sm font-medium text-slate-800">
//                       Items
//                     </h4>
//                     <button
//                       type="button"
//                       onClick={addItemRow}
//                       className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-slate-600 rounded text-xs hover:bg-gray-50 transition"
//                     >
//                       <IconPlus /> Add Row
//                     </button>
//                   </div>

//                   {itemsList.map((item, index) => {
//                     const pPriceNum = parseIndianNumber(
//                       item.purchase_price_raw,
//                     );
//                     const cnAmtNum = parseIndianNumber(item.cn_amt_raw);
//                     const agreedNLC = pPriceNum - cnAmtNum;

//                     return (
//                       <div
//                         key={item.id}
//                         className="bg-white p-5 rounded-lg border border-gray-200 relative"
//                       >
//                         <button
//                           type="button"
//                           onClick={() => removeItemRow(item.id)}
//                           className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition"
//                         >
//                           <svg
//                             width="14"
//                             height="14"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                           >
//                             <polyline points="3 6 5 6 21 6"></polyline>
//                             <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
//                           </svg>
//                         </button>

//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-6">
//                           <div className="col-span-1 md:col-span-2">
//                             <label className="block text-xs text-slate-500 mb-1">
//                               ASIN / FSN *
//                             </label>
//                             <select
//                               required
//                               name="product_model"
//                               value={item.product_model}
//                               onChange={(e) =>
//                                 handleItemChange(
//                                   item.id,
//                                   e.target.name,
//                                   e.target.value,
//                                 )
//                               }
//                               className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 bg-white"
//                             >
//                               <option value="">-- Search & Select --</option>
//                               {dropdowns.models.map((m) => (
//                                 <option key={m.id} value={m.id}>
//                                   {m.asin_fsn} — {m.model_name}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>
//                           <div>
//                             <label className="block text-xs text-slate-500 mb-1">
//                               Model Name
//                             </label>
//                             <input
//                               type="text"
//                               readOnly
//                               value={item.model_name_log}
//                               className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm text-slate-500"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs text-slate-500 mb-1">
//                               Model No
//                             </label>
//                             <input
//                               type="text"
//                               readOnly
//                               value={item.model_no_log}
//                               className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm text-slate-500"
//                             />
//                           </div>

//                           <div>
//                             <label className="block text-xs text-slate-500 mb-1">
//                               Req Qty *
//                             </label>
//                             <input
//                               type="number"
//                               min="1"
//                               required
//                               name="req_qty"
//                               value={item.req_qty}
//                               onChange={(e) =>
//                                 handleItemChange(
//                                   item.id,
//                                   e.target.name,
//                                   e.target.value,
//                                 )
//                               }
//                               className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs text-slate-500 mb-1">
//                               Purchase Price *
//                             </label>
//                             <input
//                               type="text"
//                               required
//                               name="purchase_price_raw"
//                               value={item.purchase_price_raw}
//                               onChange={(e) =>
//                                 handleItemChange(
//                                   item.id,
//                                   e.target.name,
//                                   e.target.value.replace(/[^0-9.]/g, ""),
//                                 )
//                               }
//                               className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs text-slate-500 mb-1">
//                               CN Amt
//                             </label>
//                             <input
//                               type="text"
//                               name="cn_amt_raw"
//                               value={item.cn_amt_raw}
//                               onChange={(e) =>
//                                 handleItemChange(
//                                   item.id,
//                                   e.target.name,
//                                   e.target.value.replace(/[^0-9.]/g, ""),
//                                 )
//                               }
//                               className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs text-slate-500 mb-1">
//                               Agreed NLC
//                             </label>
//                             <div className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm text-slate-600">
//                               ₹ {formatIndianNumber(agreedNLC)}
//                             </div>
//                           </div>

//                           <div className="col-span-1 md:col-span-2">
//                             <label className="block text-xs text-slate-500 mb-1">
//                               Link Used
//                             </label>
//                             <select
//                               name="link_used"
//                               value={item.link_used}
//                               onChange={(e) =>
//                                 handleItemChange(
//                                   item.id,
//                                   e.target.name,
//                                   e.target.value,
//                                 )
//                               }
//                               className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 bg-white"
//                             >
//                               <option value="Yes">Yes</option>
//                               <option value="No">No</option>
//                             </select>
//                           </div>
//                           <div className="col-span-1 md:col-span-2">
//                             <label className="block text-xs text-slate-500 mb-1">
//                               Expected Delivery *
//                             </label>
//                             <input
//                               type="date"
//                               required
//                               name="expected_delivery_date"
//                               value={item.expected_delivery_date}
//                               onChange={(e) =>
//                                 handleItemChange(
//                                   item.id,
//                                   e.target.name,
//                                   e.target.value,
//                                 )
//                               }
//                               className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </form>
//             </div>

//             <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-slate-50">
//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-5 py-2 bg-white border border-gray-300 text-slate-600 rounded text-sm hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="approvalForm"
//                 disabled={loading}
//                 className="px-5 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition disabled:opacity-50"
//               >
//                 {loading ? "Submitting..." : "Submit"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const formatIndianNumber = (num) => {
  if (!num || isNaN(num)) return "0.00";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

const parseIndianNumber = (str) => {
  if (!str) return 0;
  return parseFloat(str.toString().replace(/,/g, "")) || 0;
};

// 🔥 REUSABLE ICONS 🔥
export const IconDownload = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);
export const IconColumns = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="18" rx="1"></rect>
    <rect x="14" y="3" width="7" height="18" rx="1"></rect>
  </svg>
);
export const IconPlus = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
export const IconSearch = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#94a3b8"
    strokeWidth="2"
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
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

export default function ApprovalManager() {
  const navigate = useNavigate();
  const role = localStorage.getItem("user_role") || "USER";

  const [approvals, setApprovals] = useState([]);
  const [dropdowns, setDropdowns] = useState({
    firms: [],
    locations: [],
    merchants: [],
    models: [],
  });
  const [loading, setLoading] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    requested_by: "",
    authorized_by: "",
    merchant: "",
    firm: "",
    location: "",
    request_date: "",
  });

  // Modals States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  // Data States
  const [viewData, setViewData] = useState(null);
  const [editModeId, setEditModeId] = useState(null);

  // Column Visibility State
  const [cols, setCols] = useState({
    appNo: true,
    date: true,
    requestedBy: true,
    placedBy: true,
    firm: true,
    asin: true,
    qty: true,
    nlc: true,
    status: true,
    authBy: true,
    actions: true,
  });

  const initialMasterState = {
    request_date: new Date().toISOString().split("T")[0],
    requested_by: "",
    placed_by: "",
    merchant_id: "",
    firm: "",
    bill_location: "",
    ship_location: "",
    merchant: "",
  };
  const [masterFormData, setMasterFormData] = useState(initialMasterState);

  const initialItemState = {
    product_model: "",
    model_name_log: "",
    model_no_log: "",
    req_qty: "",
    purchase_price_raw: "",
    cn_amt_raw: "0",
    link_used: "No",
    expected_delivery_date: new Date(
      new Date().setDate(new Date().getDate() + 1),
    )
      .toISOString()
      .split("T")[0],
  };
  const [itemsList, setItemsList] = useState([
    { ...initialItemState, id: Date.now() },
  ]);

  useEffect(() => {
    fetchApprovals();
    fetchDropdowns();
  }, []);

  const fetchApprovals = async () => {
    try {
      const response = await api.get("reports/approvals/");
      setApprovals(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchDropdowns = async () => {
    try {
      const response = await api.get("reports/approvals/dropdown_data/");
      setDropdowns(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMasterChange = (e) =>
    setMasterFormData({ ...masterFormData, [e.target.name]: e.target.value });
  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleItemChange = (id, field, value) => {
    const updatedItems = itemsList.map((item) => {
      if (item.id === id) {
        let updatedItem = { ...item, [field]: value };
        if (field === "product_model") {
          const selectedModel = dropdowns.models.find(
            (m) => String(m.id) === String(value),
          );
          if (selectedModel) {
            updatedItem.model_name_log = selectedModel.model_name;
            updatedItem.model_no_log = selectedModel.model || "-";
          } else {
            updatedItem.model_name_log = "";
            updatedItem.model_no_log = "";
          }
        }
        return updatedItem;
      }
      return item;
    });
    setItemsList(updatedItems);
  };

  const addItemRow = () =>
    setItemsList([...itemsList, { ...initialItemState, id: Date.now() }]);
  const removeItemRow = (id) => {
    if (itemsList.length > 1)
      setItemsList(itemsList.filter((item) => item.id !== id));
  };

  const handleAddNew = () => {
    setEditModeId(null);
    setMasterFormData(initialMasterState);
    setItemsList([{ ...initialItemState, id: Date.now() }]);
    setIsFormModalOpen(true);
  };

  // 🔥 EDIT FUNCTIONALITY 🔥
  const handleEdit = (appId) => {
    const appData = approvals.find((a) => a.id === appId);
    if (!appData) return;

    setEditModeId(appId);
    setMasterFormData({
      request_date: appData.request_date || "",
      requested_by: appData.requested_by || "",
      placed_by: appData.placed_by || "",
      merchant_id: appData.merchant_account_id || "",
      firm: appData.firm || "",
      bill_location: appData.bill_location || "",
      ship_location: appData.ship_location || "",
      merchant: appData.merchant || "",
    });

    if (appData.items && appData.items.length > 0) {
      const loadedItems = appData.items.map((item) => {
        // Need to find the dropdown ID based on ASIN
        const matchedModel = dropdowns.models.find(
          (m) => m.asin_fsn === item.asin_fsn,
        );
        return {
          id: item.id || Date.now() + Math.random(),
          product_model: matchedModel ? matchedModel.id : "",
          model_name_log: item.model_name || "",
          model_no_log: item.model_no || "",
          req_qty: item.req_qty || "",
          purchase_price_raw: item.purchase_price || "",
          cn_amt_raw: item.cn_amt || "0",
          link_used: item.link_used || "No",
          expected_delivery_date: item.expected_delivery_date || "",
        };
      });
      setItemsList(loadedItems);
    } else {
      setItemsList([{ ...initialItemState, id: Date.now() }]);
    }
    setIsFormModalOpen(true);
  };

  // 🔥 SUBMIT CREATE / UPDATE 🔥
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !masterFormData.firm ||
      !masterFormData.merchant ||
      !masterFormData.bill_location ||
      !masterFormData.requested_by
    ) {
      return alert(
        "Please fill all required Master fields including Requested By!",
      );
    }

    try {
      const cleanItems = itemsList.map((item, index) => {
        if (!item.product_model)
          throw new Error(`Item #${index + 1}: Please select an ASIN.`);
        const selectedModel = dropdowns.models.find(
          (m) => String(m.id) === String(item.product_model),
        );
        const pPrice = parseIndianNumber(item.purchase_price_raw);
        const cnAmt = parseIndianNumber(item.cn_amt_raw);
        return {
          asin_fsn: selectedModel ? selectedModel.asin_fsn : "",
          model_name: item.model_name_log || "Unknown",
          model_no: item.model_no_log || "-",
          req_qty: parseInt(item.req_qty) || 0,
          purchase_price: pPrice,
          cn_amt: cnAmt,
          agreed_nlc: pPrice - cnAmt,
          link_used: item.link_used || "No",
          expected_delivery_date: item.expected_delivery_date,
        };
      });

      const payload = {
        ...masterFormData,
        firm: parseInt(masterFormData.firm),
        merchant: parseInt(masterFormData.merchant),
        bill_location: parseInt(masterFormData.bill_location),
        ship_location: parseInt(masterFormData.ship_location),
        merchant_account_id: masterFormData.merchant_id || "N/A",
        items: cleanItems,
      };

      setLoading(true);
      if (editModeId) {
        await api.put(`reports/approvals/${editModeId}/`, payload);
        alert("Request Updated Successfully!");
      } else {
        await api.post("reports/approvals/", payload);
        alert("Request Generated Successfully!");
      }
      setIsFormModalOpen(false);
      fetchApprovals();
    } catch (error) {
      alert("Error: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAction = async (id, actionType) => {
    if (!window.confirm(`Confirm ${actionType}?`)) return;
    try {
      await api.post(`reports/approvals/${id}/${actionType}/`);
      fetchApprovals();
    } catch (error) {
      alert("Failed: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`DELETE this request completely?`)) return;
    try {
      await api.delete(`reports/approvals/${id}/`);
      fetchApprovals();
    } catch (error) {
      alert("Failed: " + error.message);
    }
  };

  const handleView = (id) => {
    const data = approvals.find((a) => a.id === id);
    setViewData(data);
    setIsViewModalOpen(true);
  };

  // 🔥 INSTANT EXCEL EXPORT (Frontend based on filters) 🔥
  const handleExportData = () => {
    if (filteredApprovals.length === 0) return alert("No data to export!");
    let csvContent =
      "Approval No,Date,Requested By,Placed By,Firm,Platform,Status,Authorized By,ASIN/FSN,Model Name,Req Qty,Purchase Price,CN Amt,Agreed NLC,Expected Delivery\n";

    filteredApprovals.forEach((app) => {
      if (app.items && app.items.length > 0) {
        app.items.forEach((item) => {
          csvContent += `"${app.approval_no}","${app.request_date}","${app.requested_by}","${app.placed_by || "-"}","${app.firm_detail?.name || "-"}","${app.merchant_detail?.name || "-"}","${app.status}","${app.authorized_by || "-"}","${item.asin_fsn}","${item.model_name.replace(/"/g, '""')}","${item.req_qty}","${item.purchase_price}","${item.cn_amt}","${item.agreed_nlc}","${item.expected_delivery_date}"\n`;
        });
      } else {
        csvContent += `"${app.approval_no}","${app.request_date}","${app.requested_by}","${app.placed_by || "-"}","${app.firm_detail?.name || "-"}","${app.merchant_detail?.name || "-"}","${app.status}","${app.authorized_by || "-"}",,,,,,\n`;
      }
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `Filtered_Approvals_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "Request Date,Requested By,Placed By,Account ID,Firm ID,Merchant ID,Bill Location ID,Ship Location ID,ASIN/FSN,Req Qty,Purchase Price,CN Amt,Expected Delivery Date\n2026-07-10,Ramesh,Suresh,ID_123,1,1,1,1,B0GVYFM7QZ,100,15000,500,2026-07-15\n";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Approval_Upload_Template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🔥 ADVANCED FILTER LOGIC 🔥
  const filteredApprovals = approvals.filter((app) => {
    let match = true;
    if (searchTerm) {
      const s = searchTerm.toLowerCase().trim();
      if (
        !app.approval_no?.toLowerCase().includes(s) &&
        !app.requested_by?.toLowerCase().includes(s)
      )
        match = false;
    }
    // Partial flexible match for names
    if (
      filters.requested_by &&
      !app.requested_by
        ?.toLowerCase()
        .includes(filters.requested_by.toLowerCase().trim())
    )
      match = false;
    if (
      filters.authorized_by &&
      !app.authorized_by
        ?.toLowerCase()
        .includes(filters.authorized_by.toLowerCase().trim())
    )
      match = false;
    if (filters.request_date && app.request_date !== filters.request_date)
      match = false;
    if (filters.firm && app.firm !== parseInt(filters.firm)) match = false;
    if (filters.merchant && app.merchant !== parseInt(filters.merchant))
      match = false;
    return match;
  });

  const renderStatusBadge = (status) => {
    if (status === "Approved")
      return (
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-medium rounded text-xs border border-emerald-100">
          Approved
        </span>
      );
    if (status === "Rejected")
      return (
        <span className="px-2.5 py-1 bg-rose-50 text-rose-600 font-medium rounded text-xs border border-rose-100">
          Rejected
        </span>
      );
    return (
      <span className="px-2.5 py-1 bg-amber-50 text-amber-600 font-medium rounded text-xs border border-amber-100">
        Pending
      </span>
    );
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-10 text-slate-700">
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            Approvals
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 ml-7">
            Review and action pending requests
          </p>
        </div>
      </div>

      <div className="mx-6 mt-6 mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white px-3 py-2 rounded-md border border-gray-300 w-64 shadow-sm focus-within:border-indigo-400 transition-colors">
            <IconSearch />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none ml-2 text-sm w-full text-slate-700 placeholder-slate-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md border text-sm transition-colors shadow-sm ${showFilters ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-gray-300 text-slate-600 hover:bg-slate-50"}`}
          >
            <IconFilter /> Filter
          </button>
          <button
            onClick={() => setIsColumnModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-slate-600 rounded-md text-sm hover:bg-slate-50 transition shadow-sm"
          >
            <IconColumns /> View Headers
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadTemplate}
            className="px-4 py-2 bg-white border border-gray-300 text-slate-600 rounded-md text-sm hover:bg-slate-50 transition shadow-sm"
          >
            Template
          </button>
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-slate-600 rounded-md hover:bg-slate-50 transition shadow-sm"
          >
            <IconDownload />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[10px] text-slate-500">Download</span>
              <span className="text-sm font-medium">Excel</span>
            </div>
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-[#eab308] hover:bg-[#ca8a04] text-[#1e293b] rounded-md transition shadow-sm border border-[#ca8a04]"
          >
            <IconPlus />
            <div className="flex flex-col text-left leading-none">
              <span className="text-[10px] opacity-80">New</span>
              <span className="text-sm font-medium">Approval Request</span>
            </div>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mx-6 mb-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Date</label>
              <input
                type="date"
                name="request_date"
                value={filters.request_date}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Requested By
              </label>
              <input
                type="text"
                name="requested_by"
                placeholder="Type name..."
                value={filters.requested_by}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Firm</label>
              <select
                name="firm"
                value={filters.firm}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm outline-none focus:border-indigo-400"
              >
                <option value="">All Firms</option>
                {dropdowns.firms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Platform
              </label>
              <select
                name="merchant"
                value={filters.merchant}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm outline-none focus:border-indigo-400"
              >
                <option value="">All Platforms</option>
                {dropdowns.merchants.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Authorized By
              </label>
              <input
                type="text"
                name="authorized_by"
                placeholder="Admin name..."
                value={filters.authorized_by}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm outline-none focus:border-indigo-400"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() =>
                  setFilters({
                    requested_by: "",
                    authorized_by: "",
                    merchant: "",
                    firm: "",
                    location: "",
                    request_date: "",
                  })
                }
                className="w-full p-2 bg-slate-100 text-slate-600 text-sm rounded hover:bg-slate-200 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 DATA TABLE WITH DYNAMIC COLUMNS 🚀 */}
      <div className="mx-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 text-xs font-medium uppercase tracking-wide">
              <tr>
                {cols.appNo && (
                  <th className="p-3 pl-6 whitespace-nowrap">App. No</th>
                )}
                {cols.date && <th className="p-3 whitespace-nowrap">Date</th>}
                {cols.requestedBy && (
                  <th className="p-3 whitespace-nowrap">Requested By</th>
                )}
                {cols.placedBy && (
                  <th className="p-3 whitespace-nowrap">Placed By</th>
                )}
                {cols.firm && (
                  <th className="p-3 whitespace-nowrap">Firm & Platform</th>
                )}
                {cols.asin && (
                  <th className="p-3 min-w-[250px]">ASIN & Model</th>
                )}
                {cols.qty && <th className="p-3 whitespace-nowrap">Req Qty</th>}
                {cols.nlc && (
                  <th className="p-3 whitespace-nowrap">Agreed NLC</th>
                )}
                {cols.status && (
                  <th className="p-3 whitespace-nowrap">Status</th>
                )}
                {cols.authBy && (
                  <th className="p-3 whitespace-nowrap">Auth By</th>
                )}
                {cols.actions && (
                  <th className="p-3 text-center pr-6">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-slate-700">
              {filteredApprovals.length === 0 ? (
                <tr>
                  <td colSpan="11" className="p-12 text-center text-slate-400">
                    No requests found.
                  </td>
                </tr>
              ) : (
                filteredApprovals.flatMap((app) =>
                  (app.items && app.items.length > 0
                    ? app.items
                    : [{ id: "empty" }]
                  ).map((item) => (
                    <tr
                      key={`${app.id}-${item.id}`}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {cols.appNo && (
                        <td className="p-3 pl-6 font-medium text-indigo-600 whitespace-nowrap">
                          {app.approval_no}
                        </td>
                      )}
                      {cols.date && (
                        <td className="p-3 whitespace-nowrap">
                          {app.request_date}
                        </td>
                      )}
                      {cols.requestedBy && (
                        <td className="p-3 whitespace-nowrap">
                          {app.requested_by}
                        </td>
                      )}
                      {cols.placedBy && (
                        <td className="p-3 text-slate-500 whitespace-nowrap">
                          {app.placed_by || "-"}
                        </td>
                      )}
                      {cols.firm && (
                        <td className="p-3 whitespace-nowrap">
                          <div className="text-slate-800">
                            {app.firm_detail?.name || "-"}
                          </div>
                          <div className="text-xs text-slate-500">
                            {app.merchant_detail?.name || "-"}
                          </div>
                        </td>
                      )}
                      {cols.asin && (
                        <td className="p-3">
                          {item.id !== "empty" ? (
                            <>
                              <div className="font-medium text-slate-800">
                                {item.asin_fsn}
                              </div>
                              <div className="text-xs text-slate-500 whitespace-normal">
                                {item.model_name}
                              </div>
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                      )}
                      {cols.qty && (
                        <td className="p-3 whitespace-nowrap">
                          {item.id !== "empty" ? item.req_qty : "-"}
                        </td>
                      )}
                      {cols.nlc && (
                        <td className="p-3 font-medium text-emerald-600 whitespace-nowrap">
                          {item.id !== "empty"
                            ? `₹${formatIndianNumber(item.agreed_nlc)}`
                            : "-"}
                        </td>
                      )}
                      {cols.status && (
                        <td className="p-3 whitespace-nowrap">
                          {renderStatusBadge(app.status)}
                        </td>
                      )}
                      {cols.authBy && (
                        <td className="p-3 text-slate-500 whitespace-nowrap">
                          {app.authorized_by || "-"}
                        </td>
                      )}

                      {cols.actions && (
                        <td className="p-3 text-center pr-6 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleView(app.id)}
                              className="text-slate-400 hover:text-indigo-600 transition"
                              title="View"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>

                            {/* ANYONE can edit IF it's their request OR if Admin. Adjust logic if needed */}
                            {(role === "ADMIN" ||
                              currentLoggedUser === app.requested_by) && (
                              <button
                                onClick={() => handleEdit(app.id)}
                                className="text-slate-400 hover:text-amber-500 transition"
                                title="Edit"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>
                            )}

                            {role === "ADMIN" && (
                              <>
                                {app.status === "Pending" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleAdminAction(app.id, "approve")
                                      }
                                      className="text-slate-400 hover:text-emerald-500 transition"
                                      title="Approve"
                                    >
                                      <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleAdminAction(app.id, "reject")
                                      }
                                      className="text-slate-400 hover:text-rose-500 transition"
                                      title="Reject"
                                    >
                                      <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <line
                                          x1="18"
                                          y1="6"
                                          x2="6"
                                          y2="18"
                                        ></line>
                                        <line
                                          x1="6"
                                          y1="6"
                                          x2="18"
                                          y2="18"
                                        ></line>
                                      </svg>
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleDelete(app.id)}
                                  className="text-slate-400 hover:text-red-500 transition"
                                  title="Delete"
                                >
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  )),
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔥 VIEW MODAL (ALL 27 FIELDS) 🔥 */}
      {isViewModalOpen && viewData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-6xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-800">
                Approval File: {viewData.approval_no}
              </h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto bg-white">
              {/* Master Summary Grid */}
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b pb-2">
                Master Details
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">
                    Request Date
                  </p>
                  <p className="font-medium text-sm text-slate-800">
                    {viewData.request_date || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">
                    Requested By
                  </p>
                  <p className="font-medium text-sm text-slate-800">
                    {viewData.requested_by || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">
                    Placed By
                  </p>
                  <p className="font-medium text-sm text-slate-800">
                    {viewData.placed_by || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">Status</p>
                  <p className="font-medium text-sm text-slate-800">
                    {renderStatusBadge(viewData.status)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">Firm</p>
                  <p className="font-medium text-sm text-slate-800">
                    {viewData.firm_detail?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">
                    Platform
                  </p>
                  <p className="font-medium text-sm text-slate-800">
                    {viewData.merchant_detail?.name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">
                    Account ID
                  </p>
                  <p className="font-medium text-sm text-slate-800">
                    {viewData.merchant_account_id || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">
                    Authorized By
                  </p>
                  <p className="font-medium text-sm text-slate-800">
                    {viewData.authorized_by || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase">
                    Bill Location
                  </p>
                  <p className="font-medium text-sm text-slate-800">
                    {viewData.bill_location_detail?.name || "-"}
                  </p>
                </div>
                <div className="col-span-3">
                  <p className="text-[10px] text-slate-500 uppercase">
                    Ship Location
                  </p>
                  <p className="font-medium text-sm text-slate-800">
                    {viewData.ship_location_detail?.name || "-"}
                  </p>
                </div>
              </div>

              {/* Items Grid (All Hidden Fields Visible here) */}
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b pb-2">
                Item Models Detailed
              </h4>
              <div className="space-y-4">
                {viewData.items &&
                  viewData.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-4 gap-x-2"
                    >
                      <div className="col-span-2 lg:col-span-5 mb-2">
                        <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          ITEM #{idx + 1}
                        </span>
                      </div>

                      <div className="col-span-2">
                        <p className="text-[10px] text-slate-500 uppercase">
                          ASIN / FSN
                        </p>
                        <p className="font-medium text-sm text-slate-800">
                          {item.asin_fsn || "-"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] text-slate-500 uppercase">
                          Model Name
                        </p>
                        <p
                          className="font-medium text-sm text-slate-800 truncate"
                          title={item.model_name}
                        >
                          {item.model_name || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">
                          Model No
                        </p>
                        <p className="font-medium text-sm text-slate-800">
                          {item.model_no || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">
                          Req Qty
                        </p>
                        <p className="font-medium text-sm text-slate-800">
                          {item.req_qty || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">
                          Pur. Price
                        </p>
                        <p className="font-medium text-sm text-emerald-600">
                          ₹{formatIndianNumber(item.purchase_price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">
                          CN Amt
                        </p>
                        <p className="font-medium text-sm text-rose-500">
                          ₹{formatIndianNumber(item.cn_amt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">
                          Agreed NLC
                        </p>
                        <p className="font-medium text-sm text-indigo-600">
                          ₹{formatIndianNumber(item.agreed_nlc)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">
                          Exp. Delivery
                        </p>
                        <p className="font-medium text-sm text-slate-800">
                          {item.expected_delivery_date || "-"}
                        </p>
                      </div>

                      {/* The 8 Hidden Fields from Model */}
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">
                          Placed Qty
                        </p>
                        <p className="font-medium text-xs text-slate-600">
                          {item.placed_qty ?? "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">
                          Order NLC
                        </p>
                        <p className="font-medium text-xs text-slate-600">
                          ₹
                          {item.order_nlc
                            ? formatIndianNumber(item.order_nlc)
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">
                          Tot Placed Amt
                        </p>
                        <p className="font-medium text-xs text-slate-600">
                          ₹
                          {item.total_placed_amt
                            ? formatIndianNumber(item.total_placed_amt)
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">
                          Tot CN Amt
                        </p>
                        <p className="font-medium text-xs text-slate-600">
                          ₹
                          {item.total_cn_amt
                            ? formatIndianNumber(item.total_cn_amt)
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">
                          Variance Qty
                        </p>
                        <p className="font-medium text-xs text-slate-600">
                          {item.variance_qty ?? "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">
                          Item Placed By
                        </p>
                        <p className="font-medium text-xs text-slate-600">
                          {item.placed_by || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase">
                          Pay Method
                        </p>
                        <p className="font-medium text-xs text-slate-600">
                          {item.payment_method || "-"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] text-slate-400 uppercase">
                          SAP PO No
                        </p>
                        <p className="font-medium text-xs text-slate-600">
                          {item.sap_po_no || "-"}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 COLUMN CONFIG MODAL 🔥 */}
      {isColumnModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-800">
                Customize Table Columns
              </h3>
              <button
                onClick={() => setIsColumnModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {Object.keys(cols).map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={cols[key]}
                    onChange={() => setCols({ ...cols, [key]: !cols[key] })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  />
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
              ))}
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 text-right">
              <button
                onClick={() => setIsColumnModalOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 CREATE / EDIT FORM MODAL 🔥 */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-800">
                {editModeId ? `Edit Approval Request` : "New Approval Request"}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/50">
              <form
                id="approvalForm"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="bg-white p-5 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Request Date
                    </label>
                    <input
                      type="date"
                      required
                      name="request_date"
                      value={masterFormData.request_date}
                      onChange={handleMasterChange}
                      className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Requested By *
                    </label>
                    <input
                      type="text"
                      required
                      name="requested_by"
                      value={masterFormData.requested_by}
                      onChange={handleMasterChange}
                      className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
                      placeholder="e.g. Kartik"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Placed By
                    </label>
                    <input
                      type="text"
                      name="placed_by"
                      value={masterFormData.placed_by}
                      onChange={handleMasterChange}
                      className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
                      placeholder="e.g. Aman"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Account ID
                    </label>
                    <input
                      type="text"
                      name="merchant_id"
                      value={masterFormData.merchant_id}
                      onChange={handleMasterChange}
                      className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
                      placeholder="e.g. ID_9011"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Firm *
                    </label>
                    <select
                      required
                      name="firm"
                      value={masterFormData.firm}
                      onChange={handleMasterChange}
                      className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 bg-white"
                    >
                      <option value="">-- Select --</option>
                      {dropdowns.firms.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Platform *
                    </label>
                    <select
                      required
                      name="merchant"
                      value={masterFormData.merchant}
                      onChange={handleMasterChange}
                      className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 bg-white"
                    >
                      <option value="">-- Select --</option>
                      {dropdowns.merchants.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Bill Location *
                    </label>
                    <select
                      required
                      name="bill_location"
                      value={masterFormData.bill_location}
                      onChange={handleMasterChange}
                      className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 bg-white"
                    >
                      <option value="">-- Select --</option>
                      {dropdowns.locations.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs text-slate-500 mb-1">
                      Ship Location *
                    </label>
                    <select
                      required
                      name="ship_location"
                      value={masterFormData.ship_location}
                      onChange={handleMasterChange}
                      className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 bg-white"
                    >
                      <option value="">-- Select --</option>
                      {dropdowns.locations.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-slate-800">
                      Items
                    </h4>
                    <button
                      type="button"
                      onClick={addItemRow}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-slate-600 rounded text-xs hover:bg-gray-50 transition"
                    >
                      <IconPlus /> Add Row
                    </button>
                  </div>

                  {itemsList.map((item, index) => {
                    const pPriceNum = parseIndianNumber(
                      item.purchase_price_raw,
                    );
                    const cnAmtNum = parseIndianNumber(item.cn_amt_raw);
                    const agreedNLC = pPriceNum - cnAmtNum;

                    return (
                      <div
                        key={item.id}
                        className="bg-white p-5 rounded-lg border border-gray-200 relative"
                      >
                        <button
                          type="button"
                          onClick={() => removeItemRow(item.id)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pr-6">
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs text-slate-500 mb-1">
                              ASIN / FSN *
                            </label>
                            <select
                              required
                              name="product_model"
                              value={item.product_model}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  e.target.name,
                                  e.target.value,
                                )
                              }
                              className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 bg-white"
                            >
                              <option value="">-- Search & Select --</option>
                              {dropdowns.models.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.asin_fsn} — {m.model_name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">
                              Model Name
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={item.model_name_log}
                              className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm text-slate-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">
                              Model No
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={item.model_no_log}
                              className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm text-slate-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs text-slate-500 mb-1">
                              Req Qty *
                            </label>
                            <input
                              type="number"
                              min="1"
                              required
                              name="req_qty"
                              value={item.req_qty}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  e.target.name,
                                  e.target.value,
                                )
                              }
                              className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">
                              Purchase Price *
                            </label>
                            <input
                              type="text"
                              required
                              name="purchase_price_raw"
                              value={item.purchase_price_raw}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  e.target.name,
                                  e.target.value.replace(/[^0-9.]/g, ""),
                                )
                              }
                              className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">
                              CN Amt
                            </label>
                            <input
                              type="text"
                              name="cn_amt_raw"
                              value={item.cn_amt_raw}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  e.target.name,
                                  e.target.value.replace(/[^0-9.]/g, ""),
                                )
                              }
                              className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-500 mb-1">
                              Agreed NLC
                            </label>
                            <div className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm text-slate-600">
                              ₹ {formatIndianNumber(agreedNLC)}
                            </div>
                          </div>

                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs text-slate-500 mb-1">
                              Link Used
                            </label>
                            <select
                              name="link_used"
                              value={item.link_used}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  e.target.name,
                                  e.target.value,
                                )
                              }
                              className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 bg-white"
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-xs text-slate-500 mb-1">
                              Expected Delivery *
                            </label>
                            <input
                              type="date"
                              required
                              name="expected_delivery_date"
                              value={item.expected_delivery_date}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  e.target.name,
                                  e.target.value,
                                )
                              }
                              className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="px-5 py-2 bg-white border border-gray-300 text-slate-600 rounded text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="approvalForm"
                disabled={loading}
                className="px-5 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading
                  ? "Submitting..."
                  : editModeId
                    ? "Update Request"
                    : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}