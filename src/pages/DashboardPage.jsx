import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Layers, 
  Sparkles, 
  Heart, 
  User, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  MessageSquare, 
  Clock, 
  AlertCircle,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { productService, offerService, authService } from '../services/api';
import ProductCard from '../components/common/ProductCard';

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'listings';

  const { user, updateProfile, verifyCollege } = useAuth();
  const { wishlistProducts, wishlistCount } = useWishlist();

  const [myListings, setMyListings] = useState([]);
  const [offers, setOffers] = useState({ sent: [], received: [] });
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || '');
  const [collegeName, setCollegeName] = useState(user?.collegeName || '');
  const [course, setCourse] = useState(user?.course || 'B.Tech');
  const [branch, setBranch] = useState(user?.branch || '');
  const [academicYear, setAcademicYear] = useState(user?.academicYear || '3rd Year');
  const [bio, setBio] = useState(user?.bio || '');
  const [profileMsg, setProfileMsg] = useState('');

  // Counter offer state
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [counterPriceInput, setCounterPriceInput] = useState('');
  const [counterNote, setCounterNote] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listingsRes, offersRes] = await Promise.all([
        productService.getMyListings(),
        offerService.getMyOffers(),
      ]);

      if (listingsRes.data?.success) setMyListings(listingsRes.data.data);
      if (offersRes.data?.success) setOffers(offersRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const handleRespondOffer = async (offerId, action, counterPrice = null, message = '') => {
    try {
      const res = await offerService.respondToOffer(offerId, {
        action,
        counterPrice: counterPrice ? Number(counterPrice) : null,
        message,
      });

      if (res.data?.success) {
        fetchData();
        setCounterModalOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update offer.');
    }
  };

  const handleToggleProductStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === 'sold' ? 'available' : 'sold';
    try {
      await productService.updateStatus(productId, newStatus);
      setMyListings(prev => prev.map(p => p._id === productId ? { ...p, status: newStatus } : p));
    } catch (err) {
      alert('Failed to update product status.');
    }
  };

  const handleDeleteListing = async (productId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await productService.deleteProduct(productId);
        setMyListings(prev => prev.filter(p => p._id !== productId));
      } catch (err) {
        alert('Failed to delete listing.');
      }
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        fullName,
        contactNumber,
        collegeName,
        course,
        branch,
        academicYear,
        bio,
      });
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileMsg('Failed to update profile.');
    }
  };

  const handleCampusVerify = async () => {
    try {
      await verifyCollege({});
      alert('Congratulations! Your campus student identity is verified.');
    } catch (err) {
      alert('Verification failed.');
    }
  };

  const activeCount = myListings.filter(p => p.status === 'available').length;
  const soldCount = myListings.filter(p => p.status === 'sold').length;
  const pendingOffersCount = offers.received.filter(o => o.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName || 'User'}`}
            alt={user?.fullName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-emerald-500/20 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {user?.fullName}
              </h1>
              {user?.isCollegeVerified ? (
                <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Student
                </span>
              ) : (
                <button
                  onClick={handleCampusVerify}
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200"
                >
                  Verify Campus Badge
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {user?.collegeName} • {user?.branch || user?.course} ({user?.academicYear})
            </p>
            <p className="text-xs text-slate-400 italic">"{user?.bio}"</p>
          </div>
        </div>

        <Link
          to="/sell"
          className="px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Item</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{activeCount}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Active Listings</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{soldCount}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Items Reused / Sold</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-700">{pendingOffersCount}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Pending Inquiries/Offers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-2xl sm:text-3xl font-extrabold text-rose-500">{wishlistCount}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Saved in Wishlist</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex gap-2 sm:gap-6 overflow-x-auto pb-1">
        {[
          { id: 'listings', label: 'My Listings', icon: Layers, count: myListings.length },
          { id: 'offers', label: 'Offers & Negotiations', icon: Sparkles, count: offers.received.length + offers.sent.length },
          { id: 'wishlist', label: 'My Wishlist', icon: Heart, count: wishlistCount },
          { id: 'profile', label: 'Campus Profile & Settings', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`pb-3 px-2 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all flex-shrink-0 ${
                active
                  ? 'border-brand-700 text-brand-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-brand-100 text-brand-800' : 'bg-slate-100 text-slate-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: MY LISTINGS */}
      {currentTab === 'listings' && (
        <div className="space-y-6">
          {myListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.map((item) => (
                <div key={item._id} className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100">
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        item.status === 'sold' ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>{item.category}</span>
                        <span>{item.viewsCount || 0} views</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.title}</h4>
                      <p className="text-base font-extrabold text-slate-900 mt-1">₹{item.sellingPrice}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/product/${item._id}`}
                      className="p-2 text-slate-500 hover:text-brand-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                      title="View public listing"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>

                    <Link
                      to={`/edit/${item._id}`}
                      className="p-2 text-slate-500 hover:text-brand-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1"
                      title="Edit listing"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>

                    <button
                      onClick={() => handleToggleProductStatus(item._id, item.status)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                        item.status === 'sold'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {item.status === 'sold' ? 'Relist' : 'Mark Sold'}
                    </button>

                    <button
                      onClick={() => handleDeleteListing(item._id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                      title="Delete listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <Layers className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">No Listings Yet</h3>
              <p className="text-xs text-slate-500">Sell your unused textbooks, drafters, or electronics to students.</p>
              <Link
                to="/sell"
                className="inline-block mt-2 px-6 py-2.5 bg-emerald-600 text-white rounded-full text-xs font-semibold shadow-md"
              >
                Post Your First Listing
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: OFFERS & NEGOTIATIONS */}
      {currentTab === 'offers' && (
        <div className="space-y-8">
          
          {/* Received Offers */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Offers Received From Buyers</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                {offers.received.length}
              </span>
            </h3>

            {offers.received.length > 0 ? (
              <div className="space-y-3">
                {offers.received.map((offer) => {
                  const product = offer.product || {};
                  const buyer = offer.buyer || {};
                  return (
                    <div key={offer._id} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
                          alt={product.title}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="space-y-0.5">
                          <Link to={`/product/${product._id}`} className="text-xs font-bold text-slate-800 hover:text-brand-700 line-clamp-1">
                            {product.title}
                          </Link>
                          <p className="text-xs text-slate-500">
                            From: <span className="font-semibold text-slate-800">{buyer.fullName || 'Student'}</span> ({buyer.collegeName || 'Campus'})
                          </p>
                          <div className="flex items-center gap-3 pt-0.5">
                            <span className="text-xs text-slate-400">Listed: ₹{offer.originalPrice}</span>
                            <span className="text-sm font-extrabold text-brand-700">Offer: ₹{offer.offerPrice}</span>
                            {offer.counterPrice && (
                              <span className="text-xs font-bold text-amber-600">Counter: ₹{offer.counterPrice}</span>
                            )}
                          </div>
                          {offer.message && (
                            <p className="text-[11px] text-slate-500 italic">"{offer.message}"</p>
                          )}
                        </div>
                      </div>

                      {/* Status & Action */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {offer.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleRespondOffer(offer._id, 'accept')}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOffer(offer);
                                setCounterPriceInput(Math.round((offer.originalPrice + offer.offerPrice) / 2));
                                setCounterModalOpen(true);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-semibold"
                            >
                              Counter
                            </button>
                            <button
                              onClick={() => handleRespondOffer(offer._id, 'reject')}
                              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold"
                            >
                              Decline
                            </button>
                          </>
                        ) : (
                          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                            offer.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                            offer.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {offer.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 bg-white p-6 rounded-2xl border text-center">
                No received offers at this moment.
              </p>
            )}
          </div>

          {/* Sent Offers */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Offers You Sent to Sellers</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                {offers.sent.length}
              </span>
            </h3>

            {offers.sent.length > 0 ? (
              <div className="space-y-3">
                {offers.sent.map((offer) => {
                  const product = offer.product || {};
                  return (
                    <div key={offer._id} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
                          alt={product.title}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <Link to={`/product/${product._id}`} className="text-xs font-bold text-slate-800 hover:underline line-clamp-1">
                            {product.title}
                          </Link>
                          <div className="flex items-center gap-3 text-xs mt-0.5">
                            <span className="text-slate-400">Listed: ₹{offer.originalPrice}</span>
                            <span className="font-bold text-brand-700">Your Offer: ₹{offer.offerPrice}</span>
                            {offer.counterPrice && (
                              <span className="font-bold text-amber-600">Seller Countered: ₹{offer.counterPrice}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                          offer.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          offer.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          offer.status === 'countered' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {offer.status}
                        </span>

                        <Link
                          to="/chat"
                          className="p-2 text-slate-400 hover:text-brand-700 hover:bg-slate-50 rounded-xl"
                          title="Open chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 bg-white p-6 rounded-2xl border text-center">
                You haven't made any offers yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: MY WISHLIST */}
      {currentTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-800">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500">Click the heart button on any item in the marketplace to save it here.</p>
              <Link
                to="/marketplace"
                className="inline-block mt-2 px-6 py-2.5 bg-brand-700 text-white rounded-full text-xs font-semibold shadow-md"
              >
                Explore Marketplace
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: PROFILE SETTINGS */}
      {currentTab === 'profile' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs max-w-2xl">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Campus Student Profile
          </h3>

          {profileMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{profileMsg}</span>
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">College / University</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+91..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Course</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Branch / Dept</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Academic Year</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year (Graduating)">4th Year (Graduating)</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Bio / Campus Intro</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Counter Offer Modal */}
      {counterModalOpen && selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-slate-900">Send Counter-Offer</h3>
            <p className="text-xs text-slate-500">
              Buyer offered <span className="font-bold text-slate-800">₹{selectedOffer.offerPrice}</span> for {selectedOffer.product?.title} (Listed at ₹{selectedOffer.originalPrice}).
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Counter Price (₹)</label>
              <input
                type="number"
                value={counterPriceInput}
                onChange={(e) => setCounterPriceInput(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Note (Optional)</label>
              <input
                type="text"
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                placeholder="Can meet halfway at ₹..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border rounded-xl"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCounterModalOpen(false)}
                className="flex-1 py-2 text-xs border rounded-xl text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRespondOffer(selectedOffer._id, 'counter', counterPriceInput, counterNote)}
                className="flex-1 py-2 text-xs bg-brand-700 text-white rounded-xl font-bold"
              >
                Send Counter
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
