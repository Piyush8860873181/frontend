import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Recycle, 
  Search, 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Leaf, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Calculator, 
  Laptop, 
  FlaskConical, 
  Home as HomeIcon, 
  Compass, 
  Headphones, 
  PenTool, 
  Package, 
  CheckCircle2,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { productService, categoryService, impactService } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import SafetyBanner from '../components/common/SafetyBanner';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [graduateClearance, setGraduateClearance] = useState([]);
  const [categories, setCategories] = useState([]);
  const [impact, setImpact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const iconMap = {
    BookOpen: BookOpen,
    FileText: BookOpen,
    FlaskConical: FlaskConical,
    Calculator: Calculator,
    Laptop: Laptop,
    Headphones: Headphones,
    Compass: Compass,
    Home: HomeIcon,
    PenTool: PenTool,
    Package: Package,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [highlightsRes, categoriesRes, impactRes] = await Promise.all([
          productService.getHighlights(),
          categoryService.getCategories(),
          impactService.getImpactMetrics(),
        ]);

        if (highlightsRes.data?.success) {
          setFeaturedProducts(highlightsRes.data.data.featured || []);
          setRecentProducts(highlightsRes.data.data.recent || []);
          setGraduateClearance(highlightsRes.data.data.graduateClearance || []);
        }

        if (categoriesRes.data?.success) {
          setCategories(categoriesRes.data.data);
        }

        if (impactRes.data?.success) {
          setImpact(impactRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    let url = '/marketplace?';
    if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;
    if (selectedCollege && selectedCollege !== 'All') url += `college=${encodeURIComponent(selectedCollege)}&`;
    navigate(url);
  };

  const topColleges = [
    'All',
    'Delhi University',
    'IP University',
    'IIT Delhi',
    'Delhi Technological University',
    'BITS Pilani',
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-brand-50/70 via-slate-50 to-slate-50 border-b border-slate-200/60">
        {/* Glow elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-xs">
              <Recycle className="w-4 h-4 text-emerald-600 animate-spin-slow" />
              <span>Campus Circular Economy & Resale</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              One Student's Unused Item, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-indigo-600 to-emerald-600">
                Another Student's Essential.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Buy affordable academic essentials, pass forward lab kits and reference books, and give your unused belongings a second life inside your campus community.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/marketplace"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-700 hover:bg-brand-800 text-white font-semibold text-sm sm:text-base shadow-lg shadow-brand-700/25 hover:shadow-xl hover:shadow-brand-700/35 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/sell"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm sm:text-base border border-slate-300/80 shadow-xs hover:border-brand-300 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Selling</span>
              </Link>
            </div>

            {/* Quick Campus Search Bar */}
            <div className="mt-8 pt-6 max-w-2xl mx-auto">
              <form
                onSubmit={handleSearch}
                className="bg-white p-2 rounded-2xl sm:rounded-full border border-slate-200/90 shadow-lg shadow-slate-200/50 flex flex-col sm:flex-row items-center gap-2"
              >
                <div className="flex items-center flex-1 w-full pl-3">
                  <Search className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Casio calc, lab coats, B.S. Grewal, kettle..."
                    className="w-full py-2 text-sm text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="w-full sm:w-auto flex items-center gap-2">
                  <select
                    value={selectedCollege}
                    onChange={(e) => setSelectedCollege(e.target.value)}
                    className="w-full sm:w-44 text-xs py-2.5 px-3 rounded-xl sm:rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-medium focus:outline-none"
                  >
                    {topColleges.map((c) => (
                      <option key={c} value={c}>{c === 'All' ? 'All Colleges' : c}</option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl sm:rounded-full shadow-md shadow-emerald-600/20 transition-all flex-shrink-0"
                  >
                    Find
                  </button>
                </div>
              </form>
            </div>

            {/* Trust Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Verified College Emails
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                In-App Price Bargaining
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Zero Platform Fees
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Browse by Need</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Popular Academic Categories
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="text-xs sm:text-sm font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Package;
            return (
              <Link
                key={cat.slug || cat.name}
                to={`/marketplace?category=${encodeURIComponent(cat.name)}`}
                className="group p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-brand-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-brand-50 text-slate-600 group-hover:text-brand-700 flex items-center justify-center transition-colors mb-3">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-800 group-hover:text-brand-700 transition-colors line-clamp-1">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {cat.itemCount || 0} listings
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* GRADUATE & RECYCLE CAMPAIGN BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-6 sm:p-10 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
              <GraduationCap className="w-4 h-4" />
              <span>Special Campaign: "Graduate & Recycle"</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Graduating this semester? <br />
              Don't trash your gear — pass it forward.
            </h3>

            <p className="text-sm sm:text-base text-amber-100 leading-relaxed">
              Before leaving campus, list your mini-drafters, textbooks, lab aprons, and kettles together. Help juniors start strong while earning fair value back.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/marketplace?graduateClearance=true"
                className="px-6 py-3 rounded-full bg-white text-amber-800 font-bold text-xs sm:text-sm shadow-md hover:bg-amber-50 active:scale-95 transition-all"
              >
                Browse Grad Clearance Deals
              </Link>
              <Link
                to="/sell"
                className="px-6 py-3 rounded-full bg-black/20 hover:bg-black/30 backdrop-blur-md text-white border border-white/30 font-semibold text-xs sm:text-sm transition-all"
              >
                List Your Clearance Gear
              </Link>
            </div>
          </div>

          <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
            <GraduationCap className="w-80 h-80 text-white" />
          </div>
        </div>
      </section>

      {/* FEATURED GEAR SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Handpicked Deals</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Campus Essentials
            </h2>
          </div>
          <Link
            to="/marketplace"
            className="text-xs sm:text-sm font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>Browse All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </section>

      {/* HOW CAMPUSCYCLE WORKS */}
      <section className="bg-slate-100/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Simple & Safe</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How CampusCycle Works
            </h2>
            <p className="text-sm text-slate-600">
              Four steps from clutter to community reuse in your own college.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <span className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 font-extrabold text-sm flex items-center justify-center mb-4">
                1
              </span>
              <h4 className="font-bold text-base text-slate-900 mb-2">List Unused Items</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Snap 2 photos of your calculator, notes, or lab coat, set your price, and pick a campus spot.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-sm flex items-center justify-center mb-4">
                2
              </span>
              <h4 className="font-bold text-base text-slate-900 mb-2">Chat & Negotiate</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Buyers make counter-offers directly through our built-in negotiation system with real-time chat.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-extrabold text-sm flex items-center justify-center mb-4">
                3
              </span>
              <h4 className="font-bold text-base text-slate-900 mb-2">Safe Campus Meetup</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Meet at the central library, student canteen, or gate during the day to inspect the product.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <span className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 font-extrabold text-sm flex items-center justify-center mb-4">
                4
              </span>
              <h4 className="font-bold text-base text-slate-900 mb-2">Sustainable Cycle</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Seller gets cash, buyer saves up to 70%, and another item stays out of campus landfills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fresh from Dorms</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Recently Listed Items
            </h2>
          </div>
          <Link
            to="/marketplace?sort=newest"
            className="text-xs sm:text-sm font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1 group"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentProducts.slice(0, 8).map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SUSTAINABLE IMPACT TRACKER HIGHLIGHT */}
      {impact && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-4 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                <Leaf className="w-4 h-4" />
                <span>Live Environmental Impact</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Together, CampusCycle Students Have Saved:
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <p className="text-2xl sm:text-4xl font-black text-emerald-400">
                  ₹{Number(impact.totalSavingsINR || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Student Cash Saved</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <p className="text-2xl sm:text-4xl font-black text-teal-400">
                  {impact.co2SavedKg || 0} kg
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">CO₂ Emissions Avoided</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <p className="text-2xl sm:text-4xl font-black text-indigo-400">
                  {impact.booksReused || 0}+
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Textbooks Reused</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <p className="text-2xl sm:text-4xl font-black text-amber-400">
                  {impact.landfillWasteDivertedKg || 0} kg
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Landfill Waste Diverted</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400 relative z-10">
              <p>Transparent environmental assumptions based on verified life-cycle reuse factors.</p>
              <Link to="/impact" className="text-emerald-400 font-semibold hover:underline flex items-center gap-1">
                <span>View Full Methodology & Calculations</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CAMPUS SAFETY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SafetyBanner />
      </section>

      {/* STUDENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Campus Voices</span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            What Fellow Students Are Saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Got my Casio ClassWiz fx-991EX for half the MRP right before semester exams. Met the senior right at North Campus Metro gate!"
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                alt="Priya"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Priya S.</p>
                <p className="text-[10px] text-slate-400">ECE 2nd Year, IP University</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Clearing my dorm as a graduating senior was stressful until I posted my kettle, drafter, and books here. Sold everything within 3 days!"
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
                alt="Aarav"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Aarav P.</p>
                <p className="text-[10px] text-slate-400">CSE 4th Year, Delhi University</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Negotiation via in-app offers felt super transparent. No awkward bargaining on WhatsApp, clean and student-focused."
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Rohan"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Rohan V.</p>
                <p className="text-[10px] text-slate-400">Mech 2nd Year, IIT Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
