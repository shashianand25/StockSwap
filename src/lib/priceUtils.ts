export function displayPriceValue(price: number, discountPercent = 0.15) {
  if (typeof price !== 'number' || isNaN(price)) return 0;
  return Math.round(price * (1 - discountPercent));
}

export function formatCurrency(amount: number) {
  return `₹${amount.toLocaleString()}`;
}

export function formatReducedPrice(price: number | undefined | null, discountPercent = 0.15) {
  if (!price) return '₹0';
  const reduced = displayPriceValue(price, discountPercent);
  return formatCurrency(reduced);
}
