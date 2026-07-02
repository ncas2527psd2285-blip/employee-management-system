import EmployeeSidebar from "../components/EmployeeSidebar";
import Navbar from "../components/Navbar";

function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex">
      <EmployeeSidebar />

      <div className="md:ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Employee Dashboard
          </h1>

          <p className="text-gray-600 mb-6">
            Welcome, {user?.name || "Employee"} 👋
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-3xl mb-2">👤</p>
              <h2 className="font-bold text-lg">My Profile</h2>
              <p className="text-gray-500 text-sm">
                View your personal employee details.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-3xl mb-2">🕒</p>
              <h2 className="font-bold text-lg">My Attendance</h2>
              <p className="text-gray-500 text-sm">
                Track your check-in and check-out records.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <p className="text-3xl mb-2">💰</p>
              <h2 className="font-bold text-lg">My Payslips</h2>
              <p className="text-gray-500 text-sm">
                View and download your monthly payslips.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;