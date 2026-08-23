import os
import json
import requests
from sqlalchemy.orm import Session
from app.models.models import Case, Evidence, ExtractedEntity, Correlation, Report
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def build_context(case_id: int, db: Session) -> str:
    case = db.query(Case).filter(Case.id == case_id).first()
    evidence_list = db.query(Evidence).filter(Evidence.case_id == case_id).all()
    entities = (
        db.query(ExtractedEntity)
        .join(ExtractedEntity.evidence)
        .filter_by(case_id=case_id)
        .all()
    )
    correlations = db.query(Correlation).filter(Correlation.case_id == case_id).all()

    context = f"""
Case Title: {case.title}
Risk Score: {case.risk_score}
Number of Evidence Pieces: {len(evidence_list)}
Number of Entities Extracted: {len(entities)}
Number of Correlations Found: {len(correlations)}

Evidence Sources:
"""
    for e in evidence_list:
        context += f"- {e.file_type}: {e.file_path}\n"

    context += "\nExtracted Entities:\n"
    for entity in entities:
        context += f"- {entity.entity_type}: {entity.entity_value} (confidence: {entity.confidence})\n"

    context += "\nCorrelations:\n"
    for c in correlations:
        context += f"- {c.correlation_type} (confidence: {c.confidence})\n"

    return context


def generate_report_with_ai(context: str) -> dict:
    prompt = f"""
You are a cybersecurity expert helping an everyday person understand what happened to them digitally.
Your job is to explain things clearly, like you're talking to someone who is not technical at all.

Here is the digital evidence analysis:
{context}

Generate a detailed incident report in this exact JSON format:
{{
    "incident_type": "Simple name for the type of attack or incident (e.g. Phishing Attack, Invoice Scam, Account Takeover)",
    "risk_level": "Low/Medium/High/Critical",
    "explanation": "Explain in simple everyday language what happened, as if telling a story. Who did what, how did they do it, and what was the goal? Avoid technical jargon. Start with 'Here is what likely happened:'",
    "red_flags": "List each red flag as a separate point starting with '•'. Example: '• The same IP appeared in two different sources • The URL was disguised to look like a bank website'",
    "prevention": "List exactly 4 prevention steps, each starting with '•'. Be specific and actionable.",
    "recovery": "List exactly 4 recovery steps, each starting with '•'. Be specific and urgent."
}}

Write as if you genuinely care about helping this person. Be clear, warm, and actionable.
Respond with JSON only, no extra text, no markdown, no code blocks.
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3
    }

    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers=headers,
        json=payload
    )

    result = response.json()
    content = result["choices"][0]["message"]["content"].strip()

    # Clean markdown code blocks if model ignores instructions
    if "```" in content:
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
        content = content.strip()

    return json.loads(content)


def generate_and_save_report(case_id: int, db: Session) -> dict:
    context = build_context(case_id, db)
    ai_report = generate_report_with_ai(context)

    report = Report(
        case_id=case_id,
        incident_type=ai_report.get("incident_type"),
        risk_level=ai_report.get("risk_level"),
        explanation=ai_report.get("explanation"),
        red_flags=ai_report.get("red_flags"),
        prevention=ai_report.get("prevention"),
        recovery=ai_report.get("recovery")
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return ai_report