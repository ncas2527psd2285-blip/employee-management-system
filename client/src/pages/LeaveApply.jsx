import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function LeaveApply() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: "",
    leaveType: "Casual Leave",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data.employees);
    } catch (err) {
      console.log("Employee fetch error:", err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitLeave = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/leave/apply", formData);
      alert(res.data.message || "Leave applied successfully");

      setFormData({
        employeeId: "",
        leaveType: "Casual Leave",
        fromDate: "",
        toDate: "",
        reason: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Leave apply failed");
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Apply Leave</h1>

          <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
            <form onSubmit={submitLeave} className="grid grid-cols-1 gap-4">
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="border p-3 rounded"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employeeId} - {emp.name} - {emp.department}
                  </option>
                ))}
              </select>

              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                required
                className="border p-3 rounded"
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Earned Leave">Earned Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
              </select>

              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                required
                className="border p-3 rounded"
              />

              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                required
                className="border p-3 rounded"
              />

              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                placeholder="Enter reason for leave"
                className="border p-3 rounded h-28"
              />

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded"
              >
                Apply Leave
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveApply;