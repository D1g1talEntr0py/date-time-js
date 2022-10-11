// @ts-nocheck
import PatternFormat from './pattern-format.js';
import { _splice } from './utils.js';
import { i18n, regExps } from './constants.js';
/** @typedef { import('./date-time.js').default } DateTime */

/**
 * Converts numeric timezone offset in minutes to hours and formats it (i.e. 300 -> -0500)
 *
 * @param {number} offset
 * @returns {string}
 */
const _formatOffset = (offset) => (0 < offset ? '-' : '+') + `${(Math.floor(Math.abs(offset) / 60) * 100 + Math.abs(offset) % 60)}`.padStart(4, '0');

/** @type {Map<string, function(DateTime): string>} */
const	flags = new Map([
	['D', (dateTime) => dateTime._baseDateTime.day],
	['DD', (dateTime) => `${dateTime._baseDateTime.day}`.padStart(2, '0')],
	['Do', (dateTime) => dateTime._locale.ordinal(dateTime._baseDateTime.day)],
	['d', (dateTime) => dateTime._baseDateTime.dayOfTheWeek],
	['dd', (dateTime) => dateTime._locale.dayNames[dateTime._baseDateTime.dayOfTheWeek]],
	['ddd', (dateTime) => dateTime._locale.dayNames[dateTime._baseDateTime.dayOfTheWeek + 7]],
	['M', (dateTime) => dateTime._baseDateTime.month],
	['MM', (dateTime) => `${dateTime._baseDateTime.month}`.padStart(2, '0')],
	['MMM', (dateTime) => dateTime._locale.monthNames[dateTime._baseDateTime.month - 1]],
	['MMMM', (dateTime) => dateTime._locale.monthNames[dateTime._baseDateTime.month - 1 + 12]],
	['YYYY', (dateTime) => `${dateTime._baseDateTime.year}`.padStart(4, 0)],
	['h', (dateTime) => dateTime._baseDateTime.hour % 12 || 12],
	['hh', (dateTime) => `${dateTime._baseDateTime.hour}`.padStart(2, '0')],
	['H', (dateTime) => dateTime._baseDateTime.hour],
	['HH', (dateTime) => `${dateTime._baseDateTime.hour}`.padStart(2, '0')],
	['m', (dateTime) => dateTime._baseDateTime.minute],
	['mm', (dateTime) => `${dateTime._baseDateTime.minute}`.padStart(2, '0')],
	['s', (dateTime) => dateTime._baseDateTime.second],
	['ss', (dateTime) => `${dateTime._baseDateTime.second}`.padStart(2, '0')],
	['SSS', (dateTime) => `${dateTime._baseDateTime.millisecond}`.padStart(3, '0')],
	['a', (dateTime) => dateTime._baseDateTime.hour < 12 ? 'am' : 'pm'],
	['A', (dateTime) => dateTime._baseDateTime.hour < 12 ? 'AM' : 'PM'],
	['z', (dateTime) => dateTime._baseDateTime.utc ? 'GMT' : `(${dateTime.getTimeZoneName(i18n.timeZoneFormats.SHORT)})`],
	['zzz', (dateTime) => dateTime._baseDateTime.utc ? 'GMT' : `(${dateTime.getTimeZoneName(i18n.timeZoneFormats.LONG)})`],
	['Z', (dateTime) => dateTime._baseDateTime.utc ? 'Z' : `GMT${_splice(_formatOffset(dateTime.getTimeZoneOffset()), 3, ':')}`],
	['ZZ', (dateTime) => dateTime._baseDateTime.utc ? 'GMT' : `GMT${_formatOffset(dateTime.getTimeZoneOffset())} (${dateTime.getTimeZoneName(i18n.timeZoneFormats.LONG)})`]
]);

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
	static createPatterns(patternTokens, global = false) {
		const patternFormat = new PatternFormat(patternTokens);
		if (global) {
			this.Pattern = patternFormat;
		}
		return patternFormat;
	}

	/**
	 *
	 * @type {PatternFormat} Pattern
	 */
	static Pattern = (() => {
		for (const [ name, pattern ] of Object.entries(PatternFormat)) {
			if (pattern === undefined) delete PatternFormat[name];
		}

		return PatternFormat;
	})();

	/**
	 *
	 * @param {DateTime} dateTime
	 * @param {string} pattern
	 * @param {boolean} [utc]
	 * @returns {string}
	 */
	static format(dateTime, pattern, utc = dateTime._baseDateTime.utc) {
		return dateTime._baseDateTime.isValid ? pattern.replace(regExps.formattingTokens, (flag, captured) => captured ?? flags.get(flag)(utc ? dateTime.utc() : dateTime.local())) : dateTime._baseDateTime.date.toString();
	}
}