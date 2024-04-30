package com.example.data;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

public class FlightLeg {

    public List<Flight> flights;

    public FlightLeg(List<Flight> flights) {
        this.flights = flights;
    }

    public List<Flight> getFlights() {
        return flights;
    }

    public void setFlights(List<Flight> flights) {
        this.flights = flights;
    }
    // Constructor, getters, and setters


//    public String getFirstLegFlightNumber() {
//        return flights.get(0).getFlightNumber();
//    }

//    public void setFirstLegFlightNumber(String firstLegFlightNumber) {
//        FirstLegFlightNumber = firstLegFlightNumber;
//    }
//
//    public String getSecondLegFlightNumber() {
//        return SecondLegFlightNumber;
//    }
//
//    public void setSecondLegFlightNumber(String secondLegFlightNumber) {
//        SecondLegFlightNumber = secondLegFlightNumber;
//    }
//
//    public String getFirstLegId() {
//        return firstLegId;
//    }
//
//    public void setFirstLegId(String firstLegId) {
//        this.firstLegId = firstLegId;
//    }
//
//    public String getSecondLegId() {
//        return secondLegId;
//    }
//
//    public void setSecondLegId(String secondLegId) {
//        this.secondLegId = secondLegId;
//    }
//
//    public String getDepartAirport() {
//        return departAirport;
//    }
//
//    public void setDepartAirport(String departAirport) {
//        this.departAirport = departAirport;
//    }
//
//    public String getStopoverAirport() {
//        return stopoverAirport;
//    }
//
//    public void setStopoverAirport(String stopoverAirport) {
//        this.stopoverAirport = stopoverAirport;
//    }
//
//    public String getArriveAirport() {
//        return arriveAirport;
//    }
//
//    public void setArriveAirport(String arriveAirport) {
//        this.arriveAirport = arriveAirport;
//    }
//
//    public String getDepartDateTime() {
//        return flights.get(0).getDepartDateTime();
//    }
//
//    public void setDepartDateTime(String departDateTime) {
//        this.departDateTime = departDateTime;
//    }
//
//    public String getArriveAtStopover() {
//        return arriveAtStopover;
//    }
//
//    public void setArriveAtStopover(String arriveAtStopover) {
//        this.arriveAtStopover = arriveAtStopover;
//    }
//
//    public String getDepartFromStopover() {
//        return departFromStopover;
//    }
//
//    public void setDepartFromStopover(String departFromStopover) {
//        this.departFromStopover = departFromStopover;
//    }
//
//    public String getFinalArriveDateTime() {
//        return flights.get(1).getArriveDateTime();
//    }
    public void sortFlightsByTime(String sortBy) {
        switch (sortBy) {
            case "0":
                Collections.sort(flights, Comparator.comparing(flight -> flight.getDepartDateTime()));
                break;
            case "1":
                Collections.sort(flights, Comparator.comparing(flight -> flight.getArriveDateTime()));
                break;
            case "2":
                break;
            default:
                throw new IllegalArgumentException("Invalid sorting parameter");
        }
    }
    public List<Flight> filterFlightsByDurationRange(String durationMin, String durationMax) {
        List<Flight> filteredFlights = new ArrayList<>();
        for (Flight flight : flights) {
            long totalDuration = parseDuration(flight.getDuration());
            if ((durationMin == null || totalDuration >= Long.parseLong(durationMin)) &&
                    (durationMax == null || totalDuration <= Long.parseLong(durationMax))) {
                filteredFlights.add(flight);
            }
        }
        return filteredFlights;
    }
    private int parseDuration(String duration) {
        String[] parts = duration.split(":");
        int hours = Integer.parseInt(parts[0]);
        int minutes = Integer.parseInt(parts[1]);
        int seconds = Integer.parseInt(parts[2]);
        return hours + minutes/60; // Convert duration to minutes
    }
//
//    public void setFinalArriveDateTime(String finalArriveDateTime) {
//        this.finalArriveDateTime = finalArriveDateTime;
//    }
}
