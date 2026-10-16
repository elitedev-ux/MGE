type CheckoutItem = { name: string; quantity: number }

export function whatsappCheckoutUrl(items: CheckoutItem[]): string {
  const message = [
    "Hello MGE! I'd like to order the following items:",
    '',
    ...items.map((item, index) => `${index + 1}. ${item.name} — Quantity: ${item.quantity}`),
    '',
    'Please confirm the final prices, availability, delivery cost, and payment details. Thank you!',
  ].join('\n')
  return `https://wa.me/2348145382171?text=${encodeURIComponent(message)}`
}
