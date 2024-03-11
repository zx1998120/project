import {getServerHTTP} from "./ServerHTTP.ts";

export async function getAirport() {
    const respond = await fetch(getServerHTTP("/api/getAirports"))
    const json = await respond.json() as string[]
    return json
}