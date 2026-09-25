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

import { SalesOrder, DailyReportEntry, StockItem, AIDigestResult } from "@/types/operations";

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
    recommendedRestock: 15
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
    recommendedRestock: 5
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
    recommendedRestock: 0
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
    recommendedRestock: 0
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
    recommendedRestock: 2
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
