// src/pages/BlogListPage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

function BlogListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/blog`);
        if (!res.ok) throw new Error("Failed to load blog posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main style={styles.main}>
      <section style={styles.section}>
        <h1 style={styles.sectionTitle}>Beauty Tips &amp; Updates</h1>
        <p style={styles.sectionSubtitle}>
          Learn more about threading, skincare, and special offers from Golden
          Brows.
        </p>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && posts.length === 0 && (
          <p>No blog posts yet.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {posts.map((post) => (
            <article key={post.id} style={styles.blogListCard}>
              <h3 style={styles.blogListTitle}>{post.title}</h3>

              {post.excerpt && (
                <p style={styles.blogListExcerpt}>{post.excerpt}</p>
              )}

              {post.createdAt && (
                <p style={styles.blogListMeta}>
                  {post.createdAt.replace("T", " ").slice(0, 16)}
                </p>
              )}

              {/* go to detail page by slug if exists, else by id */}
              <Link
                to={`/blog/${post.slug || post.id}`}
                style={{
                  fontSize: 13,
                  textDecoration: "underline",
                  color: "#a855f7",
                }}
              >
                Read full post →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default BlogListPage;
