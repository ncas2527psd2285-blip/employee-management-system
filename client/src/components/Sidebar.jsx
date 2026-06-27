import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Employees", path: "/employees", icon: "👥" },
    { name: "Attendance", path: "/attendance", icon: "📝" },
    { name: "Apply Leave", path: "/apply-leave", icon: "📄" },
    { name: "Leave Management", path: "/leaves", icon: "🌴" },
    { name: "Reports", path: "/reports", icon: "📊" },
    { name: "Payroll", path: "/payroll", icon: "💰" },
  ];

  return (
    <div className="w-64 h-screen bg-blue-700 text-white fixed shadow-lg">
      <div className="p-6 border-b border-blue-500">
        <h1 className="text-2xl font-bold">EMS</h1>
        <p className="text-sm text-blue-200">HR Management System</p>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-6 py-3 transition ${
              location.pathname === item.path
                ? "bg-white text-blue-700 font-semibold"
                : "hover:bg-blue-800"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full border-t border-blue-500 p-4">
        <div className="text-sm">
          <p className="font-semibold">HR Manager</p>
          <p className="text-blue-200">Administrator</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;