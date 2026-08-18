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

    const AI_ENGINE_URL = process.env.AI_ENGINE_URL || "http://127.0.0.1:8000";

    // Call FastAPI LangGraph Engine
    const response = await fetch(`${AI_ENGINE_URL}/api/route-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `AI Engine returned status: ${response.status}`);
    }

    const result = await response.json();
    
    // The FastAPI returns { success: true, message: "...", data: { order_id: "...", current_stage: "...", ... } }
    if (!result.success) {
      throw new Error(result.message || "Failed to process order in AI Engine");
    }

    // Map the returned Python state (snake_case) back to our TypeScript interface (camelCase)
    // In a real app, you might want to use Zod to parse this safely
    const aiState = result.data;
    
    const newOrder: SalesOrder = {
      id: aiState.order_id || `so-${Date.now().toString().slice(-6)}`,
      customerName: aiState.customer_name,
      productName: aiState.product_name,
      productType: payload.productType, // We keep the original payload types 
      region: payload.region,
      requestDate: aiState.request_date || "",
      hasBlueprint: aiState.has_blueprint,
      purchasingStatus: payload.productType === "PO Produk Mebel" ? "Belum" : undefined,
      currentStage: aiState.current_stage as any,
      status: aiState.status as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // TODO: Insert into Supabase 'sales_orders' table
    // const { data, error } = await supabase.from('sales_orders').insert([newOrder]).select().single()

    // Revalidate the operations path so UI refetches server state if we were doing SSR
    revalidatePath("/operations");

    return {
      success: true,
      message: "Pesanan berhasil dirouting oleh AI Supervisor!",
      data: newOrder,
    };
  } catch (error: any) {
    console.error("Error in submitOrderToEngine:", error);
    return {
      success: false,
      message: "Gagal memproses pesanan dengan AI Engine.",
      error: error?.message,
    };
  }
}
