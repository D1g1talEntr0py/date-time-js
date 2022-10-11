import { i18n } from './constants.js';
import { _dateFromArray } from './utils.js';
/** @typedef { import('./base-date-time.js').default } BaseDateTime */

export default class TimeZone {
	#date;
	#formatters;
	#names;
	#offset;
	#location;

	/**
	 *
	 * @param {BaseDateTime} baseDateTime
	 * @param {Object.<string, Intl.DateTimeFormat>} formatters
	 */
	constructor(baseDateTime, formatters) {
		this.#date = baseDateTime.isLegacyDate ? _dateFromArray([1970, baseDateTime.month, baseDateTime.day, baseDateTime.hour, baseDateTime.minute, baseDateTime.second, baseDateTime.millisecond], baseDateTime.utc) : baseDateTime.date;
		this.#formatters = formatters;
		this.#names = { [i18n.timeZoneFormats.SHORT]: undefined, [i18n.timeZoneFormats.LONG]: undefined };
	}

	get location() {
		return this.#location ??= this.#formatters[i18n.timeZoneFormats.SHORT].resolvedOptions().timeZone;
	}

	/**
	 *
	 * @returns {number}
	 */
	 get offset() {
		return this.#offset ??= this.#date.getTimezoneOffset();
	}

	/**
	 *
	 * @param {string} timeZoneFormat
	 * @returns {string}
	 */
	 getName(timeZoneFormat) {
		return this.#names[timeZoneFormat] ??= this.#formatters[timeZoneFormat].formatToParts(this.#date).find((part) => part.type == 'timeZoneName')?.value;
	}
}