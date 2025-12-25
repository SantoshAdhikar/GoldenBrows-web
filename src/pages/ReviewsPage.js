// src/pages/ReviewsPage.js
// Simple page - just calls ReviewsComponent with full page settings

import React from "react";
import ReviewsComponent from "../components/ReviewsComponent";

export default function ReviewsPage() {
  return (
    <main style={{ flex: 1 }}>
      <ReviewsComponent 
        showAll={true}         // Full reviews page
        showTitle={true}       // Show "Customer Reviews" title
        showStats={true}       // Show stats banner
        showForm={true}        // Show review submission form
      />
    </main>
  );
}