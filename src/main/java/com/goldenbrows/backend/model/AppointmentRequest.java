package com.goldenbrows.backend.model;

import lombok.Data;

import java.util.List;

@Data
public class AppointmentRequest {

    // multiple services selected in the booking form
    private List<Long> serviceIds;

    // optional staff
    private Long employeeId;

    // from the date & time inputs (e.g. "2025-12-05", "13:19")
    private String date;   // yyyy-MM-dd
    private String time;   // HH:mm

    // customer info
    private String customerName;
    private String phone;
    private String email;
    private String notes;
}
