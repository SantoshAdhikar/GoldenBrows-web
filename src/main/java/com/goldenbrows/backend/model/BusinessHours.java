package com.goldenbrows.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(name = "business_hours")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessHours {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 10)
    private DayOfWeek dayOfWeek;   // MONDAY..SUNDAY

    // If closed = true, openTime/closeTime can be null
    @Column
    private LocalTime openTime;

    @Column
    private LocalTime closeTime;

    @NotNull
    @Column(nullable = false)
    private Boolean closed = false;
}
