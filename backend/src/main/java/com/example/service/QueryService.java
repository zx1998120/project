package com.example.service;// QueryService.java

import com.example.data.Flight;
import com.example.object.SearchParameters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class QueryService {
    @Autowired
    private DataSource dataSource;





    public List<Flight> executeQuery(SearchParameters params) {
        String sqlQuery = "SELECT * FROM (" +
                "    SELECT 'delta' AS airline, Id, DepartDateTime, ArriveDateTime, DepartAirport, ArriveAirport, FlightNumber FROM deltas " +
                "    UNION ALL " +
                "    SELECT 'southwest' AS airline, Id, DepartDateTime, ArriveDateTime, DepartAirport, ArriveAirport, FlightNumber FROM southwests" +
                ") AS combined_flights " +
                "WHERE DepartAirport = ? AND ArriveAirport = ?";

        try (Connection connection = dataSource.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery)) {
            preparedStatement.setString(1, params.getDepartAirport());
            preparedStatement.setString(2, params.getArriveAirport());

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                List<Flight> flights = new ArrayList<>();
                while (resultSet.next()) {
                    Flight flight = new Flight();
                    flight.setId(resultSet.getInt("Id"));
                    flight.setFlightNumber(resultSet.getString("FlightNumber"));
                    flight.setDepartAirport(resultSet.getString("DepartAirport"));
                    flight.setArriveAirport(resultSet.getString("ArriveAirport"));

                    // Convert DepartDateTime and ArriveDateTime to formatted strings
                    Timestamp departDateTime = resultSet.getTimestamp("DepartDateTime");
                    Timestamp arriveDateTime = resultSet.getTimestamp("ArriveDateTime");
                    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    String formattedDepartDateTime = formatter.format(departDateTime);
                    String formattedArriveDateTime = formatter.format(arriveDateTime);

                    flight.setDepartDateTime(formattedDepartDateTime);
                    flight.setArriveDateTime(formattedArriveDateTime);

                    // Set other properties as needed based on your table schema

                    flights.add(flight);
                }
                return flights;
            }
        } catch (SQLException e) {
            e.printStackTrace(); // Handle or log the exception appropriately
            return null;
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

