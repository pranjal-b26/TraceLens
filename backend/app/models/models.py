from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    cases = relationship("Case", back_populates="user")

class Case(Base):
    __tablename__ = "cases"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    status = Column(String, default="pending")
    risk_level = Column(String(50), default="Pending")
    incident_type = Column(String(100), nullable=True)
    evidence_strength = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="cases")
    evidence = relationship("Evidence", back_populates="case")
    indicators = relationship("Indicator", back_populates="case")

class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    file_type = Column(String)
    file_path = Column(Text)
    extracted_text = Column(Text)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    case = relationship("Case", back_populates="evidence")
    entities = relationship("ExtractedEntity", back_populates="evidence")
    indicators = relationship("Indicator", back_populates="evidence")

class ExtractedEntity(Base):
    __tablename__ = "extracted_entities"
    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("evidence.id"))
    entity_type = Column(String(50))
    entity_value = Column(Text)
    confidence = Column(Float)
    evidence = relationship("Evidence", back_populates="entities")

class Indicator(Base):
    __tablename__ = "indicators"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    evidence_id = Column(Integer, ForeignKey("evidence.id"), nullable=True)
    name = Column(String(100))
    severity = Column(String(50))
    description = Column(Text)
    case = relationship("Case", back_populates="indicators")
    evidence = relationship("Evidence", back_populates="indicators")

class Correlation(Base):
    __tablename__ = "correlations"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    entity_a = Column(Integer, ForeignKey("extracted_entities.id"))
    entity_b = Column(Integer, ForeignKey("extracted_entities.id"))
    correlation_type = Column(String(100))
    confidence = Column(Float)

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    incident_type = Column(String(100))
    risk_level = Column(String(50))
    explanation = Column(Text)
    red_flags = Column(Text)
    prevention = Column(Text)
    recovery = Column(Text)
    generated_at = Column(DateTime, default=datetime.utcnow)