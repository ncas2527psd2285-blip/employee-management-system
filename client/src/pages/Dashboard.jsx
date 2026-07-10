// Cleaned Dashboard.jsx template
import { useEffect, useState } from "react";
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell } from "recharts";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Dashboard(){
 const [stats,setStats]=useState(null);
 useEffect(()=>{fetchDashboardStats();},[]);
 const fetchDashboardStats=async()=>{
  try{
   const res=await api.get("/dashboard");
   setStats(res.data);
  }catch(err){
   console.log(err.message);
  }
 };
 return (
  <div className="flex">
   <Sidebar/>
   <div className="md:ml-64 flex-1 bg-gray-100 min-h-screen">
    <Navbar/>
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-500 mt-1">Welcome to the Employee Management System</p>
      {/* Paste the rest of your existing cards, charts and recent attendance here.
          Remove generateJuneData() and all related buttons/imports. */}
    </div>
   </div>
  </div>
 );
}
export default Dashboard;
