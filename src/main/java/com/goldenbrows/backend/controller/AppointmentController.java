package com.goldenbrows.backend.controller;

import com.goldenbrows.backend.model.*;
import com.goldenbrows.backend.repository.AppointmentRepository;
import com.goldenbrows.backend.repository.CustomerRepository;
import com.goldenbrows.backend.repository.SalonServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final SalonServiceRepository salonServiceRepository;
    private final CustomerRepository customerRepository;

    @GetMapping
    public List<Appointment> getAll() {
        return appointmentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getOne(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Appointments for a specific date
    @GetMapping("/by-date")
    public List<Appointment> getByDate(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {

        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);
        return appointmentRepository.findByAppointmentTimeBetween(start, end);
    }

    // NEW: Appointments by customer
    @GetMapping("/by-customer/{customerId}")
    public ResponseEntity<List<Appointment>> getByCustomer(@PathVariable Long customerId) {
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (customerOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Appointment> list = appointmentRepository.findAll()
                .stream()
                .filter(a -> a.getCustomer() != null && a.getCustomer().getId().equals(customerId))
                .toList();
        return ResponseEntity.ok(list);
    }

    // Create a new appointment (booking) – same params you are already using
    @PostMapping
    public ResponseEntity<?> create(@RequestParam Long serviceId,
                                    @RequestParam String customerName,
                                    @RequestParam String phone,
                                    @RequestParam(required = false) String email,
                                    @RequestParam
                                    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
                                    LocalDateTime appointmentTime,
                                    @RequestParam(required = false) String notes) {

        Optional<SalonService> serviceOpt = salonServiceRepository.findById(serviceId);
        if (serviceOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid serviceId");
        }

        SalonService service = serviceOpt.get();
        if (Boolean.FALSE.equals(service.getActive())) {
            return ResponseEntity.badRequest().body("Service is not active");
        }

        if (appointmentTime.isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Appointment time must be in the future");
        }

        // Find or create Customer by phone
        Customer customer = customerRepository.findFirstByPhone(phone)
                .orElseGet(() -> {
                    Customer c = Customer.builder()
                            .fullName(customerName)
                            .phone(phone)
                            .email(email)
                            .build();
                    return customerRepository.save(c);
                });

        Appointment appt = Appointment.builder()
                .service(service)
                .customer(customer)
                // also keep old fields in sync
                .customerName(customerName)
                .phone(phone)
                .email(email)
                .appointmentTime(appointmentTime)
                .status(AppointmentStatus.PENDING)
                .notes(notes)
                .build();

        Appointment saved = appointmentRepository.save(appt);

        return ResponseEntity
                .created(URI.create("/api/appointments/" + saved.getId()))
                .body(saved);
    }

    // Update status: CONFIRMED / COMPLETED / CANCELLED
    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id,
                                                    @RequestParam AppointmentStatus status) {
        return appointmentRepository.findById(id)
                .map(existing -> {
                    existing.setStatus(status);
                    Appointment updated = appointmentRepository.save(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
