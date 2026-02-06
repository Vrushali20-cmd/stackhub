import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import "./Topics.css";

function Topics() {
  const { categoryId } = useParams();

  const [topics, setTopics] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    fetchTopics();
  }, [categoryId, search, page, sort]);

  const fetchTopics = async () => {
    try {
      const res = await api.get(
        `/topics/category/${categoryId}?search=${search}&page=${page}&limit=5&sort=${sort}`
      );

      setTopics(res.data.topics);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="topics-container">
      <h2>Topics</h2>

      {/* Search + Sort */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search topics..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="difficulty">Difficulty</option>
        </select>
      </div>

      {/* Topics List */}
      <div className="topics-list">
        {topics.length === 0 ? (
          <p>No topics found.</p>
        ) : (
          topics.map((topic) => (
            <div key={topic._id} className="topic-card">
              <h3>{topic.title}</h3>
              <p>{topic.content}</p>
              <span className="badge">{topic.difficulty}</span>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Topics;
