import React, { useEffect, useState } from "react";
import axios from "axios";

function Axios() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        setPosts(response.data); // Stores all posts
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to load posts");
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Posts</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {posts.map((post) => (
          <li
            key={post.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <small>User ID: {post.userId} | Post ID: {post.id}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Axios;
