// import React, { useState, useEffect } from "react";
// import api from "../api/axios";
// import Swal from "sweetalert2";

// // Helper: Indian Currency Formatting
// const formatIndianNumber = (num) => {
//   if (!num || isNaN(num)) return "0.00";
//   return new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(num);
// };

// // ICONS
// const IconPlus = () => (
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
// const IconSearch = () => (
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
// const IconLedger = () => (
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
//     <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
//     <line x1="16" y1="2" x2="16" y2="6"></line>
//     <line x1="8" y1="2" x2="8" y2="6"></line>
//     <line x1="3" y1="10" x2="21" y2="10"></line>
//   </svg>
// );
// const IconWallet = () => (
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
//     <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
//     <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
//     <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
//   </svg>
// );

// export default function FinanceLedgerManager() {
//   const todayDate = new Date().toISOString().split("T")[0];

//   // --- UI STATES ---
//   const [activeTab, setActiveTab] = useState("ledger"); // 'ledger' or 'settlement'
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // --- LEDGER STATES ---
//   const [ledgerData, setLedgerData] = useState([]);
//   const [ledgerFilters, setLedgerFilters] = useState({
//     firm_name: "",
//     card_number: "",
//   });

//   // --- SETTLEMENT STATES ---
//   const [settlements, setSettlements] = useState([]);
//   const initialForm = {
//     date: todayDate,
//     firm_name: "",
//     card_number: "",
//     txn_type: "Refill",
//     amount: "",
//     remarks: "",
//   };
//   const [formData, setFormData] = useState(initialForm);

//   useEffect(() => {
//     if (activeTab === "settlement") fetchSettlements();
//   }, [activeTab]);

//   // 🚀 API: Fetch Settlements
//   const fetchSettlements = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("reports/settlements/");
//       setSettlements(res.data);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🚀 API: Fetch Ledger Statement
//   const fetchLedgerStatement = async (e) => {
//     e?.preventDefault();
//     if (!ledgerFilters.firm_name || !ledgerFilters.card_number) {
//       return Swal.fire(
//         "Required",
//         "Please enter both Firm Name and Card Number to view statement.",
//         "info",
//       );
//     }
//     try {
//       setLoading(true);
//       const res = await api.get(
//         `reports/accounts-ledger/?firm_name=${ledgerFilters.firm_name}&card_number=${ledgerFilters.card_number}`,
//       );
//       if (res.data.length === 0)
//         Swal.fire("No Data", "No transactions found for this card.", "info");
//       setLedgerData(res.data);
//     } catch (err) {
//       Swal.fire("Error", "Failed to fetch statement", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🚀 API: Add New Settlement (Refill/Opening Bal)
//   const handleSettlementSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.amount <= 0)
//       return Swal.fire("Error", "Amount must be greater than 0", "error");

//     try {
//       setLoading(true);
//       await api.post("reports/settlements/", formData);
//       Swal.fire("Success", "Settlement Entry Saved!", "success");
//       setIsModalOpen(false);
//       setFormData(initialForm);
//       fetchSettlements();

//       // Agar same card ka ledger khula hai, toh usko bhi refresh kardo
//       if (
//         ledgerFilters.card_number === formData.card_number &&
//         ledgerFilters.firm_name === formData.firm_name
//       ) {
//         fetchLedgerStatement();
//       }
//     } catch (err) {
//       Swal.fire("Error", "Failed to save entry", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- LEDGER CALCULATIONS ---
//   const totalCredit = ledgerData.reduce(
//     (sum, item) => sum + parseFloat(item.credit || 0),
//     0,
//   );
//   const totalDebit = ledgerData.reduce(
//     (sum, item) => sum + parseFloat(item.debit || 0),
//     0,
//   );
//   const closingBalance =
//     ledgerData.length > 0 ? ledgerData[ledgerData.length - 1].balance : 0;

//   return (
//     <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-300 pb-10">
//       {/* HEADER & TABS */}
//       <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-5">
//         <div>
//           <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
//             Finance & Accounts / <span className="text-slate-600">Ledger</span>
//           </p>
//           <h1 className="text-[20px] font-bold text-slate-800 tracking-tight">
//             Financial Reconciliation
//           </h1>
//         </div>

//         {/* TAB BUTTONS */}
//         <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
//           <button
//             onClick={() => setActiveTab("ledger")}
//             className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-bold transition-all ${activeTab === "ledger" ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:bg-gray-50"}`}
//           >
//             <IconLedger /> Account Ledger
//           </button>
//           <button
//             onClick={() => setActiveTab("settlement")}
//             className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-bold transition-all ${activeTab === "settlement" ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:bg-gray-50"}`}
//           >
//             <IconWallet /> Card Settlement
//           </button>
//         </div>
//       </div>

//       {/* ========================================================= */}
//       {/* 🚀 TAB 1: ACCOUNTS LEDGER VIEW */}
//       {/* ========================================================= */}
//       {activeTab === "ledger" && (
//         <div className="animate-in fade-in zoom-in-95 duration-300">
//           {/* SEARCH BAR (Top Filter) */}
//           <form
//             onSubmit={fetchLedgerStatement}
//             className="bg-white p-5 rounded-[16px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6 items-end"
//           >
//             <div className="flex-1 w-full">
//               <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
//                 Firm Name <span className="text-rose-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 required
//                 placeholder="e.g. Shree Maa Group"
//                 value={ledgerFilters.firm_name}
//                 onChange={(e) =>
//                   setLedgerFilters({
//                     ...ledgerFilters,
//                     firm_name: e.target.value,
//                   })
//                 }
//                 className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 transition"
//               />
//             </div>
//             <div className="flex-1 w-full">
//               <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
//                 Card Number <span className="text-rose-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 required
//                 placeholder="e.g. 45XX-XXXX-9012"
//                 value={ledgerFilters.card_number}
//                 onChange={(e) =>
//                   setLedgerFilters({
//                     ...ledgerFilters,
//                     card_number: e.target.value,
//                   })
//                 }
//                 className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 transition"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-8 py-3 bg-[#1677ff] hover:bg-blue-600 text-white font-bold rounded-lg text-[13px] shadow-md shadow-blue-500/20 transition h-[42px] whitespace-nowrap"
//             >
//               {loading ? "Fetching..." : "View Statement"}
//             </button>
//           </form>

//           {ledgerData.length > 0 && (
//             <>
//               {/* SUMMARY WIDGETS */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                 <div className="bg-emerald-50 p-5 rounded-[16px] border border-emerald-100">
//                   <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-widest">
//                     Total In (Credit)
//                   </p>
//                   <p className="text-2xl font-black text-emerald-700 mt-1">
//                     ₹ {formatIndianNumber(totalCredit)}
//                   </p>
//                 </div>
//                 <div className="bg-rose-50 p-5 rounded-[16px] border border-rose-100">
//                   <p className="text-[11px] text-rose-600 font-bold uppercase tracking-widest">
//                     Total Out (Debit)
//                   </p>
//                   <p className="text-2xl font-black text-rose-700 mt-1">
//                     ₹ {formatIndianNumber(totalDebit)}
//                   </p>
//                 </div>
//                 <div className="bg-blue-50 p-5 rounded-[16px] border border-blue-100">
//                   <p className="text-[11px] text-blue-600 font-bold uppercase tracking-widest">
//                     Current Balance
//                   </p>
//                   <p className="text-2xl font-black text-blue-700 mt-1">
//                     ₹ {formatIndianNumber(closingBalance)}
//                   </p>
//                 </div>
//               </div>

//               {/* STATEMENT TABLE */}
//               <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
//                 <div className="overflow-x-auto min-h-[400px]">
//                   <table className="w-full text-left border-collapse">
//                     <thead className="bg-gray-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest sticky top-0">
//                       <tr>
//                         <th className="p-4 pl-6 whitespace-nowrap">Date</th>
//                         <th className="p-4 whitespace-nowrap">
//                           Ref / Order No
//                         </th>
//                         <th className="p-4 whitespace-nowrap">
//                           Particulars (Type)
//                         </th>
//                         <th className="p-4 whitespace-nowrap">Remarks</th>
//                         <th className="p-4 text-right whitespace-nowrap">
//                           Debit (Out)
//                         </th>
//                         <th className="p-4 text-right whitespace-nowrap">
//                           Credit (In)
//                         </th>
//                         <th className="p-4 text-right pr-6 whitespace-nowrap bg-blue-50/50">
//                           Running Balance
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="text-[13px] font-medium text-slate-700">
//                       {ledgerData.map((row, idx) => (
//                         <tr
//                           key={idx}
//                           className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors"
//                         >
//                           <td className="p-4 pl-6 text-slate-500 whitespace-nowrap">
//                             {new Date(row.date).toLocaleDateString("en-GB")}
//                           </td>
//                           <td className="p-4 font-mono font-bold text-[#1677ff] whitespace-nowrap">
//                             {row.ref_no}
//                           </td>
//                           <td className="p-4">
//                             <span
//                               className={`px-2 py-1 rounded-[5px] text-[10px] font-bold uppercase border ${
//                                 row.type.includes("Refill") ||
//                                 row.type.includes("Opening")
//                                   ? "bg-emerald-50 text-emerald-600 border-emerald-100"
//                                   : row.type.includes("Refund")
//                                     ? "bg-amber-50 text-amber-600 border-amber-100"
//                                     : "bg-rose-50 text-rose-600 border-rose-100"
//                               }`}
//                             >
//                               {row.type}
//                             </span>
//                           </td>
//                           <td className="p-4 text-[12px] text-gray-500">
//                             {row.remarks}
//                           </td>
//                           <td className="p-4 text-right text-rose-500 font-bold">
//                             {row.debit > 0
//                               ? `₹${formatIndianNumber(row.debit)}`
//                               : "-"}
//                           </td>
//                           <td className="p-4 text-right text-emerald-600 font-bold">
//                             {row.credit > 0
//                               ? `₹${formatIndianNumber(row.credit)}`
//                               : "-"}
//                           </td>
//                           <td className="p-4 text-right pr-6 font-black text-slate-800 bg-blue-50/20">
//                             ₹{formatIndianNumber(row.balance)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       {/* ========================================================= */}
//       {/* 🚀 TAB 2: SETTLEMENT / REFILL VIEW */}
//       {/* ========================================================= */}
//       {activeTab === "settlement" && (
//         <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
//           <div className="flex justify-between items-center px-6 py-5 border-b border-gray-50 bg-white">
//             <h2 className="text-[15px] font-bold text-slate-800">
//               Card Refills & Settlements
//             </h2>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="flex items-center gap-2 px-5 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white rounded-[10px] transition font-bold text-[13px] shadow-md shadow-[#e67e22]/20"
//             >
//               <IconPlus /> Add Funds
//             </button>
//           </div>

//           <div className="overflow-x-auto min-h-[400px]">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest sticky top-0">
//                 <tr>
//                   <th className="p-4 pl-6">Txn ID</th>
//                   <th className="p-4">Date</th>
//                   <th className="p-4">Firm Name</th>
//                   <th className="p-4">Card Number</th>
//                   <th className="p-4">Txn Type</th>
//                   <th className="p-4">Remarks</th>
//                   <th className="p-4 text-right pr-6">Amount (₹)</th>
//                 </tr>
//               </thead>
//               <tbody className="text-[13px] font-medium text-slate-700">
//                 {settlements.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan="7"
//                       className="p-16 text-center text-gray-400 font-bold"
//                     >
//                       No Settlements Found
//                     </td>
//                   </tr>
//                 ) : (
//                   settlements.map((s) => (
//                     <tr
//                       key={s.id}
//                       className="border-b border-gray-50 hover:bg-slate-50"
//                     >
//                       <td className="p-4 pl-6 font-mono font-bold text-slate-800">
//                         {s.txn_id}
//                       </td>
//                       <td className="p-4 text-slate-500">
//                         {new Date(s.date).toLocaleDateString("en-GB")}
//                       </td>
//                       <td className="p-4 font-bold text-slate-700">
//                         {s.firm_name}
//                       </td>
//                       <td className="p-4 font-mono text-[#1677ff] font-bold">
//                         {s.card_number}
//                       </td>
//                       <td className="p-4">
//                         <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[10px] font-bold uppercase">
//                           {s.txn_type}
//                         </span>
//                       </td>
//                       <td className="p-4 text-gray-500 text-[12px]">
//                         {s.remarks || "—"}
//                       </td>
//                       <td className="p-4 text-right pr-6 font-black text-emerald-600">
//                         + ₹{formatIndianNumber(s.amount)}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* 🚀 MODAL: ADD SETTLEMENT (FUNDS) */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
//             <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center">
//               <h3 className="font-bold text-slate-800 tracking-tight text-[16px]">
//                 Add Card Settlement / Refill
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-600 font-bold w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"
//               >
//                 &times;
//               </button>
//             </div>

//             <form
//               onSubmit={handleSettlementSubmit}
//               className="p-6 grid gap-5 bg-[#f0f2f5]/40"
//             >
//               <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
//                       Date *
//                     </label>
//                     <input
//                       type="date"
//                       required
//                       value={formData.date}
//                       onChange={(e) =>
//                         setFormData({ ...formData, date: e.target.value })
//                       }
//                       className="w-full border p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
//                       Txn Type *
//                     </label>
//                     <select
//                       value={formData.txn_type}
//                       onChange={(e) =>
//                         setFormData({ ...formData, txn_type: e.target.value })
//                       }
//                       className="w-full border p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none"
//                     >
//                       <option value="Refill">Refill</option>
//                       <option value="Opening Balance">Opening Balance</option>
//                       <option value="Manual Adjustment">
//                         Manual Adjustment
//                       </option>
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
//                     Firm Name *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     placeholder="e.g. Shree Maa Group"
//                     value={formData.firm_name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, firm_name: e.target.value })
//                     }
//                     className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-bold outline-none focus:border-[#1677ff]"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
//                     Card Number *
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     placeholder="e.g. 45XX-XXXX-9012"
//                     value={formData.card_number}
//                     onChange={(e) =>
//                       setFormData({ ...formData, card_number: e.target.value })
//                     }
//                     className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-mono font-bold text-[#1677ff] outline-none focus:border-[#1677ff]"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
//                     Amount (₹) *
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     required
//                     placeholder="0.00"
//                     value={formData.amount}
//                     onChange={(e) =>
//                       setFormData({ ...formData, amount: e.target.value })
//                     }
//                     className="w-full border border-emerald-200 bg-emerald-50 p-2.5 rounded-lg text-[15px] font-black text-emerald-700 outline-none focus:ring-4 focus:ring-emerald-100 transition"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
//                     Remarks (Optional)
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="e.g. Monthly limit load"
//                     value={formData.remarks}
//                     onChange={(e) =>
//                       setFormData({ ...formData, remarks: e.target.value })
//                     }
//                     className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] outline-none focus:border-[#1677ff]"
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end mt-2">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-6 py-3 bg-[#e67e22] hover:bg-[#d35400] text-white font-bold tracking-widest uppercase rounded-xl text-[12px] w-full shadow-md transition disabled:opacity-50"
//                 >
//                   {loading ? "Saving..." : "Add Funds"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";
import SmartLoader from "../components/SmartLoader"; // 🔥 IMPORTED SMART LOADER 🔥

// --- ERP STANDARD ICONS ---
const IconPlus = () => (
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
const IconSearch = () => (
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
const IconLedger = () => (
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
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
const IconWallet = () => (
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
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
  </svg>
);

// Helper: Indian Currency Formatting
const formatIndianNumber = (num) => {
  if (!num || isNaN(num)) return "0.00";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export default function FinanceLedgerManager() {
  const todayDate = new Date().toISOString().split("T")[0];

  // --- UI STATES ---
  const [activeTab, setActiveTab] = useState("ledger"); // 'ledger' or 'settlement'
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LEDGER STATES ---
  const [ledgerData, setLedgerData] = useState([]);
  const [ledgerFilters, setLedgerFilters] = useState({
    firm_name: "",
    card_number: "",
  });

  // --- SETTLEMENT STATES ---
  const [settlements, setSettlements] = useState([]);
  const initialForm = {
    date: todayDate,
    firm_name: "",
    card_number: "",
    txn_type: "Refill",
    amount: "",
    remarks: "",
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (activeTab === "settlement") fetchSettlements();
  }, [activeTab]);

  // 🚀 API: Fetch Settlements
  const fetchSettlements = async () => {
    try {
      setLoading(true); // 🚀 LOADER ON
      const res = await api.get("reports/settlements/");
      setSettlements(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // 🚀 LOADER OFF
    }
  };

  // 🚀 API: Fetch Ledger Statement
  const fetchLedgerStatement = async (e) => {
    e?.preventDefault();
    if (!ledgerFilters.firm_name || !ledgerFilters.card_number) {
      return Swal.fire(
        "Required",
        "Please enter both Firm Name and Card Number to view statement.",
        "info",
      );
    }
    try {
      setLoading(true); // 🚀 LOADER ON
      const res = await api.get(
        `reports/accounts-ledger/?firm_name=${ledgerFilters.firm_name}&card_number=${ledgerFilters.card_number}`,
      );
      if (res.data.length === 0)
        Swal.fire("No Data", "No transactions found for this card.", "info");
      setLedgerData(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch statement", "error");
    } finally {
      setLoading(false); // 🚀 LOADER OFF
    }
  };

  // 🚀 API: Add New Settlement (Refill/Opening Bal)
  const handleSettlementSubmit = async (e) => {
    e.preventDefault();
    if (formData.amount <= 0)
      return Swal.fire("Error", "Amount must be greater than 0", "error");

    try {
      setLoading(true);
      await api.post("reports/settlements/", formData);
      Swal.fire("Success", "Settlement Entry Saved!", "success");
      setIsModalOpen(false);
      setFormData(initialForm);
      fetchSettlements();

      // Agar same card ka ledger khula hai, toh usko bhi refresh kardo
      if (
        ledgerFilters.card_number === formData.card_number &&
        ledgerFilters.firm_name === formData.firm_name
      ) {
        fetchLedgerStatement();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to save entry", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- LEDGER CALCULATIONS ---
  const totalCredit = ledgerData.reduce(
    (sum, item) => sum + parseFloat(item.credit || 0),
    0,
  );
  const totalDebit = ledgerData.reduce(
    (sum, item) => sum + parseFloat(item.debit || 0),
    0,
  );
  const closingBalance =
    ledgerData.length > 0 ? ledgerData[ledgerData.length - 1].balance : 0;

  return (
    <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-300 pb-10">
      <style>{`
        .custom-table-scrollbar::-webkit-scrollbar { height: 10px; width: 10px; }
        .custom-table-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-table-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 5px; }
        .custom-table-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/* HEADER & TABS */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-5">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
            Finance & Accounts / <span className="text-slate-600">Ledger</span>
          </p>
          <h1 className="text-[20px] font-bold text-slate-800 tracking-tight">
            Financial Reconciliation
          </h1>
        </div>

        {/* TAB BUTTONS */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab("ledger")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-bold transition-all ${activeTab === "ledger" ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:bg-gray-50"}`}
          >
            <IconLedger /> Account Ledger
          </button>
          <button
            onClick={() => setActiveTab("settlement")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-bold transition-all ${activeTab === "settlement" ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:bg-gray-50"}`}
          >
            <IconWallet /> Card Settlement
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 🚀 TAB 1: ACCOUNTS LEDGER VIEW */}
      {/* ========================================================= */}
      {activeTab === "ledger" && (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          {/* SEARCH BAR (Top Filter) */}
          <form
            onSubmit={fetchLedgerStatement}
            className="bg-white p-5 rounded-[16px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6 items-end"
          >
            <div className="flex-1 w-full">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                Firm Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Shree Maa Group"
                value={ledgerFilters.firm_name}
                onChange={(e) =>
                  setLedgerFilters({
                    ...ledgerFilters,
                    firm_name: e.target.value,
                  })
                }
                className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 transition"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                Card Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 45XX-XXXX-9012"
                value={ledgerFilters.card_number}
                onChange={(e) =>
                  setLedgerFilters({
                    ...ledgerFilters,
                    card_number: e.target.value,
                  })
                }
                className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#1677ff] hover:bg-blue-600 text-white font-bold rounded-lg text-[13px] shadow-md shadow-blue-500/20 transition h-[42px] whitespace-nowrap"
            >
              {loading ? "Fetching..." : "View Statement"}
            </button>
          </form>

          {ledgerData.length > 0 && (
            <>
              {/* SUMMARY WIDGETS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-emerald-50 p-5 rounded-[16px] border border-emerald-100">
                  <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-widest">
                    Total In (Credit)
                  </p>
                  <p className="text-2xl font-black text-emerald-700 mt-1">
                    ₹ {formatIndianNumber(totalCredit)}
                  </p>
                </div>
                <div className="bg-rose-50 p-5 rounded-[16px] border border-rose-100">
                  <p className="text-[11px] text-rose-600 font-bold uppercase tracking-widest">
                    Total Out (Debit)
                  </p>
                  <p className="text-2xl font-black text-rose-700 mt-1">
                    ₹ {formatIndianNumber(totalDebit)}
                  </p>
                </div>
                <div className="bg-blue-50 p-5 rounded-[16px] border border-blue-100">
                  <p className="text-[11px] text-blue-600 font-bold uppercase tracking-widest">
                    Current Balance
                  </p>
                  <p className="text-2xl font-black text-blue-700 mt-1">
                    ₹ {formatIndianNumber(closingBalance)}
                  </p>
                </div>
              </div>

              {/* STATEMENT TABLE (Compact) */}
              <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden relative">
                <div className="overflow-x-auto min-h-[40vh] max-h-[calc(100vh-250px)] custom-table-scrollbar">
                  {loading ? (
                    <div className="w-full h-full min-h-[40vh] flex flex-col items-center justify-center">
                      <SmartLoader />
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest sticky top-0 z-10 whitespace-nowrap">
                        <tr>
                          <th className="px-3 py-2 pl-6">Date</th>
                          <th className="px-3 py-2">Ref / Order No</th>
                          <th className="px-3 py-2">Particulars (Type)</th>
                          <th className="px-3 py-2 min-w-[200px]">Remarks</th>
                          <th className="px-3 py-2 text-right">Debit (Out)</th>
                          <th className="px-3 py-2 text-right">Credit (In)</th>
                          <th className="px-3 py-2 text-right pr-6 bg-blue-50/50">
                            Running Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-[13px] font-medium text-slate-700 bg-white">
                        {ledgerData.map((row, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-3 py-1.5 pl-6 text-slate-500 whitespace-nowrap">
                              {new Date(row.date).toLocaleDateString("en-GB")}
                            </td>
                            <td className="px-3 py-1.5 font-mono font-bold text-[#1677ff] whitespace-nowrap">
                              {row.ref_no}
                            </td>
                            <td className="px-3 py-1.5">
                              <span
                                className={`px-2 py-0.5 rounded-[5px] text-[9px] font-bold uppercase border whitespace-nowrap ${
                                  row.type.includes("Refill") ||
                                  row.type.includes("Opening")
                                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                    : row.type.includes("Refund")
                                      ? "bg-amber-50 text-amber-600 border-amber-100"
                                      : "bg-rose-50 text-rose-600 border-rose-100"
                                }`}
                              >
                                {row.type}
                              </span>
                            </td>
                            {/* 🔥 TEXT WRAP APPLIED HERE 🔥 */}
                            <td className="px-3 py-1.5 text-[12px] text-gray-500 whitespace-normal break-words leading-tight max-w-[300px]">
                              {row.remarks || "—"}
                            </td>
                            <td className="px-3 py-1.5 text-right text-rose-500 font-bold whitespace-nowrap">
                              {row.debit > 0
                                ? `₹${formatIndianNumber(row.debit)}`
                                : "-"}
                            </td>
                            <td className="px-3 py-1.5 text-right text-emerald-600 font-bold whitespace-nowrap">
                              {row.credit > 0
                                ? `₹${formatIndianNumber(row.credit)}`
                                : "-"}
                            </td>
                            <td className="px-3 py-1.5 text-right pr-6 font-black text-slate-800 bg-blue-50/20 whitespace-nowrap">
                              ₹{formatIndianNumber(row.balance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 🚀 TAB 2: SETTLEMENT / REFILL VIEW */}
      {/* ========================================================= */}
      {activeTab === "settlement" && (
        <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative flex flex-col min-h-[500px]">
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-50 bg-white">
            <h2 className="text-[15px] font-bold text-slate-800">
              Card Refills & Settlements
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white rounded-[10px] transition font-bold text-[13px] shadow-md shadow-[#e67e22]/20"
            >
              <IconPlus /> Add Funds
            </button>
          </div>

          <div className="overflow-x-auto custom-table-scrollbar flex-1 min-h-[50vh] max-h-[calc(100vh-200px)]">
            {loading ? (
              <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center">
                <SmartLoader />
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest sticky top-0 z-10 whitespace-nowrap">
                  <tr>
                    <th className="px-3 py-2 pl-6">Txn ID</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Firm Name</th>
                    <th className="px-3 py-2">Card Number</th>
                    <th className="px-3 py-2">Txn Type</th>
                    <th className="px-3 py-2 min-w-[200px]">Remarks</th>
                    <th className="px-3 py-2 text-right pr-6">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] font-medium text-slate-700 bg-white">
                  {settlements.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="p-16 text-center text-gray-400 font-bold"
                      >
                        No Settlements Found
                      </td>
                    </tr>
                  ) : (
                    settlements.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-gray-50 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-3 py-1.5 pl-6 font-mono font-bold text-slate-800 whitespace-nowrap">
                          {s.txn_id}
                        </td>
                        <td className="px-3 py-1.5 text-slate-500 whitespace-nowrap">
                          {new Date(s.date).toLocaleDateString("en-GB")}
                        </td>

                        {/* 🔥 TEXT WRAP APPLIED HERE 🔥 */}
                        <td className="px-3 py-1.5 font-bold text-slate-700 whitespace-normal min-w-[120px] max-w-[200px] break-words leading-tight">
                          {s.firm_name}
                        </td>
                        <td className="px-3 py-1.5 font-mono text-[#1677ff] font-bold whitespace-nowrap">
                          {s.card_number}
                        </td>
                        <td className="px-3 py-1.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[9px] font-bold uppercase tracking-wider">
                            {s.txn_type}
                          </span>
                        </td>

                        {/* 🔥 TEXT WRAP APPLIED HERE 🔥 */}
                        <td className="px-3 py-1.5 text-gray-500 text-[12px] whitespace-normal min-w-[200px] max-w-[300px] break-words leading-tight">
                          {s.remarks || "—"}
                        </td>

                        <td className="px-3 py-1.5 text-right pr-6 font-black text-emerald-600 whitespace-nowrap">
                          + ₹{formatIndianNumber(s.amount)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 🚀 MODAL: ADD SETTLEMENT (FUNDS) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center">
              <h3 className="font-bold text-slate-800 tracking-tight text-[16px]">
                Add Card Settlement / Refill
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSettlementSubmit}
              className="p-6 grid gap-5 bg-[#f0f2f5]/40"
            >
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full border p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                      Txn Type *
                    </label>
                    <select
                      value={formData.txn_type}
                      onChange={(e) =>
                        setFormData({ ...formData, txn_type: e.target.value })
                      }
                      className="w-full border p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none"
                    >
                      <option value="Refill">Refill</option>
                      <option value="Opening Balance">Opening Balance</option>
                      <option value="Manual Adjustment">
                        Manual Adjustment
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Firm Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shree Maa Group"
                    value={formData.firm_name}
                    onChange={(e) =>
                      setFormData({ ...formData, firm_name: e.target.value })
                    }
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-bold outline-none focus:border-[#1677ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 45XX-XXXX-9012"
                    value={formData.card_number}
                    onChange={(e) =>
                      setFormData({ ...formData, card_number: e.target.value })
                    }
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-mono font-bold text-[#1677ff] outline-none focus:border-[#1677ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full border border-emerald-200 bg-emerald-50 p-2.5 rounded-lg text-[15px] font-black text-emerald-700 outline-none focus:ring-4 focus:ring-emerald-100 transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Remarks (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monthly limit load"
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] outline-none focus:border-[#1677ff]"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#e67e22] hover:bg-[#d35400] text-white font-bold tracking-widest uppercase rounded-xl text-[12px] w-full shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Saving...
                    </>
                  ) : (
                    "Add Funds"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}