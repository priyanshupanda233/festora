/**
 * Formats a monetary value into Indian Rupee representation (e.g., ₹1,299)
 * or returns "Price on Enquiry" if null/undefined.
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Price on Enquiry';
  }

  // Use Indian number formatting (e.g. 1,00,000)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a purely numeric subtotal into formatted INR string
 */
export function formatSubtotal(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
