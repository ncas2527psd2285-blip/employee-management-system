import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data);
    } catch (err) {
      console.log("Dashboard error:", err.message);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className={`text-3xl font-bold mt-2 ${color}`}>{value}</h2>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              HR Management Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Overview of employees, attendance and departments
            </p>
          </div>

          {!stats ? (
            <p className="text-gray-600">Loading dashboard...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Employees"
                  value={stats.totalEmployees}
                  icon="👥"
                  color="text-gray-800"
                />

                <StatCard
                  title="Active Employees"
                  value={stats.activeEmployees}
                  icon="🟢"
                  color="text-blue-600"
                />

                <StatCard
                  title="Present Today"
                  value={stats.presentToday}
                  icon="✅"
                  color="text-green-600"
                />

                <StatCard
                  title="Absent Today"
                  value={stats.absentToday}
                  icon="❌"
                  color="text-red-600"
                />

                <StatCard
                  title="Late Today"
                  value={stats.lateToday}
                  icon="⏰"
                  color="text-yellow-600"
                />

                <StatCard
                  title="Half Day"
                  value={stats.halfDayToday}
                  icon="🌓"
                  color="text-orange-600"
                />

                <StatCard
                  title="Completed Today"
                  value={stats.completedToday}
                  icon="🏁"
                  color="text-purple-600"
                />

                <StatCard
                  title="Avg Working Hours"
                  value={stats.averageWorkingHours}
                  icon="📊"
                  color="text-indigo-600"
                />
              </div>
	<StatCard
  title="Pending Leaves"
  value={stats.pendingLeaves}
  icon="🕒"
  color="text-yellow-600"
/>

<StatCard
  title="Approved Leaves"
  value={stats.approvedLeaves}
  icon="✅"
  color="text-green-600"
/>

<StatCard
  title="Rejected Leaves"
  value={stats.rejectedLeaves}
  icon="❌"
  color="text-red-600"
/>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow p-6 lg:col-span-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Department Wise Employees
                  </h2>

                  {stats.departmentStats?.length === 0 ? (
                    <p className="text-gray-500">No department data</p>
                  ) : (
                    <div className="space-y-4">
                      {stats.departmentStats.map((dept) => {
                        const percent =
                          stats.totalEmployees > 0
                            ? (dept.count / stats.totalEmployees) * 100
                            : 0;

                        return (
                          <div key={dept._id}>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-gray-700">
                                {dept._id}
                              </span>
                              <span className="font-bold text-gray-800">
                                {dept.count}
                              </span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Recent Attendance
                  </h2>

                  {stats.recentAttendance?.length === 0 ? (
                    <p className="text-gray-500">No attendance today</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100 text-gray-700">
                            <th className="text-left p-3">Employee</th>
                            <th className="text-left p-3">Department</th>
                            <th className="text-left p-3">Check In</th>
                            <th className="text-left p-3">Check Out</th>
                            <th className="text-left p-3">Hours</th>
                            <th className="text-left p-3">Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {stats.recentAttendance.map((item, index) => (
                            <tr
                              key={index}
                              className="border-b hover:bg-gray-50"
                            >
                              <td className="p-3">
                                <div className="font-semibold text-gray-800">
                                  {item.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.employeeId}
                                </div>
                              </td>

                              <td className="p-3">{item.department}</td>
                              <td className="p-3">{item.checkIn || "-"}</td>
                              <td className="p-3">{item.checkOut || "-"}</td>

                              <td className="p-3">
                                {item.workingHours
                                  ? `${item.workingHours} hrs`
                                  : "-"}
                              </td>

                              <td className="p-3">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    item.status === "Late"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : item.status === "Half Day"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  HRMS Next Modules
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-2xl mb-2">📝</p>
                    <h3 className="font-bold">Leave Management</h3>
                    <p className="text-sm text-gray-500">
                      Apply, approve and track leaves
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <p className="text-2xl mb-2">💰</p>
                    <h3 className="font-bold">Payroll</h3>
                    <p className="text-sm text-gray-500">
                      Salary and payslip management
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <p className="text-2xl mb-2">📄</p>
                    <h3 className="font-bold">Reports</h3>
                    <p className="text-sm text-gray-500">
                      Daily and monthly reports
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <p className="text-2xl mb-2">🔐</p>
                    <h3 className="font-bold">Roles</h3>
                    <p className="text-sm text-gray-500">
                      Admin, HR and employee access
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;