package com.goldenbrows.backend.repository;

import com.goldenbrows.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findFirstByPhone(String phone);

    List<Customer> findByFullNameContainingIgnoreCase(String namePart);
}
