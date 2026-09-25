import { useState, useEffect, useCallback } from "react";
import { 
  SalesOrder, 
  DailyReportEntry, 
  StockItem, 
  AIDigestResult,
  PurchasingOrder,
  ProductionOrder,
  DistributionOrder,
  TimelineEvent
} from "@/types/operations";
import { 
  mockSalesOrders, 
  mockPurchasingOrders, 
  mockProductionOrders, 
  mockDistributionOrders, 
  mockDailyReports, 
  mockStockItems, 
  initialAIDigest 
} from "@/lib/dummy-data";

const STORAGE_KEYS = {
  ORDERS: "lovise_orders_v2",
  PURCHASING: "lovise_purchasing_v2",
  PRODUCTION: "lovise_production_v2",
  DISTRIBUTION: "lovise_distribution_v2",
  STOCK: "lovise_stock_v2",
  REPORTS: "lovise_daily_reports_v2",
  DIGEST: "lovise_ai_digest_v2",
};

export function useOperationsStore() {
  const [isHydrated, setIsHydrated] = useState(false);
  
  const [orders, setOrders] = useState<SalesOrder[]>(mockSalesOrders);
  const [purchasingOrders, setPurchasingOrders] = useState<PurchasingOrder[]>(mockPurchasingOrders);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(mockProductionOrders);
  const [distributionOrders, setDistributionOrders] = useState<DistributionOrder[]>(mockDistributionOrders);
  const [stockItems, setStockItems] = useState<StockItem[]>(mockStockItems);
  const [dailyReports, setDailyReports] = useState<DailyReportEntry[]>(mockDailyReports);
  const [aiDigest, setAiDigest] = useState<AIDigestResult | null>(initialAIDigest);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedPurchasing = localStorage.getItem(STORAGE_KEYS.PURCHASING);
      if (savedPurchasing) setPurchasingOrders(JSON.parse(savedPurchasing));

      const savedProd = localStorage.getItem(STORAGE_KEYS.PRODUCTION);
      if (savedProd) setProductionOrders(JSON.parse(savedProd));

      const savedDist = localStorage.getItem(STORAGE_KEYS.DISTRIBUTION);
      if (savedDist) setDistributionOrders(JSON.parse(savedDist));

      const savedStock = localStorage.getItem(STORAGE_KEYS.STOCK);
      if (savedStock) setStockItems(JSON.parse(savedStock));

      const savedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (savedReports) setDailyReports(JSON.parse(savedReports));

      const savedDigest = localStorage.getItem(STORAGE_KEYS.DIGEST);
      if (savedDigest) setAiDigest(JSON.parse(savedDigest));
    } catch (e) {
      console.error("Failed to load operations data from storage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync state helpers
  const saveOrders = useCallback((data: SalesOrder[]) => {
    setOrders(data);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(data));
    }
  }, []);

  const savePurchasing = useCallback((data: PurchasingOrder[]) => {
    setPurchasingOrders(data);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PURCHASING, JSON.stringify(data));
    }
  }, []);

  const saveProduction = useCallback((data: ProductionOrder[]) => {
    setProductionOrders(data);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.PRODUCTION, JSON.stringify(data));
    }
  }, []);

  const saveDistribution = useCallback((data: DistributionOrder[]) => {
    setDistributionOrders(data);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.DISTRIBUTION, JSON.stringify(data));
    }
  }, []);

  const saveStock = useCallback((data: StockItem[]) => {
    setStockItems(data);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.STOCK, JSON.stringify(data));
    }
  }, []);

  const saveReports = useCallback((data: DailyReportEntry[]) => {
    setDailyReports(data);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(data));
    }
  }, []);

  const saveDigest = useCallback((data: AIDigestResult | null) => {
    setAiDigest(data);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.DIGEST, JSON.stringify(data));
    }
  }, []);

  // ==========================================
  // 1. SALES ORDER CRUD
  // ==========================================
  // ==========================================
  // CREATE ORDER: Always starts at "Kepala Toko"
  // ==========================================
  const createOrder = useCallback((payload: Partial<SalesOrder>) => {
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    const newOrder: SalesOrder = {
      id: `ord-${Date.now()}`,
      spNumber: payload.spNumber || `SP-${String(orders.length + 1).padStart(3, "0")}`,
      sourceType: payload.sourceType || "Pesanan Konsumen",
      customerName: payload.customerName || "Konsumen Lovise",
      customerPhone: payload.customerPhone || "-",
      address: payload.address || "Jakarta",
      productName: payload.productName || "Sofa Custom Lovise",
      productType: payload.productType || "PO Sofa",
      region: payload.region || "Dalam Kota",
      requestDate: payload.requestDate || formattedDate,
      hasBlueprint: payload.hasBlueprint ?? true,
      // ALWAYS start at Kepala Toko — Koordinator Toko will classify & forward
      currentStage: "Kepala Toko",
      status: "Diproses",
      timeline: payload.timeline || [
        {
          id: `tl-${Date.now()}-1`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          division: "Koordinator Toko",
          title: "Surat Pesanan (SP) Diterbitkan",
          description: `Pesanan dibuat untuk ${payload.customerName || "Konsumen"} (${payload.productName})`,
          status: "completed",
          pic: "Sales Toko"
        }
      ],
      notes: payload.notes || "",
      sourceImage: payload.sourceImage,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...payload,
      // Force override even if payload has different stage
      currentStage: "Kepala Toko" as const,
    };

    const nextOrders = [newOrder, ...orders];
    saveOrders(nextOrders);

    // NO auto-create SPK/PO here — that happens when Koordinator Toko forwards the order
    return newOrder;
  }, [orders, saveOrders]);

  // ==========================================
  // ADVANCE ORDER FROM TOKO (Klasifikasi & Routing)
  // This is the KEY workflow function: Koordinator Toko classifies
  // the order and routes it to the correct division.
  // ==========================================
  const advanceOrderFromToko = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.currentStage !== "Kepala Toko") return;

    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });

    // Determine next stage based on productType (Klasifikasi)
    let nextStage: SalesOrder["currentStage"];
    if (order.productType === "Ready Stock") {
      nextStage = "Inventory";
    } else if (order.productType === "PO Produk Mebel") {
      nextStage = "Purchasing";
    } else {
      // PO Sofa → Produksi
      nextStage = "Produksi";
    }

    // Create timeline event for the forwarding
    const forwardEvent: TimelineEvent = {
      id: `tl-fwd-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      division: "Koordinator Toko",
      title: `Pesanan Diklasifikasi & Diteruskan ke ${nextStage}`,
      description: `Koordinator Toko mengklasifikasi SP ${order.spNumber} sebagai "${order.productType}" dan meneruskan ke divisi ${nextStage}`,
      status: "completed",
      pic: "Koordinator Toko"
    };

    // Update the order stage
    const nextOrders = orders.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        currentStage: nextStage,
        timeline: [...o.timeline, forwardEvent],
        updatedAt: timestamp
      };
    });
    saveOrders(nextOrders);

    // Auto-create linked SPK or PO based on classification
    if (order.productType === "PO Sofa") {
      const newSpk: ProductionOrder = {
        id: `spk-${Date.now()}`,
        spkNumber: `SPK-PRD-${String(productionOrders.length + 1).padStart(3, "0")}`,
        relatedSpNumber: order.spNumber,
        customerName: order.customerName,
        productName: order.productName,
        productCategory: "Sofa Custom",
        carpenterPIC: "Pak Joko & Tim Busa",
        startDate: formattedDate,
        targetDeadline: order.requestDate || "7 Hari Kerja",
        currentStep: "Potong Rangka",
        hasBlueprint: !!order.hasBlueprint,
        blueprintNotes: order.hasBlueprint ? "Gambar kerja teknis terlampir" : "Menunggu gambar arsitek",
        qcStatus: "Menunggu QC",
        status: "Dalam Proses",
        notes: order.notes,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      saveProduction([newSpk, ...productionOrders]);
    } else if (order.productType === "PO Produk Mebel") {
      const newPo: PurchasingOrder = {
        id: `po-${Date.now()}`,
        poNumber: `PO-PUR-${String(purchasingOrders.length + 1).padStart(3, "0")}`,
        relatedSpNumber: order.spNumber,
        supplierName: order.supplierName || "PT Indo Kayu Sejahtera",
        supplierPhone: "0812-9988-7766",
        itemName: order.productName,
        category: "Mebel Jadi",
        quantity: 1,
        unit: "Unit",
        unitPrice: 3500000,
        totalPrice: 3500000,
        orderDate: formattedDate,
        expectedDeliveryDate: order.requestDate || "5 Hari Kerja",
        status: "Dipesan",
        paymentStatus: "DP 50%",
        notes: `Pengadaan khusus untuk SP ${order.spNumber}`,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      savePurchasing([newPo, ...purchasingOrders]);
    }
    // Ready Stock: no linked order to create, just goes to Inventory directly

    return nextStage;
  }, [orders, productionOrders, purchasingOrders, saveOrders, saveProduction, savePurchasing]);

  // ==========================================
  // RELEASE TO DISTRIBUSI (from Inventory)
  // Inventory confirms goods are allocated and ready for delivery
  // ==========================================
  const releaseToDistribusi = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.currentStage !== "Inventory") return;

    const releaseEvent: TimelineEvent = {
      id: `tl-rel-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      division: "Inventory",
      title: "Barang Dialokasi & Siap Kirim",
      description: `Gudang telah mempersiapkan dan mengalokasikan barang untuk SP ${order.spNumber}. Siap diteruskan ke Distribusi.`,
      status: "completed",
      pic: "Kepala Gudang"
    };

    const nextOrders = orders.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        currentStage: "Distribusi" as const,
        timeline: [...o.timeline, releaseEvent],
        updatedAt: new Date().toISOString()
      };
    });
    saveOrders(nextOrders);
  }, [orders, saveOrders]);

  // ==========================================
  // RECORD RESTOCK COMPLETED (from Inventory)
  // For "Kebutuhan Stok": goods are recorded as warehouse inventory & order is closed
  // ==========================================
  const recordRestockCompleted = useCallback((orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order || order.currentStage !== "Inventory") return;

    const stockEvent: TimelineEvent = {
      id: `tl-stk-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      division: "Inventory",
      title: "Dicatat sebagai Persediaan Gudang (Selesai)",
      description: `Barang pengadaan stok (${order.productName}) telah diverifikasi fisik dan dicatat dalam persediaan gudang. Siap dialokasikan ke pesanan berikutnya.`,
      status: "completed",
      pic: "Kepala Gudang"
    };

    const nextOrders = orders.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        currentStage: "Selesai" as const,
        status: "Selesai" as const,
        timeline: [...o.timeline, stockEvent],
        updatedAt: new Date().toISOString()
      };
    });
    saveOrders(nextOrders);

    // Auto increase matching stock item if available
    const existingStock = stockItems.find(s => 
      s.name.toLowerCase().includes(order.productName.toLowerCase()) || 
      order.productName.toLowerCase().includes(s.name.toLowerCase())
    );

    if (existingStock) {
      const nextStock = stockItems.map(s => {
        if (s.id !== existingStock.id) return s;
        const newQty = s.currentStock + 1;
        const newStatus: "Aman" | "Mendekati Minimum" | "Kritis" = 
          newQty >= s.minStock ? "Aman" : newQty >= s.minStock / 2 ? "Mendekati Minimum" : "Kritis";
        return {
          ...s,
          currentStock: newQty,
          status: newStatus,
          recommendedRestock: Math.max(0, s.minStock * 2 - newQty)
        };
      });
      saveStock(nextStock);
    }
  }, [orders, stockItems, saveOrders, saveStock]);

  const updateOrder = useCallback((id: string, updates: Partial<SalesOrder>) => {
    const nextOrders = orders.map((o) => {
      if (o.id !== id) return o;
      return {
        ...o,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    });
    saveOrders(nextOrders);
  }, [orders, saveOrders]);

  const deleteOrder = useCallback((id: string) => {
    const target = orders.find(o => o.id === id);
    if (!target) return;
    saveOrders(orders.filter(o => o.id !== id));
    // Also clean up linked production or purchasing if desired
    saveProduction(productionOrders.filter(p => p.relatedSpNumber !== target.spNumber));
    savePurchasing(purchasingOrders.filter(p => p.relatedSpNumber !== target.spNumber));
    saveDistribution(distributionOrders.filter(d => d.relatedSpNumber !== target.spNumber));
  }, [orders, productionOrders, purchasingOrders, distributionOrders, saveOrders, saveProduction, savePurchasing, saveDistribution]);

  // ==========================================
  // 2. PURCHASING CRUD
  // ==========================================
  const createPurchasingOrder = useCallback((payload: Partial<PurchasingOrder>) => {
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    const qty = payload.quantity || 1;
    const price = payload.unitPrice || 500000;

    const newPO: PurchasingOrder = {
      id: `po-${Date.now()}`,
      poNumber: payload.poNumber || `PO-PUR-${String(purchasingOrders.length + 1).padStart(3, "0")}`,
      relatedSpNumber: payload.relatedSpNumber,
      supplierName: payload.supplierName || "PT Foamindo Abadi",
      supplierPhone: payload.supplierPhone || "0812-3344-5566",
      itemName: payload.itemName || "Busa Rebounded D50",
      category: payload.category || "Busa",
      quantity: qty,
      unit: payload.unit || "Lembar",
      unitPrice: price,
      totalPrice: payload.totalPrice || (qty * price),
      orderDate: payload.orderDate || formattedDate,
      expectedDeliveryDate: payload.expectedDeliveryDate || "3 Hari",
      status: payload.status || "Dipesan",
      paymentStatus: payload.paymentStatus || "DP 50%",
      notes: payload.notes || "",
      createdAt: timestamp,
      updatedAt: timestamp,
      ...payload
    };

    const next = [newPO, ...purchasingOrders];
    savePurchasing(next);

    // If related to an order, update timeline
    if (newPO.relatedSpNumber) {
      const order = orders.find(o => o.spNumber === newPO.relatedSpNumber);
      if (order) {
        const newEvent: TimelineEvent = {
          id: `tl-pur-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          division: "Purchasing",
          title: `PO Diterbitkan ke ${newPO.supplierName}`,
          description: `Pengadaan ${newPO.itemName} (${newPO.quantity} ${newPO.unit})`,
          status: "completed",
          pic: "Staf Purchasing (Rudi)"
        };
        updateOrder(order.id, {
          purchasingStatus: "Ordered",
          timeline: [...order.timeline, newEvent]
        });
      }
    }

    return newPO;
  }, [purchasingOrders, orders, savePurchasing, updateOrder]);

  const updatePurchasingOrder = useCallback((id: string, updates: Partial<PurchasingOrder>) => {
    const next = purchasingOrders.map((po) => {
      if (po.id !== id) return po;
      const updated = {
        ...po,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      if (updates.quantity || updates.unitPrice) {
        const q = updates.quantity ?? po.quantity;
        const p = updates.unitPrice ?? po.unitPrice;
        updated.totalPrice = q * p;
      }
      return updated;
    });
    savePurchasing(next);
  }, [purchasingOrders, savePurchasing]);

  const receivePurchasingOrder = useCallback((id: string) => {
    const target = purchasingOrders.find(p => p.id === id);
    if (!target) return;

    // Update PO status to 'Tiba di Gudang'
    const nextPOs = purchasingOrders.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        status: "Tiba di Gudang" as const,
        actualArrivalDate: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        paymentStatus: "Lunas" as const,
        updatedAt: new Date().toISOString()
      };
    });
    savePurchasing(nextPOs);

    // Auto update / increase stock item in Inventory
    const existingStock = stockItems.find(s => 
      s.name.toLowerCase().includes(target.itemName.toLowerCase()) || 
      target.itemName.toLowerCase().includes(s.name.toLowerCase())
    );

    if (existingStock) {
      const nextStock = stockItems.map(s => {
        if (s.id !== existingStock.id) return s;
        const newQty = s.currentStock + target.quantity;
        const newStatus: "Aman" | "Mendekati Minimum" | "Kritis" = 
          newQty >= s.minStock ? "Aman" : newQty >= s.minStock / 2 ? "Mendekati Minimum" : "Kritis";
        return {
          ...s,
          currentStock: newQty,
          status: newStatus,
          recommendedRestock: Math.max(0, s.minStock * 2 - newQty)
        };
      });
      saveStock(nextStock);
    }

    // If linked to SalesOrder, advance stage or add timeline
    if (target.relatedSpNumber) {
      const order = orders.find(o => o.spNumber === target.relatedSpNumber);
      if (order) {
        const newEvent: TimelineEvent = {
          id: `tl-rcv-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          division: "Inventory",
          title: "Bahan / Mebel Masuk Gudang",
          description: `${target.itemName} telah diterima dan diperiksa oleh Gudang`,
          status: "completed",
          pic: "Kepala Gudang"
        };
        updateOrder(order.id, {
          currentStage: "Inventory",
          timeline: [...order.timeline, newEvent]
        });
      }
    }
  }, [purchasingOrders, stockItems, orders, savePurchasing, saveStock, updateOrder]);

  const deletePurchasingOrder = useCallback((id: string) => {
    savePurchasing(purchasingOrders.filter(p => p.id !== id));
  }, [purchasingOrders, savePurchasing]);

  // ==========================================
  // 3. PRODUCTION CRUD
  // ==========================================
  const createProductionOrder = useCallback((payload: Partial<ProductionOrder>) => {
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

    const newSPK: ProductionOrder = {
      id: `spk-${Date.now()}`,
      spkNumber: payload.spkNumber || `SPK-PRD-${String(productionOrders.length + 1).padStart(3, "0")}`,
      relatedSpNumber: payload.relatedSpNumber,
      customerName: payload.customerName || "Konsumen",
      productName: payload.productName || "Sofa Custom Lovise",
      productCategory: payload.productCategory || "Sofa Custom",
      carpenterPIC: payload.carpenterPIC || "Pak Joko (Mandor Pabrik)",
      startDate: payload.startDate || formattedDate,
      targetDeadline: payload.targetDeadline || "7 Hari Kerja",
      currentStep: payload.currentStep || "Potong Rangka",
      hasBlueprint: payload.hasBlueprint ?? true,
      blueprintNotes: payload.blueprintNotes || "Gambar kerja terlampir",
      qcStatus: "Menunggu QC",
      status: "Dalam Proses",
      notes: payload.notes || "",
      createdAt: timestamp,
      updatedAt: timestamp,
      ...payload
    };

    saveProduction([newSPK, ...productionOrders]);
    return newSPK;
  }, [productionOrders, saveProduction]);

  const updateProductionOrder = useCallback((id: string, updates: Partial<ProductionOrder>) => {
    const next = productionOrders.map((spk) => {
      if (spk.id !== id) return spk;
      return {
        ...spk,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    });
    saveProduction(next);
  }, [productionOrders, saveProduction]);

  const advanceProductionStep = useCallback((id: string, step: ProductionOrder["currentStep"]) => {
    const target = productionOrders.find(s => s.id === id);
    if (!target) return;

    const isQC = step === "QC & Selesai";
    const next = productionOrders.map(s => {
      if (s.id !== id) return s;
      return {
        ...s,
        currentStep: step,
        qcStatus: (isQC ? "Lolos QC (Passed)" : s.qcStatus) as any,
        status: (isQC ? "Selesai" : "Dalam Proses") as any,
        actualFinishedDate: isQC ? new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : undefined,
        updatedAt: new Date().toISOString()
      };
    });
    saveProduction(next);

    // If related to an order and QC Passed, add timeline and advance order to Inventory
    if (target.relatedSpNumber) {
      const order = orders.find(o => o.spNumber === target.relatedSpNumber);
      if (order) {
        const newEvent: TimelineEvent = {
          id: `tl-step-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          division: "Produksi",
          title: `Tahap Produksi: ${step}`,
          description: isQC ? "Produk sofa lolos QC mandor pabrik dan siap serah terima gudang" : `Pengerjaan berlangsung di ${step}`,
          status: "completed",
          pic: target.carpenterPIC
        };
        const updates: Partial<SalesOrder> = {
          timeline: [...order.timeline, newEvent]
        };
        if (isQC) {
          updates.currentStage = "Inventory";
          updates.productionStage = "QC & Selesai";
        }
        updateOrder(order.id, updates);
      }
    }
  }, [productionOrders, orders, saveProduction, updateOrder]);

  const deleteProductionOrder = useCallback((id: string) => {
    saveProduction(productionOrders.filter(p => p.id !== id));
  }, [productionOrders, saveProduction]);

  // ==========================================
  // 4. INVENTORY CRUD
  // ==========================================
  const createStockItem = useCallback((payload: Partial<StockItem>) => {
    const current = payload.currentStock || 0;
    const min = payload.minStock || 5;
    const status: "Aman" | "Mendekati Minimum" | "Kritis" = 
      current >= min ? "Aman" : current >= min / 2 ? "Mendekati Minimum" : "Kritis";

    const newItem: StockItem = {
      id: `stk-${Date.now()}`,
      sku: payload.sku || `SKU-${Date.now().toString().slice(-6)}`,
      name: payload.name || "Bahan Baku Baru",
      category: payload.category || "Bahan Baku",
      currentStock: current,
      minStock: min,
      unit: payload.unit || "Pcs",
      status: status,
      recommendedRestock: Math.max(0, (min * 2) - current),
      ...payload
    };

    saveStock([...stockItems, newItem]);
    return newItem;
  }, [stockItems, saveStock]);

  const updateStockItem = useCallback((id: string, updates: Partial<StockItem>) => {
    const next = stockItems.map((item) => {
      if (item.id !== id) return item;
      const current = updates.currentStock ?? item.currentStock;
      const min = updates.minStock ?? item.minStock;
      const status: "Aman" | "Mendekati Minimum" | "Kritis" = 
        current >= min ? "Aman" : current >= min / 2 ? "Mendekati Minimum" : "Kritis";

      return {
        ...item,
        ...updates,
        status,
        recommendedRestock: Math.max(0, (min * 2) - current)
      };
    });
    saveStock(next);
  }, [stockItems, saveStock]);

  const adjustStock = useCallback((id: string, deltaQty: number, reason: string) => {
    const target = stockItems.find(s => s.id === id);
    if (!target) return;
    const newQty = Math.max(0, target.currentStock + deltaQty);
    updateStockItem(id, { currentStock: newQty });

    // Optional daily report log for audit
    const report: DailyReportEntry = {
      id: `rep-opn-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      division: "Inventory",
      reporter: "Petugas Gudang (Opname)",
      notes: `Stock Opname ${target.name}: ${deltaQty >= 0 ? "+" : ""}${deltaQty} ${target.unit}. Alasan: ${reason}`,
      urgency: newQty < target.minStock ? "Perhatian" : "Normal"
    };
    saveReports([report, ...dailyReports]);
  }, [stockItems, updateStockItem, dailyReports, saveReports]);

  const deleteStockItem = useCallback((id: string) => {
    saveStock(stockItems.filter(s => s.id !== id));
  }, [stockItems, saveStock]);

  // ==========================================
  // 5. DISTRIBUTION CRUD
  // ==========================================
  const createDistributionOrder = useCallback((payload: Partial<DistributionOrder>) => {
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

    const newSJ: DistributionOrder = {
      id: `sj-${Date.now()}`,
      sjNumber: payload.sjNumber || `SJ-DIST-${String(distributionOrders.length + 1).padStart(3, "0")}`,
      relatedSpNumber: payload.relatedSpNumber || "SP-001",
      customerName: payload.customerName || "Konsumen Lovise",
      customerPhone: payload.customerPhone || "0812-0000-0000",
      destinationAddress: payload.destinationAddress || "Jakarta",
      region: payload.region || "Dalam Kota",
      driverName: payload.driverName || "Pak Agus",
      vehiclePlate: payload.vehiclePlate || "Truk Box (B 9021 LOV)",
      scheduledDate: payload.scheduledDate || formattedDate,
      timeSlot: payload.timeSlot || "Pagi (09:00 - 13:00)",
      status: payload.status || "Menunggu Muat",
      notes: payload.notes || "",
      createdAt: timestamp,
      updatedAt: timestamp,
      ...payload
    };

    saveDistribution([newSJ, ...distributionOrders]);

    // Update related order stage if exists
    if (newSJ.relatedSpNumber) {
      const order = orders.find(o => o.spNumber === newSJ.relatedSpNumber);
      if (order) {
        const newEvent: TimelineEvent = {
          id: `tl-sj-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          division: "Distribusi",
          title: `Surat Jalan Dibuat (${newSJ.sjNumber})`,
          description: `Jadwal pengiriman dengan supir ${newSJ.driverName} (${newSJ.vehiclePlate})`,
          status: "in_progress",
          pic: "Koordinator Logistik"
        };
        updateOrder(order.id, {
          currentStage: "Distribusi",
          distributionDate: newSJ.scheduledDate,
          driverName: newSJ.driverName,
          timeline: [...order.timeline, newEvent]
        });
      }
    }

    return newSJ;
  }, [distributionOrders, orders, saveDistribution, updateOrder]);

  const updateDistributionOrder = useCallback((id: string, updates: Partial<DistributionOrder>) => {
    const next = distributionOrders.map((sj) => {
      if (sj.id !== id) return sj;
      return {
        ...sj,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    });
    saveDistribution(next);
  }, [distributionOrders, saveDistribution]);

  const completeDelivery = useCallback((id: string, receivedBy: string, recipientNotes?: string) => {
    const target = distributionOrders.find(d => d.id === id);
    if (!target) return;

    const next = distributionOrders.map(d => {
      if (d.id !== id) return d;
      return {
        ...d,
        status: "Terkirim" as const,
        receivedBy: receivedBy || d.customerName,
        recipientNotes: recipientNotes || "Barang diterima dengan baik",
        updatedAt: new Date().toISOString()
      };
    });
    saveDistribution(next);

    // If related to an order, advance to Selesai
    if (target.relatedSpNumber) {
      const order = orders.find(o => o.spNumber === target.relatedSpNumber);
      if (order) {
        const newEvent: TimelineEvent = {
          id: `tl-dlv-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          division: "Distribusi",
          title: "Pengiriman Selesai & Diterima",
          description: `Sofa telah diterima oleh ${receivedBy || target.customerName}`,
          status: "completed",
          pic: target.driverName
        };
        updateOrder(order.id, {
          currentStage: "Selesai",
          status: "Selesai",
          timeline: [...order.timeline, newEvent]
        });
      }
    }
  }, [distributionOrders, orders, saveDistribution, updateOrder]);

  const deleteDistributionOrder = useCallback((id: string) => {
    saveDistribution(distributionOrders.filter(d => d.id !== id));
  }, [distributionOrders, saveDistribution]);

  // ==========================================
  // 6. DAILY REPORTS CRUD
  // ==========================================
  const createDailyReport = useCallback((payload: Partial<DailyReportEntry>) => {
    const newReport: DailyReportEntry = {
      id: `rep-${Date.now()}`,
      date: payload.date || new Date().toISOString().split("T")[0],
      time: payload.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      division: payload.division || "Purchasing",
      reporter: payload.reporter || "Staf Operasional",
      notes: payload.notes || "Laporan operasional",
      relatedSP: payload.relatedSP || [],
      urgency: payload.urgency || "Normal",
      ...payload
    };

    saveReports([newReport, ...dailyReports]);
    return newReport;
  }, [dailyReports, saveReports]);

  const updateDailyReport = useCallback((id: string, updates: Partial<DailyReportEntry>) => {
    const next = dailyReports.map(r => r.id === id ? { ...r, ...updates } : r);
    saveReports(next);
  }, [dailyReports, saveReports]);

  const deleteDailyReport = useCallback((id: string) => {
    saveReports(dailyReports.filter(r => r.id !== id));
  }, [dailyReports, saveReports]);

  // Reset helper
  const resetAllData = useCallback(() => {
    if (typeof window !== "undefined") {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    }
    setOrders([]);
    setPurchasingOrders([]);
    setProductionOrders([]);
    setDistributionOrders([]);
    setDailyReports([]);
    setStockItems(mockStockItems);
    setAiDigest(null);
  }, []);

  return {
    isHydrated,
    orders,
    purchasingOrders,
    productionOrders,
    distributionOrders,
    stockItems,
    dailyReports,
    aiDigest,
    // Actions
    createOrder,
    updateOrder,
    deleteOrder,
    advanceOrderFromToko,
    releaseToDistribusi,
    recordRestockCompleted,
    createPurchasingOrder,
    updatePurchasingOrder,
    receivePurchasingOrder,
    deletePurchasingOrder,
    createProductionOrder,
    updateProductionOrder,
    advanceProductionStep,
    deleteProductionOrder,
    createStockItem,
    updateStockItem,
    adjustStock,
    deleteStockItem,
    createDistributionOrder,
    updateDistributionOrder,
    completeDelivery,
    deleteDistributionOrder,
    createDailyReport,
    updateDailyReport,
    deleteDailyReport,
    setAiDigest: saveDigest,
    resetAllData
  };
}
