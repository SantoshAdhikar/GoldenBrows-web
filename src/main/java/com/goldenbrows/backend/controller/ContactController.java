package com.goldenbrows.backend.controller;

import com.goldenbrows.backend.model.ContactInfo;
import com.goldenbrows.backend.repository.ContactInfoRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactInfoRepository contactInfoRepository;

    // PUBLIC – used by ContactSection on the site
    @GetMapping
    public ResponseEntity<ContactInfo> getContact() {
        return contactInfoRepository.findTopByOrderByIdAsc()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ADMIN – used by AdminSection "Contact & Social" form
    @PutMapping
    public ResponseEntity<ContactInfo> saveContact(@RequestBody ContactInfo request) {

        // either update existing row or create new one
        ContactInfo entity = contactInfoRepository
                .findTopByOrderByIdAsc()
                .orElseGet(ContactInfo::new);

        entity.setSalonName(request.getSalonName());
        entity.setAddressLine1(request.getAddressLine1());
        entity.setAddressLine2(request.getAddressLine2());
        entity.setPhone(request.getPhone());
        entity.setEmail(request.getEmail());
        entity.setInstagramUrl(request.getInstagramUrl());
        entity.setFacebookUrl(request.getFacebookUrl());
        entity.setTiktokUrl(request.getTiktokUrl());
        entity.setYelpUrl(request.getYelpUrl());
        entity.setGoogleMapsUrl(request.getGoogleMapsUrl());
        entity.setLogoUrl(request.getLogoUrl());
        entity.setUpdatedAt(LocalDateTime.now());

        ContactInfo saved = contactInfoRepository.save(entity);
        return ResponseEntity.ok(saved);
    }
    
    @Value("${file.upload-dir:uploads/logos}")
    private String uploadDir;

    /**
     * Upload logo image
     * POST /api/contact/upload-logo
     */
    @PostMapping("/upload-logo")
    public ResponseEntity<?> uploadLogo(@RequestParam("file") MultipartFile file) {
        
        // Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload");
        }

        // Check file type
        String contentType = file.getContentType();
        if (contentType == null || 
            !(contentType.equals("image/png") || 
              contentType.equals("image/jpeg") || 
              contentType.equals("image/jpg"))) {
            return ResponseEntity.badRequest().body("Only PNG and JPEG images are allowed");
        }

        // Check file size (5MB max)
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            return ResponseEntity.badRequest().body("File size must be less than 5MB");
        }

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".png";
            
            String filename = "logo-" + UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(filename);

            // Save file
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return URL
            String fileUrl = "/uploads/logos/" + filename;
            
            Map<String, String> response = new HashMap<>();
            response.put("logoUrl", fileUrl);
            response.put("url", fileUrl);
            response.put("message", "Logo uploaded successfully");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body("Failed to upload logo: " + e.getMessage());
        }
    }
}
