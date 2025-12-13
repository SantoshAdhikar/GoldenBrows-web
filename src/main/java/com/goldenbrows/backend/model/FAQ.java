package com.goldenbrows.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "faqs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FAQ {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String question;
    
    @Column(nullable = false, length = 2000)
    private String answer;
    
    @Column(length = 50)
    private String category; // e.g., "Booking", "Services", "Payments", "General"
    
    @Column(nullable = false)
    private Integer displayOrder = 0; // Lower number = appears first
    
    @Column(nullable = false)
    private Boolean active = true; // Show/hide FAQ
    
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