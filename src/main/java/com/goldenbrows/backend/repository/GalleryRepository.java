package com.goldenbrows.backend.repository;

import com.goldenbrows.backend.model.GalleryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryRepository extends JpaRepository<GalleryItem, Long> {
    
    // Find all active gallery items, ordered by displayOrder
    List<GalleryItem> findByActiveTrueOrderByDisplayOrderAsc();
    
    // Find featured items for homepage
    List<GalleryItem> findByActiveTrueAndFeaturedTrueOrderByDisplayOrderAsc();
    
    // Find by category
    List<GalleryItem> findByActiveTrueAndCategoryOrderByDisplayOrderAsc(String category);
    
    // Find all (for admin)
    List<GalleryItem> findAllByOrderByCreatedAtDesc();
}