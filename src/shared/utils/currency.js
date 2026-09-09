/**
 * Formats a numeric value into Philippine Peso (PHP / ₱) currency string.
 * Example:
 *   formatPHP(48)    => "₱48.00"
 *   formatPHP(1250)  => "₱1,250.00"
 */
export function formatPHP(amount) {
  const num = typeof amount === 'number' ? amount : Number(amount) || 0;
  return `₱${num.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
