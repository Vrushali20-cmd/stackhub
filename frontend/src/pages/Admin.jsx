import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Admin.css";

function Admin() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMsg("");

    try {
      const token = localStorage.getItem("accessToken");

      await api.post(
        "/topics",
        {
          title,
          content,
          difficulty,
          categoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMsg("Topic added successfully ✅");

      setTitle("");
      setContent("");
      setDifficulty("easy");
      setCategoryId("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add topic");
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>

      <form onSubmit={handleSubmit} className="admin-form">
        {msg && <p className="success">{msg}</p>}
        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Topic Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Content"
          value={content}
          required
          onChange={(e) => setContent(e.target.value)}
        />

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          value={categoryId}
          required
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button>Add Topic</button>
      </form>
    </div>
  );
}

export default Admin;
