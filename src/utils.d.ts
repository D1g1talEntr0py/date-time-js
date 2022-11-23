export type Period = import('./period.js').default;
/** @typedef { import('./period.js').default } Period */
/**
 * Creates a date from an array of numeric values
 *
 * @param {Array<number>} values
 * @param {boolean} [utc=false]
 * @returns {Date}
 */
export function _dateFromArray([year, month, day, hours, minutes, seconds, milliseconds]: Array<number>, utc?: boolean): Date;
/**
 * Converts a legacy date (a date where the time zone offset is not a multiple of 15) to or from UTC
 *
 * @param {BaseDateTime} baseDate
 * @param {number} timeZoneOffset
 * @param {boolean} [utc=false]
 * @returns {BaseDateTime}
 */
export function _convertLegacyDate({ year, month, day, hour, minute, second, millisecond }: BaseDateTime, timeZoneOffset: number, utc?: boolean): BaseDateTime;
/**
 * Sets the value of the specified date field in the Date object
 *
 * @param {Date} date
 * @param {string} field
 * @param {number} value
 * @param {boolean} [utc=false]
 * @returns {number}
 */
export function _set(date: Date, field: string, value: number, utc?: boolean): number;
/**
 * Gets the value of the specified date field from the Date object
 *
 * @param {Date} date
 * @param {string} field
 * @param {boolean} [utc]
 * @returns {number}
 */
export function _get(date: Date, field: string, utc?: boolean): number;
/**
 * Creates a new {@link Date} object starting at the specified unit.
 * It is faster to create a new {@link Date} object than to modify the existing one.
 *
 * @param {BaseDateTime} baseDate
 * @param {string} unit
 * @returns {BaseDateTime}
 */
export function _startOf(baseDate: BaseDateTime, unit: string): BaseDateTime;
/**
 *
 * @param {Date} date
 * @param {Array<Period>} periods
 * @param {string} operationType
 * @param {boolean} utc
 * @returns
 */
export function _processDatePeriodOperations(date: Date, periods: Array<Period>, operationType: string, utc: boolean): BaseDateTime;
/**
 *
 * @param {string} string
 * @param {number} start
 * @param  {...string} chars
 * @returns {string}
 */
export function _splice(string: string, start: number, ...chars: string[]): string;
/**
 *
 *
 * @param {Array<*>} array
 * @param {number} from
 * @param {number} [to]
 */
export function _removeArrayEntryByIndex(array: Array<any>, from: number, to?: number): void;
import BaseDateTime from "./base-date-time.js";
