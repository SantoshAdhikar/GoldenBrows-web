package com.goldenbrows.backend.config;

import com.goldenbrows.backend.model.BusinessHours;
import com.goldenbrows.backend.model.SalonService;
import com.goldenbrows.backend.repository.BusinessHoursRepository;
import com.goldenbrows.backend.repository.SalonServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final BusinessHoursRepository businessHoursRepository;
    private final SalonServiceRepository salonServiceRepository;

    @Override
    public void run(String... args) {
        initBusinessHours();
        seedSalonServices();
    }

    private void initBusinessHours() {
        if (businessHoursRepository.count() > 0) {
            return; // already in DB
        }

        // Mon–Sun 10:00–19:00 by default
        for (DayOfWeek day : DayOfWeek.values()) {
            BusinessHours hours = BusinessHours.builder()
                    .dayOfWeek(day)
                    .openTime(LocalTime.of(10, 0))
                    .closeTime(LocalTime.of(19, 0))
                    .closed(false)
                    .build();
            businessHoursRepository.save(hours);
        }
    }

    private void seedSalonServices() {
        // We can run this every startup; it only INSERTs missing names.
        // --- Face Threading / Waxing ---
        saveServiceIfMissing("Mid Brow",      "Face Threading Waxing", bd("5"),  10);
        saveServiceIfMissing("Upper Lip",     "Face Threading Waxing", bd("6"),  10);
        saveServiceIfMissing("Chin",          "Face Threading Waxing", bd("6"),  10);
        saveServiceIfMissing("Forehead",      "Face Threading Waxing", bd("6"),  10);
        saveServiceIfMissing("Sides",         "Face Threading Waxing", bd("10"), 15);
        saveServiceIfMissing("Nose",          "Face Threading Waxing", bd("7"),  10);
        saveServiceIfMissing("Neck",          "Face Threading Waxing", bd("7"),  10);
        saveServiceIfMissing("Ear",           "Face Threading Waxing", bd("7"),  10);
        saveServiceIfMissing("Checks",        "Face Threading Waxing", bd("5"),  10);
        saveServiceIfMissing("Full Face",     "Face Threading Waxing", bd("30"), 30);
        saveServiceIfMissing("Half Leg",      "Face Threading Waxing", bd("40"), 30);

        // --- Brows ---
        saveServiceIfMissing("Brow Clean-up only",    "Brows", bd("10"), 15);
        saveServiceIfMissing("Golden BBrowsby Expert","Brows", bd("15"), 20);
        saveServiceIfMissing("Brow Tint",             "Brows", bd("15"), 20);
        saveServiceIfMissing("Brow Clean-up & Tint",  "Brows", bd("25"), 30);
        saveServiceIfMissing("Eyebrow Shaping",       "Brows", bd("10"), 15);

        // --- Facial / Massage ---
        saveServiceIfMissing("Eyelash Extension Remover", "Facial", bd("15"), 15);
        saveServiceIfMissing("Men Facial",                "Facial", bd("60"), 60);
        saveServiceIfMissing("Mini Facial",               "Facial", bd("45"), 45);
        saveServiceIfMissing("Deep Pore Cleansing",       "Facial", bd("60"), 60);
        saveServiceIfMissing("Hot Oil Scalp Massage",     "Facial", bd("45"), 30);
        saveServiceIfMissing("Hand & Shoulder Massage",   "Facial", bd("20"), 20);

        // --- Waxing ---
        saveServiceIfMissing("Chest Wax",        "Waxing", bd("30"), 30);
        saveServiceIfMissing("Stomach Wax",      "Waxing", bd("30"), 30);
        saveServiceIfMissing("Full Arms Waxing", "Waxing", bd("40"), 30);
        saveServiceIfMissing("Under Arms Waxing","Waxing", bd("15"), 15);
        saveServiceIfMissing("Brow Wax & Tint",  "Waxing", bd("25"), 20);
        saveServiceIfMissing("Bikini Line Wax",  "Waxing", bd("30"), 30);
        saveServiceIfMissing("Full Body Wax",    "Waxing", bd("150"), 90);
        saveServiceIfMissing("Brow Wax",         "Waxing", bd("10"), 15);
        saveServiceIfMissing("Full Leg Body Wax","Waxing", bd("65"), 45);
        saveServiceIfMissing("Full Bikini Wax",  "Waxing", bd("50"), 45);
        saveServiceIfMissing("Half Arms Waxing", "Waxing", bd("18"), 20);
        saveServiceIfMissing("Full Back Waxing", "Waxing", bd("45"), 30);

        // --- Brow Lamination & Lash Lift ---
        saveServiceIfMissing("Regular Lash Lift with Tint", "Brow Lamination Lash Lift", bd("75"), 60);
        saveServiceIfMissing("Keratin Lash Lift",           "Brow Lamination Lash Lift", bd("100"), 75);
        saveServiceIfMissing("Regular Lash Lift",           "Brow Lamination Lash Lift", bd("65"), 60);
        saveServiceIfMissing("Brow Lamination With Tint",   "Brow Lamination Lash Lift", bd("65"), 60);
        saveServiceIfMissing("Brow Lamination without Tint","Brow Lamination Lash Lift", bd("55"), 45);
        saveServiceIfMissing("Brow Lamination",             "Brow Lamination Lash Lift", bd("45"), 45);
        saveServiceIfMissing("Keratin Lash Lift with Tint", "Brow Lamination Lash Lift", bd("110"), 75);
    }

    private BigDecimal bd(String value) {
        return new BigDecimal(value);
    }

    private void saveServiceIfMissing(String name,
                                      String category,
                                      BigDecimal price,
                                      Integer durationMinutes) {

        salonServiceRepository.findByNameIgnoreCase(name)
                .ifPresentOrElse(
                        existing -> {
                            // already there – do nothing
                        },
                        () -> {
                            SalonService s = new SalonService();
                            s.setName(name);
                            s.setCategory(category);
                            s.setPrice(price);
                            s.setDurationMinutes(durationMinutes);
                            s.setActive(true);
                            // description & imagePath stay null; admin can edit later
                            salonServiceRepository.save(s);
                        }
                );
    }
}
