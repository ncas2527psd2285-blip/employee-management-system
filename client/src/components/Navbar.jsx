import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Logout",
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="bg-white shadow px-8 py-4 flex justify-between items-center">

      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Employee Management System
        </h2>
        <p className="text-gray-500 text-sm">
          Admin Dashboard
        </p>
      </div>

      <div className="flex items-center gap-5">

        <div className="text-right">
          <p className="font-semibold text-gray-800">
            {user?.name || "Admin"}
          </p>

          <p className="text-sm text-gray-500">
            {user?.role || "Administrator"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Navbar;