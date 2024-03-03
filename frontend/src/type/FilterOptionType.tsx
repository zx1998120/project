import {immerable} from "immer"
export enum StopOptionType {
    NonStop = 0,
    OneStop,
    TwoStop
}
export enum RoundTripOptionType {
    OneWay,
    RoundTrip
}

export enum SortingDirection {
    Descending,
    Ascending
}
export enum SortingType {
    None,
    SortingByPrice,
    SortingByDepartureDate,
    SortingByArrivalDate,
    // total travelling time
    SortingByTravelTime
}
export class FilterOptionType {
    // need to use this to update filter option
    [immerable] = true
    stops : Map<StopOptionType, boolean>
    roundtrip: RoundTripOptionType
    origin: string | null
    destination : string | null
    constructor() {
        const map = new Map()
        map.set(StopOptionType.NonStop, true)
        map.set(StopOptionType.OneStop, true)
        map.set(StopOptionType.TwoStop, true)
        this.stops = map
        this.roundtrip = RoundTripOptionType.OneWay
        this.origin = null
        this.destination = null
    }
    setStopType(stop : StopOptionType, check : boolean) {
        this.stops.set(stop, check)
    }
    setRoundTripType(roundtrip : RoundTripOptionType) {
        this.roundtrip = roundtrip
    }
    swapOriginDesination() {
        const tmp = this.destination
        this.destination = this.origin
        this.origin = tmp
    }
}