import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';

export default function WishlistPage() {
  const { wishlistProducts, wishlistCount, loading } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold mb-2">
            <Heart className="w-4 h-4 fill-current" />
            <span>Saved Academic Essentials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Campus Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep track of textbooks, calculators, and tools you're interested in buying.
          </p>
        </div>

        <span className="text-sm font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-2xl border">
          {wishlistCount} Saved Items
        </span>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400">Loading your wishlist...</div>
      ) : wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 space-y-4">
          <Heart className="w-16 h-16 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Save products while browsing the marketplace to compare conditions and prices before making an offer.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="inline-block px-6 py-2.5 bg-brand-700 text-white rounded-full text-xs font-semibold shadow-md shadow-brand-700/20 hover:bg-brand-800 transition-colors"
          >
            Explore Marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
