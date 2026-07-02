import { useEffect, useState } from "react";
import api from "../services/api";
import EmployeeSidebar from "../components/EmployeeSidebar";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

function MyProfile() {
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/employees/me");
      setEmployee(res.data.employee);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load profile");
    }
  };

  if (!employee) {
    return (
      <div className="flex">
        <EmployeeSidebar />
        <div className="md:ml-64 flex-1">
          <Navbar />
          <div className="p-8">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <EmployeeSidebar />

      <div className="md:ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-4 md:p-8">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-5xl">
                👤
              </div>

              <div>
                <h2 className="text-2xl font-bold">{employee.name}</h2>
                <p className="text-gray-500">{employee.designation}</p>
                <p className="text-blue-600 font-medium">
                  {employee.department}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <label className="font-semibold text-gray-600">
                  Employee ID
                </label>
                <p>{employee.employeeId}</p>
              </div>

              <div>
                <label className="font-semibold text-gray-600">Email</label>
                <p>{employee.email}</p>
              </div>

              <div>
                <label className="font-semibold text-gray-600">Phone</label>
                <p>{employee.phone}</p>
              </div>

              <div>
                <label className="font-semibold text-gray-600">
                  Basic Salary
                </label>
                <p>₹ {employee.salary}</p>
              </div>

              <div>
                <label className="font-semibold text-gray-600">
                  Joining Date
                </label>
                <p>
                  {new Date(employee.joiningDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="font-semibold text-gray-600">Status</label>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {employee.status}
                </span>
              </div>

              <div>
                <label className="font-semibold text-gray-600">Gender</label>
                <p>{employee.gender || "-"}</p>
              </div>

              <div>
                <label className="font-semibold text-gray-600">
                  Emergency Contact
                </label>
                <p>{employee.emergencyContact || "-"}</p>
              </div>

              <div className="md:col-span-2">
                <label className="font-semibold text-gray-600">Address</label>
                <p>{employee.address || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;