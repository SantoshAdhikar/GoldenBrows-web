// src/pages/MediaPage.js
// Complete social media feed page - Instagram, Facebook, TikTok

import React, { useEffect, useState, useCallback } from "react";
import { API_BASE } from "../apiConfig";

const backendBase = API_BASE.replace("/api", "");

const PLATFORM_META = {
  INSTAGRAM: { name: "Instagram", icon: "📷", color: "#E4405F" },
  FACEBOOK: { name: "Facebook", icon: "👍", color: "#1877F2" },
  YELP: { name: "Yelp", icon: "⭐", color: "#d32828ff" },
  TIKTOK: { name: "TikTok", icon: "🎵", color: "#000000" },
};

function getPlatformMeta(platform) {
  const key = (platform || "").toUpperCase();
  return (
    PLATFORM_META[key] || {
      name: platform || "Unknown",
      icon: "🌐",
      color: "#8b6361",
    }
  );
}

function getFullUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return backendBase + pathOrUrl;
}

export default function MediaPage() {
  const [selectedPlatform, setSelectedPlatform] = useState("ALL");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const endpoint =
        selectedPlatform === "ALL"
          ? `${API_BASE}/social-media`
          : `${API_BASE}/social-media/platform/${selectedPlatform.toUpperCase()}`;

      const res = await fetch(endpoint);

if (!res.ok) {
  const text = await res.text();
  console.error("Social media API error", res.status, text);
  throw new Error(
    text && text.length < 200
      ? `HTTP ${res.status}: ${text}`
      : `Failed to load posts (HTTP ${res.status})`
  );
}

// if backend wraps in {content: [...]}, handle it:
const data = await res.json();
const normalized = Array.isArray(data) ? data : (data.content || []);
setPosts(normalized);


      

      // Optional: debug in browser console
      // console.log("Loaded social posts:", normalized);
    } catch (err) {
      setError(err.message || "Failed to load social media posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedPlatform]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const platforms = [
    { id: "ALL", name: "All", icon: "🌟", color: "#8b6361" },
    { id: "INSTAGRAM", name: "Instagram", icon: "📷", color: "#E4405F" },
    { id: "FACEBOOK", name: "Facebook", icon: "👍", color: "#1877F2" },
    { id: "YELP", name: "Yelp", icon: "⭐", color: "#d32828ff" },
    { id: "TIKTOK", name: "TikTok", icon: "🎵", color: "#000000" },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";

    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const formatEngagement = (num) => {
    if (!num) return "0";
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Our Social Media</h1>
        <p style={styles.subtitle}>
          Follow us for the latest updates, beauty tips, and transformations!
        </p>
      </div>

      {/* Platform Tabs */}
      <div style={styles.tabsContainer}>
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform.id)}
            style={{
              ...styles.tab,
              ...(selectedPlatform === platform.id ? styles.tabActive : {}),
              ...(selectedPlatform === platform.id
                ? { backgroundColor: platform.color, color: "#fff" }
                : {}),
            }}
          >
            <span style={{ fontSize: 20, marginRight: 8 }}>
              {platform.icon}
            </span>
            <span
              style={{
                fontWeight: selectedPlatform === platform.id ? 800 : 600,
              }}
            >
              {platform.name}
            </span>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading posts...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>❌ {error}</p>
          <button onClick={loadPosts} style={styles.retryButton}>
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && posts.length === 0 && (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📭</div>
          <p style={styles.emptyText}>No posts yet!</p>
          <p style={styles.emptySubtext}>Check back soon for updates.</p>
        </div>
      )}

      {/* Posts Grid */}
      {!loading && !error && posts.length > 0 && (
        <div style={styles.postsGrid}>
          {posts.map((post) => {
            const meta = getPlatformMeta(post.platform);
            const mediaUrl = getFullUrl(post.mediaUrl);
            const thumbUrl = getFullUrl(post.thumbnailUrl);
            const postUrl = getFullUrl(post.postUrl);

            return (
              <div
                key={post.id}
                style={styles.postCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.08)";
                }}
              >
                {/* Platform Badge */}
                <div
                  style={{
                    ...styles.platformBadge,
                    backgroundColor: meta.color,
                  }}
                >
                  {meta.icon} {meta.name.toUpperCase()}
                </div>

                {/* Media */}
                {post.postType === "IMAGE" && mediaUrl && (
                  <div style={styles.mediaContainer}>
                    <img
                      src={mediaUrl}
                      alt={post.caption || meta.name}
                      style={styles.postImage}
                      onError={(e) => {
                        e.currentTarget.src = "/images/placeholder.jpg";
                      }}
                    />
                  </div>
                )}

                {post.postType === "VIDEO" && (
                  <div style={styles.mediaContainer}>
                    {thumbUrl ? (
                      <div style={styles.videoThumbnail}>
                        <img
                          src={thumbUrl}
                          alt={post.caption || meta.name}
                          style={styles.postImage}
                        />
                        <div style={styles.playButton}>▶</div>
                      </div>
                    ) : (
                      <div style={styles.videoPlaceholder}>
                        <span style={{ fontSize: 48 }}>🎥</span>
                        <p style={{ marginTop: 8, color: "#6b7280" }}>Video</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Caption */}
                {post.caption && (
                  <div style={styles.captionContainer}>
                    <p style={styles.caption}>
                      {post.caption.length > 120
                        ? `${post.caption.substring(0, 120)}...`
                        : post.caption}
                    </p>
                  </div>
                )}

                {/* Engagement Stats */}
                <div style={styles.statsContainer}>
                  {post.likes > 0 && (
                    <div style={styles.stat}>
                      <span style={styles.statIcon}>❤️</span>
                      <span style={styles.statValue}>
                        {formatEngagement(post.likes)}
                      </span>
                    </div>
                  )}
                  {post.comments > 0 && (
                    <div style={styles.stat}>
                      <span style={styles.statIcon}>💬</span>
                      <span style={styles.statValue}>
                        {formatEngagement(post.comments)}
                      </span>
                    </div>
                  )}
                  {post.shares > 0 && (
                    <div style={styles.stat}>
                      <span style={styles.statIcon}>🔄</span>
                      <span style={styles.statValue}>
                        {formatEngagement(post.shares)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div style={styles.postFooter}>
                  <span style={styles.timestamp}>
                    {formatDate(post.publishedAt)}
                  </span>
                  {postUrl && (
                    <a
                      href={postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.viewPostLink}
                    >
                      View Post →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Call to Action */}
      <div style={styles.ctaContainer}>
        <h2 style={styles.ctaTitle}>Follow Us!</h2>
        <p style={styles.ctaSubtitle}>
          Stay connected for exclusive offers, beauty tips, and more
        </p>
        <div style={styles.socialLinks}>
          <a
            href="https://www.instagram.com/goldenbrowsthreading/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...styles.socialButton, backgroundColor: "#E4405F" }}
          >
            📷 Instagram
          </a>
          <a
            href="https://www.facebook.com/people/Golden-Brows-Threading-Beauty-Studio/100085349239910/?mibextid=LQQJ4d"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...styles.socialButton, backgroundColor: "#1877F2" }}
          >
            👍 Facebook
          </a>
          <a
            href="https://www.yelp.com/biz/golden-brows-threading-and-beauty-studio-paramount-3"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...styles.socialButton, backgroundColor: "#000000" }}
          >
            Yelp
          </a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px 20px",
    maxWidth: 1400,
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 900,
    color: "#1f2937",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: "#6b7280",
    maxWidth: 600,
    margin: "0 auto",
  },
  tabsContainer: {
    display: "flex",
    gap: 12,
    marginBottom: 40,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  tab: {
    padding: "12px 24px",
    borderRadius: 999,
    border: "2px solid #e5e7eb",
    background: "#fff",
    color: "#374151",
    fontSize: 16,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
  },
  tabActive: {
    borderColor: "transparent",
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  postsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 24,
    marginBottom: 60,
  },
  postCard: {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    border: "1px solid rgba(0,0,0,0.05)",
  },
  platformBadge: {
    padding: "8px 16px",
    fontSize: 12,
    fontWeight: 800,
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  mediaContainer: {
    width: "100%",
    aspectRatio: "1 / 1",
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
    position: "relative",
  },
  postImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  videoThumbnail: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "rgba(0,0,0,0.7)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    paddingLeft: 4,
  },
  videoPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#e5e7eb",
  },
  captionContainer: {
    padding: "16px 20px 12px",
  },
  caption: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "#374151",
    margin: 0,
  },
  statsContainer: {
    display: "flex",
    gap: 16,
    padding: "0 20px 12px",
  },
  stat: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  statIcon: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 13,
    fontWeight: 700,
    color: "#6b7280",
  },
  postFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 20px",
    borderTop: "1px solid #e5e7eb",
  },
  timestamp: {
    fontSize: 12,
    color: "#9ca3af",
  },
  viewPostLink: {
    fontSize: 13,
    fontWeight: 700,
    color: "#8b6361",
    textDecoration: "none",
    transition: "all 0.2s ease",
  },
  loadingContainer: {
    textAlign: "center",
    padding: "60px 20px",
  },
  spinner: {
    width: 50,
    height: 50,
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #8b6361",
    borderRadius: "50%",
    margin: "0 auto 20px",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  errorContainer: {
    textAlign: "center",
    padding: "60px 20px",
  },
  errorText: {
    fontSize: 18,
    color: "#ef4444",
    marginBottom: 20,
  },
  retryButton: {
    padding: "12px 24px",
    borderRadius: 12,
    border: "none",
    background: "#8b6361",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
  },
  emptyContainer: {
    textAlign: "center",
    padding: "80px 20px",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 800,
    color: "#1f2937",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#6b7280",
  },
  ctaContainer: {
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(139, 99, 97, 0.05)",
    borderRadius: 24,
    marginTop: 40,
  },
  ctaTitle: {
    fontSize: 32,
    fontWeight: 900,
    color: "#1f2937",
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 32,
  },
  socialLinks: {
    display: "flex",
    gap: 16,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  socialButton: {
    padding: "14px 28px",
    borderRadius: 999,
    color: "#fff",
    fontSize: 16,
    fontWeight: 800,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
};
