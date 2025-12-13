package com.goldenbrows.backend.repository;

import com.goldenbrows.backend.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    // Find all approved reviews, ordered by creation date (newest first)
    List<Review> findByApprovedTrueOrderByCreatedAtDesc();
    
    // Find featured reviews for homepage (approved and featured)
    List<Review> findByApprovedTrueAndFeaturedTrueOrderByCreatedAtDesc();
    
    // Find reviews by rating
    List<Review> findByApprovedTrueAndRatingOrderByCreatedAtDesc(Integer rating);
    
    // Find all (for admin - including unapproved)
    List<Review> findAllByOrderByCreatedAtDesc();
    
    // Calculate average rating
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.approved = true")
    Double getAverageRating();
    
    // Count approved reviews
    Long countByApprovedTrue();
}