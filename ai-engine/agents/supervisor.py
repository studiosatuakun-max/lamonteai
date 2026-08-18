from langgraph.graph import StateGraph, END
from agents.state import OrderState

# --- Node Functions (The Agents) ---

def hr_agent(state: OrderState) -> OrderState:
    """Checks manpower/workload (Kepala Toko / Tukang)"""
    state["hr_feedback"] = "HR check completed. Workload is manageable."
    state["reasoning"].append("HR Agent verified capacity.")
    return state

def finance_agent(state: OrderState) -> OrderState:
    """Checks credit limit or outstanding invoices"""
    state["finance_feedback"] = "Finance check completed. No outstanding balance."
    state["reasoning"].append("Finance Agent verified credit.")
    return state

def ops_agent(state: OrderState) -> OrderState:
    """Checks inventory and materials"""
    state["ops_feedback"] = "Ops check completed. Materials available."
    state["reasoning"].append("Ops Agent verified inventory.")
    return state

def supervisor_agent(state: OrderState) -> OrderState:
    """
    Evaluates inputs from all sub-agents and makes the final decision
    on routing the stage and status of the order.
    """
    # Simple hardcoded logic for now, later replaced by LLM call
    if state["product_type"] == "PO Sofa":
        state["current_stage"] = "Kepala Toko"
        if not state["has_blueprint"]:
            state["status"] = "Blocked"
        else:
            state["status"] = "Pending"
    elif state["product_type"] == "PO Produk Mebel":
        state["current_stage"] = "Purchasing"
        state["status"] = "Pending"
    else:
        state["current_stage"] = "Inventory"
        state["status"] = "Pending"
        
    state["reasoning"].append(f"Supervisor routed to {state['current_stage']} with status {state['status']}.")
    
    # TODO: Update Supabase table 'sales_orders' here with final state
    
    return state

# --- Build LangGraph ---

def build_graph():
    workflow = StateGraph(OrderState)

    # Add nodes
    workflow.add_node("hr_agent", hr_agent)
    workflow.add_node("finance_agent", finance_agent)
    workflow.add_node("ops_agent", ops_agent)
    workflow.add_node("supervisor", supervisor_agent)

    # Entry point points to all worker agents in parallel
    # LangGraph current version needs sequential or conditional edges, 
    # but for simplicity we will chain them or use fan-out fan-in.
    # Here we do a simple sequential flow to demonstrate:
    workflow.set_entry_point("hr_agent")
    workflow.add_edge("hr_agent", "finance_agent")
    workflow.add_edge("finance_agent", "ops_agent")
    workflow.add_edge("ops_agent", "supervisor")
    workflow.add_edge("supervisor", END)

    app = workflow.compile()
    return app

# Main entrypoint to be called by FastAPI
def run_supervisor(payload: dict) -> dict:
    graph = build_graph()
    
    # Initialize state
    initial_state = OrderState(
        order_id=payload.get("id"),
        customer_name=payload.get("customerName", ""),
        product_name=payload.get("productName", ""),
        product_type=payload.get("productType", ""),
        region=payload.get("region", ""),
        request_date=payload.get("requestDate", ""),
        has_blueprint=payload.get("hasBlueprint", True),
        current_stage="Pending",
        status="Pending",
        reasoning=[],
        hr_feedback=None,
        finance_feedback=None,
        ops_feedback=None,
    )
    
    final_state = graph.invoke(initial_state)
    return final_state
