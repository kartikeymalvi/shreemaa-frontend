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
const IconWallet = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
  </svg>
);

export default function SettlementManager() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialForm = {
    date: new Date().toISOString().split("T")[0],
    firm_name: "",
    card_number: "",
    txn_type: "Refill",
    amount: "",
    remarks: "",
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      const res = await api.get("reports/settlements/");
      setSettlements(res.data);
    } catch (err) {
      console.warn("Error fetching settlements.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.amount <= 0)
      return Swal.fire("Error", "Amount must be greater than 0", "error");

    try {
      setLoading(true);
      await api.post("reports/settlements/", formData);
      Swal.fire("Success", "Funds Added Successfully!", "success");
      setIsModalOpen(false);
      setFormData(initialForm);
      fetchSettlements();
    } catch (err) {
      Swal.fire("Error", "Failed to save entry", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredData = settlements.filter(
    (s) =>
      s.firm_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.card_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.txn_id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Stats
  const totalRefills = settlements.reduce(
    (acc, curr) => acc + parseFloat(curr.amount || 0),
    0,
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-300 pb-10">
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
            Finance & Accounts /{" "}
            <span className="text-slate-600">Settlement</span>
          </p>
          <h1 className="text-[20px] font-bold text-slate-800 tracking-tight">
            Card Settlements & Funding
          </h1>
        </div>
      </div>

      {/* SUMMARY WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-[16px] shadow-sm border border-gray-100 border-l-4 border-l-[#1677ff] flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
              Total Transactions
            </p>
            <p className="text-2xl font-black text-slate-800 mt-1">
              {settlements.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
            <IconWallet />
          </div>
        </div>
        <div className="bg-white p-5 rounded-[16px] shadow-sm border border-gray-100 border-l-4 border-l-emerald-500">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">
            Lifetime Funds Added
          </p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            ₹{formatNumber(totalRefills)}
          </p>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-5 border-b border-gray-50 gap-4">
          <div className="flex items-center bg-gray-50/80 px-4 py-2.5 rounded-full w-full md:w-[320px] border border-gray-100 focus-within:bg-white focus-within:border-[#1677ff] focus-within:ring-4 focus-within:ring-blue-50 transition-all">
            <IconSearch />
            <input
              type="text"
              placeholder="Search Card, Firm or Txn ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none ml-2 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white rounded-[10px] transition font-bold text-[13px] shadow-md shadow-[#e67e22]/20 whitespace-nowrap"
          >
            <IconPlus /> Add Funds / Refill
          </button>
        </div>

        <div className="overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[400px]">
          <table className="w-full text-left min-w-max border-collapse">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="p-4 pl-6 whitespace-nowrap">Txn ID</th>
                <th className="p-4 whitespace-nowrap">Date</th>
                <th className="p-4 whitespace-nowrap">Firm Name</th>
                <th className="p-4 whitespace-nowrap">Card Number</th>
                <th className="p-4 whitespace-nowrap">Type</th>
                <th className="p-4 whitespace-nowrap">Remarks</th>
                <th className="p-4 text-right pr-6 whitespace-nowrap bg-emerald-50/50">
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody className="text-[13px] font-medium text-slate-700 bg-white">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="p-16 text-center text-gray-400 font-bold"
                  >
                    No Settlements Found
                  </td>
                </tr>
              ) : (
                filteredData.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="p-4 pl-6 font-mono font-bold text-slate-800">
                      {s.txn_id}
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(s.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-4 font-bold text-slate-700">
                      {s.firm_name}
                    </td>
                    <td className="p-4 font-mono font-bold text-[#1677ff]">
                      {s.card_number}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md text-[10px] font-bold uppercase">
                        {s.txn_type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-[12px]">
                      {s.remarks || "—"}
                    </td>
                    <td className="p-4 text-right pr-6 font-black text-emerald-600 bg-emerald-50/10">
                      + ₹{formatNumber(s.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD FUNDS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center">
              <h3 className="font-bold text-slate-800 tracking-tight text-[16px]">
                Add Settlement / Refill
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 grid gap-5 bg-[#f0f2f5]/40"
            >
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full border p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                      Txn Type *
                    </label>
                    <select
                      value={formData.txn_type}
                      onChange={(e) =>
                        setFormData({ ...formData, txn_type: e.target.value })
                      }
                      className="w-full border p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none"
                    >
                      <option value="Refill">Refill</option>
                      <option value="Opening Balance">Opening Balance</option>
                      <option value="Manual Adjustment">
                        Manual Adjustment
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Firm Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shree Maa Group"
                    value={formData.firm_name}
                    onChange={(e) =>
                      setFormData({ ...formData, firm_name: e.target.value })
                    }
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-bold outline-none focus:border-[#1677ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 45XX-XXXX-9012"
                    value={formData.card_number}
                    onChange={(e) =>
                      setFormData({ ...formData, card_number: e.target.value })
                    }
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-mono font-bold text-[#1677ff] outline-none focus:border-[#1677ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full border border-emerald-200 bg-emerald-50 p-2.5 rounded-lg text-[16px] font-black text-emerald-700 outline-none focus:ring-4 focus:ring-emerald-100 transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Remarks (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Monthly limit load"
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] outline-none focus:border-[#1677ff]"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#e67e22] hover:bg-[#d35400] text-white font-bold tracking-widest uppercase rounded-xl text-[12px] w-full shadow-md transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Add Funds"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
