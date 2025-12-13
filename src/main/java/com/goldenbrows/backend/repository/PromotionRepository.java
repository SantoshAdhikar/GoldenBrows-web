package com.goldenbrows.backend.repository;

import com.goldenbrows.backend.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    
    // Find all active promotions that are currently valid (between start and end date)
    @Query("SELECT p FROM Promotion p WHERE p.active = true AND p.startDate <= :now AND p.endDate >= :now ORDER BY p.displayOrder ASC")
    List<Promotion> findCurrentActivePromotions(LocalDateTime now);
    
    // Find featured promo for homepage banner
    @Query("SELECT p FROM Promotion p WHERE p.active = true AND p.featured = true AND p.startDate <= :now AND p.endDate >= :now ORDER BY p.displayOrder ASC")
    List<Promotion> findCurrentFeaturedPromotions(LocalDateTime now);
    
    // Find by promo code (for validation)
    Optional<Promotion> findByCodeIgnoreCase(String code);
    
    // Find all (for admin - including inactive and expired)
    List<Promotion> findAllByOrderByDisplayOrderAsc();
}