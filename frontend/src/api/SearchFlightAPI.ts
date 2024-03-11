// import {FilterOptionType} from "../type/FilterOptionType.tsx";
import {BackendFlightType, convertJSON2Flight, FlightPlan} from "../type/FlightPlan.ts";
import {getServerHTTP} from "./ServerHTTP.ts";

export async function searchFlightQueryLoader({request}: { request: Request }) {
    const url = new URL(request.url);
    const departAirport = url.searchParams.get("origin")
    const arriveAirport = url.searchParams.get("destination")
    const body = {
        departAirport : departAirport != null ? departAirport : "New York (LGA)",
        arriveAirport : arriveAirport != null ? arriveAirport : "Orlando (MCO)"
    }
    const respond = await fetch(getServerHTTP("/api/getFlights"),
        {method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(body),
        });
    const json = await respond.json() as BackendFlightType[]
    console.log(json)
    const data = json.map((flight) => {
        return new FlightPlan([convertJSON2Flight(flight)])
    }) as FlightPlan[]
    /*
    const json = await respond.json() as BackendFlightType[][]
    const data = json.map((flights) => {
        return new FlightPlan(flights.map((flight) => convertJSON2Flight(flight)))
    }) as FlightPlan[]

     */
    console.log(data)
    return {
        "context": url.searchParams,
        "data": data
    }
}