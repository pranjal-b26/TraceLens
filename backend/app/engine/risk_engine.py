from app.models.models import Case, Indicator, Correlation, Evidence
from sqlalchemy.orm import Session

def assess_risk(case_id: int, db: Session) -> str:
    indicators = db.query(Indicator).filter(Indicator.case_id == case_id).all()
    correlations = db.query(Correlation).filter(Correlation.case_id == case_id).all()
    evidence_count = db.query(Evidence).filter(Evidence.case_id == case_id).count()
    
    high_severity_count = sum(1 for i in indicators if i.severity == "High" or i.severity == "Critical")
    total_indicators = len(indicators)
    correlation_count = len(correlations)
    
    # Explainable qualitative risk matrix
    if high_severity_count >= 2 or (high_severity_count >= 1 and correlation_count >= 1):
        risk_level = "Critical"
    elif high_severity_count >= 1 or total_indicators >= 2 or correlation_count >= 1:
        risk_level = "High"
    elif total_indicators >= 1:
        risk_level = "Medium"
    else:
        risk_level = "Low"
        
    case = db.query(Case).filter(Case.id == case_id).first()
    if case:
        case.risk_level = risk_level
        
        # Determine incident category based on indicator types
        indicator_names = [i.name.lower() for i in indicators]
        if any("financial" in n or "invoice" in n for n in indicator_names):
            case.incident_type = "Invoice Fraud / BEC Scam"
        elif any("credential" in n or "deceptive url" in n for n in indicator_names):
            case.incident_type = "Phishing / Credential Harvesting"
        elif any("recruitment" in n for n in indicator_names):
            case.incident_type = "Recruitment Fee Scam"
        elif any("tech support" in n for n in indicator_names):
            case.incident_type = "Tech Support Extortion Scam"
        elif risk_level in ["High", "Critical"]:
            case.incident_type = "Deceptive Phishing Attempt"
        else:
            case.incident_type = "Low-Severity Artifact Verification"
            
        case.evidence_strength = "Strong" if (evidence_count >= 2 or correlation_count >= 1) else "Moderate" if evidence_count == 1 else "Weak"
        
        db.commit()
        
    return risk_level
