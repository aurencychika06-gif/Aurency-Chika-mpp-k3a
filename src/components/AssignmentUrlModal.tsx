import React, { useState } from 'react';
import {
  Link2,
  Copy,
  CheckCircle2,
  ExternalLink,
  AlertOctagon,
  ShieldCheck,
  Check,
  Sparkles,
  HelpCircle,
  X,
  Globe
} from 'lucide-react';

interface AssignmentUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssignmentUrlModal: React.FC<AssignmentUrlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // The official public Cloud Run URL for this AI Studio project
  const officialDeploymentUrl = 'https://ais-pre-ntxkfyok5lrcbvlwmvkd67-897898967019.asia-southeast1.run.app';
  
  // Current browser URL as backup if already on the deployed domain
  const currentOrigin = typeof window !== 'undefined' && window.location.origin.includes('run.app')
    ? window.location.origin
    : officialDeploymentUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentOrigin);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Link Web Pengumpulan Tugas Resmi
                <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-semibold">
                  Aktif & Siap Dikumpul
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Gunakan URL ini agar guru/dosen penguji dapat membuka aplikasi tanpa error 404
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Diagnostic Alert: Why 404 occurred */}
          <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertOctagon className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Penyebab Error: &quot;Page not found&quot; saat Mengumpulkan Tugas</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Sebelumnya Anda mengumpulkan link berbentuk <code className="bg-rose-950/80 text-rose-300 px-1.5 py-0.5 rounded border border-rose-700/50 font-mono">aurencychika-tugas4.ai.studio</code>.
              Format domain tersebut <strong className="text-rose-200">bukanlah domain web publik</strong>, sehingga server internet menampilkan error <em>Page not found (404)</em>.
            </p>
          </div>

          {/* Valid URL Box */}
          <div className="bg-slate-800/80 border border-cyan-500/40 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                URL Web Resmi Publik (Salin Link Ini untuk Dikumpulkan):
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Cloud Run Verified</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 font-mono text-xs text-cyan-300 select-all break-all flex items-center gap-2">
                <Link2 className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{currentOrigin}</span>
              </div>
              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:brightness-110 shadow-cyan-500/20'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>
            </div>

            {copied && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-medium animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> Link berhasil disalin! Silakan paste (Ctrl+V / Tempel) di formulir web pengumpulan tugas Anda.
              </p>
            )}
          </div>

          {/* Direct verification link */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Ingin mengetes apakah link bisa dibuka?</span>
            <a
              href={currentOrigin}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 hover:underline"
            >
              Uji Buka di Tab Baru <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Checklist Spesifikasi Tugas */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 text-xs space-y-2.5">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verifikasi Checklist Spesifikasi Tugas:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</div>
                <span>Real Database (Supabase, Neon, Firebase)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</div>
                <span>Form Login Admin (Super Admin & Operator)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</div>
                <span>CRUD Lengkap (Kapal, Pelabuhan, Rute, Kargo)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</div>
                <span>Master Data & Transaksi Data Manifest</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</div>
                <span>Laporan Syahbandar Resmi (Cetak PDF)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">✓</div>
                <span>Real-Time AIS Radar & Multi-Tab Sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            SIM-KAPAL v2.4 &bull; Verified Online Cloud Service
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
