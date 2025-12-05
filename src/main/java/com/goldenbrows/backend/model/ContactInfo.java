package com.goldenbrows.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "contact_info")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContactInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String salonName;
    private String addressLine1;
    private String addressLine2;
    private String phone;
    private String email;

    private String instagramUrl;
    private String facebookUrl;
    private String tiktokUrl;
    private String yelpUrl;
    private String googleMapsUrl;
    private String logoUrl;

    private LocalDateTime updatedAt;
}
