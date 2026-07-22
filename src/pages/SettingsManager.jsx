import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Swal from "sweetalert2";

// ICONS
const IconPalette = () => (
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
    <circle cx="13.5" cy="6.5" r=".5" />
    <circle cx="17.5" cy="10.5" r=".5" />
    <circle cx="8.5" cy="7.5" r=".5" />
    <circle cx="6.5" cy="12.5" r=".5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);
const IconUsers = () => (
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
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
const IconShield = () => (
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
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

export default function SettingsManager() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);

  // --- 1. APPEARANCE STATE (Functional via LocalStorage) ---
  const [theme, setTheme] = useState(
    localStorage.getItem("erp_theme") || "System",
  );
  const [density, setDensity] = useState(
    localStorage.getItem("erp_density") || "Comfortable",
  );

  // --- 2. USER MANAGEMENT STATE ---
  const [users, setUsers] = useState([]);

  // --- 3. PERMISSIONS STATE ---
  const [selectedSection, setSelectedSection] = useState("Masters");
  const [permissionsMatrix, setPermissionsMatrix] = useState([]);

  const rolesList = [
    "Sales",
    "Warehouse",
    "Support",
    "Accounts",
    "Order Team",
    "Purchase Team",
  ];

  // Fetch Data on Load
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-density", density);
    fetchUsers();
    fetchPermissions(selectedSection);
  }, [selectedSection]);

  // Handle Theme Change Functionally
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("erp_theme", newTheme);
    // 🔥 Magic Line 1: Poori website ke <html> tag par theme ka naam daal dega
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleDensityChange = (newDensity) => {
    setDensity(newDensity);
    localStorage.setItem("erp_density", newDensity);
    // 🔥 Magic Line 2: Poori website ke <html> tag par density ka naam daal dega
    document.documentElement.setAttribute("data-density", newDensity);
  };

  // --- API CALLS ---
  const fetchUsers = async () => {
    try {
      const res = await api.get("reports/user-profiles/");
      setUsers(res.data);
    } catch (err) {
      console.error("No users found yet");
    }
  };

  const fetchPermissions = async (section) => {
    try {
      const res = await api.get(`reports/role-permissions/?section=${section}`);
      const fetchedData = res.data;

      // Default structure banate hain agar backend se data nahi aaya toh
      const initializedMatrix = rolesList.map((role) => {
        const existing = fetchedData.find(
          (d) => d.role === role && d.section === section,
        );
        return (
          existing || {
            section: section,
            role: role,
            can_read: true,
            can_create: false,
            can_change: false,
            can_delete: false,
            can_approve: false,
            can_administer: false,
          }
        );
      });
      setPermissionsMatrix(initializedMatrix);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Checkbox Click
  const handleCheckboxChange = (roleIndex, field) => {
    const updatedMatrix = [...permissionsMatrix];
    updatedMatrix[roleIndex][field] = !updatedMatrix[roleIndex][field];
    setPermissionsMatrix(updatedMatrix);
  };

  // Save Permissions to Backend
  const savePermissions = async () => {
    try {
      setLoading(true);
      await api.post(
        "reports/role-permissions/bulk_update/",
        permissionsMatrix,
      );
      Swal.fire(
        "Saved!",
        `Permissions for ${selectedSection} updated successfully.`,
        "success",
      );
    } catch (err) {
      Swal.fire("Error", "Failed to save permissions.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-300 pb-10">
      {/* HEADER & TABS */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-5">
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-1 tracking-wide">
            Support & Settings /{" "}
            <span className="text-slate-600">Configuration</span>
          </p>
          <h1 className="text-[20px] font-bold text-slate-800 tracking-tight">
            System Settings
          </h1>
        </div>

        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-bold transition-all ${activeTab === "general" ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:bg-gray-50"}`}
          >
            <IconUsers /> Users & Appearance
          </button>
          <button
            onClick={() => setActiveTab("permissions")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-bold transition-all ${activeTab === "permissions" ? "bg-[#e67e22] text-white shadow-md" : "text-slate-500 hover:bg-gray-50"}`}
          >
            <IconShield /> Role Permissions
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* TAB 1: GENERAL (Appearance, Users) */}
      {/* ========================================== */}
      {activeTab === "general" && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <IconPalette className="text-gray-400" />
              <h2 className="text-[14px] font-bold text-slate-800">
                Appearance
              </h2>
            </div>
            <div className="p-6">
              <p className="text-[12px] text-gray-500 mb-4">
                Choose how the ERP looks. Applies immediately and remembers your
                choice on this device.
              </p>
              <div className="mb-5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Theme
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Light", "Dark", "Blue", "Gray", "System"].map((t) => (
                    <button
                      key={t}
                      onClick={() => handleThemeChange(t)}
                      className={`px-5 py-2 rounded-lg text-[13px] font-bold border transition-all ${theme === t ? "bg-[#1677ff] text-white border-[#1677ff] shadow-md" : "bg-white text-slate-600 border-gray-200 hover:bg-gray-50"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Table Density
                </p>
                <div className="flex gap-3">
                  {["Compact", "Comfortable"].map((d) => (
                    <button
                      key={d}
                      onClick={() => handleDensityChange(d)}
                      className={`px-5 py-2 rounded-lg text-[13px] font-bold border transition-all ${density === d ? "bg-[#1677ff] text-white border-[#1677ff] shadow-md" : "bg-white text-slate-600 border-gray-200 hover:bg-gray-50"}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <IconUsers className="text-gray-400" />
              <h2 className="text-[14px] font-bold text-slate-800">
                User Management
              </h2>
            </div>
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="p-3">Email</th>
                    <th className="p-3">Display Name</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Assigned Firms</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] text-slate-700">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-gray-400">
                        No users found. (Add users via backend)
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-gray-50 hover:bg-slate-50/50"
                      >
                        <td className="p-3 font-medium text-slate-600">
                          {u.email}
                        </td>
                        <td className="p-3 font-bold">{u.display_name}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-gray-100 border rounded-md text-[11px]">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500">
                          {u.assigned_firms}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* TAB 2: ROLE PERMISSIONS (Functional)       */}
      {/* ========================================== */}
      {activeTab === "permissions" && (
        <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-[16px] font-bold text-slate-800 mb-1">
              Role Permissions Matrix
            </h2>
            <div className="flex flex-col md:flex-row gap-4 items-end mt-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                  Select Section
                </label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-[250px] border border-gray-200 p-2.5 rounded-lg text-[13px] font-bold text-slate-700 outline-none focus:border-[#e67e22]"
                >
                  <option value="Masters">Masters</option>
                  <option value="Approvals">Approvals</option>
                  <option value="Orders">Orders</option>
                  <option value="Invoices">Invoices</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto w-full max-h-[600px]">
            <table className="w-full text-center border-collapse min-w-[800px]">
              <thead className="bg-gray-50/90 border-b border-gray-200 text-slate-500 text-[11px] font-bold uppercase tracking-widest sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th className="p-4 text-left border-r border-gray-100 sticky left-0 bg-gray-50/90 z-20">
                    Role
                  </th>
                  <th className="p-4 border-r border-gray-100">Read</th>
                  <th className="p-4 border-r border-gray-100">Create</th>
                  <th className="p-4 border-r border-gray-100">Change</th>
                  <th className="p-4 border-r border-gray-100">Delete</th>
                  <th className="p-4 border-r border-gray-100">Approve</th>
                  <th className="p-4 border-r border-gray-100">Administer</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-slate-700">
                {/* Admin Row (Always True) */}
                <tr className="border-b border-gray-50 bg-gray-50/30">
                  <td className="p-3 text-left font-bold text-slate-800 border-r border-gray-100 sticky left-0 bg-gray-50 z-10">
                    Admin
                  </td>
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <td key={i} className="p-3 border-r border-gray-100">
                        <input
                          type="checkbox"
                          checked
                          readOnly
                          className="w-4 h-4 rounded text-[#1677ff] bg-gray-200"
                        />
                      </td>
                    ))}
                </tr>

                {/* Dynamic Mapping from State */}
                {permissionsMatrix.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-50 hover:bg-orange-50/20 transition-colors"
                  >
                    <td className="p-3 text-left font-medium text-slate-600 border-r border-gray-100 sticky left-0 bg-white">
                      {row.role}
                    </td>
                    <td className="p-3 border-r border-gray-100">
                      <input
                        type="checkbox"
                        checked={row.can_read}
                        onChange={() => handleCheckboxChange(idx, "can_read")}
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                    </td>
                    <td className="p-3 border-r border-gray-100">
                      <input
                        type="checkbox"
                        checked={row.can_create}
                        onChange={() => handleCheckboxChange(idx, "can_create")}
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                    </td>
                    <td className="p-3 border-r border-gray-100">
                      <input
                        type="checkbox"
                        checked={row.can_change}
                        onChange={() => handleCheckboxChange(idx, "can_change")}
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                    </td>
                    <td className="p-3 border-r border-gray-100">
                      <input
                        type="checkbox"
                        checked={row.can_delete}
                        onChange={() => handleCheckboxChange(idx, "can_delete")}
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                    </td>
                    <td className="p-3 border-r border-gray-100">
                      <input
                        type="checkbox"
                        checked={row.can_approve}
                        onChange={() =>
                          handleCheckboxChange(idx, "can_approve")
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                    </td>
                    <td className="p-3 border-r border-gray-100">
                      <input
                        type="checkbox"
                        checked={row.can_administer}
                        onChange={() =>
                          handleCheckboxChange(idx, "can_administer")
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Functional Save Button */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
            <button
              onClick={savePermissions}
              disabled={loading}
              className="px-6 py-2.5 bg-[#e67e22] hover:bg-[#d35400] text-white font-bold tracking-widest uppercase rounded-xl text-[12px] shadow-md transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Permissions"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
