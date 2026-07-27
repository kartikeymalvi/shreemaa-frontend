// import React, { useState, useEffect } from "react";
// import api from "../api/axios"; // Path check kar lijiyega
// import Swal from "sweetalert2";

// // --- ERP STANDARD ICONS ---
// const IconSearch = () => (
//   <svg
//     width="15"
//     height="15"
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
// const IconFilter = () => (
//   <svg
//     width="15"
//     height="15"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="#64748b"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
//   </svg>
// );
// const IconDoc = () => (
//   <svg
//     width="17"
//     height="17"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="#64748b"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
//     <polyline points="14 2 14 8 20 8"></polyline>
//   </svg>
// );
// const IconUpload = () => (
//   <svg
//     width="17"
//     height="17"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="#64748b"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//     <polyline points="17 8 12 3 7 8"></polyline>
//     <line x1="12" y1="3" x2="12" y2="15"></line>
//   </svg>
// );
// const IconDownload = () => (
//   <svg
//     width="17"
//     height="17"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="#64748b"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//     <polyline points="7 10 12 15 17 10"></polyline>
//     <line x1="12" y1="15" x2="12" y2="3"></line>
//   </svg>
// );

// export default function PurchaseInwardManager() {
//   // --- STATES ---
//   const [inwardData, setInwardData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);

//   // Poora Form State jisme saari fields hain
//   const initialState = {
//     grpo_no: "",
//     firm_name: "",
//     vendor_name: "",
//     item_code: "",
//     expected_qty: "",
//     received_qty: "",
//     shortage_qty: "",
//     received_by: "",
//     warehouse_location: "",
//     remarks: "",
//   };
//   const [formData, setFormData] = useState(initialState);

//   // --- LIFECYCLE ---
//   useEffect(() => {
//     fetchInwards();
//   }, []);

//   // --- API CALLS ---
//   const fetchInwards = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("reports/purchase-inward/");
//       setInwardData(res.data);
//     } catch (e) {
//       console.error("Error fetching inwards:", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAutoFetchGRPO = async () => {
//     if (!formData.grpo_no.trim()) {
//       return Swal.fire("Required", "Please enter GRPO Number first!", "info");
//     }
//     setLoading(true);
//     try {
//       const res = await api.get(
//         `reports/fetch-grpo-inward/${formData.grpo_no}/`,
//       );
//       setFormData((prev) => ({
//         ...prev,
//         firm_name: res.data.firm_name || "",
//         vendor_name: res.data.vendor_name || "",
//         item_code: res.data.item_code || "",
//         expected_qty: res.data.expected_qty || 0,
//         warehouse_location:
//           res.data.warehouse_location || prev.warehouse_location,
//       }));
//     } catch (e) {
//       Swal.fire(
//         "Not Found",
//         "Invalid GRPO Number or GRPO does not exist.",
//         "error",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.received_qty <= 0) {
//       return Swal.fire(
//         "Error",
//         "Received Quantity must be greater than 0",
//         "error",
//       );
//     }

//     try {
//       setLoading(true);
//       await api.post("reports/purchase-inward/", formData);
//       Swal.fire("Success!", "Physical Inward saved successfully.", "success");
//       setIsFormModalOpen(false);
//       setFormData(initialState);
//       fetchInwards();
//     } catch (err) {
//       Swal.fire("Error", "Failed to save entry: " + err.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- HANDLERS & LOGIC ---
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Smart Auto-Calculate Shortage & Validation
//   useEffect(() => {
//     const exp = parseFloat(formData.expected_qty) || 0;
//     const rec = parseFloat(formData.received_qty) || 0;

//     if (rec > exp && exp > 0) {
//       Swal.fire(
//         "Warning",
//         "Received Quantity cannot be greater than Expected Quantity from GRPO.",
//         "warning",
//       );
//       setFormData((prev) => ({ ...prev, received_qty: exp, shortage_qty: 0 }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         shortage_qty: exp > 0 ? exp - rec : 0,
//       }));
//     }
//   }, [formData.expected_qty, formData.received_qty]);

//   // --- FILTER ---
//   const filteredData = inwardData.filter(
//     (d) =>
//       d.inward_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       d.grpo_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       d.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <div className="bg-[#f8fafc] font-sans h-full flex flex-col p-4 md:p-6 text-slate-700 min-h-screen">
//       {/* HEADER BREADCRUMB */}
//       <div className="mb-5">
//         <p className="text-[12px] text-gray-500 font-medium mb-1 tracking-wide">
//           Warehouse & Logistics /{" "}
//           <span className="text-slate-700 font-bold">Purchase Inward</span>
//         </p>
//         <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
//           Purchase Inward
//         </h1>
//       </div>

//       {/* MAIN DATA CARD */}
//       <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col flex-1 shadow-sm">
//         {/* TOOLBAR */}
//         <div className="flex justify-between items-center px-5 py-3.5 border-b border-gray-100 flex-shrink-0 flex-wrap gap-4">
//           <div className="flex items-center gap-3">
//             {/* Search Bar */}
//             <div className="flex items-center bg-gray-50 px-3 py-2 rounded-full w-[280px] border border-gray-200 focus-within:border-gray-300 focus-within:bg-white transition-all">
//               <IconSearch />
//               <input
//                 type="text"
//                 placeholder="Search No., Vendor or Item..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="bg-transparent border-none outline-none ml-2 text-[13px] w-full font-medium"
//               />
//             </div>

//             {/* Filter Button */}
//             <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full text-[13px] text-gray-600 hover:bg-gray-50 font-medium">
//               <IconFilter /> Filter
//             </button>
//           </div>

//           <div className="flex items-center gap-2.5">
//             {/* Action Icons */}
//             <button className="p-2 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-md">
//               <IconDoc />
//             </button>
//             <button className="p-2 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-md">
//               <IconUpload />
//             </button>
//             <button className="p-2 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-md">
//               <IconDownload />
//             </button>

//             {/* Primary Action Button (Matches GRPO Orange) */}
//             <button
//               onClick={() => {
//                 setFormData(initialState);
//                 setIsFormModalOpen(true);
//               }}
//               className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white px-5 py-2 rounded-md font-bold text-[13px] shadow-sm ml-2 transition-colors"
//             >
//               + New Inward Entry
//             </button>
//           </div>
//         </div>

//         {/* DATA TABLE */}
//         <div className="overflow-auto w-full flex-1">
//           <table className="w-full text-left min-w-max border-collapse">
//             <thead className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider sticky top-0 border-b border-gray-200 z-10">
//               <tr>
//                 <th className="px-5 py-3 border-r border-gray-100">#</th>
//                 <th className="px-5 py-3 border-r border-gray-100">
//                   Inward No
//                 </th>
//                 <th className="px-5 py-3 border-r border-gray-100">Date</th>
//                 <th className="px-5 py-3 border-r border-gray-100">
//                   GRPO Linked
//                 </th>
//                 <th className="px-5 py-3 border-r border-gray-100">
//                   Vendor Name
//                 </th>
//                 <th className="px-5 py-3 border-r border-gray-100 text-center">
//                   Exp Qty
//                 </th>
//                 <th className="px-5 py-3 border-r border-gray-100 text-center">
//                   Rec Qty
//                 </th>
//                 <th className="px-5 py-3 border-r border-gray-100 text-center">
//                   Shortage
//                 </th>
//                 <th className="px-5 py-3 text-center">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white">
//               {filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan="9" className="py-20 text-center">
//                     <div className="flex flex-col items-center justify-center text-gray-400">
//                       <IconDoc />
//                       <p className="mt-2 font-bold text-[13px]">
//                         No Records Found
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((row, index) => (
//                   <tr
//                     key={row.id}
//                     className="border-b border-gray-100 hover:bg-slate-50 transition-colors"
//                   >
//                     <td className="px-5 py-3.5 text-[13px] font-medium text-gray-500 border-r border-gray-100">
//                       {index + 1}
//                     </td>
//                     <td className="px-5 py-3.5 text-[13px] font-bold text-gray-800 border-r border-gray-100">
//                       {row.inward_no}
//                     </td>
//                     <td className="px-5 py-3.5 text-[13px] text-gray-600 border-r border-gray-100">
//                       {row.inward_date}
//                     </td>
//                     <td className="px-5 py-3.5 text-[13px] font-bold text-blue-600 border-r border-gray-100">
//                       {row.grpo_no}
//                     </td>
//                     <td className="px-5 py-3.5 border-r border-gray-100">
//                       <div className="font-semibold text-[13px] text-gray-800">
//                         {row.vendor_name}
//                       </div>
//                       <div className="text-[11px] text-gray-400">
//                         Item: {row.item_code}
//                       </div>
//                     </td>
//                     <td className="px-5 py-3.5 text-[13px] text-center font-medium border-r border-gray-100">
//                       {row.expected_qty}
//                     </td>
//                     <td className="px-5 py-3.5 text-[13px] text-center font-bold text-emerald-600 border-r border-gray-100">
//                       {row.received_qty}
//                     </td>
//                     <td className="px-5 py-3.5 text-[13px] text-center font-bold text-rose-500 border-r border-gray-100">
//                       {row.shortage_qty > 0 ? row.shortage_qty : "-"}
//                     </td>
//                     <td className="px-5 py-3.5 text-center">
//                       <span
//                         className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
//                           row.status === "Completed"
//                             ? "bg-emerald-100 text-emerald-700"
//                             : "bg-amber-100 text-amber-700"
//                         }`}
//                       >
//                         {row.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- COMPLETE ENTRY MODAL --- */}
//       {isFormModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
//             {/* Modal Header */}
//             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
//               <h3 className="text-[16px] font-bold text-slate-800">
//                 Physical Inward Verification
//               </h3>
//               <button
//                 onClick={() => setIsFormModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-700 text-xl font-bold"
//               >
//                 &times;
//               </button>
//             </div>

//             {/* Modal Body (Scrollable) */}
//             <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
//               {/* Step 1: Fetch GRPO */}
//               <div className="flex gap-3 mb-6 items-end">
//                 <div className="flex-1">
//                   <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
//                     Step 1: Enter GRPO No
//                   </label>
//                   <input
//                     type="text"
//                     name="grpo_no"
//                     value={formData.grpo_no}
//                     onChange={handleInputChange}
//                     placeholder="e.g. GRPO-105"
//                     className="w-full bg-white border border-gray-300 p-2.5 rounded-md outline-none focus:border-blue-500 text-[13px]"
//                   />
//                 </div>
//                 <button
//                   type="button"
//                   onClick={handleAutoFetchGRPO}
//                   disabled={loading}
//                   className="bg-slate-800 text-white text-[13px] font-bold px-6 py-2.5 rounded-md shadow-sm hover:bg-slate-900 transition-colors h-[42px]"
//                 >
//                   {loading ? "Fetching..." : "Fetch GRPO"}
//                 </button>
//               </div>

//               {/* Readonly GRPO Info Box */}
//               <div className="grid grid-cols-4 gap-4 p-4 bg-blue-50/50 rounded-md border border-blue-100 mb-6">
//                 <div>
//                   <label className="block text-[10px] font-bold text-gray-500 uppercase">
//                     Firm
//                   </label>
//                   <div className="font-bold text-[13px] text-gray-800">
//                     {formData.firm_name || "-"}
//                   </div>
//                 </div>
//                 <div className="col-span-2">
//                   <label className="block text-[10px] font-bold text-gray-500 uppercase">
//                     Vendor
//                   </label>
//                   <div className="font-bold text-[13px] text-gray-800">
//                     {formData.vendor_name || "-"}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-[10px] font-bold text-blue-600 uppercase">
//                     Expected Qty
//                   </label>
//                   <div className="font-black text-[16px] text-blue-700">
//                     {formData.expected_qty || "0"}
//                   </div>
//                 </div>
//               </div>

//               {/* Step 2: Form Inputs */}
//               <form
//                 id="inwardForm"
//                 onSubmit={handleSubmit}
//                 className="grid grid-cols-2 gap-5"
//               >
//                 {/* Quantities */}
//                 <div>
//                   <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
//                     Received Qty (Physical) *
//                   </label>
//                   <input
//                     type="number"
//                     required
//                     name="received_qty"
//                     value={formData.received_qty}
//                     onChange={handleInputChange}
//                     className="w-full bg-white border border-gray-300 p-2.5 rounded-md focus:border-[#f97316] outline-none text-[14px] font-bold text-emerald-600"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
//                     Shortage Qty
//                   </label>
//                   <input
//                     type="number"
//                     readOnly
//                     value={formData.shortage_qty}
//                     className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-md outline-none text-[14px] font-bold text-rose-500 cursor-not-allowed"
//                   />
//                 </div>

//                 {/* Complete Missing Fields */}
//                 <div>
//                   <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
//                     Received By (Checker Name) *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     name="received_by"
//                     value={formData.received_by}
//                     onChange={handleInputChange}
//                     className="w-full bg-white border border-gray-300 p-2.5 rounded-md focus:border-[#f97316] outline-none text-[13px]"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
//                     Warehouse Location *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     name="warehouse_location"
//                     value={formData.warehouse_location}
//                     onChange={handleInputChange}
//                     className="w-full bg-white border border-gray-300 p-2.5 rounded-md focus:border-[#f97316] outline-none text-[13px]"
//                   />
//                 </div>

//                 {/* Remarks Field */}
//                 <div className="col-span-2">
//                   <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
//                     Remarks / Notes
//                   </label>
//                   <textarea
//                     name="remarks"
//                     value={formData.remarks}
//                     onChange={handleInputChange}
//                     placeholder="Any damages, missing boxes, or extra info..."
//                     className="w-full bg-white border border-gray-300 p-2.5 rounded-md focus:border-[#f97316] outline-none text-[13px] min-h-[80px]"
//                   ></textarea>
//                 </div>
//               </form>
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
//               <button
//                 type="button"
//                 onClick={() => setIsFormModalOpen(false)}
//                 className="px-5 py-2.5 bg-white border border-gray-300 font-bold rounded-md text-[13px] text-gray-600 hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="inwardForm"
//                 disabled={loading}
//                 className="px-6 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-md text-[13px] shadow-sm transition-colors"
//               >
//                 {loading ? "Saving..." : "Confirm Inward"}
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
import SmartLoader from "../components/SmartLoader"; // 🔥 IMPORTED SMART LOADER 🔥

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
export const IconDoc = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#64748b"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);

export default function PurchaseInwardManager() {
  // --- STATES ---
  const [inwardData, setInwardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Poora Form State jisme saari fields hain
  const initialState = {
    grpo_no: "",
    firm_name: "",
    vendor_name: "",
    item_code: "",
    expected_qty: "",
    received_qty: "",
    shortage_qty: "",
    received_by: "",
    warehouse_location: "",
    remarks: "",
  };
  const [formData, setFormData] = useState(initialState);

  // --- LIFECYCLE ---
  useEffect(() => {
    fetchInwards();
  }, []);

  // --- API CALLS ---
  const fetchInwards = async () => {
    try {
      setLoading(true); // 🚀 LOADER ON
      const res = await api.get("reports/purchase-inward/");
      setInwardData(res.data);
    } catch (e) {
      console.error("Error fetching inwards:", e);
    } finally {
      setLoading(false); // 🚀 LOADER OFF
    }
  };

  const handleAutoFetchGRPO = async () => {
    if (!formData.grpo_no.trim()) {
      return Swal.fire("Required", "Please enter GRPO Number first!", "info");
    }
    setLoading(true);
    try {
      const res = await api.get(
        `reports/fetch-grpo-inward/${formData.grpo_no}/`,
      );
      setFormData((prev) => ({
        ...prev,
        firm_name: res.data.firm_name || "",
        vendor_name: res.data.vendor_name || "",
        item_code: res.data.item_code || "",
        expected_qty: res.data.expected_qty || 0,
        warehouse_location:
          res.data.warehouse_location || prev.warehouse_location,
      }));
    } catch (e) {
      Swal.fire(
        "Not Found",
        "Invalid GRPO Number or GRPO does not exist.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.received_qty <= 0) {
      return Swal.fire(
        "Error",
        "Received Quantity must be greater than 0",
        "error",
      );
    }

    try {
      setLoading(true);
      await api.post("reports/purchase-inward/", formData);
      Swal.fire("Success!", "Physical Inward saved successfully.", "success");
      setIsFormModalOpen(false);
      setFormData(initialState);
      fetchInwards();
    } catch (err) {
      Swal.fire("Error", "Failed to save entry: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS & LOGIC ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Smart Auto-Calculate Shortage & Validation
  useEffect(() => {
    const exp = parseFloat(formData.expected_qty) || 0;
    const rec = parseFloat(formData.received_qty) || 0;

    if (rec > exp && exp > 0) {
      Swal.fire(
        "Warning",
        "Received Quantity cannot be greater than Expected Quantity from GRPO.",
        "warning",
      );
      setFormData((prev) => ({ ...prev, received_qty: exp, shortage_qty: 0 }));
    } else {
      setFormData((prev) => ({
        ...prev,
        shortage_qty: exp > 0 ? exp - rec : 0,
      }));
    }
  }, [formData.expected_qty, formData.received_qty]);

  // --- FILTER ---
  const filteredData = inwardData.filter(
    (d) =>
      d.inward_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.grpo_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-[#f8fafc] font-sans h-full flex flex-col p-4 md:p-6 text-slate-700 min-h-screen">
      <style>{`
        .custom-table-scrollbar::-webkit-scrollbar { height: 10px; width: 10px; }
        .custom-table-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-table-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 5px; }
        .custom-table-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/* HEADER BREADCRUMB */}
      <div className="mb-5">
        <p className="text-[12px] text-gray-500 font-medium mb-1 tracking-wide">
          Warehouse & Logistics /{" "}
          <span className="text-slate-700 font-bold">Purchase Inward</span>
        </p>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Purchase Inward
        </h1>
      </div>

      {/* MAIN DATA CARD */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col flex-1 shadow-sm">
        {/* TOOLBAR */}
        <div className="flex justify-between items-center px-5 py-3.5 border-b border-gray-100 flex-shrink-0 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="flex items-center bg-gray-50 px-3 py-2 rounded-full w-[280px] border border-gray-200 focus-within:border-gray-300 focus-within:bg-white transition-all">
              <IconSearch />
              <input
                type="text"
                placeholder="Search No., Vendor or Item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none ml-2 text-[13px] w-full font-medium"
              />
            </div>
            {/* Filter Button */}
            <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full text-[13px] text-gray-600 hover:bg-gray-50 font-medium">
              <IconFilter /> Filter
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Action Icons */}
            <button className="p-2 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-md">
              <IconDoc />
            </button>
            <button className="p-2 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-md">
              <IconUpload />
            </button>
            <button className="p-2 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-md">
              <IconDownload />
            </button>

            {/* Primary Action Button (Matches GRPO Orange) */}
            <button
              onClick={() => {
                setFormData(initialState);
                setIsFormModalOpen(true);
              }}
              className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white px-5 py-2 rounded-md font-bold text-[13px] shadow-sm ml-2 transition-colors"
            >
              + New Inward Entry
            </button>
          </div>
        </div>

        {/* 🔥 HIGH-DENSITY COMPACT DATA TABLE 🔥 */}
        <div className="overflow-auto custom-table-scrollbar w-full flex-1 min-h-[75vh] max-h-[calc(100vh-100px)] relative">
          {loading ? (
            <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center">
              <SmartLoader />
            </div>
          ) : (
            <table className="w-full text-left min-w-max border-collapse">
              <thead className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider sticky top-0 border-b border-gray-200 z-10 whitespace-nowrap">
                <tr>
                  <th className="px-3 py-2 border-r border-gray-100 text-center">
                    #
                  </th>
                  <th className="px-3 py-2 border-r border-gray-100">
                    Inward No
                  </th>
                  <th className="px-3 py-2 border-r border-gray-100">Date</th>
                  <th className="px-3 py-2 border-r border-gray-100">
                    GRPO Linked
                  </th>
                  <th className="px-3 py-2 border-r border-gray-100">
                    Vendor Name
                  </th>
                  <th className="px-3 py-2 border-r border-gray-100 text-center">
                    Exp Qty
                  </th>
                  <th className="px-3 py-2 border-r border-gray-100 text-center">
                    Rec Qty
                  </th>
                  <th className="px-3 py-2 border-r border-gray-100 text-center">
                    Shortage
                  </th>
                  <th className="px-3 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white text-[13px] font-medium text-slate-700">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <IconDoc />
                        <p className="mt-2 font-bold text-[13px]">
                          No Records Found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, index) => (
                    <tr
                      key={row.id}
                      className="border-b border-gray-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3 py-1.5 text-center text-gray-500 border-r border-gray-100 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-3 py-1.5 font-bold text-gray-800 border-r border-gray-100 whitespace-nowrap">
                        {row.inward_no}
                      </td>
                      <td className="px-3 py-1.5 text-[12px] text-gray-600 border-r border-gray-100 whitespace-nowrap">
                        {row.inward_date}
                      </td>
                      <td className="px-3 py-1.5 font-bold text-blue-600 border-r border-gray-100 whitespace-nowrap">
                        {row.grpo_no}
                      </td>

                      {/* 🔥 TEXT WRAP FOR LONG VENDOR NAMES 🔥 */}
                      <td className="px-3 py-1.5 border-r border-gray-100 whitespace-normal min-w-[200px] break-words leading-tight">
                        <div className="font-semibold text-[13px] text-gray-800">
                          {row.vendor_name}
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                          Item: {row.item_code}
                        </div>
                      </td>

                      <td className="px-3 py-1.5 text-center font-medium border-r border-gray-100 whitespace-nowrap">
                        {row.expected_qty}
                      </td>
                      <td className="px-3 py-1.5 text-center font-bold text-emerald-600 border-r border-gray-100 whitespace-nowrap">
                        {row.received_qty}
                      </td>
                      <td className="px-3 py-1.5 text-center font-bold text-rose-500 border-r border-gray-100 whitespace-nowrap">
                        {row.shortage_qty > 0 ? row.shortage_qty : "-"}
                      </td>
                      <td className="px-3 py-1.5 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                            row.status === "Completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- COMPLETE ENTRY MODAL --- */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-[16px] font-bold text-slate-800">
                Physical Inward Verification
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {/* Step 1: Fetch GRPO */}
              <div className="flex gap-3 mb-6 items-end">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                    Step 1: Enter GRPO No
                  </label>
                  <input
                    type="text"
                    name="grpo_no"
                    value={formData.grpo_no}
                    onChange={handleInputChange}
                    placeholder="e.g. GRPO-105"
                    className="w-full bg-white border border-gray-300 p-2.5 rounded-md outline-none focus:border-blue-500 text-[13px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAutoFetchGRPO}
                  disabled={loading}
                  className="bg-slate-800 text-white text-[13px] font-bold px-6 py-2.5 rounded-md shadow-sm hover:bg-slate-900 transition-colors h-[42px]"
                >
                  {loading ? "Fetching..." : "Fetch GRPO"}
                </button>
              </div>

              {/* Readonly GRPO Info Box */}
              <div className="grid grid-cols-4 gap-4 p-4 bg-blue-50/50 rounded-md border border-blue-100 mb-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">
                    Firm
                  </label>
                  <div className="font-bold text-[13px] text-gray-800 break-words leading-tight mt-1">
                    {formData.firm_name || "-"}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">
                    Vendor
                  </label>
                  <div className="font-bold text-[13px] text-gray-800 break-words leading-tight mt-1">
                    {formData.vendor_name || "-"}
                  </div>
                </div>
                <div className="text-right">
                  <label className="block text-[10px] font-bold text-blue-600 uppercase">
                    Expected Qty
                  </label>
                  <div className="font-black text-[16px] text-blue-700 mt-1">
                    {formData.expected_qty || "0"}
                  </div>
                </div>
              </div>

              {/* Step 2: Form Inputs */}
              <form
                id="inwardForm"
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-5"
              >
                {/* Quantities */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                    Received Qty (Physical) *
                  </label>
                  <input
                    type="number"
                    required
                    name="received_qty"
                    value={formData.received_qty}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-300 p-2.5 rounded-md focus:border-[#f97316] outline-none text-[14px] font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                    Shortage Qty
                  </label>
                  <input
                    type="number"
                    readOnly
                    value={formData.shortage_qty}
                    className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-md outline-none text-[14px] font-bold text-rose-500 cursor-not-allowed"
                  />
                </div>

                {/* Complete Missing Fields */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                    Received By (Checker Name) *
                  </label>
                  <input
                    type="text"
                    required
                    name="received_by"
                    value={formData.received_by}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-300 p-2.5 rounded-md focus:border-[#f97316] outline-none text-[13px]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                    Warehouse Location *
                  </label>
                  <input
                    type="text"
                    required
                    name="warehouse_location"
                    value={formData.warehouse_location}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-300 p-2.5 rounded-md focus:border-[#f97316] outline-none text-[13px]"
                  />
                </div>

                {/* Remarks Field */}
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                    Remarks / Notes
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    placeholder="Any damages, missing boxes, or extra info..."
                    className="w-full bg-white border border-gray-300 p-2.5 rounded-md focus:border-[#f97316] outline-none text-[13px] min-h-[80px] custom-scrollbar"
                  ></textarea>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-gray-300 font-bold rounded-md text-[13px] text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="inwardForm"
                disabled={loading || formData.expected_qty === ""}
                className="px-6 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-md text-[13px] shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Saving...
                  </>
                ) : (
                  "Confirm Inward"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}