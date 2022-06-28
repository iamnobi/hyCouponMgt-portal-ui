export default function(value) {
  if (!value) return;

  // convert to string
  const PAN = value + '';
  return PAN.replace(/\s/g, '').replace(/(.{4})/g, '$1 ');
}
