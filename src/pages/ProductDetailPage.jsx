import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageSquare, 
  Tag, 
  MapPin, 
  ShieldCheck, 
  Share2, 
  Flag, 
  GraduationCap, 
  Clock, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { productService, messageService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import OfferModal from '../components/common/OfferModal';
import ReportModal from '../components/common/ReportModal';
import ProductCard from '../components/common/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await productService.getProductById(id);
        if (res.data?.success) {
          setProduct(res.data.data);
          setSimilar(res.data.similar || []);
          setSelectedImage(0);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[4/3] bg-slate-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/3" />
            <div className="h-10 bg-slate-200 rounded w-3/4" />
            <div className="h-8 bg-slate-200 rounded w-1/4" />
            <div className="h-32 bg-slate-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'This listing might have been removed.'}</p>
        <Link
          to="/marketplace"
          className="inline-block px-6 py-2.5 bg-brand-700 text-white rounded-full text-xs font-semibold shadow-md"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product._id || product.id);
  const seller = product.seller || {};
  const currentUserId = user?._id || user?.id;
  const sellerId = seller._id || seller.id;
  const isOwner = currentUserId && sellerId && currentUserId.toString() === sellerId.toString();

  const selling = Number(product.sellingPrice) || 0;
  const original = Number(product.originalPrice) || 0;
  const savings = Math.max(0, original - selling);
  const discountPercent = original > 0 ? Math.round((savings / original) * 100) : 0;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'];

  // Condition details guide
  const conditionNotes = {
    'Brand New': 'Never used or unopened, in original retail condition with zero signs of wear.',
    'Like New': 'Used briefly for 1-2 semesters with excellent care. Clean pages / fully functional.',
    'Good': 'Gently used with normal cosmetic wear, minor highlighting or small scratches, 100% functional.',
    'Fair': 'Heavy usage but complete and fully usable for college requirements.'
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/product/${product._id}`);
      return;
    }

    try {
      setActionLoading(true);
      const res = await messageService.sendMessage({
        recipientId: sellerId,
        productId: product._id,
        content: `Hi ${seller.fullName || 'there'}, I'm interested in your listing: "${product.title}" listed for ₹${product.sellingPrice}. Is it still available?`
      });

      if (res.data?.success) {
        navigate(`/chat?conv=${res.data.conversationId}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not start conversation.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      const res = await productService.updateStatus(product._id, newStatus);
      if (res.data?.success) {
        setProduct((prev) => ({ ...prev, status: newStatus }));
        setStatusMessage(`Listing marked as ${newStatus}!`);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteListing = async () => {
    if (window.confirm('Are you sure you want to permanently delete this listing?')) {
      try {
        await productService.deleteProduct(product._id);
        navigate('/dashboard?tab=listings');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete listing.');
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this student resale deal on CampusCycle: ${product.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/" className="hover:text-brand-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/marketplace" className="hover:text-brand-700">Marketplace</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-700 truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm relative group">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Condition badge */}
            <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 shadow-md">
              {product.condition}
            </span>

            {/* Graduate ribbon */}
            {product.isGraduateClearance && (
              <span className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-white shadow-md">
                <GraduationCap className="w-4 h-4" />
                <span>Graduate Clearance</span>
              </span>
            )}

            {/* Sold Banner */}
            {product.status && product.status !== 'available' && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                <span className="uppercase text-sm font-black tracking-widest px-4 py-1.5 bg-white text-slate-900 rounded-full shadow-lg">
                  {product.status === 'sold' ? 'Sold Out' : 'Reserved'}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx ? 'border-brand-600 ring-2 ring-brand-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Safety reminder card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>CampusCycle Safety Inspection Reminder</span>
            </p>
            <p className="leading-relaxed">
              Always inspect physical books for missing pages or test electronic gadgets in person at your campus meeting spot before sending money.
            </p>
          </div>
        </div>

        {/* Right Column: Listing Details & Actions (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header & Meta */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 gap-2">
              <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700">
                {product.category}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Posted recently</span>
                </span>
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                  title="Share Listing"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{product.collegeName}</span>
              {product.department && <span>• {product.department}</span>}
            </div>
          </div>

          {/* Price & Savings Box */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Selling Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900">
                    ₹{selling.toLocaleString('en-IN')}
                  </span>
                  {original > selling && (
                    <span className="text-sm text-slate-400 line-through">
                      MRP ₹{original.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {product.isNegotiable && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200">
                  Negotiable Price
                </span>
              )}
            </div>

            {/* Savings callout */}
            {savings > 0 && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 flex items-center justify-between">
                <span className="font-semibold">
                  🎉 You save ₹{savings.toLocaleString('en-IN')} ({discountPercent}%) compared to buying new!
                </span>
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                  Transparent Deal
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Description & Details
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-2xl border border-slate-200/60">
              {product.description}
            </p>
          </div>

          {/* Condition transparency info */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs space-y-1">
            <p className="font-bold text-brand-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Condition: {product.condition}
            </p>
            <p className="text-brand-700/80 leading-normal">
              {conditionNotes[product.condition] || 'Inspected by student seller.'}
            </p>
          </div>

          {/* Preferred Meeting Location on Campus */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Campus Meeting Location</span>
            </div>
            <p className="text-xs text-slate-600">
              {product.meetingLocation || 'Campus Central Library or Student Activity Center'}
            </p>
            <p className="text-[10px] text-slate-400">
              Preferred contact: {product.contactPreference || 'CampusCycle In-App Chat'}
            </p>
          </div>

          {/* Seller Profile Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={seller.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${seller.fullName || 'Student'}`}
                alt={seller.fullName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-slate-900">{seller.fullName || 'Campus Student'}</p>
                  {seller.isCollegeVerified && (
                    <span title="Verified College Student">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{seller.collegeName}</p>
                <p className="text-[11px] text-slate-400">
                  {seller.course} {seller.branch ? `• ${seller.branch}` : ''} ({seller.academicYear})
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Verified Seller
              </span>
            </div>
          </div>

          {/* Status Message Notification */}
          {statusMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {isOwner ? (
              /* Seller Controls */
              <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100 space-y-3">
                <p className="text-xs font-bold text-brand-900">Manage Your Listing</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Link
                    to={`/edit/${product._id}`}
                    className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-brand-500 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Edit3 className="w-4 h-4 text-brand-600" />
                    <span>Edit Details</span>
                  </Link>

                  <button
                    onClick={() => handleStatusChange(product.status === 'sold' ? 'available' : 'sold')}
                    disabled={actionLoading}
                    className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{product.status === 'sold' ? 'Mark Available' : 'Mark as Sold'}</span>
                  </button>

                  <button
                    onClick={handleDeleteListing}
                    className="py-2.5 px-3 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Buyer Controls */
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={handleStartChat}
                    disabled={actionLoading || product.status === 'sold'}
                    className="flex-1 py-3.5 px-4 rounded-2xl bg-brand-700 hover:bg-brand-800 active:scale-95 text-white font-bold text-sm shadow-lg shadow-brand-700/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat with Seller</span>
                  </button>

                  {product.isNegotiable && product.status !== 'sold' && (
                    <button
                      onClick={() => {
                        if (!isAuthenticated) navigate(`/login?redirect=/product/${product._id}`);
                        else setOfferModalOpen(true);
                      }}
                      className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
                    >
                      <Tag className="w-4 h-4" />
                      <span>Make an Offer</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`flex items-center gap-2 text-xs font-semibold py-2 px-4 rounded-xl border transition-all ${
                      isSaved
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    <span>{isSaved ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                  </button>

                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report Listing</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similar.length > 0 && (
        <div className="pt-12 border-t border-slate-200 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Similar Finds</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                More in {product.category}
              </h3>
            </div>
            <Link
              to={`/marketplace?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-semibold text-brand-700 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map((sim) => (
              <ProductCard key={sim._id || sim.id} product={sim} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <OfferModal
        product={product}
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        onOfferSuccess={(createdOffer) => {
          setStatusMessage(`Offer of ₹${createdOffer.offerPrice} sent to seller!`);
          setTimeout(() => setStatusMessage(''), 4000);
        }}
      />

      <ReportModal
        product={product}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}
