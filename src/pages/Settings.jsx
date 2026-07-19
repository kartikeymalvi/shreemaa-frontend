import React from "react";
import { useSettings } from "../context/SettingsContext";

export default function Settings() {
  const { theme, setTheme, density, setDensity } = useSettings();

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-in fade-in duration-300 pb-10">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Setting
        </h1>
        <p className="text-[13px] text-gray-500 font-medium mt-1">
          Appearance and user access
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* 🎨 1. APPEARANCE SECTION 🎨 */}
        <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-[16px] font-bold text-slate-800">Appearance</h2>
            <p className="text-[13px] text-gray-500 mt-1 mb-6">
              Choose how Order Ops looks. Applies immediately and remembers your
              choice on this device.
            </p>

            {/* THEME SWITCHER */}
            <div className="mb-8">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">
                Theme
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-[13px] font-semibold border transition-all ${theme === "light" ? "bg-white border-[#1677ff] text-[#1677ff] shadow-sm shadow-blue-100" : "bg-white border-gray-200 text-slate-600 hover:bg-gray-50"}`}
                >
                  <i className="fas fa-sun text-amber-500"></i> Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-[13px] font-semibold border transition-all ${theme === "dark" ? "bg-white border-[#1677ff] text-[#1677ff] shadow-sm shadow-blue-100" : "bg-white border-gray-200 text-slate-600 hover:bg-gray-50"}`}
                >
                  <i className="fas fa-moon text-indigo-500"></i> Dark
                </button>
                <button
                  onClick={() => setTheme("blue")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-[13px] font-semibold border transition-all ${theme === "blue" ? "bg-white border-[#1677ff] text-[#1677ff] shadow-sm shadow-blue-100" : "bg-white border-gray-200 text-slate-600 hover:bg-gray-50"}`}
                >
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>{" "}
                  Blue
                </button>
                <button
                  onClick={() => setTheme("gray")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-[13px] font-semibold border transition-all ${theme === "gray" ? "bg-white border-[#1677ff] text-[#1677ff] shadow-sm shadow-blue-100" : "bg-white border-gray-200 text-slate-600 hover:bg-gray-50"}`}
                >
                  <span className="w-3 h-3 rounded-full bg-slate-400"></span>{" "}
                  Gray
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-[13px] font-semibold border transition-all ${theme === "system" ? "bg-[#1677ff] border-[#1677ff] text-white shadow-md shadow-blue-500/20" : "bg-white border-gray-200 text-slate-600 hover:bg-gray-50"}`}
                >
                  <i className="fas fa-desktop"></i> System (Auto)
                </button>
              </div>
            </div>

            {/* TABLE DENSITY SWITCHER */}
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                Table Density
              </label>
              <p className="text-[13px] text-gray-500 mb-3">
                Compact fits more rows on screen; Comfortable gives more
                breathing room.
              </p>

              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  onClick={() => setDensity("compact")}
                  className={`px-6 py-2.5 text-[13px] font-semibold border rounded-l-lg transition-colors ${
                    density === "compact"
                      ? "bg-[#1677ff] border-[#1677ff] text-white z-10"
                      : "bg-white border-gray-200 text-slate-600 hover:bg-gray-50"
                  }`}
                >
                  Compact
                </button>
                <button
                  onClick={() => setDensity("comfortable")}
                  className={`px-6 py-2.5 text-[13px] font-semibold border border-l-0 rounded-r-lg transition-colors ${
                    density === "comfortable"
                      ? "bg-[#1677ff] border-[#1677ff] text-white z-10"
                      : "bg-white border-gray-200 text-slate-600 hover:bg-gray-50"
                  }`}
                >
                  Comfortable
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Agle Steps yahan add karenge (User Management, Notifications, etc.) */}
        <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 p-6 flex items-center justify-center min-h-[200px]">
          <p className="text-gray-400 font-medium">
            User Management Module coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
