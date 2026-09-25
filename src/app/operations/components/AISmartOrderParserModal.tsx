"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, X, ImageIcon, Camera, MessageSquare, Upload, 
  Scan, BrainCircuit, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateOrderPayload } from "@/types/operations";
import { parseOrderFromChat, parseOrderFromImage } from "../actions";

// SVG Mock Presets for Instant Multimodal Demo
export const DEMO_WA_SCREENSHOT = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320">
  <rect width="480" height="320" fill="#EFEAE2"/>
  <rect width="480" height="52" fill="#075E54"/>
  <circle cx="32" cy="26" r="16" fill="#128C7E"/>
  <text x="60" y="26" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="bold">Ibu Dian Permata Sari (081288991122)</text>
  <text x="60" y="41" fill="#C5E2DC" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11">Online • WhatsApp Chat</text>
  
  <rect x="24" y="70" width="340" height="95" rx="12" fill="#FFFFFF"/>
  <text x="38" y="94" fill="#1E293B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Halo min, mau pesan custom sofa L-Shape:</text>
  <text x="38" y="114" fill="#047857" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="bold">• Sofa Modular L-Shape (Ukuran 280x180cm)</text>
  <text x="38" y="134" fill="#1E293B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">• Bahan Velvet Emerald Green #04, busa kenyal</text>
  <text x="38" y="152" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10">10:14 • Terkirim</text>
  
  <rect x="24" y="178" width="360" height="115" rx="12" fill="#FFFFFF"/>
  <text x="38" y="202" fill="#1E293B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Alamat: Jl. Senopati No. 88, Kebayoran Baru, Jaksel.</text>
  <text x="38" y="222" fill="#2563EB" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="bold">Tgl kirim: Minta diantar tanggal 30 Agustus 2026 ya.</text>
  <text x="38" y="242" fill="#1E293B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Gambar kerja sudah ada dari arsitek kami.</text>
  <text x="38" y="262" fill="#059669" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="bold">✓ Gambar Kerja: Ada / Lengkap</text>
  <text x="38" y="280" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10">10:16 • Dibaca</text>
</svg>
`);

export const DEMO_PAPER_SP = "data:image/svg+xml;utf8," + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320">
  <rect width="480" height="320" fill="#FFFDF8" stroke="#E2E8F0" stroke-width="2"/>
  <rect x="20" y="18" width="440" height="42" fill="#0F172A" rx="6"/>
  <text x="36" y="44" fill="#F8FAFC" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="bold">LOVISE SOFA — FORMULIR PESANAN TOKO</text>
  <text x="380" y="44" fill="#F59E0B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="bold">SP-092</text>
  
  <line x1="20" y1="72" x2="460" y2="72" stroke="#CBD5E1" stroke-dasharray="4"/>
  <text x="30" y="98" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Nama Konsumen:</text>
  <text x="160" y="98" fill="#0F172A" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="bold">Bpk. Hendra Gunawan (081377889900)</text>
  
  <text x="30" y="125" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Produk Pesanan:</text>
  <text x="160" y="125" fill="#0F172A" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="bold">Sofa Chesterfield 3 Seater Classic Brown</text>
  
  <text x="30" y="152" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Jenis Pesanan:</text>
  <text x="160" y="152" fill="#D97706" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="bold">[X] PO Sofa Custom Pabrik</text>
  
  <text x="30" y="179" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Alamat Kirim:</text>
  <text x="160" y="179" fill="#0F172A" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Sentul Alaya Cluster Victoria Blok D-15, Bogor</text>
  
  <text x="30" y="206" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Wilayah / Tgl:</text>
  <text x="160" y="206" fill="#0F172A" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Luar Kota • Request: 5 Sept 2026</text>
  
  <text x="30" y="233" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Gambar Kerja:</text>
  <text x="160" y="233" fill="#DC2626" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="bold">[ ] Belum ada (Menyusul via arsitek)</text>
  
  <rect x="25" y="252" width="430" height="48" fill="#F8FAFC" rx="6" stroke="#E2E8F0"/>
  <text x="38" y="272" fill="#475569" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11">Catatan: Bahan kulit sintetis grade A, warna dark brown coklat tua.</text>
  <text x="38" y="288" fill="#64748B" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="10">Dicatat oleh Sales: Toko Fatmawati (Sarah) — 24/09/2026</text>
</svg>
`);

interface AISmartOrderParserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtracted: (data: Partial<CreateOrderPayload>, imageUri?: string) => void;
}

export default function AISmartOrderParserModal({
  isOpen,
  onClose,
  onExtracted
}: AISmartOrderParserModalProps) {
  const [parserMode, setParserMode] = useState<"text" | "upload" | "camera">("upload");
  const [chatInputText, setChatInputText] = useState("");
  const [isParsingChat, setIsParsingChat] = useState(false);
  
  // Multimodal Vision Upload/Camera States
  const [uploadedImage, setUploadedImage] = useState<string | null>(DEMO_WA_SCREENSHOT);
  const [uploadedFileName, setUploadedFileName] = useState<string>("Screenshot_WA_Ibu_Dian.jpg");
  const [activePreset, setActivePreset] = useState<"wa_screenshot" | "paper_sp" | null>("wa_screenshot");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setActivePreset(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: "wa_screenshot" | "paper_sp") => {
    setActivePreset(preset);
    setUploadedImage(preset === "wa_screenshot" ? DEMO_WA_SCREENSHOT : DEMO_PAPER_SP);
    setUploadedFileName(preset === "wa_screenshot" ? "Screenshot_WA_Ibu_Dian.jpg" : "Foto_Nota_SP_Fatmawati_092.jpg");
  };

  const handleExecuteAIExtraction = async () => {
    setIsParsingChat(true);

    try {
      if (parserMode === "text") {
        if (!chatInputText.trim()) return;
        const res = await parseOrderFromChat(chatInputText);
        if (res.success && res.data) {
          onExtracted(res.data);
          onClose();
        }
      } else {
        const res = await parseOrderFromImage({
          imageData: uploadedImage || undefined,
          fileName: uploadedFileName || undefined,
          samplePreset: activePreset || undefined
        });
        if (res.success && res.data) {
          onExtracted(res.data, uploadedImage || undefined);
          onClose();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsParsingChat(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-amber-400 text-slate-900 rounded-lg">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-bold">AI Smart Order Parser (Gemini Multimodal)</h3>
              <p className="text-xs text-indigo-200">Ekstrak data pesanan dari Chat WhatsApp, Foto Nota SP, atau Kamera HP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 p-2 bg-slate-100 border-b text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setParserMode("upload")}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              parserMode === "upload" 
                ? "bg-white text-indigo-700 shadow-xs font-bold" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ImageIcon size={14} /> Upload Foto / Screenshot
          </button>
          <button
            type="button"
            onClick={() => setParserMode("camera")}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              parserMode === "camera" 
                ? "bg-white text-indigo-700 shadow-xs font-bold" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Camera size={14} /> Kamera HP Langsung
          </button>
          <button
            type="button"
            onClick={() => setParserMode("text")}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              parserMode === "text" 
                ? "bg-white text-indigo-700 shadow-xs font-bold" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare size={14} /> Teks Chat WA
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* 1. MODE: UPLOAD FOTO / SCREENSHOT */}
          {parserMode === "upload" && (
            <div className="space-y-3.5">
              {/* Presets Bar for Instant Client Demo */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700">Contoh Dokumen Demo (1-Klik Presentasi):</span>
                  <span className="text-[10px] text-slate-400">Pilih salah satu untuk tes cepat</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPreset("wa_screenshot")}
                    className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center gap-2 ${
                      activePreset === "wa_screenshot" 
                        ? "bg-indigo-50 border-indigo-400 text-indigo-900 font-bold" 
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="p-1 bg-emerald-100 text-emerald-800 rounded">📱</span>
                    <div>
                      <div className="leading-tight">Screenshot Chat WA</div>
                      <div className="text-[10px] text-slate-400 font-normal">Sofa Modular Emerald</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPreset("paper_sp")}
                    className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center gap-2 ${
                      activePreset === "paper_sp" 
                        ? "bg-indigo-50 border-indigo-400 text-indigo-900 font-bold" 
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="p-1 bg-amber-100 text-amber-800 rounded">📝</span>
                    <div>
                      <div className="leading-tight">Foto Nota SP Kertas</div>
                      <div className="text-[10px] text-slate-400 font-normal">Formulir Toko No. 092</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dropzone Area */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/40 rounded-xl p-4 text-center cursor-pointer transition-colors space-y-1.5"
              >
                <div className="inline-flex p-2 bg-indigo-100 text-indigo-700 rounded-full">
                  <Upload size={18} />
                </div>
                <div className="text-xs font-semibold text-slate-800">
                  Klik untuk upload gambar atau drag & drop file di sini
                </div>
                <p className="text-[11px] text-slate-500">
                  Mendukung screenshot chat, foto SP nota kertas, struk kasir, atau gambar pesanan (JPG, PNG)
                </p>
              </div>

              {/* Image Preview & Laser Scan Animation */}
              {uploadedImage && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Preview Dokumen Terpilih:</span>
                    <span className="text-[11px] font-mono text-indigo-600">{uploadedFileName}</span>
                  </div>
                  
                  <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center max-h-56">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded Preview" 
                      className="w-full max-h-56 object-contain"
                    />
                    
                    {isParsingChat && (
                      <motion.div
                        initial={{ top: "0%" }}
                        animate={{ top: ["0%", "95%", "0%"] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] pointer-events-none"
                      />
                    )}

                    {isParsingChat && (
                      <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="bg-slate-900/90 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border border-cyan-400/40 shadow-lg">
                          <Scan className="h-4 w-4 text-cyan-300 animate-pulse" />
                          Gemini Multimodal Vision mendeteksi teks...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. MODE: KAMERA HP LANGSUNG */}
          {parserMode === "camera" && (
            <div className="space-y-4 text-center py-2">
              <input 
                type="file" 
                ref={cameraInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                capture="environment" 
                className="hidden" 
              />

              <div className="border border-slate-200 rounded-2xl p-6 bg-gradient-to-b from-slate-50 to-white space-y-4">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Camera size={32} />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">
                    Ambil Foto Langsung via Kamera
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Arahkan kamera ke formulir SP kertas toko, faktur fisik, atau sketsa gambar kerja pesanan custom.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                  <Button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 flex items-center gap-2 shadow-sm w-full sm:w-auto"
                  >
                    <Camera size={15} /> Buka Kamera HP
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      handleSelectPreset("paper_sp");
                      setParserMode("upload");
                    }}
                    className="text-xs text-slate-700 border-slate-300 hover:bg-slate-100 w-full sm:w-auto"
                  >
                    Simulasikan Hasil Foto Nota
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 3. MODE: TEKS CHAT WA */}
          {parserMode === "text" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Teks Chat WhatsApp Mentah:
                </label>
                <button
                  type="button"
                  onClick={() => setChatInputText(
                    "Min tolong buatin sofa custom model L-Shape ukuran 270x180 bahan velvet emerald green ya.\nNama: Ibu Citra Lestari (081299887766)\nAlamat: Jl. Kemang Raya No. 15, Jakarta Selatan\nKirim tgl 28 Agustus ya. Gambar kerja sudah ada."
                  )}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  + Isi Contoh Chat
                </button>
              </div>

              <textarea
                rows={5}
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                placeholder="Contoh:&#10;Min tolong buatin sofa custom model L-Shape ukuran 270x180 bahan velvet abu-abu ya.&#10;Nama: Ibu Citra Lestari&#10;Alamat: Jl. Kemang Raya No. 15, Jakarta Selatan&#10;Kirim tgl 25 Agustus ya."
                className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {/* AI Explanation Banner */}
          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200/80 rounded-xl p-3 text-[11px] text-indigo-950 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <BrainCircuit size={13} className="text-indigo-600" /> 
              {parserMode === "text" ? "Gemini Text Extraction:" : "Gemini Multimodal Vision OCR:"}
            </div>
            <p className="text-slate-600 leading-relaxed">
              {parserMode === "text" 
                ? "AI membaca konteks chat dan mengekstrak Nama, Produk, Wilayah, Tanggal Request, dan Status Gambar Kerja."
                : "AI mengenali tulisan tangan nota fisik maupun tangkapan layar, membaca field pesanan, dan mengisikannya otomatis ke formulir tanpa ketik ulang."}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-xs"
          >
            Batal
          </Button>
          <Button
            onClick={handleExecuteAIExtraction}
            disabled={isParsingChat || (parserMode === "text" && !chatInputText.trim()) || (parserMode !== "text" && !uploadedImage)}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm px-4"
          >
            {isParsingChat ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Menganalisis dengan Gemini AI...</>
            ) : (
              <><Sparkles size={14} className="text-amber-300" /> Ekstrak ke Formulir SP</>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
