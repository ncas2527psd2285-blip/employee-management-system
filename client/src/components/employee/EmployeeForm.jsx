import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

function EmployeeForm({ onClose, refreshEmployees, employee = null }) {
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

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");

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

      setPreview(employee.profileImage || "");
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (photo) {
        data.append("photo", photo);
      }

      if (employee) {
        await api.put(`/employees/${employee._id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Employee Updated Successfully");
      } else {
        await api.post("/employees", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Employee Added Successfully");
      }

      refreshEmployees();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex flex-col items-center border rounded-lg p-4 bg-gray-50">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center mb-3">
              {preview ? (
                <img
                  src={preview}
                  alt="Employee"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>

            <label className="block font-semibold text-gray-700 mb-2">
              Employee Photo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="border rounded-lg p-2 w-full"
            />

            <p className="text-xs text-gray-500 mt-2">
              JPG, JPEG, or PNG only
            </p>
          </div>

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

          <div className="hidden md:block"></div>

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