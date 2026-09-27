export type ProductType = "Ready Stock" | "PO Sofa" | "PO Produk Mebel";
export type RegionType = "Dalam Kota" | "Luar Kota";
export type OrderStage = "Kepala Toko" | "Produksi" | "Purchasing" | "Inventory" | "Distribusi" | "Selesai";
export type OrderStatus = "Pending" | "Diproses" | "Blocked" | "Selesai";
export type OrderSource = 
  | "Penjualan" 
  | "Pembelian Stok" 
  | "Event / Display" 
  | "Komplain" 
  | "Pesanan Konsumen" 
  | "Kebutuhan Stok";

export interface TimelineEvent {
  id: string;
  timestamp: string;
  division: "Sales" | "Koordinator Toko" | "Purchasing" | "Produksi" | "Inventory" | "Distribusi";
  title: string;
  description: string;
  status: "completed" | "in_progress" | "pending" | "blocked";
  pic?: string;
  durationMinutes?: number;
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

  // New fields for Event / Display & Komplain
  eventPIC?: string;
  eventLocation?: string;
  complaintPIC?: string;
  complaintReason?: string;
  complaintOriginalSp?: string;

  // Rakit & Packing details (linked to HR)
  assemblyPIC?: string; // Tim GS
  assemblyDurationMinutes?: number;
  packingPIC?: string;
  packingDurationMinutes?: number;
  assemblyStatus?: "Belum Dirakit" | "Sedang Dirakit" | "Selesai Rakit";
  packingStatus?: "Belum Dipacking" | "Sedang Dipacking" | "Selesai Packing";

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

  // Additional details
  eventPIC?: string;
  eventLocation?: string;
  complaintPIC?: string;
  complaintReason?: string;
  complaintOriginalSp?: string;
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
  monthlySalesVelocity?: number; // Kecepatan penjualan per bulan
  avgMonthlyPurchase?: number;   // Rata-rata pembelian per bulan
}

export interface SupplierRecommendation {
  id: string;
  name: string;
  pricePerUnit: number;
  leadTimeDays: number;
  paymentTerms: "Tempo 30 Hari" | "Tempo 14 Hari" | "DP 50%" | "Cash On Delivery";
  rating: number; // 1-5
  capacityAvailable?: string; // Khusus Partner Produksi
  score: number; // Calculated score 1-100
  pros: string;
}

export interface PurchasingOrder {
  id: string;
  poNumber: string; // e.g. PO-PUR-2026-001
  relatedSpNumber?: string; // Terkait SP Konsumen jika custom
  fulfillmentCategory?: "Penjualan" | "Event / Display" | "Komplain" | "Stok";
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
  paymentTerms?: "Tempo 30 Hari" | "Tempo 14 Hari" | "DP 50%" | "Cash On Delivery";
  leadTimeDays?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WIPPhotoRecord {
  id: string;
  step: "Potong Rangka" | "Busa & Pegas" | "Jahit Kain" | "Jok & Upholstery" | "QC & Selesai";
  photoUrl: string;
  caption?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ProductionOrder {
  id: string;
  spkNumber: string; // e.g. SPK-PRD-2026-001
  relatedSpNumber?: string; // Terkait SP Konsumen
  fulfillmentCategory?: "Penjualan" | "Event / Display" | "Komplain" | "Stok";
  customerName?: string;
  productName: string;
  productCategory: "Sofa Custom" | "Sofa Display Toko" | "Reparasi / Servis";
  partnerName?: string; // Nama Bengkel / Partner Produksi
  carpenterPIC: string; // Nama Kepala Tukang / Mandor
  startDate: string;
  targetDeadline: string;
  actualFinishedDate?: string;
  currentStep: "Potong Rangka" | "Busa & Pegas" | "Jahit Kain" | "Jok & Upholstery" | "QC & Selesai";
  hasBlueprint: boolean;
  blueprintNotes?: string;
  wipPhotos?: WIPPhotoRecord[]; // Foto hasil WIP per tahapan
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

  // Assembly & Packing (Proses awal sebelum muat)
  assemblyPIC?: string; // Petugas Rakit (Tim GS)
  assemblyDurationMinutes?: number;
  assemblyStatus?: "Belum Dirakit" | "Sedang Dirakit" | "Selesai Rakit";
  packingPIC?: string; // Petugas Packing
  packingDurationMinutes?: number;
  packingStatus?: "Belum Dipacking" | "Sedang Dipacking" | "Selesai Packing";

  // Ekspedisi / Armada
  shippingType?: "Internal" | "Eksternal";
  expeditionName?: string; // e.g. "Dakota Cargo", "JNE Trucking"
  trackingNumber?: string; // No Resi
  driverName: string;
  driverPhone?: string;
  vehiclePlate: string; // e.g. Truk Box (B 9021 LOV)

  // Scheduling
  scheduledDate: string;
  timeSlot: "Pagi (09:00 - 13:00)" | "Sore (14:00 - 18:00)" | "Khusus Luar Kota";
  currentPhase?: "Rakit & Packing" | "Muat Truk" | "Dalam Pengiriman" | "Sampai di Konsumen";
  status: "Menunggu Muat" | "Sedang Di Jalan" | "Terkirim" | "Reschedule";
  
  // WhatsApp Notification Flags
  waSentToGS?: boolean;
  waSentToGSTimestamp?: string;
  waSentToCustomer?: boolean;
  waSentToCustomerTimestamp?: string;

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
