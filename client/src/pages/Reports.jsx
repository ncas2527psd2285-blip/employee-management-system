import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Reports() {
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await api.get("/attendance/report", {
        params: {
          date,
          department,
          status,
        },
      });

      setAttendance(res.data.attendance);
    } catch (err) {
      console.log("Report fetch error:", err.message);
    }
  };

  const exportToExcel = () => {
    const data = attendance.map((item) => ({
      "Employee ID": item.employeeId?.employeeId,
      Name: item.employeeId?.name,
      Department: item.employeeId?.department,
      Designation: item.employeeId?.designation,
      Date: item.date,
      "Check In": item.checkIn || "-",
      "Check Out": item.checkOut || "-",
      "Working Hours": item.workingHours || "-",
      Status: item.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    XLSX.writeFile(workbook, "attendance_report.xlsx");
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Attendance Reports</h1>

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Report Filters</h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border p-3 rounded"
              />

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="border p-3 rounded"
              >
                <option value="All">All Departments</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Support">Support</option>
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border p-3 rounded"
              >
                <option value="All">All Status</option>
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Half Day">Half Day</option>
                <option value="Absent">Absent</option>
              </select>

              <button
                onClick={fetchReport}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4"
              >
                Generate Report
              </button>

              <button
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white rounded px-4"
              >
                Export Excel
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              Report Result ({attendance.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3 text-left">Employee ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Department</th>
                    <th className="p-3 text-left">Designation</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Check In</th>
                    <th className="p-3 text-left">Check Out</th>
                    <th className="p-3 text-left">Hours</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center p-6 text-gray-500">
                        No report data found
                      </td>
                    </tr>
                  ) : (
                    attendance.map((item) => (
                      <tr key={item._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{item.employeeId?.employeeId}</td>
                        <td className="p-3">{item.employeeId?.name}</td>
                        <td className="p-3">{item.employeeId?.department}</td>
                        <td className="p-3">{item.employeeId?.designation}</td>
                        <td className="p-3">{item.date}</td>
                        <td className="p-3">{item.checkIn || "-"}</td>
                        <td className="p-3">{item.checkOut || "-"}</td>
                        <td className="p-3">
                          {item.workingHours ? `${item.workingHours} hrs` : "-"}
                        </td>
                        <td className="p-3">{item.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;