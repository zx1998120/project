package com.example.data;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.concurrent.TimeUnit;

public class Flight {
    private Integer id;
    private String departDateTime;
    private String arriveDateTime;
    private String departAirport;
    private String arriveAirport;
    private String flightNumber;

    public Flight() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDepartDateTime() {
        return departDateTime;
    }

    public void setDepartDateTime(String departDateTime) {
        this.departDateTime = departDateTime;
    }

    public String getArriveDateTime() {
        return arriveDateTime;
    }

    public void setArriveDateTime(String arriveDateTime) {
        this.arriveDateTime = arriveDateTime;
    }

    public String getDepartAirport() {
        return departAirport;
    }

    public void setDepartAirport(String departAirport) {
        this.departAirport = departAirport;
    }

    public String getArriveAirport() {
        return arriveAirport;
    }

    public void setArriveAirport(String arriveAirport) {
        this.arriveAirport = arriveAirport;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public long getTravelTime(String departDateTimeStr, String arriveDateTimeStr) {
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            Date departDateTime = formatter.parse(departDateTimeStr);
            Date arriveDateTime = formatter.parse(arriveDateTimeStr);

            long diffInMilliseconds = Math.abs(arriveDateTime.getTime() - departDateTime.getTime());
            return TimeUnit.MILLISECONDS.toMinutes(diffInMilliseconds); // Convert milliseconds to minutes
        } catch (ParseException e) {
            e.printStackTrace(); // Handle or log the exception appropriately
            return -1; // Return a default value or handle the error condition
        }
    }

}
