export const CATEGORIES = ['All Toys', 'Wooden', 'STEM', 'Plush', 'Ages 0–3'];

export const PRODUCTS = [
  {
    id: 'prod-01',
    name: 'Architect Beechwood Block Set',
    slug: 'architect-beechwood-block-set',
    tag: 'Best Seller',
    discount: '17% OFF',
    category: 'Wooden',
    ageGroup: 'Ages 2+',
    price: 48.0,
    originalPrice: 58.0,
    rating: 4.9,
    reviewCount: 142,
    inStock: true,
    stockCount: 18,
    heroImage:
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80',
    ],
    shortDescription:
      '50 precision-milled architectural solid beechwood shapes. Silky smooth, rounded bevels, and organic beeswax seal for open-ended tactile discovery.',
    variants: [
      { id: 'v1', name: 'Natural Beech', color: '#D4B896' },
      { id: 'v2', name: 'Walnut Stain', color: '#6A4E35' },
      { id: 'v3', name: 'Raw Maple', color: '#E8D8C3' },
    ],
    specs: {
      dimensions: '28 cm × 20 cm × 12 cm box',
      materials:
        'Sustainably harvested German Beechwood, organic beeswax finish',
      safety:
        'ASTM F963-17 & EN71 certified. Zero formaldehyde, zero microplastics.',
      ageRange: 'Recommended for ages 18 months and up',
      origin: 'Designed in Copenhagen, sustainably crafted in Bavaria',
    },
    reviews: [
      {
        id: 'r1',
        author: 'Elena V.',
        badge: 'Verified Buyer',
        rating: 5,
        date: '2 days ago',
        text: 'The tactile quality is breathtaking. Weighted perfectly for small hands, no rough edges anywhere.',
      },
      {
        id: 'r2',
        author: 'Marcus K.',
        badge: 'Verified Buyer',
        rating: 5,
        date: '1 week ago',
        text: 'Minimalist, heirloom-level quality. Worth every single cent.',
      },
    ],
  },
  {
    id: 'prod-02',
    name: 'Modular STEM Robotics Explorer',
    slug: 'modular-robotics-explorer',
    tag: 'Award Winner',
    discount: '15% OFF',
    category: 'STEM',
    ageGroup: 'Ages 5+',
    price: 85.0,
    originalPrice: 98.0,
    rating: 4.8,
    reviewCount: 96,
    inStock: true,
    stockCount: 12,
    heroImage:
      'https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80',
    ],
    shortDescription:
      'Magnetic click-and-run gear motors with analog sensor modules. Teaches kinetic movement and circuit logic without screentime.',
    variants: [
      { id: 'v1', name: 'Monochrome Slate', color: '#3F3F46' },
      { id: 'v2', name: 'Terracotta Core', color: '#C85A32' },
      { id: 'v3', name: 'Arctic White', color: '#F4F4F5' },
    ],
    specs: {
      dimensions: '32 cm × 24 cm × 8 cm',
      materials: 'Recycled aerospace-grade ABS polymer & brass core pins',
      safety:
        'Enclosed child-safe low-voltage magnetic couplings (CE/FCC compliant)',
      ageRange: 'Ages 5 to 12 years',
      origin: 'Crafted with precision in Switzerland',
    },
    reviews: [
      {
        id: 'r3',
        author: 'David S.',
        badge: 'Verified Buyer',
        rating: 5,
        date: '3 weeks ago',
        text: 'Brilliant hands-on robotics. My 6-year-old built a dual-wheel rover in twenty minutes flat.',
      },
    ],
  },
  {
    id: 'prod-03',
    name: 'Sensory Fox Organic Linen Plush',
    slug: 'sensory-fox-organic-linen-plush',
    tag: 'New Arrival',
    discount: '20% OFF',
    category: 'Plush',
    ageGroup: 'Ages 0–3',
    price: 34.0,
    originalPrice: 42.0,
    rating: 5.0,
    reviewCount: 68,
    inStock: true,
    stockCount: 25,
    heroImage:
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=900&q=80',
    ],
    shortDescription:
      'Stitched from raw unbleached European flax linen with hypoallergenic cornfiber fill. Gently weighted with soothing natural lavender blossom pouches.',
    variants: [
      { id: 'v1', name: 'Rust Fox', color: '#9C4221' },
      { id: 'v2', name: 'Desert Dune', color: '#D5C4A1' },
      { id: 'v3', name: 'Olive Moss', color: '#708238' },
    ],
    specs: {
      dimensions: '30 cm tall',
      materials:
        '100% GOTS Certified Organic Linen & organic lavender seed beads',
      safety: 'Embroidered features (zero plastic buttons or chokable parts)',
      ageRange: 'Safe from birth (0+ months)',
      origin: 'Hand-sewn in Portugal',
    },
    reviews: [
      {
        id: 'r4',
        author: 'Sarah M.',
        badge: 'Verified Buyer',
        rating: 5,
        date: 'Yesterday',
        text: 'The linen texture is wonderfully soft and breathes so nicely. Our newborn sleeps with it daily.',
      },
    ],
  },
  {
    id: 'prod-04',
    name: 'Curved Nordic Balance Board',
    slug: 'curved-nordic-balance-board',
    tag: 'Heirloom',
    discount: '18% OFF',
    category: 'Wooden',
    ageGroup: 'Ages 2+',
    price: 72.0,
    originalPrice: 88.0,
    rating: 4.9,
    reviewCount: 110,
    inStock: true,
    stockCount: 8,
    heroImage:
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=900&q=80',
    ],
    shortDescription:
      'Multi-layer Baltic Birch curved rocker board. Functions as a bridge, slide, balancing rocker, or quiet reading lounger. Supports up to 220 lbs.',
    variants: [
      { id: 'v1', name: 'Raw Birch', color: '#E8D8C3' },
      { id: 'v2', name: 'Felt Backed (Warm Grey)', color: '#9CA3AF' },
    ],
    specs: {
      dimensions: '82 cm × 30 cm × 18 cm curve',
      materials:
        '9-ply sustainably managed Baltic Birch plywood, water-based lacquer',
      safety: 'TUV Rheinland safety tested up to 100 kg dynamic load',
      ageRange: 'Ages 18 months through adult',
      origin: 'Handmade in Latvia',
    },
    reviews: [
      {
        id: 'r5',
        author: 'Julian T.',
        badge: 'Verified Buyer',
        rating: 5,
        date: '5 days ago',
        text: 'Indestructible. Even I use it for balance exercises during desk breaks.',
      },
    ],
  },
  {
    id: 'prod-05',
    name: 'Chromatic Magnetic Building Tiles (60pc)',
    slug: 'chromatic-magnetic-building-tiles',
    tag: 'Popular',
    discount: '20% OFF',
    category: 'STEM',
    ageGroup: 'Ages 3+',
    price: 54.0,
    originalPrice: 65.0,
    rating: 4.9,
    reviewCount: 205,
    inStock: true,
    stockCount: 30,
    heroImage:
      'https://images.unsplash.com/photo-1581557991964-125469da3b8a?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581557991964-125469da3b8a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?auto=format&fit=crop&w=900&q=80',
    ],
    shortDescription:
      'Translucent prism tiles with ultrasonically welded rare-earth neodymium magnets. Clean geometric shadows when placed near natural sunlight.',
    variants: [
      { id: 'v1', name: 'Sunset Spectrum', color: '#EA580C' },
      { id: 'v2', name: 'Nordic Pastel', color: '#38BDF8' },
      { id: 'v3', name: 'Emerald Forest', color: '#10B981' },
    ],
    specs: {
      dimensions: 'Standard 7.5 cm grid geometry',
      materials:
        'Food-grade BPA-free MABS plastic with sonic-welded rivet corners',
      safety: 'Triple-sealed safety rivets preventing magnet dislodgement',
      ageRange: 'Ages 3 years and older',
      origin: 'Designed in Norway',
    },
    reviews: [
      {
        id: 'r6',
        author: 'Chloe L.',
        badge: 'Verified Buyer',
        rating: 5,
        date: '2 weeks ago',
        text: 'The magnet strength is just right. Towers stay standing and the bevels catch the light like stained glass.',
      },
    ],
  },
  {
    id: 'prod-06',
    name: 'Silicone Nesting Pebble Towers',
    slug: 'silicone-nesting-pebble-towers',
    tag: 'Sensory',
    discount: '25% OFF',
    category: 'Ages 0–3',
    ageGroup: 'Ages 0–3',
    price: 29.0,
    originalPrice: 38.0,
    rating: 4.9,
    reviewCount: 84,
    inStock: true,
    stockCount: 20,
    heroImage:
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80',
    ],
    shortDescription:
      '7 stone-textured nesting bowls made from velvety, medical-grade food silicone. Doubles as soothing teething grips, water scoops, and stacking towers.',
    variants: [
      { id: 'v1', name: 'Earthy Clay', color: '#BA7A58' },
      { id: 'v2', name: 'Sage & Mist', color: '#84A98C' },
    ],
    specs: {
      dimensions: 'Stacks to 22 cm height; nests down to 9 cm',
      materials:
        '100% Platinum Medical Silicone, free of BPA, PVC, and Phthalates',
      safety: 'Dishwasher & boil-safe. FDA certified food-contact compliant.',
      ageRange: 'Ages 6 months to 4 years',
      origin: 'Designed in Stockholm',
    },
    reviews: [
      {
        id: 'r7',
        author: 'Hanna P.',
        badge: 'Verified Buyer',
        rating: 5,
        date: '4 days ago',
        text: 'Washes easily in the dishwasher, wonderful soft matte feel. My toddler takes them into the bath every night.',
      },
    ],
  },
  {
    id: 'prod-07',
    name: 'Kinetic Wooden Marble Run Spiral',
    slug: 'kinetic-marble-run-spiral',
    tag: 'Staff Pick',
    discount: '20% OFF',
    category: 'STEM',
    ageGroup: 'Ages 3+',
    price: 64.0,
    originalPrice: 80.0,
    rating: 4.9,
    reviewCount: 72,
    inStock: true,
    stockCount: 15,
    heroImage:
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80',
    ],
    shortDescription:
      'Modular solid beechwood ramps and gravitational funnel vortexes. Smooth wooden marbles create gentle xylophone acoustics as they glide.',
    variants: [
      { id: 'v1', name: 'Natural Birch', color: '#E8D8C3' },
      { id: 'v2', name: 'Walnut Spiral', color: '#6A4E35' },
    ],
    specs: {
      dimensions: '45 cm × 30 cm tower footprint',
      materials: 'Solid German Birch and natural acoustic bells',
      safety: 'Oversized child-safe 35mm solid wooden rolling spheres',
      ageRange: 'Ages 3 years and up',
      origin: 'Handcrafted in Germany',
    },
    reviews: [
      {
        id: 'r8',
        author: 'Tobias F.',
        badge: 'Verified Buyer',
        rating: 5,
        date: '1 week ago',
        text: 'The acoustic chime when the marbles drop through the spirals is so tranquil.',
      },
    ],
  },
  {
    id: 'prod-08',
    name: 'Montessori Organic Shape Sorting Box',
    slug: 'montessori-organic-shape-sorting-box',
    tag: 'Classic',
    discount: '15% OFF',
    category: 'Wooden',
    ageGroup: 'Ages 0–3',
    price: 36.0,
    originalPrice: 42.0,
    rating: 5.0,
    reviewCount: 118,
    inStock: true,
    stockCount: 22,
    heroImage:
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=900&q=80',
    ],
    shortDescription:
      'Classic Montessori object permanence and prism shape sorter. Made with smooth beveled maple and non-toxic waterborne food pigments.',
    variants: [
      { id: 'v1', name: 'Pastel Meadow', color: '#A7C4B5' },
      { id: 'v2', name: 'Pure Wood', color: '#D4B896' },
    ],
    specs: {
      dimensions: '16 cm × 16 cm × 14 cm',
      materials: 'Sustainable European Maple with beeswax buff',
      safety: 'Zero small parts; rounded corners for safe toddler handling',
      ageRange: 'Ages 12 months to 3 years',
      origin: 'Handmade in Austria',
    },
    reviews: [
      {
        id: 'r9',
        author: 'Camilla R.',
        badge: 'Verified Buyer',
        rating: 5,
        date: '3 days ago',
        text: 'Absolute perfection. Heirloom quality that can be passed down generations.',
      },
    ],
  },
];
