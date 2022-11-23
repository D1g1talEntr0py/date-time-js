/**
 * @typedef {Object} DateTimeConfig
 * @property {boolean} [utc = false] Create the DateTime with the UTC offset.
 * @property {string} [locale = i18n.locale] The specific locale to use.
 * @property {string} [pattern] The pattern to use to parse the supplied date string.
 */
/**
 * Native JavaScript Date wrapper. Main features include
 * Parsing of ISO, Locale, and custom date formats.
 * Formatting using custom patterns.
 * Ability to calculate the difference between two dates.
 * Ability to add and subtract date periods from an existing {@link DateTime} instance.
 * Ability to create and convert dates either in UTC or local time zones.
 * {@link DateTime} instances are immutable.
 *
 * @example
 * const dateTime = new DateTime('28/10/2018 23:43:12', { utc: true, pattern: 'DD/MM/YYYY HH:mm:ss' })
 * console.log(dateTime.toString()) // 2018-10-28T23:43:12.000Z
 * @module DateTime
 * @author Jason DiMeo <jason.dimeo@gmail.com>
 */
export default class DateTime {
    /**
     * Static access to date/time patterns used for formatting.
     *
     * @returns { import('./pattern-format.js').default }
     */
    static get Pattern(): import("./pattern-format.js").default;
    /** Static access to date/time units. */
    static Unit: Readonly<{
        YEAR: "year";
        MONTH: "month";
        DAY: "day";
        HOUR: "hour";
        MINUTE: "minute";
        SECOND: "second";
        MILLISECOND: "millisecond";
    }>;
    /** Static access to date/time periods when calculating the difference between 2 dates. */
    static Period: Readonly<{
        YEARS: "years";
        MONTHS: "months";
        WEEKS: "days";
        DAYS: "days";
        HOURS: "hours";
        MINUTES: "minutes";
        SECONDS: "seconds";
        MILLISECONDS: "milliseconds";
    }>;
    /** Static access to time zone formats when retrieving time zone information. */
    static TimeZoneFormat: {
        [x: string]: import("./constants.js").TimeZoneFormat;
    };
    /**
     * Creates a {@link DateTime} object in UTC mode.
     *
     * @param {(string|number|Date|Array<number>|undefined)} [date]
     * @param {Object} [config]
     * @param {string} [config.locale]
     * @param {string} [config.pattern]
     * @returns {DateTime}
     */
    static utc(date?: (string | number | Date | Array<number> | undefined), { locale, pattern }?: {
        locale?: string;
        pattern?: string;
    }): DateTime;
    /**
     * Parses the provided date to a DateTime object or null if the date is invalid.
     *
     * @param {string} date
     * @param {string} pattern
     * @param {Object} [config]
     * @param {boolean} [config.utc]
     * @param {string} [config.locale]
     * @returns {DateTime}
     */
    static parse(date: string, pattern: string, { utc, locale }?: {
        utc?: boolean;
        locale?: string;
    }): DateTime;
    /**
     * Returns the minimum date from the specified dates.
     *
     * @param  {...DateTime} dates
     * @returns {DateTime}
     */
    static min(...dates: DateTime[]): DateTime;
    /**
     * Returns the maximum date from the specified dates.
     *
     * @param  {...DateTime} dates
     * @returns {DateTime}
     */
    static max(...dates: DateTime[]): DateTime;
    /**
     * Create a {@link DateTime} instance at the start of a unit of time.
     *
     * @param {string} unit
     * @param {boolean} utc
     * @returns {DateTime}
     */
    static startOf(unit: string, { utc, locale }?: boolean): DateTime;
    /**
     * Perform an arithmetic operation on a {@link DateTime} instance using the provided value and operation type
     *
     * @param {DateTime} dateTime
     * @param {(Duration|Period)} value
     * @param {string} operationType
     * @returns {DateTime}
     */
    static "__#4@#performOperation"(dateTime: DateTime, value: (Duration | Period), operationType: string): DateTime;
    /**
     * Create new {@link DateTime} instance from various parameter data types
     *
     * @param {string|number|Date|Array<number>|BaseDateTime|DateTimeConfig|undefined} [date = Date.now()]
     * @param {DateTimeConfig} [dateTimeConfig = {}]
     */
    constructor(date?: string | number | Date | Array<number> | BaseDateTime | DateTimeConfig | undefined, { utc, locale, pattern }?: DateTimeConfig);
    /**
     * Create a new {@link DateTime} instance at the start of a unit of time.
     *
     * @param {string} unit
     * @returns {DateTime}
     */
    startOf(unit: string): DateTime;
    /**
     * Converts a UTC date to a local date in the current time zone.
     *
     * @returns {DateTime}
     */
    local(): DateTime;
    /**
     * Converts a local date to a UTC date.
     *
     * @returns {DateTime}
     */
    utc(): DateTime;
    /**
     * Adds the value to the date for the specified date/time period.
     *
     * @param {(number|Duration)} value
     * @param {string} [period]
     * @returns {DateTime}
     */
    add(value: (number | Duration), period?: string): DateTime;
    /**
     * Subtracts the value from the date for the specified date/time period.
     *
     * @param {(number|Duration)} value
     * @param {string} [period]
     * @returns {DateTime}
     */
    subtract(value: (number | Duration), period?: string): DateTime;
    /**
     * Calculates the difference between dates as a {@link Duration}.
     *
     * @param {DateTime} dateTime
     * @returns {Duration}
     */
    duration(dateTime: DateTime): Duration;
    /**
     * Calculates the difference between two dates for the specified date/time period.
     *
     * @param {DateTime} dateTime
     * @param {string} [period]
     * @returns {number}
     */
    diff(dateTime: DateTime, period?: string): number;
    /**
     * Sets the value for the specified unit and returns a new {@link DateTime} instance.
     *
     * @param {string} unit
     * @param {number} value
     * @returns {DateTime}
     */
    set(unit: string, value: number): DateTime;
    /**
     * Sets the year and returns a new DateTime instance.
     *
     * @param {number} value
     * @returns {DateTime}
     */
    setYear(value: number): DateTime;
    /**
     *
     * @param {number} value
     * @returns {DateTime}
     */
    setMonth(value: number): DateTime;
    /**
     *
     * @param {number} value
     * @returns {DateTime}
     */
    setDay(value: number): DateTime;
    /**
     *
     * @param {number} value
     * @returns {DateTime}
     */
    setHour(value: number): DateTime;
    /**
     *
     * @param {number} value
     * @returns {DateTime}
     */
    setMinute(value: number): DateTime;
    /**
     *
     * @param {number} value
     * @returns {DateTime}
     */
    setSecond(value: number): DateTime;
    /**
     *
     * @param {number} value
     * @returns {DateTime}
     */
    setMillisecond(value: number): DateTime;
    /**
     * Sets the current {@link Locale} for this {@link DateTime} instance.
     *
     * @param {string} locale
     * @returns {DateTime}
     */
    setLocale(locale: string): DateTime;
    /**
     *
     * @param {string} unit
     * @returns {number}
     */
    get(unit: string): number;
    /**
     *
     * @returns {number}
     */
    getYear(): number;
    /**
     *
     * @returns {number}
     */
    getMonth(): number;
    /**
     *
     * @returns {number}
     */
    getDay(): number;
    /**
     *
     * @returns {number}
     */
    getHour(): number;
    /**
     *
     * @returns {number}
     */
    getMinute(): number;
    /**
     *
     * @returns {number}
     */
    getSecond(): number;
    /**
     *
     * @returns {number}
     */
    getMillisecond(): number;
    /**
     * Returns the current {@link Locale} for this {@link DateTime} instance.
     *
     * @returns {Locale}
     */
    getLocale(): Locale;
    /**
     * The current time zone
     *
     * @returns {string}
     */
    getTimeZone(): string;
    /**
     * The current time zone offset
     *
     * @returns {number}
     */
    getTimeZoneOffset(): number;
    /**
     *
     * @param {string} timeZoneFormat
     * @returns {string}
     */
    getTimeZoneName(timeZoneFormat: string): string;
    /**
     *
     * @returns {number}
     */
    getDaysInMonth(): number;
    getDayOfTheWeek(): number;
    /**
     *
     * @returns {number}
     */
    getDayOfYear(): number;
    /**
     * Determines if the current date is valid
     *
     * @returns {boolean}
     */
    isValid(): boolean;
    /**
     *
     * @returns {boolean}
     */
    isUtc(): boolean;
    /**
     *
     * @returns {boolean}
     */
    isDaylightSavingsTime(): boolean;
    /**
     *
     * @returns {boolean}
     */
    isLeapYear(): boolean;
    /**
     * Convert DateTime to native Date
     *
     * @returns {Date}
     */
    toDate(): Date;
    /**
     * Determines if one date is equal to the other.
     *
     * @param {DateTime} dateTime
     * @returns {boolean}
     */
    equals(dateTime: DateTime): boolean;
    /**
     * Duplicates the existing {@link DateTime} as a new instance.
     *
     * @returns {DateTime}
     */
    clone(): DateTime;
    /**
     * Returns the primitive value of a DateTime object
     *
     * @returns {number}
     */
    valueOf(): number;
    /**
     * Formats the date according to the specified pattern
     *
     * @param {string} [pattern]
     * @param {boolean} [utc]
     * @returns {string}
     */
    format(pattern?: string, utc?: boolean): string;
    /**
     * Returns a string representation of a date. The format of the string depends on the locale.
     *
     * @returns {string}
     */
    toString(): string;
    /**
     *
     * @param {boolean} [short]
     * @returns {string}
     */
    toLocaleString(short?: boolean): string;
    /**
     *
     * @param {boolean} [short]
     * @returns {string}
     */
    toLocaleDateString(short?: boolean): string;
    /**
     *
     * @param {boolean} [short]
     * @returns {string}
     */
    toLocaleTimeString(short?: boolean): string;
    /**
     *
     * @returns {string}
     */
    toUtcString(): string;
    /**
     *
     * @returns {string}
     */
    get [Symbol.toStringTag](): string;
    #private;
}
export type DateTimeConfig = {
    /**
     * Create the DateTime with the UTC offset.
     */
    utc?: boolean;
    /**
     * The specific locale to use.
     */
    locale?: string;
    /**
     * The pattern to use to parse the supplied date string.
     */
    pattern?: string;
};
import Duration from "./duration.js";
import Locale from "./locale.js";
import Period from "./period.js";
import BaseDateTime from "./base-date-time.js";
