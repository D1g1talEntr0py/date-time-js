import { i18n } from './constants.js';
import { _dateFromArray } from './utils.js';

/** @typedef { import('./base-date-time.js').default } BaseDateTime */

/**
 * Class used to format dates into {@link string} representations.
 *
 * @module TimeZone time-zone
 * @author D1g1talEntr0py <jason.dimeo@gmail.com>
 */
export default class TimeZone {
	/** @type {Date} */
	#date;
	/** @type {Object<string, Intl.DateTimeFormat>} */
	#formatters;
	/** @type {Object<string, string>} */
	#names;
	/** @type {number} */
	#offset;
	/** @type {string} */
	#location;

	/**
	 * Create a new {@link TimeZone} instance.
	 *
	 * @param {BaseDateTime} baseDateTime The base date time object.
	 * @param {Object<string, Intl.DateTimeFormat>} formatters The formatters to use for this instance.
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
	 * Get the offset of the date time object.
	 * The offset is the difference, in minutes, between UTC and local time.
	 * The offset is positive if the local timezone is behind UTC and negative if the local timezone is ahead of UTC.
	 *
	 * @returns {number} The offset of the date time object.
	 */
	get offset() {
		return this.#offset ??= this.#date.getTimezoneOffset();
	}

	/**
	 * Get the name of the timezone.
	 * The name is determined by the provided {@link timeZoneFormat}.
	 *
	 * @param {string} timeZoneFormat	The format of the timezone name.
	 * @returns {string} The name of the timezone.
	 */
	getName(timeZoneFormat) {
		return this.#names[timeZoneFormat] ??= this.#formatters[timeZoneFormat].formatToParts(this.#date).find((part) => part.type == 'timeZoneName')?.value;
	}
}