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
  const [contactTwitter, setContactTwitter] = useState("");

  // ---------- GALLERY STATE ----------
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [editingGalleryId, setEditingGalleryId] = useState(null);
  const [galleryForm, setGalleryForm] = useState({
    
    title: "",
    description: "",
    imageUrl: "",
    beforeImageUrl: "",
    category: "",
    featured: false,
    active: true,
    displayOrder: 0,
    customerName: "",
  });
  const [uploadingGalleryMain, setUploadingGalleryMain] = useState(false);
  const [uploadingGalleryBefore, setUploadingGalleryBefore] = useState(false);

// FAQ state
const [faqs, setFaqs] = useState([]);
const [faqsLoading, setFaqsLoading] = useState(false);
const [editingFaqId, setEditingFaqId] = useState(null);
const [faqForm, setFaqForm] = useState({
  question: "",
  answer: "",
  category: "",
  displayOrder: 0,
  active: true
});

const [promotions, setPromotions] = useState([]);
const [promotionsLoading, setPromotionsLoading] = useState(false);
const [editingPromotionId, setEditingPromotionId] = useState(null);
const [promotionForm, setPromotionForm] = useState({
  title: "",
  description: "",
  discountText: "",
  code: "",
  startDate: "",
  endDate: "",
  active: true,
  featured: false,
  bannerColor: "#ff6b6b",
  termsAndConditions: "",
  displayOrder: 0
});


  // Review state
const [reviews, setReviews] = useState([]);
const [reviewsLoading, setReviewsLoading] = useState(false);
const [editingReviewId, setEditingReviewId] = useState(null);
const [replyText, setReplyText] = useState("");



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
      loadGallery();
      loadReviews();
      loadFAQs();
      loadPromotions();
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
      if (res.status === 404) return;
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
    setContactTwitter(data.twitterUrl || ""); // ← ADD THIS LINE
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
    twitterUrl: contactTwitter, // ← ADD THIS LINE
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

  async function handleLogoFileChange(e) {
  const file = e.target.files && e.target.files[0];
  if (!file || !adminAuth) return;

  // Validate file type
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    alert('Please upload a PNG or JPEG image only.');
    return;
  }

  // Optional: Validate file size (e.g., max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    alert('Logo file size must be less than 5MB.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    // Upload to backend - adjust endpoint to match your backend
    const res = await fetch(`${API_BASE}/contact/upload-logo`, {
      method: 'POST',
      headers: {
        ...authHeader(),
        // Don't set Content-Type for FormData
      },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to upload logo');
    }

    const data = await res.json();
    const url = data.logoUrl || data.url;
    if (url) {
      setContactLogoUrl(url);
      setSaveMessage('Logo uploaded successfully! Remember to click "Save Contact" to save changes.');
    }
  } catch (err) {
    console.error(err);
    alert(err.message || 'Logo upload failed');
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

  // ---------- GALLERY ADMIN ----------

  async function loadGallery() {
    if (!adminAuth) return;
    setGalleryLoading(true);
    setGalleryError("");

    try {
      const res = await fetch(`${API_BASE}/gallery/all`, {
        headers: authHeader(),
      });
      if (!res.ok) throw new Error("Failed to load gallery");
      const data = await res.json();
      setGalleryItems(data);
    } catch (err) {
      setGalleryError(err.message);
      setGalleryItems([]);
    } finally {
      setGalleryLoading(false);
    }
  }

  async function loadReviews() {
  setReviewsLoading(true);
  try {
    const res = await fetch(`${API_BASE}/reviews/all`, {
      headers: authHeader()
    });
    if (!res.ok) throw new Error("Failed to load reviews");
    const data = await res.json();
    setReviews(data);
  } catch (err) {
    console.error("Failed to load reviews:", err);
  } finally {
    setReviewsLoading(false);
  }
}

async function loadFAQs() {
  setFaqsLoading(true);
  try {
    const res = await fetch(`${API_BASE}/faqs/all`, {
      headers: authHeader()
    });
    if (!res.ok) throw new Error("Failed to load FAQs");
    const data = await res.json();
    setFaqs(data);
  } catch (err) {
    console.error("Failed to load FAQs:", err);
  } finally {
    setFaqsLoading(false);
  }
}

async function handleToggleApproval(reviewId, currentStatus) {
  try {
    const res = await fetch(
      `${API_BASE}/reviews/${reviewId}/approve?approved=${!currentStatus}`,
      {
        method: "PATCH",
        headers: authHeader()
      }
    );
    if (!res.ok) throw new Error("Failed to update approval");
    await loadReviews(); // Reload
  } catch (err) {
    console.error("Failed to toggle approval:", err);
    alert("Failed to update approval status");
  }
}

async function handleToggleFeatured(reviewId, currentStatus) {
  try {
    const res = await fetch(
      `${API_BASE}/reviews/${reviewId}/feature?featured=${!currentStatus}`,
      {
        method: "PATCH",
        headers: authHeader()
      }
    );
    if (!res.ok) throw new Error("Failed to update featured");
    await loadReviews(); // Reload
  } catch (err) {
    console.error("Failed to toggle featured:", err);
    alert("Failed to update featured status");
  }
}

async function handleSaveReply(reviewId) {
  try {
    const res = await fetch(
      `${API_BASE}/reviews/${reviewId}/reply`,
      {
        method: "PATCH",
        headers: {
          ...authHeader(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reply: replyText })
      }
    );
    if (!res.ok) throw new Error("Failed to save reply");
    
    setEditingReviewId(null);
    setReplyText("");
    await loadReviews();
  } catch (err) {
    console.error("Failed to save reply:", err);
    alert("Failed to save reply");
  }
}

function startEditFaq(faq) {
  setEditingFaqId(faq.id);
  setFaqForm({
    question: faq.question,
    answer: faq.answer,
    category: faq.category || "",
    displayOrder: faq.displayOrder,
    active: faq.active
  });
}

function cancelFaqEdit() {
  setEditingFaqId(null);
  setFaqForm({
    question: "",
    answer: "",
    category: "",
    displayOrder: 0,
    active: true
  });
}

async function handleSaveFaq(e) {
  e.preventDefault();
  
  // Validation
  if (!faqForm.question.trim() || !faqForm.answer.trim()) {
    alert("Question and answer are required");
    return;
  }

  try {
    const url = editingFaqId 
      ? `${API_BASE}/faqs/${editingFaqId}` 
      : `${API_BASE}/faqs`;
    
    const method = editingFaqId ? "PUT" : "POST";
    
    const res = await fetch(url, {
      method,
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(faqForm)
    });

    if (!res.ok) throw new Error("Failed to save FAQ");
    
    await loadFAQs();
    cancelFaqEdit();
  } catch (err) {
    console.error("Failed to save FAQ:", err);
    alert("Failed to save FAQ");
  }
}

async function handleDeleteFaq(id) {
  if (!window.confirm("Are you sure you want to delete this FAQ?")) {
    return;
  }
  
  try {
    const res = await fetch(`${API_BASE}/faqs/${id}`, {
      method: "DELETE",
      headers: authHeader()
    });
    if (!res.ok) throw new Error("Failed to delete FAQ");
    await loadFAQs();
  } catch (err) {
    console.error("Failed to delete FAQ:", err);
    alert("Failed to delete FAQ");
  }
}

async function handleDeleteReview(reviewId) {
  if (!window.confirm("Are you sure you want to delete this review?")) {
    return;
  }
  
  try {
    const res = await fetch(`${API_BASE}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: authHeader()
    });
    if (!res.ok) throw new Error("Failed to delete review");
    await loadReviews();
  } catch (err) {
    console.error("Failed to delete review:", err);
    alert("Failed to delete review");
  }
}

// ============================================
// PROMOTIONS FUNCTIONS
// ============================================

async function loadPromotions() {
  setPromotionsLoading(true);
  try {
    const res = await fetch(`${API_BASE}/promotions/all`, {
      headers: authHeader()
    });
    if (!res.ok) throw new Error("Failed to load promotions");
    const data = await res.json();
    setPromotions(data);
  } catch (err) {
    console.error("Failed to load promotions:", err);
  } finally {
    setPromotionsLoading(false);
  }
}

function startEditPromotion(promo) {
  setEditingPromotionId(promo.id);
  
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };
  
  setPromotionForm({
    title: promo.title,
    description: promo.description,
    discountText: promo.discountText || "",
    code: promo.code || "",
    startDate: formatDateForInput(promo.startDate),
    endDate: formatDateForInput(promo.endDate),
    active: promo.active,
    featured: promo.featured,
    bannerColor: promo.bannerColor || "#ff6b6b",
    termsAndConditions: promo.termsAndConditions || "",
    displayOrder: promo.displayOrder
  });
}

function cancelPromotionEdit() {
  setEditingPromotionId(null);
  setPromotionForm({
    title: "",
    description: "",
    discountText: "",
    code: "",
    startDate: "",
    endDate: "",
    active: true,
    featured: false,
    bannerColor: "#ff6b6b",
    termsAndConditions: "",
    displayOrder: 0
  });
}

async function handleSavePromotion(e) {
  e.preventDefault();
  
  if (!promotionForm.title.trim() || !promotionForm.description.trim()) {
    alert("Title and description are required");
    return;
  }
  
  if (!promotionForm.startDate || !promotionForm.endDate) {
    alert("Start and end dates are required");
    return;
  }
  
  if (new Date(promotionForm.endDate) <= new Date(promotionForm.startDate)) {
    alert("End date must be after start date");
    return;
  }

  try {
    const url = editingPromotionId 
      ? `${API_BASE}/promotions/${editingPromotionId}` 
      : `${API_BASE}/promotions`;
    
    const method = editingPromotionId ? "PUT" : "POST";
    
    const payload = {
      ...promotionForm,
      startDate: new Date(promotionForm.startDate).toISOString(),
      endDate: new Date(promotionForm.endDate).toISOString()
    };
    
    const res = await fetch(url, {
      method,
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Failed to save promotion");
    
    await loadPromotions();
    cancelPromotionEdit();
    alert(editingPromotionId ? "Promotion updated!" : "Promotion added!");
  } catch (err) {
    console.error("Failed to save promotion:", err);
    alert("Failed to save promotion");
  }
}

async function handleDeletePromotion(id) {
  if (!window.confirm("Are you sure you want to delete this promotion?")) {
    return;
  }
  
  try {
    const res = await fetch(`${API_BASE}/promotions/${id}`, {
      method: "DELETE",
      headers: authHeader()
    });
    if (!res.ok) throw new Error("Failed to delete promotion");
    await loadPromotions();
    alert("Promotion deleted!");
  } catch (err) {
    console.error("Failed to delete promotion:", err);
    alert("Failed to delete promotion");
  }
}












function startEditReply(review) {
  setEditingReviewId(review.id);
  setReplyText(review.adminReply || "");
}

function cancelEditReply() {
  setEditingReviewId(null);
  setReplyText("");
}


  function startEditGallery(item) {
    setEditingGalleryId(item.id);
    setGalleryForm({
      title: item.title || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      beforeImageUrl: item.beforeImageUrl || "",
      category: item.category || "",
      featured: item.featured || false,
      active: item.active !== false,
      displayOrder: item.displayOrder || 0,
      customerName: item.customerName || "",
    });
    setSaveMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelGalleryEdit() {
    setEditingGalleryId(null);
    setGalleryForm({
      title: "",
      description: "",
      imageUrl: "",
      beforeImageUrl: "",
      category: "",
      featured: false,
      active: true,
      displayOrder: 0,
      customerName: "",
    });
  }

  async function handleSaveGallery(e) {
    e.preventDefault();
    setSaveMessage("");

    if (!adminAuth) return;

    if (!galleryForm.title.trim()) {
      setSaveMessage("Error: Gallery title is required.");
      return;
    }

    if (!galleryForm.imageUrl.trim()) {
      setSaveMessage("Error: Please upload a main image.");
      return;
    }

    const isEdit = editingGalleryId != null;

    const url = isEdit
      ? `${API_BASE}/gallery/${editingGalleryId}`
      : `${API_BASE}/gallery`;

    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(galleryForm),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to save gallery item");
      }

      setSaveMessage(
        isEdit
          ? "Gallery item updated successfully."
          : "Gallery item added successfully."
      );

      cancelGalleryEdit();
      await loadGallery();
    } catch (err) {
      setSaveMessage("Error saving gallery item: " + err.message);
    }
  }

  async function handleDeleteGallery(id) {
    if (!adminAuth) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this gallery item?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/gallery/${id}`, {
        method: "DELETE",
        headers: authHeader(),
      });

      if (!res.ok) throw new Error("Failed to delete gallery item");

      setSaveMessage("Gallery item deleted.");
      await loadGallery();
    } catch (err) {
      alert(err.message || "Failed to delete gallery item");
    }
  }

  async function handleGalleryImageUpload(file, type = "main") {
    if (!file || !adminAuth) return;

    const isMain = type === "main";
    isMain ? setUploadingGalleryMain(true) : setUploadingGalleryBefore(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch(`${API_BASE}/gallery/upload-image`, {
        method: "POST",
        headers: authHeader(),
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setGalleryForm((prev) => ({
        ...prev,
        [isMain ? "imageUrl" : "beforeImageUrl"]: data.imageUrl,
      }));

      setSaveMessage(`${isMain ? "Main" : "Before"} image uploaded successfully.`);
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      isMain ? setUploadingGalleryMain(false) : setUploadingGalleryBefore(false);
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
  Twitter/X URL
  <input
    type="text"
    value={contactTwitter}
    onChange={(e) => setContactTwitter(e.target.value)}
    style={styles.input}
    placeholder="https://x.com/your-page"
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
  Logo (PNG, JPEG, JPG)
  <div style={{ marginBottom: 8 }}>
    <input
      type="file"
      accept="image/png,image/jpeg,image/jpg"
      onChange={handleLogoFileChange}
      style={{
        ...styles.input,
        padding: '8px',
        cursor: 'pointer',
      }}
    />
  </div>
  
  {/* Show current logo if exists */}
  {contactLogoUrl && (
    <div style={{ marginTop: 8, marginBottom: 8 }}>
      <img
        src={contactLogoUrl}
        alt="Current logo"
        style={{
          maxWidth: 200,
          maxHeight: 100,
          border: '1px solid #e0d6cf',
          borderRadius: 4,
          padding: 4,
        }}
      />
      <p style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
        Current logo
      </p>
    </div>
  )}
  
  {/* Optional: Manual URL input */}
  <details style={{ marginTop: 8 }}>
    <summary style={{ cursor: 'pointer', fontSize: 12, color: '#666' }}>
      Or enter logo URL manually
    </summary>
    <input
      type="text"
      value={contactLogoUrl}
      onChange={(e) => setContactLogoUrl(e.target.value)}
      style={{ ...styles.input, marginTop: 4 }}
      placeholder="https://…/logo.png"
    />
  </details>
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

            {/* Add / Edit Gallery Item */}
            <form onSubmit={handleSaveGallery} style={styles.form}>
              <h3 style={{ marginBottom: 8 }}>
                {editingGalleryId ? "Edit Gallery" : "Add Gallery Item"}
              </h3>

              <label style={styles.label}>
                Title *
                <input
                  type="text"
                  value={galleryForm.title}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, title: e.target.value })
                  }
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Description
                <textarea
                  value={galleryForm.description}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, description: e.target.value })
                  }
                  style={{ ...styles.input, minHeight: 60, resize: "vertical" }}
                />
              </label>

              <label style={styles.label}>
                Category (e.g., Threading, Facial, Waxing)
                <input
                  type="text"
                  value={galleryForm.category}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, category: e.target.value })
                  }
                  style={styles.input}
                  placeholder="Threading"
                />
              </label>

              <label style={styles.label}>
                Main Image (or "After" image) *
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files[0] &&
                    handleGalleryImageUpload(e.target.files[0], "main")
                  }
                  disabled={uploadingGalleryMain}
                  style={styles.input}
                />
                {uploadingGalleryMain && <span style={{ fontSize: 12 }}>Uploading...</span>}
                {galleryForm.imageUrl && (
                  <img
                    src={API_BASE.replace("/api", "") + galleryForm.imageUrl}
                    alt="Preview"
                    style={{ width: 100, height: 100, objectFit: "cover", marginTop: 8, borderRadius: 8 }}
                  />
                )}
              </label>

              <label style={styles.label}>
                Before Image (optional - for before/after)
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files[0] &&
                    handleGalleryImageUpload(e.target.files[0], "before")
                  }
                  disabled={uploadingGalleryBefore}
                  style={styles.input}
                />
                {uploadingGalleryBefore && <span style={{ fontSize: 12 }}>Uploading...</span>}
                {galleryForm.beforeImageUrl && (
                  <img
                    src={API_BASE.replace("/api", "") + galleryForm.beforeImageUrl}
                    alt="Before Preview"
                    style={{ width: 100, height: 100, objectFit: "cover", marginTop: 8, borderRadius: 8 }}
                  />
                )}
              </label>

              <label style={styles.label}>
                Customer Name (optional)
                <input
                  type="text"
                  value={galleryForm.customerName}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, customerName: e.target.value })
                  }
                  style={styles.input}
                  placeholder="Optional: customer who allowed this photo"
                />
              </label>

              <label style={styles.label}>
                Display Order (lower = first)
                <input
                  type="number"
                  value={galleryForm.displayOrder}
                  onChange={(e) =>
                    setGalleryForm({
                      ...galleryForm,
                      displayOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  style={styles.input}
                />
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <input
                  type="checkbox"
                  checked={galleryForm.featured}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, featured: e.target.checked })
                  }
                />
                Featured on homepage
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={galleryForm.active}
                  onChange={(e) =>
                    setGalleryForm({ ...galleryForm, active: e.target.checked })
                  }
                />
                Active (published)
              </label>

              <div style={{ marginTop: 8 }}>
                <button type="submit" style={styles.primaryButton}>
                  {editingGalleryId ? "Update Gallery" : "Save Gallery"}
                </button>
                {editingGalleryId && (
                  <button
                    type="button"
                    onClick={cancelGalleryEdit}
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

          {/* Gallery items admin list */}
          <div style={{ marginTop: 32 }}>
            <h3 style={{ marginBottom: 8 }}>Gallery Items</h3>

            {galleryLoading && <p>Loading gallery...</p>}
            {galleryError && (
              <p style={{ color: "red", fontSize: 13 }}>{galleryError}</p>
            )}

            {!galleryLoading && galleryItems.length === 0 && (
              <p>No gallery items yet.</p>
            )}

            {!galleryLoading && galleryItems.length > 0 && (
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
                      <th style={thStyle}>Images</th>
                      <th style={thStyle}>Title</th>
                      <th style={thStyle}>Category</th>
                      <th style={thStyle}>Order</th>
                      <th style={thStyle}>Featured</th>
                      <th style={thStyle}>Active</th>
                      <th style={thStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {galleryItems.map((item) => {
                      const backendBase = API_BASE.replace("/api", "");
                      return (
                        <tr key={item.id}>
                          <td style={tdStyle}>
                            <div style={{ display: "flex", gap: 4 }}>
                              {item.beforeImageUrl && (
                                <img
                                  src={backendBase + item.beforeImageUrl}
                                  alt="Before"
                                  style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: "cover",
                                    borderRadius: 4,
                                  }}
                                />
                              )}
                              <img
                                src={backendBase + item.imageUrl}
                                alt={item.title}
                                style={{
                                  width: 50,
                                  height: 50,
                                  objectFit: "cover",
                                  borderRadius: 4,
                                }}
                              />
                            </div>
                          </td>
                          <td style={tdStyle}>{item.title}</td>
                          <td style={tdStyle}>{item.category}</td>
                          <td style={tdStyle}>{item.displayOrder}</td>
                          <td style={tdStyle}>{item.featured ? "⭐ Yes" : "No"}</td>
                          <td style={tdStyle}>{item.active ? "✅ Yes" : "❌ No"}</td>
                          <td style={tdStyle}>
                            <button
                              type="button"
                              onClick={() => startEditGallery(item)}
                              style={smallBtn("#2563eb")}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteGallery(item.id)}
                              style={smallBtn("crimson")}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>


{/* Reviews Management - ADD AFTER Gallery Items section */}
<div style={{
  background: "rgba(255, 248, 220, 0.9)",
  borderRadius: 12,
  padding: 20,
  marginBottom: 24,
  border: "1px solid rgba(103, 72, 70, 0.3)"
}}>
  <h3 style={{ fontSize: 20, marginBottom: 16, color: "#674846" }}>
    Customer Reviews
  </h3>
  
  {reviewsLoading ? (
    <p>Loading reviews...</p>
  ) : (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map(review => (
          <div
            key={review.id}
            style={{
              padding: 16,
              backgroundColor: review.approved 
                ? "rgba(209, 250, 229, 0.3)" 
                : "rgba(254, 243, 199, 0.3)",
              borderRadius: 8,
              border: "1px solid rgba(103, 72, 70, 0.2)"
            }}
          >
            {/* Review Header */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              alignItems: "start",
              marginBottom: 12
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>
                  {review.customerName}
                </div>
                <div style={{ fontSize: 24 }}>
                  {"⭐".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </div>
                {review.serviceReceived && (
                  <div style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>
                    {review.serviceReceived}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#999" }}>
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Review Comment */}
            <p style={{ 
              marginBottom: 12,
              padding: 12,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: 6,
              lineHeight: 1.6
            }}>
              {review.comment}
            </p>

            {/* Admin Reply */}
            {editingReviewId === review.id ? (
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 8 }}>
                  Your Reply:
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 10,
                      fontSize: 14,
                      border: "1px solid rgba(103, 72, 70, 0.3)",
                      borderRadius: 8,
                      backgroundColor: "rgba(255, 248, 220, 0.5)",
                      minHeight: 80,
                      resize: "vertical",
                      fontFamily: "inherit"
                    }}
                    placeholder="Write your reply to this customer..."
                  />
                </label>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    onClick={() => handleSaveReply(review.id)}
                    style={{
                      padding: "6px 12px",
                      fontSize: 13,
                      backgroundColor: "#674846",
                      color: "#fff8dc",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer"
                    }}
                  >
                    Save Reply
                  </button>
                  <button
                    onClick={cancelEditReply}
                    style={{
                      padding: "6px 12px",
                      fontSize: 13,
                      backgroundColor: "#e5e5e5",
                      color: "#333",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : review.adminReply ? (
              <div style={{
                padding: 12,
                backgroundColor: "rgba(103, 72, 70, 0.1)",
                borderRadius: 6,
                marginBottom: 12
              }}>
                <strong>Your Reply:</strong>
                <p style={{ marginTop: 4 }}>{review.adminReply}</p>
                <button
                  onClick={() => startEditReply(review)}
                  style={{
                    marginTop: 8,
                    padding: "6px 12px",
                    fontSize: 13,
                    backgroundColor: "#674846",
                    color: "#fff8dc",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer"
                  }}
                >
                  Edit Reply
                </button>
              </div>
            ) : (
              <button
                onClick={() => startEditReply(review)}
                style={{
                  marginBottom: 12,
                  padding: "6px 12px",
                  fontSize: 13,
                  backgroundColor: "#674846",
                  color: "#fff8dc",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                💬 Reply to Customer
              </button>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => handleToggleApproval(review.id, review.approved)}
                style={{
                  padding: "6px 12px",
                  fontSize: 13,
                  backgroundColor: review.approved ? "#ef4444" : "#22c55e",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                {review.approved ? "❌ Unapprove" : "✅ Approve"}
              </button>
              
              <button
                onClick={() => handleToggleFeatured(review.id, review.featured)}
                style={{
                  padding: "6px 12px",
                  fontSize: 13,
                  backgroundColor: review.featured ? "#94a3b8" : "#f59e0b",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                {review.featured ? "⭐ Unfeature" : "⭐ Feature on Homepage"}
              </button>
              
              <button
                onClick={() => handleDeleteReview(review.id)}
                style={{
                  padding: "6px 12px",
                  fontSize: 13,
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                🗑️ Delete
              </button>
            </div>

            {/* Status Badges */}
            <div style={{ 
              display: "flex", 
              gap: 8, 
              marginTop: 12,
              fontSize: 11,
              fontWeight: 600
            }}>
              {review.approved && (
                <span style={{
                  backgroundColor: "#22c55e",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: 4
                }}>
                  APPROVED
                </span>
              )}
              {!review.approved && (
                <span style={{
                  backgroundColor: "#f59e0b",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: 4
                }}>
                  PENDING
                </span>
              )}
              {review.featured && (
                <span style={{
                  backgroundColor: "#a855f7",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: 4
                }}>
                  FEATURED
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )}
</div>


{/* FAQ Management */}
<div style={{
  background: "rgba(255, 248, 220, 0.9)",
  borderRadius: 12,
  padding: 20,
  marginBottom: 24,
  border: "1px solid rgba(103, 72, 70, 0.3)"
}}>
  <h3 style={{ fontSize: 20, marginBottom: 16, color: "#674846" }}>
    FAQ Management
  </h3>

  {/* Add/Edit FAQ Form */}
  <form onSubmit={handleSaveFaq} style={{ marginBottom: 24 }}>
    <div style={{
      display: "grid",
      gap: 16,
      padding: 16,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      borderRadius: 8
    }}>
      <label style={{ display: "block" }}>
        <strong>Question *</strong>
        <input
          type="text"
          value={faqForm.question}
          onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
          style={{
            width: "100%",
            padding: 10,
            fontSize: 14,
            border: "1px solid rgba(103, 72, 70, 0.3)",
            borderRadius: 8,
            backgroundColor: "rgba(255, 248, 220, 0.5)",
            marginTop: 4
          }}
          placeholder="e.g., How long does eyebrow threading take?"
          required
        />
      </label>

      <label style={{ display: "block" }}>
        <strong>Answer *</strong>
        <textarea
          value={faqForm.answer}
          onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
          style={{
            width: "100%",
            padding: 10,
            fontSize: 14,
            border: "1px solid rgba(103, 72, 70, 0.3)",
            borderRadius: 8,
            backgroundColor: "rgba(255, 248, 220, 0.5)",
            minHeight: 100,
            resize: "vertical",
            fontFamily: "inherit",
            marginTop: 4
          }}
          placeholder="Provide a detailed answer..."
          required
        />
      </label>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <label style={{ display: "block" }}>
          <strong>Category</strong>
          <input
            type="text"
            value={faqForm.category}
            onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 14,
              border: "1px solid rgba(103, 72, 70, 0.3)",
              borderRadius: 8,
              backgroundColor: "rgba(255, 248, 220, 0.5)",
              marginTop: 4
            }}
            placeholder="e.g., Booking, Services"
          />
        </label>

        <label style={{ display: "block" }}>
          <strong>Display Order</strong>
          <input
            type="number"
            value={faqForm.displayOrder}
            onChange={(e) => setFaqForm({ ...faqForm, displayOrder: parseInt(e.target.value) || 0 })}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 14,
              border: "1px solid rgba(103, 72, 70, 0.3)",
              borderRadius: 8,
              backgroundColor: "rgba(255, 248, 220, 0.5)",
              marginTop: 4
            }}
            placeholder="0"
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 28 }}>
          <input
            type="checkbox"
            checked={faqForm.active}
            onChange={(e) => setFaqForm({ ...faqForm, active: e.target.checked })}
            style={{ width: 20, height: 20 }}
          />
          <strong>Active (Published)</strong>
        </label>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: 14,
            backgroundColor: "#674846",
            color: "#fff8dc",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          {editingFaqId ? "Update FAQ" : "Add FAQ"}
        </button>
        {editingFaqId && (
          <button
            type="button"
            onClick={cancelFaqEdit}
            style={{
              padding: "10px 20px",
              fontSize: 14,
              backgroundColor: "#e5e5e5",
              color: "#333",
              border: "none",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  </form>

  {/* FAQ List */}
  {faqsLoading ? (
    <p>Loading FAQs...</p>
  ) : (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {faqs.length === 0 ? (
        <p>No FAQs yet. Add your first FAQ above!</p>
      ) : (
        faqs.map(faq => (
          <div
            key={faq.id}
            style={{
              padding: 16,
              backgroundColor: faq.active 
                ? "rgba(192, 153, 44, 0.3)" 
                : "rgba(254, 243, 199, 0.3)",
              borderRadius: 8,
              border: "1px solid rgba(103, 72, 70, 0.2)"
            }}
          >
            {/* Question */}
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
              Q: {faq.question}
            </div>

            {/* Answer Preview */}
            <div style={{
              fontSize: 14,
              color: "#666",
              marginBottom: 8,
              padding: 8,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: 4
            }}>
              A: {faq.answer.substring(0, 100)}{faq.answer.length > 100 ? "..." : ""}
            </div>

            {/* Metadata */}
            <div style={{
              display: "flex",
              gap: 12,
              fontSize: 12,
              color: "#666",
              marginBottom: 12
            }}>
              {faq.category && (
                <span style={{
                  backgroundColor: "rgba(103, 72, 70, 0.1)",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontWeight: 600
                }}>
                  {faq.category}
                </span>
              )}
              <span>Order: {faq.displayOrder}</span>
              <span style={{
                color: faq.active ? "#22c55e" : "#f59e0b",
                fontWeight: 600
              }}>
                {faq.active ? "✓ ACTIVE" : "○ INACTIVE"}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => startEditFaq(faq)}
                style={{
                  padding: "6px 12px",
                  fontSize: 13,
                  backgroundColor: "#674846",
                  color: "#fff8dc",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDeleteFaq(faq.id)}
                style={{
                  padding: "6px 12px",
                  fontSize: 13,
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )}
</div>

{/* Promotions Management */}
<div style={{
  background: "rgba(255, 248, 220, 0.9)",
  borderRadius: 12,
  padding: 20,
  marginBottom: 24,
  border: "1px solid rgba(103, 72, 70, 0.3)"
}}>
  <h3 style={{ fontSize: 20, marginBottom: 16, color: "#674846" }}>
    🎁 Promotions Management
  </h3>

  {/* Add/Edit Promotion Form */}
  <form onSubmit={handleSavePromotion} style={{ marginBottom: 24 }}>
    <div style={{
      display: "grid",
      gap: 16,
      padding: 16,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      borderRadius: 8
    }}>
      <label style={{ display: "block" }}>
        <strong>Title *</strong>
        <input
          type="text"
          value={promotionForm.title}
          onChange={(e) => setPromotionForm({ ...promotionForm, title: e.target.value })}
          style={{
            width: "100%",
            padding: 10,
            fontSize: 14,
            border: "1px solid rgba(103, 72, 70, 0.3)",
            borderRadius: 8,
            backgroundColor: "rgba(255, 248, 220, 0.5)",
            marginTop: 4
          }}
          placeholder="e.g., First Visit Special"
          required
        />
      </label>

      <label style={{ display: "block" }}>
        <strong>Description *</strong>
        <textarea
          value={promotionForm.description}
          onChange={(e) => setPromotionForm({ ...promotionForm, description: e.target.value })}
          style={{
            width: "100%",
            padding: 10,
            fontSize: 14,
            border: "1px solid rgba(103, 72, 70, 0.3)",
            borderRadius: 8,
            backgroundColor: "rgba(255, 248, 220, 0.5)",
            minHeight: 80,
            resize: "vertical",
            fontFamily: "inherit",
            marginTop: 4
          }}
          placeholder="Describe the promotion in detail..."
          required
        />
      </label>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <label style={{ display: "block" }}>
          <strong>Discount Text</strong>
          <input
            type="text"
            value={promotionForm.discountText}
            onChange={(e) => setPromotionForm({ ...promotionForm, discountText: e.target.value })}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 14,
              border: "1px solid rgba(103, 72, 70, 0.3)",
              borderRadius: 8,
              backgroundColor: "rgba(255, 248, 220, 0.5)",
              marginTop: 4
            }}
            placeholder="e.g., 20% OFF, $10 OFF"
          />
        </label>

        <label style={{ display: "block" }}>
          <strong>Promo Code</strong>
          <input
            type="text"
            value={promotionForm.code}
            onChange={(e) => setPromotionForm({ ...promotionForm, code: e.target.value.toUpperCase() })}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 14,
              border: "1px solid rgba(103, 72, 70, 0.3)",
              borderRadius: 8,
              backgroundColor: "rgba(255, 248, 220, 0.5)",
              marginTop: 4
            }}
            placeholder="e.g., FIRST20"
          />
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <label style={{ display: "block" }}>
          <strong>Start Date & Time *</strong>
          <input
            type="datetime-local"
            value={promotionForm.startDate}
            onChange={(e) => setPromotionForm({ ...promotionForm, startDate: e.target.value })}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 14,
              border: "1px solid rgba(103, 72, 70, 0.3)",
              borderRadius: 8,
              backgroundColor: "rgba(255, 248, 220, 0.5)",
              marginTop: 4
            }}
            required
          />
        </label>

        <label style={{ display: "block" }}>
          <strong>End Date & Time *</strong>
          <input
            type="datetime-local"
            value={promotionForm.endDate}
            onChange={(e) => setPromotionForm({ ...promotionForm, endDate: e.target.value })}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 14,
              border: "1px solid rgba(103, 72, 70, 0.3)",
              borderRadius: 8,
              backgroundColor: "rgba(255, 248, 220, 0.5)",
              marginTop: 4
            }}
            required
          />
        </label>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <label style={{ display: "block" }}>
          <strong>Banner Color</strong>
          <input
            type="color"
            value={promotionForm.bannerColor}
            onChange={(e) => setPromotionForm({ ...promotionForm, bannerColor: e.target.value })}
            style={{
              width: "100%",
              height: 42,
              border: "1px solid rgba(103, 72, 70, 0.3)",
              borderRadius: 8,
              cursor: "pointer",
              marginTop: 4
            }}
          />
        </label>

        <label style={{ display: "block" }}>
          <strong>Display Order</strong>
          <input
            type="number"
            value={promotionForm.displayOrder}
            onChange={(e) => setPromotionForm({ ...promotionForm, displayOrder: parseInt(e.target.value) || 0 })}
            style={{
              width: "100%",
              padding: 10,
              fontSize: 14,
              border: "1px solid rgba(103, 72, 70, 0.3)",
              borderRadius: 8,
              backgroundColor: "rgba(255, 248, 220, 0.5)",
              marginTop: 4
            }}
            placeholder="0"
          />
        </label>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 28 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={promotionForm.active}
              onChange={(e) => setPromotionForm({ ...promotionForm, active: e.target.checked })}
              style={{ width: 20, height: 20 }}
            />
            <strong>Active</strong>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={promotionForm.featured}
              onChange={(e) => setPromotionForm({ ...promotionForm, featured: e.target.checked })}
              style={{ width: 20, height: 20 }}
            />
            <strong>Featured (Homepage)</strong>
          </label>
        </div>
      </div>

      <label style={{ display: "block" }}>
        <strong>Terms & Conditions</strong>
        <input
          type="text"
          value={promotionForm.termsAndConditions}
          onChange={(e) => setPromotionForm({ ...promotionForm, termsAndConditions: e.target.value })}
          style={{
            width: "100%",
            padding: 10,
            fontSize: 14,
            border: "1px solid rgba(103, 72, 70, 0.3)",
            borderRadius: 8,
            backgroundColor: "rgba(255, 248, 220, 0.5)",
            marginTop: 4
          }}
          placeholder="e.g., New customers only, Cannot be combined with other offers"
        />
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: 14,
            backgroundColor: "#674846",
            color: "#fff8dc",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          {editingPromotionId ? "Update Promotion" : "Add Promotion"}
        </button>
        {editingPromotionId && (
          <button
            type="button"
            onClick={cancelPromotionEdit}
            style={{
              padding: "10px 20px",
              fontSize: 14,
              backgroundColor: "#e5e5e5",
              color: "#333",
              border: "none",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  </form>

  {/* Promotions List */}
  {promotionsLoading ? (
    <p>Loading promotions...</p>
  ) : (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {promotions.length === 0 ? (
        <p>No promotions yet. Add your first promotion above!</p>
      ) : (
        promotions.map(promo => {
          const now = new Date();
          const start = new Date(promo.startDate);
          const end = new Date(promo.endDate);
          const isActive = now >= start && now <= end;
          const isUpcoming = now < start;
          const isExpired = now > end;
          
          let statusColor = "#22c55e"; // Active green
          let statusText = "✓ ACTIVE";
          
          if (!promo.active) {
            statusColor = "#9ca3af"; // Disabled gray
            statusText = "○ DISABLED";
          } else if (isExpired) {
            statusColor = "#ef4444"; // Expired red
            statusText = "✕ EXPIRED";
          } else if (isUpcoming) {
            statusColor = "#3b82f6"; // Upcoming blue
            statusText = "⏳ UPCOMING";
          }
          
          return (
            <div
              key={promo.id}
              style={{
                padding: 16,
                backgroundColor: isActive && promo.active
                  ? "rgba(209, 250, 229, 0.3)" 
                  : "rgba(254, 243, 199, 0.3)",
                borderRadius: 8,
                border: "1px solid rgba(103, 72, 70, 0.2)"
              }}
            >
              {/* Title & Badges */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>
                  {promo.title}
                  {promo.discountText && (
                    <span style={{
                      marginLeft: 8,
                      backgroundColor: "#ff6b6b",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: "bold"
                    }}>
                      {promo.discountText}
                    </span>
                  )}
                </div>
                <div style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap"
                }}>
                  <span style={{
                    color: statusColor,
                    fontWeight: 600,
                    fontSize: 12
                  }}>
                    {statusText}
                  </span>
                  {promo.featured && (
                    <span style={{
                      backgroundColor: "#a855f7",
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600
                    }}>
                      ⭐ FEATURED
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div style={{
                fontSize: 14,
                color: "#666",
                marginBottom: 8
              }}>
                {promo.description}
              </div>

              {/* Metadata */}
              <div style={{
                display: "flex",
                gap: 16,
                fontSize: 12,
                color: "#666",
                marginBottom: 12,
                flexWrap: "wrap"
              }}>
                {promo.code && (
                  <span style={{
                    backgroundColor: "#674846",
                    color: "#fff8dc",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontWeight: 600,
                    fontFamily: "monospace"
                  }}>
                    CODE: {promo.code}
                  </span>
                )}
                <span>📅 {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}</span>
                <span>Order: {promo.displayOrder}</span>
                {promo.bannerColor && (
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    Color: <div style={{ width: 16, height: 16, backgroundColor: promo.bannerColor, borderRadius: 4, border: "1px solid #ccc" }}></div>
                  </span>
                )}
              </div>

              {promo.termsAndConditions && (
                <div style={{
                  fontSize: 11,
                  color: "#666",
                  fontStyle: "italic",
                  marginBottom: 12,
                  padding: 8,
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: 4
                }}>
                  * {promo.termsAndConditions}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => startEditPromotion(promo)}
                  style={{
                    padding: "6px 12px",
                    fontSize: 13,
                    backgroundColor: "#674846",
                    color: "#fff8dc",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer"
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeletePromotion(promo.id)}
                  style={{
                    padding: "6px 12px",
                    fontSize: 13,
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer"
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          );
        })
      )}
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