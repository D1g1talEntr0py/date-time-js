import DateTime from '../src/js/date-time';
import { _set, unitsInMilliseconds } from '../src/js/constants';

const _createDateFromArray = (dateValues, utc = false) => {
	const date = utc ? new Date(Date.UTC(...dateValues)) : new Date(...dateValues);

	_set(date, DateTime.fields.MONTH, (utc ? date.getUTCMonth() : date.getMonth()) - 1, utc);
	if (dateValues[0] < 100) {
		_set(date, DateTime.fields.YEAR, dateValues[0], utc);
	}

	return date;
};

const _createDatesFromArray = (dateValues) => ({ date: _createDateFromArray(dateValues), dateTime: new DateTime(dateValues) });

const _createCurrentUtcDate = () => {
	const utcDate = new Date();
	utcDate.setTime(utcDate - utcDate.getTimezoneOffset() * unitsInMilliseconds.MINUTES);

	return utcDate;
};

export { _createDateFromArray, _createDatesFromArray, _createCurrentUtcDate };