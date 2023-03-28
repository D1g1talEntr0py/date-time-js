import { _stringSplice } from '@d1g1tal/chrysalis';
import { i18n, regExps } from './constants.js';
import PatternFormat from './pattern-format.js';
/** @typedef { import('./date-time.js').default } DateTime */

/**
 * Converts numeric timezone offset in minutes to hours and formats it (i.e. 300 -> -0500)
 *
 * @param {number} offset Timezone offset in minutes
 * @returns {string} Formatted timezone offset
 */
const _formatOffset = (offset) => (0 < offset ? '-' : '+') + `${(Math.floor(Math.abs(offset) / 60) * 100 + Math.abs(offset) % 60)}`.padStart(4, '0');

/** @type {Map<string, function(DateTime): string>} */
const	flags = new Map([
	['D', (dateTime) => dateTime.getDay()],
	['DD', (dateTime) => `${dateTime.getDay()}`.padStart(2, '0')],
	['Do', (dateTime) => dateTime.getLocale().ordinal(dateTime.getDay())],
	['d', (dateTime) => dateTime.getDayOfTheWeek()],
	['dd', (dateTime) => dateTime.getLocale().dayNames[dateTime.getDayOfTheWeek()]],
	['ddd', (dateTime) => dateTime.getLocale().dayNames[dateTime.getDayOfTheWeek() + 7]],
	['M', (dateTime) => dateTime.getMonth()],
	['MM', (dateTime) => `${dateTime.getMonth() }`.padStart(2, '0')],
	['MMM', (dateTime) => dateTime.getLocale().monthNames[dateTime.getMonth() - 1]],
	['MMMM', (dateTime) => dateTime.getLocale().monthNames[dateTime.getMonth() - 1 + 12]],
	['YYYY', (dateTime) => `${dateTime.getYear()}`.padStart(4, 0)],
	['h', (dateTime) => dateTime.getHour() % 12 || 12],
	['hh', (dateTime) => `${dateTime.getHour()}`.padStart(2, '0')],
	['H', (dateTime) => dateTime.getHour()],
	['HH', (dateTime) => `${dateTime.getHour()}`.padStart(2, '0')],
	['m', (dateTime) => dateTime.getMinute()],
	['mm', (dateTime) => `${dateTime.getMinute()}`.padStart(2, '0')],
	['s', (dateTime) => dateTime.getSecond()],
	['ss', (dateTime) => `${dateTime.getSecond()}`.padStart(2, '0')],
	['SSS', (dateTime) => `${dateTime.getMillisecond()}`.padStart(3, '0')],
	['a', (dateTime) => dateTime.getHour() < 12 ? 'am' : 'pm'],
	['A', (dateTime) => dateTime.getHour() < 12 ? 'AM' : 'PM'],
	['z', (dateTime) => dateTime.isUtc() ? 'GMT' : `(${dateTime.getTimeZoneName(i18n.timeZoneFormats.SHORT)})`],
	['zzz', (dateTime) => dateTime.isUtc() ? 'GMT' : `(${dateTime.getTimeZoneName(i18n.timeZoneFormats.LONG)})`],
	['Z', (dateTime) => dateTime.isUtc() ? 'Z' : `GMT${_stringSplice(_formatOffset(dateTime.getTimeZoneOffset()), 3, ':')}`],
	['ZZ', (dateTime) => dateTime.isUtc() ? 'GMT' : `GMT${_formatOffset(dateTime.getTimeZoneOffset())} (${dateTime.getTimeZoneName(i18n.timeZoneFormats.LONG)})`]
]);

/**
 * Class used to format dates into {@link string} representations.
 *
 * @module DateFormatter
 * @author d1g1tal <jason.dimeo@gmail.com>
 */
export default class DateFormatter {
	/**
	 * Creates a new {@link PatternFormat} object containing the provided tokens.
	 * If the global flag is set to true, the created patterns will be set as the global patterns.
	 * If the global flag is set to false, or not provided, the created patterns will be returned.
	 *
	 * @static
	 * @param {Object<string, string>} patternTokens Object containing tokens to be used in formatting.
	 * @param {boolean} [global=false] If true, the created patterns will be set as the global patterns.
	 * @returns {PatternFormat}	An object containing the created patterns.
	 */
	static createPatterns(patternTokens, global = false) {
		const patternFormat = new PatternFormat(patternTokens);
		if (global) {
			this.Pattern = patternFormat;
		}
		return patternFormat;
	}

	/**
	 * The global patterns used for formatting.
	 * These patterns can be overridden by creating a new {@link PatternFormat} object and setting it as the global patterns.
	 * The global patterns can also be created using the {@link DateFormatter#createPatterns} method.
	 * The global patterns can be reset to the default patterns by setting the global patterns to undefined.
	 *
	 * @static
	 * @type {PatternFormat} Pattern format object containing the global patterns.
	 */
	static Pattern = (() => {
		for (const [ name, pattern ] of Object.entries(PatternFormat)) {
			if (pattern === undefined) delete PatternFormat[name];
		}

		return PatternFormat;
	})();

	/**
	 * Formats the provided {@link DateTime} object into a {@link string} representation.
	 * The format of the string is determined by the provided pattern.
	 * If the provided pattern is not a valid pattern, the {@link DateTime#toDate} method will be used to convert the {@link DateTime} object to a {@link Date} object.
	 * If the provided pattern is a valid pattern, the provided {@link DateTime} object will be formatted using the provided pattern.
	 *
	 * @param {DateTime} dateTime The {@link DateTime} object to be formatted.
	 * @param {string} pattern The pattern to be used for formatting.
	 * @param {boolean} [utc] If true, the provided {@link DateTime} object will be converted to UTC before formatting.
	 * @returns {string} The formatted {@link DateTime} object.
	 */
	static format(dateTime, pattern, utc = dateTime.isUtc()) {
		return dateTime.isValid() ? pattern.replace(regExps.formattingTokens, (flag, captured) => captured ?? flags.get(flag)(utc ? dateTime.utc() : dateTime.local())) : dateTime.toDate().toString();
	}
}