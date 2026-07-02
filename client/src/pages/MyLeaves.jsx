import { useEffect, useState } from "react";
import api from "../services/api";
import EmployeeSidebar from "../components/EmployeeSidebar";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    leaveType: "Casual Leave",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  useEffect(() => {
    fetchProfile();
    fetchLeaves();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/employees/me");
      setProfile(res.data.employee);
    } catch (err) {
      toast.error("Failed to load profile");
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leave/my-leaves");
      setLeaves(res.data.leaves || []);
    } catch (err) {
      toast.error("Failed to load leaves");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const applyLeave = async (e) => {
    e.preventDefault();

    if (!profile?._id) {
      toast.error("Employee profile not found");
      return;
    }

    try {
      const res = await api.post("/leave/apply", {
        employeeId: profile._id,
        ...formData,
      });

      toast.success(res.data.message || "Leave applied successfully");

      setFormData({
        leaveType: "Casual Leave",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Leave apply failed");
    }
  };

  const approvedLeaves = leaves.filter((leave) => leave.status === "Approved");

  const usedCasual = approvedLeaves
    .filter((leave) => leave.leaveType === "Casual Leave")
    .reduce((total, leave) => total + Number(leave.paidDays || 0), 0);

  const usedSick = approvedLeaves
    .filter((leave) => leave.leaveType === "Sick Leave")
    .reduce((total, leave) => total + Number(leave.paidDays || 0), 0);

  const usedMaternity = approvedLeaves
    .filter((leave) => leave.leaveType === "Maternity Leave")
    .reduce((total, leave) => total + Number(leave.paidDays || 0), 0);

  return (
    <div className="flex">
      <EmployeeSidebar />

      <div className="md:ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">My Leaves</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">Casual Leave Balance</p>
              <h2 className="text-2xl font-bold text-blue-600">
                {12 - usedCasual} / 12
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">Sick Leave Balance</p>
              <h2 className="text-2xl font-bold text-green-600">
                {2 - usedSick} / 2
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">Maternity Leave Balance</p>
              <h2 className="text-2xl font-bold text-purple-600">
                {180 - usedMaternity} / 180
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 md:p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Apply Leave</h2>

            <form onSubmit={applyLeave} className="grid grid-cols-1 gap-4">
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="border p-3 rounded"
                required
              >
                <option value="Casual Leave">Casual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
              </select>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  className="border p-3 rounded"
                  required
                />

                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  className="border p-3 rounded"
                  required
                />
              </div>

              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter reason"
                className="border p-3 rounded h-28"
                required
              />

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white py-3 rounded"
              >
                Apply Leave
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4">Leave History</h2>

            <div className="overflow-x-auto">
              <table className="min-w-[850px] w-full text-sm">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">From</th>
                    <th className="p-3 text-left">To</th>
                    <th className="p-3 text-left">Total Days</th>
                    <th className="p-3 text-left">Paid Days</th>
                    <th className="p-3 text-left">LOP Days</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center p-6 text-gray-500">
                        No leave records found
                      </td>
                    </tr>
                  ) : (
                    leaves.map((leave) => (
                      <tr key={leave._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{leave.leaveType}</td>
                        <td className="p-3">
                          {new Date(leave.fromDate).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          {new Date(leave.toDate).toLocaleDateString()}
                        </td>
                        <td className="p-3">{leave.totalDays || 0}</td>
                        <td className="p-3">{leave.paidDays || 0}</td>
                        <td className="p-3 text-red-600 font-semibold">
                          {leave.lopDays || 0}
                        </td>
                        <td className="p-3">{leave.status}</td>
                        <td className="p-3">{leave.remarks || "-"}</td>
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

export default MyLeaves;