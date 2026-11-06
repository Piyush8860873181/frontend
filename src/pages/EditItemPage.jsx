import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit3, CheckCircle2, AlertCircle, Trash2, ArrowLeft } from 'lucide-react';
import { productService } from '../services/api';

export default function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('Good');
  const [sellingPrice, setSellingPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [meetingLocation, setMeetingLocation] = useState('');
  const [status, setStatus] = useState('available');
  const [isGraduateClearance, setIsGraduateClearance] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    productService.getProductById(id)
      .then((res) => {
        if (res.data?.success) {
          const p = res.data.data;
          setTitle(p.title || '');
          setCategory(p.category || 'Books & Reference Materials');
          setDescription(p.description || '');
          setCondition(p.condition || 'Good');
          setSellingPrice(p.sellingPrice || '');
          setOriginalPrice(p.originalPrice || '');
          setIsNegotiable(p.isNegotiable !== undefined ? p.isNegotiable : true);
          setMeetingLocation(p.meetingLocation || '');
          setStatus(p.status || 'available');
          setIsGraduateClearance(Boolean(p.isGraduateClearance));
        }
      })
      .catch((err) => setError('Failed to load listing for editing.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      await productService.updateProduct(id, {
        title,
        category,
        description,
        condition,
        sellingPrice: Number(sellingPrice),
        originalPrice: Number(originalPrice),
        isNegotiable,
        meetingLocation,
        status,
        isGraduateClearance
      });
      navigate(`/product/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500">Loading listing details...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">Edit Listing</h1>
          </div>
          <span className="text-xs uppercase font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700">
            {status}
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border rounded-xl"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border rounded-xl"
              >
                {['Brand New', 'Like New', 'Good', 'Fair'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Selling Price (₹)</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Original Price (₹)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold Out</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Campus Meeting Location</label>
            <input
              type="text"
              value={meetingLocation}
              onChange={(e) => setMeetingLocation(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 border rounded-xl text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-brand-700 hover:bg-brand-800 text-white rounded-xl text-xs font-bold shadow-md"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
