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
//   const [searchTerm, setSearchTerm] = useState("");

//   const [isModalOpen, setIsModalOpen] = useState(false);
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
//     gstn_no: "",
//   };
//   const [formData, setFormData] = useState(initialFormState);

//   const tabs = [
//     { id: "firms", label: "FIRM" },
//     { id: "locations", label: "LOCATION" },
//     { id: "merchants", label: "MERCHANT" },
//     { id: "models", label: "MODEL" },
//     { id: "sellers", label: "VENDOR / SELLER" },
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
//     setSearchTerm("");
//   }, [currentTab]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "gstn_no")
//       setFormData({ ...formData, [name]: value.toUpperCase() });
//     else setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");

//     let payload;
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
//       if (editId) await api.put(`reports/${currentTab}/${editId}/`, payload);
//       else await api.post(`reports/${currentTab}/`, payload);
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
//       const endpoint =
//         currentTab === "sellers"
//           ? "reports/sellers/upload/"
//           : "reports/models/upload/";
//       const res = await api.post(endpoint, formDataObj);
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
//     if (currentTab === "models" || currentTab === "sellers") setFormData(item);
//     else setFormData({ ...initialFormState, name: item.name });
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
//     let headers = [];
//     let fileName = "";
//     if (currentTab === "models") {
//       headers = [
//         "asin_fsn",
//         "model_name",
//         "model",
//         "sap_polyshri",
//         "sap_rio",
//         "sap_ne",
//         "sap_sms",
//         "sap_smmpl",
//       ];
//       fileName = "Model_Master_Template.csv";
//     } else if (currentTab === "sellers") {
//       headers = [
//         "gstn_no",
//         "name",
//         "sap_polyshri",
//         "sap_rio",
//         "sap_ne",
//         "sap_sms",
//         "sap_smmpl",
//       ];
//       fileName = "Seller_Vendor_Template.csv";
//     }
//     const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.href = encodedUri;
//     link.download = fileName;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // 🔥 FIXED EXPORT DATA FUNCTION 🔥
//   const handleExportData = async () => {
//     try {
//       const endpoint =
//         currentTab === "sellers"
//           ? "reports/sellers/export_data/"
//           : "reports/models/export_data/";

//       // Removed responseType: 'blob' which was causing issues with some axios versions
//       const response = await api.get(endpoint);

//       const fileName =
//         currentTab === "sellers"
//           ? "All_Vendors_List.csv"
//           : "All_Models_List.csv";

//       // Direct string-to-CSV logic (Bulletproof approach)
//       const blob = new Blob([response.data], { type: "text/csv" });
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", fileName);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to export data from database.");
//     }
//   };

//   const title = currentTab
//     ? currentTab.charAt(0).toUpperCase() + currentTab.slice(1, -1)
//     : "";
//   const addButtonText =
//     currentTab === "sellers"
//       ? "ADD NEW VENDOR/SELLER"
//       : `ADD NEW ${title.toUpperCase()}`;

//   const filteredData = data.filter((item) => {
//     if (!searchTerm) return true;
//     const s = searchTerm.toLowerCase();
//     if (currentTab === "models")
//       return (
//         item.asin_fsn?.toLowerCase().includes(s) ||
//         item.model_name?.toLowerCase().includes(s) ||
//         item.model?.toLowerCase().includes(s)
//       );
//     else if (currentTab === "sellers")
//       return (
//         item.name?.toLowerCase().includes(s) ||
//         item.gstn_no?.toLowerCase().includes(s)
//       );
//     else return item.name?.toLowerCase().includes(s);
//   });

//   const uploadHeaders =
//     currentTab === "models"
//       ? [
//           "ASIN/FSN",
//           "Model Name",
//           "Model",
//           "SAP Polyshri",
//           "SAP Rio",
//           "SAP NE",
//           "SAP SMS",
//           "SAP SMMPL",
//         ]
//       : [
//           "gstn_no",
//           "name",
//           "sap_polyshri",
//           "sap_rio",
//           "sap_ne",
//           "sap_sms",
//           "sap_smmpl",
//         ];

//   return (
//     <div className="bg-[#f8fafc] min-h-screen font-sans pb-10">
//       {/* PAGE HEADER */}
//       <div className="mb-2">
//         <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
//           Masters
//         </h1>
//         <p className="text-xs text-slate-500 font-medium mt-1">
//           Manage core reference data used across the whole console
//         </p>
//       </div>

//       {/* TABS NAVIGATION (Original Style) */}
//       <div className="flex border-b border-gray-200 mt-6 mb-6 overflow-x-auto custom-scrollbar">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => navigate(`/master/${tab.id}`)}
//             className={`px-6 py-3 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200 mr-4 ${
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
//         {/* CARD HEADER WITH SEARCH & ICONS (Exact Match to Screenshot) */}
//         <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-gray-100 bg-white gap-4">
//           <div className="flex items-center gap-6 w-full md:w-auto">
//             <h2 className="text-lg font-medium text-slate-700 text-slate-900 whitespace-nowrap min-w-[60px]">
//               {currentTab === "sellers" ? "Seller" : title}
//             </h2>
//             <div className="flex items-center bg-white px-3 py-2 rounded-md border border-gray-200 focus-within:border-amber-400 transition-all min-w-[280px]">
//               <i className="fas fa-search text-gray-300 text-sm"></i>
//               <input
//                 type="text"
//                 placeholder={`Search in ${currentTab}...`}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="bg-transparent border-none outline-none ml-2 text-sm w-full font-medium text-slate-600"
//               />
//             </div>
//           </div>

//           {role === "ADMIN" && (
//             <div className="flex items-center gap-1.5 border border-gray-200 p-1 rounded-lg shadow-sm">
//               {(currentTab === "models" || currentTab === "sellers") && (
//                 <>
//                   {/* TEMPLATE BUTTON */}
//                   <button
//                     onClick={handleDownloadTemplate}
//                     title="Download Template"
//                     className="flex items-center justify-center gap-2 px-3 h-8 text-blue-600 hover:bg-blue-50 rounded transition font-bold text-xs tracking-wide"
//                   >
//                     <i className="fas fa-file-csv"></i>
//                   </button>
//                   <div className="w-[1px] h-5 bg-gray-200 mx-1"></div>

//                   {/* UPLOAD BUTTON */}
//                   <button
//                     onClick={() => setUploadModalOpen(true)}
//                     title="Upload Excel"
//                     className="flex items-center justify-center gap-2 px-3 h-8 text-emerald-600 hover:bg-emerald-50 rounded transition font-bold text-xs tracking-wide"
//                   >
//                     <i className="fas fa-file-excel"></i>
//                   </button>
//                   <div className="w-[1px] h-5 bg-gray-200 mx-1"></div>

//                   {/* EXPORT ALL BUTTON */}
//                   <button
//                     onClick={handleExportData}
//                     title="Export All Database Records"
//                     className="flex items-center justify-center gap-2 px-3 h-8 text-indigo-600 hover:bg-indigo-50 rounded transition font-bold text-xs tracking-wide"
//                   >
//                     <i className="fas fa-download"></i>
//                   </button>
//                   <div className="w-[1px] h-5 bg-gray-200 mx-1"></div>
//                 </>
//               )}

//               {/* ADD NEW BUTTON */}
//               <button
//                 onClick={handleAddNew}
//                 className="flex items-center gap-2 px-4 h-8 text-amber-500 hover:bg-amber-50 rounded transition font-bold text-xs uppercase tracking-wide"
//               >
//                 <i className="fas fa-plus"></i>{" "}
//                 <span className="mt-0.5">{addButtonText}</span>
//               </button>
//             </div>
//           )}
//         </div>

//         {/* FULL WIDTH TABLE */}
//         <div className="overflow-x-auto w-full custom-scrollbar min-h-[400px]">
//           <table className="w-full text-left border-collapse min-w-max">
//             <thead className="bg-white border-b border-gray-100 text-[#94a3b8] text-[10px] font-bold uppercase tracking-widest sticky top-0">
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
//                   <th className="p-4 text-right pr-8 sticky right-0 bg-white">
//                     ACTION
//                   </th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 text-sm">
//               {filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan="10" className="p-16 text-center text-slate-400">
//                     <i className="fas fa-search text-4xl mb-4 text-slate-200 opacity-50 block"></i>
//                     <p className="font-medium text-sm text-slate-400">
//                       No records found.
//                     </p>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((item, index) => (
//                   <tr
//                     key={item.id}
//                     className="hover:bg-slate-50/50 transition-colors group"
//                   >
//                     <td className="p-4 pl-6 text-slate-400 font-medium text-xs">
//                       {index + 1}
//                     </td>
//                     {currentTab === "models" ? (
//                       <>
//                         <td className="p-4 font-mono font-medium text-slate-600 text-xs">
//                           {item.asin_fsn}
//                         </td>
//                         <td className="p-4 font-bold text-slate-700 text-xs">
//                           {item.model_name}
//                         </td>
//                         <td className="p-4 text-slate-500 text-xs">
//                           {item.model || "-"}
//                         </td>
//                         <td className="p-4 text-xs text-slate-400 font-mono">
//                           {item.sap_polyshri || "-"}
//                         </td>
//                         <td className="p-4 text-xs text-slate-400 font-mono">
//                           {item.sap_rio || "-"}
//                         </td>
//                         <td className="p-4 text-xs text-slate-400 font-mono">
//                           {item.sap_ne || "-"}
//                         </td>
//                         <td className="p-4 text-xs text-slate-400 font-mono">
//                           {item.sap_sms || "-"}
//                         </td>
//                         <td className="p-4 text-xs text-slate-400 font-mono">
//                           {item.sap_smmpl || "-"}
//                         </td>
//                       </>
//                     ) : currentTab === "sellers" ? (
//                       <>
//                         <td className="p-4 font-mono font-bold text-slate-600 text-[13px] tracking-wide">
//                           {item.gstn_no}
//                         </td>
//                         <td className="p-4 font-bold text-slate-700 text-xs">
//                           {item.name}
//                         </td>
//                         <td className="p-4 text-xs text-slate-400 font-mono">
//                           {item.sap_polyshri || "-"}
//                         </td>
//                         <td className="p-4 text-xs text-slate-400 font-mono">
//                           {item.sap_rio || "-"}
//                         </td>
//                         <td className="p-4 text-xs text-slate-400 font-mono">
//                           {item.sap_ne || "-"}
//                         </td>
//                         <td className="p-4 text-xs text-slate-400 font-mono">
//                           {item.sap_sms || "-"}
//                         </td>
//                         <td className="p-4 text-xs text-slate-400 font-mono">
//                           {item.sap_smmpl || "-"}
//                         </td>
//                       </>
//                     ) : (
//                       <td className="p-4 font-bold text-slate-700 text-xs">
//                         {item.name}
//                       </td>
//                     )}
//                     {role === "ADMIN" && (
//                       <td className="p-4 text-right pr-6 sticky right-0 bg-white group-hover:bg-slate-50 transition-colors">
//                         <div className="flex justify-end items-center gap-2">
//                           <button
//                             onClick={() => handleEdit(item)}
//                             className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-gray-100 text-slate-600 rounded text-[10px] font-bold transition"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item.id)}
//                             className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 rounded text-[10px] font-bold transition"
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
//             <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white">
//               <h3 className="text-lg font-medium text-slate-700 text-slate-900 tracking-tight">
//                 {editId ? `Edit Record` : addButtonText}
//               </h3>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times text-sm"></i>
//               </button>
//             </div>
//             <div className="p-8 overflow-y-auto custom-scrollbar bg-white">
//               <form
//                 id="masterForm"
//                 onSubmit={handleSubmit}
//                 className="space-y-6"
//               >
//                 {currentTab === "sellers" && (
//                   <>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2">
//                           GSTN Number <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           maxLength={15}
//                           name="gstn_no"
//                           value={formData.gstn_no}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-amber-500 outline-none text-sm font-mono font-medium text-slate-800 transition uppercase placeholder:lowercase"
//                           placeholder="e.g. 23xxxxx..."
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2">
//                           Seller Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           name="name"
//                           value={formData.name}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-amber-500 outline-none text-sm font-medium text-slate-800 transition shadow-sm"
//                           placeholder="e.g. Next Era"
//                         />
//                       </div>
//                     </div>
//                     <div className="bg-slate-50 p-5 rounded-xl border border-gray-100 mt-4">
//                       <p className="text-[10px] font-medium text-slate-700 text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
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
//                             <label className="block text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest mb-1.5">
//                               {sapKey.replace("_", " ")}
//                             </label>
//                             <input
//                               type="text"
//                               name={sapKey}
//                               value={formData[sapKey] || ""}
//                               onChange={handleInputChange}
//                               className="w-full bg-white border border-gray-200 p-2 rounded-md focus:border-amber-500 outline-none text-xs font-medium text-slate-700"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}
//                 {currentTab !== "models" && currentTab !== "sellers" && (
//                   <div>
//                     <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2">
//                       {title} NAME <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-amber-500 outline-none text-sm font-bold text-slate-800 transition"
//                       placeholder={`Enter ${title} name...`}
//                     />
//                   </div>
//                 )}
//                 {currentTab === "models" && (
//                   <>
//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2">
//                           ASN / FSN <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           name="asin_fsn"
//                           value={formData.asin_fsn || ""}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-amber-500 outline-none text-sm font-mono font-medium text-slate-800"
//                           placeholder="e.g. B08KH5..."
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2">
//                           MODEL NAME <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           required
//                           name="model_name"
//                           value={formData.model_name || ""}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-amber-500 outline-none text-sm font-medium text-slate-800"
//                           placeholder="e.g. Realme P4..."
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2">
//                           MODEL
//                         </label>
//                         <input
//                           type="text"
//                           name="model"
//                           value={formData.model || ""}
//                           onChange={handleInputChange}
//                           className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-amber-500 outline-none text-sm font-medium text-slate-800"
//                           placeholder="Model specific info"
//                         />
//                       </div>
//                     </div>
//                     <div className="bg-slate-50 p-5 rounded-xl border border-gray-100 mt-4">
//                       <p className="text-[10px] font-medium text-slate-700 text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
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
//                             <label className="block text-[9px] font-bold text-[#94a3b8] uppercase tracking-widest mb-1.5">
//                               {sapKey.replace("_", " ")}
//                             </label>
//                             <input
//                               type="text"
//                               name={sapKey}
//                               value={formData[sapKey] || ""}
//                               onChange={handleInputChange}
//                               className="w-full bg-white border border-gray-200 p-2 rounded-md focus:border-amber-500 outline-none text-xs font-medium text-slate-700"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}
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
//                 form="masterForm"
//                 disabled={loading}
//                 className="px-6 py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
//               >
//                 {loading ? "SAVING..." : "SAVE RECORD"}
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
//               <h2 className="text-xl font-medium text-slate-700 text-slate-900 tracking-tight">
//                 Bulk Upload {currentTab === "sellers" ? "Sellers" : "Models"}
//               </h2>
//               <button
//                 onClick={() => setUploadModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
//               >
//                 <i className="fas fa-times"></i>
//               </button>
//             </div>
//             <div className="mb-6 bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl">
//               <div className="flex items-center gap-2 mb-2.5">
//                 <i className="fas fa-info-circle text-indigo-500"></i>
//                 <h4 className="text-[10px] font-medium text-slate-700 text-indigo-800 uppercase tracking-widest">
//                   Required Excel Headers
//                 </h4>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {uploadHeaders.map((h, i) => (
//                   <span
//                     key={i}
//                     className="px-2 py-1 bg-white border border-indigo-200 text-indigo-700 text-[10px] font-bold rounded shadow-sm"
//                   >
//                     {h}
//                   </span>
//                 ))}
//               </div>
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
//                 className="w-full bg-[#0f172a] hover:bg-slate-800 text-white py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition shadow-md disabled:opacity-50"
//               >
//                 {loading ? "UPLOADING..." : "SYNC DATABASE"}
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

// --- 🔥 REUSABLE MODERN SVG ICONS (Matched with Approvals) 🔥 ---
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
    { id: "firms", label: "FIRMS", icon: "fa-building" },
    { id: "locations", label: "LOCATIONS", icon: "fa-map-marker-alt" },
    { id: "merchants", label: "MERCHANTS", icon: "fa-store" },
    { id: "models", label: "MODELS", icon: "fa-cubes" },
    { id: "sellers", label: "VENDORS / SELLERS", icon: "fa-users-cog" },
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
    if (name === "gstn_no")
      setFormData({ ...formData, [name]: value.toUpperCase() });
    else setFormData({ ...formData, [name]: value });
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
      if (editId) await api.put(`reports/${currentTab}/${editId}/`, payload);
      else await api.post(`reports/${currentTab}/`, payload);

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
    if (currentTab === "models" || currentTab === "sellers") setFormData(item);
    else setFormData({ ...initialFormState, name: item.name });
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
    link.href = encodedUri;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportData = async () => {
    try {
      const endpoint =
        currentTab === "sellers"
          ? "reports/sellers/export_data/"
          : "reports/models/export_data/";
      const response = await api.get(endpoint);
      const fileName =
        currentTab === "sellers"
          ? "All_Vendors_List.csv"
          : "All_Models_List.csv";
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      alert("Failed to export data from database.");
    }
  };

  const title = currentTab
    ? currentTab.charAt(0).toUpperCase() + currentTab.slice(1, -1)
    : "";
  const addButtonText =
    currentTab === "sellers" ? "Add Vendor" : `Add ${title}`;

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    if (currentTab === "models")
      return (
        item.asin_fsn?.toLowerCase().includes(s) ||
        item.model_name?.toLowerCase().includes(s) ||
        item.model?.toLowerCase().includes(s)
      );
    else if (currentTab === "sellers")
      return (
        item.name?.toLowerCase().includes(s) ||
        item.gstn_no?.toLowerCase().includes(s)
      );
    else return item.name?.toLowerCase().includes(s);
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
          "gstn_no",
          "name",
          "sap_polyshri",
          "sap_rio",
          "sap_ne",
          "sap_sms",
          "sap_smmpl",
        ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-10 text-slate-700">
      {/* --- HEADER --- */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
            Modules / <span className="text-slate-600">Master Data</span>
          </p>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
            Master Management
          </h1>
        </div>
      </div>

      {/* --- PREMIUM PILL TABS --- */}
      <div className="mx-6 mt-6 mb-4 flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(`/master/${tab.id}`)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-[13px] font-bold transition-all duration-200 whitespace-nowrap ${
              currentTab === tab.id
                ? "bg-[#e67e22] text-white shadow-md shadow-[#e67e22]/20"
                : "bg-white text-slate-500 hover:bg-gray-50 border border-gray-200 shadow-sm"
            }`}
          >
            <i
              className={`fas ${tab.icon} ${currentTab === tab.id ? "text-white" : "text-slate-400"}`}
            ></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- MAIN DATA CARD --- */}
      <div className="mx-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        {/* CARD TOOLBAR (Matched with Approvals) */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            {/* SEARCH BAR */}
            <div className="flex items-center bg-white px-3 py-2 rounded-md border border-gray-300 w-64 shadow-sm focus-within:border-indigo-400 transition-colors">
              <IconSearch />
              <input
                type="text"
                placeholder={`Search in ${currentTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none ml-2 text-sm w-full text-slate-700 placeholder-slate-400"
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
          </div>

          {/* ACTION BUTTONS */}
          {role === "ADMIN" && (
            <div className="flex items-center gap-3">
              {(currentTab === "models" || currentTab === "sellers") && (
                <>
                  <button
                    onClick={handleDownloadTemplate}
                    className="px-4 py-2 bg-white border border-gray-300 text-slate-600 rounded-md text-sm hover:bg-slate-50 transition shadow-sm flex items-center gap-2"
                  >
                    <IconTemplate />{" "}
                    <span className="hidden md:inline">Template</span>
                  </button>

                  <button
                    onClick={() => setUploadModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-slate-600 rounded-md hover:bg-slate-50 transition shadow-sm"
                  >
                    <IconUpload />
                    <div className="flex flex-col text-left leading-none hidden md:flex">
                      <span className="text-[10px] text-slate-500">Upload</span>
                      <span className="text-sm font-medium">Excel</span>
                    </div>
                  </button>

                  <button
                    onClick={handleExportData}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-slate-600 rounded-md hover:bg-slate-50 transition shadow-sm"
                  >
                    <IconDownload />
                    <div className="flex flex-col text-left leading-none hidden md:flex">
                      <span className="text-[10px] text-slate-500">
                        Download
                      </span>
                      <span className="text-sm font-medium">Export</span>
                    </div>
                  </button>
                </>
              )}

              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 px-4 py-2 bg-[#e67e22] hover:bg-blue-600 text-white rounded-md transition shadow-sm border "
              >
                <IconPlus />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[10px] opacity-80 hidden md:inline">
                    New
                  </span>
                  <span className="text-sm font-medium">{addButtonText}</span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* DATA TABLE (Scrollable & Responsive) */}
        <div className="overflow-x-auto w-full custom-scrollbar min-h-[450px]">
          <table className="w-full text-left min-w-max border-collapse">
            <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 text-xs font-medium uppercase tracking-wide sticky top-0 z-10">
              <tr>
                <th className="p-3 pl-6 w-16 text-center">#</th>
                {currentTab === "models" ? (
                  <>
                    <th className="p-3">ASN/FSN</th>
                    <th className="p-3">Model Name</th>
                    <th className="p-3">Model Code</th>
                    <th className="p-3 border-l border-gray-100 text-center">
                      SAP Polyshri
                    </th>
                    <th className="p-3 text-center">SAP Rio</th>
                    <th className="p-3 text-center">SAP NE</th>
                    <th className="p-3 text-center">SAP SMS</th>
                    <th className="p-3 text-center">SAP SMMPL</th>
                  </>
                ) : currentTab === "sellers" ? (
                  <>
                    <th className="p-3">GSTN NUMBER</th>
                    <th className="p-3">SELLER NAME</th>
                    <th className="p-3 border-l border-gray-100 text-center">
                      SAP Polyshri
                    </th>
                    <th className="p-3 text-center">SAP Rio</th>
                    <th className="p-3 text-center">SAP NE</th>
                    <th className="p-3 text-center">SAP SMS</th>
                    <th className="p-3 text-center">SAP SMMPL</th>
                  </>
                ) : (
                  <th className="p-3">{title} NAME</th>
                )}
                {role === "ADMIN" && (
                  <th className="p-3 text-right pr-6 sticky right-0 bg-slate-50 backdrop-blur-sm z-10">
                    ACTION
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-slate-700">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="15" className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
                        <i className="fas fa-inbox text-2xl text-gray-300"></i>
                      </div>
                      <p className="font-bold text-slate-600">
                        No Records Found
                      </p>
                      <p className="text-[12px] text-gray-400 mt-1">
                        Try adjusting your search query.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="p-3 pl-6 text-center text-gray-400 font-medium text-xs">
                      {(index + 1).toString().padStart(2, "0")}
                    </td>
                    {currentTab === "models" ? (
                      <>
                        <td className="p-3 font-medium text-[#e67e22] whitespace-nowrap">
                          {item.asin_fsn}
                        </td>
                        <td className="p-3 text-slate-800 font-medium">
                          {item.model_name}
                        </td>
                        <td className="p-3 text-gray-500 whitespace-nowrap">
                          {item.model || "—"}
                        </td>
                        <td className="p-3 border-l border-gray-50 text-xs text-gray-500 text-center whitespace-nowrap">
                          {item.sap_polyshri || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center whitespace-nowrap">
                          {item.sap_rio || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center whitespace-nowrap">
                          {item.sap_ne || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center whitespace-nowrap">
                          {item.sap_sms || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center whitespace-nowrap">
                          {item.sap_smmpl || "—"}
                        </td>
                      </>
                    ) : currentTab === "sellers" ? (
                      <>
                        <td className="p-3 font-medium text-[#e67e22] tracking-wide whitespace-nowrap">
                          {item.gstn_no}
                        </td>
                        <td className="p-3 text-slate-800 font-medium">
                          {item.name}
                        </td>
                        <td className="p-3 border-l border-gray-50 text-xs text-gray-500 text-center whitespace-nowrap">
                          {item.sap_polyshri || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center whitespace-nowrap">
                          {item.sap_rio || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center whitespace-nowrap">
                          {item.sap_ne || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center whitespace-nowrap">
                          {item.sap_sms || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center whitespace-nowrap">
                          {item.sap_smmpl || "—"}
                        </td>
                      </>
                    ) : (
                      <td className="p-3 text-slate-800 font-medium">
                        {item.name}
                      </td>
                    )}
                    {role === "ADMIN" && (
                      <td className="p-3 text-right pr-6 sticky right-0 bg-white group-hover:bg-slate-50 transition-colors z-10 whitespace-nowrap">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            title="Edit Record"
                            className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#e67e22] hover:border-blue-200 shadow-sm flex items-center justify-center transition"
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
                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Delete Record"
                            className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#ff4d4f] hover:border-red-200 shadow-sm flex items-center justify-center transition"
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

      {/* --- ADD / EDIT RECORD MODAL --- */}
      {isModalOpen && role === "ADMIN" && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-medium text-slate-800">
                {editId ? `Update ${title} Record` : addButtonText}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
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
                id="masterForm"
                onSubmit={handleSubmit}
                className="space-y-5 bg-white p-5 rounded-lg border border-gray-200"
              >
                {currentTab === "sellers" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        GSTN Number *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={15}
                        name="gstn_no"
                        value={formData.gstn_no}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 uppercase transition-all"
                        placeholder="e.g. 23XXXXX..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Seller Name *
                      </label>
                      <input
                        type="text"
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 transition-all"
                        placeholder="e.g. Next Era"
                      />
                    </div>
                  </div>
                )}

                {currentTab !== "models" && currentTab !== "sellers" && (
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      {title} Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 transition-all"
                      placeholder={`Enter ${title} name`}
                    />
                  </div>
                )}

                {currentTab === "models" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        ASN / FSN *
                      </label>
                      <input
                        type="text"
                        required
                        name="asin_fsn"
                        value={formData.asin_fsn || ""}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 transition-all"
                        placeholder="e.g. B08KH5..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Model Name *
                      </label>
                      <input
                        type="text"
                        required
                        name="model_name"
                        value={formData.model_name || ""}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 transition-all"
                        placeholder="e.g. Realme P4"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">
                        Model Code
                      </label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model || ""}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 transition-all"
                        placeholder="Optional code"
                      />
                    </div>
                  </div>
                )}

                {/* SAP CONFIGURATION SECTION */}
                {(currentTab === "models" || currentTab === "sellers") && (
                  <div className="pt-4 mt-2 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <i className="fas fa-server text-[#e67e22]"></i> SAP
                      Integrations
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
                          className={sapKey === "sap_smmpl" ? "col-span-2" : ""}
                        >
                          <label className="block text-xs text-slate-500 mb-1">
                            {sapKey.replace("_", " ").toUpperCase()}
                          </label>
                          <input
                            type="text"
                            name={sapKey}
                            value={formData[sapKey] || ""}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 transition"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 bg-white border border-gray-300 text-slate-600 rounded text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="masterForm"
                disabled={loading}
                className="px-5 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Saving...
                  </>
                ) : (
                  "Save Record"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- UPLOAD EXCEL MODAL --- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-medium text-slate-800">
                Bulk Upload {currentTab === "sellers" ? "Sellers" : "Models"}
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
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
              <div className="mb-5 bg-blue-50 border border-blue-100 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-info-circle text-[#e67e22]"></i>
                  <h4 className="text-[11px] font-bold text-[#e67e22] uppercase tracking-widest">
                    Required Columns
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uploadHeaders.map((h, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-white border border-blue-200 text-blue-700 text-[10px] font-bold rounded shadow-sm"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <form onSubmit={handleUploadSubmit}>
                <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-lg bg-white mb-6 hover:bg-gray-50 transition-colors relative cursor-pointer group">
                  <i className="fas fa-file-excel text-3xl text-[#52c41a] mb-3 block group-hover:scale-110 transition-transform"></i>
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <p className="text-sm font-medium text-slate-700">
                    Click or drag file here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports .xlsx, .xls, .csv
                  </p>
                  {file && (
                    <p className="text-sm font-bold text-[#e67e22] mt-3">
                      {file.name}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Uploading...
                    </>
                  ) : (
                    "Upload to Database"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}