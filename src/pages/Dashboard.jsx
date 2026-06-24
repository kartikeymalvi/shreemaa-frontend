import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function Dashboard() {
  const role = localStorage.getItem("user_role") || "USER";
  const username = localStorage.getItem("username") || "User";

  const [isManageUsersModalOpen, setManageUsersModalOpen] = useState(false);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "USER",
  });
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    if (role === "ADMIN") fetchUsers();
  }, [role]);

  const fetchUsers = async () => {
    try {
      const response = await api.get("auth/users/");
      setUsersList(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("auth/create-user/", newUser);
      alert(`Account created successfully!`);
      setAddUserModalOpen(false);
      setNewUser({ username: "", password: "", role: "USER" });
      fetchUsers();
    } catch (error) {
      alert(
        "Error: " + (error.response?.data?.error || "Could not create user."),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete user '${name}'?`,
      )
    ) {
      try {
        await api.delete(`auth/users/${id}/`);
        alert("User deleted successfully.");
        fetchUsers();
      } catch (error) {
        alert(
          "Error: " +
            (error.response?.data?.detail || "Could not delete user."),
        );
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome, {username}!
          </h1>
          <div className="text-sm text-gray-500 mt-1">
            Home &gt; {role} Dashboard
          </div>
        </div>
        <span
          className={`px-4 py-1.5 rounded-full text-xs font-bold ${role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
        >
          {role} PRIVILEGES
        </span>
      </div>

      {role === "ADMIN" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500 flex flex-col justify-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Total System Orders
              </p>
              <p className="text-3xl font-black text-gray-800 mt-2">1,240</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-emerald-500 flex flex-col justify-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Company Revenue
              </p>
              <p className="text-3xl font-black text-emerald-600 mt-2">
                ₹45.2 L
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-orange-500 flex flex-col justify-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Active Users
              </p>
              <p className="text-3xl font-black text-orange-500 mt-2">
                {usersList.length}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                System Management
              </h3>
              <p className="text-sm text-gray-500">
                Manage user roles, accounts, and system access.
              </p>
            </div>
            <button
              onClick={() => setManageUsersModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
            >
              <i className="fas fa-users-cog mr-2"></i> Manage Users
            </button>
          </div>
        </div>
      )}

      {role !== "ADMIN" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500 flex flex-col justify-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Your Assigned Orders
              </p>
              <p className="text-3xl font-black text-gray-800 mt-2">45</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-purple-500 flex flex-col justify-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                System Status
              </p>
              <p className="text-lg font-bold text-emerald-600 mt-2">
                All systems operational
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 1: MANAGE USERS TABLE --- */}
      {isManageUsersModalOpen && role === "ADMIN" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">
                <i className="fas fa-users mr-2 text-blue-600"></i> Active Users
                List
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setAddUserModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700"
                >
                  + Add User
                </button>
                <button
                  onClick={() => setManageUsersModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-0 flex-1">
              <table className="w-full text-left">
                <thead className="bg-white sticky top-0 shadow-sm text-gray-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="px-6 py-4">S.NO</th>
                    <th className="px-6 py-4">Username</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-gray-500">
                        #{u.id}
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800 flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${u.role === "ADMIN" ? "bg-purple-500" : "bg-blue-500"}`}
                        >
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                        {u.username}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-bold ${u.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(u.date_joined).toLocaleDateString()}
                      </td>

                      {/* --- FIX: SELF DELETE PROTECTION --- */}
                      <td className="px-6 py-4 text-center">
                        {u.username !== username ? (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.username)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded transition-colors font-bold"
                          >
                            <i className="fas fa-trash-alt mr-1"></i> Delete
                          </button>
                        ) : (
                          <span className="text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide">
                            Current User
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: ADD NEW USER FORM --- */}
      {isAddUserModalOpen && role === "ADMIN" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-5 border-b pb-3">
              <h2 className="text-lg font-bold text-gray-800">
                Create New Account
              </h2>
              <button
                onClick={() => setAddUserModalOpen(false)}
                className="text-gray-400 hover:text-red-500"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">
                  Assign Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold"
                >
                  <option value="USER">Normal User</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-all mt-2 disabled:bg-gray-400"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
