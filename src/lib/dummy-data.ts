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

import { SalesOrder } from "@/types/operations";

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
  { id: "f2", date: "2026-08-11", description: "Beli ATK Kantor (Tiba-tiba besar)", type: "QRIS", bankAmount: -50000000, systemAmount: -50000000, status: "Anomaly" }, // Anomaly AI
  { id: "f3", date: "2026-08-11", description: "Settlement Kasir Toko A", type: "Gabungan", bankAmount: 4950000, systemAmount: 5000000, status: "Discrepancy" }, // Discrepancy Rp 50.000
  { id: "f4", date: "2026-08-12", description: "Pembayaran Invoice INV-002", type: "Bank Transfer", bankAmount: 3000000, systemAmount: 3000000, status: "Balanced" },
];

export const mockOrders: Order[] = [
  { id: "o1", customerName: "PT Maju Jaya", product: "Sofa Minimalis", quantity: 5, stockAvailable: 10, status: "Pending" },
  { id: "o2", customerName: "CV Abadi", product: "Meja Kerja", quantity: 20, stockAvailable: 0, status: "Pending" },
  { id: "o3", customerName: "Toko Sinar", product: "Kursi Kantor PO (Khusus)", quantity: 50, stockAvailable: 0, status: "Pending" }, // Akan lari ke Procurement
];

export const mockSalesOrders: SalesOrder[] = [
  { id: "so-001", customerName: "Bpk. Budi", productName: "Sofa Retro 3 Seater", productType: "Ready Stock", region: "Dalam Kota", currentStage: "Inventory", status: "Pending", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "so-002", customerName: "Ibu Siska", productName: "Sofa Custom L-Shape", productType: "PO Sofa", region: "Luar Kota", hasBlueprint: false, currentStage: "Kepala Toko", status: "Blocked", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "so-003", customerName: "PT Sejahtera", productName: "Meja Rapat Kayu Jati", productType: "PO Produk Mebel", region: "Dalam Kota", purchasingStatus: "Belum", currentStage: "Purchasing", status: "Pending", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "so-004", customerName: "Klinik Sehat", productName: "Kursi Tunggu", productType: "Ready Stock", region: "Dalam Kota", requestDate: "2026-08-20", currentStage: "Distribusi", status: "Pending", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "so-005", customerName: "Bpk. Andi", productName: "Sofa Recliner X", productType: "PO Sofa", region: "Dalam Kota", hasBlueprint: true, currentStage: "Produksi", productionStage: "Potong Rangka", status: "Diproses", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const mockSuppliers: Supplier[] = [
  { id: "s1", name: "PT Indo Kayu Sejahtera", price: 150000, speedDays: 2, aiTrustScore: 95, sentiment: "Positive" },
  { id: "s2", name: "Sumber Makmur Furniture", price: 140000, speedDays: 5, aiTrustScore: 60, sentiment: "Neutral" },
  { id: "s3", name: "Toko Material Cepat", price: 180000, speedDays: 1, aiTrustScore: 40, sentiment: "Negative" },
];

export const mockProductionJobs: ProductionJob[] = [
  { id: "p1", product: "Meja Kerja", suggestedShift: "Shift 2 (14:00 - 22:00)", efficiencyGain: 15 },
  { id: "p2", product: "Lemari Pakaian", suggestedShift: "Shift 1 (06:00 - 14:00)", efficiencyGain: 8 },
];
