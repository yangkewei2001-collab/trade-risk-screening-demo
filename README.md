# International Trade Legal Risk Screening Demo

## Project Overview

**International Trade Legal Risk Screening Demo** is a static LegalTech portfolio project for preliminary legal and compliance risk screening in international trade transactions.

The project translates common trade compliance and contract review issues into a structured intake workflow, a JSON-based rule library, a transparent scoring model, and bilingual report generation. It is designed to demonstrate how legal issue spotting can be turned into a lightweight legal operations tool for business, legal, and compliance teams.

This is a portfolio demo only. It does not provide formal legal advice.

## Key Features

- Structured transaction intake form
- JSON rule library for configurable risk screening
- Risk scoring and overall risk level calculation
- Triggered risk cards with risk level badges
- Chinese legal risk screening report
- English executive summary
- Bilingual side-by-side report view
- Business follow-up checklist
- Suggested legal review points
- Low-risk, medium-risk, and high-risk sample transactions
- Copy report, download TXT report, and print report actions
- Responsive layout for desktop and mobile

## Covered Risk Areas

- Payment risk
- Third-party payment / AML risk
- Incoterms and delivery risk
- Export control
- Sanctions screening
- Anti-bribery
- Governing law
- Dispute resolution
- Cross-border data protection
- High-value transaction review
- Open account / credit risk

## Risk Scoring Logic

Each triggered rule contributes to the total risk score:

- Low risk = 1 point
- Medium risk = 2 points
- High risk = 3 points

Overall risk level:

- 0-3 points: Low
- 4-7 points: Medium
- 8+ points: High

Certain red flags can raise the overall level to at least Medium, including third-party payment, missing sanctions screening, possible export control issues, and cross-border data transfer. If two or more critical red flags appear together, the overall level is treated as High.

## Tech Stack

- HTML
- CSS
- JavaScript
- JSON rule library
- GitHub Pages

No backend, database, build tool, or framework is required.

## How to Use

1. Open `index.html` in a browser.
2. Fill in the transaction information manually, or use one of the sample transaction buttons:
   - Low-risk sample
   - Medium-risk sample
   - High-risk sample
3. Click **Run Risk Screening**.
4. Review the overall risk level, risk score, and triggered risk cards.
5. Open the Chinese report, English summary, or bilingual report view.
6. Copy, download, or print the generated report.

## Deployment

This project can be deployed directly to GitHub Pages:

1. Create a GitHub repository.
2. Upload `index.html`, `style.css`, `script.js`, `rules.json`, and `README.md`.
3. Go to repository `Settings` > `Pages`.
4. Select the deployment branch and root folder.
5. Open the generated GitHub Pages URL.

## Limitations

- This is a preliminary screening tool.
- It does not replace legal advice.
- The rules are simplified for demo and portfolio purposes.
- The rule library is not jurisdiction-specific.
- The project does not connect to live sanctions lists, export control databases, corporate registries, or data protection compliance databases.
- Real-world deployment would require legal review, updated compliance data sources, audit trails, user permissions, and data security controls.

## Portfolio Value

This project demonstrates:

- Legal issue spotting
- Risk classification and scoring
- Legal process design
- Rule-based legal workflow design
- AI-assisted coding
- LegalTech product thinking
- Bilingual legal communication
- Frontend implementation for a no-backend legal operations tool

It shows how legal and compliance knowledge can be structured into an interactive product experience that supports early-stage transaction review, business follow-up, and legal escalation.
