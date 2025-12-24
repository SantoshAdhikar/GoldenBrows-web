// src/components/GallerySection.js
// Simple component - just calls GalleryComponent with homepage settings

import React from "react";
import GalleryComponent from "./GalleryComponent";

export default function GallerySection() {
  return (
    <GalleryComponent 
      showAll={false}        // Homepage preview (not full page)
      featured={true}        // Load featured items
      limit={6}              // Show only 6 items
      showTitle={true}       // Show "Our Work" title
      showSubtitle={false}   // No subtitle on homepage
      showFilters={false}    // No category filters on homepage
      showViewAll={true}     // Show "View all →" link
    />
  );
}