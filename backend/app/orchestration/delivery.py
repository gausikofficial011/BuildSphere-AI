from typing import Any

class GovernanceViolationException(Exception):
    pass

class AecDeliveryOrchestrator:
    """Phase 20 Absolute Rules Governance Engine"""
    
    def sign_contract(self, agent_name: str, contract_data: Any):
        """DO NOT ALLOW AI TO SIGN CONTRACTS"""
        raise GovernanceViolationException(f"Agent {agent_name} attempted to sign a contract.")

    def approve_payment(self, agent_name: str, payment_data: Any):
        """DO NOT ALLOW AI TO APPROVE PAYMENTS"""
        raise GovernanceViolationException(f"Agent {agent_name} attempted to approve payment.")

    def certify_engineering(self, agent_name: str, drawing_data: Any):
        """DO NOT ALLOW AI TO CERTIFY ENGINEERING"""
        raise GovernanceViolationException(f"Agent {agent_name} attempted to certify engineering.")

    def certify_safety(self, agent_name: str, inspection_data: Any):
        """DO NOT ALLOW AI TO CERTIFY SAFETY"""
        raise GovernanceViolationException(f"Agent {agent_name} attempted to certify safety.")

    def control_critical_infrastructure(self, agent_name: str, control_data: Any):
        """DO NOT ALLOW AI TO CONTROL CRITICAL INFRASTRUCTURE"""
        raise GovernanceViolationException(f"Agent {agent_name} attempted to control critical infrastructure.")
