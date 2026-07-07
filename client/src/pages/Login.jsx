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
      const response = await api.post("/auth/login", { email, password });

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-blue-700 text-white p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-5">
              🏢
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Employee Management System
            </h1>

            <p className="text-blue-100 leading-relaxed">
              A secure HRMS portal for administrators and employees to manage
              attendance, leave, payroll, reports, and payslips.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl mb-2">👨‍💼</p>
              <h3 className="font-semibold">Employee Portal</h3>
              <p className="text-sm text-blue-100">
                Profile, attendance, leaves and payslips.
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl mb-2">👩‍💻</p>
              <h3 className="font-semibold">Admin Portal</h3>
              <p className="text-sm text-blue-100">
                Manage employees, payroll and reports.
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl mb-2">🕒</p>
              <h3 className="font-semibold">Attendance</h3>
              <p className="text-sm text-blue-100">
                Check-in, check-out and history tracking.
              </p>
            </div>

            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl mb-2">💰</p>
              <h3 className="font-semibold">Payroll</h3>
              <p className="text-sm text-blue-100">
                PF, PT, LOP deduction and PDF payslips.
              </p>
            </div>
          </div>

         
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-3xl mb-4">
              🔐
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              Secure Login
            </h2>

            <p className="text-gray-500 mt-2">
              Login using your Admin, HR or Employee credentials
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition shadow-lg"
            >
              Login to HRMS
            </button>
          </form>

          <div className="mt-8 grid grid-cols-2 gap-3 text-center text-sm">
            <div className="border rounded-xl p-3">
              <p className="font-semibold text-gray-700">Employee</p>
              <p className="text-gray-500">Own portal access</p>
            </div>

            <div className="border rounded-xl p-3">
              <p className="font-semibold text-gray-700">Admin / HR</p>
              <p className="text-gray-500">Management access</p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            © 2026 Employee Management System
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;