import moment from 'moment';

/**
 * Turn time into timestamp
 * @param { String } timestamp
 */
export function convertTimeToSecond(timestamp) {
  if (!timestamp) return timestamp;

  // Turn to Number
  let time = '';
  if (timestamp) {
    time = moment(timestamp * 1).format('YYYY-MM-DD HH:mm:ss');
  }
  return time;
}

/**
 * Turn time into timestamp
 * @param { String } timestamp
 */
export function convertTimeToDay(timestamp) {
  if (!timestamp) return timestamp;

  // Turn to Number
  let time = '';
  if (timestamp) {
    time = moment(timestamp * 1).format('YYYY-MM-DD');
  }
  return time;
}
