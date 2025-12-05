package com.goldenbrows.backend.controller;

import com.goldenbrows.backend.model.BusinessHours;
import com.goldenbrows.backend.repository.BusinessHoursRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@RestController
@RequestMapping("/api/business-hours")
@RequiredArgsConstructor
public class BusinessHoursController {

    private final BusinessHoursRepository businessHoursRepository;

    // Public: get all hours
    @GetMapping
    public List<BusinessHours> getAll() {
        return businessHoursRepository.findAll();
    }

    // Public: get hours for a specific day: /api/business-hours/MONDAY
    @GetMapping("/{day}")
    public ResponseEntity<BusinessHours> getByDay(@PathVariable String day) {
        DayOfWeek dow;
        try {
            dow = DayOfWeek.valueOf(day.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }

        Optional<BusinessHours> opt = businessHoursRepository.findByDayOfWeek(dow);
        return opt.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Admin: update hours for a day
    // Example: PUT /api/business-hours/MONDAY?open=10:00&close=19:00&closed=false
    @PutMapping("/{day}")
    public ResponseEntity<BusinessHours> updateDay(@PathVariable String day,
                                                   @RequestParam(required = false) String open,
                                                   @RequestParam(required = false) String close,
                                                   @RequestParam boolean closed) {
        DayOfWeek dow;
        try {
            dow = DayOfWeek.valueOf(day.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        }

        Optional<BusinessHours> opt = businessHoursRepository.findByDayOfWeek(dow);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        BusinessHours existing = opt.get();
        existing.setClosed(closed);

        if (closed) {
            existing.setOpenTime(null);
            existing.setCloseTime(null);
        } else {
            if (open != null && close != null) {
                existing.setOpenTime(java.time.LocalTime.parse(open));
                existing.setCloseTime(java.time.LocalTime.parse(close));
            }
        }

        BusinessHours saved = businessHoursRepository.save(existing);
        return ResponseEntity.ok(saved);
    }
}
