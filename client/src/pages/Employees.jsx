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

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");

      setEmployees(response.data.employees || []);
      setFilteredEmployees(response.data.employees || []);
    } catch (error) {
      console.log("Employees fetch error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch employees");
    }
  };

  useEffect(() => {
    const result = employees.filter((emp) => {
      return (
        emp.name?.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
        emp.email?.toLowerCase().includes(search.toLowerCase()) ||
        emp.department?.toLowerCase().includes(search.toLowerCase())
      );
    });

    setFilteredEmployees(result);
    setCurrentPage(1);
  }, [search, employees]);

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;

  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handleAdd = () => {
    setSelectedEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

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

      <div className="md:ml-64 flex-1 bg-gray-100 min-h-screen">
        <Navbar />

        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              Employee Management
            </h1>

            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg w-full md:w-auto"
            >
              + Add Employee
            </button>
          </div>

          <EmployeeStats employees={employees} />

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by Name, Employee ID, Email or Department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 border rounded-lg p-3"
            />
          </div>

          <div className="overflow-x-auto">
            <EmployeeTable
              employees={currentEmployees}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="px-3 md:px-4 py-2 bg-gray-300 rounded disabled:opacity-50 text-sm md:text-base"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 md:px-4 py-2 rounded text-sm md:text-base ${
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
              className="px-3 md:px-4 py-2 bg-gray-300 rounded disabled:opacity-50 text-sm md:text-base"
            >
              Next
            </button>
          </div>

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