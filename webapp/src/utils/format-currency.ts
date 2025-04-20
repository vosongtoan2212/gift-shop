export default function formatCurrency(amount: number, locale = "vi-VN", currency = "VND"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}