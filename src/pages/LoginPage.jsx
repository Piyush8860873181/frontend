import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Recycle, LogIn, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl space-y-6">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-700/20">
              <Recycle className="w-5 h-5" />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to CampusCycle
          </h2>
          <p className="text-xs text-slate-500">
            Log in to buy, sell, chat, and negotiate campus essentials
          </p>
        </div>

        {/* Demo Quick-Fill Buttons */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Instant Demo Logins:</span>
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => fillDemoAccount('aarav@du.ac.in', 'student123')}
              className="py-1.5 px-2 bg-white hover:bg-brand-50 hover:text-brand-700 rounded-xl border border-slate-200 font-semibold text-[11px] transition-colors truncate"
              title="Aarav (Delhi University)"
            >
              DU Student
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('priya@ipu.ac.in', 'student123')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-50 hover:text-emerald-700 rounded-xl border border-slate-200 font-semibold text-[11px] transition-colors truncate"
              title="Priya (IP University)"
            >
              IPU Student
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@campuscycle.edu', 'admin123')}
              className="py-1.5 px-2 bg-white hover:bg-indigo-50 hover:text-indigo-700 rounded-xl border border-slate-200 font-semibold text-[11px] transition-colors truncate"
              title="Dr. Admin (Campus Admin)"
            >
              Admin Portal
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. aarav@du.ac.in"
              required
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <span className="text-[11px] text-brand-700 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-500/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-brand-700 hover:bg-brand-800 active:scale-95 text-white font-bold text-sm shadow-lg shadow-brand-700/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Campus</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have a campus account?{' '}
          <Link to="/register" className="text-brand-700 font-bold hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}
