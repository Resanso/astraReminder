import React, { useState, useEffect } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const Admin = () => {
  const [formData, setFormData] = useState({
    matkul: "",
    desk: "",
    deadline: "",
  });
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Validate form data
      if (!formData.matkul || !formData.desk || !formData.deadline) {
        setError("Semua field harus diisi");
        return;
      }

      // Create new task document
      const taskData = {
        matkul: formData.matkul,
        desk: formData.desk,
        deadline: Timestamp.fromDate(new Date(formData.deadline)),
        createdBy: user.email,
        createdAt: Timestamp.now(),
      };

      // Add document to tasks collection
      const docRef = await addDoc(collection(db, "tasks"), taskData);

      if (docRef.id) {
        setSuccess("Tugas berhasil ditambahkan!");
        setFormData({ matkul: "", desk: "", deadline: "" });
      }
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Gagal menambahkan tugas. Silakan coba lagi.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="admin-container">
      <h2>Tambah Tugas Baru</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mata Kuliah:</label>
          <input
            type="text"
            name="matkul"
            value={formData.matkul}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Deskripsi:</label>
          <textarea name="desk" value={formData.desk} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Deadline:</label>
          <input
            type="datetime-local"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>

        <div className="button-container">
          <button type="submit" className="submit-btn">
            Tambah Tugas
          </button>
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/tasks")}
          >
            Kembali
          </button>
        </div>
      </form>
      <style jsx>{`
        .button-container {
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin-top: 20px;
        }
        .submit-btn,
        .back-btn {
          padding: 10px 20px;
          min-width: 120px;
        }
      `}</style>
    </div>
  );
};

export default Admin;
