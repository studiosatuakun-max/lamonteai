export type Candidate = {
  id: string;
  name: string;
  role: string;
  aiScore: number;
  status: "Reviewing" | "Interview" | "Rejected" | "Hired";
  channel: string;
};

export type FinanceLog = {
  id: string;
  date: string;
  description: string;
  type: "QRIS" | "Bank Transfer" | "Gabungan";
  bankAmount: number;
  systemAmount: number;
  status: "Balanced" | "Discrepancy" | "Anomaly";
};

export type Order = {
  id: string;
  customerName: string;
  product: string;
  quantity: number;
  stockAvailable: number;
  status: "Pending" | "Production" | "Distribution" | "Procurement";
};

import { 
  SalesOrder, 
  DailyReportEntry, 
  StockItem, 
  AIDigestResult,
  PurchasingOrder,
  ProductionOrder,
  DistributionOrder,
  SupplierRecommendation
} from "@/types/operations";

export type Supplier = {
  id: string;
  name: string;
  price: number;
  speedDays: number;
  aiTrustScore: number;
  sentiment: "Positive" | "Neutral" | "Negative";
};

export type ProductionJob = {
  id: string;
  product: string;
  suggestedShift: string;
  efficiencyGain: number;
};

export const mockCandidates: Candidate[] = [
  { id: "c1", name: "Budi Santoso", role: "Frontend Developer", aiScore: 90, status: "Reviewing", channel: "JobStreet" },
  { id: "c2", name: "Andi Pratama", role: "UI/UX Designer", aiScore: 45, status: "Rejected", channel: "Glints" },
  { id: "c3", name: "Siti Aminah", role: "Backend Engineer", aiScore: 85, status: "Interview", channel: "Email" },
  { id: "c4", name: "Dewi Lestari", role: "Product Manager", aiScore: 78, status: "Reviewing", channel: "Manual Upload" },
];

export const mockFinanceLogs: FinanceLog[] = [
  { id: "f1", date: "2026-08-10", description: "Pembayaran Invoice INV-001", type: "Bank Transfer", bankAmount: 1500000, systemAmount: 1500000, status: "Balanced" },
  { id: "f2", date: "2026-08-11", description: "Beli ATK Kantor (Tiba-tiba besar)", type: "QRIS", bankAmount: -50000000, systemAmount: -50000000, status: "Anomaly" },
  { id: "f3", date: "2026-08-11", description: "Settlement Kasir Toko A", type: "Gabungan", bankAmount: 4950000, systemAmount: 5000000, status: "Discrepancy" },
  { id: "f4", date: "2026-08-12", description: "Pembayaran Invoice INV-002", type: "Bank Transfer", bankAmount: 3000000, systemAmount: 3000000, status: "Balanced" },
];

export const mockOrders: Order[] = [
  { id: "o1", customerName: "PT Maju Jaya", product: "Sofa Minimalis", quantity: 5, stockAvailable: 10, status: "Pending" },
  { id: "o2", customerName: "CV Abadi", product: "Meja Kerja", quantity: 20, stockAvailable: 0, status: "Pending" },
  { id: "o3", customerName: "Toko Sinar", product: "Kursi Kantor PO (Khusus)", quantity: 50, stockAvailable: 0, status: "Pending" },
];

export const mockSalesOrders: SalesOrder[] = [];

export const mockPurchasingOrders: PurchasingOrder[] = [];

export const mockProductionOrders: ProductionOrder[] = [];

export const mockDistributionOrders: DistributionOrder[] = [];

export const mockDailyReports: DailyReportEntry[] = [];

export const mockStockItems: StockItem[] = [
  {
    id: "stk-01",
    sku: "MAT-FOAM-D50",
    name: "Busa Rebounded D50 (Lembaran 200x100)",
    category: "Bahan Baku",
    currentStock: 4,
    minStock: 10,
    unit: "Lembar",
    status: "Kritis",
    recommendedRestock: 16,
    monthlySalesVelocity: 24, // 24 lembar per bulan
    avgMonthlyPurchase: 25,
  },
  {
    id: "stk-02",
    sku: "FAB-VELVET-ASH",
    name: "Kain Pelapis Velvet Ash Grey",
    category: "Bahan Baku",
    currentStock: 2,
    minStock: 4,
    unit: "Roll (50m)",
    status: "Mendekati Minimum",
    recommendedRestock: 6,
    monthlySalesVelocity: 8, // 8 roll per bulan
    avgMonthlyPurchase: 10,
  },
  {
    id: "stk-03",
    sku: "WD-MAHONI-01",
    name: "Balok Rangka Kayu Mahoni Oven",
    category: "Bahan Baku",
    currentStock: 45,
    minStock: 20,
    unit: "Batang",
    status: "Aman",
    recommendedRestock: 0,
    monthlySalesVelocity: 50,
    avgMonthlyPurchase: 60,
  },
  {
    id: "stk-04",
    sku: "FRN-TABLE-RND",
    name: "Meja Kopi Bundar Minimalis",
    category: "Produk Jadi (Mebel)",
    currentStock: 8,
    minStock: 3,
    unit: "Unit",
    status: "Aman",
    recommendedRestock: 0,
    monthlySalesVelocity: 6,
    avgMonthlyPurchase: 8,
  },
  {
    id: "stk-05",
    sku: "SOFA-DSP-SCAND",
    name: "Sofa Display Toko Scandinavian 3S",
    category: "Sofa Display",
    currentStock: 1,
    minStock: 2,
    unit: "Unit",
    status: "Mendekati Minimum",
    recommendedRestock: 2,
    monthlySalesVelocity: 3,
    avgMonthlyPurchase: 4,
  }
];

export const initialAIDigest: AIDigestResult | null = null;

export const mockSuppliers: Supplier[] = [
  { id: "s1", name: "PT Indo Kayu Sejahtera", price: 150000, speedDays: 2, aiTrustScore: 95, sentiment: "Positive" },
  { id: "s2", name: "Sumber Makmur Furniture", price: 140000, speedDays: 5, aiTrustScore: 60, sentiment: "Neutral" },
  { id: "s3", name: "Toko Material Cepat", price: 180000, speedDays: 1, aiTrustScore: 40, sentiment: "Negative" },
];

export const mockProductionJobs: ProductionJob[] = [
  { id: "p1", product: "Meja Kerja", suggestedShift: "Shift 2 (14:00 - 22:00)", efficiencyGain: 15 },
  { id: "p2", product: "Lemari Pakaian", suggestedShift: "Shift 1 (06:00 - 14:00)", efficiencyGain: 8 },
];

// Rekomendasi Otomatis Supplier Bahan Baku & Mebel Pabrikan
export const mockSupplierRecommendations: SupplierRecommendation[] = [
  {
    id: "sup-01",
    name: "PT Foamindo Prima Industri",
    pricePerUnit: 265000,
    leadTimeDays: 2,
    paymentTerms: "Tempo 30 Hari",
    rating: 4.9,
    score: 96,
    pros: "Harga terjangkau, tempo 30 hari tanpa bunga, toleransi ketebalan busa sangat presisi."
  },
  {
    id: "sup-02",
    name: "CV Busa Jaya Sentosa",
    pricePerUnit: 250000,
    leadTimeDays: 4,
    paymentTerms: "DP 50%",
    rating: 4.4,
    score: 87,
    pros: "Harga termurah untuk pemesanan partai besar (>50 lembar), garansi 5 tahun."
  },
  {
    id: "sup-03",
    name: "Sentral Material Cepat Kilat",
    pricePerUnit: 285000,
    leadTimeDays: 1,
    paymentTerms: "Cash On Delivery",
    rating: 4.2,
    score: 80,
    pros: "Lead time same-day / 1 hari kerja, cocok untuk kebutuhan restock darurat."
  },
  {
    id: "sup-04",
    name: "PT Indo Kayu Sejahtera",
    pricePerUnit: 120000,
    leadTimeDays: 3,
    paymentTerms: "Tempo 30 Hari",
    rating: 4.8,
    score: 94,
    pros: "Kayu Mahoni & Jati Oven kering standar ekspor, anti rayap, kelurusan 99%."
  },
  {
    id: "sup-05",
    name: "CV Pelapis Tekstil Nusantara",
    pricePerUnit: 85000,
    leadTimeDays: 2,
    paymentTerms: "Tempo 14 Hari",
    rating: 4.7,
    score: 91,
    pros: "Pilihan kain sofa lengkap (Velvet, Linen, Canvas), water repellent, stok konsisten."
  }
];

// Rekomendasi Otomatis Mitra / Partner Produksi Pabrik
export const mockPartnerRecommendations: SupplierRecommendation[] = [
  {
    id: "ptr-01",
    name: "CV Mebel Kreasi Mandiri (Partner Utama)",
    pricePerUnit: 3200000,
    leadTimeDays: 5,
    paymentTerms: "Tempo 14 Hari",
    rating: 4.9,
    capacityAvailable: "8 Slot Tersedia / Minggu",
    score: 98,
    pros: "Kerapian jahitan & jok terbaik, pengalaman 10+ tahun produk ekspor, pengerjaan blueprint presisi."
  },
  {
    id: "ptr-02",
    name: "Workshop Sofa Pak Warno & Rekan",
    pricePerUnit: 2950000,
    leadTimeDays: 4,
    paymentTerms: "DP 50%",
    rating: 4.6,
    capacityAvailable: "4 Slot Tersedia / Minggu",
    score: 90,
    pros: "Paling cepat menyelesaikan perakitan rangka & busa, spesialis model klasik & minimalis."
  },
  {
    id: "ptr-03",
    name: "Studio Sofa Modular Sentosa",
    pricePerUnit: 3400000,
    leadTimeDays: 7,
    paymentTerms: "Tempo 30 Hari",
    rating: 4.7,
    capacityAvailable: "2 Slot Tersedia (Hampir Penuh)",
    score: 85,
    pros: "Spesialis sofa L-Shape & modular ukuran besar, jaminan garansi rangka 2 tahun."
  }
];
