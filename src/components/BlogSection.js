// src/components/BlogSection.js
// Simple component - just calls BlogComponent with homepage settings

import React from "react";
import BlogComponent from "./BlogComponent.js";

export default function BlogSection() {
  return (
    <BlogComponent 
      showAll={false}        // Homepage preview (not full page)
      latest={true}          // Load latest posts
      limit={3}              // Show only 3 posts
      showTitle={true}       // Show "Latest Posts" title
      showSubtitle={false}   // No subtitle on homepage
      showViewAll={true}     // Show "View all →" link
    />
  );
}