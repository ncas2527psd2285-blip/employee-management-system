import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generatePayslip = (payroll) => {
  const doc = new jsPDF();

  const employee = payroll.employeeId || {};

  // Company Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(0, 102, 204);
  doc.text("ABC Technologies Pvt. Ltd.", 105, 18, { align: "center" });

  doc.setFontSize(11);
  doc.setTextColor(80);
  doc.text("Chennai, Tamil Nadu", 105, 25, { align: "center" });
  doc.text("Employee Salary Payslip", 105, 32, { align: "center" });

  // Line
  doc.setDrawColor(0, 102, 204);
  doc.line(15, 36, 195, 36);

  // Employee Details
  doc.setTextColor(0);
  doc.setFontSize(11);

  doc.text(`Employee ID : ${employee.employeeId || "N/A"}`, 15, 48);
  doc.text(`Employee Name : ${employee.name || "N/A"}`, 15, 56);
  doc.text(`Department : ${employee.department || "N/A"}`, 15, 64);
  doc.text(`Designation : ${employee.designation || "N/A"}`, 15, 72);

  doc.text(`Month : ${payroll.month || "N/A"}`, 120, 48);
  doc.text(`Status : ${payroll.status || "Generated"}`, 120, 56);

  // Salary Table
  autoTable(doc, {
    startY: 82,
    head: [["Description", "Amount"]],
    body: [
      ["Basic Salary", `Rs. ${payroll.basicSalary || 0}`],
      ["Allowances", `Rs. ${payroll.allowances || 0}`],
      ["Deductions", `Rs. ${payroll.deductions || 0}`],
      ["Net Salary", `Rs. ${payroll.netSalary || 0}`],
    ],
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: [255, 255, 255],
    },
    styles: {
      fontSize: 11,
    },
  });

  // Footer
  const y = doc.lastAutoTable.finalY + 20;

  doc.setFont("helvetica", "bold");
  doc.text("Authorized Signature", 140, y);

  doc.setFont("helvetica", "normal");
  doc.text("HR Department", 150, y + 8);

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    `Generated on: ${new Date().toLocaleDateString()}`,
    15,
    y + 20
  );

  doc.save(`${employee.employeeId || "Employee"}_Payslip.pdf`);
};

export default generatePayslip;