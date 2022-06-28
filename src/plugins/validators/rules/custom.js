/* eslint-disable no-control-regex */
export const demoCustomRule = value => {
  const regex = /^\w+\.*\w+@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  return regex.test(value);
};

export const checkIsMoreThanFourDecimal = value => {
  const regex = /^\d+(\.\d{1,4})?$/gi;
  return regex.test(value);
};

export const checkIsMoreThanTwoDecimal = value => {
  const regex = /^\d+(\.\d{1,2})?$/gi;
  return regex.test(value);
};

export const checkoutIpv4 = value => {
  const regex = /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/gm;
  return regex.test(value);
};

export const checkoutIpv6 = value => {
  const regex = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/gm;
  return regex.test(value);
};

export const checkIsAscii = value => {
  const regex = /^[\x00-\x7F]*$/;
  return regex.test(value);
};

export const checkOtpVerifyMsg = value => {
  const regex = /{{authCode}}/;
  return regex.test(value);
};
