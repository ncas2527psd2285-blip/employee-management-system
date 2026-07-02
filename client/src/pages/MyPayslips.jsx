import { useEffect, useState } from "react";
import api from "../services/api";
import EmployeeSidebar from "../components/EmployeeSidebar";
import Navbar from "../components/Navbar";
import generatePayslip from "../utils/generatePayslip";
import { toast } from "react-toastify";

function MyPayslips() {
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    try {
      const res = await api.get("/payroll/my-payslips");
      setPayrolls(res.data.payrolls || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load payslips");
    }
  };

  return (
    <div className="flex">
      <EmployeeSidebar />

      <div className="md:ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            My Payslips
          </h1>

          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <h2 className="text-xl font-bold mb-4">Payslip History</h2>

            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="p-3 text-left">Month</th>
                    <th className="p-3 text-left">Basic</th>
                    <th className="p-3 text-left">Allowances</th>
                    <th className="p-3 text-left">Gross</th>
                    <th className="p-3 text-left">LOP</th>
                    <th className="p-3 text-left">PF</th>
                    <th className="p-3 text-left">PT</th>
                    <th className="p-3 text-left">Total Deduction</th>
                    <th className="p-3 text-left">Net Salary</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {payrolls.length === 0 ? (
                    <tr>
                      <td
                        colSpan="11"
                        className="text-center p-6 text-gray-500"
                      >
                        No payslips found
                      </td>
                    </tr>
                  ) : (
                    payrolls.map((payroll) => (
                      <tr key={payroll._id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{payroll.month}</td>
                        <td className="p-3">₹{payroll.basicSalary}</td>
                        <td className="p-3">₹{payroll.allowances}</td>
                        <td className="p-3">₹{payroll.grossSalary}</td>
                        <td className="p-3 text-red-600">
                          ₹{payroll.lopDeduction || 0}
                        </td>
                        <td className="p-3">₹{payroll.pfDeduction || 0}</td>
                        <td className="p-3">₹{payroll.professionalTax || 0}</td>
                        <td className="p-3">₹{payroll.totalDeductions || 0}</td>
                        <td className="p-3 font-bold text-green-700">
                          ₹{payroll.netSalary}
                        </td>
                        <td className="p-3">{payroll.status}</td>
                        <td className="p-3">
                          <button
                            onClick={() => generatePayslip(payroll)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
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

export default MyPayslips;