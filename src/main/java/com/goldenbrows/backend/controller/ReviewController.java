package com.goldenbrows.backend.controller;

import com.goldenbrows.backend.model.Review;
import com.goldenbrows.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;

    // Public: Get all approved reviews
    @GetMapping
    public List<Review> getApprovedReviews() {
        return reviewRepository.findByApprovedTrueOrderByCreatedAtDesc();
    }

    // Public: Get featured reviews (for homepage)
    @GetMapping("/featured")
    public List<Review> getFeaturedReviews() {
        return reviewRepository.findByApprovedTrueAndFeaturedTrueOrderByCreatedAtDesc();
    }

    // Public: Get review statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getReviewStats() {
        Double avgRating = reviewRepository.getAverageRating();
        Long totalReviews = reviewRepository.countByApprovedTrue();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("averageRating", avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        stats.put("totalReviews", totalReviews != null ? totalReviews : 0);
        
        return ResponseEntity.ok(stats);
    }

    // Public: Submit a review (requires approval)
    @PostMapping
    public ResponseEntity<Review> submitReview(@RequestBody Review request) {
        // Validate rating
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            return ResponseEntity.badRequest().build();
        }
        
        // Validate required fields
        if (request.getCustomerName() == null || request.getCustomerName().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        if (request.getComment() == null || request.getComment().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Review saved = reviewRepository.save(
            Review.builder()
                    .customerName(request.getCustomerName().trim())
                    .rating(request.getRating())
                    .comment(request.getComment().trim())
                    .serviceReceived(request.getServiceReceived())
                    .approved(false) // Requires admin approval
                    .featured(false)
                    .build()
        );

        return ResponseEntity
                .created(URI.create("/api/reviews/" + saved.getId()))
                .body(saved);
    }

    // Admin: Get all reviews (including unapproved)
    @GetMapping("/all")
    public List<Review> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    // Admin: Get one review
    @GetMapping("/{id}")
    public ResponseEntity<Review> getOne(@PathVariable Long id) {
        Optional<Review> opt = reviewRepository.findById(id);
        return opt.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    // Admin: Approve/Unapprove review
    @PatchMapping("/{id}/approve")
    public ResponseEntity<Review> toggleApproval(@PathVariable Long id,
                                                  @RequestParam boolean approved) {
        return reviewRepository.findById(id)
                .map(review -> {
                    review.setApproved(approved);
                    Review updated = reviewRepository.save(review);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: Feature/Unfeature review
    @PatchMapping("/{id}/feature")
    public ResponseEntity<Review> toggleFeatured(@PathVariable Long id,
                                                  @RequestParam boolean featured) {
        return reviewRepository.findById(id)
                .map(review -> {
                    review.setFeatured(featured);
                    Review updated = reviewRepository.save(review);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: Reply to review
    @PatchMapping("/{id}/reply")
    public ResponseEntity<Review> replyToReview(@PathVariable Long id,
                                                 @RequestBody Map<String, String> body) {
        String reply = body.get("reply");
        
        return reviewRepository.findById(id)
                .map(review -> {
                    review.setAdminReply(reply != null && !reply.trim().isEmpty() ? reply.trim() : null);
                    review.setAdminReplyAt(reply != null && !reply.trim().isEmpty() ? LocalDateTime.now() : null);
                    Review updated = reviewRepository.save(review);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: Update review
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id,
                                               @RequestBody Review request) {
        return reviewRepository.findById(id)
                .map(existing -> {
                    existing.setCustomerName(request.getCustomerName());
                    existing.setRating(request.getRating());
                    existing.setComment(request.getComment());
                    existing.setServiceReceived(request.getServiceReceived());
                    if (request.getApproved() != null) {
                        existing.setApproved(request.getApproved());
                    }
                    if (request.getFeatured() != null) {
                        existing.setFeatured(request.getFeatured());
                    }
                    
                    Review updated = reviewRepository.save(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: Delete review
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        try {
            if (!reviewRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            reviewRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.badRequest()
                    .body("Cannot delete this review.");
        }
    }
}