import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const userRole = response.data.user.role.toLowerCase();

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", userRole);

      toast.success("Login successful");

      if (userRole === "employee") {
        navigate("/employee-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-center p-10 bg-blue-700 text-white">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3">
              Employee Management System
            </h1>
            <p className="text-blue-100">
              Admin and employees can securely manage HRMS activities from one
              platform.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-semibold">👥 Employee Portal</h3>
              <p className="text-sm text-blue-100">
                Employees can view profile, attendance, leaves and payslips.
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-semibold">🕒 Attendance Tracking</h3>
              <p className="text-sm text-blue-100">
                Check-in, check-out and attendance history.
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <h3 className="font-semibold">💰 Payroll Management</h3>
              <p className="text-sm text-blue-100">
                Payroll with LOP, PF, PT and payslip download.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-3xl mb-4">
              🔐
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              Login
            </h2>

            <p className="text-gray-500 mt-2">
              Sign in to access your HRMS account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition shadow-lg"
            >
              Login
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2026 Employee Management System</p>
            <p className="mt-1">Secure HR Management Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;