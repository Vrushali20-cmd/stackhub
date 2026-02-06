import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Categories.css";

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories")
      .then(res => setCategories(res.data.categories))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="categories-container">
      <h2>Explore Categories</h2>

      <div className="categories-grid">
        {categories.map(cat => (
          <Link
            key={cat._id}
            to={`/topics/${cat._id}`}
            className="category-card"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Categories;
