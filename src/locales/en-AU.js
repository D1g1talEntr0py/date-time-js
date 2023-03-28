export default {
	name: 'en-AU',
	patternTokens: {
		D: 'DD/MM/YYYY',
		T: 'HH:mm',
		TS: 'HH:mm:ss',
		DD: 'Do MMMM YYYY',
		DDD: 'ddd, Do MMMM YYYY',
		d: 'D/M/YYYY',
		dd: 'Do MMM YYYY',
		ddd: 'dd, Do MMM YYYY'
	},
	ordinal: (day) => `${day}${['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : (day % 100 - day % 10 != 10) * day % 10]}`,
	dayNames: [
		'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
		'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
	],
	monthNames: [
		'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
		'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
	]
};