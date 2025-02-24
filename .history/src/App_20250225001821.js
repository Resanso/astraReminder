import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import TaskList from "./components/TaskList";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Router basename="/">
      <div className="App">
        <header>
          <h1>Astra Domini</h1>
          {user && (
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <svg
                className="logout-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}
        </header>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route
            path="/admin"
            element={user ? <AdminPanel /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/admin" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/admin" /> : <Register />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
