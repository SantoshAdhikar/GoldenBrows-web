package com.goldenbrows.backend.config;

import com.goldenbrows.backend.model.SalonService;
import com.goldenbrows.backend.repository.SalonServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DefaultServicesSeeder implements CommandLineRunner {

    private final SalonServiceRepository salonServiceRepository;

    @Override
    public void run(String... args) {
        // Every time the app starts, make sure our core services exist.
        ensureService(
                "Eyebrow Threading",
                "Clean shaping and precise threading for eyebrows.",
                BigDecimal.valueOf(12),
                15
        );

        ensureService(
                "Upper Lip Threading",
                "Gentle hair removal for upper lip.",
                BigDecimal.valueOf(8),
                10
        );

        ensureService(
                "Full Face Threading",
                "Threading for brows, upper lip, and full face.",
                BigDecimal.valueOf(35),
                30
        );

        // Add any other standard services you always want:
        // ensureService("Chin Threading", "...", BigDecimal.valueOf(10), 10);
        // ensureService("Forehead Threading", "...", BigDecimal.valueOf(10), 10);
    }

    private void ensureService(String name,
                               String description,
                               BigDecimal price,
                               Integer durationMinutes) {

        boolean exists = salonServiceRepository.existsByNameIgnoreCase(name);
        if (exists) {
            // already there (maybe admin edited price/desc) – do NOT overwrite
            return;
        }

        SalonService s = SalonService.builder()
                .name(name)
                .description(description)
                .price(price)
                .durationMinutes(durationMinutes)
                .active(true)
                .build();

        salonServiceRepository.save(s);
    }
}
