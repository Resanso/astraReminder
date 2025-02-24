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
          <h1>Website Kelas</h1>
          {user && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
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
