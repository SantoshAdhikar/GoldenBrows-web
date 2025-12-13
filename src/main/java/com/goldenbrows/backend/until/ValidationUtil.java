package com.goldenbrows.backend.until;

import java.util.regex.Pattern;

/**
 * Utility class for validating and formatting user input data
 */
public class ValidationUtil {
    
    // Email regex pattern - RFC 5322 simplified
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@" +
        "(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );
    
    // US Phone pattern - NANP (North American Numbering Plan)
    // Area code and prefix cannot start with 0 or 1
    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^[2-9][0-9]{2}[2-9][0-9]{6}$"
    );
    
    /**
     * Validates email format
     * @param email the email to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }
    
    /**
     * Validates US phone number (10 digits, NANP rules)
     * Accepts formats like: (555) 123-4567, 555-123-4567, 5551234567
     * @param phone the phone number to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidUSPhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return false;
        }
        
        // Remove all non-digit characters
        String digitsOnly = phone.replaceAll("[^0-9]", "");
        
        // Must be exactly 10 digits
        if (digitsOnly.length() != 10) {
            return false;
        }
        
        // Check NANP rules: area code and prefix can't start with 0 or 1
        return PHONE_PATTERN.matcher(digitsOnly).matches();
    }
    
    /**
     * Formats a US phone number to standard format: (555) 123-4567
     * @param phone the phone number to format
     * @return formatted phone number or original if invalid
     */
    public static String formatUSPhone(String phone) {
        if (phone == null) {
            return null;
        }
        
        String digitsOnly = phone.replaceAll("[^0-9]", "");
        
        if (digitsOnly.length() == 10) {
            return String.format("(%s) %s-%s",
                digitsOnly.substring(0, 3),
                digitsOnly.substring(3, 6),
                digitsOnly.substring(6, 10)
            );
        }
        
        return phone; // Return original if not 10 digits
    }
    
    /**
     * Extracts just the digits from a phone number
     * @param phone the phone number
     * @return digits only string (10 digits for valid US numbers)
     */
    public static String getPhoneDigits(String phone) {
        if (phone == null) {
            return null;
        }
        return phone.replaceAll("[^0-9]", "");
    }
    
    /**
     * Normalizes email by trimming and converting to lowercase
     * @param email the email to normalize
     * @return normalized email
     */
    public static String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        return email.trim().toLowerCase();
    }
}