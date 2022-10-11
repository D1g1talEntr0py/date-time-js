export default {
	name: 'en-US',
	patternTokens: {
		D: 'MM/DD/YYYY',
		T: 'h:mm A',
		TS: 'h:mm:ss A',
		DD: 'MMMM Do, YYYY',
		DDD: 'ddd, MMMM Do, YYYY',
		d: 'M/D/YYYY',
		dd: 'MMM Do, YYYY',
		ddd: 'dd, MMM Do, YYYY'
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