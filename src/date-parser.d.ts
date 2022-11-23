export default class DateParser {
    /**
     *
     * @param {string} localeDatePattern
     * @param {string} localeTimePattern
     */
    constructor(localeDatePattern: string, localeTimePattern: string);
    /**
     * Parse a string representation of a date and return a {@link Date} object.
     * The string is parsed using a {@link DateParserPattern} parameter or one from the pre-defined array
     *
     * @param {string} date
     * @param {Object} options
     * @param {boolean} [options.utc]
     * @param {string} [options.pattern]
     * @returns {BaseDateTime}
     */
    parse(date: string, { utc, pattern }: {
        utc?: boolean;
        pattern?: string;
    }): BaseDateTime;
    #private;
}
import BaseDateTime from "./base-date-time.js";
