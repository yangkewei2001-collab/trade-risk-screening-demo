# Power Equipment / Heavy Machinery Export Compliance Screening Demo

This project has been narrowed from a general international trade risk screening demo to a vertical LegalTech prototype for power equipment and heavy machinery export compliance. It uses transformer export as the core sample scenario and focuses on export-control review, sanctions screening, high-value equipment payment risk, technical specification disputes, acceptance standards, OEM/IP issues, and dispute-resolution clauses.

本项目已从泛外贸交易风险初筛工具，进一步收窄为电力设备/重型机械出口合规初筛原型。项目以变压器出口为核心示例场景，重点关注出口管制、制裁筛查、高价值设备付款风险、技术规格与验收争议、OEM/知识产权问题和争议解决条款。

This demo now includes a workflow layer reflecting the practical lifecycle of power equipment and heavy machinery export transactions: pre-contract, contract signing, production, pre-shipment, delivery, and warranty/after-sales. The purpose is to show not only what the risks are, but also when they should be reviewed and what actions should be completed before the transaction moves to the next stage.

本项目进一步增加了交易流程层，将电力设备/重型机械出口交易拆分为签约前、合同签署、生产、发货前、交付和质保/售后等阶段。项目不仅提示风险点，也强调每项风险应在交易链条的哪个节点完成复核，以及业务/法务/合规下一步需要补充哪些材料或动作。

## Positioning

This is a LegalTech portfolio prototype for preliminary legal and compliance issue-spotting in power equipment and heavy machinery export transactions. It focuses on high-value B2B exports such as transformers, industrial electrical equipment, and heavy machinery, where export-control review, sanctions screening, payment security, technical specifications, acceptance standards, and dispute-resolution clauses are especially important.

本项目是一个作品集性质的 LegalTech 原型，用于电力设备/重型机械出口交易中的法律与合规风险初筛。典型场景包括中国企业出口变压器、工业电气设备和大型机械设备，重点识别出口管制、制裁筛查、高价值设备付款条款、技术规格与验收争议、争议解决和知识产权/OEM 等风险点。

## Important Limitations

- This tool does not provide legal advice.
- It is only a preliminary issue-spotting and escalation prototype.
- Manual legal/compliance review is required.
- It does not query live sanctions lists or export-control databases.
- It does not determine whether a transaction is lawful.
- It does not classify HS/ECCN codes automatically.
- It does not certify technical compliance.
- Manual legal, compliance, trade, and engineering review is required before real transaction use.

## Static Authority Reference Library

This demo contains a static authority reference library. Each risk rule is mapped to authority references such as ICC Incoterms 2020, CISG, OFAC sanctions sources, EU/UK sanctions sources, BIS EAR/CCL references, China Export Control Law, FATF TBML indicators, IEC transformer standards, WIPO trademark references, New York Convention, UNCITRAL Model Law, GDPR SCCs, and China PIPL cross-border transfer references.

These references are issue-spotting anchors for a LegalTech portfolio prototype. They are not exhaustive, the demo does not perform live legal research, and the demo does not replace manual legal review. Official sources must be checked before real transactions.

The authority library is stored in `authority-references.json`. Rules in `rules.json` bind to the library through `authorityIds`, so each triggered risk can display visible legal, regulatory, database, standards, treaty, or institutional guidance references in the report.

## Core Scenario

The main sample use case is a Chinese seller exporting customized power transformers to an overseas buyer. The buyer requests OEM labeling and provides technical specifications based on IEC standards. The destination country is high-risk or requires further sanctions/export-control review. Payment is T/T with low advance payment and a long production cycle. Technical acceptance standards and dispute resolution clauses are incomplete.

The sample is designed to trigger:

- Export-control review risk
- Sanctions and restricted-party screening risk
- High-value equipment payment risk
- Technical specification and acceptance dispute risk
- OEM / IP / confidentiality risk
- Dispute-resolution clause risk
- Trade terms and governing law clarity risk
- Cross-border data transfer review risk
- Incoterms, logistics, and shipment document readiness risk
- Delivery delay and regulatory-delay allocation risk
- End-user, end-use, no re-export, and diversion risk
- Warranty and after-sales service risk

## Workflow Layer

The form is organized into practical workflow sections:

- Transaction overview
- Product & technical specifications
- Sanctions / export control / end-use
- Payment security
- Incoterms / logistics / documents
- FAT / SAT / acceptance
- Warranty / after-sales
- Dispute resolution / governing law
- Report

Each triggered risk card now includes the risk category, affected transaction stage, urgency, triggered facts, rationale, authority references, evidence needed, recommended action, and manual review requirement. The generated report also includes an action checklist by stage: before signing, before production, before shipment, before delivery/acceptance, and warranty/after-sales.

## Files

- `index.html`: homepage, screening form, and report container
- `script.js`: sample loader, rule evaluation, and report rendering
- `rules.json`: rule-based legal/compliance issue-spotting logic
- `authority-references.json`: static authority reference library for rule-to-source mapping
- `styles.css`: professional portfolio styling

## How to Use

Open `index.html` in a browser, click **Load Transformer Export Example**, and then review the generated preliminary screening report. You can also change form inputs manually and generate a new report.

Use **View Sources / Authority Library** on the homepage to inspect all built-in references by category:

- Trade Terms & International Sale of Goods
- Sanctions & Restricted Party Screening
- Export Control
- AML / Trade-Based Money Laundering
- Technical Standards
- IP / OEM / Confidentiality
- Arbitration & Dispute Resolution
- Cross-border Data Transfer
