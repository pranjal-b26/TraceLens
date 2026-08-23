from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.models import Evidence, ExtractedEntity
from app.evidence import process_evidence
import os
import shutil

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/evidence/upload")
async def upload_evidence(
    case_id: int = Form(...),
    file_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Save file to disk
    file_path = f"{UPLOAD_DIR}/{case_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text and entities
    text, entities = process_evidence(file_path, file_type)

    # Save evidence to DB
    evidence = Evidence(
        case_id=case_id,
        file_type=file_type,
        file_path=file_path,
        extracted_text=text
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)

    # Save extracted entities to DB
    for entity in entities:
        db_entity = ExtractedEntity(
            evidence_id=evidence.id,
            entity_type=entity["entity_type"],
            entity_value=entity["entity_value"],
            confidence=entity["confidence"]
        )
        db.add(db_entity)
    db.commit()

    return {
        "evidence_id": evidence.id,
        "extracted_entities": entities,
        "text_preview": text[:500]
    }


@router.post("/evidence/url")
async def analyze_url(
    case_id: int = Form(...),
    url: str = Form(...),
    db: Session = Depends(get_db)
):
    text, entities = process_evidence(url, "url")

    evidence = Evidence(
        case_id=case_id,
        file_type="url",
        file_path=url,
        extracted_text=text
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)

    for entity in entities:
        db_entity = ExtractedEntity(
            evidence_id=evidence.id,
            entity_type=entity["entity_type"],
            entity_value=entity["entity_value"],
            confidence=entity["confidence"]
        )
        db.add(db_entity)
    db.commit()

    return {
        "evidence_id": evidence.id,
        "extracted_entities": entities,
        "text_preview": text[:500]
    }