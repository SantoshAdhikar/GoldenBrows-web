import React from "react";
import Hero from "../components/Hero";
import ServicesBookingSection from "../components/ServicesBookingSection";
import TeamSection from "../components/TeamSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import GallerySection from '../components/GallerySection';
import ReviewsSection from '../components/ReviewsSection';
import PromotionBanner from '../components/PromotionBanner';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <ServicesBookingSection />
      <GallerySection /> 
      <ReviewsSection />
      <PromotionBanner />
      <TeamSection />
      <ContactSection />
      <Footer />
    </div>
  );
}