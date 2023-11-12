import { expect } from '@jest/globals';
import { DateTime } from './test-module.js?locale=en-US&global=true';
import { _dateFromArray, _get } from '../src/utils.js';

/**
 * Checks that the properties of a {@link Date} object match the properties of a {@link DateTime} object
 *
 * @param {string} description The description of the test.
 * @param {DateTime} dateTime The date time object.
 * @param {Date} date The date object.
 */
const _checkDateProperties = (description, dateTime, date) => {
	expect(dateTime.toDate().toString()).not.toBe('Invalid Date');
	expect(dateTime.getYear()).toBe(_get(date, 'FullYear', dateTime.isUtc()));
	// Native JavaScript Date uses 0-based months. ლ(ಠ益ಠლ)
	expect(dateTime.getMonth()).toBe(_get(date, 'Month', dateTime.isUtc()) + 1);
	expect(dateTime.getDay()).toBe(_get(date, 'Date', dateTime.isUtc()));
	expect(dateTime.getHour()).toBe(_get(date, 'Hours', dateTime.isUtc()));
	expect(dateTime.getMinute()).toBe(_get(date, 'Minutes', dateTime.isUtc()));
	expect(dateTime.getSecond()).toBe(_get(date, 'Seconds', dateTime.isUtc()));
	expect(dateTime.getMillisecond()).toBe(_get(date, 'Milliseconds', dateTime.isUtc()));
};

/**
 * Creates new {@link Date} and {@link DateTime} objects and returns them in an {@link Object}
 *
 * @param {Array<number>} dateValues The values to use to create the date.
 * @param {boolean} [utc=false] Indicates that the date should be created as UTC.
 * @returns {{date: Date, dateTime: DateTime}} The date and date time objects.
 */
const _createDatesFromArray = (dateValues, utc = false) => ({ date: _dateFromArray(dateValues, utc), dateTime: new DateTime(dateValues, { utc }) });

/**
 * Create a {@link Date} instance as UTC.
 *
 * @returns {Date} The date.
 */
const _createCurrentUtcDate = () => {
	const date = new Date();

	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()));
};

/**
 * Determines if the date is in Daylight Savings Time
 *
 * @param {Date} date The date to check.
 * @returns {boolean} `true` if the date is in Daylight Savings Time, `false` otherwise.
 */
const _isDST = (date) => {
	const year = date.getFullYear();
	const monthsTestOrder = [ 6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1 ];
	let standardTimeOffset = _dateFromArray([year, 1, 1]).getTimezoneOffset();

	for (let month = 1; month <= 12; month++) {
		let offset = _dateFromArray([year, monthsTestOrder[month], 1]).getTimezoneOffset();
		if (offset != standardTimeOffset) {
			standardTimeOffset = Math.max(standardTimeOffset, offset);
			break;
		}
	}

	return date.getTimezoneOffset() < standardTimeOffset;
};

export { _checkDateProperties, _createDatesFromArray, _createCurrentUtcDate, _isDST };