import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import LeaveManagement from "./pages/LeaveManagement";
import LeaveApply from "./pages/LeaveApply";
import Payroll from "./pages/Payroll";

import EmployeeDashboard from "./pages/EmployeeDashboard";
import MyProfile from "./pages/MyProfile";
import MyAttendance from "./pages/MyAttendance";
import MyLeaves from "./pages/MyLeaves";
import MyPayslips from "./pages/MyPayslips";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";


import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
                <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Employees />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Attendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaves"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LeaveManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply-leave"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <LeaveApply />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payroll"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Payroll />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee-dashboard"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-profile"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-attendance"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <MyAttendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-leaves"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <MyLeaves />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-payslips"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <MyPayslips />
            </ProtectedRoute>
          }
        />
	<Route
  path="/settings"
  element={
    <ProtectedRoute allowedRoles={["admin", "hr", "employee"]}>
      <Settings />
    </ProtectedRoute>
  }
/>
	<Route
  path="/users"
  element={
    <ProtectedRoute allowedRoles={["admin", "hr"]}>
      <UserManagement />
    </ProtectedRoute>
  }
/>
	<Route
  path="/users"
  element={
    <ProtectedRoute allowedRoles={["admin", "hr"]}>
      <UserManagement />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;