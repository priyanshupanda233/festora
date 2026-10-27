import { CartItem, CustomerDetails } from '../types';
import { formatINR, formatSubtotal } from './currency';

export interface WhatsAppValidation {
  isValid: boolean;
  isPlaceholder: boolean;
  cleanNumber: string;
  warningMessage?: string;
}

/**
 * Validates configured WhatsApp business number
 */
export function validateWhatsAppNumber(number: string | undefined): WhatsAppValidation {
  if (!number || number.trim() === '') {
    return {
      isValid: false,
      isPlaceholder: false,
      cleanNumber: '',
      warningMessage: 'WhatsApp business number is not configured in environment or settings.'
    };
  }

  const clean = number.replace(/[^0-9]/g, '');

  if (clean.includes('X') || number.toUpperCase().includes('X') || clean === '910000000000' || clean.length < 10) {
    return {
      isValid: false,
      isPlaceholder: true,
      cleanNumber: clean,
      warningMessage: 'WhatsApp number is currently set to placeholder "91XXXXXXXXXX". Please configure your real business WhatsApp number in the admin settings or .env file.'
    };
  }

  return {
    isValid: true,
    isPlaceholder: false,
    cleanNumber: clean
  };
}

/**
 * Formats a single cart enquiry into the required structured WhatsApp message
 */
export function generateCartWhatsAppMessage(
  cartItems: CartItem[],
  customerDetails?: CustomerDetails
): string {
  if (!cartItems || cartItems.length === 0) {
    return '';
  }

  const lines: string[] = [];

  // Salutation & Intro
  lines.push('Hello! 👋');
  lines.push('I would like to enquire about the following Diwali decorative lights.\n');

  // Product Details Section
  lines.push('PRODUCT DETAILS');

  let pricedSubtotal = 0;
  let unpricedCount = 0;

  cartItems.forEach((item, index) => {
    const { product, quantity, selectedColor, selectedSize } = item;
    lines.push(`Product: ${product.name}`);

    // Variation line
    const variationParts: string[] = [];
    if (selectedColor) variationParts.push(`Color: ${selectedColor}`);
    if (selectedSize) variationParts.push(`Size/Length: ${selectedSize}`);
    if (product.variations?.pack_size && !selectedSize?.includes(product.variations.pack_size)) {
      variationParts.push(`Pack: ${product.variations.pack_size}`);
    }

    if (variationParts.length > 0) {
      lines.push(`Variation: ${variationParts.join(' | ')}`);
    }

    // Price & Quantity
    if (product.price !== null && product.price !== undefined) {
      const lineSubtotal = product.price * quantity;
      pricedSubtotal += lineSubtotal;
      lines.push(`Unit Price: ${formatINR(product.price)}`);
      lines.push(`Quantity: ${quantity}`);
      lines.push(`Line Subtotal: ${formatSubtotal(lineSubtotal)}`);
    } else {
      unpricedCount += 1;
      lines.push(`Unit Price: Price on Enquiry`);
      lines.push(`Quantity: ${quantity}`);
      lines.push(`Line Subtotal: Price on Enquiry`);
    }

    if (index < cartItems.length - 1) {
      lines.push(''); // Spacing between products
    }
  });

  // Pricing Summary Section
  lines.push('\nPRICING SUMMARY');
  if (pricedSubtotal > 0) {
    lines.push(`Priced Items Subtotal: ${formatSubtotal(pricedSubtotal)}`);
  } else {
    lines.push(`Priced Items Subtotal: Price on Enquiry`);
  }

  if (unpricedCount > 0) {
    lines.push(`Items Requiring Quotation: ${unpricedCount} product(s) marked for custom quotation`);
  }

  // Customer Details (Include only if supplied!)
  const hasCustomerInfo = customerDetails && (
    customerDetails.name?.trim() ||
    customerDetails.contact?.trim() ||
    customerDetails.location?.trim() ||
    customerDetails.notes?.trim()
  );

  if (hasCustomerInfo) {
    lines.push('\nCUSTOMER DETAILS');
    if (customerDetails.name?.trim()) {
      lines.push(`Name: ${customerDetails.name.trim()}`);
    }
    if (customerDetails.contact?.trim()) {
      lines.push(`Contact: ${customerDetails.contact.trim()}`);
    }
    if (customerDetails.location?.trim()) {
      lines.push(`Location: ${customerDetails.location.trim()}`);
    }
    if (customerDetails.notes?.trim()) {
      lines.push(`Additional Requirements: ${customerDetails.notes.trim()}`);
    }
  }

  // Standard Confirmation Checklist
  lines.push('\nPlease confirm:');
  lines.push('• Product availability.');
  lines.push('• Final pricing.');
  lines.push('• Any applicable bulk discounts.');
  lines.push('• Delivery charges.');
  lines.push('• Estimated delivery time.');
  lines.push('• Available payment methods.');
  lines.push('\nThank you!');

  return lines.join('\n');
}

/**
 * Builds the complete WhatsApp Click-to-Chat URL
 */
export function buildWhatsAppUrl(
  whatsappNumber: string,
  message: string
): { url: string; validation: WhatsAppValidation } {
  const validation = validateWhatsAppNumber(whatsappNumber);
  const encodedText = encodeURIComponent(message);
  const targetNumber = validation.isValid ? validation.cleanNumber : '919876543210';
  const url = `https://wa.me/${targetNumber}?text=${encodedText}`;

  return { url, validation };
}

/**
 * Builds a direct single-product enquiry message
 */
export function generateSingleProductWhatsAppMessage(
  productName: string,
  price: number | null,
  quantity: number = 1,
  variation?: string
): string {
  const lines = [
    'Hello! 👋',
    `I would like to enquire about the "${productName}".`,
    variation ? `Selected Variation: ${variation}` : '',
    price !== null ? `Price: ${formatINR(price)}` : 'Price: Price on Enquiry',
    `Quantity: ${quantity}`,
    '',
    'Please let me know if this item is in stock, along with delivery options.',
    'Thank you!'
  ].filter(Boolean);

  return lines.join('\n');
}
