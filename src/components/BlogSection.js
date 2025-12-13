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
          {/* Clickable title */}
          <Link 
            to={`/blog/${post.slug}`} 
            style={{ 
              textDecoration: "none",
              color: "inherit"
            }}
          >
            <h3 style={{
              ...styles.blogListTitle,
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => e.target.style.color = "#a855f7"}
            onMouseLeave={(e) => e.target.style.color = "#674846"}
            >
              {post.title}
            </h3>
          </Link>

          {/* Clickable excerpt */}
          {post.excerpt && (
            <Link 
              to={`/blog/${post.slug}`} 
              style={{ 
                textDecoration: "none",
                color: "inherit"
              }}
            >
              <p style={{
                ...styles.blogListExcerpt,
                cursor: "pointer",
              }}>
                {post.excerpt}
              </p>
            </Link>
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