package com.goldenbrows.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(length = 50)
    private String displayName;  // e.g. "Sita" / "Rita"

    @Column(length = 50)
    private String role;         // e.g. "Threading Artist"

    @Column(nullable = false)
    private Boolean active = true;
    
    @Column(length = 1000)
    private String bio;

    @Column(length = 255)
    private String photoUrl;

    @Column(length = 255)
    private String specialties;  // "Threading, Waxing, Facials"

}
