package com.goldenbrows.backend.controller;

import com.goldenbrows.backend.model.Employee;
import com.goldenbrows.backend.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    // Public: list active employees (for customers to choose)
    @GetMapping
    public List<Employee> getActive() {
        return employeeRepository.findByActiveTrue();
    }

    // Admin: list all
    @GetMapping("/all")
    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    // Admin: get one
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getOne(@PathVariable Long id) {
        Optional<Employee> opt = employeeRepository.findById(id);
        return opt.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
 // DELETE /api/employees/{id} -> delete staff
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            if (!employeeRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            employeeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException ex) {
            // This happens if the employee is still referenced by appointments (FK constraint)
            return ResponseEntity.badRequest()
                    .body("Cannot delete this employee because they have appointments. " +
                          "Please cancel or reassign those appointments first, or mark the employee inactive.");
        }}
    
    @PostMapping("/upload-photo")
    public ResponseEntity<Map<String, String>> uploadEmployeePhoto(
            @RequestParam("file") MultipartFile file
    ) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Empty file"));
            }

            // Make an uploads/employees folder if it doesn't exist
            Path uploadDir = Paths.get("uploads/employees");
            Files.createDirectories(uploadDir);

            // Build a unique file name
            String originalName = StringUtils.cleanPath(file.getOriginalFilename());
            String ext = "";
            int dot = originalName.lastIndexOf('.');
            if (dot >= 0) {
                ext = originalName.substring(dot);
            }
            String filename = UUID.randomUUID().toString() + ext;

            Path target = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            // This URL assumes you already serve /uploads/** as static files
            String photoUrl = "/uploads/employees/" + filename;

            return ResponseEntity.ok(Map.of("photoUrl", photoUrl));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to store file"));
        }
    }

    

    // Admin: create employee
    @PostMapping
    public ResponseEntity<Employee> create(@RequestBody Employee request) {
        Employee saved = employeeRepository.save(
            Employee.builder()
                    .fullName(request.getFullName())
                    .displayName(request.getDisplayName())
                    .role(request.getRole())
                    .specialties(request.getSpecialties())
                    .bio(request.getBio())
                    .photoUrl(request.getPhotoUrl())
                    .active(request.getActive() != null ? request.getActive() : true)
                    .build()
        );

        return ResponseEntity
                .created(URI.create("/api/employees/" + saved.getId()))
                .body(saved);
    }


    // Admin: update employee
    @PutMapping("/{id}")
    public ResponseEntity<Employee> update(@PathVariable Long id,
                                           @RequestBody Employee request) {
        return employeeRepository.findById(id)
                .map(existing -> {
                    existing.setFullName(request.getFullName());
                    existing.setDisplayName(request.getDisplayName());
                    existing.setRole(request.getRole());
                    existing.setSpecialties(request.getSpecialties());
                    existing.setBio(request.getBio());
                    existing.setPhotoUrl(request.getPhotoUrl());
                    if (request.getActive() != null) {
                        existing.setActive(request.getActive());
                    }
                    Employee updated = employeeRepository.save(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
