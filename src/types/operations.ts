export type ProductType = "Ready Stock" | "PO Sofa" | "PO Produk Mebel";
export type RegionType = "Dalam Kota" | "Luar Kota";
export type OrderStage = "Kepala Toko" | "Produksi" | "Purchasing" | "Inventory" | "Distribusi" | "Selesai";
export type OrderStatus = "Pending" | "Diproses" | "Blocked" | "Selesai";
export type OrderSource = "Pesanan Konsumen" | "Kebutuhan Stok";

export interface TimelineEvent {
  id: string;
  timestamp: string;
  division: "Sales" | "Koordinator Toko" | "Purchasing" | "Produksi" | "Inventory" | "Distribusi";
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending" | "blocked";
  pic?: string;
}

export interface SalesOrder {
  id: string;
  spNumber: string; // Nomor SP atau PO utama (identitas tunggal)
  sourceType: OrderSource;
  customerName: string;
  customerPhone?: string;
  address?: string;
  productName: string;
  productType: ProductType;
  region: RegionType;
  requestDate?: string;
  hasBlueprint?: boolean; // Khusus PO Sofa
  purchasingStatus?: "Belum" | "Requested" | "Ordered"; // Khusus PO Mebel / Restock Supplier
  supplierName?: string;
  currentStage: OrderStage;
  productionStage?: "Belum Mulai" | "Potong Rangka" | "Jahit" | "Finishing" | "QC & Selesai";
  distributionDate?: string;
  driverName?: string;
  deliverySlot?: "Pagi (09:00 - 13:00)" | "Sore (14:00 - 18:00)";
  status: OrderStatus;
  timeline: TimelineEvent[];
  notes?: string;
  sourceImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  sourceType: OrderSource;
  customerName: string;
  customerPhone?: string;
  address?: string;
  productName: string;
  productType: ProductType;
  region: RegionType;
  requestDate?: string;
  hasBlueprint?: boolean;
  notes?: string;
  sourceImage?: string;
}

export interface DailyReportEntry {
  id: string;
  date: string;
  time: string;
  division: "Purchasing" | "Produksi" | "Inventory" | "Distribusi" | "Koordinator Toko";
  reporter: string;
  notes: string;
  relatedSP?: string[];
  urgency: "Normal" | "Perhatian" | "Kritis";
}

export interface AIDigestResult {
  date: string;
  summary: string;
  totalOrdersMonitored: number;
  bottlenecks: {
    spNumber: string;
    issue: string;
    division: string;
    severity: "Tinggi" | "Sedang" | "Rendah";
    recommendation: string;
  }[];
  highlights: string[];
  generatedAt: string;
}

export interface StockItem {
  id: string;
  sku: string;
  name: string;
  category: "Bahan Baku" | "Produk Jadi (Mebel)" | "Sofa Display";
  currentStock: number;
  minStock: number;
  unit: string;
  status: "Aman" | "Mendekati Minimum" | "Kritis";
  recommendedRestock: number;
}

export interface PurchasingOrder {
  id: string;
  poNumber: string; // e.g. PO-PUR-2026-001
  relatedSpNumber?: string; // Terkait SP Konsumen jika custom
  supplierName: string;
  supplierPhone?: string;
  itemName: string;
  category: "Busa" | "Kain" | "Kayu" | "Aksesoris & Kaki" | "Mebel Jadi" | "Finishing & Lem";
  quantity: number;
  unit: string; // Roll, Lembar, Meter, Batang, Unit, Pcs
  unitPrice: number;
  totalPrice: number;
  orderDate: string;
  expectedDeliveryDate: string;
  actualArrivalDate?: string;
  status: "Draft" | "Dipesan" | "Dalam Pengiriman" | "Tiba di Gudang" | "Dibatalkan";
  paymentStatus: "Pending" | "DP 50%" | "Lunas";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductionOrder {
  id: string;
  spkNumber: string; // e.g. SPK-PRD-2026-001
  relatedSpNumber?: string; // Terkait SP Konsumen
  customerName?: string;
  productName: string;
  productCategory: "Sofa Custom" | "Sofa Display Toko" | "Reparasi / Servis";
  carpenterPIC: string; // Nama Kepala Tukang / Tim
  startDate: string;
  targetDeadline: string;
  actualFinishedDate?: string;
  currentStep: "Potong Rangka" | "Busa & Pegas" | "Jahit Kain" | "Jok & Upholstery" | "QC & Selesai";
  hasBlueprint: boolean;
  blueprintNotes?: string;
  qcStatus: "Menunggu QC" | "Revisi Pengerjaan" | "Lolos QC (Passed)";
  qcNotes?: string;
  status: "Antrean" | "Dalam Proses" | "Terkendala Bahan" | "Selesai";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DistributionOrder {
  id: string;
  sjNumber: string; // e.g. SJ-DIST-2026-001
  relatedSpNumber: string;
  customerName: string;
  customerPhone: string;
  destinationAddress: string;
  region: RegionType;
  driverName: string;
  vehiclePlate: string; // e.g. Truk Box (B 9021 LOV)
  scheduledDate: string;
  timeSlot: "Pagi (09:00 - 13:00)" | "Sore (14:00 - 18:00)" | "Khusus Luar Kota";
  status: "Menunggu Muat" | "Sedang Di Jalan" | "Terkirim" | "Reschedule";
  receivedBy?: string;
  recipientNotes?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
