# DateTime
JavaScript wrapper for Date object

## Installation

```bash
npm install @d1g1tal/date-time-js
```

## Usage

```javascript
import DateTime from '@d1g1tal/date-time-js';

const dateTime = new DateTime();

// Local time
console.log(dateTime.format(DateTime.Pattern.ISO_DATE_TIME)); // 2023-03-28T11:43:58.130GMT-4:00
// or
console.log(dateTime.format('YYYY-MM-DD[T]HH:mm:ss.SSSZ')); // 2023-03-28T11:43:58.130GMT-4:00

// UTC time
console.log(dateTime.utc().format(DateTime.Pattern.ISO_DATE_TIME)); // 2023-03-28T15:43:58.130Z
```

## API

### DateTime

#### Constructor

```javascript
new DateTime();
```

#### Methods

##### format

```javascript
dateTime.format(DateTime.Pattern.ISO_DATE_TIME);
```

##### utc

```javascript
dateTime.utc();
```

##### add

```javascript
dateTime.add(DateTime.Unit.DAY, 1);
```

##### subtract

```javascript
dateTime.subtract(DateTime.Unit.DAY, 1);
```

##### get

```javascript
dateTime.get(DateTime.Unit.DAY);
```

##### set

```javascript
dateTime.set(DateTime.Unit.DAY, 1);
```

##### isLeapYear

```javascript
dateTime.isLeapYear();
```

