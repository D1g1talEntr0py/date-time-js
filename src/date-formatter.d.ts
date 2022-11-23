/**
 * Class used to format dates into {@link string} representations.
 *
 * @module DateFormatter
 * @author Jason DiMeo <jason.dimeo@gmail.com>
 */
export default class DateFormatter {
    /**
     *
     * @param {Object.<string, string>} patternTokens
     * @param {boolean} [global=false]
     * @returns {PatternFormat}
     */
    static createPatterns(patternTokens: {
        [x: string]: string;
    }, global?: boolean): PatternFormat;
    /**
     *
     * @type {PatternFormat} Pattern
     */
    static Pattern: PatternFormat;
    /**
     *
     * @param {DateTime} dateTime
     * @param {string} pattern
     * @param {boolean} [utc]
     * @returns {string}
     */
    static format(dateTime: DateTime, pattern: string, utc?: boolean): string;
}
export type DateTime = import('./date-time.js').default;
import PatternFormat from "./pattern-format.js";
