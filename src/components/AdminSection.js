// src/components/AdminSection.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";
import AdminServicesManager from "./AdminServicesManager";

const SERVICE_CATEGORIES = [
  "Brows",
  "Face Threading Waxing",
  "Facial",
  "Waxing",
  "Brow Lamination Lash Lift",
];

function prettyCategory(cat) {
  if (!cat) return "";
  return cat
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function AdminSection({ adminAuth, setAdminAuth }) {
  // ---------- LOGIN ----------
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // ---------- ADD SERVICE FORM ----------
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");

  // ---------- ADD / EDIT EMPLOYEE FORM ----------
  const [employeeFullName, setEmployeeFullName] = useState("");
  const [employeeDisplayName, setEmployeeDisplayName] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [employeeSpecialties, setEmployeeSpecialties] = useState("");
  const [employeeBio, setEmployeeBio] = useState("");
  const [employeePhotoUrl, setEmployeePhotoUrl] = useState("");
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);

    // ---------- BLOG FORM ----------
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [editingBlogId, setEditingBlogId] = useState(null);

  // blog posts list (for admin table)
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState("");

  // shared admin messages
  const [saveMessage, setSaveMessage] = useState("");

  // employees list (for filters & dropdowns)
  const [employees, setEmployees] = useState([]);


  // ---------- CONTACT & SOCIAL ----------
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactAddress1, setContactAddress1] = useState("");
  const [contactAddress2, setContactAddress2] = useState("");
  const [contactInstagram, setContactInstagram] = useState("");
  const [contactFacebook, setContactFacebook] = useState("");
  const [contactTiktok, setContactTiktok] = useState("");
  const [contactYelp, setContactYelp] = useState("");
  const [contactMaps, setContactMaps] = useState("");
  const [contactLogoUrl, setContactLogoUrl] = useState("");
  const [contactError, setContactError] = useState("");

  // ---------- APPOINTMENTS DASHBOARD ----------
  const [appointments, setAppointments] = useState([]);
  const [apptLoading, setApptLoading] = useState(false);
  const [apptError, setApptError] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().slice(0, 10) // today yyyy-mm-dd
  );
  const [filterEmployeeId, setFilterEmployeeId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // ---------- COMMENTS ADMIN (for blog) ----------
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});

  // ---------- HELPERS ----------
  function authHeader() {
    if (!adminAuth) return {};
    const basic = "Basic " + btoa(`${adminAuth.username}:${adminAuth.password}`);
    return { Authorization: basic };
  }

  async function refreshEmployees() {
    try {
      const res = await fetch(`${API_BASE}/employees`);
      if (!res.ok) throw new Error("Failed to load employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error("Failed to refresh employees:", err);
    }
  }

  // load employees for filters (public endpoint)
  useEffect(() => {
    refreshEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // appointments auto-load on date / filters / login change
  useEffect(() => {
    if (adminAuth) {
      loadAppointmentsForDate(selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminAuth, selectedDate, filterEmployeeId, filterStatus]);

  // when admin logs in, load contact + comments
  useEffect(() => {
    if (adminAuth) {
      loadContact();
      loadComments();
      loadAdminBlogPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminAuth]);

  // ---------- LOGIN ----------

  async function testLogin(e) {
    e.preventDefault();
    setLoginError("");
    setSaveMessage("");

    try {
      const basic = "Basic " + btoa(`${username}:${password}`);
      const res = await fetch(`${API_BASE}/employees/all`, {
        headers: { Authorization: basic },
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      setAdminAuth({ username, password });
      setUsername("");
      setPassword("");
    } catch (err) {
      setLoginError("Invalid admin username or password.");
    }
  }

  function handleLogout() {
    setAdminAuth(null);
    setSaveMessage("");
    setLoginError("");
    setAppointments([]);
    setComments([]);
  }

  // ---------- APPOINTMENTS DASHBOARD ----------

  async function loadAppointmentsForDate(dateStr) {
    if (!adminAuth || !dateStr) return;

    setApptLoading(true);
    setApptError("");

    try {
      const params = new URLSearchParams({ date: dateStr });

      if (filterEmployeeId) params.append("employeeId", filterEmployeeId);
      if (filterStatus) params.append("status", filterStatus);

      const res = await fetch(
        `${API_BASE}/appointments/by-date?` + params.toString(),
        { headers: authHeader() }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load appointments");
      }

      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      setApptError(err.message);
      setAppointments([]);
    } finally {
      setApptLoading(false);
    }
  }

  async function updateAppointmentStatus(id, status) {
    if (!adminAuth) return;
    try {
      const res = await fetch(
        `${API_BASE}/appointments/${id}/status?status=${status}`,
        {
          method: "PATCH",
          headers: authHeader(),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update status");
      }
      // reload appointments after change
      await loadAppointmentsForDate(selectedDate);
    } catch (err) {
      alert("Error updating status: " + err.message);
    }
  }

  const filteredAppointments = appointments; // backend already applied filters

  // ---------- CONTACT ----------

  async function loadContact() {
    if (!adminAuth) return;
    try {
      setContactError("");
      const res = await fetch(`${API_BASE}/contact`, {
        headers: authHeader(),
      });

      if (!res.ok) {
        if (res.status === 404) return; // not created yet
        const text = await res.text();
        throw new Error(text || "Failed to load contact info");
      }

      const data = await res.json();
      setContactPhone(data.phone || "");
      setContactEmail(data.email || "");
      setContactAddress1(data.addressLine1 || "");
      setContactAddress2(data.addressLine2 || "");
      setContactInstagram(data.instagramUrl || "");
      setContactFacebook(data.facebookUrl || "");
      setContactTiktok(data.tiktokUrl || "");
      setContactYelp(data.yelpUrl || "");
      setContactMaps(data.googleMapsUrl || "");
      setContactLogoUrl(data.logoUrl || "");
    } catch (err) {
      setContactError(err.message);
    }
  }

  function startEditEmployee(emp) {
    setEditingEmployeeId(emp.id);
    setEmployeeFullName(emp.fullName || "");
    setEmployeeDisplayName(emp.displayName || "");
    setEmployeeRole(emp.role || "");
    setEmployeeSpecialties(emp.specialties || "");
    setEmployeeBio(emp.bio || "");
    setEmployeePhotoUrl(emp.photoUrl || "");
    setSaveMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeleteEmployee(id) {
    if (!adminAuth) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: "DELETE",
        headers: {
          ...authHeader(),
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete employee");
      }

      setSaveMessage("Employee deleted.");
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete employee");
    }
  }

  async function handleSaveContact(e) {
    e.preventDefault();
    setSaveMessage("");
    setContactError("");

    if (!adminAuth) return;

    const payload = {
      salonName: "Golden Brows Threading & Beauty Studio",
      addressLine1: contactAddress1,
      addressLine2: contactAddress2,
      phone: contactPhone,
      email: contactEmail,
      instagramUrl: contactInstagram,
      facebookUrl: contactFacebook,
      tiktokUrl: contactTiktok,
      yelpUrl: contactYelp,
      googleMapsUrl: contactMaps,
      logoUrl: contactLogoUrl,
    };

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save contact info");
      }

      setSaveMessage("Contact & social info saved.");
    } catch (err) {
      setContactError(err.message);
    }
  }

  // ---------- COMMENTS ADMIN ----------

  async function loadComments() {
    if (!adminAuth) return;
    setCommentsLoading(true);
    setCommentsError("");

    try {
      const res = await fetch(`${API_BASE}/admin/comments`, {
        headers: authHeader(),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to load comments");
      }
      const data = await res.json();
      setComments(data);
    } catch (err) {
      setCommentsError(err.message);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }

  async function saveReply(commentId) {
    if (!adminAuth) return;
    const replyText = replyDrafts[commentId] || "";

    try {
      const res = await fetch(`${API_BASE}/admin/comments/${commentId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify({ reply: replyText }),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to save reply");
      }

      // clear draft + reload
      setReplyDrafts((prev) => ({ ...prev, [commentId]: "" }));
      await loadComments();
    } catch (err) {
      alert("Error saving reply: " + err.message);
    }
  }

  // ---------- ADD SERVICE ----------

  async function handleAddService(e) {
    e.preventDefault();
    setSaveMessage("");

    if (!adminAuth) return;

    const payload = {
      name: serviceName,
      description: serviceDescription,
      price: parseFloat(servicePrice),
      durationMinutes: parseInt(serviceDuration || "0", 10),
      active: true,
      category: serviceCategory || null,
    };

    try {
      const res = await fetch(`${API_BASE}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save service");
      }

      setSaveMessage("Service added successfully.");
      setServiceName("");
      setServicePrice("");
      setServiceDuration("");
      setServiceDescription("");
      setServiceCategory("");
      // AdminServicesManager manages its own refresh
    } catch (err) {
      setSaveMessage("Error adding service: " + err.message);
    }
  }

  // upload employee photo and store returned URL in employeePhotoUrl
  async function handleEmployeePhotoFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file || !adminAuth) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      // adjust this endpoint to match your backend
      const res = await fetch(`${API_BASE}/employees/upload-photo`, {
        method: "POST",
        headers: {
          ...authHeader(),
          // don't set Content-Type manually
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to upload employee photo");
      }

      const data = await res.json();
      const url = data.photoUrl || data.url;
      if (url) {
        setEmployeePhotoUrl(url);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Photo upload failed");
    }
  }

  // ---------- ADD / EDIT EMPLOYEE ----------

  async function handleSaveEmployee(e) {
    e.preventDefault();
    setSaveMessage("");

    if (!adminAuth) return;

    const payload = {
      fullName: employeeFullName,
      displayName: employeeDisplayName,
      role: employeeRole,
      specialties: employeeSpecialties,
      bio: employeeBio,
      photoUrl: employeePhotoUrl,
      active: true,
    };

    try {
      const isEdit = editingEmployeeId != null;

      const url = isEdit
        ? `${API_BASE}/employees/${editingEmployeeId}`
        : `${API_BASE}/employees`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save employee");
      }

      setSaveMessage(
        isEdit ? "Employee updated successfully." : "Employee added successfully."
      );

      // clear form + exit edit mode
      setEmployeeFullName("");
      setEmployeeDisplayName("");
      setEmployeeRole("");
      setEmployeeSpecialties("");
      setEmployeeBio("");
      setEmployeePhotoUrl("");
      setEditingEmployeeId(null);

      await refreshEmployees();
    } catch (err) {
      setSaveMessage("Error saving employee: " + err.message);
    }
  }

  // ---------- ADD BLOG POST ----------

    // ---------- BLOG ADMIN (LOAD LIST + EDIT + PUBLISH/UNPUBLISH + SAVE) ----------

  async function loadAdminBlogPosts() {
    if (!adminAuth) return;
    setBlogLoading(true);
    setBlogError("");

    try {
      const res = await fetch(`${API_BASE}/blog/admin`, {
        headers: authHeader(),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load blog posts");
      }
      const data = await res.json();
      setBlogPosts(data);
    } catch (err) {
      console.error(err);
      setBlogError(err.message || "Failed to load blog posts");
      setBlogPosts([]);
    } finally {
      setBlogLoading(false);
    }
  }

  function startEditBlogPost(post) {
    setEditingBlogId(post.id);
    setBlogTitle(post.title || "");
    setBlogSlug(post.slug || "");
    setBlogExcerpt(post.excerpt || "");
    setBlogContent(post.content || "");
    setSaveMessage("");
  }

  async function toggleBlogPublished(post) {
    if (!adminAuth) return;
    const newValue = !post.published;

    try {
      const res = await fetch(
        `${API_BASE}/blog/${post.id}/publish?published=${newValue}`,
        {
          method: "PATCH",
          headers: authHeader(),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update publish status");
      }

      setBlogPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, published: newValue } : p
        )
      );
    } catch (err) {
      alert(err.message || "Failed to change publish state");
    }
  }

  async function handleAddBlogPost(e) {
    e.preventDefault();
    setSaveMessage("");

    if (!adminAuth) return;

    if (!blogTitle.trim()) {
      setSaveMessage("Error adding blog post: title is required.");
      return;
    }

    const isEdit = editingBlogId != null;

    const payload = {
      title: blogTitle.trim(),
      slug: (blogSlug || blogTitle)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-"),
      excerpt: blogExcerpt.trim(),
      content: blogContent.trim(),
    };

    let url = `${API_BASE}/blog`;
    let method = "POST";

    if (isEdit) {
      url = `${API_BASE}/blog/${editingBlogId}`;
      method = "PUT";
    } else {
      payload.published = true; // new posts default published
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save blog post");
      }

      setSaveMessage(
        isEdit
          ? "Blog post updated successfully."
          : "Blog post added successfully."
      );
      setBlogTitle("");
      setBlogSlug("");
      setBlogExcerpt("");
      setBlogContent("");
      setEditingBlogId(null);

      await loadAdminBlogPosts();
    } catch (err) {
      setSaveMessage("Error adding blog post: " + err.message);
    }
  }


  // ---------- RENDER ----------

  return (
    <section style={styles.section} className="admin-section">
      <h2 style={styles.sectionTitle}>Admin</h2>

      {!adminAuth && (
        <form onSubmit={testLogin} style={styles.form}>
          <p style={{ fontSize: 13, marginBottom: 8 }}>
            Admin login (for you / staff only).
          </p>
          <label style={styles.label}>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
          </label>
          <label style={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </label>
          <button type="submit" style={styles.primaryButton}>
            Log in as Admin
          </button>
          {loginError && (
            <p style={{ color: "red", marginTop: 8 }}>{loginError}</p>
          )}
        </form>
      )}

      {adminAuth && (
        <>
          <p style={{ fontSize: 13, marginBottom: 8 }}>
            Logged in as <strong>{adminAuth.username}</strong>{" "}
            <button
              type="button"
              onClick={handleLogout}
              style={{
                marginLeft: 8,
                fontSize: 12,
                padding: "3px 8px",
                borderRadius: 4,
                border: "1px solid #11d66aff",
                background: "#11d66aff",
                cursor: "pointer",
              }}
            >
              Log out
            </button>
          </p>

          {/* APPOINTMENTS DASHBOARD */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ marginBottom: 8 }}>Appointments</h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <label style={{ ...styles.label, maxWidth: 180 }}>
                Date
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={styles.input}
                />
              </label>

              <label style={{ ...styles.label, maxWidth: 200 }}>
                Staff
                <select
                  value={filterEmployeeId}
                  onChange={(e) => setFilterEmployeeId(e.target.value)}
                  style={styles.input}
                >
                  <option value="">All staff</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.displayName || emp.fullName}
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ ...styles.label, maxWidth: 180 }}>
                Status
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={styles.input}
                >
                  <option value="">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </label>
            </div>

            {apptLoading && <p>Loading appointments...</p>}
            {apptError && <p style={{ color: "red" }}>{apptError}</p>}

            {!apptLoading && filteredAppointments.length === 0 && (
              <p>No appointments for this day.</p>
            )}

            {!apptLoading && filteredAppointments.length > 0 && (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr>
                      <th style={thStyle}>Time</th>
                      <th style={thStyle}>Customer</th>
                      <th style={thStyle}>Phone</th>
                      <th style={thStyle}>Service</th>
                      <th style={thStyle}>Staff</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((a) => (
                      <tr key={a.id}>
                        <td style={tdStyle}>
                          {a.appointmentTime
                            ? a.appointmentTime.slice(11, 16)
                            : ""}
                        </td>
                        <td style={tdStyle}>{a.customerName}</td>
                        <td style={tdStyle}>{a.phone}</td>
                        <td style={tdStyle}>
                          {a.service ? a.service.name : ""}
                        </td>
                        <td style={tdStyle}>
                          {a.employee
                            ? a.employee.displayName || a.employee.fullName
                            : "Any"}
                        </td>
                        <td style={tdStyle}>{a.status}</td>
                        <td style={tdStyle}>
                          <button
                            type="button"
                            onClick={() =>
                              updateAppointmentStatus(a.id, "CONFIRMED")
                            }
                            style={smallBtn("green")}
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateAppointmentStatus(a.id, "COMPLETED")
                            }
                            style={smallBtn("#555")}
                          >
                            Done
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateAppointmentStatus(a.id, "CANCELLED")
                            }
                            style={smallBtn("crimson")}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* GRID: service / contact / blog / employee forms */}
          <div
            style={{
              display: "grid",
              gap: 24,
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            }}
          >
            {/* Add Service */}
            <form onSubmit={handleAddService} style={styles.form}>
              <h3 style={{ marginBottom: 8 }}>Add Service</h3>
              <label style={styles.label}>
                Name
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                Category
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  style={styles.input}
                >
                  <option value="">(none)</option>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {prettyCategory(cat)}
                    </option>
                  ))}
                </select>
              </label>
              <label style={styles.label}>
                Price ($)
                <input
                  type="number"
                  step="0.01"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                Duration (minutes)
                <input
                  type="number"
                  value={serviceDuration}
                  onChange={(e) => setServiceDuration(e.target.value)}
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                Description
                <textarea
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
                />
              </label>
              <button type="submit" style={styles.primaryButton}>
                Save Service
              </button>
            </form>

            {/* Contact & Social */}
            <form onSubmit={handleSaveContact} style={styles.form}>
              <h3 style={{ marginBottom: 8 }}>Contact & Social</h3>

              <label style={styles.label}>
                Phone
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Email
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Address line 1
                <input
                  type="text"
                  value={contactAddress1}
                  onChange={(e) =>
                    setContactAddress1(e.target.value)
                  }
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Address line 2
                <input
                  type="text"
                  value={contactAddress2}
                  onChange={(e) =>
                    setContactAddress2(e.target.value)
                  }
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Google Maps URL
                <input
                  type="text"
                  value={contactMaps}
                  onChange={(e) => setContactMaps(e.target.value)}
                  style={styles.input}
                  placeholder="https://maps.google.com/…"
                />
              </label>

              <label style={styles.label}>
                Instagram URL
                <input
                  type="text"
                  value={contactInstagram}
                  onChange={(e) =>
                    setContactInstagram(e.target.value)
                  }
                  style={styles.input}
                  placeholder="https://instagram.com/…"
                />
              </label>

              <label style={styles.label}>
                Facebook URL
                <input
                  type="text"
                  value={contactFacebook}
                  onChange={(e) =>
                    setContactFacebook(e.target.value)
                  }
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                TikTok URL
                <input
                  type="text"
                  value={contactTiktok}
                  onChange={(e) => setContactTiktok(e.target.value)}
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Yelp URL
                <input
                  type="text"
                  value={contactYelp}
                  onChange={(e) => setContactYelp(e.target.value)}
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Logo URL (optional)
                <input
                  type="text"
                  value={contactLogoUrl}
                  onChange={(e) =>
                    setContactLogoUrl(e.target.value)
                  }
                  style={styles.input}
                  placeholder="https://…/logo.png"
                />
              </label>

              <button type="submit" style={styles.primaryButton}>
                Save Contact
              </button>

              {contactError && (
                <p style={{ color: "red", fontSize: 12, marginTop: 6 }}>
                  {contactError}
                </p>
              )}
            </form>

                        {/* Add / Edit Blog Post */}
            <form
              onSubmit={handleAddBlogPost}
              style={styles.form}
              className="admin-blog-post"
            >
              <h3 style={{ marginBottom: 8 }}>
                {editingBlogId ? "Edit Blog Post" : "Add Blog Post"}
              </h3>
              <label style={styles.label}>
                Title
                <input
                  type="text"
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  style={styles.input}
                />
              </label>
              <label style={styles.label}>
                Slug (optional)
                <input
                  type="text"
                  value={blogSlug}
                  onChange={(e) => setBlogSlug(e.target.value)}
                  style={styles.input}
                  placeholder="why-threading-is-better"
                />
              </label>
              <label style={styles.label}>
                Excerpt
                <input
                  type="text"
                  value={blogExcerpt}
                  onChange={(e) => setBlogExcerpt(e.target.value)}
                  style={styles.input}
                  placeholder="Short summary shown in list..."
                />
              </label>
              <label style={styles.label}>
                Content
                <textarea
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  style={{ ...styles.input, minHeight: 120, resize: "vertical" }}
                />
              </label>
              <button type="submit" style={styles.primaryButton}>
                {editingBlogId ? "Update Blog Post" : "Save Blog Post"}
              </button>
            </form>


            {/* Add / Edit Employee */}
            <form onSubmit={handleSaveEmployee} style={styles.form}>
              <h3 style={{ marginBottom: 8 }}>
                {editingEmployeeId ? "Edit Employee" : "Add Employee"}
              </h3>

              <label style={styles.label}>
                Full Name
                <input
                  type="text"
                  value={employeeFullName}
                  onChange={(e) =>
                    setEmployeeFullName(e.target.value)
                  }
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Display Name
                <input
                  type="text"
                  value={employeeDisplayName}
                  onChange={(e) =>
                    setEmployeeDisplayName(e.target.value)
                  }
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Role
                <input
                  type="text"
                  value={employeeRole}
                  onChange={(e) =>
                    setEmployeeRole(e.target.value)
                  }
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Specialties
                <input
                  type="text"
                  value={employeeSpecialties}
                  onChange={(e) =>
                    setEmployeeSpecialties(e.target.value)
                  }
                  style={styles.input}
                  placeholder="Threading, Waxing, Facials"
                />
              </label>

              <label style={styles.label}>
                Bio
                <textarea
                  value={employeeBio}
                  onChange={(e) =>
                    setEmployeeBio(e.target.value)
                  }
                  style={{
                    ...styles.input,
                    minHeight: 80,
                    resize: "vertical",
                  }}
                />
              </label>

              <label style={styles.label}>
                Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEmployeePhotoFileChange}
                  style={styles.input}
                />
                {employeePhotoUrl && (
                  <p style={{ fontSize: 12, marginTop: 4 }}>
                    Uploaded image URL:{" "}
                    <span style={{ wordBreak: "break-all" }}>
                      {employeePhotoUrl}
                    </span>
                  </p>
                )}
              </label>

              <div style={{ marginTop: 8 }}>
                <button type="submit" style={styles.primaryButton}>
                  {editingEmployeeId
                    ? "Update Employee"
                    : "Save Employee"}
                </button>
                {editingEmployeeId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEmployeeId(null);
                      setEmployeeFullName("");
                      setEmployeeDisplayName("");
                      setEmployeeRole("");
                      setEmployeeSpecialties("");
                      setEmployeeBio("");
                      setEmployeePhotoUrl("");
                    }}
                    style={{
                      marginLeft: 8,
                      fontSize: 12,
                      padding: "6px 10px",
                      borderRadius: 4,
                      border: "1px solid #ccb9aa",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Employees list (edit / delete) */}
          <div style={{ marginTop: 32 }}>
            <h3 style={{ marginBottom: 8 }}>Employees</h3>

            {employees.length === 0 ? (
              <p>No employees yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Display</th>
                      <th style={thStyle}>Role</th>
                      <th style={thStyle}>Specialties</th>
                      <th style={thStyle}>Active</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id}>
                        <td style={tdStyle}>{emp.fullName}</td>
                        <td style={tdStyle}>{emp.displayName}</td>
                        <td style={tdStyle}>{emp.role}</td>
                        <td style={tdStyle}>{emp.specialties}</td>
                        <td style={tdStyle}>
                          {emp.active ? "Yes" : "No"}
                        </td>
                        <td style={tdStyle}>
                          <button
                            type="button"
                            onClick={() => startEditEmployee(emp)}
                            style={smallBtn("#2563eb")}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteEmployee(emp.id)
                            }
                            style={smallBtn("crimson")}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Blog posts admin list (publish / unpublish / edit) */}
          <div style={{ marginTop: 32 }}>
            <h3 style={{ marginBottom: 8 }}>Blog Posts</h3>

            {blogLoading && <p>Loading blog posts...</p>}
            {blogError && (
              <p style={{ color: "red", fontSize: 13 }}>{blogError}</p>
            )}

            {!blogLoading && blogPosts.length === 0 && (
              <p>No blog posts yet.</p>
            )}

            {!blogLoading && blogPosts.length > 0 && (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr>
                      <th style={thStyle}>Title</th>
                      <th style={thStyle}>Slug</th>
                      <th style={thStyle}>Published</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts.map((post) => (
                      <tr key={post.id}>
                        <td style={tdStyle}>{post.title}</td>
                        <td style={tdStyle}>{post.slug}</td>
                        <td style={tdStyle}>{post.published ? "Yes" : "No"}</td>
                        <td style={tdStyle}>
                          <button
                            type="button"
                            onClick={() => startEditBlogPost(post)}
                            style={smallBtn("#555")}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleBlogPublished(post)}
                            style={smallBtn(post.published ? "crimson" : "green")}
                          >
                            {post.published ? "Unpublish" : "Publish"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Blog comments admin view */}
          <div style={{ marginTop: 32 }}>
            <h3 style={{ marginBottom: 8 }}>Blog Comments</h3>

            {commentsLoading && <p>Loading comments...</p>}
            {commentsError && (
              <p style={{ color: "red" }}>{commentsError}</p>
            )}

            {!commentsLoading && comments.length === 0 && (
              <p>No comments yet.</p>
            )}

            {!commentsLoading && comments.length > 0 && (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 13,
                  }}
                >
                  <thead>
                    <tr>
                      <th style={thStyle}>When</th>
                      <th style={thStyle}>Post</th>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Comment</th>
                      <th style={thStyle}>Admin reply</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map((c) => (
                      <tr key={c.id}>
                        <td style={tdStyle}>
                          {c.createdAt
                            ? c.createdAt.replace("T", " ").slice(0, 16)
                            : ""}
                        </td>
                        <td style={tdStyle}>
                          {c.postTitle}{" "}
                          {c.postSlug && (
                            <a
                              href={`/blog/${c.postSlug}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: 11 }}
                            >
                              view
                            </a>
                          )}
                        </td>
                        <td style={tdStyle}>{c.authorName}</td>
                        <td style={tdStyle}>{c.content}</td>
                        <td style={tdStyle}>
                          {c.adminReply && (
                            <p style={{ marginBottom: 4 }}>
                              <strong>Current:</strong> {c.adminReply}
                            </p>
                          )}
                          <textarea
                            value={replyDrafts[c.id] || ""}
                            onChange={(e) =>
                              setReplyDrafts((prev) => ({
                                ...prev,
                                [c.id]: e.target.value,
                              }))
                            }
                            style={{
                              ...styles.input,
                              minHeight: 60,
                              resize: "vertical",
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => saveReply(c.id)}
                            style={{
                              ...smallBtn("#884913ff"),
                              marginTop: 4,
                            }}
                          >
                            Save reply
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Manage services & images (edit/delete) */}
          <div style={{ marginTop: 32 }}>
            <AdminServicesManager authHeader={authHeader} />
          </div>

          {saveMessage && (
            <p
              style={{
                marginTop: 10,
                color: saveMessage.startsWith("Error") ? "red" : "green",
              }}
            >
              {saveMessage}
            </p>
          )}
        </>
      )}
    </section>
  );
}

const thStyle = {
  textAlign: "left",
  borderBottom: "1px solid #ece8e5ff",
  padding: "6px 4px",
};

const tdStyle = {
  borderBottom: "1px solid #f0e7e1",
  padding: "6px 4px",
};

const smallBtn = (color) => ({
  fontSize: 11,
  marginRight: 4,
  padding: "3px 6px",
  borderRadius: 4,
  border: "none",
  cursor: "pointer",
  backgroundColor: color,
  color: "#fff",
});

export default AdminSection;