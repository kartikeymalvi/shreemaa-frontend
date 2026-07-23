
import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import OrdersReport from "./pages/OrdersReport";
import Layout from "./components/Layout";
import MasterManager from "./pages/MasterManager";
import InvoiceShipment from "./pages/InvoiceShipment";
import { Toaster } from "react-hot-toast";
import TrackId from "./pages/TrackId";
import ApprovalManager from "./pages/ApprovalManager";
import GRPOManager from "./pages/GRPOManager";
import RefundTicketManager from "./pages/RefundTicketManager";
import RefundManager from "./pages/RefundManager";
import PurchaseInwardManager from './pages/PurchaseInwardManager'; 
import WarehouseAudit from "./pages/WarehouseAudit";
import ImeiPdfManager from "./pages/ImeiPdfManager";
import FinanceLedgerManager from "./pages/FinanceLedgerManager";
import ReportsDashboard from "./pages/ReportsDashboard";
// 🔥 FIX: SettingsProvider ko yahan import karna zaroori hai 🔥
import { SettingsProvider } from "./context/SettingsContext";
import FinanceReconciliation from "./pages/FinanceReconciliation";
import SettingsManager from "./pages/SettingsManager";
import SettlementManager from "./pages/SettlementManager";

function App() {
  return (
    // 🔥 FIX: Poori app ko SettingsProvider se wrap karna hai 🔥
    <SettingsProvider>
      <Router>
        <Routes>
          {/* Pages without Sidebar (Public) */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Pages WITH Sidebar (Protected/Layout) */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders-report" element={<OrdersReport />} />

            {/* DYNAMIC MASTER ROUTE */}
            <Route path="/master/:type" element={<MasterManager />} />

            {/* Default redirect to dashboard if someone types wrong URL inside layout */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/invoice-shipment" element={<InvoiceShipment />} />
            <Route path="/track-id" element={<TrackId />} />
            <Route path="/approvals" element={<ApprovalManager />} />
            <Route path="/grpo" element={<GRPOManager />} />
            <Route path="/issue-ticket" element={<RefundTicketManager />} />
            <Route path="/refund" element={<RefundManager />} />
            <Route path="/warehouse-audit" element={<WarehouseAudit />} />
            <Route path="/ImeiPdfManager" element={<ImeiPdfManager />} />
            <Route path="/financeledger" element={<FinanceLedgerManager />} />
            <Route path="/reports" element={<ReportsDashboard />} />
            <Route path="/finance" element={<FinanceReconciliation />} />
            <Route path="/settings" element={<SettingsManager />} />
            <Route path="/settlement" element={<SettlementManager />} />

            <Route
              path="/purchase-inward"
              element={<PurchaseInwardManager />}
            />
          </Route>
        </Routes>
      </Router>
    </SettingsProvider>
  );
}

export default App;

