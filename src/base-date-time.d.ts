/**
 * BaseDateTime - A class to hold the basic properties of a date
 *
 * @module BaseDateTime
 */
export default class BaseDateTime {
    /**
     *
     * @param {Date} [date = new Date()]
     * @param {boolean} [utc = false]
     */
    constructor(date?: Date, utc?: boolean);
    /**
     *
     * @returns {Date}
     */
    get date(): Date;
    /**
     *
     * @returns {boolean}
     */
    get utc(): boolean;
    /**
     * Get the day of the week
     *
     * @returns {number}
     */
    get dayOfTheWeek(): number;
    /**
     *
     * {@see https://stackoverflow.com/a/27790471/230072}
     *
     * @returns {number}
     */
    get dayOfTheYear(): number;
    /**
     *
     * @returns {number}
     */
    get daysInMonth(): number;
    /**
     *
     * @returns {boolean}
     */
    get isLegacyDate(): boolean;
    /**
     *
     * Let x be the expected number of milliseconds into the year of interest without factoring in daylight savings.
     * Let y be the number of milliseconds since the Epoch from the start of the year of the date of interest.
     * Let z be the number of milliseconds since the Epoch of the full date and time of interest
     * Let t be the subtraction of both x and y from z: z - y - x. This yields the offset due to DST.
     * If t is zero, then DST is not in effect. If t is not zero, then DST is in effect.
     *
     * {@see https://stackoverflow.com/questions/11887934/how-to-check-if-dst-daylight-saving-time-is-in-effect-and-if-so-the-offset}
     *
     * @returns {boolean} `true` if the date is observing DST, `false` otherwise
     */
    get isDaylightSavingsTime(): boolean;
    get isValid(): boolean;
    /**
     *
     * @returns {number}
     */
    valueOf(): number;
    /**
     *
     * @returns {number}
     */
    get year(): number;
    /**
     *
     * @returns {number}
     */
    get month(): number;
    /**
     *
     * @returns {number}
     */
    get day(): number;
    /**
     *
     * @returns {number}
     */
    get hour(): number;
    /**
     *
     * @returns {number}
     */
    get minute(): number;
    /**
     *
     * @returns {number}
     */
    get second(): number;
    /**
     *
     * @returns {number}
     */
    get millisecond(): number;
    /**
     *
     * @returns {string}
     */
    get [Symbol.toStringTag](): string;
    #private;
}
