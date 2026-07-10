import React, { useState } from "react";
import api from "../api/axios";

// --- DATE FORMATTER ---
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
};

export default function TrackId() {
  const [trackingId, setTrackingId] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.get(
        `reports/shipments/?search=${trackingId.trim()}`,
      );
      const data = res.data.results || res.data;
      setResults(data);
    } catch (error) {
      console.error("Tracking Fetch Error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CLEAR FUNCTION: Box aur Table dono reset karne ke liye
  const handleClear = () => {
    setTrackingId("");
    setResults([]);
    setHasSearched(false);
  };

  // 🔥 SAME BADGE STYLE AS INVOICE SHIPMENT PAGE
  const getBadgeStyle = (status) => {
    const s = String(status || "")
      .trim()
      .toLowerCase();
    if (s === "delivered")
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-300",
        dot: "bg-emerald-600",
      };
    if (s === "cancelled")
      return { bg: "bg-red-50 text-red-700 border-red-300", dot: "bg-red-600" };
    if (s === "pending")
      return {
        bg: "bg-amber-50 text-amber-700 border-amber-300",
        dot: "bg-amber-600",
      };
    return {
      bg: "bg-slate-50 text-slate-700 border-slate-300",
      dot: "bg-slate-600",
    };
  };

  return (
    <div className="bg-transparent min-h-screen font-sans pb-10">
      {/* PAGE HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Track Shipment
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Search via Tracking ID or AWB to view detailed invoice and delivery
            status.
          </p>
        </div>
      </div>

      {/* SEARCH BOX (Centered Aligned with Clear Button) */}
      <div className="flex justify-center mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-full max-w-2xl">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">
            Enter Tracking ID / AWB
          </label>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="E.G. AWB12345678"
                className="w-full bg-gray-50 border border-gray-200 p-3 pr-10 rounded-lg outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 font-bold text-slate-800 text-sm uppercase tracking-wider"
              />
              {/* CLEAR BUTTON (X) */}
              {trackingId && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 p-1 transition-colors"
                  title="Clear Search"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !trackingId.trim()}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 min-w-[130px] disabled:opacity-50"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>
                  <i className="fas fa-search"></i> Search
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* PERMANENT RESULTS TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[60vh] min-h-[40vh] custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-black uppercase tracking-widest sticky top-0 z-10 backdrop-blur-sm">
                <th className="p-4 w-12 text-center">S.No</th>
                <th className="p-4 text-center bg-indigo-50/50">Tracking ID</th>
                <th className="p-4">Order ID</th>
                <th className="p-4">Invoice No</th>
                <th className="p-4">Invoice Date</th>
                <th className="p-4">Model Name</th>
                <th className="p-4 text-center">Inv Qty</th>
                <th className="p-4 text-right">Inv Amount</th>
                <th className="p-4 border-l border-gray-100">Firm</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-center border-l border-gray-100">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {/* STATE 1: INITIAL (Not Searched Yet) */}
              {!hasSearched ? (
                <tr>
                  <td
                    colSpan="11"
                    className="p-16 text-center text-slate-400 font-medium"
                  >
                    <i className="fas fa-search text-4xl mb-4 opacity-30 block"></i>
                    <p className="text-base text-slate-500 font-bold mb-1">
                      Ready to Track
                    </p>
                    <p className="text-xs">
                      Enter a Tracking ID or AWB in the search box above.
                    </p>
                  </td>
                </tr>
              ) : /* STATE 2: LOADING */
              loading ? (
                <tr>
                  <td
                    colSpan="11"
                    className="p-16 text-center text-slate-400 font-medium"
                  >
                    <i className="fas fa-spinner fa-spin text-4xl mb-4 opacity-50 block text-indigo-500"></i>
                    <p className="text-base text-slate-500 font-bold mb-1">
                      Searching Database...
                    </p>
                  </td>
                </tr>
              ) : /* STATE 3: NO RESULTS FOUND */
              results.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    className="p-16 text-center text-slate-400 font-medium"
                  >
                    <i className="fas fa-box-open text-4xl mb-4 opacity-50 block text-red-400"></i>
                    <p className="text-base text-slate-500 font-bold mb-1">
                      No Shipment Found!
                    </p>
                    <p className="text-xs">
                      Please verify the Tracking ID and try again.
                    </p>
                  </td>
                </tr>
              ) : (
                /* STATE 4: RESULTS FOUND (Map Rows) */
                results.map((item, index) => {
                  const badgeStyle = getBadgeStyle(item.delivery_status);
                  return (
                    <tr
                      key={index}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="p-4 text-center font-mono text-[11px] font-bold text-slate-400">
                        {(index + 1).toString().padStart(2, "0")}
                      </td>
                      <td className="p-4 font-black text-indigo-600 bg-indigo-50/20 text-[12px] uppercase tracking-wider text-center">
                        {item.tracking_id || trackingId}
                      </td>
                      <td className="p-4 font-bold text-slate-800 text-[13px]">
                        {item.order_id || "-"}
                      </td>
                      <td className="p-4 font-bold text-slate-700 text-[13px]">
                        {item.invoice_no || "-"}
                      </td>
                      <td className="p-4 text-slate-600 font-medium text-[13px]">
                        {formatDate(item.invoice_date)}
                      </td>
                      <td className="p-4 font-medium text-slate-700 text-[13px]">
                        {item.model_name || "-"}
                      </td>
                      <td className="p-4 text-center font-bold text-slate-800">
                        {item.invoice_qty || "-"}
                      </td>
                      <td className="p-4 text-right font-bold text-slate-800 text-[13px]">
                        ₹
                        {parseFloat(item.invoice_amount || 0).toLocaleString(
                          "en-IN",
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-700 text-[13px] border-l border-gray-100">
                        {item.firm || "-"}
                      </td>
                      <td className="p-4 text-slate-600 text-[13px]">
                        {item.location || "-"}
                      </td>

                      {/* Status Badge */}
                      <td className="p-4 text-center border-l border-gray-100">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border border-dashed ${badgeStyle.bg}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}
                          ></span>
                          {item.delivery_status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
