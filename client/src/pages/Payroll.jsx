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
    allowances: 0,
    deductions: 0,
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
    } catch (err) {
      toast.error("Failed to fetch employees");
    }
  };

  const fetchPayrolls = async () => {
    try {
      const res = await api.get("/payroll");
      setPayrolls(res.data.payrolls || []);
    } catch (err) {
      toast.error("Failed to fetch payrolls");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "employeeId") {
      const emp = employees.find((item) => item._id === value);
      setSelectedEmployee(emp || null);
    }
  };

  const calculateNetSalary = () => {
    const basicSalary = selectedEmployee?.salary || 0;
    const allowances = Number(formData.allowances || 0);
    const deductions = Number(formData.deductions || 0);

    return basicSalary + allowances - deductions;
  };

  const generatePayroll = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/payroll/generate", formData);

      toast.success(res.data.message || "Payroll generated successfully");

      setFormData({
        employeeId: "",
        month: "",
        allowances: 0,
        deductions: 0,
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

                <input
                  type="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                  className="border p-3 rounded w-full"
                />

                <input
                  type="number"
                  name="allowances"
                  value={formData.allowances}
                  onChange={handleChange}
                  placeholder="Allowances"
                  className="border p-3 rounded w-full"
                />

                <input
                  type="number"
                  name="deductions"
                  value={formData.deductions}
                  onChange={handleChange}
                  placeholder="Deductions"
                  className="border p-3 rounded w-full"
                />

                <div className="bg-gray-100 rounded p-4 space-y-2 text-sm md:text-base">
                  <p>
                    <strong>Basic Salary:</strong> ₹
                    {selectedEmployee?.salary || 0}
                  </p>

                  <p>
                    <strong>Net Salary:</strong> ₹{calculateNetSalary()}
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
                    {
                      payrolls.filter((item) => item.status === "Generated")
                        .length
                    }
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
                <p className="text-gray-600">
                  Payroll system calculates salary using:
                </p>
                <p className="font-semibold mt-2">
                  Net Salary = Basic Salary + Allowances - Deductions
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4">
              Payroll History
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full text-sm">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3 text-left">Employee ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Department</th>
                    <th className="p-3 text-left">Month</th>
                    <th className="p-3 text-left">Basic</th>
                    <th className="p-3 text-left">Allowances</th>
                    <th className="p-3 text-left">Deductions</th>
                    <th className="p-3 text-left">Net Salary</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {payrolls.length === 0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        className="text-center p-6 text-gray-500"
                      >
                        No payroll records found
                      </td>
                    </tr>
                  ) : (
                    payrolls.map((payroll) => (
                      <tr
                        key={payroll._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-3">
                          {payroll.employeeId?.employeeId}
                        </td>
                        <td className="p-3">{payroll.employeeId?.name}</td>
                        <td className="p-3">
                          {payroll.employeeId?.department}
                        </td>
                        <td className="p-3">{payroll.month}</td>
                        <td className="p-3">₹{payroll.basicSalary}</td>
                        <td className="p-3">₹{payroll.allowances}</td>
                        <td className="p-3">₹{payroll.deductions}</td>
                        <td className="p-3 font-bold">
                          ₹{payroll.netSalary}
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