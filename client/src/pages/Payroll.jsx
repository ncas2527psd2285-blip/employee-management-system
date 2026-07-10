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

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "employeeId") {
      const emp = employees.find(
        (item) => item._id === value
      );
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

  const generateAllPayroll = async () => {
    try {
      const res = await api.post("/payroll/generate-all", {
        month: formData.month,
        allowances: formData.allowances,
        pfDeduction: formData.pfDeduction,
        professionalTax: formData.professionalTax,
        otherDeductions: formData.otherDeductions,
      });

      toast.success(res.data.message);
      fetchPayrolls();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error"
      );
    }
  };

  const generatePayroll = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/payroll/generate",
        formData
      );

      toast.success(
        res.data.message ||
        "Payroll generated successfully"
      );

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
      toast.error(
        err.response?.data?.message ||
        "Payroll generation failed"
      );
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            <div className="bg-white rounded-xl shadow p-6">

              <h2 className="text-xl font-bold mb-4">
                Generate Payroll
              </h2>

              <form
                onSubmit={generatePayroll}
                className="space-y-4"
              >

                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                  className="border p-3 rounded w-full"
                >

                  <option value="">
                    Select Employee
                  </option>

                  {employees.map((emp)=>(
                    <option
                      key={emp._id}
                      value={emp._id}
                    >
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
                  name="pfDeduction"
                  value={formData.pfDeduction}
                  onChange={handleChange}
                  placeholder="PF Deduction"
                  className="border p-3 rounded w-full"
                />

                <input
                  type="number"
                  name="professionalTax"
                  value={formData.professionalTax}
                  onChange={handleChange}
                  placeholder="Professional Tax"
                  className="border p-3 rounded w-full"
                />

                <input
                  type="number"
                  name="otherDeductions"
                  value={formData.otherDeductions}
                  onChange={handleChange}
                  placeholder="Other Deductions"
                  className="border p-3 rounded w-full"
                />

                <div className="bg-gray-100 p-4 rounded">

                  <p>
                    <b>Basic Salary:</b> ₹
                    {selectedEmployee?.salary || 0}
                  </p>

                  <p>
                    <b>Preview Net Salary:</b> ₹
                    {calculatePreviewNetSalary()}
                  </p>

                </div>

                <div className="flex gap-3">

                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded"
                  >
                    Generate Payroll
                  </button>

                  <button
                    type="button"
                    onClick={generateAllPayroll}
                    className="flex-1 bg-green-600 text-white py-3 rounded"
                  >
                    Generate All
                  </button>

                </div>

              </form>

            </div>

            <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">

              <h2 className="text-xl font-bold mb-4">
                Payroll Summary
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <div className="border rounded-lg p-4">
                  <p className="text-gray-500">
                    Total Payrolls
                  </p>

                  <h3 className="text-2xl font-bold">
                    {payrolls.length}
                  </h3>
                </div>


                <div className="border rounded-lg p-4">
                  <p className="text-gray-500">
                    Generated
                  </p>

                  <h3 className="text-2xl font-bold text-blue-600">
                    {
                      payrolls.filter(
                        (item)=>item.status==="Generated"
                      ).length
                    }
                  </h3>
                </div>


                <div className="border rounded-lg p-4">
                  <p className="text-gray-500">
                    Paid
                  </p>

                  <h3 className="text-2xl font-bold text-green-600">
                    {
                      payrolls.filter(
                        (item)=>item.status==="Paid"
                      ).length
                    }
                  </h3>
                </div>

              </div>

            </div>

          </div>


          {/* Payroll History */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold mb-4">
              Payroll History
            </h2>


            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>

                  <tr className="bg-blue-600 text-white">

                    <th className="p-3 text-left">
                      Employee ID
                    </th>

                    <th className="p-3 text-left">
                      Employee Name
                    </th>

                    <th className="p-3 text-left">
                      Month
                    </th>

                    <th className="p-3 text-left">
                      Basic
                    </th>

                    <th className="p-3 text-left">
                      Allowances
                    </th>

                    <th className="p-3 text-left">
                      Leave Deduction
                    </th>

                    <th className="p-3 text-left">
                      Total Deduction
                    </th>

                    <th className="p-3 text-left">
                      Net Salary
                    </th>

                    <th className="p-3 text-left">
                      Status
                    </th>

                    <th className="p-3 text-left">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {
                    payrolls.length === 0 ? (

                      <tr>

                        <td
                          colSpan="10"
                          className="text-center p-6 text-gray-500"
                        >
                          No payroll records found
                        </td>

                      </tr>

                    ) : (

                      payrolls.map((payroll)=>(

                        <tr
                          key={payroll._id}
                          className="border-b hover:bg-gray-50"
                        >


                          <td className="p-3">
                            {
                              payroll.employeeId?.employeeId || "-"
                            }
                          </td>


                          <td className="p-3">
                            {
                              payroll.employeeId?.name || "-"
                            }
                          </td>


                          <td className="p-3">
                            {payroll.month}
                          </td>


                          <td className="p-3">
                            ₹{payroll.basicSalary || 0}
                          </td>


                          <td className="p-3">
                            ₹{payroll.allowances || 0}
                          </td>


                          <td className="p-3 text-red-600">
                            ₹{payroll.lopDeduction || 0}
                          </td>


                          <td className="p-3 text-red-600">
                            ₹{payroll.totalDeductions || 0}
                          </td>


                          <td className="p-3 text-green-700 font-bold">
                            ₹{payroll.netSalary || 0}
                          </td>


                          <td className="p-3">

                            <span
                              className={`px-3 py-1 rounded-full text-xs ${
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
                              onClick={() =>
                                generatePayslip(payroll)
                              }
                              className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                              Download PDF
                            </button>

                          </td>


                        </tr>

                      ))

                    )
                  }


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