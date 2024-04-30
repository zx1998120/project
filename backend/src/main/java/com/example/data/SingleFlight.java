package com.example.data;

public class SingleFlight {
    public Integer id;
    public String departDateTime;
    public String arriveDateTime;
    public String departAirport;
    public String arriveAirport;
    public String flightNumber;
    public String duration;

    public SingleFlight(Integer id, String departDateTime, String arriveDateTime, String departAirport, String arriveAirport, String flightNumber, String duration) {
        this.id = id;
        this.departDateTime = departDateTime;
        this.arriveDateTime = arriveDateTime;
        this.departAirport = departAirport;
        this.arriveAirport = arriveAirport;
        this.flightNumber = flightNumber;
        this.duration = duration;
    }

}
