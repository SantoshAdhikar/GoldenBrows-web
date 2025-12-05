// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { styles } from "./styles";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import ServiceSection from "./components/ServiceSection";
// import BookingSection from "./components/BookingSection";
import TeamSection from "./components/TeamSection";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import AdminSection from "./components/AdminSection";

import ServicesPage from "./pages/ServicesPage";
import BlogListPage from "./pages/BlogListPage";
import BlogDetailPage from "./pages/BlogDetailPage";



function App() {
  const [adminAuth, setAdminAuth] = useState(null);

  return (
    <Router>
      {/* 🔹 animated background is handled inside styles.page */}
      <div style={styles.page}>
        <Header />

        <main style={styles.main}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <ServiceSection /> 
                  {/* <BookingSection /> */}
                  <TeamSection />
                  <BlogSection />
                  <ContactSection />
                </>
              }
            />

            <Route path="/services" element={<ServicesPage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />

            <Route
              path="/admin"
              element={
                <AdminSection
                  adminAuth={adminAuth}
                  setAdminAuth={setAdminAuth}
                />
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
