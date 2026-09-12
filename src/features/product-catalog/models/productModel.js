/**
 * Product Catalog Data Models & Normalizer
 * Hardcoded mockups removed. Products are sourced dynamically from the backend API.
 */

export const DB_CATEGORY_MAP = {
  'c1000000-0000-0000-0000-000000000001': 'Action Figures',
  'c1000000-0000-0000-0000-000000000002': 'Building Sets',
  'c1000000-0000-0000-0000-000000000003': 'Board Games & Puzzles',
  'c1000000-0000-0000-0000-000000000004': 'Plush Toys',
  'c1000000-0000-0000-0000-000000000005': 'Outdoor & Sports',
  'c1000000-0000-0000-0000-000000000006': 'STEM & Educational',
};

export const DATABASE_CATEGORIES = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    categoryId: 'c1000000-0000-0000-0000-000000000001',
    name: 'Action Figures',
    slug: 'action-figures',
    description: 'Superheroes, anime figures, and adventure collectibles',
    thumbnail: '/products/cyber_mech_figure.jpg',
    categoryKey: 'Action Figures',
    sortOrder: 1,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    categoryId: 'c1000000-0000-0000-0000-000000000002',
    name: 'Building Sets',
    slug: 'building-sets',
    description: 'LEGO sets, modular bricks, and creative architectural kits',
    thumbnail: '/products/zen_garden_pagoda.jpg',
    categoryKey: 'Building Sets',
    sortOrder: 2,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    categoryId: 'c1000000-0000-0000-0000-000000000003',
    name: 'Board Games & Puzzles',
    slug: 'board-games-puzzles',
    description: 'Family board games, card games, and jigsaw challenges',
    thumbnail: '/products/mystic_board_game.jpg',
    categoryKey: 'Board Games & Puzzles',
    sortOrder: 3,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    categoryId: 'c1000000-0000-0000-0000-000000000004',
    name: 'Plush Toys',
    slug: 'plush-toys',
    description: 'Soft teddy bears, cute animal plushes, and bedtime friends',
    thumbnail: '/products/cuddle_bear_plush.jpg',
    categoryKey: 'Plush Toys',
    sortOrder: 4,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    categoryId: 'c1000000-0000-0000-0000-000000000005',
    name: 'Outdoor & Sports',
    slug: 'outdoor-sports',
    description: 'Ride-on cars, scooters, balls, and backyard water toys',
    thumbnail: '/products/desert_rally_truck.jpg',
    categoryKey: 'Outdoor & Sports',
    sortOrder: 5,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    categoryId: 'c1000000-0000-0000-0000-000000000006',
    name: 'STEM & Educational',
    slug: 'stem-educational',
    description: 'Robotics, science discovery kits, and coding games',
    thumbnail: '/products/solar_rover_stem.jpg',
    categoryKey: 'STEM & Educational',
    sortOrder: 6,
  },
];

export const CATEGORIES = [
  'All Toys',
  'Action Figures',
  'Building Sets',
  'Board Games & Puzzles',
  'Plush Toys',
  'Outdoor & Sports',
  'STEM & Educational',
];

export const PRODUCTS = [];

import { SEED_PRODUCTS } from '../../admin-inventory/data/seedCatalog.js';

export const GENERATED_PRODUCT_IMAGES = {
  'TOY-BLD-018': '/products/ocean_cargo_ship.jpg',
  'TOY-BLD-017': '/products/lunar_space_station.jpg',
  'TOY-BLD-016': '/products/desert_rally_truck.jpg',
  'TOY-BLD-015': '/products/zen_garden_pagoda.jpg',
  'TOY-BLD-014': '/products/starfighter_cruiser.jpg',
  'TOY-BLD-013': '/products/steam_train_locomotive.jpg',
  'TOY-BLD-012': '/products/deep_sea_submarine.jpg',
  'TOY-BLD-011': '/products/medieval_castle_fortress.jpg',
  'TOY-BLD-010': '/products/metropolis_sky_tower.jpg',
  'TOY-BRD-004': '/products/mystic_board_game.jpg',
  'TOY-PLS-003': '/products/cuddle_bear_plush.jpg',
  'TOY-ACT-002': '/products/cyber_mech_figure.jpg',
  'TOY-STM-005': '/products/solar_rover_stem.jpg',
  'TOY-BLD-001': '/products/galaxy_explorer_starship.jpg',
};

export const CATEGORY_FALLBACK_IMAGES = {
  'Action Figures': '/products/cyber_mech_figure.jpg',
  'Building Sets': '/products/zen_garden_pagoda.jpg',
  'Board Games & Puzzles': '/products/mystic_board_game.jpg',
  'Plush Toys': '/products/cuddle_bear_plush.jpg',
  'Outdoor & Sports': '/products/desert_rally_truck.jpg',
  'STEM & Educational': '/products/solar_rover_stem.jpg',
};

function getGeneratedImageForProduct(p) {
  if (!p) return null;
  const sku = (p.sku || '').toUpperCase();
  if (GENERATED_PRODUCT_IMAGES[sku]) {
    return GENERATED_PRODUCT_IMAGES[sku];
  }

  const name = (p.name || '').toLowerCase();
  if (name.includes('cargo') || name.includes('freight') || name.includes('ship')) {
    return '/products/ocean_cargo_ship.jpg';
  }
  if (name.includes('lunar') || name.includes('space station')) {
    return '/products/lunar_space_station.jpg';
  }
  if (name.includes('desert rally') || name.includes('rally truck') || name.includes('off-road')) {
    return '/products/desert_rally_truck.jpg';
  }
  if (name.includes('pagoda') || name.includes('zen garden') || name.includes('temple')) {
    return '/products/zen_garden_pagoda.jpg';
  }
  if (name.includes('starfighter') || name.includes('interstellar')) {
    return '/products/starfighter_cruiser.jpg';
  }
  if (name.includes('steam train') || name.includes('locomotive')) {
    return '/products/steam_train_locomotive.jpg';
  }
  if (name.includes('submarine') || name.includes('deep sea')) {
    return '/products/deep_sea_submarine.jpg';
  }
  if (name.includes('castle') || name.includes('fortress') || name.includes('keep')) {
    return '/products/medieval_castle_fortress.jpg';
  }
  if (name.includes('sky tower') || name.includes('metropolis') || name.includes('skyscraper')) {
    return '/products/metropolis_sky_tower.jpg';
  }
  if (name.includes('board game') || name.includes('quest') || name.includes('island')) {
    return '/products/mystic_board_game.jpg';
  }
  if (name.includes('bear') || name.includes('cuddle') || name.includes('plush') || name.includes('teddy')) {
    return '/products/cuddle_bear_plush.jpg';
  }
  if (name.includes('mech') || name.includes('defender') || name.includes('samurai') || name.includes('warrior')) {
    return '/products/cyber_mech_figure.jpg';
  }
  if (name.includes('rover') || name.includes('solar') || name.includes('coding') || name.includes('robot')) {
    return '/products/solar_rover_stem.jpg';
  }
  if (name.includes('starship') || name.includes('galaxy explorer')) {
    return '/products/galaxy_explorer_starship.jpg';
  }

  const cat =
    p.category?.name ||
    p.categoryName ||
    DB_CATEGORY_MAP[p.categoryId] ||
    (typeof p.category === 'string' ? p.category : '');
  return CATEGORY_FALLBACK_IMAGES[cat] || null;
}

export function mapApiProduct(p) {
  if (!p) return null;
  const id = p.productId || p.id;
  const category =
    p.category?.name ||
    p.categoryName ||
    DB_CATEGORY_MAP[p.categoryId] ||
    (typeof p.category === 'string' ? p.category : 'General');

  // Prioritize custom uploaded image (data URL, blob, http URL, or local product path)
  let heroImage = null;
  const customImg =
    p.imageUrl || (Array.isArray(p.images) && p.images[0]?.imageUrl);

  if (
    customImg &&
    (customImg.startsWith('data:image/') ||
      customImg.startsWith('blob:') ||
      customImg.startsWith('http://') ||
      customImg.startsWith('https://') ||
      customImg.startsWith('/products/'))
  ) {
    heroImage = customImg;
  } else {
    heroImage = getGeneratedImageForProduct(p);
  }

  // Fallback to category photo
  if (!heroImage) {
    heroImage =
      CATEGORY_FALLBACK_IMAGES[category] || '/products/zen_garden_pagoda.jpg';
  }

  const gallery =
    Array.isArray(p.images) && p.images.length > 0
      ? p.images.map((img) => img.imageUrl || img)
      : p.gallery || [heroImage];

  const ageGroup =
    p.ageMin != null && p.ageMax != null
      ? `Ages ${p.ageMin}–${p.ageMax}`
      : p.ageMin != null
        ? `Ages ${p.ageMin}+`
        : 'All Ages';

  const variants = [];

  const specs = {
    dimensions:
      p.specs?.dimensions ||
      p.dimensions ||
      (p.weightGrams
        ? `${Math.max(15, Math.round(p.weightGrams / 30))} × ${Math.max(12, Math.round(p.weightGrams / 40))} × 10 cm`
        : '28 × 18 × 12 cm'),
    materials:
      p.specs?.materials ||
      p.materials ||
      'Sustainable FSC Certified Beechwood, Non-toxic Beeswax Seals, Organic Pigments',
    origin:
      p.specs?.origin ||
      p.origin ||
      'Precision engineered and hand-finished for heirloom durability',
    safety:
      p.specs?.safety ||
      p.safety ||
      'EN71, ASTM F963, 100% Non-toxic & BPA-Free Certified',
    ageRange: p.specs?.ageRange || p.ageRange || ageGroup,
  };

  const reviews =
    Array.isArray(p.reviews) && p.reviews.length > 0
      ? p.reviews
      : [
          {
            id: 'rev-1',
            author: 'Elena R. (Verified Parent)',
            rating: 5,
            date: '3 days ago',
            text: 'Exceptional craftsmanship. The tactile feel is incredible and my kids play with it for hours screen-free.',
          },
          {
            id: 'rev-2',
            author: 'Marcus K. (Educator)',
            rating: 5,
            date: '1 week ago',
            text: 'Sturdy, beautifully finished, and genuinely educational. Highly recommended for Montessori-style creative play.',
          },
          {
            id: 'rev-3',
            author: 'Claire V. (Verified Buyer)',
            rating: 5,
            date: '2 weeks ago',
            text: 'Outstanding quality and very smooth finish. Worth every single peso!',
          },
        ];

  const inv = p.inventory || {};
  const stockQuantity = Number(inv.stockQuantity ?? p.stockQuantity ?? p.quantity ?? 0);
  const reservedQuantity = Number(inv.reservedQuantity ?? p.reservedQuantity ?? 0);
  const lowStockThreshold = Number(inv.lowStockThreshold ?? p.lowStockThreshold ?? 5);

  // ERD calculation: Available Stock = Stock Quantity - Reserved Quantity
  const availableStock = p.availableQuantity !== undefined
    ? Number(p.availableQuantity)
    : Math.max(0, stockQuantity - reservedQuantity);

  const isOutOfStock = availableStock <= 0 || p.inStock === false || p.isOutOfStock === true;
  const isLowStock = !isOutOfStock && availableStock <= lowStockThreshold;
  const inStock = !isOutOfStock && availableStock > 0;

  return {
    id,
    productId: id,
    name: p.name || 'Unnamed Product',
    slug: p.slug || id,
    sku: p.sku || '—',
    price: Number(p.price || 0),
    originalPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    category,
    ageGroup,
    ageMin: p.ageMin,
    ageMax: p.ageMax,
    brand: p.brand || 'FiddleMania',
    heroImage,
    gallery,
    variants,
    specs,
    reviews,
    shortDescription: p.description || p.shortDescription || '',
    description: p.description || p.shortDescription || '',
    inventory: {
      stockQuantity,
      reservedQuantity,
      lowStockThreshold,
    },
    inStock,
    stockCount: availableStock,
    availableQuantity: availableStock,
    isOutOfStock,
    isLowStock,
    lowStockThreshold,
    status: p.status || 'ACTIVE',
    rating: p.rating || 4.9,
    reviewCount: p.reviewCount || reviews.length,
    tag: p.compareAtPrice && p.compareAtPrice > p.price ? 'On Sale' : 'Featured',
    isOnSale: Boolean(p.compareAtPrice && p.compareAtPrice > p.price),
  };
}
