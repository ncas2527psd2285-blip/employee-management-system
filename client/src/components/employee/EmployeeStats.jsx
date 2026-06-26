function EmployeeStats({ employees }) {
  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (emp) => emp.status === "Active"
  ).length;

  const inactiveEmployees = employees.filter(
    (emp) => emp.status === "Inactive"
  ).length;

  const departments = new Set(
    employees.map((emp) => emp.department)
  ).size;

  const cards = [
    {
      title: "Total Employees",
      value: totalEmployees,
      color: "bg-blue-500",
      icon: "👥",
    },
    {
      title: "Active",
      value: activeEmployees,
      color: "bg-green-500",
      icon: "✅",
    },
    {
      title: "Inactive",
      value: inactiveEmployees,
      color: "bg-red-500",
      icon: "❌",
    },
    {
      title: "Departments",
      value: departments,
      color: "bg-purple-500",
      icon: "🏢",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">{card.title}</p>

              <h2 className="text-3xl font-bold mt-2">
                {card.value}
              </h2>
            </div>

            <div
              className={`${card.color} text-white text-3xl w-16 h-16 rounded-full flex items-center justify-center`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EmployeeStats;