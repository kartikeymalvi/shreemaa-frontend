

import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";
import { IconDownload, IconColumns, IconPlus, IconSearch, IconFilter } from "./ApprovalManager";

// --- DATE FORMATTER ---
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
};

export default function OrdersReport() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [jumpPage, setJumpPage] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");

  // Modals States
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isViewSetupModalOpen, setViewSetupModalOpen] = useState(false);
  const [isViewSummaryModalOpen, setViewSummaryModalOpen] = useState(false);
  const [viewSummaryData, setViewSummaryData] = useState(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [masterFirms, setMasterFirms] = useState([]);
  const [masterLocations, setMasterLocations] = useState([]);
  const [masterMerchants, setMasterMerchants] = useState([]);
  const [masterModels, setMasterModels] = useState([]);

  const role = localStorage.getItem("user_role") || "USER";

  const initialHeaderState = {
    order_id: "",
    txn_date: "",
    month: "",
    day: "",
    merchant: "",
    merchant_id: "",
    firm: "",
    location: "",
    txn_detail: "",
  };
  const initialItemState = {
    asin_fsn: "",
    model_name: "",
    model_no: "",
    order_status: "Open",
    order_qty: 1,
    order_amount: "",
    unit_price: "0.00",
    payment_amount: "",
    card_offer: "0.00",
  };

  // template download function 
  const handleDownloadTemplate = () => {
    const headers = [
      "S.No",
      "Order ID",
      "Txn Date",
      "Month",
      "Day",
      "Txn Detail",
      "Merchant",
      "Merchant ID",
      "Firm",
      "Location",
      "ASIN/FSN",
      "Model Name",
      "Model",
      "Qty",
      "Order Amt",
      "Unit Price",
      "Payment",
      "Card Offer",
      
    ];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Order_Reports_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [headerData, setHeaderData] = useState(initialHeaderState);
  const [itemsData, setItemsData] = useState([{ ...initialItemState }]);

  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    firm: "",
    location: "",
    model_no: "",
    txn_detail: "",
    order_status: "",
  });

  const [viewSettings, setViewSettings] = useState({
    show_order_id: true,
    show_txn_date: true,
    show_month: true,
    show_day: true,
    show_txn_detail: true,
    show_merchant: true,
    show_merchant_id: true,
    show_firm: true,
    show_location: true,
    show_asin_fsn: true,
    show_model_name: true,
    show_model_no: true,
    show_order_status: true,
    show_order_qty: true,
    show_order_amount: true,
    show_unit_price: true,
    show_payment_amount: true,
    show_card_offer: true,
  });

  // bulk delete state
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [fRes, lRes, mRes, modRes] = await Promise.all([
          api.get("reports/firms/"),
          api.get("reports/locations/"),
          api.get("reports/merchants/"),
          api.get("reports/models/"),
        ]);
        setMasterFirms(fRes.data);
        setMasterLocations(lRes.data);
        setMasterMerchants(mRes.data);
        setMasterModels(modRes.data);
      } catch (error) {
        console.error("Master fetch error:", error);
      }
    };
    fetchMasters();
  }, []);

  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, v]) => v !== ""),
      );
      queryParams.append("page", currentPage);
      if (globalSearch.trim())
        queryParams.append("search", globalSearch.trim());

      const [dataRes, settingsRes] = await Promise.all([
        api.get(`reports/orders/?${queryParams.toString()}`),
        api.get("reports/column-policy/?policy_name=user_view_policy"),
      ]);

      const records = dataRes.data.results || dataRes.data;
      setOrders(records);
      setTotalRecords(dataRes.data.count || records.length);
      if (settingsRes.data) setViewSettings(settingsRes.data);
    } catch (error) {
      console.error("Fetch data error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, currentPage]);

  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    let newHeader = { ...headerData, [name]: value };
    if (name === "txn_date" && value) {
      const dateObj = new Date(value);
      newHeader.day = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][dateObj.getDay()];
      newHeader.month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ][dateObj.getMonth()];
    }
    setHeaderData(newHeader);
  };

  const handleRowSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (orders.length > 0 && selectedIds.length === orders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(orders.map((order) => order.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return Swal.fire("Select records first!");
    const confirm = await Swal.fire({
      title: "Delete Multiple Records?",
      text: `You are permanently deleting ${selectedIds.length} orders.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0f172a", // Slate-900
      cancelButtonColor: "#cbd5e1",
      confirmButtonText: "Yes, delete!",
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        await api.post("reports/orders/bulk-delete/", { ids: selectedIds });
        Swal.fire("Deleted!", "Orders have been deleted.", "success");
        setSelectedIds([]);
        fetchData();
      } catch (error) {
        console.error("Delete Error:", error);
        Swal.fire("Error", "Deletion failed.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...itemsData];
    let item = { ...updatedItems[index], [name]: value };

    if (name === "asin_fsn") {
      const selectedModel = masterModels.find((m) => m.asin_fsn === value);
      item.model_name = selectedModel ? selectedModel.model_name : "";
      item.model_no = selectedModel ? selectedModel.model : "";
    }

    const amt = name === "order_amount" ? value : item.order_amount;
    const qty = name === "order_qty" ? value : item.order_qty;
    const pay = name === "payment_amount" ? value : item.payment_amount;

    item.unit_price =
      amt && qty && Number(qty) > 0
        ? (Number(amt) / Number(qty)).toFixed(2)
        : "0.00";
    item.card_offer =
      pay && amt ? Math.abs(Number(amt) - Number(pay)).toFixed(2) : "0.00";

    updatedItems[index] = item;
    setItemsData(updatedItems);
  };

  const handleAddItem = () =>
    setItemsData([...itemsData, { ...initialItemState }]);
  const handleRemoveItem = (index) =>
    setItemsData(itemsData.filter((_, i) => i !== index));

  const handleEditClick = (order) => {
    const {
      order_id,
      txn_date,
      month,
      day,
      merchant,
      merchant_id,
      firm,
      location,
      txn_detail,
      ...itemDetails
    } = order;
    setHeaderData({
      order_id,
      txn_date,
      month,
      day,
      merchant,
      merchant_id,
      firm,
      location,
      txn_detail,
    });
    setItemsData([itemDetails]);
    setEditId(order.id);
    setEditMode(true);
    setFormModalOpen(true);
  };

  const handleViewClick = async (orderId) => {
    try {
      const res = await api.get(`reports/order-summary/${orderId}/`);
      setViewSummaryData(res.data);
      setViewSummaryModalOpen(true);
      fetchData();
    } catch (error) {
      Swal.fire("Error fetching order summary. Please check your connection.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode) {
        await api.put(`reports/orders/${editId}/`, {
          ...headerData,
          ...itemsData[0],
        });
        Swal.fire("Record updated successfully!");
      } else {
        const payloads = itemsData.map((item) => ({ ...headerData, ...item }));
        await Promise.all(
          payloads.map((payload) => api.post("reports/orders/", payload)),
        );
        Swal.fire(`${payloads.length} item(s) saved successfully!`);
      }
      setFormModalOpen(false);
      setHeaderData(initialHeaderState);
      setItemsData([{ ...initialItemState }]);
      setEditMode(false);
      fetchData();
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.error) Swal.fire(error.response.data.error);
        else Swal.fire("Data validation failed. Please check your inputs.");
      } else {
        Swal.fire("Error saving record. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this permanent record?")) {
      try {
        await api.delete(`reports/orders/${id}/`);
        fetchData();
      } catch (error) {
        Swal.fire("Access Denied.");
      }
    }
  };

  const handleSaveViewSettings = async () => {
    try {
      await api.put(
        "reports/column-policy/?policy_name=user_view_policy",
        viewSettings,
      );
      Swal.fire("User View Updated!");
      setViewSetupModalOpen(false);
      fetchData();
    } catch (error) {
      Swal.fire("Failed to save view settings.");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    setLoading(true);
    try {
      const res = await api.post("reports/orders/upload/", data);
      Swal.fire(res.data.message || "Excel Uploaded Successfully!");
      setUploadModalOpen(false);
      setFile(null);
      setCurrentPage(1);
      fetchData();
    } catch (error) {
      Swal.fire(
        "Upload Failed: " + (error.response?.data?.error || "Unknown Error"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      Swal.fire({
        title: "Preparing Smart Excel...",
        text: "Please wait while we generate your file.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const filterParams = {
        start_date: filters.start_date,
        end_date: filters.end_date,
        firm: filters.firm,
        location: filters.location,
        model_no: filters.model_no,
        order_status: filters.order_status,
        search: globalSearch,
      };

      const response = await api.get("reports/export/orders/", {
        params: filterParams,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const fileName = filters.firm
        ? `${filters.firm}_Orders.xlsx`
        : `All_Orders.xlsx`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      Swal.fire("Success!", "Excel downloaded successfully!", "success");
    } catch (error) {
      console.error("Export Error:", error);
      Swal.fire("Error!", "Failed to export Excel file.", "error");
    }
  };

  const showCol = (colName) =>
    role === "ADMIN" ? true : viewSettings[colName] !== false;

  // 🔥 NAYA BADGE STYLE FUNCTION (Dashed Border + Dot Style)
  const getBadgeStyle = (status) => {
    const s = String(status || "")
      .trim()
      .toLowerCase();
    if (s === "open" || s === "new")
      return {
        bg: "bg-blue-50 text-blue-700 border-blue-300",
        dot: "bg-blue-600",
      };
    if (s === "complete" || s === "delivered")
      return {
        bg: "bg-emerald-50 text-emerald-700 border-emerald-300",
        dot: "bg-emerald-600",
      };
    if (s === "cancelled")
      return { bg: "bg-red-50 text-red-700 border-red-300", dot: "bg-red-600" };
    if (s === "processing")
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
      {/* HEADER & TOP BUTTONS */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-medium text-slate-700 text-slate-900 tracking-tight">
            Orders Report
          </h1>
          <p className="text-sm text-slate-500 font-medium text-slate-700 mt-1">
            Manage, filter, and track business shipments
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Search Box - Premium Outline */}
          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-slate-200 focus-within:border-slate-400 transition-all">
            <input
              type="text"
              placeholder="Search anything..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchData()}
              className="px-4 py-2.5 outline-none text-sm w-48 md:w-60 text-slate-700 font-medium text-slate-700"
            />
            <button
              onClick={() => {
                setCurrentPage(1);
                fetchData();
              }}
              className="bg-slate-50 border-l border-gray-200 px-4 text-slate-400 hover:text-slate-700 transition"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>

          {(globalSearch.trim() !== "" ||
            Object.values(filters).some((x) => x !== "")) && (
            <button
              onClick={() => {
                setGlobalSearch("");
                setFilters({
                  start_date: "",
                  end_date: "",
                  firm: "",
                  location: "",
                  model_no: "",
                  txn_detail: "",
                  order_status: "",
                });
                setCurrentPage(1);
              }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider hover:bg-red-100 transition shadow-sm"
            >
              Clear All
            </button>
          )}

          {/* Filter Button - Ghost Style */}
          <button
            onClick={() => setFilterModalOpen(true)}
            className="bg-white border border-gray-200 text-slate-700 px-4 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider shadow-sm hover:bg-slate-50 hover:border-slate-300 transition flex items-center gap-2"
          >
            <i className="fas fa-filter text-slate-400"></i> Filter
            {Object.values(filters).some((x) => x !== "") && (
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            )}
          </button>

          {role === "ADMIN" && (
            <button
              onClick={() => setViewSetupModalOpen(true)}
              className="bg-white border border-gray-200 text-slate-700 px-4 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider shadow-sm hover:bg-slate-50 hover:border-slate-300 transition flex items-center gap-2"
            >
              <i className="fas fa-sliders-h text-slate-400"></i> View
            </button>
          )}

          <div className="w-px h-8 bg-gray-200 mx-1 hidden md:block"></div>

          {/* Core Actions - Solid Premium Colors */}
          <button
            onClick={handleDownloadTemplate}
            className="bg-white border border-gray-200 text-slate-700 hover:text-indigo-700 hover:border-indigo-200 hover:bg-indigo-50 px-4 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2"
          >
            <i className="fas fa-file-csv"></i> Template
          </button>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-white border border-gray-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 px-4 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2"
          >
            <i className="fas fa-file-upload"></i> Upload
          </button>

          <button
            onClick={handleExportExcel}
            className="bg-white border border-gray-200 text-slate-700 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 px-4 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2"
          >
            <i className="fas fa-download"></i> Export
          </button>

          {role === "ADMIN" && selectedIds.length > 0 && (
            <button
              onClick={() => handleBulkDelete()}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2 animate-in zoom-in"
            >
              <i className="fas fa-trash-alt"></i> Delete ({selectedIds.length})
            </button>
          )}

          <button
            onClick={() => {
              setHeaderData(initialHeaderState);
              setItemsData([{ ...initialItemState }]);
              setEditMode(false);
              setFormModalOpen(true);
            }}
            className=" hover:bg-orange-500 text-slate-500 text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg font-medium text-slate-700 text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2"
          >
             <IconPlus/>New Entry
          </button>
        </div>
      </div>

      {/* MAIN TABLE - Shadcn Inspired */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[65vh] min-h-[50vh] custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              {/* Premium Thin Headers */}
              <tr className="bg-slate-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-black uppercase tracking-widest sticky top-0 z-10 backdrop-blur-sm">
                {role === "ADMIN" && (
                  <th className="px-2 py-1 text-[11px] text-slate-800 whitespace-nowrap border-b">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        orders.length > 0 &&
                        selectedIds.length === orders.length
                      }
                      className="w-4 h-4 rounded cursor-pointer accent-slate-900"
                    />
                  </th>
                )}
                <th className="p-4 w-12 text-center">S.No</th>
                {showCol("show_order_id") && <th className="p-4">Order_ID</th>}
                {showCol("show_txn_date") && <th className="p-4">Txn Date</th>}
                {showCol("show_month") && <th className="p-4">Month</th>}
                {showCol("show_day") && <th className="p-4">Day</th>}
                {showCol("show_txn_detail") && (
                  <th className="p-4">Txn Detail</th>
                )}
                {showCol("show_merchant") && <th className="p-4">Merchant</th>}
                {showCol("show_merchant_id") && (
                  <th className="p-4">Merchant_ID</th>
                )}
                {showCol("show_firm") && <th className="p-4">Firm</th>}
                {showCol("show_location") && <th className="p-4">Location</th>}
                {showCol("show_asin_fsn") && <th className="p-4">ASIN/FSN</th>}
                {showCol("show_model_name") && (
                  <th className="p-4">Model Name</th>
                )}
                {showCol("show_model_no") && <th className="p-4">Model</th>}
                {showCol("show_order_qty") && (
                  <th className="p-4 text-center">Qty</th>
                )}
                {showCol("show_order_amount") && (
                  <th className="p-4 text-right">Order Amt</th>
                )}
                {showCol("show_unit_price") && (
                  <th className="p-4 text-right">Unit Price</th>
                )}
                {showCol("show_payment_amount") && (
                  <th className="p-4 text-right">Payment</th>
                )}
                {showCol("show_card_offer") && (
                  <th className="p-4 text-right text-amber-600">Card Offer</th>
                )}
                {showCol("show_order_status") && (
                  <th className="p-4 text-center">Status</th>
                )}
                <th className="p-4 text-center sticky right-0 bg-slate-50/90 border-l border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="21"
                    className="p-12 text-center text-slate-400 font-medium text-slate-700 text-sm"
                  >
                    <i className="fas fa-inbox text-3xl mb-3 opacity-50 block"></i>
                    No records match your filters/search.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => {
                  if (!order) return null;
                  const badgeStyle = getBadgeStyle(order?.order_status); // Naya Badge Function Call

                  return (
                    <tr
                      key={order?.id || index}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      {role === "ADMIN" && (
                        <td className="px-2 py-1 text-[11px] text-slate-800 whitespace-nowrap ">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(order.id)}
                            onChange={() => handleRowSelect(order.id)}
                            className="w-4 h-4 rounded cursor-pointer accent-slate-900"
                          />
                        </td>
                      )}

                      <td className="p-4 text-center font-mono text-[11px] font-medium text-slate-700 text-slate-400">
                        {((currentPage - 1) * 50 + index + 1)
                          .toString()
                          .padStart(2, "0")}
                      </td>

                      {showCol("show_order_id") && (
                        <td className="p-4 font-medium text-slate-700 text-slate-900 text-[13px]">
                          {order?.order_id || "-"}
                        </td>
                      )}
                      {showCol("show_txn_date") && (
                        <td className="p-4 text-slate-600 font-medium text-slate-700 text-[13px]">
                          {formatDate(order?.txn_date)}
                        </td>
                      )}
                      {showCol("show_month") && (
                        <td className="p-4 text-slate-500 capitalize text-xs">
                          {order?.month || "-"}
                        </td>
                      )}
                      {showCol("show_day") && (
                        <td className="p-4 text-slate-500 text-xs">
                          {order?.day || "-"}
                        </td>
                      )}

                      {showCol("show_txn_detail") && (
                        <td
                          className="p-4 max-w-[150px] truncate text-slate-600 text-[13px]"
                          title={order?.txn_detail}
                        >
                          {order?.txn_detail || "-"}
                        </td>
                      )}

                      {showCol("show_merchant") && (
                        <td className="p-4 text-slate-800 font-medium text-slate-700 text-[13px]">
                          {order?.merchant || "-"}
                        </td>
                      )}
                      {showCol("show_merchant_id") && (
                        <td className="p-4 text-slate-400 font-mono text-xs">
                          {order?.merchant_id || "-"}
                        </td>
                      )}
                      {showCol("show_firm") && (
                        <td className="p-4 font-medium text-slate-700 text-slate-800 text-[13px]">
                          {order?.firm || "-"}
                        </td>
                      )}
                      {showCol("show_location") && (
                        <td className="p-4 text-slate-600 text-[13px]">
                          {order?.location || "-"}
                        </td>
                      )}
                      {showCol("show_asin_fsn") && (
                        <td className="p-4 text-xs font-mono text-slate-400">
                          {order?.asin_fsn || "-"}
                        </td>
                      )}
                      {showCol("show_model_name") && (
                        <td
                          className="p-4 text-slate-700 font-medium text-slate-700 text-[13px]"
                          title={order?.model_name}
                        >
                          {order?.model_name || "-"}
                        </td>
                      )}
                      {showCol("show_model_no") && (
                        <td className="p-4 text-slate-600 text-[13px]">
                          {order?.model_no || "-"}
                        </td>
                      )}

                      {showCol("show_order_qty") && (
                        <td className="p-4 text-center font-medium text-slate-700 text-slate-800">
                          {order?.order_qty || "0"}
                        </td>
                      )}

                      {showCol("show_order_amount") && (
                        <td className="p-4 text-right font-medium text-slate-700 text-slate-700">
                          ₹
                          {parseFloat(order?.order_amount || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      )}
                      {showCol("show_unit_price") && (
                        <td className="p-4 text-right text-slate-500 text-xs">
                          ₹
                          {parseFloat(order?.unit_price || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      )}
                      {showCol("show_payment_amount") && (
                        <td className="p-4 text-right font-medium text-slate-700 text-slate-900">
                          ₹
                          {parseFloat(
                            order?.payment_amount || 0,
                          ).toLocaleString("en-IN")}
                        </td>
                      )}
                      {showCol("show_card_offer") && (
                        <td className="p-4 text-right font-medium text-slate-700 text-amber-600">
                          ₹
                          {parseFloat(order?.card_offer || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      )}

                      {showCol("show_order_status") && (
                        <td className="p-4 text-center">
                          {/* 🔥 PREMIUM DASHED BADGE IMPLEMENTATION */}
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium text-slate-700 tracking-widest uppercase border border-dashed ${badgeStyle.bg}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}
                            ></span>
                            {order?.order_status || "Open"}
                          </span>
                        </td>
                      )}

                      <td className="p-4 text-center sticky right-0 bg-white group-hover:bg-slate-50 border-l border-gray-100 transition-colors">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleViewClick(order?.id)}
                            className="text-slate-400 hover:text-slate-900 transition"
                            title="View Summary"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          {role === "ADMIN" && (
                            <>
                              <button
                                onClick={() => handleEditClick(order)}
                                className="text-slate-400 hover:text-amber-500 transition"
                                title="Edit Record"
                              >
                                <i className="fas fa-pen"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(order?.id)}
                                className="text-slate-400 hover:text-red-500 transition"
                                title="Delete Record"
                              >
                                <i className="fas fa-trash-alt"></i>
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
      </div>

      {/* PAGINATION - Premium Footer */}
      <div className="mt-4 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 gap-4">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
          Total Records:{" "}
          <span className="text-slate-800 text-sm">{totalRecords}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-2 bg-white border border-gray-200 text-slate-600 rounded-md font-medium text-slate-700 text-xs hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 transition"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <span className="px-4 py-2 bg-slate-900 text-white rounded-md font-medium text-slate-700 text-xs shadow-sm">
            Page {currentPage} of {Math.ceil(totalRecords / 50) || 1}
          </span>

          <button
            disabled={currentPage >= Math.ceil(totalRecords / 50)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-2 bg-white border border-gray-200 text-slate-600 rounded-md font-medium text-slate-700 text-xs hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 transition"
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          <div className="flex items-center ml-2 border-l border-gray-200 pl-4">
            <input
              type="number"
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder="Go to..."
              className="w-20 px-3 py-2 bg-white border border-gray-200 rounded-l-md text-xs font-medium text-slate-700 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200"
            />
            <button
              onClick={() => {
                const p = parseInt(jumpPage);
                const maxPages = Math.ceil(totalRecords / 50) || 1;
                if (p > 0 && p <= maxPages) {
                  setCurrentPage(p);
                  setJumpPage("");
                } else {
                  Swal.fire(
                    `Please enter a valid page between 1 and ${maxPages}`,
                  );
                }
              }}
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium text-slate-700 rounded-r-md transition"
            >
              GO
            </button>
          </div>
        </div>
      </div>

      {/* --- MODALS (Updated to Premium Enterprise Theme) --- */}

      {/* 1. UPLOAD EXCEL MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Bulk Upload Data
              </h2>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit}>
              <div className="border-2 border-dashed border-gray-200 p-8 text-center rounded-xl bg-gray-50 mb-6 hover:bg-gray-100 transition-colors">
                <i className="fas fa-file-excel text-3xl text-emerald-500 mb-3 block"></i>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-medium text-slate-700 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-50 text-slate-500 text-xs uppercase tracking-widest py-3 rounded-lg font-medium text-slate-700 text-sm tracking-wider uppercase transition shadow-md"
              >
                {loading ? "Uploading..." : "Sync Database"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. FILTER MODAL */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white p-8 rounded-2xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Advanced Filters
              </h2>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Filter Inputs (Mapped directly from your existing logic) */}
              {["start_date", "end_date"].map((field) => (
                <div key={field}>
                  <label className="block text-[10px] font-medium text-slate-700 text-slate-500 uppercase tracking-widest mb-1.5">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type="date"
                    value={filters[field]}
                    onChange={(e) =>
                      setFilters({ ...filters, [field]: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium text-slate-700"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-medium text-slate-700 text-slate-500 uppercase tracking-widest mb-1.5">
                  Order Status
                </label>
                <select
                  value={filters.order_status}
                  onChange={(e) =>
                    setFilters({ ...filters, order_status: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium text-slate-700"
                >
                  <option value="">All Statuses</option>{" "}
                  <option value="Open">Open</option>{" "}
                  <option value="Complete">Complete</option>{" "}
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-700 text-slate-500 uppercase tracking-widest mb-1.5">
                  Firm
                </label>
                <select
                  value={filters.firm}
                  onChange={(e) =>
                    setFilters({ ...filters, firm: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium text-slate-700"
                >
                  <option value="">All Firms</option>{" "}
                  {masterFirms.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-700 text-slate-500 uppercase tracking-widest mb-1.5">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium text-slate-700"
                >
                  <option value="">All Locations</option>{" "}
                  {masterLocations.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-700 text-slate-500 uppercase tracking-widest mb-1.5">
                  Model
                </label>
                <input
                  type="text"
                  placeholder="Search model..."
                  value={filters.model_no}
                  onChange={(e) =>
                    setFilters({ ...filters, model_no: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium text-slate-700"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setFilters({
                    start_date: "",
                    end_date: "",
                    firm: "",
                    location: "",
                    model_no: "",
                    txn_detail: "",
                    order_status: "",
                  });
                  setCurrentPage(1);
                  setFilterModalOpen(false);
                }}
                className="px-5 py-2.5 bg-slate-100 text-slate-600 text-xs tracking-wider uppercase font-medium text-slate-700 rounded-lg hover:bg-slate-200 transition"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  setCurrentPage(1);
                  setFilterModalOpen(false);
                }}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-50 text-slate-500 text-xs uppercase tracking-widest text-xs tracking-wider uppercase rounded-lg font-medium text-slate-700 transition shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ADMIN COLUMN VIEW SETUP MODAL */}
      {isViewSetupModalOpen && role === "ADMIN" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white p-8 rounded-2xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Configure User View
              </h2>
              <button
                onClick={() => setViewSetupModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto p-1 custom-scrollbar">
              {Object.keys(viewSettings)
                .filter((k) => k.startsWith("show_"))
                .map((key) => (
                  <label
                    key={key}
                    className="flex items-center space-x-3 bg-gray-50 p-3.5 rounded-xl cursor-pointer hover:bg-gray-100 border border-transparent hover:border-gray-200 transition"
                  >
                    <input
                      type="checkbox"
                      checked={viewSettings[key]}
                      onChange={(e) =>
                        setViewSettings({
                          ...viewSettings,
                          [key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-slate-900 rounded"
                    />
                    <span className="text-[11px] font-medium text-slate-700 text-slate-700 uppercase tracking-widest">
                      {key.replace("show_", "").replace(/_/g, " ")}
                    </span>
                  </label>
                ))}
            </div>
            <div className="flex justify-end gap-3 mt-6 border-t border-gray-100 pt-5">
              <button
                onClick={() => setViewSetupModalOpen(false)}
                className="px-6 py-2.5 bg-slate-100 text-slate-600 text-xs tracking-wider uppercase font-medium text-slate-700 rounded-lg hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveViewSettings}
                className="px-8 py-2.5 bg-slate-900 hover:bg-slate-50 text-slate-500 text-xs uppercase tracking-widest text-xs tracking-wider uppercase rounded-lg font-medium text-slate-700 transition shadow-md"
              >
                Save View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. DATA ENTRY FORM MODAL (New Premium UI) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95">
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white rounded-t-2xl">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {editMode ? "Edit Order Record" : "Create New Order"}
              </h2>
              <button
                onClick={() => setFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <div className="px-8 py-6 overflow-y-auto custom-scrollbar bg-gray-50/50">
              <form
                id="orderForm"
                onSubmit={handleFormSubmit}
                className="flex flex-col gap-6 w-full"
              >
                {/* Header Details Box */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 border-b border-gray-100 pb-3">
                    Master Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
                        Order ID *
                      </label>
                      <input
                        type="text"
                        name="order_id"
                        required
                        value={headerData.order_id}
                        onChange={handleHeaderChange}
                        disabled={editMode}
                        className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-900 focus:ring-1 focus:ring-slate-300 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
                        Txn Date
                      </label>
                      <input
                        type="date"
                        name="txn_date"
                        required
                        value={headerData.txn_date}
                        onChange={handleHeaderChange}
                        className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-700 focus:ring-1 focus:ring-slate-300 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
                        Merchant
                      </label>
                      <select
                        name="merchant"
                        value={headerData.merchant}
                        onChange={handleHeaderChange}
                        className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-700 focus:ring-1 focus:ring-slate-300 outline-none"
                      >
                        <option value="">Select Merchant</option>{" "}
                        {masterMerchants.map((m) => (
                          <option key={m.id} value={m.name}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
                        Merchant ID
                      </label>
                      <input
                        type="text"
                        name="merchant_id"
                        value={headerData.merchant_id}
                        onChange={handleHeaderChange}
                        className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-700 focus:ring-1 focus:ring-slate-300 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
                        Firm
                      </label>
                      <select
                        name="firm"
                        value={headerData.firm}
                        onChange={handleHeaderChange}
                        className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-700 focus:ring-1 focus:ring-slate-300 outline-none"
                      >
                        <option value="">Select Firm</option>{" "}
                        {masterFirms.map((f) => (
                          <option key={f.id} value={f.name}>
                            {f.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
                        Location
                      </label>
                      <select
                        name="location"
                        value={headerData.location}
                        onChange={handleHeaderChange}
                        className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-700 focus:ring-1 focus:ring-slate-300 outline-none"
                      >
                        <option value="">Select Location</option>{" "}
                        {masterLocations.map((l) => (
                          <option key={l.id} value={l.name}>
                            {l.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
                        Txn Detail
                      </label>
                      <input
                        type="text"
                        name="txn_detail"
                        value={headerData.txn_detail}
                        onChange={handleHeaderChange}
                        className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-700 focus:ring-1 focus:ring-slate-300 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <div className="flex justify-between items-end mb-3 px-1">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Product Line Items
                    </h3>
                    {!editMode && (
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="text-amber-600 hover:text-white bg-amber-50 hover:bg-amber-500 px-3 py-1.5 rounded-md text-[10px] font-medium text-slate-700 uppercase tracking-widest transition-all"
                      >
                        <i className="fas fa-plus mr-1"></i> Add Row
                      </button>
                    )}
                  </div>

                  {itemsData.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-4 relative group"
                    >
                      {!editMode && itemsData.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-full transition"
                        >
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                        <div>
                          <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
                            ASIN / FSN
                          </label>
                          <select
                            name="asin_fsn"
                            value={item.asin_fsn}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-800 focus:ring-1 focus:ring-slate-300 outline-none"
                          >
                            <option value="">Select Code</option>{" "}
                            {masterModels.map((m) => (
                              <option key={m.id} value={m.asin_fsn}>
                                {m.asin_fsn}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-700 text-slate-400 uppercase tracking-widest mb-1.5">
                            Model Name
                          </label>
                          <input
                            type="text"
                            value={item.model_name}
                            readOnly
                            className="w-full bg-gray-100 border border-transparent p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-500 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-700 text-slate-400 uppercase tracking-widest mb-1.5">
                            Model Number
                          </label>
                          <input
                            type="text"
                            value={item.model_no}
                            readOnly
                            className="w-full bg-gray-100 border border-transparent p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-500 cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-6 gap-5">
                        <div>
                          <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
                            Status
                          </label>
                          <select
                            name="order_status"
                            value={item.order_status}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-gray-50 border border-gray-200 text-slate-800 font-medium text-slate-700 p-2.5 rounded-lg text-sm outline-none focus:ring-1 focus:ring-slate-300"
                          >
                            <option value="Open">Open</option>{" "}
                            <option value="Complete">Complete</option>{" "}
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
                            Qty
                          </label>
                          <input
                            type="number"
                            min="1"
                            name="order_qty"
                            value={item.order_qty}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-800 outline-none focus:ring-1 focus:ring-slate-300 text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
                            Order Amt (₹)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="order_amount"
                            value={item.order_amount}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-800 outline-none focus:ring-1 focus:ring-slate-300"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-700 text-slate-600 uppercase tracking-widest mb-1.5">
                            Payment (₹)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="payment_amount"
                            value={item.payment_amount}
                            onChange={(e) => handleItemChange(index, e)}
                            className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-medium text-slate-700 text-emerald-600 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-700 text-slate-400 uppercase tracking-widest mb-1.5">
                            Unit Price
                          </label>
                          <input
                            type="text"
                            disabled
                            value={`₹ ${item.unit_price}`}
                            className="w-full bg-gray-100 border border-transparent p-2.5 rounded-lg text-sm font-medium text-slate-700 text-slate-500 text-right"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-slate-700 text-amber-600 uppercase tracking-widest mb-1.5">
                            Card Offer
                          </label>
                          <input
                            type="text"
                            disabled
                            value={`₹ ${item.card_offer}`}
                            className="w-full bg-amber-50 border border-amber-100 p-2.5 rounded-lg text-sm font-black text-amber-600 text-right"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </form>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setFormModalOpen(false)}
                className="px-6 py-2.5 bg-slate-100 text-slate-600 text-xs font-medium text-slate-700 uppercase tracking-wider rounded-lg hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="orderForm"
                disabled={loading}
                className="px-8 py-2.5 bg-slate-900 hover:bg-slate-50 text-slate-500 text-xs uppercase tracking-widest text-xs font-medium text-slate-700 uppercase tracking-wider rounded-lg shadow-md transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Record"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. VIEW SUMMARY MODAL (Clean enterprise grids) */}
      {isViewSummaryModalOpen && viewSummaryData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white rounded-t-2xl">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <i className="fas fa-chart-pie text-slate-400"></i> Order
                Summary Log
              </h2>
              <div className="flex items-center gap-5">
                <span className="text-[10px] font-medium text-slate-700 text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  Status:
                  {/* Dashed badge in header */}
                  <span
                    className={`px-2.5 py-1 rounded-md border border-dashed ${getBadgeStyle(viewSummaryData.order_status).bg}`}
                  >
                    {viewSummaryData.order_status}
                  </span>
                </span>
                <button
                  onClick={() => {
                    setViewSummaryModalOpen(false);
                    setViewSummaryData(null);
                  }}
                  className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>
              </div>
            </div>

            <div className="px-8 py-8 overflow-y-auto custom-scrollbar bg-gray-50/50 rounded-b-2xl">
              {/* Block 1: Base Info (Muted Slate) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Order ID", value: viewSummaryData.order_id },
                  {
                    label: "Txn Date",
                    value: formatDate(viewSummaryData.txn_date),
                  },
                  { label: "ASIN/FSN", value: viewSummaryData.asin_fsn },
                  { label: "Model No", value: viewSummaryData.model_no || "-" },
                  { label: "Order Qty", value: viewSummaryData.order_qty },
                  {
                    label: "Order Amount",
                    value: `₹ ${viewSummaryData.order_amount.toLocaleString("en-IN")}`,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <label className="block text-[10px] font-medium text-slate-700 text-slate-400 uppercase tracking-widest mb-1">
                      {item.label}
                    </label>
                    <div className="text-sm font-medium text-slate-700 text-slate-800 truncate">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Block 2: Fulfillment (Emerald & Red) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 shadow-sm">
                  <label className="block text-[10px] font-medium text-slate-700 text-emerald-600 uppercase tracking-widest mb-1">
                    Delivered Qty
                  </label>
                  <div className="text-lg font-black text-emerald-700">
                    {viewSummaryData.delivered_qty}
                  </div>
                </div>
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 shadow-sm">
                  <label className="block text-[10px] font-medium text-slate-700 text-emerald-600 uppercase tracking-widest mb-1">
                    Delivered Amt
                  </label>
                  <div className="text-lg font-black text-emerald-700">
                    ₹ {viewSummaryData.delivered_amount.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 shadow-sm">
                  <label className="block text-[10px] font-medium text-slate-700 text-red-600 uppercase tracking-widest mb-1">
                    Cancel Qty
                  </label>
                  <div className="text-lg font-black text-red-700">
                    {viewSummaryData.cancel_qty}
                  </div>
                </div>
                <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 shadow-sm">
                  <label className="block text-[10px] font-medium text-slate-700 text-red-600 uppercase tracking-widest mb-1">
                    Cancel Amt
                  </label>
                  <div className="text-lg font-black text-red-700">
                    ₹ {viewSummaryData.cancel_amount.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Block 3: Adjustments (Blue/Amber) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 shadow-sm">
                  <label className="block text-[10px] font-medium text-slate-700 text-blue-600 uppercase tracking-widest mb-1">
                    Short Qty
                  </label>
                  <div className="text-lg font-black text-blue-700">
                    {viewSummaryData.short_qty}
                  </div>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 shadow-sm">
                  <label className="block text-[10px] font-medium text-slate-700 text-blue-600 uppercase tracking-widest mb-1">
                    Short Amt
                  </label>
                  <div className="text-lg font-black text-blue-700">
                    ₹ {viewSummaryData.short_amount.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-sm">
                  <label className="block text-[10px] font-medium text-slate-700 text-amber-600 uppercase tracking-widest mb-1">
                    Refund Qty
                  </label>
                  <div className="text-lg font-black text-amber-700">
                    {viewSummaryData.refund_qty}
                  </div>
                </div>
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 shadow-sm">
                  <label className="block text-[10px] font-medium text-slate-700 text-amber-600 uppercase tracking-widest mb-1">
                    Refund Amt
                  </label>
                  <div className="text-lg font-black text-amber-700">
                    ₹ {viewSummaryData.refund_amount.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Block 4: Final Pending & Inward (Slate Highlight) */}
              <div className="bg-slate-900 rounded-2xl p-6 shadow-md text-white grid grid-cols-2 md:grid-cols-5 gap-6">
                <div>
                  <label className="block text-[10px] font-medium text-slate-700 text-slate-400 uppercase tracking-widest mb-1">
                    Pending Qty
                  </label>
                  <div className="text-xl font-black text-white">
                    {viewSummaryData.pending_qty}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-700 text-slate-400 uppercase tracking-widest mb-1">
                    Pending Amt
                  </label>
                  <div className="text-xl font-black text-white">
                    ₹ {viewSummaryData.pending_amount.toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-700 text-amber-400 uppercase tracking-widest mb-1">
                    Pending Refund
                  </label>
                  <div className="text-xl font-black text-amber-400">
                    ₹{" "}
                    {viewSummaryData.pending_refund_amount.toLocaleString(
                      "en-IN",
                    )}
                  </div>
                </div>
                <div className="border-l border-slate-700 pl-6">
                  <label className="block text-[10px] font-medium text-slate-700 text-emerald-400 uppercase tracking-widest mb-1">
                    Inward Qty
                  </label>
                  <div className="text-xl font-black text-emerald-400">
                    {viewSummaryData.inward_qty}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-slate-700 text-emerald-400 uppercase tracking-widest mb-1">
                    Inward Amt
                  </label>
                  <div className="text-xl font-black text-emerald-400">
                    ₹ {viewSummaryData.inward_amount.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}