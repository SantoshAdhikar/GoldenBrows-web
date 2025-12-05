package com.goldenbrows.backend.controller;

import com.goldenbrows.backend.model.ContactInfo;
import com.goldenbrows.backend.repository.ContactInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

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
}
