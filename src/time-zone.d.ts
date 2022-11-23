/** @typedef { import('./base-date-time.js').default } BaseDateTime */
export default class TimeZone {
    /**
     *
     * @param {BaseDateTime} baseDateTime
     * @param {Object.<string, Intl.DateTimeFormat>} formatters
     */
    constructor(baseDateTime: BaseDateTime, formatters: {
        [x: string]: Intl.DateTimeFormat;
    });
    get location(): any;
    /**
     *
     * @returns {number}
     */
    get offset(): number;
    /**
     *
     * @param {string} timeZoneFormat
     * @returns {string}
     */
    getName(timeZoneFormat: string): string;
    #private;
}
export type BaseDateTime = import('./base-date-time.js').default;
