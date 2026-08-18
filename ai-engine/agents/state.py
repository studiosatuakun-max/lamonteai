from typing import TypedDict, Optional, List

class OrderState(TypedDict):
    """
    State representing the data passed around the LangGraph nodes.
    This holds the current context of the order being processed.
    """
    order_id: Optional[str]
    customer_name: str
    product_name: str
    product_type: str
    region: str
    request_date: str
    has_blueprint: bool
    
    # AI Decided fields
    current_stage: str
    status: str
    reasoning: List[str] # Logs why an AI made a certain decision
    
    # Agent Specific Feedback
    hr_feedback: Optional[str]
    finance_feedback: Optional[str]
    ops_feedback: Optional[str]
