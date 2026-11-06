import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Sparkles, Tag, GraduationCap, ShieldCheck } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const id = product._id || product.id;
  const isSaved = isInWishlist(id);
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'];
  const primaryImage = images[0];

  // Price & savings calculation
  const selling = Number(product.sellingPrice) || 0;
  const original = Number(product.originalPrice) || 0;
  const discountPercent = original > selling ? Math.round(((original - selling) / original) * 100) : 0;

  // Condition styling
  const conditionStyles = {
    'Brand New': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Like New': 'bg-blue-100 text-blue-800 border-blue-200',
    'Good': 'bg-amber-100 text-amber-800 border-amber-200',
    'Fair': 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const conditionClass = conditionStyles[product.condition] || 'bg-slate-100 text-slate-700 border-slate-200';

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-brand-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <Link to={`/product/${id}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
            }}
          />
        </Link>

        {/* Wishlist Floating Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md active:scale-90 ${
            isSaved
              ? 'bg-rose-500 text-white shadow-rose-500/30'
              : 'bg-white/80 text-slate-600 hover:text-rose-500 hover:bg-white'
          }`}
          title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Condition Badge */}
        <span
          className={`absolute top-2.5 left-2.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shadow-sm backdrop-blur-md ${conditionClass}`}
        >
          {product.condition}
        </span>

        {/* Graduate Clearance Ribbon */}
        {product.isGraduateClearance && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/90 text-white shadow-sm backdrop-blur-sm">
            <GraduationCap className="w-3 h-3" />
            <span>Grad Resale</span>
          </div>
        )}

        {/* Status Overlay (Sold / Reserved) */}
        {product.status && product.status !== 'available' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="uppercase text-xs font-black tracking-widest px-3 py-1 bg-white/90 text-slate-900 rounded-full shadow-lg border border-slate-200">
              {product.status === 'sold' ? 'Sold Out' : 'Reserved'}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & College Meta */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 gap-2">
            <span className="font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded truncate max-w-[150px]">
              {product.category}
            </span>
            <span className="flex items-center gap-1 text-slate-400 truncate max-w-[130px]" title={product.collegeName}>
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="truncate">{product.collegeName || 'Campus'}</span>
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${id}`} className="block">
            <h3 className="font-semibold text-sm sm:text-base text-slate-800 line-clamp-2 group-hover:text-brand-700 transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Savings Block */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900">
                ₹{selling.toLocaleString('en-IN')}
              </span>
              {original > selling && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{original.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <p className="text-[11px] font-semibold text-emerald-600">
                Save {discountPercent}% vs New
              </p>
            )}
          </div>

          <Link
            to={`/product/${id}`}
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
