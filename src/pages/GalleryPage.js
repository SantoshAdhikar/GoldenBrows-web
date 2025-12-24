// src/pages/GalleryPage.js
// Simple page - just calls GalleryComponent with full page settings

import React from "react";
import GalleryComponent from "../components/GalleryComponent";

export default function GalleryPage() {
  return (
    <main style={{ flex: 1 }}>
      <GalleryComponent 
        showAll={true}         // Full gallery page
        showTitle={true}       // Show "Our Work Gallery" title
        showSubtitle={true}    // Show subtitle
        showFilters={true}     // Show category filter tabs
      />
    </main>
  );
}