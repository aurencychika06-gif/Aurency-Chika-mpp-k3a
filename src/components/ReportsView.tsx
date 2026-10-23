import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Filter,
  Ship,
  Users,
  Package,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import {
  Voyage,
  PassengerManifest,
  CargoManifest,
  Vessel
} from '../types/maritime';

interface ReportsViewProps {
  voyages: Voyage[];
  vessels: Vessel[];
  passengers: PassengerManifest[];
  cargoList: CargoManifest[];
  onOpenOfficialPrintManifest: (voyage: Voyage) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  voyages,
  vessels,
  passengers,
  cargoList,
  onOpenOfficialPrintManifest
}) => {
  const [selectedVoyageId, setSelectedVoyageId] = useState<string>(voyages[0]?.id || '');
  const [reportType, setReportType] = useState<'MANIFEST_RESMI' | 'REKAP_PENDAPATAN' | 'MUATAN_KENDARAAN'>('MANIFEST_RESMI');

  const currentVoyage = voyages.find(v => v.id === selectedVoyageId) || voyages[0];
  const currentVessel = vessels.find(v => v.id === currentVoyage?.vesselId);

  const voyagePassengers = passengers.filter(p => p.voyageId === currentVoyage?.id);
  const voyageCargo = cargoList.filter(c => c.voyageId === currentVoyage?.id);

  // Financial and tonnage metrics for this voyage
  const passengerRevenue = voyagePassengers.reduce((sum, p) => sum + (Number(p.fare) || 0), 0);
  const cargoRevenue = voyageCargo.reduce((sum, c) => sum + (Number(c.totalPrice) || 0), 0);
  const totalVoyageRevenue = passengerRevenue + cargoRevenue;

  const totalCargoWeight = voyageCargo.reduce((sum, c) => sum + (Number(c.weightTon) || 0), 0);
  const vehicleCount = voyageCargo.filter(c => c.plateNumber && c.plateNumber.trim() !== '').length;

  // Export CSV Helper
  const handleExportCsv = () => {
    if (!currentVoyage) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += `LAPORAN MANIFEST RESMI PELAYARAN\n`;
    csvContent += `Nomor Pelayaran,${currentVoyage.voyageNumber}\n`;
    csvContent += `Nama Kapal,${currentVoyage.vesselName}\n`;
    csvContent += `Rute,${currentVoyage.originPortName} - ${currentVoyage.destinationPortName}\n`;
    csvContent += `Waktu Berangkat,${currentVoyage.departureTime}\n\n`;

    csvContent += `--- DAFTAR PENUMPANG ---\n`;
    csvContent += `No,No Tiket,Nama Lengkap,NIK,JK,Usia,Kategori,Kelas,Kursi,Status Boarding,Tarif\n`;
    voyagePassengers.forEach((p, idx) => {
      csvContent += `${idx + 1},${p.ticketNumber},"${p.fullName}","${p.identityNumber}",${p.gender},${p.age},${p.category},${p.cabinClass},${p.seatNumber},${p.checkInStatus},${p.fare}\n`;
    });

    csvContent += `\n--- DAFTAR MUATAN KARGO & KENDARAAN ---\n`;
    csvContent += `No,No BL,Deskripsi,Plat Nomor,Kategori,Berat (Ton),Lokasi Dek,Pengirim,Penerima,Status Pemuatan,Total Biaya\n`;
    voyageCargo.forEach((c, idx) => {
      csvContent += `${idx + 1},${c.blNumber},"${c.itemDescription}","${c.plateNumber || '-'}",${c.categoryName},${c.weightTon},${c.deckLocation},"${c.shipperName}","${c.consigneeName}",${c.loadingStatus},${c.totalPrice}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Manifest_${currentVoyage.voyageNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-cyan-400" />
            Laporan & Manifest Pelayaran Resmi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Format laporan standar Otoritas Pelabuhan & Kesyahbandaran untuk persetujuan berlayar (Port Clearance).
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            Export CSV
          </button>
          <button
            onClick={() => onOpenOfficialPrintManifest(currentVoyage)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Manifest Resmi (Print View)
          </button>
        </div>
      </div>

      {/* Filter and Selection Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 shrink-0">
              <Filter className="w-4 h-4 text-cyan-400" />
              Pilih Jadwal Pelayaran:
            </span>
            <select
              value={selectedVoyageId}
              onChange={(e) => setSelectedVoyageId(e.target.value)}
              className="w-full sm:w-80 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
            >
              {voyages.map(v => (
                <option key={v.id} value={v.id}>
                  {v.voyageNumber} - {v.vesselName} ({v.originPortName} ➔ {v.destinationPortName})
                </option>
              ))}
            </select>
          </div>

          {/* Report Tab Filters */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setReportType('MANIFEST_RESMI')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                reportType === 'MANIFEST_RESMI' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Manifest Lengkap
            </button>
            <button
              onClick={() => setReportType('REKAP_PENDAPATAN')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                reportType === 'REKAP_PENDAPATAN' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Rekapitulasi Keuangan
            </button>
            <button
              onClick={() => setReportType('MUATAN_KENDARAAN')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                reportType === 'MUATAN_KENDARAAN' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Manifest Kendaraan & Kargo
            </button>
          </div>
        </div>
      </div>

      {/* Voyage Overview Header Card */}
      {currentVoyage && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Armada Kapal & Nakhoda</span>
              <span className="text-sm font-bold text-white block mt-0.5">{currentVoyage.vesselName}</span>
              <span className="text-[11px] text-cyan-400 block mt-0.5">Nakhoda: {currentVessel?.captainName}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Rute Pelayaran</span>
              <span className="text-sm font-bold text-slate-100 block mt-0.5">
                {currentVoyage.originPortName} ➔ {currentVoyage.destinationPortName}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Dermaga: {currentVoyage.berthPier}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Total Muatan & Penumpang</span>
              <span className="text-sm font-bold text-purple-400 block mt-0.5">
                {totalCargoWeight} Ton / {voyagePassengers.length} Jiwa
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">{vehicleCount} Unit Kendaraan di Dek</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[11px] text-slate-400 block">Total Penerimaan Voyage</span>
              <span className="text-sm font-bold text-emerald-400 block mt-0.5">
                Rp {totalVoyageRevenue.toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Status: Lunas & Terverifikasi</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Report View: Official Syahbandar Layout */}
      {reportType === 'MANIFEST_RESMI' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 text-center">
            <h2 className="text-base font-extrabold text-white tracking-wide uppercase">
              KEMENTERIAN PERHUBUNGAN DIREKTORAT JENDERAL PERHUBUNGAN LAUT
            </h2>
            <h3 className="text-sm font-semibold text-cyan-400 uppercase mt-0.5">
              SURAT MANIFEST PENUMPANG DAN MUATAN KAPAL
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Nomor Keberangkatan: {currentVoyage?.voyageNumber} | Surat Persetujuan Berlayar: {currentVoyage?.spbApprovalNumber}
            </p>
          </div>

          {/* Section A: Passenger Manifest Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <Users className="w-4 h-4 text-cyan-400" />
                BAGIAN I: MANIFEST PENUMPANG TERDAFTAR ({voyagePassengers.length} ORANG)
              </h4>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-3 py-2.5">No</th>
                    <th className="px-3 py-2.5">No Tiket</th>
                    <th className="px-3 py-2.5">Nama Lengkap</th>
                    <th className="px-3 py-2.5">NIK / Identitas</th>
                    <th className="px-3 py-2.5">JK</th>
                    <th className="px-3 py-2.5">Usia</th>
                    <th className="px-3 py-2.5">Kategori</th>
                    <th className="px-3 py-2.5">Kelas</th>
                    <th className="px-3 py-2.5">Kursi</th>
                    <th className="px-3 py-2.5">Status Boarding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {voyagePassengers.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="px-3 py-2 text-slate-500">{idx + 1}</td>
                      <td className="px-3 py-2 font-mono text-cyan-400 font-semibold">{p.ticketNumber}</td>
                      <td className="px-3 py-2 font-bold text-white">{p.fullName}</td>
                      <td className="px-3 py-2 font-mono text-slate-400">{p.identityNumber}</td>
                      <td className="px-3 py-2">{p.gender}</td>
                      <td className="px-3 py-2">{p.age} th</td>
                      <td className="px-3 py-2">{p.category}</td>
                      <td className="px-3 py-2 font-medium text-amber-300">{p.cabinClass}</td>
                      <td className="px-3 py-2 font-mono">{p.seatNumber}</td>
                      <td className="px-3 py-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.checkInStatus === 'CHECKED_IN'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {p.checkInStatus === 'CHECKED_IN' ? 'BOARDED' : 'BELUM'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {voyagePassengers.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-6 text-center text-slate-500">
                        Belum ada penumpang terdaftar pada pelayaran ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section B: Cargo and Vehicles Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <Package className="w-4 h-4 text-purple-400" />
                BAGIAN II: MANIFEST MUATAN KARGO & KENDARAAN ({voyageCargo.length} KOLI / UNIT)
              </h4>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-3 py-2.5">No</th>
                    <th className="px-3 py-2.5">No Resi / BL</th>
                    <th className="px-3 py-2.5">Deskripsi Muatan</th>
                    <th className="px-3 py-2.5">Plat Nomor</th>
                    <th className="px-3 py-2.5">Kategori</th>
                    <th className="px-3 py-2.5">Berat (Ton)</th>
                    <th className="px-3 py-2.5">Lokasi Dek</th>
                    <th className="px-3 py-2.5">Pengirim</th>
                    <th className="px-3 py-2.5">Penerima</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {voyageCargo.map((c, idx) => (
                    <tr key={c.id} className="hover:bg-slate-800/40">
                      <td className="px-3 py-2 text-slate-500">{idx + 1}</td>
                      <td className="px-3 py-2 font-mono text-purple-400 font-semibold">{c.blNumber}</td>
                      <td className="px-3 py-2 font-bold text-white">{c.itemDescription}</td>
                      <td className="px-3 py-2 font-mono text-amber-300">{c.plateNumber || '-'}</td>
                      <td className="px-3 py-2">{c.categoryName}</td>
                      <td className="px-3 py-2 font-semibold text-white">{c.weightTon} Ton</td>
                      <td className="px-3 py-2 font-mono text-cyan-400">{c.deckLocation}</td>
                      <td className="px-3 py-2">{c.shipperName}</td>
                      <td className="px-3 py-2">{c.consigneeName}</td>
                      <td className="px-3 py-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          {c.loadingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {voyageCargo.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-6 text-center text-slate-500">
                        Belum ada muatan kargo/kendaraan pada pelayaran ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Signatures Block */}
          <div className="pt-6 border-t border-slate-800 grid grid-cols-2 text-center text-xs text-slate-300">
            <div>
              <p className="text-slate-400">Mengetahui & Menyetujui,</p>
              <p className="font-bold text-white mt-1">Nakhoda Kapal (Master of Vessel)</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-slate-600 italic text-[11px]">[Tanda Tangan Elektronik Nakhoda]</span>
              </div>
              <p className="font-semibold text-cyan-400 underline">{currentVessel?.captainName || 'Capt. Nakhoda'}</p>
              <p className="text-[10px] text-slate-500">M.Mar / Perwira Dek 1</p>
            </div>

            <div>
              <p className="text-slate-400">Diverifikasi Oleh,</p>
              <p className="font-bold text-white mt-1">Petugas Syahbandar Pelabuhan</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-slate-600 italic text-[11px]">[Stempel Basah KSOP Pelabuhan]</span>
              </div>
              <p className="font-semibold text-emerald-400 underline">Capt. Rahmat Hidayat, M.Mar</p>
              <p className="text-[10px] text-slate-500">NIP: 19820415 200501 1 002</p>
            </div>
          </div>
        </div>
      )}

      {/* Report 2: Financial Recap */}
      {reportType === 'REKAP_PENDAPATAN' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <h3 className="text-base font-bold text-white">Rekapitulasi Finansial Pelayaran {currentVoyage?.voyageNumber}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Pendapatan Tiket Penumpang</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">
                Rp {passengerRevenue.toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">{voyagePassengers.length} Tiket Terbit</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Pendapatan Muatan Kendaraan & Kargo</span>
              <p className="text-xl font-bold text-purple-400 mt-1">
                Rp {cargoRevenue.toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">{voyageCargo.length} Bill of Lading (BL)</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Total Bruto Operasional</span>
              <p className="text-xl font-bold text-cyan-400 mt-1">
                Rp {totalVoyageRevenue.toLocaleString('id-ID')}
              </p>
              <p className="text-[11px] text-emerald-400 mt-1">Status: Lunas 100%</p>
            </div>
          </div>
        </div>
      )}

      {/* Report 3: Vehicles & Cargo Summary */}
      {reportType === 'MUATAN_KENDARAAN' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <h3 className="text-base font-bold text-white">Ringkasan Beban Car Deck & Palka Kapal</h3>
          <p className="text-xs text-slate-400">
            Total muatan aktif pada kapal {currentVoyage?.vesselName} adalah {totalCargoWeight} Tonase Deadweight.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">Total Kendaraan</span>
              <p className="text-lg font-bold text-white mt-1">{vehicleCount} Unit</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">Total Berat Tonase</span>
              <p className="text-lg font-bold text-purple-400 mt-1">{totalCargoWeight} Ton</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">Muatan Berbahaya (DG)</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">
                {voyageCargo.filter(c => c.hazardousGoods).length} Item
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400">Batas Muatan Kapal (DWT)</span>
              <p className="text-lg font-bold text-cyan-400 mt-1">{currentVessel?.maxDwtTon} Ton</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
