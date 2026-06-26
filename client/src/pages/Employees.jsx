import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import EmployeeTable from "../components/employee/EmployeeTable";
import EmployeeForm from "../components/employee/EmployeeForm";
import EmployeeStats from "../components/employee/EmployeeStats";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

const [currentPage, setCurrentPage] = useState(1);
const employeesPerPage = 5;

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ============================
  // Fetch Employees
  // ============================
  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");

      setEmployees(response.data.employees);
      setFilteredEmployees(response.data.employees);
    } catch (error) {
      console.error(error);
    }
  };

  // ============================
  // Search Employees
  // ============================
  useEffect(() => {
    const result = employees.filter((emp) => {
      return (
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase())
      );
    });

    setFilteredEmployees(result);
  }, [search, employees]);

// ============================
// Pagination
// ============================
const indexOfLastEmployee = currentPage * employeesPerPage;
const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;

const currentEmployees = filteredEmployees.slice(
  indexOfFirstEmployee,
  indexOfLastEmployee
);

const totalPages = Math.ceil(
  filteredEmployees.length / employeesPerPage
);

  // ============================
  // Add Employee
  // ============================
  const handleAdd = () => {
    setSelectedEmployee(null);
    setShowForm(true);
  };

  // ============================
  // Edit Employee
  // ============================
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  // ============================
  // Delete Employee
  // ============================
  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Delete Employee?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, Delete",
  });

  if (!result.isConfirmed) return;

  try {
    await api.delete(`/employees/${id}`);

    toast.success("Employee Deleted Successfully");

    fetchEmployees();
  } catch (error) {
    toast.error(error.response?.data?.message || "Delete Failed");
  }
};

  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">
              Employee Management
            </h1>

            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              + Add Employee
            </button>
          </div>

          {/* Employee Statistics */}
          <EmployeeStats employees={employees} />

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by Name, Employee ID, Email or Department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 border rounded-lg p-3"
            />
          </div>

          {/* Employee Table */}
          <EmployeeTable
  employees={currentEmployees}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>

<div className="flex justify-center items-center gap-2 mt-6">
  <button
    onClick={() => setCurrentPage((prev) => prev - 1)}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
  >
    Previous
  </button>

  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index}
      onClick={() => setCurrentPage(index + 1)}
      className={`px-4 py-2 rounded ${
        currentPage === index + 1
          ? "bg-blue-600 text-white"
          : "bg-gray-200"
      }`}
    >
      {index + 1}
    </button>
  ))}

  <button
    onClick={() => setCurrentPage((prev) => prev + 1)}
    disabled={currentPage === totalPages || totalPages === 0}
    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

          {/* Employee Form */}
          {showForm && (
            <EmployeeForm
              employee={selectedEmployee}
              onClose={() => setShowForm(false)}
              refreshEmployees={fetchEmployees}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default Employees;