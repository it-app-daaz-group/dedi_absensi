import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import EmployeeList from "./pages/EmployeeList";
import EmployeeForm from "./pages/EmployeeForm";
import HrSettingsPage from "./pages/HrSettings";
import AttendancePage from "./pages/AttendancePage";
import AttendanceReport from "./pages/AttendanceReport";
import DashboardLayout from "./layouts/DashboardLayout";

const DashboardHome = () => {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="text-lg font-semibold">Dashboard Overview</h3>
      <p className="mt-2 text-gray-600">Selamat datang di sistem absensi LaragonDocs.</p>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/add" element={<EmployeeForm />} />
            <Route path="employees/edit/:id" element={<EmployeeForm />} />
            <Route path="settings" element={<HrSettingsPage />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="reports" element={<AttendanceReport />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
