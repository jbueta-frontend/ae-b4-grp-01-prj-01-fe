import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS, CATEGORIES } from '../models/productModel';
import { useCart } from '../../../context/CartContext';

export const AGE_OPTIONS = [
  'All Ages',
  'Ages 0–3',
  'Ages 2+',
  'Ages 3+',
  'Ages 5+',
];

export const PRICE_OPTIONS = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-40', label: 'Under ₱40', min: 0, max: 40 },
  { id: '40-70', label: '₱40 to ₱70', min: 40, max: 70 },
  { id: 'above-70', label: 'Over ₱70', min: 70, max: Infinity },
];

export function useProductCatalogViewModel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('cat') || 'All Toys'
  );
  const [selectedAge, setSelectedAge] = useState('All Ages');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [addedNotice, setAddedNotice] = useState(null);

  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Category Filter
      const matchCat =
        selectedCategory === 'All Toys' ||
        product.category === selectedCategory ||
        (selectedCategory === 'Ages 0–3' && product.ageGroup.includes('0–3'));

      // 2. Age Filter
      const matchAge =
        selectedAge === 'All Ages' ||
        product.ageGroup.includes(selectedAge.replace('Ages ', '')) ||
        product.ageGroup === selectedAge;

      // 3. Price Filter
      let matchPrice = true;
      if (selectedPrice === 'under-40') {
        matchPrice = product.price < 40;
      } else if (selectedPrice === '40-70') {
        matchPrice = product.price >= 40 && product.price <= 70;
      } else if (selectedPrice === 'above-70') {
        matchPrice = product.price > 70;
      }

      // 4. In-Stock Filter
      const matchStock = !inStockOnly || product.inStock;

      // 5. Search Query Filter
      const matchSearch =
        !urlQuery.trim() ||
        product.name.toLowerCase().includes(urlQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(urlQuery.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(urlQuery.toLowerCase());

      return matchCat && matchAge && matchPrice && matchStock && matchSearch;
    });
  }, [selectedCategory, selectedAge, selectedPrice, inStockOnly, urlQuery]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All Toys') count++;
    if (selectedAge !== 'All Ages') count++;
    if (selectedPrice !== 'all') count++;
    if (inStockOnly) count++;
    if (urlQuery.trim()) count++;
    return count;
  }, [selectedCategory, selectedAge, selectedPrice, inStockOnly, urlQuery]);

  const handleQuickAdd = (product, e) => {
    if (e) e.stopPropagation();
    addToCart(product, 1);
    setAddedNotice(product.id);
    setTimeout(() => {
      setAddedNotice(null);
    }, 1600);
  };

  const handleSetSearchQuery = (query) => {
    const next = new URLSearchParams(searchParams);
    if (query && query.trim()) {
      next.set('q', query.trim());
    } else {
      next.delete('q');
    }
    setSearchParams(next, { replace: true });
  };

  const handleSetCategory = (cat) => {
    setSelectedCategory(cat);
    const next = new URLSearchParams(searchParams);
    if (cat && cat !== 'All Toys') {
      next.set('cat', cat);
    } else {
      next.delete('cat');
    }
    setSearchParams(next, { replace: true });
  };

  const resetFilters = () => {
    setSelectedCategory('All Toys');
    setSelectedAge('All Ages');
    setSelectedPrice('all');
    setInStockOnly(false);
    handleSetSearchQuery('');
  };

  return {
    categories: CATEGORIES,
    selectedCategory,
    setSelectedCategory: handleSetCategory,
    ageOptions: AGE_OPTIONS,
    selectedAge,
    setSelectedAge,
    priceOptions: PRICE_OPTIONS,
    selectedPrice,
    setSelectedPrice,
    inStockOnly,
    setInStockOnly,
    activeFilterCount,
    resetFilters,
    searchQuery: urlQuery,
    setSearchQuery: handleSetSearchQuery,
    products: filteredProducts,
    totalProductsCount: PRODUCTS.length,
    handleQuickAdd,
    addedNotice,
  };
}
