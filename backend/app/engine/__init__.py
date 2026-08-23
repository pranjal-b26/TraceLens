from .indicator_engine import detect_indicators
from .correlation_engine import correlate_entities
from .risk_engine import assess_risk

def run_analysis(case_id: int, db) -> dict:
    indicators = detect_indicators(case_id, db)
    correlations = correlate_entities(case_id, db)
    risk_level = assess_risk(case_id, db)
    
    return {
        "indicators_count": len(indicators),
        "correlations_count": len(correlations),
        "risk_level": risk_level
    }
