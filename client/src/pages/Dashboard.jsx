import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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

const generateJuneData = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.post(
      "/seed/june",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(res.data.message);

    fetchDashboardStats();
  } catch (err) {
    console.log(err);

    toast.error(
      err.response?.data?.message || "Failed to generate June data"
    );
  }
};

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow hover:shadow-lg transition">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className={`text-2xl md:text-3xl font-bold mt-2 ${color}`}>
            {value}
          </h2>
        </div>
        <div className="text-3xl md:text-4xl">{icon}</div>
      </div>
    </div>
  );

  const departmentChartData =
    stats?.departmentStats?.map((dept) => ({
      name: dept._id,
      employees: dept.count,
    })) || [];

  const leaveChartData = stats
    ? [
        { name: "Pending", value: stats.pendingLeaves || 0 },
        { name: "Approved", value: stats.approvedLeaves || 0 },
        { name: "Rejected", value: stats.rejectedLeaves || 0 },
      ]
    : [];

  const leaveColors = ["#FACC15", "#22C55E", "#EF4444"];

  return (
    <div className="flex">
      <Sidebar />

      <div className="md:ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-4 md:p-8">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
  Dashboard
</h1>
 </div>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
              Welcome to Employee Management System
            </p>
          </div>

          {!stats ? (
            <p className="text-gray-600">Loading dashboard...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
                <StatCard title="Total Employees" value={stats.totalEmployees} icon="👥" color="text-gray-800" />
                <StatCard title="Active Employees" value={stats.activeEmployees} icon="🟢" color="text-blue-600" />
                <StatCard title="Present Today" value={stats.presentToday} icon="✅" color="text-green-600" />
                <StatCard title="Absent Today" value={stats.absentToday} icon="❌" color="text-red-600" />
                <StatCard title="Late Today" value={stats.lateToday} icon="⏰" color="text-yellow-600" />
                <StatCard title="Half Day" value={stats.halfDayToday} icon="🌓" color="text-orange-600" />
                <StatCard title="Completed Today" value={stats.completedToday} icon="🏁" color="text-purple-600" />
                <StatCard title="Avg Working Hours" value={stats.averageWorkingHours} icon="📊" color="text-indigo-600" />
                <StatCard title="Pending Leaves" value={stats.pendingLeaves} icon="🕒" color="text-yellow-600" />
                <StatCard title="Approved Leaves" value={stats.approvedLeaves} icon="✅" color="text-green-600" />
                <StatCard title="Rejected Leaves" value={stats.rejectedLeaves} icon="❌" color="text-red-600" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
                <div className="bg-white rounded-xl shadow p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                    Employees by Department
                  </h2>

                  <div className="h-64 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentChartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="employees" fill="#2563EB" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                    Leave Status
                  </h2>

                  <div className="h-64 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leaveChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          label
                        >
                          {leaveChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={leaveColors[index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-4 md:p-6 mb-8">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                  Recent Attendance
                </h2>

                {stats.recentAttendance?.length === 0 ? (
                  <p className="text-gray-500">No attendance today</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-[700px] w-full text-sm">
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
                          <tr key={index} className="border-b hover:bg-gray-50">
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
                              {item.workingHours ? `${item.workingHours} hrs` : "-"}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;