/**
 * 將 ISO 日期格式 (不包含時間部分) 轉換為年月日的物件
 * @param {String} date e.g. '2020-10-20' or '2020-11'
 * @returns {Array<Number>} { year: 2020, month: 10, day: 20 } or { year: 2020, month: 10, day: null }
 * @throws 當傳入的日期格式不合法時，於 console 顯示錯誤訊息
 */
export const parseDateString = date => {
  const regex = new RegExp(
    /(19\d\d|20\d\d)-(0[1-9]|1[0-2])-?(0[1-9]|[12][0-9]|3[01])?/
  );
  if (!regex.test(date)) {
    console.error('Error when parsing date string.', date);
    return;
  }

  const groups = regex.exec(date);
  groups.splice(0, 1);
  const result = groups.map(group => parseInt(group));

  return {
    year: result[0],
    month: result[1],
    day: result[2] ? result[2] : null
  };
};
