import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

// --- PREMIUM SVG ICONS ---
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
export const IconFilter = () => (
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
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

export default function RefundManager() {
  const [refunds, setRefunds] = useState([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const role = localStorage.getItem("user_role") || "USER";

  const fetchRefunds = async () => {
    try {
      const res = await api.get("reports/refunds/");
      let data = res.data.results || res.data;
      if (globalSearch) {
        data = data.filter((r) =>
          JSON.stringify(r).toLowerCase().includes(globalSearch.toLowerCase()),
        );
      }
      setRefunds(data);
    } catch (e) {
      console.error("Fetch error:", e);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, [globalSearch]);

  const handleUpdateClick = (refund) => {
    setUpdateData({
      id: refund.id,
      refund_type: refund.refund_type || "",
      refund_status: refund.refund_status || "Pending",
      received_date: refund.received_date || "",
      received_txn_type: refund.received_txn_type || "",
      received_card_no: refund.received_card_no || "",
      received_comment: refund.received_comment || "",
    });
    setUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`reports/refunds/${updateData.id}/`, updateData);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Refund details manually updated.",
        confirmButtonColor: "#0f172a",
      });
      setUpdateModalOpen(false);
      fetchRefunds();
    } catch (e) {
      Swal.fire("Error", "Could not update details.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (role !== "ADMIN") return;
    const confirm = await Swal.fire({
      title: "Delete Record?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete!",
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`reports/refunds/${id}/`);
        fetchRefunds();
      } catch (e) {
        Swal.fire("Error", "Failed to delete.", "error");
      }
    }
  };

  const getBadgeStyle = (status) => {
    const s = String(status || "")
      .trim()
      .toLowerCase();
    if (s === "completed")
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-300",
        dot: "bg-emerald-600",
      };
    return {
      bg: "bg-amber-50 text-amber-700 border-amber-300",
      dot: "bg-amber-600",
    };
  };

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans pb-10 text-slate-700">
      {/* HEADER */}
      <div className="bg-white px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
            Account Pages / <span className="text-slate-600">Refund</span>
          </p>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Refund Management
          </h1>
        </div>
      </div>

      {/* --- MAIN CARD WRAPPER --- */}
      <div className="mx-6 mt-6 bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden flex flex-col">
        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-gray-100 bg-white gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-gray-50/80 px-4 py-2.5 rounded-full w-full md:w-[320px] border border-gray-100 focus-within:bg-white focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
              <IconSearch />
              <input
                type="text"
                placeholder="Search refunds..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="bg-transparent border-none outline-none ml-3 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch("")}
                  className="text-gray-400 hover:text-gray-600 outline-none ml-2"
                >
                  <i className="fas fa-times-circle"></i>
                </button>
              )}
            </div>

            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-[13px] font-bold transition-colors shadow-sm whitespace-nowrap bg-white border-gray-200 text-gray-500 hover:bg-gray-50">
              <IconFilter /> Filter
            </button>
          </div>
        </div>

        {/* FULL DATA TABLE (Premium Theme) */}
        <div className="overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[50vh] max-h-[65vh]">
          <table className="w-full text-left min-w-max border-collapse whitespace-nowrap">
            <thead className="bg-gray-50/50 text-slate-500 text-[11px] font-bold uppercase tracking-widest sticky top-0 z-20 backdrop-blur-md shadow-sm">
              <tr>
                <th className="px-4 py-3 text-center bg-gray-50">#</th>
                <th className="px-4 py-3 bg-gray-50">Source Date</th>
                <th className="px-4 py-3 bg-gray-50">Firm</th>
                <th className="px-4 py-3 bg-gray-50">Merchant</th>
                <th className="px-4 py-3 bg-gray-50">Order ID</th>
                <th className="px-4 py-3 bg-gray-50">Invoice No</th>
                <th className="px-4 py-3 bg-gray-50">Model Name</th>
                <th className="px-4 py-3 text-right bg-gray-50">Invoice Amt</th>
                <th className="px-4 py-3 bg-gray-50 text-[#e67e22]">
                  Refund Type
                </th>
                <th className="px-4 py-3 bg-gray-50 text-[#e67e22] text-center">
                  Status
                </th>
                <th className="px-4 py-3 bg-gray-50 text-[#e67e22]">
                  Recv Date
                </th>
                <th className="px-4 py-3 bg-gray-50 text-[#e67e22]">
                  Txn Type
                </th>
                <th className="px-4 py-3 bg-gray-50 text-[#e67e22]">Card No</th>
                <th className="px-4 py-3 bg-gray-50 text-[#e67e22]">Comment</th>
                <th className="px-4 py-3 text-center bg-gray-50 z-30">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-[13px] font-medium text-slate-700 bg-white">
              {refunds.length === 0 ? (
                <tr>
                  <td colSpan="15" className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
                        <i className="fas fa-inbox text-2xl text-gray-300"></i>
                      </div>
                      <p className="font-bold text-slate-600">
                        No Refunds Found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                refunds.map((r, index) => {
                  const badgeStyle = getBadgeStyle(r.refund_status);
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-blue-50/20 transition-colors group border-b border-gray-50"
                    >
                      <td className="px-4 py-3 text-center text-gray-400 font-medium text-xs">
                        {(index + 1).toString().padStart(2, "0")}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {r.source_date || "-"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {r.firm || "-"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {r.merchant || "-"}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-[#e67e22] tracking-wide">
                        {r.order_id || "-"}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800">
                        {r.invoice_no || "-"}
                      </td>
                      <td
                        className="px-4 py-3 text-slate-700 max-w-[150px] truncate"
                        title={r.model_name}
                      >
                        {r.model_name || "-"}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-rose-500">
                        ₹
                        {parseFloat(r.invoice_amount || 0).toLocaleString(
                          "en-IN",
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {r.refund_type || "-"}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border border-dashed ${badgeStyle.bg}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}
                          ></span>
                          {r.refund_status || "Pending"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {r.received_date || "-"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {r.received_txn_type || "-"}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">
                        {r.received_card_no || "-"}
                      </td>
                      <td
                        className="px-4 py-3 text-[12px] text-slate-500 max-w-[150px] truncate"
                        title={r.received_comment}
                      >
                        {r.received_comment || "-"}
                      </td>
                      {/* 🔥 ACTION COLUMN 🔥 */}
                      <td className="px-4 py-3 text-center bg-white z-10">
                        <div className="flex items-center justify-center gap-2">
                          {/* 1. UPDATE BUTTON (Sabke liye - Opens Screenshot 2 Popup) */}
                          <button
                            onClick={() => handleUpdateClick(r)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase tracking-widest rounded-md border border-emerald-200 hover:bg-emerald-500 hover:text-white transition shadow-sm"
                          >
                            <i className="fas fa-sync-alt"></i> Update
                          </button>

                          {/* 2. ADMIN ONLY: PENCIL & TRASH */}
                          {role === "ADMIN" && (
                            <>
                              <button
                                onClick={() => handleUpdateClick(r)}
                                title="Edit Full Record"
                                className="w-8 h-8 rounded-md bg-white border border-gray-200 text-blue-500 hover:text-blue-600 hover:bg-blue-50 shadow-sm flex items-center justify-center transition"
                              >
                                <i className="fas fa-pen text-[12px]"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(r.id)}
                                title="Delete Record"
                                className="w-8 h-8 rounded-md bg-white border border-gray-200 text-red-400 hover:text-red-500 hover:bg-red-50 shadow-sm flex items-center justify-center transition"
                              >
                                <i className="fas fa-trash-alt text-[12px]"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Total Records:{" "}
            <span className="text-[#e67e22] text-[13px]">{refunds.length}</span>
          </div>
        </div>
      </div>

      {/* UPDATE MODAL (Premium Theme) */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center">
              <div>
                <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">
                  Update Refund Data
                </h3>
              </div>
              <button
                onClick={() => setUpdateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 flex items-center justify-center transition"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            <form
              onSubmit={handleUpdateSubmit}
              className="p-6 space-y-5 bg-[#f0f2f5]/40"
            >
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Refund Type
                  </label>
                  <input
                    type="text"
                    value={updateData.refund_type}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,
                        refund_type: e.target.value,
                      })
                    }
                    className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] outline-none text-[13px] font-bold text-slate-800 transition"
                    placeholder="e.g. Exchange"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Refund Status
                  </label>
                  <select
                    value={updateData.refund_status}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,
                        refund_status: e.target.value,
                      })
                    }
                    className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] outline-none text-[13px] font-bold text-slate-800 transition"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Received Date
                  </label>
                  <input
                    type="date"
                    value={updateData.received_date}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,
                        received_date: e.target.value,
                      })
                    }
                    className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] outline-none text-[13px] font-bold text-slate-800 transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Txn Type
                  </label>
                  <input
                    type="text"
                    value={updateData.received_txn_type}
                    onChange={(e) =>
                      setUpdateData({
                        ...updateData,
                        received_txn_type: e.target.value,
                      })
                    }
                    className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] outline-none text-[13px] font-bold text-slate-800 transition"
                    placeholder="e.g. NEFT, UPI"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Card Number
                </label>
                <input
                  type="text"
                  value={updateData.received_card_no}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      received_card_no: e.target.value,
                    })
                  }
                  className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] outline-none text-[13px] font-bold text-slate-800 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Comment
                </label>
                <textarea
                  value={updateData.received_comment}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      received_comment: e.target.value,
                    })
                  }
                  className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#e67e22] outline-none text-[13px] font-medium text-slate-800 transition custom-scrollbar"
                  rows="2"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setUpdateModalOpen(false)}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#e67e22] hover:bg-blue-600 text-white font-bold text-[11px] uppercase tracking-widest rounded-xl shadow-md shadow-blue-500/20 transition"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
