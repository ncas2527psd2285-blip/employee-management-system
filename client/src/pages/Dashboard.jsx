import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


function Dashboard() {

  const [stats, setStats] = useState(null);


  useEffect(() => {
    fetchDashboardStats();
  }, []);


  const fetchDashboardStats = async () => {
    try {

      const res = await api.get("/dashboard");

      setStats(res.data);

    } catch (error) {

      console.log(
        "Dashboard Error:",
        error.response?.data || error.message
      );

      toast.error("Unable to load dashboard");

    }
  };


  const StatCard = ({ title, value, icon, color }) => (

    <div className="bg-white p-4 md:p-6 rounded-xl shadow">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className={`text-3xl font-bold mt-2 ${color}`}>
            {value ?? 0}
          </h2>

        </div>

        <div className="text-4xl">
          {icon}
        </div>

      </div>

    </div>

  );


  const departmentChartData =
    stats?.departmentStats?.map(item => ({

      name: item._id,
      employees: item.count

    })) || [];


  const leaveChartData = [

    {
      name: "Pending",
      value: stats?.pendingLeaves || 0
    },

    {
      name: "Approved",
      value: stats?.approvedLeaves || 0
    },

    {
      name: "Rejected",
      value: stats?.rejectedLeaves || 0
    }

  ];


  const leaveColors = [
    "#FACC15",
    "#22C55E",
    "#EF4444"
  ];


  return (

    <div className="flex">


      <Sidebar />


      <div className="md:ml-64 flex-1 bg-gray-100 min-h-screen">


        <Navbar />


        <div className="p-4 md:p-8">


          <div className="mb-8">

            <h1 className="text-3xl font-bold text-gray-800">
              HR Management Dashboard
            </h1>


            <p className="text-gray-500 mt-2">
              Overview of employees, attendance, leaves and departments
            </p>

          </div>


          {!stats ? (

            <p className="text-gray-600">
              Loading dashboard...
            </p>

          ) : (

          <>


          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">


            <StatCard
              title="Total Employees"
              value={stats.totalEmployees}
              icon="👥"
              color="text-gray-800"
            />


            <StatCard
              title="Active Employees"
              value={stats.activeEmployees}
              icon="🟢"
              color="text-blue-600"
            />


            <StatCard
              title="Present Today"
              value={stats.presentToday}
              icon="✅"
              color="text-green-600"
            />


            <StatCard
              title="Absent Today"
              value={stats.absentToday}
              icon="❌"
              color="text-red-600"
            />


            <StatCard
              title="Late Today"
              value={stats.lateToday}
              icon="⏰"
              color="text-yellow-600"
            />


            <StatCard
              title="Half Day"
              value={stats.halfDayToday}
              icon="🌓"
              color="text-orange-600"
            />


            <StatCard
              title="Completed Today"
              value={stats.completedToday}
              icon="🏁"
              color="text-purple-600"
            />


            <StatCard
              title="Average Hours"
              value={stats.averageWorkingHours}
              icon="📊"
              color="text-indigo-600"
            />


            <StatCard
              title="Pending Leaves"
              value={stats.pendingLeaves}
              icon="🕒"
              color="text-yellow-600"
            />


            <StatCard
              title="Approved Leaves"
              value={stats.approvedLeaves}
              icon="✅"
              color="text-green-600"
            />


            <StatCard
              title="Rejected Leaves"
              value={stats.rejectedLeaves}
              icon="❌"
              color="text-red-600"
            />


          </div>





          <div className="grid lg:grid-cols-2 gap-6 mb-8">


          <div className="bg-white p-6 rounded-xl shadow">


          <h2 className="text-xl font-bold mb-4">
            Employees by Department
          </h2>


          <ResponsiveContainer width="100%" height={300}>


          <BarChart data={departmentChartData}>


          <XAxis dataKey="name"/>

          <YAxis/>

          <Tooltip/>


          <Bar
            dataKey="employees"
            fill="#2563EB"
          />


          </BarChart>


          </ResponsiveContainer>


          </div>





          <div className="bg-white p-6 rounded-xl shadow">


          <h2 className="text-xl font-bold mb-4">
            Leave Status
          </h2>


          <ResponsiveContainer width="100%" height={300}>


          <PieChart>


          <Pie
            data={leaveChartData}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >


          {
            leaveChartData.map((item,index)=>(

              <Cell
                key={index}
                fill={leaveColors[index]}
              />

            ))
          }


          </Pie>


          <Tooltip/>


          </PieChart>


          </ResponsiveContainer>


          </div>


          </div>


          </>

          )}

        </div>


      </div>


    </div>

  );

}


export default Dashboard;