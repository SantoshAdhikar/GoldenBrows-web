package com.goldenbrows.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "promotions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promotion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String title;
    
    @Column(nullable = false, length = 500)
    private String description;
    
    @Column(length = 50)
    private String discountText; // e.g., "20% OFF", "$10 OFF"
    
    @Column(length = 100)
    private String code; // Optional promo code
    
    @Column(nullable = false)
    private LocalDateTime startDate;
    
    @Column(nullable = false)
    private LocalDateTime endDate;
    
    @Column(nullable = false)
    private Boolean active = true; // Enable/disable promo
    
    @Column(nullable = false)
    private Boolean featured = false; // Show on homepage banner
    
    @Column(length = 50)
    private String bannerColor; // e.g., "#ff6b6b", "red"
    
    @Column(length = 200)
    private String termsAndConditions;
    
    @Column(nullable = false)
    private Integer displayOrder = 0; // Lower number = appears first
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Helper method to check if promotion is currently valid
    @Transient
    public boolean isCurrentlyActive() {
        LocalDateTime now = LocalDateTime.now();
        return active && 
               now.isAfter(startDate) && 
               now.isBefore(endDate);
    }
}