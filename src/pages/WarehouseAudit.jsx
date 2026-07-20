import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

// --- ERP STANDARD ICONS ---
const IconSearch = () => (
  <svg
    width="15"
    height="15"
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
const IconFilter = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#64748b"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);
const IconDoc = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#64748b"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
  </svg>
);
const IconDownload = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#64748b"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

export default function WarehouseAudit() {
  // --- STATES ---
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const initialState = {
    invoice_no: "",
    order_id: "",
    expected_qty: "",
    actual_qty: "",
    audited_by: "",
    remarks: "",
    preview_status: "Pending", // Real-time UI feedback ke liye
  };
  const [formData, setFormData] = useState(initialState);

  // --- LIFECYCLE ---
  useEffect(() => {
    fetchAudits();
  }, []);

  // --- API CALLS ---
  const fetchAudits = async () => {
    try {
      setLoading(true);
      const res = await api.get("reports/warehouse-audit/");
      setAuditData(res.data);
    } catch (e) {
      console.error("Error fetching audits:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFetchInvoice = async () => {
    if (!formData.invoice_no.trim()) {
      return Swal.fire(
        "Required",
        "Please enter/scan Invoice Number first!",
        "info",
      );
    }
    setLoading(true);
    try {
      const res = await api.get(
        `reports/fetch-invoice-audit/${formData.invoice_no}/`,
      );
      setFormData((prev) => ({
        ...prev,
        expected_qty: res.data.expected_qty || 0,
        order_id: res.data.order_id || "",
        actual_qty: "", // Reset actual qty on new fetch
        preview_status: "Pending",
      }));
    } catch (e) {
      Swal.fire(
        "Not Found",
        "Invalid Invoice Number or Invoice does not exist.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.actual_qty === "" || formData.actual_qty < 0) {
      return Swal.fire(
        "Error",
        "Actual Quantity must be 0 or greater",
        "error",
      );
    }

    try {
      setLoading(true);
      await api.post("reports/warehouse-audit/", formData);
      Swal.fire(
        "Audit Saved!",
        "Physical stock record has been updated.",
        "success",
      );
      setIsFormModalOpen(false);
      setFormData(initialState);
      fetchAudits();
    } catch (err) {
      Swal.fire("Error", "Failed to save audit: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS & SMART UI LOGIC ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Real-time Matched/Discrepancy calculation for UI Preview
      if (name === "actual_qty") {
        const exp = parseFloat(newData.expected_qty) || 0;
        const act = parseFloat(value);
        if (!isNaN(act)) {
          newData.preview_status = act === exp ? "Matched" : "Discrepancy";
        } else {
          newData.preview_status = "Pending";
        }
      }
      return newData;
    });
  };

  // --- FILTER ---
  const filteredData = auditData.filter(
    (d) =>
      d.audit_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.invoice_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.audited_by?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-[#f8fafc] font-sans h-full flex flex-col p-4 md:p-6 text-slate-700 min-h-screen">
      {/* HEADER BREADCRUMB */}
      <div className="mb-5">
        <p className="text-[12px] text-gray-500 font-medium mb-1 tracking-wide">
          Warehouse & Logistics /{" "}
          <span className="text-slate-700 font-bold">Stock Reconciliation</span>
        </p>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Warehouse Audit
        </h1>
      </div>

      {/* MAIN DATA CARD */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col flex-1 shadow-sm">
        {/* TOOLBAR */}
        <div className="flex justify-between items-center px-5 py-3.5 border-b border-gray-100 flex-shrink-0 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-50 px-3 py-2 rounded-full w-[280px] border border-gray-200 focus-within:border-gray-300 focus-within:bg-white transition-all">
              <IconSearch />
              <input
                type="text"
                placeholder="Search Audit, Invoice or Auditor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none ml-2 text-[13px] w-full font-medium"
              />
            </div>
            <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-full text-[13px] text-gray-600 hover:bg-gray-50 font-medium">
              <IconFilter /> Filter
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button className="p-2 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-md">
              <IconDownload />
            </button>
            <button
              onClick={() => {
                setFormData(initialState);
                setIsFormModalOpen(true);
              }}
              className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white px-5 py-2 rounded-md font-bold text-[13px] shadow-sm ml-2 transition-colors"
            >
              + New Audit Entry
            </button>
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-auto w-full flex-1">
          <table className="w-full text-left min-w-max border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider sticky top-0 border-b border-gray-200 z-10">
              <tr>
                <th className="px-5 py-3 border-r border-gray-100">#</th>
                <th className="px-5 py-3 border-r border-gray-100">Audit No</th>
                <th className="px-5 py-3 border-r border-gray-100">
                  Date & Time
                </th>
                <th className="px-5 py-3 border-r border-gray-100">
                  Invoice Linked
                </th>
                <th className="px-5 py-3 border-r border-gray-100 text-center">
                  Expected Qty
                </th>
                <th className="px-5 py-3 border-r border-gray-100 text-center">
                  Actual Qty
                </th>
                <th className="px-5 py-3 border-r border-gray-100">
                  Audited By
                </th>
                <th className="px-5 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <IconDoc />
                      <p className="mt-2 font-bold text-[13px]">
                        No Audits Found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-[13px] font-medium text-gray-500 border-r border-gray-100">
                      {index + 1}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-bold text-gray-800 border-r border-gray-100">
                      {row.audit_no}
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-gray-600 border-r border-gray-100">
                      {new Date(row.audit_date).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-bold text-blue-600 border-r border-gray-100">
                      {row.invoice_no}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-center font-medium border-r border-gray-100">
                      {row.expected_qty}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-center font-bold text-slate-800 border-r border-gray-100">
                      {row.actual_qty}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-gray-700 border-r border-gray-100">
                      {row.audited_by}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                          row.status === "Matched"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- AUDIT ENTRY MODAL --- */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-[16px] font-bold text-slate-800">
                New Physical Audit
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              {/* Step 1: Scan/Fetch Invoice */}
              <div className="flex gap-3 mb-6 items-end">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                    Step 1: Scan / Enter Invoice No
                  </label>
                  <input
                    type="text"
                    name="invoice_no"
                    value={formData.invoice_no}
                    onChange={handleInputChange}
                    placeholder="e.g. INV-2024-001"
                    className="w-full bg-white border border-gray-300 p-2.5 rounded-md outline-none focus:border-blue-500 text-[13px] font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAutoFetchInvoice}
                  disabled={loading}
                  className="bg-slate-800 text-white text-[13px] font-bold px-6 py-2.5 rounded-md shadow-sm hover:bg-slate-900 transition-colors h-[42px]"
                >
                  {loading ? "Fetching..." : "Fetch Records"}
                </button>
              </div>

              {/* Data Preview Box */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200 mb-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">
                    Linked Order
                  </label>
                  <div className="font-bold text-[13px] text-gray-800">
                    {formData.order_id || "Scan to fetch"}
                  </div>
                </div>
                <div className="text-right">
                  <label className="block text-[10px] font-bold text-blue-600 uppercase">
                    Expected System Quantity
                  </label>
                  <div className="font-black text-[20px] text-blue-700">
                    {formData.expected_qty !== "" ? formData.expected_qty : "-"}
                  </div>
                </div>
              </div>

              {/* Step 2: Form Inputs */}
              <form
                id="auditForm"
                onSubmit={handleSubmit}
                className="grid grid-cols-2 gap-5"
              >
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                    Actual Qty Found (Physical) *
                  </label>
                  <input
                    type="number"
                    required
                    name="actual_qty"
                    value={formData.actual_qty}
                    onChange={handleInputChange}
                    disabled={formData.expected_qty === ""}
                    className="w-full bg-white border border-gray-300 p-2.5 rounded-md focus:border-[#f97316] outline-none text-[15px] font-bold"
                  />
                </div>

                {/* Real-time Status Badge */}
                <div className="col-span-2 md:col-span-1 flex flex-col justify-center">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5 opacity-0">
                    Status
                  </label>
                  <div
                    className={`px-4 py-2.5 rounded-md border text-center font-bold text-[13px] uppercase ${
                      formData.preview_status === "Matched"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                        : formData.preview_status === "Discrepancy"
                          ? "bg-rose-50 border-rose-200 text-rose-600"
                          : "bg-gray-100 border-gray-200 text-gray-400"
                    }`}
                  >
                    {formData.preview_status === "Pending"
                      ? "Waiting for Count..."
                      : formData.preview_status}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                    Audited By (Your Name) *
                  </label>
                  <input
                    type="text"
                    required
                    name="audited_by"
                    value={formData.audited_by}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-300 p-2.5 rounded-md focus:border-[#f97316] outline-none text-[13px]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                    Remarks (Required if Discrepancy)
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    required={formData.preview_status === "Discrepancy"}
                    placeholder="E.g., Box was damaged, missing 2 pieces..."
                    className="w-full bg-white border border-gray-300 p-2.5 rounded-md focus:border-[#f97316] outline-none text-[13px] min-h-[70px]"
                  ></textarea>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-gray-300 font-bold rounded-md text-[13px] text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="auditForm"
                disabled={loading || formData.expected_qty === ""}
                className={`px-6 py-2.5 text-white font-bold rounded-md text-[13px] shadow-sm transition-colors ${
                  formData.preview_status === "Discrepancy"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-[#f97316] hover:bg-[#ea580c]"
                }`}
              >
                {loading ? "Saving..." : "Lock Audit Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
