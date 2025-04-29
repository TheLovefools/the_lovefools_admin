import { getTime } from 'date-fns';
import { format } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import {
  DateValue,
  parseAbsoluteToLocal,
  toCalendarDate,
  CalendarDate,
  ZonedDateTime,
  parseZonedDateTime,
  getLocalTimeZone,
  toZoned,
} from '@internationalized/date';

// ✅ Corrected: Use formatInTimeZone for timezone-safe formatting
export function datepickerFormatDate(date) {
  return formatInTimeZone(date, 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');
}

// export function formatDate(date) {
//   return formatInTimeZone(date, 'Asia/Kolkata', 'dd/MM/yyyy');
// }

export function formatDate(date) {
  if (!date) return ''; // handle empty
  const validDate = new Date(date);
  if (isNaN(validDate)) return ''; // handle invalid date
  return formatInTimeZone(validDate, 'Asia/Kolkata', 'dd/MM/yyyy');
}

export function formatDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy p');
}

export function formatTimestamp(date) {
  return getTime(new Date(date));
}

export function formatDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function formatTime(time) {
  return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function convertUTCToTime(utcString) {
  if (!utcString) return '--:--';
  return new Date(utcString).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function findTimeDifference(currentTime, checkInTime) {
  if (!checkInTime) return '--:--';

  const date1 = new Date(currentTime);
  const date2 = new Date(checkInTime);

  const timeDiffMs = Math.abs(date1.getTime() - date2.getTime());

  const hours = Math.floor(timeDiffMs / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiffMs % (1000 * 60 * 60)) / (1000 * 60));

  const hr = `${hours}`.padStart(2, '0');
  const min = `${minutes}`.padStart(2, '0');

  return `${hr}:${min} hours`;
}

export function formatDateTimeConvert(inputDateString) {
  return parseAbsoluteToLocal(inputDateString);
}

export function formatDateConvert(inputDateString) {
  return parseAbsoluteToLocal(inputDateString);
}

export function convertToDD_MM_YYYY_HHMMSS(inputDate) {
  if (!inputDate) return '';

  inputDate = inputDate.includes('+')
    ? inputDate.replace(inputDate.substring(inputDate.indexOf('+')), '')
    : inputDate;

  const [datePart, timePart] = inputDate.split('T');
  if (!datePart || !timePart) return '';

  const formattedDate =
    datePart.split('-').reverse().join('/') + ' ' + timePart;
  return formattedDate;
}

export const convertToDateFormat = (date) => {
  let calendarDate;

  if (typeof date === 'string' && date.includes('T')) {
    const zonedDateTime = parseZonedDateTime(date);
    calendarDate = toCalendarDate(zonedDateTime);
  } else if (typeof date === 'string') {
    const [year, month, day] = date.split('-').map(Number);
    calendarDate = new CalendarDate(year, month, day);
  } else {
    calendarDate = toCalendarDate(date);
  }

  const jsDate = new Date(
    calendarDate.year,
    calendarDate.month - 1,
    calendarDate.day,
  );

  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return formatter.format(jsDate);
};

const isValidDateFormat = (dateStr) => {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return false;

  const [year, month, day] = parts.map(Number);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return false;

  const dateObj = new Date(year, month - 1, day);
  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
};

export const convertDateToZoned = (dateStr) => {
  let zonedDateTime;

  if (isValidDateFormat(dateStr)) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const calendarDate = new CalendarDate(year, month, day);

    const localTimeZone = getLocalTimeZone();

    zonedDateTime = toZoned(calendarDate, localTimeZone);
  } else {
    zonedDateTime = parseZonedDateTime(dateStr);
  }

  return zonedDateTime;
};
