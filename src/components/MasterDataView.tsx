import React, { useState } from 'react';
import {
  Ship,
  MapPin,
  Compass,
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import {
  Vessel,
  Port,
  Route,
  CargoCategory,
  VesselType,
  VesselStatus
} from '../types/maritime';

interface MasterDataViewProps {
  vessels: Vessel[];
  ports: Port[];
  routes: Route[];
  cargoCategories: CargoCategory[];
  onAddVessel: (v: Omit<Vessel, 'id'>) => void;
  onUpdateVessel: (id: string, v: Partial<Vessel>) => void;
  onDeleteVessel: (id: string) => void;
  onAddPort: (p: Omit<Port, 'id'>) => void;
  onUpdatePort: (id: string, p: Partial<Port>) => void;
  onDeletePort: (id: string) => void;
  onAddRoute: (r: Omit<Route, 'id'>) => void;
  onUpdateRoute: (id: string, r: Partial<Route>) => void;
  onDeleteRoute: (id: string) => void;
  onAddCargoCategory: (c: Omit<CargoCategory, 'id'>) => void;
  onUpdateCargoCategory: (id: string, c: Partial<CargoCategory>) => void;
  onDeleteCargoCategory: (id: string) => void;
  autoOpenAddVessel?: boolean;
  onResetAutoOpen?: () => void;
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({
  vessels,
  ports,
  routes,
  cargoCategories,
  onAddVessel,
  onUpdateVessel,
  onDeleteVessel,
  onAddPort,
  onUpdatePort,
  onDeletePort,
  onAddRoute,
  onUpdateRoute,
  onDeleteRoute,
  onAddCargoCategory,
  onUpdateCargoCategory,
  onDeleteCargoCategory,
  autoOpenAddVessel,
  onResetAutoOpen
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'kapal' | 'pelabuhan' | 'rute' | 'muatan'>('kapal');
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Modal states
  const [isVesselModalOpen, setIsVesselModalOpen] = useState(false);
  const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);

  const [isPortModalOpen, setIsPortModalOpen] = useState(false);
  const [editingPort, setEditingPort] = useState<Port | null>(null);

  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CargoCategory | null>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type: string } | null>(null);

  // Form states for Vessel
  const [vesselForm, setVesselForm] = useState<Omit<Vessel, 'id'>>({
    name: '',
    callSign: '',
    imoNumber: '',
    type: 'RORO',
    passengerCapacity: 500,
    maxDwtTon: 4000,
    carCapacity: 100,
    truckCapacity: 30,
    lengthOverallMeters: 110,
    maxDraftMeters: 4.5,
    status: 'SANDAR',
    captainName: 'Capt. Nakhoda',
    flag: 'Indonesia',
    yearBuilt: 2020,
    lastMaintenance: new Date().toISOString().split('T')[0],
  });

  // Form states for Port
  const [portForm, setPortForm] = useState<Omit<Port, 'id'>>({
    code: '',
    name: '',
    city: '',
    province: '',
    pierLengthMeters: 300,
    draftDepthMeters: 10,
    berthCapacity: 4,
    operationalStatus: 'AKTIF',
  });

  // Form states for Route
  const [routeForm, setRouteForm] = useState<Omit<Route, 'id'>>({
    routeCode: '',
    originPortId: ports[0]?.id || '',
    destinationPortId: ports[1]?.id || '',
    originPortName: ports[0]?.name || '',
    destinationPortName: ports[1]?.name || '',
    distanceNm: 25,
    estimatedHours: 2.5,
    baseFareEconomy: 25000,
    baseFareVehicle: 450000,
  });

  // Form states for Category
  const [categoryForm, setCategoryForm] = useState<Omit<CargoCategory, 'id'>>({
    code: '',
    name: '',
    description: '',
    unitType: 'KENDARAAN',
    baseTariff: 100000,
    maxWeightTon: 5,
    iconName: 'Package',
  });

  // Effect to auto open modal if requested from Dashboard
  React.useEffect(() => {
    if (autoOpenAddVessel) {
      setActiveSubTab('kapal');
      openAddVessel();
      if (onResetAutoOpen) onResetAutoOpen();
    }
  }, [autoOpenAddVessel]);

  // Handlers for Vessel
  const openAddVessel = () => {
    setEditingVessel(null);
    setVesselForm({
      name: '',
      callSign: '',
      imoNumber: '',
      type: 'RORO',
      passengerCapacity: 600,
      maxDwtTon: 4500,
      carCapacity: 120,
      truckCapacity: 40,
      lengthOverallMeters: 115,
      maxDraftMeters: 4.6,
      status: 'SANDAR',
      captainName: 'Capt. Baru',
      flag: 'Indonesia',
      yearBuilt: 2021,
      lastMaintenance: new Date().toISOString().split('T')[0],
    });
    setIsVesselModalOpen(true);
  };

  const openEditVessel = (v: Vessel) => {
    setEditingVessel(v);
    setVesselForm({
      name: v.name || '',
      callSign: v.callSign || '',
      imoNumber: v.imoNumber || '',
      type: v.type || 'RORO',
      passengerCapacity: v.passengerCapacity || 0,
      maxDwtTon: v.maxDwtTon || 0,
      carCapacity: v.carCapacity || 0,
      truckCapacity: v.truckCapacity || 0,
      lengthOverallMeters: v.lengthOverallMeters || 100,
      maxDraftMeters: v.maxDraftMeters || 4.5,
      status: v.status || 'SANDAR',
      captainName: v.captainName || '',
      flag: v.flag || 'Indonesia',
      yearBuilt: v.yearBuilt || 2020,
      lastMaintenance: v.lastMaintenance || new Date().toISOString().split('T')[0],
    });
    setIsVesselModalOpen(true);
  };

  const handleSaveVessel = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanName = (vesselForm.name || '').trim();
      const cleanCallSign = (vesselForm.callSign || '').trim().toUpperCase();

      if (!cleanName) {
        alert('Nama kapal wajib diisi!');
        return;
      }
      if (!cleanCallSign) {
        alert('Call sign kapal wajib diisi!');
        return;
      }

      const payload: Omit<Vessel, 'id'> = {
        name: cleanName,
        callSign: cleanCallSign,
        imoNumber: (vesselForm.imoNumber || '').trim() || `IMO-${Math.floor(1000000 + Math.random() * 8999999)}`,
        type: vesselForm.type || 'RORO',
        passengerCapacity: Math.max(0, Number(vesselForm.passengerCapacity) || 0),
        maxDwtTon: Math.max(0, Number(vesselForm.maxDwtTon) || 0),
        carCapacity: Math.max(0, Number(vesselForm.carCapacity) || 0),
        truckCapacity: Math.max(0, Number(vesselForm.truckCapacity) || 0),
        lengthOverallMeters: Math.max(1, Number(vesselForm.lengthOverallMeters) || 100),
        maxDraftMeters: Math.max(0.1, Number(vesselForm.maxDraftMeters) || 4.5),
        status: vesselForm.status || 'SANDAR',
        captainName: (vesselForm.captainName || '').trim() || 'Capt. Belum Ditunjuk',
        flag: (vesselForm.flag || 'Indonesia').trim(),
        yearBuilt: Number(vesselForm.yearBuilt) || new Date().getFullYear(),
        lastMaintenance: vesselForm.lastMaintenance || new Date().toISOString().split('T')[0],
      };

      if (editingVessel) {
        onUpdateVessel(editingVessel.id, payload);
        setNotificationMessage(`Data kapal "${payload.name}" berhasil diperbarui!`);
      } else {
        onAddVessel(payload);
        setNotificationMessage(`Kapal baru "${payload.name}" (${payload.callSign}) berhasil ditambahkan ke armada!`);
      }
      setSearchTerm(''); // Clear search so the new vessel is immediately visible at the top
      setIsVesselModalOpen(false);
      setTimeout(() => setNotificationMessage(null), 4000);
    } catch (err: any) {
      alert(`Gagal menyimpan kapal: ${err.message || 'Terjadi kesalahan sistem'}`);
    }
  };

  // Handlers for Port
  const openAddPort = () => {
    setEditingPort(null);
    setPortForm({
      code: 'ID-XXX',
      name: '',
      city: '',
      province: '',
      pierLengthMeters: 400,
      draftDepthMeters: 12,
      berthCapacity: 4,
      operationalStatus: 'AKTIF',
    });
    setIsPortModalOpen(true);
  };

  const openEditPort = (p: Port) => {
    setEditingPort(p);
    setPortForm({ ...p });
    setIsPortModalOpen(true);
  };

  const handleSavePort = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPort) {
      onUpdatePort(editingPort.id, portForm);
    } else {
      onAddPort(portForm);
    }
    setIsPortModalOpen(false);
  };

  // Handlers for Route
  const openAddRoute = () => {
    setEditingRoute(null);
    const origin = ports[0];
    const destination = ports[1] || ports[0];
    setRouteForm({
      routeCode: 'RTE-NEW',
      originPortId: origin?.id || '',
      destinationPortId: destination?.id || '',
      originPortName: origin?.name || '',
      destinationPortName: destination?.name || '',
      distanceNm: 30,
      estimatedHours: 3,
      baseFareEconomy: 30000,
      baseFareVehicle: 500000,
    });
    setIsRouteModalOpen(true);
  };

  const openEditRoute = (r: Route) => {
    setEditingRoute(r);
    setRouteForm({ ...r });
    setIsRouteModalOpen(true);
  };

  const handleSaveRoute = (e: React.FormEvent) => {
    e.preventDefault();
    const origin = ports.find(p => p.id === routeForm.originPortId);
    const dest = ports.find(p => p.id === routeForm.destinationPortId);
    const payload = {
      ...routeForm,
      originPortName: origin?.name || routeForm.originPortName,
      destinationPortName: dest?.name || routeForm.destinationPortName,
    };
    if (editingRoute) {
      onUpdateRoute(editingRoute.id, payload);
    } else {
      onAddRoute(payload);
    }
    setIsRouteModalOpen(false);
  };

  // Handlers for Category
  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      code: 'GOL-NEW',
      name: '',
      description: '',
      unitType: 'KENDARAAN',
      baseTariff: 250000,
      maxWeightTon: 3,
      iconName: 'Car',
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategory = (c: CargoCategory) => {
    setEditingCategory(c);
    setCategoryForm({ ...c });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      onUpdateCargoCategory(editingCategory.id, categoryForm);
    } else {
      onAddCargoCategory(categoryForm);
    }
    setIsCategoryModalOpen(false);
  };

  // Confirm delete
  const executeDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'vessel') onDeleteVessel(deleteTarget.id);
    if (deleteTarget.type === 'port') onDeletePort(deleteTarget.id);
    if (deleteTarget.type === 'route') onDeleteRoute(deleteTarget.id);
    if (deleteTarget.type === 'category') onDeleteCargoCategory(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header and Sub-navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Ship className="w-6 h-6 text-cyan-400" />
            Pengelolaan Master Data Operasional
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen entitas utama: Armada Kapal, Pelabuhan & Dermaga, Rute Trayek, serta Kategori Muatan & Tarif.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => { setActiveSubTab('kapal'); setSearchTerm(''); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'kapal'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            Kapal ({vessels.length})
          </button>
          <button
            onClick={() => { setActiveSubTab('pelabuhan'); setSearchTerm(''); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'pelabuhan'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Pelabuhan ({ports.length})
          </button>
          <button
            onClick={() => { setActiveSubTab('rute'); setSearchTerm(''); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'rute'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Rute ({routes.length})
          </button>
          <button
            onClick={() => { setActiveSubTab('muatan'); setSearchTerm(''); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'muatan'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Kategori Muatan ({cargoCategories.length})
          </button>
        </div>
      </div>

      {/* Action Bar (Search & Add Button) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Cari di ${activeSubTab}...`}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="w-full sm:w-auto flex justify-end">
          {activeSubTab === 'kapal' && (
            <button
              onClick={openAddVessel}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Kapal Baru
            </button>
          )}
          {activeSubTab === 'pelabuhan' && (
            <button
              onClick={openAddPort}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Pelabuhan Baru
            </button>
          )}
          {activeSubTab === 'rute' && (
            <button
              onClick={openAddRoute}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Rute Trayek
            </button>
          )}
          {activeSubTab === 'muatan' && (
            <button
              onClick={openAddCategory}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Kategori Muatan
            </button>
          )}
        </div>
      </div>

      {/* Notification Banner */}
      {notificationMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{notificationMessage}</span>
          </div>
          <button onClick={() => setNotificationMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Content 1: Master Kapal */}
      {activeSubTab === 'kapal' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Nama Kapal & Call Sign</th>
                  <th className="px-4 py-3">Tipe & IMO</th>
                  <th className="px-4 py-3">Kapasitas Jiwa</th>
                  <th className="px-4 py-3">Kapasitas DWT (Ton)</th>
                  <th className="px-4 py-3">Kendaraan (Mobil/Truk)</th>
                  <th className="px-4 py-3">Nakhoda</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi (CRUD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {vessels
                  .filter(v => {
                    const term = (searchTerm || '').trim().toLowerCase();
                    if (!term) return true;
                    const name = (v.name || '').toLowerCase();
                    const callSign = (v.callSign || '').toLowerCase();
                    const captain = (v.captainName || '').toLowerCase();
                    const imo = (v.imoNumber || '').toLowerCase();
                    const type = (v.type || '').toLowerCase();
                    return name.includes(term) || callSign.includes(term) || captain.includes(term) || imo.includes(term) || type.includes(term);
                  })
                  .map(vessel => (
                    <tr key={vessel.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-sm">{vessel.name}</div>
                        <div className="text-[11px] text-cyan-400 font-mono">CS: {vessel.callSign}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200 border border-slate-700 font-medium">
                          {vessel.type}
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">IMO: {vessel.imoNumber}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-100">
                        {vessel.passengerCapacity.toLocaleString('id-ID')} Jiwa
                      </td>
                      <td className="px-4 py-3 font-semibold text-purple-300">
                        {vessel.maxDwtTon.toLocaleString('id-ID')} Ton
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {vessel.carCapacity} Mobil / {vessel.truckCapacity} Truk
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {vessel.captainName}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          vessel.status === 'BERLAYAR'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : vessel.status === 'SANDAR'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {vessel.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditVessel(vessel)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                            title="Edit Data Kapal"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: vessel.id, name: vessel.name, type: 'vessel' })}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                            title="Hapus Kapal"
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

      {/* Content 2: Master Pelabuhan */}
      {activeSubTab === 'pelabuhan' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Kode & Nama Pelabuhan</th>
                  <th className="px-4 py-3">Lokasi (Kota / Provinsi)</th>
                  <th className="px-4 py-3">Panjang Dermaga</th>
                  <th className="px-4 py-3">Kedalaman Draft (LWS)</th>
                  <th className="px-4 py-3">Kapasitas Sandar</th>
                  <th className="px-4 py-3">Status Operasional</th>
                  <th className="px-4 py-3 text-right">Aksi (CRUD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {ports
                  .filter(p => {
                    const term = (searchTerm || '').trim().toLowerCase();
                    if (!term) return true;
                    const name = (p.name || '').toLowerCase();
                    const code = (p.code || '').toLowerCase();
                    const city = (p.city || '').toLowerCase();
                    return name.includes(term) || code.includes(term) || city.includes(term);
                  })
                  .map(port => (
                    <tr key={port.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-sm">{port.name}</div>
                        <div className="text-[11px] text-cyan-400 font-mono">{port.code}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {port.city}, {port.province}
                      </td>
                      <td className="px-4 py-3 text-slate-100 font-medium">
                        {port.pierLengthMeters} meter
                      </td>
                      <td className="px-4 py-3 text-slate-100 font-medium">
                        {port.draftDepthMeters} m LWS
                      </td>
                      <td className="px-4 py-3 text-slate-100 font-medium">
                        {port.berthCapacity} Kapal
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          port.operationalStatus === 'AKTIF'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {port.operationalStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditPort(port)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                            title="Edit Pelabuhan"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: port.id, name: port.name, type: 'port' })}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                            title="Hapus Pelabuhan"
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

      {/* Content 3: Master Rute Trayek */}
      {activeSubTab === 'rute' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Kode Trayek</th>
                  <th className="px-4 py-3">Pelabuhan Asal ➔ Tujuan</th>
                  <th className="px-4 py-3">Jarak (Mil Laut)</th>
                  <th className="px-4 py-3">Estimasi Durasi</th>
                  <th className="px-4 py-3">Tarif Dasar Penumpang</th>
                  <th className="px-4 py-3">Tarif Dasar Kendaraan</th>
                  <th className="px-4 py-3 text-right">Aksi (CRUD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {routes
                  .filter(r => {
                    const term = (searchTerm || '').trim().toLowerCase();
                    if (!term) return true;
                    const code = (r.routeCode || '').toLowerCase();
                    const origin = (r.originPortName || '').toLowerCase();
                    const dest = (r.destinationPortName || '').toLowerCase();
                    return code.includes(term) || origin.includes(term) || dest.includes(term);
                  })
                  .map(route => (
                    <tr key={route.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-mono font-bold text-cyan-400">
                        {route.routeCode}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{route.originPortName}</div>
                        <div className="text-[11px] text-cyan-400">➔ {route.destinationPortName}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-100">
                        {route.distanceNm} NM
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {route.estimatedHours} Jam
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-400">
                        Rp {route.baseFareEconomy.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 font-semibold text-purple-400">
                        Rp {route.baseFareVehicle.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditRoute(route)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                            title="Edit Rute"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: route.id, name: route.routeCode, type: 'route' })}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                            title="Hapus Rute"
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

      {/* Content 4: Master Kategori Muatan */}
      {activeSubTab === 'muatan' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Kode Golongan</th>
                  <th className="px-4 py-3">Nama Kategori & Deskripsi</th>
                  <th className="px-4 py-3">Satuan Unit</th>
                  <th className="px-4 py-3">Tarif Muatan (Rp)</th>
                  <th className="px-4 py-3">Batas Max Berat (Ton)</th>
                  <th className="px-4 py-3 text-right">Aksi (CRUD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {cargoCategories
                  .filter(c => {
                    const term = (searchTerm || '').trim().toLowerCase();
                    if (!term) return true;
                    const name = (c.name || '').toLowerCase();
                    const code = (c.code || '').toLowerCase();
                    return name.includes(term) || code.includes(term);
                  })
                  .map(cat => (
                    <tr key={cat.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-mono font-bold text-purple-400">
                        {cat.code}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-sm">{cat.name}</div>
                        <div className="text-[11px] text-slate-400">{cat.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200 border border-slate-700 font-medium">
                          {cat.unitType}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-400">
                        Rp {cat.baseTariff.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 text-slate-100 font-medium">
                        {cat.maxWeightTon} Ton
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditCategory(cat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
                            title="Edit Kategori"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: cat.id, name: cat.name, type: 'category' })}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                            title="Hapus Kategori"
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

      {/* MODAL: Vessel Form */}
      {isVesselModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Ship className="w-5 h-5 text-cyan-400" />
                {editingVessel ? 'Edit Data Kapal' : 'Tambah Kapal Baru'}
              </h3>
              <button onClick={() => setIsVesselModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVessel} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Kapal *</label>
                  <input
                    type="text"
                    required
                    value={vesselForm.name}
                    onChange={(e) => setVesselForm({ ...vesselForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. KMP Batumandi"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Call Sign *</label>
                  <input
                    type="text"
                    required
                    value={vesselForm.callSign}
                    onChange={(e) => setVesselForm({ ...vesselForm, callSign: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase font-mono focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. PKBM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor IMO</label>
                  <input
                    type="text"
                    value={vesselForm.imoNumber}
                    onChange={(e) => setVesselForm({ ...vesselForm, imoNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. 9845210"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipe Kapal</label>
                  <select
                    value={vesselForm.type}
                    onChange={(e) => setVesselForm({ ...vesselForm, type: e.target.value as VesselType })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="RORO">Feri Ro-Ro Penumpang</option>
                    <option value="CARGO">Kapal Kargo Barang</option>
                    <option value="CONTAINER">Kapal Petikemas (Container)</option>
                    <option value="FAST_FERRY">Kapal Cepat (Fast Boat)</option>
                    <option value="BULK_CARRIER">Curah Kering (Bulk Carrier)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Operasional</label>
                  <select
                    value={vesselForm.status}
                    onChange={(e) => setVesselForm({ ...vesselForm, status: e.target.value as VesselStatus })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="SANDAR">Sandar di Dermaga</option>
                    <option value="BERLAYAR">Sedang Berlayar</option>
                    <option value="PERSIAPAN">Persiapan Muat</option>
                    <option value="DOCKING">Docking / Perawatan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kapasitas Penumpang (Jiwa)</label>
                  <input
                    type="number"
                    min="0"
                    value={vesselForm.passengerCapacity}
                    onChange={(e) => setVesselForm({ ...vesselForm, passengerCapacity: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kapasitas Max DWT (Ton)</label>
                  <input
                    type="number"
                    min="0"
                    value={vesselForm.maxDwtTon}
                    onChange={(e) => setVesselForm({ ...vesselForm, maxDwtTon: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kapasitas Mobil / Truk</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Mobil"
                      value={vesselForm.carCapacity}
                      onChange={(e) => setVesselForm({ ...vesselForm, carCapacity: Number(e.target.value) })}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white"
                    />
                    <input
                      type="number"
                      placeholder="Truk"
                      value={vesselForm.truckCapacity}
                      onChange={(e) => setVesselForm({ ...vesselForm, truckCapacity: Number(e.target.value) })}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Nakhoda / Kapten</label>
                  <input
                    type="text"
                    value={vesselForm.captainName}
                    onChange={(e) => setVesselForm({ ...vesselForm, captainName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Capt. Hendra Gunawan"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bendera Kebangsaan</label>
                  <input
                    type="text"
                    value={vesselForm.flag}
                    onChange={(e) => setVesselForm({ ...vesselForm, flag: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Indonesia"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Panjang LOA (meter)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vesselForm.lengthOverallMeters}
                    onChange={(e) => setVesselForm({ ...vesselForm, lengthOverallMeters: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="120"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Draft Maksimal (meter)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vesselForm.maxDraftMeters}
                    onChange={(e) => setVesselForm({ ...vesselForm, maxDraftMeters: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="4.8"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tahun Pembuatan Kapal</label>
                  <input
                    type="number"
                    value={vesselForm.yearBuilt}
                    onChange={(e) => setVesselForm({ ...vesselForm, yearBuilt: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVesselModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Check className="w-4 h-4" />
                  Simpan Kapal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Port Form */}
      {isPortModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                {editingPort ? 'Edit Pelabuhan' : 'Tambah Pelabuhan Baru'}
              </h3>
              <button onClick={() => setIsPortModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePort} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kode Pelabuhan *</label>
                  <input
                    type="text"
                    required
                    value={portForm.code}
                    onChange={(e) => setPortForm({ ...portForm, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase font-mono"
                    placeholder="e.g. ID-MRK"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Operasional</label>
                  <select
                    value={portForm.operationalStatus}
                    onChange={(e) => setPortForm({ ...portForm, operationalStatus: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="AKTIF">Aktif Normal</option>
                    <option value="PADAT">Padat Antrean</option>
                    <option value="PERBAIKAN">Perbaikan Dermaga</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Pelabuhan *</label>
                <input
                  type="text"
                  required
                  value={portForm.name}
                  onChange={(e) => setPortForm({ ...portForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  placeholder="e.g. Pelabuhan Merak"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kota / Kabupaten</label>
                  <input
                    type="text"
                    value={portForm.city}
                    onChange={(e) => setPortForm({ ...portForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    placeholder="Cilegon"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={portForm.province}
                    onChange={(e) => setPortForm({ ...portForm, province: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    placeholder="Banten"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Panjang Dermaga (m)</label>
                  <input
                    type="number"
                    value={portForm.pierLengthMeters}
                    onChange={(e) => setPortForm({ ...portForm, pierLengthMeters: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kedalaman Draft (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={portForm.draftDepthMeters}
                    onChange={(e) => setPortForm({ ...portForm, draftDepthMeters: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kapasitas Sandar</label>
                  <input
                    type="number"
                    value={portForm.berthCapacity}
                    onChange={(e) => setPortForm({ ...portForm, berthCapacity: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPortModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Check className="w-4 h-4" />
                  Simpan Pelabuhan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Route Form */}
      {isRouteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                {editingRoute ? 'Edit Rute Trayek' : 'Tambah Rute Trayek Baru'}
              </h3>
              <button onClick={() => setIsRouteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRoute} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kode Trayek *</label>
                <input
                  type="text"
                  required
                  value={routeForm.routeCode}
                  onChange={(e) => setRouteForm({ ...routeForm, routeCode: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
                  placeholder="e.g. MRK-BKH-01"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pelabuhan Asal</label>
                  <select
                    value={routeForm.originPortId}
                    onChange={(e) => setRouteForm({ ...routeForm, originPortId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {ports.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pelabuhan Tujuan</label>
                  <select
                    value={routeForm.destinationPortId}
                    onChange={(e) => setRouteForm({ ...routeForm, destinationPortId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {ports.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jarak (Mil Laut / NM)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={routeForm.distanceNm}
                    onChange={(e) => setRouteForm({ ...routeForm, distanceNm: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estimasi Durasi (Jam)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={routeForm.estimatedHours}
                    onChange={(e) => setRouteForm({ ...routeForm, estimatedHours: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tarif Dasar Penumpang (Rp)</label>
                  <input
                    type="number"
                    value={routeForm.baseFareEconomy}
                    onChange={(e) => setRouteForm({ ...routeForm, baseFareEconomy: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tarif Dasar Mobil (Rp)</label>
                  <input
                    type="number"
                    value={routeForm.baseFareVehicle}
                    onChange={(e) => setRouteForm({ ...routeForm, baseFareVehicle: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-purple-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRouteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Check className="w-4 h-4" />
                  Simpan Rute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Category Form */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-cyan-400" />
                {editingCategory ? 'Edit Kategori Muatan' : 'Tambah Kategori Muatan'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kode Golongan *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.code}
                    onChange={(e) => setCategoryForm({ ...categoryForm, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
                    placeholder="e.g. GOL-IV-A"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Satuan Tipe</label>
                  <select
                    value={categoryForm.unitType}
                    onChange={(e) => setCategoryForm({ ...categoryForm, unitType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="KENDARAAN">Unit Kendaraan</option>
                    <option value="TON">Tonase (Ton)</option>
                    <option value="KONTAINER_TEU">Petikemas TEU</option>
                    <option value="M3">Volume (m3)</option>
                    <option value="KOLI">Koli / Pallet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  placeholder="e.g. Golongan IV-A (Mobil Pribadi)"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Deskripsi Muatan</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  placeholder="Deskripsi jenis muatan, dimensi, atau kapasitas mesin"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tarif Dasar (Rp)</label>
                  <input
                    type="number"
                    value={categoryForm.baseTariff}
                    onChange={(e) => setCategoryForm({ ...categoryForm, baseTariff: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Batas Maksimal Berat (Ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={categoryForm.maxWeightTon}
                    onChange={(e) => setCategoryForm({ ...categoryForm, maxWeightTon: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Check className="w-4 h-4" />
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-2xl p-5 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Konfirmasi Hapus Data</h3>
            <p className="text-xs text-slate-300 mt-1">
              Apakah Anda yakin ingin menghapus data <strong className="text-rose-400">"{deleteTarget.name}"</strong>? Aksi ini akan menghapus entitas dari database.
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
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
