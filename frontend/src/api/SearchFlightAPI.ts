// import {FilterOptionType} from "../type/FilterOptionType.tsx";
import {BackendFlightType, convertJSON2Flight, FlightPlan} from "../type/FlightPlan.ts";
import {getServerHTTP} from "./ServerHTTP.ts";

export async function searchFlightQueryLoader() {
    const respond = await fetch(getServerHTTP("/api/getflights"));
    const json = await respond.json() as BackendFlightType[][]
    return json.map((flights) => {
        return new  FlightPlan(flights.map((flight)=>convertJSON2Flight(flight)))
    })
}