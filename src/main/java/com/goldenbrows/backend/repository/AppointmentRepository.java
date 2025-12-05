package com.goldenbrows.backend.repository;

import com.goldenbrows.backend.model.Appointment;
import com.goldenbrows.backend.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import com.goldenbrows.backend.model.Employee;


import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByAppointmentTimeBetween(LocalDateTime start, LocalDateTime end);

    List<Appointment> findByStatus(AppointmentStatus status);

    // NEW: all appointments for a given customer
    List<Appointment> findByCustomer_Id(Long customerId);
    boolean existsByEmployeeAndAppointmentTimeBetween(
            Employee employee,
            LocalDateTime start,
            LocalDateTime end);
    
    boolean existsByServiceId(Long serviceId);
    
}
