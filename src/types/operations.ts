export type ProductType = "Ready Stock" | "PO Sofa" | "PO Produk Mebel";
export type RegionType = "Dalam Kota" | "Luar Kota";
export type OrderStage = "Kepala Toko" | "Produksi" | "Purchasing" | "Inventory" | "Distribusi" | "Selesai";
export type OrderStatus = "Pending" | "Diproses" | "Blocked" | "Selesai";

export interface SalesOrder {
  id: string;
  customerName: string;
  productName: string;
  productType: ProductType;
  region: RegionType;
  requestDate?: string;
  hasBlueprint?: boolean; // Khusus PO Sofa
  purchasingStatus?: "Belum" | "Requested" | "Ordered"; // Khusus PO Mebel
  currentStage: OrderStage;
  productionStage?: "Belum Mulai" | "Potong Rangka" | "Jahit" | "Finishing" | "Selesai"; // Khusus Produksi
  distributionDate?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  productName: string;
  productType: ProductType;
  region: RegionType;
  requestDate?: string;
  hasBlueprint?: boolean;
}

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
