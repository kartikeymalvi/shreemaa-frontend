import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

// Helper: Indian Currency Formatting
const formatNumber = (num) => {
  if (!num || isNaN(num)) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
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
const IconExcel = () => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="8" y1="13" x2="16" y2="13"></line>
    <line x1="8" y1="17" x2="16" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);
const IconFilter = () => (
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
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

export default function ReportsDashboard() {
  const [activeReport, setActiveReport] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);

  // PRD ke hisaab se 7 Reports ka Menu
  const reportsMenu = [
    { id: "1", name: "Delivered vs Inward Pending", icon: "fas fa-box-open" },
    { id: "2", name: "Price Tracker", icon: "fas fa-chart-line" },
    { id: "3", name: "Model-wise Summary", icon: "fas fa-mobile-alt" },
    { id: "4", name: "Location-wise Summary", icon: "fas fa-map-marker-alt" },
    { id: "5", name: "Card/TXN Finance Summary", icon: "fas fa-credit-card" },
    { id: "6", name: "Model Pricing Trend", icon: "fas fa-tags" },
    { id: "7", name: "Open vs Completed Status", icon: "fas fa-check-circle" },
  ];

  // Dummy Data Fetching (Replace with your actual APIs later)
  useEffect(() => {
    fetchReportData();
  }, [activeReport]);

  const fetchReportData = async () => {
    setLoading(true);
    // Yahan backend API call aayegi based on 'activeReport'
    // Ex: const res = await api.get(`/reports/analytics/?type=${activeReport}`);

    // Simulate API Delay & Dummy Data Setup
    setTimeout(() => {
      let data = [];
      if (activeReport === "1") {
        data = [
          {
            item: "Apple iPhone 15",
            delivered: 150,
            inward_done: 120,
            pending: 30,
          },
          {
            item: "Samsung S24 Ultra",
            delivered: 80,
            inward_done: 80,
            pending: 0,
          },
        ];
      } else if (activeReport === "3") {
        data = [
          {
            model: "iPhone 15 Pro",
            orders: 200,
            delivered: 180,
            cancelled: 10,
            refunded: 5,
          },
          {
            model: "MacBook Air M3",
            orders: 50,
            delivered: 45,
            cancelled: 5,
            refunded: 2,
          },
        ];
      } else if (activeReport === "7") {
        data = [
          {
            date: "2026-07-20",
            completed: 145,
            open: 20,
            refund_pending: 5,
            total: 170,
          },
          {
            date: "2026-07-21",
            completed: 80,
            open: 40,
            refund_pending: 10,
            total: 130,
          },
        ];
      }
      setReportData(data);
      setLoading(false);
    }, 600);
  };

  const handleExcelDownload = () => {
    Swal.fire(
      "Downloading...",
      "Your Excel report is being generated.",
      "success",
    );
    // Actual implementation me yahan XLSX library ya backend excel URL trigger hoga
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-300 pb-10">
      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-5">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
            Analytics & Insights /{" "}
            <span className="text-slate-600">Master Reports</span>
          </p>
          <h1 className="text-[20px] font-bold text-slate-800 tracking-tight">
            Business Intelligence Hub
          </h1>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* LEFT SIDEBAR: REPORT SELECTOR */}
        <div className="w-full xl:w-[300px] flex-shrink-0">
          <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
              <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">
                Available Reports
              </h2>
            </div>
            <div className="p-2 flex flex-col gap-1">
              {reportsMenu.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setActiveReport(report.id)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all ${
                    activeReport === report.id
                      ? "bg-[#1677ff] text-white shadow-md shadow-blue-500/20 font-bold"
                      : "text-slate-600 hover:bg-blue-50 hover:text-[#1677ff] font-medium"
                  }`}
                >
                  <i
                    className={`${report.icon} text-[14px] w-5 text-center`}
                  ></i>
                  <span className="text-[13px]">{report.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT: REPORT VIEWER */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 flex flex-col min-h-[600px]">
            {/* REPORT TOOLBAR */}
            <div className="flex flex-col lg:flex-row justify-between items-center p-5 border-b border-gray-50 gap-4">
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl w-full lg:w-[250px] border border-gray-200 focus-within:border-[#1677ff] transition-all">
                  <IconSearch />
                  <input
                    type="text"
                    placeholder="Search in report..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none outline-none ml-2 text-[13px] w-full font-medium text-slate-700"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-[12px] font-medium text-slate-600 outline-none focus:border-[#1677ff]"
                  />
                  <span className="text-gray-400 text-[12px]">to</span>
                  <input
                    type="date"
                    className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-[12px] font-medium text-slate-600 outline-none focus:border-[#1677ff]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-slate-600 rounded-xl transition font-bold text-[12px]">
                  <IconFilter /> Filters
                </button>
                <button
                  onClick={handleExcelDownload}
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition font-bold text-[12px] shadow-md shadow-emerald-500/20"
                >
                  <IconExcel /> Export Excel
                </button>
              </div>
            </div>

            {/* REPORT RENDER AREA */}
            <div className="p-6 flex-1 bg-gray-50/30">
              <h2 className="text-[16px] font-black text-slate-800 mb-6">
                {reportsMenu.find((r) => r.id === activeReport)?.name}
              </h2>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-gray-400">
                  <i className="fas fa-circle-notch fa-spin text-3xl mb-3 text-[#1677ff]"></i>
                  <p className="font-bold text-[13px]">Compiling Data...</p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-white border border-gray-100 rounded-xl shadow-sm">
                  {/* Dynamic Table Rendering based on Report Type */}
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                      <tr>
                        {activeReport === "1" && (
                          <>
                            <th className="p-4">Model / ASIN</th>
                            <th className="p-4 text-center">Delivered Qty</th>
                            <th className="p-4 text-center">
                              GRPO Inward Done
                            </th>
                            <th className="p-4 text-center">
                              Pending (Wait for GRPO)
                            </th>
                          </>
                        )}
                        {activeReport === "3" && (
                          <>
                            <th className="p-4">Model Name</th>
                            <th className="p-4 text-center">Total Orders</th>
                            <th className="p-4 text-center">Delivered</th>
                            <th className="p-4 text-center">Cancelled</th>
                            <th className="p-4 text-center">Refunded</th>
                          </>
                        )}
                        {activeReport === "7" && (
                          <>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-center">
                              Completed Orders
                            </th>
                            <th className="p-4 text-center">Open Orders</th>
                            <th className="p-4 text-center">Refund Pending</th>
                            <th className="p-4 text-center">
                              Completion Rate (%)
                            </th>
                          </>
                        )}
                        {/* Fallback for others currently under construction */}
                        {!["1", "3", "7"].includes(activeReport) && (
                          <th className="p-4 text-center">Report Data</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="text-[13px] font-medium text-slate-700">
                      {reportData.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="p-16 text-center text-gray-400 font-bold"
                          >
                            Configure API to view this report
                          </td>
                        </tr>
                      ) : (
                        reportData.map((row, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-gray-50 hover:bg-blue-50/20"
                          >
                            {activeReport === "1" && (
                              <>
                                <td className="p-4 font-bold text-slate-800">
                                  {row.item}
                                </td>
                                <td className="p-4 text-center font-bold text-blue-600">
                                  {row.delivered}
                                </td>
                                <td className="p-4 text-center font-bold text-emerald-600">
                                  {row.inward_done}
                                </td>
                                <td className="p-4 text-center font-black text-rose-500">
                                  {row.pending}
                                </td>
                              </>
                            )}
                            {activeReport === "3" && (
                              <>
                                <td className="p-4 font-bold text-slate-800">
                                  {row.model}
                                </td>
                                <td className="p-4 text-center font-bold text-slate-600">
                                  {row.orders}
                                </td>
                                <td className="p-4 text-center font-bold text-emerald-600">
                                  {row.delivered}
                                </td>
                                <td className="p-4 text-center font-bold text-amber-500">
                                  {row.cancelled}
                                </td>
                                <td className="p-4 text-center font-bold text-rose-500">
                                  {row.refunded}
                                </td>
                              </>
                            )}
                            {activeReport === "7" && (
                              <>
                                <td className="p-4 font-bold text-slate-800">
                                  {row.date}
                                </td>
                                <td className="p-4 text-center font-bold text-emerald-600">
                                  {row.completed}
                                </td>
                                <td className="p-4 text-center font-bold text-amber-500">
                                  {row.open}
                                </td>
                                <td className="p-4 text-center font-bold text-rose-500">
                                  {row.refund_pending}
                                </td>
                                <td className="p-4 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="w-20 bg-gray-100 rounded-full h-2">
                                      <div
                                        className="bg-emerald-500 h-2 rounded-full"
                                        style={{
                                          width: `${(row.completed / row.total) * 100}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <span className="text-[11px] font-bold">
                                      {Math.round(
                                        (row.completed / row.total) * 100,
                                      )}
                                      %
                                    </span>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
