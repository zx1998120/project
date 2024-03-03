package com.example.service;// QueryService.java

import com.example.data.Flight;
import com.example.object.SearchParameters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class QueryService {
    @Autowired
    private DataSource dataSource;

    public List<Flight> executeQuery(SearchParameters params) {
        // SQL query to retrieve data from delta and southwest tables based on departure place and arrival place
        String sqlQuery = "SELECT * FROM (" +
                "    SELECT 'delta' AS airline, Id, DepartDateTime, ArriveDateTime, DepartAirport, ArriveAirport, FlightNumber FROM deltas " +
                "    UNION ALL " +
                "    SELECT 'southwest' AS airline, Id, DepartDateTime, ArriveDateTime, DepartAirport, ArriveAirport, FlightNumber FROM southwests" +
                ") AS combined_flights " +
                "WHERE DepartAirport = ? AND ArriveAirport = ?";

        try (Connection connection = dataSource.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery)) {
            // Set departure place and arrival place parameters
            preparedStatement.setString(1, params.getDepartAirport());
            preparedStatement.setString(2, params.getArriveAirport());
//            preparedStatement.setString(3, params.getDepartAirport());
//            preparedStatement.setString(4, params.getArriveAirport());

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                List<Flight> flights = new ArrayList<>();
                while (resultSet.next()) {
                    // Create Flight objects from the result set
                    Flight flight = new Flight();
                    flight.setId(resultSet.getInt("Id"));
                    flight.setFlightNumber(resultSet.getString("FlightNumber"));
                    flight.setDepartAirport(resultSet.getString("DepartAirport"));
                    flight.setArriveAirport(resultSet.getString("ArriveAirport"));
                    flight.setDepartDateTime(resultSet.getDate("DepartDateTime"));
                    flight.setArriveDateTime(resultSet.getDate("ArriveDateTime"));

                    // Set other properties as needed based on your table schema

                    flights.add(flight);
                }
                System.out.println(flights.get(2));
                return flights; // Return list of Flight objects
            }
        } catch (SQLException e) {
            e.printStackTrace(); // Handle or log the exception appropriately
            return null; // Return null or an empty list in case of error
        }
    }


    public List<String> executeQuery2() {
        String sqlQuery = "(SELECT DepartAirport, ArriveAirport FROM deltas) " +
                "UNION ALL " +
                "(SELECT DepartAirport, ArriveAirport FROM southwests)";

        try (Connection connection = dataSource.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery)) {

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                Set<String> airportSet = new HashSet<>(); // Use Set to ensure uniqueness
                while (resultSet.next()) {
                    String departAirport = resultSet.getString("DepartAirport");
                    String arriveAirport = resultSet.getString("ArriveAirport");
                    if (departAirport != null) {
                        airportSet.add(departAirport);
                    }
                    if (arriveAirport != null) {
                        airportSet.add(arriveAirport);
                    }
                }
                return new ArrayList<>(airportSet); // Convert Set to List and return
            }
        } catch (SQLException e) {
            e.printStackTrace(); // Handle or log the exception appropriately
            return null;
        }
    }





}

