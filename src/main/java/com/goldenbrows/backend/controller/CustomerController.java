package com.goldenbrows.backend.controller;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.goldenbrows.backend.repository.AppointmentRepository;

import com.goldenbrows.backend.model.Appointment;
import com.goldenbrows.backend.model.Customer;
import com.goldenbrows.backend.repository.CustomerRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerRepository customerRepository;
    private final AppointmentRepository appointmentRepository;

    // List all customers
    @GetMapping
    public List<Customer> getAll() {
        return customerRepository.findAll();
    }

    // Get one customer by id
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getOne(@PathVariable Long id) {
        Optional<Customer> opt = customerRepository.findById(id);
        return opt.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    // Search by partial name: /api/customers/search?name=tony
    @GetMapping("/search")
    public List<Customer> searchByName(@RequestParam String name) {
        return customerRepository.findByFullNameContainingIgnoreCase(name);
    }

    // OPTIONAL: create customer manually (mostly for admin tools; normally bookings create them)
    @PostMapping
    public ResponseEntity<Customer> create(@RequestBody Customer request) {
        Customer saved = customerRepository.save(request);
        return ResponseEntity
                .created(URI.create("/api/customers/" + saved.getId()))
                .body(saved);
    }
    
 // All appointments for a customer (ADMIN)
    @GetMapping("/{id}/appointments")
    public ResponseEntity<List<Appointment>> getAppointments(@PathVariable Long id) {
        return customerRepository.findById(id)
                .map(c -> {
                    List<Appointment> appts = appointmentRepository.findByCustomer_Id(id);
                    return ResponseEntity.ok(appts);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // OPTIONAL: update notes or contact info
    @PutMapping("/{id}")
    public ResponseEntity<Customer> update(@PathVariable Long id,
                                           @RequestBody Customer request) {
        Optional<Customer> opt = customerRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Customer existing = opt.get();
        existing.setFullName(request.getFullName());
        existing.setPhone(request.getPhone());
        existing.setEmail(request.getEmail());
        existing.setNotes(request.getNotes());

        Customer updated = customerRepository.save(existing);
        return ResponseEntity.ok(updated);
    }
    
}
