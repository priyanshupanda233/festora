import { SiteConfig } from '../types';

export const siteConfig: SiteConfig = {
  storeName: import.meta.env.VITE_STORE_NAME || 'Diwali Glow',
  tagline: import.meta.env.VITE_STORE_TAGLINE || 'Decorative LED Lights & Festive Lighting',
  // Configure business WhatsApp number without + or punctuation (e.g. 919876543210)
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210',
  announcementText: import.meta.env.VITE_ANNOUNCEMENT_TEXT || 'Light Up Your Diwali ✨ | Discover Our Festive Lighting Collection',
  currency: 'INR',
  currencySymbol: '₹',
  businessAddress: 'Festive Lighting Distribution Hub, India',
  businessHours: 'Mon - Sun: 9:00 AM - 10:00 PM (Festive Season)',
  email: 'contact@diwaliglow.in',
};

export const SITE_BENEFITS = [
  {
    title: 'A Variety of Decorative Lights',
    description: 'Extensive festive selection covering LED diyas, fairy strings, curtain waterfalls, and outdoor decorative ropes.',
    icon: 'Sparkles',
  },
  {
    title: 'Easy WhatsApp Enquiries',
    description: 'Add your favorite lighting items to the cart and generate a structured enquiry directly on WhatsApp in one click.',
    icon: 'MessageSquare',
  },
  {
    title: 'Assistance With Product Selection',
    description: 'Direct consultation on choosing the right lighting lengths, colour temperatures, and layouts for your space.',
    icon: 'Compass',
  },
  {
    title: 'Enquiries for Bulk Requirements',
    description: 'Special pricing quotations for residential societies, banquet halls, temples, offices, and large installations.',
    icon: 'Boxes',
  },
];

export const ABOUT_CONTENT = {
  title: 'Illuminate Your Celebrations with Diwali Glow',
  lead: 'Discover decorative lighting for every festive corner. From glowing LED diyas to colourful string lights and statement decorations, explore our collection and contact us directly for product availability and pricing.',
  paragraphs: [
    'At Diwali Glow, we curate modern electronic and LED decorative lighting that brings warmth, festive elegance, and joy to homes across India without the soot, smoke, or fire hazards of traditional setups.',
    'Whether you are decorating an intimate living room altar, an expansive balcony, or an entire residential building, our collection of energy-efficient LED lights creates timeless celebratory memories.'
  ]
};

export const FAQ_ITEMS = [
  {
    question: 'How can I find out the price?',
    answer: 'Most products in our catalogue feature transparent prices in Indian Rupees (INR). For specialized or customizable installations marked "Price on Enquiry", add them to your cart and send us a WhatsApp message to receive an accurate quotation based on your specific requirements.',
  },
  {
    question: 'Can I enquire about multiple products at once?',
    answer: 'Yes! Simply browse our catalogue, select desired lengths and quantities, and add them to your Enquiry Cart. Clicking "Enquire on WhatsApp" prepares a consolidated breakdown with all products and quantities in a single message.',
  },
  {
    question: 'Can I enquire about bulk quantities?',
    answer: 'Absolutely. We accommodate bulk requirements for housing societies, offices, event organizers, and retail spaces. Enter your quantity requirements in the cart or mention your bulk requirements in the notes field before sending.',
  },
  {
    question: 'Are all products available in every colour?',
    answer: 'Available colour variations (such as Warm White, Golden Amber, RGB Multicolour) are displayed on each product card. If you require a custom colour tone not listed, contact us directly via WhatsApp to verify current batch availability.',
  },
  {
    question: 'How can I find out about delivery?',
    answer: 'Once you send your cart enquiry on WhatsApp, we calculate delivery charges and estimated transit time based on your postal location and package dimensions. We confirm delivery details before you make any payment.',
  },
  {
    question: 'How do I send my enquiry?',
    answer: 'Select your chosen festive lights, open the Enquiry Cart, optionally enter your delivery location and name, and click "Enquire on WhatsApp". WhatsApp will open with your pre-filled enquiry message ready to send.',
  },
];
