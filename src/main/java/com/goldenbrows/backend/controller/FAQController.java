package com.goldenbrows.backend.controller;

import com.goldenbrows.backend.model.FAQ;
import com.goldenbrows.backend.repository.FAQRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/faqs")
@RequiredArgsConstructor
public class FAQController {

    private final FAQRepository faqRepository;

    // Public: Get all active FAQs
    @GetMapping
    public List<FAQ> getActiveFAQs() {
        return faqRepository.findByActiveTrueOrderByDisplayOrderAsc();
    }

    // Public: Get FAQs by category
    @GetMapping("/category/{category}")
    public List<FAQ> getFAQsByCategory(@PathVariable String category) {
        return faqRepository.findByActiveTrueAndCategoryOrderByDisplayOrderAsc(category);
    }

    // Admin: Get all FAQs (including inactive)
    @GetMapping("/all")
    public List<FAQ> getAllFAQs() {
        return faqRepository.findAllByOrderByDisplayOrderAsc();
    }

    // Admin: Get one FAQ
    @GetMapping("/{id}")
    public ResponseEntity<FAQ> getOne(@PathVariable Long id) {
        Optional<FAQ> opt = faqRepository.findById(id);
        return opt.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    // Admin: Create FAQ
    @PostMapping
    public ResponseEntity<FAQ> create(@RequestBody FAQ request) {
        // Validate required fields
        if (request.getQuestion() == null || request.getQuestion().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        if (request.getAnswer() == null || request.getAnswer().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        FAQ saved = faqRepository.save(
            FAQ.builder()
                    .question(request.getQuestion().trim())
                    .answer(request.getAnswer().trim())
                    .category(request.getCategory())
                    .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                    .active(request.getActive() != null ? request.getActive() : true)
                    .build()
        );

        return ResponseEntity
                .created(URI.create("/api/faqs/" + saved.getId()))
                .body(saved);
    }

    // Admin: Update FAQ
    @PutMapping("/{id}")
    public ResponseEntity<FAQ> update(@PathVariable Long id,
                                      @RequestBody FAQ request) {
        return faqRepository.findById(id)
                .map(existing -> {
                    existing.setQuestion(request.getQuestion());
                    existing.setAnswer(request.getAnswer());
                    existing.setCategory(request.getCategory());
                    if (request.getDisplayOrder() != null) {
                        existing.setDisplayOrder(request.getDisplayOrder());
                    }
                    if (request.getActive() != null) {
                        existing.setActive(request.getActive());
                    }
                    
                    FAQ updated = faqRepository.save(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin: Delete FAQ
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            if (!faqRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            faqRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.badRequest()
                    .body("Cannot delete this FAQ.");
        }
    }
}