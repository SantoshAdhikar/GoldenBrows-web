package com.goldenbrows.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String customerName;
    
    @Column(nullable = false)
    private Integer rating; // 1-5 stars
    
    @Column(nullable = false, length = 1000)
    private String comment;
    
    @Column(length = 50)
    private String serviceReceived; // Optional: which service they got
    
    @Column(nullable = false)
    private Boolean approved = false; // Admin must approve before showing
    
    @Column(nullable = false)
    private Boolean featured = false; // Show on homepage?
    
    @Column(length = 1000)
    private String adminReply; // Admin can respond to reviews
    
    @Column
    private LocalDateTime adminReplyAt;
    
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