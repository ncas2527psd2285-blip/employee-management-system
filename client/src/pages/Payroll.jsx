import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import generatePayslip from "../utils/generatePayslip";

function Payroll() {
  const [employees, setEmployees] = useState([]);
  const [payrolls, setPayrolls] = useState([]);

  const [formData, setFormData] = useState({
    employeeId: "",
    month: "",
    allowances: "",
    pfDeduction: "",
    professionalTax: "",
    otherDeductions: "",
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchPayrolls();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data.employees || []);
    } catch {
      toast.error("Failed to fetch employees");
    }
  };

  const fetchPayrolls = async () => {
    try {
      const res = await api.get("/payroll");
      setPayrolls(res.data.payrolls || []);
    } catch {
      toast.error("Failed to fetch payrolls");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    if (name === "employeeId") {
      const emp = employees.find((item) => item._id === value);
      setSelectedEmployee(emp || null);
    }
  };

  const calculatePreviewNetSalary = () => {
    const basic = Number(selectedEmployee?.salary || 0);
    const allowances = Number(formData.allowances || 0);
    const pf = Number(formData.pfDeduction || 0);
    const pt = Number(formData.professionalTax || 0);
    const other = Number(formData.otherDeductions || 0);

    return basic + allowances - (pf + pt + other);
  };

  const generatePayroll = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/payroll/generate", formData);

      toast.success(res.data.message || "Payroll generated successfully");

      setFormData({
        employeeId: "",
        month: "",
        allowances: "",
        pfDeduction: "",
        professionalTax: "",
        otherDeductions: "",
      });

      setSelectedEmployee(null);
      fetchPayrolls();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payroll generation failed");
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="md:ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Payroll Management
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-4 md:p-6 lg:col-span-1">
              <h2 className="text-lg md:text-xl font-bold mb-4">
                Generate Payroll
              </h2>

              <form onSubmit={generatePayroll} className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Select Employee
                  </label>
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
                        {emp.employeeId} - {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Payroll Month
                  </label>
                  <input
                    type="month"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    required
                    className="border p-3 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Allowances (₹)
                  </label>
                  <input
                    type="number"
                    name="allowances"
                    value={formData.allowances}
                    onChange={handleChange}
                    placeholder="Enter Allowances"
                    className="border p-3 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Provident Fund (PF) (₹)
                  </label>
                  <input
                    type="number"
                    name="pfDeduction"
                    value={formData.pfDeduction}
                    onChange={handleChange}
                    placeholder="Enter PF Deduction"
                    className="border p-3 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Professional Tax (PT) (₹)
                  </label>
                  <input
                    type="number"
                    name="professionalTax"
                    value={formData.professionalTax}
                    onChange={handleChange}
                    placeholder="Enter Professional Tax"
                    className="border p-3 rounded w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Other Deductions (₹)
                  </label>
                  <input
                    type="number"
                    name="otherDeductions"
                    value={formData.otherDeductions}
                    onChange={handleChange}
                    placeholder="Enter Other Deductions"
                    className="border p-3 rounded w-full"
                  />
                </div>

                <div className="bg-gray-100 rounded p-4 space-y-2 text-sm md:text-base">
                  <p>
                    <strong>Basic Salary:</strong> ₹
                    {selectedEmployee?.salary || 0}
                  </p>

                  <p>
                    <strong>Preview Net Salary:</strong> ₹
                    {calculatePreviewNetSalary()}
                  </p>

                  <p className="text-xs text-gray-500">
                    Leave deduction will be calculated automatically after payroll generation.
                  </p>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded w-full"
                >
                  Generate Payroll
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow p-4 md:p-6 lg:col-span-2">
              <h2 className="text-lg md:text-xl font-bold mb-4">
                Payroll Summary
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="text-gray-500 text-sm">Total Payrolls</p>
                  <h3 className="text-2xl font-bold">{payrolls.length}</h3>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-gray-500 text-sm">Generated</p>
                  <h3 className="text-2xl font-bold text-blue-600">
                    {payrolls.filter((item) => item.status === "Generated").length}
                  </h3>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-gray-500 text-sm">Paid</p>
                  <h3 className="text-2xl font-bold text-green-600">
                    {payrolls.filter((item) => item.status === "Paid").length}
                  </h3>
                </div>
              </div>

              <div className="mt-6 bg-gray-100 p-4 rounded-lg text-sm md:text-base">
                <p className="text-gray-600">Payroll calculation:</p>
                <p className="font-semibold mt-2">
                  Net Salary = Gross Salary - Leave Deduction - PF - PT - Other Deductions
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4">
              Payroll History
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-[1500px] w-full text-sm">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3 text-left">Employee ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Department</th>
                    <th className="p-3 text-left">Month</th>
                    <th className="p-3 text-left">Basic</th>
                    <th className="p-3 text-left">Allowances</th>
                    <th className="p-3 text-left">Gross</th>
                    <th className="p-3 text-left">Leave Details</th>
                    <th className="p-3 text-left">Leave Deduction</th>
                    <th className="p-3 text-left">PF</th>
                    <th className="p-3 text-left">PT</th>
                    <th className="p-3 text-left">Other Deduction</th>
                    <th className="p-3 text-left">Total Deduction</th>
                    <th className="p-3 text-left">Net Salary</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {payrolls.length === 0 ? (
                    <tr>
                      <td colSpan="16" className="text-center p-6 text-gray-500">
                        No payroll records found
                      </td>
                    </tr>
                  ) : (
                    payrolls.map((payroll) => (
                      <tr key={payroll._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{payroll.employeeId?.employeeId}</td>
                        <td className="p-3">{payroll.employeeId?.name}</td>
                        <td className="p-3">{payroll.employeeId?.department}</td>
                        <td className="p-3">{payroll.month}</td>
                        <td className="p-3">₹{payroll.basicSalary || 0}</td>
                        <td className="p-3">₹{payroll.allowances || 0}</td>
                        <td className="p-3">₹{payroll.grossSalary || 0}</td>

                        <td className="p-3">
                          {payroll.leaveDetails?.length > 0 ? (
                            <div className="space-y-2">
                              {payroll.leaveDetails.map((leave, index) => (
                                <div
                                  key={index}
                                  className="border rounded p-2 text-xs bg-gray-50 min-w-[220px]"
                                >
                                  <p><b>Type:</b> {leave.leaveType}</p>
                                  <p>
                                    <b>Date:</b>{" "}
                                    {leave.fromDate
                                      ? new Date(leave.fromDate).toLocaleDateString()
                                      : "-"}{" "}
                                    to{" "}
                                    {leave.toDate
                                      ? new Date(leave.toDate).toLocaleDateString()
                                      : "-"}
                                  </p>
                                  <p><b>Total Days:</b> {leave.totalDays || 0}</p>
                                  <p><b>Paid Days:</b> {leave.paidDays || 0}</p>
                                  <p className="text-red-600">
                                    <b>LOP Days:</b> {leave.lopDays || 0}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td className="p-3 text-red-600 font-semibold">
                          ₹{payroll.lopDeduction || 0}
                        </td>
                        <td className="p-3">₹{payroll.pfDeduction || 0}</td>
                        <td className="p-3">₹{payroll.professionalTax || 0}</td>
                        <td className="p-3">₹{payroll.otherDeductions || 0}</td>
                        <td className="p-3 text-red-600 font-semibold">
                          ₹{payroll.totalDeductions || 0}
                        </td>
                        <td className="p-3 font-bold text-green-700">
                          ₹{payroll.netSalary || 0}
                        </td>

                        <td className="p-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              payroll.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {payroll.status}
                          </span>
                        </td>

                        <td className="p-3">
                          <button
                            onClick={() => generatePayslip(payroll)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs whitespace-nowrap"
                          >
                            Download PDF
                          </button>
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

export default Payroll;