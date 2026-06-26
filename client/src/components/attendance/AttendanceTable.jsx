function AttendanceTable({
  employees,
  onCheckIn,
}) {
  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        No Employees Found
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
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp._id}
              className="border-b hover:bg-gray-50"
            >
              <td className="p-3">{emp.employeeId}</td>
              <td className="p-3">{emp.name}</td>
              <td className="p-3">{emp.department}</td>
              <td className="p-3">{emp.designation}</td>

              <td className="p-3">
                <span className="bg-gray-500 text-white px-3 py-1 rounded-full">
                  Not Marked
                </span>
              </td>

              <td className="p-3">
                <button
                  onClick={() => onCheckIn(emp)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Check In
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceTable;