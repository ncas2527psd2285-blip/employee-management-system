import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 h-screen bg-blue-700 text-white fixed">
      <h1 className="text-2xl font-bold p-6 border-b">
        EMS
      </h1>

      <nav className="flex flex-col mt-6">

        <Link
          to="/dashboard"
          className="px-6 py-3 hover:bg-blue-800"
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/employees"
          className="px-6 py-3 hover:bg-blue-800"
        >
          👥 Employees
        </Link>

        <Link
          to="/attendance"
          className="px-6 py-3 hover:bg-blue-800"
        >
          📝 Attendance
        </Link>

        <Link
          to="/apply-leave"
          className="px-6 py-3 hover:bg-blue-800"
        >
          📝 Apply Leave
        </Link>

        <Link
          to="/leaves"
          className="px-6 py-3 hover:bg-blue-800"
        >
          🌴 Leave Management
        </Link>

        <Link
          to="/reports"
          className="px-6 py-3 hover:bg-blue-800"
        >
          📊 Reports
        </Link>

        <Link
          to="/payroll"
          className="px-6 py-3 hover:bg-blue-800"
        >
          💰 Payroll
        </Link>

      </nav>
    </div>
  );
}

export default Sidebar;