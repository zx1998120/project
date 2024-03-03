import moment from "moment";
import {FlightPlan, timeDiff} from "../type/FlightPlan.ts";
import styles from "./FlightCard.module.css"

export default function FlightCard({plan}: { plan: FlightPlan }) {
    const departDate = plan.flights[0].departTime
    const arriveDate = plan.flights[plan.flights.length - 1].arriveTime
    const price : number = plan.flights.reduce((acc : number, f) => {
        return f.price + acc
    }, 0)
    const duration : number = timeDiff(departDate, arriveDate).asMilliseconds()
    const totalTime = moment.utc(duration).format("HH:mm");
    return (
        <div className={styles.holder}>
            <span className={`${styles.flightId} ${styles.bold}`}>WN654</span>
            <span className={`${styles.stops} ${styles.bold}`}>2 stops</span>
            <div className={styles.duration}>
                <div className={styles.time}>
                    <span className={styles.flight}>BOA</span>
                    <span className={`${styles.hour} ${styles.bold}`}>{departDate.formatHourMinute()}</span>
                    <span className={styles.date}>{departDate.formatMonth()}</span>
                </div>
                <div className={styles.split}>
                    <span className={styles.totalTime}>{totalTime}</span>
                    <span className={`${styles.arrow} ${styles.bold}`}></span>
                </div>
                <div className={styles.time}>
                    <span className={styles.flight}>llllllllllllong name</span>
                    <span className={`${styles.hour} ${styles.bold}`}>{arriveDate.formatHourMinute()}</span>
                    <span className={styles.date}>{arriveDate.formatMonth()}</span>
                </div>
            </div>
            <span className={`${styles.price} ${styles.bold}`}>${price}</span>
            <button className={styles.book}>Book</button>
        </div>
    );
}