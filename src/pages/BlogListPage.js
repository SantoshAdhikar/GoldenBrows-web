// src/pages/BlogListPage.js
// Simple page - just calls BlogComponent with full page settings

import React from "react";
import BlogComponent from "../components/BlogComponent.js";

export default function BlogListPage() {
  return (
    <main style={{ flex: 1 }}>
      <BlogComponent 
        showAll={true}         // Full blog page
        showTitle={true}       // Show "Beauty Tips & Updates" title
        showSubtitle={true}    // Show subtitle
      />
    </main>
  );
}