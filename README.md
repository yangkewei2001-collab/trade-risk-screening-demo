# Power Equipment / Heavy Machinery Export Compliance Screening Demo

## Project Positioning

This project is a LegalTech portfolio prototype for preliminary legal and compliance issue-spotting in power equipment and heavy machinery export transactions. It focuses on high-value B2B exports such as transformers, industrial electrical equipment, and heavy machinery, where export-control review, sanctions screening, payment security, technical specifications, acceptance standards, and dispute-resolution clauses are especially important.

本项目是一个作品集性质的 LegalTech 原型，用于电力设备/重型机械出口交易中的法律与合规风险初筛。典型场景包括中国企业出口变压器、工业电气设备和大型机械设备，重点识别出口管制、制裁筛查、高价值设备付款条款、技术规格与验收争议、争议解决和知识产权/OEM 等风险点。

## Core Scenario

The core sample case involves a Chinese seller exporting customized power transformers to an overseas buyer. The product is high-value industrial electrical equipment. The buyer requests OEM labeling and provides technical specifications based on IEC standards. The destination is high-risk or requires further sanctions/export-control review. Payment is T/T with low advance payment and a long production cycle. Technical acceptance standards, end-use documentation, and dispute-resolution clauses are incomplete.

## What This Demo Does

- Structured transaction intake
- Rule-based risk triggering
- Static authority reference library
- Workflow-stage action checklist
- Bilingual preliminary screening report
- Manual review escalation

## Key Risk Areas

- Export-control review
- Sanctions and restricted-party screening
- High-value equipment payment risk
- Incoterms and logistics responsibility
- FAT/SAT and technical acceptance
- End-user / end-use / no re-export
- OEM / IP / confidentiality
- Dispute resolution and governing law
- Warranty and after-sales obligations
- Shipment documents and customs readiness

## Authority Reference Library

Each risk rule is mapped to authority references such as:

- ICC Incoterms 2020
- CISG / UNCITRAL
- OFAC / EU / UK / UN sanctions sources
- China Export Control Law
- BIS EAR / CCL / ECCN references
- FATF TBML risk indicators
- IEC 60076 transformer standards
- WIPO trademark references
- New York Convention
- UNCITRAL Model Law
- GDPR SCCs
- China PIPL cross-border transfer references

These references are static issue-spotting anchors. They are not exhaustive. The demo does not perform live legal research. Official sources must be checked before real transactions. Manual legal/compliance review is required.

## Workflow Layer

This demo includes a workflow layer reflecting the practical lifecycle of power equipment and heavy machinery export transactions:

- Pre-contract
- Contract signed
- Production
- Pre-shipment
- Delivery
- Warranty / After-sales

The report shows what should be reviewed before each stage, including before signing, before production, before shipment, before delivery/acceptance, and during warranty or after-sales support.

## Important Limitations

- This tool does not provide legal advice.
- It does not determine whether a transaction is lawful.
- It does not query live sanctions lists.
- It does not query live export-control databases.
- It does not classify HS/ECCN codes automatically.
- It does not certify technical compliance.
- Manual legal, compliance, trade, and engineering review is required before real transaction use.

## How to Use

1. Open the demo.
2. Click **Load Transformer Export Example**.
3. Generate the preliminary screening report.
4. Review triggered risks, authority references, evidence needed, recommended actions, and the stage checklist.

## Files

- `index.html`
- `script.js`
- `rules.json`
- `authority-references.json`
- `styles.css`
