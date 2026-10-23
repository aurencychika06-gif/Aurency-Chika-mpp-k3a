import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Ship,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  X
} from 'lucide-react';
import { maritimeService } from '../services/dataService';
import { AdminUser } from '../types/maritime';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AdminUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [identifier, setIdentifier] = useState('admin@maritim.id');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = maritimeService.login(identifier, password);
      setTimeout(() => {
        setIsLoading(false);
        onSuccess(user);
        onClose();
      }, 300);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Login gagal. Cek kembali username/email dan password.');
    }
  };

  const handleQuickFill = (role: 'admin' | 'operator' | 'kasir') => {
    setError(null);
    if (role === 'admin') {
      setIdentifier('admin@maritim.id');
      setPassword('admin123');
    } else if (role === 'operator') {
      setIdentifier('operator@maritim.id');
      setPassword('operator123');
    } else {
      setIdentifier('kasir@maritim.id');
      setPassword('kasir123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-3 border border-white/20">
            <Ship className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Portal Otoritas Pelabuhan</h2>
          <p className="text-xs text-white/80 mt-1">
            Autentikasi Petugas & Administrator Sistem Muatan Kapal
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username atau Email Admin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Contoh: admin@maritim.id atau admin"
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl pl-9 pr-10 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {isLoading ? 'Memverifikasi...' : 'Masuk ke Sistem Pelabuhan'}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                Akun Demo Cepat (Klik untuk Isi):
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition group"
              >
                <p className="text-[11px] font-bold text-slate-200 group-hover:text-cyan-400">Super Admin</p>
                <p className="text-[10px] text-slate-500">admin123</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('operator')}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition group"
              >
                <p className="text-[11px] font-bold text-slate-200 group-hover:text-cyan-400">Operator</p>
                <p className="text-[10px] text-slate-500">operator123</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('kasir')}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition group"
              >
                <p className="text-[11px] font-bold text-slate-200 group-hover:text-cyan-400">Kasir Tiket</p>
                <p className="text-[10px] text-slate-500">kasir123</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
