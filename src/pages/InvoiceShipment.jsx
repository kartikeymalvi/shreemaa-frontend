

import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

// --- DATE FORMATTER ---
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
};

export default function InvoiceShipment() {
  const [shipments, setShipments] = useState([]);

  // Modals
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [fetchedOrderDetails, setFetchedOrderDetails] = useState([]);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [jumpPage, setJumpPage] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchOrderId, setSearchOrderId] = useState("");

  // Dashboard Live Tracking & Locks
  const [inlineEdits, setInlineEdits] = useState({});
  const [unlockedRows, setUnlockedRows] = useState({});

  const role = localStorage.getItem("user_role") || "USER";

  // Filters State
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    order_id: "",
    invoice_no: "",
    delivery_status: "",
    firm: "",
    location: "",
    merchant: "",
  });

  const [viewSettings, setViewSettings] = useState({
    show_order_id: true,
    show_txn_date: true,
    show_firm: true,
    show_location: true,
    show_asin_fsn: true,
    show_model_name: true,
    show_model_no: true,
    show_unit_price: true,
    show_seller_name: true,
    show_seller_gstn: true,
    show_invoice_no: true,
    show_invoice_date: true,
    show_invoice_qty: true,
    show_invoice_amount: true,
    show_tracking_id: true, // 🔥 NAYA VIEW SETTING ADD KIYA
    show_delivery_status: true,
    show_delivery_date: true,
  });

  const initialHeaderState = {
    order_id: "",
    txn_date: "",
    firm: "",
    location: "",
  };
  const [headerData, setHeaderData] = useState(initialHeaderState);
  const [itemsData, setItemsData] = useState([]);

  // Masters for Dropdowns
  const [masterFirms, setMasterFirms] = useState([]);
  const [masterLocations, setMasterLocations] = useState([]);

  // bulk delete states
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchMasters = async () => {
      try {
        const [fRes, lRes] = await Promise.all([
          api.get("reports/firms/"),
          api.get("reports/locations/"),
        ]);
        setMasterFirms(fRes.data);
        setMasterLocations(lRes.data);
      } catch (error) {
        console.error("Master fetch error:", error);
      }
    };
    fetchMasters();
  }, []);



  // template download function-
  const handleDownloadTemplate = () => {
    const headers = [
      "Order ID",
      "Txn Date",
      "Firm",
      "Seller Name",
      "Invoice No",
      "Delivery Status",
      "Delivery Date",
      "Tracking ID",
      "invoice_date'",
    ];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Invoice_Shipment_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchData = async () => {
    try {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, v]) => v !== ""),
      );
      queryParams.append("page", currentPage);
      if (globalSearch.trim())
        queryParams.append("search", globalSearch.trim());

      const [shipRes, settingsRes] = await Promise.all([
        api.get(`reports/shipments/?${queryParams.toString()}`),
        api.get("reports/column-policy/?policy_name=shipment_view_policy"),
      ]);
      const records = shipRes.data.results || shipRes.data;
      setShipments(records);
      setTotalRecords(shipRes.data.count || records.length);
      if (settingsRes.data) setViewSettings(settingsRes.data);
    } catch (error) {
      console.error("Fetch data error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, currentPage]);

  const showCol = (colName) =>
    role === "ADMIN" ? true : viewSettings[colName] !== false;

  const handleSaveViewSettings = async () => {
    try {
      await api.put(
        "reports/column-policy/?policy_name=shipment_view_policy",
        viewSettings,
      );
      Swal.fire({
        title: "Updated!",
        text: "Table View Updated successfully.",
        icon: "success",
        confirmButtonColor: "#0f172a",
      });
      setViewModalOpen(false);
      fetchData();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to save view.",
        icon: "error",
        confirmButtonColor: "#0f172a",
      });
    }
  };

  const handleRowSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (currentDataArray) => {
    if (
      selectedIds.length === currentDataArray.length &&
      currentDataArray.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentDataArray.map((item) => item.id));
    }
  };

  const handleBulkDelete = async (apiEndpoint) => {
    if (selectedIds.length === 0)
      return Swal.fire({
        title: "Hold On!",
        text: "Select records first!",
        icon: "warning",
        confirmButtonColor: "#0f172a",
      });

    const confirm = await Swal.fire({
      title: "Delete Multiple Records?",
      text: `You are permanently deleting ${selectedIds.length} records.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626", // Red-600
      cancelButtonColor: "#cbd5e1",
      confirmButtonText: "Yes, delete!",
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        await api.post(apiEndpoint, { ids: selectedIds });
        Swal.fire({
          title: "Deleted!",
          text: "Records have been deleted.",
          icon: "success",
          confirmButtonColor: "#0f172a",
        });
        setSelectedIds([]);
        fetchData();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Deletion failed.",
          icon: "error",
          confirmButtonColor: "#0f172a",
        });
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleFetchOrderData = async () => {
    if (!searchOrderId.trim())
      return Swal.fire({
        title: "Required",
        text: "Please enter Order ID first!",
        icon: "info",
        confirmButtonColor: "#0f172a",
      });
    setLoading(true);

    try {
      const res = await api.get(`reports/fetch-order/${searchOrderId}/`);
      const fetchedItems = res.data;

      setHeaderData({
        order_id: fetchedItems[0].order_id,
        txn_date: fetchedItems[0].txn_date,
        firm: fetchedItems[0].firm,
        location: fetchedItems[0].location,
      });

      setFetchedOrderDetails(fetchedItems);

      setItemsData([
        {
          asin_fsn: "",
          model_name: "",
          model_no: "",
          unit_price: "",
          seller_name: "",
          seller_gstn: "",
          invoice_no: "",
          invoice_date: "",
          invoice_qty: "",
          invoice_amount: "",
          tracking_id: "", // 🔥 NAYA FIELD
          delivery_status: "Pending",
          delivery_date: "",
          is_existing: false,
          shipment_id: null,
        },
      ]);
    } catch (error) {
      Swal.fire({
        title: "Not Found",
        text: "This Order ID does not exist in Order Reports!",
        icon: "error",
        confirmButtonColor: "#0f172a",
      });
      setItemsData([]);
      setHeaderData({ order_id: "", txn_date: "", firm: "", location: "" });
      setFetchedOrderDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...itemsData];
    let item = { ...updatedItems[index], [name]: value };

    if (name === "asin_fsn") {
      const selectedDetails = fetchedOrderDetails.find(
        (d) => d.asin_fsn === value,
      );

      if (selectedDetails) {
        item.model_name = selectedDetails.model_name || "";
        item.model_no = selectedDetails.model_no || "";
        item.unit_price = selectedDetails.unit_price || "";
        item.seller_name = "";
        item.seller_gstn = "";
        item.invoice_no = "";
        item.invoice_date = "";
        item.invoice_qty = selectedDetails.order_qty || "";
        item.invoice_amount = selectedDetails.order_amount || "";
        item.tracking_id = ""; // 🔥 NAYA FIELD RESET
        item.is_existing = false;
        item.shipment_id = null;
      } else {
        item = {
          ...item,
          model_name: "",
          model_no: "",
          unit_price: "",
          seller_name: "",
          seller_gstn: "",
          invoice_no: "",
          invoice_date: "",
          invoice_qty: "",
          invoice_amount: "",
          tracking_id: "", // 🔥 NAYA FIELD RESET
          is_existing: false,
          shipment_id: null,
        };
      }
    }

    updatedItems[index] = item;
    setItemsData(updatedItems);
  };

  const handleEditClick = (shipment) => {
    setSearchOrderId(shipment.order_id);
    setHeaderData({
      order_id: shipment.order_id,
      txn_date: shipment.txn_date,
      firm: shipment.firm,
      location: shipment.location,
    });
    const { order_id, txn_date, firm, location, ...itemDetails } = shipment;
    setItemsData([itemDetails]);
    setEditId(shipment.id);
    setEditMode(true);
    setFormModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (itemsData.length === 0)
      return Swal.fire({
        title: "Action Required",
        text: "Please fetch an Order first!",
        icon: "warning",
        confirmButtonColor: "#0f172a",
      });

    const validItemsToSave = itemsData.filter(
      (item) =>
        item.invoice_no &&
        item.invoice_no.trim() !== "" &&
        item.seller_name &&
        item.seller_name.trim() !== "",
    );

    if (validItemsToSave.length === 0) {
      return Swal.fire({
        title: "Incomplete Data",
        text: "Please fill 'Seller Name' and 'Invoice No' to save data.",
        icon: "error",
        confirmButtonColor: "#0f172a",
      });
    }

    setLoading(true);

    const formatPayload = (item) => {
      const payload = { ...headerData, ...item };
      if (payload.delivery_date === "") payload.delivery_date = null;
      if (payload.invoice_date === "") payload.invoice_date = null;
      return payload;
    };

    try {
      if (editMode) {
        await api.put(
          `reports/shipments/${editId}/`,
          formatPayload(validItemsToSave[0]),
        );
        Swal.fire({
          title: "Updated!",
          text: "Shipment Updated Successfully!",
          icon: "success",
          confirmButtonColor: "#0f172a",
        });
      } else {
        const apiCalls = validItemsToSave.map((item) => {
          const payload = formatPayload(item);
          return api.post("reports/shipments/", payload);
        });

        await Promise.all(apiCalls);
        Swal.fire({
          title: "Saved!",
          text: `Successfully saved ${validItemsToSave.length} fresh Shipment Record(s)!`,
          icon: "success",
          confirmButtonColor: "#0f172a",
        });
      }

      setFormModalOpen(false);
      setSearchOrderId("");
      setItemsData([]);
      setHeaderData({ order_id: "", txn_date: "", firm: "", location: "" });
      setEditMode(false);
      fetchData();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error saving records. Please ensure Invoice Number is unique.",
        icon: "error",
        confirmButtonColor: "#0f172a",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (role !== "ADMIN")
      return Swal.fire({
        title: "Access Denied",
        text: "Only Admins can delete.",
        icon: "error",
        confirmButtonColor: "#0f172a",
      });
    if (
      window.confirm(
        "Delete this shipment record permanently? Tracking ID will also be deleted.",
      )
    ) {
      try {
        await api.delete(`reports/shipments/${id}/`);
        fetchData();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Access Denied.",
          icon: "error",
          confirmButtonColor: "#0f172a",
        });
      }
    }
  };

  const handleInlineChange = (id, field, value) =>
    setInlineEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value, isDirty: true },
    }));

  const handleInlineSave = async (shipment) => {
    const updates = inlineEdits[shipment.id];
    if (!updates) return;
    const newStatus =
      updates.delivery_status !== undefined
        ? updates.delivery_status
        : shipment.delivery_status;
    const newDate =
      updates.delivery_date !== undefined
        ? updates.delivery_date
        : shipment.delivery_date;
    try {
      setLoading(true);
      await api.put(`reports/shipments/${shipment.id}/`, {
        ...shipment,
        delivery_status: newStatus,
        delivery_date: newDate || null,
      });

      if (newStatus === "Delivered" || newStatus === "Cancelled") {
        Swal.fire({
          title: "Locked!",
          text: "Row is now Locked & Status Updated Successfully! 🔒",
          icon: "success",
          confirmButtonColor: "#0f172a",
        });
      } else {
        Swal.fire({
          title: "Saved!",
          text: "Status Updated Successfully!",
          icon: "success",
          confirmButtonColor: "#0f172a",
          timer: 1500,
        });
      }

      setUnlockedRows((prev) => {
        const next = { ...prev };
        delete next[shipment.id];
        return next;
      });
      setInlineEdits((prev) => {
        const next = { ...prev };
        delete next[shipment.id];
        return next;
      });
      fetchData();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update dashboard status.",
        icon: "error",
        confirmButtonColor: "#0f172a",
      });
    } finally {
      setLoading(false);
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
      const res = await api.post("reports/shipments/upload/", data);
      Swal.fire({
        title: "Success!",
        text: res.data.message || "Excel Uploaded Successfully!",
        icon: "success",
        confirmButtonColor: "#0f172a",
      });
      setUploadModalOpen(false);
      setFile(null);
      setCurrentPage(1);
      fetchData();
    } catch (error) {
      Swal.fire({
        title: "Upload Failed",
        text: error.response?.data?.error || "Unknown Error",
        icon: "error",
        confirmButtonColor: "#0f172a",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      Swal.fire({
        title: "Preparing Export...",
        text: "Please wait while we generate your file.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const queryParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "") queryParams.append(key, value);
      });
      if (globalSearch.trim())
        queryParams.append("search", globalSearch.trim());

      const response = await api.get(
        `reports/export/invoices/?${queryParams.toString()}`,
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Invoice_Shipments.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      Swal.fire({
        title: "Success!",
        text: "Excel downloaded successfully!",
        icon: "success",
        confirmButtonColor: "#0f172a",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to export Excel. Please try again.",
        icon: "error",
        confirmButtonColor: "#0f172a",
      });
    }
  };

  // 🔥 BADGE STYLE FUNCTION
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
      {/* HEADER & TOP BUTTONS */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Invoice & Shipment
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Manage invoices, bulk upload and track delivery statuses
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Global Search */}
          <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-slate-200 focus-within:border-slate-400 transition-all">
            <input
              type="text"
              placeholder="Search tracking ID, order..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setCurrentPage(1);
                  fetchData();
                }
              }}
              className="px-4 py-2.5 outline-none text-sm w-48 md:w-60 text-slate-700 font-medium"
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
                  order_id: "",
                  invoice_no: "",
                  delivery_status: "",
                  firm: "",
                  location: "",
                  merchant: "",
                });
                setCurrentPage(1);
              }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-red-100 transition shadow-sm"
            >
              Clear All
            </button>
          )}

          <button
            onClick={() => setFilterModalOpen(true)}
            className="bg-white border border-gray-200 text-slate-700 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-slate-50 hover:border-slate-300 transition flex items-center gap-2"
          >
            <i className="fas fa-filter text-slate-400"></i> Filter
            {Object.values(filters).some((x) => x !== "") && (
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            )}
          </button>

          {role === "ADMIN" && (
            <button
              onClick={() => setViewModalOpen(true)}
              className="bg-white border border-gray-200 text-slate-700 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-slate-50 hover:border-slate-300 transition flex items-center gap-2"
            >
              <i className="fas fa-sliders-h text-slate-400"></i> View
            </button>
          )}

          <div className="w-px h-8 bg-gray-200 mx-1 hidden md:block"></div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-white border border-gray-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2"
          >
            <i className="fas fa-file-upload"></i> Upload
          </button>

          <button
            onClick={handleExportExcel}
            disabled={loading}
            className="bg-white border border-gray-200 text-slate-700 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-download"></i>
            )}{" "}
            Export
          </button>

          {role === "ADMIN" && selectedIds.length > 0 && (
            <button
              onClick={() => handleBulkDelete("reports/invoices/bulk-delete/")}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2 animate-in zoom-in"
            >
              <i className="fas fa-trash-alt"></i> Delete ({selectedIds.length})
            </button>
          )}

          {/* 🔥 NAYA TEMPLATE BUTTON TOP HEADER MEIN 🔥 */}
          <button
            onClick={handleDownloadTemplate}
            className="bg-white border border-gray-200 text-slate-700 hover:text-indigo-700 hover:border-indigo-200 hover:bg-indigo-50 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2"
          >
            <i className="fas fa-file-csv"></i> Template
          </button>

          {/* ... iske aage aapke purane Upload, Export wale button rahenge ... */}
          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-white border border-gray-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2"
          >
            <i className="fas fa-file-upload"></i> Upload
          </button>

          <button
            onClick={() => {
              setSearchOrderId("");
              setItemsData([]);
              setHeaderData(initialHeaderState);
              setEditMode(false);
              setFormModalOpen(true);
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2"
          >
            <i className="fas fa-plus"></i> New Entry
          </button>
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto max-h-[65vh] min-h-[50vh] custom-scrollbar">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-black uppercase tracking-widest sticky top-0 z-10 backdrop-blur-sm">
                {role === "ADMIN" && (
                  <th className="p-4 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={() => handleSelectAll(shipments)}
                      checked={
                        shipments.length > 0 &&
                        selectedIds.length === shipments.length
                      }
                      className="w-4 h-4 rounded cursor-pointer accent-slate-900"
                    />
                  </th>
                )}
                <th className="p-4 w-12 text-center">S.No</th>
                {showCol("show_order_id") && <th className="p-4">Order ID</th>}
                {showCol("show_txn_date") && <th className="p-4">Txn Date</th>}
                {showCol("show_firm") && <th className="p-4">Firm</th>}
                {showCol("show_location") && <th className="p-4">Location</th>}
                {showCol("show_asin_fsn") && <th className="p-4">ASIN/FSN</th>}
                {showCol("show_model_name") && (
                  <th className="p-4">Model Name</th>
                )}
                {showCol("show_model_no") && <th className="p-4">Model No</th>}
                {showCol("show_unit_price") && (
                  <th className="p-4 text-right">Unit Price</th>
                )}
                {showCol("show_seller_name") && (
                  <th className="p-4 border-l border-gray-100">Seller Name</th>
                )}
                {showCol("show_seller_gstn") && (
                  <th className="p-4">Seller GSTN</th>
                )}
                {showCol("show_invoice_no") && (
                  <th className="p-4">Invoice No</th>
                )}
                {showCol("show_invoice_date") && (
                  <th className="p-4">Invoice Date</th>
                )}
                {showCol("show_invoice_qty") && (
                  <th className="p-4 text-center">Inv Qty</th>
                )}
                {showCol("show_invoice_amount") && (
                  <th className="p-4 text-right">Inv Amount</th>
                )}

                {/* 🔥 NAYA TABLE HEADER: Tracking ID */}
                {showCol("show_tracking_id") && (
                  <th className="p-4 text-center bg-indigo-50/50">
                    Tracking ID
                  </th>
                )}

                {showCol("show_delivery_status") && (
                  <th className="p-4 text-center border-l border-gray-100">
                    Status
                  </th>
                )}
                {showCol("show_delivery_date") && (
                  <th className="p-4 text-center">Del Date</th>
                )}
                <th className="p-4 text-center sticky right-0 bg-slate-50/90 border-l border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-sm">
              {shipments.length === 0 ? (
                <tr>
                  <td
                    colSpan="20"
                    className="p-12 text-center text-slate-400 font-medium text-sm"
                  >
                    <i className="fas fa-inbox text-3xl mb-3 opacity-50 block"></i>
                    No shipments recorded yet.
                  </td>
                </tr>
              ) : (
                shipments.map((ship, index) => {
                  if (!ship) return null;
                  const baseLocked =
                    ship.delivery_status === "Delivered" ||
                    ship.delivery_status === "Cancelled";
                  const isLocked = baseLocked && !unlockedRows[ship.id];
                  const currentEdit = inlineEdits[ship.id] || {};
                  const displayStatus =
                    currentEdit.delivery_status !== undefined
                      ? currentEdit.delivery_status
                      : ship.delivery_status;
                  const displayDate =
                    currentEdit.delivery_date !== undefined
                      ? currentEdit.delivery_date
                      : ship.delivery_date || "";

                  const badgeStyle = getBadgeStyle(ship.delivery_status);

                  return (
                    <tr
                      key={ship.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      {role === "ADMIN" && (
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(ship.id)}
                            onChange={() => handleRowSelect(ship.id)}
                            className="w-4 h-4 rounded cursor-pointer accent-slate-900"
                          />
                        </td>
                      )}

                      <td className="p-4 text-center font-mono text-[11px] font-bold text-slate-400">
                        {((currentPage - 1) * 50 + index + 1)
                          .toString()
                          .padStart(2, "0")}
                      </td>
                      {showCol("show_order_id") && (
                        <td className="p-4 font-bold text-slate-900 text-[13px]">
                          {ship?.order_id || "-"}
                        </td>
                      )}
                      {showCol("show_txn_date") && (
                        <td className="p-4 text-slate-600 font-medium text-[13px]">
                          {formatDate(ship?.txn_date)}
                        </td>
                      )}
                      {showCol("show_firm") && (
                        <td className="p-4 font-bold text-slate-800 text-[13px]">
                          {ship?.firm || "-"}
                        </td>
                      )}
                      {showCol("show_location") && (
                        <td className="p-4 text-slate-600 text-[13px]">
                          {ship?.location || "-"}
                        </td>
                      )}
                      {showCol("show_asin_fsn") && (
                        <td className="p-4 text-xs font-mono font-bold text-slate-500">
                          {ship?.asin_fsn || "-"}
                        </td>
                      )}
                      {showCol("show_model_name") && (
                        <td
                          className="p-4 font-medium text-slate-700 text-[13px]"
                          title={ship?.model_name}
                        >
                          {ship?.model_name || "-"}
                        </td>
                      )}
                      {showCol("show_model_no") && (
                        <td className="p-4 text-slate-600 text-[13px]">
                          {ship?.model_no || "-"}
                        </td>
                      )}
                      {showCol("show_unit_price") && (
                        <td className="p-4 font-medium text-right text-slate-600 text-[13px]">
                          ₹
                          {parseFloat(ship?.unit_price || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      )}

                      {showCol("show_seller_name") && (
                        <td className="p-4 font-bold text-slate-800 text-[13px] border-l border-gray-100">
                          {ship?.seller_name || "-"}
                        </td>
                      )}
                      {showCol("show_seller_gstn") && (
                        <td className="p-4 text-slate-500 font-mono text-xs uppercase">
                          {ship?.seller_gstn || "-"}
                        </td>
                      )}
                      {showCol("show_invoice_no") && (
                        <td className="p-4 font-bold text-indigo-600 text-[13px]">
                          {ship?.invoice_no || "-"}
                        </td>
                      )}
                      {showCol("show_invoice_date") && (
                        <td className="p-4 text-slate-600 font-medium text-[13px]">
                          {formatDate(ship?.invoice_date)}
                        </td>
                      )}
                      {showCol("show_invoice_qty") && (
                        <td className="p-4 text-center font-bold text-slate-800">
                          {ship?.invoice_qty || "-"}
                        </td>
                      )}
                      {showCol("show_invoice_amount") && (
                        <td className="p-4 text-right font-bold text-slate-800 text-[13px]">
                          ₹
                          {parseFloat(ship?.invoice_amount || 0).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                      )}

                      {/* 🔥 NAYA TABLE DATA: Tracking ID */}
                      {showCol("show_tracking_id") && (
                        <td className="p-4 text-center font-black text-indigo-600 bg-indigo-50/20 text-[12px] uppercase tracking-wider">
                          {ship?.tracking_id || "-"}
                        </td>
                      )}

                      {/* STATUS (Inline Edit) */}
                      {showCol("show_delivery_status") && (
                        <td className="p-4 text-center border-l border-gray-100">
                          {isLocked ? (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border border-dashed ${badgeStyle.bg}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${badgeStyle.dot}`}
                              ></span>
                              {ship.delivery_status}
                            </span>
                          ) : (
                            <select
                              value={displayStatus}
                              onChange={(e) =>
                                handleInlineChange(
                                  ship.id,
                                  "delivery_status",
                                  e.target.value,
                                )
                              }
                              className="bg-gray-50 border border-gray-200 text-slate-800 font-bold p-1.5 rounded-md outline-none focus:ring-1 focus:ring-slate-300 text-[11px] cursor-pointer shadow-sm w-[100px]"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          )}
                        </td>
                      )}

                      {/* DELIVERY DATE (Inline Edit) */}
                      {showCol("show_delivery_date") && (
                        <td className="p-4 text-center">
                          {isLocked ? (
                            <span className="text-xs text-slate-500 font-medium">
                              {formatDate(ship.delivery_date)}
                            </span>
                          ) : (
                            <input
                              type="date"
                              value={displayDate}
                              onChange={(e) =>
                                handleInlineChange(
                                  ship.id,
                                  "delivery_date",
                                  e.target.value,
                                )
                              }
                              className="bg-gray-50 border border-gray-200 p-1.5 rounded-md outline-none focus:ring-1 focus:ring-slate-300 text-[11px] font-medium cursor-pointer shadow-sm text-slate-700 w-full max-w-[120px]"
                            />
                          )}
                        </td>
                      )}

                      <td className="p-4 text-center sticky right-0 bg-white group-hover:bg-slate-50 border-l border-gray-100 transition-colors">
                        {isLocked ? (
                          <div className="flex items-center justify-center gap-2">
                            <span className="px-2 py-1 bg-slate-100 text-slate-400 rounded text-[9px] font-bold uppercase tracking-widest">
                              <i className="fas fa-lock mr-1"></i> Locked
                            </span>
                            {role === "ADMIN" && (
                              <button
                                onClick={() =>
                                  setUnlockedRows((prev) => ({
                                    ...prev,
                                    [ship.id]: true,
                                  }))
                                }
                                className="text-amber-500 hover:text-amber-600 transition"
                                title="Unlock Row"
                              >
                                <i className="fas fa-unlock-alt"></i>
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            {currentEdit.isDirty && (
                              <button
                                onClick={() => handleInlineSave(ship)}
                                className="bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 rounded text-[10px] font-bold transition flex items-center shadow-sm"
                              >
                                <i className="fas fa-check mr-1"></i> Save
                              </button>
                            )}
                            {role === "ADMIN" && (
                              <>
                                <button
                                  onClick={() => handleEditClick(ship)}
                                  className="text-slate-400 hover:text-amber-500 transition"
                                  title="Edit Full Record"
                                >
                                  <i className="fas fa-pen"></i>
                                </button>
                                <button
                                  onClick={() => handleDelete(ship.id)}
                                  className="text-slate-400 hover:text-red-500 transition"
                                  title="Delete Record"
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="mt-4 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200 gap-4">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
          Total Records:{" "}
          <span className="text-slate-800 text-sm">{totalRecords}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-2 bg-white border border-gray-200 text-slate-600 rounded-md font-bold text-xs hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 transition"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          <span className="px-4 py-2 bg-slate-900 text-white rounded-md font-bold text-xs shadow-sm">
            Page {currentPage} of {Math.ceil(totalRecords / 50) || 1}
          </span>

          <button
            disabled={currentPage >= Math.ceil(totalRecords / 50)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-2 bg-white border border-gray-200 text-slate-600 rounded-md font-bold text-xs hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 transition"
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          <div className="flex items-center ml-2 border-l border-gray-200 pl-4">
            <input
              type="number"
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder="Go to..."
              className="w-20 px-3 py-2 bg-white border border-gray-200 rounded-l-md text-xs font-bold outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200"
            />
            <button
              onClick={() => {
                const p = parseInt(jumpPage);
                const maxPages = Math.ceil(totalRecords / 50) || 1;
                if (p > 0 && p <= maxPages) {
                  setCurrentPage(p);
                  setJumpPage("");
                } else {
                  Swal.fire({
                    title: "Invalid",
                    text: `Enter valid page (1-${maxPages})`,
                    icon: "info",
                    confirmButtonColor: "#0f172a",
                  });
                }
              }}
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-r-md transition"
            >
              GO
            </button>
          </div>
        </div>
      </div>

      {/* --- ALL MODALS --- */}

      {/* 1. FILTER MODAL */}
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
              {["start_date", "end_date"].map((field) => (
                <div key={field}>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type="date"
                    value={filters[field]}
                    onChange={(e) =>
                      setFilters({ ...filters, [field]: e.target.value })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Delivery Status
                </label>
                <select
                  value={filters.delivery_status}
                  onChange={(e) =>
                    setFilters({ ...filters, delivery_status: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium"
                >
                  <option value="">All Statuses</option>{" "}
                  <option value="Pending">Pending</option>{" "}
                  <option value="Delivered">Delivered</option>{" "}
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Firm
                </label>
                <select
                  value={filters.firm}
                  onChange={(e) =>
                    setFilters({ ...filters, firm: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium"
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
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium"
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
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Merchant
                </label>
                <input
                  type="text"
                  placeholder="Search Merchant..."
                  value={filters.merchant}
                  onChange={(e) =>
                    setFilters({ ...filters, merchant: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  Invoice No
                </label>
                <input
                  type="text"
                  placeholder="Search Invoice No..."
                  value={filters.invoice_no}
                  onChange={(e) =>
                    setFilters({ ...filters, invoice_no: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setFilters({
                    start_date: "",
                    end_date: "",
                    order_id: "",
                    invoice_no: "",
                    delivery_status: "",
                    firm: "",
                    location: "",
                    merchant: "",
                  });
                  setCurrentPage(1);
                  setFilterModalOpen(false);
                }}
                className="px-5 py-2.5 bg-slate-100 text-slate-600 text-xs tracking-wider uppercase font-bold rounded-lg hover:bg-slate-200 transition"
              >
                Clear Filters
              </button>
              <button
                onClick={() => {
                  setCurrentPage(1);
                  setFilterModalOpen(false);
                }}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs tracking-wider uppercase rounded-lg font-bold transition shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ADMIN COLUMN VIEW SETUP MODAL */}
      {isViewModalOpen && role === "ADMIN" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white p-8 rounded-2xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Configure User View
              </h2>
              <button
                onClick={() => setViewModalOpen(false)}
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
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                      {key.replace("show_", "").replace(/_/g, " ")}
                    </span>
                  </label>
                ))}
            </div>
            <div className="flex justify-end gap-3 mt-6 border-t border-gray-100 pt-5">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-6 py-2.5 bg-slate-100 text-slate-600 text-xs tracking-wider uppercase font-bold rounded-lg hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveViewSettings}
                className="px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs tracking-wider uppercase rounded-lg font-bold transition shadow-md"
              >
                Save View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. UPLOAD EXCEL MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Bulk Upload Shipments
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
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition shadow-md"
              >
                {loading ? "Uploading..." : "Sync Database"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. MAIN FORM MODAL (Fetch & Process) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95">
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-white rounded-t-2xl">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {editMode ? "Edit Shipment Record" : "Process New Shipment"}
              </h2>
              <button
                onClick={() => setFormModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <div className="px-8 py-6 overflow-y-auto custom-scrollbar bg-gray-50/50">
              {!editMode && (
                <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm items-end">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Step 1: Enter Order ID to Auto-Fetch
                    </label>
                    <input
                      type="text"
                      value={searchOrderId}
                      onChange={(e) => setSearchOrderId(e.target.value)}
                      placeholder="e.g. OD43785..."
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 font-bold text-slate-800 text-sm"
                    />
                  </div>
                  <button
                    onClick={handleFetchOrderData}
                    disabled={loading}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition shadow-md w-full md:w-auto flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-search"></i>
                    )}{" "}
                    Fetch Data
                  </button>
                </div>
              )}

              <form
                id="shipmentForm"
                onSubmit={handleFormSubmit}
                className="flex flex-col gap-6 w-full"
              >
                {itemsData.length > 0 && (
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 border-b border-gray-100 pb-3">
                      Common Order Details (Read-Only)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      {[
                        { l: "Order ID", v: headerData.order_id },
                        { l: "Txn Date", v: headerData.txn_date },
                        { l: "Firm", v: headerData.firm },
                        { l: "Location", v: headerData.location },
                      ].map((h, i) => (
                        <div key={i}>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                            {h.l}
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={h.v || ""}
                            className="w-full bg-gray-50 border border-transparent p-2.5 rounded-lg text-sm font-bold text-slate-600 cursor-not-allowed outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {itemsData.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 border-b border-gray-100 pb-3">
                      Step 2: Product & Invoice Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5">
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                          ASIN / FSN *
                        </label>
                        <select
                          name="asin_fsn"
                          value={item.asin_fsn}
                          onChange={(e) => handleItemChange(index, e)}
                          disabled={editMode}
                          className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-lg text-sm font-bold text-slate-900 outline-none focus:ring-1 focus:ring-slate-300"
                        >
                          <option value="">Select Item</option>
                          {fetchedOrderDetails.map((opt, i) => (
                            <option key={i} value={opt.asin_fsn}>
                              {opt.asin_fsn}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Model Name
                        </label>
                        <div className="w-full bg-gray-100 p-2.5 rounded-lg text-sm font-medium text-slate-500 min-h-[42px] flex items-center">
                          {item.model_name || "-"}
                        </div>
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Model Number
                        </label>
                        <div className="w-full bg-gray-100 p-2.5 rounded-lg text-sm font-medium text-slate-500 min-h-[42px] flex items-center">
                          {item.model_no || "-"}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Unit Price
                        </label>
                        <div className="w-full bg-gray-100 p-2.5 rounded-lg text-sm font-bold text-slate-500 min-h-[42px] flex items-center">
                          {item.unit_price ? `₹ ${item.unit_price}` : "-"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5 p-5 bg-slate-50/50 rounded-xl border border-gray-100">
                      <div>
                        <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">
                          Seller Name *
                        </label>
                        <input
                          type="text"
                          name="seller_name"
                          value={item.seller_name || ""}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                          Seller GSTN
                        </label>
                        <input
                          type="text"
                          name="seller_gstn"
                          value={item.seller_gstn || ""}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-bold uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">
                          Invoice No *
                        </label>
                        <input
                          type="text"
                          name="invoice_no"
                          value={item.invoice_no || ""}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                          Invoice Date
                        </label>
                        <input
                          type="date"
                          name="invoice_date"
                          value={item.invoice_date || ""}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-medium"
                        />
                      </div>
                    </div>

                    {/* 🔥 MODIFIED GRID: Added Tracking ID Input Here */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                          Invoice Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          name="invoice_qty"
                          value={item.invoice_qty || ""}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                          Invoice Amt (₹)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="invoice_amount"
                          value={item.invoice_amount || ""}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full bg-white border border-gray-200 p-2.5 rounded-lg outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-200 text-sm font-bold"
                        />
                      </div>
                      {/* 🔥 NAYA TRACKING ID FIELD 🔥 */}
                      <div>
                        <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1.5">
                          Tracking ID / AWB
                        </label>
                        <input
                          type="text"
                          name="tracking_id"
                          value={item.tracking_id || ""}
                          onChange={(e) => handleItemChange(index, e)}
                          placeholder="e.g. AWB12345678"
                          className="w-full bg-indigo-50/30 border border-indigo-200 p-2.5 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 text-sm font-bold uppercase tracking-wider placeholder:text-slate-400 placeholder:normal-case"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </form>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setFormModalOpen(false)}
                className="px-6 py-2.5 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="shipmentForm"
                disabled={loading || itemsData.length === 0}
                className="px-8 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : editMode
                    ? "Update Record"
                    : "Save Invoice Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}