from sqlalchemy.orm import Session
from app.models.models import ExtractedEntity, Indicator, Evidence
import re

SUSPICIOUS_DOMAIN_KEYWORDS = [
    "login", "verify", "secure", "account", "update", "banking", "portal", 
    "signin", "auth", "support", "paypal", "paypa1", "invoice", "wallet", "recover"
]

PHISHING_TEXT_PATTERNS = [
    (r"(?i)\b(urgent|immediately|action required|suspended|24 hours|expire)\b", "High Urgency Coercion", "Language uses artificial urgency to induce rapid unverified action."),
    (r"(?i)\b(wire transfer|bank account|routing number|gift card|crypto|western union|transfer \$)\b", "Financial Transaction Solicit", "Unverified request to initiate direct financial or wire transfer."),
    (r"(?i)\b(password|passcode|otp|pin|credentials|2fa|verification code)\b", "Credential / 2FA Harvesting Target", "Explicit request targeting authentication secrets or one-time verification tokens."),
    (r"(?i)\b(offer letter|recruitment fee|processing fee|interview fee)\b", "Recruitment Advance-Fee Scheme", "Unusual fee request preceding formal employment onboarding."),
    (r"(?i)\b(remote access|anydesk|teamviewer|infected|trojan|device compromised)\b", "Tech Support Coercion", "Unsolicited claims of device infection paired with remote access demands.")
]

def detect_indicators(case_id: int, db: Session) -> list:
    """
    Analyzes both structured entities and raw evidence text across a case
    to detect explainable security red flags.
    """
    # Clean previous indicators for case re-analysis
    db.query(Indicator).filter(Indicator.case_id == case_id).delete()
    db.commit()

    entities = (
        db.query(ExtractedEntity)
        .join(ExtractedEntity.evidence)
        .filter_by(case_id=case_id)
        .all()
    )
    
    evidence_items = db.query(Evidence).filter(Evidence.case_id == case_id).all()
    indicators_found = []
    seen_indicator_keys = set()

    # 1. Check extracted entities (URLs, Domains, IPs)
    for entity in entities:
        if entity.entity_type == "url":
            val_lower = entity.entity_value.lower()
            matched_keywords = [k for k in SUSPICIOUS_DOMAIN_KEYWORDS if k in val_lower]
            if matched_keywords:
                key = f"url_{entity.entity_value}"
                if key not in seen_indicator_keys:
                    seen_indicator_keys.add(key)
                    indicator = Indicator(
                        case_id=case_id,
                        evidence_id=entity.evidence_id,
                        name="High-Risk Deceptive URL",
                        severity="High",
                        description=f"Destination URL contains deceptive keywords ({', '.join(matched_keywords)}): {entity.entity_value}"
                    )
                    db.add(indicator)
                    indicators_found.append(indicator)

    # 2. Check evidence text & file characteristics
    for ev in evidence_items:
        text = ev.extracted_text or ""
        # Check source URL path directly
        if ev.file_type == "url":
            val_lower = ev.file_path.lower()
            matched_keywords = [k for k in SUSPICIOUS_DOMAIN_KEYWORDS if k in val_lower]
            if matched_keywords:
                key = f"url_{ev.file_path}"
                if key not in seen_indicator_keys:
                    seen_indicator_keys.add(key)
                    indicator = Indicator(
                        case_id=case_id,
                        evidence_id=ev.id,
                        name="Suspicious Ingestion URL",
                        severity="High",
                        description=f"Ingested target address matches known deceptive patterns: {ev.file_path}"
                    )
                    db.add(indicator)
                    indicators_found.append(indicator)

        # Check content patterns
        for pattern, name, desc in PHISHING_TEXT_PATTERNS:
            if re.search(pattern, text):
                key = f"{ev.id}_{name}"
                if key not in seen_indicator_keys:
                    seen_indicator_keys.add(key)
                    indicator = Indicator(
                        case_id=case_id,
                        evidence_id=ev.id,
                        name=name,
                        severity="High",
                        description=f"{desc} (Source: {ev.file_path.split('_')[-1]})"
                    )
                    db.add(indicator)
                    indicators_found.append(indicator)

    db.commit()
    return indicators_found
