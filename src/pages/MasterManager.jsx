import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export const IconClear = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
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
export const IconTrash = () => (
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
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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

  // 🔥 BULK DELETE SELECTION STATE
  const [selectedIds, setSelectedIds] = useState([]);

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
    setSelectedIds([]); // Tab change par selections clear
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

    let payload = { ...formData };
    if (currentTab === "sellers") {
      if (!/^[A-Z0-9]{15}$/.test(formData.gstn_no))
        return alert(
          "Invalid GSTN! Must be exactly 15 alphanumeric characters.",
        );
      if (!formData.name) return alert("Please enter a Seller Name.");
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
      const res = await api.post(`reports/${currentTab}/upload/`, formDataObj);
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

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(filteredData.map((item) => item.id));
    else setSelectedIds([]);
  };

  const handleSelectRow = (id) => {
    if (selectedIds.includes(id))
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  // 🔥 PRD REQUIREMENT: BULK DELETE CHECKBOXES 🔥
  const handleBulkDelete = async () => {
    if (role !== "ADMIN") return alert("Only Admins can modify Master Data.");
    if (selectedIds.length === 0)
      return alert("Please select at least one record to delete.");

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.length} records? This action cannot be undone.`,
      )
    ) {
      setLoading(true);
      try {
        await api.post(`reports/${currentTab}/bulk_delete/`, {
          ids: selectedIds,
        });
        setSelectedIds([]);
        fetchMasterData();
      } catch (error) {
        alert("Bulk Delete failed.");
      } finally {
        setLoading(false);
      }
    }
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
      : currentTab === "sellers"
        ? [
            "gstn_no",
            "name",
            "sap_polyshri",
            "sap_rio",
            "sap_ne",
            "sap_sms",
            "sap_smmpl",
          ]
        : ["name"];

  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + uploadHeaders.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `${currentTab}_Template.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportData = async () => {
    try {
      const response = await api.get(`reports/${currentTab}/export_data/`);
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `All_${currentTab}_List.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
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
        item.model_name?.toLowerCase().includes(s)
      );
    else if (currentTab === "sellers")
      return (
        item.name?.toLowerCase().includes(s) ||
        item.gstn_no?.toLowerCase().includes(s)
      );
    else return item.name?.toLowerCase().includes(s);
  });

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans pb-10 text-slate-700">
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
            Modules / <span className="text-slate-600">Master Data</span>
          </p>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
            Master Management
          </h1>
        </div>
      </div>

      <div className="mx-6 mt-6 mb-4 flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
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

      <div className="mx-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center bg-white px-3 py-2 rounded-md border border-gray-300 w-64 shadow-sm focus-within:border-indigo-400 transition-colors">
            <IconSearch />
            <input
              type="text"
              placeholder={`Search in ${currentTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none ml-2 text-sm w-full text-slate-700 placeholder-slate-400"
            />

            {/* 🔥 MAGIC CLEAR (CROSS) BUTTON 🔥 */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-orange-400 hover:text-red-500 bg-gray-100 hover:bg-red-50 w-5 h-5 rounded-full flex items-center justify-center outline-none transition-colors ml-1"
                title="Clear search"
              >
                <IconClear />
              </button>
            )}
          </div>

          {role === "ADMIN" && (
            <div className="flex items-center gap-3">
              {/* 🔥 BULK DELETE BUTTON 🔥 */}
              {selectedIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm font-bold hover:bg-red-100 transition shadow-sm flex items-center gap-2"
                >
                  <IconTrash /> Delete ({selectedIds.length})
                </button>
              )}

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
                  <span className="text-[10px] text-slate-500">Download</span>
                  <span className="text-sm font-medium">Export</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setFormData(initialFormState);
                  setEditId(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#e67e22] hover:bg-blue-600 text-white rounded-md transition shadow-sm border"
              >
                <IconPlus />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[10px] opacity-80 hidden md:inline">
                    New
                  </span>
                  <span className="text-sm font-medium">Record</span>
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto w-full custom-scrollbar min-h-[450px]">
          <table className="w-full text-left min-w-max border-collapse">
            <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 text-xs font-medium uppercase tracking-wide sticky top-0 z-10">
              <tr>
                {/* Checkbox Column for Bulk Delete */}
                <th className="p-3 pl-6 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedIds.length === filteredData.length &&
                      filteredData.length > 0
                    }
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
                <th className="p-3 w-16 text-center">#</th>
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
                  <th className="p-3">NAME</th>
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
                    <p className="font-bold text-slate-600">No Records Found</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="p-3 pl-6 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleSelectRow(item.id)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 text-center text-gray-400 font-medium text-xs">
                      {(index + 1).toString().padStart(2, "0")}
                    </td>
                    {currentTab === "models" ? (
                      <>
                        <td className="p-3 font-medium text-[#e67e22]">
                          {item.asin_fsn}
                        </td>
                        <td className="p-3 text-slate-800 font-medium">
                          {item.model_name}
                        </td>
                        <td className="p-3 text-gray-500">
                          {item.model || "—"}
                        </td>
                        <td className="p-3 border-l border-gray-50 text-xs text-gray-500 text-center">
                          {item.sap_polyshri || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center">
                          {item.sap_rio || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center">
                          {item.sap_ne || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center">
                          {item.sap_sms || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center">
                          {item.sap_smmpl || "—"}
                        </td>
                      </>
                    ) : currentTab === "sellers" ? (
                      <>
                        <td className="p-3 font-medium text-[#e67e22] tracking-wide">
                          {item.gstn_no}
                        </td>
                        <td className="p-3 text-slate-800 font-medium">
                          {item.name}
                        </td>
                        <td className="p-3 border-l border-gray-50 text-xs text-gray-500 text-center">
                          {item.sap_polyshri || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center">
                          {item.sap_rio || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center">
                          {item.sap_ne || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center">
                          {item.sap_sms || "—"}
                        </td>
                        <td className="p-3 text-xs text-gray-500 text-center">
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
                            onClick={() => {
                              setFormData(item);
                              setEditId(item.id);
                              setIsModalOpen(true);
                            }}
                            title="Edit"
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
                            title="Delete"
                            className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#ff4d4f] hover:border-red-200 shadow-sm flex items-center justify-center transition"
                          >
                            <IconTrash />
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
