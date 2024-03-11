import {FlightPlan, SingleFlight, timeDiff} from "../type/FlightPlan.ts";
import {DateWithZone} from "../type/TimeZone.ts";

const AIRPORT_LIST = ["TestA", "TestB", "TestC"]
export function getAirport() {
    return AIRPORT_LIST
}

export function searchFlightQueryLoader_test({request}: { request: Request }) {
    const url = new URL(request.url);
    const l1 = new DateWithZone("2022-12-29 15:24:00 ","utc")
    const l2 = new DateWithZone("2022-12-29 16:26:00 ","utc")
    const l3 = new DateWithZone("2022-12-29 23:24:00 ","utc")
    const l4 = new DateWithZone("2022-12-30 15:27:00 ","utc")
    const f1 : SingleFlight = {
        id: 1,
        flightNumber : "F1",
        departAirport : "TestA",
        arriveAirport : "TestB",
        departTime: l1,
        arriveTime: l2,
        price: 100,
        duration: timeDiff(l1, l2)
    }
    const f2 : SingleFlight = {
        id : 2,
        flightNumber : "F2",
        departAirport : "TestB",
        arriveAirport : "TestC",
        departTime: l3,
        arriveTime: l4,
        price: 140,
        duration: timeDiff(l3, l4)
    }
    const plan = new FlightPlan([f1, f2])
    const data = [plan]

    return {
        "context": url.searchParams,
        "data": data
    }
}