import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Recycle, 
  Search, 
  Heart, 
  MessageSquare, 
  PlusCircle, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X, 
  Sparkles, 
  Layers, 
  GraduationCap,
  Leaf
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-700/20 group-hover:scale-105 transition-transform">
              <Recycle className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                  Campus<span className="text-emerald-600">Cycle</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 hidden sm:inline-block">
                  Campus ReUse
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                Student Resale Marketplace
              </p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex flex-1 max-w-md items-center relative"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, calculators, lab coats, kettles..."
              className="w-full pl-10 pr-20 py-2.5 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 rounded-full border border-transparent focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 text-xs font-semibold bg-brand-700 text-white rounded-full hover:bg-brand-800 transition-colors shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600">
            <Link 
              to="/marketplace" 
              className={`hover:text-brand-700 transition-colors flex items-center gap-1.5 ${isActive('/marketplace') ? 'text-brand-700 font-semibold' : ''}`}
            >
              <Layers className="w-4 h-4 text-brand-600" />
              Explore
            </Link>
            <Link 
              to="/marketplace?graduateClearance=true" 
              className="hover:text-brand-700 transition-colors flex items-center gap-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200"
            >
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>Graduate & Recycle</span>
            </Link>
            <Link 
              to="/impact" 
              className={`hover:text-brand-700 transition-colors flex items-center gap-1.5 ${isActive('/impact') ? 'text-emerald-700 font-semibold' : ''}`}
            >
              <Leaf className="w-4 h-4 text-emerald-600" />
              Eco Impact
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist button */}
            <Link
              to="/wishlist"
              className="p-2 sm:p-2.5 rounded-full text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors relative"
              title="Saved Items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-rose-500 text-white rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Messages Chat button */}
            {isAuthenticated && (
              <Link
                to="/chat"
                className="p-2 sm:p-2.5 rounded-full text-slate-600 hover:text-brand-700 hover:bg-brand-50 transition-colors relative"
                title="Messages & Negotiations"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
              </Link>
            )}

            {/* Sell Item CTA */}
            <Link
              to={isAuthenticated ? "/sell" : "/login?redirect=/sell"}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Sell Item</span>
            </Link>

            {/* Auth Dropdown or Login Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full border border-slate-200 hover:border-brand-300 hover:bg-slate-50 transition-all text-left"
                >
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName || 'User'}`}
                    alt={user?.fullName}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
                  />
                  <div className="hidden xl:block text-xs">
                    <p className="font-semibold text-slate-800 leading-tight truncate max-w-[100px]">
                      {user?.fullName?.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[100px]">
                      {user?.collegeName?.split(' ')[0]}
                    </p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in divide-y divide-slate-100">
                      <div className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-slate-900 truncate">
                            {user?.fullName}
                          </p>
                          {user?.isCollegeVerified && (
                            <span title="Verified Campus Student">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-100 truncate max-w-full">
                          {user?.collegeName}
                        </span>
                      </div>

                      <div className="py-1 text-sm font-medium text-slate-700">
                        <Link
                          to="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 hover:text-brand-700 transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Student Dashboard
                        </Link>
                        <Link
                          to="/dashboard?tab=listings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 hover:text-brand-700 transition-colors"
                        >
                          <Layers className="w-4 h-4 text-slate-400" />
                          My Listings
                        </Link>
                        <Link
                          to="/dashboard?tab=offers"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 hover:text-brand-700 transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-slate-400" />
                          Negotiations & Offers
                        </Link>
                        <Link
                          to="/chat"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 hover:text-brand-700 transition-colors"
                        >
                          <MessageSquare className="w-4 h-4 text-slate-400" />
                          Chat Inbox
                        </Link>
                        
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 hover:bg-indigo-50 text-indigo-700 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-indigo-600" />
                            Admin Moderation Portal
                          </Link>
                        )}
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium text-left"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-brand-700 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-full border border-brand-200 transition-colors hidden sm:block"
                >
                  Join Campus
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campus gear..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 text-slate-800 rounded-full border border-transparent focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-slate-700 font-medium text-sm hover:text-brand-700"
          >
            <Layers className="w-4 h-4 text-brand-600" />
            Explore Marketplace
          </Link>
          <Link
            to="/marketplace?graduateClearance=true"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-amber-700 font-medium text-sm hover:text-amber-800"
          >
            <GraduationCap className="w-4 h-4 text-amber-600" />
            Graduate & Recycle Deals
          </Link>
          <Link
            to="/impact"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-emerald-700 font-medium text-sm hover:text-emerald-800"
          >
            <Leaf className="w-4 h-4 text-emerald-600" />
            Sustainable Impact Tracker
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-slate-700 font-medium text-sm hover:text-brand-700"
              >
                <User className="w-4 h-4 text-slate-500" />
                Student Dashboard
              </Link>
              <Link
                to="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-slate-700 font-medium text-sm hover:text-brand-700"
              >
                <MessageSquare className="w-4 h-4 text-slate-500" />
                Messages & Offers
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-indigo-700 font-medium text-sm hover:text-indigo-800"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Admin Portal
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}
