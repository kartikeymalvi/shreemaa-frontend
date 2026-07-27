// import React, { useState, useEffect } from "react";
// import api from "../api/axios";

// // Helper: Indian Number Currency Formatting
// const formatIndianNumber = (num) => {
//   if (!num || isNaN(num)) return "0.00";
//   return new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(num);
// };

// // PREMIUM OUTLINE SVG ICONS
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
// export const IconTicket = () => (
//   <svg
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M15 5.88 14 10l5.12.33a1 1 0 0 1 .53 1.77l-12 10a1 1 0 0 1-1.6-.96l1-4.14-5.12-.33a1 1 0 0 1-.53-1.77l12-10a1 1 0 0 1 1.6.96Z" />
//   </svg>
// );
// export const IconEdit = () => (
//   <svg
//     width="14"
//     height="14"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
//     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
//   </svg>
// );

// export default function RefundTicketManager() {
//   const username = localStorage.getItem("username") || "Demo User";
//   const todayDate = new Date().toISOString().split("T")[0];

//   // --- CORE STATES ---
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // --- MODAL & FORM STATES ---
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [selectedTicket, setSelectedTicket] = useState(null);

//   const [fetchingInvoice, setFetchingInvoice] = useState(false);
//   const [invoiceItems, setInvoiceItems] = useState([]);

//   const initialFormState = {
//     invoice_no: "",
//     invoice_date: "",
//     order_id: "",
//     order_date: "",
//     merchant: "",
//     location: "",
//     asin: "",
//     model: "",
//     unit_price: 0,
//     complaint_type: "",
//     discrepancy_qty: "",
//     discrepancy_amount: "",
//     remark: "",
//     photo: null,
//   };
//   const [formData, setFormData] = useState(initialFormState);

//   // Load Initial Data
//   useEffect(() => {
//     fetchTickets();
//   }, []);

//   const fetchTickets = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("reports/tickets/");
//       setTickets(res.data);
//     } catch (err) {
//       console.warn("API Note: Ticket endpoint error or empty.");
//       setTickets([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- SMART AUTO-FETCH LOGIC (Triggered on Invoice Blur) ---
//   const handleInvoiceBlur = async () => {
//     if (!formData.invoice_no.trim()) return;

//     setFetchingInvoice(true);
//     try {
//       const res = await api.get(
//         `reports/shipments/?invoice_no=${formData.invoice_no}`,
//       );
//       const items = res.data?.results || res.data;

//       if (items && items.length > 0) {
//         setInvoiceItems(items);
//         const master = items[0];

//         setFormData((prev) => ({
//           ...prev,
//           invoice_date: master.txn_date || "",
//           order_id: master.order_id || "",
//           order_date: master.txn_date || "",
//           merchant: master.seller_name || master.firm || "",
//           location: master.location || "",
//           asin: "",
//           model: "",
//           unit_price: 0,
//         }));
//       } else {
//         alert("Invoice Number not found in database!");
//         setInvoiceItems([]);
//       }
//     } catch (err) {
//       console.error("Error fetching invoice:", err);
//       alert("Error finding invoice. Please check your connection.");
//     } finally {
//       setFetchingInvoice(false);
//     }
//   };

//   // --- SMART AUTO-CALCULATION LOGIC ---
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     let updatedForm = { ...formData, [name]: value };

//     if (name === "asin") {
//       const selectedItem = invoiceItems.find((item) => item.asin_fsn === value);
//       if (selectedItem) {
//         const price =
//           selectedItem.purchase_price || selectedItem.unit_price || 0;
//         updatedForm.model =
//           selectedItem.model_no || selectedItem.model_name || "";
//         updatedForm.unit_price = parseFloat(price);

//         if (updatedForm.discrepancy_qty) {
//           updatedForm.discrepancy_amount = (
//             updatedForm.unit_price * parseFloat(updatedForm.discrepancy_qty)
//           ).toFixed(2);
//         }
//       }
//     }

//     if (name === "discrepancy_qty") {
//       const qty = parseFloat(value) || 0;
//       updatedForm.discrepancy_amount = (qty * formData.unit_price).toFixed(2);
//     }

//     setFormData(updatedForm);
//   };

//   const handleFileChange = (e) => {
//     setFormData({ ...formData, photo: e.target.files[0] });
//   };

//   // --- SUBMIT TICKET ---
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.asin || !formData.complaint_type) {
//       return alert("Please select ASIN and Complaint Type!");
//     }

//     const submitData = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (key === "photo") {
//         if (formData.photo) submitData.append("photo", formData.photo);
//       } else if (key !== "unit_price") {
//         submitData.append(key, formData[key] || "");
//       }
//     });

//     submitData.append("raised_by", username);
//     submitData.append("raised_date", todayDate);
//     submitData.append("ticket_status", "Open");

//     try {
//       setLoading(true);
//       await api.post("reports/tickets/", submitData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Ticket Raised Successfully!");
//       setIsModalOpen(false);
//       setFormData(initialFormState);
//       fetchTickets();
//     } catch (err) {
//       console.error("Backend Error:", err.response?.data);
//       alert("Failed to raise ticket: Check console for exact error.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- UPDATE TICKET STATUS (TRIGGERS REFUND) ---
//   const handleUpdateStatus = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const updateData = new FormData();
//     updateData.append("ticket_status", selectedTicket.ticket_status);
//     if (selectedTicket.credit_note_no)
//       updateData.append("credit_note_no", selectedTicket.credit_note_no);
//     if (selectedTicket.refund_received_amt)
//       updateData.append(
//         "refund_received_amt",
//         selectedTicket.refund_received_amt,
//       );
//     if (selectedTicket.remark)
//       updateData.append("remark", selectedTicket.remark);

//     try {
//       await api.patch(`reports/tickets/${selectedTicket.id}/`, updateData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Ticket Status Updated Successfully!");
//       setIsUpdateModalOpen(false);
//       fetchTickets();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update ticket.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- SUMMARY CALCULATIONS ---
//   const totalTickets = tickets.length;
//   const openTickets = tickets.filter(
//     (t) => t.ticket_status === "Open" || t.ticket_status === "Pending",
//   ).length;
//   const totalDiscrepancyAmt = tickets.reduce(
//     (sum, t) => sum + (parseFloat(t.discrepancy_amount) || 0),
//     0,
//   );
//   const totalRefundedAmt = tickets.reduce(
//     (sum, t) => sum + (parseFloat(t.refund_received_amt) || 0),
//     0,
//   );

//   // --- STATUS BADGE COMPONENT ---
//   const renderStatusBadge = (status) => {
//     if (status?.includes("Resolved") || status?.includes("Closed"))
//       return (
//         <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-bold rounded-md text-[10px] border border-emerald-100 uppercase tracking-widest">
//           Resolved
//         </span>
//       );
//     if (status?.includes("Discrepancy Confirmed"))
//       return (
//         <span className="px-2.5 py-1 bg-rose-50 text-rose-600 font-bold rounded-md text-[10px] border border-rose-100 uppercase tracking-widest">
//           Discrepancy
//         </span>
//       );
//     if (status === "Rejected" || status === "Reject")
//       return (
//         <span className="px-2.5 py-1 bg-gray-100 text-gray-500 font-bold rounded-md text-[10px] border border-gray-200 uppercase tracking-widest">
//           Rejected
//         </span>
//       );

//     return (
//       <span className="px-2.5 py-1 bg-amber-50 text-amber-600 font-bold rounded-md text-[10px] border border-amber-100 uppercase tracking-widest">
//         {status || "Open"}
//       </span>
//     );
//   };

//   return (
//     <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-300 pb-10">
//       {/* --- HEADER --- */}
//       <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
//         <div>
//           <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
//             Support & Settings /{" "}
//             <span className="text-slate-600">Issue & Ticket</span>
//           </p>
//           <h1 className="text-[20px] font-bold text-slate-800 tracking-tight">
//             Customer Support Tickets
//           </h1>
//         </div>
//       </div>

//       {/* --- SUMMARY CARDS --- */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white p-5 rounded-[16px] shadow-sm border border-gray-100 border-l-4 border-l-[#1677ff]">
//           <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
//             Total Tickets
//           </p>
//           <p className="text-2xl font-black text-slate-800 mt-1">
//             {totalTickets}
//           </p>
//         </div>
//         <div className="bg-white p-5 rounded-[16px] shadow-sm border border-gray-100 border-l-4 border-l-amber-500">
//           <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
//             Open Tickets
//           </p>
//           <p className="text-2xl font-black text-slate-800 mt-1">
//             {openTickets}
//           </p>
//         </div>
//         <div className="bg-white p-5 rounded-[16px] shadow-sm border border-gray-100 border-l-4 border-l-rose-500">
//           <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
//             Discrepancy Amt
//           </p>
//           <p className="text-2xl font-black text-slate-800 mt-1">
//             ₹{formatIndianNumber(totalDiscrepancyAmt)}
//           </p>
//         </div>
//         <div className="bg-white p-5 rounded-[16px] shadow-sm border border-gray-100 border-l-4 border-l-emerald-500">
//           <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
//             Refunded
//           </p>
//           <p className="text-2xl font-black text-slate-800 mt-1">
//             ₹{formatIndianNumber(totalRefundedAmt)}
//           </p>
//         </div>
//       </div>

//       {/* --- MAIN CARD --- */}
//       <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden flex flex-col">
//         {/* TOOLBAR */}
//         <div className="flex flex-col md:flex-row justify-between items-center px-6 py-5 border-b border-gray-50 gap-4 bg-white">
//           <div className="flex items-center bg-gray-50/80 px-4 py-2.5 rounded-full w-full md:w-[300px] border border-gray-100 focus-within:bg-white focus-within:border-[#1677ff] focus-within:ring-4 focus-within:ring-blue-50 transition-all">
//             <IconSearch />
//             <input
//               type="text"
//               placeholder="Search tickets, invoice..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="bg-transparent border-none outline-none ml-2 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
//             />
//           </div>

//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="flex items-center gap-2 px-5 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white rounded-[10px] transition font-bold text-[13px] shadow-md shadow-[#e67e22]/20 whitespace-nowrap"
//           >
//             <IconPlus /> Raise Ticket
//           </button>
//         </div>

//         {/* --- SCROLLABLE TABLE --- */}
//         <div className="overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[400px]">
//           <table className="w-full text-left min-w-max border-collapse">
//             <thead className="bg-gray-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest sticky top-0 backdrop-blur-md z-10">
//               <tr>
//                 <th className="p-4 pl-6 whitespace-nowrap bg-gray-50/90 sticky left-0 z-20 shadow-[1px_0_0_#f3f4f6]">
//                   Ticket No
//                 </th>
//                 <th className="p-4 whitespace-nowrap">Status</th>
//                 <th className="p-4 whitespace-nowrap">Invoice No</th>
//                 <th className="p-4 whitespace-nowrap">Order ID</th>
//                 <th className="p-4 whitespace-nowrap">ASIN/FSN</th>
//                 <th className="p-4 min-w-[150px]">Model</th>
//                 <th className="p-4 whitespace-nowrap">Complaint Type</th>
//                 <th className="p-4 text-center whitespace-nowrap">Disc Qty</th>
//                 <th className="p-4 text-right whitespace-nowrap">Disc Amt</th>
//                 <th className="p-4 whitespace-nowrap">Raised By</th>
//                 <th className="p-4 whitespace-nowrap">Raised Date</th>
//                 <th className="p-4 whitespace-nowrap">Credit Note No</th>
//                 <th className="p-4 text-right whitespace-nowrap">Refund Amt</th>
//                 <th className="p-4 text-right pr-6 sticky right-0 bg-gray-50/90 border-l border-gray-100 z-20">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="text-[13px] font-medium text-slate-700 bg-white">
//               {tickets.length === 0 ? (
//                 <tr>
//                   <td colSpan="22" className="p-16 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-3 border border-orange-100">
//                         <IconTicket className="text-[#e67e22] w-8 h-8" />
//                       </div>
//                       <p className="font-bold text-slate-600">
//                         No Tickets Found
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 tickets
//                   .filter(
//                     (t) =>
//                       t.ticket_no
//                         ?.toLowerCase()
//                         .includes(searchTerm.toLowerCase()) ||
//                       t.invoice_no
//                         ?.toLowerCase()
//                         .includes(searchTerm.toLowerCase()),
//                   )
//                   .map((t) => (
//                     <tr
//                       key={t.id}
//                       className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group"
//                     >
//                       <td className="p-4 pl-6 font-mono font-bold text-[#1677ff] whitespace-nowrap sticky left-0 bg-white group-hover:bg-[#f4f7fa] shadow-[1px_0_0_#f3f4f6] z-10">
//                         {t.ticket_no || `TCK-${t.id}`}
//                       </td>
//                       <td className="p-4 whitespace-nowrap">
//                         {renderStatusBadge(t.ticket_status)}
//                       </td>
//                       <td className="p-4 font-mono whitespace-nowrap">
//                         {t.invoice_no}
//                       </td>
//                       <td className="p-4 font-mono text-gray-500 whitespace-nowrap">
//                         {t.order_id}
//                       </td>
//                       <td className="p-4 font-bold text-slate-700 whitespace-nowrap">
//                         {t.asin}
//                       </td>
//                       <td className="p-4" title={t.model}>
//                         {t.model}
//                       </td>
//                       <td className="p-4 whitespace-nowrap text-rose-500">
//                         {t.complaint_type}
//                       </td>
//                       <td className="p-4 text-center font-bold text-slate-800">
//                         {t.discrepancy_qty}
//                       </td>
//                       <td className="p-4 text-right text-rose-600 font-bold">
//                         ₹{formatIndianNumber(t.discrepancy_amount)}
//                       </td>
//                       <td className="p-4 text-slate-500 whitespace-nowrap">
//                         {t.raised_by}
//                       </td>
//                       <td className="p-4 text-slate-500 whitespace-nowrap">
//                         {t.raised_date}
//                       </td>
//                       <td className="p-4 font-mono text-gray-400 whitespace-nowrap">
//                         {t.credit_note_no || "—"}
//                       </td>
//                       <td className="p-4 text-right text-emerald-600 font-bold whitespace-nowrap">
//                         {t.refund_received_amt
//                           ? `₹${formatIndianNumber(t.refund_received_amt)}`
//                           : "—"}
//                       </td>
//                       <td className="p-4 text-right pr-6 sticky right-0 bg-white group-hover:bg-[#f4f7fa] border-l border-gray-100 z-10">
//                         <button
//                           title="Update Ticket"
//                           onClick={() => {
//                             setSelectedTicket(t);
//                             setIsUpdateModalOpen(true);
//                           }}
//                           className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 hover:text-[#e67e22] hover:bg-orange-50 hover:border-orange-200 shadow-sm flex items-center justify-center transition ml-auto"
//                         >
//                           <IconEdit />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* 🚀 RAISE TICKET MODAL 🚀 */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95">
//             <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
//               <div>
//                 <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">
//                   Raise Ticket
//                 </h3>
//                 <p className="text-[12px] text-gray-400 font-medium mt-0.5">
//                   Enter the Invoice No this issue relates to.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times text-sm"></i>
//               </button>
//             </div>

//             <div className="p-8 overflow-y-auto custom-scrollbar bg-[#f0f2f5]/40">
//               <form
//                 id="ticketForm"
//                 onSubmit={handleSubmit}
//                 className="space-y-5 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm"
//               >
//                 {/* INVOICE SEARCH */}
//                 <div>
//                   <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                     Invoice No <span className="text-rose-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       name="invoice_no"
//                       required
//                       value={formData.invoice_no}
//                       onChange={handleInputChange}
//                       onBlur={handleInvoiceBlur}
//                       placeholder="e.g. INV-2001 (Type and click outside to fetch data)"
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition pl-10"
//                     />
//                     <div className="absolute left-3.5 top-3.5 opacity-50">
//                       <IconSearch />
//                     </div>
//                     {fetchingInvoice && (
//                       <span className="absolute right-3.5 top-3 text-[11px] text-[#1677ff] font-bold">
//                         Fetching...
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* AUTO FETCHED ROW 1 */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Invoice Date{" "}
//                       <span className="text-[9px] text-gray-300">(Auto)</span>
//                     </label>
//                     <input
//                       type="text"
//                       readOnly
//                       value={formData.invoice_date}
//                       className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none text-[13px] text-slate-500 cursor-not-allowed"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Order ID{" "}
//                       <span className="text-[9px] text-gray-300">(Auto)</span>
//                     </label>
//                     <input
//                       type="text"
//                       readOnly
//                       value={formData.order_id}
//                       className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none text-[13px] text-slate-500 cursor-not-allowed"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Order Date{" "}
//                       <span className="text-[9px] text-gray-300">(Auto)</span>
//                     </label>
//                     <input
//                       type="text"
//                       readOnly
//                       value={formData.order_date}
//                       className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none text-[13px] text-slate-500 cursor-not-allowed"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Merchant / Location{" "}
//                       <span className="text-[9px] text-gray-300">(Auto)</span>
//                     </label>
//                     <input
//                       type="text"
//                       readOnly
//                       value={
//                         formData.merchant
//                           ? `${formData.merchant} - ${formData.location}`
//                           : ""
//                       }
//                       className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none text-[13px] text-slate-500 cursor-not-allowed"
//                     />
//                   </div>
//                 </div>

//                 <hr className="border-gray-100" />

//                 {/* PRODUCT DETAILS (ASIN & MODEL) */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       ASIN / FSN <span className="text-rose-500">*</span>
//                     </label>
//                     <select
//                       name="asin"
//                       required
//                       value={formData.asin}
//                       onChange={handleInputChange}
//                       disabled={invoiceItems.length === 0}
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                     >
//                       <option value="">
//                         {invoiceItems.length > 0
//                           ? "Select ASIN..."
//                           : "Enter a valid Invoice No first..."}
//                       </option>
//                       {invoiceItems.map((item, idx) => (
//                         <option key={idx} value={item.asin_fsn}>
//                           {item.asin_fsn}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Model{" "}
//                       <span className="text-[9px] text-gray-300">(Auto)</span>
//                     </label>
//                     <input
//                       type="text"
//                       readOnly
//                       value={formData.model}
//                       className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none text-[13px] text-slate-500 cursor-not-allowed"
//                     />
//                   </div>
//                 </div>

//                 {/* ISSUE DETAILS */}
//                 <div>
//                   <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                     Complaint Type <span className="text-rose-500">*</span>
//                   </label>
//                   <select
//                     name="complaint_type"
//                     required
//                     value={formData.complaint_type}
//                     onChange={handleInputChange}
//                     className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                   >
//                     <option value="">Select...</option>
//                     <option value="Short Received">Short Received</option>
//                     <option value="Damage Received">Damage Received</option>
//                     <option value="Variant Mismatch">Variant Mismatch</option>
//                     <option value="Model Mismatch">Model Mismatch</option>
//                     <option value="Other Item Received">
//                       Other Item Received
//                     </option>
//                     <option value="Delivered but Not Received">
//                       Delivered but Not Received
//                     </option>
//                   </select>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Discrepancy Qty <span className="text-rose-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       name="discrepancy_qty"
//                       required
//                       min="1"
//                       value={formData.discrepancy_qty}
//                       onChange={handleInputChange}
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Discrepancy Amount{" "}
//                       <span className="text-[9px] text-gray-300">
//                         (Auto = Qty × Unit Price)
//                       </span>
//                     </label>
//                     <div className="relative">
//                       <span className="absolute left-3.5 top-3 font-bold text-gray-400">
//                         ₹
//                       </span>
//                       <input
//                         type="text"
//                         readOnly
//                         value={formData.discrepancy_amount}
//                         className="w-full bg-orange-50/50 border border-orange-100 p-2.5 pl-8 rounded-xl outline-none text-[13px] font-black text-rose-600 cursor-not-allowed"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                     Remark
//                   </label>
//                   <textarea
//                     name="remark"
//                     rows="2"
//                     value={formData.remark}
//                     onChange={handleInputChange}
//                     placeholder="Describe the issue in detail..."
//                     className="w-full bg-white border border-gray-200 p-3 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] text-slate-800 transition resize-none custom-scrollbar"
//                   ></textarea>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Raised By{" "}
//                       <span className="text-[9px] text-gray-300">(Auto)</span>
//                     </label>
//                     <input
//                       type="text"
//                       readOnly
//                       value={username}
//                       className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none text-[13px] text-slate-500 cursor-not-allowed"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Raised Date{" "}
//                       <span className="text-[9px] text-gray-300">(Auto)</span>
//                     </label>
//                     <input
//                       type="text"
//                       readOnly
//                       value={todayDate}
//                       className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none text-[13px] text-slate-500 cursor-not-allowed"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Attach Photo (Optional)
//                     </label>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleFileChange}
//                       className="w-full bg-white border border-gray-200 p-2 rounded-xl text-[12px] text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#1677ff]/10 file:text-[#1677ff] hover:file:bg-[#1677ff]/20 transition cursor-pointer"
//                     />
//                   </div>
//                 </div>
//               </form>
//             </div>

//             <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="ticketForm"
//                 disabled={loading}
//                 className="px-6 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-md shadow-[#e67e22]/20 disabled:opacity-50"
//               >
//                 {loading ? "Submitting..." : "Raise Ticket"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🚀 UPDATE TICKET MODAL 🚀 */}
//       {isUpdateModalOpen && selectedTicket && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
//             <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center">
//               <h3 className="font-bold text-slate-800 tracking-tight text-[16px]">
//                 Update Ticket:{" "}
//                 <span className="text-[#1677ff] font-mono">
//                   {selectedTicket.ticket_no}
//                 </span>
//               </h3>
//               <button
//                 onClick={() => setIsUpdateModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-600 font-bold w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition"
//               >
//                 &times;
//               </button>
//             </div>

//             <form
//               onSubmit={handleUpdateStatus}
//               className="p-6 grid gap-5 bg-[#f0f2f5]/40"
//             >
//               <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
//                   Ticket Status <span className="text-rose-500">*</span>
//                 </label>
//                 <select
//                   value={selectedTicket.ticket_status}
//                   onChange={(e) =>
//                     setSelectedTicket({
//                       ...selectedTicket,
//                       ticket_status: e.target.value,
//                     })
//                   }
//                   className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 transition"
//                 >
//                   <option value="Open">Open</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Closed - Resolved">
//                     Closed - Resolved (No Refund)
//                   </option>
//                   <option value="Closed - Discrepancy Confirmed">
//                     Closed - Discrepancy Confirmed (Triggers Refund)
//                   </option>
//                   <option value="Rejected">Rejected</option>
//                 </select>
//               </div>

//               {(selectedTicket.ticket_status?.includes("Closed") ||
//                 selectedTicket.ticket_status?.includes("Resolved")) && (
//                 <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
//                   <div>
//                     <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
//                       Credit Note No.
//                     </label>
//                     <input
//                       type="text"
//                       value={selectedTicket.credit_note_no || ""}
//                       onChange={(e) =>
//                         setSelectedTicket({
//                           ...selectedTicket,
//                           credit_note_no: e.target.value,
//                         })
//                       }
//                       className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-mono text-[#1677ff] font-bold outline-none focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 transition"
//                       placeholder="e.g. CN-9982"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
//                       Refund Received Amt (₹)
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={selectedTicket.refund_received_amt || ""}
//                       onChange={(e) =>
//                         setSelectedTicket({
//                           ...selectedTicket,
//                           refund_received_amt: e.target.value,
//                         })
//                       }
//                       className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-bold text-emerald-600 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
//                       placeholder="0.00"
//                     />
//                   </div>
//                 </div>
//               )}

//               <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
//                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
//                   Update Remarks
//                 </label>
//                 <textarea
//                   value={selectedTicket.remark || ""}
//                   onChange={(e) =>
//                     setSelectedTicket({
//                       ...selectedTicket,
//                       remark: e.target.value,
//                     })
//                   }
//                   className="w-full border border-gray-200 p-3 rounded-lg text-[13px] min-h-[80px] outline-none focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 transition resize-none custom-scrollbar"
//                   placeholder="Add resolution notes here..."
//                 ></textarea>
//               </div>

//               <div className="flex justify-end mt-2">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold tracking-widest uppercase rounded-xl text-[12px] w-full shadow-md transition disabled:opacity-50"
//                 >
//                   {loading ? "Saving..." : "Save Status Changes"}
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

// Helper: Indian Number Currency Formatting
const formatIndianNumber = (num) => {
  if (!num || isNaN(num)) return "0.00";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

// PREMIUM OUTLINE SVG ICONS
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
export const IconTicket = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 5.88 14 10l5.12.33a1 1 0 0 1 .53 1.77l-12 10a1 1 0 0 1-1.6-.96l1-4.14-5.12-.33a1 1 0 0 1-.53-1.77l12-10a1 1 0 0 1 1.6.96Z" />
  </svg>
);
export const IconEdit = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

export default function RefundTicketManager() {
  const username = localStorage.getItem("username") || "Demo User";
  const todayDate = new Date().toISOString().split("T")[0];

  // --- CORE STATES ---
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // --- MODAL & FORM STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [fetchingInvoice, setFetchingInvoice] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState([]);

  const initialFormState = {
    invoice_no: "",
    invoice_date: "",
    order_id: "",
    order_date: "",
    merchant: "",
    location: "",
    asin: "",
    model: "",
    unit_price: 0,
    complaint_type: "",
    discrepancy_qty: "",
    discrepancy_amount: "",
    remark: "",
    photo: null,
  };
  const [formData, setFormData] = useState(initialFormState);

  // Load Initial Data
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true); // 🚀 LOADER ON
      const res = await api.get("reports/tickets/");
      setTickets(res.data);
    } catch (err) {
      console.warn("API Note: Ticket endpoint error or empty.");
      setTickets([]);
    } finally {
      setLoading(false); // 🚀 LOADER OFF
    }
  };

  // --- SMART AUTO-FETCH LOGIC (Triggered on Invoice Blur) ---
  const handleInvoiceBlur = async () => {
    if (!formData.invoice_no.trim()) return;

    setFetchingInvoice(true);
    try {
      const res = await api.get(
        `reports/shipments/?invoice_no=${formData.invoice_no}`,
      );
      const items = res.data?.results || res.data;

      if (items && items.length > 0) {
        setInvoiceItems(items);
        const master = items[0];

        setFormData((prev) => ({
          ...prev,
          invoice_date: master.txn_date || "",
          order_id: master.order_id || "",
          order_date: master.txn_date || "",
          merchant: master.seller_name || master.firm || "",
          location: master.location || "",
          asin: "",
          model: "",
          unit_price: 0,
        }));
      } else {
        alert("Invoice Number not found in database!");
        setInvoiceItems([]);
      }
    } catch (err) {
      console.error("Error fetching invoice:", err);
      alert("Error finding invoice. Please check your connection.");
    } finally {
      setFetchingInvoice(false);
    }
  };

  // --- SMART AUTO-CALCULATION LOGIC ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    if (name === "asin") {
      const selectedItem = invoiceItems.find((item) => item.asin_fsn === value);
      if (selectedItem) {
        const price =
          selectedItem.purchase_price || selectedItem.unit_price || 0;
        updatedForm.model =
          selectedItem.model_no || selectedItem.model_name || "";
        updatedForm.unit_price = parseFloat(price);

        if (updatedForm.discrepancy_qty) {
          updatedForm.discrepancy_amount = (
            updatedForm.unit_price * parseFloat(updatedForm.discrepancy_qty)
          ).toFixed(2);
        }
      }
    }

    if (name === "discrepancy_qty") {
      const qty = parseFloat(value) || 0;
      updatedForm.discrepancy_amount = (qty * formData.unit_price).toFixed(2);
    }

    setFormData(updatedForm);
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  // --- SUBMIT TICKET ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.asin || !formData.complaint_type) {
      return alert("Please select ASIN and Complaint Type!");
    }

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "photo") {
        if (formData.photo) submitData.append("photo", formData.photo);
      } else if (key !== "unit_price") {
        submitData.append(key, formData[key] || "");
      }
    });

    submitData.append("raised_by", username);
    submitData.append("raised_date", todayDate);
    submitData.append("ticket_status", "Open");

    try {
      setLoading(true);
      await api.post("reports/tickets/", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Ticket Raised Successfully!");
      setIsModalOpen(false);
      setFormData(initialFormState);
      fetchTickets();
    } catch (err) {
      console.error("Backend Error:", err.response?.data);
      alert("Failed to raise ticket: Check console for exact error.");
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATE TICKET STATUS (TRIGGERS REFUND) ---
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updateData = new FormData();
    updateData.append("ticket_status", selectedTicket.ticket_status);
    if (selectedTicket.credit_note_no)
      updateData.append("credit_note_no", selectedTicket.credit_note_no);
    if (selectedTicket.refund_received_amt)
      updateData.append(
        "refund_received_amt",
        selectedTicket.refund_received_amt,
      );
    if (selectedTicket.remark)
      updateData.append("remark", selectedTicket.remark);

    try {
      await api.patch(`reports/tickets/${selectedTicket.id}/`, updateData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Ticket Status Updated Successfully!");
      setIsUpdateModalOpen(false);
      fetchTickets();
    } catch (err) {
      console.error(err);
      alert("Failed to update ticket.");
    } finally {
      setLoading(false);
    }
  };

  // --- SUMMARY CALCULATIONS ---
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(
    (t) => t.ticket_status === "Open" || t.ticket_status === "Pending",
  ).length;
  const totalDiscrepancyAmt = tickets.reduce(
    (sum, t) => sum + (parseFloat(t.discrepancy_amount) || 0),
    0,
  );
  const totalRefundedAmt = tickets.reduce(
    (sum, t) => sum + (parseFloat(t.refund_received_amt) || 0),
    0,
  );

  // --- STATUS BADGE COMPONENT ---
  const renderStatusBadge = (status) => {
    if (status?.includes("Resolved") || status?.includes("Closed"))
      return (
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-bold rounded-md text-[10px] border border-emerald-100 uppercase tracking-widest whitespace-nowrap">
          Resolved
        </span>
      );
    if (status?.includes("Discrepancy Confirmed"))
      return (
        <span className="px-2.5 py-1 bg-rose-50 text-rose-600 font-bold rounded-md text-[10px] border border-rose-100 uppercase tracking-widest whitespace-nowrap">
          Discrepancy
        </span>
      );
    if (status === "Rejected" || status === "Reject")
      return (
        <span className="px-2.5 py-1 bg-gray-100 text-gray-500 font-bold rounded-md text-[10px] border border-gray-200 uppercase tracking-widest whitespace-nowrap">
          Rejected
        </span>
      );

    return (
      <span className="px-2.5 py-1 bg-amber-50 text-amber-600 font-bold rounded-md text-[10px] border border-amber-100 uppercase tracking-widest whitespace-nowrap">
        {status || "Open"}
      </span>
    );
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-300 pb-10">
      <style>{`
        .custom-table-scrollbar::-webkit-scrollbar { height: 10px; width: 10px; }
        .custom-table-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-table-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 5px; }
        .custom-table-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/* --- HEADER --- */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
            Support & Settings /{" "}
            <span className="text-slate-600">Issue & Ticket</span>
          </p>
          <h1 className="text-[20px] font-bold text-slate-800 tracking-tight">
            Customer Support Tickets
          </h1>
        </div>
      </div>

      {/* --- SUMMARY CARDS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-[16px] shadow-sm border border-gray-100 border-l-4 border-l-[#1677ff]">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            Total Tickets
          </p>
          <p className="text-2xl font-black text-slate-800 mt-1">
            {totalTickets}
          </p>
        </div>
        <div className="bg-white p-5 rounded-[16px] shadow-sm border border-gray-100 border-l-4 border-l-amber-500">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            Open Tickets
          </p>
          <p className="text-2xl font-black text-slate-800 mt-1">
            {openTickets}
          </p>
        </div>
        <div className="bg-white p-5 rounded-[16px] shadow-sm border border-gray-100 border-l-4 border-l-rose-500">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            Discrepancy Amt
          </p>
          <p className="text-2xl font-black text-slate-800 mt-1">
            ₹{formatIndianNumber(totalDiscrepancyAmt)}
          </p>
        </div>
        <div className="bg-white p-5 rounded-[16px] shadow-sm border border-gray-100 border-l-4 border-l-emerald-500">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            Refunded
          </p>
          <p className="text-2xl font-black text-slate-800 mt-1">
            ₹{formatIndianNumber(totalRefundedAmt)}
          </p>
        </div>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden flex flex-col">
        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-5 border-b border-gray-50 gap-4 bg-white">
          <div className="flex items-center bg-gray-50/80 px-4 py-2.5 rounded-full w-full md:w-[300px] border border-gray-100 focus-within:bg-white focus-within:border-[#1677ff] focus-within:ring-4 focus-within:ring-blue-50 transition-all">
            <IconSearch />
            <input
              type="text"
              placeholder="Search tickets, invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none ml-2 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white rounded-[10px] transition font-bold text-[13px] shadow-md shadow-[#e67e22]/20 whitespace-nowrap"
          >
            <IconPlus /> Raise Ticket
          </button>
        </div>

        {/* --- SCROLLABLE TABLE WITH SMART LOADER (HIGH DENSITY) --- */}
        <div className="overflow-x-auto custom-table-scrollbar w-full min-h-[75vh] max-h-[calc(100vh-100px)] relative bg-white">
          {loading ? (
            <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center">
              <SmartLoader />
            </div>
          ) : (
            <table className="w-full text-left min-w-max border-collapse">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest sticky top-0 backdrop-blur-md z-20 whitespace-nowrap">
                <tr>
                  <th className="px-3 py-2 pl-6 sticky left-0 z-30 shadow-[1px_0_0_#f3f4f6]">
                    Ticket No
                  </th>
                  <th className="px-3 py-2 text-center">Status</th>
                  <th className="px-3 py-2">Invoice No</th>
                  <th className="px-3 py-2">Order ID</th>
                  <th className="px-3 py-2">ASIN/FSN</th>
                  <th className="px-3 py-2 min-w-[200px]">Model</th>
                  <th className="px-3 py-2">Complaint Type</th>
                  <th className="px-3 py-2 text-center">Disc Qty</th>
                  <th className="px-3 py-2 text-right">Disc Amt</th>
                  <th className="px-3 py-2">Raised By</th>
                  <th className="px-3 py-2">Raised Date</th>
                  <th className="px-3 py-2">Credit Note No</th>
                  <th className="px-3 py-2 text-right">Refund Amt</th>
                  <th className="px-3 py-2 text-center pr-6 sticky right-0 bg-gray-50/90 border-l border-gray-100 z-30">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-[13px] font-medium text-slate-700 bg-white">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan="14" className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-3 border border-orange-100">
                          <IconTicket className="text-[#e67e22] w-8 h-8" />
                        </div>
                        <p className="font-bold text-slate-600">
                          No Tickets Found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tickets
                    .filter(
                      (t) =>
                        t.ticket_no
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        t.invoice_no
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase()),
                    )
                    .map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="px-3 py-1.5 pl-6 font-mono font-bold text-[#1677ff] whitespace-nowrap sticky left-0 bg-white group-hover:bg-[#f4f7fa] shadow-[1px_0_0_#f3f4f6] z-10">
                          {t.ticket_no || `TCK-${t.id}`}
                        </td>
                        <td className="px-3 py-1.5 text-center">
                          {renderStatusBadge(t.ticket_status)}
                        </td>
                        <td className="px-3 py-1.5 font-mono font-bold text-slate-700 whitespace-nowrap">
                          {t.invoice_no}
                        </td>
                        <td className="px-3 py-1.5 font-mono text-gray-500 whitespace-nowrap">
                          {t.order_id}
                        </td>
                        <td className="px-3 py-1.5 font-bold text-slate-700 whitespace-nowrap">
                          {t.asin}
                        </td>

                        {/* 🔥 TEXT WRAP APPLIED HERE 🔥 */}
                        <td
                          className="px-3 py-1.5 font-medium text-slate-700 whitespace-normal min-w-[200px] max-w-[300px] break-words leading-snug"
                          title={t.model}
                        >
                          {t.model}
                        </td>

                        {/* 🔥 TEXT WRAP APPLIED HERE 🔥 */}
                        <td className="px-3 py-1.5 font-bold text-rose-500 whitespace-normal min-w-[150px] max-w-[200px] break-words leading-tight">
                          {t.complaint_type}
                        </td>

                        <td className="px-3 py-1.5 text-center font-bold text-slate-800 whitespace-nowrap">
                          {t.discrepancy_qty}
                        </td>
                        <td className="px-3 py-1.5 text-right text-rose-600 font-bold whitespace-nowrap">
                          ₹{formatIndianNumber(t.discrepancy_amount)}
                        </td>
                        <td className="px-3 py-1.5 text-slate-500 whitespace-nowrap">
                          {t.raised_by}
                        </td>
                        <td className="px-3 py-1.5 text-slate-500 whitespace-nowrap">
                          {t.raised_date}
                        </td>
                        <td className="px-3 py-1.5 font-mono text-gray-400 whitespace-nowrap">
                          {t.credit_note_no || "—"}
                        </td>
                        <td className="px-3 py-1.5 text-right text-emerald-600 font-bold whitespace-nowrap">
                          {t.refund_received_amt
                            ? `₹${formatIndianNumber(t.refund_received_amt)}`
                            : "—"}
                        </td>

                        <td className="px-3 py-1.5 text-center pr-6 sticky right-0 bg-white group-hover:bg-[#f4f7fa] border-l border-gray-100 z-10 whitespace-nowrap">
                          <button
                            title="Update Ticket"
                            onClick={() => {
                              setSelectedTicket(t);
                              setIsUpdateModalOpen(true);
                            }}
                            className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 hover:text-[#e67e22] hover:bg-orange-50 hover:border-orange-200 shadow-sm flex items-center justify-center transition ml-auto"
                          >
                            <IconEdit />
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 🚀 RAISE TICKET MODAL 🚀 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95">
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">
                  Raise Ticket
                </h3>
                <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                  Enter the Invoice No this issue relates to.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar bg-[#f0f2f5]/40">
              <form
                id="ticketForm"
                onSubmit={handleSubmit}
                className="space-y-5 bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm"
              >
                {/* INVOICE SEARCH */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Invoice No <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="invoice_no"
                      required
                      value={formData.invoice_no}
                      onChange={handleInputChange}
                      onBlur={handleInvoiceBlur}
                      placeholder="e.g. INV-2001 (Type and click outside to fetch data)"
                      className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition pl-10"
                    />
                    <div className="absolute left-3.5 top-3.5 opacity-50">
                      <IconSearch />
                    </div>
                    {fetchingInvoice && (
                      <span className="absolute right-3.5 top-3 text-[11px] text-[#1677ff] font-bold">
                        Fetching...
                      </span>
                    )}
                  </div>
                </div>

                {/* AUTO FETCHED ROW 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Invoice Date{" "}
                      <span className="text-[9px] text-gray-300">(Auto)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.invoice_date}
                      className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none text-[13px] text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Order ID{" "}
                      <span className="text-[9px] text-gray-300">(Auto)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.order_id}
                      className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none text-[13px] text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Order Date{" "}
                      <span className="text-[9px] text-gray-300">(Auto)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.order_date}
                      className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none text-[13px] text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Merchant / Location{" "}
                      <span className="text-[9px] text-gray-300">(Auto)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={
                        formData.merchant
                          ? `${formData.merchant} - ${formData.location}`
                          : ""
                      }
                      className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none text-[13px] text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* PRODUCT DETAILS (ASIN & MODEL) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      ASIN / FSN <span className="text-rose-500">*</span>
                    </label>
                    <select
                      name="asin"
                      required
                      value={formData.asin}
                      onChange={handleInputChange}
                      disabled={invoiceItems.length === 0}
                      className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                    >
                      <option value="">
                        {invoiceItems.length > 0
                          ? "Select ASIN..."
                          : "Enter a valid Invoice No first..."}
                      </option>
                      {invoiceItems.map((item, idx) => (
                        <option key={idx} value={item.asin_fsn}>
                          {item.asin_fsn}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Model{" "}
                      <span className="text-[9px] text-gray-300">(Auto)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={formData.model}
                      className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none text-[13px] text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* ISSUE DETAILS */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Complaint Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="complaint_type"
                    required
                    value={formData.complaint_type}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                  >
                    <option value="">Select...</option>
                    <option value="Short Received">Short Received</option>
                    <option value="Damage Received">Damage Received</option>
                    <option value="Variant Mismatch">Variant Mismatch</option>
                    <option value="Model Mismatch">Model Mismatch</option>
                    <option value="Other Item Received">
                      Other Item Received
                    </option>
                    <option value="Delivered but Not Received">
                      Delivered but Not Received
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Discrepancy Qty <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="discrepancy_qty"
                      required
                      min="1"
                      value={formData.discrepancy_qty}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Discrepancy Amount{" "}
                      <span className="text-[9px] text-gray-300">
                        (Auto = Qty × Unit Price)
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 font-bold text-gray-400">
                        ₹
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={formData.discrepancy_amount}
                        className="w-full bg-orange-50/50 border border-orange-100 p-2.5 pl-8 rounded-xl outline-none text-[13px] font-black text-rose-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Remark
                  </label>
                  <textarea
                    name="remark"
                    rows="2"
                    value={formData.remark}
                    onChange={handleInputChange}
                    placeholder="Describe the issue in detail..."
                    className="w-full bg-white border border-gray-200 p-3 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] text-slate-800 transition resize-none custom-scrollbar"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Raised By{" "}
                      <span className="text-[9px] text-gray-300">(Auto)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={username}
                      className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none text-[13px] text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Raised Date{" "}
                      <span className="text-[9px] text-gray-300">(Auto)</span>
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={todayDate}
                      className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl outline-none text-[13px] text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Attach Photo (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full bg-white border border-gray-200 p-2 rounded-xl text-[12px] text-slate-600 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#1677ff]/10 file:text-[#1677ff] hover:file:bg-[#1677ff]/20 transition cursor-pointer"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="ticketForm"
                disabled={loading}
                className="px-6 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-md shadow-[#e67e22]/20 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Raise Ticket"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 UPDATE TICKET MODAL 🚀 */}
      {isUpdateModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center">
              <h3 className="font-bold text-slate-800 tracking-tight text-[16px]">
                Update Ticket:{" "}
                <span className="text-[#1677ff] font-mono">
                  {selectedTicket.ticket_no}
                </span>
              </h3>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleUpdateStatus}
              className="p-6 grid gap-5 bg-[#f0f2f5]/40"
            >
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  Ticket Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedTicket.ticket_status}
                  onChange={(e) =>
                    setSelectedTicket({
                      ...selectedTicket,
                      ticket_status: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 transition"
                >
                  <option value="Open">Open</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed - Resolved">
                    Closed - Resolved (No Refund)
                  </option>
                  <option value="Closed - Discrepancy Confirmed">
                    Closed - Discrepancy Confirmed (Triggers Refund)
                  </option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {(selectedTicket.ticket_status?.includes("Closed") ||
                selectedTicket.ticket_status?.includes("Resolved")) && (
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                      Credit Note No.
                    </label>
                    <input
                      type="text"
                      value={selectedTicket.credit_note_no || ""}
                      onChange={(e) =>
                        setSelectedTicket({
                          ...selectedTicket,
                          credit_note_no: e.target.value,
                        })
                      }
                      className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-mono text-[#1677ff] font-bold outline-none focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 transition"
                      placeholder="e.g. CN-9982"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                      Refund Received Amt (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={selectedTicket.refund_received_amt || ""}
                      onChange={(e) =>
                        setSelectedTicket({
                          ...selectedTicket,
                          refund_received_amt: e.target.value,
                        })
                      }
                      className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-bold text-emerald-600 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  Update Remarks
                </label>
                <textarea
                  value={selectedTicket.remark || ""}
                  onChange={(e) =>
                    setSelectedTicket({
                      ...selectedTicket,
                      remark: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 p-3 rounded-lg text-[13px] min-h-[80px] outline-none focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 transition resize-none custom-scrollbar"
                  placeholder="Add resolution notes here..."
                ></textarea>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold tracking-widest uppercase rounded-xl text-[12px] w-full shadow-md transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Status Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}