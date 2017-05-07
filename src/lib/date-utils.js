import moment from 'moment';

export const US_MOMENT_DATE_FORMAT = 'DD/MM/YYYY';

export function isUSDateString(dateStr) {
  let dateRgx = /^(\d\d)\/(\d\d)\/(\d\d\d\d)$/;
  if (dateStr.match(dateRgx)) {
    return checkDateFormat(dateStr, US_MOMENT_DATE_FORMAT);
  }
  return false;
}

export function parseUSDateString(dateStr) {
  return moment(dateStr, US_MOMENT_DATE_FORMAT);
}

function checkDateFormat(checkDate, dateFmt) {
  return moment(checkDate, dateFmt)
    .format(dateFmt) === checkDate;
}
