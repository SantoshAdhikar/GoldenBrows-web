package com.goldenbrows.backend.controller;

import com.goldenbrows.backend.model.Promotion;
import com.goldenbrows.backend.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionRepository promotionRepository;

    // Public: Get all current active promotions
    @GetMapping
    public List<Promotion> getCurrentPromotions() {
        return promotionRepository.findCurrentActivePromotions(LocalDateTime.now());
    }

    // Public: Get featured promotions for homepage banner
    @GetMapping("/featured")
    public List<Promotion> getFeaturedPromotions() {
        return promotionRepository.findCurrentFeaturedPromotions(LocalDateTime.now());
    }

    // Public: Validate promo code
    @GetMapping("/validate/{code}")
    public ResponseEntity<?> validatePromoCode(@PathVariable String code) {
        Optional<Promotion> promo = promotionRepository.findByCodeIgnoreCase(code);
        
        if (promo.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Promotion promotion = promo.get();
        
        // Check if promo is currently valid
        if (!promotion.isCurrentlyActive()) {
            return ResponseEntity.badRequest()
                    .body("This promotion code is not currently valid");
        }
        
        return ResponseEntity.ok(promotion);
    }

    // Admin: Get all promotions (including inactive and expired)
    @GetMapping("/all")
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAllByOrderByDisplayOrderAsc();
    }

    // Admin: Get one promotion
    @GetMapping("/{id}")
    public ResponseEntity<Promotion> getOne(@PathVariable Long id) {
        Optional<Promotion> opt = promotionRepository.findById(id);
        return opt.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    // Admin: Create promotion
    @PostMapping
    public ResponseEntity<Promotion> create(@RequestBody Promotion request) {
        // Validate required fields
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        if (request.getDescription() == null || request.getDescription().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        if (request.getStartDate() == null || request.getEndDate() == null) {
            return ResponseEntity.badRequest().build();
        }
        
        // Validate end date is after start date
        if (request.getEndDate().isBefore(request.getStartDate())) {
            return ResponseEntity.badRequest().build();
        }
        
        Promotion saved = promotionRepository.save(
            Promotion.builder()
                    .title(request.getTitle().trim())
                    .description(request.getDescription().trim())
                    .discountText(request.getDiscountText())
                    .code(request.getCode())
                    .startDate(request.getStartDate())
                    .endDate(request.getEndDate())
                    .active(request.getActive() != null ? request.getActive() : true)
                    .featured(request.getFeatured() != null ? request.getFeatured() : false)
                    .bannerColor(request.getBannerColor() != null ? request.getBannerColor() : "#ff6b6b")
                    .termsAndConditions(request.getTermsAndConditions())
                    .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                    .build()
        );

        return ResponseEntity
                .created(URI.create("/api/promotions/" + saved.getId()))
                .body(saved);
    }

    // Admin: Update promotion
    @PutMapping("/{id}")
    public ResponseEntity<Promotion> update(@PathVariable Long id,
                                           @RequestBody Promotion request) {
        return promotionRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(request.getTitle());
                    existing.setDescription(request.getDescription());
                    existing.setDiscountText(request.getDiscountText());
                    existing.setCode(request.getCode());
                    existing.setStartDate(request.getStartDate());
                    existing.setEndDate(request.getEndDate());
                    
                    if (request.getActive() != null) {
                        existing.setActive(request.getActive());
                    }
                    if (request.getFeatured() != null) {
                        existing.setFeatured(request.getFeatured());
                    }
                    if (request.getDisplayOrder() != null) {
                        existing.setDisplayOrder(request.getDisplayOrder());
                    }
                    
                    existing.setBannerColor(request.getBannerColor());
                    existing.setTermsAndConditions(request.getTermsAndConditions());
                    
                    Promotion updated = promotionRepository.save(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: Delete promotion
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            if (!promotionRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            promotionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.badRequest()
                    .body("Cannot delete this promotion.");
        }
    }
}