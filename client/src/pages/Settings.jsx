import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import EmployeeSidebar from "../components/EmployeeSidebar";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function Settings() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const SidebarComponent = role === "employee" ? EmployeeSidebar : Sidebar;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const res = await api.put("/auth/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success(res.data.message || "Password changed successfully");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Logout",
    });

    if (!result.isConfirmed) return;

    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex">
      <SidebarComponent />

      <div className="md:ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Account Settings
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-4xl">
                  👤
                </div>

                <h2 className="text-xl font-bold mt-4">
                  {user?.name || "User"}
                </h2>

                <p className="text-gray-500 capitalize">
                  {role || "user"}
                </p>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-right">
                    {user?.email || "-"}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Role</span>
                  <span className="font-medium capitalize">
                    {role || "-"}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
              >
                Logout
              </button>
            </div>

            <div className="bg-white rounded-xl shadow p-6 lg:col-span-2">
              <h2 className="text-xl font-bold mb-4">
                Change Password
              </h2>

              <form onSubmit={changePassword} className="space-y-4">
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Current Password"
                  required
                  className="w-full border p-3 rounded-lg"
                />

                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="New Password"
                  required
                  className="w-full border p-3 rounded-lg"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                  required
                  className="w-full border p-3 rounded-lg"
                />

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg w-full md:w-auto"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;