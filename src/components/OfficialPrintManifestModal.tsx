import React from 'react';
import { X, Printer, Ship, Anchor, CheckCircle2 } from 'lucide-react';
import { Voyage, Vessel, PassengerManifest, CargoManifest } from '../types/maritime';

interface OfficialPrintManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  voyage: Voyage | null;
  vessel: Vessel | undefined;
  passengers: PassengerManifest[];
  cargoList: CargoManifest[];
}

export const OfficialPrintManifestModal: React.FC<OfficialPrintManifestModalProps> = ({
  isOpen,
  onClose,
  voyage,
  vessel,
  passengers,
  cargoList
}) => {
  if (!isOpen || !voyage) return null;

  const voyagePassengers = passengers.filter(p => p.voyageId === voyage.id);
  const voyageCargo = cargoList.filter(c => c.voyageId === voyage.id);
  const totalCargoWeight = voyageCargo.reduce((acc, c) => acc + (Number(c.weightTon) || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 print:p-0 print:m-0 print:shadow-none print:w-full print:max-w-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold uppercase">
              Dokumen Resmi Pelabuhan
            </span>
            <span className="text-xs text-slate-500">
              Format Standar Perhubungan Laut / Syahbandar
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition"
            >
              <Printer className="w-4 h-4" />
              Cetak Dokumen Sekarang (Print)
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Content */}
        <div className="space-y-6 text-xs text-slate-800 font-sans print:text-black">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-black pb-4">
            <h1 className="text-sm font-extrabold tracking-wider uppercase">
              REPUBLIK INDONESIA
            </h1>
            <h2 className="text-base font-extrabold uppercase mt-0.5">
              KEMENTERIAN PERHUBUNGAN - DIREKTORAT JENDERAL PERHUBUNGAN LAUT
            </h2>
            <h3 className="text-xs font-semibold uppercase mt-0.5">
              KANTOR KESYAHBANDARAN DAN OTORITAS PELABUHAN
            </h3>
            <p className="text-[10px] text-slate-600 mt-1">
              SURAT MANIFEST MUATAN KAPAL DAN PENUMPANG (OUTWARD MANIFEST)
            </p>
          </div>

          {/* Voyage and Ship Identity Details */}
          <div className="grid grid-cols-2 gap-4 border border-slate-300 p-3 rounded-lg text-[11px] bg-slate-50 print:bg-transparent">
            <div className="space-y-1">
              <div><strong>Nama Kapal:</strong> {voyage.vesselName} ({vessel?.type || 'RORO'})</div>
              <div><strong>Call Sign / Tanda Panggilan:</strong> {vessel?.callSign || '-'}</div>
              <div><strong>Nomor IMO / MMSI:</strong> {vessel?.imoNumber || '-'}</div>
              <div><strong>Bendera Kebangsaan:</strong> {vessel?.flag || 'Indonesia'}</div>
              <div><strong>Nama Nakhoda (Master):</strong> {vessel?.captainName || '-'}</div>
            </div>
            <div className="space-y-1">
              <div><strong>Nomor Keberangkatan (Voyage):</strong> {voyage.voyageNumber}</div>
              <div><strong>Pelabuhan Asal ➔ Tujuan:</strong> {voyage.originPortName} ➔ {voyage.destinationPortName}</div>
              <div><strong>Waktu Berangkat (ETD):</strong> {new Date(voyage.departureTime).toLocaleString('id-ID')}</div>
              <div><strong>Dermaga Keberangkatan:</strong> {voyage.berthPier}</div>
              <div><strong>No. SPB (Surat Persetujuan Berlayar):</strong> {voyage.spbApprovalNumber}</div>
            </div>
          </div>

          {/* Table 1: Passenger Manifest */}
          <div>
            <h4 className="font-bold text-xs uppercase mb-2 border-b border-black pb-1">
              I. DAFTAR MANIFEST PENUMPANG (TOTAL: {voyagePassengers.length} JIWA)
            </h4>
            <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
              <thead className="bg-slate-100 print:bg-slate-200">
                <tr>
                  <th className="border border-slate-300 px-2 py-1.5">No</th>
                  <th className="border border-slate-300 px-2 py-1.5">Nomor Tiket</th>
                  <th className="border border-slate-300 px-2 py-1.5">Nama Penumpang</th>
                  <th className="border border-slate-300 px-2 py-1.5">NIK / Identitas</th>
                  <th className="border border-slate-300 px-2 py-1.5">JK</th>
                  <th className="border border-slate-300 px-2 py-1.5">Usia</th>
                  <th className="border border-slate-300 px-2 py-1.5">Kelas</th>
                  <th className="border border-slate-300 px-2 py-1.5">Kursi</th>
                  <th className="border border-slate-300 px-2 py-1.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {voyagePassengers.map((p, idx) => (
                  <tr key={p.id}>
                    <td className="border border-slate-300 px-2 py-1 text-center">{idx + 1}</td>
                    <td className="border border-slate-300 px-2 py-1 font-mono font-semibold">{p.ticketNumber}</td>
                    <td className="border border-slate-300 px-2 py-1 font-bold">{p.fullName}</td>
                    <td className="border border-slate-300 px-2 py-1 font-mono">{p.identityNumber}</td>
                    <td className="border border-slate-300 px-2 py-1 text-center">{p.gender}</td>
                    <td className="border border-slate-300 px-2 py-1 text-center">{p.age}</td>
                    <td className="border border-slate-300 px-2 py-1">{p.cabinClass}</td>
                    <td className="border border-slate-300 px-2 py-1 font-mono">{p.seatNumber}</td>
                    <td className="border border-slate-300 px-2 py-1">{p.checkInStatus}</td>
                  </tr>
                ))}
                {voyagePassengers.length === 0 && (
                  <tr>
                    <td colSpan={9} className="border border-slate-300 px-2 py-3 text-center text-slate-500">
                      Nihil penumpang terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table 2: Cargo Manifest */}
          <div>
            <h4 className="font-bold text-xs uppercase mb-2 border-b border-black pb-1">
              II. DAFTAR MANIFEST MUATAN KAPAL & KENDARAAN (TOTAL: {totalCargoWeight} TON)
            </h4>
            <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
              <thead className="bg-slate-100 print:bg-slate-200">
                <tr>
                  <th className="border border-slate-300 px-2 py-1.5">No</th>
                  <th className="border border-slate-300 px-2 py-1.5">Nomor BL</th>
                  <th className="border border-slate-300 px-2 py-1.5">Uraian / Deskripsi Muatan</th>
                  <th className="border border-slate-300 px-2 py-1.5">Plat Nomor</th>
                  <th className="border border-slate-300 px-2 py-1.5">Kategori</th>
                  <th className="border border-slate-300 px-2 py-1.5">Berat (Ton)</th>
                  <th className="border border-slate-300 px-2 py-1.5">Palka / Dek</th>
                  <th className="border border-slate-300 px-2 py-1.5">Pengirim</th>
                  <th className="border border-slate-300 px-2 py-1.5">Penerima</th>
                </tr>
              </thead>
              <tbody>
                {voyageCargo.map((c, idx) => (
                  <tr key={c.id}>
                    <td className="border border-slate-300 px-2 py-1 text-center">{idx + 1}</td>
                    <td className="border border-slate-300 px-2 py-1 font-mono font-semibold">{c.blNumber}</td>
                    <td className="border border-slate-300 px-2 py-1 font-bold">{c.itemDescription}</td>
                    <td className="border border-slate-300 px-2 py-1 font-mono">{c.plateNumber || '-'}</td>
                    <td className="border border-slate-300 px-2 py-1">{c.categoryName}</td>
                    <td className="border border-slate-300 px-2 py-1 text-right font-semibold">{c.weightTon} Ton</td>
                    <td className="border border-slate-300 px-2 py-1">{c.deckLocation}</td>
                    <td className="border border-slate-300 px-2 py-1">{c.shipperName}</td>
                    <td className="border border-slate-300 px-2 py-1">{c.consigneeName}</td>
                  </tr>
                ))}
                {voyageCargo.length === 0 && (
                  <tr>
                    <td colSpan={9} className="border border-slate-300 px-2 py-3 text-center text-slate-500">
                      Nihil muatan kargo/kendaraan terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Validation & Port Authority Endorsement */}
          <div className="pt-6 border-t-2 border-slate-400 grid grid-cols-2 text-center text-[11px] gap-6">
            <div>
              <p>Dinyatakan Benar Oleh,</p>
              <p className="font-bold mt-0.5">Nakhoda Kapal (Master)</p>
              <div className="h-14 flex items-center justify-center text-slate-400 italic">
                (Tanda Tangan & Cap Kapal)
              </div>
              <p className="font-bold underline">{vessel?.captainName || 'Capt. Nakhoda'}</p>
              <p className="text-[10px] text-slate-500">M.Mar</p>
            </div>

            <div>
              <p>Disahkan & Diizinkan Berlayar,</p>
              <p className="font-bold mt-0.5">Syahbandar / Otoritas Pelabuhan</p>
              <div className="h-14 flex items-center justify-center text-slate-400 italic">
                (Tanda Tangan & Cap Jabatan)
              </div>
              <p className="font-bold underline">Capt. Rahmat Hidayat, M.Mar</p>
              <p className="text-[10px] text-slate-500">NIP: 19820415 200501 1 002</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
