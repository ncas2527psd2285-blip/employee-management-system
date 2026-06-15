import { auth } from "./firebase-config.js";

import {
    signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const loginMessage = document.getElementById("loginMessage");

    if (email === "" || password === "") {
        loginMessage.textContent = "Please enter email and password";
        loginMessage.style.color = "red";
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);

        loginMessage.textContent = "Login successful";
        loginMessage.style.color = "green";

        window.location.href = "index.html";

    } catch (error) {
        loginMessage.textContent = "Invalid email or password";
        loginMessage.style.color = "red";
    }
});