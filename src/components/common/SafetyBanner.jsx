import React from 'react';
import { ShieldCheck, MapPin, Eye, AlertCircle } from 'lucide-react';

export default function SafetyBanner() {
  return (
    <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-brand-500/10 border border-emerald-200/60 rounded-3xl p-6 sm:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              CampusCycle Safety & Honor Code
            </h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every transaction takes place student-to-student. For a smooth and trustworthy experience, always follow these simple campus rules:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
          <div className="flex items-center gap-3 bg-white/80 p-3 rounded-2xl border border-emerald-100 shadow-xs">
            <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-slate-800">Public Campus Spots</p>
              <p className="text-slate-500">Meet in libraries or student centers</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/80 p-3 rounded-2xl border border-emerald-100 shadow-xs">
            <Eye className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-slate-800">Inspect Before Paying</p>
              <p className="text-slate-500">Test calculators, check textbook pages</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/80 p-3 rounded-2xl border border-emerald-100 shadow-xs">
            <AlertCircle className="w-5 h-5 text-brand-600 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-slate-800">Direct Student UPI/Cash</p>
              <p className="text-slate-500">Never send money to unverified third parties</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
