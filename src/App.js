// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { styles } from "./styles";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import ServicesBookingSection from "./components/ServicesBookingSection";
import TeamSection from "./components/TeamSection";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";
import AdminSection from "./components/AdminSection";
import GallerySection from "./components/GallerySection"; 
import ReviewsPage from './pages/ReviewsPage';
import PromotionsPage from './pages/PromotionsPage';


import ServicesPage from "./pages/ServicesPage";
import BlogListPage from "./pages/BlogListPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import GalleryPage from './pages/GalleryPage';  // ← ADD THIS LINE
import FAQPage from './pages/FAQPage';



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
                  <ServicesBookingSection /> 
                  {/* <BookingSection /> */}
                  <TeamSection />
                  <BlogSection />
                  <GallerySection />
                  <ContactSection />
                </>
              }
            />

            {/* <Route path="/" element={<HomePage />} /> */}
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/faq" element={<FAQPage />} />

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
