import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
      setEmployees(res.data.employees || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch employees");
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

      toast.success(res.data.message || "Leave applied successfully");

      setFormData({
        employeeId: "",
        leaveType: "Casual Leave",
        fromDate: "",
        toDate: "",
        reason: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Leave apply failed");
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="md:ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Apply Leave
          </h1>

          <div className="bg-white rounded-xl shadow p-4 md:p-6 w-full max-w-3xl">
            <form onSubmit={submitLeave} className="grid grid-cols-1 gap-4">
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="border p-3 rounded w-full"
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
                className="border p-3 rounded w-full"
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Earned Leave">Earned Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
              </select>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  required
                  className="border p-3 rounded w-full"
                />

                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  required
                  className="border p-3 rounded w-full"
                />
              </div>

              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                placeholder="Enter reason for leave"
                className="border p-3 rounded h-28 w-full"
              />

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded w-full md:w-auto md:px-8"
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