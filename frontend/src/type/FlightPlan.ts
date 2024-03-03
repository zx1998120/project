import {DateWithZone} from "./TimeZone.ts";
import {ArriveAirportId, DepartAirportId} from "./alias.ts";
import moment from "moment-timezone";

export type SingleFlight = {
    id: number
    flightNumber : string
    departAirport : DepartAirportId
    arriveAirport : ArriveAirportId
    departTime: DateWithZone
    arriveTime: DateWithZone
    price: number
    duration: moment.Duration
}

export type BackendFlightType = {
    Id : number,
    DepartDateTime : string,
    ArriveDateTime : string,
    DepartAirport : string,
    ArriveAirport : string,
    FlightNumber : string,
}
export function timeDiff(departTime : DateWithZone, arriveTime: DateWithZone) {
    const duration = moment.duration(arriveTime.time.diff(departTime.time))
    return duration
}

export function convertJSON2Flight(json : BackendFlightType) : SingleFlight{
    const departTime = new DateWithZone(json.DepartDateTime, "UTC")
    const arriveTime = new DateWithZone(json.ArriveDateTime, "UTC")
    return {
        id : json.Id,
        flightNumber : json.FlightNumber,
        departAirport : json.DepartAirport,
        arriveAirport : json.ArriveAirport,
        departTime: departTime,
        arriveTime: arriveTime,
        price: 0,
        duration: timeDiff(departTime, arriveTime)
    }
}

export class FlightPlan {
    flights : SingleFlight[]
    constructor(flights : SingleFlight[]) {
        this.flights = flights
    }
}