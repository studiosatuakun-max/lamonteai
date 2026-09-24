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

export const mockSalesOrders: SalesOrder[] = [
  {
    id: "so-001",
    spNumber: "SP-2026-0801",
    sourceType: "Pesanan Konsumen",
    customerName: "Bpk. Budi Santoso",
    customerPhone: "08123456789",
    address: "Jl. Fatmawati No. 12, Jakarta Selatan",
    productName: "Sofa Retro 3 Seater (Kain Beludru Mustard)",
    productType: "Ready Stock",
    region: "Dalam Kota",
    currentStage: "Inventory",
    status: "Pending",
    notes: "Konsumen minta dicek kondisi kain sebelum dikirim",
    timeline: [
      { id: "t-1", timestamp: "2026-08-18 09:15", division: "Sales", title: "Input SP Konsumen", description: "SP-2026-0801 dibuat oleh Sales Toko Fatmawati", status: "completed", pic: "Rian (Sales)" },
      { id: "t-2", timestamp: "2026-08-18 09:20", division: "Inventory", title: "Cek Stok Fisik Gudang", description: "Menunggu tim gudang verifikasi fisik sofa di rak A-03", status: "in_progress", pic: "Agus (Gudang)" }
    ],
    createdAt: "2026-08-18T09:15:00.000Z",
    updatedAt: "2026-08-18T09:20:00.000Z"
  },
  {
    id: "so-002",
    spNumber: "SP-2026-0802",
    sourceType: "Pesanan Konsumen",
    customerName: "Ibu Siska Amelia",
    customerPhone: "08139876543",
    address: "Cluster Harmoni Blok C/8, Sentul City, Bogor",
    productName: "Sofa Custom L-Shape Ukuran 280x180cm",
    productType: "PO Sofa",
    region: "Luar Kota",
    hasBlueprint: false,
    currentStage: "Kepala Toko",
    status: "Blocked",
    notes: "Menunggu gambar kerja revisi posisi sudut L dari arsitek konsumen",
    timeline: [
      { id: "t-3", timestamp: "2026-08-18 10:30", division: "Sales", title: "Input SP Custom", description: "SP-2026-0802 dibuat. Status: Gambar kerja belum ada", status: "completed", pic: "Sarah (Sales)" },
      { id: "t-4", timestamp: "2026-08-18 10:35", division: "Koordinator Toko", title: "Validasi Form Permintaan Produksi", description: "Tertahan! Menunggu gambar kerja fix sebelum dibuatkan SPK ke pabrik", status: "blocked", pic: "Doni (Koord. Toko)" }
    ],
    createdAt: "2026-08-18T10:30:00.000Z",
    updatedAt: "2026-08-18T10:35:00.000Z"
  },
  {
    id: "so-003",
    spNumber: "SP-2026-0803",
    sourceType: "Pesanan Konsumen",
    customerName: "PT Sejahtera Kreasi",
    customerPhone: "021-7890123",
    address: "Gedung Wisma Niaga Lt. 4, Kuningan, Jaksel",
    productName: "Meja Rapat Kayu Jati Solid 3 Meter",
    productType: "PO Produk Mebel",
    region: "Dalam Kota",
    purchasingStatus: "Requested",
    supplierName: "PT Indo Kayu Sejahtera",
    currentStage: "Purchasing",
    status: "Diproses",
    notes: "Pemesanan indent supplier Jepara, estimasi lead time 5 hari",
    timeline: [
      { id: "t-5", timestamp: "2026-08-17 14:00", division: "Sales", title: "Input SP Mebel", description: "SP-2026-0803 dibuat untuk paket meja rapat kantor", status: "completed", pic: "Rian (Sales)" },
      { id: "t-6", timestamp: "2026-08-17 14:30", division: "Purchasing", title: "Terbitkan PO Supplier", description: "PO-SUP-042 diterbitkan ke vendor PT Indo Kayu Sejahtera", status: "in_progress", pic: "Indah (Purchasing)" }
    ],
    createdAt: "2026-08-17T14:00:00.000Z",
    updatedAt: "2026-08-17T14:30:00.000Z"
  },
  {
    id: "so-004",
    spNumber: "SP-2026-0804",
    sourceType: "Pesanan Konsumen",
    customerName: "Klinik Sehat Prima",
    customerPhone: "08561122334",
    address: "Jl. Pajajaran No. 45, Bogor Tengah",
    productName: "Set Kursi Tunggu Minimalis (4 Pcs)",
    productType: "Ready Stock",
    region: "Luar Kota",
    requestDate: "2026-08-20",
    distributionDate: "2026-08-20",
    driverName: "Pak Joko (Truk Armada 02)",
    deliverySlot: "Pagi (09:00 - 13:00)",
    currentStage: "Distribusi",
    status: "Diproses",
    notes: "Kirim sebelum jam operasional klinik buka (sebelum 12:00)",
    timeline: [
      { id: "t-7", timestamp: "2026-08-16 11:00", division: "Sales", title: "Input SP Konsumen", description: "Pesanan 4 set kursi tunggu dibuat", status: "completed", pic: "Sarah (Sales)" },
      { id: "t-8", timestamp: "2026-08-16 13:30", division: "Inventory", title: "Konfirmasi Fisik Barang", description: "Barang sudah dicek fisik & dipacking bubble wrap di rak D-01", status: "completed", pic: "Agus (Gudang)" },
      { id: "t-9", timestamp: "2026-08-17 09:00", division: "Distribusi", title: "Plotting Rute Luar Kota", description: "Dijadwalkan masuk trip Bogor 20 Agustus armada Pak Joko", status: "in_progress", pic: "Hendra (Distribusi)" }
    ],
    createdAt: "2026-08-16T11:00:00.000Z",
    updatedAt: "2026-08-17T09:00:00.000Z"
  },
  {
    id: "so-005",
    spNumber: "SP-2026-0805",
    sourceType: "Pesanan Konsumen",
    customerName: "Bpk. Andi Wijaya",
    customerPhone: "08112233445",
    address: "Perumahan Puri Indah Blok F/12, Jakarta Barat",
    productName: "Sofa Recliner 1 Seater Kulit Sintetis",
    productType: "PO Sofa",
    region: "Dalam Kota",
    hasBlueprint: true,
    currentStage: "Produksi",
    productionStage: "Finishing",
    status: "Diproses",
    notes: "Finishing jok dan pemasangan mekanik reclining",
    timeline: [
      { id: "t-10", timestamp: "2026-08-15 09:00", division: "Sales", title: "Input SP Custom", description: "SP-2026-0805 dibuat lengkap dengan gambar kerja", status: "completed", pic: "Rian (Sales)" },
      { id: "t-11", timestamp: "2026-08-15 10:15", division: "Koordinator Toko", title: "Buat Form Produksi", description: "SPK-088 diterbitkan ke pabrik partner", status: "completed", pic: "Doni (Koord. Toko)" },
      { id: "t-12", timestamp: "2026-08-16 08:30", division: "Produksi", title: "Potong Rangka & Jahit", description: "Rangka kayu mahoni dan jahit kulit sintetis selesai", status: "completed", pic: "Maman (Produksi)" },
      { id: "t-13", timestamp: "2026-08-18 08:00", division: "Produksi", title: "Finishing & Uji Mekanik", description: "Sedang proses rakit busa dan uji coba tuas reclining", status: "in_progress", pic: "Maman (Produksi)" }
    ],
    createdAt: "2026-08-15T09:00:00.000Z",
    updatedAt: "2026-08-18T08:00:00.000Z"
  },
  {
    id: "so-006",
    spNumber: "PO-RESTOCK-001",
    sourceType: "Kebutuhan Stok",
    customerName: "Internal Gudang Utama",
    address: "Gudang Pusat Lovise Sofa Cikarang",
    productName: "Pengadaan Busa Rebounded D50 (15 Lembar)",
    productType: "PO Produk Mebel",
    region: "Dalam Kota",
    purchasingStatus: "Ordered",
    supplierName: "Sumber Makmur Foam",
    currentStage: "Purchasing",
    status: "Diproses",
    notes: "Trigger restock otomatis: Sisa stok busa gudang menyentuh batas minimum (4 lembar)",
    timeline: [
      { id: "t-14", timestamp: "2026-08-18 07:45", division: "Inventory", title: "Deteksi Stok Kritis", description: "Stok Busa D50 sisa 4 lembar (batas aman 10). Memicu usulan restock", status: "completed", pic: "Sistem Otomasi" },
      { id: "t-15", timestamp: "2026-08-18 08:30", division: "Purchasing", title: "PO Bahan Baku Terbit", description: "PO-BB-109 dikirim ke supplier Sumber Makmur Foam", status: "in_progress", pic: "Indah (Purchasing)" }
    ],
    createdAt: "2026-08-18T07:45:00.000Z",
    updatedAt: "2026-08-18T08:30:00.000Z"
  },
  {
    id: "so-007",
    spNumber: "SP-2026-0806",
    sourceType: "Pesanan Konsumen",
    customerName: "Ibu Maya Angelina",
    customerPhone: "08187766554",
    address: "Jl. Boulevard Gading Serpong, Tangerang",
    productName: "Sofa Scandinavian 2 Seater Grey",
    productType: "Ready Stock",
    region: "Dalam Kota",
    distributionDate: "2026-08-17",
    driverName: "Pak Dedi (Armada 01)",
    currentStage: "Selesai",
    status: "Selesai",
    notes: "Barang sudah diterima konsumen dalam kondisi mulus",
    timeline: [
      { id: "t-16", timestamp: "2026-08-14 10:00", division: "Sales", title: "Input SP", description: "SP-2026-0806 dibuat", status: "completed", pic: "Sarah" },
      { id: "t-17", timestamp: "2026-08-14 14:00", division: "Inventory", title: "Verifikasi Gudang", description: "Barang siap di gudang", status: "completed", pic: "Agus" },
      { id: "t-18", timestamp: "2026-08-17 11:30", division: "Distribusi", title: "Pengiriman Sukses", description: "Barang diterima konsumen, BAST ditandatangani. Pesanan ditutup", status: "completed", pic: "Pak Dedi (Supir)" }
    ],
    createdAt: "2026-08-14T10:00:00.000Z",
    updatedAt: "2026-08-17T11:30:00.000Z"
  }
];

export const mockDailyReports: DailyReportEntry[] = [
  {
    id: "rep-01",
    date: "2026-08-18",
    time: "16:45",
    division: "Purchasing",
    reporter: "Indah (Purchasing Lead)",
    notes: "PO-SUP-042 (Kayu Jati untuk SP-2026-0803) sudah dikonfirmasi supplier Jepara, pengiriman bahan dijadwalkan besok pagi. PO-BB-109 untuk restock Busa D50 sudah deal harga diskon 5%.",
    relatedSP: ["SP-2026-0803", "PO-RESTOCK-001"],
    urgency: "Normal"
  },
  {
    id: "rep-02",
    date: "2026-08-18",
    time: "16:50",
    division: "Produksi",
    reporter: "Maman (Mandor Pabrik)",
    notes: "Pengerjaan SP-2026-0805 masuk tahap finishing jok & perapihan mekanik recliner, target selesai besok siang. Namun ada SP-2026-0802 yang belum ada gambar kerja sehingga tukang rangka belum bisa mulai potong kayu.",
    relatedSP: ["SP-2026-0805", "SP-2026-0802"],
    urgency: "Perhatian"
  },
  {
    id: "rep-03",
    date: "2026-08-18",
    time: "17:00",
    division: "Koordinator Toko",
    reporter: "Doni (Koord. Toko)",
    notes: "Sudah follow up ke arsitek Ibu Siska untuk SP-2026-0802 terkait revisi dimensi L-Shape. Dijanjikan gambar kerja dikirim via email malam ini jam 20.00 agar besok pagi SPK bisa langsung masuk ke pabrik.",
    relatedSP: ["SP-2026-0802"],
    urgency: "Perhatian"
  },
  {
    id: "rep-04",
    date: "2026-08-18",
    time: "17:05",
    division: "Inventory",
    reporter: "Agus (Kepala Gudang)",
    notes: "Barang SP-2026-0801 (Sofa Retro) sudah dicek fisik: busa kenyal dan kain mulus, sudah siap di bay 2 untuk antrean kirim. Sisa Busa D50 kritis hanya 4 lembar, mohon Purchasing percepat PO-BB-109.",
    relatedSP: ["SP-2026-0801", "PO-RESTOCK-001"],
    urgency: "Kritis"
  },
  {
    id: "rep-05",
    date: "2026-08-18",
    time: "17:15",
    division: "Distribusi",
    reporter: "Hendra (Koord. Distribusi)",
    notes: "Pengiriman SP-2026-0806 selesai tanpa komplain. Rute Luar Kota (Bogor) untuk SP-2026-0804 tanggal 20 Agustus sudah terkunci muatannya 80%. Truk Armada 01 dijadwalkan servis rutin besok sore.",
    relatedSP: ["SP-2026-0806", "SP-2026-0804"],
    urgency: "Normal"
  }
];

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

export const initialAIDigest: AIDigestResult = {
  date: "18 Agustus 2026",
  summary: "Aktivitas operasional 5 divisi hari ini mencakup 7 pesanan terdaftar. Alur pengiriman distribusi berjalan lancar, namun terdapat 1 hambatan kritis pada ketersediaan bahan baku Busa D50 dan 1 pesanan sofa custom tertahan gambar kerja.",
  totalOrdersMonitored: 7,
  bottlenecks: [
    {
      spNumber: "SP-2026-0802",
      division: "Koordinator Toko & Produksi",
      issue: "Pabrik belum bisa potong rangka karena gambar kerja revisi posisi L-Shape belum diterima dari arsitek konsumen.",
      severity: "Tinggi",
      recommendation: "Koordinator Toko wajib pastikan gambar kerja masuk malam ini jam 20.00 agar tukang bisa mulai pagi hari."
    },
    {
      spNumber: "PO-RESTOCK-001",
      division: "Inventory & Purchasing",
      issue: "Stok fisik Busa Rebounded D50 tersisa 4 lembar (di bawah batas minimum 10).",
      severity: "Tinggi",
      recommendation: "Purchasing segera konfirmasi jadwal pengiriman PO-BB-109 dari supplier Sumber Makmur Foam."
    }
  ],
  highlights: [
    "SP-2026-0806 (Sofa Scandinavian) telah selesai serah terima ke konsumen Ibu Maya di Gading Serpong dengan BAST lengkap.",
    "SP-2026-0805 (Sofa Recliner Bpk. Andi) sudah 75% selesai pengerjaan dan memasuki tahap finishing jok.",
    "Slot pengiriman Luar Kota (Bogor) untuk 20 Agustus telah terisi 80% pada armada Pak Joko."
  ],
  generatedAt: "18 Agustus 2026, 17:30 WIB"
};

export const mockSuppliers: Supplier[] = [
  { id: "s1", name: "PT Indo Kayu Sejahtera", price: 150000, speedDays: 2, aiTrustScore: 95, sentiment: "Positive" },
  { id: "s2", name: "Sumber Makmur Furniture", price: 140000, speedDays: 5, aiTrustScore: 60, sentiment: "Neutral" },
  { id: "s3", name: "Toko Material Cepat", price: 180000, speedDays: 1, aiTrustScore: 40, sentiment: "Negative" },
];

export const mockProductionJobs: ProductionJob[] = [
  { id: "p1", product: "Meja Kerja", suggestedShift: "Shift 2 (14:00 - 22:00)", efficiencyGain: 15 },
  { id: "p2", product: "Lemari Pakaian", suggestedShift: "Shift 1 (06:00 - 14:00)", efficiencyGain: 8 },
];
