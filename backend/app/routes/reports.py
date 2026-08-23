from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.models import Report
from app.services.reporter import generate_and_save_report

router = APIRouter()

@router.post("/cases/{case_id}/report")
def generate_report(case_id: int, db: Session = Depends(get_db)):
    try:
        report = generate_and_save_report(case_id, db)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/cases/{case_id}/report")
def get_report(case_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.case_id == case_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
