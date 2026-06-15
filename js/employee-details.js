import { db, auth } from "./firebase-config.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const employeeDetails = document.getElementById("employeeDetails");

const params = new URLSearchParams(window.location.search);
const employeeId = params.get("id");

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    if (!employeeId) {
        employeeDetails.innerHTML = "<p>Employee ID not found.</p>";
        return;
    }

    try {
        const employeeRef = doc(db, "employees", employeeId);
        const employeeSnap = await getDoc(employeeRef);

        if (!employeeSnap.exists()) {
            employeeDetails.innerHTML = "<p>Employee not found.</p>";
            return;
        }

        const employee = employeeSnap.data();

        employeeDetails.innerHTML = `
            <p><strong>Name:</strong> ${employee.name || ""}</p>
            <p><strong>Email:</strong> ${employee.email || ""}</p>
            <p><strong>Mobile:</strong> ${employee.mobile || ""}</p>
            <p><strong>Department:</strong> ${employee.department || ""}</p>
            <p><strong>Qualification:</strong> ${employee.qualification || ""}</p>
        `;

    } catch (error) {
        console.error(error);
        employeeDetails.innerHTML = "<p>Error loading employee details.</p>";
    }
});