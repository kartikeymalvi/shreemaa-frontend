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


import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function MasterManager() {
  const { type } = useParams(); // URL se nikalega: 'firms', 'locations', 'merchants', ya 'models'
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("user_role") || "USER";

  // --- NAYA DYNAMIC STATE ---
  // Ek hi state banaya hai jo normal 'name' ko bhi handle karega aur 'models' ke saare fields ko bhi
  const initialFormState = {
    name: "", // Used for firms, locations, merchants
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

  // Data laane ka function
  const fetchMasterData = async () => {
    try {
      const response = await api.get(`reports/${type}/`);
      setData(response.data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  // Jab bhi left menu se tab change ho, naya data load karo aur form clear karo
  useEffect(() => {
    fetchMasterData();
    setFormData(initialFormState);
    setEditId(null);
  }, [type]);

  // Input change handle karne ke liye (Dynamic)
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

      // FIX: Sirf wahi data bhejenge jo Django expect kar raha hai
      if (type === "models") {
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
        await api.put(`reports/${type}/${editId}/`, payload);
        alert("Record Updated Successfully!");
      } else {
        await api.post(`reports/${type}/`, payload);
        alert("New Record Added!");
      }

      setFormData(initialFormState); // Form reset
      setEditId(null);
      fetchMasterData();
    } catch (error) {
      // --- REAL ERROR CHECKER ---
      // Ye hume batayega ki Django ne exact kya error bheji hai
      if (error.response && error.response.data) {
        console.error("Django Rejected Data:", error.response.data);
        alert("Backend Error: " + JSON.stringify(error.response.data));
      } else {
        alert("Server failed to respond. Check if Django is running!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    if (type === "models") {
      setFormData(item); // Model ke case me pura object set hoga
    } else {
      setFormData({ ...initialFormState, name: item.name }); // Normal ke case me sirf name
    }
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");
    if (
      window.confirm(
        "Delete this entry? It will disappear from all dropdowns globally.",
      )
    ) {
      try {
        await api.delete(`reports/${type}/${id}/`);
        fetchMasterData();
      } catch (error) {
        alert("Delete failed.");
      }
    }
  };

  // 'firms' ko 'Firm' banayega title ke liye
  const title = type ? type.charAt(0).toUpperCase() + type.slice(1, -1) : "";

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          {title} Master
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage globally available {title}s for all dropdowns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- ADD/EDIT FORM (Sirf admin ke liye enable rahega) --- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-bold text-slate-800 mb-5 border-b pb-3">
              <i
                className={`fas ${editId ? "fa-edit text-blue-500" : "fa-plus-circle text-emerald-500"} mr-2`}
              ></i>
              {editId ? `Edit ${title}` : `Add New ${title}`}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* NORMAL FORM (Firms, Locations, Merchants) */}
              {type !== "models" && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    {title} Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={role !== "ADMIN"}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-blue-500 outline-none text-sm disabled:opacity-50"
                  />
                </div>
              )}

              {/* DYNAMIC FORM (Models ke saare fields) */}
              {type === "models" && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      ASN / FSN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="asin_fsn"
                      required
                      value={formData.asin_fsn || ""}
                      onChange={handleInputChange}
                      disabled={role !== "ADMIN"}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Model Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="model_name"
                      required
                      value={formData.model_name || ""}
                      onChange={handleInputChange}
                      disabled={role !== "ADMIN"}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Model
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model || ""}
                      onChange={handleInputChange}
                      disabled={role !== "ADMIN"}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg focus:border-blue-500 outline-none text-sm"
                    />
                  </div>

                  {/* SAP CODES */}
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-xs font-bold text-blue-600 mb-3">
                      <i className="fas fa-server"></i> SAP CODES
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          SAP_Polyshri
                        </label>
                        <input
                          type="text"
                          name="sap_polyshri"
                          value={formData.sap_polyshri || ""}
                          onChange={handleInputChange}
                          disabled={role !== "ADMIN"}
                          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg focus:border-blue-500 outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          SAP_Rio
                        </label>
                        <input
                          type="text"
                          name="sap_rio"
                          value={formData.sap_rio || ""}
                          onChange={handleInputChange}
                          disabled={role !== "ADMIN"}
                          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg focus:border-blue-500 outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          SAP_NE
                        </label>
                        <input
                          type="text"
                          name="sap_ne"
                          value={formData.sap_ne || ""}
                          onChange={handleInputChange}
                          disabled={role !== "ADMIN"}
                          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg focus:border-blue-500 outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          SAP_SMS
                        </label>
                        <input
                          type="text"
                          name="sap_sms"
                          value={formData.sap_sms || ""}
                          onChange={handleInputChange}
                          disabled={role !== "ADMIN"}
                          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg focus:border-blue-500 outline-none text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          SAP_SMMPL
                        </label>
                        <input
                          type="text"
                          name="sap_smmpl"
                          value={formData.sap_smmpl || ""}
                          onChange={handleInputChange}
                          disabled={role !== "ADMIN"}
                          className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg focus:border-blue-500 outline-none text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4 border-t border-slate-100">
                {editId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setFormData(initialFormState);
                    }}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || role !== "ADMIN"}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-md shadow-blue-500/20 disabled:opacity-70 ${editId ? "w-2/3" : ""}`}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Saving...
                    </>
                  ) : editId ? (
                    "Update Record"
                  ) : (
                    "Save "
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* --- DATA TABLE (Right Side) --- */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto custom-scrollbar">
            {/* Table wrapper me overflow-x-auto diya hai kyunki Models ki table wide hogi */}
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="p-4 w-16 text-center">ID</th>

                  {/* Dynamic Table Headers */}
                  {type === "models" ? (
                    <>
                      <th className="p-4">ASN/FSN</th>
                      <th className="p-4">Model Name</th>
                      <th className="p-4">Model</th>
                      <th className="p-4 border-l border-slate-200 bg-slate-100/50">
                        SAP Polyshri
                      </th>
                      <th className="p-4 bg-slate-100/50">SAP Rio</th>
                      <th className="p-4 bg-slate-100/50">SAP NE</th>
                      <th className="p-4 bg-slate-100/50">SAP SMS</th>
                      <th className="p-4 border-r border-slate-200 bg-slate-100/50">
                        SAP SMMPL
                      </th>
                    </>
                  ) : (
                    <th className="p-4">{title} Name</th>
                  )}

                  {role === "ADMIN" && (
                    <th className="p-4 text-center w-28 sticky right-0 bg-slate-50 shadow-sm">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={type === "models" ? 10 : 3}
                      className="p-8 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <i className="fas fa-folder-open text-4xl mb-3 opacity-20"></i>
                        No records found. Create one to populate dropdowns.
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 text-center text-slate-400 font-mono text-xs">
                        #{item.id}
                      </td>

                      {/* Dynamic Table Rows */}
                      {type === "models" ? (
                        <>
                          <td className="p-4 font-mono font-bold text-blue-600 text-xs">
                            {item.asin_fsn}
                          </td>
                          <td className="p-4 font-bold text-slate-700">
                            {item.model_name}
                          </td>
                          <td className="p-4 text-slate-600">{item.model}</td>
                          <td className="p-4 border-l border-slate-100 text-xs text-slate-500">
                            {item.sap_polyshri || "-"}
                          </td>
                          <td className="p-4 text-xs text-slate-500">
                            {item.sap_rio || "-"}
                          </td>
                          <td className="p-4 text-xs text-slate-500">
                            {item.sap_ne || "-"}
                          </td>
                          <td className="p-4 text-xs text-slate-500">
                            {item.sap_sms || "-"}
                          </td>
                          <td className="p-4 border-r border-slate-100 text-xs text-slate-500">
                            {item.sap_smmpl || "-"}
                          </td>
                        </>
                      ) : (
                        <td className="p-4 font-bold text-slate-700">
                          {item.name}
                        </td>
                      )}

                      {role === "ADMIN" && (
                        <td className="p-4 text-center sticky right-0 bg-white shadow-[-5px_0_10px_rgba(0,0,0,0.02)]">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg mr-2 transition"
                            title="Edit"
                          >
                            <i className="fas fa-pen"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}