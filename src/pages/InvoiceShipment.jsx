import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from 'sweetalert2';

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
      Swal.fire("Table View Updated!");
      setViewModalOpen(false);
      fetchData();
    } catch (error) {
      Swal.fire("Failed to save view.");
    }
  };

  // 🔥 1. FETCH ORDER DATA (Ab ye form me sirf 1 khali block dega)
  const handleFetchOrderData = async () => {
    if (!searchOrderId.trim()) return Swal.fire("Please enter Order ID first!");
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

      // Humesha form me 1 khali dynamic box hi shuru me dikhega
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
          delivery_status: "Pending",
          delivery_date: "",
          is_existing: false,
          shipment_id: null,
        },
      ]);
    } catch (error) {
      Swal.fire("❌ NOT FOUND: This Order ID does not exist in Order Reports!");
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
        // Sirf system details copy hongi
        item.model_name = selectedDetails.model_name || "";
        item.model_no = selectedDetails.model_no || "";
        item.unit_price = selectedDetails.unit_price || "";

        // Manual inputs humesha 100% khali (Fresh) rahenge mandatory naye invoice ke liye
        item.seller_name = "";
        item.seller_gstn = "";
        item.invoice_no = "";
        item.invoice_date = "";
        item.invoice_qty = selectedDetails.order_qty || "";
        item.invoice_amount = selectedDetails.order_amount || "";
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
    if (itemsData.length === 0) return Swal.fire("Please fetch an Order first!");

    const validItemsToSave = itemsData.filter(
      (item) =>
        item.invoice_no &&
        item.invoice_no.trim() !== "" &&
        item.seller_name &&
        item.seller_name.trim() !== "",
    );

    if (validItemsToSave.length === 0) {
      return Swal.fire("Please fill 'Seller Name' and 'Invoice No' to save data.");
    }

    setLoading(true);

    const formatPayload = (item) => {
      const payload = { ...headerData, ...item };
      if (payload.delivery_date === "") payload.delivery_date = null;
      if (payload.invoice_date === "") payload.invoice_date = null;
      return payload;
    };

    try {
      // 1. Agar Table ke Edit Button (Pencil Icon) se aaye hain tabhi PUT (Update) chalega
      if (editMode) {
        await api.put(
          `reports/shipments/${editId}/`,
          formatPayload(validItemsToSave[0]),
        );
        Swal.fire("Shipment Updated Successfully!");
      }
      // 2. Fetch Process Form se hamesha FRESH data POST (Nayi Row) hokar hi save hoga
      else {
        const apiCalls = validItemsToSave.map((item) => {
          const payload = formatPayload(item);
          return api.post("reports/shipments/", payload); // 🔥 Direct Insert fresh row
        });

        await Promise.all(apiCalls);
        Swal.fire(
          `Successfully saved ${validItemsToSave.length} fresh Shipment Record(s)!`,
        );
      }

      setFormModalOpen(false);
      setSearchOrderId("");
      setItemsData([]);
      setHeaderData({ order_id: "", txn_date: "", firm: "", location: "" });
      setEditMode(false);
      fetchData(); // Table Grid reload
    } catch (error) {
      Swal.fire("Error saving records. Please ensure Invoice Number is unique.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (role !== "ADMIN") return Swal.fire("Only Admins can delete.");
    if (window.confirm("Delete this shipment record permanently?")) {
      try {
        await api.delete(`reports/shipments/${id}/`);
        fetchData();
      } catch (error) {
        Swal.fire("Access Denied.");
      }
    }
  };

  // Inline Edits
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
      if (newStatus === "Delivered" || newStatus === "Cancelled")
        Swal.fire("Row is now Locked & Status Updated Successfully! 🔒");
      else Swal.fire("Status Updated Successfully!");
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
      Swal.fire("Failed to update dashboard status.");
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
      Swal.fire(res.data.message || "Excel Uploaded Successfully!");
      setUploadModalOpen(false);
      setFile(null);
      setCurrentPage(1);
      fetchData();
    } catch (error) {
      Swal.fire(
        "Upload Failed: \n" + (error.response?.data?.error || "Unknown Error"),
      );
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (status) => {
    const s = String(status || "")
      .trim()
      .toLowerCase();
    if (s === "delivered")
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "cancelled") return "bg-red-50 text-red-700 border-red-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div className="bg-[#f0fdfa] min-h-screen font-sans pb-10">
      {/* HEADER & TOP BUTTONS */}
      <div className="bg-teal-700 text-white p-6 rounded-b-3xl shadow-md mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <i className="fas fa-truck-fast mr-3"></i>Invoice & Shipment
          </h1>
          <p className="text-teal-100 text-sm mt-1">
            Manage invoices, bulk upload and track delivery statuses
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {/* GLOBAL SEARCH */}
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mr-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
            <input
              type="text"
              placeholder="Search anything..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setCurrentPage(1);
                  fetchData();
                }
              }}
              className="px-4 py-2.5 outline-none text-sm w-48 md:w-64 text-slate-700 font-medium"
            />
            <button
              onClick={() => {
                setCurrentPage(1);
                fetchData();
              }}
              className="bg-slate-50 border-l border-slate-200 px-4 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition"
            >
              <i className="fas fa-search"></i>
            </button>
          </div>

          {/* CLEAR ALL BUTTON */}
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
                });
                setCurrentPage(1);
              }}
              className="bg-red-500/20 hover:bg-red-500/40 border border-red-400/50 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition flex items-center shadow-sm backdrop-blur-sm"
            >
              <i className="fas fa-undo-alt mr-2"></i> Clear
            </button>
          )}

          <button
            onClick={() => setFilterModalOpen(true)}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition flex items-center"
          >
            <i className="fas fa-filter mr-2"></i> Filter{" "}
            {Object.values(filters).some((x) => x !== "") && (
              <span className="ml-2 w-2 h-2 bg-red-400 rounded-full shadow-lg"></span>
            )}
          </button>

          {role === "ADMIN" && (
            <button
              onClick={() => setViewModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl font-semibold backdrop-blur-sm transition flex items-center"
            >
              <i className="fas fa-eye-slash mr-2"></i> View Setup
            </button>
          )}

          <button
            onClick={() => {
              setSearchOrderId("");
              setItemsData([]);
              setHeaderData(initialHeaderState);
              setEditMode(false);
              setFormModalOpen(true);
            }}
            className="bg-white text-teal-800 px-5 py-2.5 rounded-xl font-extrabold shadow-lg hover:bg-teal-50 transition flex items-center"
          >
            <i className="fas fa-plus-circle mr-2 text-teal-600"></i> New Entry
          </button>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl font-extrabold shadow-lg transition flex items-center border border-emerald-400"
          >
            <i className="fas fa-file-excel mr-2"></i> Upload Excel
          </button>
        </div>
      </div>

      {/* MAIN TABLE */}
      <div className="px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[78vh] min-h-[60vh] custom-scrollbar">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-extrabold uppercase tracking-wider sticky top-0 z-10">
                  <th className="p-4 w-12 text-center">S.No</th>
                  {showCol("show_order_id") && (
                    <th className="p-4">Order ID</th>
                  )}
                  {showCol("show_txn_date") && (
                    <th className="p-4">Txn Date</th>
                  )}
                  {showCol("show_firm") && <th className="p-4">Firm</th>}
                  {showCol("show_location") && (
                    <th className="p-4">Location</th>
                  )}
                  {showCol("show_asin_fsn") && (
                    <th className="p-4">ASIN/FSN</th>
                  )}
                  {showCol("show_model_name") && (
                    <th className="p-4">Model Name</th>
                  )}
                  {showCol("show_model_no") && (
                    <th className="p-4">Model No</th>
                  )}
                  {showCol("show_unit_price") && (
                    <th className="p-4">Unit Price</th>
                  )}
                  {showCol("show_seller_name") && (
                    <th className="p-4 border-l border-slate-100">
                      Seller Name
                    </th>
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
                  {showCol("show_delivery_status") && (
                    <th className="p-4 text-center border-l border-slate-100">
                      Status
                    </th>
                  )}
                  {showCol("show_delivery_date") && (
                    <th className="p-4 text-center">Del Date</th>
                  )}
                  <th className="p-4 text-center bg-slate-50">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {shipments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="18"
                      className="p-10 text-center text-slate-400 font-medium"
                    >
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

                    return (
                      <tr
                        key={ship.id}
                        className="hover:bg-slate-50/50 transition-colors border-b border-slate-100"
                      >
                        <td className="p-4 text-center font-mono text-xs font-bold text-slate-400">
                          {((currentPage - 1) * 50 + index + 1)
                            .toString()
                            .padStart(2, "0")}
                        </td>
                        {showCol("show_order_id") && (
                          <td className="p-4 font-bold text-slate-700">
                            {ship?.order_id || "-"}
                          </td>
                        )}
                        {showCol("show_txn_date") && (
                          <td className="p-4 text-slate-600 font-medium">
                            {formatDate(ship?.txn_date)}
                          </td>
                        )}
                        {showCol("show_firm") && (
                          <td className="p-4 font-bold text-slate-800">
                            {ship?.firm || "-"}
                          </td>
                        )}
                        {showCol("show_location") && (
                          <td className="p-4 text-slate-600 font-medium">
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
                            className="p-4 font-medium text-slate-700 "
                            title={ship?.model_name}
                          >
                            {ship?.model_name || "-"}
                          </td>
                        )}
                        {showCol("show_model_no") && (
                          <td className="p-4 text-slate-600 font-medium">
                            {ship?.model_no || "-"}
                          </td>
                        )}
                        {showCol("show_unit_price") && (
                          <td className="p-4 font-bold text-slate-700">
                            ₹
                            {parseFloat(ship?.unit_price || 0).toLocaleString(
                              "en-IN",
                            )}
                          </td>
                        )}
                        {showCol("show_seller_name") && (
                          <td className="p-4 font-bold text-slate-800 border-l border-slate-100">
                            {ship?.seller_name || "-"}
                          </td>
                        )}
                        {showCol("show_seller_gstn") && (
                          <td className="p-4 text-slate-500 font-mono text-xs uppercase">
                            {ship?.seller_gstn || "-"}
                          </td>
                        )}
                        {showCol("show_invoice_no") && (
                          <td className="p-4 font-bold text-indigo-600">
                            {ship?.invoice_no || "-"}
                          </td>
                        )}
                        {showCol("show_invoice_date") && (
                          <td className="p-4 text-slate-600 font-medium">
                            {formatDate(ship?.invoice_date)}
                          </td>
                        )}
                        {showCol("show_invoice_qty") && (
                          <td className="p-4 text-center font-bold text-slate-700">
                            {ship?.invoice_qty || "-"}
                          </td>
                        )}
                        {showCol("show_invoice_amount") && (
                          <td className="p-4 text-right font-bold text-slate-700">
                            ₹
                            {parseFloat(
                              ship?.invoice_amount || 0,
                            ).toLocaleString("en-IN")}
                          </td>
                        )}

                        {showCol("show_delivery_status") && (
                          <td className="p-4 text-center border-l border-slate-100">
                            {isLocked ? (
                              <span
                                className={`font-bold text-[10px] uppercase tracking-wide border px-3 py-1.5 rounded-full shadow-sm ${getBadgeColor(ship.delivery_status)}`}
                              >
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
                                className=" bg-white border border-slate-300 text-slate-700 font-bold p-1.5 rounded-md outline-none focus:ring-2 focus:ring-teal-500/30 text-[11px] cursor-pointer shadow-sm"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            )}
                          </td>
                        )}

                        {showCol("show_delivery_date") && (
                          <td className="p-4 text-center font-bold text-slate-800">
                            {isLocked ? (
                              <span className="text-xs text-slate-600">
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
                                className="w-full bg-white border border-slate-300 p-1.5 rounded-md outline-none focus:ring-2 focus:ring-teal-500/30 text-[11px] font-semibold cursor-pointer shadow-sm text-slate-600"
                              />
                            )}
                          </td>
                        )}

                        <td className="p-4 text-center bg-slate-50/50 border-l border-slate-100">
                          {isLocked ? (
                            <div className="flex items-center justify-center gap-2">
                              <span className="px-3 py-1 bg-slate-200 text-slate-500 border border-slate-300 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-sm">
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
                                  className="text-teal-600 hover:text-teal-800 transition hover:scale-110 ml-1"
                                  title="Unlock Row"
                                >
                                  <i className="fas fa-unlock-alt text-[15px]"></i>
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-3">
                              {currentEdit.isDirty && (
                                <button
                                  onClick={() => handleInlineSave(ship)}
                                  className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-md shadow-sm text-[11px] font-bold transition flex items-center"
                                >
                                  <i className="fas fa-check mr-1"></i> Save
                                </button>
                              )}
                              {role === "ADMIN" && (
                                <>
                                  <button
                                    onClick={() => handleEditClick(ship)}
                                    className="text-slate-400 hover:text-blue-600 transition hover:scale-110"
                                    title="Edit Full Record"
                                  >
                                    <i className="fas fa-pen"></i>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(ship.id)}
                                    className="text-slate-400 hover:text-red-600 transition hover:scale-110"
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
      </div>

      {/* PAGINATION */}
      <div className="mt-4 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
            Total Records:{" "}
            <span className="text-teal-700 text-sm">{totalRecords}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg font-bold text-xs hover:bg-slate-100 disabled:opacity-40"
            >
              <i className="fas fa-chevron-left mr-2"></i> Prev
            </button>
            <span className="px-4 py-2 bg-slate-50 text-slate-700 rounded-lg font-bold text-xs border border-slate-200 shadow-sm">
              Page {currentPage} of {Math.ceil(totalRecords / 50) || 1}
            </span>
            <button
              disabled={currentPage >= Math.ceil(totalRecords / 50)}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg font-bold text-xs hover:bg-slate-100 disabled:opacity-40"
            >
              Next <i className="fas fa-chevron-right ml-2"></i>
            </button>
            <div className="flex items-center ml-2 border-l border-slate-200 pl-4">
              <input
                type="number"
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                placeholder="Go to..."
                className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-l-lg text-xs font-bold outline-none focus:border-teal-500"
              />
              <button
                onClick={() => {
                  const p = parseInt(jumpPage);
                  const maxPages = Math.ceil(totalRecords / 50) || 1;
                  if (p > 0 && p <= maxPages) {
                    setCurrentPage(p);
                    setJumpPage("");
                  } else {
                    Swal.fire(`Enter valid page (1-${maxPages})`);
                  }
                }}
                className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-r-lg"
              >
                GO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NEW ADVANCED FILTER MODAL */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-3xl shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-teal-800">
                <i className="fas fa-filter text-teal-600 mr-2"></i> Advanced
                Filters
              </h2>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="text-slate-400 hover:text-red-500"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) =>
                    setFilters({ ...filters, start_date: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-teal-500 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) =>
                    setFilters({ ...filters, end_date: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-teal-500 text-sm font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Delivery Status
                </label>
                <select
                  value={filters.delivery_status}
                  onChange={(e) =>
                    setFilters({ ...filters, delivery_status: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-teal-500 text-sm font-medium"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Firm
                </label>
                <select
                  value={filters.firm}
                  onChange={(e) =>
                    setFilters({ ...filters, firm: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-teal-500 text-sm font-medium"
                >
                  <option value="">All Firms</option>
                  {masterFirms.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-teal-500 text-sm font-medium"
                >
                  <option value="">All Locations</option>
                  {masterLocations.map((l) => (
                    <option key={l.id} value={l.name}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Invoice No.
                </label>
                <input
                  type="text"
                  placeholder="Search Invoice No..."
                  value={filters.invoice_no}
                  onChange={(e) =>
                    setFilters({ ...filters, invoice_no: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-teal-500 text-sm font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
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
                  });
                  setCurrentPage(1);
                  setFilterModalOpen(false);
                }}
                className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
              >
                Clear Filters
              </button>
              <button
                onClick={() => {
                  setCurrentPage(1);
                  setFilterModalOpen(false);
                }}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD EXCEL MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800">
                <i className="fas fa-file-excel text-emerald-500 mr-2"></i> Bulk
                Upload Shipments
              </h2>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-red-500"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleUploadSubmit}>
              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 p-8 text-center rounded-2xl bg-slate-50 mb-6 transition-colors">
                <p className="text-sm font-bold text-slate-600 mb-3">
                  Select Excel/CSV File
                </p>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin"></i> Uploading...
                  </>
                ) : (
                  "Upload Data"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL & FORM MODAL (Kept exact same as your previous stable version) */}
      {isViewModalOpen && role === "ADMIN" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-800">
                <i className="fas fa-eye-slash mr-2 text-teal-600"></i>{" "}
                Configure Column Visibility
              </h2>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-slate-400 hover:text-red-500"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto p-1 custom-scrollbar">
              {[
                "show_order_id",
                "show_txn_date",
                "show_firm",
                "show_location",
                "show_asin_fsn",
                "show_model_name",
                "show_model_no",
                "show_unit_price",
                "show_seller_name",
                "show_seller_gstn",
                "show_invoice_no",
                "show_invoice_date",
                "show_invoice_qty",
                "show_invoice_amount",
                "show_delivery_status",
                "show_delivery_date",
              ].map((key) => (
                <label
                  key={key}
                  className="flex items-center space-x-3 bg-slate-50 p-3 rounded-xl cursor-pointer hover:bg-teal-50 transition border border-slate-100"
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
                    className="w-4 h-4 text-teal-600"
                  />
                  <span className="text-xs font-bold text-slate-600 uppercase">
                    {key.replace("show_", "").replace(/_/g, " ")}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-6 border-t border-slate-100 pt-4">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveViewSettings}
                className="px-8 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md"
              >
                Save View
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-file-invoice text-teal-600"></i>{" "}
                {editMode ? "Edit Shipment Record" : "Process New Shipment"}
              </h2>
              <button
                onClick={() => setFormModalOpen(false)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
              {!editMode && (
                <div className="flex gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200 items-end">
                  <div className="flex-1">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                      Enter Order ID to Auto-Fetch
                    </label>
                    <input
                      type="text"
                      value={searchOrderId}
                      onChange={(e) => setSearchOrderId(e.target.value)}
                      placeholder="e.g. OD43785..."
                      className="w-full bg-white border border-slate-300 p-2.5 rounded-lg outline-none focus:border-teal-500 font-bold text-slate-700"
                    />
                  </div>
                  <button
                    onClick={handleFetchOrderData}
                    disabled={loading}
                    className="bg-slate-800 hover:bg-black text-white px-6 py-2.5 rounded-lg font-bold transition flex items-center gap-2"
                  >
                    {loading ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fas fa-search"></i>
                    )}{" "}
                    Fetch
                  </button>
                </div>
              )}
              <form
                id="shipmentForm"
                onSubmit={handleFormSubmit}
                className="flex flex-col gap-6 w-full"
              >
                {itemsData.length > 0 && (
                  <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                    <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">
                      Common Order Details (Locked)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          1. Order ID
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={headerData.order_id}
                          className="w-full bg-transparent border-b border-slate-300 p-1 text-[13px] font-bold text-slate-700 cursor-not-allowed outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          2. Txn Date
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={headerData.txn_date || ""}
                          className="w-full bg-transparent border-b border-slate-300 p-1 text-[13px] font-bold text-slate-700 cursor-not-allowed outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          3. Firm
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={headerData.firm || ""}
                          className="w-full bg-transparent border-b border-slate-300 p-1 text-[13px] font-bold text-slate-700 cursor-not-allowed outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          4. Location
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={headerData.location || ""}
                          className="w-full bg-transparent border-b border-slate-300 p-1 text-[13px] font-bold text-slate-700 cursor-not-allowed outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {itemsData.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
                  >
                    {/* --- PRODUCT SELECTION DROPDOWN BLOCK --- */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 pb-4 border-b border-slate-100">
                      {/* ASIN: 3 Column Space */}
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          ASIN / FSN *
                        </label>
                        <select
                          name="asin_fsn"
                          value={item.asin_fsn}
                          onChange={(e) => handleItemChange(index, e)}
                          disabled={editMode}
                          title={item.asin_fsn}
                          className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-[13px] font-bold text-indigo-600 outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="">-- Select ASIN / FSN --</option>
                          {fetchedOrderDetails.map((opt, i) => (
                            <option key={i} value={opt.asin_fsn}>
                              {opt.asin_fsn}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Model Name: 4 Column Space (Zyada jagah) aur text wrap */}
                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Model Name
                        </label>
                        {/* Input ki jagah div lagaya hai taaki lamba naam 2 lines me wrap ho sake */}
                        <div className="w-full bg-slate-100 border border-slate-200 p-2.5 rounded-lg text-[12px] leading-snug font-semibold text-slate-500 cursor-not-allowed min-h-[42px] break-words flex items-center">
                          {item.model_name || "-"}
                        </div>
                      </div>

                      {/* Model: 3 Column Space */}
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Model
                        </label>
                        <div className="w-full bg-slate-100 border border-slate-200 p-2.5 rounded-lg text-[12px] leading-snug font-semibold text-slate-500 cursor-not-allowed min-h-[42px] break-words flex items-center">
                          {item.model_no || "-"}
                        </div>
                      </div>

                      {/* Unit Price: 2 Column Space */}
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                          Unit Price
                        </label>
                        <div className="w-full bg-slate-100 border border-slate-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-600 cursor-not-allowed min-h-[42px] flex items-center">
                          {item.unit_price ? `₹ ${item.unit_price}` : "-"}
                        </div>
                      </div>
                    </div>
                    <h4 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-widest mb-3">
                      <i className="fas fa-keyboard mr-1"></i> Manual Entry
                      Fields
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          1. Seller Name *
                        </label>
                        <input
                          type="text"
                          name="seller_name"
                          value={item.seller_name || ""}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg outline-none focus:border-teal-500 text-[13px] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          2. Seller GSTN
                        </label>
                        <input
                          type="text"
                          name="seller_gstn"
                          value={item.seller_gstn || ""}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg outline-none focus:border-teal-500 text-[13px] font-semibold uppercase"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          3. Invoice No *
                        </label>
                        <input
                          type="text"
                          name="invoice_no"
                          value={item.invoice_no || ""}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg outline-none focus:border-teal-500 text-[13px] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          4. Invoice Date
                        </label>
                        <input
                          type="date"
                          name="invoice_date"
                          value={item.invoice_date || ""}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg outline-none focus:border-teal-500 text-[13px] font-semibold"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          5. Invoice Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          name="invoice_qty"
                          value={item.invoice_qty || ""}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg outline-none focus:border-teal-500 text-[13px] font-bold text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                          6. Invoice Amount (₹)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="invoice_amount"
                          value={item.invoice_amount || ""}
                          onChange={(e) => handleItemChange(index, e)}
                          className="w-full bg-white border border-slate-200 p-2 rounded-lg outline-none focus:border-teal-500 text-[13px] font-bold text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </form>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setFormModalOpen(false)}
                className="px-6 py-2 bg-white border border-slate-300 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="shipmentForm"
                disabled={loading || itemsData.length === 0}
                className="px-8 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-md transition flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : editMode ? (
                  "Update Shipment"
                ) : (
                  "Save Invoice Record"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}