// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api/axios";

// export default function MasterManager() {
//   const { type } = useParams();
//   const navigate = useNavigate();

//   const currentTab = type || "firms";

//   const [data, setData] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Modal for Add/Edit
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // 🔥 YEH RAHI MISSING STATES FOR EXCEL UPLOAD
//   const [isUploadModalOpen, setUploadModalOpen] = useState(false);
//   const [file, setFile] = useState(null);

//   const role = localStorage.getItem("user_role") || "USER";

//   const initialFormState = {
//     name: "",
//     asin_fsn: "",
//     model_name: "",
//     model: "",
//     sap_polyshri: "",
//     sap_rio: "",
//     sap_ne: "",
//     sap_sms: "",
//     sap_smmpl: "",
//   };
//   const [formData, setFormData] = useState(initialFormState);

//   const tabs = [
//     { id: "firms", label: "Firm" },
//     { id: "locations", label: "Location" },
//     { id: "merchants", label: "Merchant" },
//     { id: "models", label: "Model" },
//   ];

//   const fetchMasterData = async () => {
//     try {
//       const response = await api.get(`reports/${currentTab}/`);
//       setData(response.data);
//     } catch (error) {
//       console.error(`Error fetching ${currentTab}:`, error);
//     }
//   };

//   useEffect(() => {
//     fetchMasterData();
//     setFormData(initialFormState);
//     setEditId(null);
//   }, [currentTab]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");

//     setLoading(true);
//     try {
//       let payload;
//       if (currentTab === "models") {
//         payload = {
//           asin_fsn: formData.asin_fsn,
//           model_name: formData.model_name,
//           model: formData.model,
//           sap_polyshri: formData.sap_polyshri,
//           sap_rio: formData.sap_rio,
//           sap_ne: formData.sap_ne,
//           sap_sms: formData.sap_sms,
//           sap_smmpl: formData.sap_smmpl,
//         };
//       } else {
//         payload = { name: formData.name };
//       }

//       if (editId) {
//         await api.put(`reports/${currentTab}/${editId}/`, payload);
//       } else {
//         await api.post(`reports/${currentTab}/`, payload);
//       }

//       setFormData(initialFormState);
//       setEditId(null);
//       setIsModalOpen(false);
//       fetchMasterData();
//     } catch (error) {
//       if (error.response && error.response.data) {
//         alert("Backend Error: " + JSON.stringify(error.response.data));
//       } else {
//         alert("Server failed to respond. Check if Django is running!");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 MISSING EXCEL UPLOAD FUNCTIONS
//   const handleFileChange = (e) => {
//     if (e.target.files.length > 0) setFile(e.target.files[0]);
//   };

//   const handleUploadSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select an Excel file first.");

//     const formDataObj = new FormData();
//     formDataObj.append("file", file);

//     setLoading(true);
//     try {
//       // Make sure backend API is ready at reports/models/upload/
//       const res = await api.post("reports/models/upload/", formDataObj);
//       alert(res.data.message || "Models Excel Uploaded Successfully!");
//       setUploadModalOpen(false);
//       setFile(null);
//       fetchMasterData(); // Table reload karne ke liye
//     } catch (error) {
//       alert(
//         "Upload Failed: " + (error.response?.data?.error || "Unknown Error"),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddNew = () => {
//     setFormData(initialFormState);
//     setEditId(null);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (item) => {
//     if (currentTab === "models") {
//       setFormData(item);
//     } else {
//       setFormData({ ...initialFormState, name: item.name });
//     }
//     setEditId(item.id);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");
//     if (
//       window.confirm(
//         "Delete this entry? It will disappear from all dropdowns globally.",
//       )
//     ) {
//       try {
//         await api.delete(`reports/${currentTab}/${id}/`);
//         fetchMasterData();
//       } catch (error) {
//         alert("Delete failed.");
//       }
//     }
//   };

//   // template download function for model
//   const handleDownloadTemplate = () => {
//     const headers = [
//       "asin_fsn",
//       "model_name",
//       "model",
//       "sap_polyshri",
//       "sap_rio",
//       "sap_ne",
//       "sap_sms",
//       "sap_smmpl",
//     ];
//     const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "Model_Master_Template.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const title = currentTab
//     ? currentTab.charAt(0).toUpperCase() + currentTab.slice(1, -1)
//     : "";

//   return (
//     <div className="bg-[#f8fafc] min-h-screen font-sans pb-10">
//       {/* PAGE HEADER */}
//       <div className="mb-2">
//         <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
//           Masters
//         </h1>
//         <p className="text-xs text-slate-500 font-medium mt-1">
//           Manage core reference data used across the whole console
//         </p>
//       </div>

//       {/* TABS NAVIGATION */}
//       <div className="flex border-b border-gray-200 mt-6 mb-6 overflow-x-auto custom-scrollbar">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => navigate(`/master/${tab.id}`)}
//             className={`px-8 py-3 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200 ${
//               currentTab === tab.id
//                 ? "border-b-2 border-amber-500 text-slate-900"
//                 : "text-slate-400 hover:text-slate-700 hover:bg-slate-50/50"
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
//         {/* CARD HEADER (Title & Properly Aligned Action Buttons) */}
//         <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
//           <h2 className="text-base font-bold text-slate-800">{title}</h2>

//           {role === "ADMIN" && (
//             <div className="flex items-center gap-3">
//               {currentTab === "models" && (
//                 <>
//                   {/* 🔥 NAYA TEMPLATE BUTTON 🔥 */}
//                   <button
//                     onClick={handleDownloadTemplate}
//                     className="bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
//                   >
//                     <i className="fas fa-file-csv"></i> Template
//                   </button>

//                   {/* PURANA UPLOAD BUTTON */}
//                   <button
//                     onClick={() => setUploadModalOpen(true)}
//                     className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
//                   >
//                     <i className="fas fa-file-excel"></i> Upload Excel
//                   </button>
//                 </>
//               )}

//               {/* ADD NEW BUTTON */}
//               <button
//                 onClick={handleAddNew}
//                 className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-sm"
//               >
//                 <i className="fas fa-plus"></i> Add {title}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* FULL WIDTH TABLE */}
//         <div className="overflow-x-auto w-full custom-scrollbar max-h-[65vh]">
//           <table className="w-full text-left border-collapse min-w-max">
//             <thead className="bg-slate-50 border-b border-gray-100 text-slate-400 text-[10px] font-black uppercase tracking-widest sticky top-0">
//               <tr>
//                 <th className="p-4 w-16 pl-6">SR.NO</th>

//                 {currentTab === "models" ? (
//                   <>
//                     <th className="p-4">ASN/FSN</th>
//                     <th className="p-4">Model Name</th>
//                     <th className="p-4">Model</th>
//                     <th className="p-4 bg-slate-100/50">SAP Polyshri</th>
//                     <th className="p-4 bg-slate-100/50">SAP Rio</th>
//                     <th className="p-4 bg-slate-100/50">SAP NE</th>
//                     <th className="p-4 bg-slate-100/50">SAP SMS</th>
//                     <th className="p-4 bg-slate-100/50">SAP SMMPL</th>
//                   </>
//                 ) : (
//                   <th className="p-4">{title} NAME</th>
//                 )}

//                 {role === "ADMIN" && (
//                   <th className="p-4 text-center w-32 pr-6 sticky right-0 bg-slate-50">
//                     ACTION
//                   </th>
//                 )}
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-100 text-sm">
//               {data.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={currentTab === "models" ? 10 : 3}
//                     className="p-12 text-center text-slate-400"
//                   >
//                     <i className="fas fa-inbox text-3xl mb-3 opacity-20"></i>
//                     <p className="font-medium text-sm">
//                       No {title} records found.
//                     </p>
//                   </td>
//                 </tr>
//               ) : (
//                 data.map((item, index) => (
//                   <tr
//                     key={item.id}
//                     className="hover:bg-slate-50/50 transition-colors group"
//                   >
//                     <td className="p-4 pl-6 text-slate-500 font-mono text-[11px] font-bold">
//                       {index + 1}
//                     </td>

//                     {currentTab === "models" ? (
//                       <>
//                         <td className="p-4 font-mono font-bold text-slate-900 text-[11px]">
//                           {item.asin_fsn}
//                         </td>
//                         <td className="p-4 font-bold text-slate-700 text-[12px]">
//                           {item.model_name}
//                         </td>
//                         <td className="p-4 text-slate-500 text-[12px]">
//                           {item.model || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_polyshri || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_rio || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_ne || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_sms || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_smmpl || "-"}
//                         </td>
//                       </>
//                     ) : (
//                       <td className="p-4 font-bold text-slate-700 text-[13px]">
//                         {item.name}
//                       </td>
//                     )}

//                     {role === "ADMIN" && (
//                       <td className="p-4 text-center pr-6 sticky right-0 bg-white group-hover:bg-slate-50 transition-colors">
//                         <div className="flex justify-center items-center gap-2">
//                           <button
//                             onClick={() => handleEdit(item)}
//                             className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[11px] font-bold transition"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item.id)}
//                             className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded text-[11px] font-bold transition"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     )}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- ADD / EDIT FORM MODAL --- */}
//       {isModalOpen && role === "ADMIN" && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
//             <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
//               <h3 className="text-lg font-black text-slate-900 tracking-tight">
//                 {editId ? `Edit ${title}` : `Add New ${title}`}
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>

//             <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/30">
//               <form
//                 id="masterForm"
//                 onSubmit={handleSubmit}
//                 className="space-y-5"
//               >
//                 {currentTab !== "models" && (
//                   <div>
//                     <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                       {title} Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-slate-500 focus:ring-1 focus:ring-slate-200 outline-none text-sm font-bold text-slate-800 transition shadow-sm"
//                       placeholder={`Enter ${title} name...`}
//                     />
//                   </div>
//                 )}

//                 {currentTab === "models" && (
//                   <>
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                           ASN / FSN <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           name="asin_fsn"
//                           value={formData.asin_fsn || ""}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-slate-500 focus:ring-1 focus:ring-slate-200 outline-none text-sm font-mono font-bold text-slate-800 shadow-sm"
//                           placeholder="e.g. B08KH5..."
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                           Model Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           name="model_name"
//                           value={formData.model_name || ""}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-slate-500 focus:ring-1 focus:ring-slate-200 outline-none text-sm font-medium text-slate-800 shadow-sm"
//                           placeholder="e.g. Realme P4..."
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                           Model
//                         </label>
//                         <input
//                           type="text"
//                           name="model"
//                           value={formData.model || ""}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-slate-500 focus:ring-1 focus:ring-slate-200 outline-none text-sm font-medium text-slate-800 shadow-sm"
//                           placeholder="Model specific info"
//                         />
//                       </div>
//                     </div>

//                     <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 mt-2">
//                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
//                         <i className="fas fa-server"></i> SAP Configurations
//                       </p>
//                       <div className="grid grid-cols-2 gap-4">
//                         {["sap_polyshri", "sap_rio", "sap_ne", "sap_sms"].map(
//                           (sapKey) => (
//                             <div key={sapKey}>
//                               <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                                 {sapKey.replace("_", " ")}
//                               </label>
//                               <input
//                                 type="text"
//                                 name={sapKey}
//                                 value={formData[sapKey] || ""}
//                                 onChange={handleInputChange}
//                                 className="w-full bg-white border border-gray-200 p-2 rounded-md focus:border-slate-400 outline-none text-xs font-bold text-slate-700 shadow-sm"
//                               />
//                             </div>
//                           ),
//                         )}
//                         <div className="col-span-2">
//                           <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                             SAP SMMPL
//                           </label>
//                           <input
//                             type="text"
//                             name="sap_smmpl"
//                             value={formData.sap_smmpl || ""}
//                             onChange={handleInputChange}
//                             className="w-full bg-white border border-gray-200 p-2 rounded-md focus:border-slate-400 outline-none text-xs font-bold text-slate-700 shadow-sm"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </form>
//             </div>

//             <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg text-xs uppercase tracking-wider transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="masterForm"
//                 disabled={loading}
//                 className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
//               >
//                 {loading ? "Saving..." : editId ? "Update Data" : "Save Record"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- 🔥 NAYA UPLOAD EXCEL MODAL --- */}
//       {isUploadModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
//             <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
//               <h2 className="text-xl font-black text-slate-900 tracking-tight">
//                 Bulk Upload Models
//               </h2>
//               <button
//                 onClick={() => setUploadModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>
//             {/* 🔥 INFO BOX FOR HEADERS */}
//             <div className="mb-6 bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl">
//               <div className="flex items-center gap-2 mb-2.5">
//                 <i className="fas fa-info-circle text-indigo-500"></i>
//                 <h4 className="text-[10px] font-black text-indigo-800 uppercase tracking-widest">
//                   Required Excel Headers
//                 </h4>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {[
//                   "ASIN/FSN",
//                   "Model Name",
//                   "Model",
//                   "SAP Polyshri",
//                   "SAP Rio",
//                   "SAP NE",
//                   "SAP SMS",
//                   "SAP SMMPL",
//                 ].map((h, i) => (
//                   <span
//                     key={i}
//                     className="px-2 py-1 bg-white border border-indigo-200 text-indigo-700 text-[10px] font-bold rounded shadow-sm"
//                   >
//                     {h}
//                   </span>
//                 ))}
//               </div>
//               <p className="text-[10px] text-indigo-600 mt-3 font-medium">
//                 * Spelling must match exactly. Case (Capital/Small) does not
//                 matter.
//               </p>
//             </div>

//             <form onSubmit={handleUploadSubmit}>
//               <div className="border-2 border-dashed border-gray-200 p-8 text-center rounded-xl bg-gray-50 mb-6 hover:bg-gray-100 transition-colors">
//                 <i className="fas fa-file-excel text-3xl text-emerald-500 mb-3 block"></i>
//                 <input
//                   type="file"
//                   accept=".xlsx, .xls, .csv"
//                   onChange={handleFileChange}
//                   className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition shadow-md disabled:opacity-50"
//               >
//                 {loading ? "Uploading..." : "Sync Database"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api/axios";

// export default function MasterManager() {
//   const { type } = useParams();
//   const navigate = useNavigate();

//   // 🔥 ADDED "sellers" IN TABS
//   const currentTab = type || "firms";

//   const [data, setData] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // 🔥 SEARCH STATE ADDED
//   const [searchTerm, setSearchTerm] = useState("");

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isUploadModalOpen, setUploadModalOpen] = useState(false);
//   const [file, setFile] = useState(null);

//   const role = localStorage.getItem("user_role") || "USER";

//   // 🔥 ADDED gstn_no FOR SELLER
//   const initialFormState = {
//     name: "",
//     asin_fsn: "",
//     model_name: "",
//     model: "",
//     sap_polyshri: "",
//     sap_rio: "",
//     sap_ne: "",
//     sap_sms: "",
//     sap_smmpl: "",
//     gstn_no: "",
//   };
//   const [formData, setFormData] = useState(initialFormState);

//   const tabs = [
//     { id: "firms", label: "Firm" },
//     { id: "locations", label: "Location" },
//     { id: "merchants", label: "Merchant" },
//     { id: "models", label: "Model" },
//     { id: "sellers", label: "Vendor / Seller" }, // 🚀 NEW TAB
//   ];

//   const fetchMasterData = async () => {
//     try {
//       const response = await api.get(`reports/${currentTab}/`);
//       setData(response.data);
//     } catch (error) {
//       console.error(`Error fetching ${currentTab}:`, error);
//     }
//   };

//   useEffect(() => {
//     fetchMasterData();
//     setFormData(initialFormState);
//     setEditId(null);
//     setSearchTerm(""); // Reset search on tab change
//   }, [currentTab]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     // Auto-capitalize GSTN
//     if (name === "gstn_no") {
//       setFormData({ ...formData, [name]: value.toUpperCase() });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");

//     let payload;

//     // 🚀 GSTN VALIDATION FOR SELLERS
//     if (currentTab === "sellers") {
//       const gstnRegex =
//         /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
//       if (!gstnRegex.test(formData.gstn_no)) {
//         return alert(
//           "Invalid GSTN format! It must be exactly 15 characters (e.g., 22AAAAA0000A1Z5)",
//         );
//       }
//       if (!formData.name)
//         return alert("Please select a Seller Name from the dropdown.");

//       payload = { name: formData.name, gstn_no: formData.gstn_no };
//     } else if (currentTab === "models") {
//       payload = {
//         asin_fsn: formData.asin_fsn,
//         model_name: formData.model_name,
//         model: formData.model,
//         sap_polyshri: formData.sap_polyshri,
//         sap_rio: formData.sap_rio,
//         sap_ne: formData.sap_ne,
//         sap_sms: formData.sap_sms,
//         sap_smmpl: formData.sap_smmpl,
//       };
//     } else {
//       payload = { name: formData.name };
//     }

//     setLoading(true);
//     try {
//       if (editId) {
//         await api.put(`reports/${currentTab}/${editId}/`, payload);
//       } else {
//         await api.post(`reports/${currentTab}/`, payload);
//       }

//       setFormData(initialFormState);
//       setEditId(null);
//       setIsModalOpen(false);
//       fetchMasterData();
//     } catch (error) {
//       alert(
//         "Backend Error: " +
//           (error.response?.data
//             ? JSON.stringify(error.response.data)
//             : "Server failed."),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // EXCEL UPLOAD FUNCTIONS
//   const handleFileChange = (e) => {
//     if (e.target.files.length > 0) setFile(e.target.files[0]);
//   };

//   const handleUploadSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select an Excel file first.");
//     const formDataObj = new FormData();
//     formDataObj.append("file", file);

//     setLoading(true);
//     try {
//       const res = await api.post("reports/models/upload/", formDataObj);
//       alert(res.data.message || "Data Uploaded Successfully!");
//       setUploadModalOpen(false);
//       setFile(null);
//       fetchMasterData();
//     } catch (error) {
//       alert(
//         "Upload Failed: " + (error.response?.data?.error || "Unknown Error"),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddNew = () => {
//     setFormData(initialFormState);
//     setEditId(null);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (item) => {
//     if (currentTab === "models") {
//       setFormData(item);
//     } else if (currentTab === "sellers") {
//       setFormData({
//         ...initialFormState,
//         name: item.name,
//         gstn_no: item.gstn_no,
//       });
//     } else {
//       setFormData({ ...initialFormState, name: item.name });
//     }
//     setEditId(item.id);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");
//     if (
//       window.confirm(
//         "Delete this entry? It will disappear from all dropdowns globally.",
//       )
//     ) {
//       try {
//         await api.delete(`reports/${currentTab}/${id}/`);
//         fetchMasterData();
//       } catch (error) {
//         alert("Delete failed.");
//       }
//     }
//   };

//   const handleDownloadTemplate = () => {
//     const headers = [
//       "asin_fsn",
//       "model_name",
//       "model",
//       "sap_polyshri",
//       "sap_rio",
//       "sap_ne",
//       "sap_sms",
//       "sap_smmpl",
//     ];
//     const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "Model_Master_Template.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const title = currentTab
//     ? currentTab.charAt(0).toUpperCase() + currentTab.slice(1, -1)
//     : "";

//   // 🚀 SEARCH FILTER LOGIC
//   const filteredData = data.filter((item) => {
//     if (!searchTerm) return true;
//     const s = searchTerm.toLowerCase();

//     if (currentTab === "models") {
//       return (
//         item.asin_fsn?.toLowerCase().includes(s) ||
//         item.model_name?.toLowerCase().includes(s) ||
//         item.model?.toLowerCase().includes(s)
//       );
//     } else if (currentTab === "sellers") {
//       return (
//         item.name?.toLowerCase().includes(s) ||
//         item.gstn_no?.toLowerCase().includes(s)
//       );
//     } else {
//       return item.name?.toLowerCase().includes(s);
//     }
//   });

//   return (
//     <div className="bg-[#f8fafc] min-h-screen font-sans pb-10">
//       {/* PAGE HEADER */}
//       <div className="mb-2">
//         <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
//           Masters
//         </h1>
//         <p className="text-xs text-slate-500 font-medium mt-1">
//           Manage core reference data used across the whole console
//         </p>
//       </div>

//       {/* TABS NAVIGATION */}
//       <div className="flex border-b border-gray-200 mt-6 mb-6 overflow-x-auto custom-scrollbar">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => navigate(`/master/${tab.id}`)}
//             className={`px-8 py-3 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200 ${
//               currentTab === tab.id
//                 ? "border-b-2 border-amber-500 text-slate-900"
//                 : "text-slate-400 hover:text-slate-700 hover:bg-slate-50/50"
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
//         {/* CARD HEADER WITH SEARCH & ICONS */}
//         <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-gray-100 bg-white gap-4">
//           <div className="flex items-center gap-4 w-full md:w-auto">
//             <h2 className="text-base font-bold text-slate-800 whitespace-nowrap">
//               {title}
//             </h2>

//             {/* 🔥 SEARCH BAR */}
//             <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-200 transition-all min-w-[250px]">
//               <i className="fas fa-search text-gray-400 text-xs"></i>
//               <input
//                 type="text"
//                 placeholder={`Search in ${currentTab}...`}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="bg-transparent border-none outline-none ml-2 text-xs w-full font-medium text-slate-700"
//               />
//             </div>
//           </div>

//           {role === "ADMIN" && (
//             <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-lg shadow-sm">
//               {currentTab === "models" && (
//                 <>
//                   {/* 📥 DOWNLOAD TEMPLATE ICON */}
//                   <button
//                     onClick={handleDownloadTemplate}
//                     title="Download Template"
//                     className="p-1.5 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-md transition relative group"
//                   >
//                     <i className="fas fa-file-csv text-sm"></i>
//                   </button>
//                   <div className="w-[1px] h-4 bg-slate-200"></div>

//                   {/* 📤 UPLOAD EXCEL ICON */}
//                   <button
//                     onClick={() => setUploadModalOpen(true)}
//                     title="Upload Excel"
//                     className="p-1.5 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-md transition"
//                   >
//                     <i className="fas fa-file-excel text-sm"></i>
//                   </button>
//                   <div className="w-[1px] h-4 bg-slate-200"></div>
//                 </>
//               )}

//               {/* ➕ ADD NEW ICON */}
//               <button
//                 onClick={handleAddNew}
//                 title={`Add New ${title}`}
//                 className="p-1.5 text-amber-600 hover:bg-amber-100 hover:text-amber-700 rounded-md transition"
//               >
//                 <i className="fas fa-plus text-sm"></i>
//               </button>
//             </div>
//           )}
//         </div>

//         {/* FULL WIDTH TABLE */}
//         <div className="overflow-x-auto w-full custom-scrollbar max-h-[65vh]">
//           <table className="w-full text-left border-collapse min-w-max">
//             <thead className="bg-slate-50 border-b border-gray-100 text-slate-400 text-[10px] font-black uppercase tracking-widest sticky top-0">
//               <tr>
//                 <th className="p-4 w-16 pl-6">SR.NO</th>

//                 {currentTab === "models" ? (
//                   <>
//                     <th className="p-4">ASN/FSN</th>
//                     <th className="p-4">Model Name</th>
//                     <th className="p-4">Model</th>
//                     <th className="p-4 bg-slate-100/50">SAP Polyshri</th>
//                     <th className="p-4 bg-slate-100/50">SAP Rio</th>
//                     <th className="p-4 bg-slate-100/50">SAP NE</th>
//                     <th className="p-4 bg-slate-100/50">SAP SMS</th>
//                     <th className="p-4 bg-slate-100/50">SAP SMMPL</th>
//                   </>
//                 ) : currentTab === "sellers" ? (
//                   <>
//                     <th className="p-4">GSTN NUMBER</th>
//                     <th className="p-4">SELLER NAME (Mapped)</th>
//                   </>
//                 ) : (
//                   <th className="p-4">{title} NAME</th>
//                 )}

//                 {role === "ADMIN" && (
//                   <th className="p-4 text-center w-32 pr-6 sticky right-0 bg-slate-50">
//                     ACTION
//                   </th>
//                 )}
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-100 text-sm">
//               {filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan="10" className="p-12 text-center text-slate-400">
//                     <i className="fas fa-search text-3xl mb-3 opacity-20"></i>
//                     <p className="font-medium text-sm">No records found.</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((item, index) => (
//                   <tr
//                     key={item.id}
//                     className="hover:bg-slate-50/50 transition-colors group"
//                   >
//                     <td className="p-4 pl-6 text-slate-500 font-mono text-[11px] font-bold">
//                       {index + 1}
//                     </td>

//                     {currentTab === "models" ? (
//                       <>
//                         <td className="p-4 font-mono font-bold text-slate-900 text-[11px]">
//                           {item.asin_fsn}
//                         </td>
//                         <td className="p-4 font-bold text-slate-700 text-[12px]">
//                           {item.model_name}
//                         </td>
//                         <td className="p-4 text-slate-500 text-[12px]">
//                           {item.model || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_polyshri || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_rio || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_ne || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_sms || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_smmpl || "-"}
//                         </td>
//                       </>
//                     ) : currentTab === "sellers" ? (
//                       <>
//                         <td className="p-4 font-mono font-bold text-amber-600 text-[12px] tracking-wide">
//                           {item.gstn_no}
//                         </td>
//                         <td className="p-4 font-bold text-slate-700 text-[13px]">
//                           {item.name}
//                         </td>
//                       </>
//                     ) : (
//                       <td className="p-4 font-bold text-slate-700 text-[13px]">
//                         {item.name}
//                       </td>
//                     )}

//                     {role === "ADMIN" && (
//                       <td className="p-4 text-center pr-6 sticky right-0 bg-white group-hover:bg-slate-50 transition-colors">
//                         <div className="flex justify-center items-center gap-2">
//                           <button
//                             onClick={() => handleEdit(item)}
//                             className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[11px] font-bold transition"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item.id)}
//                             className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded text-[11px] font-bold transition"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     )}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- ADD / EDIT FORM MODAL --- */}
//       {isModalOpen && role === "ADMIN" && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
//             <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
//               <h3 className="text-lg font-black text-slate-900 tracking-tight">
//                 {editId ? `Edit ${title}` : `Add New ${title}`}
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>

//             <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/30">
//               <form
//                 id="masterForm"
//                 onSubmit={handleSubmit}
//                 className="space-y-5"
//               >
//                 {/* 🚀 SELLERS FORM LOGIC */}
//                 {currentTab === "sellers" && (
//                   <>
//                     <div>
//                       <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                         GSTN Number (15 Digits){" "}
//                         <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         required
//                         maxLength={15}
//                         name="gstn_no"
//                         value={formData.gstn_no}
//                         onChange={handleInputChange}
//                         className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-none text-sm font-mono font-bold text-slate-800 transition shadow-sm uppercase tracking-widest placeholder:lowercase"
//                         placeholder="e.g. 23XXXXX1234X1ZX"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                         Mapped Seller Name{" "}
//                         <span className="text-red-500">*</span>
//                       </label>
//                       <select
//                         required
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-none text-sm font-bold text-slate-800 transition shadow-sm cursor-pointer"
//                       >
//                         <option value="">-- Select SAP Mapped Name --</option>
//                         <option value="Manual/SAP_Poly">Manual/SAP_Poly</option>
//                         <option value="Manual/SAP_SMS">Manual/SAP_SMS</option>
//                         <option value="Manual/SAP_SMMPL">
//                           Manual/SAP_SMMPL
//                         </option>
//                         <option value="Manual/SAP_Rio">Manual/SAP_Rio</option>
//                         <option value="Manual/SAP_NE">Manual/SAP_NE</option>
//                       </select>
//                     </div>
//                   </>
//                 )}

//                 {/* OTHER SIMPLE TABS */}
//                 {currentTab !== "models" && currentTab !== "sellers" && (
//                   <div>
//                     <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                       {title} Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-slate-500 focus:ring-1 focus:ring-slate-200 outline-none text-sm font-bold text-slate-800 transition shadow-sm"
//                       placeholder={`Enter ${title} name...`}
//                     />
//                   </div>
//                 )}

//                 {/* MODELS TAB */}
//                 {currentTab === "models" && (
//                   <>
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                           ASN / FSN <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           name="asin_fsn"
//                           value={formData.asin_fsn || ""}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-slate-500 outline-none text-sm font-mono font-bold text-slate-800 shadow-sm"
//                           placeholder="e.g. B08KH5..."
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                           Model Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           name="model_name"
//                           value={formData.model_name || ""}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-slate-500 outline-none text-sm font-medium text-slate-800 shadow-sm"
//                           placeholder="e.g. Realme P4..."
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                           Model
//                         </label>
//                         <input
//                           type="text"
//                           name="model"
//                           value={formData.model || ""}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-slate-500 outline-none text-sm font-medium text-slate-800 shadow-sm"
//                           placeholder="Model specific info"
//                         />
//                       </div>
//                     </div>

//                     <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 mt-2">
//                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
//                         <i className="fas fa-server"></i> SAP Configurations
//                       </p>
//                       <div className="grid grid-cols-2 gap-4">
//                         {[
//                           "sap_polyshri",
//                           "sap_rio",
//                           "sap_ne",
//                           "sap_sms",
//                           "sap_smmpl",
//                         ].map((sapKey) => (
//                           <div
//                             key={sapKey}
//                             className={
//                               sapKey === "sap_smmpl" ? "col-span-2" : ""
//                             }
//                           >
//                             <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                               {sapKey.replace("_", " ")}
//                             </label>
//                             <input
//                               type="text"
//                               name={sapKey}
//                               value={formData[sapKey] || ""}
//                               onChange={handleInputChange}
//                               className="w-full bg-white border border-gray-200 p-2 rounded-md focus:border-slate-400 outline-none text-xs font-bold text-slate-700 shadow-sm"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </form>
//             </div>

//             <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg text-xs uppercase tracking-wider transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="masterForm"
//                 disabled={loading}
//                 className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
//               >
//                 {loading ? "Saving..." : editId ? "Update Data" : "Save Record"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- UPLOAD EXCEL MODAL --- */}
//       {isUploadModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
//             <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
//               <h2 className="text-xl font-black text-slate-900 tracking-tight">
//                 Bulk Upload Models
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
//                   className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition shadow-md disabled:opacity-50"
//               >
//                 {loading ? "Uploading..." : "Sync Database"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api/axios";

// export default function MasterManager() {
//   const { type } = useParams();
//   const navigate = useNavigate();

//   // 🔥 ADDED "sellers" IN TABS
//   const currentTab = type || "firms";

//   const [data, setData] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // 🔥 SEARCH STATE ADDED
//   const [searchTerm, setSearchTerm] = useState("");

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isUploadModalOpen, setUploadModalOpen] = useState(false);
//   const [file, setFile] = useState(null);

//   const role = localStorage.getItem("user_role") || "USER";

//   // 🔥 INITIAL STATE MEIN SAARI ENTRIES HAI
//   const initialFormState = {
//     name: "",
//     asin_fsn: "",
//     model_name: "",
//     model: "",
//     sap_polyshri: "",
//     sap_rio: "",
//     sap_ne: "",
//     sap_sms: "",
//     sap_smmpl: "",
//     gstn_no: "",
//   };
//   const [formData, setFormData] = useState(initialFormState);

//   const tabs = [
//     { id: "firms", label: "Firm" },
//     { id: "locations", label: "Location" },
//     { id: "merchants", label: "Merchant" },
//     { id: "models", label: "Model" },
//     { id: "sellers", label: "Vendor / Seller" }, // 🚀 NEW TAB
//   ];

//   const fetchMasterData = async () => {
//     try {
//       const response = await api.get(`reports/${currentTab}/`);
//       setData(response.data);
//     } catch (error) {
//       console.error(`Error fetching ${currentTab}:`, error);
//     }
//   };

//   useEffect(() => {
//     fetchMasterData();
//     setFormData(initialFormState);
//     setEditId(null);
//     setSearchTerm(""); // Reset search on tab change
//   }, [currentTab]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     // Auto-capitalize GSTN
//     if (name === "gstn_no") {
//       setFormData({ ...formData, [name]: value.toUpperCase() });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");

//     let payload;

//     // 🚀 GSTN & FULL SAP MAPPING VALIDATION FOR SELLERS
//     if (currentTab === "sellers") {
//       const gstnRegex = /^[A-Z0-9]{15}$/;
//       if (!gstnRegex.test(formData.gstn_no)) {
//         return alert(
//           "Invalid GSTN! It must be exactly 15 alphanumeric characters.",
//         );
//       }
//       if (!formData.name) return alert("Please enter a Seller Name.");

//       payload = {
//         name: formData.name,
//         gstn_no: formData.gstn_no,
//         sap_polyshri: formData.sap_polyshri,
//         sap_rio: formData.sap_rio,
//         sap_ne: formData.sap_ne,
//         sap_sms: formData.sap_sms,
//         sap_smmpl: formData.sap_smmpl,
//       };
//     } else if (currentTab === "models") {
//       payload = {
//         asin_fsn: formData.asin_fsn,
//         model_name: formData.model_name,
//         model: formData.model,
//         sap_polyshri: formData.sap_polyshri,
//         sap_rio: formData.sap_rio,
//         sap_ne: formData.sap_ne,
//         sap_sms: formData.sap_sms,
//         sap_smmpl: formData.sap_smmpl,
//       };
//     } else {
//       payload = { name: formData.name };
//     }

//     setLoading(true);
//     try {
//       if (editId) {
//         await api.put(`reports/${currentTab}/${editId}/`, payload);
//       } else {
//         await api.post(`reports/${currentTab}/`, payload);
//       }

//       setFormData(initialFormState);
//       setEditId(null);
//       setIsModalOpen(false);
//       fetchMasterData();
//     } catch (error) {
//       alert(
//         "Backend Error: " +
//           (error.response?.data
//             ? JSON.stringify(error.response.data)
//             : "Server failed."),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // EXCEL UPLOAD FUNCTIONS
//   const handleFileChange = (e) => {
//     if (e.target.files.length > 0) setFile(e.target.files[0]);
//   };

//   const handleUploadSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return alert("Please select an Excel file first.");
//     const formDataObj = new FormData();
//     formDataObj.append("file", file);

//     setLoading(true);
//     try {
//       const res = await api.post("reports/models/upload/", formDataObj);
//       alert(res.data.message || "Data Uploaded Successfully!");
//       setUploadModalOpen(false);
//       setFile(null);
//       fetchMasterData();
//     } catch (error) {
//       alert(
//         "Upload Failed: " + (error.response?.data?.error || "Unknown Error"),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddNew = () => {
//     setFormData(initialFormState);
//     setEditId(null);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (item) => {
//     if (currentTab === "models" || currentTab === "sellers") {
//       setFormData(item);
//     } else {
//       setFormData({ ...initialFormState, name: item.name });
//     }
//     setEditId(item.id);
//     setIsModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");
//     if (
//       window.confirm(
//         "Delete this entry? It will disappear from all dropdowns globally.",
//       )
//     ) {
//       try {
//         await api.delete(`reports/${currentTab}/${id}/`);
//         fetchMasterData();
//       } catch (error) {
//         alert("Delete failed.");
//       }
//     }
//   };

//   const handleDownloadTemplate = () => {
//     const headers = [
//       "asin_fsn",
//       "model_name",
//       "model",
//       "sap_polyshri",
//       "sap_rio",
//       "sap_ne",
//       "sap_sms",
//       "sap_smmpl",
//     ];
//     const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "Model_Master_Template.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const title = currentTab
//     ? currentTab.charAt(0).toUpperCase() + currentTab.slice(1, -1)
//     : "";

//   // Dynamic Add Button Text
//   const addButtonText =
//     currentTab === "sellers" ? "Add New Vendor/Seller" : `Add New ${title}`;

//   // 🚀 SEARCH FILTER LOGIC
//   const filteredData = data.filter((item) => {
//     if (!searchTerm) return true;
//     const s = searchTerm.toLowerCase();

//     if (currentTab === "models") {
//       return (
//         item.asin_fsn?.toLowerCase().includes(s) ||
//         item.model_name?.toLowerCase().includes(s) ||
//         item.model?.toLowerCase().includes(s)
//       );
//     } else if (currentTab === "sellers") {
//       return (
//         item.name?.toLowerCase().includes(s) ||
//         item.gstn_no?.toLowerCase().includes(s)
//       );
//     } else {
//       return item.name?.toLowerCase().includes(s);
//     }
//   });

//   return (
//     <div className="bg-[#f8fafc] min-h-screen font-sans pb-10">
//       {/* PAGE HEADER */}
//       <div className="mb-2">
//         <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
//           Masters
//         </h1>
//         <p className="text-xs text-slate-500 font-medium mt-1">
//           Manage core reference data used across the whole console
//         </p>
//       </div>

//       {/* TABS NAVIGATION */}
//       <div className="flex border-b border-gray-200 mt-6 mb-6 overflow-x-auto custom-scrollbar">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => navigate(`/master/${tab.id}`)}
//             className={`px-8 py-3 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200 ${
//               currentTab === tab.id
//                 ? "border-b-2 border-amber-500 text-slate-900"
//                 : "text-slate-400 hover:text-slate-700 hover:bg-slate-50/50"
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* MAIN CONTENT AREA */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
//         {/* CARD HEADER WITH SEARCH & ICONS */}
//         <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-gray-100 bg-white gap-4">
//           <div className="flex items-center gap-4 w-full md:w-auto">
//             <h2 className="text-base font-bold text-slate-800 whitespace-nowrap">
//               {title}
//             </h2>

//             {/* 🔥 SEARCH BAR */}
//             <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-200 transition-all min-w-[250px]">
//               <i className="fas fa-search text-gray-400 text-xs"></i>
//               <input
//                 type="text"
//                 placeholder={`Search in ${currentTab}...`}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="bg-transparent border-none outline-none ml-2 text-xs w-full font-medium text-slate-700"
//               />
//             </div>
//           </div>

//           {role === "ADMIN" && (
//             <div className="flex items-center gap-2">
//               {currentTab === "models" && (
//                 <>
//                   {/* 📥 DOWNLOAD TEMPLATE ICON WITH TEXT */}
//                   <button
//                     onClick={handleDownloadTemplate}
//                     title="Download Template"
//                     className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 rounded-md transition"
//                   >
//                     <i className="fas fa-file-csv text-sm"></i>
//                     <span className="text-xs font-bold uppercase tracking-wider">
//                       Template
//                     </span>
//                   </button>

//                   {/* 📤 UPLOAD EXCEL ICON WITH TEXT */}
//                   <button
//                     onClick={() => setUploadModalOpen(true)}
//                     title="Upload Excel"
//                     className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 rounded-md transition"
//                   >
//                     <i className="fas fa-file-excel text-sm"></i>
//                     <span className="text-xs font-bold uppercase tracking-wider">
//                       Upload
//                     </span>
//                   </button>
//                 </>
//               )}

//               {/* ➕ ADD NEW ICON WITH TEXT */}
//               <button
//                 onClick={handleAddNew}
//                 title={`Add New ${title}`}
//                 className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100 rounded-md transition"
//               >
//                 <i className="fas fa-plus text-sm"></i>
//                 <span className="text-xs font-bold uppercase tracking-wider">
//                   {addButtonText}
//                 </span>
//               </button>
//             </div>
//           )}
//         </div>

//         {/* FULL WIDTH TABLE */}
//         <div className="overflow-x-auto w-full custom-scrollbar max-h-[65vh]">
//           <table className="w-full text-left border-collapse min-w-max">
//             {/* 🔥 CLEAN WHITE HEADERS LIKE SCREENSHOT */}
//             <thead className="bg-white border-b border-gray-200 text-slate-400 text-[10px] font-black uppercase tracking-widest sticky top-0">
//               <tr>
//                 <th className="p-4 w-16 pl-6">SR.NO</th>

//                 {currentTab === "models" ? (
//                   <>
//                     <th className="p-4">ASN/FSN</th>
//                     <th className="p-4">Model Name</th>
//                     <th className="p-4">Model</th>
//                     <th className="p-4 bg-slate-50/50">SAP Polyshri</th>
//                     <th className="p-4 bg-slate-50/50">SAP Rio</th>
//                     <th className="p-4 bg-slate-50/50">SAP NE</th>
//                     <th className="p-4 bg-slate-50/50">SAP SMS</th>
//                     <th className="p-4 bg-slate-50/50">SAP SMMPL</th>
//                   </>
//                 ) : currentTab === "sellers" ? (
//                   <>
//                     {/* 🔥 SELLER TAB HAS ALL SAP ENTRIES NOW */}
//                     <th className="p-4">GSTN NUMBER</th>
//                     <th className="p-4">SELLER NAME</th>
//                     <th className="p-4 bg-slate-50/50">SAP Polyshri</th>
//                     <th className="p-4 bg-slate-50/50">SAP Rio</th>
//                     <th className="p-4 bg-slate-50/50">SAP NE</th>
//                     <th className="p-4 bg-slate-50/50">SAP SMS</th>
//                     <th className="p-4 bg-slate-50/50">SAP SMMPL</th>
//                   </>
//                 ) : (
//                   <th className="p-4">{title} NAME</th>
//                 )}

//                 {role === "ADMIN" && (
//                   <th className="p-4 text-center w-32 pr-6 sticky right-0 bg-white">
//                     ACTION
//                   </th>
//                 )}
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-100 text-sm">
//               {filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan="10" className="p-12 text-center text-slate-400">
//                     <i className="fas fa-search text-3xl mb-3 opacity-20"></i>
//                     <p className="font-medium text-sm">No records found.</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((item, index) => (
//                   <tr
//                     key={item.id}
//                     className="hover:bg-slate-50/50 transition-colors group"
//                   >
//                     <td className="p-4 pl-6 text-slate-500 font-mono text-[11px] font-bold">
//                       {index + 1}
//                     </td>

//                     {currentTab === "models" ? (
//                       <>
//                         <td className="p-4 font-mono font-bold text-slate-900 text-[11px]">
//                           {item.asin_fsn}
//                         </td>
//                         <td className="p-4 font-bold text-slate-700 text-[12px]">
//                           {item.model_name}
//                         </td>
//                         <td className="p-4 text-slate-500 text-[12px]">
//                           {item.model || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_polyshri || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_rio || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_ne || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_sms || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_smmpl || "-"}
//                         </td>
//                       </>
//                     ) : currentTab === "sellers" ? (
//                       <>
//                         {/* 🔥 FULL SELLER ROW UI */}
//                         <td className="p-4 font-mono font-bold text-amber-600 text-[12px] tracking-wide">
//                           {item.gstn_no}
//                         </td>
//                         <td className="p-4 font-bold text-slate-700 text-[13px]">
//                           {item.name}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_polyshri || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_rio || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_ne || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_sms || "-"}
//                         </td>
//                         <td className="p-4 text-[11px] text-slate-400 font-mono">
//                           {item.sap_smmpl || "-"}
//                         </td>
//                       </>
//                     ) : (
//                       <td className="p-4 font-bold text-slate-700 text-[13px]">
//                         {item.name}
//                       </td>
//                     )}

//                     {role === "ADMIN" && (
//                       <td className="p-4 text-center pr-6 sticky right-0 bg-white group-hover:bg-slate-50 transition-colors">
//                         <div className="flex justify-center items-center gap-2">
//                           <button
//                             onClick={() => handleEdit(item)}
//                             className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[11px] font-bold transition"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item.id)}
//                             className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded text-[11px] font-bold transition"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     )}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- ADD / EDIT FORM MODAL --- */}
//       {isModalOpen && role === "ADMIN" && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
//             <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
//               <h3 className="text-lg font-black text-slate-900 tracking-tight">
//                 {editId ? `Edit ${title}` : addButtonText}
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>

//             <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/30">
//               <form
//                 id="masterForm"
//                 onSubmit={handleSubmit}
//                 className="space-y-5"
//               >
//                 {/* 🚀 SELLERS FORM LOGIC (ALL FIELDS) */}
//                 {currentTab === "sellers" && (
//                   <>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                           GSTN Number <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           maxLength={15}
//                           name="gstn_no"
//                           value={formData.gstn_no}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-amber-500 outline-none text-sm font-mono font-bold text-slate-800 transition shadow-sm uppercase tracking-widest placeholder:lowercase"
//                           placeholder="e.g. 23XXXX..."
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                           Seller Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           name="name"
//                           value={formData.name}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-amber-500 outline-none text-sm font-bold text-slate-800 shadow-sm"
//                           placeholder="e.g. Cloudtail"
//                         />
//                       </div>
//                     </div>

//                     {/* 🔥 SAP CONFIGURATIONS FOR SELLERS */}
//                     <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 mt-2">
//                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
//                         <i className="fas fa-server"></i> SAP Configurations
//                         (Seller)
//                       </p>
//                       <div className="grid grid-cols-2 gap-4">
//                         {[
//                           "sap_polyshri",
//                           "sap_rio",
//                           "sap_ne",
//                           "sap_sms",
//                           "sap_smmpl",
//                         ].map((sapKey) => (
//                           <div
//                             key={sapKey}
//                             className={
//                               sapKey === "sap_smmpl" ? "col-span-2" : ""
//                             }
//                           >
//                             <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                               {sapKey.replace("_", " ")}
//                             </label>
//                             <input
//                               type="text"
//                               name={sapKey}
//                               value={formData[sapKey] || ""}
//                               onChange={handleInputChange}
//                               className="w-full bg-white border border-gray-200 p-2 rounded-md focus:border-amber-500 outline-none text-xs font-bold text-slate-700 shadow-sm"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* OTHER SIMPLE TABS */}
//                 {currentTab !== "models" && currentTab !== "sellers" && (
//                   <div>
//                     <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                       {title} Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-slate-500 focus:ring-1 focus:ring-slate-200 outline-none text-sm font-bold text-slate-800 transition shadow-sm"
//                       placeholder={`Enter ${title} name...`}
//                     />
//                   </div>
//                 )}

//                 {/* MODELS TAB */}
//                 {currentTab === "models" && (
//                   <>
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                           ASN / FSN <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           name="asin_fsn"
//                           value={formData.asin_fsn || ""}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-slate-500 outline-none text-sm font-mono font-bold text-slate-800 shadow-sm"
//                           placeholder="e.g. B08KH5..."
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                           Model Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           name="model_name"
//                           value={formData.model_name || ""}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-slate-500 outline-none text-sm font-medium text-slate-800 shadow-sm"
//                           placeholder="e.g. Realme P4..."
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                           Model
//                         </label>
//                         <input
//                           type="text"
//                           name="model"
//                           value={formData.model || ""}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-slate-500 outline-none text-sm font-medium text-slate-800 shadow-sm"
//                           placeholder="Model specific info"
//                         />
//                       </div>
//                     </div>

//                     <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 mt-2">
//                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
//                         <i className="fas fa-server"></i> SAP Configurations
//                         (Model)
//                       </p>
//                       <div className="grid grid-cols-2 gap-4">
//                         {[
//                           "sap_polyshri",
//                           "sap_rio",
//                           "sap_ne",
//                           "sap_sms",
//                           "sap_smmpl",
//                         ].map((sapKey) => (
//                           <div
//                             key={sapKey}
//                             className={
//                               sapKey === "sap_smmpl" ? "col-span-2" : ""
//                             }
//                           >
//                             <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                               {sapKey.replace("_", " ")}
//                             </label>
//                             <input
//                               type="text"
//                               name={sapKey}
//                               value={formData[sapKey] || ""}
//                               onChange={handleInputChange}
//                               className="w-full bg-white border border-gray-200 p-2 rounded-md focus:border-slate-400 outline-none text-xs font-bold text-slate-700 shadow-sm"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </form>
//             </div>

//             <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
//               <button
//                 type="button"
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg text-xs uppercase tracking-wider transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="masterForm"
//                 disabled={loading}
//                 className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
//               >
//                 {loading ? "Saving..." : editId ? "Update Data" : "Save Record"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* --- UPLOAD EXCEL MODAL --- */}
//       {isUploadModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
//             <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
//               <h2 className="text-xl font-black text-slate-900 tracking-tight">
//                 Bulk Upload Models
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
//                   className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition shadow-md disabled:opacity-50"
//               >
//                 {loading ? "Uploading..." : "Sync Database"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function MasterManager() {
  const { type } = useParams();
  const navigate = useNavigate();

  const currentTab = type || "firms";

  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [file, setFile] = useState(null);

  const role = localStorage.getItem("user_role") || "USER";

  const initialFormState = {
    name: "",
    asin_fsn: "",
    model_name: "",
    model: "",
    sap_polyshri: "",
    sap_rio: "",
    sap_ne: "",
    sap_sms: "",
    sap_smmpl: "",
    gstn_no: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const tabs = [
    { id: "firms", label: "Firm" },
    { id: "locations", label: "Location" },
    { id: "merchants", label: "Merchant" },
    { id: "models", label: "Model" },
    { id: "sellers", label: "Vendor / Seller" },
  ];

  const fetchMasterData = async () => {
    try {
      const response = await api.get(`reports/${currentTab}/`);
      setData(response.data);
    } catch (error) {
      console.error(`Error fetching ${currentTab}:`, error);
    }
  };

  useEffect(() => {
    fetchMasterData();
    setFormData(initialFormState);
    setEditId(null);
    setSearchTerm("");
  }, [currentTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "gstn_no") {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");

    let payload;

    if (currentTab === "sellers") {
      const gstnRegex = /^[A-Z0-9]{15}$/;
      if (!gstnRegex.test(formData.gstn_no)) {
        return alert(
          "Invalid GSTN! It must be exactly 15 alphanumeric characters.",
        );
      }
      if (!formData.name) return alert("Please enter a Seller Name.");

      payload = {
        name: formData.name,
        gstn_no: formData.gstn_no,
        sap_polyshri: formData.sap_polyshri,
        sap_rio: formData.sap_rio,
        sap_ne: formData.sap_ne,
        sap_sms: formData.sap_sms,
        sap_smmpl: formData.sap_smmpl,
      };
    } else if (currentTab === "models") {
      payload = {
        asin_fsn: formData.asin_fsn,
        model_name: formData.model_name,
        model: formData.model,
        sap_polyshri: formData.sap_polyshri,
        sap_rio: formData.sap_rio,
        sap_ne: formData.sap_ne,
        sap_sms: formData.sap_sms,
        sap_smmpl: formData.sap_smmpl,
      };
    } else {
      payload = { name: formData.name };
    }

    setLoading(true);
    try {
      if (editId) {
        await api.put(`reports/${currentTab}/${editId}/`, payload);
      } else {
        await api.post(`reports/${currentTab}/`, payload);
      }

      setFormData(initialFormState);
      setEditId(null);
      setIsModalOpen(false);
      fetchMasterData();
    } catch (error) {
      alert(
        "Backend Error: " +
          (error.response?.data
            ? JSON.stringify(error.response.data)
            : "Server failed."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an Excel file first.");
    const formDataObj = new FormData();
    formDataObj.append("file", file);

    setLoading(true);
    try {
      const endpoint =
        currentTab === "sellers"
          ? "reports/sellers/upload/"
          : "reports/models/upload/";
      const res = await api.post(endpoint, formDataObj);
      alert(res.data.message || "Data Uploaded Successfully!");
      setUploadModalOpen(false);
      setFile(null);
      fetchMasterData();
    } catch (error) {
      alert(
        "Upload Failed: " + (error.response?.data?.error || "Unknown Error"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setEditId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    if (currentTab === "models" || currentTab === "sellers") {
      setFormData(item);
    } else {
      setFormData({ ...initialFormState, name: item.name });
    }
    setEditId(item.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");
    if (
      window.confirm(
        "Delete this entry? It will disappear from all dropdowns globally.",
      )
    ) {
      try {
        await api.delete(`reports/${currentTab}/${id}/`);
        fetchMasterData();
      } catch (error) {
        alert("Delete failed.");
      }
    }
  };

  const handleDownloadTemplate = () => {
    let headers = [];
    let fileName = "";

    if (currentTab === "models") {
      headers = [
        "asin_fsn",
        "model_name",
        "model",
        "sap_polyshri",
        "sap_rio",
        "sap_ne",
        "sap_sms",
        "sap_smmpl",
      ];
      fileName = "Model_Master_Template.csv";
    } else if (currentTab === "sellers") {
      headers = [
        "gstn_no",
        "name",
        "sap_polyshri",
        "sap_rio",
        "sap_ne",
        "sap_sms",
        "sap_smmpl",
      ];
      fileName = "Seller_Vendor_Template.csv";
    }

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const title = currentTab
    ? currentTab.charAt(0).toUpperCase() + currentTab.slice(1, -1)
    : "";
  const addButtonText =
    currentTab === "sellers"
      ? "ADD NEW VENDOR/SELLER"
      : `ADD NEW ${title.toUpperCase()}`;

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();

    if (currentTab === "models") {
      return (
        item.asin_fsn?.toLowerCase().includes(s) ||
        item.model_name?.toLowerCase().includes(s) ||
        item.model?.toLowerCase().includes(s)
      );
    } else if (currentTab === "sellers") {
      return (
        item.name?.toLowerCase().includes(s) ||
        item.gstn_no?.toLowerCase().includes(s)
      );
    } else {
      return item.name?.toLowerCase().includes(s);
    }
  });

  const uploadHeaders =
    currentTab === "models"
      ? [
          "ASIN/FSN",
          "Model Name",
          "Model",
          "SAP Polyshri",
          "SAP Rio",
          "SAP NE",
          "SAP SMS",
          "SAP SMMPL",
        ]
      : [
          "GSTN Number",
          "Seller Name",
          "SAP Polyshri",
          "SAP Rio",
          "SAP NE",
          "SAP SMS",
          "SAP SMMPL",
        ];

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-10">
      <div className="mb-2">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Masters
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Manage core reference data used across the whole console
        </p>
      </div>

      <div className="flex border-b border-gray-200 mt-6 mb-6 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(`/master/${tab.id}`)}
            className={`px-6 py-3 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200 mr-4 ${
              currentTab === tab.id
                ? "border-b-2 border-amber-500 text-slate-900"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-gray-100 bg-white gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <h2 className="text-base font-bold text-slate-800 whitespace-nowrap">
              {currentTab === "sellers" ? "Vendor / Seller" : title}
            </h2>
            <div className="flex items-center bg-white px-3 py-2 rounded-md border border-gray-200 focus-within:border-amber-400 transition-all min-w-[280px]">
              <i className="fas fa-search text-gray-300 text-sm"></i>
              <input
                type="text"
                placeholder={`Search in ${currentTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none ml-2 text-sm w-full font-medium text-slate-600"
              />
            </div>
          </div>

          {role === "ADMIN" && (
            <div className="flex items-center gap-3">
              {(currentTab === "models" || currentTab === "sellers") && (
                <div className="flex gap-3">
                  <button
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded text-[11px] font-bold uppercase tracking-wider transition"
                  >
                    <i className="fas fa-arrow-down"></i> 
                  </button>

                  <button
                    onClick={() => setUploadModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 rounded text-[11px] font-bold uppercase tracking-wider transition"
                  >
                    <i className="fas fa-file-excel"></i> 
                  </button>
                </div>
              )}

              <button
                onClick={handleAddNew}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 rounded text-[11px] font-bold uppercase tracking-wider transition"
              >
                <i className="fas fa-plus"></i> {addButtonText}
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto w-full custom-scrollbar min-h-[400px]">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-white border-b border-gray-100 text-[#94a3b8] text-[10px] font-bold uppercase tracking-widest sticky top-0">
              <tr>
                <th className="p-4 w-16 pl-6">SR.NO</th>

                {currentTab === "models" ? (
                  <>
                    <th className="p-4">ASN/FSN</th>
                    <th className="p-4">Model Name</th>
                    <th className="p-4">Model</th>
                    <th className="p-4 bg-slate-50/50">SAP Polyshri</th>
                    <th className="p-4 bg-slate-50/50">SAP Rio</th>
                    <th className="p-4 bg-slate-50/50">SAP NE</th>
                    <th className="p-4 bg-slate-50/50">SAP SMS</th>
                    <th className="p-4 bg-slate-50/50">SAP SMMPL</th>
                  </>
                ) : currentTab === "sellers" ? (
                  <>
                    <th className="p-4">GSTN NUMBER</th>
                    <th className="p-4">SELLER NAME</th>
                    <th className="p-4 bg-slate-50/50">SAP Polyshri</th>
                    <th className="p-4 bg-slate-50/50">SAP Rio</th>
                    <th className="p-4 bg-slate-50/50">SAP NE</th>
                    <th className="p-4 bg-slate-50/50">SAP SMS</th>
                    <th className="p-4 bg-slate-50/50">SAP SMMPL</th>
                  </>
                ) : (
                  <th className="p-4">{title} NAME</th>
                )}

                {role === "ADMIN" && (
                  <th className="p-4 text-center w-32 pr-6 sticky right-0 bg-white">
                    ACTION
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-16 text-center text-slate-400">
                    <i className="fas fa-search text-4xl mb-4 text-slate-200 opacity-50 block"></i>
                    <p className="font-medium text-sm text-slate-400">
                      No records found.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="p-4 pl-6 text-slate-400 font-medium text-xs">
                      {index + 1}
                    </td>

                    {currentTab === "models" ? (
                      <>
                        <td className="p-4 font-mono font-medium text-slate-900 text-xs">
                          {item.asin_fsn}
                        </td>
                        <td className="p-4 font-bold text-slate-800 text-xs">
                          {item.model_name}
                        </td>
                        <td className="p-4 text-slate-500 text-xs">
                          {item.model || "-"}
                        </td>
                        <td className="p-4 text-xs text-slate-400 font-mono">
                          {item.sap_polyshri || "-"}
                        </td>
                        <td className="p-4 text-xs text-slate-400 font-mono">
                          {item.sap_rio || "-"}
                        </td>
                        <td className="p-4 text-xs text-slate-400 font-mono">
                          {item.sap_ne || "-"}
                        </td>
                        <td className="p-4 text-xs text-slate-400 font-mono">
                          {item.sap_sms || "-"}
                        </td>
                        <td className="p-4 text-xs text-slate-400 font-mono">
                          {item.sap_smmpl || "-"}
                        </td>
                      </>
                    ) : currentTab === "sellers" ? (
                      <>
                        <td className="p-4 font-mono font-bold text-slate-800 text-xs tracking-wide">
                          {item.gstn_no}
                        </td>
                        <td className="p-4 font-bold text-slate-800 text-xs">
                          {item.name}
                        </td>
                        <td className="p-4 text-xs text-slate-400 font-mono">
                          {item.sap_polyshri || "-"}
                        </td>
                        <td className="p-4 text-xs text-slate-400 font-mono">
                          {item.sap_rio || "-"}
                        </td>
                        <td className="p-4 text-xs text-slate-400 font-mono">
                          {item.sap_ne || "-"}
                        </td>
                        <td className="p-4 text-xs text-slate-400 font-mono">
                          {item.sap_sms || "-"}
                        </td>
                        <td className="p-4 text-xs text-slate-400 font-mono">
                          {item.sap_smmpl || "-"}
                        </td>
                      </>
                    ) : (
                      <td className="p-4 font-bold text-slate-800 text-xs">
                        {item.name}
                      </td>
                    )}

                    {role === "ADMIN" && (
                      <td className="p-4 text-center pr-6 sticky right-0 bg-white group-hover:bg-slate-50 transition-colors">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-gray-100 text-slate-600 rounded text-[10px] font-bold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded text-[10px] font-bold transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD / EDIT FORM MODAL --- */}
      {isModalOpen && role === "ADMIN" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {editId ? `Edit Record` : addButtonText}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar bg-white">
              <form
                id="masterForm"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* 🚀 SELLERS FORM (MANUAL INPUT FOR SELLER NAME) */}
                {currentTab === "sellers" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2">
                          GSTN Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={15}
                          name="gstn_no"
                          value={formData.gstn_no}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-amber-500 outline-none text-sm font-mono font-medium text-slate-800 transition uppercase placeholder:lowercase"
                          placeholder="e.g. 23xxxxx..."
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2">
                          Seller Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-amber-500 outline-none text-sm font-medium text-slate-800 transition shadow-sm"
                          placeholder="e.g. Next Era"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-xl border border-gray-100 mt-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <i className="fas fa-server"></i> SAP Configurations
                        (Seller)
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          "sap_polyshri",
                          "sap_rio",
                          "sap_ne",
                          "sap_sms",
                          "sap_smmpl",
                        ].map((sapKey) => (
                          <div
                            key={sapKey}
                            className={
                              sapKey === "sap_smmpl" ? "col-span-2" : ""
                            }
                          >
                            <label className="block text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest mb-1.5">
                              {sapKey.replace("_", " ")}
                            </label>
                            <input
                              type="text"
                              name={sapKey}
                              value={formData[sapKey] || ""}
                              onChange={handleInputChange}
                              className="w-full bg-white border border-gray-200 p-2 rounded-md focus:border-amber-500 outline-none text-xs font-medium text-slate-700"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {currentTab !== "models" && currentTab !== "sellers" && (
                  <div>
                    <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2">
                      {title} NAME <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-amber-500 outline-none text-sm font-bold text-slate-800 transition"
                      placeholder={`Enter ${title} name...`}
                    />
                  </div>
                )}

                {currentTab === "models" && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2">
                          ASN / FSN <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          name="asin_fsn"
                          value={formData.asin_fsn || ""}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-amber-500 outline-none text-sm font-mono font-medium text-slate-800"
                          placeholder="e.g. B08KH5..."
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2">
                          MODEL NAME <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          name="model_name"
                          value={formData.model_name || ""}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-amber-500 outline-none text-sm font-medium text-slate-800"
                          placeholder="e.g. Realme P4..."
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2">
                          MODEL
                        </label>
                        <input
                          type="text"
                          name="model"
                          value={formData.model || ""}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-amber-500 outline-none text-sm font-medium text-slate-800"
                          placeholder="Model specific info"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-xl border border-gray-100 mt-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <i className="fas fa-server"></i> SAP Configurations
                        (Model)
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          "sap_polyshri",
                          "sap_rio",
                          "sap_ne",
                          "sap_sms",
                          "sap_smmpl",
                        ].map((sapKey) => (
                          <div
                            key={sapKey}
                            className={
                              sapKey === "sap_smmpl" ? "col-span-2" : ""
                            }
                          >
                            <label className="block text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest mb-1.5">
                              {sapKey.replace("_", " ")}
                            </label>
                            <input
                              type="text"
                              name={sapKey}
                              value={formData[sapKey] || ""}
                              onChange={handleInputChange}
                              className="w-full bg-white border border-gray-200 p-2 rounded-md focus:border-amber-500 outline-none text-xs font-medium text-slate-700"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </form>
            </div>

            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-white">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-transparent hover:bg-slate-50 text-slate-600 font-bold rounded-lg text-xs uppercase tracking-wider transition"
              >
                CANCEL
              </button>
              <button
                type="submit"
                form="masterForm"
                disabled={loading}
                className="px-6 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
              >
                {loading ? "SAVING..." : "SAVE RECORD"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DYNAMIC UPLOAD EXCEL MODAL --- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Bulk Upload {currentTab === "sellers" ? "Sellers" : "Models"}
              </h2>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="mb-6 bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2.5">
                <i className="fas fa-info-circle text-indigo-500"></i>
                <h4 className="text-[10px] font-black text-indigo-800 uppercase tracking-widest">
                  Required Excel Headers
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {uploadHeaders.map((h, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-white border border-indigo-200 text-indigo-700 text-[10px] font-bold rounded shadow-sm"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div className="border-2 border-dashed border-gray-200 p-8 text-center rounded-xl bg-gray-50 mb-6 hover:bg-gray-100 transition-colors">
                <i className="fas fa-file-excel text-3xl text-emerald-500 mb-3 block"></i>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0f172a] hover:bg-slate-800 text-white py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition shadow-md disabled:opacity-50"
              >
                {loading ? "UPLOADING..." : "SYNC DATABASE"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}