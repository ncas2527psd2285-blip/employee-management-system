function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}) {
  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No employees found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full">

        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3">Employee ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Department</th>
            <th className="p-3">Designation</th>
            <th className="p-3">Salary</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>

          {employees.map((emp) => (
            <tr
              key={emp._id}
              className="border-b hover:bg-gray-50"
            >
              <td className="p-3">{emp.employeeId}</td>

              <td className="p-3 font-medium">
                {emp.name}
              </td>

              <td className="p-3">
                {emp.department}
              </td>

              <td className="p-3">
                {emp.designation}
              </td>

              <td className="p-3">
                ₹{emp.salary}
              </td>

              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm text-white ${
                    emp.status === "Active"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {emp.status}
                </span>
              </td>

              <td className="p-3">

                <div className="flex gap-2">

                  <button
                    onClick={() => onEdit(emp)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(emp._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </div>

              </td>
            </tr>
          ))}

        </tbody>

      </table>
    </div>
  );
}

export default EmployeeTable;