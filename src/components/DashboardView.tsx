import React, { useState } from 'react';
import {
  Ship,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  Anchor,
  Wind,
  Waves,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Plus,
  Link2,
  Copy,
  Check,
  Globe
} from 'lucide-react';
import {
  Vessel,
  Voyage,
  PassengerManifest,
  CargoManifest
} from '../types/maritime';

interface DashboardViewProps {
  vessels: Vessel[];
  voyages: Voyage[];
  passengers: PassengerManifest[];
  cargoList: CargoManifest[];
  onNavigateToTab: (tab: 'master' | 'transaksi' | 'laporan' | 'database') => void;
  onOpenNewVesselModal: () => void;
  onOpenNewVoyageModal: () => void;
  onOpenNewCargoModal: () => void;
  onOpenNewPassengerModal: () => void;
  onOpenAssignmentModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  vessels,
  voyages,
  passengers,
  cargoList,
  onNavigateToTab,
  onOpenNewVesselModal,
  onOpenNewVoyageModal,
  onOpenNewCargoModal,
  onOpenNewPassengerModal,
  onOpenAssignmentModal
}) => {
  const [selectedVoyageFilter, setSelectedVoyageFilter] = useState<'ALL' | 'BERLAYAR' | 'BOARDING' | 'TERJADWAL'>('ALL');

  // KPI calculations
  const totalVessels = vessels.length;
  const activeSailingVessels = vessels.filter(v => v.status === 'BERLAYAR').length;
  const boardingVessels = voyages.filter(voy => voy.status === 'BOARDING').length;

  const totalPassengers = passengers.length;
  const checkedInPassengers = passengers.filter(p => p.checkInStatus === 'CHECKED_IN').length;

  const totalCargoTons = Math.round(cargoList.reduce((acc, c) => acc + (Number(c.weightTon) || 0), 0) * 10) / 10;
  const totalVehiclesCount = cargoList.filter(c => c.plateNumber && c.plateNumber.trim() !== '').length;

  const totalRevenue = passengers.reduce((sum, p) => sum + (Number(p.fare) || 0), 0) +
                       cargoList.reduce((sum, c) => sum + (Number(c.totalPrice) || 0), 0);

  const filteredVoyages = voyages.filter(voy => {
    if (selectedVoyageFilter === 'ALL') return true;
    return voy.status === selectedVoyageFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4 animate-spin-slow" />
              Sistem Pemantauan Armada Maritim & Manifest Real-Time
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pusat Kendali Operasional Kapal & Kargo
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Memantau muatan kargo kapal, tonase deadweight (DWT), kapasitas jiwa penumpang, kelaiklautan kapal, serta validitas surat persetujuan berlayar (SPB).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenNewVesselModal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 flex items-center gap-2 transition"
            >
              <Ship className="w-3.5 h-3.5" />
              + Tambah Kapal Baru
            </button>
            <button
              onClick={onOpenNewPassengerModal}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-semibold flex items-center gap-2 transition hover:border-cyan-500"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              Tiket Penumpang Baru
            </button>
            <button
              onClick={onOpenNewCargoModal}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-semibold flex items-center gap-2 transition hover:border-cyan-500"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              Surat Muatan Kargo (BL)
            </button>
            <button
              onClick={onOpenNewVoyageModal}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-semibold flex items-center gap-2 transition hover:border-cyan-500"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              Jadwal Pelayaran Baru
            </button>
          </div>
        </div>
      </div>

      {/* Assignment Submission Link Quick Banner (Fix for 404 Page Not Found) */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/30 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                Link Web Pengumpulan Tugas Resmi (Anti-404)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Cloud Run Online
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              URL resmi: <code className="text-cyan-300 font-mono text-[11px] bg-slate-950/70 px-1.5 py-0.5 rounded border border-slate-700">https://ais-pre-ntxkfyok5lrcbvlwmvkd67-897898967019.asia-southeast1.run.app</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              navigator.clipboard.writeText('https://ais-pre-ntxkfyok5lrcbvlwmvkd67-897898967019.asia-southeast1.run.app');
              alert('Link Web Tugas berhasil disalin! Silakan tempel di formulir pengumpulan tugas Anda.');
            }}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Salin Link Web Tugas</span>
          </button>
          <button
            onClick={onOpenAssignmentModal}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition"
          >
            <span>Petunjuk 404</span>
          </button>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Armada Kapal */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg hover:border-slate-600 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Armada Kapal Aktif</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Ship className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{totalVessels}</span>
              <span className="text-xs text-slate-400">Kapal Terdaftar</span>
            </div>
            <button
              onClick={onOpenNewVesselModal}
              className="px-2 py-1 rounded-lg bg-blue-600/30 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/40 text-[11px] font-semibold transition flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Tambah
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {activeSailingVessels} Sedang Berlayar
            </span>
            <span className="text-cyan-400 font-medium">
              {boardingVessels} Proses Boarding
            </span>
          </div>
        </div>

        {/* KPI 2: Penumpang & Boarding */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg hover:border-slate-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Manifest Penumpang</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalPassengers}</span>
            <span className="text-xs text-slate-400">Tiket Terbit</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-medium">
              {checkedInPassengers} Sudah Boarding ({totalPassengers > 0 ? Math.round((checkedInPassengers / totalPassengers) * 100) : 0}%)
            </span>
            <span className="text-amber-400 font-medium">
              {totalPassengers - checkedInPassengers} Menunggu
            </span>
          </div>
        </div>

        {/* KPI 3: Muatan Kargo & Kendaraan */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg hover:border-slate-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Muatan Kargo & Kendaraan</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalCargoTons}</span>
            <span className="text-xs text-slate-400">Tonase Muatan</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-medium">
              {totalVehiclesCount} Unit Kendaraan (Roda 2/4/6)
            </span>
            <span className="text-purple-400 font-medium">
              {cargoList.length} Surat Muatan
            </span>
          </div>
        </div>

        {/* KPI 4: Total Pendapatan Operasional */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg hover:border-slate-600 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Pendapatan Terverifikasi</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
            <span>Tiket + Jasa Angkut Kapal</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Lunas
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Real-time Vessel Occupancy & Safety Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Active Voyages & Capacity Gauges */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Anchor className="w-4 h-4 text-cyan-400" />
                  Monitoring Keterisian Kapal & Beban Tonase (DWT)
                </h2>
                <p className="text-xs text-slate-400">
                  Perbandingan live antara manifest penumpang & kargo terhadap kapasitas aman kapal
                </p>
              </div>

              {/* Status Filter Pill */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs">
                {(['ALL', 'BOARDING', 'BERLAYAR', 'TERJADWAL'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setSelectedVoyageFilter(status)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition text-[11px] ${
                      selectedVoyageFilter === status
                        ? 'bg-cyan-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* List of active vessels on voyage */}
            <div className="space-y-4">
              {filteredVoyages.map(voyage => {
                const vessel = vessels.find(v => v.id === voyage.vesselId);
                const maxPassengers = vessel?.passengerCapacity || 1000;
                const maxDwt = vessel?.maxDwtTon || 5000;

                const passengerPercent = Math.min(100, Math.round((voyage.currentPassengers / maxPassengers) * 100));
                const cargoPercent = Math.min(100, Math.round((voyage.currentCargoWeightTon / maxDwt) * 100));

                const isPassengerHeavy = passengerPercent > 85;
                const isCargoHeavy = cargoPercent > 85;

                return (
                  <div
                    key={voyage.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 hover:border-cyan-500/50 transition group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100 text-sm">{voyage.vesselName}</span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                            {voyage.voyageNumber}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            voyage.status === 'BERLAYAR'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : voyage.status === 'BOARDING'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-700/60 text-slate-300 border border-slate-600'
                          }`}>
                            {voyage.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                          <span>{voyage.originPortName}</span>
                          <span className="text-cyan-400">➔</span>
                          <span>{voyage.destinationPortName}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400 font-mono text-[11px]">Dermaga: {voyage.berthPier}</span>
                        </p>
                      </div>

                      <div className="text-right text-xs">
                        <span className="text-slate-400">Status Cuaca & Gelombang:</span>
                        <div className="flex items-center justify-end gap-1.5 font-semibold text-emerald-400 mt-0.5">
                          <Waves className="w-3.5 h-3.5" />
                          <span>{voyage.seaWaveMeters}m ({voyage.weatherStatus})</span>
                        </div>
                      </div>
                    </div>

                    {/* Gauges */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                      {/* Passenger Capacity Gauge */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-cyan-400" />
                            Kapasitas Jiwa Penumpang:
                          </span>
                          <span className="font-semibold text-slate-200">
                            {voyage.currentPassengers} / {maxPassengers} ({passengerPercent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              isPassengerHeavy ? 'bg-amber-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                            }`}
                            style={{ width: `${passengerPercent}%` }}
                          />
                        </div>
                        {isPassengerHeavy && (
                          <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1 font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            Keterisian penumpang mendekati kuota maksimal kapal!
                          </p>
                        )}
                      </div>

                      {/* Cargo DWT Capacity Gauge */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Package className="w-3.5 h-3.5 text-purple-400" />
                            Tonase Muatan Kapal (DWT):
                          </span>
                          <span className="font-semibold text-slate-200">
                            {voyage.currentCargoWeightTon} / {maxDwt} Ton ({cargoPercent}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${
                              isCargoHeavy ? 'bg-rose-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                            }`}
                            style={{ width: `${cargoPercent}%` }}
                          />
                        </div>
                        {isCargoHeavy && (
                          <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-medium">
                            <AlertTriangle className="w-3 h-3" />
                            Beban muatan mendekati batas Deadweight Tonnage maksimal!
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Metadata bar */}
                    <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>No SPB Syahbandar: <strong className="text-slate-400 font-mono">{voyage.spbApprovalNumber}</strong></span>
                      <button
                        onClick={() => onNavigateToTab('transaksi')}
                        className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition"
                      >
                        Buka Manifest Detail <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Maritime Weather Matrix & Fast Navigation */}
        <div className="space-y-6">
          {/* Weather & Port Safety Conditions */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Wind className="w-4 h-4 text-cyan-400" />
              Kondisi Laut & Status Izin Berlayar
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Selat Sunda (Merak - Bakauheni)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    AMAN
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-slate-400">
                  <div>Gelombang: <strong className="text-slate-200">0.8 - 1.2 m</strong></div>
                  <div>Kecepatan Angin: <strong className="text-slate-200">12 Knots</strong></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Laut Jawa (Surabaya - Balikpapan)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                    WASPADA
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-slate-400">
                  <div>Gelombang: <strong className="text-slate-200">1.8 - 2.2 m</strong></div>
                  <div>Kecepatan Angin: <strong className="text-slate-200">20 Knots</strong></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Selat Makassar (Makassar - Balikpapan)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    AMAN
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] text-slate-400">
                  <div>Gelombang: <strong className="text-slate-200">1.0 - 1.4 m</strong></div>
                  <div>Kecepatan Angin: <strong className="text-slate-200">14 Knots</strong></div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Seluruh kapal telah memenuhi kelaiklautan, alat keselamatan (Life Jacket & Life Raft lengkap), dan stabilitas muatan seimbang.
              </span>
            </div>
          </div>

          {/* Quick Hub Navigator */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-3">Akses Modul Cepat</h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigateToTab('master')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700/60 border border-slate-700 text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <Ship className="w-4 h-4 text-cyan-400" />
                  <span>Master Kapal, Dermaga & Tarif</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
              </button>

              <button
                onClick={() => onNavigateToTab('transaksi')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700/60 border border-slate-700 text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Check-In & Manifest Boarding</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400" />
              </button>

              <button
                onClick={() => onNavigateToTab('laporan')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700/60 border border-slate-700 text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>Cetak Manifest Syahbandar Resmi</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-400" />
              </button>

              <button
                onClick={() => onNavigateToTab('database')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700/60 border border-slate-700 text-left transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 text-xs text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Sinkronisasi Supabase / Neon / Firebase</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
