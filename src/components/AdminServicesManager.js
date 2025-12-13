// src/components/AdminServicesManager.js
import React, { useEffect, useState } from "react";
import { API_BASE } from "../apiConfig";
import { styles } from "../styles";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  durationMinutes: "",
  description: "",
  active: true,
};

export default function AdminServicesManager({ authHeader }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // if parent forgets to pass authHeader, fall back to no auth
  const safeAuthHeader = authHeader || (() => ({}));

  async function loadServices() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/services`);
      if (!res.ok) throw new Error("Failed to load services");
      const data = await res.json();
      setServices(data);
    } catch (err) {
      setError(err.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  // ---------- image upload ----------
  async function handleImageChange(serviceId, file) {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/services/${serviceId}/image`, {
        method: "POST",
        headers: {
          ...safeAuthHeader(),
        },
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to upload image");
      }
      await loadServices();
    } catch (err) {
      console.error(err);
      alert(err.message || "Image upload failed");
    }
  }

  // ---------- editing helpers ----------
  const startEdit = (service) => {
    setEditingId(service.id);
    setEditForm({
      name: service.name ?? "",
      category: service.category ?? "",
      price: service.price ?? "",
      durationMinutes: service.durationMinutes ?? "",
      description: service.description ?? "",
      active: service.active ?? true,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  async function saveEdit() {
    if (!editingId) return;
    setSaving(true);
    try {
      const payload = {
        ...editForm,
        price: Number(editForm.price),
        durationMinutes: Number(editForm.durationMinutes),
      };

      const res = await fetch(`${API_BASE}/services/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...safeAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update service");
      }

      await loadServices();
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  // ---------- activate / deactivate ----------
  async function toggleActive(service) {
    const newActive = !service.active;

    // optional confirm for deactivation
    if (service.active) {
      const ok = window.confirm(
        "Deactivate this service?\nIt will be hidden from booking but kept for appointment history."
      );
      if (!ok) return;
    }

    setTogglingId(service.id);
    try {
      const payload = {
        name: service.name,
        category: service.category,
        price: Number(service.price),
        durationMinutes: Number(service.durationMinutes),
        description: service.description,
        active: newActive,
      };

      const res = await fetch(`${API_BASE}/services/${service.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...safeAuthHeader(),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update active status");
      }

      await loadServices();
      if (editingId === service.id) {
        // keep edit open but sync active flag
        setEditForm((prev) => ({ ...prev, active: newActive }));
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to change active status");
    } finally {
      setTogglingId(null);
    }
  }

  const actionBtnBase = {
    padding: "4px 10px",
    fontSize: 12,
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    backgroundColor: "#111827",
    color: "#e5e7eb",
    cursor: "pointer",
    marginRight: 6,
  };

  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>Manage Services &amp; Images</h2>

      {loading && <p>Loading services…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && services.length === 0 && <p>No services found.</p>}

      {!loading && services.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14,
              color: "#e213c6ff", //this is the manage services & images color
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Image</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>Duration</th>
                <th style={thStyle}>Active</th>
                <th style={thStyle}>Upload / Change Image</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => {
                const isEditing = s.id === editingId;
                return (
                  <tr key={s.id}>
                    {/* image */}
                    <td style={tdStyle}>
                      {s.imagePath && (
                        <img
                          src={API_BASE.replace("/api", "") + s.imagePath}
                          alt={s.name}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      )}
                    </td>

                    {/* name */}
                    <td style={tdStyle}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            handleEditChange("name", e.target.value)
                          }
                          style={inputStyle}
                        />
                      ) : (
                        s.name
                      )}
                    </td>

                    {/* category */}
                    <td style={tdStyle}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.category}
                          onChange={(e) =>
                            handleEditChange("category", e.target.value)
                          }
                          style={inputStyle}
                        />
                      ) : (
                        s.category
                      )}
                    </td>

                    {/* price */}
                    <td style={tdStyle}>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editForm.price}
                          onChange={(e) =>
                            handleEditChange("price", e.target.value)
                          }
                          style={inputStyle}
                        />
                      ) : (
                        `$${s.price}`
                      )}
                    </td>

                    {/* duration */}
                    <td style={tdStyle}>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          step="5"
                          value={editForm.durationMinutes}
                          onChange={(e) =>
                            handleEditChange(
                              "durationMinutes",
                              e.target.value
                            )
                          }
                          style={inputStyle}
                        />
                      ) : (
                        `${s.durationMinutes} min`
                      )}
                    </td>

                    {/* active */}
                    <td style={tdStyle}>
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={!!editForm.active}
                          onChange={(e) =>
                            handleEditChange("active", e.target.checked)
                          }
                        />
                      ) : s.active ? (
                        <span style={{ color: "#8a20e0ff" }}>Yes</span>
                      ) : (
                        <span style={{ color: "#f97373" }}>No</span>
                      )}
                    </td>

                    {/* upload image */}
                    <td style={tdStyle}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(s.id, e.target.files[0])
                        }
                      />
                    </td>

                    {/* actions */}
                    <td style={tdStyle}>
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={saveEdit}
                            disabled={saving}
                            style={{
                              ...actionBtnBase,
                              backgroundColor: "#22c55e",
                              color: "#022c22",
                              borderColor: "#4ade80",
                            }}
                          >
                            {saving ? "Saving…" : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={saving}
                            style={{
                              ...actionBtnBase,
                              backgroundColor: "transparent",
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(s)}
                            style={actionBtnBase}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleActive(s)}
                            disabled={togglingId === s.id}
                            style={{
                              ...actionBtnBase,
                              backgroundColor: s.active ? "#e25555ff" : "#065f46",
                              borderColor: s.active ? "#fecaca" : "#6ee7b7",
                              color: s.active ? "#fee2e2" : "#ecfdf3",
                            }}
                          >
                            {togglingId === s.id
                              ? "Saving…"
                              : s.active
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "8px 10px",
  borderBottom: "1px solid rgba(148, 163, 184, 0.4)",
  fontWeight: 600,
  fontSize: 13,
};

const tdStyle = {
  padding: "8px 10px",
  borderBottom: "1px solid rgba(30, 64, 175, 0.4)",
  verticalAlign: "middle",
};

const inputStyle = {
  width: "100%",
  padding: "4px 6px",
  borderRadius: 6,
  border: "1px solid #64748b",
  fontSize: 13,
  backgroundColor: "#020617",
  color: "#e5e7eb",
};
