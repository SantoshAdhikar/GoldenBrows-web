package com.goldenbrows.backend.repository;

import com.goldenbrows.backend.model.SalonService;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalonServiceRepository extends JpaRepository<SalonService, Long> {
	 boolean existsByNameIgnoreCase(String name);
	 Optional<SalonService> findByNameIgnoreCase(String name);
}
