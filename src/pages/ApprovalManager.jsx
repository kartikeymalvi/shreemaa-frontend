// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import Swal from "sweetalert2";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import autoTable from "jspdf-autotable";

// // --- Utility Functions ---
// const formatIndianNumber = (num) => {
//   if (!num || isNaN(num)) return "0.00";
//   return new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(Number(num));
// };

// const parseIndianNumber = (str) => {
//   if (!str) return 0;
//   return parseFloat(str.toString().replace(/,/g, "")) || 0;
// };

// // --- Reusable Modern SVG Icons ---

// export const IconWhatsApp = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
//   </svg>
// );
// export const IconDownload = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//     <polyline points="7 10 12 15 17 10"></polyline>
//     <line x1="12" y1="15" x2="12" y2="3"></line>
//   </svg>
// );
// export const IconColumns = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <rect x="3" y="3" width="7" height="18" rx="1"></rect>
//     <rect x="14" y="3" width="7" height="18" rx="1"></rect>
//   </svg>
// );
// export const IconPlus = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="3"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <line x1="12" y1="5" x2="12" y2="19"></line>
//     <line x1="5" y1="12" x2="19" y2="12"></line>
//   </svg>
// );
// export const IconSearch = () => (
//   <svg
//     width="14"
//     height="14"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="#94a3b8"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <circle cx="11" cy="11" r="8"></circle>
//     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//   </svg>
// );
// export const IconFilter = () => (
//   <svg
//     width="16"
//     height="16"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
//   </svg>
// );
// export const IconPDF = () => (
//   <svg
//     width="14"
//     height="14"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
//     <polyline points="14 2 14 8 20 8"></polyline>
//     <line x1="16" y1="13" x2="8" y2="13"></line>
//     <line x1="16" y1="17" x2="8" y2="17"></line>
//     <polyline points="10 9 9 9 8 9"></polyline>
//   </svg>
// );

// export default function ApprovalManager() {
//   const navigate = useNavigate();
//   const role = localStorage.getItem("user_role") || "USER";
//   const username = localStorage.getItem("username") || "User";

//   const [approvals, setApprovals] = useState([]);
//   const [dropdowns, setDropdowns] = useState({
//     firms: [],
//     locations: [],
//     merchants: [],
//     models: [],
//   });
//   const [loading, setLoading] = useState(false);

//   const [showFilters, setShowFilters] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filters, setFilters] = useState({
//     requested_by: "",
//     authorized_by: "",
//     merchant: "",
//     firm: "",
//     location: "",
//     request_date: "",
//   });

//   // Modals States
//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

//   // Data States
//   const [viewData, setViewData] = useState(null);
//   const [editModeId, setEditModeId] = useState(null);

//   // 🔥 FULL 27 COLUMNS VISIBILITY STATE 🔥
//   const [cols, setCols] = useState({
//     approvalNo: true,
//     requestDate: true,
//     requestedBy: true,
//     merchantId: true,
//     firmName: true,
//     billLocation: true,
//     shipLocation: true,
//     merchant: true,
//     asin: true,
//     modelName: true,
//     reqQty: true,
//     purchasePrice: true,
//     cnAmt: true,
//     agreedNlc: true,
//     linkUsed: true,
//     expectedDelivery: true,
//     placedQty: true,
//     orderNlc: true,
//     totalPlacedAmt: true,
//     totalCnAmt: true,
//     varianceQty: true,
//     placedBy: true,
//     paymentMethod: true,
//     sapPoNo: true,
//     status: true,
//     authBy: true,
//     actions: true,
//   });

//   const initialMasterState = {
//     request_date: new Date().toISOString().split("T")[0],
//     requested_by: "",
//     placed_by: "",
//     merchant_id: "",
//     firm: "",
//     bill_location: "",
//     ship_location: "",
//     merchant: "",
//   };
//   const [masterFormData, setMasterFormData] = useState(initialMasterState);

//   const initialItemState = {
//     product_model: "",
//     model_name_log: "",
//     model_no_log: "",
//     req_qty: "",
//     purchase_price_raw: "",
//     cn_amt_raw: "0",
//     link_used: "No",
//     placed_qty: "0",
//     order_nlc_raw: "0",
//     total_placed_amt_raw: "0",
//     total_cn_amt_raw: "0",
//     placed_by: "",
//     payment_method: "",
//     sap_po_no: "",
//     expected_delivery_date: new Date(
//       new Date().setDate(new Date().getDate() + 1),
//     )
//       .toISOString()
//       .split("T")[0],
//   };
//   const [itemsList, setItemsList] = useState([
//     { ...initialItemState, id: Date.now() },
//   ]);

//   useEffect(() => {
//     fetchApprovals();
//     fetchDropdowns();
//   }, []);

//   const fetchApprovals = async () => {
//     try {
//       const response = await api.get("reports/approvals/");
//       setApprovals(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const fetchDropdowns = async () => {
//     try {
//       const response = await api.get("reports/approvals/dropdown_data/");
//       setDropdowns(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleMasterChange = (e) =>
//     setMasterFormData({ ...masterFormData, [e.target.name]: e.target.value });
//   const handleFilterChange = (e) =>
//     setFilters({ ...filters, [e.target.name]: e.target.value });

//   const handleItemChange = (id, field, value) => {
//     const updatedItems = itemsList.map((item) => {
//       if (item.id === id) {
//         let updatedItem = { ...item, [field]: value };
//         if (field === "product_model") {
//           const selectedModel = dropdowns.models.find(
//             (m) => String(m.id) === String(value),
//           );
//           if (selectedModel) {
//             updatedItem.model_name_log = selectedModel.model_name;
//             updatedItem.model_no_log = selectedModel.model || "-";
//           } else {
//             updatedItem.model_name_log = "";
//             updatedItem.model_no_log = "";
//           }
//         }
//         return updatedItem;
//       }
//       return item;
//     });
//     setItemsList(updatedItems);
//   };

//   const addItemRow = () =>
//     setItemsList([...itemsList, { ...initialItemState, id: Date.now() }]);
//   const removeItemRow = (id) => {
//     if (itemsList.length > 1)
//       setItemsList(itemsList.filter((item) => item.id !== id));
//   };

//   const handleAddNew = () => {
//     setEditModeId(null);
//     setMasterFormData(initialMasterState);
//     setItemsList([{ ...initialItemState, id: Date.now() }]);
//     setIsFormModalOpen(true);
//   };

//   const handleEdit = (appId) => {
//     const appData = approvals.find((a) => a.id === appId);
//     if (!appData) return;

//     setEditModeId(appId);
//     setMasterFormData({
//       request_date: appData.request_date || "",
//       requested_by: appData.requested_by || "",
//       placed_by: appData.placed_by || "",
//       merchant_id: appData.merchant_account_id || "",
//       firm: appData.firm || "",
//       bill_location: appData.bill_location || "",
//       ship_location: appData.ship_location || "",
//       merchant: appData.merchant || "",
//     });

//     if (appData.items && appData.items.length > 0) {
//       const loadedItems = appData.items.map((item) => {
//         const matchedModel = dropdowns.models.find(
//           (m) => m.asin_fsn === item.asin_fsn,
//         );
//         return {
//           id: item.id || Date.now() + Math.random(),
//           product_model: matchedModel ? matchedModel.id : "",
//           model_name_log: item.model_name || "",
//           model_no_log: item.model_no || "",
//           req_qty: item.req_qty || "",
//           purchase_price_raw: item.purchase_price || "",
//           cn_amt_raw: item.cn_amt || "0",
//           link_used: item.link_used || "No",
//           expected_delivery_date: item.expected_delivery_date || "",

//           // 🔥 NAYE FIELDS KO FORM MEIN LOAD KARANE KE LIYE 🔥
//           placed_qty: item.placed_qty || "0",
//           order_nlc_raw: item.order_nlc || "0",
//           total_placed_amt_raw: item.total_placed_amt || "0",
//           total_cn_amt_raw: item.total_cn_amt || "0",
//           placed_by: item.placed_by || "",
//           payment_method: item.payment_method || "",
//           sap_po_no: item.sap_po_no || "",
//         };
//       });
//       setItemsList(loadedItems);
//     } else {
//       setItemsList([{ ...initialItemState, id: Date.now() }]);
//     }
//     setIsFormModalOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (
//       !masterFormData.firm ||
//       !masterFormData.merchant ||
//       !masterFormData.bill_location ||
//       !masterFormData.requested_by
//     ) {
//       return alert(
//         "Please fill all required Master fields including Requested By!",
//       );
//     }

//     try {
//       const cleanItems = itemsList.map((item, index) => {
//         if (!item.product_model)
//           throw new Error(`Item #${index + 1}: Please select an ASIN.`);
//         const selectedModel = dropdowns.models.find(
//           (m) => String(m.id) === String(item.product_model),
//         );

//         const reqQtyNum = parseInt(item.req_qty) || 0;
//         const pPrice = parseIndianNumber(item.purchase_price_raw);
//         const cnAmt = parseIndianNumber(item.cn_amt_raw);

//         const placedQtyNum = parseInt(item.placed_qty) || 0;
//         const orderNlcNum = parseIndianNumber(item.order_nlc_raw);
//         const totalPlacedAmtNum = parseIndianNumber(item.total_placed_amt_raw);
//         const totalCnAmtNum = parseIndianNumber(item.total_cn_amt_raw);

//         return {
//           asin_fsn: selectedModel ? selectedModel.asin_fsn : "",
//           model_name: item.model_name_log || "Unknown",
//           model_no: item.model_no_log || "-",
//           req_qty: reqQtyNum,
//           purchase_price: pPrice,
//           cn_amt: cnAmt,
//           agreed_nlc: reqQtyNum * pPrice - cnAmt,
//           link_used: item.link_used || "No",
//           expected_delivery_date: item.expected_delivery_date,

//           // 🔥 NAYE FIELDS AB DATABASE MEIN SAVE HONGE 🔥
//           placed_qty: placedQtyNum,
//           order_nlc: orderNlcNum,
//           total_placed_amt: totalPlacedAmtNum,
//           total_cn_amt: totalCnAmtNum,
//           variance_qty: placedQtyNum - reqQtyNum, // Automatically calculate ho jayega!
//           placed_by: item.placed_by || "",
//           payment_method: item.payment_method || "",
//           sap_po_no: item.sap_po_no || "",
//         };
//       });

//       const payload = {
//         ...masterFormData,
//         firm: parseInt(masterFormData.firm),
//         merchant: parseInt(masterFormData.merchant),
//         bill_location: parseInt(masterFormData.bill_location),
//         ship_location: parseInt(masterFormData.ship_location),
//         merchant_account_id: masterFormData.merchant_id || "N/A",
//         items: cleanItems,
//       };

//       setLoading(true);
//       if (editModeId) {
//         await api.put(`reports/approvals/${editModeId}/`, payload);
//         Swal.fire({
//           icon: "success",
//           title: "Request Updated Successfully!",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       } else {
//         await api.post("reports/approvals/", payload);
//         Swal.fire({
//           icon: "success",
//           title: "Request Generated Successfully!",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       }
//       setIsFormModalOpen(false);
//       fetchApprovals();
//     } catch (error) {
//       Swal.fire("Error", error.response?.data?.error || error.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAdminAction = async (id, actionType) => {
//     if (!window.confirm(`Confirm ${actionType}?`)) return;
//     try {
//       await api.post(`reports/approvals/${id}/${actionType}/`);
//       fetchApprovals();
//       Swal.fire({
//         icon: "success",
//         title: "Success!",
//         text: `Request ${actionType}d successfully.`,
//         timer: 1500,
//         showConfirmButton: false,
//       });
//     } catch (error) {
//       // 🔥 ASLI BACKEND ERROR FETCH KARNE KA TARIQA 🔥
//       const errorMsg = error.response?.data?.error || error.message;
//       Swal.fire({
//         icon: "error",
//         title: "Action Failed",
//         text: errorMsg,
//       });
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm(`DELETE this request completely?`)) return;
//     try {
//       await api.delete(`reports/approvals/${id}/`);
//       fetchApprovals();
//     } catch (error) {
//       alert("Failed: " + error.message);
//     }
//   };

//   const handleView = (id) => {
//     const data = approvals.find((a) => a.id === id);
//     setViewData(data);
//     setIsViewModalOpen(true);
//   };
//   // 🔥 NO-EMOJI WHATSAPP NOTIFICATION WITH ALL DETAILS 🔥
//   const handleWhatsAppNotify = async (app) => {
//     const { value: phone } = await Swal.fire({
//       title: "WhatsApp Notification",
//       input: "text",
//       inputLabel: "Enter Admin's WhatsApp Number (without +91)",
//       inputPlaceholder: "e.g. 9876543210",
//       showCancelButton: true,
//       confirmButtonText: "Send message",
//       confirmButtonColor: "#1677ff",
//       inputValidator: (value) => {
//         if (!value || value.length !== 10 || isNaN(value)) {
//           return "Please enter a valid 10-digit number!";
//         }
//       },
//     });

//     if (phone) {
//       const firmName = app.firm_detail?.name || "N/A";
//       const merchantName = app.merchant_detail?.name || "N/A";
//       const billLoc = app.bill_location_detail?.name || "N/A";
//       const shipLoc = app.ship_location_detail?.name || "N/A";

//       let message =
//         `New Approval Request\n\n` +
//         `Approval No: ${app.approval_no}\n` +
//         `Request Date: ${app.request_date}\n` +
//         `Requested By: ${app.requested_by}\n` +
//         `Merchant_ID: ${app.merchant_account_id || "-"}\n` +
//         `Firm Name: ${firmName}\n` +
//         `Bill Location: ${billLoc}\n` +
//         `Ship Location: ${shipLoc}\n` +
//         `Merchant: ${merchantName}\n\n` +
//         `--- Line Items ---\n\n`;

//       app.items?.forEach((item, index) => {
//         message +=
//           `[Item ${index + 1}]\n` +
//           `ASIN/FSN: ${item.asin_fsn || "-"}\n` +
//           `Model Name: ${item.model_name || "-"}\n` +
//           `Req Qty: ${item.req_qty || 0}\n` +
//           `Purchase/Unit Price: Rs. ${formatIndianNumber(item.purchase_price)}\n` +
//           `Cn Amt: Rs. ${formatIndianNumber(item.cn_amt)}\n` +
//           `Agreed NLC: Rs. ${formatIndianNumber(item.agreed_nlc)}\n` +
//           `Link Used: ${item.link_used || "-"}\n` +
//           `Expected Delivery: ${item.expected_delivery_date || "-"}\n` +
//           `Placed Qty: ${item.placed_qty || 0}\n` +
//           `Order NLC: Rs. ${formatIndianNumber(item.order_nlc)}\n` +
//           `Total Placed Amt: Rs. ${formatIndianNumber(item.total_placed_amt)}\n` +
//           `Total CN Amt: Rs. ${formatIndianNumber(item.total_cn_amt)}\n` +
//           `Variance Qty: ${item.variance_qty || 0}\n` +
//           `Placed By: ${item.placed_by || "-"}\n` +
//           `Payment Method: ${item.payment_method || "-"}\n` +
//           `SAP PO No: ${item.sap_po_no || "-"}\n\n`;
//       });

//       message +=
//         `Please review and approve this order:\n` +
//         `https://shreemaa-frontend.vercel.app/approvals`;

//       const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
//       window.open(whatsappUrl, "_blank");
//     }
//   };

//   const handleExportData = () => {
//     if (filteredApprovals.length === 0) return alert("No data to export!");
//     let csvContent =
//       "Approval No,Date,Requested By,Placed By,Firm,Platform,Status,Authorized By,ASIN/FSN,Model Name,Req Qty,Purchase Price,CN Amt,Agreed NLC,Expected Delivery\n";
//     filteredApprovals.forEach((app) => {
//       if (app.items && app.items.length > 0) {
//         app.items.forEach((item) => {
//           csvContent += `"${app.approval_no}","${app.request_date}","${app.requested_by}","${app.placed_by || "-"}","${app.firm_detail?.name || "-"}","${app.merchant_detail?.name || "-"}","${app.status}","${app.authorized_by || "-"}","${item.asin_fsn}","${item.model_name.replace(/"/g, '""')}","${item.req_qty}","${item.purchase_price}","${item.cn_amt}","${item.agreed_nlc}","${item.expected_delivery_date}"\n`;
//         });
//       } else {
//         csvContent += `"${app.approval_no}","${app.request_date}","${app.requested_by}","${app.placed_by || "-"}","${app.firm_detail?.name || "-"}","${app.merchant_detail?.name || "-"}","${app.status}","${app.authorized_by || "-"}",,,,,,\n`;
//       }
//     });
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = `Filtered_Approvals_${new Date().toISOString().split("T")[0]}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleDownloadTemplate = () => {
//     const csvContent =
//       "Request Date,Requested By,Placed By,Account ID,Firm ID,Merchant ID,Bill Location ID,Ship Location ID,ASIN/FSN,Req Qty,Purchase Price,CN Amt,Expected Delivery Date\n2026-07-10,Ramesh,Suresh,ID_123,1,1,1,1,B0GVYFM7QZ,100,15000,500,2026-07-15\n";
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = "Approval_Upload_Template.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const filteredApprovals = approvals.filter((app) => {
//     let match = true;
//     if (searchTerm) {
//       const s = searchTerm.toLowerCase().trim();
//       if (
//         !app.approval_no?.toLowerCase().includes(s) &&
//         !app.requested_by?.toLowerCase().includes(s)
//       )
//         match = false;
//     }
//     if (
//       filters.requested_by &&
//       !app.requested_by
//         ?.toLowerCase()
//         .includes(filters.requested_by.toLowerCase().trim())
//     )
//       match = false;
//     if (
//       filters.authorized_by &&
//       !app.authorized_by
//         ?.toLowerCase()
//         .includes(filters.authorized_by.toLowerCase().trim())
//     )
//       match = false;
//     if (filters.request_date && app.request_date !== filters.request_date)
//       match = false;
//     if (filters.firm && app.firm !== parseInt(filters.firm)) match = false;
//     if (filters.merchant && app.merchant !== parseInt(filters.merchant))
//       match = false;
//     return match;
//   });

//   // 🔥 100% SCREENSHOT 2 ENTERPRISE PDF RENDERER (FIXED) 🔥
//   // 🔥 100% SCREENSHOT 2 ENTERPRISE PDF RENDERER WITH STATUS 🔥
//   const generateApprovalPDF = (approval) => {
//     if (!approval) return;

//     const doc = new jsPDF("p", "pt", "a4");
//     const firstItem =
//       approval.items && approval.items.length > 0 ? approval.items[0] : {};

//     // 1. HEADER (Dark Green Box)
//     doc.setFillColor(21, 71, 52); // Dark Green
//     doc.rect(40, 40, 515, 60, "F");

//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(16);
//     doc.setFont("helvetica", "bold");
//     doc.text("Procurement Approval Letter", 55, 65);

//     doc.setFontSize(9);
//     doc.setFont("helvetica", "normal");
//     doc.text("SHRI MAA MARKETING PRIVATE LIMITED", 55, 85);

//     // 2. APPROVAL DETAILS (Two Columns)
//     doc.setTextColor(0, 0, 0);
//     doc.setFontSize(10);

//     // Column 1
//     doc.setFont("helvetica", "bold");
//     doc.text("Approval No:", 40, 140);
//     doc.setFont("helvetica", "normal");
//     doc.text(approval.approval_no || "-", 170, 140);

//     doc.setFont("helvetica", "bold");
//     doc.text("Approval Date:", 40, 160);
//     doc.setFont("helvetica", "normal");
//     doc.text(approval.request_date || "-", 170, 160);

//     doc.setFont("helvetica", "bold");
//     doc.text("Expected Delivery Date:", 40, 180);
//     doc.setFont("helvetica", "normal");
//     doc.text(firstItem.expected_delivery_date || "-", 170, 180);

//     doc.setFont("helvetica", "bold");
//     doc.text("Platform Name:", 40, 200);
//     doc.setFont("helvetica", "normal");
//     doc.text(approval.merchant_detail?.name || "-", 170, 200);

//     doc.setFont("helvetica", "bold");
//     doc.text("Account ID:", 40, 220);
//     doc.setFont("helvetica", "normal");
//     doc.text(approval.merchant_account_id || "-", 170, 220);

//     // Column 2
//     doc.setFont("helvetica", "bold");
//     doc.text("Order Requested By:", 300, 140);
//     doc.setFont("helvetica", "normal");
//     doc.text(approval.requested_by || "-", 410, 140);

//     doc.setFont("helvetica", "bold");
//     doc.text("Order Placed By:", 300, 160);
//     doc.setFont("helvetica", "normal");
//     doc.text(approval.placed_by || "-", 410, 160);

//     doc.setFont("helvetica", "bold");
//     doc.text("Payment Type:", 300, 180);
//     doc.setFont("helvetica", "normal");
//     doc.text(firstItem.payment_method || "-", 410, 180);

//     doc.setFont("helvetica", "bold");
//     doc.text("Link Used:", 300, 200);
//     doc.setFont("helvetica", "normal");
//     doc.text(firstItem.link_used || "-", 410, 200);

//     doc.setFont("helvetica", "bold");
//     doc.text("SAP PO Number:", 300, 220);
//     doc.setFont("helvetica", "normal");
//     doc.text(firstItem.sap_po_no || "-", 410, 220);

//     // 🔥 NAYA: STATUS ADD KIYA HAI PDF MEIN 🔥
//     doc.setFont("helvetica", "bold");
//     doc.text("Approval Status:", 300, 240);
//     const currentStatus = approval.status || "Pending";
//     if (currentStatus === "Approved")
//       doc.setTextColor(34, 197, 94); // Green
//     else if (currentStatus === "Rejected")
//       doc.setTextColor(239, 68, 68); // Red
//     else doc.setTextColor(245, 158, 11); // Amber
//     doc.text(currentStatus.toUpperCase(), 410, 240);
//     doc.setTextColor(0, 0, 0); // reset color to black

//     // 3. PRODUCT DETAILS SECTION TITLE (Thoda neeche shift kiya)
//     doc.setDrawColor(220, 100, 0); // Orange line
//     doc.setLineWidth(2);
//     doc.line(40, 265, 60, 265);
//     doc.setTextColor(0, 0, 0);
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(12);
//     doc.text("Product Details", 65, 270);

//     // 4. PRODUCT TABLE
//     const tableBody = (approval.items || []).map((item) => [
//       item.asin_fsn || "-",
//       item.model_name || "-",
//       item.req_qty || "0",
//       formatIndianNumber(item.purchase_price),
//       formatIndianNumber(item.cn_amt),
//       formatIndianNumber(item.agreed_nlc),
//       item.placed_qty || "0",
//       formatIndianNumber(item.order_nlc),
//       formatIndianNumber(item.total_placed_amt),
//     ]);

//     let totalReq = 0;
//     let totalPlaced = 0;
//     let totalCost = 0;

//     (approval.items || []).forEach((item) => {
//       totalReq += item.req_qty || 0;
//       totalPlaced += item.placed_qty || 0;
//       totalCost += parseFloat(item.total_placed_amt || 0);
//     });

//     autoTable(doc, {
//       startY: 285, // Table ko neeche shift kiya
//       head: [
//         [
//           "ASIN/FSN",
//           "Model",
//           "Req.\nQty",
//           "Purchase\nPrice",
//           "CN",
//           "Agreed\nNLC",
//           "Placed\nQty",
//           "Order\nNLC",
//           "Total\nCost",
//         ],
//       ],
//       body: tableBody,
//       headStyles: {
//         fillColor: [21, 71, 52],
//         textColor: [255, 255, 255],
//         fontStyle: "bold",
//         halign: "center",
//       },
//       styles: {
//         fontSize: 8,
//         cellPadding: 4,
//         halign: "center",
//         valign: "middle",
//       },
//       columnStyles: {
//         1: { halign: "left", cellWidth: 100 }, // Model Name left aligned
//       },
//       theme: "grid",
//     });

//     // 5. SUMMARY BOX
//     let finalY = doc.lastAutoTable.finalY + 20;
//     doc.setDrawColor(220, 220, 220);
//     doc.setLineWidth(1);
//     doc.setFillColor(250, 250, 250);
//     doc.roundedRect(40, finalY, 515, 90, 5, 5, "FD"); // Background rounded box

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(9);
//     doc.text("Total Req Qty", 60, finalY + 25);
//     doc.setFont("helvetica", "normal");
//     doc.text(String(totalReq), 160, finalY + 25);

//     doc.setFont("helvetica", "bold");
//     doc.text("Total Placed Qty", 60, finalY + 45);
//     doc.setFont("helvetica", "normal");
//     doc.setTextColor(34, 197, 94); // Green text
//     doc.text(String(totalPlaced), 160, finalY + 45);
//     doc.setTextColor(0, 0, 0);

//     doc.setFont("helvetica", "bold");
//     doc.text("Total Cost", 60, finalY + 65);
//     doc.setTextColor(34, 197, 94); // Green cost
//     doc.setFont("helvetica", "bold");
//     doc.text(`Rs. ${formatIndianNumber(totalCost)}`, 160, finalY + 65);
//     doc.setTextColor(0, 0, 0);

//     doc.setFont("helvetica", "bold");
//     doc.text("Variance Remark", 60, finalY + 85);
//     doc.setFont("helvetica", "normal");
//     doc.text("—", 160, finalY + 85);

//     // 6. APPROVED BY SIGNATURE
//     finalY += 130;
//     doc.setFont("helvetica", "bold");
//     doc.text("Approved by", 40, finalY);

//     doc.setFont("helvetica", "normal");
//     doc.text("Name", 200, finalY);
//     doc.text(approval.authorized_by || "Admin", 300, finalY);

//     doc.text("Date & Time", 200, finalY + 20);
//     doc.text(new Date().toLocaleString(), 300, finalY + 20);

//     // FOOTER
//     doc.setFontSize(7);
//     doc.setTextColor(150, 150, 150);
//     doc.text(
//       `This document was generated automatically on ${new Date().toLocaleString()} upon approval.`,
//       40,
//       800,
//     );

//     // Save PDF
//     doc.save(`${approval.approval_no || "Approval_Letter"}.pdf`);
//   };

//   const renderStatusBadge = (status) => {
//     if (status === "Approved")
//       return (
//         <span className="px-2.5 py-1 bg-green-50 text-[#52c41a] font-bold rounded-md text-[10px] border border-green-100 uppercase tracking-widest">
//           Approved
//         </span>
//       );
//     if (status === "Rejected")
//       return (
//         <span className="px-2.5 py-1 bg-red-50 text-[#ff4d4f] font-bold rounded-md text-[10px] border border-red-100 uppercase tracking-widest">
//           Rejected
//         </span>
//       );
//     return (
//       <span className="px-2.5 py-1 bg-amber-50 text-amber-600 font-bold rounded-md text-[10px] border border-amber-200 uppercase tracking-widest">
//         Pending
//       </span>
//     );
//   };

//   return (
//     <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-300 pb-10">
//       {/* --- HEADER --- */}
//       <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
//         <div>
//           <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
//             Modules / <span className="text-slate-600">Approvals</span>
//           </p>
//           <h1 className="text-[20px] font-bold text-slate-800 tracking-tight">
//             Approval Management
//           </h1>
//         </div>
//       </div>

//       {/* --- MAIN CARD --- */}
//       <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden flex flex-col">
//         {/* CARD TOOLBAR */}
//         <div className="flex flex-col md:flex-row justify-between items-center px-6 py-5 border-b border-gray-50 gap-4 bg-white">
//           <div className="flex items-center gap-3 w-full md:w-auto">
//             <div className="flex items-center bg-gray-50/80 px-4 py-2.5 rounded-full w-full md:w-[300px] border border-gray-100 focus-within:bg-white focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
//               <IconSearch />
//               <input
//                 type="text"
//                 placeholder="Search orders..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="bg-transparent border-none outline-none ml-2 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   className="text-gray-400 hover:text-gray-600 outline-none ml-2"
//                 >
//                   <i className="fas fa-times-circle"></i>
//                 </button>
//               )}
//             </div>

//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-[13px] font-bold transition-colors shadow-sm ${showFilters ? "bg-blue-50 border-blue-200 text-[#1677ff]" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
//             >
//               <IconFilter /> Filter
//             </button>
//           </div>

//           <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto [&::-webkit-scrollbar]:hidden">
//             <button
//               onClick={() => setIsColumnModalOpen(true)}
//               className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-500 rounded-[10px] text-[12px] font-bold hover:bg-gray-50 hover:text-[#1677ff] transition shadow-sm"
//             >
//               <IconColumns /> View Headers
//             </button>

//             <div className="flex items-center gap-2 bg-white p-1.5 rounded-[12px] border border-gray-200 shadow-sm">
//               <button
//                 onClick={handleDownloadTemplate}
//                 title="Download Template"
//                 className="flex items-center justify-center px-3 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-[#1677ff] transition font-bold text-[11px]"
//               >
//                 Template
//               </button>
//               <button
//                 onClick={handleExportData}
//                 title="Export Database"
//                 className="flex items-center justify-center w-8 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition"
//               >
//                 <IconDownload />
//               </button>
//             </div>

//             <button
//               onClick={handleAddNew}
//               className="flex items-center gap-2 px-5 py-2.5 bg-[#e67e22] hover:bg-blue-600 text-white rounded-[10px] transition font-bold text-[13px] shadow-md shadow-blue-500/20 whitespace-nowrap"
//             >
//               <IconPlus /> New Approval
//             </button>
//           </div>
//         </div>

//         {/* EXPANDABLE FILTERS */}
//         {showFilters && (
//           <div className="px-6 py-4 bg-[#fafafa] border-b border-gray-100">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
//               <div>
//                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                   Date
//                 </label>
//                 <input
//                   type="date"
//                   name="request_date"
//                   value={filters.request_date}
//                   onChange={handleFilterChange}
//                   className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#1677ff]"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                   Requested By
//                 </label>
//                 <input
//                   type="text"
//                   name="requested_by"
//                   placeholder="Type name..."
//                   value={filters.requested_by}
//                   onChange={handleFilterChange}
//                   className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#1677ff]"
//                 />
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                   Firm
//                 </label>
//                 <select
//                   name="firm"
//                   value={filters.firm}
//                   onChange={handleFilterChange}
//                   className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#1677ff]"
//                 >
//                   <option value="">All Firms</option>
//                   {dropdowns.firms.map((f) => (
//                     <option key={f.id} value={f.id}>
//                       {f.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                   Platform
//                 </label>
//                 <select
//                   name="merchant"
//                   value={filters.merchant}
//                   onChange={handleFilterChange}
//                   className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#1677ff]"
//                 >
//                   <option value="">All Platforms</option>
//                   {dropdowns.merchants.map((m) => (
//                     <option key={m.id} value={m.id}>
//                       {m.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                   Authorized By
//                 </label>
//                 <input
//                   type="text"
//                   name="authorized_by"
//                   placeholder="Admin name..."
//                   value={filters.authorized_by}
//                   onChange={handleFilterChange}
//                   className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#1677ff]"
//                 />
//               </div>
//               <button
//                 onClick={() =>
//                   setFilters({
//                     requested_by: "",
//                     authorized_by: "",
//                     merchant: "",
//                     firm: "",
//                     location: "",
//                     request_date: "",
//                   })
//                 }
//                 className="w-full p-2.5 bg-white border border-gray-200 text-gray-500 text-[12px] font-bold uppercase tracking-widest rounded-lg hover:bg-gray-50 transition"
//               >
//                 Clear All
//               </button>
//             </div>
//           </div>
//         )}

//         {/* 🔥 MAIN DATA TABLE WITH ALL 27 COLUMNS 🔥 */}
//         <div className="overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[450px]">
//           <table className="w-full text-left min-w-max border-collapse">
//             <thead className="bg-gray-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest sticky top-0 backdrop-blur-md z-10">
//               <tr>
//                 {cols.approvalNo && (
//                   <th className="p-4 pl-6 whitespace-nowrap bg-gray-50/80">
//                     Approval No
//                   </th>
//                 )}
//                 {cols.requestDate && (
//                   <th className="p-4 whitespace-nowrap bg-gray-50/80">
//                     Request Date
//                   </th>
//                 )}
//                 {cols.requestedBy && (
//                   <th className="p-4 whitespace-nowrap bg-gray-50/80">
//                     Requested By
//                   </th>
//                 )}
//                 {cols.merchantId && (
//                   <th className="p-4 whitespace-nowrap bg-gray-50/80">
//                     Merchant_ID
//                   </th>
//                 )}
//                 {cols.firmName && (
//                   <th className="p-4 whitespace-nowrap bg-gray-50/80">
//                     Firm Name
//                   </th>
//                 )}
//                 {cols.billLocation && (
//                   <th className="p-4 whitespace-nowrap bg-gray-50/80">
//                     Bill Location
//                   </th>
//                 )}
//                 {cols.shipLocation && (
//                   <th className="p-4 whitespace-nowrap bg-gray-50/80">
//                     Ship Location
//                   </th>
//                 )}
//                 {cols.merchant && (
//                   <th className="p-4 whitespace-nowrap bg-gray-50/80">
//                     Merchant
//                   </th>
//                 )}
//                 {cols.asin && (
//                   <th className="p-4 whitespace-nowrap bg-gray-50/80">
//                     ASIN/FSN
//                   </th>
//                 )}
//                 {cols.modelName && (
//                   <th className="p-4 whitespace-nowrap min-w-[200px] bg-gray-50/80">
//                     Model Name
//                   </th>
//                 )}
//                 {cols.reqQty && (
//                   <th className="p-4 text-center whitespace-nowrap bg-gray-50/80">
//                     Req Qty
//                   </th>
//                 )}
//                 {cols.purchasePrice && (
//                   <th className="p-4 text-right whitespace-nowrap bg-gray-50/80">
//                     Purchase Price
//                   </th>
//                 )}
//                 {cols.cnAmt && (
//                   <th className="p-4 text-right whitespace-nowrap bg-gray-50/80">
//                     Cn Amt
//                   </th>
//                 )}
//                 {cols.agreedNlc && (
//                   <th className="p-4 text-right whitespace-nowrap bg-gray-50/80">
//                     Agreed NLC
//                   </th>
//                 )}
//                 {cols.linkUsed && (
//                   <th className="p-4 text-center whitespace-nowrap bg-gray-50/80">
//                     Link Used
//                   </th>
//                 )}
//                 {cols.expectedDelivery && (
//                   <th className="p-4 whitespace-nowrap bg-gray-50/80">
//                     Expected Delivery
//                   </th>
//                 )}
//                 {cols.placedQty && (
//                   <th className="p-4 text-center whitespace-nowrap bg-gray-50/80">
//                     Placed Qty
//                   </th>
//                 )}
//                 {cols.orderNlc && (
//                   <th className="p-4 text-right whitespace-nowrap bg-gray-50/80">
//                     Order NLC
//                   </th>
//                 )}
//                 {cols.totalPlacedAmt && (
//                   <th className="p-4 text-right whitespace-nowrap bg-gray-50/80">
//                     Total Placed Amt
//                   </th>
//                 )}
//                 {cols.totalCnAmt && (
//                   <th className="p-4 text-right whitespace-nowrap bg-gray-50/80">
//                     Total CN Amt
//                   </th>
//                 )}
//                 {cols.varianceQty && (
//                   <th className="p-4 text-center whitespace-nowrap bg-gray-50/80">
//                     Variance Qty
//                   </th>
//                 )}
//                 {cols.placedBy && (
//                   <th className="p-4 whitespace-nowrap bg-gray-50/80">
//                     Placed By
//                   </th>
//                 )}
//                 {cols.paymentMethod && (
//                   <th className="p-4 whitespace-nowrap bg-gray-50/80">
//                     Payment Method
//                   </th>
//                 )}
//                 {cols.sapPoNo && (
//                   <th className="p-4 whitespace-nowrap bg-gray-50/80">
//                     SAP PO No
//                   </th>
//                 )}
//                 {cols.status && (
//                   <th className="p-4 text-center whitespace-nowrap bg-gray-50/80">
//                     Status
//                   </th>
//                 )}
//                 {cols.authBy && (
//                   <th className="p-4 whitespace-nowrap bg-gray-50/80">
//                     Authorized By
//                   </th>
//                 )}
//                 {cols.actions && (
//                   <th className="p-4 text-right pr-6 sticky right-0 bg-gray-50/90 border-l border-gray-100 z-20">
//                     Action
//                   </th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="text-[13px] font-medium text-slate-700 bg-white">
//               {filteredApprovals.length === 0 ? (
//                 <tr>
//                   <td colSpan="27" className="p-16 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
//                         <i className="fas fa-inbox text-2xl text-gray-300"></i>
//                       </div>
//                       <p className="font-bold text-slate-600">
//                         No Records Found
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredApprovals.flatMap((app) =>
//                   (app.items && app.items.length > 0
//                     ? app.items
//                     : [{ id: "empty" }]
//                   ).map((item) => (
//                     <tr
//                       key={`${app.id}-${item.id}`}
//                       className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors group"
//                     >
//                       {cols.approvalNo && (
//                         <td className="p-4 pl-6 font-mono font-bold text-[#e67e22] whitespace-nowrap">
//                           {app.approval_no}
//                         </td>
//                       )}
//                       {cols.requestDate && (
//                         <td className="p-4 text-gray-500 whitespace-nowrap">
//                           {app.request_date}
//                         </td>
//                       )}
//                       {cols.requestedBy && (
//                         <td className="p-4 font-semibold text-slate-800 whitespace-nowrap">
//                           {app.requested_by}
//                         </td>
//                       )}
//                       {cols.merchantId && (
//                         <td className="p-4 text-gray-500 font-mono whitespace-nowrap">
//                           {app.merchant_account_id || "—"}
//                         </td>
//                       )}
//                       {cols.firmName && (
//                         <td className="p-4 text-slate-700 whitespace-nowrap">
//                           {app.firm_detail?.name || "—"}
//                         </td>
//                       )}
//                       {cols.billLocation && (
//                         <td className="p-4 text-gray-500 whitespace-nowrap">
//                           {app.bill_location_detail?.name || "—"}
//                         </td>
//                       )}
//                       {cols.shipLocation && (
//                         <td className="p-4 text-gray-500 whitespace-nowrap">
//                           {app.ship_location_detail?.name || "—"}
//                         </td>
//                       )}
//                       {cols.merchant && (
//                         <td className="p-4 text-slate-700 whitespace-nowrap">
//                           {app.merchant_detail?.name || "—"}
//                         </td>
//                       )}

//                       {cols.asin && (
//                         <td className="p-4 font-mono font-bold text-slate-600">
//                           {item.id !== "empty" ? item.asin_fsn : "—"}
//                         </td>
//                       )}
//                       {cols.modelName && (
//                         <td
//                           className="p-4 text-slate-700 max-w-[200px] truncate"
//                           title={item.model_name}
//                         >
//                           {item.id !== "empty" ? item.model_name : "—"}
//                         </td>
//                       )}
//                       {cols.reqQty && (
//                         <td className="p-4 text-center font-bold text-slate-800">
//                           {item.id !== "empty" ? item.req_qty : "—"}
//                         </td>
//                       )}
//                       {cols.purchasePrice && (
//                         <td className="p-4 text-right text-slate-700">
//                           ₹
//                           {item.id !== "empty"
//                             ? formatIndianNumber(item.purchase_price)
//                             : "—"}
//                         </td>
//                       )}
//                       {cols.cnAmt && (
//                         <td className="p-4 text-right text-red-500 font-semibold">
//                           ₹
//                           {item.id !== "empty"
//                             ? formatIndianNumber(item.cn_amt)
//                             : "—"}
//                         </td>
//                       )}
//                       {cols.agreedNlc && (
//                         <td className="p-4 text-right text-green-600 font-bold">
//                           ₹
//                           {item.id !== "empty"
//                             ? formatIndianNumber(item.agreed_nlc)
//                             : "—"}
//                         </td>
//                       )}
//                       {cols.linkUsed && (
//                         <td className="p-4 text-center text-gray-500">
//                           {item.id !== "empty" ? item.link_used : "—"}
//                         </td>
//                       )}
//                       {cols.expectedDelivery && (
//                         <td className="p-4 text-gray-500 whitespace-nowrap">
//                           {item.id !== "empty"
//                             ? item.expected_delivery_date
//                             : "—"}
//                         </td>
//                       )}

//                       {cols.placedQty && (
//                         <td className="p-4 text-center font-bold text-slate-800">
//                           {item.id !== "empty" ? item.placed_qty || "0" : "—"}
//                         </td>
//                       )}
//                       {cols.orderNlc && (
//                         <td className="p-4 text-right text-slate-700">
//                           ₹
//                           {item.id !== "empty"
//                             ? formatIndianNumber(item.order_nlc)
//                             : "—"}
//                         </td>
//                       )}
//                       {cols.totalPlacedAmt && (
//                         <td className="p-4 text-right font-bold text-slate-800">
//                           ₹
//                           {item.id !== "empty"
//                             ? formatIndianNumber(item.total_placed_amt)
//                             : "—"}
//                         </td>
//                       )}
//                       {cols.totalCnAmt && (
//                         <td className="p-4 text-right text-red-500">
//                           ₹
//                           {item.id !== "empty"
//                             ? formatIndianNumber(item.total_cn_amt)
//                             : "—"}
//                         </td>
//                       )}

//                       {cols.varianceQty && (
//                         <td className="p-4 text-center font-bold">
//                           {item.id !== "empty" ? (
//                             <span
//                               className={
//                                 item.variance_qty < 0
//                                   ? "text-red-500"
//                                   : item.variance_qty > 0
//                                     ? "text-green-500"
//                                     : "text-slate-500"
//                               }
//                             >
//                               {item.variance_qty || "0"}
//                             </span>
//                           ) : (
//                             "—"
//                           )}
//                         </td>
//                       )}

//                       {cols.placedBy && (
//                         <td className="p-4 text-slate-700 whitespace-nowrap">
//                           {item.id !== "empty" ? item.placed_by || "—" : "—"}
//                         </td>
//                       )}
//                       {cols.paymentMethod && (
//                         <td className="p-4 text-slate-500 whitespace-nowrap">
//                           {item.id !== "empty"
//                             ? item.payment_method || "—"
//                             : "—"}
//                         </td>
//                       )}
//                       {cols.sapPoNo && (
//                         <td className="p-4 font-mono text-slate-500 whitespace-nowrap">
//                           {item.id !== "empty" ? item.sap_po_no || "—" : "—"}
//                         </td>
//                       )}

//                       {cols.status && (
//                         <td className="p-4 text-center whitespace-nowrap">
//                           {renderStatusBadge(app.status)}
//                         </td>
//                       )}
//                       {cols.authBy && (
//                         <td className="p-4 text-gray-500 whitespace-nowrap">
//                           {app.authorized_by || "—"}
//                         </td>
//                       )}

//                       {/* 🔥 ACTION COLUMN STRICT LOGIC 🔥 */}
//                       {cols.actions && (
//                         <td className="p-4 text-right pr-6 sticky right-0 bg-white group-hover:bg-blue-50/10 transition-colors z-10 whitespace-nowrap border-l border-gray-100">
//                           <div className="flex justify-end items-center gap-2">
//                             {/* 1. VIEW BUTTON (Sabko dikhega) */}
//                             <button
//                               onClick={() => handleView(app.id)}
//                               title="View Detail"
//                               className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 hover:text-slate-800 hover:bg-slate-100 shadow-sm flex items-center justify-center transition"
//                             >
//                               <i className="fas fa-eye text-[12px]"></i>
//                             </button>

//                             {/* 2. PDF DOWNLOAD (Sabko dikhega) */}
//                             <button
//                               onClick={() => generateApprovalPDF(app)}
//                               title="Download PDF"
//                               className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:text-white hover:bg-red-500 shadow-sm flex items-center justify-center transition"
//                             >
//                               <IconPDF />
//                             </button>

//                             {/* 3. EDIT BUTTON (Jisne banaya hai ya Admin, par sirf PENDING status mein) */}
//                             {(role === "ADMIN" ||
//                               username?.toLowerCase() ===
//                                 app.requested_by?.toLowerCase() ||
//                               username?.toLowerCase() ===
//                                 app.placed_by?.toLowerCase()) &&
//                               app.status === "Pending" && (
//                                 <button
//                                   onClick={() => handleEdit(app.id)}
//                                   title="Edit Record"
//                                   className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#1677ff] hover:border-blue-200 shadow-sm flex items-center justify-center transition"
//                                 >
//                                   <i className="fas fa-pen text-[12px]"></i>
//                                 </button>
//                               )}
//                             {/* WhatsApp Notification Button */}
//                             <button
//                               onClick={() => handleWhatsAppNotify(app)}
//                               title="Notify via WhatsApp"
//                               className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 text-[#25D366] hover:text-white hover:bg-[#25D366] shadow-sm flex items-center justify-center transition"
//                             >
//                               <IconWhatsApp />
//                             </button>

//                             {/* 4. ADMIN-ONLY SUPER POWERS (Approve, Reject, Delete) */}
//                             {role === "ADMIN" && (
//                               <>
//                                 {app.status === "Pending" && (
//                                   <>
//                                     <button
//                                       onClick={() =>
//                                         handleAdminAction(app.id, "approve")
//                                       }
//                                       title="Approve Request"
//                                       className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#52c41a] hover:border-green-200 shadow-sm flex items-center justify-center transition"
//                                     >
//                                       <i className="fas fa-check text-[14px]"></i>
//                                     </button>
//                                     <button
//                                       onClick={() =>
//                                         handleAdminAction(app.id, "reject")
//                                       }
//                                       title="Reject Request"
//                                       className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#ff4d4f] hover:border-red-200 shadow-sm flex items-center justify-center transition"
//                                     >
//                                       <i className="fas fa-times text-[14px]"></i>
//                                     </button>
//                                   </>
//                                 )}

//                                 <button
//                                   onClick={() => handleDelete(app.id)}
//                                   title="Delete Record"
//                                   className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#ff4d4f] hover:bg-red-50 shadow-sm flex items-center justify-center transition"
//                                 >
//                                   <i className="fas fa-trash-alt text-[12px]"></i>
//                                 </button>
//                               </>
//                             )}
//                           </div>
//                         </td>
//                       )}
//                     </tr>
//                   )),
//                 )
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* 🔥 VIEW MODAL 🔥 */}
//       {isViewModalOpen && viewData && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
//             <div className="p-8 pb-6 flex justify-between items-start border-b border-gray-100">
//               <div>
//                 <h2 className="text-2xl font-bold text-slate-800">
//                   {viewData.approval_no}
//                 </h2>
//                 <div className="mt-2">{renderStatusBadge(viewData.status)}</div>
//               </div>
//               <button
//                 onClick={() => setIsViewModalOpen(false)}
//                 className="text-gray-400 hover:text-slate-800 transition"
//               >
//                 <i className="fas fa-times text-xl"></i>
//               </button>
//             </div>

//             <div className="p-8 overflow-y-auto custom-scrollbar bg-white">
//               {/* Top Details Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-[#f8f9fa] rounded-2xl border border-gray-100 mb-8">
//                 <div>
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                     Request Date
//                   </p>
//                   <p className="font-bold text-[14px] text-slate-800 mt-1">
//                     {viewData.request_date}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                     Requested By
//                   </p>
//                   <p className="font-bold text-[14px] text-slate-800 mt-1">
//                     {viewData.requested_by}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                     Merchant_ID
//                   </p>
//                   <p className="font-bold text-[14px] text-slate-800 mt-1">
//                     {viewData.merchant_account_id || "—"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                     Firm Name
//                   </p>
//                   <p className="font-bold text-[14px] text-slate-800 mt-1">
//                     {viewData.firm_detail?.name || "—"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                     Merchant
//                   </p>
//                   <p className="font-bold text-[14px] text-slate-800 mt-1">
//                     {viewData.merchant_detail?.name || "—"}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                     Bill / Ship Location
//                   </p>
//                   <p className="font-bold text-[14px] text-slate-800 mt-1">
//                     {viewData.bill_location_detail?.name || "—"} /{" "}
//                     {viewData.ship_location_detail?.name || "—"}
//                   </p>
//                 </div>
//               </div>

//               <h3 className="text-[15px] font-bold text-slate-800 mb-4">
//                 Model requested
//               </h3>
//               <div className="space-y-4">
//                 {viewData.items.map((item, idx) => (
//                   <div
//                     key={idx}
//                     className="border border-gray-200 rounded-2xl p-6 relative"
//                   >
//                     <div className="flex justify-between items-start mb-6">
//                       <div>
//                         <h4 className="font-bold text-slate-800 text-[15px]">
//                           {item.model_name}
//                         </h4>
//                         <p className="text-xs font-mono font-bold text-gray-500 mt-1">
//                           {item.asin_fsn}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                           Purchase Price
//                         </p>
//                         <p className="font-black text-slate-800 mt-1">
//                           Rs. {item.purchase_price}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-4 gap-4">
//                       <div>
//                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                           Req Qty
//                         </p>
//                         <p className="font-bold text-slate-800 mt-1">
//                           {item.req_qty || "0"}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                           Placed Qty
//                         </p>
//                         <p className="font-bold text-slate-800 mt-1">
//                           {item.placed_qty || 0}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
//                           Variance
//                         </p>
//                         <p className="font-bold text-green-600 mt-1">
//                           {item.variance_qty || 0}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
//                           Placed Amt
//                         </p>
//                         <p className="font-bold text-slate-800 mt-1">
//                           Rs. {item.total_placed_amt || 0}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-6 bg-[#f8f9fa] border border-gray-200 rounded-xl p-5 flex justify-between items-center">
//                 <span className="font-bold text-slate-800">Total</span>
//                 <span className="font-bold text-slate-800">
//                   Req{" "}
//                   {viewData.items.reduce(
//                     (acc, curr) => acc + (curr.req_qty || 0),
//                     0,
//                   )}{" "}
//                   · Placed{" "}
//                   {viewData.items.reduce(
//                     (acc, curr) => acc + (curr.placed_qty || 0),
//                     0,
//                   )}{" "}
//                   · Rs.{" "}
//                   {viewData.items.reduce(
//                     (acc, curr) => acc + (curr.total_placed_amt || 0),
//                     0,
//                   )}
//                 </span>
//               </div>
//             </div>

//             <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-2xl">
//               {/* 🔥 CORRECT PDF BUTTON FUNCTION CALL IN VIEW MODAL 🔥 */}
//               <button
//                 onClick={() => generateApprovalPDF(viewData)}
//                 className="px-6 py-2.5 bg-white border border-gray-300 text-slate-700 font-bold rounded-lg hover:bg-gray-50 transition shadow-sm flex items-center gap-2"
//               >
//                 <IconDownload /> Download PDF
//               </button>
//               <button
//                 onClick={() => setIsViewModalOpen(false)}
//                 className="px-8 py-2.5 bg-[#1677ff] text-white font-bold rounded-lg hover:bg-blue-600 transition shadow-md shadow-blue-500/20"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🔥 CREATE / EDIT FORM MODAL 🔥 */}
//       {isFormModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
//             <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
//               <div>
//                 <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">
//                   {editModeId
//                     ? `Edit Approval Request`
//                     : "New Approval Request"}
//                 </h3>
//                 <p className="text-[12px] text-gray-400 font-medium mt-0.5">
//                   Fill in the required fields to generate a request.
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsFormModalOpen(false)}
//                 className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times text-sm"></i>
//               </button>
//             </div>

//             <div className="p-8 overflow-y-auto custom-scrollbar bg-[#f0f2f5]/40">
//               <form
//                 id="approvalForm"
//                 onSubmit={handleSubmit}
//                 className="space-y-6"
//               >
//                 <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
//                   <i className="fas fa-info-circle text-[#1677ff]"></i> Master
//                   Properties
//                 </h4>

//                 <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-5">
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Request Date *
//                     </label>
//                     <input
//                       type="date"
//                       required
//                       name="request_date"
//                       value={masterFormData.request_date}
//                       onChange={handleMasterChange}
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Requested By *
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       name="requested_by"
//                       value={masterFormData.requested_by}
//                       onChange={handleMasterChange}
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Placed By
//                     </label>
//                     <input
//                       type="text"
//                       name="placed_by"
//                       value={masterFormData.placed_by}
//                       onChange={handleMasterChange}
//                       placeholder="e.g. Aman"
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Account ID
//                     </label>
//                     <input
//                       type="text"
//                       name="merchant_id"
//                       value={masterFormData.merchant_id}
//                       onChange={handleMasterChange}
//                       placeholder="e.g. ID_9011"
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Firm *
//                     </label>
//                     <select
//                       required
//                       name="firm"
//                       value={masterFormData.firm}
//                       onChange={handleMasterChange}
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                     >
//                       <option value="">-- Select --</option>
//                       {dropdowns.firms.map((f) => (
//                         <option key={f.id} value={f.id}>
//                           {f.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Platform *
//                     </label>
//                     <select
//                       required
//                       name="merchant"
//                       value={masterFormData.merchant}
//                       onChange={handleMasterChange}
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                     >
//                       <option value="">-- Select --</option>
//                       {dropdowns.merchants.map((m) => (
//                         <option key={m.id} value={m.id}>
//                           {m.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Bill Location *
//                     </label>
//                     <select
//                       required
//                       name="bill_location"
//                       value={masterFormData.bill_location}
//                       onChange={handleMasterChange}
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                     >
//                       <option value="">-- Select --</option>
//                       {dropdowns.locations.map((l) => (
//                         <option key={l.id} value={l.id}>
//                           {l.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="col-span-1 md:col-span-2">
//                     <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                       Ship Location *
//                     </label>
//                     <select
//                       required
//                       name="ship_location"
//                       value={masterFormData.ship_location}
//                       onChange={handleMasterChange}
//                       className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                     >
//                       <option value="">-- Select --</option>
//                       {dropdowns.locations.map((l) => (
//                         <option key={l.id} value={l.id}>
//                           {l.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="space-y-4 mt-8">
//                   <div className="flex justify-between items-center">
//                     <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
//                       <i className="fas fa-box-open text-[#1677ff]"></i> Line
//                       Items
//                     </h4>
//                     <button
//                       type="button"
//                       onClick={addItemRow}
//                       className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-[#1677ff] font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-blue-50 transition shadow-sm"
//                     >
//                       <IconPlus /> Add Row
//                     </button>
//                   </div>

//                   {itemsList.map((item, index) => {
//                     const reqQtyNum = parseInt(item.req_qty) || 0; // Quantity uthayi
//                     const pPriceNum = parseIndianNumber(
//                       item.purchase_price_raw,
//                     ); // Unit Price uthaya
//                     const cnAmtNum = parseIndianNumber(item.cn_amt_raw); // CN Amount uthaya

//                     // 🔥 NAYA MATH: (Quantity * Unit Price) - CN Amt 🔥
//                     const agreedNLC = reqQtyNum * pPriceNum - cnAmtNum;

//                     return (
//                       <div
//                         key={item.id}
//                         className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm relative group"
//                       >
//                         {itemsList.length > 1 && (
//                           <button
//                             type="button"
//                             onClick={() => removeItemRow(item.id)}
//                             className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-50 text-[#ff4d4f] opacity-0 group-hover:opacity-100 hover:bg-red-100 flex items-center justify-center transition-all"
//                           >
//                             <i className="fas fa-trash-alt text-[12px]"></i>
//                           </button>
//                         )}

//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-x-5 gap-y-4 pr-6">
//                           <div className="col-span-1 md:col-span-2">
//                             <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                               ASIN / FSN *
//                             </label>
//                             <select
//                               required
//                               name="product_model"
//                               value={item.product_model}
//                               onChange={(e) =>
//                                 handleItemChange(
//                                   item.id,
//                                   e.target.name,
//                                   e.target.value,
//                                 )
//                               }
//                               className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                             >
//                               <option value="">-- Search & Select --</option>
//                               {dropdowns.models.map((m) => (
//                                 <option key={m.id} value={m.id}>
//                                   {m.asin_fsn} — {m.model_name}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>
//                           <div>
//                             <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                               Model Name
//                             </label>
//                             <input
//                               type="text"
//                               readOnly
//                               value={item.model_name_log}
//                               className="w-full bg-gray-50 border border-transparent p-2.5 rounded-xl text-[13px] font-semibold text-gray-500 select-none"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                               Model No
//                             </label>
//                             <input
//                               type="text"
//                               readOnly
//                               value={item.model_no_log}
//                               className="w-full bg-gray-50 border border-transparent p-2.5 rounded-xl text-[13px] font-semibold text-gray-500 select-none"
//                             />
//                           </div>

//                           <div>
//                             <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                               Req Qty *
//                             </label>
//                             <input
//                               type="number"
//                               min="1"
//                               required
//                               name="req_qty"
//                               value={item.req_qty}
//                               onChange={(e) =>
//                                 handleItemChange(
//                                   item.id,
//                                   e.target.name,
//                                   e.target.value,
//                                 )
//                               }
//                               className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-bold text-slate-800 transition"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                               Purchase Price *
//                             </label>
//                             <input
//                               type="text"
//                               required
//                               name="purchase_price_raw"
//                               value={item.purchase_price_raw}
//                               onChange={(e) =>
//                                 handleItemChange(
//                                   item.id,
//                                   e.target.name,
//                                   e.target.value.replace(/[^0-9.]/g, ""),
//                                 )
//                               }
//                               className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-bold text-[#1677ff] transition"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                               CN Amt
//                             </label>
//                             <input
//                               type="text"
//                               name="cn_amt_raw"
//                               value={item.cn_amt_raw}
//                               onChange={(e) =>
//                                 handleItemChange(
//                                   item.id,
//                                   e.target.name,
//                                   e.target.value.replace(/[^0-9.]/g, ""),
//                                 )
//                               }
//                               className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none text-[13px] font-bold text-[#ff4d4f] transition"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                               Agreed NLC
//                             </label>
//                             <div className="w-full bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-[14px] font-black text-[#52c41a]">
//                               ₹ {formatIndianNumber(agreedNLC)}
//                             </div>
//                           </div>

//                           <div className="col-span-1 md:col-span-2">
//                             <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                               Link Used
//                             </label>
//                             <select
//                               name="link_used"
//                               value={item.link_used}
//                               onChange={(e) =>
//                                 handleItemChange(
//                                   item.id,
//                                   e.target.name,
//                                   e.target.value,
//                                 )
//                               }
//                               className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                             >
//                               <option value="Yes">Yes</option>
//                               <option value="No">No</option>
//                             </select>
//                           </div>
//                           <div className="col-span-1 md:col-span-2">
//                             <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                               Expected Delivery *
//                             </label>
//                             <input
//                               type="date"
//                               required
//                               name="expected_delivery_date"
//                               value={item.expected_delivery_date}
//                               onChange={(e) =>
//                                 handleItemChange(
//                                   item.id,
//                                   e.target.name,
//                                   e.target.value,
//                                 )
//                               }
//                               className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
//                             />
//                           </div>
//                           {/* 🔥 POST-PLACEMENT DETAILS BHARNE KE LIYE NAYA BLOCK 🔥 */}
//                           <div className="col-span-1 md:col-span-4 border-t border-gray-100 mt-2 pt-4">
//                             <h5 className="text-[10px] font-bold text-[#e67e22] uppercase tracking-widest mb-3">
//                               <i className="fas fa-truck-loading"></i>{" "}
//                               Post-Placement Details (Optional)
//                             </h5>
//                             <div className="grid grid-cols-1 md:grid-cols-4 gap-x-5 gap-y-4">
//                               <div>
//                                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                                   Placed Qty
//                                 </label>
//                                 <input
//                                   type="number"
//                                   name="placed_qty"
//                                   value={item.placed_qty}
//                                   onChange={(e) =>
//                                     handleItemChange(
//                                       item.id,
//                                       e.target.name,
//                                       e.target.value,
//                                     )
//                                   }
//                                   className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] outline-none text-[13px] font-bold text-slate-800"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                                   Order NLC
//                                 </label>
//                                 <input
//                                   type="text"
//                                   name="order_nlc_raw"
//                                   value={item.order_nlc_raw}
//                                   onChange={(e) =>
//                                     handleItemChange(
//                                       item.id,
//                                       e.target.name,
//                                       e.target.value.replace(/[^0-9.]/g, ""),
//                                     )
//                                   }
//                                   className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] outline-none text-[13px] font-bold text-slate-800"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                                   Total Placed Amt
//                                 </label>
//                                 <input
//                                   type="text"
//                                   name="total_placed_amt_raw"
//                                   value={item.total_placed_amt_raw}
//                                   onChange={(e) =>
//                                     handleItemChange(
//                                       item.id,
//                                       e.target.name,
//                                       e.target.value.replace(/[^0-9.]/g, ""),
//                                     )
//                                   }
//                                   className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] outline-none text-[13px] font-bold text-slate-800"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                                   Total CN Amt
//                                 </label>
//                                 <input
//                                   type="text"
//                                   name="total_cn_amt_raw"
//                                   value={item.total_cn_amt_raw}
//                                   onChange={(e) =>
//                                     handleItemChange(
//                                       item.id,
//                                       e.target.name,
//                                       e.target.value.replace(/[^0-9.]/g, ""),
//                                     )
//                                   }
//                                   className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-red-400 outline-none text-[13px] font-bold text-red-500"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                                   Placed By
//                                 </label>
//                                 <input
//                                   type="text"
//                                   name="placed_by"
//                                   value={item.placed_by}
//                                   onChange={(e) =>
//                                     handleItemChange(
//                                       item.id,
//                                       e.target.name,
//                                       e.target.value,
//                                     )
//                                   }
//                                   className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] outline-none text-[13px] font-semibold text-slate-800"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                                   Payment Method
//                                 </label>
//                                 <input
//                                   type="text"
//                                   name="payment_method"
//                                   value={item.payment_method}
//                                   onChange={(e) =>
//                                     handleItemChange(
//                                       item.id,
//                                       e.target.name,
//                                       e.target.value,
//                                     )
//                                   }
//                                   placeholder="e.g. Credit Card"
//                                   className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] outline-none text-[13px] font-semibold text-slate-800"
//                                 />
//                               </div>
//                               <div className="col-span-1 md:col-span-2">
//                                 <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
//                                   SAP PO No
//                                 </label>
//                                 <input
//                                   type="text"
//                                   name="sap_po_no"
//                                   value={item.sap_po_no}
//                                   onChange={(e) =>
//                                     handleItemChange(
//                                       item.id,
//                                       e.target.name,
//                                       e.target.value,
//                                     )
//                                   }
//                                   className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] outline-none text-[13px] font-mono text-slate-800"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </form>
//             </div>

//             <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
//               <button
//                 type="button"
//                 onClick={() => setIsFormModalOpen(false)}
//                 className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 form="approvalForm"
//                 disabled={loading}
//                 className="px-6 py-2.5 bg-[#1677ff] hover:bg-blue-600 text-white font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-md shadow-blue-500/20 disabled:opacity-50"
//               >
//                 {loading
//                   ? "Submitting..."
//                   : editModeId
//                     ? "Update Request"
//                     : "Submit Approval"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🔥 COLUMN CONFIG MODAL 🔥 */}
//       {isColumnModalOpen && (
//         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
//           <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
//             <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
//               <h3 className="text-[16px] font-bold text-slate-800">
//                 Customize Columns
//               </h3>
//               <button
//                 onClick={() => setIsColumnModalOpen(false)}
//                 className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition"
//               >
//                 <i className="fas fa-times text-sm"></i>
//               </button>
//             </div>

//             <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-2 max-h-[50vh] overflow-y-auto custom-scrollbar">
//               {Object.keys(cols).map((key) => (
//                 <label
//                   key={key}
//                   className="flex items-center gap-2 cursor-pointer text-[13px] font-semibold text-slate-700 select-none"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={cols[key]}
//                     onChange={() => setCols({ ...cols, [key]: !cols[key] })}
//                     className="rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff] w-4 h-4 cursor-pointer"
//                   />
//                   {key
//                     .replace(/([A-Z])/g, " $1")
//                     .replace(/^./, (str) => str.toUpperCase())}
//                 </label>
//               ))}
//             </div>

//             <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
//               <button
//                 onClick={() => setIsColumnModalOpen(false)}
//                 className="px-6 py-2 bg-[#1677ff] text-white rounded-xl text-[12px] font-bold uppercase tracking-widest shadow-md shadow-blue-500/20 hover:bg-blue-600 transition"
//               >
//                 Done
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import SmartLoader from "../components/SmartLoader"; // 🔥 IMPORTED SMART LOADER 🔥

// --- Utility Functions ---
const formatIndianNumber = (num) => {
  if (!num || isNaN(num)) return "0.00";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(num));
};

const parseIndianNumber = (str) => {
  if (!str) return 0;
  return parseFloat(str.toString().replace(/,/g, "")) || 0;
};

// --- Reusable Modern SVG Icons ---

export const IconWhatsApp = () => (
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
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);
export const IconDownload = () => (
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
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);
export const IconColumns = () => (
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
    <rect x="3" y="3" width="7" height="18" rx="1"></rect>
    <rect x="14" y="3" width="7" height="18" rx="1"></rect>
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
export const IconPDF = () => (
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
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export default function ApprovalManager() {
  const navigate = useNavigate();
  const role = localStorage.getItem("user_role") || "USER";
  const username = localStorage.getItem("username") || "User";

  const [approvals, setApprovals] = useState([]);
  const [dropdowns, setDropdowns] = useState({
    firms: [],
    locations: [],
    merchants: [],
    models: [],
  });
  const [loading, setLoading] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    requested_by: "",
    authorized_by: "",
    merchant: "",
    firm: "",
    location: "",
    request_date: "",
  });

  // Modals States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  // Data States
  const [viewData, setViewData] = useState(null);
  const [editModeId, setEditModeId] = useState(null);

  // 🔥 FULL 27 COLUMNS VISIBILITY STATE 🔥
  const [cols, setCols] = useState({
    approvalNo: true,
    requestDate: true,
    requestedBy: true,
    merchantId: true,
    firmName: true,
    billLocation: true,
    shipLocation: true,
    merchant: true,
    asin: true,
    modelName: true,
    reqQty: true,
    purchasePrice: true,
    cnAmt: true,
    agreedNlc: true,
    linkUsed: true,
    expectedDelivery: true,
    placedQty: true,
    orderNlc: true,
    totalPlacedAmt: true,
    totalCnAmt: true,
    varianceQty: true,
    placedBy: true,
    paymentMethod: true,
    sapPoNo: true,
    status: true,
    authBy: true,
    actions: true,
  });

  const initialMasterState = {
    request_date: new Date().toISOString().split("T")[0],
    requested_by: "",
    placed_by: "",
    merchant_id: "",
    firm: "",
    bill_location: "",
    ship_location: "",
    merchant: "",
  };
  const [masterFormData, setMasterFormData] = useState(initialMasterState);

  const initialItemState = {
    product_model: "",
    model_name_log: "",
    model_no_log: "",
    req_qty: "",
    purchase_price_raw: "",
    cn_amt_raw: "0",
    link_used: "No",
    placed_qty: "0",
    order_nlc_raw: "0",
    total_placed_amt_raw: "0",
    total_cn_amt_raw: "0",
    placed_by: "",
    payment_method: "",
    sap_po_no: "",
    expected_delivery_date: new Date(
      new Date().setDate(new Date().getDate() + 1),
    )
      .toISOString()
      .split("T")[0],
  };
  const [itemsList, setItemsList] = useState([
    { ...initialItemState, id: Date.now() },
  ]);

  useEffect(() => {
    fetchApprovals();
    fetchDropdowns();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const response = await api.get("reports/approvals/");
      setApprovals(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const response = await api.get("reports/approvals/dropdown_data/");
      setDropdowns(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMasterChange = (e) =>
    setMasterFormData({ ...masterFormData, [e.target.name]: e.target.value });
  const handleFilterChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleItemChange = (id, field, value) => {
    const updatedItems = itemsList.map((item) => {
      if (item.id === id) {
        let updatedItem = { ...item, [field]: value };
        if (field === "product_model") {
          const selectedModel = dropdowns.models.find(
            (m) => String(m.id) === String(value),
          );
          if (selectedModel) {
            updatedItem.model_name_log = selectedModel.model_name;
            updatedItem.model_no_log = selectedModel.model || "-";
          } else {
            updatedItem.model_name_log = "";
            updatedItem.model_no_log = "";
          }
        }
        return updatedItem;
      }
      return item;
    });
    setItemsList(updatedItems);
  };

  const addItemRow = () =>
    setItemsList([...itemsList, { ...initialItemState, id: Date.now() }]);
  const removeItemRow = (id) => {
    if (itemsList.length > 1)
      setItemsList(itemsList.filter((item) => item.id !== id));
  };

  const handleAddNew = () => {
    setEditModeId(null);
    setMasterFormData(initialMasterState);
    setItemsList([{ ...initialItemState, id: Date.now() }]);
    setIsFormModalOpen(true);
  };

  const handleEdit = (appId) => {
    const appData = approvals.find((a) => a.id === appId);
    if (!appData) return;

    setEditModeId(appId);
    setMasterFormData({
      request_date: appData.request_date || "",
      requested_by: appData.requested_by || "",
      placed_by: appData.placed_by || "",
      merchant_id: appData.merchant_account_id || "",
      firm: appData.firm || "",
      bill_location: appData.bill_location || "",
      ship_location: appData.ship_location || "",
      merchant: appData.merchant || "",
    });

    if (appData.items && appData.items.length > 0) {
      const loadedItems = appData.items.map((item) => {
        const matchedModel = dropdowns.models.find(
          (m) => m.asin_fsn === item.asin_fsn,
        );
        return {
          id: item.id || Date.now() + Math.random(),
          product_model: matchedModel ? matchedModel.id : "",
          model_name_log: item.model_name || "",
          model_no_log: item.model_no || "",
          req_qty: item.req_qty || "",
          purchase_price_raw: item.purchase_price || "",
          cn_amt_raw: item.cn_amt || "0",
          link_used: item.link_used || "No",
          expected_delivery_date: item.expected_delivery_date || "",

          placed_qty: item.placed_qty || "0",
          order_nlc_raw: item.order_nlc || "0",
          total_placed_amt_raw: item.total_placed_amt || "0",
          total_cn_amt_raw: item.total_cn_amt || "0",
          placed_by: item.placed_by || "",
          payment_method: item.payment_method || "",
          sap_po_no: item.sap_po_no || "",
        };
      });
      setItemsList(loadedItems);
    } else {
      setItemsList([{ ...initialItemState, id: Date.now() }]);
    }
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !masterFormData.firm ||
      !masterFormData.merchant ||
      !masterFormData.bill_location ||
      !masterFormData.requested_by
    ) {
      return alert(
        "Please fill all required Master fields including Requested By!",
      );
    }

    try {
      const cleanItems = itemsList.map((item, index) => {
        if (!item.product_model)
          throw new Error(`Item #${index + 1}: Please select an ASIN.`);
        const selectedModel = dropdowns.models.find(
          (m) => String(m.id) === String(item.product_model),
        );

        const reqQtyNum = parseInt(item.req_qty) || 0;
        const pPrice = parseIndianNumber(item.purchase_price_raw);
        const cnAmt = parseIndianNumber(item.cn_amt_raw);

        const placedQtyNum = parseInt(item.placed_qty) || 0;
        const orderNlcNum = parseIndianNumber(item.order_nlc_raw);
        const totalPlacedAmtNum = parseIndianNumber(item.total_placed_amt_raw);
        const totalCnAmtNum = parseIndianNumber(item.total_cn_amt_raw);

        return {
          asin_fsn: selectedModel ? selectedModel.asin_fsn : "",
          model_name: item.model_name_log || "Unknown",
          model_no: item.model_no_log || "-",
          req_qty: reqQtyNum,
          purchase_price: pPrice,
          cn_amt: cnAmt,
          agreed_nlc: reqQtyNum * pPrice - cnAmt,
          link_used: item.link_used || "No",
          expected_delivery_date: item.expected_delivery_date,

          placed_qty: placedQtyNum,
          order_nlc: orderNlcNum,
          total_placed_amt: totalPlacedAmtNum,
          total_cn_amt: totalCnAmtNum,
          variance_qty: placedQtyNum - reqQtyNum,
          placed_by: item.placed_by || "",
          payment_method: item.payment_method || "",
          sap_po_no: item.sap_po_no || "",
        };
      });

      const payload = {
        ...masterFormData,
        firm: parseInt(masterFormData.firm),
        merchant: parseInt(masterFormData.merchant),
        bill_location: parseInt(masterFormData.bill_location),
        ship_location: parseInt(masterFormData.ship_location),
        merchant_account_id: masterFormData.merchant_id || "N/A",
        items: cleanItems,
      };

      setLoading(true);
      if (editModeId) {
        await api.put(`reports/approvals/${editModeId}/`, payload);
        Swal.fire({
          icon: "success",
          title: "Request Updated Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await api.post("reports/approvals/", payload);
        Swal.fire({
          icon: "success",
          title: "Request Generated Successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setIsFormModalOpen(false);
      fetchApprovals();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.error || error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAction = async (id, actionType) => {
    if (!window.confirm(`Confirm ${actionType}?`)) return;
    try {
      setLoading(true);
      await api.post(`reports/approvals/${id}/${actionType}/`);
      fetchApprovals();
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Request ${actionType}d successfully.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      Swal.fire({
        icon: "error",
        title: "Action Failed",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`DELETE this request completely?`)) return;
    try {
      setLoading(true);
      await api.delete(`reports/approvals/${id}/`);
      fetchApprovals();
    } catch (error) {
      alert("Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    const data = approvals.find((a) => a.id === id);
    setViewData(data);
    setIsViewModalOpen(true);
  };

  const handleWhatsAppNotify = async (app) => {
    const { value: phone } = await Swal.fire({
      title: "WhatsApp Notification",
      input: "text",
      inputLabel: "Enter Admin's WhatsApp Number (without +91)",
      inputPlaceholder: "e.g. 9876543210",
      showCancelButton: true,
      confirmButtonText: "Send message",
      confirmButtonColor: "#1677ff",
      inputValidator: (value) => {
        if (!value || value.length !== 10 || isNaN(value)) {
          return "Please enter a valid 10-digit number!";
        }
      },
    });

    if (phone) {
      const firmName = app.firm_detail?.name || "N/A";
      const merchantName = app.merchant_detail?.name || "N/A";
      const billLoc = app.bill_location_detail?.name || "N/A";
      const shipLoc = app.ship_location_detail?.name || "N/A";

      let message =
        `New Approval Request\n\n` +
        `Approval No: ${app.approval_no}\n` +
        `Request Date: ${app.request_date}\n` +
        `Requested By: ${app.requested_by}\n` +
        `Merchant_ID: ${app.merchant_account_id || "-"}\n` +
        `Firm Name: ${firmName}\n` +
        `Bill Location: ${billLoc}\n` +
        `Ship Location: ${shipLoc}\n` +
        `Merchant: ${merchantName}\n\n` +
        `--- Line Items ---\n\n`;

      app.items?.forEach((item, index) => {
        message +=
          `[Item ${index + 1}]\n` +
          `ASIN/FSN: ${item.asin_fsn || "-"}\n` +
          `Model Name: ${item.model_name || "-"}\n` +
          `Req Qty: ${item.req_qty || 0}\n` +
          `Purchase/Unit Price: Rs. ${formatIndianNumber(item.purchase_price)}\n` +
          `Cn Amt: Rs. ${formatIndianNumber(item.cn_amt)}\n` +
          `Agreed NLC: Rs. ${formatIndianNumber(item.agreed_nlc)}\n` +
          `Link Used: ${item.link_used || "-"}\n` +
          `Expected Delivery: ${item.expected_delivery_date || "-"}\n` +
          `Placed Qty: ${item.placed_qty || 0}\n` +
          `Order NLC: Rs. ${formatIndianNumber(item.order_nlc)}\n` +
          `Total Placed Amt: Rs. ${formatIndianNumber(item.total_placed_amt)}\n` +
          `Total CN Amt: Rs. ${formatIndianNumber(item.total_cn_amt)}\n` +
          `Variance Qty: ${item.variance_qty || 0}\n` +
          `Placed By: ${item.placed_by || "-"}\n` +
          `Payment Method: ${item.payment_method || "-"}\n` +
          `SAP PO No: ${item.sap_po_no || "-"}\n\n`;
      });

      message +=
        `Please review and approve this order:\n` +
        `https://shreemaa-frontend.vercel.app/approvals`;

      const whatsappUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleExportData = () => {
    if (filteredApprovals.length === 0) return alert("No data to export!");
    let csvContent =
      "Approval No,Date,Requested By,Placed By,Firm,Platform,Status,Authorized By,ASIN/FSN,Model Name,Req Qty,Purchase Price,CN Amt,Agreed NLC,Expected Delivery\n";
    filteredApprovals.forEach((app) => {
      if (app.items && app.items.length > 0) {
        app.items.forEach((item) => {
          csvContent += `"${app.approval_no}","${app.request_date}","${app.requested_by}","${app.placed_by || "-"}","${app.firm_detail?.name || "-"}","${app.merchant_detail?.name || "-"}","${app.status}","${app.authorized_by || "-"}","${item.asin_fsn}","${item.model_name.replace(/"/g, '""')}","${item.req_qty}","${item.purchase_price}","${item.cn_amt}","${item.agreed_nlc}","${item.expected_delivery_date}"\n`;
        });
      } else {
        csvContent += `"${app.approval_no}","${app.request_date}","${app.requested_by}","${app.placed_by || "-"}","${app.firm_detail?.name || "-"}","${app.merchant_detail?.name || "-"}","${app.status}","${app.authorized_by || "-"}",,,,,,\n`;
      }
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `Filtered_Approvals_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "Request Date,Requested By,Placed By,Account ID,Firm ID,Merchant ID,Bill Location ID,Ship Location ID,ASIN/FSN,Req Qty,Purchase Price,CN Amt,Expected Delivery Date\n2026-07-10,Ramesh,Suresh,ID_123,1,1,1,1,B0GVYFM7QZ,100,15000,500,2026-07-15\n";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Approval_Upload_Template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredApprovals = approvals.filter((app) => {
    let match = true;
    if (searchTerm) {
      const s = searchTerm.toLowerCase().trim();
      if (
        !app.approval_no?.toLowerCase().includes(s) &&
        !app.requested_by?.toLowerCase().includes(s)
      )
        match = false;
    }
    if (
      filters.requested_by &&
      !app.requested_by
        ?.toLowerCase()
        .includes(filters.requested_by.toLowerCase().trim())
    )
      match = false;
    if (
      filters.authorized_by &&
      !app.authorized_by
        ?.toLowerCase()
        .includes(filters.authorized_by.toLowerCase().trim())
    )
      match = false;
    if (filters.request_date && app.request_date !== filters.request_date)
      match = false;
    if (filters.firm && app.firm !== parseInt(filters.firm)) match = false;
    if (filters.merchant && app.merchant !== parseInt(filters.merchant))
      match = false;
    return match;
  });

  const generateApprovalPDF = (approval) => {
    if (!approval) return;

    const doc = new jsPDF("p", "pt", "a4");
    const firstItem =
      approval.items && approval.items.length > 0 ? approval.items[0] : {};

    doc.setFillColor(21, 71, 52);
    doc.rect(40, 40, 515, 60, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Procurement Approval Letter", 55, 65);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("SHRI MAA MARKETING PRIVATE LIMITED", 55, 85);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);

    doc.setFont("helvetica", "bold");
    doc.text("Approval No:", 40, 140);
    doc.setFont("helvetica", "normal");
    doc.text(approval.approval_no || "-", 170, 140);

    doc.setFont("helvetica", "bold");
    doc.text("Approval Date:", 40, 160);
    doc.setFont("helvetica", "normal");
    doc.text(approval.request_date || "-", 170, 160);

    doc.setFont("helvetica", "bold");
    doc.text("Expected Delivery Date:", 40, 180);
    doc.setFont("helvetica", "normal");
    doc.text(firstItem.expected_delivery_date || "-", 170, 180);

    doc.setFont("helvetica", "bold");
    doc.text("Platform Name:", 40, 200);
    doc.setFont("helvetica", "normal");
    doc.text(approval.merchant_detail?.name || "-", 170, 200);

    doc.setFont("helvetica", "bold");
    doc.text("Account ID:", 40, 220);
    doc.setFont("helvetica", "normal");
    doc.text(approval.merchant_account_id || "-", 170, 220);

    doc.setFont("helvetica", "bold");
    doc.text("Order Requested By:", 300, 140);
    doc.setFont("helvetica", "normal");
    doc.text(approval.requested_by || "-", 410, 140);

    doc.setFont("helvetica", "bold");
    doc.text("Order Placed By:", 300, 160);
    doc.setFont("helvetica", "normal");
    doc.text(approval.placed_by || "-", 410, 160);

    doc.setFont("helvetica", "bold");
    doc.text("Payment Type:", 300, 180);
    doc.setFont("helvetica", "normal");
    doc.text(firstItem.payment_method || "-", 410, 180);

    doc.setFont("helvetica", "bold");
    doc.text("Link Used:", 300, 200);
    doc.setFont("helvetica", "normal");
    doc.text(firstItem.link_used || "-", 410, 200);

    doc.setFont("helvetica", "bold");
    doc.text("SAP PO Number:", 300, 220);
    doc.setFont("helvetica", "normal");
    doc.text(firstItem.sap_po_no || "-", 410, 220);

    doc.setFont("helvetica", "bold");
    doc.text("Approval Status:", 300, 240);
    const currentStatus = approval.status || "Pending";
    if (currentStatus === "Approved") doc.setTextColor(34, 197, 94);
    else if (currentStatus === "Rejected") doc.setTextColor(239, 68, 68);
    else doc.setTextColor(245, 158, 11);
    doc.text(currentStatus.toUpperCase(), 410, 240);
    doc.setTextColor(0, 0, 0);

    doc.setDrawColor(220, 100, 0);
    doc.setLineWidth(2);
    doc.line(40, 265, 60, 265);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Product Details", 65, 270);

    const tableBody = (approval.items || []).map((item) => [
      item.asin_fsn || "-",
      item.model_name || "-",
      item.req_qty || "0",
      formatIndianNumber(item.purchase_price),
      formatIndianNumber(item.cn_amt),
      formatIndianNumber(item.agreed_nlc),
      item.placed_qty || "0",
      formatIndianNumber(item.order_nlc),
      formatIndianNumber(item.total_placed_amt),
    ]);

    let totalReq = 0;
    let totalPlaced = 0;
    let totalCost = 0;

    (approval.items || []).forEach((item) => {
      totalReq += item.req_qty || 0;
      totalPlaced += item.placed_qty || 0;
      totalCost += parseFloat(item.total_placed_amt || 0);
    });

    autoTable(doc, {
      startY: 285,
      head: [
        [
          "ASIN/FSN",
          "Model",
          "Req.\nQty",
          "Purchase\nPrice",
          "CN",
          "Agreed\nNLC",
          "Placed\nQty",
          "Order\nNLC",
          "Total\nCost",
        ],
      ],
      body: tableBody,
      headStyles: {
        fillColor: [21, 71, 52],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      styles: {
        fontSize: 8,
        cellPadding: 4,
        halign: "center",
        valign: "middle",
      },
      columnStyles: {
        1: { halign: "left", cellWidth: 100 },
      },
      theme: "grid",
    });

    let finalY = doc.lastAutoTable.finalY + 20;
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(1);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(40, finalY, 515, 90, 5, 5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Total Req Qty", 60, finalY + 25);
    doc.setFont("helvetica", "normal");
    doc.text(String(totalReq), 160, finalY + 25);

    doc.setFont("helvetica", "bold");
    doc.text("Total Placed Qty", 60, finalY + 45);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(34, 197, 94);
    doc.text(String(totalPlaced), 160, finalY + 45);
    doc.setTextColor(0, 0, 0);

    doc.setFont("helvetica", "bold");
    doc.text("Total Cost", 60, finalY + 65);
    doc.setTextColor(34, 197, 94);
    doc.setFont("helvetica", "bold");
    doc.text(`Rs. ${formatIndianNumber(totalCost)}`, 160, finalY + 65);
    doc.setTextColor(0, 0, 0);

    doc.setFont("helvetica", "bold");
    doc.text("Variance Remark", 60, finalY + 85);
    doc.setFont("helvetica", "normal");
    doc.text("—", 160, finalY + 85);

    finalY += 130;
    doc.setFont("helvetica", "bold");
    doc.text("Approved by", 40, finalY);

    doc.setFont("helvetica", "normal");
    doc.text("Name", 200, finalY);
    doc.text(approval.authorized_by || "Admin", 300, finalY);

    doc.text("Date & Time", 200, finalY + 20);
    doc.text(new Date().toLocaleString(), 300, finalY + 20);

    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `This document was generated automatically on ${new Date().toLocaleString()} upon approval.`,
      40,
      800,
    );

    doc.save(`${approval.approval_no || "Approval_Letter"}.pdf`);
  };

  const renderStatusBadge = (status) => {
    if (status === "Approved")
      return (
        <span className="px-2.5 py-1 bg-green-50 text-[#52c41a] font-bold rounded-md text-[10px] border border-green-100 uppercase tracking-widest">
          Approved
        </span>
      );
    if (status === "Rejected")
      return (
        <span className="px-2.5 py-1 bg-red-50 text-[#ff4d4f] font-bold rounded-md text-[10px] border border-red-100 uppercase tracking-widest">
          Rejected
        </span>
      );
    return (
      <span className="px-2.5 py-1 bg-amber-50 text-amber-600 font-bold rounded-md text-[10px] border border-amber-200 uppercase tracking-widest">
        Pending
      </span>
    );
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-300 pb-10">
      {/* --- HEADER --- */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
            Modules / <span className="text-slate-600">Approvals</span>
          </p>
          <h1 className="text-[20px] font-bold text-slate-800 tracking-tight">
            Approval Management
          </h1>
        </div>
      </div>

      {/* --- MAIN CARD --- */}
      <div className="bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden flex flex-col">
        {/* CARD TOOLBAR */}
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-5 border-b border-gray-50 gap-4 bg-white">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-gray-50/80 px-4 py-2.5 rounded-full w-full md:w-[300px] border border-gray-100 focus-within:bg-white focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
              <IconSearch />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none ml-2 text-[13px] w-full font-medium text-slate-700 placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-gray-400 hover:text-gray-600 outline-none ml-2"
                >
                  <i className="fas fa-times-circle"></i>
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-[13px] font-bold transition-colors shadow-sm ${showFilters ? "bg-blue-50 border-blue-200 text-[#1677ff]" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
            >
              <IconFilter /> Filter
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => setIsColumnModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-500 rounded-[10px] text-[12px] font-bold hover:bg-gray-50 hover:text-[#1677ff] transition shadow-sm"
            >
              <IconColumns /> View Headers
            </button>

            <div className="flex items-center gap-2 bg-white p-1.5 rounded-[12px] border border-gray-200 shadow-sm">
              <button
                onClick={handleDownloadTemplate}
                title="Download Template"
                className="flex items-center justify-center px-3 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-[#1677ff] transition font-bold text-[11px]"
              >
                Template
              </button>
              <button
                onClick={handleExportData}
                title="Export Database"
                className="flex items-center justify-center w-8 h-8 text-slate-500 bg-gray-50 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition"
              >
                <IconDownload />
              </button>
            </div>

            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#e67e22] hover:bg-blue-600 text-white rounded-[10px] transition font-bold text-[13px] shadow-md shadow-blue-500/20 whitespace-nowrap"
            >
              <IconPlus /> New Approval
            </button>
          </div>
        </div>

        {/* EXPANDABLE FILTERS */}
        {showFilters && (
          <div className="px-6 py-4 bg-[#fafafa] border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  name="request_date"
                  value={filters.request_date}
                  onChange={handleFilterChange}
                  className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#1677ff]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Requested By
                </label>
                <input
                  type="text"
                  name="requested_by"
                  placeholder="Type name..."
                  value={filters.requested_by}
                  onChange={handleFilterChange}
                  className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#1677ff]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Firm
                </label>
                <select
                  name="firm"
                  value={filters.firm}
                  onChange={handleFilterChange}
                  className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#1677ff]"
                >
                  <option value="">All Firms</option>
                  {dropdowns.firms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Platform
                </label>
                <select
                  name="merchant"
                  value={filters.merchant}
                  onChange={handleFilterChange}
                  className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#1677ff]"
                >
                  <option value="">All Platforms</option>
                  {dropdowns.merchants.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Authorized By
                </label>
                <input
                  type="text"
                  name="authorized_by"
                  placeholder="Admin name..."
                  value={filters.authorized_by}
                  onChange={handleFilterChange}
                  className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none focus:border-[#1677ff]"
                />
              </div>
              <button
                onClick={() =>
                  setFilters({
                    requested_by: "",
                    authorized_by: "",
                    merchant: "",
                    firm: "",
                    location: "",
                    request_date: "",
                  })
                }
                className="w-full p-2.5 bg-white border border-gray-200 text-gray-500 text-[12px] font-bold uppercase tracking-widest rounded-lg hover:bg-gray-50 transition"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* 🔥 MAIN DATA TABLE WITH ALL 27 COLUMNS & LOADER INTEGRATION 🔥 */}
        <div className="overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-[450px] relative bg-white">
          {loading ? (
            <div className="w-full h-full min-h-[450px] flex items-center justify-center">
              <SmartLoader />
            </div>
          ) : (
            <table className="w-full text-left min-w-max border-collapse">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest sticky top-0 backdrop-blur-md z-10">
                <tr>
                  {cols.approvalNo && (
                    <th className="p-4 pl-6 whitespace-nowrap bg-gray-50/80">
                      Approval No
                    </th>
                  )}
                  {cols.requestDate && (
                    <th className="p-4 whitespace-nowrap bg-gray-50/80">
                      Request Date
                    </th>
                  )}
                  {cols.requestedBy && (
                    <th className="p-4 whitespace-nowrap bg-gray-50/80">
                      Requested By
                    </th>
                  )}
                  {cols.merchantId && (
                    <th className="p-4 whitespace-nowrap bg-gray-50/80">
                      Merchant_ID
                    </th>
                  )}
                  {cols.firmName && (
                    <th className="p-4 whitespace-nowrap bg-gray-50/80">
                      Firm Name
                    </th>
                  )}
                  {cols.billLocation && (
                    <th className="p-4 whitespace-nowrap bg-gray-50/80">
                      Bill Location
                    </th>
                  )}
                  {cols.shipLocation && (
                    <th className="p-4 whitespace-nowrap bg-gray-50/80">
                      Ship Location
                    </th>
                  )}
                  {cols.merchant && (
                    <th className="p-4 whitespace-nowrap bg-gray-50/80">
                      Merchant
                    </th>
                  )}
                  {cols.asin && (
                    <th className="p-4 whitespace-nowrap bg-gray-50/80">
                      ASIN/FSN
                    </th>
                  )}
                  {cols.modelName && (
                    <th className="p-4 whitespace-nowrap min-w-[200px] bg-gray-50/80">
                      Model Name
                    </th>
                  )}
                  {cols.reqQty && (
                    <th className="p-4 text-center whitespace-nowrap bg-gray-50/80">
                      Req Qty
                    </th>
                  )}
                  {cols.purchasePrice && (
                    <th className="p-4 text-right whitespace-nowrap bg-gray-50/80">
                      Purchase Price
                    </th>
                  )}
                  {cols.cnAmt && (
                    <th className="p-4 text-right whitespace-nowrap bg-gray-50/80">
                      Cn Amt
                    </th>
                  )}
                  {cols.agreedNlc && (
                    <th className="p-4 text-right whitespace-nowrap bg-gray-50/80">
                      Agreed NLC
                    </th>
                  )}
                  {cols.linkUsed && (
                    <th className="p-4 text-center whitespace-nowrap bg-gray-50/80">
                      Link Used
                    </th>
                  )}
                  {cols.expectedDelivery && (
                    <th className="p-4 whitespace-nowrap bg-gray-50/80">
                      Expected Delivery
                    </th>
                  )}
                  {cols.placedQty && (
                    <th className="p-4 text-center whitespace-nowrap bg-gray-50/80">
                      Placed Qty
                    </th>
                  )}
                  {cols.orderNlc && (
                    <th className="p-4 text-right whitespace-nowrap bg-gray-50/80">
                      Order NLC
                    </th>
                  )}
                  {cols.totalPlacedAmt && (
                    <th className="p-4 text-right whitespace-nowrap bg-gray-50/80">
                      Total Placed Amt
                    </th>
                  )}
                  {cols.totalCnAmt && (
                    <th className="p-4 text-right whitespace-nowrap bg-gray-50/80">
                      Total CN Amt
                    </th>
                  )}
                  {cols.varianceQty && (
                    <th className="p-4 text-center whitespace-nowrap bg-gray-50/80">
                      Variance Qty
                    </th>
                  )}
                  {cols.placedBy && (
                    <th className="p-4 whitespace-nowrap bg-gray-50/80">
                      Placed By
                    </th>
                  )}
                  {cols.paymentMethod && (
                    <th className="p-4 whitespace-nowrap bg-gray-50/80">
                      Payment Method
                    </th>
                  )}
                  {cols.sapPoNo && (
                    <th className="p-4 whitespace-nowrap bg-gray-50/80">
                      SAP PO No
                    </th>
                  )}
                  {cols.status && (
                    <th className="p-4 text-center whitespace-nowrap bg-gray-50/80">
                      Status
                    </th>
                  )}
                  {cols.authBy && (
                    <th className="p-4 whitespace-nowrap bg-gray-50/80">
                      Authorized By
                    </th>
                  )}
                  {cols.actions && (
                    <th className="p-4 text-right pr-6 sticky right-0 bg-gray-50/90 border-l border-gray-100 z-20">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="text-[13px] font-medium text-slate-700 bg-white">
                {filteredApprovals.length === 0 ? (
                  <tr>
                    <td colSpan="27" className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-100">
                          <i className="fas fa-inbox text-2xl text-gray-300"></i>
                        </div>
                        <p className="font-bold text-slate-600">
                          No Records Found
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredApprovals.flatMap((app) =>
                    (app.items && app.items.length > 0
                      ? app.items
                      : [{ id: "empty" }]
                    ).map((item) => (
                      <tr
                        key={`${app.id}-${item.id}`}
                        className="border-b border-gray-50 last:border-0 hover:bg-blue-50/30 transition-colors group"
                      >
                        {cols.approvalNo && (
                          <td className="p-4 pl-6 font-mono font-bold text-[#e67e22] whitespace-nowrap">
                            {app.approval_no}
                          </td>
                        )}
                        {cols.requestDate && (
                          <td className="p-4 text-gray-500 whitespace-nowrap">
                            {app.request_date}
                          </td>
                        )}
                        {cols.requestedBy && (
                          <td className="p-4 font-semibold text-slate-800 whitespace-nowrap">
                            {app.requested_by}
                          </td>
                        )}
                        {cols.merchantId && (
                          <td className="p-4 text-gray-500 font-mono whitespace-nowrap">
                            {app.merchant_account_id || "—"}
                          </td>
                        )}
                        {cols.firmName && (
                          <td className="p-4 text-slate-700 whitespace-nowrap">
                            {app.firm_detail?.name || "—"}
                          </td>
                        )}
                        {cols.billLocation && (
                          <td className="p-4 text-gray-500 whitespace-nowrap">
                            {app.bill_location_detail?.name || "—"}
                          </td>
                        )}
                        {cols.shipLocation && (
                          <td className="p-4 text-gray-500 whitespace-nowrap">
                            {app.ship_location_detail?.name || "—"}
                          </td>
                        )}
                        {cols.merchant && (
                          <td className="p-4 text-slate-700 whitespace-nowrap">
                            {app.merchant_detail?.name || "—"}
                          </td>
                        )}

                        {cols.asin && (
                          <td className="p-4 font-mono font-bold text-slate-600">
                            {item.id !== "empty" ? item.asin_fsn : "—"}
                          </td>
                        )}
                        {cols.modelName && (
                          <td
                            className="p-4 text-slate-700 max-w-[200px] truncate"
                            title={item.model_name}
                          >
                            {item.id !== "empty" ? item.model_name : "—"}
                          </td>
                        )}
                        {cols.reqQty && (
                          <td className="p-4 text-center font-bold text-slate-800">
                            {item.id !== "empty" ? item.req_qty : "—"}
                          </td>
                        )}
                        {cols.purchasePrice && (
                          <td className="p-4 text-right text-slate-700">
                            ₹
                            {item.id !== "empty"
                              ? formatIndianNumber(item.purchase_price)
                              : "—"}
                          </td>
                        )}
                        {cols.cnAmt && (
                          <td className="p-4 text-right text-red-500 font-semibold">
                            ₹
                            {item.id !== "empty"
                              ? formatIndianNumber(item.cn_amt)
                              : "—"}
                          </td>
                        )}
                        {cols.agreedNlc && (
                          <td className="p-4 text-right text-green-600 font-bold">
                            ₹
                            {item.id !== "empty"
                              ? formatIndianNumber(item.agreed_nlc)
                              : "—"}
                          </td>
                        )}
                        {cols.linkUsed && (
                          <td className="p-4 text-center text-gray-500">
                            {item.id !== "empty" ? item.link_used : "—"}
                          </td>
                        )}
                        {cols.expectedDelivery && (
                          <td className="p-4 text-gray-500 whitespace-nowrap">
                            {item.id !== "empty"
                              ? item.expected_delivery_date
                              : "—"}
                          </td>
                        )}

                        {cols.placedQty && (
                          <td className="p-4 text-center font-bold text-slate-800">
                            {item.id !== "empty" ? item.placed_qty || "0" : "—"}
                          </td>
                        )}
                        {cols.orderNlc && (
                          <td className="p-4 text-right text-slate-700">
                            ₹
                            {item.id !== "empty"
                              ? formatIndianNumber(item.order_nlc)
                              : "—"}
                          </td>
                        )}
                        {cols.totalPlacedAmt && (
                          <td className="p-4 text-right font-bold text-slate-800">
                            ₹
                            {item.id !== "empty"
                              ? formatIndianNumber(item.total_placed_amt)
                              : "—"}
                          </td>
                        )}
                        {cols.totalCnAmt && (
                          <td className="p-4 text-right text-red-500">
                            ₹
                            {item.id !== "empty"
                              ? formatIndianNumber(item.total_cn_amt)
                              : "—"}
                          </td>
                        )}

                        {cols.varianceQty && (
                          <td className="p-4 text-center font-bold">
                            {item.id !== "empty" ? (
                              <span
                                className={
                                  item.variance_qty < 0
                                    ? "text-red-500"
                                    : item.variance_qty > 0
                                      ? "text-green-500"
                                      : "text-slate-500"
                                }
                              >
                                {item.variance_qty || "0"}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                        )}

                        {cols.placedBy && (
                          <td className="p-4 text-slate-700 whitespace-nowrap">
                            {item.id !== "empty" ? item.placed_by || "—" : "—"}
                          </td>
                        )}
                        {cols.paymentMethod && (
                          <td className="p-4 text-slate-500 whitespace-nowrap">
                            {item.id !== "empty"
                              ? item.payment_method || "—"
                              : "—"}
                          </td>
                        )}
                        {cols.sapPoNo && (
                          <td className="p-4 font-mono text-slate-500 whitespace-nowrap">
                            {item.id !== "empty" ? item.sap_po_no || "—" : "—"}
                          </td>
                        )}

                        {cols.status && (
                          <td className="p-4 text-center whitespace-nowrap">
                            {renderStatusBadge(app.status)}
                          </td>
                        )}
                        {cols.authBy && (
                          <td className="p-4 text-gray-500 whitespace-nowrap">
                            {app.authorized_by || "—"}
                          </td>
                        )}

                        {cols.actions && (
                          <td className="p-4 text-right pr-6 sticky right-0 bg-white group-hover:bg-blue-50/10 transition-colors z-10 whitespace-nowrap border-l border-gray-100">
                            <div className="flex justify-end items-center gap-2">
                              <button
                                onClick={() => handleView(app.id)}
                                title="View Detail"
                                className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 hover:text-slate-800 hover:bg-slate-100 shadow-sm flex items-center justify-center transition"
                              >
                                <i className="fas fa-eye text-[12px]"></i>
                              </button>

                              <button
                                onClick={() => generateApprovalPDF(app)}
                                title="Download PDF"
                                className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:text-white hover:bg-red-500 shadow-sm flex items-center justify-center transition"
                              >
                                <IconPDF />
                              </button>

                              {(role === "ADMIN" ||
                                username?.toLowerCase() ===
                                  app.requested_by?.toLowerCase() ||
                                username?.toLowerCase() ===
                                  app.placed_by?.toLowerCase()) &&
                                app.status === "Pending" && (
                                  <button
                                    onClick={() => handleEdit(app.id)}
                                    title="Edit Record"
                                    className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#1677ff] hover:border-blue-200 shadow-sm flex items-center justify-center transition"
                                  >
                                    <i className="fas fa-pen text-[12px]"></i>
                                  </button>
                                )}

                              <button
                                onClick={() => handleWhatsAppNotify(app)}
                                title="Notify via WhatsApp"
                                className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 text-[#25D366] hover:text-white hover:bg-[#25D366] shadow-sm flex items-center justify-center transition"
                              >
                                <IconWhatsApp />
                              </button>

                              {role === "ADMIN" && (
                                <>
                                  {app.status === "Pending" && (
                                    <>
                                      <button
                                        onClick={() =>
                                          handleAdminAction(app.id, "approve")
                                        }
                                        title="Approve Request"
                                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#52c41a] hover:border-green-200 shadow-sm flex items-center justify-center transition"
                                      >
                                        <i className="fas fa-check text-[14px]"></i>
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleAdminAction(app.id, "reject")
                                        }
                                        title="Reject Request"
                                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#ff4d4f] hover:border-red-200 shadow-sm flex items-center justify-center transition"
                                      >
                                        <i className="fas fa-times text-[14px]"></i>
                                      </button>
                                    </>
                                  )}

                                  <button
                                    onClick={() => handleDelete(app.id)}
                                    title="Delete Record"
                                    className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#ff4d4f] hover:bg-red-50 shadow-sm flex items-center justify-center transition"
                                  >
                                    <i className="fas fa-trash-alt text-[12px]"></i>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    )),
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 🔥 VIEW MODAL 🔥 */}
      {isViewModalOpen && viewData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="p-8 pb-6 flex justify-between items-start border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {viewData.approval_no}
                </h2>
                <div className="mt-2">{renderStatusBadge(viewData.status)}</div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-slate-800 transition"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-[#f8f9fa] rounded-2xl border border-gray-100 mb-8">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Request Date
                  </p>
                  <p className="font-bold text-[14px] text-slate-800 mt-1">
                    {viewData.request_date}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Requested By
                  </p>
                  <p className="font-bold text-[14px] text-slate-800 mt-1">
                    {viewData.requested_by}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Merchant_ID
                  </p>
                  <p className="font-bold text-[14px] text-slate-800 mt-1">
                    {viewData.merchant_account_id || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Firm Name
                  </p>
                  <p className="font-bold text-[14px] text-slate-800 mt-1">
                    {viewData.firm_detail?.name || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Merchant
                  </p>
                  <p className="font-bold text-[14px] text-slate-800 mt-1">
                    {viewData.merchant_detail?.name || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Bill / Ship Location
                  </p>
                  <p className="font-bold text-[14px] text-slate-800 mt-1">
                    {viewData.bill_location_detail?.name || "—"} /{" "}
                    {viewData.ship_location_detail?.name || "—"}
                  </p>
                </div>
              </div>

              <h3 className="text-[15px] font-bold text-slate-800 mb-4">
                Model requested
              </h3>
              <div className="space-y-4">
                {viewData.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-2xl p-6 relative"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-bold text-slate-800 text-[15px]">
                          {item.model_name}
                        </h4>
                        <p className="text-xs font-mono font-bold text-gray-500 mt-1">
                          {item.asin_fsn}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Purchase Price
                        </p>
                        <p className="font-black text-slate-800 mt-1">
                          Rs. {item.purchase_price}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Req Qty
                        </p>
                        <p className="font-bold text-slate-800 mt-1">
                          {item.req_qty || "0"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Placed Qty
                        </p>
                        <p className="font-bold text-slate-800 mt-1">
                          {item.placed_qty || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
                          Variance
                        </p>
                        <p className="font-bold text-green-600 mt-1">
                          {item.variance_qty || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Placed Amt
                        </p>
                        <p className="font-bold text-slate-800 mt-1">
                          Rs. {item.total_placed_amt || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-[#f8f9fa] border border-gray-200 rounded-xl p-5 flex justify-between items-center">
                <span className="font-bold text-slate-800">Total</span>
                <span className="font-bold text-slate-800">
                  Req{" "}
                  {viewData.items.reduce(
                    (acc, curr) => acc + (curr.req_qty || 0),
                    0,
                  )}{" "}
                  · Placed{" "}
                  {viewData.items.reduce(
                    (acc, curr) => acc + (curr.placed_qty || 0),
                    0,
                  )}{" "}
                  · Rs.{" "}
                  {viewData.items.reduce(
                    (acc, curr) => acc + (curr.total_placed_amt || 0),
                    0,
                  )}
                </span>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-2xl">
              <button
                onClick={() => generateApprovalPDF(viewData)}
                className="px-6 py-2.5 bg-white border border-gray-300 text-slate-700 font-bold rounded-lg hover:bg-gray-50 transition shadow-sm flex items-center gap-2"
              >
                <IconDownload /> Download PDF
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-8 py-2.5 bg-[#1677ff] text-white font-bold rounded-lg hover:bg-blue-600 transition shadow-md shadow-blue-500/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 CREATE / EDIT FORM MODAL 🔥 */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">
                  {editModeId
                    ? `Edit Approval Request`
                    : "New Approval Request"}
                </h3>
                <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                  Fill in the required fields to generate a request.
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            <div className="px-8 py-6 overflow-y-auto custom-scrollbar bg-[#f0f2f5]/40">
              <form
                id="approvalForm"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <i className="fas fa-info-circle text-[#1677ff]"></i> Master
                  Properties
                </h4>

                <div className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Request Date *
                    </label>
                    <input
                      type="date"
                      required
                      name="request_date"
                      value={masterFormData.request_date}
                      onChange={handleMasterChange}
                      className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Requested By *
                    </label>
                    <input
                      type="text"
                      required
                      name="requested_by"
                      value={masterFormData.requested_by}
                      onChange={handleMasterChange}
                      className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Placed By
                    </label>
                    <input
                      type="text"
                      name="placed_by"
                      value={masterFormData.placed_by}
                      onChange={handleMasterChange}
                      placeholder="e.g. Aman"
                      className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Account ID
                    </label>
                    <input
                      type="text"
                      name="merchant_id"
                      value={masterFormData.merchant_id}
                      onChange={handleMasterChange}
                      placeholder="e.g. ID_9011"
                      className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Firm *
                    </label>
                    <select
                      required
                      name="firm"
                      value={masterFormData.firm}
                      onChange={handleMasterChange}
                      className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                    >
                      <option value="">-- Select --</option>
                      {dropdowns.firms.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Platform *
                    </label>
                    <select
                      required
                      name="merchant"
                      value={masterFormData.merchant}
                      onChange={handleMasterChange}
                      className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                    >
                      <option value="">-- Select --</option>
                      {dropdowns.merchants.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Bill Location *
                    </label>
                    <select
                      required
                      name="bill_location"
                      value={masterFormData.bill_location}
                      onChange={handleMasterChange}
                      className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                    >
                      <option value="">-- Select --</option>
                      {dropdowns.locations.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Ship Location *
                    </label>
                    <select
                      required
                      name="ship_location"
                      value={masterFormData.ship_location}
                      onChange={handleMasterChange}
                      className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                    >
                      <option value="">-- Select --</option>
                      {dropdowns.locations.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4 mt-8">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-box-open text-[#1677ff]"></i> Line
                      Items
                    </h4>
                    <button
                      type="button"
                      onClick={addItemRow}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-[#1677ff] font-bold rounded-xl text-[11px] uppercase tracking-widest hover:bg-blue-50 transition shadow-sm"
                    >
                      <IconPlus /> Add Row
                    </button>
                  </div>

                  {itemsList.map((item, index) => {
                    const reqQtyNum = parseInt(item.req_qty) || 0;
                    const pPriceNum = parseIndianNumber(
                      item.purchase_price_raw,
                    );
                    const cnAmtNum = parseIndianNumber(item.cn_amt_raw);

                    const agreedNLC = reqQtyNum * pPriceNum - cnAmtNum;

                    return (
                      <div
                        key={item.id}
                        className="bg-white p-6 rounded-[16px] border border-gray-100 shadow-sm relative group"
                      >
                        {itemsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemRow(item.id)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-50 text-[#ff4d4f] opacity-0 group-hover:opacity-100 hover:bg-red-100 flex items-center justify-center transition-all"
                          >
                            <i className="fas fa-trash-alt text-[12px]"></i>
                          </button>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-5 gap-y-4 pr-6">
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                              ASIN / FSN *
                            </label>
                            <select
                              required
                              name="product_model"
                              value={item.product_model}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  e.target.name,
                                  e.target.value,
                                )
                              }
                              className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                            >
                              <option value="">-- Search & Select --</option>
                              {dropdowns.models.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.asin_fsn} — {m.model_name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                              Model Name
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={item.model_name_log}
                              className="w-full bg-gray-50 border border-transparent p-2.5 rounded-xl text-[13px] font-semibold text-gray-500 select-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                              Model No
                            </label>
                            <input
                              type="text"
                              readOnly
                              value={item.model_no_log}
                              className="w-full bg-gray-50 border border-transparent p-2.5 rounded-xl text-[13px] font-semibold text-gray-500 select-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                              Req Qty *
                            </label>
                            <input
                              type="number"
                              min="1"
                              required
                              name="req_qty"
                              value={item.req_qty}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  e.target.name,
                                  e.target.value,
                                )
                              }
                              className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-bold text-slate-800 transition"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                              Purchase Price *
                            </label>
                            <input
                              type="text"
                              required
                              name="purchase_price_raw"
                              value={item.purchase_price_raw}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  e.target.name,
                                  e.target.value.replace(/[^0-9.]/g, ""),
                                )
                              }
                              className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-bold text-[#1677ff] transition"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                              CN Amt
                            </label>
                            <input
                              type="text"
                              name="cn_amt_raw"
                              value={item.cn_amt_raw}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  e.target.name,
                                  e.target.value.replace(/[^0-9.]/g, ""),
                                )
                              }
                              className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-red-400 focus:ring-4 focus:ring-red-50 outline-none text-[13px] font-bold text-[#ff4d4f] transition"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                              Agreed NLC
                            </label>
                            <div className="w-full bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-[14px] font-black text-[#52c41a]">
                              ₹ {formatIndianNumber(agreedNLC)}
                            </div>
                          </div>

                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                              Link Used
                            </label>
                            <select
                              name="link_used"
                              value={item.link_used}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  e.target.name,
                                  e.target.value,
                                )
                              }
                              className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                            >
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                              Expected Delivery *
                            </label>
                            <input
                              type="date"
                              required
                              name="expected_delivery_date"
                              value={item.expected_delivery_date}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  e.target.name,
                                  e.target.value,
                                )
                              }
                              className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] focus:ring-4 focus:ring-blue-50 outline-none text-[13px] font-semibold text-slate-800 transition"
                            />
                          </div>

                          {/* Post-Placement Details */}
                          <div className="col-span-1 md:col-span-4 border-t border-gray-100 mt-2 pt-4">
                            <h5 className="text-[10px] font-bold text-[#e67e22] uppercase tracking-widest mb-3">
                              <i className="fas fa-truck-loading"></i>{" "}
                              Post-Placement Details (Optional)
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-5 gap-y-4">
                              <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                  Placed Qty
                                </label>
                                <input
                                  type="number"
                                  name="placed_qty"
                                  value={item.placed_qty}
                                  onChange={(e) =>
                                    handleItemChange(
                                      item.id,
                                      e.target.name,
                                      e.target.value,
                                    )
                                  }
                                  className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] outline-none text-[13px] font-bold text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                  Order NLC
                                </label>
                                <input
                                  type="text"
                                  name="order_nlc_raw"
                                  value={item.order_nlc_raw}
                                  onChange={(e) =>
                                    handleItemChange(
                                      item.id,
                                      e.target.name,
                                      e.target.value.replace(/[^0-9.]/g, ""),
                                    )
                                  }
                                  className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] outline-none text-[13px] font-bold text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                  Total Placed Amt
                                </label>
                                <input
                                  type="text"
                                  name="total_placed_amt_raw"
                                  value={item.total_placed_amt_raw}
                                  onChange={(e) =>
                                    handleItemChange(
                                      item.id,
                                      e.target.name,
                                      e.target.value.replace(/[^0-9.]/g, ""),
                                    )
                                  }
                                  className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] outline-none text-[13px] font-bold text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                  Total CN Amt
                                </label>
                                <input
                                  type="text"
                                  name="total_cn_amt_raw"
                                  value={item.total_cn_amt_raw}
                                  onChange={(e) =>
                                    handleItemChange(
                                      item.id,
                                      e.target.name,
                                      e.target.value.replace(/[^0-9.]/g, ""),
                                    )
                                  }
                                  className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-red-400 outline-none text-[13px] font-bold text-red-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                  Placed By
                                </label>
                                <input
                                  type="text"
                                  name="placed_by"
                                  value={item.placed_by}
                                  onChange={(e) =>
                                    handleItemChange(
                                      item.id,
                                      e.target.name,
                                      e.target.value,
                                    )
                                  }
                                  className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] outline-none text-[13px] font-semibold text-slate-800"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                  Payment Method
                                </label>
                                <input
                                  type="text"
                                  name="payment_method"
                                  value={item.payment_method}
                                  onChange={(e) =>
                                    handleItemChange(
                                      item.id,
                                      e.target.name,
                                      e.target.value,
                                    )
                                  }
                                  placeholder="e.g. Credit Card"
                                  className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] outline-none text-[13px] font-semibold text-slate-800"
                                />
                              </div>
                              <div className="col-span-1 md:col-span-2">
                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                                  SAP PO No
                                </label>
                                <input
                                  type="text"
                                  name="sap_po_no"
                                  value={item.sap_po_no}
                                  onChange={(e) =>
                                    handleItemChange(
                                      item.id,
                                      e.target.name,
                                      e.target.value,
                                    )
                                  }
                                  className="w-full bg-white border border-gray-200 p-2.5 rounded-xl focus:border-[#1677ff] outline-none text-[13px] font-mono text-slate-800"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </form>
            </div>
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="approvalForm"
                disabled={loading}
                className="px-6 py-2.5 bg-[#1677ff] hover:bg-blue-600 text-white font-bold tracking-widest uppercase rounded-xl text-[12px] transition shadow-md shadow-blue-500/20 disabled:opacity-50"
              >
                {loading
                  ? "Submitting..."
                  : editModeId
                    ? "Update Request"
                    : "Submit Approval"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 COLUMN CONFIG MODAL 🔥 */}
      {isColumnModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-[16px] font-bold text-slate-800">
                Customize Columns
              </h3>
              <button
                onClick={() => setIsColumnModalOpen(false)}
                className="w-8 h-8 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-2 max-h-[50vh] overflow-y-auto custom-scrollbar">
              {Object.keys(cols).map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer text-[13px] font-semibold text-slate-700 select-none"
                >
                  <input
                    type="checkbox"
                    checked={cols[key]}
                    onChange={() => setCols({ ...cols, [key]: !cols[key] })}
                    className="rounded border-gray-300 text-[#1677ff] focus:ring-[#1677ff] w-4 h-4 cursor-pointer"
                  />
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
              ))}
            </div>

            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsColumnModalOpen(false)}
                className="px-6 py-2 bg-[#1677ff] text-white rounded-xl text-[12px] font-bold uppercase tracking-widest shadow-md shadow-blue-500/20 hover:bg-blue-600 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}