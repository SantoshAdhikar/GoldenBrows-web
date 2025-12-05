// src/pages/BlogDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

function BlogDetailPage() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [postError, setPostError] = useState("");

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentError, setCommentError] = useState("");

  const [authorName, setAuthorName] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  const [shareCopied, setShareCopied] = useState(false);

  // -------- load post + comments ----------
  useEffect(() => {
    async function loadPost() {
      setLoadingPost(true);
      setPostError("");
      try {
        const res = await fetch(`${API_BASE}/blog/slug/${slug}`);
        if (!res.ok) throw new Error("Failed to load post");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setPostError(err.message);
      } finally {
        setLoadingPost(false);
      }
    }

    async function loadComments() {
      setLoadingComments(true);
      setCommentError("");
      try {
        const res = await fetch(`${API_BASE}/blog/${slug}/comments`);
        if (!res.ok) {
          if (res.status === 404) {
            setComments([]);
            return;
          }
          const text = await res.text();
          throw new Error(text || "Failed to load comments");
        }
        const data = await res.json();
        setComments(data);
      } catch (err) {
        setCommentError(err.message);
      } finally {
        setLoadingComments(false);
      }
    }

    loadPost();
    loadComments();
  }, [slug]);

  // -------- comment submit ----------
  async function handleSubmitComment(e) {
    e.preventDefault();
    setCommentError("");

    if (!authorName.trim() || !commentContent.trim()) {
      setCommentError("Please enter your name and a comment.");
      return;
    }

    setSendingComment(true);
    try {
      const payload = {
        authorName: authorName.trim(),
        content: commentContent.trim(),
      };

      const res = await fetch(`${API_BASE}/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to post comment");
      }

      const newComment = await res.json();
      // newest comment at top
      setComments((prev) => [newComment, ...prev]);
      setAuthorName("");
      setCommentContent("");
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setSendingComment(false);
    }
  }

  // -------- share helpers ----------
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  function handleCopyLink() {
    if (!navigator.clipboard) return;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      })
      .catch(() => {});
  }

  function handleNativeShare() {
    if (typeof navigator === "undefined" || !navigator.share || !post) return;
    navigator
      .share({
        title: post.title,
        text: post.excerpt || post.title,
        url: shareUrl,
      })
      .catch(() => {});
  }

  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;
  const whatsappShare = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    (post?.title || "") + " " + shareUrl
  )}`;

  const formattedDate =
    post?.createdAt &&
    post.createdAt.replace("T", " ").slice(0, 16);

  // -------- render ----------
  return (
    <main style={styles.main}>
      <section style={styles.section}>
        <div style={styles.blogDetailWrapper}>
          {/* Back link */}
          <Link to="/blog" style={styles.blogBackLink}>
            ← Back to blog
          </Link>

          {loadingPost && <p>Loading post...</p>}
          {postError && <p style={{ color: "red" }}>{postError}</p>}

          {post && !postError && (
            <>
              {/* Title + meta */}
              <h1 style={styles.blogDetailTitle}>{post.title}</h1>

              {formattedDate && (
                <p style={styles.blogDetailMeta}>{formattedDate}</p>
              )}

              {/* Main content in nice card */}
              <article style={styles.blogDetailBody}>
                {(post.content || "")
                  .split("\n")
                  .filter((p) => p.trim().length > 0)
                  .map((para, idx) => (
                    <p key={idx} style={styles.blogDetailParagraph}>
                      {para}
                    </p>
                  ))}
              </article>

              {/* Share bar */}
              <div style={styles.blogShareBar}>
                <span style={styles.blogShareLabel}>Share this post:</span>

                {typeof navigator !== "undefined" && navigator.share && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    style={styles.blogShareButton}
                  >
                    Share…
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCopyLink}
                  style={styles.blogShareButton}
                >
                  {shareCopied ? "Link copied!" : "Copy link"}
                </button>

                <a
                  href={facebookShare}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.blogShareLink}
                >
                  Facebook
                </a>

                <a
                  href={whatsappShare}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.blogShareLink}
                >
                  WhatsApp
                </a>
              </div>
            </>
          )}

          {/* comments section */}
          <section style={{ marginTop: 24 }}>
            <h2 style={styles.blogCommentsTitle}>Comments</h2>

            {loadingComments && <p>Loading comments...</p>}
            {commentError && (
              <p style={{ color: "red" }}>{commentError}</p>
            )}

            {!loadingComments && comments.length === 0 && (
              <p style={{ fontSize: 14, color: "#9ca3af" }}>
                No comments yet. Be the first!
              </p>
            )}

            {comments.length > 0 && (
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "12px 0 20px",
                }}
              >
                {comments.map((c) => {
                  const cDate =
                    c.createdAt &&
                    c.createdAt.replace("T", " ").slice(0, 16);

                  return (
                    <li key={c.id} style={styles.blogCommentCard}>
                      <div style={styles.blogCommentHeader}>
                        <span style={styles.blogCommentName}>
                          {c.authorName}
                        </span>
                        {cDate && <span>{cDate}</span>}
                      </div>

                      <div style={styles.blogCommentText}>
                        {c.content}
                      </div>

                      {c.adminReply && (
                        <p
                          style={{
                            marginTop: 6,
                            paddingLeft: 12,
                            borderLeft: "3px solid #b07c4f",
                            fontSize: 13,
                            color: "#e5e7eb",
                          }}
                        >
                          <strong>Golden Brows:</strong>{" "}
                          {c.adminReply}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {/* comment form */}
            <section style={styles.blogCommentFormWrapper}>
              <h3 style={styles.blogCommentsTitle}>Leave a comment</h3>

              <form
                onSubmit={handleSubmitComment}
                style={{ ...styles.form, maxWidth: 480 }}
              >
                <label style={styles.label}>
                  Name
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    style={styles.input}
                  />
                </label>

                <label style={styles.label}>
                  Comment
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    style={{
                      ...styles.input,
                      minHeight: 100,
                      resize: "vertical",
                    }}
                  />
                </label>

                <button
                  type="submit"
                  disabled={sendingComment}
                  style={styles.bookingSubmitButton}
                >
                  {sendingComment ? "Posting..." : "Post Comment"}
                </button>
              </form>
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}

export default BlogDetailPage;
