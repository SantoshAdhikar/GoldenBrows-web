package com.goldenbrows.backend.model;

public enum AppointmentStatus {
	PENDING,      // customer just booked, not confirmed yet
    CONFIRMED,    // approved/confirmed by salon
    COMPLETED,    // service done
    CANCELLED     // cancelled by customer or salon

}
