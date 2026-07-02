import { useEffect, useState } from "react";
import api from "../services/api";
import EmployeeSidebar from "../components/EmployeeSidebar";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

function MyAttendance() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance/my-attendance");
      setAttendance(res.data.attendance || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load attendance");
    }
  };

  const handleCheckIn = async () => {
    try {
      const res = await api.post("/attendance/my-checkin");

      toast.success(res.data.message);
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || "Check In Failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await api.post("/attendance/my-checkout");

      toast.success(res.data.message);
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || "Check Out Failed");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const todayAttendance = attendance.find((item) => item.date === today);

  return (
    <div className="flex">
      <EmployeeSidebar />

      <div className="md:ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-4 md:p-8">
          <h1 className="text-3xl font-bold mb-6">
            My Attendance
          </h1>

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-5">
              Today's Attendance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-500">Check In</p>
                <h3 className="text-xl font-bold">
                  {todayAttendance?.checkIn || "-"}
                </h3>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-gray-500">Check Out</p>
                <h3 className="text-xl font-bold">
                  {todayAttendance?.checkOut || "-"}
                </h3>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-gray-500">Working Hours</p>
                <h3 className="text-xl font-bold">
                  {todayAttendance?.workingHours || 0} hrs
                </h3>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-gray-500">Status</p>
                <h3 className="text-xl font-bold">
                  {todayAttendance?.status || "Not Marked"}
                </h3>
              </div>

            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleCheckIn}
                disabled={!!todayAttendance}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg"
              >
                Check In
              </button>

              <button
                onClick={handleCheckOut}
                disabled={!todayAttendance || todayAttendance.checkOut}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg"
              >
                Check Out
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              Attendance History
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
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
                      <td
                        colSpan="5"
                        className="text-center p-6 text-gray-500"
                      >
                        No attendance found
                      </td>
                    </tr>
                  ) : (
                    attendance.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">{item.date}</td>
                        <td className="p-3">{item.checkIn || "-"}</td>
                        <td className="p-3">{item.checkOut || "-"}</td>
                        <td className="p-3">
                          {item.workingHours || 0} hrs
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

export default MyAttendance;