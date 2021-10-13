import { expect, test } from '@jest/globals';
import DateTime from '../src/js/date-time.js';
import Duration from '../src/js/duration.js';

test.only('Duration from Timestamp', () => {
	const epochDateTime = new DateTime('2021-06-30T18:22:03');
	const dateTime = new DateTime('2022-03-10T15:08:56');

	let duration = Duration.fromTimestamp(dateTime.valueOf());
	expect(dateTime.valueOf()).toBe(duration.asMilliseconds());

	duration = Duration.between(epochDateTime, dateTime);
	expect(dateTime.diff(epochDateTime)).toBe(duration.asMilliseconds());
	expect(dateTime.subtract(duration)).toEqual(epochDateTime);
	expect(epochDateTime.add(duration)).toEqual(dateTime);
});