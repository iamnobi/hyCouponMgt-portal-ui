export default function(n) {
  if (n !== 0 && !n) return n;

  if (isNaN(n * 1)) return n;

  var regex = /(\d+)(\d{3})/;
  return String(n).replace(/^\d+/, amount => {
    while (regex.test(amount)) {
      amount = amount.replace(regex, '$1,$2');
    }
    return amount;
  });
}
