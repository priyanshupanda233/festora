export interface Category {
  id: string;
  name: string;
  shortDesc: string;
  iconName: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'All Products',
    shortDesc: 'Complete festive lighting catalogue',
    iconName: 'Sparkles',
  },
  {
    id: 'LED Diyas and Lamps',
    name: 'LED Diyas and Lamps',
    shortDesc: 'Flameless tea lights, lotus lamps & electronic diyas',
    iconName: 'Flame',
  },
  {
    id: 'Fairy and String Lights',
    name: 'Fairy and String Lights',
    shortDesc: 'Copper wire, rice lights & multicolour string sets',
    iconName: 'Wand2',
  },
  {
    id: 'Curtain and Waterfall Lights',
    name: 'Curtain and Waterfall Lights',
    shortDesc: 'Cascade drops, meteor shower tubes & star curtains',
    iconName: 'Layers',
  },
  {
    id: 'Rope and Strip Lights',
    name: 'Rope and Strip Lights',
    shortDesc: 'Waterproof outdoor rope & smart RGB strips',
    iconName: 'Zap',
  },
  {
    id: 'Hanging and Entrance Decorations',
    name: 'Hanging & Entrance Decorations',
    shortDesc: 'Illuminated torans, Moroccan lanterns & chandeliers',
    iconName: 'Home',
  },
  {
    id: 'Decorative Lighting Sets',
    name: 'Decorative Lighting Sets',
    shortDesc: 'Festive net mesh & curated holiday packages',
    iconName: 'PackageOpen',
  },
];
