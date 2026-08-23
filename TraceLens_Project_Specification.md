# TraceLens — Complete Project Specification

## 1. Project Identity

**Project Name:** TraceLens  
**Project Type:** Digital Evidence Correlation & Cyber Incident Investigation Platform

TraceLens is a cybersecurity investigation platform that accepts multiple forms of digital evidence, extracts useful information, correlates related indicators across the evidence, reconstructs the likely incident, assesses risk, and provides prevention, recovery, and future-risk guidance.

TraceLens is an **investigation assistant**, not a replacement for a professional digital forensic investigator.

---

## 2. What Exactly Is TraceLens?

Digital incidents rarely consist of a single artifact. A suspicious incident may involve an email, URL, PDF, screenshot, chat conversation, and system logs.

TraceLens brings these artifacts into one investigation case.

The platform:

1. Accepts multiple evidence sources.
2. Extracts useful information from each source.
3. Normalizes extracted information.
4. Detects suspicious indicators.
5. Correlates indicators across evidence items.
6. Determines the most likely incident category.
7. Calculates an explainable risk level.
8. Builds an evidence chain.
9. Explains what likely happened.
10. Provides prevention measures.
11. Provides basic recovery and containment actions.
12. Identifies possible future risks.
13. Generates an investigation report.

### Core Pipeline

**Digital Evidence → Extraction → Normalization → Indicator Detection → Correlation → Incident Reconstruction → Risk Assessment → Recommendations → Report**

---

# 3. Problem Statement

Users often have suspicious evidence scattered across different formats:

- Emails
- PDFs
- Screenshots
- URLs
- Chat messages
- Log files

Existing lightweight tools usually focus on one artifact at a time.

TraceLens is designed to answer:

- What happened?
- What type of incident is this?
- Which evidence supports the conclusion?
- Which pieces of evidence are related?
- How serious is the situation?
- What should the user do now?
- How can the user avoid similar incidents?
- What risks could follow?

---

# 4. Core Concept: Investigation Case

The fundamental unit of TraceLens is an **Investigation Case**.

A case contains every evidence item associated with one suspected incident.

A single case may contain:

- Emails
- PDFs
- Screenshots
- URLs
- Chat exports
- Logs

TraceLens first analyzes each artifact individually and then correlates findings across the entire case.

### Individual Analysis

Each evidence item is processed according to its format.

### Cross-Evidence Correlation

Findings from different evidence sources are connected when they share relevant characteristics.

### Incident Reconstruction

The correlated findings are converted into an understandable incident story and evidence chain.

---

# 5. Supported Evidence

## 5.1 Email

Input:

- Sender
- Recipient, when available
- Subject
- Body
- Links
- Attachment names
- Available metadata

Possible analysis:

- Suspicious wording
- Urgency
- Impersonation
- Credential requests
- Payment requests
- Suspicious domains
- Social engineering indicators

---

## 5.2 URL

Input:

- Direct URLs
- URLs extracted from other evidence

Possible analysis:

- Domain
- Hostname
- URL structure
- Suspicious keywords
- Relationships with domains found elsewhere in the case

URL analysis should not automatically label a URL as malicious simply because it looks unusual.

---

## 5.3 PDF

Input:

- Offer letters
- Invoices
- Notices
- Payment documents
- Other user-provided PDF evidence

Processing:

1. Accept PDF.
2. Extract text.
3. Preserve relevant metadata.
4. Send extracted content to the common analysis pipeline.
5. Keep findings linked to the original PDF.

---

## 5.4 Image / Screenshot

Input:

- PNG
- JPG/JPEG
- Other supported image formats

Processing:

1. Accept image.
2. Perform OCR.
3. Extract readable text.
4. Preserve the original image.
5. Associate OCR results with the image.
6. Send extracted text to the analysis pipeline.

Images may contain chat messages, payment requests, fake offers, URLs, or other evidence.

---

## 5.5 Chat Export

Input:

- Plain-text chat exports
- Conversation transcripts
- Supported messaging-platform exports

Possible analysis:

- Social engineering
- Payment requests
- Credential requests
- Urgency
- Manipulation
- Sender identities
- URLs
- Timestamps

---

## 5.6 Log Files

Input:

- Security logs
- System logs
- Application logs
- Authentication logs

Possible analysis:

- Timestamps
- Authentication events
- Failed logins
- Successful logins
- Process/activity indicators
- Network events
- Chronological relationships

Log analysis is one component of TraceLens, not the entire purpose of the platform.

---

# 6. Evidence Processing Architecture

Every evidence type should eventually reach a common analysis layer.

```text
User Evidence
      |
      v
Evidence Type Detection
      |
      v
Type-Specific Parser
      |
      v
Text / Structured Data Extraction
      |
      v
Normalization
      |
      v
Evidence Repository
      |
      v
Indicator Detection
      |
      v
Cross-Evidence Correlation
      |
      v
Incident Classification
      |
      v
Risk Assessment
      |
      v
Evidence Chain
      |
      v
Recommendations
      |
      v
Investigation Report
```

The extraction layer understands file formats.

The analysis layer understands security meaning.

These responsibilities must remain separated in the codebase.

---

# 7. Evidence Normalization

All evidence should be converted into a common internal representation.

Examples:

- PDF → extracted text
- Image → OCR text
- Email → parsed content + metadata
- Chat → normalized messages
- URL → structured URL data
- Log → normalized events

The analysis engine should not need separate security logic for every file format.

Every finding must remain traceable to its original evidence item.

---

# 8. Evidence Repository

The repository stores every uploaded artifact and its extracted information.

Each evidence item should contain at least:

- Evidence ID
- Case ID
- Evidence type
- Original filename/source
- Upload timestamp
- Original file reference
- Extracted content
- Extracted entities
- Detected indicators
- Processing status
- Processing errors, if any

Relationship:

**Case → Evidence → Extracted Data → Indicators → Findings**

---

# 9. Indicator Detection Engine

The initial implementation should be **rule-based and explainable**.

Do not start with machine learning.

Indicators should be stored in data/configuration files rather than scattered throughout application code.

Initial indicator groups:

### Recruitment Scam

- Recruitment fee
- Registration fee
- Processing fee
- Payment before interview
- Payment before joining
- Guaranteed employment
- Unusual urgency
- Unverified recruiter
- Suspicious recruitment domain

### Phishing

- Account verification request
- Password reset request
- Credential request
- Login urgency
- Suspicious login URL
- Account suspension threat

### OTP / Banking Scam

- OTP request
- PIN request
- Banking verification request
- Transaction verification request
- Urgent payment request

### Tech Support Scam

- Device infection claim
- Fake support identity
- Remote-access request
- Urgent support payment
- Suspicious support number

### Malware Delivery Attempt

- Suspicious attachment
- Executable download
- Script execution indicators
- Suspicious file references
- Suspicious external connection indicators

The architecture must allow additional incident categories and indicators later.

---

# 10. Evidence Correlation Engine

The **Evidence Correlation Engine is the central differentiating component of TraceLens.**

It identifies relationships between findings from different evidence items.

Possible correlation dimensions:

- Same domain
- Same email address
- Same phone number
- Same username
- Same person/company name
- Same URL
- Same payment amount
- Same suspicious phrase
- Same or related timestamps
- Same filename
- Same incident indicators

The engine must not treat every match as proof of malicious activity.

Every correlation should have an explanation describing why the items were considered related.

---

# 11. Incident Classification

The classifier determines the most likely incident category using detected indicators and cross-evidence correlations.

Initial incident categories:

1. Recruitment Scam
2. Phishing Attack
3. OTP / Banking Scam
4. Tech Support Scam
5. Malware Delivery Attempt

The classifier must be extensible.

Classification should be explainable and retain the evidence and indicators that contributed to the result.

---

# 12. Risk Assessment

TraceLens should initially use an explainable, rule-based risk model.

Risk must not be presented as an unsupported probability.

Do not use arbitrary confidence percentages unless a properly validated statistical or machine-learning model is later introduced.

Initial risk levels:

- Low
- Medium
- High
- Critical

Risk should consider:

- Indicator severity
- Number of supporting indicators
- Independent evidence corroboration
- Potential impact
- Evidence quality
- Credential involvement
- Financial involvement
- Whether the user interacted with the suspicious content
- Whether compromise may already have occurred

The system should explain why the risk level was assigned.

---

# 13. Evidence Strength

Evidence Strength is different from Risk Level.

It describes how strongly the available evidence supports the incident interpretation.

Values:

- Weak
- Moderate
- Strong

Evidence Strength should consider:

- Number of relevant evidence sources
- Independence of evidence sources
- Quality of extracted information
- Strength of correlations
- Consistency between artifacts

Risk Level describes severity.

Evidence Strength describes support for the conclusion.

---

# 14. Evidence Chain

The Evidence Chain is the central human-readable reconstruction.

It connects relevant evidence and findings in logical and/or chronological order.

Each chain element should be traceable to source evidence.

The chain should capture:

- Evidence source
- Relevant finding/event
- Relationship
- Resulting interpretation

This is one of the most important features of TraceLens.

---

# 15. Incident Explanation

TraceLens should explain the incident in plain language.

The explanation should cover:

- What appears to have happened
- Which evidence supports the conclusion
- Which suspicious behavior was identified
- Which evidence sources corroborate each other

The system must distinguish between:

- Observed facts
- Strongly supported conclusions
- Possible interpretations

It should avoid claiming certainty when the evidence does not justify certainty.

---

# 16. Red Flags

The report should list detected red flags.

Each red flag should ideally contain:

- Indicator name
- Severity
- Source evidence
- Explanation

This makes the result transparent and auditable.

---

# 17. Prevention Guidance

Prevention guidance must be incident-specific.

It should depend on:

- Incident category
- Detected indicators
- Evidence context
- User interaction level

Different incident types should receive different prevention guidance.

---

# 18. Recovery and Containment Guidance

TraceLens should provide basic defensive actions when the user has already interacted with suspicious content.

Possible situations:

### No Interaction

Recommend evidence preservation and avoiding further interaction.

### Link Clicked

Recommend appropriate account and device security checks.

### Credentials Provided

Recommend changing affected passwords, enabling MFA, and securing relevant accounts.

### Suspicious File Downloaded

Recommend avoiding further execution and performing appropriate security checks.

### Payment Made

Recommend contacting the relevant financial institution and preserving transaction evidence.

The system should clearly distinguish general guidance from professional, legal, or financial advice.

---

# 19. Future Risk Analysis

TraceLens should identify plausible follow-up risks associated with the incident.

Potential categories:

- Follow-up phishing
- Credential theft
- Identity misuse
- Additional payment requests
- Impersonation
- Account takeover attempts
- Fake recovery/support scams

These are possibilities, not guaranteed predictions.

---

# 20. Final Investigation Report

The report should contain:

1. Case Information
2. Evidence Summary
3. Incident Type
4. Risk Level
5. Evidence Strength
6. Evidence Chain
7. Detected Indicators
8. Red Flags
9. Incident Explanation
10. Prevention Measures
11. Recovery / Containment Actions
12. Future Risks
13. Recommended Next Steps
14. Evidence References

Every major finding should be traceable to one or more evidence items.

---

# 21. User Interface

The application should follow an investigation-oriented workflow.

## Dashboard

Displays:

- Existing cases
- Case status
- Number of evidence items
- Risk level
- Incident type

## Create Case

Allows:

- Case name
- Optional description
- Case creation

## Evidence Upload

Allows multiple evidence types to be added to the same case.

## Evidence View

Displays:

- Original evidence
- Evidence type
- Processing status
- Extracted information
- Detected indicators

## Investigation View

Displays:

- Incident type
- Risk level
- Evidence strength
- Evidence chain
- Correlations
- Red flags
- Explanation

## Recommendations

Displays:

- Prevention
- Immediate actions
- Recovery
- Future risks

## Report

Allows viewing and downloading the final investigation report.

---

# 22. Case Lifecycle

A case should have clear states:

1. Created
2. Evidence Added
3. Evidence Processing
4. Analysis Complete
5. Investigation Ready
6. Report Generated

Processing failures must be visible to the user.

The application must never silently discard evidence because processing failed.

---

# 23. Folder Structure

```text
TraceLens/
│
├── app.py
├── config.py
├── requirements.txt
├── README.md
├── PROJECT_SPECIFICATION.md
│
├── uploads/
│   └── .gitkeep
│
├── extracted_text/
│   └── .gitkeep
│
├── reports/
│   └── .gitkeep
│
├── data/
│   ├── indicators.json
│   ├── incidents.json
│   ├── recommendations.json
│   └── future_risks.json
│
├── evidence/
│   ├── __init__.py
│   ├── base_parser.py
│   ├── pdf_parser.py
│   ├── image_parser.py
│   ├── email_parser.py
│   ├── url_parser.py
│   ├── chat_parser.py
│   └── log_parser.py
│
├── engine/
│   ├── __init__.py
│   ├── indicator_engine.py
│   ├── correlation_engine.py
│   ├── classifier.py
│   ├── risk_engine.py
│   ├── timeline_engine.py
│   └── investigation_engine.py
│
├── recommendations/
│   ├── __init__.py
│   ├── prevention.py
│   ├── recovery.py
│   └── future_risks.py
│
├── reports_engine/
│   ├── __init__.py
│   └── report_generator.py
│
├── utils/
│   ├── __init__.py
│   ├── file_handler.py
│   ├── text_utils.py
│   └── logger.py
│
├── templates/
│
└── static/
```

---

# 24. Technology Stack

## Backend

Python

## Web Framework

Flask

## PDF Processing

pypdf or equivalent PDF extraction library

## OCR

EasyOCR

## Report Generation

ReportLab

## Initial Storage

SQLite or structured JSON

## Future Database

PostgreSQL

## Frontend

HTML, CSS, and JavaScript initially

A frontend framework can be introduced later if required.

---

# 25. Development Phases

## Phase 1 — Foundation

Build:

- Flask application
- Case creation
- Evidence upload
- File storage
- Basic UI

## Phase 2 — Evidence Extraction

Implement:

- PDF parser
- Image OCR parser
- Email parser
- URL parser
- Chat parser
- Log parser

## Phase 3 — Normalization

Create a unified internal evidence representation.

## Phase 4 — Indicator Engine

Implement explainable rule-based indicators.

## Phase 5 — Correlation Engine

Connect related findings across evidence sources.

## Phase 6 — Classification

Implement initial incident categories.

## Phase 7 — Risk Engine

Implement explainable risk levels.

## Phase 8 — Investigation Output

Implement:

- Evidence chain
- Timeline
- Red flags
- Incident explanation

## Phase 9 — Recommendation Engine

Implement:

- Prevention
- Recovery
- Future risks

## Phase 10 — Reporting

Generate downloadable investigation reports.

---

# 26. Future Enhancements

## AI-Assisted Investigation

Possible uses:

- Incident narrative generation
- Evidence summarization
- Natural-language investigation queries

AI should assist evidence-based analysis rather than replace it.

## Threat Intelligence

Possible integrations:

- Domain reputation
- IP reputation
- Malware hashes
- Known malicious indicators

External intelligence must be clearly identified as external.

## MITRE ATT&CK Mapping

Future versions may map observed behaviors to MITRE ATT&CK techniques.

## Evidence Graph

Interactive relationship graph:

**Evidence → Indicator → Entity → Event → Incident**

## Advanced Timeline

Combine timestamps from multiple evidence sources.

## Case Management

Possible features:

- Case status
- Investigator notes
- Tags
- Search
- Case history

---

# 27. What TraceLens Is NOT

TraceLens is not:

- A full SIEM
- An EDR replacement
- A complete forensic disk-analysis suite
- A malware sandbox
- A guaranteed scam detector
- A legal investigation system
- A professional incident-response replacement

TraceLens is an **evidence correlation and investigation assistant**.

---

# 28. Privacy and Security Requirements

Because evidence may contain sensitive information, TraceLens should:

- Avoid unnecessary external transmission of uploaded evidence.
- Store evidence securely.
- Avoid logging raw sensitive content unnecessarily.
- Keep evidence associated with the correct case.
- Provide evidence deletion functionality.
- Validate uploaded file types.
- Restrict unsafe file handling.
- Prevent path traversal through uploaded filenames.
- Keep generated reports associated with their originating case.

If external APIs are introduced later, their use must be explicit and configurable.

---

# 29. Explainability Requirements

Every major result should have a reason.

For an incident classification, TraceLens should be able to answer:

- Which indicators contributed?
- Which evidence items contained those indicators?
- Which correlations strengthened the finding?
- Why was the selected risk level assigned?

The user should never see an unexplained result such as:

**"Risk: High"**

without supporting reasoning.

---

# 30. Definition of Done for V1

V1 is complete when a user can:

1. Create an investigation case.
2. Add multiple evidence items.
3. Upload supported files.
4. Extract text or structured information.
5. View processing status.
6. Detect relevant security indicators.
7. Correlate indicators across multiple evidence sources.
8. Identify a likely incident category.
9. Receive an explainable risk level.
10. View evidence strength.
11. View an evidence chain.
12. Read a plain-language incident explanation.
13. See detected red flags.
14. Receive prevention guidance.
15. Receive basic recovery guidance.
16. See possible future risks.
17. View recommended next steps.
18. Generate a downloadable investigation report.

---

# 31. Core Product Statement

> **TraceLens is a Digital Evidence Correlation and Cyber Incident Investigation Platform that transforms scattered digital evidence into an explainable incident story, risk assessment, and actionable response guidance.**

## Core Differentiator

TraceLens is not primarily a PDF parser, OCR tool, URL checker, log analyzer, or simple scam detector.

Its defining capability is:

> **Connecting multiple pieces of digital evidence and reconstructing the incident they collectively describe.**
