package com.goldenbrows.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "gallery_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GalleryItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String title;
    
    @Column(length = 500)
    private String description;
    
    @Column(nullable = false, length = 255)
    private String imageUrl;  // Main image or "after" image
    
    @Column(length = 255)
    private String beforeImageUrl;  // Optional "before" image for before/after showcase
    
    @Column(length = 50)
    private String category;  // e.g. "Threading", "Facial", "Waxing", "Henna"
    
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private SalonService service;  // Link to which service this showcases
    
    @Column(nullable = false)
    private Boolean featured = false;  // Show on homepage?
    
    @Column(nullable = false)
    private Boolean active = true;  // Published or draft
    
    @Column(nullable = false)
    private Integer displayOrder = 0;  // For sorting
    
    @Column(length = 100)
    private String customerName;  // Optional: customer who allowed this photo
    
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
}