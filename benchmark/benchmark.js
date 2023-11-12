import Benchmark from 'benchmark';
import dayjs from 'dayjs';
// import arraySupport from 'dayjs/plugin/arraySupport.js';
// import customParseFormat from 'dayjs/plugin/customParseFormat.js';
// import { DateTime } from '../src/index/esm.js';
import { DateTime } from '../dist/esm/date-time.min.js';

// add tests
// new Benchmark.Suite('Default Constructor')
// 	// .add('Native JavaScript Date', () => new Date())
// 	.add('DayJS', () => dayjs())
// 	.add('DateTime-JS', () => new DateTime())
// 	// add listeners
// 	.on('cycle', (event) => console.log(String(event.target)))
// 	.on('complete', function() {
// 		console.log('Fastest is ' + this.filter('fastest').map('name'));
// 	})
// 	// run async
// 	.run({ async: true });

// new Benchmark.Suite('Date Constructor')
// 	// .add('Native JavaScript Date', () => new Date())
// 	.add('DayJS', () => dayjs(new Date()))
// 	.add('DateTime-JS', () => new DateTime(new Date()))
// 	// add listeners
// 	.on('cycle', (event) => console.log(String(event.target)))
// 	.on('complete', function() {
// 		console.log('Fastest is ' + this.filter('fastest').map('name'));
// 	})
// 	// run async
// 	.run({ async: true });

// new Benchmark.Suite('Number Constructor')
// 	// .add('Native JavaScript Date', () => new Date())
// 	.add('DayJS', () => dayjs(Date.now()))
// 	.add('DateTime-JS', () => new DateTime(Date.now()))
// 	// add listeners
// 	.on('cycle', (event) => console.log(String(event.target)))
// 	.on('complete', function() {
// 		console.log('Fastest is ' + this.filter('fastest').map('name'));
// 	})
// 	// run async
// 	.run({ async: true });

// dayjs.extend(arraySupport);
// const array = [2018, 0, 1, 12, 15, 2, 34];
// new Benchmark.Suite('Array Constructor')
// 	// .add('Native JavaScript Date', () => new Date())
// 	.add('DayJS', () => dayjs(array))
// 	.add('DateTime-JS', () => new DateTime(array))
// 	// add listeners
// 	.on('cycle', (event) => console.log(String(event.target)))
// 	.on('complete', function() {
// 		console.log('Fastest is ' + this.filter('fastest').map('name'));
// 	})
// 	// run async
// 	.run({ async: true });

// const isoDate = '2018-01-01 12:15';
// const pattern = 'YYYY-MM-DD HH:mm';
// dayjs.extend(customParseFormat);
// new Benchmark.Suite('String Constructor Custom Format')
// 	.add('DayJS', () => dayjs(isoDate, pattern))
// 	.add('DateTime-JS', () => new DateTime(isoDate, { pattern }))
// 	// add listeners
// 	.on('cycle', (event) => console.log(String(event.target)))
// 	.on('complete', (event) => console.log('Fastest is ' + event.currentTarget.filter('fastest').map('name')))
// 	.on('error', (event) => console.log(event.target.error))
// 	// run async
// 	.run({ async: true });

// const localeDate = '01/01/2018 12:15:02 AM';
// new Benchmark.Suite('String Constructor Locale')
// 	// .add('Native JavaScript Date', () => new Date())
// 	.add('DayJS', () => dayjs(localeDate))
// 	.add('DateTime-JS', () => new DateTime(localeDate))
// 	// add listeners
// 	.on('cycle', (event) => console.log(String(event.target)))
// 	.on('complete', (event) => console.log('Fastest is ' + event.currentTarget.filter('fastest').map('name')))
// 	// run async
// 	.run({ async: true });

// const isoDate = '2018-04-04T16:24:02.984Z';
// new Benchmark.Suite('String Constructor ISO')
// 	// .add('Native JavaScript Date', () => new Date())
// 	.add('DayJS', () => dayjs(isoDate))
// 	.add('DateTime-JS', () => new DateTime(isoDate))
// 	// add listeners
// 	.on('cycle', (event) => console.log(String(event.target)))
// 	.on('complete', (event) => console.log('Fastest is ' + event.currentTarget.filter('fastest').map('name')))
// 	// run async
// 	.run({ async: true });

// dayjs.extend(customParseFormat);
// new Benchmark.Suite('String Constructor, Custom Pattern')
// 	// .add('Native JavaScript Date', () => new Date())
// 	.add('DayJS', () => dayjs('2018-01-01 12152', 'YYYY-MM-DD hhmms'))
// 	.add('DateTime-JS', () => new DateTime('2018-01-01 12152', { pattern: 'YYYY-MM-DD hhmms' }))
// 	// add listeners
// 	.on('cycle', (event) => console.log(String(event.target)))
// 	.on('complete', (event) => console.log('Fastest is ' + event.currentTarget.filter('fastest').map('name')))
// 	// run async
// 	.run({ async: true });

// const dayjsDate = dayjs('2018-01-01 12152', 'YYYY-MM-DD hhmms');
// const dateTime = new DateTime('2018-01-01 12152', { pattern: 'YYYY-MM-DD hhmms' });
// new Benchmark.Suite('Format')
// 	// .add('Native JavaScript Date', () => new Date())
// 	.add('DayJS', () => dayjsDate.format('YYYY-MM-DD HH:mm:ss.SSSZ'))
// 	.add('DateTime-JS', () => dateTime.format(DateTime.Pattern.ISO_DATE_TIME))
// 	// add listeners
// 	.on('cycle', (event) => console.log(String(event.target)))
// 	.on('complete', (event) => console.log('Fastest is ' + event.currentTarget.filter('fastest').map('name')))
// 	// run async
// 	.run({ async: true });