/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { MasterDataView } from './components/MasterDataView';
import { TransactionsView } from './components/TransactionsView';
import { ReportsView } from './components/ReportsView';
import { DatabaseConnectorView } from './components/DatabaseConnectorView';
import { LoginModal } from './components/LoginModal';
import { OfficialPrintManifestModal } from './components/OfficialPrintManifestModal';
import { TicketAndBLModal } from './components/TicketAndBLModal';
import { AssignmentUrlModal } from './components/AssignmentUrlModal';

import { maritimeService } from './services/dataService';
import {
  AdminUser,
  Vessel,
  Port,
  Route,
  CargoCategory,
  Voyage,
  PassengerManifest,
  CargoManifest,
  DatabaseConnectionConfig
} from './types/maritime';
import { ShieldCheck, Anchor, Waves, Radio, Bell, X, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'master' | 'transaksi' | 'laporan' | 'database'>('dashboard');

  // Maritime Data states
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [cargoCategories, setCargoCategories] = useState<CargoCategory[]>([]);
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [passengers, setPassengers] = useState<PassengerManifest[]>([]);
  const [cargoList, setCargoList] = useState<CargoManifest[]>([]);
  const [dbConfig, setDbConfig] = useState<DatabaseConnectionConfig>(maritimeService.getDbConfig());

  // Print modals
  const [printManifestVoyage, setPrintManifestVoyage] = useState<Voyage | null>(null);
  const [isManifestPrintOpen, setIsManifestPrintOpen] = useState(false);

  const [activePrintTicket, setActivePrintTicket] = useState<PassengerManifest | null>(null);
  const [activePrintBL, setActivePrintBL] = useState<CargoManifest | null>(null);
  const [isTicketBLModalOpen, setIsTicketBLModalOpen] = useState(false);
  const [autoOpenAddVessel, setAutoOpenAddVessel] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [realtimeToast, setRealtimeToast] = useState<{ title: string; message: string; timestamp: number } | null>(null);

  // Load initial data
  const loadData = () => {
    setVessels(maritimeService.getVessels());
    setPorts(maritimeService.getPorts());
    setRoutes(maritimeService.getRoutes());
    setCargoCategories(maritimeService.getCargoCategories());
    setVoyages(maritimeService.getVoyages());
    setPassengers(maritimeService.getPassengers());
    setCargoList(maritimeService.getCargoList());
    setDbConfig(maritimeService.getDbConfig());
  };

  useEffect(() => {
    loadData();
    // Default logged in user for immediate experience or check localStorage
    const savedUser = maritimeService.getCurrentUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    } else {
      // Auto-login super admin for testing convenience
      const defaultAdmin = maritimeService.switchDemoUser('super_admin');
      setCurrentUser(defaultAdmin);
    }

    // Real-Time Cross-Tab & Multi-Client Listener
    const unsubscribe = maritimeService.subscribeRealtime((event) => {
      loadData();
      if (event.key === 'maritim_vessels') {
        setRealtimeToast({
          title: 'Radar AIS & Data Armada',
          message: 'Data kapal baru disinkronkan secara real-time ke seluruh sistem!',
          timestamp: Date.now()
        });
      } else if (event.key === 'maritim_voyages') {
        setRealtimeToast({
          title: 'Pergerakan Jadwal Kapal',
          message: 'Status pelayaran kapal diperbarui secara real-time!',
          timestamp: Date.now()
        });
      } else if (event.key === 'maritim_passengers' || event.key === 'maritim_cargo') {
        setRealtimeToast({
          title: 'Manifest Muatan Real-Time',
          message: 'Data manifest muatan/penumpang kapal telah disinkronkan!',
          timestamp: Date.now()
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Auto dismiss toast
  useEffect(() => {
    if (realtimeToast) {
      const timer = setTimeout(() => {
        setRealtimeToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [realtimeToast]);

  // CRUD Handlers for Vessels
  const handleAddVessel = (v: Omit<Vessel, 'id'>) => {
    const added = maritimeService.addVessel(v);
    loadData();
    setRealtimeToast({
      title: 'Kapal Baru Terdaftar di Radar AIS',
      message: `Kapal "${added.name}" (${added.callSign}) aktif dan disinkronkan ke seluruh armada!`,
      timestamp: Date.now()
    });
  };
  const handleUpdateVessel = (id: string, v: Partial<Vessel>) => {
    maritimeService.updateVessel(id, v);
    loadData();
    setRealtimeToast({
      title: 'Data Kapal Diperbarui',
      message: `Spesifikasi armada berhasil diupdate secara real-time!`,
      timestamp: Date.now()
    });
  };
  const handleDeleteVessel = (id: string) => {
    maritimeService.deleteVessel(id);
    loadData();
    setRealtimeToast({
      title: 'Armada Kapal Dihapus',
      message: 'Kapal telah dikeluarkan dari daftar operasi radar.',
      timestamp: Date.now()
    });
  };

  // CRUD Handlers for Ports
  const handleAddPort = (p: Omit<Port, 'id'>) => {
    maritimeService.addPort(p);
    loadData();
  };
  const handleUpdatePort = (id: string, p: Partial<Port>) => {
    maritimeService.updatePort(id, p);
    loadData();
  };
  const handleDeletePort = (id: string) => {
    maritimeService.deletePort(id);
    loadData();
  };

  // CRUD Handlers for Routes
  const handleAddRoute = (r: Omit<Route, 'id'>) => {
    maritimeService.addRoute(r);
    loadData();
  };
  const handleUpdateRoute = (id: string, r: Partial<Route>) => {
    maritimeService.updateRoute(id, r);
    loadData();
  };
  const handleDeleteRoute = (id: string) => {
    maritimeService.deleteRoute(id);
    loadData();
  };

  // CRUD Handlers for Cargo Categories
  const handleAddCargoCategory = (c: Omit<CargoCategory, 'id'>) => {
    maritimeService.addCargoCategory(c);
    loadData();
  };
  const handleUpdateCargoCategory = (id: string, c: Partial<CargoCategory>) => {
    maritimeService.updateCargoCategory(id, c);
    loadData();
  };
  const handleDeleteCargoCategory = (id: string) => {
    maritimeService.deleteCargoCategory(id);
    loadData();
  };

  // CRUD Handlers for Voyages
  const handleAddVoyage = (v: Omit<Voyage, 'id'>) => {
    maritimeService.addVoyage(v);
    loadData();
  };
  const handleUpdateVoyage = (id: string, v: Partial<Voyage>) => {
    maritimeService.updateVoyage(id, v);
    loadData();
  };
  const handleDeleteVoyage = (id: string) => {
    maritimeService.deleteVoyage(id);
    loadData();
  };

  // CRUD Handlers for Passengers
  const handleAddPassenger = (p: Omit<PassengerManifest, 'id' | 'ticketNumber' | 'registeredAt'>) => {
    maritimeService.addPassenger(p);
    loadData();
  };
  const handleUpdatePassenger = (id: string, p: Partial<PassengerManifest>) => {
    maritimeService.updatePassenger(id, p);
    loadData();
  };
  const handleDeletePassenger = (id: string) => {
    maritimeService.deletePassenger(id);
    loadData();
  };
  const handleTogglePassengerCheckIn = (id: string) => {
    maritimeService.togglePassengerCheckIn(id);
    loadData();
  };

  // CRUD Handlers for Cargo & Vehicles
  const handleAddCargo = (c: Omit<CargoManifest, 'id' | 'blNumber' | 'registeredAt'>) => {
    maritimeService.addCargo(c);
    loadData();
  };
  const handleUpdateCargo = (id: string, c: Partial<CargoManifest>) => {
    maritimeService.updateCargo(id, c);
    loadData();
  };
  const handleDeleteCargo = (id: string) => {
    maritimeService.deleteCargo(id);
    loadData();
  };
  const handleUpdateCargoLoadingStatus = (id: string, status: 'DI_DERMAGA' | 'DIMUAT' | 'DIBONGKAR') => {
    maritimeService.updateCargoLoadingStatus(id, status);
    loadData();
  };

  // DB Config update
  const handleUpdateDbConfig = (cfg: Partial<DatabaseConnectionConfig>) => {
    const updated = maritimeService.updateDbConfig(cfg);
    setDbConfig(updated);
  };

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('Reset seluruh data kapal, rute, kargo, dan manifest ke data simulasi awal?')) {
      maritimeService.resetToInitial();
      loadData();
      alert('Data operasional kapal dan manifest telah dikembalikan ke kondisi awal.');
    }
  };

  // Auth roles
  const handleSwitchRole = (role: 'super_admin' | 'operator_pelabuhan' | 'kasir_tiket') => {
    const user = maritimeService.switchDemoUser(role);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    maritimeService.logout();
    setCurrentUser(null);
    setIsLoginModalOpen(true);
  };

  // Print handlers
  const handleOpenPrintManifest = (voyage: Voyage) => {
    setPrintManifestVoyage(voyage);
    setIsManifestPrintOpen(true);
  };

  const handlePrintTicket = (p: PassengerManifest) => {
    setActivePrintTicket(p);
    setActivePrintBL(null);
    setIsTicketBLModalOpen(true);
  };

  const handlePrintBL = (c: CargoManifest) => {
    setActivePrintBL(c);
    setActivePrintTicket(null);
    setIsTicketBLModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeDbProvider={dbConfig.activeProvider}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onSwitchRole={handleSwitchRole}
        onResetData={handleResetData}
        onOpenAssignmentModal={() => setIsAssignmentModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            vessels={vessels}
            voyages={voyages}
            passengers={passengers}
            cargoList={cargoList}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenNewVesselModal={() => {
              setActiveTab('master');
              setAutoOpenAddVessel(true);
            }}
            onOpenNewVoyageModal={() => {
              setActiveTab('transaksi');
            }}
            onOpenNewCargoModal={() => {
              setActiveTab('transaksi');
            }}
            onOpenNewPassengerModal={() => {
              setActiveTab('transaksi');
            }}
            onOpenAssignmentModal={() => setIsAssignmentModalOpen(true)}
          />
        )}

        {activeTab === 'master' && (
          <MasterDataView
            vessels={vessels}
            ports={ports}
            routes={routes}
            cargoCategories={cargoCategories}
            onAddVessel={handleAddVessel}
            onUpdateVessel={handleUpdateVessel}
            onDeleteVessel={handleDeleteVessel}
            onAddPort={handleAddPort}
            onUpdatePort={handleUpdatePort}
            onDeletePort={handleDeletePort}
            onAddRoute={handleAddRoute}
            onUpdateRoute={handleUpdateRoute}
            onDeleteRoute={handleDeleteRoute}
            onAddCargoCategory={handleAddCargoCategory}
            onUpdateCargoCategory={handleUpdateCargoCategory}
            onDeleteCargoCategory={handleDeleteCargoCategory}
            autoOpenAddVessel={autoOpenAddVessel}
            onResetAutoOpen={() => setAutoOpenAddVessel(false)}
          />
        )}

        {activeTab === 'transaksi' && (
          <TransactionsView
            voyages={voyages}
            passengers={passengers}
            cargoList={cargoList}
            vessels={vessels}
            routes={routes}
            cargoCategories={cargoCategories}
            onAddVoyage={handleAddVoyage}
            onUpdateVoyage={handleUpdateVoyage}
            onDeleteVoyage={handleDeleteVoyage}
            onAddPassenger={handleAddPassenger}
            onUpdatePassenger={handleUpdatePassenger}
            onDeletePassenger={handleDeletePassenger}
            onTogglePassengerCheckIn={handleTogglePassengerCheckIn}
            onAddCargo={handleAddCargo}
            onUpdateCargo={handleUpdateCargo}
            onDeleteCargo={handleDeleteCargo}
            onUpdateCargoLoadingStatus={handleUpdateCargoLoadingStatus}
            onPrintTicket={handlePrintTicket}
            onPrintBL={handlePrintBL}
          />
        )}

        {activeTab === 'laporan' && (
          <ReportsView
            voyages={voyages}
            vessels={vessels}
            passengers={passengers}
            cargoList={cargoList}
            onOpenOfficialPrintManifest={handleOpenPrintManifest}
          />
        )}

        {activeTab === 'database' && (
          <DatabaseConnectorView
            dbConfig={dbConfig}
            onUpdateDbConfig={handleUpdateDbConfig}
            onRefreshData={loadData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-slate-900 border-t border-slate-800 text-xs text-slate-400 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Anchor className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">
              SIM-KAPAL Hub &copy; {new Date().getFullYear()}
            </span>
            <span className="text-slate-600">|</span>
            <span>Sistem Informasi Muatan Kapal & Manifest Penumpang</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Real Database Synced
            </span>
            <span>Didukung: Supabase &bull; Neon DB &bull; Firebase</span>
          </div>
        </div>
      </footer>

      {/* Real-Time AIS Radar Toast Notification */}
      {realtimeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900/95 border border-cyan-500/50 rounded-2xl shadow-2xl p-4 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  {realtimeToast.title}
                </span>
                <button
                  onClick={() => setRealtimeToast(null)}
                  className="text-slate-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-snug">
                {realtimeToast.message}
              </p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-cyan-400 font-mono">
                <span>Real-Time AIS Synchronized</span>
                <span>Baru saja</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />

      <OfficialPrintManifestModal
        isOpen={isManifestPrintOpen}
        onClose={() => setIsManifestPrintOpen(false)}
        voyage={printManifestVoyage}
        vessel={vessels.find(v => v.id === printManifestVoyage?.vesselId)}
        passengers={passengers}
        cargoList={cargoList}
      />

      <TicketAndBLModal
        isOpen={isTicketBLModalOpen}
        onClose={() => setIsTicketBLModalOpen(false)}
        passenger={activePrintTicket}
        cargo={activePrintBL}
      />

      <AssignmentUrlModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
      />
    </div>
  );
}
