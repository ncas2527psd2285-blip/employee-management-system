import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch users");
    }
  };

  const resetPassword = async (id) => {
    const result = await Swal.fire({
      title: "Reset Password?",
      text: "Password will be reset to Welcome@123",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reset",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await api.put(`/users/${id}/reset-password`);
      toast.success(res.data.message || "Password reset successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: "This login account will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="md:ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-4 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            User Management
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">Total Users</p>
              <h2 className="text-2xl font-bold">{users.length}</h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">Admins / HR</p>
              <h2 className="text-2xl font-bold text-blue-600">
                {users.filter((u) => u.role === "admin" || u.role === "hr").length}
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500">Employees</p>
              <h2 className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.role === "employee").length}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">
              <h2 className="text-xl font-bold">Login Accounts</h2>

              <input
                type="text"
                placeholder="Search by name, email or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg p-3 w-full md:w-96"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[850px] w-full text-sm">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Created</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center p-6 text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3 capitalize">{user.role}</td>
                        <td className="p-3">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => resetPassword(user._id)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                            >
                              Reset
                            </button>

                            <button
                              onClick={() => deleteUser(user._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                            >
                              Delete
                            </button>
                          </div>
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

export default UserManagement;