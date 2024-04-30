package com.example.controller;

// ClientSoftwareController.java

//import com.example.builder.FlightQueryBuilder;

import com.example.data.Flight;
import com.example.data.FlightLeg;
import com.example.data.ReservationResponse;
import com.example.object.SearchParameters;
import com.example.object.SearchRequest;
import com.example.service.LockService;
import com.example.service.QueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@RestController
//@RequestMapping("/api")
public class ClientSoftwareController {

    @Autowired
    private LockService lockService;

    @Autowired
    private QueryService queryService;

    @PostMapping("/api/getFlights")
    public ResponseEntity<?> search(@RequestBody SearchRequest request,
                                    @RequestParam(required = false) String sortBy,
                                    @RequestParam(required = false) String tripType,
                                    @RequestParam(required = false) String departTime,
                                    @RequestParam(required = false) String arriveTime,
                                    @RequestParam(required = false) String stops,
                                    @RequestParam(required = false) String durationMin,
                                    @RequestParam(required = false) String durationMax) {
        try {
            // Step 2: Generate search parameters
            SearchParameters params = generateSearchParameters(request);
            if (params == null) {
                return ResponseEntity.badRequest().body("Invalid input");
            }

            // Step 3: Launch query
            List<Flight> response = queryService.executeQuery(params);

            if (stops != null && stops.equals("1")) {
                // Filtering and sorting for stop 1 flights
                List<FlightLeg> returnFlightsByStops = queryService.getReturnFlightsByStops(params);

                List<FlightLeg> filteredFlights = returnFlightsByStops.stream()
                        .filter(flightLeg -> {
                            Flight firstFlight = flightLeg.getFlights().get(0);
                            Flight secondFlight = flightLeg.getFlights().get(1);
                            long totalDuration = getTotalFlightDuration(firstFlight, secondFlight);
                            return (durationMin == null || totalDuration >= Long.parseLong(durationMin)) &&
                                    (durationMax == null || totalDuration <= Long.parseLong(durationMax));
                        })
                        .collect(Collectors.toList());

                // Additional filtering based on time range
                if (departTime != null && arriveTime != null) {
                    // Remove extra quotes from departTime and arriveTime strings
                    departTime = departTime.replace("'", "");
                    arriveTime = arriveTime.replace("'", "");

                    LocalDate rangeDepartDate = LocalDate.parse(departTime.split(" ")[0]);
                    LocalDate rangeArriveDate = LocalDate.parse(arriveTime.split(" ")[0]);

                    List<FlightLeg> filteredFlights2 = filteredFlights.stream()
                            .filter(flightLeg -> {
                                Flight firstFlight = flightLeg.getFlights().get(0);
                                Flight secondFlight = flightLeg.getFlights().get(1);
                                LocalDate firstDepartDate = LocalDate.parse(firstFlight.getDepartDateTime().split(" ")[0]);
                                LocalDate secondArriveDate = LocalDate.parse(secondFlight.getArriveDateTime().split(" ")[0]);
                                return !firstDepartDate.isBefore(rangeDepartDate) && !secondArriveDate.isAfter(rangeArriveDate);
                            })
                            .collect(Collectors.toList());

                    // Sorting logic for filteredFlights2
                    if (sortBy != null) {
                        switch (sortBy) {
                            case "0": // Sort by departure time of the first flight
                                Collections.sort(filteredFlights2, Comparator.comparing(flightLeg -> flightLeg.getFlights().get(0).getDepartDateTime()));
                                break;
                            case "1": // Sort by arrival time of the second flight
                                Collections.sort(filteredFlights2, Comparator.comparing(flightLeg -> flightLeg.getFlights().get(1).getArriveDateTime()));
                                break;
                            case "2":
                                // Handle sorting by other criteria if needed
                                break;
                            default:
                                return ResponseEntity.badRequest().body("Invalid sorting parameter");
                        }
                    }

                    // Return the filtered and sorted flights
                    return ResponseEntity.ok(filteredFlights2);
                }

                // Sorting logic for filteredFlights
                if (sortBy != null) {
                    switch (sortBy) {
                        case "0": // Sort by departure time of the first flight
                            Collections.sort(filteredFlights, Comparator.comparing(flightLeg -> flightLeg.getFlights().get(0).getDepartDateTime()));
                            break;
                        case "1": // Sort by arrival time of the second flight
                            Collections.sort(filteredFlights, Comparator.comparing(flightLeg -> flightLeg.getFlights().get(1).getArriveDateTime()));
                            break;
                        case "2":
                            // Handle sorting by other criteria if needed
                            break;
                        default:
                            return ResponseEntity.badRequest().body("Invalid sorting parameter");
                    }
                }

                // Return the filtered flights
                return ResponseEntity.ok(filteredFlights);
            } else if (stops != null && stops.equals("0")) {
                // Filtering and sorting for stop 0 flights
                List<Flight> filteredFlights = response.stream()
                        .filter(flight -> {
                            long flightDuration = parseDuration(flight.getDuration());
                            return (durationMin == null || flightDuration >= Long.parseLong(durationMin)) &&
                                    (durationMax == null || flightDuration <= Long.parseLong(durationMax));
                        })
                        .collect(Collectors.toList());

                // Additional filtering based on time range
                if (departTime != null && arriveTime != null) {
                    // Remove extra quotes from departTime and arriveTime strings
                    departTime = departTime.replace("'", "");
                    arriveTime = arriveTime.replace("'", "");

                    LocalDate rangeDepartDate = LocalDate.parse(departTime.split(" ")[0]);
                    LocalDate rangeArriveDate = LocalDate.parse(arriveTime.split(" ")[0]);

                    filteredFlights = filteredFlights.stream()
                            .filter(flight -> {
                                LocalDate departDate = LocalDate.parse(flight.getDepartDateTime().split(" ")[0]);
                                LocalDate arriveDate = LocalDate.parse(flight.getArriveDateTime().split(" ")[0]);
                                return !departDate.isBefore(rangeDepartDate) && !arriveDate.isAfter(rangeArriveDate);
                            })
                            .collect(Collectors.toList());

                    // Sorting logic if needed
                    if (sortBy != null) {
                        switch (sortBy) {
                            case "0": // Sort by departure time
                                Collections.sort(filteredFlights, Comparator.comparing(Flight::getDepartDateTime));
                                break;
                            case "1": // Sort by arrival time
                                Collections.sort(filteredFlights, Comparator.comparing(Flight::getArriveDateTime));
                                break;
                            case "2":
                                // Handle sorting by other criteria if needed
                                break;
                            default:
                                return ResponseEntity.badRequest().body("Invalid sorting parameter");
                        }
                    }

                    return ResponseEntity.ok(filteredFlights);
                }

                // Sorting logic if needed
                if (sortBy != null) {
                    switch (sortBy) {
                        case "0": // Sort by departure time
                            Collections.sort(filteredFlights, Comparator.comparing(Flight::getDepartDateTime));
                            break;
                        case "1": // Sort by arrival time
                            Collections.sort(filteredFlights, Comparator.comparing(Flight::getArriveDateTime));
                            break;
                        case "2":
                            // Handle sorting by other criteria if needed
                            break;
                        default:
                            return ResponseEntity.badRequest().body("Invalid sorting parameter");
                    }
                }

                return ResponseEntity.ok(filteredFlights);
            } else {
                // Handle other scenarios or return an error response
                return ResponseEntity.badRequest().body("Invalid value for stops parameter");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }


    @GetMapping("/api/getAirports")
    public ResponseEntity<?> getAirports() {

        // Step 1: Launch query
        List<String> response = queryService.executeQuery2();
        return ResponseEntity.ok(response);

    }


    @PostMapping("/api/reserveFlights")

    public ResponseEntity<?> reserveFlights(@RequestBody SearchRequest request) {
//        int numberOfSeats = 10; // Set the initial number of seats

        SearchParameters params = generateSearchParameters2(request);
        boolean reservationSuccessful = queryService.reserveFlights(params);
        if (reservationSuccessful) {
//            numberOfSeats--; // Decrement the number of seats

            return ResponseEntity.ok(new ReservationResponse(true, "Flights reserved successfully"));

        } else {
            return ResponseEntity.ok(new ReservationResponse(false, "No available seats"));
        }
    }


    private SearchParameters generateSearchParameters(SearchRequest request) {
        String departAirport = request.getDepartAirport();
        String arriveAirport = request.getArriveAirport();
        if (departAirport == null || arriveAirport == null || departAirport.isEmpty() || arriveAirport.isEmpty()) {
            return null;
        }
        SearchParameters params = new SearchParameters();
        params.setDepartAirport(departAirport);
        params.setArriveAirport(arriveAirport);
        return params;
    }

    private SearchParameters generateSearchParameters2(SearchRequest request) {
        List<String> flightId = request.getId();
        if (flightId == null || flightId == null || flightId.isEmpty() || flightId.isEmpty()) {
            return null;
        }
        SearchParameters params = new SearchParameters();
        params.setId(flightId);
        return params;
    }

    private long getTotalFlightDuration(Flight firstFlight, Flight secondFlight) {
        long firstFlightDuration = parseDuration(firstFlight.getDuration());
        long secondFlightDuration = parseDuration(secondFlight.getDuration());
        return firstFlightDuration + secondFlightDuration;
    }

    private long parseDuration(String duration) {
        String[] parts = duration.split(":");
        long hours = Long.parseLong(parts[0]);
        long minutes = Long.parseLong(parts[1]);
        long seconds = Long.parseLong(parts[2]);
        return hours + TimeUnit.MINUTES.toHours(minutes) + TimeUnit.SECONDS.toHours(seconds);
    }

}




