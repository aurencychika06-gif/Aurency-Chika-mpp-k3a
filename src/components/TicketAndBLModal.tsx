import React from 'react';
import { X, Printer, QrCode, Ship, CheckCircle2, Package, User } from 'lucide-react';
import { PassengerManifest, CargoManifest } from '../types/maritime';

interface TicketAndBLModalProps {
  isOpen: boolean;
  onClose: () => void;
  passenger?: PassengerManifest | null;
  cargo?: CargoManifest | null;
}

export const TicketAndBLModal: React.FC<TicketAndBLModalProps> = ({
  isOpen,
  onClose,
  passenger,
  cargo
}) => {
  if (!isOpen || (!passenger && !cargo)) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-7 print:p-0 print:shadow-none print:w-full">
        {/* Top actions */}
        <div className="no-print flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {passenger ? 'Boarding Pass Penumpang Kapal' : 'Surat Muatan Kapal (Bill of Lading)'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Boarding Pass Layout */}
        {passenger && (
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Ship className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight text-blue-950">BOARDING PASS</h3>
                  <p className="text-[10px] text-slate-500">{passenger.vesselName}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-blue-700">{passenger.ticketNumber}</span>
                <span className="block text-[9px] text-emerald-600 font-bold uppercase">{passenger.checkInStatus}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-4">
              <div>
                <span className="text-[10px] text-slate-400 block">Nama Penumpang</span>
                <strong className="text-sm text-slate-900 block">{passenger.fullName}</strong>
                <span className="text-[10px] text-slate-500 font-mono">NIK: {passenger.identityNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Kelas & Kursi</span>
                <strong className="text-sm text-blue-700 block">{passenger.cabinClass} - Kursi {passenger.seatNumber}</strong>
                <span className="text-[10px] text-slate-500">Kategori: {passenger.category} ({passenger.age} th)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-200 pt-3">
              <div>
                <span className="text-[10px] text-slate-400 block">Pelayaran (Voyage)</span>
                <strong className="text-xs text-slate-800">{passenger.voyageNumber}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Tarif Tiket</span>
                <strong className="text-xs text-emerald-700">Rp {passenger.fare.toLocaleString('id-ID')} (LUNAS)</strong>
              </div>
            </div>

            {/* QR and Barcode Simulation */}
            <div className="mt-4 pt-3 border-t border-dashed border-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-12 h-12 text-slate-800" />
                <div className="text-[9px] text-slate-500 leading-tight">
                  <p className="font-bold text-slate-700">Validasi Boarding Gate</p>
                  <p>Tunjukkan tiket ini dan identitas asli kepada petugas pelabuhan.</p>
                </div>
              </div>
              <div className="text-right font-mono text-[9px] text-slate-400">
                VERIFIED BY SYAHBANDAR
              </div>
            </div>
          </div>
        )}

        {/* Cargo / BL Layout */}
        {cargo && (
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight text-purple-950">BILL OF LADING (BL)</h3>
                  <p className="text-[10px] text-slate-500">Surat Muatan Kapal Laut</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-purple-700">{cargo.blNumber}</span>
                <span className="block text-[9px] text-emerald-600 font-bold uppercase">{cargo.loadingStatus}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs mb-4">
              <div>
                <span className="text-[10px] text-slate-400 block">Uraian Barang Muatan</span>
                <strong className="text-sm text-slate-900 block">{cargo.itemDescription}</strong>
                {cargo.plateNumber && (
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
                    PLAT KENDARAAN: {cargo.plateNumber}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-slate-200 pt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Kategori</span>
                  <strong className="text-slate-800">{cargo.categoryName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Berat / Volume</span>
                  <strong className="text-purple-700">{cargo.weightTon} Ton ({cargo.volumeM3} m3)</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Lokasi Dek</span>
                  <strong className="text-slate-800">{cargo.deckLocation}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Pengirim (Shipper)</span>
                  <strong className="text-slate-800">{cargo.shipperName}</strong>
                  <span className="text-[10px] text-slate-500 block">{cargo.shipperPhone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Penerima (Consignee)</span>
                  <strong className="text-slate-800">{cargo.consigneeName}</strong>
                  <span className="text-[10px] text-slate-500 block">{cargo.consigneePhone}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Kapal & Voyage</span>
                  <strong className="text-xs text-slate-800">{cargo.vesselName} ({cargo.voyageNumber})</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Total Biaya Angkut</span>
                  <strong className="text-sm text-emerald-700">Rp {cargo.totalPrice.toLocaleString('id-ID')}</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-slate-300 flex items-center justify-between">
              <QrCode className="w-12 h-12 text-slate-800" />
              <div className="text-right text-[9px] text-slate-400">
                <p>Cap Pengesahan Muatan Palka</p>
                <p className="font-bold text-slate-600">SYAHBANDAR PELABUHAN</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
