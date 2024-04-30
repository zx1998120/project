//package com.example.builder;
//
//import com.example.data.Flight;
//import com.example.data.FlightLeg;
//
//import java.text.ParseException;
//import java.text.SimpleDateFormat;
//import java.util.ArrayList;
//import java.util.Date;
//import java.util.List;
//
//public class FlightQueryBuilder {
//    public List<Flight> filterByTimeRange(List<Flight> flights, String departTime, String arriveTime) {
//        List<Flight> filteredFlights = new ArrayList<>();
//        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
//
//        try {
//            Date departTimeDate = formatter.parse(departTime);
//            Date arriveTimeDate = formatter.parse(arriveTime);
//
//            for (Flight flight : flights) {
//                Date flightDepartTime = formatter.parse(flight.getDepartDateTime());
//                Date flightArriveTime = formatter.parse(flight.getArriveDateTime());
//
//                if (flightDepartTime.compareTo(departTimeDate) >= 0 && flightArriveTime.compareTo(arriveTimeDate) <= 0) {
//                    filteredFlights.add(flight);
//                }
//            }
//        } catch (ParseException e) {
//            e.printStackTrace();
//            // Handle the parsing exception appropriately
//        }
//
//        return filteredFlights;
//    }
//    public List<FlightLeg> filterStopsByTimeRange(FlightLeg flights, String departTime, String finalArriveTime) {
//        List<FlightLeg> filteredFlights = new ArrayList<>();
//        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
//
//        try {
//            Date departTimeDate = formatter.parse(departTime);
//            Date arriveTimeDate = formatter.parse(finalArriveTime);
//            f
//
//            for (FlightLeg flight : flights) {
//                Date flightDepartTime = formatter.parse(flight.getDepartDateTime());
//                Date flightFinalArriveTime = formatter.parse(flight.getFinalArriveDateTime());
//
//                if (flightDepartTime.compareTo(departTimeDate) >= 0 && flightFinalArriveTime.compareTo(arriveTimeDate) <= 0) {
//                    filteredFlights.add(flight);
//                }
//            }
//        } catch (ParseException e) {
//            e.printStackTrace();
//            // Handle the parsing exception appropriately
//        }
//
//        return filteredFlights;
//    }
//
//}
