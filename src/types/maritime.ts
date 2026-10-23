export type VesselType = 'RORO' | 'CARGO' | 'CONTAINER' | 'FAST_FERRY' | 'BULK_CARRIER';
export type VesselStatus = 'BERLAYAR' | 'SANDAR' | 'DOCKING' | 'PERSIAPAN';

export interface Vessel {
  id: string;
  name: string;
  callSign: string;
  imoNumber: string;
  type: VesselType;
  passengerCapacity: number;
  maxDwtTon: number; // Deadweight Tonnage
  carCapacity: number;
  truckCapacity: number;
  lengthOverallMeters: number;
  maxDraftMeters: number;
  status: VesselStatus;
  captainName: string;
  flag: string;
  yearBuilt: number;
  lastMaintenance: string;
}

export interface Port {
  id: string;
  code: string;
  name: string;
  city: string;
  province: string;
  pierLengthMeters: number;
  draftDepthMeters: number;
  berthCapacity: number;
  operationalStatus: 'AKTIF' | 'PADAT' | 'PERBAIKAN';
}

export interface Route {
  id: string;
  routeCode: string;
  originPortId: string;
  destinationPortId: string;
  originPortName: string;
  destinationPortName: string;
  distanceNm: number; // Nautical Miles
  estimatedHours: number;
  baseFareEconomy: number;
  baseFareVehicle: number;
}

export interface CargoCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  unitType: 'KENDARAAN' | 'TON' | 'M3' | 'KOLI' | 'KONTAINER_TEU';
  baseTariff: number;
  maxWeightTon: number;
  iconName: string;
}

export type VoyageStatus = 'TERJADWAL' | 'BOARDING' | 'BERLAYAR' | 'SANDAR' | 'DIBATALKAN';

export interface Voyage {
  id: string;
  voyageNumber: string;
  vesselId: string;
  vesselName: string;
  routeId: string;
  originPortName: string;
  destinationPortName: string;
  departureTime: string; // ISO
  arrivalTime: string;   // ISO
  actualDeparture?: string;
  actualArrival?: string;
  status: VoyageStatus;
  currentPassengers: number;
  currentCargoWeightTon: number;
  weatherStatus: 'AMAN' | 'WASPADA' | 'BAHAYA';
  seaWaveMeters: number;
  spbApprovalNumber: string; // Surat Persetujuan Berlayar
  berthPier: string;
}

export interface PassengerManifest {
  id: string;
  ticketNumber: string;
  voyageId: string;
  voyageNumber: string;
  vesselName: string;
  identityNumber: string; // NIK / Paspor
  fullName: string;
  gender: 'L' | 'P';
  age: number;
  category: 'DEWASA' | 'ANAK' | 'BAYI';
  cabinClass: 'EKONOMI' | 'BISNIS' | 'VIP';
  seatNumber: string;
  phoneNumber: string;
  checkInStatus: 'BELUM_CHECKIN' | 'CHECKED_IN' | 'BATAL';
  boardingTime?: string;
  fare: number;
  paymentStatus: 'LUNAS' | 'PENDING';
  registeredAt: string;
}

export interface CargoManifest {
  id: string;
  blNumber: string; // Bill of Lading / Resi Muatan
  voyageId: string;
  voyageNumber: string;
  vesselName: string;
  categoryId: string;
  categoryName: string;
  itemDescription: string;
  plateNumber?: string; // Untuk kendaraan
  vehicleType?: string;
  weightTon: number;
  volumeM3: number;
  quantity: number;
  unit: string;
  deckLocation: 'DEK_UTAMA' | 'DEK_ATAS' | 'PALKA_1' | 'PALKA_2' | 'CAR_DECK';
  shipperName: string;
  shipperPhone: string;
  consigneeName: string;
  consigneePhone: string;
  hazardousGoods: boolean;
  tariff: number;
  totalPrice: number;
  loadingStatus: 'DI_DERMAGA' | 'DIMUAT' | 'DIBONGKAR';
  paymentStatus: 'LUNAS' | 'PENDING';
  registeredAt: string;
}

export type AdminRole = 'super_admin' | 'operator_pelabuhan' | 'kasir_tiket';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: AdminRole;
  nip: string;
  portLocation: string;
  avatarUrl: string;
  lastLogin?: string;
}

export type DatabaseProvider = 'builtin_server' | 'supabase' | 'neon' | 'firebase';

export interface DatabaseConnectionConfig {
  activeProvider: DatabaseProvider;
  supabase: {
    url: string;
    anonKey: string;
    tableNamePrefix: string;
    status: 'connected' | 'disconnected' | 'testing' | 'error';
    lastSync: string | null;
    errorMsg?: string;
  };
  neon: {
    connectionString: string;
    status: 'connected' | 'disconnected' | 'testing' | 'error';
    lastSync: string | null;
    errorMsg?: string;
  };
  firebase: {
    projectId: string;
    apiKey: string;
    appId: string;
    firestoreCollection: string;
    status: 'connected' | 'disconnected' | 'testing' | 'error';
    lastSync: string | null;
    errorMsg?: string;
  };
}
