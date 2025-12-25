// src/components/ReviewsSection.js
// Simple component - just calls ReviewsComponent with homepage settings

import React from "react";
import ReviewsComponent from "./ReviewsComponent";

export default function ReviewsSection() {
  return (
    <ReviewsComponent 
      showAll={false}        // Homepage preview (not full page)
      featured={true}        // Load featured reviews
      limit={3}              // Show only 3 reviews
      showTitle={true}       // Show "What Our Customers Say" title
      showStats={true}       // Show stats banner
      showViewAll={true}     // Show "View all reviews →" link
      showForm={false}       // No form on homepage
    />
  );
}