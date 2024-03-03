export async function getAirport() {
    const respond = await fetch("http://localhost:3000/api/getAirports")
    const json = await respond.json() as string[]
    return json
}