import React, { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [task, setTask] = useState({
    matkul: "",
    desk: "",
    deadline: "",
  });

  const mataKuliah = [
    "Algoritma dan pemograman 2",
    "Bahasa Inggris",
    "Etika dalam AI",
    "Kalkulus Lanjut",
    "Matrix dan Ruang Vektor",
    "Organisasi dan Arsitektur Komputer",
    "Permodelan Basis Data",
    "Praktikum Algoritma Pemrograman",
  ];

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert deadline string to Firestore Timestamp
      const deadlineDate = new Date(task.deadline);
      await addDoc(collection(db, "tasks"), {
        ...task,
        deadline: Timestamp.fromDate(deadlineDate),
        createdBy: auth.currentUser.displayName || "Admin",
        createdAt: Timestamp.now(),
      });

      // Show confirmation popup
      if (
        window.confirm("Tugas berhasil ditambahkan! Kembali ke halaman utama?")
      ) {
        navigate("/");
      }

      // Reset form
      setTask({ matkul: "", desk: "", deadline: "" });
    } catch (error) {
      console.error("Error adding task: ", error);
      alert("Gagal menambahkan tugas: " + error.message);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel - Tambah Tugas</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={task.matkul}
          onChange={(e) => setTask({ ...task, matkul: e.target.value })}
          required
        >
          <option value="">Pilih Mata Kuliah</option>
          {mataKuliah.map((mk) => (
            <option key={mk} value={mk}>
              {mk}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Deskripsi"
          value={task.desk}
          onChange={(e) => setTask({ ...task, desk: e.target.value })}
        />
        <input
          type="datetime-local"
          value={task.deadline}
          onChange={(e) => setTask({ ...task, deadline: e.target.value })}
        />
        <button type="submit">Tambah Tugas</button>
      </form>
    </div>
  );
};

export default AdminPanel;
