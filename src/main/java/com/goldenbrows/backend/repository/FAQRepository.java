package com.goldenbrows.backend.repository;

import com.goldenbrows.backend.model.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FAQRepository extends JpaRepository<FAQ, Long> {
    
    // Find all active FAQs ordered by display order
    List<FAQ> findByActiveTrueOrderByDisplayOrderAsc();
    
    // Find FAQs by category
    List<FAQ> findByActiveTrueAndCategoryOrderByDisplayOrderAsc(String category);
    
    // Find all (for admin - including inactive)
    List<FAQ> findAllByOrderByDisplayOrderAsc();
}