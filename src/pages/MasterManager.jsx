import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function MasterManager() {
  const { type } = useParams(); // URL se nikalega: 'firms', 'locations', ya 'merchants'
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("user_role") || "USER";

  // Data laane ka function
  const fetchMasterData = async () => {
    try {
      const response = await api.get(`reports/${type}/`);
      setData(response.data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  // Jab bhi left menu se tab change ho, naya data load karo
  useEffect(() => {
    fetchMasterData();
    setName("");
    setEditId(null);
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");

    setLoading(true);
    try {
      if (editId) {
        await api.put(`reports/${type}/${editId}/`, { name });
        alert("Record Updated Successfully!");
      } else {
        await api.post(`reports/${type}/`, { name });
        alert("New Record Added!");
      }
      setName("");
      setEditId(null);
      fetchMasterData();
    } catch (error) {
      alert("Error: Name already exists or invalid data.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
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
        {/* ADD/EDIT FORM (Sirf admin ke liye enable rahega) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-6">
            <h3 className="text-lg font-bold text-slate-800 mb-5">
              {editId ? `Edit ${title}` : `Add New ${title}`}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  {title} Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={role !== "ADMIN"}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none text-sm disabled:opacity-50"
                  
                />
              </div>
              <div className="flex gap-2 pt-2">
                {editId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setName("");
                    }}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-sm transition"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || role !== "ADMIN"}
                  className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition shadow-md shadow-indigo-500/20 disabled:opacity-70 ${editId ? "w-2/3" : ""}`}
                >
                  {loading ? "Saving..." : editId ? "Update" : "Save Globally"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* DATA TABLE (Right Side) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-16 text-center">ID</th>
                  <th className="p-4">{title} Name</th>
                  {role === "ADMIN" && (
                    <th className="p-4 text-center w-32">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-slate-400">
                      No records found. Create one to populate dropdowns.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 text-center text-slate-400 font-mono">
                        #{item.id}
                      </td>
                      <td className="p-4 font-bold text-slate-700">
                        {item.name}
                      </td>
                      {role === "ADMIN" && (
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-slate-400 hover:text-indigo-600 mr-4 transition"
                            title="Edit"
                          >
                            <i className="fas fa-pen"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-slate-400 hover:text-red-600 transition"
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
