import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Recycle, 
  TreePine, 
  TrendingUp, 
  BookOpen, 
  Laptop, 
  Calculator, 
  ShieldCheck, 
  CheckCircle2, 
  Info,
  Scale
} from 'lucide-react';
import { impactService } from '../services/api';

export default function ImpactPage() {
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    impactService.getImpactMetrics()
      .then((res) => {
        if (res.data?.success) setImpact(res.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Leaf className="w-4 h-4 text-emerald-600" />
          <span>Campus Sustainability & Circular Economy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Sustainable Campus Impact Tracker
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Every textbook passed down, every scientific calculator reused, and every lab coat preserved saves student money and prevents unnecessary manufacturing carbon.
        </p>
      </div>

      {/* Aggregate KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <span className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 inline-block mb-1">
            <Recycle className="w-6 h-6" />
          </span>
          <p className="text-3xl sm:text-4xl font-black text-slate-900">
            {impact?.totalListings || 0}
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Items Kept In Circulation</p>
          <p className="text-[11px] text-slate-400">Total university essentials listed and exchanged</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <span className="p-3 rounded-2xl bg-teal-50 text-teal-600 inline-block mb-1">
            <Leaf className="w-6 h-6" />
          </span>
          <p className="text-3xl sm:text-4xl font-black text-emerald-600">
            {impact?.co2SavedKg || 0} kg
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">CO₂e Emissions Prevented</p>
          <p className="text-[11px] text-slate-400">Equivalent to hundreds of miles of campus driving</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <span className="p-3 rounded-2xl bg-indigo-50 text-brand-700 inline-block mb-1">
            <TrendingUp className="w-6 h-6" />
          </span>
          <p className="text-3xl sm:text-4xl font-black text-brand-700">
            ₹{Number(impact?.totalSavingsINR || 0).toLocaleString('en-IN')}
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Student Money Saved</p>
          <p className="text-[11px] text-slate-400">Combined student savings against new retail MRP</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-2">
          <span className="p-3 rounded-2xl bg-amber-50 text-amber-600 inline-block mb-1">
            <TreePine className="w-6 h-6" />
          </span>
          <p className="text-3xl sm:text-4xl font-black text-amber-600">
            {impact?.landfillWasteDivertedKg || 0} kg
          </p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Landfill Waste Diverted</p>
          <p className="text-[11px] text-slate-400">Zero electronic & paper waste dumpings</p>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-50 text-brand-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Textbooks & Notes</h3>
              <p className="text-xs text-slate-400">{impact?.booksReused || 0} items circulated</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Reusing reference books and printed lecture notes avoids virgin wood pulp paper milling and high-energy textbook printing presses.
          </p>
          <div className="pt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl">
            🌱 ~2.5 kg CO₂e saved per book reused
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Electronics & Tools</h3>
              <p className="text-xs text-slate-400">{impact?.electronicsReused || 0} items circulated</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Semiconductor chips in calculators, monitors, and laptops require massive water and mining extraction. Keeping them working avoids e-waste toxicity.
          </p>
          <div className="pt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl">
            ⚡ ~28 kg CO₂e saved per electronic device
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Hostel & Lab Gear</h3>
              <p className="text-xs text-slate-400">{impact?.hostelItemsReused || 0} items circulated</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cotton lab aprons, electric kettles, and drawing drafters are passed to incoming juniors instead of discarded during semester move-outs.
          </p>
          <div className="pt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl">
            💧 ~4.5 kg CO₂e saved per hostel essential
          </div>
        </div>
      </div>

      {/* Transparent Calculation Assumptions */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Info className="w-5 h-5 text-brand-600" />
          <h3>Transparent Calculation Assumptions</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          At CampusCycle, we do not make exaggerated greenwashing claims. Our impact metrics are derived from peer-reviewed Life Cycle Assessment (LCA) environmental benchmarks:
        </p>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
          <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span><strong>Book Factor:</strong> Standard university textbooks contain approx 800 pages. Reusing 1 book prevents 2.5 kg CO₂ emissions and preserves 1.2 kg of forest pulp.</span>
          </li>
          <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span><strong>Electronics Factor:</strong> Silicon fabrication, lithium packaging, and long-range shipping contribute an average of 28.0 kg CO₂e for computing accessories and calculators.</span>
          </li>
          <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span><strong>Financial Savings:</strong> Calculated as the exact verified difference between original retail purchase price and the CampusCycle resale price agreed between students.</span>
          </li>
          <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-slate-200/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span><strong>Landfill Metric:</strong> Average physical mass in kilograms diverted from municipal trash collection during annual campus graduation move-out campaigns.</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
