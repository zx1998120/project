import moment from 'moment-timezone';
import {immerable} from "immer";
export class DateWithZone {
    [immerable] = true
    utc : moment.Moment
    time : moment.Moment
    timezone : string
    constructor(utc : string, tz : string) {
        this.utc = moment.tz(utc, "UTC")
        this.timezone = tz
        this.time = this.utc.tz(tz)
    }
    getTime() {
        return this.time
    }
    format() : string {
        return this.time.format('h:mm:ss a, MMMM Do')
    }
    formatHourMinute() : string {
        return this.time.format('hh:mm a')
    }
    formatMonth() : string {
        return this.time.format('MMMM Do')
    }
}