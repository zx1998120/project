import {immerable} from "immer"
import {DateWithZone} from "./TimeZone.ts";
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
export type RangeType = {
    minValue : number | null,
    maxValue : number | null
}
export class FilterOptionType {
    // need to use this to update filter option
    [immerable] = true
    stops : boolean[]
    roundtrip: RoundTripOptionType
    origin: string | null
    destination : string | null
    departDate : DateWithZone | null
    arriveDate : DateWithZone | null
    durationRange : RangeType
    priceRange : RangeType
    constructor() {
        this.stops = new Array(3).fill(false);
        this.roundtrip = RoundTripOptionType.OneWay
        this.origin = null
        this.destination = null
        this.departDate = null
        this.arriveDate = null
        this.durationRange = {minValue : null, maxValue : null}
        this.priceRange = {minValue : null, maxValue : null}
    }
    setStopType(stop : StopOptionType, check : boolean) {
        this.stops[stop] = check
    }
    setRoundTripType(roundtrip : RoundTripOptionType) {
        this.roundtrip = roundtrip
    }
    swapOriginDesination() {
        const tmp = this.destination
        this.destination = this.origin
        this.origin = tmp
    }
    serialize() {
        const obj = new URLSearchParams()
        function setMaybe(key : string, value:null|number) {
            if (value != null) {
                obj.set(key, value.toString())
            }
        }
        if (this.departDate != null) {
            obj.set("departDate", this.departDate.utc.format())
        }
        if (this.arriveDate != null) {
            obj.set("arriveDate", this.arriveDate.utc.format())
        }
        if (this.origin !=null){
            obj.set("origin", this.origin)
        }
        if (this.destination != null) {
            obj.set("destination", this.destination)
        }
        obj.set("roundtrip", this.roundtrip.toString())
        let stop_str = ""
        this.stops.forEach((value)=>{
            stop_str += value ? "1" : "0"
        })
        obj.set("stops", stop_str)
        setMaybe("minPrice", this.priceRange.minValue)
        setMaybe("maxPrice", this.priceRange.maxValue)
        setMaybe("minDuration", this.durationRange.minValue)
        setMaybe("maxDuration", this.durationRange.maxValue)
        return obj
    }
    static parse(params : URLSearchParams)  {
        const option = new FilterOptionType()
        const departDate = params.get("departDate")
        const roundtrip = params.get("roundtrip")
        const arriveDate = params.get("arriveDate")
        function maybeInt(s : string | null) {
            if (s != null) {
                return parseInt(s)
            } else {
                return null
            }
        }
        option.durationRange = {
            minValue : maybeInt(params.get("minDuration")),
            maxValue : maybeInt(params.get("maxDuration")),
        }
        option.priceRange = {
            minValue : maybeInt(params.get("minPrice")),
            maxValue : maybeInt(params.get("maxPrice")),
        }
        option.origin = params.get("origin")
        option.destination = params.get("destination")
        if (roundtrip != null) {
            option.roundtrip = parseInt(roundtrip)
        }
        if (departDate != null) {
            option.departDate = new DateWithZone(departDate, "UTC")
        }
        if (arriveDate != null) {
            option.arriveDate = new DateWithZone(arriveDate, "UTC")
        }
        return option
    }
}