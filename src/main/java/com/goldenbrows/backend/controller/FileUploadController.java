package com.goldenbrows.backend.controller;

import com.goldenbrows.backend.model.Employee;
import com.goldenbrows.backend.repository.EmployeeRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/uploads")
@RequiredArgsConstructor
public class FileUploadController {

    private final EmployeeRepository employeeRepository;

    // folder "uploads" in the same directory where you run the app
    private final Path rootDir = Paths.get("uploads");

    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(rootDir.resolve("logos"));
        Files.createDirectories(rootDir.resolve("employees"));
    }

    // --- Upload salon LOGO ---
    @PostMapping(path = "/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadLogo(@RequestPart("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Empty file");
        }

        String filename = UUID.randomUUID() + getExtension(file.getOriginalFilename());
        Path target = rootDir.resolve("logos").resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        // we store only the path; frontend will prefix with backend host
        String url = "/uploads/logos/" + filename;
        return ResponseEntity.ok(Map.of("url", url));
    }

    // --- Upload EMPLOYEE photo and save to DB ---
    @PostMapping(path = "/employees/{id}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadEmployeePhoto(@PathVariable Long id,
                                                 @RequestPart("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Empty file");
        }

        Employee emp = employeeRepository.findById(id)
                .orElse(null);

        if (emp == null) {
            return ResponseEntity.notFound().build();
        }

        String filename = id + "-" + UUID.randomUUID() + getExtension(file.getOriginalFilename());
        Path target = rootDir.resolve("employees").resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String url = "/uploads/employees/" + filename;
        emp.setPhotoUrl(url);
        employeeRepository.save(emp);

        return ResponseEntity.ok(Map.of("url", url));
    }

    private String getExtension(String originalName) {
        if (originalName == null) return "";
        int dot = originalName.lastIndexOf('.');
        return (dot >= 0) ? originalName.substring(dot) : "";
    }
}
