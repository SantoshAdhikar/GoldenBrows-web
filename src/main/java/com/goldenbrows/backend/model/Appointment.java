package com.goldenbrows.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import com.goldenbrows.backend.model.Employee;


import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String customerName;

    @NotBlank
    @Size(max = 20)
    @Column(nullable = false, length = 20)
    private String phone;

    @Email
    @Size(max = 200)
    @Column(length = 200)
    private String email;
    
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;   // optional: which staff will do the service

    
 // New relation to Customer
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "service_id")
    private SalonService service;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime appointmentTime;

    @NotNull
//    @Enumerated(EnumType.STRING)
//    @Column(nullable = false, length = 20)
//    private AppointmentStatus status = AppointmentStatus.PENDING;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status = AppointmentStatus.PENDING;

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    @Size(max = 500)
    @Column(length = 500)
    private String notes;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
