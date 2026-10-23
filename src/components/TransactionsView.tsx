import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Package,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  QrCode,
  FileText,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Check,
  Printer,
  ChevronRight,
  Filter
} from 'lucide-react';
import {
  Voyage,
  PassengerManifest,
  CargoManifest,
  Vessel,
  Route,
  CargoCategory,
  VoyageStatus
} from '../types/maritime';

interface TransactionsViewProps {
  voyages: Voyage[];
  passengers: PassengerManifest[];
  cargoList: CargoManifest[];
  vessels: Vessel[];
  routes: Route[];
  cargoCategories: CargoCategory[];
  onAddVoyage: (v: Omit<Voyage, 'id'>) => void;
  onUpdateVoyage: (id: string, v: Partial<Voyage>) => void;
  onDeleteVoyage: (id: string) => void;
  onAddPassenger: (p: Omit<PassengerManifest, 'id' | 'ticketNumber' | 'registeredAt'>) => void;
  onUpdatePassenger: (id: string, p: Partial<PassengerManifest>) => void;
  onDeletePassenger: (id: string) => void;
  onTogglePassengerCheckIn: (id: string) => void;
  onAddCargo: (c: Omit<CargoManifest, 'id' | 'blNumber' | 'registeredAt'>) => void;
  onUpdateCargo: (id: string, c: Partial<CargoManifest>) => void;
  onDeleteCargo: (id: string) => void;
  onUpdateCargoLoadingStatus: (id: string, status: 'DI_DERMAGA' | 'DIMUAT' | 'DIBONGKAR') => void;
  onPrintTicket: (p: PassengerManifest) => void;
  onPrintBL: (c: CargoManifest) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  voyages,
  passengers,
  cargoList,
  vessels,
  routes,
  cargoCategories,
  onAddVoyage,
  onUpdateVoyage,
  onDeleteVoyage,
  onAddPassenger,
  onUpdatePassenger,
  onDeletePassenger,
  onTogglePassengerCheckIn,
  onAddCargo,
  onUpdateCargo,
  onDeleteCargo,
  onUpdateCargoLoadingStatus,
  onPrintTicket,
  onPrintBL
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'jadwal' | 'penumpang' | 'kargo'>('jadwal');
  const [selectedVoyageFilter, setSelectedVoyageFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isVoyageModalOpen, setIsVoyageModalOpen] = useState(false);
  const [editingVoyage, setEditingVoyage] = useState<Voyage | null>(null);

  const [isPassengerModalOpen, setIsPassengerModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<PassengerManifest | null>(null);

  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false);
  const [editingCargo, setEditingCargo] = useState<CargoManifest | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type: string } | null>(null);

  // Forms
  const [voyageForm, setVoyageForm] = useState<Omit<Voyage, 'id'>>({
    voyageNumber: '',
    vesselId: vessels[0]?.id || '',
    vesselName: vessels[0]?.name || '',
    routeId: routes[0]?.id || '',
    originPortName: routes[0]?.originPortName || '',
    destinationPortName: routes[0]?.destinationPortName || '',
    departureTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString().slice(0, 16),
    arrivalTime: new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 16),
    status: 'TERJADWAL',
    currentPassengers: 0,
    currentCargoWeightTon: 0,
    weatherStatus: 'AMAN',
    seaWaveMeters: 0.9,
    spbApprovalNumber: 'SPB.04/MRK/KSOP-X/2024',
    berthPier: 'Dermaga 1 Reguler',
  });

  const [passengerForm, setPassengerForm] = useState<Omit<PassengerManifest, 'id' | 'ticketNumber' | 'registeredAt'>>({
    voyageId: voyages[0]?.id || '',
    voyageNumber: voyages[0]?.voyageNumber || '',
    vesselName: voyages[0]?.vesselName || '',
    identityNumber: '',
    fullName: '',
    gender: 'L',
    age: 30,
    category: 'DEWASA',
    cabinClass: 'EKONOMI',
    seatNumber: 'EKO-01',
    phoneNumber: '',
    checkInStatus: 'CHECKED_IN',
    fare: 25000,
    paymentStatus: 'LUNAS',
  });

  const [cargoForm, setCargoForm] = useState<Omit<CargoManifest, 'id' | 'blNumber' | 'registeredAt'>>({
    voyageId: voyages[0]?.id || '',
    voyageNumber: voyages[0]?.voyageNumber || '',
    vesselName: voyages[0]?.vesselName || '',
    categoryId: cargoCategories[0]?.id || '',
    categoryName: cargoCategories[0]?.name || '',
    itemDescription: '',
    plateNumber: '',
    vehicleType: '',
    weightTon: 1.5,
    volumeM3: 5.0,
    quantity: 1,
    unit: 'Unit Kendaraan',
    deckLocation: 'CAR_DECK',
    shipperName: '',
    shipperPhone: '',
    consigneeName: '',
    consigneePhone: '',
    hazardousGoods: false,
    tariff: 480000,
    totalPrice: 480000,
    loadingStatus: 'DIMUAT',
    paymentStatus: 'LUNAS',
  });

  // Open modals
  const openAddVoyage = () => {
    setEditingVoyage(null);
    const vsl = vessels[0];
    const rte = routes[0];
    const randomSeq = Math.floor(100 + Math.random() * 900);
    setVoyageForm({
      voyageNumber: `VY-${new Date().getFullYear()}-${vsl?.callSign || 'V'}-${randomSeq}`,
      vesselId: vsl?.id || '',
      vesselName: vsl?.name || '',
      routeId: rte?.id || '',
      originPortName: rte?.originPortName || '',
      destinationPortName: rte?.destinationPortName || '',
      departureTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString().slice(0, 16),
      arrivalTime: new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 16),
      status: 'TERJADWAL',
      currentPassengers: 0,
      currentCargoWeightTon: 0,
      weatherStatus: 'AMAN',
      seaWaveMeters: 0.9,
      spbApprovalNumber: `SPB.${Math.floor(10 + Math.random() * 90)}/KSOP/2024`,
      berthPier: 'Dermaga 3 Eksekutif',
    });
    setIsVoyageModalOpen(true);
  };

  const openEditVoyage = (v: Voyage) => {
    setEditingVoyage(v);
    setVoyageForm({
      ...v,
      departureTime: v.departureTime.slice(0, 16),
      arrivalTime: v.arrivalTime.slice(0, 16),
    });
    setIsVoyageModalOpen(true);
  };

  const handleSaveVoyage = (e: React.FormEvent) => {
    e.preventDefault();
    const vsl = vessels.find(v => v.id === voyageForm.vesselId);
    const rte = routes.find(r => r.id === voyageForm.routeId);
    const payload = {
      ...voyageForm,
      vesselName: vsl?.name || voyageForm.vesselName,
      originPortName: rte?.originPortName || voyageForm.originPortName,
      destinationPortName: rte?.destinationPortName || voyageForm.destinationPortName,
      departureTime: new Date(voyageForm.departureTime).toISOString(),
      arrivalTime: new Date(voyageForm.arrivalTime).toISOString(),
    };
    if (editingVoyage) {
      onUpdateVoyage(editingVoyage.id, payload);
    } else {
      onAddVoyage(payload);
    }
    setIsVoyageModalOpen(false);
  };

  const openAddPassenger = () => {
    setEditingPassenger(null);
    const targetVoyage = voyages.find(v => v.id === selectedVoyageFilter) || voyages[0];
    const randomSeat = `EKO-${Math.floor(10 + Math.random() * 89)}`;
    setPassengerForm({
      voyageId: targetVoyage?.id || '',
      voyageNumber: targetVoyage?.voyageNumber || '',
      vesselName: targetVoyage?.vesselName || '',
      identityNumber: '3201' + Math.floor(100000000000 + Math.random() * 900000000000),
      fullName: '',
      gender: 'L',
      age: 28,
      category: 'DEWASA',
      cabinClass: 'EKONOMI',
      seatNumber: randomSeat,
      phoneNumber: '08' + Math.floor(1000000000 + Math.random() * 9000000000),
      checkInStatus: 'CHECKED_IN',
      fare: 25000,
      paymentStatus: 'LUNAS',
    });
    setIsPassengerModalOpen(true);
  };

  const openEditPassenger = (p: PassengerManifest) => {
    setEditingPassenger(p);
    setPassengerForm({ ...p });
    setIsPassengerModalOpen(true);
  };

  const handleSavePassenger = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVoyage = voyages.find(v => v.id === passengerForm.voyageId);
    const payload = {
      ...passengerForm,
      voyageNumber: targetVoyage?.voyageNumber || passengerForm.voyageNumber,
      vesselName: targetVoyage?.vesselName || passengerForm.vesselName,
    };
    if (editingPassenger) {
      onUpdatePassenger(editingPassenger.id, payload);
    } else {
      onAddPassenger(payload);
    }
    setIsPassengerModalOpen(false);
  };

  const openAddCargo = () => {
    setEditingCargo(null);
    const targetVoyage = voyages.find(v => v.id === selectedVoyageFilter) || voyages[0];
    const cat = cargoCategories[1] || cargoCategories[0];
    setCargoForm({
      voyageId: targetVoyage?.id || '',
      voyageNumber: targetVoyage?.voyageNumber || '',
      vesselName: targetVoyage?.vesselName || '',
      categoryId: cat?.id || '',
      categoryName: cat?.name || '',
      itemDescription: '',
      plateNumber: 'B ' + Math.floor(1000 + Math.random() * 8999) + ' XYZ',
      vehicleType: 'Mobil Pribadi MPV',
      weightTon: 1.6,
      volumeM3: 8.0,
      quantity: 1,
      unit: 'Unit Kendaraan',
      deckLocation: 'CAR_DECK',
      shipperName: '',
      shipperPhone: '08' + Math.floor(1000000000 + Math.random() * 9000000000),
      consigneeName: '',
      consigneePhone: '08' + Math.floor(1000000000 + Math.random() * 9000000000),
      hazardousGoods: false,
      tariff: cat?.baseTariff || 480000,
      totalPrice: cat?.baseTariff || 480000,
      loadingStatus: 'DIMUAT',
      paymentStatus: 'LUNAS',
    });
    setIsCargoModalOpen(true);
  };

  const openEditCargo = (c: CargoManifest) => {
    setEditingCargo(c);
    setCargoForm({ ...c });
    setIsCargoModalOpen(true);
  };

  const handleSaveCargo = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVoyage = voyages.find(v => v.id === cargoForm.voyageId);
    const cat = cargoCategories.find(c => c.id === cargoForm.categoryId);
    const payload = {
      ...cargoForm,
      voyageNumber: targetVoyage?.voyageNumber || cargoForm.voyageNumber,
      vesselName: targetVoyage?.vesselName || cargoForm.vesselName,
      categoryName: cat?.name || cargoForm.categoryName,
    };
    if (editingCargo) {
      onUpdateCargo(editingCargo.id, payload);
    } else {
      onAddCargo(payload);
    }
    setIsCargoModalOpen(false);
  };

  const executeDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'voyage') onDeleteVoyage(deleteTarget.id);
    if (deleteTarget.type === 'passenger') onDeletePassenger(deleteTarget.id);
    if (deleteTarget.type === 'cargo') onDeleteCargo(deleteTarget.id);
    setDeleteTarget(null);
  };

  // Filter lists
  const filteredPassengers = passengers.filter(p => {
    const matchVoyage = selectedVoyageFilter === 'ALL' || p.voyageId === selectedVoyageFilter;
    const matchSearch = p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        p.identityNumber.includes(searchTerm);
    return matchVoyage && matchSearch;
  });

  const filteredCargo = cargoList.filter(c => {
    const matchVoyage = selectedVoyageFilter === 'ALL' || c.voyageId === selectedVoyageFilter;
    const matchSearch = c.itemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.blNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (c.plateNumber && c.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        c.shipperName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchVoyage && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header and Sub-navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-cyan-400" />
            Transaksi Operasional & Manifest Pelayaran
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan jadwal keberangkatan, penerbitan tiket & boarding manifest penumpang, serta surat muatan kargo/kendaraan (Bill of Lading).
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => { setActiveSubTab('jadwal'); setSearchTerm(''); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'jadwal'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Jadwal Pelayaran ({voyages.length})
          </button>
          <button
            onClick={() => { setActiveSubTab('penumpang'); setSearchTerm(''); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'penumpang'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Manifest Penumpang ({passengers.length})
          </button>
          <button
            onClick={() => { setActiveSubTab('kargo'); setSearchTerm(''); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'kargo'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Manifest Kargo & Kendaraan ({cargoList.length})
          </button>
        </div>
      </div>

      {/* Filter by Voyage & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          {/* Voyage filter */}
          <div className="flex items-center gap-2 text-xs text-slate-300 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="shrink-0 font-medium text-slate-400">Pilih Pelayaran:</span>
            <select
              value={selectedVoyageFilter}
              onChange={(e) => setSelectedVoyageFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 w-full sm:w-64"
            >
              <option value="ALL">Semua Jadwal Pelayaran</option>
              {voyages.map(v => (
                <option key={v.id} value={v.id}>
                  {v.voyageNumber} - {v.vesselName} ({v.originPortName.slice(0, 10)} ➔ {v.destinationPortName.slice(0, 10)})
                </option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama, tiket, BL, plat..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full sm:w-auto flex justify-end">
          {activeSubTab === 'jadwal' && (
            <button
              onClick={openAddVoyage}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow flex items-center gap-1.5 hover:brightness-110"
            >
              <Plus className="w-3.5 h-3.5" />
              Buat Jadwal Pelayaran
            </button>
          )}
          {activeSubTab === 'penumpang' && (
            <button
              onClick={openAddPassenger}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow flex items-center gap-1.5 hover:brightness-110"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Penumpang
            </button>
          )}
          {activeSubTab === 'kargo' && (
            <button
              onClick={openAddCargo}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow flex items-center gap-1.5 hover:brightness-110"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Kargo / Kendaraan (BL)
            </button>
          )}
        </div>
      </div>

      {/* Subtab 1: Jadwal Pelayaran */}
      {activeSubTab === 'jadwal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {voyages
            .filter(v =>
              v.voyageNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
              v.vesselName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(voy => {
              const vessel = vessels.find(v => v.id === voy.vesselId);
              return (
                <div
                  key={voy.id}
                  className="bg-slate-900 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-4 shadow-xl transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                        {voy.voyageNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        voy.status === 'BERLAYAR'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : voy.status === 'BOARDING'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {voy.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base">{voy.vesselName}</h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <span>{voy.originPortName}</span>
                      <span className="text-cyan-400 font-bold">➔</span>
                      <span>{voy.destinationPortName}</span>
                    </p>

                    <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Keberangkatan:</span>
                        <strong className="text-slate-200">
                          {new Date(voy.departureTime).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Estimasi Tiba:</span>
                        <strong className="text-slate-200">
                          {new Date(voy.arrivalTime).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Dermaga Sandar:</span>
                        <strong className="text-cyan-300 font-medium">{voy.berthPier}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
                        <span>Muatan Live:</span>
                        <span className="text-purple-300 font-semibold">{voy.currentCargoWeightTon} Ton ({voy.currentPassengers} Jiwa)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">SPB: {voy.spbApprovalNumber}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditVoyage(voy)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                        title="Edit Jadwal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: voy.id, name: voy.voyageNumber, type: 'voyage' })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        title="Hapus Jadwal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Subtab 2: Manifest Penumpang */}
      {activeSubTab === 'penumpang' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">No Tiket</th>
                  <th className="px-4 py-3">Nama Penumpang & NIK</th>
                  <th className="px-4 py-3">Kapal & Jadwal</th>
                  <th className="px-4 py-3">Kelas & No Kursi</th>
                  <th className="px-4 py-3">Tarif</th>
                  <th className="px-4 py-3">Status Boarding</th>
                  <th className="px-4 py-3 text-right">Aksi & Tiket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPassengers.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono font-bold text-cyan-400">
                      {p.ticketNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white text-sm">{p.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        NIK: {p.identityNumber} ({p.gender === 'L' ? 'Laki-laki' : 'Perempuan'}, {p.age} thn)
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-200">{p.vesselName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.voyageNumber}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-300 border border-slate-700">
                        {p.cabinClass}
                      </span>
                      <div className="text-[11px] text-slate-300 font-mono mt-0.5">Kursi: {p.seatNumber}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-400">
                      Rp {(Number(p.fare) || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onTogglePassengerCheckIn(p.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition flex items-center gap-1 cursor-pointer ${
                          p.checkInStatus === 'CHECKED_IN'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                        }`}
                        title="Klik untuk ubah status Check-in / Boarding"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {p.checkInStatus === 'CHECKED_IN' ? 'Boarded' : 'Check-In'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPrintTicket(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                          title="Cetak Tiket / Boarding Pass"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditPassenger(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                          title="Edit Penumpang"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: p.id, name: p.fullName, type: 'passenger' })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Hapus Penumpang"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: Manifest Muatan Kargo & Kendaraan */}
      {activeSubTab === 'kargo' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">No Resi / BL</th>
                  <th className="px-4 py-3">Deskripsi Muatan & Plat Polisi</th>
                  <th className="px-4 py-3">Kategori & Lokasi Dek</th>
                  <th className="px-4 py-3">Tonase Berat (Ton)</th>
                  <th className="px-4 py-3">Pengirim ➔ Penerima</th>
                  <th className="px-4 py-3">Total Biaya</th>
                  <th className="px-4 py-3">Status Pemuatan</th>
                  <th className="px-4 py-3 text-right">Aksi & BL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredCargo.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono font-bold text-purple-400">
                      {c.blNumber}
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{c.voyageNumber}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white text-sm">{c.itemDescription}</div>
                      {c.plateNumber && (
                        <span className="inline-block px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-[10px] font-bold mt-0.5">
                          PLAT: {c.plateNumber}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-300">{c.categoryName}</div>
                      <div className="text-[10px] text-cyan-400 font-mono">Dek: {c.deckLocation}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {c.weightTon} Ton
                      <div className="text-[10px] text-slate-400">{c.volumeM3} m3 / {c.quantity} {c.unit}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <div>{c.shipperName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">➔ {c.consigneeName}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-400">
                      Rp {(Number(c.totalPrice) || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={c.loadingStatus}
                        onChange={(e) => onUpdateCargoLoadingStatus(c.id, e.target.value as any)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                          c.loadingStatus === 'DIMUAT'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : c.loadingStatus === 'DIBONGKAR'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <option value="DI_DERMAGA">Di Dermaga</option>
                        <option value="DIMUAT">Dimuat di Kapal</option>
                        <option value="DIBONGKAR">Sudah Dibongkar</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPrintBL(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                          title="Cetak Bill of Lading (BL) / Resi Muatan"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditCargo(c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                          title="Edit Muatan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: c.id, name: c.blNumber, type: 'cargo' })}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Hapus Muatan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Voyage Form */}
      {isVoyageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                {editingVoyage ? 'Edit Jadwal Pelayaran' : 'Buat Jadwal Pelayaran Baru'}
              </h3>
              <button onClick={() => setIsVoyageModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVoyage} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor Pelayaran (Voyage No) *</label>
                  <input
                    type="text"
                    required
                    value={voyageForm.voyageNumber}
                    onChange={(e) => setVoyageForm({ ...voyageForm, voyageNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    placeholder="VY-2024-MRK-101"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kapal Armada *</label>
                  <select
                    value={voyageForm.vesselId}
                    onChange={(e) => setVoyageForm({ ...voyageForm, vesselId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {vessels.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Rute Trayek *</label>
                <select
                  value={voyageForm.routeId}
                  onChange={(e) => {
                    const rte = routes.find(r => r.id === e.target.value);
                    setVoyageForm({
                      ...voyageForm,
                      routeId: e.target.value,
                      originPortName: rte?.originPortName || voyageForm.originPortName,
                      destinationPortName: rte?.destinationPortName || voyageForm.destinationPortName,
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.routeCode} ({r.originPortName} ➔ {r.destinationPortName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Waktu Keberangkatan (ETD)</label>
                  <input
                    type="datetime-local"
                    required
                    value={voyageForm.departureTime}
                    onChange={(e) => setVoyageForm({ ...voyageForm, departureTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estimasi Tiba (ETA)</label>
                  <input
                    type="datetime-local"
                    required
                    value={voyageForm.arrivalTime}
                    onChange={(e) => setVoyageForm({ ...voyageForm, arrivalTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Pelayaran</label>
                  <select
                    value={voyageForm.status}
                    onChange={(e) => setVoyageForm({ ...voyageForm, status: e.target.value as VoyageStatus })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="TERJADWAL">Terjadwal</option>
                    <option value="BOARDING">Proses Boarding</option>
                    <option value="BERLAYAR">Sedang Berlayar</option>
                    <option value="SANDAR">Tiba / Sandar</option>
                    <option value="DIBATALKAN">Dibatalkan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kondisi Cuaca</label>
                  <select
                    value={voyageForm.weatherStatus}
                    onChange={(e) => setVoyageForm({ ...voyageForm, weatherStatus: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="AMAN">Aman (Gelombang &lt; 1.25m)</option>
                    <option value="WASPADA">Waspada (1.25m - 2.5m)</option>
                    <option value="BAHAYA">Bahaya (&gt; 2.5m)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tinggi Gelombang (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={voyageForm.seaWaveMeters}
                    onChange={(e) => setVoyageForm({ ...voyageForm, seaWaveMeters: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor SPB Syahbandar</label>
                  <input
                    type="text"
                    value={voyageForm.spbApprovalNumber}
                    onChange={(e) => setVoyageForm({ ...voyageForm, spbApprovalNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    placeholder="SPB.04/MRK/KSOP-X/2024"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lokasi Dermaga</label>
                  <input
                    type="text"
                    value={voyageForm.berthPier}
                    onChange={(e) => setVoyageForm({ ...voyageForm, berthPier: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    placeholder="Dermaga 3 Eksekutif"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVoyageModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Check className="w-4 h-4" />
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Passenger Form */}
      {isPassengerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                {editingPassenger ? 'Edit Penumpang' : 'Tambah Penumpang Baru'}
              </h3>
              <button onClick={() => setIsPassengerModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePassenger} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pilih Jadwal Pelayaran *</label>
                <select
                  value={passengerForm.voyageId}
                  onChange={(e) => setPassengerForm({ ...passengerForm, voyageId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {voyages.map(v => (
                    <option key={v.id} value={v.id}>{v.voyageNumber} - {v.vesselName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor Identitas (NIK/Paspor) *</label>
                  <input
                    type="text"
                    required
                    value={passengerForm.identityNumber}
                    onChange={(e) => setPassengerForm({ ...passengerForm, identityNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    placeholder="3201..."
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={passengerForm.fullName}
                    onChange={(e) => setPassengerForm({ ...passengerForm, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    placeholder="Budi Santoso"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jenis Kelamin</label>
                  <select
                    value={passengerForm.gender}
                    onChange={(e) => setPassengerForm({ ...passengerForm, gender: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="L">Laki-Laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Usia (Tahun)</label>
                  <input
                    type="number"
                    value={passengerForm.age}
                    onChange={(e) => setPassengerForm({ ...passengerForm, age: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori</label>
                  <select
                    value={passengerForm.category}
                    onChange={(e) => setPassengerForm({ ...passengerForm, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="DEWASA">Dewasa</option>
                    <option value="ANAK">Anak (&lt; 10 th)</option>
                    <option value="BAYI">Bayi (&lt; 2 th)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kelas Kabin</label>
                  <select
                    value={passengerForm.cabinClass}
                    onChange={(e) => setPassengerForm({ ...passengerForm, cabinClass: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="EKONOMI">Ekonomi</option>
                    <option value="BISNIS">Bisnis</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor Kursi</label>
                  <input
                    type="text"
                    value={passengerForm.seatNumber}
                    onChange={(e) => setPassengerForm({ ...passengerForm, seatNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">No Handphone</label>
                  <input
                    type="text"
                    value={passengerForm.phoneNumber}
                    onChange={(e) => setPassengerForm({ ...passengerForm, phoneNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    placeholder="0812..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tarif Tiket (Rp)</label>
                  <input
                    type="number"
                    value={passengerForm.fare}
                    onChange={(e) => setPassengerForm({ ...passengerForm, fare: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Boarding</label>
                  <select
                    value={passengerForm.checkInStatus}
                    onChange={(e) => setPassengerForm({ ...passengerForm, checkInStatus: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="CHECKED_IN">Sudah Check-In / Boarding</option>
                    <option value="BELUM_CHECKIN">Belum Check-In</option>
                    <option value="BATAL">Batal</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPassengerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Check className="w-4 h-4" />
                  Simpan Penumpang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Cargo Form */}
      {isCargoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                {editingCargo ? 'Edit Muatan Kapal (BL)' : 'Tambah Muatan Kargo / Kendaraan (BL)'}
              </h3>
              <button onClick={() => setIsCargoModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCargo} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pilih Jadwal Pelayaran *</label>
                  <select
                    value={cargoForm.voyageId}
                    onChange={(e) => setCargoForm({ ...cargoForm, voyageId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {voyages.map(v => (
                      <option key={v.id} value={v.id}>{v.voyageNumber} - {v.vesselName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori Muatan *</label>
                  <select
                    value={cargoForm.categoryId}
                    onChange={(e) => {
                      const cat = cargoCategories.find(c => c.id === e.target.value);
                      setCargoForm({
                        ...cargoForm,
                        categoryId: e.target.value,
                        categoryName: cat?.name || '',
                        tariff: cat?.baseTariff || cargoForm.tariff,
                        totalPrice: cat?.baseTariff || cargoForm.totalPrice,
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {cargoCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deskripsi Muatan Barang *</label>
                <input
                  type="text"
                  required
                  value={cargoForm.itemDescription}
                  onChange={(e) => setCargoForm({ ...cargoForm, itemDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  placeholder="e.g. Truk Tronton Muatan Buah Sawit 20 Ton"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Plat Nomor (Jika Kendaraan)</label>
                  <input
                    type="text"
                    value={cargoForm.plateNumber}
                    onChange={(e) => setCargoForm({ ...cargoForm, plateNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase font-mono"
                    placeholder="B 1234 XYZ"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lokasi Palka / Car Deck</label>
                  <select
                    value={cargoForm.deckLocation}
                    onChange={(e) => setCargoForm({ ...cargoForm, deckLocation: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="CAR_DECK">Car Deck (Dek Kendaraan)</option>
                    <option value="DEK_UTAMA">Dek Utama (Main Deck)</option>
                    <option value="DEK_ATAS">Dek Atas (Upper Deck)</option>
                    <option value="PALKA_1">Palka Bawah 1</option>
                    <option value="PALKA_2">Palka Bawah 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Berat (Ton) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={cargoForm.weightTon}
                    onChange={(e) => setCargoForm({ ...cargoForm, weightTon: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-purple-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Volume (m3)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={cargoForm.volumeM3}
                    onChange={(e) => setCargoForm({ ...cargoForm, volumeM3: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Biaya (Rp)</label>
                  <input
                    type="number"
                    value={cargoForm.totalPrice}
                    onChange={(e) => setCargoForm({ ...cargoForm, totalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Pengirim (Shipper) *</label>
                  <input
                    type="text"
                    required
                    value={cargoForm.shipperName}
                    onChange={(e) => setCargoForm({ ...cargoForm, shipperName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    placeholder="PT / Nama Pengirim"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Penerima (Consignee) *</label>
                  <input
                    type="text"
                    required
                    value={cargoForm.consigneeName}
                    onChange={(e) => setCargoForm({ ...cargoForm, consigneeName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    placeholder="PT / Nama Penerima"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Pemuatan</label>
                  <select
                    value={cargoForm.loadingStatus}
                    onChange={(e) => setCargoForm({ ...cargoForm, loadingStatus: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="DI_DERMAGA">Di Dermaga (Persiapan Muat)</option>
                    <option value="DIMUAT">Dimuat di Palka/Car Deck</option>
                    <option value="DIBONGKAR">Sudah Dibongkar di Tujuan</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="hazardousCheck"
                    checked={cargoForm.hazardousGoods}
                    onChange={(e) => setCargoForm({ ...cargoForm, hazardousGoods: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700 text-rose-500 focus:ring-rose-500 w-4 h-4"
                  />
                  <label htmlFor="hazardousCheck" className="text-slate-300 font-semibold text-xs">
                    Muatan Berbahaya (DG / Dangerous Goods)
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCargoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Check className="w-4 h-4" />
                  Simpan Surat Muatan (BL)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-2xl p-5 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Hapus Transaksi</h3>
            <p className="text-xs text-slate-300 mt-1">
              Hapus transaksi <strong className="text-rose-400">"{deleteTarget.name}"</strong>? Data manifest akan disesuaikan otomatis.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
