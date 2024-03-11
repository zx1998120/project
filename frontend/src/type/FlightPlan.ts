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
    id : number,
    departDateTime : string,
    arriveDateTime : string,
    departAirport : string,
    arriveAirport : string,
    flightNumber : string,
}
export function timeDiff(departTime : DateWithZone, arriveTime: DateWithZone) {
    const duration = moment.duration(arriveTime.time.diff(departTime.time))
    return duration
}

export function convertJSON2Flight(json : BackendFlightType) : SingleFlight{
    const departTime = new DateWithZone(json.departDateTime, "UTC")
    const arriveTime = new DateWithZone(json.arriveDateTime, "UTC")
    return {
        id : json.id,
        flightNumber : json.flightNumber,
        departAirport : json.departAirport,
        arriveAirport : json.arriveAirport,
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