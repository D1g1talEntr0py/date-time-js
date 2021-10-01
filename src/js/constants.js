import Period from './period.js';

const epochDateMS = 18000000;
const INVALID_DATE = 'Invalid Date';

const regExps = {
	nonAlpha: /[\WT]+/g,
	nonNumeric: /[^\dA-Z]|T/gi,
	matchOffset: /(?=[+-]\d\d:?\d\d)/,
	formattingTokens: /\[([^\]]+)]|Y{1,4}|M{1,4}|Do|D{1,2}|d{1,3}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|z{1,3}|SSS/g
};

const dateTimePatterns = {
	DEFAULT: 'dd MMM Do YYYY HH:mm:ss z',
	MEDIUM_DATE: 'MMM D, YYYY',
	LONG_DATE: 'MMMM D, YYYY',
	FULL_DATE: 'ddd, MMMM D, YYYY',
	FULL_DATE_TIME: 'ddd, MMMM D, YYYY hh:mm:ss A zzz',
	SHORT_TIME: 'h:mm A',
	MEDIUM_TIME: 'h:mm:ss A',
	LONG_TIME: 'h:mm:ss A zzz',
	READABLE_TIME: 'h:mm A z',
	ISO_DATE: 'YYYY-MM-DD',
	ISO_TIME: 'HH:mm:ss.SSSZ',
	ISO_DATE_TIME: 'YYYY-MM-DD[T]HH:mm:ss.SSSZ',
	LOCALE_DATE: undefined,
	LOCALE_SHORT_DATE: undefined,
	LOCALE_DATE_TIME: undefined,
	LOCALE_SHORT_DATE_TIME: undefined
};

const dateTimeFields = {
	YEAR: 'FullYear',
	MONTH: 'Month',
	DAY: 'Date',
	HOURS: 'Hours',
	MINUTES: 'Minutes',
	SECONDS: 'Seconds',
	MILLISECONDS: 'Milliseconds',
	TIMEZONE_OFFSET: 'TimezoneOffset',
	DAY_OF_THE_WEEK: 'Day'
};

const dateTimePeriods = {
	YEARS: new Period(dateTimeFields.YEAR),
	MONTHS: new Period(dateTimeFields.MONTH),
	WEEKS: new Period(dateTimeFields.DAY),
	DAYS: new Period(dateTimeFields.DAY),
	HOURS: new Period(dateTimeFields.HOURS),
	MINUTES: new Period(dateTimeFields.MINUTES),
	SECONDS: new Period(dateTimeFields.SECONDS),
	MILLISECONDS: new Period(dateTimeFields.MILLISECONDS)
}

const timezoneFormats = {
	SHORT: 'short',
	LONG: 'long'
}

const dateTimeFieldValues = Object.values(dateTimeFields);

const dateParsingPatterns = [];

const timezone = { city: Intl.DateTimeFormat().resolvedOptions().timeZone,	name: {} };
timezone.name[timezoneFormats.SHORT] = {};
timezone.name[timezoneFormats.LONG] = {};

const dateTimeUnits = {
	YEAR: 'year',
	MONTH: 'month',
	DAY: 'day',
	HOURS: 'hours',
	MINUTES: 'minutes',
	SECONDS: 'seconds',
	MILLISECONDS: 'milliseconds',
	ZONE_OFFSET: 'zoneOffset',
	MERIDIEM: 'meridiem'
};

const datePatternTokens = {
	Y: { index: 0, unit: dateTimeUnits.YEAR, regExp: /(\d{4})/ },
	M: { index: 1, unit: dateTimeUnits.MONTH, regExp: /(0?[1-9]|1[0-2])?/ },
	D: { index: 2, unit: dateTimeUnits.DAY, regExp: /(0?[1-9]|[12][\d]|3[01])?/ },
	H: { index: 3, unit: dateTimeUnits.HOURS, regExp: /([01]?[\d]|2[0-3])?/ },
	h: { index: 3, unit: dateTimeUnits.HOURS, regExp: /(0?[1-9]|1[0-2])?/ },
	m: { index: 4, unit: dateTimeUnits.MINUTES, regExp: /(0?[1-9]|[1-5]\d)?/ },
	s: { index: 5, unit: dateTimeUnits.SECONDS, regExp: /(0?[1-9]|[1-5]\d)?/ },
	S: { index: 6, unit: dateTimeUnits.MILLISECONDS, regExp: /(\d{3})?/ },
	Z: { index: 7, unit: dateTimeUnits.ZONE_OFFSET, regExp: /([+-]\d\d:?\d\d|Z)?/ },
	A: { index: 7, unit: dateTimeUnits.MERIDIEM, regExp: /([A|P]M)?/ }
};

export { epochDateMS, INVALID_DATE, regExps, dateTimePatterns, dateTimeFields, dateTimeFieldValues, dateParsingPatterns, dateTimePeriods, timezone, timezoneFormats, dateTimeUnits, datePatternTokens };