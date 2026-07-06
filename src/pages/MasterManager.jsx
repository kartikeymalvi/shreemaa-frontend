// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import api from "../api/axios";

// export default function MasterManager() {
//   const { type } = useParams(); // URL se nikalega: 'firms', 'locations', ya 'merchants'
//   const [data, setData] = useState([]);
//   const [name, setName] = useState("");
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const role = localStorage.getItem("user_role") || "USER";

//   // Data laane ka function
//   const fetchMasterData = async () => {
//     try {
//       const response = await api.get(`reports/${type}/`);
//       setData(response.data);
//     } catch (error) {
//       console.error(`Error fetching ${type}:`, error);
//     }
//   };

//   // Jab bhi left menu se tab change ho, naya data load karo
//   useEffect(() => {
//     fetchMasterData();
//     setName("");
//     setEditId(null);
//   }, [type]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");

//     setLoading(true);
//     try {
//       if (editId) {
//         await api.put(`reports/${type}/${editId}/`, { name });
//         alert("Record Updated Successfully!");
//       } else {
//         await api.post(`reports/${type}/`, { name });
//         alert("New Record Added!");
//       }
//       setName("");
//       setEditId(null);
//       fetchMasterData();
//     } catch (error) {
//       alert("Error: Name already exists or invalid data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item) => {
//     setName(item.name);
//     setEditId(item.id);
//   };

//   const handleDelete = async (id) => {
//     if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");
//     if (
//       window.confirm(
//         "Delete this entry? It will disappear from all dropdowns globally.",
//       )
//     ) {
//       try {
//         await api.delete(`reports/${type}/${id}/`);
//         fetchMasterData();
//       } catch (error) {
//         alert("Delete failed.");
//       }
//     }
//   };

//   // 'firms' ko 'Firm' banayega title ke liye
//   const title = type ? type.charAt(0).toUpperCase() + type.slice(1, -1) : "";

//   return (
//     <div className="bg-[#f8fafc] min-h-screen font-sans pb-10">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
//           {title} Master
//         </h1>
//         <p className="text-xs text-slate-500 mt-1">
//           Manage globally available {title}s for all dropdowns
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* ADD/EDIT FORM (Sirf admin ke liye enable rahega) */}
//         <div className="lg:col-span-1">
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-6">
//             <h3 className="text-lg font-bold text-slate-800 mb-5">
//               {editId ? `Edit ${title}` : `Add New ${title}`}
//             </h3>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
//                   {title} Name
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   disabled={role !== "ADMIN"}
//                   className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm disabled:opacity-50"

//                 />
//               </div>
//               <div className="flex gap-2 pt-2">
//                 {editId && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setEditId(null);
//                       setName("");
//                     }}
//                     className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition"
//                   >
//                     Cancel
//                   </button>
//                 )}
//                 <button
//                   type="submit"
//                   disabled={loading || role !== "ADMIN"}
//                   className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-md shadow-indigo-500/20 disabled:opacity-70 ${editId ? "w-2/3" : ""}`}
//                 >
//                   {loading ? "Saving..." : editId ? "Update" : "Save Globally"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* DATA TABLE (Right Side) */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
//                 <tr>
//                   <th className="p-4 w-16 text-center">ID</th>
//                   <th className="p-4">{title} Name</th>
//                   {role === "ADMIN" && (
//                     <th className="p-4 text-center w-32">Actions</th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50 text-sm">
//                 {data.length === 0 ? (
//                   <tr>
//                     <td colSpan="3" className="p-8 text-center text-slate-400">
//                       No records found. Create one to populate dropdowns.
//                     </td>
//                   </tr>
//                 ) : (
//                   data.map((item) => (
//                     <tr
//                       key={item.id}
//                       className="hover:bg-slate-50 transition-colors"
//                     >
//                       <td className="p-4 text-center text-slate-400 font-mono">
//                         #{item.id}
//                       </td>
//                       <td className="p-4 font-bold text-slate-700">
//                         {item.name}
//                       </td>
//                       {role === "ADMIN" && (
//                         <td className="p-4 text-center">
//                           <button
//                             onClick={() => handleEdit(item)}
//                             className="text-slate-400 hover:text-indigo-600 mr-4 transition"
//                             title="Edit"
//                           >
//                             <i className="fas fa-pen"></i>
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item.id)}
//                             className="text-slate-400 hover:text-red-600 transition"
//                             title="Delete"
//                           >
//                             <i className="fas fa-trash-alt"></i>
//                           </button>
//                         </td>
//                       )}
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import api from "../api/axios";

// export default function MasterManager() {
//   const { type } = useParams(); // URL se nikalega: 'firms', 'locations', 'merchants', ya 'models'
//   const [data, setData] = useState([]);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const role = localStorage.getItem("user_role") || "USER";

//   // --- NAYA DYNAMIC STATE ---
//   // Ek hi state banaya hai jo normal 'name' ko bhi handle karega aur 'models' ke saare fields ko bhi
//   const initialFormState = {
//     name: "", // Used for firms, locations, merchants
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

//   // Data laane ka function
//   const fetchMasterData = async () => {
//     try {
//       const response = await api.get(`reports/${type}/`);
//       setData(response.data);
//     } catch (error) {
//       console.error(`Error fetching ${type}:`, error);
//     }
//   };

//   // Jab bhi left menu se tab change ho, naya data load karo aur form clear karo
//   useEffect(() => {
//     fetchMasterData();
//     setFormData(initialFormState);
//     setEditId(null);
//   }, [type]);

//   // Input change handle karne ke liye (Dynamic)
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

//       // FIX: Sirf wahi data bhejenge jo Django expect kar raha hai
//       if (type === "models") {
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
//         await api.put(`reports/${type}/${editId}/`, payload);
//         alert("Record Updated Successfully!");
//       } else {
//         await api.post(`reports/${type}/`, payload);
//         alert("New Record Added!");
//       }

//       setFormData(initialFormState); // Form reset
//       setEditId(null);
//       fetchMasterData();
//     } catch (error) {
//       // --- REAL ERROR CHECKER ---
//       // Ye hume batayega ki Django ne exact kya error bheji hai
//       if (error.response && error.response.data) {
//         console.error("Django Rejected Data:", error.response.data);
//         alert("Backend Error: " + JSON.stringify(error.response.data));
//       } else {
//         alert("Server failed to respond. Check if Django is running!");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item) => {
//     if (type === "models") {
//       setFormData(item); // Model ke case me pura object set hoga
//     } else {
//       setFormData({ ...initialFormState, name: item.name }); // Normal ke case me sirf name
//     }
//     setEditId(item.id);
//   };

//   const handleDelete = async (id) => {
//     if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");
//     if (
//       window.confirm(
//         "Delete this entry? It will disappear from all dropdowns globally.",
//       )
//     ) {
//       try {
//         await api.delete(`reports/${type}/${id}/`);
//         fetchMasterData();
//       } catch (error) {
//         alert("Delete failed.");
//       }
//     }
//   };

//   // 'firms' ko 'Firm' banayega title ke liye
//   const title = type ? type.charAt(0).toUpperCase() + type.slice(1, -1) : "";

//   return (
//     <div className="bg-[#f8fafc] min-h-screen font-sans pb-10">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
//           {title} Master
//         </h1>
//         <p className="text-xs text-slate-500 mt-1">
//           Manage globally available {title}s for all dropdowns
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* --- ADD/EDIT FORM (Sirf admin ke liye enable rahega) --- */}
//         <div className="lg:col-span-1">
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
//             <h3 className="text-lg font-bold text-slate-800 mb-5 border-b pb-3">
//               <i
//                 className={`fas ${editId ? "fa-edit text-blue-500" : "fa-plus-circle text-emerald-500"} mr-2`}
//               ></i>
//               {editId ? `Edit ${title}` : `Add New ${title}`}
//             </h3>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* NORMAL FORM (Firms, Locations, Merchants) */}
//               {type !== "models" && (
//                 <div>
//                   <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
//                     {title} Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     required
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     disabled={role !== "ADMIN"}
//                     className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-blue-500 outline-none text-sm disabled:opacity-50"
//                   />
//                 </div>
//               )}

//               {/* DYNAMIC FORM (Models ke saare fields) */}
//               {type === "models" && (
//                 <>
//                   <div>
//                     <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                       ASN / FSN <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="asin_fsn"
//                       required
//                       value={formData.asin_fsn || ""}
//                       onChange={handleInputChange}
//                       disabled={role !== "ADMIN"}
//                       className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none text-sm font-mono"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                       Model Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="model_name"
//                       required
//                       value={formData.model_name || ""}
//                       onChange={handleInputChange}
//                       disabled={role !== "ADMIN"}
//                       className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none text-sm"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
//                       Model
//                     </label>
//                     <input
//                       type="text"
//                       name="model"
//                       value={formData.model || ""}
//                       onChange={handleInputChange}
//                       disabled={role !== "ADMIN"}
//                       className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none text-sm"
//                     />
//                   </div>

//                   {/* SAP CODES */}
//                   <div className="pt-2 border-t border-slate-100">
//                     <p className="text-xs font-bold text-blue-600 mb-3">
//                       <i className="fas fa-server"></i> SAP CODES
//                     </p>
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                           SAP_Polyshri
//                         </label>
//                         <input
//                           type="text"
//                           name="sap_polyshri"
//                           value={formData.sap_polyshri || ""}
//                           onChange={handleInputChange}
//                           disabled={role !== "ADMIN"}
//                           className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg focus:border-blue-500 outline-none text-xs"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                           SAP_Rio
//                         </label>
//                         <input
//                           type="text"
//                           name="sap_rio"
//                           value={formData.sap_rio || ""}
//                           onChange={handleInputChange}
//                           disabled={role !== "ADMIN"}
//                           className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg focus:border-blue-500 outline-none text-xs"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                           SAP_NE
//                         </label>
//                         <input
//                           type="text"
//                           name="sap_ne"
//                           value={formData.sap_ne || ""}
//                           onChange={handleInputChange}
//                           disabled={role !== "ADMIN"}
//                           className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg focus:border-blue-500 outline-none text-xs"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                           SAP_SMS
//                         </label>
//                         <input
//                           type="text"
//                           name="sap_sms"
//                           value={formData.sap_sms || ""}
//                           onChange={handleInputChange}
//                           disabled={role !== "ADMIN"}
//                           className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg focus:border-blue-500 outline-none text-xs"
//                         />
//                       </div>
//                       <div className="col-span-2">
//                         <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
//                           SAP_SMMPL
//                         </label>
//                         <input
//                           type="text"
//                           name="sap_smmpl"
//                           value={formData.sap_smmpl || ""}
//                           onChange={handleInputChange}
//                           disabled={role !== "ADMIN"}
//                           className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg focus:border-blue-500 outline-none text-xs"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}

//               <div className="flex gap-2 pt-4 border-t border-slate-100">
//                 {editId && (
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setEditId(null);
//                       setFormData(initialFormState);
//                     }}
//                     className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition"
//                   >
//                     Cancel
//                   </button>
//                 )}
//                 <button
//                   type="submit"
//                   disabled={loading || role !== "ADMIN"}
//                   className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-md shadow-blue-500/20 disabled:opacity-70 ${editId ? "w-2/3" : ""}`}
//                 >
//                   {loading ? (
//                     <>
//                       <i className="fas fa-spinner fa-spin"></i> Saving...
//                     </>
//                   ) : editId ? (
//                     "Update Record"
//                   ) : (
//                     "Save "
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* --- DATA TABLE (Right Side) --- */}
//         <div className="lg:col-span-2">
//           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto custom-scrollbar">
//             {/* Table wrapper me overflow-x-auto diya hai kyunki Models ki table wide hogi */}
//             <table className="w-full text-left border-collapse min-w-max">
//               <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-widest">
//                 <tr>
//                   <th className="p-4 w-16 text-center">ID</th>

//                   {/* Dynamic Table Headers */}
//                   {type === "models" ? (
//                     <>
//                       <th className="p-4">ASN/FSN</th>
//                       <th className="p-4">Model Name</th>
//                       <th className="p-4">Model</th>
//                       <th className="p-4 border-l border-slate-200 bg-slate-100/50">
//                         SAP Polyshri
//                       </th>
//                       <th className="p-4 bg-slate-100/50">SAP Rio</th>
//                       <th className="p-4 bg-slate-100/50">SAP NE</th>
//                       <th className="p-4 bg-slate-100/50">SAP SMS</th>
//                       <th className="p-4 border-r border-slate-200 bg-slate-100/50">
//                         SAP SMMPL
//                       </th>
//                     </>
//                   ) : (
//                     <th className="p-4">{title} Name</th>
//                   )}

//                   {role === "ADMIN" && (
//                     <th className="p-4 text-center w-28 sticky right-0 bg-slate-50 shadow-sm">
//                       Actions
//                     </th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50 text-sm">
//                 {data.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={type === "models" ? 10 : 3}
//                       className="p-8 text-center text-slate-400"
//                     >
//                       <div className="flex flex-col items-center justify-center">
//                         <i className="fas fa-folder-open text-4xl mb-3 opacity-20"></i>
//                         No records found. Create one to populate dropdowns.
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   data.map((item) => (
//                     <tr
//                       key={item.id}
//                       className="hover:bg-slate-50 transition-colors"
//                     >
//                       <td className="p-4 text-center text-slate-400 font-mono text-xs">
//                         #{item.id}
//                       </td>

//                       {/* Dynamic Table Rows */}
//                       {type === "models" ? (
//                         <>
//                           <td className="p-4 font-mono font-bold text-blue-600 text-xs">
//                             {item.asin_fsn}
//                           </td>
//                           <td className="p-4 font-bold text-slate-700">
//                             {item.model_name}
//                           </td>
//                           <td className="p-4 text-slate-600">{item.model}</td>
//                           <td className="p-4 border-l border-slate-100 text-xs text-slate-500">
//                             {item.sap_polyshri || "-"}
//                           </td>
//                           <td className="p-4 text-xs text-slate-500">
//                             {item.sap_rio || "-"}
//                           </td>
//                           <td className="p-4 text-xs text-slate-500">
//                             {item.sap_ne || "-"}
//                           </td>
//                           <td className="p-4 text-xs text-slate-500">
//                             {item.sap_sms || "-"}
//                           </td>
//                           <td className="p-4 border-r border-slate-100 text-xs text-slate-500">
//                             {item.sap_smmpl || "-"}
//                           </td>
//                         </>
//                       ) : (
//                         <td className="p-4 font-bold text-slate-700">
//                           {item.name}
//                         </td>
//                       )}

//                       {role === "ADMIN" && (
//                         <td className="p-4 text-center sticky right-0 bg-white shadow-[-5px_0_10px_rgba(0,0,0,0.02)]">
//                           <button
//                             onClick={() => handleEdit(item)}
//                             className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg mr-2 transition"
//                             title="Edit"
//                           >
//                             <i className="fas fa-pen"></i>
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item.id)}
//                             className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
//                             title="Delete"
//                           >
//                             <i className="fas fa-trash-alt"></i>
//                           </button>
//                         </td>
//                       )}
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
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

  // Modal for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔥 YEH RAHI MISSING STATES FOR EXCEL UPLOAD
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
  };
  const [formData, setFormData] = useState(initialFormState);

  const tabs = [
    { id: "firms", label: "Firm" },
    { id: "locations", label: "Location" },
    { id: "merchants", label: "Merchant" },
    { id: "models", label: "Model" },
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
  }, [currentTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");

    setLoading(true);
    try {
      let payload;
      if (currentTab === "models") {
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
      if (error.response && error.response.data) {
        alert("Backend Error: " + JSON.stringify(error.response.data));
      } else {
        alert("Server failed to respond. Check if Django is running!");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔥 MISSING EXCEL UPLOAD FUNCTIONS
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
      // Make sure backend API is ready at reports/models/upload/
      const res = await api.post("reports/models/upload/", formDataObj);
      alert(res.data.message || "Models Excel Uploaded Successfully!");
      setUploadModalOpen(false);
      setFile(null);
      fetchMasterData(); // Table reload karne ke liye
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
    if (currentTab === "models") {
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

  const title = currentTab
    ? currentTab.charAt(0).toUpperCase() + currentTab.slice(1, -1)
    : "";

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-10">
      {/* PAGE HEADER */}
      <div className="mb-2">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Masters
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Manage core reference data used across the whole console
        </p>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-gray-200 mt-6 mb-6 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(`/master/${tab.id}`)}
            className={`px-8 py-3 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-200 ${
              currentTab === tab.id
                ? "border-b-2 border-amber-500 text-slate-900"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
        {/* CARD HEADER (Title & Properly Aligned Action Buttons) */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
          <h2 className="text-base font-bold text-slate-800">{title}</h2>

          {role === "ADMIN" && (
            <div className="flex items-center gap-3">
              {currentTab === "models" && (
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
                >
                  <i className="fas fa-file-excel"></i> Upload Excel
                </button>
              )}

              <button
                onClick={handleAddNew}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
              >
                <i className="fas fa-plus"></i> Add {title}
              </button>
            </div>
          )}
        </div>

        {/* FULL WIDTH TABLE */}
        <div className="overflow-x-auto w-full custom-scrollbar max-h-[65vh]">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-slate-50 border-b border-gray-100 text-slate-400 text-[10px] font-black uppercase tracking-widest sticky top-0">
              <tr>
                <th className="p-4 w-16 pl-6">SR.NO</th>

                {currentTab === "models" ? (
                  <>
                    <th className="p-4">ASN/FSN</th>
                    <th className="p-4">Model Name</th>
                    <th className="p-4">Model</th>
                    <th className="p-4 bg-slate-100/50">SAP Polyshri</th>
                    <th className="p-4 bg-slate-100/50">SAP Rio</th>
                    <th className="p-4 bg-slate-100/50">SAP NE</th>
                    <th className="p-4 bg-slate-100/50">SAP SMS</th>
                    <th className="p-4 bg-slate-100/50">SAP SMMPL</th>
                  </>
                ) : (
                  <th className="p-4">{title} NAME</th>
                )}

                {role === "ADMIN" && (
                  <th className="p-4 text-center w-32 pr-6 sticky right-0 bg-slate-50">
                    ACTION
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={currentTab === "models" ? 10 : 3}
                    className="p-12 text-center text-slate-400"
                  >
                    <i className="fas fa-inbox text-3xl mb-3 opacity-20"></i>
                    <p className="font-medium text-sm">
                      No {title} records found.
                    </p>
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="p-4 pl-6 text-slate-500 font-mono text-[11px] font-bold">
                      {index + 1}
                    </td>

                    {currentTab === "models" ? (
                      <>
                        <td className="p-4 font-mono font-bold text-slate-900 text-[11px]">
                          {item.asin_fsn}
                        </td>
                        <td className="p-4 font-bold text-slate-700 text-[12px]">
                          {item.model_name}
                        </td>
                        <td className="p-4 text-slate-500 text-[12px]">
                          {item.model || "-"}
                        </td>
                        <td className="p-4 text-[11px] text-slate-400 font-mono">
                          {item.sap_polyshri || "-"}
                        </td>
                        <td className="p-4 text-[11px] text-slate-400 font-mono">
                          {item.sap_rio || "-"}
                        </td>
                        <td className="p-4 text-[11px] text-slate-400 font-mono">
                          {item.sap_ne || "-"}
                        </td>
                        <td className="p-4 text-[11px] text-slate-400 font-mono">
                          {item.sap_sms || "-"}
                        </td>
                        <td className="p-4 text-[11px] text-slate-400 font-mono">
                          {item.sap_smmpl || "-"}
                        </td>
                      </>
                    ) : (
                      <td className="p-4 font-bold text-slate-700 text-[13px]">
                        {item.name}
                      </td>
                    )}

                    {role === "ADMIN" && (
                      <td className="p-4 text-center pr-6 sticky right-0 bg-white group-hover:bg-slate-50 transition-colors">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[11px] font-bold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded text-[11px] font-bold transition"
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
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {editId ? `Edit ${title}` : `Add New ${title}`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/30">
              <form
                id="masterForm"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {currentTab !== "models" && (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      {title} Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-slate-500 focus:ring-1 focus:ring-slate-200 outline-none text-sm font-bold text-slate-800 transition shadow-sm"
                      placeholder={`Enter ${title} name...`}
                    />
                  </div>
                )}

                {currentTab === "models" && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                          ASN / FSN <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          name="asin_fsn"
                          value={formData.asin_fsn || ""}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-slate-500 focus:ring-1 focus:ring-slate-200 outline-none text-sm font-mono font-bold text-slate-800 shadow-sm"
                          placeholder="e.g. B08KH5..."
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                          Model Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          name="model_name"
                          value={formData.model_name || ""}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-slate-500 focus:ring-1 focus:ring-slate-200 outline-none text-sm font-medium text-slate-800 shadow-sm"
                          placeholder="e.g. Realme P4..."
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                          Model
                        </label>
                        <input
                          type="text"
                          name="model"
                          value={formData.model || ""}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg focus:border-slate-500 focus:ring-1 focus:ring-slate-200 outline-none text-sm font-medium text-slate-800 shadow-sm"
                          placeholder="Model specific info"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 mt-2">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <i className="fas fa-server"></i> SAP Configurations
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {["sap_polyshri", "sap_rio", "sap_ne", "sap_sms"].map(
                          (sapKey) => (
                            <div key={sapKey}>
                              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                {sapKey.replace("_", " ")}
                              </label>
                              <input
                                type="text"
                                name={sapKey}
                                value={formData[sapKey] || ""}
                                onChange={handleInputChange}
                                className="w-full bg-white border border-gray-200 p-2 rounded-md focus:border-slate-400 outline-none text-xs font-bold text-slate-700 shadow-sm"
                              />
                            </div>
                          ),
                        )}
                        <div className="col-span-2">
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            SAP SMMPL
                          </label>
                          <input
                            type="text"
                            name="sap_smmpl"
                            value={formData.sap_smmpl || ""}
                            onChange={handleInputChange}
                            className="w-full bg-white border border-gray-200 p-2 rounded-md focus:border-slate-400 outline-none text-xs font-bold text-slate-700 shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </form>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-white">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg text-xs uppercase tracking-wider transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="masterForm"
                disabled={loading}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
              >
                {loading ? "Saving..." : editId ? "Update Data" : "Save Record"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 🔥 NAYA UPLOAD EXCEL MODAL --- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Bulk Upload Models
              </h2>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
              >
                <i className="fas fa-times"></i>
              </button>
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
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition shadow-md disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Sync Database"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}