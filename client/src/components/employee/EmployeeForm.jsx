import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

function EmployeeForm({
  onClose,
  refreshEmployees,
  employee = null,
}) {
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
    joiningDate: "",
    status: "Active",
  });

  // ============================
  // Fill form while editing
  // ============================
  useEffect(() => {
    if (employee) {
      setFormData({
        employeeId: employee.employeeId || "",
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        department: employee.department || "",
        designation: employee.designation || "",
        salary: employee.salary || "",
        joiningDate: employee.joiningDate
          ? employee.joiningDate.substring(0, 10)
          : "",
        status: employee.status || "Active",
      });
    }
  }, [employee]);

  // ============================
  // Handle Input
  // ============================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ============================
  // Submit Form
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (employee) {
        // Update Employee
        await api.put(`/employees/${employee._id}`, formData);

        toast.success("Employee Updated Successfully");
      } else {
        // Add Employee
        await api.post("/employees", formData);

        toast.success("Employee Added Successfully");
      }

      refreshEmployees();
      onClose();
    } catch (error) {
      toast.error(
  error.response?.data?.message || "Something went wrong"
);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-8">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            {employee ? "Edit Employee" : "Add Employee"}
          </h2>

          <button
            onClick={onClose}
            className="text-2xl font-bold text-gray-600 hover:text-red-600"
          >
            ×
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4"
        >

          <input
            type="text"
            name="employeeId"
            placeholder="Employee ID"
            value={formData.employeeId}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="name"
            placeholder="Employee Name"
            value={formData.name}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="text"
            name="designation"
            placeholder="Designation"
            value={formData.designation}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border rounded-lg p-3"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <div></div>

          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {employee ? "Update Employee" : "Save Employee"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default EmployeeForm;