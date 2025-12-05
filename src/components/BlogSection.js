// src/components/BlogSection.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

export default function BlogSection() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/blog/latest`);
        if (!res.ok) return;
        const data = await res.json();
        setPosts(data);
      } catch {}
    }
    load();
  }, []);

  if (!posts.length) return null;

  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>Beauty Tips &amp; Updates</h2>

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

          <Link to={`/blog/${post.slug}`} style={{ fontSize: 13 }}>
            Read full post →
          </Link>
        </article>
      ))}
    </section>
  );
}
