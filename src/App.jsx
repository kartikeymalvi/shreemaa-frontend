import React from "react";
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

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
            fontWeight: "600",
            borderRadius: "10px",
          },
        }}
      />
      <Router>
        <Routes>
          {/* Pages without Sidebar (Public) */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Pages WITH Sidebar (Protected/Layout) */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/orders-report" element={<OrdersReport />} />

            {/* DYNAMIC MASTER ROUTE: Ye ek akela route Firm, Location aur Merchant teeno ko handle kar lega */}
            <Route path="/master/:type" element={<MasterManager />} />

            {/* Default redirect to dashboard if someone types wrong URL inside layout */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/invoice-shipment" element={<InvoiceShipment />} />
            <Route path="track-id" element={<TrackId />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
