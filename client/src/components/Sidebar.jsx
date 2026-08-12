import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ user }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: "🏠",
      path: "/dashboard",
    },
    {
      name: "Employees",
      icon: "👥",
      path: "/employees",
    },
    {
      name: "Attendance",
      icon: "🕘",
      path: "/attendance",
    },
    {
      name: "Apply Leave",
      icon: "📄",
      path: "/apply-leave",
    },
    {
      name: "Leave Management",
      icon: "🌴",
      path: "/leave-management",
    },
    {
      name: "Payroll",
      icon: "💰",
      path: "/payroll",
    },
    {
      name: "Reports",
      icon: "📊",
      path: "/reports",
    },
    ...(user?.role === "admin"
      ? [
        {
          name: "User Management",
          icon: "👤",
          path: "/users",
        },
      ]
      : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-slate-900 text-white">

      {/* ================= HEADER ================= */}
      <div className="shrink-0 border-b border-slate-700 px-6 py-7">
        <h1 className="text-3xl font-bold tracking-tight">EMS</h1>

        <p className="mt-1 text-sm text-slate-400">
          Employee Management System
        </p>
      </div>

      {/* ================= NAVIGATION ================= */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex min-h-[52px] items-center gap-4 rounded-lg px-4 text-[16px] transition-all ${isActive(item.path)
                ? "bg-blue-600 font-semibold text-white shadow-sm"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <span className="flex w-7 shrink-0 justify-center text-xl">
                {item.icon}
              </span>

              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* ================= USER FOOTER ================= */}
      <div className="shrink-0 border-t border-slate-700 bg-slate-900">

        {/* ADMIN PROFILE */}
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-lg font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name || "admin"}
            </p>

            <p className="truncate text-xs text-slate-400">
              {user?.role || "Administrator"}
            </p>
          </div>
        </div>

        {/* SETTINGS */}
        <Link
          to="/settings"
          className={`flex min-h-[52px] items-center gap-4 border-t border-slate-800 px-5 transition-all ${isActive("/settings")
            ? "bg-slate-800 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
        >
          <span className="flex w-7 justify-center text-xl">
            ⚙️
          </span>

          <span className="text-[16px]">
            Settings
          </span>
        </Link>

      </div>
    </aside>
  );
};

export default Sidebar;