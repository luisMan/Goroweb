export function formatCurrency(cents: number, currencyCode = "MXN"): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  }).format(cents / 100);
}
