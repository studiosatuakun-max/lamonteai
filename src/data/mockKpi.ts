import { 
  EmployeeKPIScorecard, 
  KPIDepartmentPreset, 
  KPIMetric, 
  KPIPolarity, 
  KPIGrade 
} from '@/types/kpi';

export function calculateMetricAchievement(
  target: number, 
  actual: number, 
  polarity: KPIPolarity, 
  maxCap: number = 120
): number {
  if (target === 0) return actual === 0 ? 100 : 0;
  let pct = 0;
  if (polarity === 'maximize') {
    pct = (actual / target) * 100;
  } else {
    // For minimize (defect, complaint, waste): target is upper limit
    if (actual <= 0) {
      pct = 110;
    } else {
      pct = (target / actual) * 100;
    }
  }
  return Math.min(Math.max(Math.round(pct * 10) / 10, 0), maxCap);
}

export function calculateKPIGrade(score: number): KPIGrade {
  if (score >= 95) return 'A';
  if (score >= 85) return 'B';
  if (score >= 75) return 'C';
  if (score >= 60) return 'D';
  return 'E';
}

export function getGradeColor(grade: KPIGrade) {
  switch (grade) {
    case 'A':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', label: 'Outstanding (A)' };
    case 'B':
      return { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', label: 'Exceeds Expectation (B)' };
    case 'C':
      return { bg: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', label: 'Meets Standard (C)' };
    case 'D':
      return { bg: 'bg-orange-500/10', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', label: 'Needs Improvement (D)' };
    case 'E':
      return { bg: 'bg-rose-500/10', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800', label: 'Unacceptable (E)' };
  }
}

// Preset Template Standard per Divisi
export const KPI_DEPARTMENT_PRESETS: KPIDepartmentPreset[] = [
  {
    department: 'Produksi & Workshop',
    role: 'Tukang Kayu / Tukang Jahit / Upholstery',
    description: 'Fokus pada output penyelesaian unit sofa, tingkat presisi jahitan/rangka, efisiensi bahan busa/kain, dan zero defect.',
    metrics: [
      {
        name: 'Output Penyelesaian Sofa (SPK)',
        category: 'production',
        description: 'Target jumlah unit sofa yang berhasil dirakit & lolos QC per periode.',
        unit: 'unit',
        polarity: 'maximize',
        target: 45,
        weight: 35,
        notes: 'Dihitung berdasarkan SPK tervalidasi QC.'
      },
      {
        name: 'Tingkat Cacat Produksi (Defect Rate)',
        category: 'production',
        description: 'Persentase reject jahitan, busa melorot, atau rangka miring saat QC gate.',
        unit: 'percentage',
        polarity: 'minimize',
        target: 2.0,
        weight: 25,
        notes: 'Target maksimal cacat di bawah 2% dari total unit diproduksi.'
      },
      {
        name: 'Ketepatan Jadwal SPK (On-Time Finish)',
        category: 'operational' as any,
        description: 'Persentase SPK selesai tepat waktu sebelum target tanggal delivery.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 95,
        weight: 20,
        notes: 'Menghindari keterlambatan pengiriman ke konsumen.'
      },
      {
        name: 'Efisiensi Bahan (Fabric & Foam Waste)',
        category: 'production',
        description: 'Toleransi pembuangan sisa kain oscar/velvet dan busa cetak.',
        unit: 'percentage',
        polarity: 'minimize',
        target: 4.5,
        weight: 10,
        notes: 'Maksimal waste sisa potongan pola kain 4.5%.'
      },
      {
        name: 'Kedisiplinan & 5R / K3 Workshop',
        category: 'discipline',
        description: 'Kerapian peralatan kerja, kebersihan bengkel perakitan, dan absensi kerja.',
        unit: 'score',
        polarity: 'maximize',
        target: 95,
        weight: 10,
        notes: 'Penilaian supervisor lapangan setiap Jumat sore.'
      }
    ]
  },
  {
    department: 'Sales & Showroom',
    role: 'Sales Consultant & Customer Relations',
    description: 'Fokus pada omzet closing sofa custom & ready stock, rasio konversi konsultasi arsitek/walk-in, dan kepuasan pembeli.',
    metrics: [
      {
        name: 'Target Omzet Penjualan (Revenue Closing)',
        category: 'sales',
        description: 'Realisasi nominal penjualan sofa dan custom furniture showroom.',
        unit: 'IDR',
        polarity: 'maximize',
        target: 150000000,
        weight: 40,
        notes: 'Target bruto penjualan invoice terbayar.'
      },
      {
        name: 'Closing Conversion Rate',
        category: 'sales',
        description: 'Persentase calon pembeli showroom / leads WhatsApp yang berhasil deal.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 30,
        weight: 20,
        notes: 'Jumlah invoice closing dibagi total kunjungan showroom / leads.'
      },
      {
        name: 'Kecepatan Respon Konsultasi (SLA Response)',
        category: 'operational' as any,
        description: 'Rata-rata durasi membalas chat konsultasi sofa custom pembeli.',
        unit: 'minutes',
        polarity: 'minimize',
        target: 5,
        weight: 15,
        notes: 'Target di bawah 5 menit respon time pada jam operasional.'
      },
      {
        name: 'Customer Satisfaction Score (CSAT)',
        category: 'behavior',
        description: 'Rating review pembeli terhadap keramahan dan akurasi konsultasi kain & dimensi.',
        unit: 'score',
        polarity: 'maximize',
        target: 4.8,
        weight: 15,
        notes: 'Skala 1.0 - 5.0 dari survei pasca-pembelian.'
      },
      {
        name: 'Akurasi Update CRM & Data Lead',
        category: 'discipline',
        description: 'Pencatatan data kontak, preferensi warna/kain calon pembeli di sistem.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 95,
        weight: 10,
        notes: 'Ketertiban input data lead harian.'
      }
    ]
  },
  {
    department: 'Logistik & Delivery',
    role: 'Lead Driver & Delivery Team',
    description: 'Fokus pada zero damage saat pengantaran ke rumah customer, ketepatan waktu instalasi sofa, dan perawatan armada.',
    metrics: [
      {
        name: 'Zero-Damage Delivery Rate',
        category: 'operations',
        description: 'Persentase sofa tiba di lokasi tanpa sobek, kotor, lecet, atau cacat gesekan.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 99.0,
        weight: 35,
        notes: 'Berdasarkan tanda tangan surat jalan Berita Acara Serah Terima (BAST).'
      },
      {
        name: 'Ketepatan Jadwal Pengiriman (OTD)',
        category: 'operations',
        description: 'Pengantaran tepat di jendela waktu yang disepakati dengan customer.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 95.0,
        weight: 30,
        notes: 'Mematuhi jadwal slot kirim (Pagi / Siang / Sore).'
      },
      {
        name: 'Kerapian Instalasi & Unboxing di Lokasi',
        category: 'behavior',
        description: 'Rating penataan kaki sofa, pembuangan plastik packaging, dan keramahan kru pengantar.',
        unit: 'score',
        polarity: 'maximize',
        target: 4.8,
        weight: 20,
        notes: 'Form konfirmasi checklist serah terima pelanggan.'
      },
      {
        name: 'Inspeksi & Efisiensi Armada Truk',
        category: 'discipline',
        description: 'Ketertiban checklist servis rutin kendaraan dan efisiensi konsumsi BBM rute.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 92.0,
        weight: 15,
        notes: 'Pengecekan oli, rem, tekanan ban, dan nota BBM mingguan.'
      }
    ]
  },
  {
    department: 'Finance & Admin (FAT)',
    role: 'FAT Staff & Account Receivable',
    description: 'Fokus pada ketepatan laporan rekonsiliasi kas/bank, penagihan invoice arsitek/B2B, dan zero error payroll.',
    metrics: [
      {
        name: 'Ketepatan Waktu Laporan Finansial Bulanan',
        category: 'finance',
        description: 'Laporan laba rugi dan arus kas selesai sebelum tanggal 5 tiap bulan.',
        unit: 'days',
        polarity: 'minimize',
        target: 5,
        weight: 30,
        notes: 'Cut-off tanggal 1, submit maksimal tanggal 5.'
      },
      {
        name: 'Akurasi Rekonsiliasi Kas, Bank & QRIS',
        category: 'finance',
        description: 'Zero selisih antara mutasi rekening bank dengan pembukuan sistem kasir/order.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 100,
        weight: 30,
        notes: 'Pencocokan mutasi harian dan approval bukti transfer.'
      },
      {
        name: 'Aging AR & Kelancaran Penagihan Termin',
        category: 'finance',
        description: 'Pelunasan invoice termin 50% pelunasan sebelum pengiriman sofa.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 95,
        weight: 25,
        notes: 'Memastikan sofa tidak dikirim sebelum status lunas / PO B2B klir.'
      },
      {
        name: 'Kepatuhan Pajak & Filing Administrasi',
        category: 'discipline',
        description: 'Kerapian faktur pajak masukan/keluaran dan arsip nota pembelian bahan.',
        unit: 'score',
        polarity: 'maximize',
        target: 95,
        weight: 15,
        notes: 'Audit internal berkala.'
      }
    ]
  },
  {
    department: 'HR & General Affairs',
    role: 'HR Officer & People Development',
    description: 'Fokus pada pemenuhan kebutuhan tenaga kerja terampil (tukang/sales), pengelolaan absensi, dan iklim kerja workshop.',
    metrics: [
      {
        name: 'Time to Hire & Pemenuhan Tenaga Kerja',
        category: 'operations',
        description: 'Waktu rata-rata pengisian posisi kosong tukang jahit & sales showroom.',
        unit: 'days',
        polarity: 'minimize',
        target: 21,
        weight: 30,
        notes: 'Maksimal 21 hari kalender sejak open vacancy.'
      },
      {
        name: 'Ketepatan & Akurasi Penggajian (Payroll)',
        category: 'operations',
        description: 'Perhitungan upah borongan dan bulanan 100% tepat waktu tgl 28.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 100,
        weight: 30,
        notes: 'Zero komplain selisih jam lembur atau potongan absensi.'
      },
      {
        name: 'Retensi Karyawan & Iklim Kerja Workshop',
        category: 'behavior',
        description: 'Tingkat turnover tukang terampil dan sales di bawah 5% per kuartal.',
        unit: 'percentage',
        polarity: 'minimize',
        target: 5.0,
        weight: 25,
        notes: 'Evaluasi kepuasan kerja dan retensi talent kunci.'
      },
      {
        name: 'Pelaksanaan Program Safety K3 & Pelatihan',
        category: 'discipline',
        description: 'Jumlah sesi briefing keselamatan kerja dan uji kompetensi material baru.',
        unit: 'score',
        polarity: 'maximize',
        target: 90,
        weight: 15,
        notes: 'Briefing mingguan dan sertifikasi internal tukang.'
      }
    ]
  }
];

// Mock Employee Scorecards with Realistic Data
export const INITIAL_EMPLOYEE_SCORECARDS: EmployeeKPIScorecard[] = [
  {
    id: 'kpi-emp-001',
    nip: 'LVS-PROD-014',
    employeeName: 'Budi Santoso',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Produksi & Workshop',
    position: 'Master Upholstery & Lead Fabricator',
    period: 'September 2026',
    periodType: 'monthly',
    status: 'approved',
    metrics: [
      {
        id: 'm-1',
        name: 'Output Penyelesaian Sofa (SPK)',
        category: 'production',
        description: 'Target jumlah unit sofa yang berhasil dirakit & lolos QC per periode.',
        unit: 'unit',
        polarity: 'maximize',
        target: 45,
        actual: 48,
        weight: 35,
        achievementPct: 106.7,
        weightedScore: 37.3,
        notes: 'Menyelesaikan 48 unit sofa modular termasuk pesanan bespoke hotel.'
      },
      {
        id: 'm-2',
        name: 'Tingkat Cacat Produksi (Defect Rate)',
        category: 'production',
        description: 'Persentase reject jahitan, busa melorot, atau rangka miring saat QC gate.',
        unit: 'percentage',
        polarity: 'minimize',
        target: 2.0,
        actual: 1.2,
        weight: 25,
        achievementPct: 120.0,
        weightedScore: 30.0,
        notes: 'Sangat rapi, defect hanya 1 kasus jahitan kecil langsung diperbaiki.'
      },
      {
        id: 'm-3',
        name: 'Ketepatan Jadwal SPK (On-Time Finish)',
        category: 'production',
        description: 'Persentase SPK selesai tepat waktu sebelum target tanggal delivery.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 95,
        actual: 98,
        weight: 20,
        achievementPct: 103.2,
        weightedScore: 20.6,
        notes: 'Semua pesanan mendesak tuntas H-1 jadwal pengiriman.'
      },
      {
        id: 'm-4',
        name: 'Efisiensi Bahan (Fabric & Foam Waste)',
        category: 'production',
        description: 'Toleransi pembuangan sisa kain oscar/velvet dan busa cetak.',
        unit: 'percentage',
        polarity: 'minimize',
        target: 4.5,
        actual: 4.1,
        weight: 10,
        achievementPct: 109.8,
        weightedScore: 11.0,
        notes: 'Pemotongan pola kain sangat optimal.'
      },
      {
        id: 'm-5',
        name: 'Kedisiplinan & 5R / K3 Workshop',
        category: 'discipline',
        description: 'Kerapian peralatan kerja, kebersihan bengkel perakitan, dan absensi kerja.',
        unit: 'score',
        polarity: 'maximize',
        target: 95,
        actual: 96,
        weight: 10,
        achievementPct: 101.1,
        weightedScore: 10.1,
        notes: 'Disiplin hadir tepat waktu dan memimpin briefing 5R.'
      }
    ],
    totalScore: 98.4,
    grade: 'A',
    evaluator: 'Agus Setiawan, S.T.',
    evaluatorRole: 'Kepala Divisi Operasional & Produksi',
    reviewNotes: 'Kinerja luar biasa di bulan September. Kecepatan dan ketelitian pengerjaan sofa premium sangat membantu kelancaran pesanan high-season. Direkomendasikan untuk bonus performa penuh.',
    pipRequired: false,
    bonusEligible: true,
    lastUpdated: '2026-09-24 16:30'
  },
  {
    id: 'kpi-emp-002',
    nip: 'LVS-SLS-008',
    employeeName: 'Sarah Melinda Putri',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Sales & Showroom',
    position: 'Senior Interior Sales Consultant',
    period: 'September 2026',
    periodType: 'monthly',
    status: 'approved',
    metrics: [
      {
        id: 'm-201',
        name: 'Target Omzet Penjualan (Revenue Closing)',
        category: 'sales',
        description: 'Realisasi nominal penjualan sofa dan custom furniture showroom.',
        unit: 'IDR',
        polarity: 'maximize',
        target: 150000000,
        actual: 172500000,
        weight: 40,
        achievementPct: 115.0,
        weightedScore: 46.0,
        notes: 'Mencapai Rp 172.5 Jt dari target 150 Jt (+15%).'
      },
      {
        id: 'm-202',
        name: 'Closing Conversion Rate',
        category: 'sales',
        description: 'Persentase calon pembeli showroom / leads WhatsApp yang berhasil deal.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 30,
        actual: 34,
        weight: 20,
        achievementPct: 113.3,
        weightedScore: 22.7,
        notes: 'Kemampuan konsultasi material kain velvet sangat persuasif.'
      },
      {
        id: 'm-203',
        name: 'Kecepatan Respon Konsultasi (SLA Response)',
        category: 'sales',
        description: 'Rata-rata durasi membalas chat konsultasi sofa custom pembeli.',
        unit: 'minutes',
        polarity: 'minimize',
        target: 5,
        actual: 4.2,
        weight: 15,
        achievementPct: 119.0,
        weightedScore: 17.9,
        notes: 'Rata-rata respon WhatsApp 4.2 menit.'
      },
      {
        id: 'm-204',
        name: 'Customer Satisfaction Score (CSAT)',
        category: 'behavior',
        description: 'Rating review pembeli terhadap keramahan dan akurasi konsultasi kain & dimensi.',
        unit: 'score',
        polarity: 'maximize',
        target: 4.8,
        actual: 4.9,
        weight: 15,
        achievementPct: 102.1,
        weightedScore: 15.3,
        notes: 'Review pembeli showroom bintang 4.9/5.0.'
      },
      {
        id: 'm-205',
        name: 'Akurasi Update CRM & Data Lead',
        category: 'discipline',
        description: 'Pencatatan data kontak, preferensi warna/kain calon pembeli di sistem.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 95,
        actual: 94,
        weight: 10,
        achievementPct: 98.9,
        weightedScore: 9.9,
        notes: 'Tertib update status prospek customer.'
      }
    ],
    totalScore: 96.8,
    grade: 'A',
    evaluator: 'Clarissa Wijaya',
    evaluatorRole: 'Showroom & Sales Manager',
    reviewNotes: 'Sarah mempertahankan predikat Top Sales Showroom Lovise 3 bulan berturut-turut. Hubungan dengan klien arsitek dan desainer interior sangat solid.',
    pipRequired: false,
    bonusEligible: true,
    lastUpdated: '2026-09-24 14:15'
  },
  {
    id: 'kpi-emp-003',
    nip: 'LVS-LOG-022',
    employeeName: 'Doni Pratama',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Logistik & Delivery',
    position: 'Senior Delivery Driver & Handler',
    period: 'September 2026',
    periodType: 'monthly',
    status: 'reviewed',
    metrics: [
      {
        id: 'm-301',
        name: 'Zero-Damage Delivery Rate',
        category: 'operations',
        description: 'Persentase sofa tiba di lokasi tanpa sobek, kotor, lecet, atau cacat gesekan.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 99.0,
        actual: 97.5,
        weight: 35,
        achievementPct: 98.5,
        weightedScore: 34.5,
        notes: 'Ada 1 insiden kardus pembungkus robek terkena pagar rumah, namun sofa aman.'
      },
      {
        id: 'm-302',
        name: 'Ketepatan Jadwal Pengiriman (OTD)',
        category: 'operations',
        description: 'Pengantaran tepat di jendela waktu yang disepakati dengan customer.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 95.0,
        actual: 93.0,
        weight: 30,
        achievementPct: 97.9,
        weightedScore: 29.4,
        notes: 'Terkendala kemacetan area Jakarta Selatan di 2 jadwal pengiriman.'
      },
      {
        id: 'm-303',
        name: 'Kerapian Instalasi & Unboxing di Lokasi',
        category: 'behavior',
        description: 'Rating penataan kaki sofa, pembuangan plastik packaging, dan keramahan kru pengantar.',
        unit: 'score',
        polarity: 'maximize',
        target: 4.8,
        actual: 4.7,
        weight: 20,
        achievementPct: 97.9,
        weightedScore: 19.6,
        notes: 'Customer puas dengan kerapian pembuangan sampah unboxing.'
      },
      {
        id: 'm-304',
        name: 'Inspeksi & Efisiensi Armada Truk',
        category: 'discipline',
        description: 'Ketertiban checklist servis rutin kendaraan dan efisiensi konsumsi BBM rute.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 92.0,
        actual: 90.0,
        weight: 15,
        achievementPct: 97.8,
        weightedScore: 14.7,
        notes: 'Perawatan truk Isuzu Elf tertib tercatat.'
      }
    ],
    totalScore: 88.2,
    grade: 'B',
    evaluator: 'Fajar Nugroho',
    evaluatorRole: 'Logistics & Warehouse Supervisor',
    reviewNotes: 'Performa Doni stabil dan dapat diandalkan. Perlu lebih antisipatif dalam koordinasi rute jalan tol untuk memangkas potensi keterlambatan pada jam sibuk.',
    pipRequired: false,
    bonusEligible: true,
    lastUpdated: '2026-09-23 11:20'
  },
  {
    id: 'kpi-emp-004',
    nip: 'LVS-FAT-005',
    employeeName: 'Anisa Rahmawati, S.Ak.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Finance & Admin (FAT)',
    position: 'Finance & AR Accounting Officer',
    period: 'September 2026',
    periodType: 'monthly',
    status: 'approved',
    metrics: [
      {
        id: 'm-401',
        name: 'Ketepatan Waktu Laporan Finansial Bulanan',
        category: 'finance',
        description: 'Laporan laba rugi dan arus kas selesai sebelum tanggal 5 tiap bulan.',
        unit: 'days',
        polarity: 'minimize',
        target: 5,
        actual: 4,
        weight: 30,
        achievementPct: 120.0,
        weightedScore: 36.0,
        notes: 'Laporan selesai tgl 4, lebih cepat 1 hari dari deadline.'
      },
      {
        id: 'm-402',
        name: 'Akurasi Rekonsiliasi Kas, Bank & QRIS',
        category: 'finance',
        description: 'Zero selisih antara mutasi rekening bank dengan pembukuan sistem kasir/order.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 100,
        actual: 100,
        weight: 30,
        achievementPct: 100.0,
        weightedScore: 30.0,
        notes: 'Rekonsiliasi BCA, Mandiri, dan kas kecil 100% klir.'
      },
      {
        id: 'm-403',
        name: 'Aging AR & Kelancaran Penagihan Termin',
        category: 'finance',
        description: 'Pelunasan invoice termin 50% pelunasan sebelum pengiriman sofa.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 95,
        actual: 96,
        weight: 25,
        achievementPct: 101.1,
        weightedScore: 25.3,
        notes: 'Penagihan piutang B2B proyek cafe berjalan lancar.'
      },
      {
        id: 'm-404',
        name: 'Kepatuhan Pajak & Filing Administrasi',
        category: 'discipline',
        description: 'Kerapian faktur pajak masukan/keluaran dan arsip nota pembelian bahan.',
        unit: 'score',
        polarity: 'maximize',
        target: 95,
        actual: 95,
        weight: 15,
        achievementPct: 100.0,
        weightedScore: 15.0,
        notes: 'Arsip e-Faktur lengkap tanpa teguran.'
      }
    ],
    totalScore: 96.3,
    grade: 'A',
    evaluator: 'Bambang Triatmojo, S.E., M.M.',
    evaluatorRole: 'Head of Finance & Tax (FAT)',
    reviewNotes: 'Pengelolaan kas dan rekonsiliasi termin tepat waktu. Komunikasi dengan tim sales terkait validasi bukti transfer customer sangat rapi.',
    pipRequired: false,
    bonusEligible: true,
    lastUpdated: '2026-09-24 17:00'
  },
  {
    id: 'kpi-emp-005',
    nip: 'LVS-PROD-031',
    employeeName: 'Ahmad Fauzi',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    department: 'Produksi & Workshop',
    position: 'Junior Wooden Frame Assembler',
    period: 'September 2026',
    periodType: 'monthly',
    status: 'reviewed',
    metrics: [
      {
        id: 'm-501',
        name: 'Output Penyelesaian Sofa (SPK)',
        category: 'production',
        description: 'Target jumlah unit rangka kayu sofa diselesaikan.',
        unit: 'unit',
        polarity: 'maximize',
        target: 40,
        actual: 28,
        weight: 35,
        achievementPct: 70.0,
        weightedScore: 24.5,
        notes: 'Hanya menyelesaikan 28 unit dari kuota 40 unit.'
      },
      {
        id: 'm-502',
        name: 'Tingkat Cacat Produksi (Defect Rate)',
        category: 'production',
        description: 'Persentase reject rangka kayu miring atau sekrup longgar saat QC.',
        unit: 'percentage',
        polarity: 'minimize',
        target: 2.0,
        actual: 4.8,
        weight: 25,
        achievementPct: 41.7,
        weightedScore: 10.4,
        notes: 'Terdapat 5 unit rangka kayu mengalami retak dan harus bongkar pasang.'
      },
      {
        id: 'm-503',
        name: 'Ketepatan Jadwal SPK (On-Time Finish)',
        category: 'production',
        description: 'Persentase SPK selesai tepat waktu sebelum target.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 95,
        actual: 75,
        weight: 20,
        achievementPct: 78.9,
        weightedScore: 15.8,
        notes: 'Keterlambatan pengerjaan rangka memicu bottleneck di divisi jahit.'
      },
      {
        id: 'm-504',
        name: 'Efisiensi Bahan (Fabric & Foam Waste)',
        category: 'production',
        description: 'Toleransi pembuangan sisa kayu pinus / mahoni.',
        unit: 'percentage',
        polarity: 'minimize',
        target: 5.0,
        actual: 7.2,
        weight: 10,
        achievementPct: 69.4,
        weightedScore: 6.9,
        notes: 'Banyak potongan kayu gagal potong ukuran.'
      },
      {
        id: 'm-505',
        name: 'Kedisiplinan & 5R / K3 Workshop',
        category: 'discipline',
        description: 'Kerapian peralatan kerja dan absensi kerja.',
        unit: 'score',
        polarity: 'maximize',
        target: 95,
        actual: 82,
        weight: 10,
        achievementPct: 86.3,
        weightedScore: 8.6,
        notes: 'Tercatat 3 kali terlambat dan tidak merapikan mesin jigsaw.'
      }
    ],
    totalScore: 66.2,
    grade: 'D',
    evaluator: 'Agus Setiawan, S.T.',
    evaluatorRole: 'Kepala Divisi Operasional & Produksi',
    reviewNotes: 'Performa Ahmad berada di bawah standar minimum workshop (Grade D). Diperlukan program pembinaan (PIP) selama 30 hari di bawah supervisi langsung Master Tukang Kayu Budi Santoso.',
    pipRequired: true,
    bonusEligible: false,
    lastUpdated: '2026-09-24 10:00'
  },
  {
    id: 'kpi-emp-006',
    nip: 'LVS-HR-003',
    employeeName: 'Hendra Kusuma Wijaya',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    department: 'HR & General Affairs',
    position: 'HR Generalist & Talent Acquisition',
    period: 'September 2026',
    periodType: 'monthly',
    status: 'draft',
    metrics: [
      {
        id: 'm-601',
        name: 'Time to Hire & Pemenuhan Tenaga Kerja',
        category: 'operations',
        description: 'Waktu rata-rata pengisian posisi kosong tukang jahit & sales showroom.',
        unit: 'days',
        polarity: 'minimize',
        target: 21,
        actual: 18,
        weight: 30,
        achievementPct: 116.7,
        weightedScore: 35.0,
        notes: 'Posisi Senior Fashion Designer & Tukang Jahit terpenuhi dalam 18 hari.'
      },
      {
        id: 'm-602',
        name: 'Ketepatan & Akurasi Penggajian (Payroll)',
        category: 'operations',
        description: 'Perhitungan upah borongan dan bulanan 100% tepat waktu tgl 28.',
        unit: 'percentage',
        polarity: 'maximize',
        target: 100,
        actual: 99,
        weight: 30,
        achievementPct: 99.0,
        weightedScore: 29.7,
        notes: 'Hanya ada 1 revisi data lembur tukang borongan.'
      },
      {
        id: 'm-603',
        name: 'Retensi Karyawan & Iklim Kerja Workshop',
        category: 'behavior',
        description: 'Tingkat turnover tukang terampil dan sales di bawah 5% per kuartal.',
        unit: 'percentage',
        polarity: 'minimize',
        target: 5.0,
        actual: 4.2,
        weight: 25,
        achievementPct: 119.0,
        weightedScore: 29.8,
        notes: 'Turnover terkendali, tidak ada tukang senior yang mengundurkan diri.'
      },
      {
        id: 'm-604',
        name: 'Pelaksanaan Program Safety K3 & Pelatihan',
        category: 'discipline',
        description: 'Jumlah sesi briefing keselamatan kerja dan uji kompetensi material baru.',
        unit: 'score',
        polarity: 'maximize',
        target: 90,
        actual: 88,
        weight: 15,
        achievementPct: 97.8,
        weightedScore: 14.7,
        notes: 'Terselenggara 3 dari target 4 sesi briefing K3.'
      }
    ],
    totalScore: 94.2,
    grade: 'B',
    evaluator: 'Direksi Lovise Sofa',
    evaluatorRole: 'Managing Director',
    reviewNotes: 'Pengelolaan rekrutmen kandidat dan koordinasi internal berjalan mulus. Siap di-approve untuk penilaian final Q3.',
    pipRequired: false,
    bonusEligible: true,
    lastUpdated: '2026-09-25 09:30'
  }
];
