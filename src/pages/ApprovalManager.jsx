// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";

// const formatIndianNumber = (num) => {
//   if (!num || isNaN(num)) return "";
//   return new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(num);
// };

// const parseIndianNumber = (str) => {
//   if (!str) return 0;
//   return parseFloat(str.toString().replace(/,/g, "")) || 0;
// };

// export default function ApprovalManager() {
//   const navigate = useNavigate();
//   const role = localStorage.getItem("user_role") || "USER";
//   const currentLoggedUser = localStorage.getItem("username") || "User";

//   const [approvals, setApprovals] = useState([]);
//   const [dropdowns, setDropdowns] = useState({
//     firms: [],
//     locations: [],
//     merchants: [],
//     models: [],
//   });
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const initialMasterState = {
//     request_date: new Date().toISOString().split("T")[0],
//     merchant_account_id: "",
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

//   const fetchApprovals = async () => {
//     try {
//       const response = await api.get("reports/approvals/");
//       setApprovals(response.data);
//     } catch (error) {
//       console.error("Error fetching approvals:", error);
//     }
//   };

//   const fetchDropdowns = async () => {
//     try {
//       const response = await api.get("reports/approvals/dropdown_data/");
//       setDropdowns(response.data);
//     } catch (error) {
//       console.error("Error fetching dropdowns:", error);
//     }
//   };

//   useEffect(() => {
//     fetchApprovals();
//     fetchDropdowns();
//   }, []);

//   const handleMasterChange = (e) => {
//     setMasterFormData({ ...masterFormData, [e.target.name]: e.target.value });
//   };

//   const handleItemChange = (id, field, value) => {
//     const updatedItems = itemsList.map((item) => {
//       if (item.id === id) {
//         let updatedItem = { ...item, [field]: value };
//         if (field === "product_model") {
//           const selectedModel = dropdowns.models.find(
//             (m) => m.id.toString() === value,
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

//   const addItemRow = () => {
//     setItemsList([...itemsList, { ...initialItemState, id: Date.now() }]);
//   };
//   const removeItemRow = (id) => {
//     if (itemsList.length > 1)
//       setItemsList(itemsList.filter((item) => item.id !== id));
//   };

//   // 🔥 YE RAHA MISSING FUNCTION 🔥
//   const handleAddNew = () => {
//     setMasterFormData(initialMasterState);
//     setItemsList([{ ...initialItemState, id: Date.now() }]);
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // 1. Strict Master Fields Validation
//     if (
//       !masterFormData.firm ||
//       !masterFormData.merchant ||
//       !masterFormData.bill_location ||
//       !masterFormData.ship_location
//     ) {
//       return alert(
//         "Please fill all required Master fields (Firm, Merchant, Bill & Ship Locations)!",
//       );
//     }

//     try {
//       const cleanItems = itemsList.map((item, index) => {
//         if (!item.product_model)
//           throw new Error(`Item #${index + 1}: Please select an ASIN/FSN.`);

//         // Dropdown array se ASIN text nikalo
//         const selectedModel = dropdowns.models.find(
//           (m) => String(m.id) === String(item.product_model),
//         );
//         const actualAsinText = selectedModel ? selectedModel.asin_fsn : "";

//         const pPrice = parseIndianNumber(item.purchase_price_raw);
//         const cnAmt = parseIndianNumber(item.cn_amt_raw);

//         // 🔥 THE REAL FIX: Exact Django fields use kar rahe hain yahan
//         return {
//           asin_fsn: actualAsinText, // <-- Yahan product_model likh diya tha galti se
//           model_name: item.model_name_log, // <-- Yahan model_name_log likh diya tha
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
//         merchant_account_id: masterFormData.merchant_account_id || "N/A",
//         items: cleanItems,
//       };

//       setLoading(true);
//       await api.post("reports/approvals/", payload);
//       alert("Approval Request Sent Strictly for Verification!");

//       setIsModalOpen(false);
//       setMasterFormData(initialMasterState);
//       setItemsList([{ ...initialItemState, id: Date.now() }]);
//       fetchApprovals();
//     } catch (error) {
//       console.error("Submit Error:", error);
//       let errorMsg = error.message;
//       if (error.response?.data) {
//         errorMsg =
//           typeof error.response.data === "object"
//             ? JSON.stringify(error.response.data)
//             : error.response.data;
//       }
//       alert("Error generating request: " + errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExportData = async () => {
//     try {
//       const response = await api.get("reports/approvals/export_data/");
//       const blob = new Blob([response.data], { type: "text/csv" });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "All_Approvals_Audit_List.csv");
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       alert("Failed to export.");
//     }
//   };

//   const filteredApprovals = approvals.filter((app) => {
//     if (!searchTerm) return true;
//     const s = searchTerm.toLowerCase();
//     return (
//       app.approval_no?.toLowerCase().includes(s) ||
//       app.requested_by?.toLowerCase().includes(s)
//     );
//   });

//   return (
//     <div className="bg-[#f8fafc] min-h-screen font-sans pb-10">
//       <div className="mb-6 border-b border-gray-200 pb-4 mt-4">
//         <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
//           Approvals
//         </h1>
//         <p className="text-xs text-slate-500 font-medium mt-1">
//           Review and action pending requests with strict audit tracking
//         </p>
//       </div>

//       <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 gap-4">
//         <div className="flex items-center bg-gray-50 px-3 py-2 rounded-md border border-gray-200 focus-within:border-amber-400 transition-all min-w-[280px]">
//           <i className="fas fa-search text-gray-400 text-sm"></i>
//           <input
//             type="text"
//             placeholder="Search approvals by No. or Requester..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="bg-transparent border-none outline-none ml-2 text-sm w-full font-medium text-slate-600"
//           />
//         </div>
//         <div className="flex gap-3">
//           <button
//             onClick={handleExportData}
//             className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-sm"
//           >
//             <i className="fas fa-download"></i> EXPORT ALL
//           </button>
//           <button
//             onClick={handleAddNew}
//             className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-md"
//           >
//             <i className="fas fa-plus"></i> New Approval Request
//           </button>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto custom-scrollbar min-h-[400px]">
//           <table className="w-full text-left border-collapse min-w-max">
//             <thead className="bg-slate-50 border-b border-gray-200 text-slate-400 text-[10px] font-black uppercase tracking-widest">
//               <tr>
//                 <th className="p-4 pl-6">APPROVAL NO</th>
//                 <th className="p-4">REQUEST DATE</th>
//                 <th className="p-4">REQUESTED BY</th>
//                 <th className="p-4">STATUS</th>
//                 <th className="p-4">DIGITALLY AUTHORIZED BY</th>
//                 <th className="p-4 text-center pr-6">ACTION</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 text-sm">
//               {filteredApprovals.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="p-12 text-center text-slate-400">
//                     <i className="fas fa-inbox text-3xl mb-3 opacity-30"></i>
//                     <p>No requests logged yet.</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredApprovals.map((app) => (
//                   <tr
//                     key={app.id}
//                     className="hover:bg-slate-50/50 transition-colors"
//                   >
//                     <td className="p-4 pl-6 font-mono font-bold text-slate-800 text-xs">
//                       {app.approval_no}
//                     </td>
//                     <td className="p-4 text-slate-600 text-xs font-medium">
//                       {app.request_date}
//                     </td>
//                     <td className="p-4 text-slate-700 text-xs font-bold uppercase tracking-wide">
//                       {app.requested_by}
//                     </td>
//                     <td className="p-4">
//                       <span
//                         className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex w-max items-center gap-1.5 ${
//                           app.status === "Approved"
//                             ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
//                             : app.status === "Rejected"
//                               ? "bg-red-50 text-red-600 border border-red-200"
//                               : "bg-amber-50 text-amber-600 border border-amber-200"
//                         }`}
//                       >
//                         <span
//                           className={`w-1.5 h-1.5 rounded-full ${app.status === "Approved" ? "bg-emerald-500" : app.status === "Rejected" ? "bg-red-500" : "bg-amber-500"}`}
//                         ></span>
//                         {app.status}
//                       </span>
//                     </td>
//                     <td className="p-4 text-emerald-600 text-xs font-black uppercase tracking-widest">
//                       {app.authorized_by ? `● ${app.authorized_by}` : "-"}
//                     </td>
//                     <td className="p-4 text-center pr-6 flex justify-center gap-2">
//                       {role === "ADMIN" && app.status === "Pending" && (
//                         <>
//                           <button
//                             onClick={() => handleAdminAction(app.id, "approve")}
//                             className="px-3 py-1.5 rounded-md bg-[#0f172a] text-white hover:bg-slate-800 text-[10px] font-bold uppercase tracking-wider shadow-sm transition"
//                           >
//                             Approve
//                           </button>
//                           <button
//                             onClick={() => handleAdminAction(app.id, "reject")}
//                             className="px-3 py-1.5 rounded-md bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-[10px] font-bold uppercase tracking-wider transition"
//                           >
//                             Reject
//                           </button>
//                         </>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* MODAL WINDOW */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
//             <div className="px-8 py-5 border-b border-gray-100 bg-white flex justify-between items-start">
//               <div>
//                 <h3 className="text-xl font-black text-slate-900 tracking-tight">
//                   New Approval Request
//                 </h3>
//                 <p className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-wide">
//                   Request approval before placing an order — add one or more
//                   models below.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times text-sm"></i>
//               </button>
//             </div>

//             <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50/50">
//               <form
//                 id="approvalForm"
//                 onSubmit={handleSubmit}
//                 className="space-y-8"
//               >
//                 <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//                   <div>
//                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
//                       Request Date
//                     </label>
//                     <input
//                       type="date"
//                       required
//                       name="request_date"
//                       value={masterFormData.request_date}
//                       onChange={handleMasterChange}
//                       className="w-full bg-slate-50 border border-gray-200 p-2.5 rounded-lg outline-none text-sm font-medium text-slate-700"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
//                       Requested By (Secure Live Log)
//                     </label>
//                     <input
//                       type="text"
//                       readOnly
//                       value={currentLoggedUser.toUpperCase()}
//                       className="w-full bg-gray-100 border border-gray-200 p-2.5 rounded-lg text-sm font-bold text-slate-500 cursor-not-allowed"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
//                       Account ID / Merchant ID
//                     </label>
//                     <input
//                       type="text"
//                       name="merchant_account_id" // <-- Yahan update karein
//                       value={masterFormData.merchant_account_id} // <-- Yahan update karein
//                       onChange={handleMasterChange}
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-lg outline-none text-sm font-medium text-slate-700"
//                       placeholder="e.g. ID_9011"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
//                       Firm <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       required
//                       name="firm"
//                       value={masterFormData.firm}
//                       onChange={handleMasterChange}
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 cursor-pointer"
//                     >
//                       <option value="">-- Select Firm --</option>
//                       {dropdowns.firms.map((f) => (
//                         <option key={f.id} value={f.id}>
//                           {f.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
//                       Platform / Merchant{" "}
//                       <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       required
//                       name="merchant"
//                       value={masterFormData.merchant}
//                       onChange={handleMasterChange}
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 cursor-pointer"
//                     >
//                       <option value="">-- Select Merchant --</option>
//                       {dropdowns.merchants.map((m) => (
//                         <option key={m.id} value={m.id}>
//                           {m.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
//                       Bill Location <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       required
//                       name="bill_location"
//                       value={masterFormData.bill_location}
//                       onChange={handleMasterChange}
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 cursor-pointer"
//                     >
//                       <option value="">-- Select Billing Warehouse --</option>
//                       {dropdowns.locations.map((l) => (
//                         <option key={l.id} value={l.id}>
//                           {l.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="col-span-1 md:col-span-2 lg:col-span-3">
//                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
//                       Ship Location <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       required
//                       name="ship_location"
//                       value={masterFormData.ship_location}
//                       onChange={handleMasterChange}
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 cursor-pointer"
//                     >
//                       <option value="">-- Select Shipping Warehouse --</option>
//                       {dropdowns.locations.map((l) => (
//                         <option key={l.id} value={l.id}>
//                           {l.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center border-b border-gray-200 pb-2">
//                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">
//                       Items (Models / Colors)
//                     </h4>
//                     <button
//                       type="button"
//                       onClick={addItemRow}
//                       className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 rounded text-[10px] font-bold uppercase tracking-wider transition"
//                     >
//                       <i className="fas fa-plus"></i> Add Another Model
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
//                         className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group"
//                       >
//                         <button
//                           type="button"
//                           onClick={() => removeItemRow(item.id)}
//                           className="absolute top-4 right-4 text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition opacity-50 group-hover:opacity-100"
//                         >
//                           <i className="fas fa-trash-alt mr-1"></i> Remove
//                         </button>
//                         <h5 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-4">
//                           Item #{index + 1}
//                         </h5>

//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
//                           <div className="col-span-1 md:col-span-2 lg:col-span-4">
//                             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
//                               ASIN / FSN <span className="text-red-500">*</span>
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
//                               className="w-full bg-slate-50 border border-gray-200 p-2.5 rounded-lg text-sm font-mono font-bold text-slate-800 focus:border-amber-400 cursor-pointer"
//                             >
//                               <option value="">
//                                 -- Search & Select ASIN --
//                               </option>
//                               {dropdowns.models.map((m) => (
//                                 <option key={m.id} value={m.id}>
//                                   {m.asin_fsn} — {m.model_name}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>
//                           <div className="col-span-1 md:col-span-2">
//                             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
//                               Model Name (Auto)
//                             </label>
//                             <input
//                               type="text"
//                               readOnly
//                               value={item.model_name_log}
//                               className="w-full bg-gray-50 border border-gray-100 p-2.5 rounded-lg text-sm font-medium text-slate-500 cursor-not-allowed"
//                             />
//                           </div>
//                           <div className="col-span-1 md:col-span-2">
//                             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
//                               Model No (Auto)
//                             </label>
//                             <input
//                               type="text"
//                               readOnly
//                               value={item.model_no_log}
//                               className="w-full bg-gray-50 border border-gray-100 p-2.5 rounded-lg text-sm font-medium text-slate-500 cursor-not-allowed"
//                             />
//                           </div>

//                           <div>
//                             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
//                               Req Qty <span className="text-red-500">*</span>
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
//                               className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm font-black text-slate-800"
//                               placeholder="e.g. 100"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
//                               Purchase Price{" "}
//                               <span className="text-red-500">*</span>
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
//                               className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm font-bold text-slate-800"
//                               placeholder="e.g. 15000"
//                             />
//                             <p className="text-[10px] font-bold text-emerald-600 mt-1 pl-1">
//                               {formatIndianNumber(pPriceNum)}
//                             </p>
//                           </div>
//                           <div>
//                             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
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
//                               className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm font-bold text-slate-800"
//                               placeholder="e.g. 500"
//                             />
//                             <p className="text-[10px] font-bold text-red-500 mt-1 pl-1">
//                               {formatIndianNumber(cnAmtNum)}
//                             </p>
//                           </div>
//                           <div>
//                             <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5">
//                               Agreed NLC (Auto)
//                             </label>
//                             <div className="w-full bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg text-sm font-black text-indigo-700 flex items-center">
//                               ₹ {formatIndianNumber(agreedNLC)}
//                             </div>
//                           </div>

//                           <div className="col-span-1 md:col-span-2">
//                             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
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
//                               className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 cursor-pointer"
//                             >
//                               <option value="Yes">Yes</option>
//                               <option value="No">No</option>
//                             </select>
//                           </div>
//                           <div className="col-span-1 md:col-span-2">
//                             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
//                               Expected Delivery Date{" "}
//                               <span className="text-red-500">*</span>
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
//                               className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </form>
//             </div>

//             <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-white">
//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-6 py-2.5 bg-transparent hover:bg-slate-50 text-slate-600 font-bold rounded-lg text-xs uppercase tracking-wider transition"
//               >
//                 CANCEL
//               </button>
//               <button
//                 type="submit"
//                 form="approvalForm"
//                 disabled={loading}
//                 className="px-6 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
//               >
//                 {loading ? "SUBMITTING..." : "SUBMIT FOR APPROVAL"}
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

// Helper: Format number to Indian Currency
const formatIndianNumber = (num) => {
  if (!num || isNaN(num)) return "0.00";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

// Helper: Strip commas
const parseIndianNumber = (str) => {
  if (!str) return 0;
  return parseFloat(str.toString().replace(/,/g, "")) || 0;
};

export default function ApprovalManager() {
  const navigate = useNavigate();
  const role = localStorage.getItem("user_role") || "USER";
  const currentLoggedUser = localStorage.getItem("username") || "User";

  const [approvals, setApprovals] = useState([]);
  const [dropdowns, setDropdowns] = useState({
    firms: [],
    locations: [],
    merchants: [],
    models: [],
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialMasterState = {
    request_date: new Date().toISOString().split("T")[0],
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

  const fetchApprovals = async () => {
    try {
      const response = await api.get("reports/approvals/");
      setApprovals(response.data);
    } catch (error) {
      console.error("Error fetching approvals:", error);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const response = await api.get("reports/approvals/dropdown_data/");
      setDropdowns(response.data);
    } catch (error) {
      console.error("Error fetching dropdowns:", error);
    }
  };

  useEffect(() => {
    fetchApprovals();
    fetchDropdowns();
  }, []);

  const handleMasterChange = (e) => {
    setMasterFormData({ ...masterFormData, [e.target.name]: e.target.value });
  };

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

  const addItemRow = () => {
    setItemsList([...itemsList, { ...initialItemState, id: Date.now() }]);
  };
  const removeItemRow = (id) => {
    if (itemsList.length > 1)
      setItemsList(itemsList.filter((item) => item.id !== id));
  };

  const handleAddNew = () => {
    setMasterFormData(initialMasterState);
    setItemsList([{ ...initialItemState, id: Date.now() }]);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !masterFormData.firm ||
      !masterFormData.merchant ||
      !masterFormData.bill_location ||
      !masterFormData.ship_location
    ) {
      return alert(
        "Please fill all required Master fields (Firm, Merchant, Bill & Ship Locations)!",
      );
    }

    try {
      const cleanItems = itemsList.map((item, index) => {
        if (!item.product_model)
          throw new Error(`Item #${index + 1}: Please select an ASIN/FSN.`);
        const selectedModel = dropdowns.models.find(
          (m) => String(m.id) === String(item.product_model),
        );
        const actualAsinText = selectedModel ? selectedModel.asin_fsn : "";
        const pPrice = parseIndianNumber(item.purchase_price_raw);
        const cnAmt = parseIndianNumber(item.cn_amt_raw);

        return {
          asin_fsn: actualAsinText,
          model_name: item.model_name_log || "Unknown Model",
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
        firm: parseInt(masterFormData.firm),
        merchant: parseInt(masterFormData.merchant),
        bill_location: parseInt(masterFormData.bill_location),
        ship_location: parseInt(masterFormData.ship_location),
        request_date: masterFormData.request_date,
        merchant_account_id: masterFormData.merchant_id || "N/A",
        items: cleanItems,
      };

      setLoading(true);
      await api.post("reports/approvals/", payload);
      alert("Approval Request Generated Successfully!");
      setIsModalOpen(false);
      fetchApprovals();
    } catch (error) {
      let errorMsg = error.message;
      if (error.response?.data) {
        errorMsg =
          typeof error.response.data === "object"
            ? JSON.stringify(error.response.data)
            : error.response.data;
      }
      alert("Error generating request: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ADMIN ACTIONS 🔥
  const handleAdminAction = async (approvalId, actionType) => {
    const isApprove = actionType === "approve";
    const actionText = isApprove ? "APPROVE" : "REJECT";

    if (!window.confirm(`Are you sure you want to ${actionText} this request?`))
      return;

    try {
      await api.post(`reports/approvals/${approvalId}/${actionType}/`);
      fetchApprovals();
    } catch (error) {
      alert("Action Failed: " + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (approvalId) => {
    if (
      !window.confirm(
        `WARNING: Are you sure you want to permanently DELETE this request?`,
      )
    )
      return;
    try {
      await api.delete(`reports/approvals/${approvalId}/`);
      fetchApprovals();
    } catch (error) {
      alert("Delete Failed: " + (error.response?.data?.error || error.message));
    }
  };

  const handleExportData = async () => {
    try {
      const response = await api.get("reports/approvals/export_data/");
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "All_Approvals_Audit_List.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert("Failed to export.");
    }
  };

  const filteredApprovals = approvals.filter((app) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      app.approval_no?.toLowerCase().includes(s) ||
      app.requested_by?.toLowerCase().includes(s)
    );
  });

  // 💎 ATTRACTIVE STATUS BADGES 💎
  const renderStatusBadge = (status) => {
    if (status === "Approved")
      return (
        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 font-black rounded-lg text-[10px] tracking-widest uppercase border border-emerald-200 shadow-sm flex items-center gap-1.5 w-max">
          <i className="fas fa-check-circle"></i> Approved
        </span>
      );
    if (status === "Rejected")
      return (
        <span className="px-3 py-1.5 bg-rose-50 text-rose-600 font-black rounded-lg text-[10px] tracking-widest uppercase border border-rose-200 shadow-sm flex items-center gap-1.5 w-max">
          <i className="fas fa-times-circle"></i> Rejected
        </span>
      );
    return (
      <span className="px-3 py-1.5 bg-amber-50 text-amber-600 font-black rounded-lg text-[10px] tracking-widest uppercase border border-amber-200 shadow-sm flex items-center gap-1.5 w-max">
        <i className="fas fa-clock"></i> Pending
      </span>
    );
  };

  return (
    <div className="bg-[#f4f7fe] min-h-screen font-sans pb-10">
      <div className="mb-6 border-b border-gray-200 pb-4 mt-4 px-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Approvals Manager
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Review and manage your approval requests with detailed model views.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 gap-4 mx-2">
        <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 focus-within:border-indigo-400 transition-all w-full md:max-w-md">
          <i className="fas fa-search text-gray-400"></i>
          <input
            type="text"
            placeholder="Search by Approval No. or Requester..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none ml-3 text-sm w-full font-bold text-slate-700 placeholder-slate-400"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-lg text-xs font-black uppercase tracking-widest transition shadow-sm"
          >
            <i className="fas fa-download"></i> EXPORT
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-black uppercase tracking-widest transition shadow-md"
          >
            <i className="fas fa-plus text-amber-400"></i> NEW REQUEST
          </button>
        </div>
      </div>

      {/* 💎 NEW SPACIOUS & CLEAR DATA TABLE 💎 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mx-2">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 text-[11px] font-black uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6 whitespace-nowrap">APP. NO & DATE</th>
                <th className="p-4 whitespace-nowrap">USER INFO</th>
                <th className="p-4 whitespace-nowrap">FIRM & PLATFORM</th>
                <th className="p-4">MODEL DETAILS (ASIN & NAME)</th>
                <th className="p-4 whitespace-nowrap">REQ QTY</th>
                <th className="p-4 whitespace-nowrap">AGREED NLC</th>
                <th className="p-4 whitespace-nowrap">STATUS</th>
                <th className="p-4 whitespace-nowrap">AUTH BY</th>
                <th className="p-4 text-center pr-6 whitespace-nowrap">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredApprovals.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-16 text-center text-slate-400">
                    <i className="fas fa-folder-open text-4xl mb-3 opacity-30"></i>
                    <p className="font-bold text-lg">No requests found.</p>
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
                      className="hover:bg-indigo-50/40 transition-colors"
                    >
                      {/* 1. Approval No & Date */}
                      <td className="p-4 pl-6 align-top whitespace-nowrap">
                        <div className="font-black text-indigo-700 text-sm mb-1">
                          {app.approval_no}
                        </div>
                        <div className="text-xs font-bold text-slate-500">
                          <i className="far fa-calendar-alt mr-1"></i>{" "}
                          {app.request_date}
                        </div>
                      </td>

                      {/* 2. Requested / Placed By */}
                      <td className="p-4 align-top whitespace-nowrap">
                        <div
                          className="font-bold text-slate-800 text-sm mb-1"
                          title="Requested By"
                        >
                          <i className="far fa-user-circle text-slate-400 mr-1"></i>{" "}
                          {app.requested_by}
                        </div>
                        <div
                          className="text-xs font-bold text-slate-500"
                          title="Placed By"
                        >
                          Placed: {item.placed_by || app.requested_by}
                        </div>
                      </td>

                      {/* 3. Firm & Platform */}
                      <td className="p-4 align-top whitespace-nowrap">
                        <div className="font-bold text-slate-800 text-sm mb-1">
                          <i className="far fa-building text-slate-400 mr-1"></i>{" "}
                          {app.firm_detail?.name || "-"}
                        </div>
                        <div className="text-xs font-bold text-slate-500">
                          <i className="fas fa-store text-slate-400 mr-1"></i>{" "}
                          {app.merchant_detail?.name || "-"}
                        </div>
                      </td>

                      {/* 4. Model Details (NOT Truncated - Pura dikhega) */}
                      <td className="p-4 align-top min-w-[300px] max-w-[400px]">
                        {item.id !== "empty" ? (
                          <>
                            <div className="font-black text-slate-800 text-sm mb-1.5 bg-slate-100 w-max px-2 py-0.5 rounded">
                              {item.asin_fsn}
                            </div>
                            <div className="text-xs font-semibold text-slate-600 leading-relaxed break-words whitespace-normal">
                              {item.model_name}
                            </div>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* 5. Requested QTY */}
                      <td className="p-4 align-top whitespace-nowrap">
                        {item.id !== "empty" && (
                          <>
                            <div className="text-lg font-black text-slate-800">
                              {item.req_qty}
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Units
                            </div>
                          </>
                        )}
                      </td>

                      {/* 6. Agreed NLC */}
                      <td className="p-4 align-top whitespace-nowrap">
                        {item.id !== "empty" && (
                          <div className="text-base font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-max border border-emerald-100">
                            ₹ {formatIndianNumber(item.agreed_nlc)}
                          </div>
                        )}
                      </td>

                      {/* 7. Status */}
                      <td className="p-4 align-top whitespace-nowrap">
                        {renderStatusBadge(app.status)}
                      </td>

                      {/* 8. Authorized By */}
                      <td className="p-4 align-top whitespace-nowrap">
                        <div className="font-bold text-slate-700 text-sm">
                          {app.authorized_by || "-"}
                        </div>
                      </td>

                      {/* 9. Actions (Approve, Reject, Delete) */}
                      <td className="p-4 align-top text-center pr-6 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          {role === "ADMIN" ? (
                            <>
                              {app.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      handleAdminAction(app.id, "approve")
                                    }
                                    className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors flex items-center justify-center shadow-sm"
                                    title="Approve Request"
                                  >
                                    <i className="fas fa-check"></i>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleAdminAction(app.id, "reject")
                                    }
                                    className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white transition-colors flex items-center justify-center shadow-sm"
                                    title="Reject Request"
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDelete(app.id)}
                                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center shadow-sm"
                                title="Delete Request Permanently"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-200">
                              Locked
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )),
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL WINDOW (Remains Unchanged & Clean) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="px-8 py-5 border-b border-gray-100 bg-white flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  New Approval Request
                </h3>
                <p className="text-[11px] text-slate-500 font-bold mt-1 uppercase tracking-widest">
                  Request approval before placing an order.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 w-8 h-8 rounded-full flex items-center justify-center transition"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50/50">
              <form
                id="approvalForm"
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                {/* Master Details Box */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Request Date
                    </label>
                    <input
                      type="date"
                      required
                      name="request_date"
                      value={masterFormData.request_date}
                      onChange={handleMasterChange}
                      className="w-full bg-slate-50 border border-gray-300 p-2.5 rounded-lg text-sm font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Requested By (Auto)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={currentLoggedUser.toUpperCase()}
                      className="w-full bg-slate-100 border border-gray-200 p-2.5 rounded-lg text-sm font-black text-slate-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Account ID / Merchant ID
                    </label>
                    <input
                      type="text"
                      name="merchant_id"
                      value={masterFormData.merchant_id}
                      onChange={handleMasterChange}
                      className="w-full bg-white border border-gray-300 p-2.5 rounded-lg text-sm font-bold text-slate-800"
                      placeholder="e.g. ID_9011"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Firm <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      name="firm"
                      value={masterFormData.firm}
                      onChange={handleMasterChange}
                      className="w-full bg-white border border-gray-300 p-2.5 rounded-lg text-sm font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="">-- Select Firm --</option>
                      {dropdowns.firms.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Platform / Merchant{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      name="merchant"
                      value={masterFormData.merchant}
                      onChange={handleMasterChange}
                      className="w-full bg-white border border-gray-300 p-2.5 rounded-lg text-sm font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="">-- Select Merchant --</option>
                      {dropdowns.merchants.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Bill Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      name="bill_location"
                      value={masterFormData.bill_location}
                      onChange={handleMasterChange}
                      className="w-full bg-white border border-gray-300 p-2.5 rounded-lg text-sm font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="">-- Select Billing Location --</option>
                      {dropdowns.locations.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Ship Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      name="ship_location"
                      value={masterFormData.ship_location}
                      onChange={handleMasterChange}
                      className="w-full bg-white border border-gray-300 p-2.5 rounded-lg text-sm font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="">-- Select Shipping Location --</option>
                      {dropdowns.locations.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <h4 className="text-lg font-black text-slate-800">
                      Items (Models & Colors)
                    </h4>
                    <button
                      type="button"
                      onClick={addItemRow}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-black rounded-lg hover:bg-indigo-100 text-[11px] uppercase tracking-widest transition"
                    >
                      <i className="fas fa-plus"></i> Add Another Model
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
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative hover:border-indigo-200 transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => removeItemRow(item.id)}
                          className="absolute top-5 right-5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition"
                        >
                          <i className="fas fa-trash-alt mr-1"></i> Remove
                        </button>
                        <h5 className="text-xs font-black text-amber-600 mb-5 uppercase tracking-widest bg-amber-50 w-max px-2 py-1 rounded">
                          Item #{index + 1}
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className="col-span-1 md:col-span-2 lg:col-span-4">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                              ASIN / FSN <span className="text-red-500">*</span>
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
                              className="w-full bg-white border border-gray-300 p-3 rounded-lg text-sm font-black text-indigo-700 focus:border-indigo-400 cursor-pointer"
                            >
                              <option value="">
                                -- Search & Select ASIN --
                              </option>
                              {dropdowns.models.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.asin_fsn} — {m.model_name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                              Model Name (Auto)
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={item.model_name_log}
                              className="w-full bg-slate-50 border border-gray-200 p-2.5 rounded-lg text-sm font-bold text-slate-500 cursor-not-allowed"
                            />
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                              Model No (Auto)
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={item.model_no_log}
                              className="w-full bg-slate-50 border border-gray-200 p-2.5 rounded-lg text-sm font-bold text-slate-500 cursor-not-allowed"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                              Req Qty <span className="text-red-500">*</span>
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
                              className="w-full bg-white border border-gray-300 p-2.5 rounded-lg text-lg font-black text-slate-900"
                              placeholder="e.g. 100"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                              Purchase Price{" "}
                              <span className="text-red-500">*</span>
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
                              className="w-full bg-white border border-gray-300 p-2.5 rounded-lg text-lg font-black text-slate-900"
                              placeholder="e.g. 15000"
                            />
                            <p className="text-[11px] font-black tracking-widest text-emerald-600 mt-1.5 pl-1">
                              ₹ {formatIndianNumber(pPriceNum)}
                            </p>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
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
                              className="w-full bg-white border border-gray-300 p-2.5 rounded-lg text-lg font-black text-slate-900"
                              placeholder="e.g. 500"
                            />
                            <p className="text-[11px] font-black tracking-widest text-rose-500 mt-1.5 pl-1">
                              ₹ {formatIndianNumber(cnAmtNum)}
                            </p>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                              Agreed NLC (Auto)
                            </label>
                            <div className="w-full bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-lg font-black text-emerald-700 flex items-center">
                              ₹ {formatIndianNumber(agreedNLC)}
                            </div>
                          </div>

                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
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
                              className="w-full bg-white border border-gray-300 p-2.5 rounded-lg text-sm font-bold text-slate-800 cursor-pointer"
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                              Expected Delivery Date{" "}
                              <span className="text-red-500">*</span>
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
                              className="w-full bg-white border border-gray-300 p-2.5 rounded-lg text-sm font-bold text-slate-800"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-white border border-gray-300 hover:bg-gray-100 text-slate-700 font-black rounded-lg text-[11px] uppercase tracking-widest transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="approvalForm"
                disabled={loading}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-lg text-[11px] uppercase tracking-widest transition shadow-md disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}