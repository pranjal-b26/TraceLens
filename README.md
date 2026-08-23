# 🔍 TraceLens — Digital Evidence Correlation & Cyber Incident Investigation Platform

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)

> **TraceLens** is an intelligent cybersecurity investigation assistant that ingests multi-source digital evidence (URLs, emails, PDFs, logs, images), extracts indicators, correlates findings across artifacts, reconstructs cyber incident timelines, and calculates explainable risk scores with remediation guidance.

---

## 🌟 Key Features

* 📂 **Multi-Source Evidence Correlation**: Brings disparate digital artifacts (emails, URLs, PDFs, screenshots, chat exports, log files) into a single investigation case.
* 🔎 **Automated Indicator Extraction**: Parses & normalizes IP addresses, domain names, suspicious URLs, hashes, email headers, and urgency indicators.
* 🔗 **Cross-Evidence Graph Correlation**: Connects isolated pieces of evidence when they share indicators or behavioral traits.
* 🛡️ **Explainable Risk Assessment Engine**: Computes transparent, deterministic risk scores and categories based on correlated threat indicators.
* 📜 **Automated Incident Reconstruction**: Generates a chronological narrative of what likely happened along with an immutable evidence chain.
* 📊 **Comprehensive Executive & Technical Reports**: Exports clean summaries, recovery recommendations, and future threat prevention guidance.

---

## ⚙️ Core Pipeline

```
Digital Evidence 
  └──> Extraction & Normalization
        └──> Indicator Detection
              └──> Cross-Artifact Correlation
                    └──> Incident Reconstruction
                          └──> Explainable Risk Engine
                                └──> Mitigation & Executive Report
```

---

## 📥 Supported Digital Evidence

| Evidence Type | Extracted Artifacts & Indicators Analyzed |
| :--- | :--- |
| 📧 **Emails** | Sender/Recipient headers, suspicious wording, urgency markers, impersonation, phishing links, attachment names |
| 🔗 **URLs & Web Links** | Domain structure, suspicious TLDs, IP representations, redirect chains, casing anomalies |
| 📄 **PDFs & Documents** | Embedded hyper-links, metadata anomalies, structural indicators, invoice & credential phishing markers |
| 📝 **Text & Chat Logs** | Suspicious messages, social engineering patterns, IP addresses, credentials, bitcoin/crypto addresses |
| 🖥️ **System & Web Logs** | HTTP status codes, access patterns, user-agents, IP frequency, authentication failures |

---

## 🛠️ Tech Stack

### **Backend**
* **Framework**: Python 3.10+ & FastAPI
* **Database**: SQLite / SQLAlchemy
* **Engine**: Custom Extractor, Correlation, & Risk Assessment Engines

### **Frontend**
* **Framework**: Next.js 16 (React 19, App Router)
* **Styling**: TailwindCSS & Lucide Icons
* **Language**: TypeScript

---

## 🚀 Quick Start Guide

### Prerequisites
* [Python 3.10+](https://www.python.org/downloads/)
* [Node.js 18+](https://nodejs.org/)

---

### 1️⃣ Setting Up the Backend

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Start FastAPI server
python main.py
# or: uvicorn main:app --reload --port 8000
```
Backend API will be live at: `http://localhost:8000` (API Docs at `http://localhost:8000/docs`)

---

### 2️⃣ Setting Up the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install Node modules
npm install

# Start Next.js development server
npm run dev
```
Frontend web application will be live at: `http://localhost:3000`

---

## 📁 Repository Structure

```
TraceLens/
├── backend/
│   ├── app/
│   │   ├── engine/          # Correlation & Risk Scoring Engines
│   │   ├── evidence/        # PDF, URL, Text, & Email Parsers
│   │   ├── models/          # Database Models & Schemas
│   │   ├── routes/          # FastAPI REST API Endpoints
│   │   └── services/        # Report Generator Services
│   ├── main.py              # Application Entry Point
│   └── requirements.txt     # Python Dependencies
├── frontend/
│   ├── src/app/             # Next.js App Router Pages & Components
│   └── package.json         # Frontend Dependencies
├── TraceLens_Project_Specification.md  # Detailed Design & Architecture Spec
└── README.md                # Project Overview & Setup Instructions
```

---

## 📄 Documentation

For full architectural blueprints, detailed indicator rules, risk calculation formulas, and module breakdowns, refer to [TraceLens Project Specification](TraceLens_Project_Specification.md).

