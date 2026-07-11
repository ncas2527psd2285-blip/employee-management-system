import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function Reports() {

  const [attendance, setAttendance] = useState([]);

  const [date, setDate] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");


  useEffect(() => {
    fetchReport();
  }, []);



  const fetchReport = async () => {

    try {

      const params = {};


      if (date) {
        params.date = date;
      }


      if (department !== "All") {
        params.department = department;
      }


      if (status !== "All") {
        params.status = status;
      }



      const res = await api.get("/attendance/report", {
        params
      });


      setAttendance(res.data.attendance || []);


    } catch (err) {

      console.log(
        "Report fetch error:",
        err.response?.data || err.message
      );

    }

  };





  const filteredAttendance = attendance.filter((item)=>{


    const employee =
      item.employeeId?.employeeId || "";

    const name =
      item.employeeId?.name || "";

    const dept =
      item.employeeId?.department || "";

    const stat =
      item.status || "";



    return (
      `${employee} ${name} ${dept} ${stat}`
      .toLowerCase()
      .includes(search.toLowerCase())
    );


  });





  const exportToExcel = ()=>{


    const data = filteredAttendance.map(item=>({

      "Employee ID":
      item.employeeId?.employeeId,


      Name:
      item.employeeId?.name,


      Department:
      item.employeeId?.department,


      Designation:
      item.employeeId?.designation,


      Date:
      item.date,


      "Check In":
      item.checkIn || "-",


      "Check Out":
      item.checkOut || "-",


      "Working Hours":
      item.workingHours || "-",


      Status:
      item.status


    }));


    const worksheet =
    XLSX.utils.json_to_sheet(data);


    const workbook =
    XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Attendance Report"
    );


    XLSX.writeFile(
      workbook,
      "attendance_report.xlsx"
    );


  };





  return (

    <div className="flex">


      <Sidebar/>


      <div className="md:ml-64 flex-1 bg-gray-100 min-h-screen">


        <Navbar/>


        <div className="p-4 md:p-8">


          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Attendance Reports
          </h1>





          <div className="bg-white rounded-xl shadow p-4 md:p-6 mb-6">


          <h2 className="text-lg font-bold mb-4">
            Report Filters
          </h2>



          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">


          <input
            type="date"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
            className="border p-3 rounded"
          />



          <select
            value={department}
            onChange={(e)=>setDepartment(e.target.value)}
            className="border p-3 rounded"
          >

          <option value="All">
            All Departments
          </option>

          <option value="IT">
            IT
          </option>

          <option value="HR">
            HR
          </option>

          <option value="Sales">
            Sales
          </option>

          <option value="Finance">
            Finance
          </option>

          <option value="Marketing">
            Marketing
          </option>

          <option value="Operations">
            Operations
          </option>


          </select>




          <select
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
            className="border p-3 rounded"
          >

          <option value="All">
            All Status
          </option>

          <option value="Present">
            Present
          </option>

          <option value="Late">
            Late
          </option>

          <option value="Half Day">
            Half Day
          </option>

          <option value="Absent">
            Absent
          </option>


          </select>





          <button
            onClick={fetchReport}
            className="bg-blue-600 text-white rounded px-4 py-3"
          >
            Generate Report
          </button>



          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white rounded px-4 py-3"
          >
            Export Excel
          </button>



          </div>


          </div>






          <div className="bg-white rounded-xl shadow p-4 md:p-6">


          <h2 className="font-bold text-xl mb-4">

            Report Result ({filteredAttendance.length})

          </h2>





          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="border p-3 rounded w-full md:w-1/2 mb-4"
          />





          <div className="overflow-x-auto">


          <table className="min-w-[950px] w-full text-sm">


          <thead>

          <tr className="bg-blue-600 text-white">


          <th className="p-3">Employee ID</th>
          <th className="p-3">Name</th>
          <th className="p-3">Department</th>
          <th className="p-3">Designation</th>
          <th className="p-3">Date</th>
          <th className="p-3">Check In</th>
          <th className="p-3">Check Out</th>
          <th className="p-3">Hours</th>
          <th className="p-3">Status</th>


          </tr>


          </thead>




          <tbody>


          {
          filteredAttendance.length===0 ?


          <tr>

          <td
          colSpan="9"
          className="text-center p-6 text-gray-500"
          >

          No report data found

          </td>

          </tr>


          :


          filteredAttendance.map(item=>(


          <tr
          key={item._id}
          className="border-b"
          >


          <td className="p-3">
          {item.employeeId?.employeeId}
          </td>


          <td className="p-3">
          {item.employeeId?.name}
          </td>


          <td className="p-3">
          {item.employeeId?.department}
          </td>


          <td className="p-3">
          {item.employeeId?.designation}
          </td>


          <td className="p-3">
          {item.date}
          </td>


          <td className="p-3">
          {item.checkIn || "-"}
          </td>


          <td className="p-3">
          {item.checkOut || "-"}
          </td>


          <td className="p-3">
          {item.workingHours || "-"}
          </td>


          <td className="p-3">
          {item.status}
          </td>


          </tr>


          ))

          }



          </tbody>


          </table>


          </div>


          </div>


        </div>


      </div>


    </div>


  );

}


export default Reports;