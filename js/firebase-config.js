import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB6PagKQa4xQpyG43zaAwBn9k-emkbYVTw",
  authDomain: "employee-management-syst-a3293.firebaseapp.com",
  projectId: "employee-management-syst-a3293",
  storageBucket: "employee-management-syst-a3293.firebasestorage.app",
  messagingSenderId: "784910104251",
  appId: "1:784910104251:web:84786387e1b1fb1ad19b9e"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };