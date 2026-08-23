from sqlalchemy.orm import Session
from app.models.models import ExtractedEntity, Correlation

def correlate_entities(case_id: int, db: Session) -> list:
    entities = (
        db.query(ExtractedEntity)
        .join(ExtractedEntity.evidence)
        .filter_by(case_id=case_id)
        .all()
    )

    correlations = []

    for i in range(len(entities)):
        for j in range(i + 1, len(entities)):
            a = entities[i]
            b = entities[j]

            if a.evidence_id == b.evidence_id:
                continue

            if a.entity_value == b.entity_value:
                correlation = Correlation(
                    case_id=case_id,
                    entity_a=a.id,
                    entity_b=b.id,
                    correlation_type="exact_match",
                    confidence=0.95
                )
                db.add(correlation)
                correlations.append(correlation)

    db.commit()
    return correlations
