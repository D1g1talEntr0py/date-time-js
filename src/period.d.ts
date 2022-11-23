/** @typedef { import('./date-time.js').default } DateTime */
/**
 * Class representation of a Period of time
 *
 * @author Jason DiMeo <jason.dimeo@gmail.com>
 */
export default class Period {
    /**
     * Create a new {@link Period} instance
     *
     * @param {number} value
     * @param {string} unit
     */
    constructor(value: number, unit: string);
    /**
     *
     * @returns {number}
     */
    get value(): number;
    /**
     *
     * @returns {string}
     */
    get unit(): string;
    /**
     *
     * @returns {string}
     */
    get field(): string;
    /**
     * Adds specified value to the {@link DateTime} instance
     *
     * @param {DateTime} dateTime
     * @param {number} [value=this.value]
     * @returns {DateTime} A new instance of {@link DateTime} object with the period value added.
     */
    add(dateTime: DateTime, value?: number): DateTime;
    /**
     * Subtracts specified value to the {@link DateTime} instance
     *
     * @param {DateTime} dateTime
     * @param {number} [value=this.value]
     * @returns {DateTime} A new instance of {@link DateTime} object with the period value subtracted.
     */
    subtract(dateTime: DateTime, value?: number): DateTime;
    /**
     *
     * @returns {string}
     */
    get [Symbol.toStringTag](): string;
    #private;
}
export type DateTime = import('./date-time.js').default;
