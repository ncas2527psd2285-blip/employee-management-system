import { db, auth } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    addDoc,
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

console.log("register.js loaded");

// Elements
const searchInput = document.getElementById("searchInput");
const departmentFilter = document.getElementById("departmentFilter");
const logoutBtn = document.getElementById("logoutBtn");
const exportBtn = document.getElementById("exportBtn");
const clearFilterBtn = document.getElementById("clearFilterBtn");
const sortFilter = document.getElementById("sortFilter");

if (clearFilterBtn) {
    clearFilterBtn.addEventListener("click", () => {
        if (searchInput) {
            searchInput.value = "";
        }

        if (departmentFilter) {
            departmentFilter.value = "";
        }

        displayEmployees(employeeData);

        showToast("Filters cleared", "success");
    });
}

// Global Variables
let employeeData = [];
let editEmployeeId = null;

// Toast Message
function showToast(message, type) {
    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

// Form Validation
function validateForm(name, email, mobile, department, qualification) {
    const namePattern = /^[A-Za-z\s]{3,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^[6-9]\d{9}$/;

    if (!namePattern.test(name)) {
        showToast("Name must contain only letters and at least 3 characters", "error");
        return false;
    }

    if (!emailPattern.test(email)) {
        showToast("Please enter a valid email address", "error");
        return false;
    }

    if (!mobilePattern.test(mobile)) {
        showToast("Mobile number must be 10 digits and start with 6, 7, 8, or 9", "error");
        return false;
    }

    if (department === "") {
        showToast("Please enter department", "error");
        return false;
    }

    if (qualification === "") {
        showToast("Please enter qualification", "error");
        return false;
    }

    return true;
}

// Load Employees
async function loadEmployees() {
    const tableBody = document.getElementById("employeeTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";
    employeeData = [];

    try {
        const querySnapshot = await getDocs(collection(db, "employees"));

        querySnapshot.forEach((documentItem) => {
            const employee = {
                id: documentItem.id,
                ...documentItem.data()
            };

            employeeData.push(employee);
        });

        displayEmployees(employeeData);
        updateDashboardCards();
        updateDepartmentFilter();

    } catch (error) {
        console.error("Error loading employees:", error);
        showToast("Error loading employees", "error");
    }
}

// Display Employees
function displayEmployees(data) {
    const tableBody = document.getElementById("employeeTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    data.forEach((employee) => {
        tableBody.innerHTML += `
        <tr>
            <td>${employee.name || ""}</td>
            <td>${employee.email || ""}</td>
            <td>${employee.mobile || ""}</td>
            <td>
                <span class="department-badge">
                    ${employee.department || ""}
                </span>
            </td>
            <td>${employee.qualification || ""}</td>
            <td>
                <button onclick="viewEmployee('${employee.id}')">
                    View
                </button>

                <button onclick="editEmployee('${employee.id}')">
                    Edit
                </button>

                <button onclick="deleteEmployee('${employee.id}')">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });
}

// View Employee
window.viewEmployee = function(id) {
    window.location.href = `employee-details.html?id=${id}`;
};

// Edit Employee
window.editEmployee = async function(id) {
    try {
        const employeeRef = doc(db, "employees", id);
        const employeeSnap = await getDoc(employeeRef);

        if (!employeeSnap.exists()) {
            showToast("Employee not found", "error");
            return;
        }

        const employee = employeeSnap.data();

        document.getElementById("name").value = employee.name || "";
        document.getElementById("email").value = employee.email || "";
        document.getElementById("mobile").value = employee.mobile || "";
        document.getElementById("department").value = employee.department || "";
        document.getElementById("qualification").value = employee.qualification || "";

        editEmployeeId = id;

        document.getElementById("registerBtn").textContent = "Update Employee";

        showToast("Edit mode enabled", "success");

    } catch (error) {
        console.error(error);
        showToast(error.message, "error");
    }
};

// Delete Employee
window.deleteEmployee = async function(id) {
    const confirmDelete = confirm("Are you sure you want to delete this employee?");

    if (!confirmDelete) return;

    try {
        await deleteDoc(doc(db, "employees", id));

        showToast("Employee deleted successfully", "success");

        loadEmployees();

    } catch (error) {
        console.error(error);
        showToast(error.message, "error");
    }
};

// Apply Search + Department Filter
function applyFilters() {
    const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
    const departmentValue = departmentFilter ? departmentFilter.value : "";
    const sortValue = sortFilter ? sortFilter.value : "";

    let filteredEmployees = employeeData.filter((employee) => {
        const matchesSearch =
            (employee.name || "").toLowerCase().includes(searchValue) ||
            (employee.email || "").toLowerCase().includes(searchValue) ||
            (employee.mobile || "").toLowerCase().includes(searchValue) ||
            (employee.department || "").toLowerCase().includes(searchValue) ||
            (employee.qualification || "").toLowerCase().includes(searchValue);

        const matchesDepartment =
            departmentValue === "" ||
            (employee.department || "").toLowerCase() === departmentValue;

        return matchesSearch && matchesDepartment;
    });

    if (sortValue === "nameAsc") {
        filteredEmployees.sort((a, b) =>
            (a.name || "").localeCompare(b.name || "")
        );
    }

    if (sortValue === "nameDesc") {
        filteredEmployees.sort((a, b) =>
            (b.name || "").localeCompare(a.name || "")
        );
    }

    if (sortValue === "latest") {
        filteredEmployees.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return dateB - dateA;
        });
    }

    if (sortValue === "oldest") {
        filteredEmployees.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return dateA - dateB;
        });
    }

    displayEmployees(filteredEmployees);
}
if (sortFilter) {
    sortFilter.addEventListener("change", applyFilters);
}

if (sortFilter) {
    sortFilter.value = "";
}

if (searchInput) {
    searchInput.addEventListener("keyup", applyFilters);
}

if (departmentFilter) {
    departmentFilter.addEventListener("change", applyFilters);
}

// Register / Update Employee
document.getElementById("registerBtn")
.addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const department = document.getElementById("department").value.trim();
    const qualification = document.getElementById("qualification").value.trim();

    if (!validateForm(name, email, mobile, department, qualification)) {
        return;
    }

    const existingEmployee = employeeData.find((employee) => {
        return (
            employee.email &&
            employee.email.toLowerCase() === email.toLowerCase() &&
            employee.id !== editEmployeeId
        );
    });

    if (existingEmployee) {
        showToast("Email already exists", "error");
        return;
    }

    try {
        if (editEmployeeId) {
            await updateDoc(
                doc(db, "employees", editEmployeeId),
                {
                    name,
                    email,
                    mobile,
                    department,
                    qualification
                }
            );

            showToast("Employee updated successfully", "success");

            editEmployeeId = null;
            document.getElementById("registerBtn").textContent = "Register Employee";

        } else {
            await addDoc(
                collection(db, "employees"),
                {
                    name,
                    email,
                    mobile,
                    department,
                    qualification,
                    createdAt: new Date()
                }
            );

            showToast("Employee registered successfully", "success");
        }

        clearForm();
        loadEmployees();

    } catch (error) {
        console.error(error);
        showToast(error.message, "error");
    }
});

// Clear Form
function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("department").value = "";
    document.getElementById("qualification").value = "";
}

// Dashboard Cards
function updateDashboardCards() {
    const totalEmployeesCard = document.getElementById("totalEmployees");
    const totalDepartmentsCard = document.getElementById("totalDepartments");
    const newEmployeesCard = document.getElementById("newEmployees");

    if (!totalEmployeesCard || !totalDepartmentsCard || !newEmployeesCard) return;

    const totalEmployees = employeeData.length;

    const departments = employeeData.map((employee) =>
        employee.department ? employee.department.toLowerCase() : ""
    );

    const uniqueDepartments = new Set(
        departments.filter((department) => department !== "")
    );

    const today = new Date().toDateString();

    const newEmployees = employeeData.filter((employee) => {
        if (!employee.createdAt) return false;

        const createdDate = employee.createdAt.toDate
            ? employee.createdAt.toDate()
            : new Date(employee.createdAt);

        return createdDate.toDateString() === today;
    }).length;

    totalEmployeesCard.textContent = totalEmployees;
    totalDepartmentsCard.textContent = uniqueDepartments.size;
    newEmployeesCard.textContent = newEmployees;
}

// Department Filter Dropdown
function updateDepartmentFilter() {
    if (!departmentFilter) return;

    departmentFilter.innerHTML = `<option value="">All Departments</option>`;

    const departments = [
        ...new Set(
            employeeData
                .map(employee => employee.department)
                .filter(department => department)
        )
    ];

    departments.forEach((department) => {
        departmentFilter.innerHTML += `
            <option value="${department.toLowerCase()}">
                ${department}
            </option>
        `;
    });
}

// Export Employees
if (exportBtn) {
    exportBtn.addEventListener("click", () => {
        let csvContent = "Name,Email,Mobile,Department,Qualification\n";

        employeeData.forEach((employee) => {
            csvContent += `${employee.name || ""},${employee.email || ""},${employee.mobile || ""},${employee.department || ""},${employee.qualification || ""}\n`;
        });

        const blob = new Blob([csvContent], {
            type: "text/csv"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "employee-report.csv";
        link.click();

        URL.revokeObjectURL(url);

        showToast("Employee report exported successfully", "success");
    });
}

// Authentication Check
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadEmployees();
    } else {
        window.location.href = "login.html";
    }
});

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.href = "login.html";
        } catch (error) {
            console.error(error);
            showToast("Logout failed", "error");
        }
    });
}