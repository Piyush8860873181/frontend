import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  RotateCcw, 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  GraduationCap, 
  Check,
  PackageOpen,
  ArrowUpDown
} from 'lucide-react';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/common/ProductCard';

export default function MarketplacePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state initialized from URL
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'All');
  const [college, setCollege] = useState(searchParams.get('college') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'available');
  const [graduateClearance, setGraduateClearance] = useState(searchParams.get('graduateClearance') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const collegeList = [
    'All',
    'Delhi University',
    'IP University',
    'IIT Delhi',
    'Delhi Technological University',
    'BITS Pilani',
    'Anna University',
    'Other College'
  ];

  const conditionList = ['All', 'Brand New', 'Like New', 'Good', 'Fair'];

  // Load categories
  useEffect(() => {
    categoryService.getCategories().then((res) => {
      if (res.data?.success) setCategories(res.data.data);
    }).catch(console.error);
  }, []);

  // Fetch products whenever filters or searchParams change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 12,
          sort,
        };

        if (search) params.search = search;
        if (category && category !== 'All') params.category = category;
        if (condition && condition !== 'All') params.condition = condition;
        if (college && college !== 'All') params.college = college;
        if (status && status !== 'All') params.status = status;
        if (graduateClearance) params.graduateClearance = 'true';
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const res = await productService.getProducts(params);
        if (res.data?.success) {
          setProducts(res.data.data);
          setTotal(res.data.total);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.error('Failed to load marketplace products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [search, category, condition, college, status, graduateClearance, minPrice, maxPrice, sort, page]);

  // Sync to URL query params
  const updateParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '' || val === 'All' || val === false) {
        updated.delete(key);
      } else {
        updated.set(key, val);
      }
    });
    setSearchParams(updated);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setCondition('All');
    setCollege('All');
    setMinPrice('');
    setMaxPrice('');
    setStatus('available');
    setGraduateClearance(false);
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Search Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Verified Campus Network</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Explore Student Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <span className="font-bold text-slate-800">{total}</span> academic and campus essentials available for resale.
          </p>
        </div>

        {/* Search input & Mobile toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                updateParams({ search: e.target.value, page: 1 });
              }}
              placeholder="Search by keywords..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-brand-600 focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  updateParams({ search: '' });
                }}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="relative flex-shrink-0">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                updateParams({ sort: e.target.value });
              }}
              className="appearance-none pl-3.5 pr-8 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-full focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden p-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-center flex-shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden md:block md:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Filter className="w-4 h-4 text-brand-600" />
              <span>Filters</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs text-brand-700 hover:text-brand-800 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Graduate Clearance Toggle */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <GraduationCap className="w-4 h-4 text-amber-600" />
                Grad Clearance Only
              </span>
              <input
                type="checkbox"
                checked={graduateClearance}
                onChange={(e) => {
                  setGraduateClearance(e.target.checked);
                  setPage(1);
                  updateParams({ graduateClearance: e.target.checked, page: 1 });
                }}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 rounded"
              />
            </label>
          </div>

          {/* College Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              College / Campus
            </label>
            <select
              value={college}
              onChange={(e) => {
                setCollege(e.target.value);
                setPage(1);
                updateParams({ college: e.target.value, page: 1 });
              }}
              className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-500"
            >
              {collegeList.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Colleges & Universities' : c}</option>
              ))}
            </select>
          </div>

          {/* Categories Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Categories
            </label>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              <button
                onClick={() => {
                  setCategory('All');
                  setPage(1);
                  updateParams({ category: 'All', page: 1 });
                }}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                  category === 'All' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                {category === 'All' && <Check className="w-3.5 h-3.5" />}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setCategory(cat.name);
                    setPage(1);
                    updateParams({ category: cat.name, page: 1 });
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    category === cat.name ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] text-slate-400">({cat.itemCount || 0})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Condition
            </label>
            <div className="flex flex-wrap gap-1.5">
              {conditionList.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCondition(c);
                    setPage(1);
                    updateParams({ condition: c, page: 1 });
                  }}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                    condition === c
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Price Range (₹)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 text-xs p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                setPage(1);
                updateParams({ minPrice, maxPrice, page: 1 });
              }}
              className="w-full mt-2 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Apply Price
            </button>
          </div>

          {/* Availability Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Status
            </label>
            <div className="flex gap-2">
              {['available', 'All'].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatus(s);
                    setPage(1);
                    updateParams({ status: s, page: 1 });
                  }}
                  className={`flex-1 py-1.5 text-xs rounded-xl font-medium transition-colors ${
                    status === s ? 'bg-brand-700 text-white font-bold' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {s === 'available' ? 'Available' : 'All Items'}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* PRODUCT GRID */}
        <div className="md:col-span-3 space-y-6">
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3 animate-pulse">
                  <div className="aspect-[4/3] bg-slate-100 rounded-xl" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-6 bg-slate-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p._id || p.id} product={p} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pt-8 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => {
                      setPage(page - 1);
                      updateParams({ page: page - 1 });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="text-xs font-medium text-slate-600 px-3">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => {
                      setPage(page + 1);
                      updateParams({ page: page + 1 });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
              <PackageOpen className="w-16 h-16 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800">No Listings Match Your Filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing some filter criteria, broadening your price range, or checking another college campus.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-brand-700 text-white rounded-full text-xs font-semibold shadow-md shadow-brand-700/20 hover:bg-brand-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fade-in md:hidden">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">Filters</span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 rounded-full text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Category */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  updateParams({ category: e.target.value, page: 1 });
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Mobile College */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2">College</label>
              <select
                value={college}
                onChange={(e) => {
                  setCollege(e.target.value);
                  updateParams({ college: e.target.value, page: 1 });
                }}
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-xl"
              >
                {collegeList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Close / Apply button */}
            <div className="pt-4 flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 border text-xs font-semibold rounded-xl text-slate-600"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-brand-700 text-white text-xs font-semibold rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
