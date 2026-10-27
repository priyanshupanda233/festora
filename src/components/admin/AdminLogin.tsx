import React, { useState } from 'react';
import { Flame, Lock, User, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { siteConfig } from '../../config/siteConfig';

interface AdminLoginProps {
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToStore }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await login(username.trim(), password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Invalid credentials. Please verify and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-festive-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-glow-md mb-3">
            <div className="w-full h-full bg-festive-dark rounded-[14px] flex items-center justify-center">
              <Flame className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-wide">
            {siteConfig.storeName}
          </h1>
          <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mt-1">
            Catalogue Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-festive-midnight border border-festive-border rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-lg font-bold text-festive-cream mb-6 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Administrator Sign In</span>
          </h2>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter administrator username"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-festive-surface border border-festive-border text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-festive-surface border border-festive-border text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 text-festive-dark font-bold text-sm tracking-wide shadow-glow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-festive-dark border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Access Dashboard</span>
                )}
              </button>
            </div>
          </form>

          {/* Development Setup Hint */}
          <div className="mt-6 pt-5 border-t border-festive-border/60 text-center">
            <p className="text-[11px] text-slate-400">
              Default local credentials configured in <code className="text-amber-300 font-mono">.env</code>:
            </p>
            <p className="text-[11px] text-slate-300 font-mono mt-1">
              Username: <span className="text-amber-400">nrusingha40690</span> | Password: <span className="text-amber-400">nrusingha</span>
            </p>
          </div>
        </div>

        {/* Back to Storefront Link */}
        <div className="text-center mt-6">
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Storefront</span>
          </button>
        </div>

      </div>
    </div>
  );
};
