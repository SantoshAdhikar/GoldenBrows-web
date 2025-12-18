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
        saveServiceIfMissing("Mid Brow",      "Face Threading Waxing", bd("6"),  10, false);
        saveServiceIfMissing("Upper Lip",     "Face Threading Waxing", bd("7"),  10, false);
        saveServiceIfMissing("Chin",          "Face Threading Waxing", bd("7"),  10, false);
        saveServiceIfMissing("Forehead",      "Face Threading Waxing", bd("7"),  10, false);
        saveServiceIfMissing("Sides",         "Face Threading Waxing", bd("12"), 15, false);
        saveServiceIfMissing("Nose",          "Face Threading Waxing", bd("8"),  10, false);
        saveServiceIfMissing("Neck",          "Face Threading Waxing", bd("8"),  10, false);
        saveServiceIfMissing("Ear",           "Face Threading Waxing", bd("8"),  10, false);
        saveServiceIfMissing("Checks",        "Face Threading Waxing", bd("6"),  10, false);
        
        // --- Threading ---
        saveServiceIfMissing("Eyebrows Threading only", "Threading", bd("12"), 10, false);
        saveServiceIfMissing("Eyebrows and Tint",       "Threading", bd("30"), 10, false);
        saveServiceIfMissing("Brow Tint only",          "Threading", bd("15"), 10, false);

        // --- Brows ---
        saveServiceIfMissing("Brow Clean-up only",     "Brows", bd("10"), 15, false);
        saveServiceIfMissing("Golden BBrowsby Expert", "Brows", bd("15"), 20, false);
        saveServiceIfMissing("Brow Tint",              "Brows", bd("15"), 20, false);
        saveServiceIfMissing("Brow Clean-up & Tint",   "Brows", bd("25"), 30, false);
        saveServiceIfMissing("Eyebrow Shaping",        "Brows", bd("10"), 15, false);

        // --- Facial / Massage ---
        saveServiceIfMissing("Eyelash Extension Remover", "Facial", bd("20"), 15, false);
        saveServiceIfMissing("Men Facial",                "Facial", bd("65"), 60, false);
        saveServiceIfMissing("Mini Facial",               "Facial", bd("50"), 45, false);
        saveServiceIfMissing("Deep Pore Cleansing",       "Facial", bd("70"), 60, false);
        saveServiceIfMissing("Hot Oil Scalp Massage",     "Facial", bd("50"), 30, false);
        saveServiceIfMissing("Hand & Shoulder Massage",   "Facial", bd("35"), 20, false);

        // --- Waxing (with "starting from" prices) ---
        saveServiceIfMissing("Chest Wax",        "Waxing", bd("35"),  30, true);  // ✅ Shows as $35+
        saveServiceIfMissing("Stomach Wax",      "Waxing", bd("35"),  30, true);  // ✅ Shows as $35+
        saveServiceIfMissing("Full Arms Waxing", "Waxing", bd("45"),  30, true);  // ✅ Shows as $45+
        saveServiceIfMissing("Under Arms Waxing","Waxing", bd("20"),  15, false);
        saveServiceIfMissing("Brow Wax & Tint",  "Waxing", bd("25"),  20, false);
        saveServiceIfMissing("Bikini Line Wax",  "Waxing", bd("35"),  30, false);
        saveServiceIfMissing("Full Body Wax",    "Waxing", bd("170"), 90, true);  // ✅ Shows as $170+
        saveServiceIfMissing("Brow Wax",         "Waxing", bd("10"),  15, false);
        saveServiceIfMissing("Full Leg Body Wax","Waxing", bd("70"),  45, true);  // ✅ Shows as $70+
        saveServiceIfMissing("Full Bikini Wax",  "Waxing", bd("55"),  45, false);
        saveServiceIfMissing("Half Arms Waxing", "Waxing", bd("30"),  20, true);  // ✅ Shows as $30+
        saveServiceIfMissing("Full Back Waxing", "Waxing", bd("50"),  30, true);  // ✅ Shows as $50+
        saveServiceIfMissing("Full Face Wax",    "Waxing", bd("35"),  30, false);
        saveServiceIfMissing("Eyebrow Wax",      "Waxing", bd("13"),  30, false);
        saveServiceIfMissing("Side Wax",         "Waxing", bd("12"),  30, false);
        saveServiceIfMissing("Half Leg Wax",     "Waxing", bd("45"),  30, true);  // ✅ Shows as $45+

        // --- Brow Lamination & Lash Lift ---
        saveServiceIfMissing("Regular Lash Lift with Tint", "Brow Lamination Lash Lift", bd("80"),  60, false);
        saveServiceIfMissing("Keratin Lash Lift",           "Brow Lamination Lash Lift", bd("110"), 75, false);
        saveServiceIfMissing("Regular Lash Lift",           "Brow Lamination Lash Lift", bd("70"),  60, false);
        saveServiceIfMissing("Brow Lamination With Tint",   "Brow Lamination Lash Lift", bd("70"),  60, false);
        saveServiceIfMissing("Brow Lamination without Tint","Brow Lamination Lash Lift", bd("60"),  45, false);
        saveServiceIfMissing("Brow Lamination",             "Brow Lamination Lash Lift", bd("50"),  45, false);
        saveServiceIfMissing("Keratin Lash Lift with Tint", "Brow Lamination Lash Lift", bd("120"), 75, false);
    }

    private BigDecimal bd(String value) {
        // Remove "+" if present (just in case)
        String cleanValue = value.replace("+", "");
        return new BigDecimal(cleanValue);
    }

    private void saveServiceIfMissing(String name,
                                      String category,
                                      BigDecimal price,
                                      Integer durationMinutes,
                                      Boolean priceFrom) {  // ✅ NEW PARAMETER

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
                            s.setPriceFrom(priceFrom);  // ✅ NEW FIELD
                            s.setActive(true);
                            // description & imagePath stay null; admin can edit later
                            salonServiceRepository.save(s);
                        }
                );
    }
}