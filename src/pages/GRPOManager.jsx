import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";

// Helper: Indian Number Currency Formatting
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

// PREMIUM OUTLINE SVG ICONS
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
export const IconUpload = () => (
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
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
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

export default function GRPOManager() {
  const role = localStorage.getItem("user_role") || "USER";
  const fileInputRef = useRef(null);

  // --- CORE DATA STATES ---
  const [grpoData, setGrpoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    firm_name: "",
    grpo_status: "",
    purchase_vendor_name: "",
    grpo_create_date: "",
  });

  // --- MODAL CONTROL STATES ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editModeId, setEditModeId] = useState(null);

  // --- 15 DYNAMIC REQUIREMENT FIELDS ---
  const initialState = {
    firm_name: "",
    internal_number: "",
    grpo_status: "Open",
    grpo_user_name: "",
    grpo_no: "",
    grpo_invoice_number: "",
    grpo_create_date: new Date().toISOString().split("T")[0],
    grpo_posting_date: new Date().toISOString().split("T")[0],
    purchase_vendor_code: "",
    purchase_vendor_name: "",
    inward_whs_code: "",
    item_code: "",
    description: "",
    grpo_quantity: "",
    grpo_amt: "",
  };
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    fetchGRPO();
  }, []);

  const fetchGRPO = async () => {
    try {
      setLoading(true);
      const res = await api.get("reports/grpo/");
      setGrpoData(res.data);
    } catch (e) {
      console.error("Error fetching GRPO list:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  // --- CRUD FUNCTIONS ---
  const handleAddNew = () => {
    setEditModeId(null);
    setFormData(initialState);
    setIsFormModalOpen(true);
  };

  const handleEdit = (id) => {
    const record = grpoData.find((g) => g.id === id);
    if (record) {
      setEditModeId(id);
      setFormData(record);
      setIsFormModalOpen(true);
    }
  };

  const handleView = (id) => {
    const record = grpoData.find((g) => g.id === id);
    if (record) {
      setViewData(record);
      setIsViewModalOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        grpo_quantity: parseFloat(formData.grpo_quantity) || 0,
        grpo_amt: parseFloat(formData.grpo_amt) || 0,
      };

      if (editModeId) {
        await api.put(`reports/grpo/${editModeId}/`, payload);
        alert("GRPO Record Updated Successfully!");
      } else {
        await api.post("reports/grpo/", payload);
        alert("New GRPO Record Saved Successfully!");
      }
      setIsFormModalOpen(false);
      fetchGRPO();
    } catch (err) {
      alert("Save Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this GRPO completely?")
    )
      return;
    try {
      await api.delete(`reports/grpo/${id}/`);
      alert("GRPO Record Deleted!");
      fetchGRPO();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  // --- EXCEL BULK UPLOAD ---
  const handleUploadClick = () => fileInputRef.current.click();
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataFile = new FormData();
    formDataFile.append("file", file);

    try {
      setLoading(true);
      await api.post("reports/grpo/upload_excel/", formDataFile, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Excel Bulk Data Imported Successfully!");
      fetchGRPO();
    } catch (err) {
      alert("Upload Failed: " + err.message);
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  };

  // --- EXCEL EXPORT & TEMPLATE ---
  const handleExportData = () => {
    if (filteredGRPO.length === 0)
      return alert("No matching rows to download!");
    let csv =
      "Firm Name,Internal Number,GRPO Status,GRPO User Name,GRPO No.,GRPO Invoice Number,GRPO Create Date,GRPO Posting Date,Purchase Vendor Code,Purchase Vendor Name,Inward WHS Code,Item Code,Description,GRPO Quantity,GRPO Amt\n";

    filteredGRPO.forEach((g) => {
      csv += `"${g.firm_name}","${g.internal_number}","${g.grpo_status}","${g.grpo_user_name}","${g.grpo_no}","${g.grpo_invoice_number}","${g.grpo_create_date}","${g.grpo_posting_date}","${g.purchase_vendor_code}","${g.purchase_vendor_name}","${g.inward_whs_code}","${g.item_code}","${g.description?.replace(/"/g, '""')}","${g.grpo_quantity}","${g.grpo_amt}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `GRPO_Report_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleDownloadTemplate = () => {
    const csv =
      "firm_name,internal_number,grpo_status,grpo_user_name,grpo_no,grpo_invoice_number,grpo_create_date,grpo_posting_date,purchase_vendor_code,purchase_vendor_name,inward_whs_code,item_code,description,grpo_quantity,grpo_amt\nShree Maa,INT901,Open,Kartik,GRPO-551,INV-881,11-07-2026,11-07-2026,VEND-04,Cloud Retail,WHS-Bhopal,IC-8821,OnePlus Nord CE4,50.00,1650000.00\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "GRPO_Bulk_Template.csv";
    link.click();
  };

  // --- FLEXIBLE WORD SEARCH ---
  const flexibleMatch = (fieldValue, searchInput) => {
    if (!searchInput) return true;
    if (!fieldValue) return false;
    const words = searchInput.toLowerCase().split(" ").filter(Boolean);
    const text = fieldValue.toLowerCase();
    return words.some((word) => text.includes(word));
  };

  // 🔥 UNIVERSAL SEARCH FILTER LOGIC 🔥
  const filteredGRPO = grpoData.filter((g) => {
    let match = true;

    // 1. Global Search Bar: Kuch bhi type karein (Text, Number, Invoice No, Qty, Amt) sab match hoga
    if (searchTerm) {
      const s = searchTerm.toLowerCase().trim();

      // Saare fields ko ek array mein daal diya aur String() se safe typecast kiya
      const searchFields = [
        g.grpo_no,
        g.internal_number,
        g.grpo_invoice_number,
        g.purchase_vendor_code,
        g.purchase_vendor_name,
        g.item_code,
        g.firm_name,
        g.grpo_user_name,
        g.inward_whs_code,
        g.description,
        g.grpo_quantity, // Safe Number tracking
        g.grpo_amt, // Safe Amount tracking
      ];

      // Agar kisi bhi ek field mein search term match hota hai toh row dikhegi
      const isMatched = searchFields.some((field) =>
        String(field).toLowerCase().includes(s),
      );

      if (!isMatched) match = false;
    }

    // 2. Specific Dropdown / Column Filters
    if (
      filters.firm_name &&
      !g.firm_name?.toLowerCase().includes(filters.firm_name.toLowerCase())
    )
      match = false;
    if (filters.grpo_status && g.grpo_status !== filters.grpo_status)
      match = false;
    if (
      filters.grpo_create_date &&
      g.grpo_create_date !== filters.grpo_create_date
    )
      match = false;
    if (
      filters.purchase_vendor_name &&
      !flexibleMatch(g.purchase_vendor_name, filters.purchase_vendor_name)
    )
      match = false;

    return match;
  });

  const renderStatusBadge = (status) => {
    if (status === "Cleared")
      return (
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-medium rounded text-xs border border-emerald-100">
          Cleared
        </span>
      );
    if (status === "Cancelled")
      return (
        <span className="px-2.5 py-1 bg-rose-50 text-rose-600 font-medium rounded text-xs border border-rose-100">
          Cancelled
        </span>
      );
    return (
      <span className="px-2.5 py-1 bg-amber-50 text-amber-600 font-medium rounded text-xs border border-amber-100">
        Open
      </span>
    );
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-10 text-slate-700">
      {/* HEADER */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#eab308"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            GRPO Management
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 ml-7">
            Goods Receipt PO tracking & inventory inwarding
          </p>
        </div>
      </div>

      {/* TOP ACTION BAR */}
      <div className="mx-6 mt-6 mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white px-3 py-2 rounded-md border border-gray-300 w-64 shadow-sm focus-within:border-indigo-400 transition-colors">
            <IconSearch />
            <input
              type="text"
              placeholder="Search No., Vendor or Item..."
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
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md hover:bg-emerald-100 transition shadow-sm"
          >
            <IconUpload />{" "}
            <div className="flex flex-col text-left leading-none">
              <span className="text-[10px] text-emerald-500">Upload</span>
              <span className="text-sm font-medium">Excel</span>
            </div>
          </button>
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
            <IconDownload />{" "}
            <div className="flex flex-col text-left leading-none">
              <span className="text-[10px] text-slate-500">Download</span>
              <span className="text-sm font-medium">Excel</span>
            </div>
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-[#eab308] hover:bg-[#ca8a04] text-[#1e293b] rounded-md transition shadow-sm border border-[#ca8a04]"
          >
            <IconPlus />{" "}
            <div className="flex flex-col text-left leading-none">
              <span className="text-[10px] opacity-80">Manual</span>
              <span className="text-sm font-medium">GRPO Entry</span>
            </div>
          </button>
        </div>
      </div>

      {/* SEARCH FILTERS EXPANDABLE */}
      {showFilters && (
        <div className="mx-6 mb-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Create Date
              </label>
              <input
                type="date"
                name="grpo_create_date"
                value={filters.grpo_create_date}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Firm Name
              </label>
              <input
                type="text"
                name="firm_name"
                value={filters.firm_name}
                placeholder="Search firm..."
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Vendor Name
              </label>
              <input
                type="text"
                name="purchase_vendor_name"
                value={filters.purchase_vendor_name}
                placeholder="e.g. sandeep sir"
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                GRPO Status
              </label>
              <select
                name="grpo_status"
                value={filters.grpo_status}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border border-gray-200 p-2 rounded text-sm outline-none focus:border-indigo-400 bg-white"
              >
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="Cleared">Cleared</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() =>
                  setFilters({
                    firm_name: "",
                    grpo_status: "",
                    purchase_vendor_name: "",
                    grpo_create_date: "",
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

      {/* DATA TABLE (Flat - No Merges) */}
      <div className="mx-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 text-xs font-medium uppercase tracking-wide">
              <tr>
                <th className="p-3 pl-6 font-medium whitespace-nowrap">
                  GRPO No
                </th>
                <th className="p-3 font-medium whitespace-nowrap">Date</th>
                <th className="p-3 font-medium whitespace-nowrap">Firm Name</th>
                <th className="p-3 font-medium whitespace-nowrap">
                  Vendor Name
                </th>
                <th className="p-3 font-medium whitespace-nowrap">Item Code</th>
                <th className="p-3 font-medium min-w-[200px]">Description</th>
                <th className="p-3 font-medium whitespace-nowrap">Quantity</th>
                <th className="p-3 font-medium whitespace-nowrap">Amount</th>
                <th className="p-3 font-medium whitespace-nowrap">Status</th>
                <th className="p-3 text-center pr-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-slate-700">
              {filteredGRPO.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-12 text-center text-slate-400">
                    No GRPO records match filters.
                  </td>
                </tr>
              ) : (
                filteredGRPO.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-3 pl-6 font-medium text-indigo-600 whitespace-nowrap">
                      {row.grpo_no}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {row.grpo_create_date}
                    </td>
                    <td className="p-3 whitespace-nowrap">{row.firm_name}</td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">
                        {row.purchase_vendor_name}
                      </div>
                      <div className="text-xs text-slate-400">
                        Code: {row.purchase_vendor_code}
                      </div>
                    </td>
                    <td className="p-3 font-medium whitespace-nowrap">
                      {row.item_code}
                    </td>
                    <td className="p-3 whitespace-normal break-words max-w-xs">
                      {row.description}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {row.grpo_quantity}
                    </td>
                    <td className="p-3 font-medium text-emerald-600 whitespace-nowrap">
                      ₹{formatIndianNumber(row.grpo_amt)}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {renderStatusBadge(row.grpo_status)}
                    </td>

                    <td className="p-3 text-center pr-6 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(row.id)}
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
                        <button
                          onClick={() => handleEdit(row.id)}
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
                        {role === "ADMIN" && (
                          <button
                            onClick={() => handleDelete(row.id)}
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
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚀 VIEW MODAL (ALL 15 FIELDS FULL AUDIT) 🚀 */}
      {isViewModalOpen && viewData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 bg-slate-50 flex justify-between items-center">
              <h3 className="text-base font-semibold text-slate-800">
                GRPO Audit Data Sheet — {viewData.grpo_no}
              </h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
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
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6 bg-white overflow-y-auto">
              {Object.keys(initialState).map((k) => (
                <div key={k} className="border-b pb-2 border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                    {k.replace(/_/g, " ")}
                  </p>
                  <p className="font-medium text-sm text-slate-800">
                    {k === "grpo_amt"
                      ? `₹${formatIndianNumber(viewData[k])}`
                      : String(viewData[k] || "-")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🚀 FORM MODAL (CREATE / EDIT) 🚀 */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-medium text-slate-800">
                {editModeId ? "Edit GRPO Record" : "New GRPO Entry"}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
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
                id="grpoForm"
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-white p-5 rounded-lg border border-gray-200"
              >
                {Object.keys(initialState).map((fieldKey) => (
                  <div key={fieldKey}>
                    <label className="block text-xs text-slate-500 mb-1 capitalize font-medium">
                      {fieldKey.replace(/_/g, " ")}
                    </label>
                    {fieldKey.includes("date") ? (
                      <input
                        type="date"
                        required
                        name={fieldKey}
                        value={formData[fieldKey]}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
                      />
                    ) : fieldKey === "grpo_status" ? (
                      <select
                        name={fieldKey}
                        value={formData[fieldKey]}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400 bg-white"
                      >
                        <option value="Open">Open</option>
                        <option value="Cleared">Cleared</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        required={fieldKey !== "description"}
                        name={fieldKey}
                        value={formData[fieldKey]}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 p-2 rounded text-sm outline-none focus:border-indigo-400"
                        placeholder={`Enter details...`}
                      />
                    )}
                  </div>
                ))}
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
                form="grpoForm"
                disabled={loading}
                className="px-5 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition"
              >
                {loading ? "Saving..." : "Save Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
