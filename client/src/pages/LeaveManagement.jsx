import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leave");
      setLeaves(res.data.leaves);
    } catch (err) {
      console.log("Leave fetch error:", err.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/leave/${id}`, {
        status,
        remarks: status === "Approved" ? "Approved by HR" : "Rejected by HR",
      });

      fetchLeaves();
    } catch (err) {
      console.log("Leave update error:", err.message);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Leave Management</h1>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Leave Requests</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3 text-left">Employee ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Department</th>
                    <th className="p-3 text-left">Leave Type</th>
                    <th className="p-3 text-left">From</th>
                    <th className="p-3 text-left">To</th>
                    <th className="p-3 text-left">Reason</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center p-6 text-gray-500">
                        No leave requests found
                      </td>
                    </tr>
                  ) : (
                    leaves.map((leave) => (
                      <tr key={leave._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          {leave.employeeId?.employeeId}
                        </td>
                        <td className="p-3">{leave.employeeId?.name}</td>
                        <td className="p-3">
                          {leave.employeeId?.department}
                        </td>
                        <td className="p-3">{leave.leaveType}</td>
                        <td className="p-3">
                          {new Date(leave.fromDate).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          {new Date(leave.toDate).toLocaleDateString()}
                        </td>
                        <td className="p-3">{leave.reason}</td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              leave.status === "Approved"
                                ? "bg-green-100 text-green-700"
                                : leave.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {leave.status === "Pending" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  updateStatus(leave._id, "Approved")
                                }
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  updateStatus(leave._id, "Rejected")
                                }
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500">Completed</span>
                          )}
                        </td>
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

export default LeaveManagement;