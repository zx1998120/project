package com.example.service;// QueryService.java

import com.example.data.Flight;
import com.example.data.FlightLeg;
import com.example.data.SingleFlight;
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
        String sqlQuery = "SELECT Id, DepartDateTime, ArriveDateTime, DepartAirport, ArriveAirport, FlightNumber, " +
                "TIMEDIFF(ArriveDateTime, DepartDateTime) AS TotalDuration " +
                "FROM combined_flights " +
                "WHERE DepartAirport = ? AND ArriveAirport = ? " +
                "AND TIMEDIFF(ArriveDateTime, DepartDateTime) >= 0";

        try (Connection connection = dataSource.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery)) {
            preparedStatement.setString(1, params.getDepartAirport());
            preparedStatement.setString(2, params.getArriveAirport());

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                List<Flight> flights = new ArrayList<>();
//                Timestamp departDateTime = resultSet.getTimestamp("DepartDateTime");
//                Timestamp arriveDateTime = resultSet.getTimestamp("ArriveDateTime");
//                SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
//                String formattedDepartDateTime = formatter.format(departDateTime);
//                String formattedArriveDateTime = formatter.format(arriveDateTime);
                while (resultSet.next()) {
                    Flight flight = new Flight(resultSet.getInt("Id"),
                            resultSet.getString("DepartDateTime"),
                            resultSet.getString("ArriveDateTime"),
                            resultSet.getString("DepartAirport"),
                            resultSet.getString("ArriveAirport"),
                            resultSet.getString("FlightNumber"),
                            resultSet.getString("TotalDuration")
                    );

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

    //getAllAirports
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

    //getallReturnFlightsByRoundtrip
//    public List<Flight> getReturnFlights(SearchParameters params) {
//        String sqlQuery = "SELECT * FROM (" +
//                "    SELECT 'delta' AS airline, Id, DepartDateTime, ArriveDateTime, DepartAirport, ArriveAirport, FlightNumber FROM deltas " +
//                "    UNION ALL " +
//                "    SELECT 'southwest' AS airline, Id, DepartDateTime, ArriveDateTime, DepartAirport, ArriveAirport, FlightNumber FROM southwests" +
//                ") AS combined_flights " +
//                "WHERE DepartAirport = ? AND ArriveAirport = ?";
//
//        try (Connection connection = dataSource.getConnection();
//             PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery)) {
//            preparedStatement.setString(1, params.getArriveAirport()); // Swap depart and arrive airports for return trip
//            preparedStatement.setString(2, params.getDepartAirport()); // Swap depart and arrive airports for return trip
//
//            try (ResultSet resultSet = preparedStatement.executeQuery()) {
//                List<Flight> returnFlights = new ArrayList<>();
//                while (resultSet.next()) {
//                    Flight flight = new Flight();
//                    flight.setId(resultSet.getInt("Id"));
//                    flight.setFlightNumber(resultSet.getString("FlightNumber"));
//                    flight.setDepartAirport(resultSet.getString("DepartAirport"));
//                    flight.setArriveAirport(resultSet.getString("ArriveAirport"));
//
//                    // Convert DepartDateTime and ArriveDateTime to formatted strings
//                    Timestamp departDateTime = resultSet.getTimestamp("DepartDateTime");
//                    Timestamp arriveDateTime = resultSet.getTimestamp("ArriveDateTime");
//                    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
//                    String formattedDepartDateTime = formatter.format(departDateTime);
//                    String formattedArriveDateTime = formatter.format(arriveDateTime);
//
//                    flight.setDepartDateTime(formattedDepartDateTime);
//                    flight.setArriveDateTime(formattedArriveDateTime);
//
//                    // Set other properties as needed based on your table schema
//
//                    returnFlights.add(flight);
//                }
//                return returnFlights;
//            }
//        } catch (SQLException e) {
//            e.printStackTrace(); // Handle or log the exception appropriately
//            return null;
//        }
//    }

    private int numberOfSeats = 10; // Declare numberOfSeats as a class-level field

    public boolean reserveFlights(SearchParameters params) {
        try (Connection connection = dataSource.getConnection()) {
            List<String> flightIds = params.getId(); // Get the list of flight IDs
            if (flightIds != null && !flightIds.isEmpty()) {
                updateFlightReservation(connection, flightIds);

                // Decrement the number of available seats by the number of reserved flights
                numberOfSeats -= flightIds.size();

                // Return false if the number of available seats is 0 or negative
                if (numberOfSeats <= 0) {
                    return false;
                }
            }
            return true; // Reservation successful
        } catch (SQLException e) {
            e.printStackTrace(); // Handle or log the exception appropriately
            return false;
        }
    }

//    public boolean reserveFlights(SearchParameters params) {
//        try (Connection connection = dataSource.getConnection()) {
//            List<String> flightIds = params.getId(); // Get the list of flight IDs
//            if (flightIds != null && !flightIds.isEmpty()) {
//                updateFlightReservation(connection, flightIds);
//            }
//
//            return true; // Reservation successful
//        } catch (SQLException e) {
//            e.printStackTrace(); // Handle or log the exception appropriately
//            return false;
//        }
//    }


    private void updateFlightReservation(Connection connection, List<String> flightIds) throws SQLException {
        String sqlQuery = "UPDATE combined_flights SET Reserved = true WHERE Id IN (";
        for (int i = 0; i < flightIds.size(); i++) {
            sqlQuery += "?";
            if (i < flightIds.size() - 1) {
                sqlQuery += ",";
            }
        }
        sqlQuery += ")";

        try (PreparedStatement preparedStatement = connection.prepareStatement(sqlQuery)) {
            for (int i = 0; i < flightIds.size(); i++) {
                preparedStatement.setString(i + 1, flightIds.get(i));
            }
            preparedStatement.executeUpdate();
        }
    }


    public List<FlightLeg> getReturnFlightsByStops(SearchParameters params) {
        List<FlightLeg> flightLegs = new ArrayList<>();

        String sql = "SELECT " +
                "sub.FirstLegId, " +
                "sub.SecondLegId, " +
                "sub.FirstLegFlightNumber, " +
                "sub.SecondLegFlightNumber, " +
                "sub.DepartAirport, " +
                "sub.StopoverAirport, " +
                "sub.ArriveAirport, " +
                "sub.DepartDateTime, " +
                "sub.ArriveAtStopover, " +
                "sub.DepartFromStopover, " +
                "sub.FinalArriveDateTime, " +
                "(TIMEDIFF(sub.ArriveAtStopover, sub.DepartDateTime)) AS FirstTotalDuration, " +
                "(TIMEDIFF(sub.FinalArriveDateTime, sub.DepartFromStopover)) AS SecondTotalDuration " +
                "FROM " +
                "(SELECT " +
                "f1.Id AS FirstLegId, " +
                "f2.Id AS SecondLegId, " +
                "f1.FlightNumber AS FirstLegFlightNumber, " +
                "f2.FlightNumber AS SecondLegFlightNumber, " +
                "f1.DepartAirport, " +
                "f1.ArriveAirport AS StopoverAirport, " +
                "f2.ArriveAirport, " +
                "f1.DepartDateTime, " +
                "f1.ArriveDateTime AS ArriveAtStopover, " +
                "f2.DepartDateTime AS DepartFromStopover, " +
                "f2.ArriveDateTime AS FinalArriveDateTime " +
                "FROM combined_flights f1 " +
                "INNER JOIN combined_flights f2 ON f1.ArriveAirport = f2.DepartAirport " +
                "WHERE " +
                "f1.DepartDateTime < f2.DepartDateTime " +
                "AND DATE_ADD(f1.ArriveDateTime, INTERVAL 2 HOUR) <= f2.DepartDateTime) AS sub " +
                "WHERE " +
                "sub.DepartAirport = ? AND sub.ArriveAirport = ? " +
                "AND (TIMEDIFF(sub.ArriveAtStopover, sub.DepartDateTime)) >= 0 " +
                "AND (TIMEDIFF(sub.FinalArriveDateTime, sub.DepartFromStopover)) >= 0 " +
                "ORDER BY " +
                "(TIMEDIFF(sub.ArriveAtStopover, sub.DepartDateTime)) + (TIMEDIFF(sub.FinalArriveDateTime, sub.DepartFromStopover))";


        try (Connection connection = dataSource.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setString(1, params.getDepartAirport());
            preparedStatement.setString(2, params.getArriveAirport());
            try (ResultSet resultSet = preparedStatement.executeQuery()) {

                while (resultSet.next()) {
                    List<Flight> flights = new ArrayList<>();
                    Flight flight1 = new Flight(
                            resultSet.getInt("FirstLegId"),
                            resultSet.getString("DepartDateTime"),
                            resultSet.getString("ArriveAtStopover"),
                            resultSet.getString("DepartAirport"),
                            resultSet.getString("StopoverAirport"),
                            resultSet.getString("FirstLegFlightNumber"),
                            resultSet.getString("FirstTotalDuration")
                    );
                    Flight flight2 = new Flight(
                            resultSet.getInt("SecondLegId"),
                            resultSet.getString("DepartFromStopover"),
                            resultSet.getString("FinalArriveDateTime"),
                            resultSet.getString("StopoverAirport"),
                            resultSet.getString("ArriveAirport"),
                            resultSet.getString("SecondLegFlightNumber"),
                            resultSet.getString("SecondTotalDuration")
                    );
                    flights.add(flight1);
                    flights.add(flight2);
                    FlightLeg flightLeg = new FlightLeg(flights);
                    flightLegs.add(flightLeg);
                }
                return flightLegs;
            }
        } catch (SQLException e) {
            e.printStackTrace(); // Handle or log the exception appropriately
            return null;
        }
    }


}

