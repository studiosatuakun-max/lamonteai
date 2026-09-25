"use server";

import { revalidatePath } from "next/cache";
import { 
  CreateOrderPayload, 
  ActionResponse, 
  SalesOrder, 
  DailyReportEntry, 
  AIDigestResult, 
  TimelineEvent 
} from "@/types/operations";

/**
 * Server Action to submit new sales order or restock request.
 * Creates unified SP number, initializes audit trail timeline, and routes to correct division.
 */
export async function submitOrderToEngine(payload: CreateOrderPayload): Promise<ActionResponse<SalesOrder>> {
  try {
    if (!payload.productName) {
      return { success: false, message: "Nama produk / kebutuhan barang wajib diisi." };
    }

    if (payload.sourceType === "Pesanan Konsumen" && !payload.customerName) {
      return { success: false, message: "Nama konsumen wajib diisi untuk pesanan konsumen." };
    }

    // Delay buatan 800ms untuk feedback UX yang responsif
    await new Promise((resolve) => setTimeout(resolve, 800));

    const isRestock = payload.sourceType === "Kebutuhan Stok";
    const randomCode = Math.floor(100 + Math.random() * 900);
    const spNumber = isRestock ? `PO-RESTOCK-${randomCode}` : `SP-2026-08${randomCode}`;

    let currentStage: any = "Inventory";
    let status: any = "Pending";
    let purchasingStatus: any = undefined;
    let productionStage: any = undefined;

    if (payload.productType === "PO Sofa") {
      if (payload.sourceType === "Kebutuhan Stok") {
        // Restock produksi internal → langsung ke Produksi (skip validasi gambar kerja Koordinator Toko)
        currentStage = "Produksi";
        status = "Diproses";
        productionStage = "Potong Rangka";
      } else {
        currentStage = "Kepala Toko";
        status = payload.hasBlueprint ? "Diproses" : "Blocked";
      }
    } else if (payload.productType === "PO Produk Mebel") {
      currentStage = "Purchasing";
      status = "Pending";
      purchasingStatus = "Requested";
    } else {
      currentStage = "Inventory";
      status = "Pending";
    }

    const nowFormatted = new Date().toISOString().replace("T", " ").substring(0, 16);

    const initialTimeline: TimelineEvent[] = [
      {
        id: `t-${Date.now()}-1`,
        timestamp: nowFormatted,
        division: "Sales",
        title: isRestock ? "Pemicu Pengadaan Stok" : "Penerimaan & Input SP",
        description: isRestock 
          ? `Kebutuhan stok diterbitkan untuk ${payload.productName}`
          : `${spNumber} dibuat untuk konsumen ${payload.customerName}`,
        status: "completed",
        pic: isRestock ? "Sistem Restock" : "Sales Toko"
      },
      {
        id: `t-${Date.now()}-2`,
        timestamp: nowFormatted,
        division: currentStage,
        title: `Auto-Routing ke ${currentStage}`,
        description: payload.productType === "PO Sofa" 
          ? (isRestock ? "Diteruskan langsung ke Produksi untuk penjadwalan pengerjaan stok internal" : payload.hasBlueprint ? "Diteruskan ke Koordinator untuk SPK Pabrik" : "Tertahan! Menunggu gambar kerja konsumen")
          : payload.productType === "PO Produk Mebel"
          ? "Diteruskan ke Purchasing untuk penerbitan PO Supplier"
          : "Diteruskan ke Inventory untuk verifikasi ketersediaan fisik",
        status: status === "Blocked" ? "blocked" : "in_progress",
        pic: "Sistem Otomasi"
      }
    ];

    const newOrder: SalesOrder = {
      id: `so-${Date.now().toString().slice(-6)}`,
      spNumber: spNumber,
      sourceType: payload.sourceType,
      customerName: isRestock ? "Internal Gudang & Toko" : payload.customerName,
      customerPhone: payload.customerPhone || "-",
      address: payload.address || (payload.region === "Dalam Kota" ? "Jakarta" : "Luar Kota"),
      productName: payload.productName,
      productType: payload.productType, 
      region: payload.region,
      requestDate: payload.requestDate || "",
      hasBlueprint: payload.hasBlueprint,
      purchasingStatus: purchasingStatus,
      productionStage: productionStage,
      currentStage: currentStage,
      status: status,
      timeline: initialTimeline,
      notes: payload.notes,
      sourceImage: payload.sourceImage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    revalidatePath("/operations");

    return {
      success: true,
      message: `Pesanan ${spNumber} berhasil dibuat dan dialirkan ke ${currentStage}!`,
      data: newOrder,
    };
  } catch (error: any) {
    console.error("Error in submitOrderToEngine:", error);
    return {
      success: false,
      message: "Gagal memproses pesanan.",
      error: error?.message,
    };
  }
}

/**
 * Server Action for AI Smart Order Parser:
 * Simulates Gemini AI extracting key order attributes from raw WhatsApp chat or sales informal notes.
 */
export async function parseOrderFromChat(rawChatText: string): Promise<ActionResponse<Partial<CreateOrderPayload>>> {
  try {
    if (!rawChatText || rawChatText.trim().length < 5) {
      return { success: false, message: "Teks chat terlalu pendek untuk dianalisa." };
    }

    // Delay 1.2 detik untuk simulasi LLM inference
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const lower = rawChatText.toLowerCase();

    // Smart heuristic simulation imitating Gemini extraction
    let customerName = "Ibu Citra Lestari";
    if (lower.includes("pak ") || lower.includes("bpk ")) {
      const match = rawChatText.match(/(?:pak|bpk\.?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
      if (match) customerName = match[0];
    } else if (lower.includes("ibu ") || lower.includes("bu ")) {
      const match = rawChatText.match(/(?:ibu|bu\.?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
      if (match) customerName = match[0];
    }

    let productType: any = "Ready Stock";
    if (lower.includes("custom") || lower.includes("po sofa") || lower.includes("ukuran") || lower.includes("l-shape") || lower.includes("bikin")) {
      productType = "PO Sofa";
    } else if (lower.includes("meja") || lower.includes("kursi kerja") || lower.includes("lemari") || lower.includes("mebel")) {
      productType = "PO Produk Mebel";
    }

    let productName = "Sofa Minimalis 3 Seater Custom";
    if (lower.includes("retro")) productName = "Sofa Retro Vintage 3S";
    else if (lower.includes("recliner")) productName = "Sofa Recliner 1 Seater";
    else if (lower.includes("l-shape") || lower.includes("sudut")) productName = "Sofa Custom L-Shape 260x170cm";
    else if (lower.includes("meja")) productName = "Meja Kopi Minimalis Kayu";

    let region: any = "Dalam Kota";
    if (lower.includes("bogor") || lower.includes("depok") || lower.includes("bekasi") || lower.includes("bandung") || lower.includes("luar kota")) {
      region = "Luar Kota";
    }

    let requestDate = "";
    const dateMatch = rawChatText.match(/(\d{1,2}\s+[A-Za-z]+|\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2})/);
    if (dateMatch) {
      requestDate = "2026-08-25";
    }

    const hasBlueprint = lower.includes("gambar ada") || lower.includes("denah ada") || lower.includes("foto terlampir") || lower.includes("desain sudah");

    let phone = "08129876543";
    const phoneMatch = rawChatText.match(/08\d{8,11}/);
    if (phoneMatch) phone = phoneMatch[0];

    let address = "Jl. Sudirman No. 20, Jakarta Selatan";
    if (lower.includes("kemang")) address = "Jl. Kemang Raya No. 15, Jakarta Selatan";
    else if (lower.includes("bogor")) address = "Sentul City Cluster Victoria Blok B-12, Bogor";

    return {
      success: true,
      message: "AI berhasil mengekstrak informasi pesanan dari teks chat!",
      data: {
        sourceType: "Pesanan Konsumen",
        customerName,
        customerPhone: phone,
        address,
        productName,
        productType,
        region,
        requestDate,
        hasBlueprint: productType === "PO Sofa" ? hasBlueprint : true,
        notes: `Diekstrak oleh Gemini AI dari chat: "${rawChatText.slice(0, 80)}..."`,
      }
    };
  } catch (err: any) {
    return { success: false, message: "Gagal mengekstrak chat", error: err.message };
  }
}

/**
 * Server Action for AI Daily Digest Generator:
 * Reads daily reports from the 5 divisions, cross-references SP numbers, and produces executive digest.
 */
export async function generateDailyDigestAction(reports: DailyReportEntry[]): Promise<ActionResponse<AIDigestResult>> {
  try {
    // Delay 1.5 detik untuk simulasi reasoning LLM
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const todayDate = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    
    // Cross-reference SP mentions
    const mentionedSPs = Array.from(new Set(reports.flatMap(r => r.relatedSP || [])));

    const result: AIDigestResult = {
      date: todayDate,
      summary: `AI memantau ${reports.length} laporan operasional masuk dari 5 divisi hari ini. Terdeteksi ${mentionedSPs.length} nomor SP/PO aktif yang sedang bergerak lintas bagian. Seluruh proses distribusi berjalan normal, namun ada perhatian khusus pada sinkronisasi gambar kerja di Koordinator Toko dan pasokan bahan baku di Gudang.`,
      totalOrdersMonitored: mentionedSPs.length || 6,
      bottlenecks: [
        {
          spNumber: "SP-2026-0802",
          division: "Koordinator Toko & Produksi",
          issue: "Tukang di pabrik belum dapat memulai potong rangka kayu mahoni karena gambar kerja revisi dari arsitek konsumen belum final.",
          severity: "Tinggi",
          recommendation: "Koordinator Toko agar segera memvalidasi gambar kerja malam ini agar antrean pengerjaan besok tidak tertunda."
        },
        {
          spNumber: "PO-RESTOCK-001",
          division: "Purchasing & Inventory",
          issue: "Stok lembaran Busa Rebounded D50 mendekati batas rawan (sisa 4 lembar dari batas aman 10).",
          severity: "Tinggi",
          recommendation: "Purchasing pastikan PO-BB-109 ke vendor Sumber Makmur Foam terkirim besok pagi sebelum produksi sofa baru dimulai."
        }
      ],
      highlights: [
        "Pengiriman pesanan SP-2026-0806 (Sofa Scandinavian) telah tuntas diserahterimakan ke konsumen di Gading Serpong.",
        "Pabrik melaporkan progres SP-2026-0805 (Sofa Recliner) telah mencapai tahap akhir (finishing jok kulit).",
        "Slot distribusi Luar Kota (Bogor) tanggal 20 Agustus telah terplotting 80% pada armada Pak Joko."
      ],
      generatedAt: `${todayDate}, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`
    };

    return {
      success: true,
      message: "AI Daily Digest berhasil disusun dari laporan 5 divisi!",
      data: result
    };
  } catch (err: any) {
    return { success: false, message: "Gagal membuat daily digest", error: err.message };
  }
}

/**
 * Server Action for AI Multimodal Vision Parser:
 * Simulates Gemini Vision OCR analyzing an uploaded image, screenshot, or camera capture
 * of a WhatsApp chat, invoice, or handwritten sales order form.
 */
export async function parseOrderFromImage(payload: {
  imageData?: string;
  fileName?: string;
  samplePreset?: "wa_screenshot" | "paper_sp";
}): Promise<ActionResponse<Partial<CreateOrderPayload>>> {
  try {
    // Delay 1.5 detik untuk simulasi Gemini Multimodal Vision reasoning & OCR
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (payload.samplePreset === "wa_screenshot" || (payload.fileName && payload.fileName.toLowerCase().includes("wa"))) {
      return {
        success: true,
        message: "Gemini Vision berhasil membaca Screenshot WhatsApp konsumen!",
        data: {
          sourceType: "Pesanan Konsumen",
          customerName: "Ibu Dian Permata Sari",
          customerPhone: "081288991122",
          address: "Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan",
          productName: "Sofa L-Shape Modular Velvet Emerald (280x180cm)",
          productType: "PO Sofa",
          region: "Dalam Kota",
          requestDate: "2026-08-30",
          hasBlueprint: true,
          notes: "Diekstrak otomatis via Gemini Vision (Screenshot WhatsApp): Warna Emerald Green Velvet, busa kenyal medium-soft.",
          sourceImage: payload.imageData,
        }
      };
    }

    if (payload.samplePreset === "paper_sp" || (payload.fileName && (payload.fileName.toLowerCase().includes("sp") || payload.fileName.toLowerCase().includes("nota")))) {
      return {
        success: true,
        message: "Gemini Vision berhasil mendigitalkan Foto Formulir SP Kertas Manual!",
        data: {
          sourceType: "Pesanan Konsumen",
          customerName: "Bpk. Hendra Gunawan",
          customerPhone: "081377889900",
          address: "Sentul Alaya Cluster Victoria Blok D-15, Bogor",
          productName: "Sofa Chesterfield 3 Seater Classic Brown Leather",
          productType: "PO Sofa",
          region: "Luar Kota",
          requestDate: "2026-09-05",
          hasBlueprint: false,
          notes: "Diekstrak otomatis via Gemini Vision (Foto Nota SP Fisik No. 092): Gambar kerja sudut L masih menunggu arsitek.",
          sourceImage: payload.imageData,
        }
      };
    }

    // Default uploaded image / camera capture
    return {
      success: true,
      message: "Gemini Multimodal Vision berhasil mengekstrak dokumen gambar ke formulir!",
      data: {
        sourceType: "Pesanan Konsumen",
        customerName: "Ibu Maya Anggraini",
        customerPhone: "081922334455",
        address: "Apartemen Pakubuwono Terrace Tower B Lt. 12, Jaksel",
        productName: "Sofa Bed Lipat Scandinavian Minimalis 2S",
        productType: "Ready Stock",
        region: "Dalam Kota",
        requestDate: "2026-08-28",
        hasBlueprint: true,
        notes: `Diekstrak via Gemini Vision dari dokumen: ${payload.fileName || "Tangkapan Kamera HP / Screenshot"}`,
        sourceImage: payload.imageData,
      }
    };
  } catch (err: any) {
    return { success: false, message: "Gagal memproses gambar dokumen", error: err.message };
  }
}

