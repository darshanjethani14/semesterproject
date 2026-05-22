import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { CATEGORIES } from '../utils/constants';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ products: [], page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || '-createdAt';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [filters, setFilters] = useState({ search, category, sort, minPrice, maxPrice });

  useEffect(() => {
    setFilters({ search, category, sort, minPrice, maxPrice });
  }, [search, category, sort, minPrice, maxPrice]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 12, sort };
        if (search) params.search = search;
        if (category && category !== 'All') params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const { data: res } = await getProducts(params);
        setData(res);
      } catch {
        setData({ products: [], page: 1, pages: 1, total: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, category, page, sort, minPrice, maxPrice]);

  const applyFilters = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category && filters.category !== 'All') params.set('category', filters.category);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    params.set('page', '1');
    setSearchParams(params);
  };

  const changePage = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Shop All Products</h1>
      <p className="mt-2 text-gray-500">{data.total} products found</p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-64">
          <form onSubmit={applyFilters} className="card sticky top-24 space-y-4 p-5">
            <h3 className="flex items-center gap-2 font-semibold">
              <FiFilter /> Filters
            </h3>
            <div>
              <label className="text-sm font-medium">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input-field mt-1"
                placeholder="Product name..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="input-field mt-1"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c === 'All' ? '' : c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Min $</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="input-field mt-1"
                  min="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Max $</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="input-field mt-1"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="input-field mt-1"
              >
                <option value="-createdAt">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-rating">Top Rated</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full">Apply Filters</button>
          </form>
        </aside>

        <div className="flex-1">
          {loading ? (
            <ProductSkeleton />
          ) : data.products.length === 0 ? (
            <div className="card py-16 text-center">
              <p className="text-lg text-gray-500">No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              {data.pages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => changePage(page - 1)}
                    disabled={page <= 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    <FiChevronLeft />
                  </button>
                  <span className="text-sm font-medium">
                    Page {page} of {data.pages}
                  </span>
                  <button
                    onClick={() => changePage(page + 1)}
                    disabled={page >= data.pages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
