package com.goldenbrows.backend.controller;

import com.goldenbrows.backend.model.SalonService;
import com.goldenbrows.backend.repository.SalonServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;


import java.net.URI;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final SalonServiceRepository salonServiceRepository;

    @GetMapping
    public List<SalonService> getAll() {
        return salonServiceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalonService> getOne(@PathVariable Long id) {
        return salonServiceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SalonService> create(@Valid @RequestBody SalonService request) {
        SalonService saved = salonServiceRepository.save(request);
        return ResponseEntity
                .created(URI.create("/api/services/" + saved.getId()))
                .body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalonService> update(@PathVariable Long id,
                                               @Valid @RequestBody SalonService request) {
        Optional<SalonService> optional = salonServiceRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        SalonService existing = optional.get();
        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setPrice(request.getPrice());
        existing.setDurationMinutes(request.getDurationMinutes());
        existing.setActive(request.getActive());

        SalonService updated = salonServiceRepository.save(existing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!salonServiceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        salonServiceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
