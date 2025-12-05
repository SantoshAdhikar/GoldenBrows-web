package com.goldenbrows.backend.controller;

import java.net.URI;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.goldenbrows.backend.model.Appointment;
import com.goldenbrows.backend.model.AppointmentRequest;
import com.goldenbrows.backend.model.AppointmentStatus;
import com.goldenbrows.backend.model.Customer;
import com.goldenbrows.backend.model.Employee;
import com.goldenbrows.backend.model.SalonService;
import com.goldenbrows.backend.repository.AppointmentRepository;
import com.goldenbrows.backend.repository.CustomerRepository;
import com.goldenbrows.backend.repository.EmployeeRepository;
import com.goldenbrows.backend.repository.SalonServiceRepository;
import com.goldenbrows.backend.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final SalonServiceRepository salonServiceRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationService notificationService;
    private static final LocalTime OPEN_TIME  = LocalTime.of(10, 0);  // 10:00
    private static final LocalTime CLOSE_TIME = LocalTime.of(19, 0);  // 19:00
    private static final int SLOT_MINUTES = 30; 

    // ---------- BASIC READ ENDPOINTS ----------

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

    // Appointments for a specific date, optional filters
    @GetMapping("/by-date")
    public ResponseEntity<List<Appointment>> getByDate(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date,
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) AppointmentStatus status) {

        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);

        List<Appointment> list = appointmentRepository
                .findByAppointmentTimeBetween(start, end);

        if (employeeId != null) {
            list = list.stream()
                    .filter(a -> a.getEmployee() != null
                            && a.getEmployee().getId().equals(employeeId))
                    .toList();
        }

        if (status != null) {
            list = list.stream()
                    .filter(a -> a.getStatus() == status)
                    .toList();
        }

        return ResponseEntity.ok(list);
    }

    // Appointments by customer
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

    // ---------- CREATE (JSON, MULTI-SERVICE) ----------

    /**
     * Expected JSON from frontend:
     * {
     *   "serviceIds": [1,2,3],
     *   "customerName": "Tony",
     *   "phone": "5623334444",
     *   "email": "x@y.com",
     *   "date": "2025-11-28",
     *   "time": "13:30",
     *   "notes": "Some note",
     *   "employeeId": 1
     * }
     */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody AppointmentRequest req) {

        // basic validation
        if (req.getServiceIds() == null || req.getServiceIds().isEmpty()) {
            return ResponseEntity.badRequest().body("At least one service must be selected.");
        }
        if (req.getCustomerName() == null || req.getCustomerName().isBlank()) {
            return ResponseEntity.badRequest().body("Name is required.");
        }
        if (req.getPhone() == null || req.getPhone().isBlank()) {
            return ResponseEntity.badRequest().body("Phone is required.");
        }
        if (req.getDate() == null || req.getTime() == null) {
            return ResponseEntity.badRequest().body("Date and time are required.");
        }
     // 2) Validate email format (very simple regex)
        String email = req.getEmail().trim();
        if (!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            return ResponseEntity.badRequest().body("Please enter a valid email address.");
        }

     // 3) Validate US phone number: exactly 10 digits, simple NANP rules
        String digitsOnly = req.getPhone().replaceAll("[^0-9]", "");

        // 10 digits, area code and prefix cannot start with 0 or 1
        if (!digitsOnly.matches("^[2-9][0-9]{2}[2-9][0-9]{6}$")) {
            return ResponseEntity
                .badRequest()
                .body("Please enter a valid U.S. phone number (10 digits).");
        }

        
        

        // parse date + time from strings sent by frontend
        LocalDate date;
        LocalTime timePart;
        try {
            date = LocalDate.parse(req.getDate());      // "2025-12-05"
            timePart = LocalTime.parse(req.getTime());  // "13:19"
        } catch (DateTimeParseException ex) {
            return ResponseEntity.badRequest().body("Invalid date or time.");
        }

        LocalDateTime appointmentTime = LocalDateTime.of(date, timePart);

        // must be in the future
        if (appointmentTime.isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Appointment time must be in the future");
        }

        // load & validate all selected services
        List<SalonService> services = new ArrayList<>();
        int maxDuration = 30; // used for overlap check if staff selected

        for (Long serviceId : req.getServiceIds()) {
            Optional<SalonService> serviceOpt = salonServiceRepository.findById(serviceId);
            if (serviceOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid serviceId: " + serviceId);
            }
            SalonService service = serviceOpt.get();
            if (Boolean.FALSE.equals(service.getActive())) {
                return ResponseEntity.badRequest().body("Service is not active: " + service.getName());
            }
            services.add(service);

            if (service.getDurationMinutes() != null
                    && service.getDurationMinutes() > maxDuration) {
                maxDuration = service.getDurationMinutes();
            }
        }
        
        

        // optional staff assignment
        Employee assignedEmployee = null;
        if (req.getEmployeeId() != null) {
            var employeeOpt = employeeRepository.findById(req.getEmployeeId());
            if (employeeOpt.isEmpty() || Boolean.FALSE.equals(employeeOpt.get().getActive())) {
                return ResponseEntity.badRequest().body("Selected employee is not available");
            }
            assignedEmployee = employeeOpt.get();
        }

        // Business hours logic in America/Los_Angeles using DST
        ZoneId zoneId = ZoneId.of("America/Los_Angeles");
        ZonedDateTime zoned = appointmentTime.atZone(zoneId);

        DayOfWeek dayOfWeek = zoned.getDayOfWeek();
        LocalTime localTime = zoned.toLocalTime();

        boolean isDST = zoneId.getRules().isDaylightSavings(zoned.toInstant());

        LocalTime openTime;
        LocalTime closeTime;

        if (dayOfWeek == DayOfWeek.SUNDAY) {
            // Sunday fixed: 10:30–18:00
            openTime = LocalTime.of(10, 30);
            closeTime = LocalTime.of(18, 0);
        } else {
            // Mon–Sat: 10:00 open all year
            openTime = LocalTime.of(10, 0);
            closeTime = isDST ? LocalTime.of(19, 0) : LocalTime.of(18, 30);
        }

        if (localTime.isBefore(openTime) || localTime.isAfter(closeTime)) {
            String msg = "Appointment time must be between "
                    + openTime + " and " + closeTime + " for " + dayOfWeek;
            return ResponseEntity.badRequest().body(msg);
        }

        // prevent double booking for that employee and time window
        if (assignedEmployee != null) {
            LocalDateTime start = appointmentTime;
            LocalDateTime end = appointmentTime.plusMinutes(maxDuration);

            boolean existsOverlap =
                    appointmentRepository.existsByEmployeeAndAppointmentTimeBetween(
                            assignedEmployee, start, end
                    );

            if (existsOverlap) {
                return ResponseEntity.badRequest().body(
                        "This staff member already has an appointment around that time. " +
                                "Please choose another time or staff member."
                );
            }
        }

        // find or create Customer by phone
        Customer customer = customerRepository.findFirstByPhone(req.getPhone())
                .orElseGet(() -> {
                    Customer c = Customer.builder()
                            .fullName(req.getCustomerName())
                            .phone(req.getPhone())
                            .email(req.getEmail())
                            .build();
                    return customerRepository.save(c);
                });

        // create one Appointment per service (same customer, same time)
        List<Appointment> created = new ArrayList<>();

        for (SalonService service : services) {
            Appointment appt = Appointment.builder()
                    .service(service)
                    .customer(customer)
                    .employee(assignedEmployee)
                    .customerName(req.getCustomerName())
                    .phone(req.getPhone())
                    .email(req.getEmail())
                    .appointmentTime(appointmentTime)
                    .status(AppointmentStatus.PENDING)
                    .notes(req.getNotes())
                    .build();

            Appointment saved = appointmentRepository.save(appt);
            notificationService.sendAppointmentCreated(saved);
            created.add(saved);
        }

        // if only one service -> return single object, otherwise list
        if (created.size() == 1) {
            Appointment saved = created.get(0);
            return ResponseEntity
                    .created(URI.create("/api/appointments/" + saved.getId()))
                    .body(saved);
        } else {
            Appointment first = created.get(0);
            return ResponseEntity
                    .created(URI.create("/api/appointments/" + first.getId()))
                    .body(created);
        }
    }
    
    @GetMapping("/available-times")
    public ResponseEntity<List<String>> getAvailableTimes(
            @RequestParam String date,
            @RequestParam(required = false) Long employeeId) {

        // date comes as "2025-12-10"
        LocalDate day = LocalDate.parse(date);

        // full day range for that date
        LocalDateTime startOfDay = day.atStartOfDay();             // 2025-12-10T00:00
        LocalDateTime endOfDay   = day.plusDays(1).atStartOfDay(); // 2025-12-11T00:00 (exclusive)

        // 1) get all appointments for that date (all employees)
        List<Appointment> booked = appointmentRepository
                .findByAppointmentTimeBetween(startOfDay, endOfDay);

        // 2) if employeeId is given, filter to that employee
        if (employeeId != null) {
            booked = booked.stream()
                    .filter(a ->
                            a.getEmployee() != null &&
                            a.getEmployee().getId() != null &&
                            a.getEmployee().getId().equals(employeeId)
                    )
                    .collect(Collectors.toList());
        }

        // 3) collect booked times (LocalTime only)
        Set<LocalTime> bookedTimes = booked.stream()
                .map(a -> a.getAppointmentTime().toLocalTime())
                .collect(Collectors.toCollection(HashSet::new));

        // 4) build all possible slots (e.g. 10:00–19:00 every 30 min)
        LocalTime open  = LocalTime.of(10, 0); // 10:00
        LocalTime close = LocalTime.of(19, 0); // 19:00
        int slotMinutes = 30;

        List<String> freeSlots = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm");

        for (LocalTime t = open; t.isBefore(close); t = t.plusMinutes(slotMinutes)) {
            if (!bookedTimes.contains(t)) {
                freeSlots.add(t.format(fmt));  // "10:00", "10:30", ...
            }
        }

        return ResponseEntity.ok(freeSlots);
    }


    // ---------- STATUS UPDATE ----------

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
