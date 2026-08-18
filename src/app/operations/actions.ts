"use server";

import { revalidatePath } from "next/cache";
import { CreateOrderPayload, ActionResponse, SalesOrder } from "@/types/operations";

/**
 * Server Action to submit new sales order to LangGraph / Supabase
 * Mocking the Supabase insert and AI routing for now
 */
export async function submitOrderToEngine(payload: CreateOrderPayload): Promise<ActionResponse<SalesOrder>> {
  try {
    // Basic validation
    if (!payload.customerName || !payload.productName) {
      return { success: false, message: "Nama konsumen dan produk wajib diisi." };
    }

    // SIMULASI DUMMY (Tanpa konek ke Backend Python)
    // Delay buatan agar seolah-olah AI sedang berpikir
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let currentStage: any = "Inventory";
    let status: any = "Pending";

    if (payload.productType === "PO Sofa") {
      currentStage = "Kepala Toko";
      status = payload.hasBlueprint ? "Diproses" : "Blocked";
    } else if (payload.productType === "PO Produk Mebel") {
      currentStage = "Purchasing";
      status = "Pending";
    } else {
      currentStage = "Inventory";
      status = "Pending";
    }

    const newOrder: SalesOrder = {
      id: `so-${Date.now().toString().slice(-6)}`,
      customerName: payload.customerName,
      productName: payload.productName,
      productType: payload.productType, 
      region: payload.region,
      requestDate: payload.requestDate || "",
      hasBlueprint: payload.hasBlueprint,
      purchasingStatus: payload.productType === "PO Produk Mebel" ? "Belum" : undefined,
      currentStage: currentStage,
      status: status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    revalidatePath("/operations");

    return {
      success: true,
      message: "Pesanan berhasil dirouting secara otomatis (Dummy AI)!",
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
