(function () {
  const sourceStore = () => (typeof legalSources !== "undefined" ? legalSources : window.legalSources || {});

  const LEGAL_SOURCE_RULE_MAP = [
    [/[Ii]ncoterms|[Dd]elivery/, ["INCOTERMS_2020"], "Incoterms / delivery terms"],
    [/[Gg]overning Law/, ["CISG_UNCITRAL"], "Governing law / international sale of goods"],
    [/[Dd]ispute Resolution/, ["NEW_YORK_CONVENTION"], "Dispute resolution / arbitration"],
    [/[Ss]anctions/, ["UN_CONSOLIDATED_SANCTIONS_LIST", "EU_SANCTIONS_MAP", "UK_OFSI_FINANCIAL_SANCTIONS", "OFAC_COMPLIANCE_FRAMEWORK"], "Sanctions screening"],
    [/[Ee]xport Control/, ["BIS_END_USE_END_USER_CONTROLS", "UK_ECJU_EXPORT_CONTROLS"], "Export control"],
    [/[Tt]hird-Party Payment|[Pp]ayment Risk|[Oo]pen Account|[Cc]redit Risk/, ["FATF_TBML_INDICATORS"], "AML / trade-based money laundering"],
    [/[Aa]nti-Bribery|[Bb]ribery|[Cc]ontract Clause Risk/, ["UK_BRIBERY_ACT_GUIDANCE", "FCPA_RESOURCE_GUIDE"], "Anti-bribery / intermediary risk"],
    [/[Cc]ross-Border Data|[Dd]ata Risk/, ["GDPR_SCC_EU_COMMISSION"], "Cross-border data transfer"]
  ];

  const DEFAULT_META = {
    "Incoterms / delivery terms": {
      rationale: "Delivery terms should be reviewed because they allocate delivery obligations, costs, customs responsibilities, and risk transfer.",
      limits: "Incoterms do not decide title transfer, payment obligations, governing law, dispute resolution, sanctions, or export control compliance.",
      evidence: ["Contract delivery clause", "Selected Incoterms rule", "Named place or port", "Shipping and insurance documents"],
      action: "Clarify the Incoterms rule, named place/port, insurance responsibility, customs clearance responsibility, and logistics workflow.",
      escalation: "Escalate to legal/logistics review if delivery responsibility, risk transfer, insurance, or customs clearance is unclear."
    },
    "Governing law / international sale of goods": {
      rationale: "Cross-border goods contracts may require governing law and possible CISG applicability review.",
      limits: "This demo does not determine CISG applicability automatically. It only flags when CISG analysis may be required.",
      evidence: ["Contract governing law clause", "Buyer and seller places of business", "Goods/service description", "CISG opt-in or opt-out wording if any"],
      action: "Select and document governing law, check whether CISG may apply, and align the clause with dispute resolution and enforcement planning.",
      escalation: "Escalate to legal review if the clause is missing, inconsistent, or commercially sensitive."
    },
    "Dispute resolution / arbitration": {
      rationale: "Cross-border disputes require planning for forum, procedure, language, interim relief, and enforcement.",
      limits: "This demo does not assess enforceability in a specific jurisdiction. Manual legal review is required.",
      evidence: ["Dispute resolution clause", "Arbitration seat or court jurisdiction", "Arbitral institution", "Counterparty asset locations"],
      action: "Specify forum or arbitration, seat, institution, language, interim measures, and enforcement strategy.",
      escalation: "Escalate to legal review before signing if forum, seat, institution, or enforcement path is unclear."
    },
    "Sanctions screening": {
      rationale: "Sanctions review may be required for counterparties, beneficial owners, banks, vessels, destinations, and payment channels, especially where a UN, EU, UK, U.S., USD, or restricted-region nexus may exist.",
      limits: "The demo does not query live sanctions lists. Restricted-region examples are illustrative and non-exhaustive. Manual verification against current official lists is required.",
      evidence: ["Counterparty legal name", "Beneficial owner information", "Banks and payment route", "Vessel, port, destination, and end-user information", "Current official sanctions screening records"],
      action: "Conduct and document manual sanctions screening against current official databases before signing, shipment, payment, or performance.",
      escalation: "Escalate to sanctions/compliance counsel if any name, ownership, bank, destination, vessel, or payment route raises a possible match or nexus concern."
    },
    "Export control": {
      rationale: "Dual-use goods, controlled technology, technical data, sensitive end users, and sensitive end uses may require classification and licensing review.",
      limits: "The demo does not classify products, determine ECCNs, check control lists, or determine license requirements. Manual export control review is required.",
      evidence: ["Product specifications", "HS code or classification materials", "Technology origin", "End-user and end-use statement", "Destination and onward transfer information"],
      action: "Collect product and end-use materials, classify the item, verify end user/end use, and assess license requirements before shipment or technical transfer.",
      escalation: "Escalate to export control counsel if the item, technology, destination, end user, or end use is unknown or sensitive."
    },
    "AML / trade-based money laundering": {
      rationale: "Trade-based money laundering indicators may include third-party payments, unusual payment routes, mismatched parties, vague goods descriptions, unusual pricing, and unclear source of funds.",
      limits: "Risk indicators are not conclusive proof of money laundering. They require further due diligence and manual verification.",
      evidence: ["Buyer, payer, and beneficiary relationship explanation", "Payment instruction", "Bank account ownership", "Beneficial ownership information", "Invoice and shipment documents"],
      action: "Verify payer-buyer relationship, source of funds, beneficial ownership, payment route, and document consistency before accepting payment.",
      escalation: "Escalate to compliance/finance/legal if payment parties, routes, documents, or source of funds remain unclear."
    },
    "Anti-bribery / intermediary risk": {
      rationale: "Intermediaries, unusual commissions, government customers, state-owned enterprises, gifts, hospitality, and facilitation payments may require anti-bribery due diligence.",
      limits: "The demo does not determine whether bribery occurred or whether FCPA/UK Bribery Act jurisdiction applies. Manual legal review is required.",
      evidence: ["Agent or distributor information", "Commission or success fee terms", "Government or state-owned-enterprise customer information", "Gifts, hospitality, or facilitation payment records", "Written intermediary agreement"],
      action: "Add anti-bribery undertakings, conduct third-party due diligence, review commission terms, and document approvals.",
      escalation: "Escalate to compliance/legal if an intermediary, public-sector touchpoint, unusual commission, gift, or hospitality issue appears."
    },
    "Cross-border data transfer": {
      rationale: "EU/EEA personal data transfers outside the EU/EEA and customer data sharing with overseas agents, freight forwarders, or platforms may require transfer mechanism review.",
      limits: "The demo does not determine whether SCCs or any transfer mechanism are sufficient in a specific scenario. Data protection review is required.",
      evidence: ["Categories of personal data", "Data exporter and importer", "Transfer destination", "DPA/SCC or transfer mechanism", "Security measures and privacy notice"],
      action: "Map the data flow, confirm whether personal data is involved, and review DPA/SCC, transfer mechanism, notice, and security controls.",
      escalation: "Escalate to privacy/legal review if personal data, ID/passport/payment data, or overseas processing is involved."
    }
  };

  const originalLoadRules = window.loadRules;

  window.loadRules = async function loadRulesWithLegalAuthority() {
    const loaded = await originalLoadRules();
    return normalizeRulesForAuthority(loaded);
  };

  window.normalizeRulesForAuthority = normalizeRulesForAuthority;
  window.getSourcesForRule = getSourcesForRule;
  window.formatLegalBasis = formatLegalBasis;
  window.formatAuthorityDetails = formatAuthorityDetails;

  function normalizeRulesForAuthority(ruleList) {
    return ruleList.map((rule) => {
      const categoryText = `${rule.id || ""} ${rule.category || ""} ${rule.reason || ""} ${rule.reviewPoint || ""}`;
      const mapped = LEGAL_SOURCE_RULE_MAP.find(([pattern]) => pattern.test(categoryText));
      const riskArea = rule.riskArea || mapped?.[2] || rule.category || "Practical legal review";
      const meta = DEFAULT_META[riskArea] || {};
      return {
        ...rule,
        riskArea,
        triggerCondition: rule.triggerCondition || `${rule.conditionField} ${rule.conditionOperator} ${rule.conditionValue}`,
        severity: rule.severity || rule.riskLevel,
        score: rule.score || riskScore(rule.riskLevel),
        sourceKeys: rule.sourceKeys || mapped?.[1] || [],
        legalRationale: rule.legalRationale || meta.rationale || rule.reason,
        applicabilityLimits: rule.applicabilityLimits || meta.limits || "This demo flags a potential review point only. It does not determine whether the transaction is lawful or unlawful.",
        evidenceNeeded: rule.evidenceNeeded || meta.evidence || ["Transaction documents", "Counterparty information", "Business rationale", "Relevant internal approval records"],
        recommendedAction: rule.recommendedAction || meta.action || rule.reviewPoint || "Legal/compliance review recommended before relying on this result.",
        escalation: rule.escalation || meta.escalation || "Escalate to qualified legal or compliance professionals where facts are incomplete or risk remains unclear.",
        manualVerificationRequired: rule.manualVerificationRequired !== undefined ? rule.manualVerificationRequired : true,
        reportLanguage: rule.reportLanguage || {
          en: { title: rule.category || riskArea, explanation: rule.reason, legalBasisLabel: "Legal basis", nextReviewLabel: "Recommended next review" },
          zh: { title: rule.category || riskArea, explanation: rule.reason, legalBasisLabel: "法律依据", nextReviewLabel: "建议下一步审查" }
        }
      };
    });
  }

  function getSourcesForRule(rule) {
    return (rule.sourceKeys || []).map((key) => sourceStore()[key]).filter(Boolean);
  }

  function formatLegalBasis(rule) {
    const sources = getSourcesForRule(rule);
    if (!sources.length) return "Practical legal review rationale; no specific legal source linked.";
    return sources.map((source) => `${source.title} (${source.institution})`).join("; ");
  }

  function formatAuthorityDetails(rule) {
    return getSourcesForRule(rule).map((source) => ({
      title: source.title,
      institution: source.institution,
      authorityType: source.authorityType,
      authorityLevel: source.authorityLevel,
      relevanceToDemo: source.relevanceToDemo,
      applicabilityLimits: source.applicabilityLimits,
      officialUrl: source.officialUrl
    }));
  }

  window.renderTriggeredRisks = function renderTriggeredRisksWithAuthority(triggered) {
    const container = document.getElementById("triggeredRisks");
    container.innerHTML = "";

    if (triggered.length === 0) {
      const empty = document.createElement("div");
      empty.className = "risk-card low";
      empty.innerHTML = `
        <div class="risk-card-header">
          <strong>No preset risk triggered</strong>
          <span class="risk-level low">Low</span>
        </div>
        <div class="risk-detail-grid">
          <p><span>Reason:</span> The submitted information did not trigger the current preset screening rules.</p>
          <p><span>Suggested follow-up question:</span> Are all transaction documents complete and consistent?</p>
          <p><span>Suggested legal review point:</span> Keep standard contract, compliance, payment, and shipment records for future review.</p>
        </div>
      `;
      container.appendChild(empty);
      return;
    }

    triggered.forEach((risk) => {
      const card = document.createElement("article");
      card.className = `risk-card ${risk.riskLevel.toLowerCase()}`;
      card.innerHTML = `
        <div class="risk-card-header">
          <strong>${escapeHtml(risk.category)}</strong>
          <span class="risk-level ${risk.riskLevel.toLowerCase()}">${escapeHtml(risk.riskLevel)} | Score ${risk.calculatedScore}</span>
        </div>
        <div class="risk-detail-grid">
          <p><span>Risk area:</span> ${escapeHtml(risk.riskArea)}</p>
          <p><span>Why this matters:</span> ${escapeHtml(risk.reason)}</p>
          <p><span>Recommended action:</span> ${escapeHtml(risk.recommendedAction)}</p>
          <p><span>Evidence needed:</span> ${escapeHtml((risk.evidenceNeeded || []).join("; "))}</p>
          <p><span>Manual verification:</span> ${risk.manualVerificationRequired ? "Required" : "Not flagged by this rule"}</p>
        </div>
        <details class="legal-basis-details">
          <summary>Legal basis and applicability limits</summary>
          ${renderLegalBasisHtml(risk)}
        </details>
      `;
      container.appendChild(card);
    });
  };

  function renderLegalBasisHtml(rule) {
    const sources = getSourcesForRule(rule);
    const sourceHtml = sources.length ? sources.map((source) => `
      <li>
        <a href="${escapeHtml(source.officialUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.institution)} - ${escapeHtml(source.title)}</a>
        <span>Authority type: ${escapeHtml(source.authorityType)}</span>
        <span>Relevance: ${escapeHtml(source.relevanceToDemo)}</span>
        <span>Limitation: ${escapeHtml(source.applicabilityLimits)}</span>
      </li>
    `).join("") : `<li>Practical legal review rationale; no specific legal source linked.</li>`;
    return `
      <div class="legal-basis-copy">
        <p><strong>Legal rationale:</strong> ${escapeHtml(rule.legalRationale)}</p>
        <p><strong>Applicability limits:</strong> ${escapeHtml(rule.applicabilityLimits)}</p>
        <ul>${sourceHtml}</ul>
        <p><strong>Escalation:</strong> ${escapeHtml(rule.escalation)}</p>
      </div>
    `;
  }

  window.buildBusinessChecklist = function buildBusinessChecklistWithEvidence(triggered) {
    const base = [
      "Have the identities and signing authority of the buyer, seller, payer, beneficial owners, and relevant payment parties been verified?",
      "Are the contract draft, purchase order, invoice, shipping documents, and payment records complete and consistent?",
      "Does the transaction require internal commercial, finance, compliance, or legal approval before execution?"
    ];
    return unique([...triggered.map((risk) => risk.followUpQuestion), ...triggered.flatMap((risk) => risk.evidenceNeeded || []), ...base]).slice(0, 14);
  };

  window.buildLegalReviewPoints = function buildLegalReviewPointsWithAuthority(triggered) {
    const base = [
      "Review whether contract terms match the actual transaction structure, payment flow, delivery process, and compliance obligations.",
      "Confirm that this rule-based result is reviewed by qualified legal professionals before being relied upon.",
      "Manual verification against current official lists/databases is required for sanctions, export control, AML, ownership, and data-transfer issues."
    ];
    return unique([...triggered.map((risk) => risk.recommendedAction || risk.reviewPoint), ...triggered.map((risk) => risk.escalation), ...base]).slice(0, 14);
  };

  const originalBuildChineseReport = window.buildChineseReport;
  const originalBuildEnglishSummary = window.buildEnglishSummary;

  window.buildChineseReport = function buildChineseReportWithAuthority(formData, triggered, totalScore, overall, checklist, legalPoints) {
    const base = originalBuildChineseReport(formData, triggered, totalScore, overall, checklist, legalPoints);
    const marker = "\n\n六、免责声明";
    const authoritySection = [
      "",
      "四、法律依据与审查逻辑",
      ...buildChineseAuthorityReportLines(triggered),
      ""
    ].join("\n");
    return base.replace("\n\n四、业务追问清单", `${authoritySection}\n五、业务追问清单`)
      .replace("\n\n五、建议法务重点审查内容", "\n\n六、建议法务重点审查内容")
      .replace(marker, "\n\n七、免责声明")
      .replace("本工具仅用于交易前期法律与合规风险初筛，不构成正式法律意见。具体交易安排、合同条款及合规判断应由专业法律人员结合完整事实和适用法律进一步审查。", "本 Demo 是一个规则驱动的法律风险初筛原型，不提供法律意见，不判断交易是否合法，也不能替代具备资质的律师或合规人员审查。对于制裁、出口管制、反洗钱、公司受益所有权和数据跨境问题，必须基于最新官方数据库和适用地法律进行人工核查。");
  };

  window.buildEnglishSummary = function buildEnglishSummaryWithAuthority(formData, triggered, totalScore, overall, checklist, legalPoints) {
    const base = originalBuildEnglishSummary(formData, triggered, totalScore, overall, checklist, legalPoints);
    const authoritySection = [
      "",
      "4. Legal Basis and Review Rationale",
      ...buildEnglishAuthorityReportLines(triggered),
      ""
    ].join("\n");
    return base.replace("\n\n4. Follow-up Questions", `${authoritySection}\n5. Follow-up Questions`)
      .replace("\n\n5. Suggested Legal Review Points", "\n\n6. Suggested Legal Review Points")
      .replace("\n\n6. Disclaimer", "\n\n7. Disclaimer")
      .replace("This tool is for preliminary legal and compliance risk screening at the early stage of a transaction and does not constitute formal legal advice. The specific transaction structure, contract terms, and compliance assessment should be further reviewed by qualified legal professionals based on complete facts and applicable law.", "This demo is a rule-based legal risk triage prototype. It does not provide legal advice, does not determine whether a transaction is lawful or unlawful, and does not replace review by qualified legal or compliance professionals. For sanctions, export control, AML, company ownership, and data-transfer issues, manual verification against current official databases and applicable local law is required.");
  };

  function buildEnglishAuthorityReportLines(triggered) {
    if (!triggered.length) return ["No specific linked authority was triggered by the preset rules."];
    return triggered.flatMap((risk, index) => [
      `${index + 1}. Issue: ${risk.category}`,
      `   Linked authority: ${formatLegalBasis(risk)}`,
      `   Why it matters: ${risk.legalRationale}`,
      `   Applicability limits: ${risk.applicabilityLimits}`,
      `   Evidence needed: ${(risk.evidenceNeeded || []).join("; ")}`,
      `   Recommended next review: ${risk.recommendedAction}`,
      `   Manual verification required: ${risk.manualVerificationRequired ? "Yes" : "No specific manual verification flag"}`
    ]);
  }

  function buildChineseAuthorityReportLines(triggered) {
    if (!triggered.length) return ["当前预设规则未触发特定法律依据链接。"];
    return triggered.flatMap((risk, index) => [
      `${index + 1}. 风险事项：${risk.category}`,
      `   对应权威依据：${formatLegalBasis(risk)}`,
      `   为什么重要：${risk.legalRationale}`,
      `   适用边界：${risk.applicabilityLimits}`,
      `   需要补充核查的材料：${(risk.evidenceNeeded || []).join("；")}`,
      `   建议下一步审查：${risk.recommendedAction}`,
      `   是否需要人工核查：${risk.manualVerificationRequired ? "是" : "当前规则未特别标记"}`
    ]);
  }

  document.addEventListener("DOMContentLoaded", renderAuthorityMatrix);

  function renderAuthorityMatrix() {
    const container = document.getElementById("authorityMatrixBody");
    if (!container) return;
    container.innerHTML = Object.entries(sourceStore()).map(([key, source]) => `
      <tr>
        <td>${escapeHtml(source.jurisdictionOrScope)}</td>
        <td><a href="${escapeHtml(source.officialUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)}</a><br><span>${escapeHtml(source.institution)}</span><br><code>${escapeHtml(key)}</code></td>
        <td>${escapeHtml(source.authorityType)}<br><span>${escapeHtml(source.authorityLevel)}</span></td>
        <td>${escapeHtml(source.relevanceToDemo)}</td>
        <td>${escapeHtml(source.applicabilityLimits)}</td>
      </tr>
    `).join("");
  }

  function riskScore(level) {
    return { Low: 1, Medium: 2, High: 3 }[level] || 0;
  }
})();
