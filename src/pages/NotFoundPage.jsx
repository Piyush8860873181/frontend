import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-700 flex items-center justify-center">
        <Recycle className="w-8 h-8 animate-spin-slow" />
      </div>
      <h1 className="text-4xl font-black text-slate-900">404</h1>
      <p className="text-base font-semibold text-slate-700">Campus Page Not Found</p>
      <p className="text-xs text-slate-400 max-w-sm">
        The link you clicked might be broken or the listing was archived.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-700 text-white text-xs font-bold shadow-md hover:bg-brand-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Marketplace</span>
      </Link>
    </div>
  );
}
