import DateTime from './src/js/date-time.js'

// const d = new Date('2021-06-10 4:18:50.3456Z');
// let dt = new DateTime('2016-01-01T00:00:00');
const dateTime = new DateTime('0001-09-30T15:48:25.125').utc();
// const utcDateTime = new DateTime().utc();
// const dateTimeParse = DateTime.parse('2016/1/1 9:2:4 PM', 'YYYY/MM/DD h:m:s A');
// const diff = dateTimeParse.diff(new DateTime('2021-10-18T14:50:21'), DateTime.periods.MONTHS);
// const duration = new DateTime.Duration(dateTime, new DateTime('2021-10-18T14:50:21').utc());
// const duration = new DateTime.Duration({ years: 1, months: 8, days: 15, hours: 4, minutes: 44, seconds: 59 });
// console.log(dateTime.add(duration).format(DateTime.patterns.FULL_DATE_TIME));
// console.dir(duration.asObject());
console.log(dateTime.format(DateTime.patterns.ISO_DATE_TIME));
console.log(dateTime.local().format(DateTime.patterns.ISO_DATE_TIME));
// console.log(dateTimeParse.format());
// console.log(dateTime.add(1, DateTime.periods.YEARS).isLeapYear());
// console.log(dateTime.format(DateTime.patterns.ISO_DATE_TIME));
// console.log(utcDateTime.format(DateTime.patterns.ISO_DATE_TIME));
// for (const pattern of Object.values(DateTime.patterns)) {
// 	console.log(dateTime.format(pattern));	
// }

// console.log(`TimeZone: ${dateTime.getTimezone()}`);
// console.log(`Actual: ${d.toDate().toISOString()}`);