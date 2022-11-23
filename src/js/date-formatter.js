import { i18n, regExps } from './constants.js';
import PatternFormat from './pattern-format.js';
import { _splice } from './utils.js';
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
	['Z', (dateTime) => dateTime.isUtc() ? 'Z' : `GMT${_splice(_formatOffset(dateTime.getTimeZoneOffset()), 3, ':')}`],
	['ZZ', (dateTime) => dateTime.isUtc() ? 'GMT' : `GMT${_formatOffset(dateTime.getTimeZoneOffset())} (${dateTime.getTimeZoneName(i18n.timeZoneFormats.LONG)})`]
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
	static format(dateTime, pattern, utc = dateTime.isUtc()) {
		return dateTime.isValid() ? pattern.replace(regExps.formattingTokens, (flag, captured) => captured ?? flags.get(flag)(utc ? dateTime.utc() : dateTime.local())) : dateTime.toDate().toString();
	}
}