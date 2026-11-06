import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  UploadCloud, 
  Trash2, 
  Sparkles, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  Image as ImageIcon 
} from 'lucide-react';
import { productService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

export default function SellItemPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Books & Reference Materials');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Good');
  const [sellingPrice, setSellingPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [department, setDepartment] = useState(user?.branch || '');
  const [meetingLocation, setMeetingLocation] = useState('Campus Central Library or Student Activity Center');
  const [contactPreference, setContactPreference] = useState('In-App Chat');
  const [isGraduateClearance, setIsGraduateClearance] = useState(false);
  
  // Image handling
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedPresetImage, setSelectedPresetImage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Books & Reference Materials',
    'Notes & Study Materials',
    'Lab Equipment & Lab Coats',
    'Scientific Calculators',
    'Laptops & Computers',
    'Electronics & Accessories',
    'Engineering & Drawing Tools',
    'Hostel Essentials',
    'Stationery',
    'Others'
  ];

  const conditions = [
    { label: 'Brand New', desc: 'Unopened, pristine packaging or never used' },
    { label: 'Like New', desc: 'Used for 1 semester, flawless condition' },
    { label: 'Good', desc: 'Normal cosmetic wear, 100% fully functional' },
    { label: 'Fair', desc: 'Visible wear/tear, but totally usable' },
  ];

  // Presets for student testing without file picking
  const presetPhotos = [
    { label: 'Scientific Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80' },
    { label: 'Engineering Drafter', url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80' },
    { label: 'CS Textbook', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80' },
    { label: 'White Lab Coat', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80' },
    { label: 'Electric Kettle', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80' },
    { label: 'Study Lamp', url: 'https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=600&auto=format&fit=crop&q=80' },
  ];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectPreset = (url) => {
    setSelectedPresetImage(url);
    setImagePreviews((prev) => [...prev, url]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !sellingPrice) {
      setError('Please provide at least a title and selling price.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('description', description.trim());
      formData.append('condition', condition);
      formData.append('sellingPrice', sellingPrice);
      if (originalPrice) formData.append('originalPrice', originalPrice);
      formData.append('isNegotiable', isNegotiable);
      formData.append('department', department);
      formData.append('meetingLocation', meetingLocation);
      formData.append('contactPreference', contactPreference);
      formData.append('isGraduateClearance', isGraduateClearance);

      // Append image files if any
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      // If preset image selected or no files uploaded, append string images
      if (imageFiles.length === 0 && imagePreviews.length > 0) {
        imagePreviews.forEach((url) => {
          formData.append('images', url);
        });
      }

      const res = await productService.createProduct(formData);

      if (res.data?.success) {
        try {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch {}

        navigate(`/product/${res.data.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to list product.');
    } finally {
      setLoading(false);
    }
  };

  const numSelling = Number(sellingPrice) || 0;
  const numOriginal = Number(originalPrice) || 0;
  const savingsPct = (numOriginal > numSelling && numOriginal > 0)
    ? Math.round(((numOriginal - numSelling) / numOriginal) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
            <PlusCircle className="w-4 h-4" />
            <span>Campus ReUse Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            List an Item for Resale
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Give your textbooks, calculators, lab gear, and room essentials a second life among college peers.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Casio fx-991EX ClassWiz Calculator or Weiss C++ DSA Book"
              required
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-brand-600"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3.5 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-brand-600"
              >
                {conditions.map((c) => (
                  <option key={c.label} value={c.label}>{c.label} ({c.desc})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Savings */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Price & Valuation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Selling Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="e.g. 750"
                    min={1}
                    required
                    className="w-full pl-8 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Original Purchase Price / MRP (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="e.g. 1750"
                    min={1}
                    className="w-full pl-8 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-600"
                  />
                </div>
              </div>
            </div>

            {savingsPct > 0 && (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-between">
                <span>Buyer saves ₹{numOriginal - numSelling} ({savingsPct}%) compared to brand new!</span>
                <span className="text-[10px] uppercase font-bold bg-emerald-200 px-2 py-0.5 rounded">Great student deal</span>
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isNegotiable}
                onChange={(e) => setIsNegotiable(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <span className="text-xs font-medium text-slate-700">
                Allow buyers to make counter-offers below this price
              </span>
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description & Specifications *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the edition of book, semester used, battery health, notes included, any markings, or reasons for selling..."
              required
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-brand-600"
            />
          </div>

          {/* Image Uploads */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Product Photos
            </label>

            {/* Drag & drop file picker */}
            <label className="border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-brand-50/20 transition-all">
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                Click to upload images from your device
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Preset Photo quick selector */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-slate-500 mb-2">
                Or select a preset student gear photo for quick demo testing:
              </p>
              <div className="flex flex-wrap gap-2">
                {presetPhotos.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-brand-50 text-[11px] font-medium text-slate-700 transition-colors"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Previews */}
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-3">
                {imagePreviews.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                    <img src={img} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Campus Meeting Spot & Preferences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Preferred Campus Meeting Spot
              </label>
              <input
                type="text"
                value={meetingLocation}
                onChange={(e) => setMeetingLocation(e.target.value)}
                placeholder="e.g. Central Library Lawn, Tech Block Canteen"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Contact Preference
              </label>
              <select
                value={contactPreference}
                onChange={(e) => setContactPreference(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
              >
                <option value="In-App Chat">CampusCycle In-App Chat</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Phone">Phone Call</option>
              </select>
            </div>
          </div>

          {/* Graduate Clearance Checkbox */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isGraduateClearance}
                onChange={(e) => setIsGraduateClearance(e.target.checked)}
                className="w-5 h-5 text-amber-600 rounded mt-0.5"
              />
              <div>
                <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                  <span>Highlight as "Graduate & Recycle" Clearance</span>
                </p>
                <p className="text-[11px] text-amber-800/80 mt-0.5">
                  Check this if you are graduating or relocating from campus and offering a clearance discount for incoming juniors.
                </p>
              </div>
            </label>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Listing on CampusCycle</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
