package com.goldenbrows.backend.controller;

import com.goldenbrows.backend.model.GalleryItem;
import com.goldenbrows.backend.repository.GalleryRepository;
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
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryRepository galleryRepository;

    // Public: list all active gallery items
    @GetMapping
    public List<GalleryItem> getActive() {
        return galleryRepository.findByActiveTrueOrderByDisplayOrderAsc();
    }

    // Public: list featured items (for homepage)
    @GetMapping("/featured")
    public List<GalleryItem> getFeatured() {
        return galleryRepository.findByActiveTrueAndFeaturedTrueOrderByDisplayOrderAsc();
    }

    // Public: list by category
    @GetMapping("/category/{category}")
    public List<GalleryItem> getByCategory(@PathVariable String category) {
        return galleryRepository.findByActiveTrueAndCategoryOrderByDisplayOrderAsc(category);
    }

    // Admin: list all
    @GetMapping("/all")
    public List<GalleryItem> getAll() {
        return galleryRepository.findAllByOrderByCreatedAtDesc();
    }

    // Admin: get one
    @GetMapping("/{id}")
    public ResponseEntity<GalleryItem> getOne(@PathVariable Long id) {
        Optional<GalleryItem> opt = galleryRepository.findById(id);
        return opt.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    // Admin: upload gallery image
    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "main") String type
    ) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Empty file"));
            }

            // Create uploads/gallery folder if it doesn't exist
            Path uploadDir = Paths.get("uploads/gallery");
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
            String imageUrl = "/uploads/gallery/" + filename;

            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to store file"));
        }
    }

    // Admin: create gallery item
    @PostMapping
    public ResponseEntity<GalleryItem> create(@RequestBody GalleryItem request) {
        GalleryItem saved = galleryRepository.save(
            GalleryItem.builder()
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .imageUrl(request.getImageUrl())
                    .beforeImageUrl(request.getBeforeImageUrl())
                    .category(request.getCategory())
                    .service(request.getService())
                    .featured(request.getFeatured() != null ? request.getFeatured() : false)
                    .active(request.getActive() != null ? request.getActive() : true)
                    .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                    .customerName(request.getCustomerName())
                    .build()
        );

        return ResponseEntity
                .created(URI.create("/api/gallery/" + saved.getId()))
                .body(saved);
    }

    // Admin: update gallery item
    @PutMapping("/{id}")
    public ResponseEntity<GalleryItem> update(@PathVariable Long id,
                                              @RequestBody GalleryItem request) {
        return galleryRepository.findById(id)
                .map(existing -> {
                    existing.setTitle(request.getTitle());
                    existing.setDescription(request.getDescription());
                    existing.setImageUrl(request.getImageUrl());
                    existing.setBeforeImageUrl(request.getBeforeImageUrl());
                    existing.setCategory(request.getCategory());
                    existing.setService(request.getService());
                    if (request.getFeatured() != null) {
                        existing.setFeatured(request.getFeatured());
                    }
                    if (request.getActive() != null) {
                        existing.setActive(request.getActive());
                    }
                    if (request.getDisplayOrder() != null) {
                        existing.setDisplayOrder(request.getDisplayOrder());
                    }
                    existing.setCustomerName(request.getCustomerName());
                    
                    GalleryItem updated = galleryRepository.save(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: delete gallery item
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            if (!galleryRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            galleryRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.badRequest()
                    .body("Cannot delete this gallery item due to database constraints.");
        }
    }
}