package com.example.data;

public class ReservationResponse {
    private boolean success;
    private String reason;

    public ReservationResponse(boolean success, String reason) {
        this.success = success;
        this.reason = reason;
    }

    // Getters and setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
