import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

// Helper: Indian Currency Formatting
const formatNumber = (num) => {
  if (!num || isNaN(num)) return "0.00";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

// ICONS
const IconSearch = () => (
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
const IconPlus = () => (
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
const IconEdit = () => (
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

export default function FinanceReconciliation() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const initialForm = {
    date: new Date().toISOString().split("T")[0],
    firm_name: "",
    card_number: "",
    system_debit: 0,
    system_credit: 0,
    account_posting_amount: 0,
    status: "Pending",
    remarks: "",
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get("reports/finance-reconciliation/");
      setRecords(res.data);
    } catch (err) {
      console.warn("Error fetching reconciliation data.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    // Auto Calculate Status based on amounts
    if (
      name === "account_posting_amount" ||
      name === "system_debit" ||
      name === "system_credit"
    ) {
      const sysNet =
        parseFloat(updatedForm.system_credit || 0) -
        parseFloat(updatedForm.system_debit || 0);
      const posted = parseFloat(updatedForm.account_posting_amount || 0);

      // Checking difference (Tolerance of 1 rupee for rounding issues)
      if (Math.abs(sysNet - posted) <= 1) {
        updatedForm.status = "Matched";
      } else {
        updatedForm.status = "Discrepancy";
      }
    }
    setFormData(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isUpdateMode && formData.id) {
        await api.put(
          `reports/finance-reconciliation/${formData.id}/`,
          formData,
        );
        Swal.fire(
          "Updated!",
          "Reconciliation record updated successfully.",
          "success",
        );
      } else {
        await api.post("reports/finance-reconciliation/", formData);
        Swal.fire(
          "Created!",
          "New reconciliation record generated.",
          "success",
        );
      }
      setIsModalOpen(false);
      fetchRecords();
    } catch (err) {
      Swal.fire("Error", "Failed to save record.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (record) => {
    setFormData(record);
    setIsUpdateMode(true);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setFormData(initialForm);
    setIsUpdateMode(false);
    setIsModalOpen(true);
  };

  const filteredData = records.filter(
    (r) =>
      r.firm_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.card_number?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Summary Metrics
  const pendingCount = records.filter((r) => r.status === "Pending").length;
  const discrepancyCount = records.filter(
    (r) => r.status === "Discrepancy",
  ).length;

  return (
    <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-300 pb-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
            Finance & Accounts /{" "}
            <span className="text-slate-600">Reconciliation</span>
          </p>
          <h1 className="text-[20px] font-bold text-slate-800 tracking-tight">
            Finance Reconciliation
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-[16px] shadow-sm border border-gray-100 border-l-4 border-l-[#1677ff]">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            Total Records
          </p>
          <p className="text-2xl font-black text-slate-800 mt-1">
            {records.length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-[16px] shadow-sm border border-gray-100 border-l-4 border-l-amber-500">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            Pending Match
          </p>
          <p className="text-2xl font-black text-slate-800 mt-1">
            {pendingCount}
          </p>
        </div>
        <div className="bg-white p-5 rounded-[16px] shadow-sm border border-gray-100 border-l-4 border-l-rose-500">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            Discrepancies
          </p>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {discrepancyCount}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-5 border-b border-gray-50 gap-4">
          <div className="flex items-center bg-gray-50/80 px-4 py-2.5 rounded-full w-full md:w-[300px] border border-gray-100 focus-within:bg-white focus-within:border-[#1677ff] focus-within:ring-4 focus-within:ring-blue-50 transition-all">
            <IconSearch />
            <input
              type="text"
              placeholder="Search Card, Firm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none ml-2 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white rounded-[10px] transition font-bold text-[13px] shadow-md shadow-[#e67e22]/20 whitespace-nowrap"
          >
            <IconPlus /> New Reconciliation
          </button>
        </div>

        <div className="overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[400px]">
          <table className="w-full text-left min-w-max border-collapse">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest sticky top-0 backdrop-blur-md z-10">
              <tr>
                <th className="p-4 pl-6 whitespace-nowrap">Date</th>
                <th className="p-4 whitespace-nowrap">Firm Name</th>
                <th className="p-4 whitespace-nowrap">Card Number</th>
                <th className="p-4 text-right whitespace-nowrap bg-rose-50/50">
                  System Debit (Dr)
                </th>
                <th className="p-4 text-right whitespace-nowrap bg-emerald-50/50">
                  System Credit (Cr)
                </th>
                <th className="p-4 text-right whitespace-nowrap bg-blue-50/50">
                  Sys Net Bal
                </th>
                <th className="p-4 text-right whitespace-nowrap font-black">
                  Actual Posted (Bank)
                </th>
                <th className="p-4 text-center whitespace-nowrap">Status</th>
                <th className="p-4 text-right pr-6 whitespace-nowrap">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-[13px] font-medium text-slate-700 bg-white">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="p-16 text-center text-gray-400 font-bold"
                  >
                    No Records Found
                  </td>
                </tr>
              ) : (
                filteredData.map((r) => {
                  const sysNet =
                    parseFloat(r.system_credit) - parseFloat(r.system_debit);
                  const diff = parseFloat(r.account_posting_amount) - sysNet;

                  return (
                    <tr
                      key={r.id}
                      className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="p-4 pl-6 text-slate-500 whitespace-nowrap">
                        {new Date(r.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-bold text-slate-700">
                        {r.firm_name}
                      </td>
                      <td className="p-4 font-mono font-bold text-[#1677ff] whitespace-nowrap">
                        {r.card_number}
                      </td>
                      <td className="p-4 text-right font-bold text-rose-500 bg-rose-50/10">
                        ₹{formatNumber(r.system_debit)}
                      </td>
                      <td className="p-4 text-right font-bold text-emerald-600 bg-emerald-50/10">
                        ₹{formatNumber(r.system_credit)}
                      </td>
                      <td className="p-4 text-right font-black text-slate-800 bg-blue-50/10">
                        ₹{formatNumber(sysNet)}
                      </td>
                      <td className="p-4 text-right font-black text-indigo-600">
                        ₹{formatNumber(r.account_posting_amount)}
                        {Math.abs(diff) > 1 && (
                          <div className="text-[10px] text-rose-500">
                            Diff: ₹{formatNumber(diff)}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                            r.status === "Matched"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : r.status === "Discrepancy"
                                ? "bg-rose-50 text-rose-600 border-rose-100"
                                : "bg-amber-50 text-amber-600 border-amber-100"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => openUpdateModal(r)}
                          className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 hover:text-[#e67e22] hover:bg-orange-50 hover:border-orange-200 shadow-sm flex items-center justify-center transition ml-auto"
                        >
                          <IconEdit />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center">
              <h3 className="font-bold text-slate-800 tracking-tight text-[16px]">
                {isUpdateMode
                  ? "Verify & Update Reconciliation"
                  : "New Reconciliation Record"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 grid gap-5 bg-[#f0f2f5]/40"
            >
              {/* SECTION 1: Details */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    disabled={isUpdateMode}
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-bold outline-none focus:border-[#1677ff] disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Firm Name
                  </label>
                  <input
                    type="text"
                    name="firm_name"
                    required
                    value={formData.firm_name}
                    onChange={handleInputChange}
                    disabled={isUpdateMode}
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-bold outline-none focus:border-[#1677ff] disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="card_number"
                    required
                    value={formData.card_number}
                    onChange={handleInputChange}
                    disabled={isUpdateMode}
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-mono text-[#1677ff] font-bold outline-none focus:border-[#1677ff] disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* SECTION 2: Amounts */}
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <h4 className="text-[12px] font-black text-slate-500 uppercase tracking-widest border-b pb-2">
                    System Calculation
                  </h4>
                  <div>
                    <label className="text-[11px] font-bold text-rose-400 uppercase tracking-widest mb-1.5 block">
                      System Debit (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="system_debit"
                      value={formData.system_debit}
                      onChange={handleInputChange}
                      className="w-full border border-rose-100 bg-rose-50/30 p-2.5 rounded-lg text-[14px] font-bold text-rose-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5 block">
                      System Credit (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="system_credit"
                      value={formData.system_credit}
                      onChange={handleInputChange}
                      className="w-full border border-emerald-100 bg-emerald-50/30 p-2.5 rounded-lg text-[14px] font-bold text-emerald-600 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[12px] font-black text-indigo-500 uppercase tracking-widest border-b pb-2">
                    Bank / Account Posting
                  </h4>
                  <div>
                    <label className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5 block">
                      Actual Posted Amount (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="account_posting_amount"
                      required
                      value={formData.account_posting_amount}
                      onChange={handleInputChange}
                      className="w-full border-2 border-indigo-200 bg-indigo-50/50 p-2.5 rounded-lg text-[16px] font-black text-indigo-700 outline-none focus:border-indigo-400 transition"
                    />
                  </div>

                  {/* Real-time Status Badge */}
                  <div className="pt-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                      Verification Status
                    </label>
                    <div
                      className={`p-3 rounded-lg border font-bold text-center tracking-widest uppercase text-[12px] transition-colors ${
                        formData.status === "Matched"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                          : formData.status === "Discrepancy"
                            ? "bg-rose-50 border-rose-200 text-rose-600"
                            : "bg-gray-100 border-gray-200 text-gray-500"
                      }`}
                    >
                      {formData.status}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  Remarks (Mandatory if Discrepancy)
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks || ""}
                  onChange={handleInputChange}
                  required={formData.status === "Discrepancy"}
                  className="w-full border border-gray-200 p-3 rounded-lg text-[13px] min-h-[60px] outline-none focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 transition resize-none custom-scrollbar"
                  placeholder="Add notes..."
                ></textarea>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#e67e22] hover:bg-[#d35400] text-white font-bold tracking-widest uppercase rounded-xl text-[12px] w-full shadow-md transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Lock Reconciliation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
