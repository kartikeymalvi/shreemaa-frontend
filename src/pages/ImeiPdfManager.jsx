import React, { useState, useEffect } from "react";
import api from "../api/axios";

// ICONS
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
export const IconFile = () => (
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
  </svg>
);

export default function ImeiPdfManager() {
  const username = localStorage.getItem("username") || "Demo User";
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialForm = {
    invoice_no: "",
    asin: "",
    imei_number: "",
    invoice_pdf: null,
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await api.get("reports/imei-records/");
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "invoice_pdf") {
      setFormData((prev) => ({ ...prev, invoice_pdf: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append("invoice_no", formData.invoice_no);
    submitData.append("asin", formData.asin);
    submitData.append("imei_number", formData.imei_number);
    submitData.append("uploaded_by", username);
    if (formData.invoice_pdf)
      submitData.append("invoice_pdf", formData.invoice_pdf);

    try {
      await api.post("reports/imei-records/", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("IMEI & Document Uploaded!");
      setIsModalOpen(false);
      setFormData(initialForm);
      fetchRecords();
    } catch (err) {
      alert("Failed! This IMEI might already exist.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = records.filter(
    (r) =>
      r.imei_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.invoice_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.asin?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-300 pb-10">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
            Warehouse & Logistics /{" "}
            <span className="text-slate-600">IMEI & PDF</span>
          </p>
          <h1 className="text-[20px] font-bold text-slate-800 tracking-tight">
            IMEI & PDF Management
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden flex flex-col">
        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-5 border-b border-gray-50 gap-4 bg-white">
          <div className="flex items-center bg-gray-50/80 px-4 py-2.5 rounded-full w-full md:w-[300px] border border-gray-100 focus-within:bg-white focus-within:border-[#1677ff] focus-within:ring-4 focus-within:ring-blue-50 transition-all">
            <IconSearch />
            <input
              type="text"
              placeholder="Search IMEI, ASIN, Invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none ml-2 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white rounded-[10px] transition font-bold text-[13px] shadow-md shadow-[#e67e22]/20 whitespace-nowrap"
          >
            <IconPlus /> Add Record
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[400px]">
          <table className="w-full text-left min-w-max border-collapse">
            <thead className="bg-gray-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest sticky top-0 backdrop-blur-md z-10">
              <tr>
                <th className="p-4 pl-6 whitespace-nowrap">IMEI Number</th>
                <th className="p-4 whitespace-nowrap">Invoice No</th>
                <th className="p-4 whitespace-nowrap">ASIN / FSN</th>
                <th className="p-4 whitespace-nowrap">Uploaded By</th>
                <th className="p-4 whitespace-nowrap">Upload Date</th>
                <th className="p-4 text-center pr-6">Document (PDF)</th>
              </tr>
            </thead>
            <tbody className="text-[13px] font-medium text-slate-700 bg-white">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-16 text-center font-bold text-gray-400"
                  >
                    No Records Found
                  </td>
                </tr>
              ) : (
                filteredData.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="p-4 pl-6 font-mono font-bold text-slate-800">
                      {r.imei_number}
                    </td>
                    <td className="p-4 font-mono font-bold text-[#1677ff]">
                      {r.invoice_no}
                    </td>
                    <td className="p-4 font-bold text-slate-700">{r.asin}</td>
                    <td className="p-4 text-gray-500">{r.uploaded_by}</td>
                    <td className="p-4 text-gray-500">
                      {new Date(r.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-center pr-6">
                      {r.invoice_pdf ? (
                        <a
                          href={r.invoice_pdf}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 font-bold rounded-md text-[11px] hover:bg-emerald-100 transition border border-emerald-200"
                        >
                          <IconFile /> View PDF
                        </a>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-bold">
                          No File
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-gray-100 bg-white flex justify-between items-center">
              <h3 className="font-bold text-slate-800 tracking-tight text-[16px]">
                Add IMEI & PDF
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
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Invoice No <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="invoice_no"
                    required
                    value={formData.invoice_no}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-mono text-[#1677ff] font-bold outline-none focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    ASIN / FSN <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="asin"
                    required
                    value={formData.asin}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    IMEI Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="imei_number"
                    required
                    value={formData.imei_number}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 p-2.5 rounded-lg text-[13px] font-mono font-bold text-slate-800 outline-none focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Invoice PDF Document (Optional)
                  </label>
                  <input
                    type="file"
                    name="invoice_pdf"
                    accept="application/pdf, image/*"
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-200 p-2 rounded-xl text-[12px] text-slate-600 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#1677ff]/10 file:text-[#1677ff] hover:file:bg-[#1677ff]/20 transition cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#e67e22] hover:bg-[#d35400] text-white font-bold tracking-widest uppercase rounded-xl text-[12px] w-full shadow-md transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
