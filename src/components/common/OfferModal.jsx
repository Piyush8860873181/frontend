import React, { useState } from 'react';
import { X, Tag, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { offerService } from '../../services/api';
import confetti from 'canvas-confetti';

export default function OfferModal({ product, isOpen, onClose, onOfferSuccess }) {
  if (!isOpen || !product) return null;

  const listedPrice = Number(product.sellingPrice) || 0;
  const [offerPrice, setOfferPrice] = useState(Math.round(listedPrice * 0.85)); // Default 15% discount
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Quick discount chips
  const applyDiscount = (percent) => {
    const discounted = Math.round(listedPrice * (1 - percent / 100));
    setOfferPrice(discounted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (offerPrice <= 0) {
      setError('Please enter a valid offer price.');
      return;
    }

    if (offerPrice >= listedPrice) {
      setError(`Your offer must be lower than the listed price (₹${listedPrice}).`);
      return;
    }

    try {
      setLoading(true);
      const res = await offerService.createOffer({
        productId: product._id || product.id,
        offerPrice: Number(offerPrice),
        message: message.trim() || `Offer submitted: ₹${offerPrice} for ${product.title}`,
      });

      if (res.data?.success) {
        setSuccess(true);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch {}
        if (onOfferSuccess) onOfferSuccess(res.data.data);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 1800);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit offer.');
    } finally {
      setLoading(false);
    }
  };

  const discountAmount = Math.max(0, listedPrice - offerPrice);
  const discountPercent = listedPrice > 0 ? Math.round((discountAmount / listedPrice) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
            <Sparkles className="w-5 h-5 text-brand-600" />
            <span>Make an Offer</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Product Summary */}
          <div className="flex gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
              alt={product.title}
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 line-clamp-1">{product.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">Listed Price: <span className="font-bold text-slate-900">₹{listedPrice}</span></p>
              <p className="text-[11px] text-slate-400 truncate">Seller: {product.seller?.fullName || 'Campus Student'}</p>
            </div>
          </div>

          {success ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="font-bold text-lg text-slate-900">Offer Sent to Seller!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                The seller has been notified. You can review negotiations in your Dashboard or Chat.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Offer Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Proposed Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-400 font-bold text-lg">₹</span>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    min={1}
                    max={listedPrice - 1}
                    className="w-full pl-9 pr-4 py-3 text-lg font-bold text-slate-900 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10"
                    placeholder="Enter amount"
                    required
                  />
                  {discountPercent > 0 && (
                    <span className="absolute right-3.5 top-3.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      -{discountPercent}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Preset Discount Chips */}
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-2">Quick discount presets:</p>
                <div className="flex gap-2">
                  {[10, 15, 20, 25].map((percent) => (
                    <button
                      key={percent}
                      type="button"
                      onClick={() => applyDiscount(percent)}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-slate-700 hover:text-brand-700 transition-all"
                    >
                      -{percent}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Note to Seller */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Message to Seller (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Can meet you today at the Library lawn with cash/UPI!"
                  rows={2}
                  className="w-full px-3.5 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-500/10 resize-none"
                />
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 active:scale-95 text-xs font-semibold text-white shadow-md shadow-brand-700/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Tag className="w-4 h-4" />
                      <span>Send Offer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
