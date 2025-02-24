import React, { useEffect, useState } from "react";
import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isTaskValid = (deadline) => {
    if (!deadline || typeof deadline.toDate !== "function") {
      return false;
    }
    try {
      const now = new Date();
      return deadline.toDate() > now;
    } catch (error) {
      console.error("Error validating task deadline:", error);
      return false;
    }
  };

  const deleteExpiredTasks = async (expiredTasks) => {
    for (const task of expiredTasks) {
      try {
        await deleteDoc(doc(db, "tasks", task.id));
      } catch (error) {
        console.error("Error deleting expired task:", error);
      }
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const q = query(collection(db, "tasks"));
        const querySnapshot = await getDocs(q);
        const taskList = [];
        const expiredTasks = [];

        querySnapshot.forEach((doc) => {
          const taskData = doc.data();
          // Validate task data
          if (taskData && taskData.deadline) {
            const task = { id: doc.id, ...taskData };
            if (isTaskValid(task.deadline)) {
              taskList.push(task);
            } else {
              expiredTasks.push(task);
            }
          } else {
            console.warn(`Task ${doc.id} has invalid data:`, taskData);
          }
        });

        if (expiredTasks.length > 0) {
          await deleteExpiredTasks(expiredTasks);
        }

        // Sort tasks by deadline
        taskList.sort((a, b) => {
          try {
            return a.deadline.toDate() - b.deadline.toDate();
          } catch (error) {
            console.error("Error sorting tasks:", error);
            return 0;
          }
        });

        setTasks(taskList);
      } catch (err) {
        setError("Gagal memuat daftar tugas. Silakan coba lagi nanti.");
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">Memuat...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="task-list">
      <div className="task-header">
        <h2>Daftar Tugas</h2>
        <div className="button-group">
          {user ? (
            <>
              <button className="back-btn" onClick={() => navigate("/")}>
                Kembali
              </button>
              <button
                className="add-task-btn"
                onClick={() => navigate("/admin")}
              >
                Tambah Tugas
              </button>
            </>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login Admin
            </button>
          )}
        </div>
      </div>
      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <h3>{task.matkul}</h3>
          <p>{task.desk}</p>
          <p>Deadline: {task.deadline.toDate().toLocaleString()}</p>
          <p className="task-creator">Ditambahkan oleh: {task.createdBy}</p>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
