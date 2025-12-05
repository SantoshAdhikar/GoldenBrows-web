package com.goldenbrows.backend.repository;

import com.goldenbrows.backend.model.ContactInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContactInfoRepository extends JpaRepository<ContactInfo, Long> {

    // We only ever need one row – grab the first one
    Optional<ContactInfo> findTopByOrderByIdAsc();
}
