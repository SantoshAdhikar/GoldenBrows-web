package com.goldenbrows.backend.controller;

import com.goldenbrows.backend.model.SalonService;
import com.goldenbrows.backend.repository.AppointmentRepository;
import com.goldenbrows.backend.repository.SalonServiceRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final SalonServiceRepository salonServiceRepository;
    private final AppointmentRepository appointmentRepository;

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

//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> delete(@PathVariable Long id) {
//        if (!salonServiceRepository.existsById(id)) {
//            return ResponseEntity.notFound().build();
//        }
//        salonServiceRepository.deleteById(id);
//        return ResponseEntity.noContent().build();
//    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        var optional = salonServiceRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        SalonService service = optional.get();

        // 🔍 1) Check if this service is used in any appointments
        if (appointmentRepository.existsByServiceId(id)) {
            // Instead of deleting, just deactivate it
            service.setActive(false);
            salonServiceRepository.save(service);

            // Still return 200 OK – frontend can refresh and see it as "Inactive"
            return ResponseEntity.ok(
                    "Service has existing appointments, so it was set to inactive instead of deleted."
            );
        }

        // ✅ 2) Safe to delete (no appointments referencing it)
        salonServiceRepository.delete(service);
        return ResponseEntity.noContent().build();
    }

    
    @PostMapping("/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        SalonService service = salonServiceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
        }

        String uploadsDir = "uploads/services/";
        Files.createDirectories(Path.of(uploadsDir));

        String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String filename = "service-" + id + "-" + System.currentTimeMillis() + "." + (ext != null ? ext : "jpg");

        Path target = Path.of(uploadsDir, filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        // store web path
        service.setImagePath("/uploads/services/" + filename);
        salonServiceRepository.save(service);

        return ResponseEntity.ok(service);
    }
    
    
    

}
