from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.models import Case, Correlation, Indicator, Evidence
from app.engine import run_analysis
from pydantic import BaseModel

router = APIRouter()

class CaseCreate(BaseModel):
    title: str

@router.post("/cases")
def create_case(case: CaseCreate, db: Session = Depends(get_db)):
    new_case = Case(title=case.title)
    db.add(new_case)
    db.commit()
    db.refresh(new_case)
    return new_case

@router.get("/cases")
def get_cases(db: Session = Depends(get_db)):
    cases = db.query(Case).all()
    return cases

from fastapi import HTTPException

@router.get("/cases/{case_id}")
def get_case(case_id: int, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    evidence = db.query(Evidence).filter(Evidence.case_id == case_id).all()
    indicators = db.query(Indicator).filter(Indicator.case_id == case_id).all()
    
    return {
        "id": case.id,
        "title": case.title,
        "status": case.status,
        "risk_level": case.risk_level,
        "incident_type": case.incident_type,
        "created_at": case.created_at,
        "evidence": evidence,
        "indicators": indicators
    }

@router.post("/cases/{case_id}/analyze")
def run_correlation(case_id: int, db: Session = Depends(get_db)):
    # Run full analysis engine
    analysis_results = run_analysis(case_id, db)

    case = db.query(Case).filter(Case.id == case_id).first()
    case.status = "analyzed"
    db.commit()

    return {
        "case_id": case_id,
        "risk_level": analysis_results["risk_level"],
        "indicators_found": analysis_results["indicators_count"],
        "correlations_found": analysis_results["correlations_count"]
    }