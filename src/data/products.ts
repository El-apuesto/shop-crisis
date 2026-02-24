import type { Product } from '@/types';

export const products: Product[] = [
  {
    id: 'the-summons-001',
    name: 'THE SUMMONS',
    runNumber: 'RUN 001',
    description: 'A shirt that whispers to the void. The void whispers back.',
    fullDescription: `You didn't choose this shirt. It chose you. 

The Summons is not merely fabric stitched together by underpaid hands in a country you've never visited. It is a calling. A siren song for those who understand that looking good is not a choice—it's a survival mechanism in a world that's constantly on fire.

Features:
• 100% organic cotton (the plants were emotionally supported during growth)
• Hand-distressed by artisans who have seen things
• Tag reads "Dry clean only" but we both know you're throwing this in with your gym socks
• Limited to 666 units because we're not superstitious, just dramatic`,
    originalPrice: 179.99,
    salePrice: 28,
    images: ['/images/summons-1.jpg', '/images/summons-2.jpg', '/images/summons-3.jpg'],
    colors: ['Void Black', 'Crisis Pink', 'Existential Grey'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    chaosLevel: 9.2,
  },
  {
    id: 'the-foundation-002',
    name: 'THE FOUNDATION',
    runNumber: 'RUN 002',
    description: 'Build your personality on something solid. Like this shirt.',
    fullDescription: `Everyone needs a foundation. A base layer of lies they tell the world before adding the accessories that really scream "I have unresolved trauma but make it fashion."

The Foundation is that shirt. The one you reach for when you need to look like you have your life together, even though your apartment is currently 90% unwashed dishes and unopened mail.

Features:
• Premium heavyweight cotton that feels like a hug from someone who actually texts back
• Reinforced seams for when you're holding it all together
• Pre-shrunk (unlike your dreams)
• Available in colors that say "I'm approachable but mysterious"`,
    originalPrice: 149.99,
    salePrice: 28,
    images: ['/images/foundation-1.jpg', '/images/foundation-2.jpg', '/images/foundation-3.jpg'],
    colors: ['Stability White', 'Grounded Beige', 'Reliable Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    chaosLevel: 4.7,
  },
  {
    id: 'the-reckoning-003',
    name: 'THE RECKONING',
    runNumber: 'RUN 003',
    description: 'Judgment day comes for us all. Might as well look good.',
    fullDescription: `There comes a moment in every life when you must face the consequences of your choices. The Reckoning is the shirt you wear to that moment.

Whether it's running into your ex at a coffee shop, showing up to a job interview you lied to get, or simply existing in a world that's judging your every move—this shirt says "I know what I did, and I'd do it again."

Features:
• Signature blend that gets softer with each existential crisis
• Cut to flatter the body you have, not the one your Instagram suggests
• Hidden pocket for secrets (and maybe a tiny bottle of coping mechanisms)
• Each shirt comes with a personalized guilt trip`,
    originalPrice: 199.99,
    salePrice: 28,
    images: ['/images/reckoning-1.jpg', '/images/reckoning-2.jpg', '/images/reckoning-3.jpg'],
    colors: ['Judgment Red', 'Consequence Black', 'Absolution White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    chaosLevel: 10,
  },
];

export const archivedProducts: Product[] = [
  {
    id: 'the-beginning-000',
    name: 'THE BEGINNING',
    runNumber: 'RUN 000',
    description: 'Where it all started. Before we knew what we were doing.',
    fullDescription: 'The first run. The prototype. The shirt that started a crisis.',
    originalPrice: 89.99,
    salePrice: 0,
    images: ['/images/archived-beginning.jpg'],
    colors: ['Prototype Grey'],
    sizes: [],
    inStock: false,
    isArchived: true,
    chaosLevel: 7.5,
  },
  {
    id: 'the-mistake-00x',
    name: 'THE MISTAKE',
    runNumber: 'RUN 00X',
    description: 'We don\'t talk about this one. But here it is in the archives.',
    fullDescription: 'A design so wrong, it became right. Then wrong again.',
    originalPrice: 999.99,
    salePrice: 0,
    images: ['/images/archived-mistake.jpg'],
    colors: ['Regret Blue'],
    sizes: [],
    inStock: false,
    isArchived: true,
    chaosLevel: 11,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return [...products, ...archivedProducts].find((p) => p.id === id);
};

export const getCurrentRun = (): Product[] => products;

export const getArchivedRuns = (): Product[] => archivedProducts;
