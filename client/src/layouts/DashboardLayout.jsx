import React, { useContext } from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DashboardLayout = () => {
  const { currentUser, logout } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">LaragonDocs</h1>
        </div>
        <nav className="mt-6">
          <Link
            to="/dashboard"
            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Dashboard
          </Link>
          {currentUser.role === "admin" && (
            <>
              <Link
                to="/dashboard/employees"
                className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                Data Karyawan
              </Link>
              <Link
                to="/dashboard/settings"
                className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                Setting HR
              </Link>
            </>
          )}
          <Link
            to="/dashboard/attendance"
            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Absensi Saya
          </Link>
          {(currentUser && (currentUser.role === "admin" || currentUser.role === "hr")) && (
            <Link
              to="/dashboard/reports"
              className="block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg hover:bg-gray-200 focus:text-gray-900 hover:text-gray-900 focus:bg-gray-200 focus:outline-none focus:shadow-outline"
            >
              Laporan Absensi
            </Link>
          )}
        </nav>
        <div className="absolute bottom-0 w-64 border-t p-4">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            Selamat Datang, {currentUser.name}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
              {currentUser.role}
            </span>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
