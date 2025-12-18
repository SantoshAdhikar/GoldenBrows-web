package com.goldenbrows.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalonService {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String name;
    
    @Size(max = 500)
    @Column(length = 500)
    private String description;
    
    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    @Digits(integer = 8, fraction = 2)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    // ✅ Shows "starting from" price (e.g., $35+)
    @Column(name = "price_from")
    private Boolean priceFrom = false;
    
    @NotNull
    @Min(5)
    @Max(600) // max 10 hours
    @Column(nullable = false)
    private Integer durationMinutes;
    
    @NotNull
    @Column(nullable = false)
    private Boolean active = true;
    
    // Category: "Face Threading Waxing", "Brows", "Waxing", etc.
    @Column(length = 100)
    private String category;
    
    // Image path: e.g., "/images/services/123_face.jpg"
    @Column(name = "image_path")
    private String imagePath;
}