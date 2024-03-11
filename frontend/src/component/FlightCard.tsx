import moment from "moment";
import {FlightPlan, SingleFlight, timeDiff} from "../type/FlightPlan.ts";
import styles from "./FlightCard.module.css"
import single_styles from "./SingleFlight.module.css"

function SingleFlightCard({flight}: { flight: SingleFlight }) {
    return <>
        <span className={`${styles.flightId} ${styles.bold}`}>{flight.flightNumber}</span>
        <div className={single_styles.singlePlan}>
            <span className={single_styles.singleFlight}>{flight.departAirport}</span>
            <span className={single_styles.singleFlight}>-</span>
            <span className={single_styles.singleFlight}>{flight.arriveAirport}</span>
        </div>
        <div className={styles.duration}>
            <div className={single_styles.singleTime}>
                <span className={`${styles.hour} ${single_styles.bold}`}>{flight.departTime.formatHourMinute()}</span>
            </div>
            <div className={styles.split}>
                <span className={`${styles.arrow} ${styles.bold}`}></span>
            </div>
            <div className={single_styles.singleTime}>
                <span className={`${styles.hour} ${single_styles.bold}`}>{flight.arriveTime.formatHourMinute()}</span>

            </div>
        </div>
        <span className={`${single_styles.singlePrice} ${styles.bold}`}>${flight.price}</span>
        <div className={single_styles.divider}></div>
    </>
}

export default function FlightCard({plan}: { plan: FlightPlan }) {
    const departDate = plan.flights[0].departTime
    const arriveTime = plan.flights[plan.flights.length - 1].arriveTime
    const price: number = plan.flights.reduce((acc: number, f) => {
        return f.price + acc
    }, 0)
    const duration: number = timeDiff(departDate, arriveTime).asMilliseconds()
    const totalTime = moment.utc(duration).format("DD:HH:mm");
    const stops = plan.flights.length - 1
    return (
        <div className={styles.holder}>
            <div className={styles.flightNumberHolder}>
                {
                    plan.flights.map((value, index) => {
                        return <span key={index}
                                     className={`${styles.flightId} ${styles.bold}`}>{value.flightNumber}</span>
                    })
                }
            </div>
            <span className={`${styles.stops} ${styles.bold}`}>{stops} stop{stops <= 1 ? "" : "s"}</span>
            <div className={styles.duration}>
                <div className={styles.time}>
                    <span className={styles.flight}>{plan.flights[0].departAirport}</span>
                    <span className={`${styles.hour} ${styles.bold}`}>{departDate.formatHourMinute()}</span>
                    <span className={styles.date}>{departDate.formatMonth()}</span>
                </div>
                <div className={styles.split}>
                    <span className={styles.totalTime}>{totalTime}</span>
                    <span className={`${styles.arrow} ${styles.bold}`}></span>
                </div>
                <div className={styles.time}>
                    <span className={styles.flight}>{plan.flights[plan.flights.length - 1].arriveAirport}</span>
                    <span className={`${styles.hour} ${styles.bold}`}>{arriveTime.formatHourMinute()}</span>
                    <span className={styles.date}>{arriveTime.formatMonth()}</span>
                </div>
            </div>
            <span className={`${styles.price} ${styles.bold}`}>${price}</span>
            <button className={styles.bookButton}>Book</button>
            <div className={single_styles.divider}></div>
            {
                plan.flights.map((value, index) => {
                    return <SingleFlightCard key={index} flight={value}/>
                })
            }
            <div ></div>
        </div>

    );
}