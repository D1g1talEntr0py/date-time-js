/** @typedef {import('./date-time.js').default} DateTime */
/**
 * Class representation of a Duration *
 *
 * @author Jason DiMeo <jason.dimeo@gmail.com>
 */
export default class Duration {
    /**
     *
     * @param {number} timestamp
     * @returns {Duration}
     */
    static fromTimestamp(timestamp: number): Duration;
    /**
     *
     * @param {DateTime} startDate
     * @param {DateTime} endDate
     * @returns {Duration}
     */
    static between(startDate: DateTime, endDate: DateTime): Duration;
    /**
     * Creates a new {@link Duration} instance
     *
     * @param {Object} config
     * @param {number} [config.years=0]
     * @param {number} [config.months=0]
     * @param {number} [config.days=0]
     * @param {number} [config.hours=0]
     * @param {number} [config.minutes=0]
     * @param {number} [config.seconds=0]
     * @param {number} [config.milliseconds=0]
     * @param {number} [config.total]
     */
    constructor({ years, months, days, hours, minutes, seconds, milliseconds, total }?: {
        years?: number;
        months?: number;
        days?: number;
        hours?: number;
        minutes?: number;
        seconds?: number;
        milliseconds?: number;
        total?: number;
    });
    /**
     *
     * @returns {number}
     */
    get years(): number;
    /**
     *
     * @returns {number}
     */
    get months(): number;
    /**
     *
     * @returns {number}
     */
    get days(): number;
    /**
     *
     * @returns {number}
     */
    get hours(): number;
    /**
     *
     * @returns {number}
     */
    get minutes(): number;
    /**
     *
     * @returns {number}
     */
    get seconds(): number;
    /**
     *
     * @returns {number}
     */
    get milliseconds(): number;
    /**
     *
     * @returns {number}
     */
    asYears(): number;
    /**
     *
     * @returns {number}
     */
    asMonths(): number;
    /**
     *
     * @returns {number}
     */
    asWeeks(): number;
    /**
     *
     * @returns {number}
     */
    asDays(): number;
    /**
     *
     * @returns {number}
     */
    asHours(): number;
    /**
     *
     * @returns {number}
     */
    asMinutes(): number;
    /**
     *
     * @returns {number}
     */
    asSeconds(): number;
    /**
     *
     * @returns {number}
     */
    asMilliseconds(): number;
    /**
     *
     * @returns {Period}
     */
    asPeriod(): Period;
    /**
     *
     * @returns {Duration}
     */
    normalize(): Duration;
    /**
     *
     * @returns {Array<Period>} The periods for this duration.
     */
    periods(): Array<Period>;
    /**
     *
     * @returns {Object.<string, number>}
     */
    values(): {
        [x: string]: number;
    };
    /**
     *
     * @returns {string}
     */
    get [Symbol.toStringTag](): string;
    #private;
}
export type DateTime = import('./date-time.js').default;
import Period from "./period.js";
