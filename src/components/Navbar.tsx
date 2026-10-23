import React from 'react';
import {
  Ship,
  Anchor,
  Database,
  UserCheck,
  LogOut,
  ShieldAlert,
  Radio,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Link2,
  Globe
} from 'lucide-react';
import { AdminUser, DatabaseProvider } from '../types/maritime';

interface NavbarProps {
  currentUser: AdminUser | null;
  activeTab: 'dashboard' | 'master' | 'transaksi' | 'laporan' | 'database';
  setActiveTab: (tab: 'dashboard' | 'master' | 'transaksi' | 'laporan' | 'database') => void;
  activeDbProvider: DatabaseProvider;
  onLogout: () => void;
  onOpenLogin: () => void;
  onSwitchRole: (role: 'super_admin' | 'operator_pelabuhan' | 'kasir_tiket') => void;
  onResetData: () => void;
  onOpenAssignmentModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  activeDbProvider,
  onLogout,
  onOpenLogin,
  onSwitchRole,
  onResetData,
  onOpenAssignmentModal,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const getDbBadge = () => {
    switch (activeDbProvider) {
      case 'supabase':
        return { label: 'Supabase DB', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'neon':
        return { label: 'Neon PostgreSQL', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
      case 'firebase':
        return { label: 'Firebase Firestore', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      default:
        return { label: 'Database Server (Live)', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
    }
  };

  const dbBadge = getDbBadge();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Banner with Vessel Monitoring Alert */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-cyan-950 px-4 py-1.5 border-b border-blue-900/40 text-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400 font-medium">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            VTS & AIS Radar Pelabuhan: AKTIF
          </span>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">
            Status Kesyahbandaran: <strong className="text-emerald-400 font-semibold">SPB Diizinkan</strong> (Gelombang Selat Sunda & Selat Madura: 0.8m - 1.2m Aman)
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <button
            onClick={onOpenAssignmentModal}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition shadow-sm"
            title="Klik untuk menyalin Link Pengumpulan Tugas Resmi agar tidak 404"
          >
            <Link2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-semibold">Link Web Tugas (Anti-404)</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono border transition ${dbBadge.color} hover:brightness-125`}
            title="Klik untuk konfigurasi database (Supabase, Neon DB, Firebase)"
          >
            <Database className="w-3 h-3" />
            <span>DB: {dbBadge.label}</span>
          </button>
          <button
            onClick={onResetData}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-400 transition"
            title="Kembalikan data simulasi pabrik"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold">
              <Ship className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  SIM-KAPAL
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  MARITIM HUB
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">
                Muatan Kapal & Manifest Penumpang
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Anchor className="w-3.5 h-3.5" />
              Dashboard Analitik
            </button>

            <button
              onClick={() => setActiveTab('master')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'master'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Ship className="w-3.5 h-3.5" />
              Master Data
            </button>

            <button
              onClick={() => setActiveTab('transaksi')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'transaksi'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Transaksi & Manifest
            </button>

            <button
              onClick={() => setActiveTab('laporan')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'laporan'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Laporan Syahbandar
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === 'database'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              Koneksi Real DB
            </button>
          </nav>

          {/* User Profile & Demo Switcher */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAssignmentModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-cyan-300 font-semibold text-xs shadow-md shadow-cyan-500/10 transition"
              title="Salin Link Web Tugas Resmi"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Link Web Tugas</span>
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-800/70 border border-slate-700/60 hover:border-cyan-500/40 transition text-left"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-lg object-cover border border-cyan-400/40"
                  />
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-slate-200 leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-cyan-400 font-medium capitalize">
                      {currentUser.role.replace('_', ' ')}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-700/60 mb-1">
                      <p className="font-semibold text-slate-200">{currentUser.name}</p>
                      <p className="text-slate-400 text-[11px] font-mono">{currentUser.email}</p>
                      <p className="text-[10px] text-slate-500 mt-1">NIP: {currentUser.nip}</p>
                      <p className="text-[10px] text-cyan-400 mt-0.5 truncate">{currentUser.portLocation}</p>
                    </div>

                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Ganti Akun Role (Testing)
                    </div>
                    <button
                      onClick={() => {
                        onSwitchRole('super_admin');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700/70 hover:text-white flex items-center justify-between"
                    >
                      <span>1. Super Admin (Capt. Rahmat)</span>
                      {currentUser.role === 'super_admin' && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                    <button
                      onClick={() => {
                        onSwitchRole('operator_pelabuhan');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700/70 hover:text-white flex items-center justify-between"
                    >
                      <span>2. Operator Pelabuhan (Bayu P)</span>
                      {currentUser.role === 'operator_pelabuhan' && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                    <button
                      onClick={() => {
                        onSwitchRole('kasir_tiket');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700/70 hover:text-white flex items-center justify-between"
                    >
                      <span>3. Kasir Tiket (Siti Aminah)</span>
                      {currentUser.role === 'kasir_tiket' && <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>

                    <div className="border-t border-slate-700/60 my-1"></div>
                    <button
                      onClick={() => {
                        onLogout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Keluar / Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 transition flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Login Admin
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Submenu Tabs */}
      <div className="lg:hidden flex items-center overflow-x-auto gap-2 px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
            activeTab === 'dashboard' ? 'bg-cyan-600 text-white' : 'text-slate-400'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('master')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
            activeTab === 'master' ? 'bg-cyan-600 text-white' : 'text-slate-400'
          }`}
        >
          Master Data
        </button>
        <button
          onClick={() => setActiveTab('transaksi')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
            activeTab === 'transaksi' ? 'bg-cyan-600 text-white' : 'text-slate-400'
          }`}
        >
          Transaksi Manifest
        </button>
        <button
          onClick={() => setActiveTab('laporan')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
            activeTab === 'laporan' ? 'bg-cyan-600 text-white' : 'text-slate-400'
          }`}
        >
          Laporan
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
            activeTab === 'database' ? 'bg-cyan-600 text-white' : 'text-slate-400'
          }`}
        >
          Koneksi DB
        </button>
      </div>
    </header>
  );
};
