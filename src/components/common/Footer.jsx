import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Heart, Shield, Sparkles, MapPin, ExternalLink, Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-500 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Campus<span className="text-emerald-400">Cycle</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              "One Student's Unused Item, Another Student's Essential."
              A student-exclusive marketplace designed to keep college essentials in circulation, promote circular economy, and make higher education affordable for all.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-medium">
                <Leaf className="w-3.5 h-3.5" />
                <span>100% Student ReUse Driven</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Safe Campus Meetups</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/marketplace" className="hover:text-emerald-400 transition-colors">
                  All Listings
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Books+%26+Reference+Materials" className="hover:text-emerald-400 transition-colors">
                  Textbooks & Guides
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Scientific+Calculators" className="hover:text-emerald-400 transition-colors">
                  Scientific Calculators
                </Link>
              </li>
              <li>
                <Link to="/marketplace?category=Engineering+%26+Drawing+Tools" className="hover:text-emerald-400 transition-colors">
                  Engineering Drafters
                </Link>
              </li>
              <li>
                <Link to="/marketplace?graduateClearance=true" className="hover:text-emerald-400 transition-colors text-amber-300">
                  Graduate Clearance
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Hub */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Student Hub
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/sell" className="hover:text-emerald-400 transition-colors">
                  List Your Items
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/chat" className="hover:text-emerald-400 transition-colors">
                  Chat & Bargain
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-emerald-400 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-emerald-400 transition-colors">
                  Campus Eco Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Safety */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Campus Safety
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 space-y-2">
              <p className="flex items-center gap-1.5 font-medium text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                Verified Guidelines
              </p>
              <p className="text-slate-400 leading-normal">
                Always meet inside campus libraries, cafeteria commons, or main gates during daylight. Inspect items before concluding payment.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} CampusCycle Inc. Built for student sustainability & campus communities.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Community Honor Code</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
