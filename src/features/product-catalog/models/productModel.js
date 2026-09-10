/**
 * Product Catalog Data Models & Normalizer
 * Hardcoded mockups removed. Products are sourced dynamically from the backend API.
 */

export const CATEGORIES = [
  'All Toys',
  'Building Sets',
  'Action Figures',
  'Plush Toys',
  'Board Games & Puzzles',
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

const CATEGORY_FALLBACK_IMAGES = {
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

  const cat = p.category?.name || p.categoryName || (typeof p.category === 'string' ? p.category : '');
  return CATEGORY_FALLBACK_IMAGES[cat] || null;
}

export function mapApiProduct(p) {
  if (!p) return null;
  const id = p.productId || p.id;
  const category =
    p.category?.name ||
    p.categoryName ||
    (typeof p.category === 'string' ? p.category : 'General');

  // Prioritize high-quality generated product photos matching the product
  let heroImage = getGeneratedImageForProduct(p);

  // If not matched, use explicit valid local product path if supplied
  if (!heroImage && p.imageUrl && p.imageUrl.startsWith('/products/')) {
    heroImage = p.imageUrl;
  }

  // Fallback to category generated photo
  if (!heroImage) {
    heroImage = CATEGORY_FALLBACK_IMAGES[category] || '/products/zen_garden_pagoda.jpg';
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
    shortDescription: p.description || p.shortDescription || '',
    description: p.description || p.shortDescription || '',
    inStock: p.inventory ? p.inventory.stockQuantity > 0 : (p.inStock ?? true),
    stockCount: p.inventory ? p.inventory.stockQuantity : (p.stockCount ?? 10),
    status: p.status || 'ACTIVE',
    rating: p.rating || 4.9,
    reviewCount: p.reviewCount || 18,
    tag: p.compareAtPrice && p.compareAtPrice > p.price ? 'Sale' : 'Featured',
  };
}
