import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Employees", path: "/employees", icon: "👥" },
    { name: "Attendance", path: "/attendance", icon: "🕒" },
    { name: "Apply Leave", path: "/apply-leave", icon: "📝" },
    { name: "Leave Management", path: "/leaves", icon: "🌴" },
    { name: "Payroll", path: "/payroll", icon: "💰" },
    { name: "Reports", path: "/reports", icon: "📊" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-slate-900 text-white p-3 rounded-lg shadow"
      >
        ☰
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-slate-900 text-white shadow-xl transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">EMS</h1>
            <p className="text-sm text-slate-300 mt-1">
              Employee Management System
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-white text-2xl"
          >
            ×
          </button>
        </div>

        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold shadow"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-700 p-4">
          <p className="font-semibold">{user?.name || "Admin"}</p>
          <p className="text-slate-400 text-sm">
            {user?.role || "Administrator"}
          </p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;