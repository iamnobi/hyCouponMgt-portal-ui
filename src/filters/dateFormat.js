export default function(value) {
  if (!value) return value;

  const str = value + '';
  const date = str.substr(0, 8);
  const time = str.substr(-6, 6);

  const date_addLine = date.replace(/(.{4})(.{2})(.{2})/g, '$1-$2-$3');
  const time_addLine = time.replace(/(.{2})(.{2})(.{2})/g, '$1:$2:$3');

  return date_addLine + ' ' + time_addLine;
}
