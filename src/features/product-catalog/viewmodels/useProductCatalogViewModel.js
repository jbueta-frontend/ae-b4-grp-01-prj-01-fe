import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../../services/api';
import { getCategories } from '../../../services/productService';
import {
  CATEGORIES,
  DATABASE_CATEGORIES,
  mapApiProduct,
} from '../models/productModel';
import { useCart } from '../../../context/CartContext';

export const AGE_OPTIONS = [
  'All Ages',
  'Ages 0–3',
  'Ages 2+',
  'Ages 3+',
  'Ages 5+',
  'Ages 8+',
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
  const [categories, setCategories] = useState(CATEGORIES);
  const [categoryItems, setCategoryItems] = useState(DATABASE_CATEGORIES);
  const [selectedAge, setSelectedAge] = useState('All Ages');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [addedNotice, setAddedNotice] = useState(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();

  const fetchCategoryData = useCallback(async () => {
    try {
      const data = await getCategories();
      if (Array.isArray(data) && data.length > 0) {
        setCategoryItems(data);
        const dynamicList = ['All Toys', ...data.map((c) => c.name)];
        setCategories(dynamicList);
      }
    } catch (err) {
      console.warn('Failed to load categories:', err);
    }
  }, []);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/products');
      const list = Array.isArray(res) ? res : res?.products || res?.data || [];
      const normalized = list.map(mapApiProduct).filter(Boolean);

      // Merge with seeded products if present
      const cached = localStorage.getItem('fiddlemania_seeded_products');
      let combined = [...normalized];
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            const existingIds = new Set(combined.map((p) => p.id));
            parsed.forEach((raw) => {
              const mapped = mapApiProduct(raw);
              if (mapped && !existingIds.has(mapped.id)) {
                combined.push(mapped);
              }
            });
          }
        } catch {}
      }

      setProducts(combined);
    } catch (err) {
      // Fallback to cached products if API fails
      const cached = localStorage.getItem('fiddlemania_seeded_products');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed.map(mapApiProduct).filter(Boolean));
            setLoading(false);
            return;
          }
        } catch {}
      }
      setError(err?.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalog();
    fetchCategoryData();
  }, [fetchCatalog, fetchCategoryData]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category Filter
      const matchCat =
        selectedCategory === 'All Toys' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase() ||
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
  }, [products, selectedCategory, selectedAge, selectedPrice, inStockOnly, urlQuery]);

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

  // Pagination State (12 products per page)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Reset to page 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedAge, selectedPrice, inStockOnly, urlQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const goToPage = (page) => {
    const target = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(target);
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const resetFilters = () => {
    setSelectedCategory('All Toys');
    setSelectedAge('All Ages');
    setSelectedPrice('all');
    setInStockOnly(false);
    handleSetSearchQuery('');
    setCurrentPage(1);
  };

  return {
    categories,
    categoryItems,
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
    products: paginatedProducts,
    totalFilteredCount: filteredProducts.length,
    totalProductsCount: products.length,
    currentPage,
    totalPages,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
    loading,
    error,
    refresh: fetchCatalog,
    handleQuickAdd,
    addedNotice,
  };
}
