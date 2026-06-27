import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data.employees);
    } catch (err) {
      console.log("Employee fetch error:", err.message);
      toast.error("Failed to fetch employees");
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance");
      setAttendance(res.data.attendance);
    } catch (err) {
      console.log("Attendance fetch error:", err.message);
      toast.error("Failed to fetch attendance");
    }
  };

  const handleCheckIn = async (employeeId) => {
    try {
      const res = await api.post("/attendance/checkin", {
        employeeId,
      });

      toast.success(res.data.message || "Check In Successful");
      fetchAttendance();
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Check In Failed");
    }
  };

  const handleCheckOut = async (employeeId) => {
    try {
      const res = await api.post("/attendance/checkout", {
        employeeId,
      });

      toast.success(res.data.message || "Check Out Successful");
      fetchAttendance();
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Check Out Failed");
    }
  };

  const calculateWorkingHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "-";

    const convertToSeconds = (time) => {
      const [timePart, modifier] = time.split(" ");
      let [hours, minutes, seconds] = timePart.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      }

      if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      return hours * 3600 + minutes * 60 + seconds;
    };

    const inSeconds = convertToSeconds(checkIn);
    const outSeconds = convertToSeconds(checkOut);

    let diffSeconds = outSeconds - inSeconds;

    if (diffSeconds < 0) {
      diffSeconds += 24 * 3600;
    }

    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };

  const filteredEmployees = employees.filter((emp) =>
    `${emp.employeeId} ${emp.name} ${emp.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">
            Attendance Management
          </h1>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search employee by name, ID or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-3 rounded w-full md:w-1/2"
            />
          </div>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Check In</th>
                  <th className="p-3">Check Out</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Working Hours</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center p-6 text-gray-500">
                      No Employees Found
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => {
                    const today = new Date().toISOString().split("T")[0];

                    const todayAttendance = attendance.find(
                      (a) =>
                        a.employeeId?._id === emp._id &&
                        a.date === today
                    );

                    return (
                      <tr key={emp._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{emp.employeeId}</td>
                        <td className="p-3">{emp.name}</td>
                        <td className="p-3">{emp.department}</td>

                        <td className="p-3">
                          {todayAttendance?.checkIn || "-"}
                        </td>

                        <td className="p-3">
                          {todayAttendance?.checkOut || "-"}
                        </td>

                        <td className="p-3">
                          {!todayAttendance
                            ? "Not Marked"
                            : todayAttendance.checkOut
                            ? "Completed"
                            : "Present"}
                        </td>

                        <td className="p-3">
                          {todayAttendance?.checkIn
                            ? calculateWorkingHours(
                                todayAttendance.checkIn,
                                todayAttendance.checkOut
                              )
                            : "-"}
                        </td>

                        <td className="p-3">
                          {!todayAttendance ? (
                            <button
                              onClick={() => handleCheckIn(emp._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                            >
                              Check In
                            </button>
                          ) : !todayAttendance.checkOut ? (
                            <button
                              onClick={() => handleCheckOut(emp._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                            >
                              Check Out
                            </button>
                          ) : (
                            <span className="text-green-600 font-semibold">
                              Completed
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;