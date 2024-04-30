package com.example.object;

import java.util.List;

public class SearchRequest {

    private List<String> id;
    private String departAirport;
    private String arriveAirport;

    private String flightNumber;

    public SearchRequest(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public SearchRequest() {

    }

    public List<String> getId() {
        return id;
    }

    public void setId(List<String> id) {
        this.id = id;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }
    // Add other request parameters here

    // Getters and setters


    public SearchRequest(String flightId, String departAirport, String arriveAirport) {
//        this.flightId = flightId;
        this.departAirport = departAirport;
        this.arriveAirport = arriveAirport;
    }

//    public String getId() {
//        return id;
//    }
//
//    public void setId(String id) {
//        this.id = id;
//    }

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
}